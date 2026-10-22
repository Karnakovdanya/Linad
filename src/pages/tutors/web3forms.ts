import directory from '../../../shared/tutor-directory.json' with { type: 'json' };
import { goals, levels } from './model';
import type { Application, SubmissionIssue } from './model';
import { timeOptions, validEmail } from './service';

// Web3Forms access keys are public browser-form identifiers, not server secrets.
// The recipient is configured in Web3Forms; no visitor-controlled recipient is sent.
export const tutorWeb3Forms = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '98c40b50-552f-4a70-8f1d-9c4121e2a12b',
} as const;
const languages = { de: 'Немецкий', en: 'Английский' };
const goalLabels = { conversation: 'Разговорная практика', grammar: 'Грамматика', work: 'Работа', exams: 'Экзамены', travel: 'Путешествия' };
const timeLabels = { morning: 'Будни утром', afternoon: 'Будни днём', evening: 'Будни вечером', weekend: 'Выходные', flexible: 'По договорённости' };

export class ApplicationSubmissionError extends Error {
  constructor(readonly issue: SubmissionIssue) { super(issue); }
}
function invalid(): never { throw new ApplicationSubmissionError('invalid'); }
function field(value: string, maximum: number, required = true, singleLine = false) {
  if (typeof value !== 'string' || value.length > maximum || (required && !value.trim()) || (singleLine && /[\r\n]/.test(value))) invalid();
  return value.trim();
}
function choices<T extends string>(values: T[], allowed: readonly T[]): T[] {
  if (!Array.isArray(values) || !values.length || new Set(values).size !== values.length || values.some(value => !allowed.includes(value))) invalid();
  return allowed.filter(value => values.includes(value));
}
export function buildTutorSubmission(application: Application, botcheck = false): Record<string, string | boolean> {
  if (botcheck) throw new ApplicationSubmissionError('spam');
  if (!application?.fields || !['lesson', 'teacher'].includes(application.kind)) invalid();
  const fields = application.fields;
  const name = field(fields.name, 100, true, true); const email = field(fields.email, 254, true, true);
  if (!validEmail(email)) invalid();
  const common = { access_key: tutorWeb3Forms.accessKey, from_name: 'LINAD Tutors', name, email, replyto: email, botcheck: false };
  if (application.kind === 'lesson') {
    const fields = application.fields; const tutor = directory.find(tutor => tutor.id === application.tutorId);
    if (!tutor || !tutor.languages.includes(fields.language) || ![...levels, 'notSure'].includes(fields.level) || !(goals as readonly string[]).includes(fields.goal) || !(timeOptions as readonly string[]).includes(fields.time)) invalid();
    return { ...common, subject: `LINAD — Запрос на занятие — ${tutor.name}`, form_type: 'Запрос на занятие',
      'Преподаватель': tutor.name, 'ID преподавателя': tutor.id, 'Язык обучения': languages[fields.language],
      'Текущий уровень': fields.level === 'notSure' ? 'Пока не знаю' : fields.level,
      'Цель обучения': goalLabels[fields.goal as keyof typeof goalLabels], 'Удобное время': timeLabels[fields.time as keyof typeof timeLabels], message: field(fields.message, 1500, false) };
  }
  const candidate = application.fields;
  return { ...common, subject: `LINAD — Заявка преподавателя — ${name}`, form_type: 'Заявка преподавателя',
    'Языки преподавания': choices(candidate.languages, ['de', 'en']).map(language => languages[language]).join(', '),
    'Языки общения': field(candidate.spokenLanguages, 400), 'Образование и сертификаты': field(candidate.education, 1500),
    'Опыт преподавания': field(candidate.experience, 1500), 'Уровни учеников': choices(candidate.levels, levels).join(', '),
    message: field(candidate.about, 2500), 'Дополнительная информация': field(candidate.additional, 1500, false) };
}

export async function submitTutorApplication(application: Application, botcheck = false, options: { signal?: AbortSignal; fetch?: typeof fetch } = {}) {
  const payload = buildTutorSubmission(application, botcheck);
  const response = await (options.fetch ?? globalThis.fetch)(tutorWeb3Forms.endpoint, {
    method: 'POST', mode: 'cors', credentials: 'omit', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload), signal: options.signal,
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok || !data || typeof data !== 'object' || !('success' in data) || data.success !== true) {
    throw new ApplicationSubmissionError(response.status === 429 ? 'rate-limited' : 'provider-error');
  }
}
