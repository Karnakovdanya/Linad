import { usePreferences } from '../../app/preferences-context';
import { BackHome } from '../../components/PageState';
import { assets } from '../../config/assets';
import { LearningPathCard } from './LearningPathCard';
import '../../styles/learning.css';

export function LearningPage() {
  const { t, preferences } = usePreferences();
  const { learningLanguage } = preferences;
  const situations = [t.learningJobInterview, t.learningDoctor, t.learningTravel, t.learningDocuments, t.learningCommunication];
  return <div className="container learning-page">
    <header className="learning-intro">
      <BackHome />
      <h1 id="page-heading" tabIndex={-1}>{t.learnTitle}</h1>
      <p>{t.learningIntro}</p>
    </header>

    <section className="learning-paths" aria-labelledby="learning-paths-heading">
      <h2 id="learning-paths-heading">{t.learningChoosePath}</h2>
      <div className="learning-path-grid">
        <LearningPathCard id="learning-everyday-heading" title={t.learningEverydayTitle} description={t.learningEverydayDescription}
          image={assets.learning.everydayLife} imageAlt={t.learningEverydayAlt} icon="globe"
          to={`/learn/${learningLanguage}/situations`} action={t.learningSituationsCta}>
          <ul className="learning-situation-list" aria-label={t.learningExamplesLabel}>{situations.map(situation => <li key={situation}>{situation}</li>)}</ul>
        </LearningPathCard>
        <LearningPathCard id="learning-levels-heading" title={t.learningLevelsTitle} description={t.learningLevelsDescription}
          image={assets.learning.byLevel} imageAlt={t.learningLevelsAlt} icon="book"
          to="/learn/levels" action={t.learningLevelsCta}>
          <ul className="learning-level-list" aria-label={t.learningLevelsLabel}>{['A1', 'A2', 'B1', 'B2', 'C1'].map(level => <li key={level}>{level}</li>)}</ul>
        </LearningPathCard>
      </div>
    </section>
  </div>;
}
