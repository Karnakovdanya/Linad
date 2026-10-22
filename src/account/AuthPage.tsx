import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { accountCopy, accountError } from './copy';
import { useAccount } from './auth-context';
import { authRedirect, supabase } from './client';
import { authReturn, clearAuthReturn, expectTrialAccount } from './trial';

export function AuthPage() {
  const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const { user, ready, refreshAuth } = useAccount(); const location = useLocation(); const navigate = useNavigate();
  const register = location.pathname.endsWith('/register'); const forgot = location.pathname.endsWith('/forgot-password'); const update = location.pathname.endsWith('/update-password');
  const [busy, setBusy] = useState(false); const [notice, setNotice] = useState<'confirmEmail' | 'resetSent' | 'saved' | ''>(''); const [error, setError] = useState<unknown>(null);
  const [destination] = useState(authReturn);
  useEffect(() => { if (user && !update && !forgot) clearAuthReturn(); }, [user, update, forgot]);
  if (!ready) return <p className="container" role="status">{c.loading}</p>;
  if (user && !update && !forgot) return <Navigate to={destination} replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const data = new FormData(event.currentTarget); const email = String(data.get('email') ?? '').trim(); const password = String(data.get('password') ?? ''); const firstName = String(data.get('first_name') ?? '').trim(); const lastName = String(data.get('last_name') ?? '').trim();
    setError(null); setNotice('');
    if (!supabase) { setError('configError'); return; }
    if ((register || update) && password !== data.get('confirm')) { setError('mismatch'); return; }
    if (register && (!firstName || !lastName)) { setError('required'); return; }
    setBusy(true);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authRedirect('recovery') });
        if (error) throw error; setNotice('resetSent');
      } else if (update) {
        if (!user) { setError('sessionMissing'); return; }
        const { error } = await supabase.auth.updateUser({ password }); if (error) throw error;
        setNotice('saved');
      } else if (register) {
        try { expectTrialAccount(email); } catch { setError('localError'); return; }
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}` }, emailRedirectTo: authRedirect() } });
        if (error) throw error;
        if (data.session) { await refreshAuth(); navigate(destination, { replace: true }); }
        else setNotice('confirmEmail');
      } else {
        try { expectTrialAccount(email); } catch { setError('localError'); return; }
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
        await refreshAuth(); navigate(destination, { replace: true });
      }
    } catch (issue) { setError(issue); }
    finally { setBusy(false); }
  }
  const title = update ? c.changePassword : forgot ? c.reset : register ? c.create : c.login;
  const [titleBeforeBrand, titleAfterBrand] = c.authTitle.split('LINAD');
  return <section className="container account-auth">
    <div className="account-auth-photo" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/account/auth-lake-landscape.png`} alt="" /></div>
    <div className="account-auth-copy"><h1 id="page-heading" tabIndex={-1}>{titleBeforeBrand}<span>LINAD</span>{titleAfterBrand}</h1><p>{c.authIntro}</p></div>
    <div className="account-auth-form account-panel">
      {!forgot && !update && <nav className="account-tabs" aria-label={c.profile}><Link className={!register ? 'selected' : ''} to="/auth/login">{c.login}</Link><Link className={register ? 'selected' : ''} to="/auth/register">{c.register}</Link></nav>}
      <h2>{title}</h2>
      <form onSubmit={submit} aria-busy={busy}>
        {register && <div className="account-name-fields"><label>{c.firstName}<input name="first_name" autoComplete="given-name" required maxLength={100} /></label><label>{c.lastName}<input name="last_name" autoComplete="family-name" required maxLength={100} /></label></div>}
        {!update && <label>{c.email}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
        {!forgot && <label>{update ? c.newPassword : c.password}<input name="password" type="password" autoComplete={register || update ? 'new-password' : 'current-password'} required minLength={register || update ? 8 : 1} maxLength={128} aria-describedby={register || update ? 'password-hint' : undefined} />{(register || update) && <small id="password-hint">{c.passwordHint}</small>}</label>}
        {(register || update) && <label>{c.confirmPassword}<input name="confirm" type="password" autoComplete="new-password" required minLength={8} maxLength={128} /></label>}
        {(Boolean(error) || location.search.includes('callback=error')) && <p role="alert" className="account-error">{error ? typeof error === 'string' && error in c ? c[error as keyof typeof c] : accountError(error, c) : c.callbackError}</p>}
        {notice && <p role="status" className="account-notice">{c[notice]}</p>}
        {!supabase && <p role="alert">{c.configError}</p>}
        <button type="submit" className="button button-primary" disabled={busy || !supabase || (update && !user)}>{busy ? c.loading : forgot ? c.resetSend : title}</button>
      </form>
      {!register && !forgot && !update && <Link className="text-link" to="/auth/forgot-password">{c.forgot}</Link>}
      {(forgot || update) && <Link className="text-link" to={user ? '/profile/settings' : '/auth/login'}>{c.back}</Link>}
      <Link className="text-link" to="/learn">{c.guest}</Link>
      <small>{c.security}</small>
    </div>
  </section>;
}
