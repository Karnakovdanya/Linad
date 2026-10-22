import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import type { Theme, UiLanguage } from '../domain/types';
import { useAccount } from './auth-context';
import { accountCopy, accountError } from './copy';
import { Avatar } from './Avatar';

export function ProfileSettings({ children }: { children: ReactNode }) {
  const { user, profile, updateProfile, signOut } = useAccount(); const { preferences, setAppearance } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const [draft, setDraft] = useState<{ first_name: string; last_name: string; ui: UiLanguage; theme: Theme } | null>(null);
  const fields = draft ?? { first_name: profile?.first_name || user?.user_metadata.first_name || user?.user_metadata.full_name || '', last_name: profile?.last_name || '', ui: preferences.uiLanguage, theme: preferences.theme };
  const [busy, setBusy] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState<unknown>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const first_name = fields.first_name.trim(); const last_name = fields.last_name.trim();
    if (!first_name) { setError('required'); return; }
    setBusy(true); setSaved(false); setError(null);
    // Appearance takes effect on Save even if the network is temporarily unavailable.
    setAppearance({ uiLanguage: fields.ui, theme: fields.theme });
    try { await updateProfile({ first_name, last_name, ui_language: fields.ui, theme: fields.theme }); setDraft(null); setSaved(true); }
    catch (issue) { setError(issue); } finally { setBusy(false); }
  }
  return <><h1 id="page-heading" tabIndex={-1}>{c.settings}</h1><section className="account-panel"><h2>{c.photo}</h2><Avatar editable /></section>
    <form className="account-panel account-settings" onSubmit={submit} aria-busy={busy}><fieldset className="account-settings-fields" disabled={busy}>
      <legend className="sr-only">{c.settings}</legend><div className="account-name-fields"><label>{c.firstName}<input name="first_name" autoComplete="given-name" required maxLength={100} value={fields.first_name} onChange={event => { setSaved(false); setDraft({ ...fields, first_name: event.target.value }); }} /></label>
        <label>{c.lastName}<input name="last_name" autoComplete="family-name" maxLength={100} value={fields.last_name} onChange={event => { setSaved(false); setDraft({ ...fields, last_name: event.target.value }); }} /></label></div>
      <label>{c.email}<input type="email" value={user?.email ?? ''} readOnly /></label><p className="account-muted">{c.emailManaged}</p>
      <label>{c.uiLanguage}<select name="ui" value={fields.ui} onChange={event => { setSaved(false); setDraft({ ...fields, ui: event.target.value as UiLanguage }); }}><option value="ru">Русский</option><option value="de">Deutsch</option><option value="en">English</option></select></label>
      <label>{c.theme}<select name="theme" value={fields.theme} onChange={event => { setSaved(false); setDraft({ ...fields, theme: event.target.value as Theme }); }}><option value="light">{c.light}</option><option value="dark">{c.dark}</option></select></label>
      <div className="account-actions"><button type="submit" className="button button-primary">{busy ? c.saving : c.save}</button><Link className="button button-secondary" to="/auth/update-password">{c.changePassword}</Link></div>
    </fieldset>{saved && <p role="status">{c.saved}</p>}{Boolean(error) && <p role="alert">{error === 'required' ? c.required : `${c.settingsSaveError} ${accountError(error, c)}`}</p>}</form>
    {children}<button type="button" className="button button-secondary" disabled={busy} onClick={async () => { setBusy(true); setError(null); try { await signOut(); } catch (issue) { setError(issue); } finally { setBusy(false); } }}>{c.logout}</button>
  </>;
}
