// Local PostgreSQL checks only; does not connect to hosted Supabase.
import { PGlite } from '../profile-update/sql-runtime/node_modules/@electric-sql/pglite/dist/index.js';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
const a = '11111111-1111-4111-8111-111111111111', b = '22222222-2222-4222-8222-222222222222';
try {
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth; create schema storage;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth,storage to authenticated,anon;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(bucket_id text,name text,primary key(bucket_id,name));
    alter table storage.objects enable row level security;
    grant select,insert,update,delete on storage.objects to authenticated,anon;
    create function storage.foldername(name text) returns text[] language sql immutable as
      $$ select (string_to_array(name,'/'))[1:cardinality(string_to_array(name,'/'))-1] $$;
  `);
  const sql = readFileSync('supabase/INSTALL_LINAD_AVATARS.sql', 'utf8');
  await db.exec(sql); await db.exec(sql);
  const bucket = (await db.query("select * from storage.buckets where id='linad-avatars'")).rows[0];
  assert.equal(bucket.public, false); assert.equal(bucket.file_size_limit, 3145728);
  assert.deepEqual(bucket.allowed_mime_types, ['image/jpeg','image/png','image/webp']);
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${a}'`);
  await db.query('insert into storage.objects values($1,$2)', ['linad-avatars', `${a}/photo.png`]);
  await assert.rejects(() => db.query('insert into storage.objects values($1,$2)', ['linad-avatars', `${b}/forged.png`]), error => error.code === '42501');
  await assert.rejects(() => db.query('insert into storage.objects values($1,$2)', ['other-bucket', `${a}/photo.png`]), error => error.code === '42501');
  assert.equal((await db.query('select * from storage.objects')).rows.length, 1);
  await db.exec(`set request.jwt.claim.sub='${b}'`);
  assert.equal((await db.query('select * from storage.objects')).rows.length, 0);
  assert.equal((await db.query('delete from storage.objects returning *')).rows.length, 0);
  await db.exec(`reset role; set role anon`);
  assert.equal((await db.query('select * from storage.objects')).rows.length, 0);
  await assert.rejects(() => db.query('insert into storage.objects values($1,$2)', ['linad-avatars', `${a}/anon.png`]), error => error.code === '42501');
  await db.exec(`reset role; set role authenticated; set request.jwt.claim.sub='${a}'`);
  assert.equal((await db.query('delete from storage.objects returning *')).rows.length, 1);
  const result = { hostedSupabase: false, passed: ['SQL can be applied twice', 'Private bucket, 3 MB, JPEG/PNG/WebP limits', 'Owner upload/read/delete', 'Cross-account access and other bucket writes rejected', 'Anonymous reads/writes rejected'] };
  writeFileSync('qa/profile-photo/storage-verification.json', JSON.stringify(result, null, 2)); console.log(result);
} finally { await db.close(); }
