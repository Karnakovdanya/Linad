import { createContext, useContext } from 'react';
import type { LearningLanguage, Preferences, StorageWarning, Theme, UiLanguage } from '../domain/types';
import type { Messages } from '../i18n/messages';

export interface PreferencesContextValue {
  preferences: Preferences;
  warning: StorageWarning;
  t: Messages;
  setLanguage: (language: UiLanguage) => void;
  setTheme: (theme: Theme) => void;
  setLearningLanguage: (language: LearningLanguage) => void;
  setAppearance: (change: { uiLanguage?: UiLanguage; theme?: Theme }) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('PreferencesProvider is required');
  return context;
}
