import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { UiLanguage } from '../src/domain/types';
import type { PracticeMaterial } from '../src/pages/learning/practice/data/types';
import { doctorMaterials } from '../src/pages/learning/practice/data/doctor-materials';
import { practiceSpeechLocale, selectPracticeVoice, waitForPracticeVoices } from '../src/pages/learning/practice/speech';
import { messages } from '../src/i18n/messages';
import { currentProtectedSources } from './protected-source';

mkdirSync('qa/doctor', { recursive: true });
const situations = [
  ['appointment', 'practiceAppointment', 'practiceAppointmentIntro'], ['describe-symptoms', 'practiceSymptoms', 'practiceSymptomsIntro'],
  ['doctor-visit', 'practiceVisit', 'practiceVisitIntro'], ['treatment-medicine', 'practiceTreatment', 'practiceTreatmentIntro'],
  ['test-results', 'practiceResults', 'practiceResultsIntro'], ['emergency-help', 'practiceEmergency', 'practiceEmergencyIntro'],
] as const;
const languages = ['ru', 'de', 'en'] as const;
const route = (id: string) => `/#/learn/de/situations/doctor/${id}`;

test('all six editorial drafts have 15 phrases, 3 dialogues of 4–8 lines, 20 words and complete translations', () => {
  let review = '# Врач и здоровье — черновик RU / DE / EN\n\nМатериалы для проверки. Конкретные схемы лечения и дозы не назначаются.\n';
  const phraseSets = new Set<string>();
  for (const [id, key] of situations) {
    const material: PracticeMaterial = doctorMaterials[id];
    expect(material.status).toBe('draft');
    expect(material.phrases, id).toHaveLength(15); expect(material.dialogues, id).toHaveLength(3); expect(material.words, id).toHaveLength(20);
    for (const items of [material.phrases, material.dialogues, material.words]) expect(new Set(items.map(item => item.id)).size, id).toBe(items.length);
    phraseSets.add(JSON.stringify(material.phrases.map(entry => entry.text)));
    for (const dialogue of material.dialogues) {
      expect(dialogue.lines.length, dialogue.id).toBeGreaterThanOrEqual(4); expect(dialogue.lines.length, dialogue.id).toBeLessThanOrEqual(8);
      expect(new Set(dialogue.lines.map(line => line.speaker)).size).toBeGreaterThanOrEqual(2);
    }
    for (const text of [...material.phrases, ...material.words, ...material.dialogues.flatMap(dialogue => [{ text: dialogue.title }, ...dialogue.lines])].map(entry => entry.text)) {
      for (const language of languages) expect(text[language].trim().length, `${id}/${language}`).toBeGreaterThan(2);
      expect(text.de).not.toContain('ß');
    }
    review += `\n## ${messages.ru[key]}\n\n### Фразы\n\n| № | RU | DE | EN |\n|---|---|---|---|\n`;
    for (const [index, entry] of material.phrases.entries()) review += `| ${index + 1} | ${entry.text.ru} | ${entry.text.de} | ${entry.text.en} |\n`;
    review += '\n### Диалоги\n';
    for (const dialogue of material.dialogues) {
      review += `\n#### ${dialogue.title.ru} / ${dialogue.title.de} / ${dialogue.title.en}\n\n| Роль | RU | DE | EN |\n|---|---|---|---|\n`;
      for (const line of dialogue.lines) review += `| ${line.speaker} | ${line.text.ru} | ${line.text.de} | ${line.text.en} |\n`;
    }
    review += '\n### Слова\n\n| RU | DE | EN |\n|---|---|---|\n';
    for (const entry of material.words) review += `| ${entry.text.ru} | ${entry.text.de} | ${entry.text.en} |\n`;
  }
  expect(phraseSets.size).toBe(6);
  writeFileSync('qa/doctor/materials-review.md', review);
});

test('author, original symptoms, all other pages and existing design stay unchanged', () => {
  const baseline: Record<string, string> = JSON.parse(readFileSync('qa/doctor/protected-before.json', 'utf8').replace(/^\uFEFF/, ''));
  const allowed = new Set(['src/pages/learning/practice/data/types.ts', 'src/pages/learning/practice/PracticePanels.tsx']);
  const changed = Object.entries(currentProtectedSources(baseline)).filter(([file, hash]) => !allowed.has(file) && createHash('sha256').update(readFileSync(file)).digest('hex') !== hash).map(([file]) => file);
  expect(changed).toEqual([]);
  const css = readFileSync('src/styles/practice.css', 'utf8');
  const dark = css.split('\n').find(line => line.startsWith('.practice-workspace .practice-banner::after'))!;
  const light = css.split('\n').find(line => line.startsWith(":root[data-theme='light'] .practice-workspace .practice-banner::after"))!;
  expect(dark).toContain('var(--surface) 60%'); expect(light).toContain('var(--surface) 50%'); expect(light).not.toContain('var(--surface) 10%');
  writeFileSync('qa/doctor/protected-audit.json', JSON.stringify({ protected: Object.keys(baseline).length - allowed.size, changed, symptomsPreserved: true }, null, 2));
});

