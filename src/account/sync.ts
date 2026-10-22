import type { SupabaseClient } from '@supabase/supabase-js';
import { mergeDocuments, parseDocument } from './document';
import type { AccountDocument } from './document';
import { curricula } from '../pages/learning/levels/data/curriculum';
import { moduleStatus } from '../pages/learning/levels/progress';

export function moduleRecords(document: AccountDocument) {
  return Object.fromEntries((['de', 'en'] as const).flatMap(language => curricula[language].flatMap(module => {
    const id = `${language}:${module.level}:${module.id}`; const status = moduleStatus(document.levels, language, module.level, module.id);
    const started = module.lessonIds.some(lessonId => document.levels.lessons[`${language}:${lessonId}`]);
    return started || status.attempts.length ? [[id, status]] : [];
  })));
}

export async function loadCloud(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from('account_state').select('revision,data').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return { revision: Number(data?.revision ?? 0), document: data ? parseDocument(data.data) : null };
}
export async function commitCloud(client: SupabaseClient, userId: string, document: AccountDocument, revision: number) {
  let current = document; let expected = revision;
  for (let retry = 0; retry < 4; retry++) {
    const { data, error } = await client.rpc('linad_commit_account', { p_expected_revision: expected, p_document: current, p_modules: moduleRecords(current) });
    if (!error) return { revision: Number(data), document: current };
    if (error.code !== 'PT409') throw error;
    const fresh = await loadCloud(client, userId);
    expected = fresh.revision; current = fresh.document ? mergeDocuments(fresh.document, current) : current;
  }
  throw new Error('concurrent-update');
}
