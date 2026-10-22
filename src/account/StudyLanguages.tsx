import { useState } from 'react';
import { usePreferences } from '../app/preferences-context';
import { cefrLevels } from '../pages/learning/levels/model';
import type { CefrLevel } from '../pages/learning/levels/model';
import { accountCopy, accountError } from './copy';
import { useAccount } from './auth-context';
import type { StudyLanguage } from './profile';

export function StudyLanguages({ onSaved }: { onSaved?: () => void }) {
  const { profile, updateProfile } = useAccount(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const [draft, setSelected] = useState<StudyLanguage[] | null>(null);
  const selected = draft ?? profile?.study_languages ?? [];
  const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>(null); const [saved, setSaved] = useState(false);
  return <form className="account-panel account-study-editor" onSubmit={async event => {
    event.preventDefault(); if (busy) return; setBusy(true); setError(null); setSaved(false);
    try { await updateProfile({ study_languages: selected }); setSelected(null); setSaved(true); onSaved?.(); }
    catch (issue) { setError(issue); } finally { setBusy(false); }
  }}><h2>{c.languagePreferences}</h2><p className="account-muted">{c.personalHint}</p>
    <fieldset disabled={busy}><legend className="sr-only">{c.studyLanguages}</legend>{(['de', 'en'] as const).map(language => {
      const item = selected.find(item => item.language === language); const name = language === 'de' ? c.german : c.english;
      return <div className="account-study-choice" key={language}><label><input type="checkbox" checked={Boolean(item)} onChange={() => { setSaved(false); setSelected(item ? selected.filter(item => item.language !== language) : [...selected, { language, level: null }]); }} />{name}</label>
        {item && <label>{c.personalLevel}<select required aria-label={`${c.personalLevel} · ${name}`} value={item.level ?? ''} onChange={event => { setSaved(false); setSelected(selected.map(item => item.language === language ? { ...item, level: (event.target.value || null) as CefrLevel | null } : item)); }}><option value="">{c.chooseLevel}</option>{cefrLevels.map(level => <option key={level}>{level}</option>)}</select></label>}</div>;
    })}</fieldset><button className="button button-primary" type="submit" disabled={busy}>{busy ? c.saving : c.save}</button>{saved && <p role="status">{c.saved}</p>}{Boolean(error) && <p role="alert">{accountError(error, c)}</p>}
  </form>;
}
