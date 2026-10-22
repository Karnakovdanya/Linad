import { Link, useLocation } from 'react-router-dom';
import type { Tutor } from './model';
import { tutorContacts, tutorImage } from './data';
import { useTutorLocale } from './useTutorLocale';
import { BackLink, ContactOptions, DemoBadge, LessonPrices, TutorFlag, TutorHeading, TutorIdentityBadge } from './TutorUI';
import { TutorFavoriteButton } from '../../account/actions';

export function Profile({ tutor }: { tutor: Tutor }) {
  const { copy, language } = useTutorLocale();
  const { search } = useLocation();
  return <>
    <BackLink to={`/tutors${search}`}>{copy.backCatalog}</BackLink>
    <div className="tutor-profile-grid">
      <div className="tutor-profile-side">
      <div className="tutor-profile-portrait"><img src={tutorImage(tutor)} alt={`${tutor.name}${tutor.demo ? ' · Demo' : ''}`} width="1198" height="1312" /><p><TutorIdentityBadge tutor={tutor} /></p></div>
      <aside className="tutor-contact-card"><LessonPrices tutor={tutor} /><Link to={`/tutors/${tutor.id}/request${search}`} className="button button-primary">{copy.request}</Link>
        {tutor.id === 'daniil-karnakov' && <section className="tutor-direct-contact"><h2>{copy.directContact}</h2><ContactOptions contact={tutorContacts[tutor.id]} /></section>}
      </aside>
      </div>
      <div className="tutor-profile-content">
      <div className="tutor-profile-main"><TutorHeading title={tutor.name}>{tutor.name}</TutorHeading><TutorFavoriteButton tutorId={tutor.id} /><p className="tutor-profile-languages">{tutor.languages.map(lang => <span key={lang}><TutorFlag language={lang} />{copy[lang]}</span>)}</p>
        <section className="tutor-about"><h2>{copy.about}</h2><div className="tutor-biography">{tutor.about[language].split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>
        {tutor.experience && <section className="tutors-panel"><h2>{copy.experience}</h2><p>{tutor.experience[language]}</p></section>}
      </div>
      <div className="tutor-profile-bottom"><section className="tutors-panel"><h2>{copy.speaks}</h2><p>{tutor.spokenLanguages[language]}</p></section><section className="tutors-panel"><h2>{copy.teachingLevels}</h2>{tutor.levels.length ? <div className="tutor-profile-tags">{tutor.levels.map(level => <span className="tutor-tag" key={level}>{level}</span>)}</div> : <p>{copy.levelsByAgreement}</p>}</section></div>
      </div>
    </div>
    {tutor.demo && <p className="tutors-demo-note"><DemoBadge />{copy.demoProfileNote}</p>}
  </>;
}
