import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { allQuestions, questionBank, questionById } from '../src/pages/learning/levels/data/questions';
import { curricula } from '../src/pages/learning/levels/data/curriculum';
import { gradeQuestions, lessonCatalog, lessonKey, sampleLessons } from '../src/pages/learning/levels/data/lessons';
import { assessmentLength, assessmentResult, commitResponse, estimateAbility, newAssessment, nextQuestion, orderedOptions, withoutListening } from '../src/pages/learning/levels/assessment';
import { defaultLevelsState, languagePair, parseLevels } from '../src/pages/learning/levels/storage';
import { cefrLevels } from '../src/pages/learning/levels/model';
import type { Question } from '../src/pages/learning/levels/model';
import type { LearningLanguage } from '../src/domain/types';
import { approvedPracticeSpeechSources } from './protected-source';

mkdirSync('qa/levels', { recursive: true });
const pairs = [['de', 'ru'], ['de', 'en'], ['en', 'ru'], ['en', 'de']] as const;
function simulate(language: LearningLanguage, audio: boolean, right: (q: Question) => boolean, seed = 1234) {
  let run = newAssessment(language, audio, seed);
  for (let i = 0; i < assessmentLength; i++) {
    const q = nextQuestion(run)!;
    expect(q).toBeDefined();
    run = { ...run, questionIds: [...run.questionIds, q.id], heardIds: q.skill === 'listening' ? [...run.heardIds, q.id] : run.heardIds };
    run = commitResponse(run, i, q.id, right(q) ? q.correct : q.options.find(option => option !== q.correct)!);
  }
  return { ...run, completed: true };
}

test('original bookstore image and protected site, Practice and design sources stay unchanged', () => {
  expect(createHash('sha256').update(readFileSync('public/assets/learning/levels/bookstore.png')).digest('hex')).toBe('7b845773bab20a1ef936c13f233a962341f4bb93e066c3dfff6c92ef4d1ca71e');
  const baseline: Record<string, string> = JSON.parse(readFileSync('qa/levels/protected-before.json', 'utf8').replace(/^\uFEFF/, ''));
  const changed = Object.entries(approvedPracticeSpeechSources(baseline)).filter(([file, hash]) => createHash('sha256').update(readFileSync(file)).digest('hex') !== hash).map(([file]) => file);
  expect(changed).toEqual([]);
  writeFileSync('qa/levels/protected-audit.json', JSON.stringify({ protected: Object.keys(baseline).length, changed }, null, 2));
});

