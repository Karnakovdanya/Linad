import type { UiLanguage } from '../../domain/types';
import { getContactHref } from '../../config/contact-links';
import type { CatalogFilters, Tutor, TutorContact } from './model';
export const defaultFilters: CatalogFilters = { search: '', language: '', level: '', price: '', sort: '' };
export function filterTutors(tutors: Tutor[], filters: CatalogFilters, language: UiLanguage): Tutor[] {
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(language).trim();
  const search = normalize(filters.search);
  return tutors.filter(tutor => (!search || normalize(tutor.name).includes(search)) && (!filters.language || tutor.languages.some(value => value === filters.language)) &&
    (!filters.level || tutor.levels.some(value => value === filters.level)) && (!filters.price || (filters.price === 'low' ? tutor.price <= 25 : filters.price === 'middle' ? tutor.price > 25 && tutor.price <= 30 : tutor.price > 30)))
    .sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price || a.name.localeCompare(b.name, language);
      if (filters.sort === 'price-desc') return b.price - a.price || a.name.localeCompare(b.name, language);
      if (filters.sort === 'name-asc') return a.name.localeCompare(b.name, language);
      if (filters.sort === 'name-desc') return b.name.localeCompare(a.name, language);
      return 0;
    });
}
export function contactLinks(contact: TutorContact | undefined) {
  let telegram: string | null = null;
  const configured = getContactHref('authorTelegram', contact?.telegram ?? null);
  if (configured) { const url = new URL(configured); if (url.hostname === 't.me' && /^\/[a-z0-9_]{5,32}\/?$/i.test(url.pathname) && !url.search && !url.hash) telegram = url.href; }
  return { telegram, email: getContactHref('email', contact?.email ?? null) };
}
export const validEmail = (value: string) => Boolean(getContactHref('email', value.trim()));
export const timeOptions = ['morning', 'afternoon', 'evening', 'weekend', 'flexible'] as const;
