import type { LearningLanguage } from '../../../../domain/types';
import { cefrLevels, type CefrLevel } from '../model';
import { curricula } from './curriculum';
import { germanPlanRows } from './plan-de';
import { englishPlanRows } from './plan-en';

export interface PlannedLesson {
  id: string; number: number; title: string; focus: string; outcome: string;
  prerequisiteIds: string[]; status: 'planned';
}
export interface PlannedModule {
  id: string; language: LearningLanguage; level: CefrLevel; number: number;
  lessons: PlannedLesson[]; finalTest: { id: string; passPercent: 80; coveredLessonIds: string[] };
}
// Prerequisites describe the teaching sequence; they never restrict navigation.
export const coursePlan: Record<LearningLanguage, PlannedModule[]> = { de: [], en: [] };
for (const language of ['de', 'en'] as const) {
  let previous: string | undefined;
  const rows = language === 'de' ? germanPlanRows : englishPlanRows;
  for (const level of cefrLevels) {
    curricula[language].filter(module => module.level === level).forEach((module, index) => {
      const entries = rows[level] as Record<string, string[]>;
      const lessons = (entries[module.id] ?? []).map((row, lessonIndex): PlannedLesson => {
        const [title = '', focus = '', outcome = ''] = row.split('~');
        const id = level === 'A1' && module.id === 'introductions' && lessonIndex < 2
          ? ['first-introductions', 'introduction-questions'][lessonIndex]!
          : `${level.toLowerCase()}-${module.id}-${lessonIndex + 1}`;
        const lesson = { id, number: lessonIndex + 1, title, focus, outcome, prerequisiteIds: previous ? [previous] : [], status: 'planned' as const };
        previous = id;
        return lesson;
      });
      coursePlan[language].push({ id: module.id, language, level, number: index + 1, lessons,
        finalTest: { id: `${language}-${level}-${module.id}-final`, passPercent: 80, coveredLessonIds: lessons.map(lesson => lesson.id) } });
    });
  }
}
export const modulePlan = (language: LearningLanguage, level: CefrLevel, id: string) => coursePlan[language].find(module => module.level === level && module.id === id);