test('110 original diagnostic questions, separate curricula and preserved lesson examples have valid answer keys', () => {
  expect(allQuestions).toHaveLength(110); expect(new Set(allQuestions.map(q => q.id)).size).toBe(110);
  let review = '# Learning by Level — редакционный черновик\n\nПримерные сложности заданий не являются калиброванными порогами CEFR.\n';
  let lessonReview = '# Полноценные образцы уроков A1 — DE / EN\n';
  let curriculumReview = '# Учебные программы — DE / EN\n\nВсе уровни доступны. German A1: первый модуль содержит пять полноценных уроков и отдельный итоговый тест. English A1: два сохранённых образца, которые будут расширены. Полный план: qa/learning-system/COURSE_PLAN.md. Остальные модули — план для наполнения.\n';
  for (const language of ['de', 'en'] as const) {
    expect(questionBank[language]).toHaveLength(55);
    expect(curricula[language]).toHaveLength(40);
    for (const level of cefrLevels) {
      expect(questionBank[language].filter(q => q.level === level)).toHaveLength(11);
      expect(curricula[language].filter(module => module.level === level)).toHaveLength(8);
    }
    expect(curricula[language].filter(module => module.lessonIds.length)).toHaveLength(1);
    curriculumReview += `\n## ${language.toUpperCase()}\n\n| Уровень | ID | RU | DE | EN | Готовых уроков |\n|---|---|---|---|---|---|\n`;
    for (const module of curricula[language]) {
      for (const id of module.lessonIds) {
        expect(lessonCatalog[language][id].moduleId).toBe(module.id);
        expect(lessonCatalog[language][id].level).toBe(module.level);
      }
      curriculumReview += `| ${module.level} | ${module.id} | ${module.title.ru}: ${module.description.ru} | ${module.title.de}: ${module.description.de} | ${module.title.en}: ${module.description.en} | ${module.lessonIds.length} |\n`;
    }
    const lesson = sampleLessons[language];
    expect(lesson.theory.length).toBeGreaterThanOrEqual(3); expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(8);
    expect(lesson.reading.questions).toHaveLength(3); expect(lesson.exercises).toHaveLength(4); expect(lesson.quiz).toHaveLength(5);
    expect(gradeQuestions(lesson.quiz, Object.fromEntries(lesson.quiz.map(q => [q.id, q.correct])))).toEqual({ score: 5, total: 5 });
    lessonReview += `\n## ${language.toUpperCase()} — ${lesson.title.ru}\n\n### Теория\n`;
    for (const section of lesson.theory) lessonReview += `\n#### ${section.heading.ru}\n\nRU: ${section.body.ru}\n\nDE: ${section.body.de}\n\nEN: ${section.body.en}\n\n${section.example}\n`;
    lessonReview += '\n### Лексика\n\n| Слово | RU | DE | EN |\n|---|---|---|---|\n';
    for (const entry of lesson.vocabulary) lessonReview += `| ${entry.word} | ${entry.translation.ru} | ${entry.translation.de} | ${entry.translation.en} |\n`;
    lessonReview += '\n### Примеры\n';
    for (const entry of lesson.examples) lessonReview += `\n${entry.sentence}\n\nRU: ${entry.translation.ru}\n\nDE: ${entry.translation.de}\n\nEN: ${entry.translation.en}\n`;
    lessonReview += `\n### Чтение\n\n${lesson.reading.passage}\n\nRU: ${lesson.reading.translation.ru}\n\nDE: ${lesson.reading.translation.de}\n\nEN: ${lesson.reading.translation.en}\n\nЗадания чтения, упражнения и мини-тест приведены по ID в questions-review.md.\n`;
    for (const q of [...questionBank[language], ...lesson.reading.questions, ...lesson.exercises, ...lesson.quiz]) {
      expect(q.language).toBe(language); expect(q.options).toHaveLength(4); expect(new Set(q.options).size).toBe(4); expect(q.options).toContain(q.correct);
      for (const lang of ['ru', 'de', 'en'] as const) for (const value of [q.instruction, q.explanation, q.topic]) expect(value[lang].length).toBeGreaterThan(2);
      if (q.skill === 'reading' || q.skill === 'listening') {
        // Lesson reading tasks share the lesson passage, placement tasks carry their own passage.
        if (questionById.has(q.id)) expect(q.passage!.length).toBeGreaterThan(30);
      }
      review += `\n## ${q.id} · ${q.level} · ${q.skill}\n\n${q.passage ?? ''}\n\n${q.stem}\n\n${q.options.join(' / ')}\n\nПравильно: ${q.correct}\n\nRU: ${q.explanation.ru}\n\nDE: ${q.explanation.de}\n\nEN: ${q.explanation.en}\n`;
    }
  }
  expect(curricula.de.filter(module => module.level === 'B1').map(module => module.id)).not.toEqual(curricula.en.filter(module => module.level === 'B1').map(module => module.id));
  writeFileSync('qa/levels/questions-review.md', review);
  writeFileSync('qa/levels/lessons-review.md', lessonReview);
  writeFileSync('qa/levels/curriculum-review.md', curriculumReview);
});

