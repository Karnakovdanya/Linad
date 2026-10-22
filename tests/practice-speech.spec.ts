import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { BrowserSpeech, type PlaybackState } from '../src/speech/browser-speech';
import { chooseVoice, rankedVoices, speechLocale, voiceId, waitForVoice } from '../src/speech/voices';
import { VOICE_PREFERENCES_KEY } from '../src/speech/voice-preferences';
import { symptomsMaterial } from '../src/pages/learning/practice/data/symptoms';
import { messages } from '../src/i18n/messages';
import type { UiLanguage } from '../src/domain/types';
import { approvedTutorSources, assertApprovedInventory } from './protected-source';
import { expectNativeSpeechOutcome } from './native-speech-outcome';

mkdirSync('qa/practice-speech', { recursive: true });
const route = '/#/learn/de/situations/doctor/describe-symptoms';
const languages = ['ru', 'de', 'en'] as const;
const voice = (name: string, lang: string, localService = true, isDefault = false) => ({ name, lang, localService, default: isDefault, voiceURI: name }) as SpeechSynthesisVoice;
const testVoices = [voice('Irina', 'ru-RU', true, true), voice('Pavel', 'ru-RU'), voice('RU Natural', 'ru-RU', false), voice('DE Natural', 'de-DE', false), voice('DE Local', 'de-DE'), voice('EN Neural', 'en-GB', false), voice('EN Local', 'en-US')];
interface Utterance { text: string; lang: string; voice: SpeechSynthesisVoice | null; rate: number; pitch: number; volume: number; onstart: (() => void) | null; onend: (() => void) | null; onerror: ((event: { error: string }) => void) | null }
function driver(voices = testVoices, limits = {}) {
  const calls: Utterance[] = []; const states: PlaybackState[] = []; let canceled = 0; let resumed = 0;
  const synth = Object.assign(new EventTarget(), { paused: false, speaking: false, pending: false, getVoices: () => voices,
    cancel() { canceled++; }, resume() { resumed++; this.paused = false; }, speak(utterance: Utterance) { calls.push(utterance); },
  });
  const player = new BrowserSpeech({ synth: synth as unknown as SpeechSynthesis, createUtterance: text => ({ text, lang: '', voice: null, rate: 1, pitch: 1, volume: 1, onstart: null, onend: null, onerror: null }) as unknown as SpeechSynthesisUtterance, voiceWaitMs: 20, ...limits }, state => states.push(state));
  return { player, calls, states, synth, get canceled() { return canceled; }, get resumed() { return resumed; } };
}

test('quality hints apply only after language filtering; manual voices and locale preferences remain language-safe', () => {
  expect(chooseVoice(testVoices, 'ru')!.name).toBe('RU Natural'); expect(chooseVoice(testVoices, 'de')!.name).toBe('DE Natural'); expect(chooseVoice(testVoices, 'en')!.name).toBe('EN Neural');
  expect(chooseVoice(testVoices, 'ru', voiceId(testVoices[1]!))!.name).toBe('Pavel');
  expect(chooseVoice(testVoices, 'de', voiceId(testVoices[0]!))!.name).toBe('DE Natural');
  expect(chooseVoice(testVoices.filter(voice => voice.lang.startsWith('ru')), 'de')).toBeUndefined();
  expect(chooseVoice([voice('Misleading German Natural', 'ru-RU'), voice('Ordinary German', 'de-DE')], 'de')!.name).toBe('Ordinary German');
  expect(chooseVoice([voice('US', 'en-US'), voice('UK', 'en-GB')], 'en')!.lang).toBe('en-GB');
  expect(speechLocale('ru', testVoices[0]!)).toBe('ru-RU'); expect(speechLocale('de', testVoices[3]!)).toBe('de-DE'); expect(speechLocale('en', testVoices[6]!)).toBe('en-US');
  expect(chooseVoice([voice('Deutsch', 'de_DE')], 'de')!.lang).toBe('de_DE'); expect(rankedVoices([testVoices[0]!, testVoices[0]!], 'ru')).toHaveLength(1);
});

