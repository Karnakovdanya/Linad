import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import type { LearningLanguage } from '../../../domain/types';
import { NotFoundPage } from '../../SectionPages';
import { useLearningRouteLanguage } from '../situations/useLearningRouteLanguage';
import { practiceCategories, practicePath } from './data/categories';
import { PracticeIcon } from './PracticeIcon';
import { PracticePanels } from './PracticePanels';
import { LanguageVisibility } from './LanguageVisibility';
import { usePracticeStorage } from './usePracticeStorage';
import { useAccount } from '../../../account/auth-context';
import { trialCopy } from '../../../account/trial-copy';
import '../../../styles/practice.css';

export function PracticeWorkspace({ language, categoryId, situationId }: { language: LearningLanguage; categoryId: string; situationId?: string }) {
  const { t, preferences } = usePreferences(); const { user } = useAccount(); const trial = trialCopy(preferences.uiLanguage);
  const navigate = useNavigate();
  const [categoryPointerFocus, setCategoryPointerFocus] = useState(false);
  useLearningRouteLanguage(language);
  const storage = usePracticeStorage(t);
  const category = practiceCategories.find(category => category.id === categoryId);
  const situation = category?.situations.find(situation => situation.id === (situationId ?? category.defaultSituation));
  if (!category || (situationId && !situation)) return <NotFoundPage />;
  const title = situation ? t[situation.titleKey] : t[category.titleKey];
  return <div className="container practice-workspace">
    <aside className="practice-sidebar">
      <Link className="text-link practice-back" to={`/learn/${language}/situations`}><PracticeIcon name="arrow" />{t.practiceBack}</Link>
      <p className="practice-sidebar-title">{t.practiceTitle}</p>
      <nav className="practice-category-nav" aria-label={t.situationsCategoriesLabel}>
        {practiceCategories.map(item => <Link key={item.id} to={practicePath(language, item)} aria-current={item.id === category.id ? 'page' : undefined}>
          <PracticeIcon name={item.icon} /><span>{t[item.titleKey]}</span>
        </Link>)}
      </nav>
      <label className="practice-category-picker"><span>{t.practiceCategorySelect}</span><span className="practice-category-control"><select value={category.id}
        data-pointer-focus={categoryPointerFocus || undefined} onPointerDown={() => setCategoryPointerFocus(true)}
        onKeyDown={() => setCategoryPointerFocus(false)} onBlur={() => setCategoryPointerFocus(false)} onChange={event => {
        const selected = practiceCategories.find(item => item.id === event.target.value)!;
        navigate(practicePath(language, selected));
      }}>{practiceCategories.map(item => <option value={item.id} key={item.id}>{t[item.titleKey]}</option>)}</select><PracticeIcon name="chevron" /></span></label>
    </aside>
    <div className="practice-main">
      <header className="practice-banner">
        <img className="practice-banner-photo" src={category.image} alt={t[category.altKey]} />
        <nav className="practice-breadcrumbs" aria-label={t.practiceTitle}><Link to={`/learn/${language}/situations`}>{t.practiceTitle}</Link><span aria-hidden="true">›</span><span>{t[category.titleKey]}</span></nav>
        <div className="practice-banner-copy"><h1 id="page-heading" tabIndex={-1}>{title}</h1>
          <p>{situation?.introKey ? t[situation.introKey] : situation?.material ? t.practiceReadyIntro : situation ? t.practicePendingIntro : t.practiceCategoryPending}</p>
        </div>
        {category.situations.length > 0 && <nav className="practice-situation-nav" aria-label={t.practiceSituations}>
          {category.situations.map(item => <Link key={item.id} to={practicePath(language, category, item)} aria-current={item.id === situation?.id ? 'page' : undefined}>{t[item.titleKey]}</Link>)}
        </nav>}
      </header>
      <div className="practice-language-bar">
        <LanguageVisibility t={t} visible={storage.preferences.visibleLanguages} onToggle={storage.toggleLanguage} hintId="practice-language-hint" />
        <p id="practice-language-hint">{t.practiceLanguageHint}</p>
        <span className="practice-saved-count">{t.practiceSavedCount} {storage.preferences.savedItems.length}</span>
      </div>
      <div className="practice-feedback">
        {storage.warning && <p role="alert">{storage.warning === 'unavailable' ? t.practiceStorageUnavailable : t.practiceStorageInvalid}</p>}
        <p className="practice-status" role="status" aria-live="polite">{storage.notice}</p>
      </div>
      <PracticePanels key={`${category.id}/${situation?.id ?? ''}`}
        categoryId={category.id} situationId={situation?.id ?? ''} material={situation?.material} visibleLanguages={storage.preferences.visibleLanguages}
        savedItems={storage.preferences.savedItems} onSave={storage.toggleSaved} />
      {!user && <p className="practice-hint">{trial.local} <Link className="text-link" to="/auth/login">{trial.login}</Link></p>}
    </div>
  </div>;
}
