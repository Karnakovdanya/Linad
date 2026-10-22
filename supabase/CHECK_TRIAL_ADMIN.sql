-- READ ONLY. Run in SQL Editor BEFORE the new migration, then review the output.
select table_schema,table_name,column_name,data_type
from information_schema.columns
where (table_schema='public' and table_name in ('profiles','account_state','lesson_progress','module_progress','test_results','saved_words','favorite_tutors'))
   or table_schema='linad_private'
order by table_schema,table_name,ordinal_position;

select schemaname,tablename,policyname,roles,cmd,qual,with_check from pg_policies
where schemaname in ('public','linad_private') order by schemaname,tablename,policyname;

select n.nspname as schema,p.proname,pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,p.proconfig,p.proacl
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where p.proname like 'linad_%' order by n.nspname,p.proname;

select n.nspname as schema,c.relname,c.relrowsecurity as rls,c.relforcerowsecurity as force_rls
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname in ('public','linad_private') and c.relkind='r' order by 1,2;

select grantee,table_schema,table_name,privilege_type from information_schema.role_table_grants
where grantee in ('anon','authenticated','PUBLIC') and table_schema in ('public','linad_private') order by 2,3,1;
-- Do not send account rows, JWTs, passwords, API secrets or auth.users contents.
