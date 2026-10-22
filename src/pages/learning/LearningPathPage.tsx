import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../../app/preferences-context';
import { Icon } from '../../components/Icon';
import type { LearningLanguage } from '../../domain/types';
import '../../styles/learning.css';

export function LearningPathPage({ language, path }: { language: LearningLanguage; path: 'situations' | 'levels' }) {
  const { t, preferences, setLearningLanguage } = usePreferences();
  const enteredLanguage = useRef<LearningLanguage | null>(null);
  useEffect(() => {
    // A direct URL establishes its language once. Later storage events from
    // another tab must not make two open paths repeatedly overwrite each other.
    if (enteredLanguage.current === language) return;
    enteredLanguage.current = language;
    if (preferences.learningLanguage !== language) setLearningLanguage(language);
  }, [language, preferences.learningLanguage, setLearningLanguage]);

  return <div className="container learning-page learning-path-page">
    <Link className="text-link learning-back-link" to="/learn" onClick={() => setLearningLanguage(language)}>
      <span className="learning-back-icon"><Icon name="arrow" /></span>{t.learningBack}
    </Link>
    <section className="learning-route-state">
      <h1 id="page-heading" tabIndex={-1}>{path === 'situations' ? t.learningEverydayTitle : t.learningLevelsTitle}</h1>
      <p>{t.learningSelectedLanguage}: <strong>{language === 'de' ? t.learnGerman : t.learnEnglish}</strong></p>
    </section>
  </div>;
}