test('voice selection prefers ru-RU, de-DE and en-GB, with English US and same-language fallbacks', async () => {
  const voices = ['en-US', 'de-CH', 'ru-RU', 'de-DE', 'en-GB'].map(lang => ({ lang, name: lang }) as SpeechSynthesisVoice);
  expect(selectPracticeVoice(voices, 'de')!.lang).toBe('de-DE'); expect(selectPracticeVoice(voices, 'en')!.lang).toBe('en-GB');
  expect(selectPracticeVoice(voices.filter(voice => voice.lang !== 'en-GB'), 'en')!.lang).toBe('en-US');
  expect(selectPracticeVoice(voices.filter(voice => voice.lang.startsWith('ru')), 'de')).toBeUndefined();
  expect(practiceSpeechLocale('de', voices[1]!)).toBe('de-DE'); expect(practiceSpeechLocale('en', voices[0]!)).toBe('en-US');
  const events = new EventTarget(); let loaded = voices.filter(voice => voice.lang === 'ru-RU');
  const synth = Object.assign(events, { getVoices: () => loaded }) as unknown as SpeechSynthesis;
  let resolved = false;
  const loading = waitForPracticeVoices(synth, ['de'], new AbortController().signal, 200).then(result => { resolved = true; return result; });
  loaded = voices.filter(voice => voice.lang === 'ru-RU' || voice.lang === 'en-US'); synth.dispatchEvent(new Event('voiceschanged'));
  await Promise.resolve(); expect(resolved).toBe(false);
  loaded = voices; synth.dispatchEvent(new Event('voiceschanged'));
  expect(selectPracticeVoice(await loading, 'de')!.lang).toBe('de-DE');
  const controller = new AbortController(); loaded = [];
  const aborted = waitForPracticeVoices(synth, ['de'], controller.signal, 10_000); controller.abort();
  expect(await aborted).toEqual([]);
});

