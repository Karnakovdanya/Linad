import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { messages } from '../src/i18n/messages';
import { symptomsMaterial } from '../src/pages/learning/practice/data/symptoms';
import { parsePracticePreferences, PRACTICE_STORAGE_KEY } from '../src/storage/practice';
import { currentProtectedSources } from './protected-source';

mkdirSync('qa/practice', { recursive: true });
const route = '/#/learn/de/situations/doctor/describe-symptoms';
const categories = [
  ['job-interview', 'practiceJob'], ['doctor', 'practiceDoctor'], ['travel', 'practiceTravel'], ['documents', 'practiceDocuments'],
  ['everyday-communication', 'practiceEveryday'], ['shopping', 'practiceShopping'], ['housing', 'practiceHousing'], ['banking-finance', 'practiceBanking'],
  ['sport-fitness', 'practiceSport'], ['education-learning', 'practiceEducation'],
] as const;

test('the review draft contains 15 phrases, 3 dialogues and 20 words, with three complete translations', () => {
  expect(symptomsMaterial.status).toBe('draft');
  expect(symptomsMaterial.phrases).toHaveLength(15);
  expect(symptomsMaterial.dialogues).toHaveLength(3);
  expect(symptomsMaterial.words).toHaveLength(20);
  for (const items of [symptomsMaterial.phrases, symptomsMaterial.words, symptomsMaterial.dialogues]) expect(new Set(items.map(item => item.id)).size).toBe(items.length);
  for (const dialogue of symptomsMaterial.dialogues) expect(new Set(dialogue.lines.map(line => line.speaker)).size).toBeGreaterThanOrEqual(2);
  for (const text of [...symptomsMaterial.phrases, ...symptomsMaterial.words, ...symptomsMaterial.dialogues.flatMap(dialogue => dialogue.lines)].map(item => item.text)) {
    for (const language of ['ru', 'de', 'en'] as const) expect(text[language].trim().length).toBeGreaterThan(2);
    expect(text.de).not.toContain('ß');
  }
});

