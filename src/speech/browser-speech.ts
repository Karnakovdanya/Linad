import type { UiLanguage } from '../domain/types';
import { chooseVoice, rankedVoices, speechLocale, voiceId, VOICE_WAIT_MS, waitForVoice } from './voices';

export interface SpeechEntry { text: string; language: UiLanguage; voice?: string }
export interface SpeechIssue { kind: 'unsupported' | 'missing' | 'blocked' | 'network' | 'timeout' | 'error'; language?: UiLanguage; code?: string }
export interface PlaybackState {
  id: string | null; phase: 'idle' | 'loading' | 'speaking' | 'error';
  missing: UiLanguage[]; fallback: UiLanguage[]; issue?: SpeechIssue;
}
export interface SpeechHost {
  synth?: SpeechSynthesis; createUtterance?: (text: string) => SpeechSynthesisUtterance;
  voiceWaitMs?: number; startTimeoutMs?: number; endTimeoutMs?: number;
}
export const idlePlayback = (): PlaybackState => ({ id: null, phase: 'idle', missing: [], fallback: [] });

/** One owner, one utterance at a time. No React, UI-language detection, fetch or microphone. */
export class BrowserSpeech {
  private state = idlePlayback();
  private generation = 0;
  private request: AbortController | null = null;
  private held: SpeechSynthesisUtterance | null = null;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  constructor(private host: SpeechHost, private notify: (state: PlaybackState) => void) {}
  get snapshot() { return this.state; }
  private publish(next: PlaybackState) { this.state = next; this.notify(next); }
  private schedule(callback: () => void, delay: number) {
    const timer = setTimeout(() => { this.timers.delete(timer); callback(); }, delay); this.timers.add(timer); return timer;
  }
  private clearTimers() { this.timers.forEach(clearTimeout); this.timers.clear(); }
  private invalidate() {
    this.generation++; this.request?.abort(); this.request = null; this.clearTimers();
    if (this.held) { this.held.onstart = null; this.held.onend = null; this.held.onerror = null; }
    this.held = null;
    try { this.host.synth?.cancel(); } catch { /* State is released even when the engine cannot cancel. */ }
  }
  stop() { this.invalidate(); this.publish(idlePlayback()); }
  dispose() { this.invalidate(); this.state = idlePlayback(); }
  toggle(entries: readonly SpeechEntry[], id: string) {
    if (this.state.id === id) { this.stop(); return; }
    const wasPlaying = Boolean(this.state.id || this.host.synth?.speaking || this.host.synth?.pending);
    this.invalidate();
    const { synth, createUtterance } = this.host;
    if (!synth || !createUtterance) { this.publish({ ...idlePlayback(), phase: 'error', issue: { kind: 'unsupported' } }); return; }
    const queue = entries.filter(entry => entry.text.trim());
    if (!queue.length) { this.publish(idlePlayback()); return; }
    const generation = this.generation; const request = new AbortController(); this.request = request;
    const deadline = Date.now() + (this.host.voiceWaitMs ?? VOICE_WAIT_MS);
    const missing = new Set<UiLanguage>(); const fallback = new Set<UiLanguage>();
    const current = () => generation === this.generation && !request.signal.aborted;
    const update = (phase: PlaybackState['phase'], issue?: SpeechIssue) => {
      if (current()) this.publish({ id: phase === 'idle' || phase === 'error' ? null : id, phase, missing: [...missing], fallback: [...fallback], issue });
    };
    const fail = (language: UiLanguage, kind: SpeechIssue['kind'], code?: string) => {
      if (!current()) return;
      this.clearTimers(); if (this.held) { this.held.onstart = null; this.held.onend = null; this.held.onerror = null; } this.held = null;
      // Invalidate native callbacks before cancel(), which can emit synchronous errors.
      update('error', { kind, language, code }); this.generation++; request.abort(); this.request = null;
      try { synth.cancel(); } catch { /* Already released. */ }
    };
    const play = async (index: number): Promise<void> => {
      if (!current()) return;
      const entry = queue[index];
      if (!entry) { this.request = null; update('idle'); return; }
      if (missing.has(entry.language)) { void play(index + 1); return; }
      let voices: SpeechSynthesisVoice[];
      try {
        voices = synth.getVoices();
        if (!chooseVoice(voices, entry.language)) {
          update('loading'); voices = await waitForVoice(synth, entry.language, request.signal, Math.max(0, deadline - Date.now()));
        }
      } catch { if (current()) fail(entry.language, 'error', 'voice-list'); return; }
      if (!current()) return;
      const preferred = chooseVoice(voices, entry.language, entry.voice);
      if (!preferred) { missing.add(entry.language); void play(index + 1); return; }
      if (entry.voice && voiceId(preferred) !== entry.voice) fallback.add(entry.language);
      const candidates = [preferred, ...rankedVoices(voices, entry.language).filter(voice => voiceId(voice) !== voiceId(preferred))].slice(0, 3);
      const speakCandidate = (candidate: number) => {
        if (!current()) return;
        const voice = candidates[candidate]!;
        let utterance: SpeechSynthesisUtterance;
        try { utterance = createUtterance(entry.text); }
        catch { fail(entry.language, 'error', 'utterance'); return; }
        // Keep original punctuation, umlauts, ß and Cyrillic. Language is explicit per entry.
        utterance.voice = voice; utterance.lang = speechLocale(entry.language, voice);
        utterance.rate = .98; utterance.pitch = 1; utterance.volume = 1;
        this.held = utterance; let settled = false;
        const release = () => { clearTimeout(startTimer); clearTimeout(endTimer); this.timers.delete(startTimer); this.timers.delete(endTimer); utterance.onstart = null; utterance.onend = null; utterance.onerror = null; };
        const error = (code: string) => {
          if (!current() || settled) return; settled = true; release(); this.held = null;
          if (code === 'canceled' || code === 'interrupted') { this.request = null; update('idle'); return; }
          const retryable = ['network', 'voice-unavailable', 'language-unavailable', 'synthesis-failed', 'synthesis-unavailable', 'start-timeout'].includes(code);
          if (retryable && candidates[candidate + 1]) {
            fallback.add(entry.language);
            try { synth.cancel(); } catch { /* Try the next matching voice. */ }
            this.schedule(() => speakCandidate(candidate + 1), 0); return;
          }
          fail(entry.language, code === 'not-allowed' ? 'blocked' : code === 'network' ? 'network' : code.endsWith('timeout') ? 'timeout' : 'error', code);
        };
        utterance.onstart = () => { if (!current() || settled) return; clearTimeout(startTimer); this.timers.delete(startTimer); update('speaking'); };
        utterance.onend = () => {
          if (!current() || settled) return; settled = true; release(); this.held = null;
          // A new task avoids Chromium queue re-entrancy between utterances.
          this.schedule(() => { void play(index + 1); }, 0);
        };
        utterance.onerror = event => error(event.error);
        const startTimer = this.schedule(() => { if (!synth.speaking) error('start-timeout'); }, this.host.startTimeoutMs ?? 8000);
        const endTimer = this.schedule(() => error('end-timeout'), this.host.endTimeoutMs ?? Math.min(120_000, Math.max(15_000, entry.text.length * 180 + 10_000)));
        update('speaking');
        try { if (synth.paused) synth.resume(); synth.speak(utterance); }
        catch { error('synthesis-failed'); }
      };
      speakCandidate(0);
    };
    update('loading');
    if (wasPlaying) this.schedule(() => { void play(0); }, 0); else void play(0);
  }
}