test('late voices load after RU, including when voiceschanged is missing; aborted waits never play later', async () => {
  let voices = [testVoices[0]!]; const events = Object.assign(new EventTarget(), { getVoices: () => voices }); const synth = events as unknown as SpeechSynthesis;
  const abort = new AbortController(); let resolved = false;
  const pending = waitForVoice(synth, 'de', abort.signal, 500).then(result => { resolved = true; return result; });
  events.dispatchEvent(new Event('voiceschanged')); await Promise.resolve(); expect(resolved).toBe(false);
  voices = [...voices, testVoices[3]!]; // No event: polling must notice it.
  expect(chooseVoice(await pending, 'de')!.name).toBe('DE Natural');
  voices = []; const canceled = new AbortController(); const waiting = waitForVoice(synth, 'en', canceled.signal, 5000); canceled.abort();
  await expect(waiting).rejects.toMatchObject({ name: 'AbortError' });
  const alreadyCanceled = new AbortController(); alreadyCanceled.abort(); await expect(waitForVoice(synth, 'ru', alreadyCanceled.signal)).rejects.toMatchObject({ name: 'AbortError' });
  let reads = 0;
  const finalRead = Object.assign(new EventTarget(), { getVoices: () => ++reads === 1 ? [] : [testVoices[3]!] }) as unknown as SpeechSynthesis;
  expect(chooseVoice(await waitForVoice(finalRead, 'de', new AbortController().signal, 10), 'de')!.lang).toBe('de-DE');
});

test('original text, three explicit languages and natural rate/pitch/volume reach the synthesis engine', async () => {
  const d = driver(); const texts = ['Головная боль. Как вы себя чувствуете?', 'Grüße! Möchten Sie fünf Bücher?', 'I feel better, thank you.'];
  d.player.toggle(languages.map((language, i) => ({ language, text: texts[i]! })), 'queue');
  for (let i = 0; i < 3; i++) {
    await expect.poll(() => d.calls.length).toBe(i + 1); const utterance = d.calls[i]!;
    expect(utterance.text).toBe(texts[i]); expect(utterance.lang).toBe(['ru-RU', 'de-DE', 'en-GB'][i]); expect(utterance.voice!.lang.split('-')[0]).toBe(languages[i]);
    expect([utterance.rate, utterance.pitch, utterance.volume]).toEqual([.98, 1, 1]); utterance.onstart?.(); utterance.onend?.();
  }
  await expect.poll(() => d.player.snapshot.phase).toBe('idle'); expect(d.player.snapshot.id).toBeNull(); d.player.dispose();
});

test('rapid switching, repeated click, explicit stop and stale end/error callbacks cannot revive an old queue', async () => {
  const d = driver(); d.player.toggle([{ text: 'Привет.', language: 'ru' }, { text: 'Не произносить.', language: 'ru' }], 'ru');
  const oldEnd = d.calls[0]!.onend!; const oldError = d.calls[0]!.onerror!;
  d.player.toggle([{ text: 'Hallo.', language: 'de' }], 'de'); d.player.toggle([{ text: 'Hello.', language: 'en' }], 'en');
  oldEnd(); oldError({ error: 'synthesis-failed' });
  await expect.poll(() => d.calls.length).toBe(2); expect(d.calls[1]!.lang).toBe('en-GB');
  d.player.toggle([{ text: 'Hello.', language: 'en' }], 'en'); expect(d.player.snapshot.id).toBeNull();
  d.player.toggle([{ text: 'Hallo.', language: 'de' }], 'de'); expect(d.player.snapshot.id).toBe('de'); d.player.stop(); expect(d.player.snapshot.phase).toBe('idle');
  expect(d.canceled).toBeGreaterThanOrEqual(5); d.player.dispose();
});

test('missing language never falls back to Russian; a new click can use a later installed voice', async () => {
  const d = driver([testVoices[0]!]); d.player.toggle([{ text: 'Hallo.', language: 'de' }], 'de');
  await expect.poll(() => d.player.snapshot.id).toBeNull(); expect(d.calls).toHaveLength(0); expect(d.player.snapshot.missing).toEqual(['de']);
  d.synth.getVoices = () => testVoices; d.synth.dispatchEvent(new Event('voiceschanged'));
  d.player.toggle([{ text: 'Hallo.', language: 'de' }], 'de'); expect(d.calls[0]!.lang).toBe('de-DE'); d.player.dispose();
});

