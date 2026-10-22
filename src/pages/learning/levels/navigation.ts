import { lessonCatalog } from './data/lessons';
import type { CefrLevel, LevelsState } from './model';

export const levelsBase = '/learn/levels';
export const modulesPath = (level: CefrLevel | string) => `${levelsBase}/modules/${level}`;
export const lessonPath = (level: string, moduleId: string, lessonId: string) => `${levelsBase}/lessons/${level}/${moduleId}/${lessonId}`;
export function resumePath(state: LevelsState) {
  const last = state.lastLesson[state.targetLanguage];
  const lesson = last && lessonCatalog[state.targetLanguage][last.lessonId];
  return lesson && lesson.level === state.selectedLevels[state.targetLanguage] && lesson.level === last.level && lesson.moduleId === last.moduleId
    ? lessonPath(last.level, last.moduleId, last.lessonId)
    : modulesPath(state.selectedLevels[state.targetLanguage]);
}
