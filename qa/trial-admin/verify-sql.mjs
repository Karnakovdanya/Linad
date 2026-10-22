// Isolated in-memory PostgreSQL. No network, Supabase credentials or production connection.
// Install @electric-sql/pglite OUTSIDE the project; point LINAD_PGLITE_MODULE to dist/index.js.
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const modulePath = process.env.LINAD_PGLITE_MODULE || path.join(tmpdir(),'linad-sql-verification-20261021','node_modules','@electric-sql','pglite','dist','index.js');
const { PGlite } = await import(pathToFileURL(modulePath).href);
const db = await PGlite.create(); const checks = []; let stage = 'bootstrap';
const owner='11111111-1111-4111-8111-111111111111', regular='22222222-2222-4222-8222-222222222222';
const read = file => fs.readFileSync(file,'utf8');
async function check(name, run) { stage=name; await run(); checks.push(name); }
async function value(sql,params=[]) { return (await db.query(sql,params)).rows[0]?.value; }
async function as(role,id,run) {
  assert(['anon','authenticated'].includes(role)); await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id || '']);
  try { return await run(); } finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
}
async function denied(sql,params=[]) { await assert.rejects(db.query(sql,params),error=>error.code==='42501'); }
try {
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth; grant usage on schema auth to anon,authenticated;
    create table auth.users(id uuid primary key,email text,created_at timestamptz default now(),email_confirmed_at timestamptz,deleted_at timestamptz,raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create schema storage;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(name text,bucket_id text);
    create function storage.foldername(text) returns text[] language sql immutable as $$select string_to_array($1,'/')$$;
  `);
  await check('existing account/profile installer runs on baseline schema',()=>db.exec(read('supabase/INSTALL_LINAD_ACCOUNTS.sql')));
  await check('read-only schema preflight runs before admin installation',()=>db.exec(read('supabase/CHECK_TRIAL_ADMIN.sql')));
  await check('new migration executes without syntax/type errors',()=>db.exec(read('supabase/migrations/202610210003_trial_admin.sql')));
  await db.query(`insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data,created_at) values
    ($1,'owner@example.test',now(),'{"full_name":"Owner Test"}',now()-interval '2 days'),
    ($2,'learner@example.test',now(),'{"full_name":"Learner Test","admin":true}',now())`,[owner,regular]);
  await check('migration grants no administrator by default',async()=>assert.equal(await value('select count(*)::int as value from linad_private.admin_members'),0));
  await check('anonymous RPC and account data reads are rejected',()=>as('anon',null,async()=>{
    await denied('select public.linad_is_admin()');await denied('select public.linad_admin_dashboard()');await denied('select public.linad_admin_user($1)',[owner]);await denied('select * from public.profiles');
  }));
  await check('ordinary user cannot read dashboard/detail, read/write roles or spoof admin with metadata',()=>as('authenticated',regular,async()=>{
    assert.equal(await value('select public.linad_is_admin() as value'),false);await denied('select public.linad_admin_dashboard()');await denied('select public.linad_admin_user($1)',[owner]);
    await denied('select * from linad_private.admin_members');await denied('insert into linad_private.admin_members(user_id) values($1)',[regular]);
  }));
  await check('ordinary profile/account reads and writes are scoped by RLS',()=>as('authenticated',regular,async()=>{
    assert.equal(await value('select count(*)::int as value from public.profiles where user_id<>auth.uid()'),0);
    assert.equal((await db.query("update public.profiles set display_name='tampered' where user_id=$1 returning user_id",[owner])).rows.length,0);
    await denied("insert into public.account_state(user_id) values($1)",[owner]);
  }));
  await check('separate reviewed owner assignment works and is idempotent',async()=>{
    const grant=read('supabase/GRANT_LINAD_OWNER.sql').replace('OWNER_UUID_FROM_AUTH_USERS',owner);await db.exec(grant);await db.exec(grant);
    assert.equal(await value('select count(*)::int as value from linad_private.admin_members'),1);
  });
  await check('owner sees genuine registration counts and missing analytics remains null',()=>as('authenticated',owner,async()=>{
    const data=await value('select public.linad_admin_dashboard() as value');assert.equal(data.total,2);assert.equal(data.today,1);assert.equal(data.registrations_7d,2);assert.equal(data.active_7d,null);assert.equal(data.active_30d,null);
    assert.equal(data.users.find(user=>user.user_id===regular).lessons_completed,null);
    assert.equal('raw_user_meta_data' in data.users[0],false);assert.equal('encrypted_password' in data.users[0],false);
  }));
  const document={version:1,levels:{lessons:{'de:first-introductions':{visited:[0,1],attempts:[{score:5,total:5,completedAt:new Date().toISOString(),answers:{test:'answer'}}]}},moduleAttempts:{},assessmentHistory:[],runs:{}},practice:{},collection:{words:{},favorites:{}}};
  await check('existing own-account CAS commit remains functional',()=>as('authenticated',regular,async()=>{
    const modules={'de:A1:introductions':{completedLessons:5,completed:true,percent:100}};
    assert.equal(await value('select public.linad_commit_account(0,$1::jsonb,$2::jsonb) as value',[JSON.stringify(document),JSON.stringify(modules)]),1);
    await assert.rejects(db.query('select public.linad_commit_account(0,$1::jsonb,$2::jsonb)',[JSON.stringify(document),JSON.stringify(modules)]),error=>error.code==='PT409');
    assert.equal(await value('select count(*)::int as value from public.account_state where user_id<>auth.uid()'),0);
  }));
  await db.query("update public.profiles set study_languages='[{\"language\":\"de\",\"level\":\"A2\"}]'::jsonb where user_id=$1",[regular]);
  await check('owner filters and minimized progress detail query the actual synced rows',()=>as('authenticated',owner,async()=>{
    const data=await value("select public.linad_admin_dashboard('learner','de','A2',true,0) as value");assert.equal(data.filtered_total,1);assert.equal(data.users[0].lessons_completed,5);assert.equal(data.users[0].modules_completed,1);assert.equal(data.courses[0].learners,1);
    const detail=await value('select public.linad_admin_user($1) as value',[regular]);assert.equal(detail.modules[0].percent,100);assert.equal(detail.lessons[0].score,5);assert.equal('answers' in detail.lessons[0],false);
    const literal=await value("select public.linad_admin_dashboard($1) as value",["' OR true --"]);assert.equal(literal.filtered_total,0);
    await assert.rejects(db.query("select public.linad_admin_dashboard('',null,null,null,-1)"),error=>error.code==='22023');
  }));
  await check('explicitly cleared profile languages override legacy metadata; legacy progress stays unknown',async()=>{
    await db.query("update auth.users set raw_user_meta_data=jsonb_set(raw_user_meta_data,'{linad_profile}','{\"profile\":{\"study_languages\":[{\"language\":\"en\",\"level\":\"B2\"}]}}') where id=$1",[owner]);
    await db.query("update public.profiles set study_languages='[]',profile_saved_at=now() where user_id=$1",[owner]);
    await db.query("insert into public.module_progress(user_id,module_id,language,data) values($1,'en:A1:introductions','en','[]')",[owner]);
    await as('authenticated',owner,async()=>{const data=await value('select public.linad_admin_user($1) as value',[owner]);assert.deepEqual(data.user.study_languages,[]);assert.equal(data.user.lessons_completed,null);assert.equal(data.modules[0].completed_lessons,null);});
  });
  await check('daily activity uses own server identity/time, deduplicates and hides raw events',()=>as('authenticated',regular,async()=>{
    await db.query("select public.linad_record_learning_activity('lesson','de')");await db.query("select public.linad_record_learning_activity('practice','de')");
    await denied('select * from linad_private.learning_days');
    await assert.rejects(db.query("select public.linad_record_learning_activity('arbitrary','de')"),error=>error.code==='22023');
  }));
  assert.equal(await value('select count(*)::int as value from linad_private.learning_days'),1);
  assert.equal(await value("select bool_and(user_id=$1 and activity_date=(now() at time zone 'UTC')::date) as value from linad_private.learning_days",[regular]),true);
  await db.exec("update linad_private.analytics_settings set started_at=now()-interval '40 days'");
  await check('full observation periods produce observed active counts',()=>as('authenticated',owner,async()=>{
    const data=await value('select public.linad_admin_dashboard() as value');assert.equal(data.active_7d,1);assert.equal(data.active_30d,1);
  }));
  await check('server pagination is bounded to 25 with stable second page',async()=>{
    for(let i=0;i<26;i++)await db.query("insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values($1,$2,now(),'{\"full_name\":\"Pagination\"}')",[`33333333-3333-4333-8333-${String(i).padStart(12,'0')}`,`page${i}@example.test`]);
    await as('authenticated',owner,async()=>{const first=await value("select public.linad_admin_dashboard('Pagination') as value");const second=await value("select public.linad_admin_dashboard('Pagination',null,null,null,25) as value");assert.equal(first.users.length,25);assert.equal(second.users.length,1);assert.equal(first.users.some(user=>user.user_id===second.users[0].user_id),false);});
  });
  await check('rerunning migration preserves roles, progress, activity and coverage',async()=>{
    const since=await value('select started_at::text as value from linad_private.analytics_settings');await db.exec(read('supabase/migrations/202610210003_trial_admin.sql'));assert.equal(await value('select started_at::text as value from linad_private.analytics_settings'),since);assert.equal(await value('select count(*)::int as value from linad_private.admin_members'),1);assert.equal(await value('select count(*)::int as value from linad_private.learning_days'),1);assert.equal(await value('select revision::int as value from public.account_state where user_id=$1',[regular]),1);
  });
  await check('shipped read-only verification script completes',()=>db.exec(read('supabase/VERIFY_TRIAL_ADMIN.sql')));
  await check('revoking owner membership immediately denies data RPCs',async()=>{
    await db.query('delete from linad_private.admin_members where user_id=$1',[owner]);await as('authenticated',owner,async()=>{assert.equal(await value('select public.linad_is_admin() as value'),false);await denied('select public.linad_admin_dashboard()');await denied('select public.linad_admin_user($1)',[regular]);});
  });
  const report={engine:await value('select version() as value'),scope:'in-memory PostgreSQL with simulated Supabase Auth/Storage baseline, no production connection',passed:checks.length,checks};
  fs.writeFileSync('qa/trial-admin/sql-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
} catch(error) { console.error(JSON.stringify({stage,code:error.code,message:error.message}));process.exitCode=1; }
finally { await db.close(); }
