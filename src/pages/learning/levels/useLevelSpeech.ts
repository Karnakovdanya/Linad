import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearningLanguage } from '../../../domain/types';
import { usePreferences } from '../../../app/preferences-context';
import { selectPracticeVoice as selectVoice, waitForPracticeVoices as waitForVoices, practiceSpeechLocale as voiceLocale } from '../practice/speech';

export function useLevelSpeech(language: LearningLanguage) {
  const { t } = usePreferences();
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const control = useRef<AbortController | null>(null);
  const held = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    function check() { try { setAvailable(Boolean(selectVoice(synth.getVoices(), language))); } catch { setAvailable(false); } }
    synth.addEventListener('voiceschanged', check); check();
    return () => { synth.removeEventListener('voiceschanged', check); control.current?.abort(); synth.cancel(); held.current = null; };
  }, [language]);
  const stop = useCallback(() => { control.current?.abort(); window.speechSynthesis?.cancel(); held.current = null; setBusy(false); }, []);
  async function say(value: string, onEnd?: () => void) {
    stop(); setNotice('');
    const synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') { setNotice(t.levelsVoiceMissing); return; }
    const request = new AbortController(); control.current = request; setBusy(true);
    try {
      const voices = await waitForVoices(synth, [language], request.signal);
      if (request.signal.aborted) return;
      const voice = selectVoice(voices, language);
      if (!voice) { setAvailable(false); setBusy(false); setNotice(t.levelsVoiceMissing); return; }
      setAvailable(true);
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.voice = voice; utterance.lang = voiceLocale(language, voice); utterance.rate = .9;
      held.current = utterance;
      utterance.onend = () => { if (!request.signal.aborted) { setBusy(false); held.current = null; onEnd?.(); } };
      utterance.onerror = () => { if (!request.signal.aborted) { setBusy(false); held.current = null; setNotice(t.levelsSpeechError); } };
      if (synth.paused) synth.resume();
      synth.speak(utterance);
    } catch { if (!request.signal.aborted) { setBusy(false); setNotice(t.levelsSpeechError); } }
  }
  return { available, busy, notice, say, stop };
}
