import { Link } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { Icon } from '../../../components/Icon';
import type { LearningLanguage } from '../../../domain/types';
import { situationCategories, situationCategoryPath } from './categories';
import { SelectedLearningLanguage } from './SelectedLearningLanguage';
import { useLearningRouteLanguage } from './useLearningRouteLanguage';
import '../../../styles/situations.css';

export function SituationsCatalogPage({ language }: { language: LearningLanguage }) {
  const { t, setLearningLanguage } = usePreferences();
  useLearningRouteLanguage(language);
  return <div className="container situations-page">
    <header className="situations-intro">
      <Link className="text-link situations-back" to="/learn" onClick={() => setLearningLanguage(language)}><Icon name="arrow" />{t.learningBack}</Link>
      <div className="situations-intro-row">
        <div><h1 id="page-heading" tabIndex={-1}>{t.learningEverydayTitle}</h1><p>{t.situationsIntro}</p></div>
        <SelectedLearningLanguage language={language} />
      </div>
    </header>
    <section aria-label={t.situationsCategoriesLabel}>
      <ul className="situations-grid">
        {situationCategories.map(category => <li key={category.id}>
          <Link className="situations-card" to={situationCategoryPath(language, category)} data-category={category.id}
            aria-labelledby={`category-${category.id}`} aria-describedby={`category-${category.id}-description`}>
            <img src={category.image} alt={t[category.altKey]} width={category.width} height={category.height} style={{ objectPosition: category.position }} />
            <div className="situations-card-copy">
              <h2 id={`category-${category.id}`}>{t[category.titleKey]}</h2>
              <p id={`category-${category.id}-description`}>{t[category.descriptionKey]}</p>
              <Icon name="arrow" />
            </div>
          </Link>
        </li>)}
      </ul>
    </section>
  </div>;
}
