import { useId } from 'react';
import { ContactLink } from './ContactLink';
import type { ContactId } from '../config/contacts';
import type { EmailDraft } from '../config/contact-links';

interface ContactSectionProps {
  title: string;
  description: string;
  items: readonly ContactId[];
  emailDraft?: EmailDraft;
}

export function ContactSection({ title, description, items, emailDraft }: ContactSectionProps) {
  const id = useId();
  return (
    <section className="surface contacts-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
      <div className="button-row">
        {items.map((contact) => <ContactLink key={contact} contact={contact} unavailable="hidden" emailDraft={emailDraft}
          className={`button ${contact === 'authorTelegram' ? 'button-primary' : 'button-secondary'}`} />)}
      </div>
    </section>
  );
}
