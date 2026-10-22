-- Run AFTER 202610200001_linad_accounts.sql. Safe to rerun; no user records are removed.
begin;
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
commit;
