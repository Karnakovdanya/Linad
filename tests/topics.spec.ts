import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { messages } from '../src/i18n/messages';
import type { PracticeSituation } from '../src/pages/learning/practice/data/categories';
import type { LearningLanguage } from '../src/domain/types';
import { topicSituations } from '../src/pages/learning/practice/data/topics';
import { doctorMaterials } from '../src/pages/learning/practice/data/doctor-materials';
import { practiceLanguages } from '../src/pages/learning/practice/data/types';
import { currentProtectedSources } from './protected-source';

mkdirSync('qa/topics', { recursive: true });
const categoryTitles = {
  'job-interview': 'practiceJob', travel: 'practiceTravel', documents: 'practiceDocuments',
  'everyday-communication': 'practiceEveryday', shopping: 'practiceShopping', housing: 'practiceHousing',
  'banking-finance': 'practiceBanking', 'sport-fitness': 'practiceSport', 'education-learning': 'practiceEducation',
} as const;
const medicalTitles = { appointment: 'practiceAppointment', 'describe-symptoms': 'practiceSymptoms', 'doctor-visit': 'practiceVisit', 'treatment-medicine': 'practiceTreatment', 'test-results': 'practiceResults', 'emergency-help': 'practiceEmergency' } as const;
const practiceCategories = [
  ...Object.entries(categoryTitles).map(([id, titleKey]) => ({ id, titleKey, image: `./assets/learning/situations/${id}.png`, situations: topicSituations[id] })),
  { id: 'doctor', titleKey: 'practiceDoctor' as const, image: './assets/learning/situations/doctor.png', situations: Object.entries(medicalTitles).map(([id, titleKey]) => ({ id, titleKey, material: doctorMaterials[id as keyof typeof doctorMaterials] })) as readonly PracticeSituation[] },
];
function practicePath(language: LearningLanguage, category: typeof practiceCategories[number], situation?: PracticeSituation) {
  return `/learn/${language}/situations/${category.id}${situation ? `/${situation.id}` : ''}`;
}
const added = practiceCategories.filter(category => category.id !== 'doctor');
const url = (category: typeof practiceCategories[number], index = 0) => `/#${practicePath('de', category, category.situations[index])}`;

test('60 complete situations, stable distinct materials, three translations and an editorial review export', () => {
  expect(practiceCategories).toHaveLength(10);
  expect(added).toHaveLength(9);
  const phraseSets = new Set<string>();
  let review = '# Practice for Everyday Life — материалы для проверки\n\n54 новые ситуации. Все материалы — редакционный черновик. В каждой ситуации: 15 фраз, 3 диалога и 20 слов на RU / DE / EN. Шесть медицинских ситуаций сохранены отдельно без изменений.\n';
  const counts = { situations: 0, phrases: 0, dialogues: 0, words: 0 };
  for (const category of practiceCategories) {
    expect(category.situations, category.id).toHaveLength(6);
    expect(new Set(category.situations.map(item => item.id)).size).toBe(6);
    if (category.id !== 'doctor') review += `\n## ${messages.ru[category.titleKey]}\n`;
    for (const situation of category.situations) {
      const material = situation.material!;
      expect(material, `${category.id}/${situation.id}`).toBeDefined();
      expect(material.status).toBe('draft');
      expect(material.phrases).toHaveLength(15); expect(material.dialogues).toHaveLength(3); expect(material.words).toHaveLength(20);
      for (const items of [material.phrases, material.dialogues, material.words]) expect(new Set(items.map(item => item.id)).size).toBe(items.length);
      for (const lang of practiceLanguages) expect(messages[lang][situation.titleKey].length).toBeGreaterThan(3);
      const texts = [...material.phrases, ...material.words, ...material.dialogues.flatMap(dialogue => [{ text: dialogue.title }, ...dialogue.lines])];
      for (const entry of texts) {
        for (const lang of practiceLanguages) expect(entry.text[lang].trim().length, `${category.id}/${situation.id}/${lang}`).toBeGreaterThanOrEqual(2);
        expect(entry.text.de).not.toContain('ß');
        expect(entry.text.de).not.toMatch(/[А-Яа-яЁё]/);
        expect(entry.text.en).not.toMatch(/[А-Яа-яЁё]/);
      }
      for (const dialogue of material.dialogues) {
        expect(dialogue.lines.length).toBeGreaterThanOrEqual(4); expect(dialogue.lines.length).toBeLessThanOrEqual(8);
        expect(new Set(dialogue.lines.map(line => line.speaker)).size).toBeGreaterThanOrEqual(2);
        if (category.id !== 'doctor') for (const line of dialogue.lines) for (const lang of practiceLanguages) expect(dialogue.participants?.[line.speaker]?.[lang]).toBeTruthy();
      }
      phraseSets.add(JSON.stringify(material.phrases.map(entry => entry.text)));
      counts.situations++; counts.phrases += material.phrases.length; counts.dialogues += material.dialogues.length; counts.words += material.words.length;
      if (category.id === 'doctor') continue;
      review += `\n### ${messages.ru[situation.titleKey]}\n\nМаршрут: ${practicePath('de', category, situation)}\n\n#### Фразы\n\n| № | Русский | Deutsch | English |\n|---|---|---|---|\n`;
      material.phrases.forEach((entry, index) => { review += `| ${index + 1} | ${entry.text.ru} | ${entry.text.de} | ${entry.text.en} |\n`; });
      for (const dialogue of material.dialogues) {
        review += `\n#### ${dialogue.title.ru} / ${dialogue.title.de} / ${dialogue.title.en}\n\n| Участник | Русский | Deutsch | English |\n|---|---|---|---|\n`;
        for (const line of dialogue.lines) review += `| ${dialogue.participants?.[line.speaker]?.ru} | ${line.text.ru} | ${line.text.de} | ${line.text.en} |\n`;
      }
      review += '\n#### Слова\n\n| Русский | Deutsch | English |\n|---|---|---|\n';
      for (const entry of material.words) review += `| ${entry.text.ru} | ${entry.text.de} | ${entry.text.en} |\n`;
    }
  }
  expect(phraseSets.size).toBe(60);
  expect(counts).toEqual({ situations: 60, phrases: 900, dialogues: 180, words: 1200 });
  writeFileSync('qa/topics/materials-review.md', review);
  writeFileSync('qa/topics/counts.json', JSON.stringify(counts, null, 2));
});

