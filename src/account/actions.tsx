import { useState } from 'react';
import type { Lesson } from '../pages/learning/levels/model';
import { usePreferences } from '../app/preferences-context';
import { readCollection, saveCollection } from './collection';
import { accountCopy } from './copy';
import { useAccountData } from './useAccountData';
import { tutors } from '../pages/tutors/data';
import '../styles/account.css';

export function SaveWordButton({ lesson, entry }: { lesson: Lesson; entry: Lesson['vocabulary'][number] }) {
  const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage); const doc = useAccountData(); const [error, setError] = useState(false);
  const id = `lesson:${lesson.language}:${lesson.id}:${entry.word}`; const saved = doc.collection.words[id] && !doc.collection.words[id]!.deletedAt;
  function toggle() {
    try {
      const collection = readCollection(); const now = new Date().toISOString();
      collection.words[id] = { id, source: 'lesson', languages: [lesson.language], text: { ...entry.translation, [lesson.language]: entry.word }, example: entry.example ? { ...(entry.exampleTranslation ?? { ru: '', de: '', en: '' }), [lesson.language]: entry.example } : undefined, savedAt: collection.words[id]?.savedAt ?? now, updatedAt: now, deletedAt: saved ? now : null };
      saveCollection(collection); setError(false);
    } catch { setError(true); }
  }
  return <><button type="button" className="text-link account-save-word" aria-pressed={Boolean(saved)} onClick={toggle}>{saved ? '✓ ' + c.wordSaved : '+ ' + c.saveWord}</button>{error && <span role="alert">{c.localError}</span>}</>;
}
export function TutorFavoriteButton({ tutorId }: { tutorId: string }) {
  const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage); const doc = useAccountData(); const [error, setError] = useState(false);
  if (!tutors.some(tutor => tutor.id === tutorId && !tutor.demo)) return null;
  const saved = doc.collection.favorites[tutorId] && !doc.collection.favorites[tutorId]!.deletedAt;
  return <><button type="button" className="account-favorite" title={saved ? c.removeFavorite : c.addFavorite} aria-label={saved ? c.removeFavorite : c.addFavorite} aria-pressed={Boolean(saved)} onClick={() => {
    try { const collection = readCollection(); const now = new Date().toISOString(); collection.favorites[tutorId] = { id: tutorId, updatedAt: now, deletedAt: saved ? now : null }; saveCollection(collection); setError(false); }
    catch { setError(true); }
  }}>{saved ? '♥' : '♡'}</button>{error && <span role="alert">{c.localError}</span>}</>;
}
