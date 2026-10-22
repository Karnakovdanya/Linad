import type { Preferences, PreferencesStorage, StorageWarning } from '../domain/types';

export const PREFERENCES_KEY = 'linad.preferences.v1';
export const DEFAULT_PREFERENCES: Preferences = { version: 1, uiLanguage: 'ru', theme: 'light', learningLanguage: 'de' };

export function parsePreferences(value: string | null): {
  preferences: Preferences;
  warning: StorageWarning;
} {
  if (value === null) return { preferences: { ...DEFAULT_PREFERENCES }, warning: null };
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null &&
        'version' in parsed && parsed.version === 1 &&
        'theme' in parsed && (parsed.theme === 'light' || parsed.theme === 'dark') &&
        'uiLanguage' in parsed && (parsed.uiLanguage === 'ru' || parsed.uiLanguage === 'de' || parsed.uiLanguage === 'en')) {
      return {
        // Version 1 records saved before Learning have no learning language.
        // Keep their interface language and theme, and default only this field.
        preferences: {
          version: 1, theme: parsed.theme, uiLanguage: parsed.uiLanguage,
          learningLanguage: 'learningLanguage' in parsed && parsed.learningLanguage === 'en' ? 'en' : 'de',
        },
        warning: null,
      };
    }
  } catch { /* Invalid JSON falls back to validated defaults. */ }
  return { preferences: { ...DEFAULT_PREFERENCES }, warning: 'invalid' };
}

export const localPreferencesStorage: PreferencesStorage = {
  read() {
    try {
      return parsePreferences(window.localStorage.getItem(PREFERENCES_KEY));
    } catch {
      return { preferences: { ...DEFAULT_PREFERENCES }, warning: 'unavailable' };
    }
  },
  write(preferences) {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch {
      return false;
    }
  },
};
