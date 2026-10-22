import type { LevelsState } from '../pages/learning/levels/model';
import { readData, writeData } from './storage';
import { parseLevels, LEVELS_STORAGE_KEY } from '../pages/learning/levels/storage';

export const ACTIVITY_KEY = 'linad.study-activity.v1';
export function activityTimes(values: unknown): string[] {
  return Array.isArray(values) ? [...new Set(values.filter((value): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value))))].sort() : [];
}
export function knownActivity(levels: LevelsState) {
  return activityTimes([
    ...Object.values(levels.activity).map(item => item.at),
    ...Object.values(levels.results).map(item => item.completedAt),
    ...Object.values(levels.lessons).flatMap(item => [...item.attempts.map(attempt => attempt.completedAt), ...(item.practice ?? []).map(entry => entry.checkedAt)]),
    ...Object.values(levels.moduleAttempts).flatMap(attempts => attempts.map(attempt => attempt.completedAt)),
  ]);
}
export function readActivity(userId?: string | null) {
  try { return activityTimes(JSON.parse(readData(ACTIVITY_KEY, userId) ?? '[]')); } catch { return []; }
}
export function captureActivity() {
  try {
    const levels = parseLevels(readData(LEVELS_STORAGE_KEY)).state;
    const previous = readActivity(); const next = activityTimes([...previous, ...knownActivity(levels)]);
    if (JSON.stringify(previous) !== JSON.stringify(next)) writeData(ACTIVITY_KEY, JSON.stringify(next), false);
  } catch { /* Course data is never changed by this optional history collector. */ }
}
export function studyStreak(times: string[], now = new Date(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  function day(date: Date) {
    const parts = formatter.formatToParts(date); const part = (key: string) => Number(parts.find(part => part.type === key)!.value);
    return Math.floor(Date.UTC(part('year'), part('month') - 1, part('day')) / 86400000);
  }
  const today = day(now); const days = new Set(activityTimes(times).filter(at => Date.parse(at) <= now.getTime()).map(at => day(new Date(at))));
  let current = days.has(today) ? today : today - 1; let streak = 0;
  while (days.has(current)) { streak++; current--; }
  return streak;
}
