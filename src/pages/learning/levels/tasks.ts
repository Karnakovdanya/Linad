import type { LearningLanguage, UiLanguage } from '../../../domain/types';
import { text, type Question, type Text } from './model';

interface BaseTask { id: string; language: LearningLanguage; instruction: Text; stem: string; prompt?: Text; explanation: Text; lessonId: string }
export type Task = BaseTask & (
  | { kind: 'choice'; options: readonly string[]; correct: string }
  | { kind: 'input'; format: 'gap' | 'translation' | 'correction' | 'dialogue'; accepted: readonly string[]; caseSensitive?: boolean }
  | { kind: 'order'; tokens: readonly string[]; acceptedOrders: readonly (readonly number[])[] }
  | { kind: 'match'; pairs: readonly { id: string; left: string; right: Text }[] }
);
export interface TaskAttempt { id: string; answers: Record<string, string>; score: number; total: number; completedAt: string; taskIds: string[]; seed: number }
export interface PracticeEntry { taskId: string; answer: string; checkedAt: string }
export interface ModuleExam { id: string; language: LearningLanguage; level: string; moduleId: string; bank: Task[]; perLesson: number }
export const asTask = (q: Question, lessonId = ''): Task => ({ ...q, kind: 'choice', lessonId });
export function normaliseAnswer(value: string, caseSensitive = false) {
  const normal = value.normalize('NFC').replace(/[’‘]/g, "'").trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '').trim();
  return caseSensitive ? normal : normal.toLocaleLowerCase();
}
export function isAnswerShape(task: Task, answer: unknown): answer is string {
  if (typeof answer !== 'string' || !answer.trim() || answer.length > 4000) return false;
  if (task.kind === 'choice') return task.options.includes(answer);
  if (task.kind === 'input') return true;
  try {
    const parsed: unknown = JSON.parse(answer);
    if (task.kind === 'order') return Array.isArray(parsed) && parsed.length === task.tokens.length && new Set(parsed).size === parsed.length && parsed.every(i => Number.isInteger(i) && i >= 0 && i < task.tokens.length);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
    const pairs = parsed as Record<string, string>;
    return Object.keys(pairs).length === task.pairs.length && task.pairs.every(pair => task.pairs.some(option => option.id === pairs[pair.id]));
  } catch { return false; }
}
export function checkAnswer(task: Task, answer: string | undefined) {
  if (!isAnswerShape(task, answer)) return false;
  if (task.kind === 'choice') return answer === task.correct;
  if (task.kind === 'input') return task.accepted.some(value => normaliseAnswer(value, task.caseSensitive) === normaliseAnswer(answer, task.caseSensitive));
  if (task.kind === 'order') return task.acceptedOrders.some(order => JSON.stringify(order) === JSON.stringify(JSON.parse(answer)));
  const pairs = JSON.parse(answer) as Record<string, string>;
  return task.pairs.every(pair => pairs[pair.id] === pair.id);
}
export function correctAnswer(task: Task, support: UiLanguage) {
  if (task.kind === 'choice') return task.correct;
  if (task.kind === 'input') return task.accepted.join(' / ');
  if (task.kind === 'order') return task.acceptedOrders.map(order => order.map(i => task.tokens[i]).join(' ')).join(' / ');
  return task.pairs.map(pair => `${pair.left} → ${pair.right[support]}`).join('; ');
}
export function gradeTasks(tasks: readonly Task[], answers: Record<string, string>) {
  return { score: tasks.filter(task => checkAnswer(task, answers[task.id])).length, total: tasks.length };
}
export const passedExam = (score: number, total: number) => Number.isInteger(score) && Number.isInteger(total) && total > 0 && score >= 0 && score <= total && score * 100 >= total * 80;
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const values = [...items]; let state = seed >>> 0;
  for (let i = values.length - 1; i > 0; i--) { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; const j = state % (i + 1); [values[i], values[j]] = [values[j]!, values[i]!]; }
  return values;
}
export function examTasks(exam: ModuleExam, seed: number): Task[] {
  const lessons = [...new Set(exam.bank.map(task => task.lessonId))];
  return shuffled(lessons.flatMap((lesson, i) => shuffled(exam.bank.filter(task => task.lessonId === lesson), seed + i * 997).slice(0, exam.perLesson)), seed ^ 0x12345);
}
export const taskInstructions = {
  gap: text('Заполните пропуск.', 'Ergänze die Lücke.', 'Fill in the gap.'),
  correction: text('Исправьте предложение. Напишите его целиком.', 'Korrigiere den Satz. Schreibe ihn vollständig.', 'Correct the sentence. Write the whole sentence.'),
  order: text('Составьте предложение из всех частей.', 'Ordne alle Teile zu einem Satz.', 'Use all the parts to build a sentence.'),
  match: text('Сопоставьте слова с переводами.', 'Ordne die Wörter den Übersetzungen zu.', 'Match the words to their translations.'),
  dialogue: text('Дополните ответ в диалоге.', 'Ergänze die Antwort im Dialog.', 'Complete the reply in the dialogue.'),
};
