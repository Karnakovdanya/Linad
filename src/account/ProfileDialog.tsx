import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { usePreferences } from '../app/preferences-context';
import { accountCopy } from './copy';

export function ProfileDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  useEffect(() => { const element = dialog.current!; element.showModal(); return () => element.close(); }, []);
  return <dialog ref={dialog} className="account-profile-dialog" aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header><h2>{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label={c.close}>×</button></header>{children}
  </dialog>;
}
