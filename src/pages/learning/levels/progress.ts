import type { LearningLanguage } from '../../../domain/types';
import type { CefrLevel, Lesson, LessonProgress, LevelsState } from './model';
import { cefrLevels } from './model';
import { lessonCatalog, lessonKey } from './data/lessons';
import { coursePlan, modulePlan } from './data/course-plan';
import { findExam } from './data/module-exams';
import { asTask, checkAnswer, examTasks, gradeTasks, isAnswerShape, passedExam } from './tasks';

export const readingTasks = (lesson: Lesson) => lesson.reading.questions.map(q => asTask(q, lesson.id));
export const practiceTasks = (lesson: Lesson) => lesson.practiceTasks ?? lesson.exercises.map(q => asTask(q, lesson.id));
export const miniTestTasks = (lesson: Lesson) => lesson.miniTestTasks ?? lesson.quiz.map(q => asTask(q, lesson.id));
export const requiredTasks = (lesson: Lesson) => [...readingTasks(lesson), ...practiceTasks(lesson)];
export function lessonStatus(lesson: Lesson, progress?: LessonProgress) {
  const tasks = requiredTasks(lesson); const quiz = miniTestTasks(lesson);
  const correct = tasks.filter(task => progress?.practice?.some(entry => entry.taskId === task.id && checkAnswer(task, entry.answer))).length;
  const submitted = Boolean(quiz.length && progress?.attempts.some(attempt => quiz.every(task => isAnswerShape(task, attempt.answers[task.id]))));
  const completed = tasks.length > 0 && correct === tasks.length && submitted;
  return { status: completed ? 'completed' : progress?.visited.length || progress?.practice?.length || progress?.attempts.length ? 'in-progress' : 'not-started',
    completed, correct, required: tasks.length, submitted, percent: Math.round((correct + Number(submitted)) / (tasks.length + 1) * 100) };
}
export function moduleStatus(state: LevelsState, language: LearningLanguage, level: CefrLevel, moduleId: string) {
  const plan = modulePlan(language, level, moduleId); const exam = findExam(language, level, moduleId);
  const completedLessons = plan?.lessons.filter(item => {
    const lesson = lessonCatalog[language][item.id];
    return lesson && lessonStatus(lesson, state.lessons[lessonKey(language, item.id)]).completed;
  }).length ?? 0;
  const attempts = state.moduleAttempts?.[`${language}:${level}:${moduleId}`] ?? [];
  const valid = attempts.flatMap(attempt => {
    if (!exam) return [];
    const tasks = examTasks(exam, attempt.seed);
    if (tasks.length !== 5 * exam.perLesson || JSON.stringify(attempt.taskIds) !== JSON.stringify(tasks.map(task => task.id)) || !tasks.every(task => isAnswerShape(task, attempt.answers[task.id]))) return [];
    return [{ ...attempt, ...gradeTasks(tasks, attempt.answers) }];
  });
  const passed = valid.some(attempt => passedExam(attempt.score, attempt.total));
  const best = valid.reduce<typeof valid[number] | undefined>((best, attempt) => !best || attempt.score / attempt.total > best.score / best.total ? attempt : best, undefined);
  return { completedLessons, passed, milestones: completedLessons + Number(passed), percent: Math.round((completedLessons + Number(passed)) / 6 * 100), completed: completedLessons === 5 && passed, attempts: valid, best, last: valid.at(-1) };
}
export function levelStatus(state: LevelsState, language: LearningLanguage, level: CefrLevel) {
  // Exactly eight modules and forty-eight milestones, including unpublished material.
  const modules = Array.from({ length: 8 }, (_, index) => index);
  const plans = modulePlanList(language, level);
  const statuses = modules.map(index => plans[index] ? moduleStatus(state, language, level, plans[index]!.id) : undefined);
  return summariseLevel(statuses.map(status => status?.milestones ?? 0));
}
export function summariseLevel(milestones: readonly number[]) {
  const valid = milestones.length === 8 && milestones.every(value => Number.isInteger(value) && value >= 0 && value <= 6);
  return { completedModules: valid ? milestones.filter(value => value === 6).length : 0, percent: valid ? Math.round(milestones.reduce((sum, value) => sum + value, 0) / 48 * 100) : 0, completed: valid && milestones.every(value => value === 6) };
}
function modulePlanList(language: LearningLanguage, level: CefrLevel) {
  // Imported plans are editorial prerequisites, not access restrictions.
  return coursePlan[language].filter(module => module.level === level);
}
export function nextLevel(level: CefrLevel): CefrLevel | null { return cefrLevels[cefrLevels.indexOf(level) + 1] ?? null; }
export const completionKey = (language: LearningLanguage, level: CefrLevel) => `${language}:${level}`;
