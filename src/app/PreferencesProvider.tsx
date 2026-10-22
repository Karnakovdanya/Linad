import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { LearningLanguage, Theme, UiLanguage } from '../domain/types';
import { messages } from '../i18n/messages';
import { localPreferencesStorage, parsePreferences, PREFERENCES_KEY } from '../storage/preferences';
import { PreferencesContext } from './preferences-context';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => localPreferencesStorage.read());
  const { preferences, warning } = state;

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.lang = preferences.uiLanguage;
  }, [preferences]);

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === PREFERENCES_KEY || event.key === null) {
        setState(parsePreferences(event.key === null ? null : event.newValue));
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  function update(change: { theme?: Theme; uiLanguage?: UiLanguage; learningLanguage?: LearningLanguage }) {
    const next = { ...preferences, ...change };
    const saved = localPreferencesStorage.write(next);
    setState({ preferences: next, warning: saved ? null : 'unavailable' });
    // Also apply immediately so navigation and the first paint use the same choice.
    document.documentElement.dataset.theme = next.theme;
    document.documentElement.lang = next.uiLanguage;
  }

  return (
    <PreferencesContext.Provider value={{
      preferences,
      warning,
      t: messages[preferences.uiLanguage],
      setLanguage: (uiLanguage) => update({ uiLanguage }),
      setTheme: (theme) => update({ theme }),
      setLearningLanguage: (learningLanguage) => update({ learningLanguage }),
      setAppearance: update,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}
