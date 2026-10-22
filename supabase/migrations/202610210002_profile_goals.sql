-- Personal preferences only. Course levels and results are never updated here.
begin;
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
