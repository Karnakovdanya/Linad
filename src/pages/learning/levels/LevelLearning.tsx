import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { NotFoundPage } from '../../SectionPages';
import { LanguageSetup } from './LanguageSetup';
import { PlacementPage } from './PlacementPage';
import { AssessmentPage } from './AssessmentPage';
import { ResultPage } from './ResultPage';
import { CurriculumPage, ModulePage, ModulesPage, LegacyLevelPage } from './CurriculumPage';
import { LessonPage } from './LessonPage';
import { ModuleExamPage } from './ModuleExamPage';
import { CompletionWatcher, LevelCompletion } from './LevelCompletion';
import { useLevelsStore } from './useLevelsStore';
import { levelRoot } from './LevelUI';
import { resumePath } from './navigation';
import '../../../styles/levels.css';
import { useAccount } from '../../../account/auth-context';
import { accountCopy } from '../../../account/copy';
import { CourseTrial } from '../../../account/CourseTrial';

export default function LevelLearning() {
  const { t, preferences } = usePreferences(); const store = useLevelsStore(); const { pathname, search } = useLocation();
  const { user, syncStatus } = useAccount(); const c = accountCopy(preferences.uiLanguage);
  useEffect(() => {
    const heading = document.getElementById('page-heading');
    document.title = `${heading?.textContent ?? t.levelsTitle} | LINAD`;
    heading?.focus({ preventScroll: true });
  }, [pathname, t, store.state.targetLanguage]);
  return <div className="container level-learning">
    <CompletionWatcher store={store} />
    <div className="level-topbar"><Link className="text-link" to="/learn">← {t.learningBack}</Link>{pathname !== levelRoot && !pathname.endsWith('/languages') && <Link className="text-link" to={`${levelRoot}/languages`}>{t.levelsChangePair}</Link>}</div>
    <CourseTrial store={store}><Routes>
      <Route index element={store.state.setupComplete[store.state.targetLanguage] && !search ? <Navigate to={resumePath(store.state)} replace /> : <LanguageSetup store={store} />} />
      <Route path="languages" element={<LanguageSetup store={store} />} />
      <Route path="placement" element={<PlacementPage store={store} />} />
      <Route path="test" element={<AssessmentPage store={store} />} />
      <Route path="result" element={<ResultPage store={store} />} />
      <Route path="curriculum" element={<CurriculumPage store={store} />} />
      <Route path="curriculum/:level" element={<LegacyLevelPage />} />
      <Route path="modules/:level" element={<ModulesPage store={store} />} />
      <Route path="modules/:level/:moduleId" element={<ModulePage store={store} />} />
      <Route path="modules/:level/:moduleId/final" element={<ModuleExamPage store={store} />} />
      <Route path="complete/:level" element={<LevelCompletion store={store} />} />
      <Route path="lessons/:level/:moduleId/:lessonId" element={<LessonPage key={store.state.targetLanguage} store={store} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes></CourseTrial>
    {store.warning && <p role="alert">{store.warning === 'invalid' ? t.levelsStorageInvalid : t.levelsStorageError}</p>}
    <p className="level-local-note">{user ? syncStatus === 'synced' ? c.cloud : syncStatus === 'error' ? c.syncError : c.syncing : t.levelsLocal}</p>
  </div>;
}
