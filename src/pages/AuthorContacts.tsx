import { useEffect, useState } from 'react';
import { usePreferences } from '../app/preferences-context';
import { ContactLink } from '../components/ContactLink';
import { ContactIcon } from '../components/ContactIcon';
import { authorContactEmail } from '../config/contacts';

export function AuthorContacts() {
  const { t } = usePreferences();
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  useEffect(() => {
    if (copyState !== 'copied' && copyState !== 'error') return;
    const timer = window.setTimeout(() => setCopyState('idle'), 3000);
    return () => window.clearTimeout(timer);
  }, [copyState]);
  const contacts = [
    { id: 'authorTelegram', brand: t.telegram, action: t.authorContactTelegram },
    { id: 'github', brand: t.github, action: t.authorContactGithub },
    { id: 'linkedin', brand: t.linkedin, action: t.authorContactLinkedin },
    { id: 'whatsapp', brand: t.whatsapp, action: t.authorContactWhatsapp },
    { id: 'behance', brand: t.behance, action: t.authorContactBehance },
  ] as const;
  async function copyEmail() {
    if (copyState === 'copying') return;
    setCopyState('copying');
    try { await navigator.clipboard.writeText(authorContactEmail); setCopyState('copied'); }
    catch { setCopyState('error'); }
  }
  return <div className="author-contact-actions">
    <div className="author-contact-grid">{contacts.map(contact => <ContactLink key={contact.id} contact={contact.id}
      label={`${contact.brand}\n${contact.action}`} className={`button author-contact-link ${contact.id === 'authorTelegram' ? 'button-primary' : 'button-secondary'}`} />)}</div>
    <div className="author-contact-email">
      <span className="author-email-icon"><ContactIcon contact="email" /></span>
      <div className="author-email-details">
        <span className="author-email-label">{t.authorEmailLabel}</span>
        <a href={`mailto:${authorContactEmail}`} data-contact="email">{authorContactEmail}</a>
      </div>
      <button type="button" className="author-email-copy" data-copied={copyState === 'copied' || undefined} onClick={() => void copyEmail()} disabled={copyState === 'copying'} aria-label={t.authorCopyEmail} title={t.authorCopyEmail}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" /></svg>
        <span>{copyState === 'copied' ? t.authorEmailCopied : t.authorEmailCopyAction}</span>
        <svg className="author-email-confirmation" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m3 8 3 3 7-7" /></svg>
      </button>
    </div>
    <p className={copyState === 'error' ? 'author-email-status' : 'sr-only'} role="status" aria-live="polite" aria-atomic="true">{copyState === 'copied' ? t.authorEmailCopied : copyState === 'error' ? t.authorEmailCopyError : ''}</p>
  </div>;
}