test('Practice storage validates data without changing existing global preferences or allowing zero languages', () => {
  expect(parsePracticePreferences(null).preferences.visibleLanguages).toEqual(['ru', 'de', 'en']);
  for (const value of ['{broken', JSON.stringify({ version: 1, visibleLanguages: [], savedItems: [] }), JSON.stringify({ version: 2 })]) expect(parsePracticePreferences(value).warning).toBe('invalid');
  expect(parsePracticePreferences(JSON.stringify({ version: 1, visibleLanguages: ['de', 'de'], savedItems: [] })).preferences.visibleLanguages).toEqual(['de']);
  const baseline: Record<string, string> = JSON.parse(readFileSync('qa/practice/protected-before.json', 'utf8').replace(/^\uFEFF/, ''));
  for (const [file, hash] of Object.entries(currentProtectedSources(baseline))) expect(createHash('sha256').update(readFileSync(file)).digest('hex'), file).toBe(hash);
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) {
  test(`phrasebook layout and approved theme gradients: ${language} ${theme}`, async ({ page }) => {
    test.setTimeout(120_000);
    const t = messages[language];
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(({ language, theme }) => {
      if (!localStorage.getItem('linad.preferences.v1')) localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme, learningLanguage: 'en' }));
    }, { language, theme });
    await page.goto('/#/author');
    const authorGradient = await page.locator('.author-welcome').evaluate(node => getComputedStyle(node, '::after').backgroundImage);
    const header = await page.locator('.site-header').evaluate(node => { const clone = node.cloneNode(true) as HTMLElement; clone.querySelectorAll('.primary-nav a').forEach(link => { link.removeAttribute('aria-current'); link.classList.remove('active'); }); return clone.outerHTML; });
    const footer = await page.locator('.site-footer').evaluate(node => node.outerHTML);
    await page.goto(route);
    await expect(page.locator('h1')).toHaveText(t.practiceSymptoms);
    await expect(page).toHaveTitle(`${t.practiceSymptoms} | LINAD`);
    await expect(page.locator('.practice-situation-nav a')).toHaveCount(6);
    await expect(page.locator('.practice-panel')).toHaveCount(3);
    await expect(page.locator('.practice-phrase-row')).toHaveCount(6);
    await expect(page.locator('.practice-dialogue')).toHaveCount(3);
    await expect(page.locator('.practice-word-table tbody tr')).toHaveCount(12);
    await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(3);
    await page.locator('.practice-banner-photo').evaluate(node => (node as HTMLImageElement).decode());
    const gradient = await page.locator('.practice-banner').evaluate(node => getComputedStyle(node, '::after').backgroundImage);
    if (theme === 'dark') expect(gradient).toBe(authorGradient);
    else {
      expect(gradient).not.toBe(authorGradient);
      for (const opacity of ['0.9', '0.8', '0.5']) expect(gradient).toContain(`/ ${opacity})`);
      expect(gradient).toContain('27%'); expect(gradient).toContain('52%'); expect(gradient).toContain('76%');
      expect(gradient).toContain('rgba(0, 0, 0, 0) 100%');
    }
    await expect(page.locator('.practice-banner-photo')).toHaveAttribute('src', './assets/learning/situations/doctor.png');
    await expect(page.locator('.practice-banner-photo')).toHaveCSS('object-fit', 'cover');
    for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.mouse.move(0, 0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth)).toBe(true);
      const columns = await page.locator('.practice-panel').evaluateAll(nodes => nodes.map(node => { const box = node.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width }; }));
      expect(columns.filter(box => Math.abs(box.y - columns[0]!.y) < 1).length).toBe(width >= 1100 ? 3 : width >= 768 ? 2 : 1);
      if (width >= 1280) {
        await expect(page.locator('.practice-category-nav')).toBeVisible();
        await expect(page.locator('.practice-category-nav a')).toHaveCount(10);
      } else await expect(page.locator('.practice-category-picker select')).toBeVisible();
      const overflow = await page.locator('.practice-panel p, .practice-word-table td, .practice-banner-copy, .practice-language-bar').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent));
      expect(overflow).toEqual([]);
      await page.screenshot({ path: `qa/practice/symptoms-${width}-${language}-${theme}.png`, fullPage: true });
    }
    await page.locator('.practice-phrases .practice-more').click();
    await page.locator('.practice-words .practice-more').click();
    await expect(page.locator('.practice-phrase-row')).toHaveCount(15);
    await expect(page.locator('.practice-word-table tbody tr')).toHaveCount(20);
    for (const dialogue of await page.locator('.practice-dialogue-heading h3 button').all()) {
      if (await dialogue.getAttribute('aria-expanded') === 'false') await dialogue.click();
    }
    await expect(page.locator('.practice-dialogue-body:visible')).toHaveCount(3);
    await page.locator('.practice-dialogue-heading h3 button').first().click();
    await expect(page.locator('.practice-dialogue-body:visible')).toHaveCount(2);
    expect(await page.locator('.site-footer').evaluate(node => node.outerHTML)).toBe(footer);
    // Only the existing active navigation state changes between sections.
    expect(await page.locator('.site-header').evaluate(node => { const clone = node.cloneNode(true) as HTMLElement; clone.querySelectorAll('.primary-nav a').forEach(link => { link.removeAttribute('aria-current'); link.classList.remove('active'); }); return clone.outerHTML; })).toBe(header);
    expect(errors).toEqual([]);
  });
}

test('visible languages persist independently across all populated categories and situations', async ({ page }) => {
  await page.goto(route);
  const originalUi = await page.locator('html').getAttribute('lang');
  await page.locator('.practice-language-button').nth(0).click();
  await page.locator('.practice-language-button').nth(2).click();
  await expect(page.locator('[data-translation-language="ru"], [data-translation-language="en"]')).toHaveCount(0);
  await expect(page.locator('[data-translation-language="de"]')).not.toHaveCount(0);
  await page.locator('.practice-language-button').nth(1).click();
  await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.getByRole('status').filter({ hasText: messages.ru.practiceOneLanguage })).toBeVisible();
  await page.locator('.practice-phrases .practice-more').click();
  await page.locator('.practice-language-button').nth(0).click();
  await expect(page.locator('.practice-phrase-row')).toHaveCount(15);
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const [id, key] of categories) {
    await page.locator('.practice-category-nav').getByRole('link', { name: messages.ru[key], exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#/learn/de/situations/${id}$`));
    await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(2);
    await expect(page.locator('.practice-empty')).toHaveCount(0);
    await expect(page.locator('.practice-situation-nav a')).toHaveCount(6);
    await expect(page.locator('.practice-phrase-row')).toHaveCount(6);
    await expect(page.locator('.practice-dialogue')).toHaveCount(3);
  }
  await page.locator('.practice-category-nav').getByRole('link', { name: messages.ru.practiceDoctor, exact: true }).click();
  for (const link of await page.locator('.practice-situation-nav a').all()) {
    await link.click();
    await expect(page.locator('.practice-empty')).toHaveCount(0);
    await expect(page.locator('.practice-phrase-row')).toHaveCount(6);
    await expect(page.locator('.practice-dialogue')).toHaveCount(3);
  }
  await page.locator('.practice-situation-nav a').nth(1).click();
  await page.reload();
  await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('html')).toHaveAttribute('lang', originalUi!);
  await page.locator('.language-select select').selectOption('en');
  await expect(page.locator('h1')).toHaveText(messages.en.practiceSymptoms);
  await expect(page.locator('[data-translation-language="en"]')).toHaveCount(0);
  await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(2);
});