test('failed natural voice retries only another same-language voice; blocked audio releases the button', async () => {
  const d = driver(); d.player.toggle([{ text: 'Боль.', language: 'ru' }], 'ru');
  expect(d.calls[0]!.voice!.name).toBe('RU Natural'); d.calls[0]!.onerror?.({ error: 'network' });
  await expect.poll(() => d.calls.length).toBe(2); expect(d.calls[1]!.voice!.lang).toBe('ru-RU'); expect(d.player.snapshot.fallback).toEqual(['ru']);
  d.calls[1]!.onend?.(); await expect.poll(() => d.player.snapshot.id).toBeNull();
  d.player.toggle([{ text: 'Hello.', language: 'en' }], 'en'); d.calls.at(-1)!.onerror?.({ error: 'not-allowed' });
  expect(d.player.snapshot).toMatchObject({ id: null, phase: 'error', issue: { kind: 'blocked' } }); d.player.dispose();
});

test('silent and never-ending engines, throwing APIs and absent API produce recoverable errors', async () => {
  const silent = driver([testVoices[0]!], { startTimeoutMs: 10, endTimeoutMs: 20 }); silent.player.toggle([{ text: 'Привет.', language: 'ru' }], 'silent');
  await expect.poll(() => silent.player.snapshot.phase).toBe('error'); expect(silent.player.snapshot.issue?.kind).toBe('timeout'); expect(silent.player.snapshot.id).toBeNull();
  silent.player.toggle([{ text: 'Снова.', language: 'ru' }], 'retry'); expect(silent.calls).toHaveLength(2); silent.calls[1]!.onend?.(); await expect.poll(() => silent.player.snapshot.id).toBeNull(); silent.player.dispose();
  const endless = driver([testVoices[0]!], { startTimeoutMs: 10, endTimeoutMs: 20 }); endless.player.toggle([{ text: 'Привет.', language: 'ru' }], 'endless'); endless.calls[0]!.onstart?.();
  await expect.poll(() => endless.player.snapshot.issue?.code).toBe('end-timeout'); endless.player.dispose();
  const throwing = driver(); throwing.synth.getVoices = () => { throw new Error('Unavailable'); }; throwing.player.toggle([{ text: 'Hallo.', language: 'de' }], 'throw'); expect(throwing.player.snapshot.phase).toBe('error'); throwing.player.dispose();
  const none = new BrowserSpeech({}, () => {}); none.toggle([{ text: 'Hello.', language: 'en' }], 'none'); expect(none.snapshot.issue?.kind).toBe('unsupported'); none.dispose();
});

async function mockSpeech(page: Page, hold = false) {
  await page.addInitScript(({ voices, hold }) => {
    class Utterance { text: string; lang = ''; voice: typeof voices[number] | null = null; rate = 1; pitch = 1; volume = 1; onstart: (() => void) | null = null; onend: (() => void) | null = null; onerror: ((event: { error: string }) => void) | null = null; constructor(text: string) { this.text = text; } }
    const state = { voices, hold, spoken: [] as { text: string; lang: string; voice: string; rate: number; pitch: number; volume: number }[], canceled: 0, active: null as Utterance | null, maxConcurrent: 0, error: '' };
    const synth = Object.assign(new EventTarget(), { getVoices: () => state.voices, cancel() { state.canceled++; state.active = null; }, speak(utterance: Utterance) {
      state.maxConcurrent = Math.max(state.maxConcurrent, state.active ? 2 : 1); state.active = utterance;
      state.spoken.push({ text: utterance.text, lang: utterance.lang, voice: utterance.voice!.name, rate: utterance.rate, pitch: utterance.pitch, volume: utterance.volume });
      setTimeout(() => { if (state.active !== utterance) return; if (state.error) { state.active = null; utterance.onerror?.({ error: state.error }); return; } utterance.onstart?.(); if (!state.hold) setTimeout(() => { if (state.active !== utterance) return; state.active = null; utterance.onend?.(); }, 15); }, 0);
    } });
    Object.defineProperty(synth, 'speaking', { get: () => Boolean(state.active) });
    Object.defineProperty(window, '__speechQA', { value: state }); Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: Utterance }); Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: synth });
  }, { voices: testVoices.map(v => ({ name: v.name, lang: v.lang, voiceURI: v.voiceURI, default: v.default, localService: v.localService })), hold });
}
async function onlyLanguage(page: Page, language: UiLanguage) {
  const button = page.locator('.practice-language-button').nth(languages.indexOf(language)); if (await button.getAttribute('aria-pressed') !== 'true') await button.click();
  for (const other of languages.filter(other => other !== language)) { const otherButton = page.locator('.practice-language-button').nth(languages.indexOf(other)); if (await otherButton.getAttribute('aria-pressed') === 'true') await otherButton.click(); }
}

