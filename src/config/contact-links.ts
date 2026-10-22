import { contacts } from './contacts';
import type { ContactId } from './contacts';

export interface EmailDraft {
  subject?: string;
  body?: string;
}

/** Resolve a configured contact into a usable link; absent/invalid values stay inactive. */
export function getContactHref(contact: ContactId, value = contacts[contact], draft?: EmailDraft): string | null {
  const address = value?.trim();
  if (!address) return null;

  if (contact === 'email') {
    if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(address)) return null;
    const recipient = `mailto:${encodeURIComponent(address).replace('%40', '@')}`;
    const fields: string[] = [];
    if (draft?.subject) fields.push(`subject=${encodeURIComponent(draft.subject)}`);
    if (draft?.body) fields.push(`body=${encodeURIComponent(draft.body.replace(/\r?\n/g, '\r\n'))}`);
    return fields.length ? `${recipient}?${fields.join('&')}` : recipient;
  }

  try {
    const url = new URL(address);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
