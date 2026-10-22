import { useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { ContactIcon } from '../../components/ContactIcon';
import type { Tutor, TutorContact } from './model';
import { contactLinks } from './service';
import { useTutorLocale } from './useTutorLocale';

export function TutorHeading({ children, title, centered = false }: { children: ReactNode; title: string; centered?: boolean }) {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.title = `${title} | LINAD`;
    document.getElementById('page-heading')?.focus({ preventScroll: true });
  }, [title, pathname]);
  return <h1 id="page-heading" tabIndex={-1} className={centered ? 'tutors-centered' : undefined}>{children}</h1>;
}
export function DemoBadge() { return <span className="tutor-demo">Demo</span>; }
export function TutorFlag({ language }: { language: 'de' | 'en' }) {
  return <span aria-hidden="true" className={`tutor-flag tutor-flag-${language}`} />;
}
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="tutors-back" to={to}><span aria-hidden="true">←</span>{children}</Link>;
}
export function ContactOptions({ contact }: { contact?: TutorContact }) {
  const { copy } = useTutorLocale();
  const links = contactLinks(contact);
  return <div className="tutors-contact-options">{(['telegram', 'email'] as const).map(channel => {
    const href = links[channel];
    const label = channel === 'telegram' ? copy.telegramContact : copy.emailContact;
    return href ? <a key={channel} href={href} className="button button-secondary" target={channel === 'telegram' ? '_blank' : undefined} rel={channel === 'telegram' ? 'noopener noreferrer' : undefined} data-tutor-contact={channel}>
      <ContactIcon contact={channel === 'telegram' ? 'authorTelegram' : 'email'} />{label}
    </a> : null;
  })}</div>;
}
export function TutorIdentityBadge({ tutor }: { tutor: Tutor }) {
  const { copy } = useTutorLocale();
  return <>{tutor.demo && <DemoBadge />}{tutor.founder && <span className="tutor-tag tutor-founder">{copy.founder}</span>}{!tutor.demo && tutor.nativeTeachingLanguage && tutor.languages.includes(tutor.nativeTeachingLanguage) && <span className="tutor-tag">{copy.native} · {copy[tutor.nativeTeachingLanguage]}</span>}</>;
}
export function LessonPrices({ tutor }: { tutor: Tutor }) {
  const { copy } = useTutorLocale();
  return <div className="tutor-lesson-prices"><p className="tutor-price"><span>{copy.regularLesson}</span><strong>{tutor.price} <small>€</small></strong><span>{copy.perHour}</span></p><p className="tutor-trial-price"><span>{copy.trialLesson}</span><strong>{tutor.trialPrice} €</strong></p></div>;
}
export function EmptyTutor({ prepared = false }: { prepared?: boolean }) {
  const { copy } = useTutorLocale();
  return <div className="tutors-empty"><Icon name={prepared ? 'file' : 'people'} /><TutorHeading title={prepared ? copy.emptyTitle : copy.notFound}>{prepared ? copy.emptyTitle : copy.notFound}</TutorHeading>
    <p>{prepared ? copy.emptyHelp : copy.notFoundHelp}</p><Link to="/tutors" className="button button-primary">{copy.backCatalog}</Link>{prepared && <Link to="/tutors/become" className="button button-secondary">{copy.become}</Link>}</div>;
}
