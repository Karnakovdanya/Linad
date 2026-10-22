import { useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import type { LessonRequest, SubmissionReceipt, TeacherApplication, Tutor, TutorLevel } from './model';
import { goals, levels } from './model';
import { timeOptions, validEmail } from './service';
import { BackLink, TutorHeading, TutorIdentityBadge } from './TutorUI';
import { useTutorLocale } from './useTutorLocale';
import { useApplicationSubmission } from './useApplicationSubmission';
import type { TutorCopy } from './copy';

type Errors = Record<string, keyof TutorCopy>;
interface FormProps { onSubmitted: (receipt: SubmissionReceipt) => void }
function Field({ id, label, error, children, wide = false, optional = false }: { id: string; label: string; error?: string; children: ReactNode; wide?: boolean; optional?: boolean }) {
  return <div className={`tutors-field${wide ? ' tutors-field-wide' : ''}`}><label htmlFor={id}>{label}{!optional && <span aria-hidden="true"> *</span>}</label>{children}{error && <span id={`${id}-error`} className="tutors-field-error">{error}</span>}</div>;
}
function useFormErrors() {
  const { copy } = useTutorLocale(); const [keys, setKeys] = useState<Errors>({}); const summary = useRef<HTMLParagraphElement>(null);
  const errors = Object.fromEntries(Object.entries(keys).map(([field, key]) => [field, copy[key]]));
  function report(next: Errors) { setKeys(next); if (Object.keys(next).length) requestAnimationFrame(() => summary.current?.focus()); }
  const attrs = (id: string) => ({ id, name: id, 'aria-invalid': Boolean(errors[id]), 'aria-describedby': errors[id] ? `${id}-error` : undefined });
  return { errors, summary, report, attrs };
}
function ServiceNotice({ service }: { service: ReturnType<typeof useApplicationSubmission> }) {
  const { copy } = useTutorLocale();
  const messages = { invalid: copy.formError, 'rate-limited': copy.rateLimited, spam: copy.spam, 'provider-error': copy.sendError };
  return <div className="tutors-form-notice" role={service.issue ? 'alert' : 'status'}>
    {service.issue ? messages[service.issue] : copy.ready}
  </div>;
}
function Honeypot() {
  return <div className="tutors-honeypot" aria-hidden="true"><input type="checkbox" id="botcheck" name="botcheck" hidden tabIndex={-1} autoComplete="off" /></div>;
}
const value = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

export function LessonRequestForm({ tutor, onSubmitted }: FormProps & { tutor: Tutor }) {
  const { copy } = useTutorLocale(); const { search } = useLocation(); const { errors, summary, report, attrs } = useFormErrors();
  const service = useApplicationSubmission(onSubmitted);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const fields: LessonRequest = { name: value(form, 'name'), email: value(form, 'email'), language: value(form, 'language') as LessonRequest['language'], level: value(form, 'level'), goal: value(form, 'goal'), time: value(form, 'time'), message: value(form, 'message') };
    const next: Errors = {};
    if (!fields.name || fields.name.length > 100 || /[\r\n]/.test(fields.name)) next.name = 'required';
    if (!validEmail(fields.email)) next.email = 'emailError';
    if (!tutor.languages.includes(fields.language)) next.language = 'required';
    if (![...levels, 'notSure'].includes(fields.level)) next.level = 'required';
    if (!(goals as readonly string[]).includes(fields.goal)) next.goal = 'required';
    if (!(timeOptions as readonly string[]).includes(fields.time)) next.time = 'required';
    report(next); if (!Object.keys(next).length) void service.send({ kind: 'lesson', tutorId: tutor.id, fields }, form.has('botcheck'));
  }
  return <>
    <BackLink to={`/tutors/${tutor.id}${search}`}>{copy.backProfile}</BackLink>
    <header className="tutors-form-heading"><TutorHeading title={`${copy.contactTitle} ${tutor.name}`} centered>{copy.contactTitle} <span className="tutors-accent">{tutor.name}</span></TutorHeading><p>{copy.requestIntro}</p><TutorIdentityBadge tutor={tutor} /></header>
    <div className="tutors-request-layout"><form className="tutors-panel tutors-form" onSubmit={submit} noValidate aria-busy={service.sending}>
      <p className="tutors-form-hint">{copy.requiredHint}</p>{Object.keys(errors).length > 0 && <p ref={summary} tabIndex={-1} role="alert" className="tutors-error-summary">{copy.formError}</p>}
      <fieldset className="tutors-form-fields" disabled={service.sending}><div className="tutors-form-grid">
        <Field id="name" label={copy.name} error={errors.name}><input {...attrs('name')} autoComplete="name" required maxLength={100} /></Field>
        <Field id="email" label={copy.email} error={errors.email}><input {...attrs('email')} type="email" autoComplete="email" required maxLength={254} /></Field>
        <Field id="selected-tutor" label={copy.selectedTutor} wide optional><input id="selected-tutor" value={tutor.name} readOnly /></Field>
        <Field id="language" label={copy.language} error={errors.language}><select {...attrs('language')} required defaultValue={tutor.languages[0]}>{tutor.languages.map(language => <option key={language} value={language}>{copy[language]}</option>)}</select></Field>
        <Field id="level" label={copy.currentLevel} error={errors.level}><select {...attrs('level')} required defaultValue=""><option value="">{copy.choose}</option>{levels.map(level => <option key={level}>{level}</option>)}<option value="notSure">{copy.notSure}</option></select></Field>
        <Field id="goal" label={copy.goal} error={errors.goal}><select {...attrs('goal')} required defaultValue=""><option value="">{copy.choose}</option>{goals.map(goal => <option key={goal} value={goal}>{copy[goal]}</option>)}</select></Field>
        <Field id="time" label={copy.time} error={errors.time}><select {...attrs('time')} required defaultValue=""><option value="">{copy.choose}</option>{timeOptions.map(time => <option key={time} value={time}>{copy[time]}</option>)}</select></Field>
        <Field id="message" label={`${copy.message} (${copy.optional})`} wide optional><textarea id="message" name="message" rows={4} maxLength={1500} placeholder={copy.messagePlaceholder} /></Field>
      </div><Honeypot /></fieldset>
      <ServiceNotice service={service} /><button type="submit" className="button button-primary" disabled={service.sending}><Icon name="file" />{service.sending ? copy.sending : copy.send}</button><p className="tutors-small tutors-form-privacy">{copy.privacy}</p>
    </form><aside className="tutors-request-aside"><section className="tutors-panel tutors-note-panel"><h2><Icon name="file" />{copy.nextSteps}</h2><p>{copy.contactHint}</p></section></aside></div>
  </>;
}

