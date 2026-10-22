import { useEffect, useState } from 'react';
import type { UiLanguage } from '../../../domain/types';
import type { Messages } from '../../../i18n/messages';
import { practiceSpeechCopy } from '../../../i18n/practice-speech-messages';
import { BrowserSpeech, idlePlayback, type PlaybackState, type SpeechEntry, type SpeechHost } from '../../../speech/browser-speech';
import { readVoicePreferences, VOICE_PREFERENCES_KEY, writeVoicePreferences } from '../../../speech/voice-preferences';
import { rankedVoices, voiceId, VOICE_WAIT_MS } from '../../../speech/voices';

export type { SpeechEntry } from '../../../speech/browser-speech';
function browserHost(): SpeechHost {
  try { return { synth: window.speechSynthesis, createUtterance: typeof window.SpeechSynthesisUtterance === 'function' ? value => new window.SpeechSynthesisUtterance(value) : undefined }; }
  catch { return {}; }
}
export function usePracticeSpeech(t: Messages, scope: string, uiLanguage: UiLanguage) {
  const [playback, setPlayback] = useState<PlaybackState>(idlePlayback);
  const [player] = useState(() => new BrowserSpeech(browserHost(), setPlayback));
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [preferences, setPreferences] = useState(readVoicePreferences);
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    return () => player.stop();
  }, [scope, player]);
  useEffect(() => {
    const synth = browserHost().synth;
    if (!synth) return;
    function refresh() {
      try {
        const available = synth!.getVoices();
        setVoices(previous => JSON.stringify(previous.map(voiceId)) === JSON.stringify(available.map(voiceId)) ? previous : available);
      } catch { /* An explicit click reports engine errors through the controller. */ }
    }
    synth.addEventListener('voiceschanged', refresh);
    const poll = window.setInterval(refresh, 200); const finish = window.setTimeout(() => window.clearInterval(poll), VOICE_WAIT_MS);
    refresh();
    function sync(event: StorageEvent) { if (event.key === VOICE_PREFERENCES_KEY || event.key === null) { player.stop(); setPreferences(readVoicePreferences()); } }
    window.addEventListener('storage', sync);
    return () => { window.clearInterval(poll); window.clearTimeout(finish); synth.removeEventListener('voiceschanged', refresh); window.removeEventListener('storage', sync); };
  }, [player]);
  function selectVoice(language: UiLanguage, id: string) {
    if (id && !rankedVoices(voices, language).some(voice => voiceId(voice) === id)) return;
    player.stop(); const next = { ...preferences, [language]: id }; setPreferences(next); setStorageFailed(!writeVoicePreferences(next));
  }
  function speak(entries: readonly SpeechEntry[], id: string) {
    player.toggle(entries.map(entry => ({ ...entry, voice: entry.voice ?? preferences[entry.language] })), id);
  }
  const c = practiceSpeechCopy(uiLanguage); const names = { ru: t.russian, de: t.german, en: t.english };
  const current = playback; const notices: string[] = [];
  if (current.issue) {
    const kind = current.issue.kind;
    notices.push(kind === 'unsupported' ? t.practiceSpeechUnavailable : kind === 'blocked' ? c.blocked : kind === 'network' ? c.network : kind === 'timeout' ? c.timeout : t.practiceSpeechError);
  }
  if (current.missing.length) notices.push(`${t.practiceVoiceMissing} ${current.missing.map(language => names[language]).join(', ')}. ${c.install}`);
  if (current.fallback.length) notices.push(`${c.fallback} ${current.fallback.map(language => names[language]).join(', ')}.`);
  if (current.phase === 'loading') notices.push(c.loading);
  if (storageFailed) notices.push(c.storage);
  return { activeId: current.id, playbackState: current.phase, notice: notices.join(' '), speak, stop: () => player.stop(), voices, preferences, selectVoice };
}
