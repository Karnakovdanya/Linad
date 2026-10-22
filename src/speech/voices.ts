import type { UiLanguage } from '../domain/types';

const locales: Record<UiLanguage, readonly string[]> = { ru: ['ru-ru'], de: ['de-de', 'de-ch', 'de-at'], en: ['en-gb', 'en-us'] };
export const normaliseLocale = (value: string) => value.trim().replaceAll('_', '-').toLowerCase();
export const voiceLanguageMatches = (voice: SpeechSynthesisVoice, language: UiLanguage) => normaliseLocale(voice.lang).split('-')[0] === language;
export function voiceId(voice: SpeechSynthesisVoice) { return JSON.stringify([normaliseLocale(voice.lang), voice.voiceURI || voice.name, voice.name]); }

function scoreVoice(voice: SpeechSynthesisVoice, language: UiLanguage) {
  // The API has no quality rating. These are hints only, after language validation.
  const enhanced = /\b(natural|neural|enhanced|premium)\b/i.test(voice.name) ? 300 : 0;
  const browserVoice = /\bgoogle\b/i.test(voice.name) ? 40 : 0;
  const region = locales[language].indexOf(normaliseLocale(voice.lang));
  return enhanced + browserVoice + (region < 0 ? 0 : 30 - region * 5) + (voice.default ? 2 : 0) + (voice.localService ? 1 : 0);
}
export function rankedVoices(voices: readonly SpeechSynthesisVoice[], language: UiLanguage) {
  return [...new Map(voices.filter(voice => voiceLanguageMatches(voice, language)).map(voice => [voiceId(voice), voice])).values()]
    .sort((a, b) => scoreVoice(b, language) - scoreVoice(a, language) || voiceId(a).localeCompare(voiceId(b)));
}
export function chooseVoice(voices: readonly SpeechSynthesisVoice[], language: UiLanguage, preferred?: string) {
  const matching = rankedVoices(voices, language);
  return matching.find(voice => voiceId(voice) === preferred) ?? matching[0];
}
export function speechLocale(language: UiLanguage, voice: SpeechSynthesisVoice) {
  return language === 'ru' ? 'ru-RU' : language === 'de' ? 'de-DE' : normaliseLocale(voice.lang) === 'en-us' ? 'en-US' : 'en-GB';
}
export const VOICE_WAIT_MS = 4000;
// Wait for the requested language, not merely for a nonempty RU-only list.
// Poll as well: some embedded Chromium builds do not deliver voiceschanged reliably.
export function waitForVoice(synth: SpeechSynthesis, language: UiLanguage, signal: AbortSignal, timeoutMs = VOICE_WAIT_MS): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve, reject) => {
    let finished = false; let voices: SpeechSynthesisVoice[] = [];
    const cleanup = () => { clearTimeout(timer); clearInterval(poll); synth.removeEventListener('voiceschanged', check); signal.removeEventListener('abort', abort); };
    const finish = () => { if (finished) return; finished = true; cleanup(); resolve(voices); };
    const abort = () => { if (finished) return; finished = true; cleanup(); reject(new DOMException('Speech request canceled', 'AbortError')); };
    function check() {
      if (finished) return;
      try { voices = synth.getVoices(); if (chooseVoice(voices, language)) finish(); }
      catch (error) { finished = true; cleanup(); reject(error); }
    }
    const timer = setTimeout(() => { check(); finish(); }, Math.max(0, timeoutMs)); const poll = setInterval(check, 100);
    if (signal.aborted) { abort(); return; }
    synth.addEventListener('voiceschanged', check); signal.addEventListener('abort', abort, { once: true });
    check();
  });
}
