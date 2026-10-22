import type { StorageWarning, UiLanguage } from '../domain/types';
import type { Translation } from '../pages/learning/practice/data/types';
import { readData, writeData } from '../account/storage';
import { recordPracticeChanges } from '../account/collection';

export const PRACTICE_STORAGE_KEY = 'linad.practice.v1';
export interface SavedPracticeItem {
  id: string; kind: 'phrase' | 'word'; categoryId: string; situationId: string; text: Translation; savedAt: string;
}
export interface PracticePreferences { version: 1; visibleLanguages: UiLanguage[]; savedItems: SavedPracticeItem[] }
const languages: readonly UiLanguage[] = ['ru', 'de', 'en'];
export function defaultPracticePreferences(): PracticePreferences { return { version: 1, visibleLanguages: [...languages], savedItems: [] }; }

function isSavedItem(value: unknown): value is SavedPracticeItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedPracticeItem>;
  return typeof item.id === 'string' && item.id.length > 0 && (item.kind === 'phrase' || item.kind === 'word') &&
    typeof item.categoryId === 'string' && typeof item.situationId === 'string' &&
    typeof item.savedAt === 'string' && Number.isFinite(Date.parse(item.savedAt)) &&
    typeof item.text === 'object' && item.text !== null && languages.every(language => typeof item.text?.[language] === 'string');
}
export function parsePracticePreferences(value: string | null): { preferences: PracticePreferences; warning: StorageWarning } {
  if (value === null) return { preferences: defaultPracticePreferences(), warning: null };
  try {
    const data: unknown = JSON.parse(value);
    if (data && typeof data === 'object' && 'version' in data && data.version === 1 &&
        'visibleLanguages' in data && Array.isArray(data.visibleLanguages) && data.visibleLanguages.length > 0 &&
        data.visibleLanguages.every(language => languages.includes(language)) &&
        'savedItems' in data && Array.isArray(data.savedItems) && data.savedItems.every(isSavedItem)) {
      const visibleLanguages = data.visibleLanguages;
      return { preferences: { version: 1, visibleLanguages: languages.filter(language => visibleLanguages.includes(language)),
        savedItems: [...new Map(data.savedItems.map(item => [item.id, item])).values()] }, warning: null };
    }
  } catch { /* Malformed or incompatible data uses validated defaults. */ }
  return { preferences: defaultPracticePreferences(), warning: 'invalid' };
}
// Separate feature record: existing UI/theme/study preferences are never rewritten.
export const localPracticeStorage = {
  read() {
    try { return parsePracticePreferences(readData(PRACTICE_STORAGE_KEY)); }
    catch { return { preferences: defaultPracticePreferences(), warning: 'unavailable' as const }; }
  },
  write(preferences: PracticePreferences) {
    try {
      recordPracticeChanges(parsePracticePreferences(readData(PRACTICE_STORAGE_KEY)).preferences.savedItems, preferences.savedItems);
      writeData(PRACTICE_STORAGE_KEY, JSON.stringify(preferences)); return true;
    }
    catch { return false; }
  },
};
