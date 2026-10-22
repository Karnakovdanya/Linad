import type { UiLanguage } from '../../../../domain/types';

export const practiceLanguages = ['ru', 'de', 'en'] as const;
export type Translation = Record<UiLanguage, string>;
export interface PracticeEntry { id: string; text: Translation }
export type DialogueSpeaker = 'doctor' | 'patient' | 'receptionist' | 'pharmacist' | 'dispatcher' | 'helper' | 'caller' | 'learner' | 'partner';
export interface DialogueLine { speaker: DialogueSpeaker; text: Translation }
export interface PracticeDialogue { id: string; title: Translation; participants?: Partial<Record<DialogueSpeaker, Translation>>; lines: readonly DialogueLine[] }
export interface PracticeMaterial {
  status: 'draft';
  phrases: readonly PracticeEntry[];
  dialogues: readonly PracticeDialogue[];
  words: readonly PracticeEntry[];
}

export function translation(ru: string, de: string, en: string): Translation { return { ru, de, en }; }
