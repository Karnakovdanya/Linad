import { test, expect, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { coursePlan } from '../src/pages/learning/levels/data/course-plan';
import { curricula } from '../src/pages/learning/levels/data/curriculum';
import { lessonCatalog, lessonKey } from '../src/pages/learning/levels/data/lessons';
import { moduleExams } from '../src/pages/learning/levels/data/module-exams';
import { cefrLevels, type Lesson, type LevelsState } from '../src/pages/learning/levels/model';
import { checkAnswer, correctAnswer, examTasks, gradeTasks, normaliseAnswer, passedExam, type Task } from '../src/pages/learning/levels/tasks';
import { lessonStatus, levelStatus, miniTestTasks, moduleStatus, nextLevel, practiceTasks, readingTasks, requiredTasks, summariseLevel } from '../src/pages/learning/levels/progress';
import { defaultLevelsState, languagePair, LEVELS_STORAGE_KEY, parseLevels } from '../src/pages/learning/levels/storage';
import { resumePath } from '../src/pages/learning/levels/navigation';
import { approvedPracticeSpeechSources } from './protected-source';

mkdirSync('qa/learning-system', { recursive: true });
const root = '/#/learn/levels';
function answer(task: Task): string {
  if (task.kind === 'choice') return task.correct;
  if (task.kind === 'input') return task.accepted[0]!;
  if (task.kind === 'order') return JSON.stringify(task.acceptedOrders[0]);
  return JSON.stringify(Object.fromEntries(task.pairs.map(pair => [pair.id, pair.id])));
}
function finishLesson(state: LevelsState, lesson: Lesson) {
  const quiz = miniTestTasks(lesson); const answers = Object.fromEntries(quiz.map(task => [task.id, answer(task)]));
  state.lessons[lessonKey(lesson.language, lesson.id)] = { visited: [0, 1, 2, 3, 4, 5, 6], practice: requiredTasks(lesson).map(task => ({ taskId: task.id, answer: answer(task), checkedAt: '2026-10-19T12:00:00.000Z' })), attempts: [{ answers, ...gradeTasks(quiz, answers), completedAt: '2026-10-19T12:00:00.000Z' }] };
}
test('400 specific lesson plans, 80 module tests and advisory prerequisites; published content is separate', () => {
  const output: unknown[] = []; let markdown = '# LINAD — учебная программа German и English\n\nПлан ≠ опубликованный урок. Цели (Outcome) и фокусы — редакционные метаданные на английском; учебный материал переводится на язык поддержки при публикации.\n';
  for (const language of ['de', 'en'] as const) {
    expect(coursePlan[language]).toHaveLength(40); const seen = new Set<string>();
    for (const level of cefrLevels) expect(coursePlan[language].filter(module => module.level === level)).toHaveLength(8);
    for (const module of coursePlan[language]) {
      expect(module.lessons).toHaveLength(5); expect(module.finalTest.coveredLessonIds).toEqual(module.lessons.map(lesson => lesson.id)); expect(module.finalTest.passPercent).toBe(80);
      markdown += `\n## ${language.toUpperCase()} ${module.level} · ${module.number}. ${curricula[language].find(item => item.id === module.id && item.level === module.level)!.title.ru}\n`;
      for (const lesson of module.lessons) {
        expect(seen.has(lesson.id)).toBe(false); lesson.prerequisiteIds.forEach(id => expect(seen.has(id)).toBe(true)); seen.add(lesson.id);
        expect(lesson.title.length).toBeGreaterThan(5); expect(lesson.focus.length).toBeGreaterThan(8); expect(lesson.outcome.length).toBeGreaterThan(20);
        const published = lessonCatalog[language][lesson.id];
        markdown += `\n${lesson.number}. **${lesson.title}** (${lesson.id}) — ${published?.contentStatus === 'sample' ? 'сохранённый образец' : published ? 'опубликован' : 'план'}.\n   Focus: ${lesson.focus}.\n   Outcome: ${lesson.outcome}\n`;
      }
      output.push({ ...module, lessons: module.lessons.map(lesson => ({ ...lesson, status: lessonCatalog[language][lesson.id]?.contentStatus === 'sample' ? 'sample' : lessonCatalog[language][lesson.id] ? 'published' : 'planned' })) });
    }
    expect(seen.size).toBe(200);
  }
  expect(Object.keys(lessonCatalog.de)).toHaveLength(5); expect(Object.keys(lessonCatalog.en)).toHaveLength(2);
  writeFileSync('qa/learning-system/course-plan.json', JSON.stringify(output, null, 2)); writeFileSync('qa/learning-system/COURSE_PLAN.md', markdown);
});

test('published German A1 module has five distinct complete lessons, translations and valid task keys', () => {
  const ids = new Set<string>(); const kinds = new Set<string>(); let review = '# German A1 · Знакомство — материалы для проверки\n';
  for (const lesson of Object.values(lessonCatalog.de)) {
    expect(lesson.theory.length).toBeGreaterThanOrEqual(3); expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(8); expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
    expect(lesson.theoryTranslations).toHaveLength(lesson.theory.length); expect(lesson.reading.questions.length).toBeGreaterThanOrEqual(3); expect(lesson.reading.passage.length).toBeGreaterThan(70);
    expect(lesson.dialogues!.every(dialogue => dialogue.lines.length >= 4)).toBe(true); expect(practiceTasks(lesson).length).toBeGreaterThanOrEqual(5); expect(miniTestTasks(lesson).length).toBeGreaterThanOrEqual(3);
    review += `\n## ${lesson.title.ru}\n`;
    lesson.theory.forEach((section, index) => { review += `\n### ${section.heading.ru}\n\nRU: ${section.body.ru}\n\nEN: ${section.body.en}\n\n${section.example}\n\nRU: ${lesson.theoryTranslations![index]!.ru}\n\nEN: ${lesson.theoryTranslations![index]!.en}\n`; });
    for (const entry of lesson.vocabulary) { expect(entry.grammar?.ru).toBeTruthy(); expect(entry.example).toBeTruthy(); expect(entry.exampleTranslation?.en).toBeTruthy(); review += `\n${entry.word}: ${entry.translation.ru} / ${entry.translation.en}\n${entry.grammar!.ru} / ${entry.grammar!.en}\n${entry.example}\n${entry.exampleTranslation!.ru} / ${entry.exampleTranslation!.en}\n`; }
    review += `\n### Чтение\n\n${lesson.reading.passage}\n\n${lesson.reading.translation.ru}\n\n${lesson.reading.translation.en}\n`;
    for (const dialogue of lesson.dialogues ?? []) { review += `\n### ${dialogue.title.ru}\n`; dialogue.lines.forEach(line => { review += `\n${line.speaker.ru}: ${line.sentence}\n${line.translation.ru} / ${line.translation.en}\n`; }); }
    for (const task of [...requiredTasks(lesson), ...miniTestTasks(lesson)]) {
      expect(ids.has(task.id), task.id).toBe(false); ids.add(task.id); kinds.add(task.kind);
      expect(checkAnswer(task, answer(task))).toBe(true); expect(checkAnswer(task, '')).toBe(false); expect(task.explanation.ru.length).toBeGreaterThan(5); expect(task.explanation.en.length).toBeGreaterThan(5);
      if (task.kind === 'choice') { expect(new Set(task.options).size).toBe(task.options.length); expect(task.options).toContain(task.correct); }
      if (task.kind === 'order') task.acceptedOrders.forEach(order => expect(new Set(order).size).toBe(task.tokens.length));
      review += `\n### ${task.id} · ${task.kind}\n\n${task.instruction.ru}\n${task.stem}\n${task.kind === 'choice' ? task.options.join(' / ') : task.kind === 'order' ? task.tokens.join(' | ') : ''}\nОтвет: ${correctAnswer(task, 'ru')}\nRU: ${task.explanation.ru}\nEN: ${task.explanation.en}\n`;
    }
  }
  expect([...kinds].sort()).toEqual(['choice', 'input', 'match', 'order']);
  writeFileSync('qa/learning-system/GERMAN_A1_MODULE_1_REVIEW.md', review);
});

test('normalisation accepts declared alternatives without erasing German capitalisation', () => {
  expect(normaliseAnswer('  I’m  here! ')).toBe("i'm here");
  const tasks = Object.values(lessonCatalog.de).flatMap(practiceTasks); const spelling = tasks.find(task => task.id === 'de-contact-p1')!;
  expect(checkAnswer(spelling, ' heiße. ')).toBe(true); expect(checkAnswer(spelling, 'heisse')).toBe(true); expect(checkAnswer(spelling, 'heist')).toBe(false);
  const correction = tasks.find(task => task.id === 'de-origin-p3')!;
  expect(checkAnswer(correction, 'er kommt aus wien')).toBe(false); expect(checkAnswer(correction, 'Er kommt aus Wien')).toBe(true);
  const matching = tasks.find(task => task.kind === 'match')!;
  expect(checkAnswer(matching, '{bad')).toBe(false); expect(checkAnswer(matching, '{}')).toBe(false);
});

test('final banks cover all five lessons, change by seed and grade stable IDs independently of display order', () => {
  const exam = moduleExams[0]!; expect(exam.bank).toHaveLength(25); expect(new Set(exam.bank.map(task => task.id)).size).toBe(25);
  const sets = new Set<string>();
  for (let seed = 1; seed <= 20; seed++) {
    const tasks = examTasks(exam, seed); expect(tasks).toHaveLength(10); const counts = [...new Set(tasks.map(task => task.lessonId))].map(id => tasks.filter(task => task.lessonId === id).length);
    expect(counts).toEqual([2, 2, 2, 2, 2]); sets.add([...tasks.map(task => task.id)].sort().join(','));
    const answers = Object.fromEntries(tasks.map(task => [task.id, answer(task)])); expect(gradeTasks([...tasks].reverse(), answers)).toEqual({ score: 10, total: 10 });
  }
  expect(sets.size).toBeGreaterThan(15); expect(passedExam(79, 100)).toBe(false); expect(passedExam(80, 100)).toBe(true); expect(passedExam(7, 10)).toBe(false); expect(passedExam(8, 10)).toBe(true); expect(passedExam(159, 200)).toBe(false);
});

test('practice, mini-tests, 5/6 milestones, independent languages and lossless history migration', () => {
  const state = defaultLevelsState(); const lesson = lessonCatalog.de['first-introductions']!;
  state.lessons['de:first-introductions'] = { visited: [0, 1, 2, 3, 4, 5, 6], attempts: [] };
  expect(lessonStatus(lesson, state.lessons['de:first-introductions']).percent).toBe(0);
  Object.values(lessonCatalog.de).forEach(lesson => finishLesson(state, lesson));
  expect(moduleStatus(state, 'de', 'A1', 'introductions')).toMatchObject({ percent: 83, completed: false, completedLessons: 5 });
  const exam = moduleExams[0]!; const tasks = examTasks(exam, 876); const answers = Object.fromEntries(tasks.map(task => [task.id, answer(task)]));
  const attempt = { id: 'one', answers, taskIds: tasks.map(task => task.id), seed: 876, ...gradeTasks(tasks, answers), completedAt: '2026-10-19T12:00:00.000Z' };
  const onlyExam = defaultLevelsState(); onlyExam.moduleAttempts['de:A1:introductions'] = [attempt];
  expect(moduleStatus(onlyExam, 'de', 'A1', 'introductions')).toMatchObject({ milestones: 1, percent: 17, completed: false });
  state.moduleAttempts['de:A1:introductions'] = [attempt];
  expect(moduleStatus(state, 'de', 'A1', 'introductions')).toMatchObject({ percent: 100, completed: true }); expect(levelStatus(state, 'de', 'A1')).toMatchObject({ percent: 13, completed: false, completedModules: 1 });
  expect(moduleStatus(state, 'en', 'A1', 'introductions').percent).toBe(0);
  state.lessons['de:first-introductions']!.attempts = Array.from({ length: 9 }, (_, i) => ({ ...state.lessons['de:first-introductions']!.attempts[0]!, completedAt: `2026-10-${10 + i}` }));
  state.moduleAttempts['de:A1:introductions'] = Array.from({ length: 9 }, (_, i) => ({ ...attempt, id: String(i), score: 0 }));
  const restored = parseLevels(JSON.stringify(languagePair(state, 'de', 'en'))); expect(restored.warning).toBeNull(); expect(restored.state.lessons['de:first-introductions']!.attempts).toHaveLength(9); expect(restored.state.moduleAttempts['de:A1:introductions']).toHaveLength(9); expect(restored.state.moduleAttempts['de:A1:introductions']![0]!.score).toBe(10);
  expect(moduleStatus(restored.state, 'de', 'A1', 'introductions').completed).toBe(true);
  const wrong = Object.fromEntries(tasks.map(task => [task.id, task.kind === 'choice' ? task.options.find(option => option !== task.correct)! : 'falsch']));
  restored.state.moduleAttempts['de:A1:introductions']!.push({ ...attempt, id: 'failed-retake', answers: wrong, ...gradeTasks(tasks, wrong) });
  expect(moduleStatus(restored.state, 'de', 'A1', 'introductions')).toMatchObject({ completed: true, percent: 100, last: { score: 0 }, best: { score: 10 } });
  const old = defaultLevelsState(); old.lessons['retired:lesson'] = { visited: [0], attempts: [] }; expect(parseLevels(JSON.stringify(old)).state.archivedLearning['lesson:retired:lesson']).toBeDefined();
  state.selectedLevels.de = 'C1'; expect(levelStatus(state, 'de', 'C1').completed).toBe(false);
  expect(summariseLevel([6, 6, 6, 6, 6, 6, 6, 5])).toMatchObject({ completed: false, completedModules: 7 });
  expect(summariseLevel([6, 6, 6, 6, 6, 6, 6, 6])).toMatchObject({ completed: true, percent: 100, completedModules: 8 });
  expect(summariseLevel([6])).toMatchObject({ completed: false, percent: 0 }); expect(cefrLevels.map(nextLevel)).toEqual(['A2', 'B1', 'B2', 'C1', null]);
  state.lastLesson.de = { level: 'A1', moduleId: 'introductions', lessonId: lesson.id, section: 6 }; state.selectedLevels.de = 'A2';
  expect(resumePath(state)).toBe('/learn/levels/modules/A2'); expect(state.lastLesson.de.lessonId).toBe(lesson.id);
});

async function fillTask(page: Page, task: Task, right = true) {
  const field = page.locator(`[data-question-id="${task.id}"]`);
  if (task.kind === 'choice') await field.getByRole('radio', { name: right ? task.correct : task.options.find(option => option !== task.correct)!, exact: true }).check();
  else if (task.kind === 'input') await field.getByRole('textbox').fill(right ? task.accepted[0]! : 'falsch');
  else if (task.kind === 'order') { for (const index of task.acceptedOrders[0]!) await field.getByRole('button', { name: task.tokens[index], exact: true }).click(); }
  else { for (const pair of task.pairs) await field.locator('select').nth(task.pairs.indexOf(pair)).selectOption(pair.id); }
}

test('actual five-lesson learning path, failed final at 70%, retake at 80%, persistence and language isolation', async ({ page }) => {
  test.setTimeout(180_000); const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  for (const lesson of Object.values(lessonCatalog.de)) {
    await page.goto(`${root}/lessons/A1/introductions/${lesson.id}`); await expect(page.locator('.level-learning > .level-progress progress')).toHaveAttribute('value', '0');
    for (const [section, tasks] of [[4, readingTasks(lesson)], [5, practiceTasks(lesson)]] as const) {
      await page.locator('.level-lesson-tabs button').nth(section).click();
      for (const task of tasks) { await fillTask(page, task); await page.locator(`[data-question-id="${task.id}"]`).locator('..').getByRole('button', { name: 'Проверить', exact: true }).click(); }
    }
    await page.locator('.level-lesson-tabs button').nth(6).click(); for (const task of miniTestTasks(lesson)) await fillTask(page, task);
    await page.getByRole('button', { name: 'Проверить мини-тест', exact: true }).click(); await expect(page.locator('.level-learning > .level-progress progress')).toHaveAttribute('value', '100');
  }
  await page.goto(`${root}/modules/A1/introductions`); await expect(page.locator('.level-card').first().locator('progress')).toHaveAttribute('value', '83'); await expect(page.locator('.level-lesson-row')).toHaveCount(6);
  await page.locator('.level-final-row a').click(); await page.getByRole('button', { name: 'Начать итоговый тест', exact: true }).click();
  const exam = moduleExams[0]!;
  for (const correctCount of [7, 8]) {
    const ids = await page.locator('[data-question-id]').evaluateAll(fields => fields.map(field => field.getAttribute('data-question-id')!));
    for (let i = 0; i < ids.length; i++) await fillTask(page, exam.bank.find(task => task.id === ids[i])!, i < correctCount);
    await page.getByRole('button', { name: 'Завершить тест', exact: true }).click(); await expect(page.locator('.level-exam-result .level-result-score')).toHaveText(`${correctCount}/10 · ${correctCount * 10}%`);
    if (correctCount === 7) { await expect(page.locator('.level-exam-result')).toContainText('Пока не сдан'); await page.getByRole('button', { name: 'Новая попытка', exact: true }).click(); }
  }
  await page.reload(); await expect(page.locator('.level-exam-result')).toContainText('Модуль завершён');
  const invitation = page.getByRole('dialog');
  await expect(invitation).toContainText('Первый модуль пройден');
  await expect(invitation.getByRole('button', { name: 'Создать бесплатный аккаунт', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(invitation).toHaveCount(0);
  await page.getByRole('link', { name: '← К списку уроков', exact: true }).click(); await expect(page.locator('.level-card').first().locator('progress')).toHaveAttribute('value', '100');
  let stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), LEVELS_STORAGE_KEY); expect(stored.moduleAttempts['de:A1:introductions']).toHaveLength(2);
  await page.goto(`${root}/languages`); await page.locator('.level-support-options button').filter({ hasText: 'English' }).click(); await page.getByRole('button', { name: 'Продолжить', exact: true }).click();
  await expect(page.locator('.level-module-row').first().locator('progress')).toHaveAttribute('value', '100');
  await page.goto(`${root}/languages`); await page.locator('.level-target-options button').nth(1).click(); await page.goto(`${root}/modules/A1`); await expect(page.locator('.level-module-row').first().locator('progress')).toHaveAttribute('value', '0');
  stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), LEVELS_STORAGE_KEY); expect(Object.keys(stored.lessons).filter(key => key.startsWith('de:'))).toHaveLength(5); expect(stored.activity.de.kind).toBe('module-test');
  expect(errors).toEqual([]);
});

test('new exercise formats and final page adapt to both themes and do not request audio', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['dark', 'light']) for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto(`${root}/lessons/A1/introductions/a1-introductions-3`);
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    await page.locator('.level-lesson-tabs button').nth(5).click(); await expect(page.locator('.level-order-task')).toBeVisible(); await expect(page.locator('.level-match-task')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `qa/learning-system/practice-${width}-${theme}.png`, fullPage: true });
    await page.goto(`${root}/modules/A1/introductions/final`); await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    await expect(page.locator('.level-steps')).toHaveCount(0); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('audio,video,[class*="microphone"],.level-audio-check')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('protected site sources and approved setup/placement/diagnostic screens stay byte-for-byte unchanged', () => {
  const baseline: Record<string, string> = JSON.parse(readFileSync('qa/learning-system/protected-before.json', 'utf8').replace(/^\uFEFF/, ''));
  const changed = Object.entries(approvedPracticeSpeechSources(baseline)).filter(([path, hash]) => createHash('sha256').update(readFileSync(path)).digest('hex') !== hash).map(([path]) => path); expect(changed).toEqual([]);
  writeFileSync('qa/learning-system/protected-audit.json', JSON.stringify({ protected: Object.keys(baseline).length, changed }, null, 2));
});