test('saved phrases and words survive reloads, retain translations and can be removed', async ({ page }) => {
  await page.goto(route);
  const globalBefore = await page.evaluate(() => localStorage.getItem('linad.preferences.v1'));
  await page.locator('.practice-phrases .practice-save').first().click();
  await page.locator('.practice-words .practice-save').first().click();
  await expect(page.locator('.practice-save[aria-pressed="true"]')).toHaveCount(2);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), PRACTICE_STORAGE_KEY);
  expect(saved.savedItems).toHaveLength(2);
  expect(saved.savedItems[0].text).toEqual(symptomsMaterial.phrases[0].text);
  expect(saved.savedItems[1].kind).toBe('word');
  expect(await page.evaluate(() => localStorage.getItem('linad.preferences.v1'))).toBe(globalBefore);
  await page.reload();
  await expect(page.locator('.practice-save[aria-pressed="true"]')).toHaveCount(2);
  await page.locator('.practice-words .practice-save').first().click();
  await expect(page.locator('.practice-save[aria-pressed="true"]')).toHaveCount(1);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).savedItems.length, PRACTICE_STORAGE_KEY)).toBe(1);
});

test('unavailable and malformed storage report actual limitations without breaking the controls', async ({ browser }) => {
  for (const blocked of [false, true]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(({ blocked, key }) => {
      if (blocked) Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
      else localStorage.setItem(key, '{broken');
    }, { blocked, key: PRACTICE_STORAGE_KEY });
    await page.goto(`http://127.0.0.1:4173${route}`);
    await expect(page.getByRole('alert')).toHaveText(blocked ? messages.ru.practiceStorageUnavailable : messages.ru.practiceStorageInvalid);
    await page.locator('.practice-language-button').nth(0).click();
    await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(2);
    await page.locator('.practice-save').first().click();
    await expect(page.locator('.practice-save').first()).toHaveAttribute('aria-pressed', 'true');
    await context.close();
  }
});

