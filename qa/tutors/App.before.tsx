import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HomePage } from '../pages/HomePage';
import { AuthorPage, NotFoundPage, ProfilePage, TelegramPage, TutorsPage } from '../pages/SectionPages';
import { LearningPage } from '../pages/learning/LearningPage';
import { SituationsCatalogPage } from '../pages/learning/situations/SituationsCatalogPage';
import { SituationCategoryPage } from '../pages/learning/situations/SituationCategoryPage';
import { situationCategories, situationCategoryPath } from '../pages/learning/situations/categories';
import { findPracticeRoute, practiceCategories, practicePath } from '../pages/learning/practice/data/categories';
import { usePreferences } from './preferences-context';

const LevelLearning = lazy(() => import('../pages/learning/levels/LevelLearning'));

const titles = {
  '/': 'home', '/learn': 'learn', '/tutors': 'tutors',
  '/telegram': 'telegram', '/profile': 'profile', '/author': 'author',
  '/learn/de/situations': 'learningEverydayTitle', '/learn/en/situations': 'learningEverydayTitle',
  '/learn/de/levels': 'learningLevelsTitle', '/learn/en/levels': 'learningLevelsTitle',
} as const;

function RouteEffects() {
  const { pathname } = useLocation();
  const { t, preferences } = usePreferences();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const practiceRoute = findPracticeRoute(pathname);
    const key = titles[pathname as keyof typeof titles] ?? practiceRoute?.situation?.titleKey ?? practiceRoute?.category.titleKey;
    if (pathname !== '/learn/levels' && !pathname.startsWith('/learn/levels/')) document.title = `${key ? t[key] : t.notFoundTitle} | LINAD`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.homeIntro);
  }, [pathname, preferences.uiLanguage, t]);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      window.scrollTo(0, 0);
      document.getElementById('page-heading')?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);
  return null;
}

export function App() {
  const { t, warning } = usePreferences();
  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault();
        document.getElementById('main-content')?.focus();
      }}>{t.skip}</a>
      <Header />
      <RouteEffects />
      <main id="main-content" tabIndex={-1}>
        {warning && <p className="storage-warning container" role="status">{warning === 'invalid' ? t.invalidStorage : t.unavailableStorage}</p>}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearningPage />} />
          <Route path="/learn/levels/*" element={<Suspense fallback={<p className="container" role="status">{t.levelsTitle}…</p>}><LevelLearning /></Suspense>} />
          {(['de', 'en'] as const).flatMap(language => [
            <Route key={`${language}-situations`} path={`/learn/${language}/situations`} element={<SituationsCatalogPage language={language} />} />,
            <Route key={`${language}-levels`} path={`/learn/${language}/levels`} element={<Navigate to={`/learn/levels?language=${language}`} replace />} />,
            ...situationCategories.map(category => <Route key={`${language}-${category.id}`} path={situationCategoryPath(language, category)} element={<SituationCategoryPage language={language} category={category} />} />),
            ...practiceCategories.flatMap(category => category.situations.map(situation => <Route key={`${language}-${category.id}-${situation.id}`} path={practicePath(language, category, situation)}
              element={<SituationCategoryPage language={language} category={situationCategories.find(item => item.id === category.id)!} situationId={situation.id} />} />)),
          ])}
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/telegram" element={<TelegramPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
