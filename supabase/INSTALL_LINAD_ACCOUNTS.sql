-- LINAD: complete, idempotent account setup. Run this entire file in Supabase SQL Editor.
-- Generated from the three versioned migrations; user records are retained.
begin;

-- 202610200001_linad_accounts.sql
-- Apply once in the SQL Editor of the supplied Supabase project.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (length(display_name) <= 100),
  ui_language text check (ui_language in ('ru','de','en')),
  theme text check (theme in ('light','dark')),
  updated_at timestamptz not null default now()
);
create table if not exists public.account_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null, language text not null check (language in ('de','en')),
  data jsonb not null, updated_at timestamptz not null default now(), primary key(user_id, lesson_id)
);
create table if not exists public.module_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null, language text not null check (language in ('de','en')),
  data jsonb not null, updated_at timestamptz not null default now(), primary key(user_id, module_id)
);
create table if not exists public.test_results (
  user_id uuid not null references auth.users(id) on delete cascade,
  result_id text not null, language text not null check (language in ('de','en')),
  kind text not null check (kind in ('placement','mini-test','module-test')),
  data jsonb not null, updated_at timestamptz not null default now(), primary key(user_id, result_id)
);
create table if not exists public.saved_words (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null, data jsonb not null,
  deleted_at timestamptz, updated_at timestamptz not null default now(), primary key(user_id, word_id)
);
create table if not exists public.favorite_tutors (
  user_id uuid not null references auth.users(id) on delete cascade,
  tutor_id text not null, deleted_at timestamptz,
  updated_at timestamptz not null default now(), primary key(user_id, tutor_id)
);

