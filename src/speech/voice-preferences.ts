import type { UiLanguage } from '../domain/types';
export type VoicePreferences = Partial<Record<UiLanguage, string>>;
export const VOICE_PREFERENCES_KEY = 'linad.speech.voices.v1';
export function readVoicePreferences(): VoicePreferences {
  try {
    const raw = JSON.parse(localStorage.getItem(VOICE_PREFERENCES_KEY) ?? 'null');
    if (!raw || raw.version !== 1 || !raw.voices || typeof raw.voices !== 'object') return {};
    return Object.fromEntries((['ru', 'de', 'en'] as const).filter(language => typeof raw.voices[language] === 'string' && raw.voices[language].length <= 2000).map(language => [language, raw.voices[language]]));
  } catch { return {}; }
}
export function writeVoicePreferences(voices: VoicePreferences) {
  try { localStorage.setItem(VOICE_PREFERENCES_KEY, JSON.stringify({ version: 1, voices })); return true; } catch { return false; }
}