export function TeacherForm({ onSubmitted }: FormProps) {
  const { copy } = useTutorLocale(); const { errors, summary, report, attrs } = useFormErrors(); const service = useApplicationSubmission(onSubmitted);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const fields: TeacherApplication = { name: value(form, 'name'), email: value(form, 'email'), languages: form.getAll('languages').filter((language): language is 'de' | 'en' => language === 'de' || language === 'en'), spokenLanguages: value(form, 'spokenLanguages'), education: value(form, 'education'), experience: value(form, 'experience'), levels: form.getAll('levels').filter((level): level is TutorLevel => (levels as readonly FormDataEntryValue[]).includes(level)), about: value(form, 'about'), additional: value(form, 'additional') };
    const next: Errors = {};
    for (const key of ['name', 'spokenLanguages', 'education', 'experience', 'about'] as const) if (!fields[key]) next[key] = 'required';
    if (/[\r\n]/.test(fields.name)) next.name = 'required';
    if (!validEmail(fields.email)) next.email = 'emailError';
    if (!fields.languages.length) next.languages = 'languagesError';
    if (!fields.levels.length) next.levels = 'levelsError';
    report(next); if (!Object.keys(next).length) void service.send({ kind: 'teacher', fields }, form.has('botcheck'));
  }
  return <>
    <BackLink to="/tutors">{copy.backCatalog}</BackLink><header className="tutors-form-heading"><TutorHeading title={`${copy.joinTitle} LINAD`} centered>{copy.joinTitle} <span className="tutors-accent">LINAD</span></TutorHeading><p>{copy.joinIntro}</p></header>
    <form className="tutors-panel tutors-form tutors-teacher-form" onSubmit={submit} noValidate aria-busy={service.sending}>
      <p className="tutors-form-hint">{copy.requiredHint}</p>{Object.keys(errors).length > 0 && <p ref={summary} tabIndex={-1} role="alert" className="tutors-error-summary">{copy.formError}</p>}
      <fieldset className="tutors-form-fields" disabled={service.sending}><div className="tutors-form-grid">
        <Field id="name" label={copy.name} error={errors.name}><input {...attrs('name')} autoComplete="name" required maxLength={100} /></Field>
        <Field id="email" label={copy.email} error={errors.email}><input {...attrs('email')} type="email" autoComplete="email" required maxLength={254} /></Field>
        <fieldset className="tutors-language-checks" aria-describedby={errors.languages ? 'languages-error' : undefined} aria-invalid={Boolean(errors.languages)}><legend>{copy.teachingLanguages} *</legend>{(['de', 'en'] as const).map(language => <label key={language}><input type="checkbox" name="languages" value={language} />{copy[language]}</label>)}{errors.languages && <span id="languages-error" className="tutors-field-error">{errors.languages}</span>}</fieldset>
        <Field id="spokenLanguages" label={copy.spokenLanguages} error={errors.spokenLanguages}><input {...attrs('spokenLanguages')} required maxLength={400} /></Field>
        <Field id="education" label={copy.education} error={errors.education} wide><textarea {...attrs('education')} required rows={3} maxLength={1500} placeholder={copy.educationPlaceholder} /></Field>
        <Field id="experience" label={copy.experienceField} error={errors.experience} wide><textarea {...attrs('experience')} required rows={3} maxLength={1500} placeholder={copy.experiencePlaceholder} /></Field>
        <fieldset className="tutors-language-checks tutors-field-wide" aria-describedby={errors.levels ? 'levels-error' : undefined} aria-invalid={Boolean(errors.levels)}><legend>{copy.teachingLevels} *</legend>{levels.map(level => <label key={level}><input type="checkbox" name="levels" value={level} />{level}</label>)}{errors.levels && <span id="levels-error" className="tutors-field-error">{errors.levels}</span>}</fieldset>
        <Field id="about" label={copy.aboutYou} error={errors.about} wide><textarea {...attrs('about')} required rows={5} maxLength={2500} placeholder={copy.aboutPlaceholder} /></Field>
        <Field id="additional" label={`${copy.additional} (${copy.optional})`} wide optional><textarea id="additional" name="additional" rows={3} maxLength={1500} /></Field>
      </div><Honeypot /></fieldset><p className="tutors-form-notice">{copy.joinPolicy}</p><ServiceNotice service={service} />
      <button className="button button-primary" type="submit" disabled={service.sending}><Icon name="file" />{service.sending ? copy.sending : copy.send}</button><p className="tutors-small tutors-form-privacy">{copy.privacy}</p>
    </form>
  </>;
}
