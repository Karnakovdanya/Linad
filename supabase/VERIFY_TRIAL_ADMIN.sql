-- Manual, READ ONLY smoke test after installation and owner assignment.
-- Needs at least one confirmed administrator and one ordinary user.
-- No account data is printed. Role/claim settings are transaction-local.
begin read only;
do $$ begin
  if not exists(select 1 from linad_private.admin_members a join auth.users u on u.id=a.user_id where u.email_confirmed_at is not null and u.deleted_at is null) then
    raise exception 'Assign a confirmed owner first';
  end if;
  if not exists(select 1 from auth.users u where u.deleted_at is null and not exists(select 1 from linad_private.admin_members a where a.user_id=u.id)) then
    raise exception 'Create an ordinary test account first';
  end if;
end $$;

set local role anon;
do $$ begin
  begin perform public.linad_is_admin(); raise exception 'FAIL: anonymous role check allowed'; exception when insufficient_privilege then null; end;
  begin perform public.linad_admin_dashboard(); raise exception 'FAIL: anonymous dashboard allowed'; exception when insufficient_privilege then null; end;
  begin perform public.linad_admin_user('00000000-0000-4000-8000-000000000000'::uuid); raise exception 'FAIL: anonymous details allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;

select set_config('request.jwt.claim.sub',(select u.id::text from auth.users u where u.deleted_at is null and not exists(select 1 from linad_private.admin_members a where a.user_id=u.id) limit 1),true) as ordinary_test_identity;
set local role authenticated;
do $$
declare t text; leaked boolean;
begin
  if public.linad_is_admin() then raise exception 'FAIL: ordinary user became administrator'; end if;
  begin perform public.linad_admin_dashboard(); raise exception 'FAIL: ordinary dashboard allowed'; exception when insufficient_privilege then null; end;
  begin perform public.linad_admin_user(auth.uid()); raise exception 'FAIL: ordinary admin details allowed'; exception when insufficient_privilege then null; end;
  begin perform 1 from linad_private.admin_members; raise exception 'FAIL: private role table readable'; exception when insufficient_privilege then null; end;
  foreach t in array array['profiles','account_state','lesson_progress','module_progress','test_results','saved_words','favorite_tutors'] loop
    execute format('select exists(select 1 from public.%I where user_id <> auth.uid())',t) into leaked;
    if leaked then raise exception 'FAIL: foreign data visible in %',t; end if;
  end loop;
end $$;
reset role;

select set_config('request.jwt.claim.sub',(select a.user_id::text from linad_private.admin_members a join auth.users u on u.id=a.user_id where u.email_confirmed_at is not null and u.deleted_at is null limit 1),true) as administrator_test_identity;
set local role authenticated;
do $$
declare data jsonb;
begin
  if not public.linad_is_admin() then raise exception 'FAIL: assigned owner denied'; end if;
  data := public.linad_admin_dashboard();
  if jsonb_typeof(data->'users') is distinct from 'array' then raise exception 'FAIL: dashboard payload invalid'; end if;
  perform public.linad_admin_user(auth.uid());
end $$;
reset role;
rollback;
-- Success: no exceptions. Also verify real JWT REST requests as described in the report.
