import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { assets } from '../../../config/assets';
import { NotFoundPage } from '../../SectionPages';
import { curricula } from './data/curriculum';
import { lessonCatalog, lessonKey, lessonPercent, modulePercent } from './data/lessons';
import type { CefrLevel } from './model';
import { cefrLevels } from './model';
import type { LevelsStore } from './useLevelsStore';
import { LevelBreadcrumbs, LevelHeading, LevelProgress, LevelSteps, levelRoot } from './LevelUI';
import { lessonPath, modulesPath } from './navigation';

export function CurriculumPage({ store }: { store: LevelsStore }) {
  const { t } = usePreferences(); const navigate = useNavigate(); const language = store.state.targetLanguage;
  const titles = { A1: t.levelsA1, A2: t.levelsA2, B1: t.levelsB1, B2: t.levelsB2, C1: t.levelsC1 };
  const result = store.state.placementChoice[language] === 'test' ? store.state.results[language] : undefined;
  function choose(level: CefrLevel) {
    store.update(state => ({ ...state, selectedLevels: { ...state.selectedLevels, [language]: level }, setupComplete: { ...state.setupComplete, [language]: true } }));
    navigate(modulesPath(level));
  }
  return <>
    <LevelSteps active={2} />
    <LevelHeading title={t.levelsSelectTitle}><p>{t.levelsAllOpen}</p></LevelHeading>
    {result && <aside className="level-card level-recommendation"><div><h2>{t.levelsSuggested}: {result.level}</h2><p>{t.levelsResultCaution}</p></div><Link className="text-link" to={`${levelRoot}/result`}>{t.levelsResultTitle} →</Link></aside>}
    <nav className="level-band-grid" aria-label={t.levelsChoose}>{cefrLevels.map(level => <button type="button" key={level} className={result?.level === level ? 'is-recommended' : undefined} onClick={() => choose(level)}>
      <strong>{level}</strong><span>{titles[level]}</span>{result?.level === level && <small>{t.levelsRecommended}</small>}
    </button>)}</nav>
    <Link className="text-link" to={`${levelRoot}/placement`}>← {t.levelsPlacement}</Link>
  </>;
}

export function LegacyLevelPage() {
  const { level } = useParams();
  return cefrLevels.includes(level as CefrLevel) ? <Navigate to={modulesPath(level!)} replace /> : <NotFoundPage />;
}

