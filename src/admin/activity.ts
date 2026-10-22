import type { LevelsState } from '../pages/learning/levels/model';
import { supabase } from '../account/client';
import { dataOwner } from '../account/storage';

// No history backfill, page views, IPs or user-agent collection. The server owns the date.
export function recordLearningActivity(before: LevelsState, after: LevelsState) {
  if (!supabase || !dataOwner()) return;
  const language = after.targetLanguage; const event = after.activity[language];
  if (!event || before.activity[language]?.at === event.at || Math.abs(Date.now() - Date.parse(event.at)) > 60_000) return;
  void supabase.rpc('linad_record_learning_activity', { p_kind: event.kind, p_language: language }).then(() => {}, () => {});
}
