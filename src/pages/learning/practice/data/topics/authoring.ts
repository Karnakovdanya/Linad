import type { PracticeEntry, PracticeMaterial, Translation } from '../types';

export type ParticipantPair = readonly [Translation, Translation];
interface TopicDraft { phrases: string; replies: string; words: string; dialogues: string; participants: ParticipantPair }

function rows(source: string, expected: number, label: string): PracticeEntry[] {
  const entries = source.trim().split('\n').map(row => {
    const values = row.trim().split('|').map(value => value.trim());
    if (values.length !== 4 || values.some(value => !value)) throw new Error(`Incomplete ${label}: ${row}`);
    return { id: values[0]!, text: { ru: values[1]!, de: values[2]!, en: values[3]! } };
  });
  if (entries.length !== expected || new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error(`${label}: expected ${expected} unique entries`);
  return entries;
}

// Each dialogue reuses an authored pair from the first six phrases.
// Its partner replies and title are written separately for that situation.
export function topicDraft(draft: TopicDraft): PracticeMaterial {
  const phrases = rows(draft.phrases, 15, 'phrases');
  const replies = rows(draft.replies, 6, 'dialogue replies');
  const titles = rows(draft.dialogues, 3, 'dialogue titles');
  return { status: 'draft', phrases, words: rows(draft.words, 20, 'words'), dialogues: titles.map((title, index) => ({
    id: title.id, title: title.text, participants: { learner: draft.participants[0], partner: draft.participants[1] },
    lines: [
      { speaker: 'learner', text: phrases[index * 2]!.text }, { speaker: 'partner', text: replies[index * 2]!.text },
      { speaker: 'learner', text: phrases[index * 2 + 1]!.text }, { speaker: 'partner', text: replies[index * 2 + 1]!.text },
    ],
  })) };
}
