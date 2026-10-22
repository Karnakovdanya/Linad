import { Link } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { AuthorContacts } from './AuthorContacts';
import { ContactIcon } from '../components/ContactIcon';
import { Icon } from '../components/Icon';
import { assets } from '../config/assets';
import '../styles/author.css';

function AuthorHeading({ text, id }: { text: string; id: string }) {
  if (text.includes('LINAD')) {
    const split = text.indexOf('LINAD');
    return <h2 className="author-section-title" id={id}>{text.slice(0, split)}<span>LINAD</span>{text.slice(split + 5)}</h2>;
  }
  const split = text.includes('LINAD') ? text.indexOf('LINAD') : text.lastIndexOf(' ') + 1;
  return <h2 className="author-section-title" id={id}>{text.slice(0, split)}<span>{text.slice(split)}</span></h2>;
}

export function AuthorContent() {
  const { t } = usePreferences();
  const nameStart = t.authorTitle.lastIndexOf(' ') + 1;
  const problems = [
    { title: t.authorProblem1Title, problem: t.authorProblem1Body, solution: t.authorSolution1, icon: 'chat', tone: 'blue' },
    { title: t.authorProblem2Title, problem: t.authorProblem2Body, solution: t.authorSolution2, icon: 'check', tone: 'peach' },
    { title: t.authorProblem3Title, problem: t.authorProblem3Body, solution: t.authorSolution3, icon: 'book', tone: 'green' },
    { title: t.authorProblem4Title, problem: t.authorProblem4Body, solution: t.authorSolution4, icon: 'telegram', tone: 'violet' },
    { title: t.authorProblem5Title, problem: t.authorProblem5Body, solution: t.authorSolution5, icon: 'people', tone: 'amber' },
  ] as const;
  function showContacts() {
    const section = document.getElementById('author-contacts');
    section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    section?.focus({ preventScroll: true });
  }

  return <article className="container author-page">
    <section className="author-panel author-welcome" aria-labelledby="page-heading" data-author-section="welcome">
      <img className="author-landscape" src={assets.authorPage.heroLandscape} alt={t.authorLandscapeAlt} width="1672" height="941" />
      <img className="author-profile-portrait" src={assets.authorPage.portrait} alt={t.authorPhoto} width="1199" height="1312" fetchPriority="high" />
      <div className="author-welcome-copy author-copy">
        <p className="author-eyebrow">{t.authorEyebrow}</p>
        <h1 id="page-heading" tabIndex={-1}>{t.authorTitle.slice(0, nameStart)}<span>{t.authorTitle.slice(nameStart)}</span></h1>
        <div className="author-paragraphs"><p>{t.authorHeroP1}</p><p>{t.authorHeroP2}</p></div>
        <div className="author-actions">
          <Link className="button button-primary" to="/">{t.authorGoHome}<Icon name="arrow" /></Link>
          <button type="button" className="button button-secondary" onClick={showContacts}><ContactIcon contact="email" />{t.authorContactMe}</button>
        </div>
      </div>
    </section>

    <section className="author-panel author-story" aria-labelledby="author-story-heading" data-author-section="story">
      <div className="author-story-copy author-copy">
        <p className="author-eyebrow">{t.authorStoryLabel}</p>
        <AuthorHeading id="author-story-heading" text={t.authorStoryTitle} />
        <div className="author-paragraphs"><p>{t.authorStoryP1}</p><p>{t.authorStoryP2}</p><p>{t.authorStoryP3}</p><p>{t.authorStoryP4}</p></div>
      </div>
      <div className="author-story-media"><img src={assets.authorPage.storyWorkspace} alt={t.authorStoryAlt} width="1672" height="941" loading="lazy" /></div>
    </section>

    <section className="author-panel author-reasons" aria-labelledby="author-reasons-heading" data-author-section="reasons">
      <p className="author-eyebrow">{t.authorReasonsLabel}</p>
      <AuthorHeading id="author-reasons-heading" text={t.authorReasonsTitle} />
      <p className="author-section-intro">{t.authorReasonsIntro}</p>
      <div className="author-problem-grid">
        {problems.map((problem) => <article className={`author-problem-card author-tone-${problem.tone}`} key={problem.icon}>
          <span className="author-problem-icon"><Icon name={problem.icon} /></span>
          <h3>{problem.title}</h3>
          <p className="author-problem-body"><span className="sr-only">{t.authorProblemLabel} </span>{problem.problem}</p>
          <span className="author-problem-arrow"><Icon name="arrow" /></span>
          <div className="author-solution"><p><span className="sr-only">{t.authorSolutionLabel} </span>{problem.solution}</p></div>
        </article>)}
      </div>
    </section>

    <section className="author-panel author-goal" aria-labelledby="author-goal-heading" data-author-section="goal">
      <p className="author-eyebrow">{t.authorGoalLabel}</p>
      <div className="author-goal-grid">
        <img className="author-goal-photo" src={assets.authorPage.goalWorkspace} alt={t.authorGoalAlt} width="1671" height="941" loading="lazy" />
        <div className="author-copy"><AuthorHeading id="author-goal-heading" text={t.authorGoalTitle} /><div className="author-paragraphs"><p>{t.authorGoalP1}</p><p>{t.authorGoalP2}</p></div></div>
      </div>
    </section>

    <section className="author-panel author-contacts contacts-section" id="author-contacts" tabIndex={-1} aria-labelledby="author-contacts-heading" data-author-section="contacts">
      <div className="author-copy"><p className="author-eyebrow">{t.authorContactsLabel}</p><AuthorHeading id="author-contacts-heading" text={t.authorContactsHeading} /><p>{t.authorContactIntro}</p></div>
      <AuthorContacts />
    </section>
  </article>;
}
