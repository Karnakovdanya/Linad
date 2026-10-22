import type { ContactId } from '../config/contacts';

// Local Bootstrap Icons 1.13.1, MIT. See public/assets/contact-icons/LICENSE.txt.
const names: Record<ContactId, string> = {
  projectTelegram: 'telegram', authorTelegram: 'telegram',
  github: 'github', behance: 'behance', linkedin: 'linkedin',
  email: 'envelope', instagram: 'instagram', whatsapp: 'whatsapp',
};

export function ContactIcon({ contact }: { contact: ContactId }) {
  const base = import.meta.env?.BASE_URL ?? './';
  const source = `url("${base}assets/contact-icons/${names[contact]}.svg")`;
  return <span className="contact-icon" style={{ maskImage: source, WebkitMaskImage: source }} aria-hidden="true" />;
}
