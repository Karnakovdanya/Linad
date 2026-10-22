import { expect, test } from '@playwright/test';
import { buildTutorSubmission, submitTutorApplication, tutorWeb3Forms } from '../src/pages/tutors/web3forms';
import type { Application } from '../src/pages/tutors/model';
import directory from '../shared/tutor-directory.json' with { type: 'json' };

const lesson = (tutorId = 'daniil-karnakov', language: 'de' | 'en' = 'de'): Application => ({ kind: 'lesson', tutorId, fields: { name: 'Ученик & Student', email: 'student@example.org', language, level: 'B1', goal: 'work', time: 'evening', message: 'Grüße! ä ö ü ß & + ? #\nВторая строка.' } });
const teacher = (): Application => ({ kind: 'teacher', fields: { name: 'Кандидат LINAD', email: 'candidate@example.org', languages: ['de', 'en'], spokenLanguages: 'Русский, Deutsch B2, English C1', education: 'Мои образование и сертификаты', experience: 'Начинаю преподавать', levels: ['A1', 'A2'], about: 'Мой путь к языкам и преподаванию.', additional: 'Можно обсудить время по email.' } });

for (const tutor of directory) test(`Web3Forms sends all student details for ${tutor.id}, using the supplied public key and replyto`, async () => {
  const application = lesson(tutor.id, tutor.languages[0] as 'de' | 'en'); let payload: Record<string, unknown> = {}; let calls = 0;
  const fetcher: typeof fetch = async (url, options) => {
    calls++; expect(url).toBe('https://api.web3forms.com/submit'); expect(options?.method).toBe('POST'); expect(options?.credentials).toBe('omit');
    expect(options?.headers).toEqual({ 'Content-Type': 'application/json', Accept: 'application/json' }); payload = JSON.parse(String(options?.body));
    return Response.json({ success: true, message: 'Email sent successfully!' });
  };
  await submitTutorApplication(application, false, { fetch: fetcher });
  expect(calls).toBe(1); expect(payload.access_key).toBe('98c40b50-552f-4a70-8f1d-9c4121e2a12b'); expect(payload.subject).toBe(`LINAD — Запрос на занятие — ${tutor.name}`);
  expect(payload).toMatchObject({ from_name: 'LINAD Tutors', name: application.fields.name, email: application.fields.email, replyto: application.fields.email, botcheck: false, 'Преподаватель': tutor.name, 'ID преподавателя': tutor.id, 'Текущий уровень': 'B1', 'Цель обучения': 'Работа', 'Удобное время': 'Будни вечером', message: 'Grüße! ä ö ü ß & + ? #\nВторая строка.' });
  for (const forbidden of ['to', 'recipient', 'ccemail', 'redirect', 'webhook', 'reply_to']) expect(payload).not.toHaveProperty(forbidden);
});

test('candidate form includes all fields and its own subject without creating a profile, price or account', () => {
  const payload = buildTutorSubmission(teacher());
  expect(payload).toMatchObject({ access_key: tutorWeb3Forms.accessKey, subject: 'LINAD — Заявка преподавателя — Кандидат LINAD', form_type: 'Заявка преподавателя', name: 'Кандидат LINAD', email: 'candidate@example.org', replyto: 'candidate@example.org', 'Языки преподавания': 'Немецкий, Английский', 'Языки общения': 'Русский, Deutsch B2, English C1', 'Образование и сертификаты': 'Мои образование и сертификаты', 'Опыт преподавания': 'Начинаю преподавать', 'Уровни учеников': 'A1, A2', message: 'Мой путь к языкам и преподаванию.', 'Дополнительная информация': 'Можно обсудить время по email.' });
  for (const forbidden of ['to', 'price', 'password', 'account', 'specialization']) expect(payload).not.toHaveProperty(forbidden);
});

test('invalid emails, subject header injection, unknown tutor/language/level and long fields are rejected before sending', () => {
  const valid = lesson(); if (valid.kind !== 'lesson') throw new Error('Invalid fixture');
  for (const application of [
    { ...valid, tutorId: 'unknown' }, { ...valid, fields: { ...valid.fields, email: 'not-email' } },
    { ...valid, fields: { ...valid.fields, name: 'Name\r\nBcc: nobody' } }, { ...valid, fields: { ...valid.fields, level: 'C2' } },
    { ...valid, fields: { ...valid.fields, message: 'a'.repeat(1501) } }, { ...valid, tutorId: 'anna-mueller', fields: { ...valid.fields, language: 'en' as const } },
  ]) expect(() => buildTutorSubmission(application)).toThrow('invalid');
  const candidate = teacher(); if (candidate.kind !== 'teacher') throw new Error('Invalid fixture');
  for (const fields of [{ ...candidate.fields, levels: [] }, { ...candidate.fields, languages: [] }, { ...candidate.fields, education: '' }, { ...candidate.fields, levels: ['A1', 'A1'] as const }]) expect(() => buildTutorSubmission({ ...candidate, fields } as Application)).toThrow('invalid');
});

test('botcheck rejects a filled honeypot and never reaches the email API', async () => {
  let calls = 0; const fetcher: typeof fetch = async () => { calls++; return Response.json({ success: true }); };
  await expect(submitTutorApplication(lesson(), true, { fetch: fetcher })).rejects.toMatchObject({ issue: 'spam' }); expect(calls).toBe(0);
});

for (const response of [
  { status: 200, body: { success: false } }, { status: 200, body: { success: 'true' } }, { status: 200, body: { message: 'unconfirmed' } },
  { status: 400, body: { success: false } }, { status: 500, body: { success: true } }, { status: 429, body: { success: false } },
]) test(`HTTP ${response.status}, ${JSON.stringify(response.body)} cannot produce a success receipt`, async () => {
  const fetcher: typeof fetch = async () => Response.json(response.body, { status: response.status });
  await expect(submitTutorApplication(lesson(), false, { fetch: fetcher })).rejects.toMatchObject({ issue: response.status === 429 ? 'rate-limited' : 'provider-error' });
});

test('non-JSON response and network failure never count as sending confirmation', async () => {
  await expect(submitTutorApplication(teacher(), false, { fetch: async () => new Response('not JSON') })).rejects.toMatchObject({ issue: 'provider-error' });
  await expect(submitTutorApplication(teacher(), false, { fetch: async () => { throw new TypeError('Network unavailable'); } })).rejects.toThrow('Network unavailable');
});

test('abort signal is passed through and a Web3Forms success needs no invented message ID', async () => {
  const controller = new AbortController();
  const fetcher: typeof fetch = async (_url, options) => { expect(options?.signal).toBe(controller.signal); return Response.json({ success: true }); };
  await expect(submitTutorApplication(teacher(), false, { signal: controller.signal, fetch: fetcher })).resolves.toBeUndefined();
});
