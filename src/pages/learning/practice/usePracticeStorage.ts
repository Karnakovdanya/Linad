import { useEffect, useState } from 'react';
import type { UiLanguage } from '../../../domain/types';
import { localPracticeStorage } from '../../../storage/practice';
import { subscribeData } from '../../../account/storage';
import type { PracticePreferences, SavedPracticeItem } from '../../../storage/practice';
import type { Messages } from '../../../i18n/messages';

export function usePracticeStorage(t: Messages) {
  const [state, setState] = useState(() => localPracticeStorage.read());
  const [notice, setNotice] = useState('');
  useEffect(() => {
    return subscribeData(() => setState(localPracticeStorage.read()));
  }, []);
  function commit(preferences: PracticePreferences) {
    const saved = localPracticeStorage.write(preferences);
    setState({ preferences, warning: saved ? null : 'unavailable' });
    return saved;
  }
  function toggleLanguage(language: UiLanguage) {
    const previous = state.preferences.visibleLanguages;
    if (previous.length === 1 && previous.includes(language)) { setNotice(t.practiceOneLanguage); return; }
    commit({ ...state.preferences, visibleLanguages: previous.includes(language) ? previous.filter(item => item !== language) : [...previous, language] });
    setNotice('');
  }
  function toggleSaved(item: Omit<SavedPracticeItem, 'savedAt'>) {
    const exists = state.preferences.savedItems.some(saved => saved.id === item.id);
    const savedItems = exists ? state.preferences.savedItems.filter(saved => saved.id !== item.id) : [...state.preferences.savedItems, { ...item, savedAt: new Date().toISOString() }];
    const saved = commit({ ...state.preferences, savedItems });
    setNotice(saved ? (exists ? t.practiceRemoved : t.practiceSaved) : '');
  }
  return { ...state, notice, toggleLanguage, toggleSaved };
}