test('words, sentences and dialogue lines use their own RU/DE/EN voices independently of the English UI', async ({ page }) => {
  await mockSpeech(page); await page.addInitScript(() => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: 'en', theme: 'dark', learningLanguage: 'de' })));
  await page.goto(route); const expected: { text: string; lang: string; voice: string; rate: number; pitch: number; volume: number }[] = [];
  for (const language of languages) {
    await onlyLanguage(page, language);
    for (const [selector, text] of [['.practice-phrases .practice-listen', symptomsMaterial.phrases[0]!.text[language]], ['.practice-words .practice-listen', symptomsMaterial.words[0]!.text[language]], ['.practice-dialogue-body:visible .practice-listen', symptomsMaterial.dialogues[0]!.lines[0]!.text[language]]] as const) {
      await page.locator(selector).first().click(); expected.push({ text, lang: { ru: 'ru-RU', de: 'de-DE', en: 'en-GB' }[language], voice: { ru: 'RU Natural', de: 'DE Natural', en: 'EN Neural' }[language], rate: .98, pitch: 1, volume: 1 });
      await expect.poll(() => page.evaluate(() => (window as unknown as { __speechQA: { spoken: unknown[] } }).__speechQA.spoken)).toEqual(expected);
      await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
    }
  }
  expect(await page.evaluate(() => (window as unknown as { __speechQA: { maxConcurrent: number } }).__speechQA.maxConcurrent)).toBe(1);
});

test('manual voice is remembered; rapid switching, stop, hidden-language changes and navigation leave no active speech', async ({ page }) => {
  await mockSpeech(page, true); await page.goto(route); await page.locator('.practice-voice-settings summary').click();
  await page.locator('#practice-voice-ru').selectOption(voiceId(testVoices[1]!));
  const phrase = page.locator('.practice-phrase-row').first().locator('.practice-listen');
  await phrase.nth(0).click(); await expect(phrase.nth(0)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => (window as unknown as { __speechQA: { spoken: { voice: string }[] } }).__speechQA.spoken.at(-1)?.voice)).toBe('Pavel');
  await phrase.nth(1).click(); await phrase.nth(2).click(); await expect(phrase.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await phrase.nth(2).click(); await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
  await phrase.nth(0).click(); await page.locator('.practice-language-button').nth(2).click(); await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
  await page.locator('.practice-language-button').nth(2).click(); await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
  await page.reload(); await page.locator('.practice-voice-settings summary').click(); await expect(page.locator('#practice-voice-ru')).toHaveValue(voiceId(testVoices[1]!));
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).voices.ru, VOICE_PREFERENCES_KEY)).toBe(voiceId(testVoices[1]!));
  await page.locator('.practice-phrases .practice-listen').first().click(); await page.locator('.practice-situation-nav a').first().click(); await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { __speechQA: { maxConcurrent: number } }).__speechQA.maxConcurrent)).toBe(1);
});

test('delayed DE voices load, RU-only inventory gives installation help, and browser errors release controls', async ({ page }) => {
  await mockSpeech(page); await page.goto(route);
  await page.evaluate(() => { const state = (window as unknown as { __speechQA: { voices: { lang: string }[] } }).__speechQA; state.voices = state.voices.filter(v => v.lang === 'ru-RU'); speechSynthesis.dispatchEvent(new Event('voiceschanged')); });
  const german = page.locator('.practice-phrase-row').first().locator('.practice-listen').nth(1); await german.click(); await expect(german).toHaveAttribute('aria-busy', 'true');
  await page.evaluate(() => { const state = (window as unknown as { __speechQA: { voices: unknown[] } }).__speechQA; setTimeout(() => { state.voices.push({ name: 'Late DE Natural', lang: 'de-DE', voiceURI: 'late-de' }); speechSynthesis.dispatchEvent(new Event('voiceschanged')); }, 150); });
  await expect.poll(() => page.evaluate(() => (window as unknown as { __speechQA: { spoken: { lang: string }[] } }).__speechQA.spoken.at(-1)?.lang)).toBe('de-DE');
  await expect(german).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => { const state = (window as unknown as { __speechQA: { voices: { lang: string }[] } }).__speechQA; state.voices = state.voices.filter(v => v.lang === 'ru-RU'); speechSynthesis.dispatchEvent(new Event('voiceschanged')); });
  await german.click(); await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceVoiceMissing })).toContainText('Deutsch', { timeout: 6000 }); await expect(german).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => { (window as unknown as { __speechQA: { error: string } }).__speechQA.error = 'not-allowed'; });
  await page.locator('.practice-phrase-row').first().locator('.practice-listen').first().click(); await expect(page.locator('.practice-status').filter({ hasText: 'заблокировал' })).toBeVisible(); await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
});