test('browser speech uses the chosen language, stops playback and reports missing voices and synthesis errors', async ({ page }) => {
  await page.addInitScript(() => {
    class Utterance { text: string; lang = ''; voice = null; rate = 1; onend: (() => void) | null = null; onerror: ((event: { error: string }) => void) | null = null; constructor(text: string) { this.text = text; } }
    const state = { spoken: [] as { text: string; lang: string }[], canceled: 0, voices: ['ru-RU', 'de-DE', 'en-GB'], error: false, hold: false };
    Object.defineProperty(window, '__practiceAudio', { value: state });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance, configurable: true });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => state.voices.map(lang => ({ lang, name: lang })),
      cancel: () => { state.canceled++; }, addEventListener() {}, removeEventListener() {},
      speak: (utterance: Utterance) => { state.spoken.push({ text: utterance.text, lang: utterance.lang }); setTimeout(() => { if (state.error) utterance.onerror?.({ error: 'synthesis-failed' }); else if (!state.hold) utterance.onend?.(); }, 20); },
    } });
  });
  await page.goto(route);
  const audio = page.locator('.practice-translation').nth(1).getByRole('button');
  await audio.click();
  expect(await page.evaluate(() => (window as unknown as { __practiceAudio: { spoken: { text: string; lang: string }[] } }).__practiceAudio.spoken[0])).toEqual({ text: symptomsMaterial.phrases[0].text.de, lang: 'de-DE' });
  await page.locator('.practice-words .practice-listen').first().click();
  await expect.poll(async () => page.evaluate(() => (window as unknown as { __practiceAudio: { spoken: unknown[] } }).__practiceAudio.spoken.length)).toBe(4);
  await page.evaluate(() => { (window as unknown as { __practiceAudio: { voices: string[] } }).__practiceAudio.voices = ['en-GB']; });
  await audio.click();
  await expect(page.getByRole('status').filter({ hasText: messages.ru.practiceVoiceMissing })).toContainText('Deutsch');
  await page.evaluate(() => { const audio = (window as unknown as { __practiceAudio: { voices: string[]; error: boolean } }).__practiceAudio; audio.voices = ['ru-RU', 'de-DE', 'en-GB']; audio.error = true; });
  await audio.click();
  await expect(page.getByRole('status').filter({ hasText: messages.ru.practiceSpeechError })).toBeVisible();
  await page.evaluate(() => { const audio = (window as unknown as { __practiceAudio: { error: boolean; hold: boolean } }).__practiceAudio; audio.error = false; audio.hold = true; });
  await audio.click();
  await expect(audio).toHaveAttribute('aria-pressed', 'true');
  await audio.click();
  await expect(audio).toHaveAttribute('aria-pressed', 'false');
  await audio.click();
  await page.locator('.practice-language-button').nth(1).click();
  await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
});

test('absent speech API is explained and native voice inventory is recorded', async ({ page }) => {
  await page.goto(route);
  const native = await page.evaluate(async () => {
    if (!('speechSynthesis' in window)) return { supported: false, voices: [] };
    speechSynthesis.getVoices();
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { supported: true, voices: speechSynthesis.getVoices().map(voice => ({ name: voice.name, lang: voice.lang, localService: voice.localService })) };
  });
  let playbackEvents: string[] = [];
  if (native.voices.some(voice => voice.lang.startsWith('ru'))) {
    await page.evaluate(() => {
      const events: string[] = [];
      Object.defineProperty(window, '__nativeSpeechEvents', { value: events });
      const speak = speechSynthesis.speak.bind(speechSynthesis);
      speechSynthesis.speak = utterance => {
        utterance.addEventListener('start', () => events.push('start'));
        utterance.addEventListener('end', () => events.push('end'));
        utterance.addEventListener('error', event => events.push(`error:${event.error}`));
        speak(utterance);
      };
    });
    await page.locator('.practice-listen').first().click();
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __nativeSpeechEvents: string[] }).__nativeSpeechEvents.some(event => event === 'end' || event.startsWith('error:'))), { timeout: 15_000 }).toBe(true);
    playbackEvents = await page.evaluate(() => (window as unknown as { __nativeSpeechEvents: string[] }).__nativeSpeechEvents);
    if (playbackEvents.some(event => event.startsWith('error:'))) await expect(page.getByRole('status').filter({ hasText: messages.ru.practiceSpeechError })).toBeVisible();
  }
  writeFileSync('qa/practice/native-speech.json', JSON.stringify({ ...native, playbackEvents }, null, 2));
  await page.addInitScript(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
  await page.reload();
  await page.locator('.practice-listen').first().click();
  await expect(page.getByRole('status').filter({ hasText: messages.ru.practiceSpeechUnavailable })).toBeVisible();
});

test('mobile category picker, keyboard accordion, route validation and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(route);
  await page.locator('.practice-category-picker select').selectOption('sport-fitness');
  await expect(page.locator('h1')).toHaveText(messages.ru.topicSportMembership);
  await page.locator('.practice-category-picker select').selectOption('doctor');
  const accordion = page.locator('.practice-dialogue-heading h3 button').first();
  await accordion.focus(); await page.keyboard.press('Enter');
  await expect(accordion).toHaveAttribute('aria-expanded', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.practice-language-button').first().hover();
  await expect(page.locator('.practice-language-button').first()).toHaveCSS('transition-duration', '0s');
  await page.goto('/#/learn/de/situations/doctor/unknown');
  await expect(page.locator('h1')).toHaveText(messages.ru.notFoundTitle);
  await expect(page).toHaveTitle(`${messages.ru.notFoundTitle} | LINAD`);
});
