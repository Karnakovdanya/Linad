import { Link } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import type { LevelsStore } from './useLevelsStore';
import { LevelHeading, LevelProgress, LevelSteps, levelRoot } from './LevelUI';
import { questionById } from './data/questions';

export function ResultPage({ store }: { store: LevelsStore }) {
  const { t } = usePreferences(); const { targetLanguage, supportLanguage } = store.state;
  const result = store.state.results[targetLanguage]; const run = [store.state.runs[targetLanguage], ...store.state.assessmentHistory].find(run => run?.id === result?.runId);
  if (!result || !run?.completed || result.runId !== run.id) return <><LevelSteps active={1} /><LevelHeading title={t.levelsResultTitle} /><p>{t.levelsPreliminary}</p><Link className="button button-primary" to={`${levelRoot}/placement`}>{t.levelsStartTest}</Link></>;
  const skillNames = { grammar: t.levelsGrammar, vocabulary: t.levelsVocabulary, reading: t.levelsReading, listening: t.levelsListening };
  return <>
    <LevelSteps active={1} /><LevelHeading title={t.levelsResultTitle} />
    <div className="level-result-grid">
      <section className="level-card level-result-summary"><h2>{t.levelsSuggested}</h2><strong className="level-result-badge">{result.level}</strong><p>{t.levelsResultCaution}</p>{result.belowA1 && <p>{t.levelsBelowA1}</p>}</section>
      <section className="level-card"><h2>{t.levelsSkills}</h2>
        <LevelProgress value={Math.round(result.correct / result.total * 100)} label={`${t.levelsOverall} · ${result.correct}/${result.total}`} />
        {(['grammar', 'vocabulary', 'reading'] as const).map(skill => {
          const value = result.skills[skill]; return value.percent === null ? <p className="level-muted" key={skill}>{skillNames[skill]}: {t.levelsNotAssessed}</p> : <LevelProgress key={skill} value={value.percent} label={`${skillNames[skill]} · ${value.correct}/${value.total}`} />;
        })}
      </section>
    </div>
    <section className="level-card"><h2>{t.levelsWeak}</h2>{result.weakTopics.length ? <ul>{result.weakTopics.map(topic => <li key={topic.en} lang={supportLanguage}>{topic[supportLanguage]}</li>)}</ul> : <p>{t.levelsBalanced}</p>}</section>
    <div className="level-actions"><Link className="button button-primary" to={`${levelRoot}/curriculum`} onClick={() => store.update(state => ({ ...state, placementChoice: { ...state.placementChoice, [targetLanguage]: 'test' } }))}>{t.levelsChoose} →</Link></div>
    <details className="level-card"><summary>{t.levelsReviewAnswers}</summary><ol className="level-answer-review">{run.responses.map(response => {
      const q = questionById.get(response.questionId)!; return <li key={q.id}><strong lang={targetLanguage}>{q.stem}</strong>{q.passage && <p lang={targetLanguage}>{q.passage}</p>}
        <p>{t.levelsYourAnswer}: <span lang={targetLanguage}>{response.answer}</span> {response.answer === q.correct ? '✓' : '✕'}</p><p>{t.levelsCorrectAnswer}: <span lang={targetLanguage}>{q.correct}</span></p><p lang={supportLanguage}>{q.explanation[supportLanguage]}</p>
      </li>;
    })}</ol></details>
  </>;
}
