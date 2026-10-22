import type { LearningLanguage, UiLanguage } from '../../domain/types';

export type Localized = Record<UiLanguage, string>;
export const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export type TutorLevel = typeof levels[number];
// Learning goals remain only in student applications, never as tutor specialisations.
export const goals = ['conversation', 'grammar', 'work', 'exams', 'travel'] as const;
export interface TutorContact { telegram: string | null; email: string | null }
export interface Tutor {
  id: string; name: string; image: string; demo: boolean; founder?: boolean;
  languages: LearningLanguage[]; levels: TutorLevel[]; price: number; trialPrice: number;
  nativeTeachingLanguage: LearningLanguage | null;
  spokenLanguages: Localized; story: Localized; about: Localized; experience: Localized | null;
}
export interface CatalogFilters { search: string; language: string; level: string; price: string; sort: string }
export interface LessonRequest {
  name: string; email: string; language: LearningLanguage; level: string;
  goal: string; time: string; message: string;
}
export interface TeacherApplication {
  name: string; email: string; languages: LearningLanguage[]; spokenLanguages: string;
  education: string; experience: string; levels: TutorLevel[]; about: string; additional: string;
}
export type Application = { kind: 'lesson'; tutorId: string; fields: LessonRequest } | { kind: 'teacher'; fields: TeacherApplication };
export interface SubmissionReceipt { kind: Application['kind']; tutorId?: string; submittedAt: number }
export type SubmissionIssue = 'invalid' | 'rate-limited' | 'spam' | 'provider-error';
