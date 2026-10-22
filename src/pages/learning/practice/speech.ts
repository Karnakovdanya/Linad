import type { UiLanguage } from '../../../domain/types';

const preferredVoices: Record<UiLanguage, readonly string[]> = {
  ru: ['ru-RU'], de: ['de-DE', 'de-CH', 'de-AT'], en: ['en-GB', 'en-US'],
};
function normalized(locale: string) { return locale.replaceAll('_', '-').toLowerCase(); }
export function selectPracticeVoice(voices: readonly SpeechSynthesisVoice[], language: UiLanguage) {
  for (const locale of preferredVoices[language]) {
    const voice = voices.find(voice => normalized(voice.lang) === normalized(locale));
    if (voice) return voice;
  }
  return voices.find(voice => normalized(voice.lang).split('-')[0] === language);
}
export function practiceSpeechLocale(language: UiLanguage, voice: SpeechSynthesisVoice) {
  if (language === 'en') return normalized(voice.lang).startsWith('en-us') ? 'en-US' : 'en-GB';
  return language === 'de' ? 'de-DE' : 'ru-RU';
}

// A nonempty list may still be incomplete: RU often appears before DE/EN.
export function waitForPracticeVoices(synth: SpeechSynthesis, languages: readonly UiLanguage[], signal: AbortSignal, timeoutMs = 2500): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve, reject) => {
    let voices: SpeechSynthesisVoice[] = [];
    let finished = false;
    function cleanup() {
      clearTimeout(timeout);
      synth.removeEventListener('voiceschanged', check);
      signal.removeEventListener('abort', finish);
    }
    function finish() {
      if (finished) return;
      finished = true; cleanup(); resolve(voices);
    }
    function check() {
      if (finished) return;
      try { voices = synth.getVoices(); }
      catch (error) { finished = true; cleanup(); reject(error); return; }
      if (languages.every(language => selectPracticeVoice(voices, language))) finish();
    }
    const timeout = setTimeout(() => { check(); finish(); }, timeoutMs);
    synth.addEventListener('voiceschanged', check);
    signal.addEventListener('abort', finish, { once: true });
    if (signal.aborted) { finish(); return; }
    check();
  });
}