-- Every table, including the full sync document, is protected on the server.
do $$
declare t text;
begin
  foreach t in array array['profiles','account_state','lesson_progress','module_progress','test_results','saved_words','favorite_tutors'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists own_records on public.%I', t);
    execute format('create policy own_records on public.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
  end loop;
end $$;

create or replace function public.linad_new_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(user_id, display_name)
  values(new.id, left(coalesce(new.raw_user_meta_data->>'full_name', ''),100)) on conflict do nothing;
  return new;
end $$;
revoke all on function public.linad_new_profile() from public, anon, authenticated;
drop trigger if exists linad_profile_created on auth.users;
create trigger linad_profile_created after insert on auth.users for each row execute function public.linad_new_profile();
insert into public.profiles(user_id,display_name)
select id,left(coalesce(raw_user_meta_data->>'full_name',''),100) from auth.users on conflict do nothing;

-- Compare-and-swap prevents silent overwrites between devices. RLS remains active
-- inside this SECURITY INVOKER function; no owner ID is accepted from the browser.
create or replace function public.linad_commit_account(p_expected_revision bigint, p_document jsonb, p_modules jsonb default '{}'::jsonb)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare uid uuid := auth.uid(); rev bigint; item record; attempt jsonb; word jsonb;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_document->>'version' is distinct from '1'
     or jsonb_typeof(p_document->'levels') is distinct from 'object'
     or jsonb_typeof(p_document->'practice') is distinct from 'object'
     or jsonb_typeof(p_document->'collection') is distinct from 'object'
     or octet_length(p_document::text) > 10000000 then
    raise exception 'Invalid account document' using errcode='22023';
  end if;
  insert into public.account_state(user_id) values(uid) on conflict do nothing;
  select revision into rev from public.account_state where user_id=uid for update;
  if rev <> p_expected_revision then raise exception 'Account changed; merge and retry' using errcode='PT409'; end if;
  update public.account_state set data=p_document,revision=rev+1,updated_at=now() where user_id=uid;
  for item in select * from jsonb_each(coalesce(p_document#>'{levels,lessons}','{}')) loop
    insert into public.lesson_progress(user_id,lesson_id,language,data) values(uid,item.key,split_part(item.key,':',1),item.value)
    on conflict(user_id,lesson_id) do update set data=excluded.data,updated_at=now();
    for attempt in select * from jsonb_array_elements(coalesce(item.value->'attempts','[]')) loop
      insert into public.test_results(user_id,result_id,language,kind,data)
      values(uid,'mini:'||item.key||':'||md5(attempt::text),split_part(item.key,':',1),'mini-test',attempt) on conflict do nothing;
    end loop;
  end loop;
  for item in select * from jsonb_each(coalesce(p_document#>'{levels,moduleAttempts}','{}')) loop
    insert into public.module_progress(user_id,module_id,language,data) values(uid,item.key,split_part(item.key,':',1),item.value)
    on conflict(user_id,module_id) do update set data=excluded.data,updated_at=now();
    for attempt in select * from jsonb_array_elements(item.value) loop
      insert into public.test_results(user_id,result_id,language,kind,data)
      values(uid,'module:'||(attempt->>'id'),split_part(item.key,':',1),'module-test',attempt) on conflict do nothing;
    end loop;
  end loop;
  for attempt in select * from jsonb_array_elements(coalesce(p_document#>'{levels,assessmentHistory}','[]')) loop
    insert into public.test_results(user_id,result_id,language,kind,data)
    values(uid,'placement:'||(attempt->>'id'),attempt->>'language','placement',attempt) on conflict do nothing;
  end loop;
  for item in select * from jsonb_each(coalesce(p_document#>'{levels,runs}','{}')) loop
    if item.value->>'completed' = 'true' then
      insert into public.test_results(user_id,result_id,language,kind,data)
      values(uid,'placement:'||(item.value->>'id'),item.key,'placement',item.value) on conflict do nothing;
    end if;
  end loop;
  for item in select * from jsonb_each(coalesce(p_document#>'{collection,words}','{}')) loop
    word := item.value;
    insert into public.saved_words(user_id,word_id,data,deleted_at,updated_at)
    values(uid,item.key,word,(word->>'deletedAt')::timestamptz,(word->>'updatedAt')::timestamptz)
    on conflict(user_id,word_id) do update set data=excluded.data,deleted_at=excluded.deleted_at,updated_at=excluded.updated_at;
  end loop;
  for item in select * from jsonb_each(coalesce(p_document#>'{collection,favorites}','{}')) loop
    insert into public.favorite_tutors(user_id,tutor_id,deleted_at,updated_at)
    values(uid,item.key,(item.value->>'deletedAt')::timestamptz,(item.value->>'updatedAt')::timestamptz)
    on conflict(user_id,tutor_id) do update set deleted_at=excluded.deleted_at,updated_at=excluded.updated_at;
  end loop;
  for item in select * from jsonb_each(p_modules) loop
    insert into public.module_progress(user_id,module_id,language,data)
    values(uid,item.key,split_part(item.key,':',1),item.value)
    on conflict(user_id,module_id) do update set data=excluded.data,updated_at=now();
  end loop;
  return rev+1;
end $$;
revoke all on function public.linad_commit_account(bigint,jsonb,jsonb) from public, anon;
grant execute on function public.linad_commit_account(bigint,jsonb,jsonb) to authenticated;



-- 202610210001_profile_details.sql
-- Run AFTER 202610200001_linad_accounts.sql. Safe to rerun; no user records are removed.

alter table public.profiles add column if not exists first_name text not null default '';
alter table public.profiles add column if not exists last_name text not null default '';
alter table public.profiles add column if not exists avatar_path text;
alter table public.profiles add column if not exists study_languages jsonb not null default '[]'::jsonb;
alter table public.profiles drop constraint if exists profiles_display_name_check;
alter table public.profiles add constraint profiles_display_name_check check (length(display_name) <= 201);

create or replace function public.linad_valid_study_languages(value jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare item jsonb; seen text[] := '{}'; lang text;
begin
  if jsonb_typeof(value) is distinct from 'array' then return false; end if;
  if jsonb_array_length(value) > 2 then return false; end if;
  for item in select * from jsonb_array_elements(value) loop
    if jsonb_typeof(item) is distinct from 'object' then return false; end if;
    lang := item->>'language';
    if lang is null or lang not in ('de','en') or lang = any(seen) then return false; end if;
    if item->>'level' is not null and item->>'level' not in ('A1','A2','B1','B2','C1') then return false; end if;
    seen := array_append(seen, lang);
  end loop;
  return true;
end $$;
revoke all on function public.linad_valid_study_languages(jsonb) from public, anon;
grant execute on function public.linad_valid_study_languages(jsonb) to authenticated;
alter table public.profiles drop constraint if exists linad_profile_details;
alter table public.profiles add constraint linad_profile_details check (
  length(first_name) <= 100 and length(last_name) <= 100
  and public.linad_valid_study_languages(study_languages)
  and (avatar_path is null or (
    split_part(avatar_path, '/', 1) = user_id::text
    and avatar_path ~ '^[0-9a-f-]+/[0-9a-f-]+\.(jpg|png|webp)$'
  ))
);

-- Preserve old unsplit names. No guessed surnames or course-derived proficiency.
update public.profiles p set
  first_name = left(coalesce(nullif(u.raw_user_meta_data->>'first_name',''), p.display_name, ''),100),
  last_name = left(coalesce(u.raw_user_meta_data->>'last_name',''),100)
from auth.users u where p.user_id = u.id and p.first_name = '';

create or replace function public.linad_new_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
declare first text := left(coalesce(new.raw_user_meta_data->>'first_name',new.raw_user_meta_data->>'full_name',''),100);
last text := left(coalesce(new.raw_user_meta_data->>'last_name',''),100);
begin
  insert into public.profiles(user_id,display_name,first_name,last_name)
  values(new.id,trim(first || ' ' || last),first,last) on conflict do nothing;
  return new;
end $$;
revoke all on function public.linad_new_profile() from public, anon, authenticated;

-- Private bucket: originals and signed URL creation require the owner's JWT.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('linad-avatars','linad-avatars',false,3145728,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists linad_avatar_owner on storage.objects;
create policy linad_avatar_owner on storage.objects for all to authenticated
using (bucket_id = 'linad-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'linad-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

notify pgrst, 'reload schema';



-- 202610210002_profile_goals.sql
-- Personal preferences only. Course levels and results are never updated here.

alter table public.profiles add column if not exists study_goal jsonb;
-- Unlike a row's creation timestamp, this marks an intentional profile save.
-- It prevents a newly installed empty SQL row from overwriting Auth preferences.
alter table public.profiles add column if not exists profile_saved_at timestamptz;
alter table public.profiles drop constraint if exists linad_profile_goal;
alter table public.profiles add constraint linad_profile_goal check (
  study_goal is null or (
    jsonb_typeof(study_goal) = 'object'
    and study_goal->>'language' is not null and study_goal->>'language' in ('de','en')
    and study_goal->>'level' is not null and study_goal->>'level' in ('A1','A2','B1','B2','C1')
  )
);
notify pgrst, 'reload schema';


commit;
