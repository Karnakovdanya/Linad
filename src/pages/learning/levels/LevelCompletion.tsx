import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { cefrLevels, type CefrLevel } from './model';
import { completionKey, levelStatus, nextLevel } from './progress';
import { courseCopy } from './course-copy';
import { LevelHeading, levelRoot } from './LevelUI';
import { modulesPath } from './navigation';
import type { LevelsStore } from './useLevelsStore';

export function CompletionWatcher({ store }: { store: LevelsStore }) {
  const navigate = useNavigate(); const { pathname } = useLocation(); const language = store.state.targetLanguage;
  const level = store.state.selectedLevels[language]; const completed = levelStatus(store.state, language, level).completed;
  const acknowledged = store.state.acknowledgedLevels.includes(completionKey(language, level));
  useEffect(() => {
    if (completed && !acknowledged && (pathname.includes(`/modules/${level}`) || pathname.includes(`/lessons/${level}/`))) navigate(`${levelRoot}/complete/${level}`, { replace: true });
  }, [completed, acknowledged, level, navigate, pathname]);
  return null;
}
export function LevelCompletion({ store }: { store: LevelsStore }) {
  const { level: parameter } = useParams(); const level = parameter as CefrLevel; const navigate = useNavigate();
  const language = store.state.targetLanguage; const c = courseCopy(store.state.supportLanguage); const update = store.update;
  const valid = cefrLevels.includes(level) && levelStatus(store.state, language, level).completed; const destination = nextLevel(level);
  useEffect(() => {
    if (!valid || !destination) return;
    const timer = window.setTimeout(() => {
      update(state => ({ ...state, acknowledgedLevels: [...new Set([...state.acknowledgedLevels, completionKey(language, level)])], selectedLevels: { ...state.selectedLevels, [language]: destination } }));
      navigate(modulesPath(destination), { replace: true });
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [valid, destination, update, language, level, navigate]);
  if (!valid) return <Navigate to={modulesPath('A1')} replace />;
  return <section className="level-card level-program-complete"><LevelHeading title={destination ? `${level} · ${c.congratulations}` : c.program} /><p>{destination ? `${c.next} ${destination}` : 'C1 · 8 / 8'}</p><button className="button button-secondary" type="button" onClick={() => {
    update(state => ({ ...state, acknowledgedLevels: [...new Set([...state.acknowledgedLevels, completionKey(language, level)])] })); navigate(modulesPath(level), { replace: true });
  }}>{c.stay}</button></section>;
}
