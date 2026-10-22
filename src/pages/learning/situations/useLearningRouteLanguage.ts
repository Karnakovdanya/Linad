import { useEffect, useRef } from 'react';
import { usePreferences } from '../../../app/preferences-context';
import type { LearningLanguage } from '../../../domain/types';

export function useLearningRouteLanguage(language: LearningLanguage) {
  const { preferences, setLearningLanguage } = usePreferences();
  const enteredLanguage = useRef<LearningLanguage | null>(null);
  useEffect(() => {
    // Honour direct entry once without fighting preference changes in other tabs.
    if (enteredLanguage.current === language) return;
    enteredLanguage.current = language;
    if (preferences.learningLanguage !== language) setLearningLanguage(language);
  }, [language, preferences.learningLanguage, setLearningLanguage]);
}