export function ModulesPage({ store }: { store: LevelsStore }) {
  const { t, preferences } = usePreferences(); const { level: param } = useParams(); const language = store.state.targetLanguage;
  const level = param as CefrLevel; const name = language === 'de' ? 'Deutsch' : 'English';
  const modules = curricula[language].filter(module => module.level === level); const update = store.update;
  useEffect(() => {
    if (!cefrLevels.includes(level)) return;
    update(state => state.selectedLevels[language] === level && state.setupComplete[language] ? state : { ...state, selectedLevels: { ...state.selectedLevels, [language]: level }, setupComplete: { ...state.setupComplete, [language]: true } });
  }, [level, language, update]);
  if (!modules.length) return <NotFoundPage />;
  const descriptions = { A1: t.levelsDescriptionA1, A2: t.levelsDescriptionA2, B1: t.levelsDescriptionB1, B2: t.levelsDescriptionB2, C1: t.levelsDescriptionC1 };
  const lessonIds = modules.flatMap(module => module.lessonIds);
  const completed = lessonIds.filter(id => store.state.lessons[lessonKey(language, id)]?.attempts.length).length;
  const percent = lessonIds.length ? Math.round(completed / lessonIds.length * 100) : 0;
  const last = store.state.lastLesson[language];
  return <>
    <LevelBreadcrumbs items={[{ label: t.learnTitle, to: '/learn' }, { label: name, to: `${levelRoot}/languages` }, { label: level }]} />
    <section className="level-modules-hero">
      <img src={assets.learning.levelsModules} alt={t.levelsModulesPhotoAlt} />
      <div className="level-modules-hero-copy"><LevelHeading title={`${level} · ${name}`}><p>{descriptions[level]}</p></LevelHeading>
        <Link className="button button-secondary" to={`${levelRoot}/curriculum`}>↔ {t.levelsChangeLevel}</Link>
      </div>
      <aside className="level-card level-level-progress"><h2>{t.levelsLevelProgress}</h2><p className="level-muted">{lessonIds.length ? `${completed} / ${lessonIds.length} ${t.levelsPublishedLessons}` : t.levelsNoPublishedLessons}</p><LevelProgress value={percent} label={t.levelsCompleted} /></aside>
    </section>
    <section className="level-curriculum"><h2>{t.levelsModulesOf} {level}</h2><div className="level-module-list">{modules.map((module, index) => {
      const value = modulePercent(language, module.lessonIds, store.state.lessons);
      const count = module.lessonIds.filter(id => store.state.lessons[lessonKey(language, id)]?.attempts.length).length;
      const active = last?.level === level && last.moduleId === module.id;
      const destination = active && module.lessonIds.includes(last.lessonId) ? lessonPath(level, module.id, last.lessonId) : `${modulesPath(level)}/${module.id}`;
      return <article className={`level-card level-module-row${active ? ' is-active' : ''}${value === 100 ? ' is-complete' : ''}`} key={module.id}>
        <span className="level-module-number">{index + 1}</span><div><h3>{module.title[preferences.uiLanguage]}</h3><p>{module.description[preferences.uiLanguage]}</p></div>
        <div className="level-module-progress"><LevelProgress value={value} label={module.lessonIds.length ? `${t.levelsCompletedLessons}: ${count} / ${module.lessonIds.length}` : t.levelsPreparingLessons} /></div>
        {value === 100 && <span className="level-completed-mark" aria-label={t.levelsCompleted}>✓</span>}
        <Link className={`button ${active ? 'button-primary' : 'button-secondary'}`} to={destination} aria-label={`${active ? t.levelsContinue : t.levelsOpen}: ${module.title[preferences.uiLanguage]}`}>{active ? t.levelsContinue : t.levelsOpen} →</Link>
      </article>;
    })}</div></section>
  </>;
}

export function ModulePage({ store }: { store: LevelsStore }) {
  const { t, preferences } = usePreferences(); const { level, moduleId } = useParams(); const language = store.state.targetLanguage;
  const modules = curricula[language].filter(module => module.level === level); const module = modules.find(module => module.id === moduleId);
  if (!module) return <NotFoundPage />;
  const moduleNumber = modules.indexOf(module) + 1;
  return <>
    <LevelBreadcrumbs items={[{ label: t.learnTitle, to: '/learn' }, { label: language === 'de' ? 'Deutsch' : 'English', to: `${levelRoot}/languages` }, { label: level!, to: modulesPath(level!) }, { label: `${t.levelsModule} ${moduleNumber}` }]} />
    <section className="level-card"><LevelHeading title={`${level} · ${module.title[preferences.uiLanguage]}`} /><p>{module.description[preferences.uiLanguage]}</p><LevelProgress value={modulePercent(language, module.lessonIds, store.state.lessons)} label={t.levelsProgress} /></section>
    {module.lessonIds.length ? module.lessonIds.map((id, index) => {
      const lesson = lessonCatalog[language][id]!; const progress = store.state.lessons[lessonKey(language, id)];
      return <section className="level-card level-lesson-row" key={id}><span className="level-round-number">{index + 1}</span><div><span className="level-muted">{t.levelsLesson} {index + 1}</span><h2>{lesson.title[preferences.uiLanguage]}</h2><p>{lesson.description[preferences.uiLanguage]}</p><small>{progress?.attempts.length ? t.levelsCompleted : progress?.visited.length ? t.levelsInProgress : t.levelsNotStarted}</small><LevelProgress value={lessonPercent(progress)} label={t.levelsReadProgress} /></div>
        <Link className="button button-primary" to={lessonPath(level!, module.id, id)}>{progress?.visited.length ? t.levelsContinue : t.levelsOpen} →</Link>
      </section>;
    }) : <section className="level-card"><h2>{t.levelsPlanned}</h2><p>{t.levelsPlannedHint}</p><Link className="text-link" to={`${levelRoot}/modules/A1/introductions`}>{t.levelsSample} A1 →</Link></section>}
    <Link className="text-link" to={modulesPath(level!)}>← {t.levelsModulesOf} {level}</Link>
  </>;
}

