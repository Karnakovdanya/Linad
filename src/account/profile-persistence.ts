import type { SupabaseClient, User } from '@supabase/supabase-js';
import { metadataProfile, normalizeProfile, PROFILE_FIELDS, syncIssue } from './profile';
import type { AccountProfile } from './profile';

export async function loadProfile(client: SupabaseClient, user: User, retry = 0): Promise<AccountProfile> {
  const metadata = metadataProfile(user);
  const { data, error } = await client.from('profiles').select(PROFILE_FIELDS).eq('user_id', user.id).maybeSingle();
  if (error) {
    if (syncIssue(error) !== 'schema') throw error;
    // Auth user metadata is genuine account storage and works before SQL is installed.
    return metadata ?? normalizeProfile(null, user);
  }
  const row = data ? normalizeProfile(data, user) : null;
  if (metadata && (!row || Date.parse(metadata.updated_at ?? '') > Date.parse(data?.profile_saved_at ?? '1970-01-01'))) {
    const values = { ...metadata, profile_saved_at: metadata.updated_at };
    const request = data ? client.from('profiles').update(values).eq('user_id', user.id) : client.from('profiles').upsert({ user_id: user.id, ...values }, { ignoreDuplicates: true });
    // Do not overwrite a newer edit that arrived after the initial read.
    const guarded = data ? data.profile_saved_at ? request.eq('profile_saved_at', data.profile_saved_at) : request.is('profile_saved_at', null) : request;
    const { data: mirrored, error: mirrorError } = await guarded.select(PROFILE_FIELDS).maybeSingle();
    if (mirrorError) throw mirrorError;
    if (mirrored) return normalizeProfile(mirrored, user);
    if (retry < 2) return loadProfile(client, user, retry + 1);
    throw new Error('concurrent-profile-update');
  }
  return row ?? metadata ?? normalizeProfile(null, user);
}

export async function saveProfile(client: SupabaseClient, user: User, current: AccountProfile, change: Partial<AccountProfile>) {
  const updated_at = new Date().toISOString();
  const next = normalizeProfile({ ...current, ...change, updated_at }, user);
  const fields = 'first_name' in change || 'last_name' in change ? { ...change, first_name: next.first_name, last_name: next.last_name, display_name: next.display_name } : change;
  const { data, error } = await client.from('profiles').upsert({ user_id: user.id, ...fields, updated_at, profile_saved_at: updated_at }).select(PROFILE_FIELDS).single();
  if (!error) return normalizeProfile(data, user);
  if (syncIssue(error) !== 'schema') throw error;

  const fresh = await client.auth.getUser(); if (fresh.error) throw fresh.error;
  if (fresh.data.user.id !== user.id) throw new Error('account-changed');
  const snapshot = metadataProfile(fresh.data.user) ?? current;
  const profile = normalizeProfile({ ...snapshot, ...change, updated_at }, fresh.data.user);
  const { data: account, error: authError } = await client.auth.updateUser({ data: {
    linad_profile: { version: 1, profile },
    ...('first_name' in change || 'last_name' in change ? { first_name: profile.first_name, last_name: profile.last_name, full_name: profile.display_name } : {}),
  } });
  if (authError) throw authError;
  if (!account.user || account.user.id !== user.id) throw new Error('account-changed');
  return metadataProfile(account.user) ?? profile;
}
