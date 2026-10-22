import type { User } from '@supabase/supabase-js';
import type { LearningLanguage, UiLanguage } from '../domain/types';
import { cefrLevels } from '../pages/learning/levels/model';
import type { CefrLevel } from '../pages/learning/levels/model';
import { readData, writeData } from './storage';

export interface StudyLanguage { language: LearningLanguage; level: CefrLevel | null }
export interface StudyGoal { language: LearningLanguage; level: CefrLevel }
export interface AccountProfile {
  display_name: string; first_name: string; last_name: string;
  avatar_path: string | null; study_languages: StudyLanguage[];
  study_goal: StudyGoal | null; updated_at?: string;
  ui_language?: UiLanguage | null; theme?: 'light' | 'dark' | null;
}
export const PROFILE_FIELDS = 'display_name,first_name,last_name,avatar_path,study_languages,study_goal,ui_language,theme,updated_at,profile_saved_at';
const key = 'linad.profile.v1';
export function normalizeProfile(value: unknown, user: Pick<User, 'id' | 'user_metadata'>): AccountProfile {
  const record = (value && typeof value === 'object' ? value : {}) as Partial<AccountProfile>;
  const metadata = user.user_metadata;
  // Old accounts may have one unsplit name. Preserve it rather than guessing a surname.
  const first = String(record.first_name || record.display_name || metadata.first_name || metadata.full_name || '').slice(0, 100);
  const last = String(record.last_name ?? metadata.last_name ?? '').slice(0, 100);
  const languages = Array.isArray(record.study_languages) ? record.study_languages : [];
  const study_languages = (['de', 'en'] as const).flatMap(language => {
    const item = languages.find(item => item?.language === language);
    return item ? [{ language, level: item.level && cefrLevels.includes(item.level) ? item.level : null }] : [];
  });
  const goal = record.study_goal;
  return { first_name: first, last_name: last, display_name: [first, last].filter(Boolean).join(' '),
    avatar_path: typeof record.avatar_path === 'string' && record.avatar_path.startsWith(user.id + '/') ? record.avatar_path : null,
    study_languages, study_goal: goal && ['de', 'en'].includes(goal.language) && cefrLevels.includes(goal.level) ? { language: goal.language, level: goal.level } : null,
    updated_at: typeof record.updated_at === 'string' && Number.isFinite(Date.parse(record.updated_at)) ? record.updated_at : undefined,
    ui_language: record.ui_language && ['ru', 'de', 'en'].includes(record.ui_language) ? record.ui_language : null,
    theme: record.theme === 'light' || record.theme === 'dark' ? record.theme : null };
}
export function cachedProfile(user: User) {
  const metadata = metadataProfile(user);
  try { const cached = normalizeProfile(JSON.parse(readData(key, user.id) ?? 'null'), user); return metadata && Date.parse(metadata.updated_at ?? '') >= Date.parse(cached.updated_at ?? '1970-01-01') ? metadata : cached; }
  catch { return metadata ?? normalizeProfile(null, user); }
}
export function metadataProfile(user: Pick<User, 'id' | 'user_metadata'>) {
  const value = user.user_metadata.linad_profile;
  return value?.version === 1 && value.profile && typeof value.profile === 'object' ? normalizeProfile(value.profile, user) : null;
}
export function cacheProfile(profile: AccountProfile) {
  try { writeData(key, JSON.stringify(profile), false); } catch { /* A successful cloud save must not be reported as a failure of the optional cache. */ }
}
export type SyncIssue = 'schema' | 'permission' | 'session' | 'network';
export function syncIssue(error: unknown): SyncIssue {
  const { code = '', status } = (error ?? {}) as { code?: string; status?: number };
  if (['PGRST205', 'PGRST202', 'PGRST204', '42703', '42P01', '42883'].includes(code)) return 'schema';
  if (code === '42501' || status === 403) return 'permission';
  if (code === 'PGRST301' || status === 401) return 'session';
  return 'network';
}
