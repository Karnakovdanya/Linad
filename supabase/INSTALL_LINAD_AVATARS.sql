-- Run in the SQL Editor of the LINAD Supabase project.
-- Private photo storage; no changes to existing profile/progress records.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('linad-avatars', 'linad-avatars', false, 3145728,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists linad_avatar_owner on storage.objects;
create policy linad_avatar_owner on storage.objects
for all to authenticated
using (
  bucket_id = 'linad-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'linad-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
