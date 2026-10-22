import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { Icon } from '../../../components/Icon';
import { NotFoundPage } from '../../SectionPages';
import { curricula } from './data/curriculum';
import { lessonCatalog, lessonKey } from './data/lessons';
import type { Lesson } from './model';
import type { LevelsStore } from './useLevelsStore';
import { LevelBreadcrumbs, LevelProgress, Translated, levelRoot } from './LevelUI';
import { courseCopy } from './course-copy';
import { lessonStatus, miniTestTasks, practiceTasks, readingTasks } from './progress';
import { gradeTasks, isAnswerShape, type Task } from './tasks';
import { AnswerReview, TaskView } from './TaskView';
import { lessonPath, modulesPath } from './navigation';
import { useLevelSpeech } from './useLevelSpeech';

export function LessonPage({ store }: { store: LevelsStore }) {
  const { level, moduleId, lessonId } = useParams();
  const lesson = lessonCatalog[store.state.targetLanguage][lessonId ?? ''];
  if (!lesson || lesson.level !== level || lesson.moduleId !== moduleId) return <NotFoundPage />;
  return <LessonContent key={`${lesson.language}:${lesson.id}`} store={store} lesson={lesson} />;
}

function LessonContent({ store, lesson }: { store: LevelsStore; lesson: Lesson }) {
  const { t, preferences } = usePreferences(); const { targetLanguage, supportLanguage } = store.state;
  const key = lessonKey(targetLanguage, lesson.id); const progress = store.state.lessons[key];
  const c = courseCopy(supportLanguage); const status = lessonStatus(lesson, progress); const quiz = miniTestTasks(lesson);
  const lastAttempt = progress?.attempts.at(-1); const last = store.state.lastLesson[targetLanguage];
  const [step, setStep] = useState(last?.lessonId === lesson.id ? last.section : 0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => lastAttempt?.answers ?? {});
  const [showResult, setShowResult] = useState(Boolean(lastAttempt));
  const [practice, setPractice] = useState<Record<string, string>>(() => Object.fromEntries((progress?.practice ?? []).map(entry => [entry.taskId, entry.answer])));
  const [checked, setChecked] = useState<string[]>(() => progress?.practice?.map(entry => entry.taskId) ?? []);
  const [quizSeed, setQuizSeed] = useState(0);
  const [openedAt] = useState(() => new Date().toISOString());
  const speech = useLevelSpeech(targetLanguage); const update = store.update;
  useEffect(() => {
    update(state => {
      const current = state.lessons[key] ?? { visited: [], attempts: [] };
      const previous = state.lastLesson[targetLanguage];
      if (current.visited.includes(step) && previous?.lessonId === lesson.id && previous.section === step && state.setupComplete[targetLanguage] && (state.activity[targetLanguage]?.at ?? '') >= openedAt) return state;
      return { ...state, setupComplete: { ...state.setupComplete, [targetLanguage]: true },
        selectedLevels: { ...state.selectedLevels, [targetLanguage]: lesson.level },
        lastLesson: { ...state.lastLesson, [targetLanguage]: { level: lesson.level, moduleId: lesson.moduleId, lessonId: lesson.id, section: step } },
        activity: { ...state.activity, [targetLanguage]: { at: new Date().toISOString(), kind: 'lesson', lessonId: lesson.id } },
        lessons: { ...state.lessons, [key]: { ...current, visited: [...new Set([...current.visited, step])] } } };
    });
  }, [key, step, update, targetLanguage, lesson.id, lesson.level, lesson.moduleId, openedAt]);
  const stopSpeech = speech.stop; useEffect(() => () => stopSpeech(), [step, stopSpeech]);
  const steps = [t.levelsTheory, t.levelsWords, t.levelsExamples, t.levelsDialogues, t.levelsReading, t.levelsPractice, t.levelsQuiz];
  const icons = ['book', 'file', 'cards', 'chat', 'book', 'graduation', 'check'] as const;
  const modules = curricula[targetLanguage].filter(module => module.level === lesson.level);
  const module = modules.find(module => module.id === lesson.moduleId)!;
  const moduleNumber = modules.indexOf(module) + 1; const lessonNumber = module.lessonIds.indexOf(lesson.id) + 1;
  const available = modules.flatMap(module => module.lessonIds.map(id => lessonCatalog[targetLanguage][id]!));
  const position = available.findIndex(item => item.id === lesson.id); const previous = available[position - 1]; const next = available[position + 1];
  function practiceQuestion(question: Task) {
    const wasChecked = checked.includes(question.id);
    return <div className="level-exercise" key={question.id}>
      <TaskView task={question} support={supportLanguage} value={practice[question.id]} onChange={answer => { setPractice({ ...practice, [question.id]: answer }); setChecked(checked.filter(id => id !== question.id)); }} feedback={wasChecked} />
      <button type="button" className="button button-secondary" disabled={!isAnswerShape(question, practice[question.id])} onClick={() => {
        setChecked([...new Set([...checked, question.id])]);
        update(state => {
          const current = state.lessons[key] ?? { visited: [], attempts: [] }; const at = new Date().toISOString();
          return { ...state, activity: { ...state.activity, [targetLanguage]: { at, kind: 'practice', lessonId: lesson.id } }, lessons: { ...state.lessons, [key]: { ...current, practice: [...(current.practice ?? []), { taskId: question.id, answer: practice[question.id]!, checkedAt: at }] } } };
        });
      }}>{c.check}</button>
    </div>;
  }
  function submit() {
    if (!quiz.every(q => isAnswerShape(q, answers[q.id]))) return;
    const result = { ...gradeTasks(quiz, answers), answers: { ...answers }, completedAt: new Date().toISOString() };
    update(state => {
      const current = state.lessons[key] ?? { visited: [], attempts: [] };
      return { ...state, activity: { ...state.activity, [targetLanguage]: { at: result.completedAt, kind: 'mini-test', lessonId: lesson.id } }, lessons: { ...state.lessons, [key]: { ...current, visited: [...new Set([...current.visited, 6])], attempts: [...current.attempts, result] } } };
    });
    setShowResult(true);
  }
  function pronounce(value: string) { if (speech.busy) speech.stop(); else void speech.say(value); }
  const graded = lastAttempt ? gradeTasks(quiz, lastAttempt.answers) : undefined;
  return <>
    <LevelBreadcrumbs items={[{ label: t.learnTitle, to: '/learn' }, { label: targetLanguage === 'de' ? 'Deutsch' : 'English', to: `${levelRoot}/languages` }, { label: lesson.level, to: modulesPath(lesson.level) }, { label: `${t.levelsModule} ${moduleNumber}`, to: `${modulesPath(lesson.level)}/${module.id}` }, { label: `${t.levelsLesson} ${lessonNumber}` }]} />
    <header className="level-lesson-heading"><div><p className="level-muted">{lesson.level} · {t.levelsModule} {moduleNumber} · {module.title[preferences.uiLanguage]}</p><h1 id="page-heading" tabIndex={-1}>{t.levelsLesson} {lessonNumber}. {lesson.title[preferences.uiLanguage]}</h1></div>
      <div className="level-neighbour-links">{previous ? <Link className="button button-secondary" rel="prev" to={lessonPath(previous.level, previous.moduleId, previous.id)}>← {t.levelsPreviousLesson}</Link> : <button type="button" className="button button-secondary" disabled>← {t.levelsPreviousLesson}</button>}{next ? <Link className="button button-secondary" rel="next" to={lessonPath(next.level, next.moduleId, next.id)}>{t.levelsNextLesson} →</Link> : <button type="button" className="button button-secondary" disabled>{t.levelsNextLesson} →</button>}</div>
    </header>
    <LevelProgress value={status.percent} label={c.progress} />
    {lesson.contentStatus === 'sample' && <p className="level-completion-note" lang={supportLanguage}>{c.savedSample}</p>}
    <p className="level-completion-note" lang={supportLanguage}>{status.completed ? `✓ ${c.lessonDone}` : c.completion} <span>{c.required}: {status.correct}/{status.required}. {status.submitted ? c.miniDone : c.miniMissing}.</span></p>
    <div className="level-lesson-layout">
      <nav className="level-lesson-tabs" role="tablist" aria-label={t.levelsLesson} aria-orientation="vertical">{steps.map((name, index) => <button type="button" key={name} role="tab" id={`level-section-${index}`} aria-controls="level-lesson-panel" aria-selected={step === index} tabIndex={step === index ? 0 : -1} aria-current={step === index ? 'step' : undefined} onClick={() => setStep(index)} onKeyDown={event => {
        const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']; if (!keys.includes(event.key)) return;
        event.preventDefault(); const destination = event.key === 'Home' ? 0 : event.key === 'End' ? 6 : (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : 6)) % 7;
        setStep(destination); event.currentTarget.parentElement?.querySelectorAll('button')[destination]?.focus();
      }}><Icon name={icons[index]!} /><span>{name}</span></button>)}</nav>
      <section className="level-card level-lesson-content" id="level-lesson-panel" role="tabpanel" tabIndex={0} aria-labelledby={`level-section-${step}`}>
        <h2>{steps[step]}</h2>
        {step === 0 && <>
          {lesson.theory.map((item, index) => <article className="level-theory" key={item.heading.en}><h3 lang={supportLanguage}>{item.heading[supportLanguage]}</h3><Translated value={item.body} language={supportLanguage} /><p className="level-example" lang={targetLanguage}>{item.example}</p>{lesson.theoryTranslations?.[index] && <Translated value={lesson.theoryTranslations[index]!} language={supportLanguage} />}</article>)}
          {lesson.examples[0] && <article className="level-featured-example"><h3>{t.levelsExample}</h3><div><p lang={targetLanguage}>{lesson.examples[0].sentence}</p><button type="button" className="button button-secondary" onClick={() => pronounce(lesson.examples[0]!.sentence)} aria-label={t.levelsPronounce}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></svg></button></div><Translated value={lesson.examples[0].translation} language={supportLanguage} /></article>}
          {lesson.forms && <div className="level-grammar-table"><h3>{t.levelsForms}</h3><table><thead><tr>{lesson.forms.headings.map(heading => <th key={heading.en} scope="col">{heading[supportLanguage]}</th>)}</tr></thead><tbody>{lesson.forms.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={index} lang={targetLanguage}>{cell}</td>)}</tr>)}</tbody></table></div>}
          {!!lesson.important?.length && <aside className="level-important"><h3>{t.levelsImportant}</h3>{lesson.important.map(item => <Translated key={item.en} value={item} language={supportLanguage} />)}</aside>}
        </>}
        {step === 1 && <dl className="level-vocabulary">{lesson.vocabulary.map(entry => <div key={entry.word}><dt lang={targetLanguage}>{entry.word}</dt><dd lang={supportLanguage}>{entry.translation[supportLanguage]}{entry.grammar && <small className="level-word-grammar">{entry.grammar[supportLanguage]}</small>}{entry.example && <p lang={targetLanguage}>{entry.example}</p>}{entry.exampleTranslation && <Translated value={entry.exampleTranslation} language={supportLanguage} as="span" />}</dd><dd><button type="button" className="button button-secondary" onClick={() => pronounce(entry.word)}>{speech.busy ? t.levelsStop : t.levelsListen}</button><SaveWordButton lesson={lesson} entry={entry} /></dd></div>)}</dl>}
        {step === 2 && lesson.examples.map(entry => <article className="level-example-pair" key={entry.sentence}><p lang={targetLanguage}>{entry.sentence}</p><Translated value={entry.translation} language={supportLanguage} /><button type="button" className="text-link" onClick={() => pronounce(entry.sentence)}>{t.levelsPronounce}</button></article>)}
        {step === 3 && (lesson.dialogues?.length ? lesson.dialogues.map(dialogue => <article className="level-dialogue" key={dialogue.title.en}><h3>{dialogue.title[supportLanguage]}</h3>{dialogue.lines.map((line, index) => <div key={index}><strong lang={supportLanguage}>{line.speaker[supportLanguage]}</strong><p lang={targetLanguage}>{line.sentence}</p><Translated value={line.translation} language={supportLanguage} /><button type="button" className="text-link" onClick={() => pronounce(line.sentence)}>{t.levelsPronounce}</button></div>)}</article>) : <p>{t.levelsPlanned}</p>)}
        {step === 4 && <><p className="level-reading-passage" lang={targetLanguage}>{lesson.reading.passage}</p><details><summary>{c.readTranslation}</summary><Translated value={lesson.reading.translation} language={supportLanguage} /></details>{readingTasks(lesson).map(practiceQuestion)}</>}
        {step === 5 && practiceTasks(lesson).map(practiceQuestion)}
        {step === 6 && (showResult && graded && lastAttempt ? <>
          <h3>{c.miniResult}</h3><strong className="level-result-score">{graded.score}/{graded.total} · {Math.round(graded.score / graded.total * 100)}%</strong><p lang={supportLanguage}>{status.completed ? c.lessonDone : c.lessonPending}</p>
          <AnswerReview tasks={quiz} answers={lastAttempt.answers} support={supportLanguage} />
          <details><summary>{c.history} ({progress?.attempts.length})</summary><ol>{progress?.attempts.map((attempt, index) => <li key={index}>{index + 1}. {attempt.completedAt.slice(0, 19).replace('T', ' ')} UTC · {attempt.score}/{attempt.total} · {Math.round(attempt.score / attempt.total * 100)}%</li>)}</ol></details>
          <button type="button" className="button button-secondary" onClick={() => { setAnswers({}); setShowResult(false); setQuizSeed(quizSeed + 1); }}>{c.retry}</button>
          <Link className="button button-primary" to={`${modulesPath(lesson.level)}/${module.id}`}>{c.moduleLink}</Link>
        </> : <><div className="level-exercise-list">{quiz.map(question => <TaskView key={question.id} task={question} support={supportLanguage} value={answers[question.id]} seed={quizSeed} onChange={answer => setAnswers({ ...answers, [question.id]: answer })} />)}</div><button type="button" className="button button-primary" disabled={!quiz.every(q => isAnswerShape(q, answers[q.id]))} onClick={submit}>{t.levelsSubmitQuiz}</button></>)}
        <p role="status">{speech.notice}</p>
        <div className="level-actions"><button type="button" className="button button-secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>← {t.levelsBack}</button>{step < 6 && <button type="button" className="button button-primary" onClick={() => setStep(step + 1)}>{t.levelsNext} →</button>}</div>
      </section>
    </div>
  </>;
}

import { SaveWordButton } from '../../../account/actions';
