import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { useAccount } from './auth-context';
import { firstModule, pendingTrial, rememberAuthReturn, rememberTrial } from './trial';
import { trialCopy } from './trial-copy';
import { moduleStatus } from '../pages/learning/levels/progress';
import { curricula } from '../pages/learning/levels/data/curriculum';
import { modulesPath } from '../pages/learning/levels/navigation';
import type { LevelsStore } from '../pages/learning/levels/useLevelsStore';
import '../styles/course-trial.css';

export function CourseTrial({ store, children }: { store: LevelsStore; children: ReactNode }) {
  const { user, syncStatus, retrySync } = useAccount(); const { preferences } = usePreferences(); const c = trialCopy(preferences.uiLanguage);
  const { pathname } = useLocation(); const navigate = useNavigate(); const [error, setError] = useState(false); const [dismissed, setDismissed] = useState('');
  const match = pathname.match(/^\/learn\/levels\/(?:modules|lessons)\/([^/]+)\/([^/]+)/);
  const language = store.state.targetLanguage;
  const module = match && curricula[language].find(item => item.level === match[1] && item.id === match[2]);
  const first = module && firstModule(language, module.level)?.id === module.id;
  const scope = module ? `${language}:${module.level}:${module.id}` : '';
  const completed = module && first && moduleStatus(store.state, language, module.level, module.id).completed;
  const locked = !user && module && !first;
  const dialog = useRef<HTMLDialogElement>(null);
  const show = !user && completed && dismissed !== scope;
  useEffect(() => {
    if (!user && module && first) {
      try { rememberTrial({ language, level: module.level, moduleId: module.id }); } catch { /* Report on the account action; keep lessons usable. */ }
    }
  }, [user, language, module, first]);
  useEffect(() => { if (show) {
    const element = dialog.current!; const previous = document.activeElement;
    element.showModal(); element.querySelector<HTMLButtonElement>('.button-primary')?.focus();
    return () => { element.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
  } }, [show]);
  function authenticate(register: boolean) {
    try {
      const trialModule = module && firstModule(language, module.level);
      if (trialModule) rememberTrial({ language, level: trialModule.level, moduleId: trialModule.id });
      rememberAuthReturn(pathname); setError(false); navigate(register ? '/auth/register' : '/auth/login');
    } catch { setError(true); }
  }
  const actions = <div className="trial-actions"><button type="button" className="button button-primary" autoFocus={Boolean(show)} onClick={() => authenticate(true)}>{c.register}</button><button type="button" className="text-link" onClick={() => authenticate(false)}>{c.login}</button>{error && <p role="alert">{c.storage}</p>}</div>;
  let pending = false; try { pending = Boolean(user && pendingTrial(user.id).length); } catch { /* Existing cloud errors also remain visible. */ }
  return <>
    {locked ? <section className="level-card trial-gate"><h1 id="page-heading" tabIndex={-1}>{c.locked}</h1><p>{c.lockedBody}</p>{actions}<Link className="text-link" to={modulesPath(module.level)}>← {c.back}</Link></section> : children}
    {!user && !locked && <p className="level-local-note">{c.preview}</p>}
    {pending && syncStatus === 'error' && <p className="trial-pending" role="status">{c.pending} <button type="button" className="text-link" onClick={retrySync}>{c.retry}</button></p>}
    {show && <dialog ref={dialog} className="trial-dialog" aria-labelledby="trial-title" aria-describedby="trial-invite" onCancel={event => { event.preventDefault(); setDismissed(scope); }} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); const firstButton = buttons[0]; const lastButton = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === firstButton) { event.preventDefault(); lastButton?.focus(); }
      else if (!event.shiftKey && document.activeElement === lastButton) { event.preventDefault(); firstButton?.focus(); }
    }}><button className="icon-button trial-close" type="button" onClick={() => setDismissed(scope)} aria-label={c.close}>×</button><span className="trial-success" aria-hidden="true">✓</span><h2 id="trial-title">{c.done}</h2><p id="trial-invite">{c.invite}</p>{actions}</dialog>}
  </>;
}
