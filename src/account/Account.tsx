import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import type { LearningLanguage } from '../domain/types';
import { Icon } from '../components/Icon';
import { cefrLevels } from '../pages/learning/levels/model';
import { curricula } from '../pages/learning/levels/data/curriculum';
import { lessonCatalog, lessonKey } from '../pages/learning/levels/data/lessons';
import { lessonStatus, levelStatus, moduleStatus } from '../pages/learning/levels/progress';
import { languagePair, localLevelsStorage } from '../pages/learning/levels/storage';
import { lessonPath, modulesPath, resumePath } from '../pages/learning/levels/navigation';
import { tutors, tutorImage } from '../pages/tutors/data';
import { usePracticeSpeech } from '../pages/learning/practice/usePracticeSpeech';
import { usePracticeStorage } from '../pages/learning/practice/usePracticeStorage';
import { LanguageVisibility } from '../pages/learning/practice/LanguageVisibility';
import { localPracticeStorage } from '../storage/practice';
import { accountCopy } from './copy';
import { useAccount } from './auth-context';
import { useAccountData } from './useAccountData';
import { installDocument, hasGuestData, mergeDocuments, readDocument } from './document';
import type { AccountDocument } from './document';
import { readCollection, saveCollection } from './collection';
import { TutorFavoriteButton } from './actions';
import { AuthPage } from './AuthPage';
import { ProfileOverview } from './ProfileOverview';
import { ProfileSettings } from './ProfileSettings';
import { AdminLink } from '../admin/AdminLink';
import '../styles/practice.css';
import '../styles/account.css';