test('approved Doctor materials, all existing styles, speech, storage and other pages are byte-identical', () => {
  const baseline: Record<string, string> = JSON.parse(readFileSync('qa/topics/protected-before.json', 'utf8').replace(/^\uFEFF/, ''));
  const changed = Object.entries(currentProtectedSources(baseline)).filter(([file, hash]) => createHash('sha256').update(readFileSync(file)).digest('hex') !== hash).map(([file]) => file);
  expect(changed).toEqual([]);
  writeFileSync('qa/topics/protected-audit.json', JSON.stringify({ protected: Object.keys(baseline).length, changed }, null, 2));
});

for (const studyLanguage of ['de', 'en'] as const) test(`all 60 destinations and full lists work on direct entry: ${studyLanguage}`, async ({ page }) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const category of practiceCategories) for (const situation of category.situations) {
    const path = practicePath(studyLanguage, category, situation);
    await page.goto(`/#${path}`);
    await expect(page.locator('h1')).toHaveText(messages.ru[situation.titleKey]);
    await expect(page).toHaveTitle(`${messages.ru[situation.titleKey]} | LINAD`);
    await expect(page.locator('.practice-situation-nav a')).toHaveCount(6);
    await expect(page.locator('.practice-situation-nav [aria-current="page"]')).toHaveText(messages.ru[situation.titleKey]);
    await expect(page.locator('.practice-empty')).toHaveCount(0);
    await page.locator('.practice-phrases .practice-more').click();
    await page.locator('.practice-words .practice-more').click();
    await expect(page.locator('.practice-phrase-row')).toHaveCount(15);
    await expect(page.locator('.practice-word-table tbody tr')).toHaveCount(20);
    await expect(page.locator('.practice-dialogue')).toHaveCount(3);
    await expect(page.locator('.practice-phrase-row').last()).toContainText(situation.material!.phrases[14].text.de);
    await expect(page.locator('.practice-word-table tbody tr').last()).toContainText(situation.material!.words[19].text.en);
  }
  expect(errors).toEqual([]);
});

