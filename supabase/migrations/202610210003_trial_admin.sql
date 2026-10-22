-- LINAD: read-only owner dashboard and future authenticated learning activity.
-- MANUAL installation only. Requires the three earlier account/profile migrations.
-- No accounts, progress, or historical events are deleted or backfilled.
begin;
do $$ begin
  if to_regclass('public.account_state') is null or to_regclass('public.module_progress') is null
     or to_regclass('public.lesson_progress') is null or to_regclass('public.profiles') is null
     or not exists(select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='study_languages')
     or not exists(select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='profile_saved_at') then
    raise exception 'Install/review existing LINAD account and profile migrations first';
  end if;
end $$;

-- Not an exposed API schema. There are deliberately no client table grants/policies.
create schema if not exists linad_private;
revoke all on schema linad_private from public, anon, authenticated;
create table if not exists linad_private.admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);
create table if not exists linad_private.analytics_settings (
  singleton boolean primary key default true check(singleton),
  started_at timestamptz not null default now()
);
insert into linad_private.analytics_settings(singleton) values(true) on conflict do nothing;
create table if not exists linad_private.learning_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default (now() at time zone 'UTC')::date,
  received_at timestamptz not null default now(),
  kind text not null check(kind in ('lesson','practice','mini-test','module-test')),
  language text not null check(language in ('de','en')),
  primary key(user_id,activity_date)
);
create index if not exists linad_learning_days_date on linad_private.learning_days(activity_date);
alter table linad_private.admin_members enable row level security;
alter table linad_private.analytics_settings enable row level security;
alter table linad_private.learning_days enable row level security;
revoke all on all tables in schema linad_private from public, anon, authenticated;

create or replace function public.linad_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from linad_private.admin_members a join auth.users u on u.id=a.user_id
    where a.user_id=auth.uid() and u.email_confirmed_at is not null and u.deleted_at is null);
$$;
revoke all on function public.linad_is_admin() from public, anon;
grant execute on function public.linad_is_admin() to authenticated;

create or replace function public.linad_record_learning_activity(p_kind text,p_language text) returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null or not exists(select 1 from auth.users where id=uid and email_confirmed_at is not null and deleted_at is null) then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  if p_kind is null or p_kind not in ('lesson','practice','mini-test','module-test') or p_language is null or p_language not in ('de','en') then
    raise exception 'Invalid activity' using errcode='22023';
  end if;
  -- Server time, own identity only, at most one retained row per person per UTC day.
  insert into linad_private.learning_days(user_id,kind,language) values(uid,p_kind,p_language) on conflict do nothing;
end $$;
revoke all on function public.linad_record_learning_activity(text,text) from public, anon;
grant execute on function public.linad_record_learning_activity(text,text) to authenticated;

-- Only normalized summaries sent by the existing account sync are counted.
-- Legacy arrays/absent sync are unknown, rather than invented zero completions.
create or replace view linad_private.admin_accounts as
select u.id as user_id, left(coalesce(nullif(p.display_name,''),u.raw_user_meta_data->>'full_name',''),201) as full_name,
  u.email, u.created_at, u.email_confirmed_at,
  case when jsonb_typeof(preferences.languages)='array' then preferences.languages else '[]'::jsonb end as study_languages,
  stats.lessons_completed, stats.modules_completed
