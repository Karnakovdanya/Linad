import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { assessmentLength, assessmentResult, commitResponse, nextQuestion } from './assessment';
import { questionById } from './data/questions';
import type { AssessmentRun } from './model';
import type { LevelsStore } from './useLevelsStore';
import { ChoiceQuestion, LevelHeading, LevelProgress, LevelSteps, levelRoot } from './LevelUI';

export function AssessmentPage({ store }: { store: LevelsStore }) {
  const { t } = usePreferences(); const navigate = useNavigate();
  const { targetLanguage, supportLanguage } = store.state; const run = store.state.runs[targetLanguage];
  const [index, setIndex] = useState(() => Math.min(run?.responses.length ?? 0, assessmentLength - 1));
  const question = run ? (questionById.get(run.questionIds[index] ?? '') ?? nextQuestion(run)) : undefined;
  if (!run) return <><LevelSteps active={1} /><LevelHeading title={t.levelsDiagnosticTitle} /><Link className="button button-primary" to={`${levelRoot}/placement`}>{t.levelsStartTest}</Link></>;
  if (run.completed) return <Navigate to={`${levelRoot}/result`} replace />;
  if (!question) return <Navigate to={`${levelRoot}/placement`} replace />;
  const selected = run.responses[index]?.questionId === question.id ? run.responses[index].answer : undefined;
  function changeRun(change: (current: AssessmentRun) => AssessmentRun) {
    store.update(state => {
      const current = state.runs[targetLanguage];
      return current?.id === run!.id ? { ...state, runs: { ...state.runs, [targetLanguage]: change(current) } } : state;
    });
  }
  function answer(value: string) {
    changeRun(current => commitResponse({ ...current, questionIds: [...current.questionIds.slice(0, index), question!.id, ...current.questionIds.slice(index + 1)] }, index, question!.id, value));
  }
  function finish() {
    if (!selected) return;
    if (index === assessmentLength - 1) {
      const completed = { ...run!, completed: true }; const result = assessmentResult(completed);
      if (completed.responses.length !== assessmentLength || result.total !== assessmentLength) return;
      store.update(state => ({ ...state, runs: { ...state.runs, [targetLanguage]: completed }, results: { ...state.results, [targetLanguage]: result } }));
      navigate(`${levelRoot}/result`);
    } else setIndex(index + 1);
  }
  return <>
    <LevelSteps active={1} /><LevelHeading title={t.levelsDiagnosticTitle} />
    <section className="level-card level-test-card">
      <div className="level-test-meta"><strong>{t.levelsQuestion} {index + 1} {t.levelsOf} {assessmentLength}</strong></div>
      <LevelProgress value={Math.round(index / assessmentLength * 100)} label={t.levelsProgress} />
      {question.skill === 'reading' && <p className="level-reading-passage" lang={targetLanguage}>{question.passage}</p>}
      <ChoiceQuestion question={question} support={supportLanguage} seed={run.seed} value={selected} onChange={answer} />
      <p className="level-muted">{t.levelsNoFeedback}</p>
      <div className="level-actions"><button type="button" className="button button-secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>← {t.levelsBack}</button>
        <button type="button" className="button button-primary" disabled={!selected} onClick={finish}>{index === assessmentLength - 1 ? t.levelsFinish : t.levelsNext} →</button>
      </div>
    </section>
  </>;
}