for (const uiLanguage of practiceLanguages) for (const theme of ['light', 'dark'] as const) test(`all categories, six tabs, translated roles and responsive layout: ${uiLanguage} ${theme}`, async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(({ uiLanguage, theme }) => {
    if (!localStorage.getItem('linad.preferences.v1')) localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage, theme, learningLanguage: 'de' }));
  }, { uiLanguage, theme });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const category of added) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/#${practicePath('de', category)}`);
    await expect(page.locator('h1')).toHaveText(messages[uiLanguage][category.situations[0].titleKey]);
    await expect(page.locator('.practice-banner-photo')).toHaveAttribute('src', category.image);
    await page.locator('.practice-banner-photo').evaluate(node => (node as HTMLImageElement).decode());
    for (let i = 0; i < 6; i++) {
      await page.locator('.practice-situation-nav a').nth(i).click();
      const situation = category.situations[i];
      await expect(page.locator('h1')).toHaveText(messages[uiLanguage][situation.titleKey]);
      await expect(page.locator('.practice-phrase-row').first()).toContainText(situation.material!.phrases[0].text.ru);
      const dialogue = situation.material!.dialogues[0];
      await expect(page.locator('.practice-speaker').first()).toHaveText(dialogue.participants!.learner![uiLanguage]);
      await expect(page.locator('.practice-speaker').nth(1)).toHaveText(dialogue.participants!.partner![uiLanguage]);
    }
  }
  for (const category of [added[0], added[5], added[8]]) {
    await page.goto(url(category));
    await page.locator('.practice-phrases .practice-more').click();
    await page.locator('.practice-words .practice-more').click();
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${category.id}/${width}`).toBe(true);
      const overflowing = await page.locator('.practice-main h1,.practice-panel p,.practice-word-table td').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent));
      expect(overflowing, `${category.id}/${width}`).toEqual([]);
      await expect(page.locator('.practice-category-picker select')).toBeVisible({ visible: width < 1280 });
      if (category.id === 'education-learning' && [375, 1440].includes(width)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.mouse.move(0, 0);
        await page.screenshot({ path: `qa/topics/education-${width}-${uiLanguage}-${theme}.png`, fullPage: true });
        await page.screenshot({ path: `qa/topics/education-viewport-${width}-${uiLanguage}-${theme}.png` });
      }
    }
  }
  expect(errors).toEqual([]);
});

test('saved entries stay distinct across nine categories and language visibility survives navigation and reload', async ({ page }) => {
  await page.goto(url(added[0]));
  await page.locator('.practice-language-button').first().click();
  for (const category of added) {
    await page.goto(url(category));
    await expect(page.locator('[data-translation-language="ru"]')).toHaveCount(0);
    await page.locator('.practice-phrases .practice-save').first().click();
    await page.locator('.practice-words .practice-save').first().click();
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('linad.practice.v1')!));
  expect(saved.savedItems).toHaveLength(18);
  expect(new Set(saved.savedItems.map((item: { id: string }) => item.id)).size).toBe(18);
  for (const category of added) {
    expect(saved.savedItems.find((item: { categoryId: string; kind: string }) => item.categoryId === category.id && item.kind === 'phrase').text).toEqual(category.situations[0].material!.phrases[0].text);
  }
  await page.reload();
  await expect(page.locator('.practice-save[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(2);
  await page.locator('.language-select select').selectOption('en');
  await expect(page.locator('h1')).toHaveText(messages.en[added[8].situations[0].titleKey]);
  await expect(page.locator('[data-translation-language="ru"]')).toHaveCount(0);
  await page.locator('.practice-language-button').nth(1).click();
  await page.locator('.practice-language-button').nth(2).click();
  await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(1);
});

test('new phrases, words, dialogue lines and entire dialogues pass the corresponding text and locale to speech', async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    class Utterance {
      text: string; lang = ''; voice = null; rate = 1;
      onend: (() => void) | null = null; onerror = null;
      constructor(text: string) { this.text = text; }
    }
    const spoken: { text: string; lang: string }[] = [];
    Object.defineProperty(window, '__topicSpeech', { value: spoken });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: Utterance });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => ['ru-RU', 'de-DE', 'en-GB'].map(lang => ({ name: lang, lang })),
      cancel() {}, addEventListener() {}, removeEventListener() {},
      speak(utterance: Utterance) { spoken.push({ text: utterance.text, lang: utterance.lang }); setTimeout(() => utterance.onend?.(), 0); },
    } });
  });
  for (const category of added) {
    await page.goto(url(category));
    const material = category.situations[0].material!;
    await page.evaluate(() => { (window as unknown as { __topicSpeech: unknown[] }).__topicSpeech.length = 0; });
    const expected: { text: string; lang: string }[] = [];
    const locale = { ru: 'ru-RU', de: 'de-DE', en: 'en-GB' };
    const actual = () => page.evaluate(() => (window as unknown as { __topicSpeech: { text: string; lang: string }[] }).__topicSpeech);
    for (const [i, lang] of practiceLanguages.entries()) {
      await page.locator('.practice-phrase-row').first().locator('.practice-listen').nth(i).click();
      expected.push({ text: material.phrases[0].text[lang], lang: locale[lang] });
      await expect.poll(actual).toEqual(expected);
      await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
    }
    await page.locator('.practice-words .practice-listen').first().click();
    expected.push(...practiceLanguages.map(lang => ({ text: material.words[0].text[lang], lang: locale[lang] })));
    await expect.poll(actual).toEqual(expected);
    await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
    await page.locator('.practice-dialogue-line .practice-listen').first().click();
    expected.push(...practiceLanguages.map(lang => ({ text: material.dialogues[0].lines[0].text[lang], lang: locale[lang] })));
    await expect.poll(actual).toEqual(expected);
    await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
    await page.locator('.practice-dialogue-heading > .practice-listen').first().click();
    expected.push(...material.dialogues[0].lines.flatMap(line => practiceLanguages.map(lang => ({ text: line.text[lang], lang: locale[lang] }))));
    await expect.poll(actual).toEqual(expected);
  }
});