from auth.users u left join public.profiles p on p.user_id=u.id
cross join lateral (select case when p.profile_saved_at is not null then p.study_languages
  else coalesce(nullif(p.study_languages,'[]'::jsonb),u.raw_user_meta_data#>'{linad_profile,profile,study_languages}') end as languages) preferences
left join lateral (
  select sum((m.data->>'completedLessons')::integer) as lessons_completed,
    count(*) filter(where m.data->>'completed'='true') as modules_completed
  from public.module_progress m where m.user_id=u.id and jsonb_typeof(m.data)='object'
    and m.data->>'completedLessons' ~ '^[0-5]$'
  having count(*)>0
) stats on true
where u.deleted_at is null and u.email is not null;
revoke all on linad_private.admin_accounts from public, anon, authenticated;

create or replace function public.linad_admin_dashboard(
  p_search text default '',p_language text default null,p_level text default null,
  p_confirmed boolean default null,p_offset integer default 0
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb; since timestamptz;
begin
  if not public.linad_is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
  if p_offset is null or p_offset<0 or p_offset>1000000 or length(coalesce(p_search,''))>200
     or (p_language is not null and p_language not in ('de','en'))
     or (p_level is not null and p_level not in ('A1','A2','B1','B2','C1')) then
    raise exception 'Invalid filter' using errcode='22023';
  end if;
  select started_at into since from linad_private.analytics_settings where singleton;
  with filtered as materialized (
    select a.* from linad_private.admin_accounts a
    where (coalesce(p_search,'')='' or strpos(lower(a.full_name||' '||a.email),lower(p_search))>0)
      and (p_confirmed is null or (a.email_confirmed_at is not null)=p_confirmed)
      and ((p_language is null and p_level is null) or exists(
        select 1 from jsonb_array_elements(a.study_languages) s
        where (p_language is null or s->>'language'=p_language) and (p_level is null or s->>'level'=p_level)))
  ), course_usage as (
    select m.language, split_part(m.module_id,':',2) as level, count(distinct m.user_id) as learners,
      count(*) filter(where m.data->>'completed'='true') as completed_modules,
      sum((m.data->>'completedLessons')::integer) as completed_lessons
    from public.module_progress m join linad_private.admin_accounts a on a.user_id=m.user_id
    where jsonb_typeof(m.data)='object' and m.data->>'completedLessons' ~ '^[0-5]$'
    group by m.language,split_part(m.module_id,':',2)
  )
  select jsonb_build_object(
    'total',(select count(*) from linad_private.admin_accounts),
    'today',(select count(*) from linad_private.admin_accounts where created_at >= ((now() at time zone 'UTC')::date::timestamp at time zone 'UTC')),
    'registrations_7d',(select count(*) from linad_private.admin_accounts where created_at>=now()-interval '7 days'),
    'registrations_30d',(select count(*) from linad_private.admin_accounts where created_at>=now()-interval '30 days'),
    'active_7d',case when since<=now()-interval '7 days' then (select count(distinct d.user_id) from linad_private.learning_days d join linad_private.admin_accounts a on a.user_id=d.user_id where d.activity_date >= (now() at time zone 'UTC')::date-6) else null end,
    'active_30d',case when since<=now()-interval '30 days' then (select count(distinct d.user_id) from linad_private.learning_days d join linad_private.admin_accounts a on a.user_id=d.user_id where d.activity_date >= (now() at time zone 'UTC')::date-29) else null end,
    'activity_since',since,
    'progress_accounts',(select count(*) from linad_private.admin_accounts where lessons_completed is not null),
    'filtered_total',(select count(*) from filtered),
    'users',coalesce((select jsonb_agg(to_jsonb(page) order by page.created_at desc,page.user_id) from (select * from filtered order by created_at desc,user_id limit 25 offset p_offset) page),'[]'::jsonb),
    'courses',coalesce((select jsonb_agg(to_jsonb(c) order by c.language,c.level) from course_usage c),'[]'::jsonb)
  ) into result;
  return result;
end $$;
revoke all on function public.linad_admin_dashboard(text,text,text,boolean,integer) from public, anon;
grant execute on function public.linad_admin_dashboard(text,text,text,boolean,integer) to authenticated;

create or replace function public.linad_admin_user(p_user_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if not public.linad_is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
  select jsonb_build_object('user',to_jsonb(a),
    'modules',coalesce((select jsonb_agg(jsonb_build_object(
      'module_id',m.module_id,'language',m.language,
      'completed_lessons',case when m.data->>'completedLessons' ~ '^[0-5]$' then (m.data->>'completedLessons')::integer else null end,
      'completed',case when m.data->>'completed' in ('true','false') then (m.data->>'completed')::boolean else null end,
      'percent',case when m.data->>'percent' ~ '^(100|[0-9]{1,2})$' then (m.data->>'percent')::integer else null end
    ) order by m.module_id) from public.module_progress m where m.user_id=p_user_id),'[]'::jsonb),
    'lessons',coalesce((select jsonb_agg(jsonb_build_object(
      'lesson_id',l.lesson_id,'updated_at',l.updated_at,
      'attempts',case when jsonb_typeof(l.data->'attempts')='array' then jsonb_array_length(l.data->'attempts') else 0 end,
      'score',l.data#>'{attempts,-1,score}','total',l.data#>'{attempts,-1,total}'
    ) order by l.lesson_id) from public.lesson_progress l where l.user_id=p_user_id),'[]'::jsonb)
  ) into result from linad_private.admin_accounts a where a.user_id=p_user_id;
  if result is null then raise exception 'User not found' using errcode='P0002'; end if;
  return result;
end $$;
revoke all on function public.linad_admin_user(uuid) from public, anon;
grant execute on function public.linad_admin_user(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