test('advertised voices may all fail synthesis; fallback is bounded, the error is visible and retry recovers', async ({ page }) => {
  await mockSpeech(page); await page.goto(route);
  await page.evaluate(() => { (window as unknown as { __speechQA: { error: string } }).__speechQA.error = 'synthesis-failed'; });
  const button = page.locator('.practice-phrases .practice-listen').first();
  await button.click();
  await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceSpeechError })).toBeVisible();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.practice-listen[aria-busy="true"]')).toHaveCount(0);
  const failed = await page.evaluate(() => (window as unknown as { __speechQA: { spoken: { lang: string }[]; maxConcurrent: number } }).__speechQA);
  expect(failed.spoken).toHaveLength(3);
  expect(failed.spoken.every(call => call.lang === 'ru-RU')).toBe(true);
  expect(failed.maxConcurrent).toBe(1);
  await page.evaluate(() => { (window as unknown as { __speechQA: { error: string } }).__speechQA.error = ''; });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceSpeechError })).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { __speechQA: { spoken: unknown[] } }).__speechQA.spoken.length)).toBe(4);
});

test('voice settings fit mobile/tablet/desktop and both themes without changing the three panels', async ({ page }) => {
  await mockSpeech(page); const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['dark', 'light']) for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto(route); await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    await expect(page.locator('.practice-panel')).toHaveCount(3); if (await page.locator('.practice-voice-settings').getAttribute('open') === null) await page.locator('.practice-voice-settings summary').click(); await expect(page.locator('.practice-voice-settings select')).toHaveCount(3); await expect(page.locator('.practice-voice-settings select').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `qa/practice-speech/settings-${width}-${theme}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test('native Chrome: actual playback or honest recoverable synthesis failures with language-safe calls', async ({ page }) => {
  test.setTimeout(90_000); await page.goto(route); const voices = await page.evaluate(async () => { speechSynthesis.getVoices(); await new Promise(resolve => setTimeout(resolve, 1500)); return speechSynthesis.getVoices().map(v => ({ name: v.name, lang: v.lang, localService: v.localService })); });
  await page.evaluate(() => {
    const state = { events: [] as string[], calls: [] as { text: string; lang: string; voice: string }[] }; Object.defineProperty(window, '__nativeSpeechQA', { value: state }); const nativeSpeak = speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak = utterance => { state.calls.push({ text: utterance.text, lang: utterance.lang, voice: utterance.voice?.name ?? '' }); utterance.addEventListener('start', () => state.events.push('start')); utterance.addEventListener('end', () => state.events.push('end')); utterance.addEventListener('error', event => state.events.push(`error:${event.error}`)); nativeSpeak(utterance); };
  });
  const outcomes: unknown[] = [];
  for (const language of languages) {
    await onlyLanguage(page, language); const available = voices.some(v => v.lang.toLowerCase().startsWith(language));
    for (const block of ['phrases', 'words', 'dialogue-body'] as const) {
      await page.evaluate(() => { const state = (window as unknown as { __nativeSpeechQA: { events: string[]; calls: unknown[] } }).__nativeSpeechQA; state.events = []; state.calls = []; });
      const button = page.locator(`.practice-${block} .practice-listen`).first(); await button.click();
      if (available) await expect.poll(() => page.evaluate(() => (window as unknown as { __nativeSpeechQA: { events: string[] } }).__nativeSpeechQA.events.some(e => e === 'end' || e.startsWith('error:'))), { timeout: 20000 }).toBe(true);
      else await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceVoiceMissing })).toBeVisible({ timeout: 6000 });
      await expect(button).toHaveAttribute('aria-pressed', 'false');
      const recorded = await page.evaluate(() => (window as unknown as { __nativeSpeechQA: { events: string[]; calls: { lang: string }[] } }).__nativeSpeechQA);
      await expectNativeSpeechOutcome(page, recorded.events, available);
      if (available) { expect(recorded.calls.length).toBeGreaterThan(0); expect(recorded.calls.every(call => call.lang.startsWith(language))).toBe(true); }
      else expect(recorded.calls).toHaveLength(0);
      outcomes.push({ language, block, voiceAvailable: available, ...recorded });
    }
  }
  const pavel = voices.find(voice => voice.lang.startsWith('ru') && voice.name.includes('Pavel'));
  if (pavel) {
    await onlyLanguage(page, 'ru'); if (await page.locator('.practice-voice-settings').getAttribute('open') === null) await page.locator('.practice-voice-settings summary').click();
    const id = await page.locator('#practice-voice-ru option').filter({ hasText: pavel.name }).last().getAttribute('value'); await page.locator('#practice-voice-ru').selectOption(id!);
    await page.evaluate(() => { const state = (window as unknown as { __nativeSpeechQA: { events: string[]; calls: unknown[] } }).__nativeSpeechQA; state.events = []; state.calls = []; });
    await page.locator('.practice-words .practice-listen').first().click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { __nativeSpeechQA: { events: string[] } }).__nativeSpeechQA.events.some(event => event === 'end' || event.startsWith('error:'))), { timeout: 20000 }).toBe(true);
    await expect(page.locator('.practice-words .practice-listen').first()).toHaveAttribute('aria-pressed', 'false');
    const recorded = await page.evaluate(() => (window as unknown as { __nativeSpeechQA: { events: string[]; calls: { voice: string }[] } }).__nativeSpeechQA);
    expect(recorded.calls[0]?.voice).toBe(pavel.name); await expectNativeSpeechOutcome(page, recorded.events, true); outcomes.push({ language: 'ru', block: 'manual-Pavel-word', voiceAvailable: true, ...recorded });
  }
  writeFileSync('qa/practice-speech/native-playback.json', JSON.stringify({ browser: 'automated Chrome, separate profile', voices, outcomes, subjectiveAudioQualityChecked: false }, null, 2));
});

test('all 105 out-of-scope sources, all learning data, Header/Footer and Level learning remain unchanged', () => {
  const baseline: Record<string, string> = JSON.parse(readFileSync('qa/practice-speech/protected-before.json', 'utf8').replace(/^\uFEFF/, '')); const changed = Object.entries(approvedTutorSources(baseline)).filter(([path, hash]) => createHash('sha256').update(readFileSync(path)).digest('hex') !== hash).map(([path]) => path);
  expect(changed).toEqual([]);
  const tutorAdditions: string[] = JSON.parse(readFileSync('qa/tutors/added-sources.json', 'utf8'));
  const accountAdditions: string[] = JSON.parse(readFileSync('qa/account/added-sources.json', 'utf8'));
  const additions = ['src/speech/browser-speech.ts', 'src/speech/voices.ts', 'src/speech/voice-preferences.ts', 'src/i18n/practice-speech-messages.ts', 'src/pages/learning/practice/PracticeVoiceSettings.tsx', ...tutorAdditions, 'src/pages/tutors/useApplicationSubmission.ts', 'src/pages/tutors/web3forms.ts', ...accountAdditions];
  const integration: Record<string, string> = JSON.parse(readFileSync('qa/practice-speech/changed-before.json', 'utf8').replace(/^\uFEFF/, ''));
  const css = readFileSync('src/styles/practice.css'); const newStyles = css.indexOf(Buffer.from('.practice-workspace .practice-voice-settings'));
  expect(createHash('sha256').update(css.subarray(0, newStyles)).digest('hex')).toBe(integration['src/styles/practice.css']);
  assertApprovedInventory();
  writeFileSync('qa/practice-speech/protected-audit.json', JSON.stringify({ protected: Object.keys(baseline).length, changed, additions }, null, 2));
});
