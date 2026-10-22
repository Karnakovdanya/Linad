// Isolated PostgreSQL/WASM verification; never connects to the hosted Supabase project.
// npm.cmd install --prefix qa/profile-update/sql-runtime --no-save --package-lock=false --ignore-scripts @electric-sql/pglite@0.5.11
import { PGlite } from './sql-runtime/node_modules/@electric-sql/pglite/dist/index.js';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
const results = [];
const a = '11111111-1111-4111-8111-111111111111';
const b = '22222222-2222-4222-8222-222222222222';
async function denied(sql, params, code) {
  await assert.rejects(() => db.query(sql, params), error => error.code === code);
}
try {
  // Minimal Supabase-owned schemas. Storage HTTP MIME/size checks are tested in the browser, not emulated here.
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public, auth, storage to authenticated,anon;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(bucket_id text,name text,primary key(bucket_id,name));
    alter table storage.objects enable row level security;
    grant select,insert,update,delete on storage.objects to authenticated;
    create function storage.foldername(name text) returns text[] language sql immutable as
      $$ select (string_to_array(name,'/'))[1:cardinality(string_to_array(name,'/'))-1] $$;
    insert into auth.users values
      ('${a}','{"full_name":"Legacy name"}'),
      ('${b}','{"full_name":"Test Name","first_name":"Test","last_name":"Name"}');
  `);
  const migrations = ['202610200001_linad_accounts.sql', '202610210001_profile_details.sql'];
  for (let pass = 0; pass < 2; pass++) for (const migration of migrations) await db.exec(readFileSync('supabase/migrations/' + migration, 'utf8'));
  results.push('Both migrations execute and can be reapplied without deleting records');
  const names = (await db.query('select first_name,last_name from public.profiles order by user_id')).rows;
  assert.deepEqual(names, [{ first_name: 'Legacy name', last_name: '' }, { first_name: 'Test', last_name: 'Name' }]);
  await db.exec(`insert into auth.users values ('33333333-3333-4333-8333-333333333333','{"first_name":"New","last_name":"Learner"}')`);
  assert.equal((await db.query("select display_name from public.profiles where first_name='New'")).rows[0].display_name, 'New Learner');
  results.push('Legacy names and new-user first/last-name trigger');
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${a}'`);
  assert.equal((await db.query('select count(*)::int as n from public.profiles')).rows[0].n, 1);
  await db.query("update public.profiles set study_languages='[{\"language\":\"en\",\"level\":\"C1\"}]', avatar_path=$1 where user_id=$2", [`${a}/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.png`, a]);
  await denied("update public.profiles set study_languages='[{\"language\":\"en\",\"level\":\"C7\"}]'", [], '23514');
  await denied("update public.profiles set study_languages='[{\"language\":\"en\"},{\"language\":\"en\"}]'", [], '23514');
  await denied('update public.profiles set avatar_path=$1', [`${b}/aaaaaaaa.png`], '23514');
  assert.equal((await db.query('update public.profiles set first_name=$1 where user_id=$2 returning user_id', ['Intruder', b])).rows.length, 0);
  const document = { version: 1, levels: { lessons: { 'de:lesson': { visited: [0], attempts: [{ score: 1, total: 1, completedAt: '2026-10-21T10:00:00Z' }] } }, moduleAttempts: {}, assessmentHistory: [], runs: {} }, practice: { visibleLanguages: ['ru'] }, collection: { words: { word: { text: { ru: 'голова', de: 'der Kopf', en: 'head' }, deletedAt: null, updatedAt: '2026-10-21T10:00:00Z' } }, favorites: { 'daniil-karnakov': { deletedAt: null, updatedAt: '2026-10-21T10:00:00Z' } } } };
  const modules = { 'de:A1:introductions': { percent: 0, completed: false } };
  assert.equal((await db.query('select public.linad_commit_account($1,$2,$3) as revision', [0, document, modules])).rows[0].revision, 1);
  assert.equal((await db.query('select count(*)::int as n from public.test_results')).rows[0].n, 1);
  await denied('select public.linad_commit_account($1,$2,$3)', [0, document, modules], 'PT409');
  assert.equal((await db.query('select public.linad_commit_account($1,$2,$3) as revision', [1, document, modules])).rows[0].revision, 2);
  assert.equal((await db.query('select count(*)::int as n from public.test_results')).rows[0].n, 1);
  await db.query('insert into storage.objects values($1,$2)', ['linad-avatars', `${a}/photo.png`]);
  await denied('insert into storage.objects values($1,$2)', ['linad-avatars', `${b}/photo.png`], '42501');
  results.push('Owner-only profile updates, validation, CAS revisions, idempotent test history and avatar ownership');
  await db.exec(`set request.jwt.claim.sub='${b}'`);
  for (const table of ['account_state', 'lesson_progress', 'module_progress', 'test_results', 'saved_words', 'favorite_tutors']) {
    assert.equal((await db.query(`select count(*)::int as n from public.${table}`)).rows[0].n, 0);
  }
  for (const sql of [
    'insert into public.account_state(user_id) values($1)',
    "insert into public.lesson_progress(user_id,lesson_id,language,data) values($1,'forged','de','{}')",
    "insert into public.module_progress(user_id,module_id,language,data) values($1,'forged','de','{}')",
    "insert into public.test_results(user_id,result_id,language,kind,data) values($1,'forged','de','mini-test','{}')",
    "insert into public.saved_words(user_id,word_id,data) values($1,'forged','{}')",
    "insert into public.favorite_tutors(user_id,tutor_id) values($1,'forged')",
  ]) await denied(sql, [a], '42501');
  assert.equal((await db.query('select count(*)::int as n from storage.objects')).rows[0].n, 0);
  assert.equal((await db.query('delete from storage.objects where bucket_id=$1 returning name', ['linad-avatars'])).rows.length, 0);
  assert.equal((await db.query('select first_name from public.profiles')).rows[0].first_name, 'Test');
  await db.exec('reset role; set role anon');
  await denied('select * from public.account_state', [], '42501');
  await denied('select public.linad_commit_account($1,$2,$3)', [0, document, modules], '42501');
  results.push('Second-account isolation across all user tables and Storage; anonymous RPC/table access denied');
  writeFileSync('qa/profile-update/sql-verification.json', JSON.stringify({ engine: 'PGlite 0.5.11 / PostgreSQL, Supabase-owned schema scaffolding', hostedSupabase: false, passed: results }, null, 2));
  console.log(JSON.stringify({ passed: results }, null, 2));
} finally { await db.close(); }
