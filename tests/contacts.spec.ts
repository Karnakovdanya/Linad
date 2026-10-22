import { expect, test } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PreferencesProvider } from '../src/app/PreferencesProvider';
import { ContactLink } from '../src/components/ContactLink';
import { contacts } from '../src/config/contacts';
import type { ContactId } from '../src/config/contacts';
import { getContactHref } from '../src/config/contact-links';
import { confirmedContacts } from './confirmed-contacts';

test('confirmed contacts match the supplied addresses and Instagram stays inactive', () => {
  expect(Object.keys(contacts)).toEqual(expect.arrayContaining(['projectTelegram', 'authorTelegram', 'instagram', 'github', 'behance', 'email', 'linkedin']));
  for (const id of Object.keys(confirmedContacts) as (keyof typeof confirmedContacts)[]) {
    expect(getContactHref(id)).toBe(confirmedContacts[id]);
  }
  expect(contacts.instagram).toBeNull();
  expect(getContactHref('instagram')).toBeNull();
  for (const id of Object.keys(contacts) as ContactId[]) {
    expect(getContactHref(id, null)).toBeNull();
    expect(getContactHref(id, ' ')).toBeNull();
  }
});

test('configured HTTPS contacts and email resolve without guessing accounts', () => {
  for (const id of ['projectTelegram', 'authorTelegram', 'instagram', 'github', 'behance', 'linkedin'] as const) {
    expect(getContactHref(id, ' https://example.org/contact ')).toBe('https://example.org/contact');
  }
  expect(getContactHref('email', ' feedback@example.org ')).toBe('mailto:feedback@example.org');
  expect(getContactHref('email', 'team+linad@example.org')).toBe('mailto:team%2Blinad@example.org');
});

test('invalid contact values do not become active links', () => {
  for (const value of ['javascript:alert(1)', 'http://example.org', '//example.org', 'not a URL', 'https://name:password@example.org']) {
    expect(getContactHref('github', value)).toBeNull();
  }
  for (const value of ['not an email', 'name@example.org?subject=unexpected', 'name@example.org\r\nBcc:other@example.org', 'mailto:name@example.org']) {
    expect(getContactHref('email', value)).toBeNull();
  }
});

test('contact buttons pick up configuration changes and stay hidden or disabled when unset', () => {
  function render(contact: ContactId, unavailable: 'hidden' | 'disabled' = 'disabled') {
    return renderToStaticMarkup(createElement(PreferencesProvider, null, createElement(ContactLink, { contact, unavailable })));
  }
  expect(render('instagram', 'hidden')).toBe('');
  const original = { ...contacts };
  try {
    contacts.projectTelegram = null;
    expect(render('projectTelegram')).toContain('disabled=""');
    contacts.instagram = 'https://example.org/contact';
    contacts.email = 'feedback@example.org';
    const social = render('instagram', 'hidden');
    expect(social).toContain('href="https://example.org/contact"');
    expect(social).toContain('rel="noopener noreferrer"');
    expect(social).not.toContain('disabled');
    const email = render('email');
    expect(email).toContain('href="mailto:feedback@example.org"');
    expect(email).not.toContain('target="_blank"');
  } finally {
    Object.assign(contacts, original);
  }
});

test('prepared email preserves filled text and encodes it without sending', () => {
  const subject = 'LINAD — A1 & B2 / Anfrage';
  const body = 'Имя: Данил & Anna\nLanguage: English\nZiel: Beruf\nFormat: онлайн\nText: + ? # = 100%';
  const href = getContactHref('email', undefined, { subject, body });
  expect(href).toContain('mailto:karnakovdaniel@gmail.com?');
  const url = new URL(href!);
  expect(url.searchParams.get('subject')).toBe(subject);
  expect(url.searchParams.get('body')).toBe(body.replace(/\n/g, '\r\n'));
  expect([...url.searchParams.keys()]).toEqual(['subject', 'body']);
  expect(getContactHref('authorTelegram', undefined, { subject, body })).toBe(confirmedContacts.authorTelegram);
});