function Progress({ value, label }: { value: number; label: string }) { return <div className="account-progress"><progress value={value} max={100} aria-label={label} /><span>{value}%</span></div>; }
function selectStudy(document: AccountDocument, language: LearningLanguage) { localLevelsStorage.write(languagePair(document.levels, language)); }
function ImportProgress({ always = false }: { always?: boolean }) {
  const { user } = useAccount(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const [hidden, setHidden] = useState(() => { try { return sessionStorage.getItem(`linad.import.dismissed.${user?.id}`) === 'yes'; } catch { return false; } });
  const [message, setMessage] = useState(false); const [error, setError] = useState(false);
  let available = false; try { available = hasGuestData(readDocument(null)); } catch { /* Storage error is reported on import. */ }
  if (!available || (hidden && !always)) return null;
  return <section className="account-import account-panel"><h2>{c.importTitle}</h2><p>{c.importBody}</p><div className="account-actions"><button type="button" className="button button-primary" onClick={() => {
    try {
      const current = readDocument(); const merged = mergeDocuments(current, readDocument(null));
      // Keep genuine account choices; an empty account can inherit the guest's setup.
      const hasChoice = (language: LearningLanguage) => Boolean(current.levels.setupComplete[language] || current.levels.placementChoice[language] || current.levels.runs[language] || Object.keys(current.levels.lessons).some(key => key.startsWith(language + ':')));
      merged.levels.selectedLevels = { de: hasChoice('de') ? current.levels.selectedLevels.de : merged.levels.selectedLevels.de, en: hasChoice('en') ? current.levels.selectedLevels.en : merged.levels.selectedLevels.en };
      if (hasChoice('de') || hasChoice('en')) merged.levels = { ...merged.levels, targetLanguage: current.levels.targetLanguage, supportLanguage: current.levels.supportLanguage };
      merged.updatedAt = new Date().toISOString(); installDocument(merged);
      // The explicit local write schedules a cloud commit; installation alone is silent.
      localLevelsStorage.write(merged.levels); setMessage(true); setError(false); setHidden(true);
    } catch { setError(true); }
  }}>{c.importAction}</button><button type="button" className="button button-secondary" onClick={() => { setHidden(true); try { sessionStorage.setItem(`linad.import.dismissed.${user?.id}`, 'yes'); } catch { /* Optional dismissal. */ } }}>{c.later}</button></div>{message && <p role="status">{c.imported}</p>}{error && <p role="alert">{c.localError}</p>}</section>;
}
function ResumeCard({ language, document }: { language: LearningLanguage; document: AccountDocument }) {
  const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const level = document.levels.selectedLevels[language]; const percent = levelStatus(document.levels, language, level).percent;
  const state = languagePair(document.levels, language);
  return <article className="account-resume account-panel"><div className="account-language-flag" aria-hidden="true">{language === 'de' ? '🇩🇪' : '🇬🇧'}</div><div><h2>{language === 'de' ? c.german : c.english}</h2><p>{c.level} {level}</p><Progress value={percent} label={`${language} ${level}`} /></div><Link className="button button-primary" to={document.levels.setupComplete[language] ? resumePath(state) : '/learn/levels/languages'} onClick={() => selectStudy(document, language)}>{c.continue}</Link></article>;
}
function Overview() { return <ProfileOverview><ImportProgress /></ProfileOverview>; }
function MyLearning() {
  const doc = useAccountData(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const [language, setLanguage] = useState<LearningLanguage>(doc.levels.targetLanguage); const [level, setLevel] = useState(doc.levels.selectedLevels[language]);
  const result = doc.levels.results[language];
  const attempts = [...Object.entries(doc.levels.moduleAttempts).filter(([key]) => key.startsWith(language + ':')).flatMap(([key, entries]) => entries.map(entry => ({ title: `${c.moduleTest} · ${key.split(':').slice(1).join(' · ')}`, ...entry }))), ...Object.entries(doc.levels.lessons).filter(([key]) => key.startsWith(language + ':')).flatMap(([key, progress]) => progress.attempts.map((entry, index) => ({ id: `${key}:${index}`, title: `${c.miniTest} · ${lessonCatalog[language][key.slice(3)]?.title[preferences.uiLanguage] ?? key.slice(3)}`, ...entry })))].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  return <><h1 id="page-heading" tabIndex={-1}>{c.learning}</h1><div className="account-tabs" role="group" aria-label={c.learning}>{(['de', 'en'] as const).map(lang => <button key={lang} type="button" aria-pressed={lang === language} onClick={() => { setLanguage(lang); setLevel(doc.levels.selectedLevels[lang]); }}>{lang === 'de' ? c.german : c.english}</button>)}</div>
    <ResumeCard language={language} document={doc} />
    <div className="account-levels" role="group" aria-label={c.level}>{cefrLevels.map(value => <button key={value} type="button" aria-pressed={value === level} onClick={() => setLevel(value)}><strong>{value}</strong><small>{levelStatus(doc.levels, language, value).percent}%</small></button>)}</div>
    <h2>{c.modules} · {level}</h2><p className="account-muted">{c.readyOnly}</p>
    <div className="account-modules">{curricula[language].filter(module => module.level === level).map((module, index) => {
      const status = moduleStatus(doc.levels, language, level, module.id); const lessons = module.lessonIds.flatMap(id => lessonCatalog[language][id] ? [lessonCatalog[language][id]!] : []);
      return <section className="account-panel" key={module.id}><div className="account-module-row"><span className="account-number">{index + 1}</span><div><h2>{module.title[preferences.uiLanguage]}</h2><Progress value={status.percent} label={module.title[preferences.uiLanguage]} /></div><Link className="button button-secondary" to={`${modulesPath(level)}/${module.id}`} onClick={() => { localLevelsStorage.write({ ...languagePair(doc.levels, language), selectedLevels: { ...doc.levels.selectedLevels, [language]: level } }); }}>{c.open}</Link></div>{lessons.length > 0 && <ul className="account-list">{lessons.map(lesson => <li key={lesson.id}><Link className="text-link" to={lessonPath(level, module.id, lesson.id)} onClick={() => selectStudy(doc, language)}>{lesson.title[preferences.uiLanguage]}</Link><span>{lessonStatus(lesson, doc.levels.lessons[lessonKey(language, lesson.id)]).percent}%</span></li>)}</ul>}</section>;
    })}</div>
    <section className="account-panel"><h2>{c.results}</h2>{result && <p>{c.placement}: {result.level} · {result.correct}/{result.total} {c.score}</p>}{attempts.length ? <ul className="account-list">{attempts.slice(0, 20).map(attempt => <li key={attempt.id}><span>{attempt.title}<small>{new Date(attempt.completedAt).toLocaleString(preferences.uiLanguage)}</small></span><strong>{attempt.score}/{attempt.total} · {Math.round(attempt.score / attempt.total * 100)}%</strong></li>)}</ul> : !result && <p>{c.noResults}</p>}</section>
  </>;
}
function MyWords() {
  const doc = useAccountData(); const { preferences, t } = usePreferences(); const c = accountCopy(preferences.uiLanguage); const [query, setQuery] = useState(''); const [error, setError] = useState(false); const [pointerFocus, setPointerFocus] = useState(false);
  const storage = usePracticeStorage(t);
  const speech = usePracticeSpeech(t, 'account-words', preferences.uiLanguage);
  const all = Object.values(doc.collection.words).filter(word => !word.deletedAt);
  const words = all.filter(word => [...Object.values(word.text), ...Object.values(word.example ?? {})].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  return <><h1 id="page-heading" tabIndex={-1}>{c.words}</h1><div className="account-stats">{[['all', c.all], ['de', c.german], ['en', c.english]].map(([lang, label]) => <div className="account-panel" key={lang}><strong>{all.filter(word => lang === 'all' || word.languages.includes(lang as LearningLanguage)).length}</strong><span>{label}</span></div>)}</div>
    <div className="account-word-filters"><label><span className="sr-only">{c.search}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={c.search} maxLength={200} data-pointer-focus={pointerFocus || undefined} onPointerDown={() => setPointerFocus(true)} onKeyDown={() => setPointerFocus(false)} onBlur={() => setPointerFocus(false)} /></label><LanguageVisibility t={t} visible={storage.preferences.visibleLanguages} onToggle={language => { storage.toggleLanguage(language); speech.stop(); }} hintId="account-language-hint" /><p id="account-language-hint" className="account-muted">{t.practiceLanguageHint}</p></div>
    {error && <p role="alert">{c.localError}</p>}{storage.notice && <p role="status">{storage.notice}</p>}{storage.warning && <p role="alert">{t.practiceStorageUnavailable}</p>}{speech.notice && <p role="status">{speech.notice}</p>}
    {words.length ? <div className="account-word-list">{words.map(word => <article className="account-panel account-word" key={word.id}><div>{(['ru', 'de', 'en'] as const).filter(lang => word.text[lang] && storage.preferences.visibleLanguages.includes(lang)).map(lang => <div key={lang} className="account-word-language"><span lang={lang}><strong>{word.text[lang]}</strong>{word.example?.[lang] && <small>{word.example[lang]}</small>}</span><button type="button" className="icon-button" aria-label={`${speech.activeId === word.id + lang ? c.stop : c.listen} · ${lang}`} onClick={() => speech.speak([{ text: word.text[lang], language: lang }], word.id + lang)}>{speech.activeId === word.id + lang ? '■' : '▷'}</button></div>)}</div><button type="button" className="button button-secondary" onClick={() => {
      try {
        const collection = readCollection(); const now = new Date().toISOString(); collection.words[word.id] = { ...word, deletedAt: now, updatedAt: now }; saveCollection(collection);
        if (word.practiceItem) { const practice = localPracticeStorage.read().preferences; localPracticeStorage.write({ ...practice, savedItems: practice.savedItems.filter(item => item.id !== word.practiceItem!.id) }); }
        setError(false);
      } catch { setError(true); }
    }}>{c.remove}</button></article>)}</div> : <div className="account-panel"><p>{all.length ? c.noMatches : c.noWords}</p><Link className="text-link" to="/learn">{c.continue} →</Link></div>}
  </>;
}
function Favorites() {
  const doc = useAccountData(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const favorites = tutors.filter(tutor => !tutor.demo && doc.collection.favorites[tutor.id] && !doc.collection.favorites[tutor.id]!.deletedAt);
  return <><h1 id="page-heading" tabIndex={-1}>{c.favorites}</h1>{favorites.length ? <div className="account-favorites">{favorites.map(tutor => <article className="account-panel" key={tutor.id}><div className="account-favorite-photo"><img src={tutorImage(tutor)} alt={tutor.name} /><TutorFavoriteButton tutorId={tutor.id} /></div><h2>{tutor.name}</h2><p>{tutor.languages.map(lang => lang === 'de' ? c.german : c.english).join(' · ')}</p><p>{tutor.price} € / {c.perHour}</p><Link className="button button-primary" to={`/tutors/${tutor.id}`}>{c.details}</Link></article>)}</div> : <div className="account-panel"><p>{c.noFavorites}</p></div>}<Link className="button button-secondary" to="/tutors">{c.tutors} →</Link></>;
}
function Settings() { return <ProfileSettings><ImportProgress always /></ProfileSettings>; }
function ProfileShell() {
  const { user, ready, syncStatus, syncError, retrySync } = useAccount(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  if (!ready) return <p className="container" role="status">{c.loading}</p>;
  if (!user) return <Navigate to="/auth/login" replace />;
  const links = [['/profile', c.overview, 'chart'], ['/profile/learning', c.learning, 'book'], ['/profile/words', c.words, 'cards'], ['/profile/tutors', c.favorites, 'people'], ['/profile/settings', c.settings, 'user']] as const;
  return <div className="container account-layout"><aside className="account-sidebar"><nav aria-label={c.profile}>{links.map(([to, title, icon]) => <NavLink key={to} to={to} end={to === '/profile'}><Icon name={icon} /><span>{title}</span></NavLink>)}<AdminLink /></nav></aside><div className="account-content">{syncStatus === 'error' && <div className="account-sync-notice" role="status"><span>{syncError === 'schema' ? c.studySyncSchema : syncError === 'permission' ? c.syncPermission : syncError === 'session' ? c.syncSession : c.syncShort}</span><button type="button" className="text-link" onClick={retrySync}>{c.retry}</button></div>}<Routes><Route index element={<Overview />} /><Route path="learning" element={<MyLearning />} /><Route path="words" element={<MyWords />} /><Route path="tutors" element={<Favorites />} /><Route path="settings" element={<Settings />} /><Route path="*" element={<Navigate to="/profile" replace />} /></Routes></div></div>;
}
export default function Account() {
  const { pathname } = useLocation(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  useEffect(() => { document.title = `${pathname.startsWith('/auth') ? c.login : c.profile} | LINAD`; }, [pathname, c.login, c.profile]);
  return pathname.startsWith('/auth') ? <AuthPage key={pathname} /> : <ProfileShell />;
}