for (const uiLanguage of languages) for (const theme of ['light', 'dark'] as const) {
  test(`six complete situations and unchanged layout: ${uiLanguage} ${theme}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript(({ uiLanguage, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage, theme, learningLanguage: 'de' })), { uiLanguage, theme });
    const t = messages[uiLanguage];
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(route('appointment'));
    for (const [id, titleKey, introKey] of situations) {
      const material: PracticeMaterial = doctorMaterials[id];
      await page.locator('.practice-situation-nav').getByRole('link', { name: t[titleKey], exact: true }).click();
      await expect(page.locator('h1')).toHaveText(t[titleKey]); await expect(page).toHaveTitle(`${t[titleKey]} | LINAD`);
      await expect(page.locator('.practice-banner-copy > p')).toHaveText(t[introKey]);
      await expect(page.locator('.practice-panel')).toHaveCount(3); await expect(page.locator('.practice-empty')).toHaveCount(0);
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (uiLanguage === 'ru' && (width === 1440 || id === 'emergency-help')) await page.screenshot({ path: `qa/doctor/${id}-${width}-${theme}.png`, fullPage: true });
      }
      await page.locator('.practice-phrases .practice-more').click(); await page.locator('.practice-words .practice-more').click();
      await expect(page.locator('.practice-phrase-row')).toHaveCount(15); await expect(page.locator('.practice-word-table tbody tr')).toHaveCount(20);
      for (const [index, entry] of material.phrases.entries()) for (const language of languages) await expect(page.locator('.practice-phrase-row').nth(index).locator(`[lang="${language}"]`)).toHaveText(entry.text[language]);
      for (const [index, dialogue] of material.dialogues.entries()) {
        const button = page.locator('.practice-dialogue-heading h3 button').nth(index);
        if (await button.getAttribute('aria-expanded') === 'false') await button.click();
        const lines = page.locator('.practice-dialogue-body').nth(index).locator('.practice-dialogue-line');
        await expect(lines).toHaveCount(dialogue.lines.length);
        for (const [lineIndex, line] of dialogue.lines.entries()) for (const language of languages) await expect(lines.nth(lineIndex).locator(`[lang="${language}"]`)).toHaveText(line.text[language]);
      }
      for (const [index, entry] of material.words.entries()) for (const language of languages) await expect(page.locator('.practice-word-table tbody tr').nth(index).locator(`[lang="${language}"]`)).toHaveText(entry.text[language]);
    }
    expect(errors).toEqual([]);
  });
}

interface RecordedSpeech { text: string; lang: string; voice: string }
async function mockSpeech(page: Page) {
  await page.addInitScript(() => {
    class Utterance { text: string; lang = ''; voice: { lang: string } | null = null; rate = 1; onend: (() => void) | null = null; onerror: ((event: { error: string }) => void) | null = null; constructor(text: string) { this.text = text; } }
    const state = { voices: ['ru-RU', 'de-CH', 'en-US', 'de-DE', 'en-GB'], spoken: [] as { text: string; lang: string; voice: string }[], canceled: 0, paused: false, resumed: 0 };
    const synth = Object.assign(new EventTarget(), { getVoices: () => state.voices.map(lang => ({ lang, name: lang })),
      cancel: () => { state.canceled++; }, resume: () => { state.resumed++; state.paused = false; },
      speak: (utterance: Utterance) => { state.spoken.push({ text: utterance.text, lang: utterance.lang, voice: utterance.voice!.lang }); setTimeout(() => utterance.onend?.(), 0); },
    });
    Object.defineProperty(synth, 'paused', { get: () => state.paused });
    Object.defineProperty(window, '__doctorAudio', { value: state });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: synth });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: Utterance });
  });
}
async function onlyLanguage(page: Page, language: UiLanguage) {
  // Turn the desired language on first, so the minimum-one rule is never violated.
  const target = page.locator('.practice-language-button').nth(languages.indexOf(language));
  if (await target.getAttribute('aria-pressed') !== 'true') await target.click();
  for (const candidate of languages) {
    const button = page.locator('.practice-language-button').nth(languages.indexOf(candidate));
    if (candidate !== language && await button.getAttribute('aria-pressed') === 'true') await button.click();
  }
}

for (const language of languages) test(`every phrase, word and dialogue line speaks the correct ${language} text`, async ({ page }) => {
  test.setTimeout(180_000);
  await mockSpeech(page); await page.goto(route('appointment')); await onlyLanguage(page, language);
  const expected: RecordedSpeech[] = [];
  const locale = { ru: 'ru-RU', de: 'de-DE', en: 'en-GB' }[language];
  for (const [id] of situations) {
    const material: PracticeMaterial = doctorMaterials[id];
    await page.goto(route(id));
    await page.locator('.practice-phrases .practice-more').click(); await page.locator('.practice-words .practice-more').click();
    for (const [index, entry] of material.phrases.entries()) {
      await page.locator('.practice-phrase-row').nth(index).locator('.practice-listen').click();
      expected.push({ text: entry.text[language], lang: locale, voice: locale });
    }
    for (const [index, entry] of material.words.entries()) {
      await page.locator('.practice-word-table tbody tr').nth(index).locator('.practice-listen').click();
      expected.push({ text: entry.text[language], lang: locale, voice: locale });
    }
    for (const [index, dialogue] of material.dialogues.entries()) {
      const button = page.locator('.practice-dialogue-heading h3 button').nth(index);
      if (await button.getAttribute('aria-expanded') === 'false') await button.click();
      for (const [lineIndex, line] of dialogue.lines.entries()) {
        await page.locator('.practice-dialogue-body').nth(index).locator('.practice-listen').nth(lineIndex).click();
        expected.push({ text: line.text[language], lang: locale, voice: locale });
      }
    }
    const recorded = await page.evaluate(() => (window as unknown as { __doctorAudio: { spoken: RecordedSpeech[] } }).__doctorAudio.spoken);
    // Hash navigation keeps the same browser document and audio queue history.
    expect(recorded).toEqual(expected);
    await expect(page.locator(`[data-translation-language]:not([data-translation-language="${language}"])`)).toHaveCount(0);
  }
});

test('late German voices are awaited even when Russian is already loaded; English US fallback and paused queues work', async ({ page }) => {
  await mockSpeech(page); await page.goto(route('describe-symptoms'));
  await page.evaluate(() => { (window as unknown as { __doctorAudio: { voices: string[] } }).__doctorAudio.voices = ['ru-RU']; });
  const german = page.locator('.practice-phrase-row').first().locator('.practice-translation').nth(1).locator('button');
  await german.click();
  await expect(german).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => { const state = (window as unknown as { __doctorAudio: { voices: string[] } }).__doctorAudio; state.voices.push('en-US'); speechSynthesis.dispatchEvent(new Event('voiceschanged')); });
  expect(await page.evaluate(() => (window as unknown as { __doctorAudio: { spoken: unknown[] } }).__doctorAudio.spoken.length)).toBe(0);
  await page.evaluate(() => { const state = (window as unknown as { __doctorAudio: { voices: string[] } }).__doctorAudio; state.voices.push('de-DE'); speechSynthesis.dispatchEvent(new Event('voiceschanged')); });
  await expect.poll(async () => page.evaluate(() => (window as unknown as { __doctorAudio: { spoken: unknown[] } }).__doctorAudio.spoken.length)).toBe(1);
  await page.evaluate(() => { (window as unknown as { __doctorAudio: { paused: boolean } }).__doctorAudio.paused = true; });
  await page.locator('.practice-phrase-row').first().locator('.practice-translation').nth(2).locator('button').click();
  const last = await page.evaluate(() => { const state = (window as unknown as { __doctorAudio: { spoken: RecordedSpeech[]; resumed: number } }).__doctorAudio; return { spoken: state.spoken.at(-1), resumed: state.resumed }; });
  expect(last.spoken).toMatchObject({ lang: 'en-US', voice: 'en-US' }); expect(last.resumed).toBe(1);
});

test('canceling a pending voice request prevents late playback and stale missing-voice messages', async ({ page }) => {
  await mockSpeech(page); await page.goto(route('describe-symptoms'));
  await page.evaluate(() => { (window as unknown as { __doctorAudio: { voices: string[] } }).__doctorAudio.voices = ['ru-RU']; });
  const german = page.locator('.practice-phrase-row').first().locator('.practice-translation').nth(1).locator('button');
  await german.click(); await expect(german).toHaveAttribute('aria-pressed', 'true');
  await german.click(); await expect(german).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => { (window as unknown as { __doctorAudio: { voices: string[] } }).__doctorAudio.voices.push('de-DE'); speechSynthesis.dispatchEvent(new Event('voiceschanged')); });
  expect(await page.evaluate(() => (window as unknown as { __doctorAudio: { spoken: unknown[] } }).__doctorAudio.spoken.length)).toBe(0);
  await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceVoiceMissing })).toHaveCount(0);
});

test('native browser speech or a clear missing-voice result is verified for RU/DE/EN in all three blocks', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(route('describe-symptoms'));
  const voices = await page.evaluate(async () => {
    speechSynthesis.getVoices(); await new Promise(resolve => setTimeout(resolve, 1500));
    return speechSynthesis.getVoices().map(voice => ({ name: voice.name, lang: voice.lang, localService: voice.localService }));
  });
  await page.evaluate(() => {
    const state = { events: [] as string[] };
    Object.defineProperty(window, '__nativeDoctor', { value: state });
    const speak = speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak = utterance => {
      utterance.addEventListener('start', () => state.events.push('start'));
      utterance.addEventListener('end', () => state.events.push('end'));
      utterance.addEventListener('error', event => state.events.push(`error:${event.error}`));
      speak(utterance);
    };
  });
  const results: { language: string; block: string; events: string[]; voiceAvailable: boolean }[] = [];
  for (const language of languages) {
    await onlyLanguage(page, language);
    const available = voices.some(voice => voice.lang.toLowerCase().startsWith(language));
    for (const [block, selector] of [['phrases', '.practice-phrases .practice-listen'], ['words', '.practice-words .practice-listen'], ['dialogue-line', '.practice-dialogue-body:visible .practice-listen']] as const) {
      await page.evaluate(() => { (window as unknown as { __nativeDoctor: { events: string[] } }).__nativeDoctor.events = []; });
      const button = page.locator(selector).first(); await button.click();
      if (available) {
        await expect.poll(async () => page.evaluate(() => (window as unknown as { __nativeDoctor: { events: string[] } }).__nativeDoctor.events.some(event => event === 'end' || event.startsWith('error:'))), { timeout: 15_000 }).toBe(true);
      } else {
        await expect(button).toHaveAttribute('aria-pressed', 'false');
        await expect(page.getByRole('status').filter({ hasText: messages.ru.practiceVoiceMissing })).toBeVisible();
      }
      const events = await page.evaluate(() => (window as unknown as { __nativeDoctor: { events: string[] } }).__nativeDoctor.events);
      if (available) { expect(events).toContain('start'); expect(events).toContain('end'); }
      else expect(events).toEqual([]);
      results.push({ language, block, events, voiceAvailable: available });
    }
  }
  writeFileSync('qa/doctor/native-speech.json', JSON.stringify({ voices, results }, null, 2));
});
