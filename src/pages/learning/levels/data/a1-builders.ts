import { text as t, type Question, type Text } from '../model';
import { taskInstructions, type Task } from '../tasks';

export const support = (ru: string, en: string): Text => t(ru, en, en); // German course support: RU or EN, never DE.
export function question(id: string, stem: string, options: string[], ru: string, en: string, reading = false): Question {
  return { id, language: 'de', level: 'A1', skill: reading ? 'reading' : 'grammar', topic: t('Знакомство', 'Sich vorstellen', 'Introductions'),
    instruction: t('Выберите правильный ответ.', 'Wähle die richtige Antwort.', 'Choose the correct answer.'), stem, options, correct: options[0]!, explanation: support(ru, en) };
}
export function input(lessonId: string, id: string, format: 'gap' | 'correction' | 'translation' | 'dialogue', stem: string, accepted: string[], ru: string, en: string, caseSensitive = false): Task {
  return { id, lessonId, kind: 'input', language: 'de', instruction: format === 'translation' ? support('Переведите на немецкий. Используйте слова урока.', 'Translate into German using the lesson vocabulary.') : taskInstructions[format], stem, format, accepted, caseSensitive, explanation: support(ru, en) };
}
export function order(lessonId: string, id: string, tokens: string[], acceptedOrders: number[][], ru: string, en: string): Task {
  return { id, lessonId, kind: 'order', language: 'de', instruction: taskInstructions.order, stem: '', tokens, acceptedOrders, explanation: support(ru, en) };
}
export function match(lessonId: string, id: string, pairs: [string, string, string][]): Task {
  return { id, lessonId, kind: 'match', language: 'de', instruction: taskInstructions.match, stem: '',
    pairs: pairs.map(([left, ru, en], i) => ({ id: `${id}-${i}`, left, right: support(ru, en) })),
    explanation: support('Сравните значение каждой пары. При ошибке исправьте сопоставление и проверьте снова.', 'Compare the meaning of each pair. If necessary, revise your matches and check again.') };
}
export const vocabulary = (word: string, ru: string, en: string, grammarRu: string, grammarEn: string, example: string, exampleRu: string, exampleEn: string) => ({ word, translation: support(ru, en), grammar: support(grammarRu, grammarEn), example, exampleTranslation: support(exampleRu, exampleEn) });
export const example = (sentence: string, ru: string, en: string) => ({ sentence, translation: support(ru, en) });
export const line = (speaker: string, sentence: string, ru: string, en: string) => ({ speaker: t(speaker, speaker, speaker), sentence, translation: support(ru, en) });
