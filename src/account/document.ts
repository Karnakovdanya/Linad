import type { LevelsState } from '../pages/learning/levels/model';
import { defaultLevelsState, LEVELS_STORAGE_KEY, parseLevels } from '../pages/learning/levels/storage';
import { defaultPracticePreferences, parsePracticePreferences, PRACTICE_STORAGE_KEY } from '../storage/practice';
import type { PracticePreferences } from '../storage/practice';
import { COLLECTION_KEY, emptyCollection, parseCollection, practiceWord } from './collection';
import type { Collection } from './collection';
import { announceData, readData, writeData } from './storage';
import { ACTIVITY_KEY, activityTimes, knownActivity, readActivity } from './activity';

export interface AccountDocument { version: 1; levels: LevelsState; practice: PracticePreferences; collection: Collection; studyActivity: string[]; updatedAt: string }
export function emptyDocument(): AccountDocument { return { version: 1, levels: defaultLevelsState(), practice: defaultPracticePreferences(), collection: emptyCollection(), studyActivity: [], updatedAt: '1970-01-01T00:00:00.000Z' }; }
export function parseDocument(value: unknown): AccountDocument {
  if (!value || typeof value !== 'object') return emptyDocument();
  const raw = value as AccountDocument;
  const levels = parseLevels(JSON.stringify(raw.levels)); const practice = parsePracticePreferences(JSON.stringify(raw.practice));
  if (raw.version !== 1 || levels.warning || practice.warning) throw new Error('invalid-account-data');
  return reconcile({ version: 1, levels: levels.state, practice: practice.preferences, collection: parseCollection(JSON.stringify(raw.collection)), studyActivity: activityTimes(raw.studyActivity), updatedAt: Number.isFinite(Date.parse(raw.updatedAt)) ? raw.updatedAt : emptyDocument().updatedAt });
}
function reconcile(doc: AccountDocument): AccountDocument {
  doc.studyActivity = activityTimes([...doc.studyActivity, ...knownActivity(doc.levels)]);
  for (const item of doc.practice.savedItems) {
    const word = practiceWord(item); const existing = doc.collection.words[word.id];
    if (!existing || word.updatedAt > existing.updatedAt) doc.collection.words[word.id] = word;
  }
  doc.practice.savedItems = Object.values(doc.collection.words).flatMap(word => word.source === 'practice' && !word.deletedAt && word.practiceItem ? [word.practiceItem] : []);
  return doc;
}
export function readDocument(userId?: string | null): AccountDocument {
  return reconcile({ version: 1, levels: parseLevels(readData(LEVELS_STORAGE_KEY, userId)).state, practice: parsePracticePreferences(readData(PRACTICE_STORAGE_KEY, userId)).preferences, collection: parseCollection(readData(COLLECTION_KEY, userId)), studyActivity: readActivity(userId), updatedAt: readData('linad.data-clock', userId) ?? emptyDocument().updatedAt });
}
export function installDocument(doc: AccountDocument) {
  writeData(LEVELS_STORAGE_KEY, JSON.stringify(doc.levels), false);
  writeData(PRACTICE_STORAGE_KEY, JSON.stringify(doc.practice), false);
  writeData(COLLECTION_KEY, JSON.stringify(doc.collection), false);
  writeData(ACTIVITY_KEY, JSON.stringify(doc.studyActivity), false);
  writeData('linad.data-clock', doc.updatedAt, false); announceData(false);
}
const unique = <T,>(entries: T[], key: (item: T) => string): T[] => [...new Map(entries.map(item => [key(item), item])).values()];
function latest<T extends { updatedAt: string }>(a: Record<string, T>, b: Record<string, T>) {
  const result = { ...a };
  for (const [id, item] of Object.entries(b)) if (!result[id] || item.updatedAt >= result[id]!.updatedAt) result[id] = item;
  return result;
}
export function mergeDocuments(a: AccountDocument, b: AccountDocument): AccountDocument {
  const recent = b.updatedAt >= a.updatedAt ? b : a; const older = recent === b ? a : b;
  const levels: LevelsState = { ...older.levels, ...recent.levels, runs: { ...recent.levels.runs }, lessons: { ...older.levels.lessons }, moduleAttempts: { ...older.levels.moduleAttempts }, setupComplete: { ...a.levels.setupComplete, ...b.levels.setupComplete }, archivedLearning: { ...a.levels.archivedLearning, ...b.levels.archivedLearning }, lastLesson: {}, activity: {} };
  for (const [id, next] of Object.entries(recent.levels.lessons)) {
    const prev = levels.lessons[id];
    levels.lessons[id] = prev ? { visited: [...new Set([...prev.visited, ...next.visited])], attempts: unique([...prev.attempts, ...next.attempts], item => `${item.completedAt}:${JSON.stringify(item.answers)}`).sort((x, y) => x.completedAt.localeCompare(y.completedAt)), practice: unique([...(prev.practice ?? []), ...(next.practice ?? [])], item => `${item.taskId}:${item.answer}:${item.checkedAt}`) } : next;
  }
  for (const [id, attempts] of Object.entries(recent.levels.moduleAttempts)) levels.moduleAttempts[id] = unique([...(levels.moduleAttempts[id] ?? []), ...attempts], item => item.id).sort((x, y) => x.completedAt.localeCompare(y.completedAt));
  levels.assessmentHistory = unique([...a.levels.assessmentHistory, ...b.levels.assessmentHistory, ...Object.values(a.levels.runs), ...Object.values(b.levels.runs)].filter(run => run.completed), run => run.id).sort((x, y) => x.startedAt.localeCompare(y.startedAt));
  levels.acknowledgedLevels = [...new Set([...a.levels.acknowledgedLevels, ...b.levels.acknowledgedLevels])];
  for (const lang of ['de', 'en'] as const) {
    const source = (a.levels.activity[lang]?.at ?? '') > (b.levels.activity[lang]?.at ?? '') ? a : b;
    levels.activity[lang] = source.levels.activity[lang]; levels.lastLesson[lang] = source.levels.lastLesson[lang] ?? older.levels.lastLesson[lang];
    const first = a.levels.runs[lang]; const second = b.levels.runs[lang];
    if (first && second) levels.runs[lang] = first.id === second.id ? first.responses.length > second.responses.length ? first : second : first.startedAt > second.startedAt ? first : second;
    else levels.runs[lang] = first ?? second;
  }
  levels.examRuns = { ...older.levels.examRuns };
  for (const [id, next] of Object.entries(recent.levels.examRuns)) {
    const previous = levels.examRuns[id];
    levels.examRuns[id] = previous && previous.seed === next.seed ? { ...next, answers: { ...previous.answers, ...next.answers } } : previous && previous.startedAt > next.startedAt ? previous : next;
  }
  return reconcile({ version: 1, levels: parseLevels(JSON.stringify(levels)).state, practice: { ...recent.practice }, collection: { words: latest(a.collection.words, b.collection.words), favorites: latest(a.collection.favorites, b.collection.favorites) }, studyActivity: activityTimes([...(a.studyActivity ?? []), ...(b.studyActivity ?? [])]), updatedAt: recent.updatedAt });
}
export function hasGuestData(doc: AccountDocument) { return Object.keys(doc.levels.lessons).length > 0 || Object.keys(doc.levels.runs).length > 0 || Object.keys(doc.levels.moduleAttempts).length > 0 || Object.values(doc.levels.setupComplete).some(Boolean) || Object.values(doc.collection.words).some(word => !word.deletedAt) || Object.values(doc.collection.favorites).some(item => !item.deletedAt); }
