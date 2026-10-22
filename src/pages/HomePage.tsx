import { Link } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { Icon } from '../components/Icon';
import { HomeAbout } from '../components/HomeAbout';
import { TelegramCards } from '../components/TelegramCards';
import { assets } from '../config/assets';
import { getContactHref } from '../config/contact-links';
import '../styles/home.css';

export function HomePage() {
  const { t } = usePreferences();
  const cards = [
    { to: '/learn', external: false, title: t.practice, text: t.practiceIntro, icon: 'graduation', photo: assets.home.learning, alt: t.learningPhotoAlt },
    { to: '/tutors', external: false, title: t.findTutor, text: t.tutorsIntro, icon: 'people', photo: assets.home.tutors, alt: t.tutorsPhotoAlt },
    { to: getContactHref('projectTelegram')!, external: true, title: t.telegramTitle, text: t.telegramCardIntro, icon: 'telegram', photo: assets.home.telegram, alt: t.telegramPhotoAlt },
  ] as const;
  const steps = [
    { title: t.stepLanguage, text: t.stepLanguageDetail, icon: 'globe' },
    { title: t.stepSituation, text: t.stepSituationDetail, icon: 'file' },
    { title: t.stepPhrases, text: t.stepPhrasesDetail, icon: 'chat' },
    { title: t.stepCards, text: t.stepCardsDetail, icon: 'cards' },
    { title: t.stepTest, text: t.stepTestDetail, icon: 'check' },
    { title: t.stepProgress, text: t.stepProgressDetail, icon: 'chart' },
  ] as const;

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="page-heading">
        <img className="hero-photo" src={assets.home.hero} alt={t.heroPhotoAlt} width="2048" height="765" fetchPriority="high" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-inner">
          <h1 id="page-heading" tabIndex={-1}>{t.homeTitleLead}{' '}<span>{t.homeTitleEmphasis}</span></h1>
          <p className="hero-description">{t.homeHeroDescription}</p>
          <div className="button-row hero-actions">
            <Link className="button button-primary" to="/learn">{t.startLearning}<Icon name="arrow" /></Link>
            <Link className="button button-hero-secondary" to="/tutors">{t.findTutor}</Link>
          </div>
        </div>
      </section>

      <div className="container home-sections">
        <section className="home-features" aria-label={t.homeSectionsLabel}>
          {cards.map((card) => {
            const content = <>
            <img src={card.photo} alt={card.alt} width="1672" height="941" />
            <span className="photo-card-overlay" aria-hidden="true" />
            <div className="photo-card-copy">
              <span className="home-feature-icon"><Icon name={card.icon} /></span>
              <h2>{card.title}</h2><p>{card.text}</p>
            </div>
            <span className="photo-card-arrow"><Icon name="arrow" /></span>
            </>;
            return card.external
              ? <a href={card.to} target="_blank" rel="noopener noreferrer" className="home-photo-card" key={card.to} data-contact="projectTelegram">{content}</a>
              : <Link to={card.to} className="home-photo-card" key={card.to}>{content}</Link>;
          })}
        </section>

        <HomeAbout />

        <section className="home-learning" aria-labelledby="learning-heading">
          <div className="learning-overview">
            <span className="learning-mark"><Icon name="book" /></span>
            <div><h2 id="learning-heading">{t.learnTitle}</h2><p>{t.learningOverview}</p>
              <Link className="button button-primary" to="/learn">{t.goToLearning}<Icon name="arrow" /></Link>
            </div>
          </div>
          <ol className="learning-steps">
            {steps.map((step, i) => <li key={step.icon}>
              <div className="step-symbols"><span className="step-number">{String(i + 1).padStart(2, '0')}</span><Icon name={step.icon} /></div>
              <h3>{step.title}</h3><p>{step.text}</p>
              {i < steps.length - 1 && <span className="step-connector"><Icon name="arrow" /></span>}
            </li>)}
          </ol>
        </section>

        <TelegramCards />
      </div>
    </div>
  );
}
