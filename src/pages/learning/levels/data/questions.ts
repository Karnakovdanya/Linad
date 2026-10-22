import type { CefrLevel, Question, Skill } from '../model';
import { text } from '../model';
import type { LearningLanguage } from '../../../../domain/types';
import { germanQuestionRows } from './questions-de';
import { englishQuestionRows } from './questions-en';

const instructions = {
  grammar: text('Выберите форму, которая подходит в пропуск.', 'Wähle die Form, die in die Lücke passt.', 'Choose the form that fits the gap.'),
  vocabulary: text('Выберите подходящее слово или выражение.', 'Wähle das passende Wort oder die passende Wendung.', 'Choose the appropriate word or expression.'),
  reading: text('Прочитайте текст и ответьте на вопрос.', 'Lies den Text und beantworte die Frage.', 'Read the text and answer the question.'),
  listening: text('Прослушайте запись и ответьте на вопрос.', 'Höre die Aufnahme und beantworte die Frage.', 'Listen to the recording and answer the question.'),
};
function parse(language: LearningLanguage, rows: Record<CefrLevel, string>): Question[] {
  return Object.entries(rows).flatMap(([level, source]) => source.trim().split('\n').map(line => {
    const [id = '', skill = '', topic = '', stem = '', choices = '', ru = '', de = '', en = '', passage] = line.split('|').map(value => value.trim());
    const options = choices.split('~');
    const titles = topic.split('~');
    if (options.length !== 4 || new Set(options).size !== 4 || titles.length !== 3 || ![id, skill, stem, ru, de, en].every(Boolean)) throw new Error(`Invalid placement item: ${language}/${id}`);
    return { id: `${language}-${level}-${id}`, language, level: level as CefrLevel, skill: skill as Skill,
      topic: text(titles[0]!, titles[1]!, titles[2]!), instruction: instructions[skill as Skill], stem, options,
      correct: options[0]!, explanation: text(ru, de, en), ...(passage ? { passage } : {}) };
  }));
}
export const questionBank = { de: parse('de', germanQuestionRows), en: parse('en', englishQuestionRows) };
export const allQuestions = [...questionBank.de, ...questionBank.en];
export const questionById = new Map(allQuestions.map(question => [question.id, question]));
