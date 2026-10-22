-- Run separately, only by the project owner in Supabase SQL Editor.
-- Replace the placeholder with YOUR confirmed user's UUID from Authentication > Users.
-- Never select the owner by a client-provided email or user_metadata role flag.
begin;
do $$
declare owner_uuid uuid := 'OWNER_UUID_FROM_AUTH_USERS';
begin
  if not exists(select 1 from auth.users where id=owner_uuid and email_confirmed_at is not null and deleted_at is null) then
    raise exception 'The owner must be an existing confirmed user';
  end if;
  insert into linad_private.admin_members(user_id) values(owner_uuid) on conflict do nothing;
end $$;
commit;
