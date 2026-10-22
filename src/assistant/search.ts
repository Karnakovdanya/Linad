import { assistantCopy, topicIds } from './content';
import type { TopicId } from './content';
import type { UiLanguage } from '../domain/types';

export function normalizeQuestion(text: string) {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/ё/g, 'е').replace(/ß/g, 'ss').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
const stopWords = new Set('как что такое мне меня хочу где это для или чтобы почему зачем на по и в с а my me i a an the to how do does can is what where for or and please ich wie was ist die der das ein eine zu und mit auf im ich den dem du ru en de'.split(' '));
const generalContactWords = new Set(['contact', 'kontakt', 'связаться', 'контакт']);
const terms = (text: string) => normalizeQuestion(text).split(' ').filter(word => word.length >= 3 && !stopWords.has(word));

/** Deterministic local FAQ lookup. No generated answers, requests, or user-text storage. */
export function findTopic(query: string, language: UiLanguage): TopicId | null {
  const normalized = normalizeQuestion(query); if (!normalized || normalized.length > 240) return null;
  const copy = assistantCopy(language); const words = terms(query);
  const exact = topicIds.find(id => normalizeQuestion(copy.topics[id].question) === normalized); if (exact) return exact;
  const ranked = topicIds.map(id => {
    const topic = copy.topics[id]; let score = 0;
    for (const raw of topic.keywords) {
      const keyword = normalizeQuestion(raw);
      if (keyword.includes(' ')) { if (normalized.includes(keyword)) score += 5; }
      else if (normalized.split(' ').some(word => word === keyword || keyword.length >= 4 && word.startsWith(keyword))) score += generalContactWords.has(keyword) ? 2 : id === 'learn' ? 3 : 5;
    }
    if (score) {
      const title = terms(topic.question); const answer = terms(topic.answer.join(' '));
      score += Math.min(2, words.filter(word => title.includes(word)).length);
      score += Math.min(1, words.filter(word => word.length >= 4 && answer.includes(word)).length * .5);
    }
    return { id, score };
  }).sort((a, b) => b.score - a.score);
  const first = ranked[0]!, second = ranked[1]!;
  const minimum = words.length >= 3 ? 5 : words.length === 1 && generalContactWords.has(words[0]!) ? 2 : 3;
  return first.score >= minimum && first.score > second.score ? first.id : null;
}
