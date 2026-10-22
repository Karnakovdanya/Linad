import type { LearningLanguage, UiLanguage } from '../../../domain/types';

export const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export type CefrLevel = typeof cefrLevels[number];
export type Text = Record<UiLanguage, string>;
export const text = (ru: string, de: string, en: string): Text => ({ ru, de, en });
export type Skill = 'grammar' | 'vocabulary' | 'reading' | 'listening';
export interface Question {
  id: string; language: LearningLanguage; level: CefrLevel; skill: Skill; topic: Text;
  instruction: Text; stem: string; passage?: string; options: readonly string[]; correct: string; explanation: Text;
}
export interface Response { questionId: string; answer: string }
export interface AssessmentRun {
  id: string; language: LearningLanguage; seed: number; audioEnabled: boolean; questionIds: string[];
  responses: Response[]; heardIds: string[]; completed: boolean; startedAt: string;
}
export interface SkillResult { correct: number; total: number; percent: number | null }
export interface AssessmentResult {
  runId: string; language: LearningLanguage; level: CefrLevel; theta: number; total: number; correct: number;
  skills: Record<Skill, SkillResult>; weakTopics: Text[]; belowA1: boolean; completedAt: string;
}
export interface LessonProgress { visited: number[]; attempts: { answers: Record<string, string>; score: number; total: number; completedAt: string }[] }
export interface LevelsState {
  version: 1; targetLanguage: LearningLanguage; supportLanguage: UiLanguage;
  selectedLevels: Record<LearningLanguage, CefrLevel>;
  runs: Partial<Record<LearningLanguage, AssessmentRun>>;
  results: Partial<Record<LearningLanguage, AssessmentResult>>;
  lessons: Record<string, LessonProgress>;
  setupComplete: Partial<Record<LearningLanguage, boolean>>;
  lastLesson: Partial<Record<LearningLanguage, { level: CefrLevel; moduleId: string; lessonId: string; section: number }>>;
  assessmentHistory: AssessmentRun[];
  placementChoice: Partial<Record<LearningLanguage, 'manual' | 'test'>>;
  lessonSectionsVersion: 2;
}
export interface CurriculumModule { id: string; level: CefrLevel; title: Text; description: Text; icon: 'people' | 'book' | 'chat' | 'graduation'; lessonIds: string[] }
export interface Lesson {
  id: string; language: LearningLanguage; level: CefrLevel; moduleId: string; title: Text; description: Text;
  theory: { heading: Text; body: Text; example: string }[];
  vocabulary: { word: string; translation: Text }[];
  examples: { sentence: string; translation: Text }[];
  reading: { passage: string; translation: Text; questions: Question[] };
  exercises: Question[]; quiz: Question[];
  dialogues?: { title: Text; lines: { speaker: Text; sentence: string; translation: Text }[] }[];
  forms?: { headings: Text[]; rows: string[][] };
  important?: Text[];
}
