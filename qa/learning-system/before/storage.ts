import type { LearningLanguage, UiLanguage } from '../../../domain/types';
import type { AssessmentRun, CefrLevel, LevelsState, LessonProgress } from './model';
import { cefrLevels } from './model';
import { assessmentResult, assessmentLength, withoutListening } from './assessment';
import { questionById } from './data/questions';
import { gradeQuestions, lessonKey, lessonCatalog } from './data/lessons';

export const LEVELS_STORAGE_KEY = 'linad.levels.v1';
export function defaultLevelsState(targetLanguage: LearningLanguage = 'de'): LevelsState {
  return { version: 1, targetLanguage, supportLanguage: 'ru', selectedLevels: { de: 'A1', en: 'A1' }, runs: {}, results: {}, lessons: {}, setupComplete: {}, lastLesson: {}, assessmentHistory: [], placementChoice: {}, lessonSectionsVersion: 2 };
}
const isLevel = (v: unknown): v is CefrLevel => cefrLevels.includes(v as CefrLevel);
function validRun(value: unknown, language: LearningLanguage): value is AssessmentRun {
  if (!value || typeof value !== 'object') return false;
  const run = value as AssessmentRun;
  if (run.language !== language || typeof run.id !== 'string' || !Number.isInteger(run.seed) || typeof run.audioEnabled !== 'boolean' || typeof run.completed !== 'boolean' || typeof run.startedAt !== 'string' || !Array.isArray(run.responses) || !Array.isArray(run.questionIds) || !Array.isArray(run.heardIds)) return false;
  if (run.responses.length > assessmentLength || run.questionIds.length > assessmentLength || run.questionIds.length < run.responses.length || new Set(run.questionIds).size !== run.questionIds.length) return false;
  if (!run.questionIds.every(id => typeof id === 'string' && questionById.get(id)?.language === language)) return false;
  if (!run.heardIds.every(id => run.questionIds.includes(id) && questionById.get(id)?.skill === 'listening')) return false;
  return run.responses.every((r, i) => r && typeof r === 'object' && r.questionId === run.questionIds[i] && questionById.get(r.questionId)?.options.includes(r.answer) && (questionById.get(r.questionId)?.skill !== 'listening' || (run.audioEnabled && run.heardIds.includes(r.questionId)))) && (!run.completed || run.responses.length === assessmentLength);
}
export function parseLevels(value: string | null, fallback: LearningLanguage = 'de'): { state: LevelsState; warning: 'invalid' | 'unavailable' | null } {
  if (value === null) return { state: defaultLevelsState(fallback), warning: null };
  try {
    const raw = JSON.parse(value);
    if (!raw || raw.version !== 1 || !['de', 'en'].includes(raw.targetLanguage) || !['ru', 'de', 'en'].includes(raw.supportLanguage) || raw.supportLanguage === raw.targetLanguage || !isLevel(raw.selectedLevels?.de) || !isLevel(raw.selectedLevels?.en) || !raw.runs || !raw.lessons || typeof raw.lessons !== 'object' || Array.isArray(raw.lessons)) throw new Error('Invalid settings');
    const state: LevelsState = { ...defaultLevelsState(), targetLanguage: raw.targetLanguage, supportLanguage: raw.supportLanguage, selectedLevels: raw.selectedLevels };
    if (raw.assessmentHistory !== undefined && !Array.isArray(raw.assessmentHistory)) throw new Error('Invalid assessment history');
    for (const run of raw.assessmentHistory ?? []) {
      if (!['de', 'en'].includes(run?.language) || !validRun(run, run.language) || !run.completed) throw new Error('Invalid historical assessment');
      if (!state.assessmentHistory.some(saved => saved.id === run.id)) state.assessmentHistory.push(run);
    }
    for (const language of ['de', 'en'] as const) if (raw.runs[language] !== undefined) {
      if (!validRun(raw.runs[language], language)) throw new Error('Invalid assessment');
      state.runs[language] = raw.runs[language].audioEnabled && !raw.runs[language].completed ? withoutListening(raw.runs[language]) : raw.runs[language];
      // Scores are always reconstructed from saved answers, never trusted percentages.
      if (raw.runs[language].completed) state.results[language] = assessmentResult(raw.runs[language]);
    }
    for (const language of ['de', 'en'] as const) {
      // A retake must not erase the last completed recommendation.
      if (!state.results[language]) {
        const previous = state.assessmentHistory.filter(run => run.language === language).at(-1);
        if (previous) state.results[language] = assessmentResult(previous);
      }
      const choice = raw.placementChoice?.[language];
      if (choice === 'manual' || choice === 'test') state.placementChoice[language] = choice;
      else if (state.results[language]) state.placementChoice[language] = 'test';
      const last = raw.lastLesson?.[language];
      const lesson = last && lessonCatalog[language][last.lessonId];
      if (lesson && lesson.level === last.level && lesson.moduleId === last.moduleId && Number.isInteger(last.section) && last.section >= 0 && last.section < 7) state.lastLesson[language] = last;
      if (raw.setupComplete?.[language] === true || state.lastLesson[language]) state.setupComplete[language] = true;
    }
    for (const [key, value] of Object.entries(raw.lessons)) {
      const lesson = Object.values(lessonCatalog).flatMap(catalog => Object.values(catalog)).find(lesson => lessonKey(lesson.language, lesson.id) === key);
      if (!lesson) throw new Error('Unknown lesson');
      const progress = value as LessonProgress;
      if (!progress || !Array.isArray(progress.visited) || !progress.visited.every(step => Number.isInteger(step) && step >= 0 && step < 7) || !Array.isArray(progress.attempts)) throw new Error('Invalid progress');
      if (!progress.attempts.every(attempt => attempt && typeof attempt.answers === 'object' && attempt.answers !== null && !Array.isArray(attempt.answers) && Object.values(attempt.answers).every(answer => typeof answer === 'string') && Number.isInteger(attempt.score) && Number.isInteger(attempt.total) && attempt.total > 0 && attempt.score >= 0 && attempt.score <= attempt.total && typeof attempt.completedAt === 'string')) throw new Error('Invalid attempt');
      if (!progress.attempts.every(attempt => lesson.quiz.every(q => q.options.includes(attempt.answers[q.id] ?? '')))) throw new Error('Incomplete quiz');
      const visited = raw.lessonSectionsVersion === 2 ? progress.visited : progress.visited.map(step => [0, 1, 2, 4, 5, 6, 6][step]!);
      state.lessons[key] = { visited: [...new Set(visited)], attempts: progress.attempts.slice(-5).map(attempt => ({ ...attempt, ...gradeQuestions(lesson.quiz, attempt.answers) })) };
      // Migrate existing learners without asking them to repeat the initial setup.
      if (raw.setupComplete === undefined && progress.visited.length) state.setupComplete[lesson.language] = true;
    }
    return { state, warning: null };
  } catch { return { state: defaultLevelsState(fallback), warning: 'invalid' }; }
}
export const localLevelsStorage = {
  read(fallback: LearningLanguage) { try { return parseLevels(localStorage.getItem(LEVELS_STORAGE_KEY), fallback); } catch { return { state: defaultLevelsState(fallback), warning: 'unavailable' as const }; } },
  write(state: LevelsState) { try { localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(state)); return true; } catch { return false; } },
};
export function languagePair(state: LevelsState, targetLanguage: LearningLanguage, supportLanguage: UiLanguage = state.supportLanguage): LevelsState {
  return { ...state, targetLanguage, supportLanguage: supportLanguage === targetLanguage ? 'ru' : supportLanguage };
}
