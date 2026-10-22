import { Link, useParams } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { NotFoundPage } from '../../SectionPages';
import { curricula } from './data/curriculum';
import { findExam } from './data/module-exams';
import { lessonCatalog } from './data/lessons';
import { moduleStatus } from './progress';
import { examTasks, gradeTasks, isAnswerShape, checkAnswer, passedExam } from './tasks';
import type { CefrLevel } from './model';
import { courseCopy } from './course-copy';
import { AnswerReview, TaskView } from './TaskView';
import { LevelBreadcrumbs, LevelHeading, LevelProgress, levelRoot } from './LevelUI';
import { lessonPath, modulesPath } from './navigation';
import type { LevelsStore } from './useLevelsStore';

export function ModuleExamPage({ store }: { store: LevelsStore }) {
  const { level, moduleId } = useParams(); const { targetLanguage: language, supportLanguage: support } = store.state;
  const { t } = usePreferences(); const c = courseCopy(support);
  const exam = findExam(language, level ?? '', moduleId ?? ''); const module = curricula[language].find(item => item.level === level && item.id === moduleId);
  if (!exam || !module) return <NotFoundPage />;
  const key = `${language}:${level}:${moduleId}`; const run = store.state.examRuns[key];
  const status = moduleStatus(store.state, language, level as CefrLevel, moduleId!); const last = status.last;
  const questions = run ? examTasks(exam, run.seed) : last ? exam.bank.filter(task => last.taskIds.includes(task.id)).sort((a, b) => last.taskIds.indexOf(a.id) - last.taskIds.indexOf(b.id)) : [];
  const weakLessons = last ? [...new Set(questions.filter(task => !checkAnswer(task, last.answers[task.id])).map(task => task.lessonId))] : [];
  function start() {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0]!;
    store.update(state => ({ ...state, examRuns: { ...state.examRuns, [key]: { seed, answers: {}, startedAt: new Date().toISOString() } } }));
  }
  function submit() {
    if (!run || !questions.every(task => isAnswerShape(task, run.answers[task.id]))) return;
    const at = new Date().toISOString(); const result = { id: crypto.randomUUID(), seed: run.seed, taskIds: questions.map(task => task.id), answers: { ...run.answers }, ...gradeTasks(questions, run.answers), completedAt: at };
    store.update(state => {
      const runs = { ...state.examRuns }; delete runs[key];
      return { ...state, examRuns: runs, activity: { ...state.activity, [language]: { at, kind: 'module-test' } }, moduleAttempts: { ...state.moduleAttempts, [key]: [...(state.moduleAttempts[key] ?? []), result] } };
    });
  }
  return <>
    <LevelBreadcrumbs items={[{ label: t.learnTitle, to: '/learn' }, { label: language === 'de' ? 'Deutsch' : 'English', to: `${levelRoot}/languages` }, { label: level!, to: modulesPath(level!) }, { label: module.title[support], to: `${modulesPath(level!)}/${moduleId}` }, { label: c.final }]} />
    <section className="level-card level-exam-page" lang={support}>
      <LevelHeading title={c.final}><p>{module.title[support]}</p><p>{c.finalHint}</p></LevelHeading>
      <p>{c.all}</p>
      {run ? <>
        <LevelProgress value={Math.round(questions.filter(task => isAnswerShape(task, run.answers[task.id])).length / questions.length * 100)} label={c.progress} />
        <div className="level-exercise-list">{questions.map((task, index) => <div key={task.id}><h2>{index + 1} / {questions.length}</h2><TaskView task={task} support={support} value={run.answers[task.id]} seed={run.seed} onChange={answer => store.update(state => ({ ...state, examRuns: { ...state.examRuns, [key]: { ...run, answers: { ...run.answers, [task.id]: answer } } } }))} /></div>)}</div>
        <button type="button" className="button button-primary" disabled={!questions.every(task => isAnswerShape(task, run.answers[task.id]))} onClick={submit}>{c.submit}</button>
      </> : <>
        {last && <section className="level-exam-result" role="status"><h2>{passedExam(last.score, last.total) ? `✓ ${c.passed}` : status.passed ? c.retakeFailed : c.failed}</h2><strong className="level-result-score">{last.score}/{last.total} · {Math.round(last.score / last.total * 100)}%</strong><p>{status.completed ? c.moduleDone : status.passed ? c.lessonsPending : c.failed}</p><p>{c.best}: {status.best!.score}/{status.best!.total} · {Math.round(status.best!.score / status.best!.total * 100)}%</p></section>}
        <button type="button" className="button button-primary" onClick={start}>{last ? c.retry : c.start}</button>
        {last && <><h2>{c.review}</h2><ul>{weakLessons.map(id => <li key={id}><Link to={lessonPath(level!, moduleId!, id)}>{lessonCatalog[language][id]?.title[support]}</Link></li>)}</ul><AnswerReview tasks={questions} answers={last.answers} support={support} /></>}
      </>}
      {!!status.attempts.length && <details><summary>{c.history} ({status.attempts.length})</summary><ol>{status.attempts.map((attempt, index) => <li key={attempt.id}>{index + 1}. {attempt.completedAt.slice(0, 19).replace('T', ' ')} UTC · {attempt.score}/{attempt.total} · {Math.round(attempt.score / attempt.total * 100)}% · {passedExam(attempt.score, attempt.total) ? c.passed : c.failed}</li>)}</ol></details>}
      <Link className="text-link" to={`${modulesPath(level!)}/${moduleId}`}>← {c.moduleLink}</Link>
    </section>
  </>;
}
