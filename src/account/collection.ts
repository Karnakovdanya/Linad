import type { LearningLanguage } from '../domain/types';
import type { Text } from '../pages/learning/levels/model';
import type { SavedPracticeItem } from '../storage/practice';
import { readData, writeData } from './storage';

export const COLLECTION_KEY = 'linad.collection.v1';
export interface SavedWord {
  id: string; source: 'practice' | 'lesson'; text: Text; example?: Text;
  languages: LearningLanguage[]; savedAt: string; updatedAt: string; deletedAt: string | null;
  practiceItem?: SavedPracticeItem;
}
export interface FavoriteTutor { id: string; updatedAt: string; deletedAt: string | null }
export interface Collection { words: Record<string, SavedWord>; favorites: Record<string, FavoriteTutor> }
export const emptyCollection = (): Collection => ({ words: {}, favorites: {} });
const date = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));
const validText = (v: unknown): v is Text => Boolean(v && typeof v === 'object' && ['ru', 'de', 'en'].every(key => typeof (v as Record<string, unknown>)[key] === 'string'));
function validPractice(value: unknown): value is SavedPracticeItem {
  const item = value as SavedPracticeItem | undefined;
  return Boolean(item && typeof item.id === 'string' && (item.kind === 'word' || item.kind === 'phrase') && typeof item.categoryId === 'string' && typeof item.situationId === 'string' && date(item.savedAt) && validText(item.text));
}
export function parseCollection(value: string | null): Collection {
  const result = emptyCollection();
  try {
    const data = JSON.parse(value ?? '{}') as Collection;
    for (const [id, word] of Object.entries(data.words ?? {})) {
      if (word && word.id === id && ['practice', 'lesson'].includes(word.source) && validText(word.text) && date(word.savedAt) && date(word.updatedAt) && (word.deletedAt === null || date(word.deletedAt)) && Array.isArray(word.languages) && word.languages.length && word.languages.every(lang => lang === 'de' || lang === 'en')) result.words[id] = { ...word, example: validText(word.example) ? word.example : undefined, practiceItem: validPractice(word.practiceItem) ? word.practiceItem : undefined };
    }
    for (const [id, item] of Object.entries(data.favorites ?? {})) if (item && item.id === id && date(item.updatedAt) && (item.deletedAt === null || date(item.deletedAt))) result.favorites[id] = item;
  } catch { /* Invalid optional records do not replace validated learning data. */ }
  return result;
}
export function readCollection(userId?: string | null) { try { return parseCollection(readData(COLLECTION_KEY, userId)); } catch { return emptyCollection(); } }
export function saveCollection(value: Collection) { writeData(COLLECTION_KEY, JSON.stringify(value)); }
export function practiceWord(item: SavedPracticeItem): SavedWord { return { id: `practice:${item.id}`, source: 'practice', text: item.text, languages: ['de', 'en'], savedAt: item.savedAt, updatedAt: item.savedAt, deletedAt: null, practiceItem: item }; }
export function recordPracticeChanges(previous: SavedPracticeItem[], next: SavedPracticeItem[]) {
  const collection = readCollection(); const now = new Date().toISOString();
  for (const item of next) {
    const id = `practice:${item.id}`;
    if (!previous.some(old => old.id === item.id) || !collection.words[id]) collection.words[id] = { ...practiceWord(item), updatedAt: now };
  }
  for (const item of previous) if (!next.some(saved => saved.id === item.id)) collection.words[`practice:${item.id}`] = { ...(collection.words[`practice:${item.id}`] ?? practiceWord(item)), deletedAt: now, updatedAt: now };
  writeData(COLLECTION_KEY, JSON.stringify(collection), false);
}
