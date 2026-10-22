-- Apply once in the SQL Editor of the supplied Supabase project.
begin;
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
commit;
