/** UI language and learning language are deliberately separate concepts. */
export type UiLanguage = 'ru' | 'de' | 'en';
export type LearningLanguage = 'de' | 'en';
export type Theme = 'light' | 'dark';

export interface Preferences {
  version: 1;
  uiLanguage: UiLanguage;
  theme: Theme;
  learningLanguage: LearningLanguage;
}

/** Implemented by the local adapter now; a future auth adapter needs a backend. */
export interface PreferencesStorage {
  read(): { preferences: Preferences; warning: StorageWarning };
  write(preferences: Preferences): boolean;
}

export type StorageWarning = 'invalid' | 'unavailable' | null;
