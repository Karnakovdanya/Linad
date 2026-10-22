/**
 * The only source of public contact addresses for the entire site.
 * Add confirmed HTTPS links only; for email, enter the bare email address.
 * null keeps a contact hidden or disabled. No accounts or sample addresses.
 */
export type ContactId = 'projectTelegram' | 'authorTelegram' | 'instagram' | 'github' | 'behance' | 'email' | 'linkedin' | 'whatsapp';

export const contacts: Record<ContactId, string | null> = {
  projectTelegram: 'https://t.me/lernendeutschzussamen',
  authorTelegram: 'https://t.me/linadkarnakov',
  instagram: null,
  github: 'https://github.com/Karnakovdanya?tab=repositories',
  behance: 'https://www.behance.net/danya_karnakov',
  linkedin: 'https://www.linkedin.com/in/daniil-khachko-50064a373/?isSelfProfile=true',
  email: 'karnakovdaniel@gmail.com',
  whatsapp: 'https://wa.me/41765389162',
};

// The separate email row on the author page; other contact destinations stay intact.
export const authorContactEmail = 'danikkarnakov@gmail.com';
