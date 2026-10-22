import { useState } from 'react';
import { usePreferences } from '../app/preferences-context';
import type { LearningLanguage } from '../domain/types';
import { cefrLevels } from '../pages/learning/levels/model';
import type { CefrLevel } from '../pages/learning/levels/model';
import { useAccount } from './auth-context';
import { accountCopy, accountError } from './copy';

export function ProfileGoal({ onSaved }: { onSaved: () => void }) {
  const { profile, updateProfile } = useAccount(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const [language, setLanguage] = useState<LearningLanguage | ''>(profile?.study_goal?.language ?? '');
  const [level, setLevel] = useState<CefrLevel | ''>(profile?.study_goal?.level ?? '');
  const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>(null);
  async function save(remove = false) {
    if (busy || (!remove && (!language || !level))) return; setBusy(true); setError(null);
    try { await updateProfile({ study_goal: remove ? null : { language: language as LearningLanguage, level: level as CefrLevel } }); onSaved(); }
    catch (issue) { setError(issue); } finally { setBusy(false); }
  }
  return <form className="account-goal-editor" onSubmit={event => { event.preventDefault(); void save(); }}><p className="account-muted">{c.goalHint}</p><fieldset disabled={busy}><legend className="sr-only">{c.goal}</legend>
    <label>{c.studyLanguage}<select required value={language} onChange={event => setLanguage(event.target.value as LearningLanguage)}><option value="">{c.chooseLanguage}</option><option value="de">{c.german}</option><option value="en">{c.english}</option></select></label>
    <label>{c.targetLevel}<select required value={level} onChange={event => setLevel(event.target.value as CefrLevel)}><option value="">{c.chooseLevel}</option>{cefrLevels.map(level => <option key={level}>{level}</option>)}</select></label>
  </fieldset><div className="account-actions"><button className="button button-primary" type="submit" disabled={busy}>{busy ? c.saving : c.save}</button>{profile?.study_goal && <button className="button button-secondary" type="button" disabled={busy} onClick={() => void save(true)}>{c.removeGoal}</button>}</div>{Boolean(error) && <p role="alert">{accountError(error, c)}</p>}</form>;
}
