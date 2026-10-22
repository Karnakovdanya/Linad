import { usePreferences } from '../app/preferences-context';
import { getContactHref } from '../config/contact-links';
import type { ContactId } from '../config/contacts';
import type { EmailDraft } from '../config/contact-links';
import { ContactIcon } from './ContactIcon';

interface ContactLinkProps {
  contact: ContactId;
  className?: string;
  unavailable?: 'disabled' | 'hidden';
  describedBy?: string;
  label?: string;
  iconOnly?: boolean;
  showIcon?: boolean;
  emailDraft?: EmailDraft;
}

/** Shared by all contact buttons. Addresses are always read from contacts.ts. */
export function ContactLink({ contact, className, unavailable = 'disabled', describedBy, label, iconOnly = false, showIcon = true, emailDraft }: ContactLinkProps) {
  const { t } = usePreferences();
  const href = getContactHref(contact, undefined, emailDraft);
  const text = label ?? t[contact];
  const content = <>{showIcon && <ContactIcon contact={contact} />}<span className={iconOnly ? 'sr-only' : undefined}>{text}</span></>;
  if (!href) {
    if (unavailable === 'hidden') return null;
    return <button className={className ?? 'button button-secondary'} type="button" disabled title={t.notConfigured} aria-describedby={describedBy} data-contact={contact}>{content}</button>;
  }
  return <a className={className ?? 'button button-primary'} href={href} target={contact === 'email' ? undefined : '_blank'} rel={contact === 'email' ? undefined : 'noopener noreferrer'} title={iconOnly ? text : undefined} data-contact={contact}>{content}</a>;
}
