import { usePreferences } from '../../app/preferences-context';
import { tutorCopy } from './copy';

export function useTutorLocale() {
  const { preferences } = usePreferences();
  return { language: preferences.uiLanguage, copy: tutorCopy[preferences.uiLanguage] };
}