test('adaptive selection changes with real answers, covers bands, rotates the bank and never repeats items', () => {
  const summary = [];
  for (const language of ['de', 'en'] as const) for (const audio of [false, true]) {
    const good = simulate(language, audio, () => true); const poor = simulate(language, audio, () => false);
    expect(assessmentResult(good).level).toBe('C1'); expect(assessmentResult(poor).level).toBe('A1');
    expect(estimateAbility(good)).toBeGreaterThan(estimateAbility(poor));
    expect(good.questionIds.slice(0, 12)).not.toEqual(poor.questionIds.slice(0, 12));
    for (const run of [good, poor]) {
      expect(new Set(run.questionIds).size).toBe(30); expect(assessmentResult(run).total).toBe(30);
      expect(run.questionIds.some(id => questionById.get(id)!.skill === 'listening')).toBe(audio);
      expect(assessmentResult(run).skills.listening.total).toBe(audio ? 6 : 0);
      for (const skill of ['grammar', 'vocabulary', 'reading'] as const) expect(assessmentResult(run).skills[skill].total).toBe(audio ? 8 : 10);
      const restored = parseLevels(JSON.stringify({ ...defaultLevelsState(language), runs: { [language]: run } }));
      expect(restored.warning).toBeNull(); expect(restored.state.results[language]!.level).toBe(assessmentResult(run).level);
    }
    summary.push({ language, audio, good: assessmentResult(good), poor: assessmentResult(poor) });
  }
  const paths = new Set(Array.from({ length: 12 }, (_, seed) => simulate('de', false, q => cefrLevels.indexOf(q.level) <= 2, seed).questionIds.join(',')));
  expect(paths.size).toBeGreaterThan(9);
  const first = questionBank.de[0]; expect(new Set(Array.from({ length: 12 }, (_, seed) => orderedOptions(first, seed).indexOf(first.correct))).size).toBeGreaterThan(1);
  writeFileSync('qa/levels/adaptive-results.json', JSON.stringify(summary, null, 2));
});

test('editing a past answer discards future adaptation; unheard or disabled audio never contributes a score', () => {
  const complete = simulate('de', true, () => true);
  const index = 7; const q = questionById.get(complete.questionIds[index])!;
  const edited = commitResponse(complete, index, q.id, q.options.find(option => option !== q.correct)!);
  expect(edited.responses).toHaveLength(index + 1); expect(edited.questionIds).toHaveLength(index + 1); expect(edited.completed).toBe(false);
  expect(edited.heardIds.every(id => edited.questionIds.includes(id))).toBe(true);
  expect(parseLevels(JSON.stringify({ ...defaultLevelsState(), runs: { de: edited } })).warning).toBeNull();
  const silent = withoutListening(complete);
  expect(silent.audioEnabled).toBe(false); expect(assessmentResult(silent).skills.listening.percent).toBeNull();
  expect(assessmentResult({ ...complete, heardIds: [] }).skills.listening.total).toBe(0);
  expect(assessmentResult({ ...complete, responses: [] }).total).toBe(0);
});

test('feature storage validates pairs and scores without touching existing preferences or Practice storage', () => {
  for (const [language, support] of pairs) expect(languagePair(defaultLevelsState(), language, support).supportLanguage).toBe(support);
  expect(languagePair(defaultLevelsState(), 'en', 'en').supportLanguage).toBe('ru');
  expect(parseLevels('{broken').warning).toBe('invalid');
  expect(parseLevels(JSON.stringify({ ...defaultLevelsState(), supportLanguage: 'de' })).warning).toBe('invalid');
  const run = simulate('en', false, () => false);
  const stored = parseLevels(JSON.stringify({ ...defaultLevelsState('en'), runs: { en: run }, results: { en: { percent: 100, level: 'C1' } } }));
  expect(stored.state.results.en!.correct).toBe(0); expect(stored.state.results.en!.level).toBe('A1');
  const lesson = sampleLessons.en;
  const answers = Object.fromEntries(lesson.quiz.map(q => [q.id, q.options.find(option => option !== q.correct)]));
  const progress = parseLevels(JSON.stringify({ ...defaultLevelsState('en'), lessons: { [lessonKey('en', lesson.id)]: { visited: [0, 0, 5], attempts: [{ answers, score: 5, total: 5, completedAt: new Date().toISOString() }] } } }));
  expect(progress.state.lessons[lessonKey('en', lesson.id)].attempts[0].score).toBe(0);
});

