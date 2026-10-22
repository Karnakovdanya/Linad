import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { Icon } from '../../../components/Icon';
import type { LevelsStore } from './useLevelsStore';
import { LevelHeading, LevelSteps, levelRoot } from './LevelUI';
import { assessmentAccess, startPlacement } from './assessment-access';

export function PlacementPage({ store }: { store: LevelsStore }) {
  const { t } = usePreferences(); const navigate = useNavigate();
  const run = store.state.runs[store.state.targetLanguage];
  const canStart = assessmentAccess(Boolean(store.state.results[store.state.targetLanguage]), null);
  function start() {
    if (!canStart) return;
    store.update(state => startPlacement(state, state.targetLanguage));
    navigate(`${levelRoot}/test`);
  }
  return <>
    <LevelSteps active={1} /><LevelHeading title={t.levelsPlacementTitle} />
    <div className="level-placement-grid">
      <section className="level-card level-placement-card"><span className="level-large-icon"><Icon name="file" /></span><h2>{t.levelsTakeTest}</h2>
        <ul><li>{t.levelsTestDetails}</li><li>{t.levelsTestScope}</li><li>{t.levelsPreliminary}</li></ul>
        {run && !run.completed && <Link className="button button-primary" to={`${levelRoot}/test`}>{t.levelsResume}</Link>}
        <button type="button" disabled={!canStart} className={`button ${run && !run.completed ? 'button-secondary' : 'button-primary'}`} onClick={start}>{run ? t.levelsRestart : t.levelsStartTest}</button>
      </section>
      <section className="level-card level-placement-card"><span className="level-large-icon"><Icon name="graduation" /></span><h2>{t.levelsKnowLevel}</h2><p>{t.levelsSkipHint}</p>
        <Link className="button button-primary" to={`${levelRoot}/curriculum`} onClick={() => store.update(state => ({ ...state, placementChoice: { ...state.placementChoice, [state.targetLanguage]: 'manual' } }))}>{t.levelsChoose}</Link>
      </section>
    </div>
  </>;
}
