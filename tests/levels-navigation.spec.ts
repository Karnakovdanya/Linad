import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { messages } from '../src/i18n/messages';
import { defaultLevelsState, LEVELS_STORAGE_KEY, parseLevels } from '../src/pages/learning/levels/storage';
import { assessmentLength, assessmentResult, commitResponse, newAssessment, nextQuestion } from '../src/pages/learning/levels/assessment';
import { assessmentAccess, startPlacement } from '../src/pages/learning/levels/assessment-access';
import { lessonCatalog, sampleLessons } from '../src/pages/learning/levels/data/lessons';
import { moduleStatus } from '../src/pages/learning/levels/progress';
import { courseCopy } from '../src/pages/learning/levels/course-copy';
import { questionById } from '../src/pages/learning/levels/data/questions';
import type { LearningLanguage, UiLanguage } from '../src/domain/types';

const root = '/#/learn/levels';
mkdirSync('qa/levels-navigation', { recursive: true });
async function pair(page: Page, language: LearningLanguage, support: UiLanguage, ui: UiLanguage = 'ru') {
  await page.goto(root + '/languages');
  await page.locator('.level-target-options button').nth(language === 'de' ? 0 : 1).click();
  await page.locator('.level-support-options button').filter({ hasText: messages[ui][support === 'ru' ? 'russian' : support === 'de' ? 'german' : 'english'] }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', ui);
}
function completed(language: LearningLanguage) {
  let run = newAssessment(language, false, 123);
  for (let index = 0; index < assessmentLength; index++) {
    const q = nextQuestion(run)!;
    run = commitResponse({ ...run, questionIds: [...run.questionIds, q.id] }, index, q.id, q.correct);
  }
  return { ...run, completed: true };
}

test('retakes preserve completed answers and lesson progress; future auth policy is injectable', () => {
  const run = completed('de'); const state = defaultLevelsState();
  state.runs.de = run; state.results.de = assessmentResult(run);
  state.lessons['de:first-introductions'] = { visited: [0, 1], attempts: [] };
  const retake = startPlacement(state, 'de');
  expect(retake.assessmentHistory).toEqual([run]); expect(retake.results.de).toEqual(state.results.de);
  expect(retake.lessons).toEqual(state.lessons); expect(retake.runs.de?.audioEnabled).toBe(false);
  const restored = parseLevels(JSON.stringify(retake));
  expect(restored.warning).toBeNull(); expect(restored.state.results.de?.runId).toBe(run.id);
  expect(restored.state.assessmentHistory[0].responses).toHaveLength(30);
  expect(assessmentAccess(false, null, true)).toBe(true);
  expect(assessmentAccess(true, null, true)).toBe(false);
  expect(assessmentAccess(true, { id: 'real-account-adapter' }, true)).toBe(true);
  expect(assessmentAccess(true, null)).toBe(true);
  expect(moduleStatus(state, 'de', 'A1', 'introductions').percent).toBe(0);
});

test('old local records migrate section numbers and preserve genuine quiz results', () => {
  const lesson = sampleLessons.de;
  const old = { ...defaultLevelsState(), lessonSectionsVersion: undefined, setupComplete: undefined, lastLesson: undefined,
    lessons: { 'de:first-introductions': { visited: [0, 3, 4, 5, 6], attempts: [{ answers: Object.fromEntries(lesson.quiz.map(q => [q.id, q.correct])), score: 5, total: 5, completedAt: '2026-10-01' }] } } };
  const parsed = parseLevels(JSON.stringify(old));
  expect(parsed.warning).toBeNull(); expect(parsed.state.lessons['de:first-introductions'].visited).toEqual([0, 4, 5, 6]);
  expect(parsed.state.lessons['de:first-introductions'].attempts[0].score).toBe(5);
  expect(parsed.state.setupComplete.de).toBe(true);
});

for (const ui of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`manual path, breadcrumbs, lessons and responsive views: ${ui} ${theme}`, async ({ page }) => {
  test.setTimeout(150_000); const t = messages[ui]; const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ ui, theme }) => { if (!localStorage.getItem('linad.preferences.v1')) localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: ui, theme, learningLanguage: 'de' })); }, { ui, theme });
  for (const [language, support] of [['de', 'ru'], ['de', 'en'], ['en', 'ru'], ['en', 'de']] as const) {
    await pair(page, language, support, ui);
    await expect(page.locator('h1')).toHaveText(`${t.levelsSetupLead} ${t.levelsSetupAccent}`);
    await page.getByRole('button', { name: t.levelsContinue, exact: true }).click();
    // A saved level resumes directly; changing it remains an explicit action.
    if (await page.locator('.level-modules-hero').count()) await page.goto(root + '/placement');
    await expect(page.locator('.level-audio-check')).toHaveCount(0);
    await page.getByRole('link', { name: t.levelsChoose, exact: true }).click();
    await expect(page.locator('.level-band-grid button')).toHaveCount(5);
    await expect(page.locator('.level-recommendation')).toHaveCount(0);
    await page.locator('.level-band-grid button').filter({ hasText: 'A1' }).click();
    await expect(page.locator('.level-module-row')).toHaveCount(8); await expect(page.locator('.level-steps')).toHaveCount(0);
    await page.locator('.level-module-row').first().getByRole('link').click();
    if (page.url().includes('/lessons/')) await page.goto(root + '/modules/A1/introductions');
    await expect(page.locator('.level-lesson-row')).toHaveCount(language === 'de' ? 6 : 2);
    await page.locator('.level-lesson-row').first().getByRole('link').click();
    await expect(page.locator('.level-steps')).toHaveCount(0);
    await expect(page.locator('.level-breadcrumbs li')).toHaveCount(5);
    await expect(page.locator('.level-lesson-tabs [role=tab]')).toHaveCount(7);
    await expect(page.locator('.level-grammar-table table')).toBeVisible();
    await expect(page.locator('.level-theory p').first()).toHaveAttribute('lang', support);
    await page.locator('.level-lesson-tabs button').nth(3).click(); await expect(page.locator('.level-dialogue')).toBeVisible();
    await page.locator('.level-lesson-tabs button').nth(5).click();
    const q = sampleLessons[language].exercises[0];
    await page.locator('.level-exercise').first().getByRole('radio', { name: q.correct, exact: true }).check();
    await page.locator('.level-exercise').first().getByRole('button', { name: courseCopy(support).check, exact: true }).click();
    await expect(page.locator('.level-explanation').first()).toContainText(q.explanation[support]);
    await page.locator('.level-lesson-tabs button').nth(6).click();
    if (await page.locator('.level-result-score').count()) await page.getByRole('button', { name: courseCopy(support).retry, exact: true }).click();
    for (const item of sampleLessons[language].quiz) await page.locator(`[data-question-id="${item.id}"]`).getByRole('radio', { name: item.correct, exact: true }).check();
    await page.getByRole('button', { name: t.levelsSubmitQuiz }).click(); await expect(page.locator('.level-result-score')).toHaveText('5/5 · 100%');
    await page.locator('[rel=next]').click(); await expect(page).toHaveURL(/introduction-questions$/);
    await expect(page.locator('.level-lesson-tabs button').first()).toHaveAttribute('aria-selected', 'true');
    await page.locator('.level-lesson-tabs button').nth(4).click(); await page.reload();
    await expect(page.locator('.level-lesson-tabs button').nth(4)).toHaveAttribute('aria-selected', 'true');
    await page.goto(root); await expect(page).toHaveURL(/introduction-questions$/);
    await page.locator('[rel=prev]').click(); await expect(page).toHaveURL(/first-introductions$/);
    await page.locator('.level-breadcrumbs a').nth(2).click();
    await expect(page.locator('.level-module-row').first().locator('progress')).toHaveAttribute('value', '0');
    await page.locator('.level-modules-hero').getByRole('link', { name: new RegExp(t.levelsChangeLevel) }).click();
    await page.locator('.level-band-grid button').filter({ hasText: 'B1' }).click();
    await expect(page.locator('.level-module-row')).toHaveCount(8); await expect(page.locator('.level-level-progress progress')).toHaveAttribute('value', '0');
  }
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/languages', '/curriculum', '/modules/B1', '/modules/A1/introductions', '/lessons/A1/introductions/first-introductions']) {
      await page.goto(root + path); await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}/${path}`).toBe(true);
      if (path.startsWith('/modules/B1') || path.startsWith('/lessons')) {
        if (ui === 'ru' && [375, 1440].includes(width)) await page.screenshot({ path: `qa/levels-navigation/${path.startsWith('/lessons') ? 'lesson' : 'modules'}-${width}-${theme}.png`, fullPage: true });
      }
    }
  }
  expect(errors).toEqual([]);
});

for (const [language, support] of [['de', 'ru'], ['de', 'en'], ['en', 'ru'], ['en', 'de']] as const) test(`real diagnostic, level selection and retake preserve history: ${language}/${support}`, async ({ page }) => {
  test.setTimeout(90_000); await pair(page, language, support);
  await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  await expect(page.locator('.level-steps li')).toHaveCount(3);
  await page.getByRole('button', { name: messages.ru.levelsStartTest, exact: true }).click();
  for (let index = 0; index < 30; index++) {
    const q = questionById.get((await page.locator('.level-question').getAttribute('data-question-id'))!)!;
    expect(q.skill).not.toBe('listening'); await expect(page.locator('.level-test-meta')).toHaveText(`Вопрос ${index + 1} из 30`);
    await expect(page.locator('.level-explanation,.level-answer-review')).toHaveCount(0);
    await page.getByRole('radio', { name: q.correct, exact: true }).check();
    await page.getByRole('button', { name: `${index === 29 ? messages.ru.levelsFinish : messages.ru.levelsNext} →`, exact: true }).click();
  }
  await expect(page.locator('.level-result-badge')).toHaveText('C1');
  await page.getByRole('link', { name: `${messages.ru.levelsChoose} →`, exact: true }).click();
  await expect(page.locator('.level-recommendation')).toContainText('C1');
  await page.locator('.level-band-grid button').filter({ hasText: 'A1' }).click();
  await expect(page.locator('.level-modules-hero h1')).toContainText('A1');
  await page.goto(root + '/placement'); await page.getByRole('button', { name: messages.ru.levelsRestart }).click();
  await page.reload();
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), LEVELS_STORAGE_KEY);
  expect(stored.assessmentHistory).toHaveLength(1); expect(stored.results[language].correct).toBe(30);
  expect(stored.runs[language].audioEnabled).toBe(false); expect(stored.results[language].skills.listening.percent).toBeNull();
  await page.goto(root + '/result'); await expect(page.locator('.level-result-badge')).toHaveText('C1');
});

for (const language of ['de', 'en'] as const) test(`word pronunciation survives without diagnostic audio: ${language}`, async ({ page }) => {
  await page.addInitScript(() => {
    const said: { text: string; lang: string }[] = [];
    Object.defineProperty(window, '__said', { value: said });
    class Utterance { text: string; lang = ''; voice = null; rate = 1; onend: (() => void) | null = null; constructor(text: string) { this.text = text; } }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: Utterance });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => ['de-DE', 'en-GB'].map(lang => ({ name: lang, lang })), cancel() {}, addEventListener() {}, removeEventListener() {}, speak(utterance: Utterance) { said.push({ text: utterance.text, lang: utterance.lang }); setTimeout(() => utterance.onend?.(), 10); } } });
  });
  await pair(page, language, 'ru'); await page.goto(root + '/lessons/A1/introductions/first-introductions');
  await page.locator('.level-lesson-tabs button').nth(1).click();
  await page.locator('.level-vocabulary button').first().click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __said: unknown[] }).__said.length)).toBe(1);
  expect(await page.evaluate(() => (window as unknown as { __said: unknown[] }).__said[0])).toEqual({ text: sampleLessons[language].vocabulary[0].word, lang: language === 'de' ? 'de-DE' : 'en-GB' });
  expect(Object.keys(lessonCatalog[language])).toHaveLength(language === 'de' ? 5 : 2);
});

test('tab keyboard controls, manual selection without recommendation and blocked storage', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }));
  await page.goto(root); await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  await page.getByRole('link', { name: messages.ru.levelsChoose, exact: true }).click();
  await expect(page.locator('.level-recommendation')).toHaveCount(0); await page.locator('.level-band-grid button').first().click();
  await page.locator('.level-module-row').first().getByRole('link').click(); await page.locator('.level-lesson-row').first().getByRole('link').click();
  await page.locator('.level-lesson-tabs button').first().focus(); await page.keyboard.press('ArrowDown');
  await expect(page.locator('.level-lesson-tabs button').nth(1)).toBeFocused(); await expect(page.locator('.level-vocabulary')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText(messages.ru.levelsStorageError);
});

test('incorrect lesson answers produce a persisted 0/5 and completion does not invent a full level score', async ({ page }) => {
  await page.goto(root + '/lessons/A1/introductions/first-introductions');
  await page.locator('.level-lesson-tabs button').nth(6).click();
  for (const q of sampleLessons.de.quiz) await page.locator(`[data-question-id="${q.id}"]`).getByRole('radio', { name: q.options.find(option => option !== q.correct)!, exact: true }).check();
  await page.getByRole('button', { name: messages.ru.levelsSubmitQuiz }).click();
  await expect(page.locator('.level-result-score')).toHaveText('0/5 · 0%');
  await page.reload(); await expect(page.locator('.level-result-score')).toHaveText('0/5 · 0%');
  await page.locator('.level-breadcrumbs a').nth(2).click();
  await expect(page.locator('.level-level-progress progress')).toHaveAttribute('value', '0');
  await expect(page.locator('.level-module-row').first().locator('progress')).toHaveAttribute('value', '0');
});

test('returning learners resume their saved level per language and change it only explicitly', async ({ page }) => {
  const state = defaultLevelsState(); state.setupComplete.de = true; state.selectedLevels.de = 'B1';
  state.lessons['de:first-introductions'] = { visited: [0, 1], attempts: [] };
  const run = newAssessment('de', false, 456); const first = nextQuestion(run)!;
  state.runs.de = commitResponse({ ...run, questionIds: [first.id] }, 0, first.id, first.correct);
  await page.addInitScript(({ key, state }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(state)); }, { key: LEVELS_STORAGE_KEY, state });
  async function step(index: number) {
    await expect(page.locator('.level-steps li')).toHaveCount(3);
    await expect(page.locator('.level-steps li').nth(index)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('.level-steps a,.level-steps button,.level-steps [tabindex]')).toHaveCount(0);
  }
  await page.goto(root + '/modules/B1'); await expect(page.locator('.level-steps')).toHaveCount(0);
  await page.locator('.level-breadcrumbs').getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL(/\/languages$/); await step(0);
  await expect(page.locator('.level-support-options button').first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.level-support-options select')).toHaveCount(0);
  await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  await expect(page).toHaveURL(/\/modules\/B1$/); await expect(page.locator('.level-steps')).toHaveCount(0);
  await page.locator('.level-modules-hero').getByRole('link', { name: new RegExp(messages.ru.levelsChangeLevel) }).click(); await step(2);
  await page.getByRole('link', { name: `← ${messages.ru.levelsPlacement}`, exact: true }).click(); await step(1);
  await page.getByRole('link', { name: messages.ru.levelsResume, exact: true }).click(); await step(1);
  await expect(page.locator('.level-test-meta')).toHaveText('Вопрос 2 из 30');
  await page.getByRole('link', { name: messages.ru.levelsChangePair, exact: true }).click(); await step(0);
  await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  await expect(page).toHaveURL(/\/modules\/B1$/);
  await page.locator('.level-modules-hero').getByRole('link', { name: new RegExp(messages.ru.levelsChangeLevel) }).click(); await step(2);
  await page.locator('.level-band-grid button').filter({ hasText: 'A2' }).click();
  await expect(page.locator('.level-steps')).toHaveCount(0);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), LEVELS_STORAGE_KEY);
  expect(saved.runs.de.responses).toHaveLength(1); expect(saved.lessons).toEqual(state.lessons);
  expect(saved.selectedLevels.de).toBe('A2');
  await page.locator('.level-breadcrumbs').getByRole('link', { name: 'Deutsch', exact: true }).click(); await step(0);
  await page.locator('.level-target-options button').nth(1).click();
  await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  // English still has only the default A1 value, not a chosen level.
  await expect(page).toHaveURL(/\/placement$/); await step(1);
  await page.getByRole('link', { name: messages.ru.levelsChoose, exact: true }).click();
  await page.locator('.level-band-grid button').filter({ hasText: 'B2' }).click();
  await page.locator('.level-breadcrumbs').getByRole('link', { name: 'English', exact: true }).click();
  await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  await expect(page).toHaveURL(/\/modules\/B2$/); await expect(page.locator('.level-modules-hero h1')).toHaveText('B2 · English');
  await page.reload();
  await page.locator('.level-breadcrumbs').getByRole('link', { name: 'English', exact: true }).click();
  await page.locator('.level-target-options button').first().click();
  await page.getByRole('button', { name: messages.ru.levelsContinue, exact: true }).click();
  await expect(page).toHaveURL(/\/modules\/A2$/); await expect(page.locator('.level-modules-hero h1')).toHaveText('A2 · Deutsch');
});
