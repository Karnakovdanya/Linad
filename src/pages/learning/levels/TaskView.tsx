import type { UiLanguage } from '../../../domain/types';
import { courseCopy } from './course-copy';
import { checkAnswer, correctAnswer, shuffled, type Task } from './tasks';

function parsed(value: string | undefined) { try { return JSON.parse(value ?? 'null'); } catch { return null; } }
function taskSeed(id: string) { return [...id].reduce((seed, c) => Math.imul(seed, 31) + c.charCodeAt(0) | 0, 1); }
export function TaskView({ task, value, onChange, support, seed = 0, feedback = false, disabled = false }: {
  task: Task; value?: string; onChange: (answer: string) => void; support: UiLanguage; seed?: number; feedback?: boolean; disabled?: boolean;
}) {
  const c = courseCopy(support); const current = parsed(value); const ordering: number[] = task.kind === 'order' && Array.isArray(current) ? current : [];
  const matching: Record<string, string> = task.kind === 'match' && current && typeof current === 'object' && !Array.isArray(current) ? current : {};
  const optionsSeed = seed ^ taskSeed(task.id);
  return <fieldset className="level-question" data-question-id={task.id} disabled={disabled}>
    <legend><span lang={support}>{task.instruction[support]}</span>{task.prompt && <strong lang={support}>{task.prompt[support]}</strong>}{task.stem && <strong lang={task.language}>{task.stem}</strong>}</legend>
    {task.kind === 'choice' && <div className="level-options">{shuffled(task.options, optionsSeed).map(option => <label key={option} className={value === option ? 'is-selected' : undefined}><input type="radio" name={task.id} value={option} checked={value === option} onChange={() => onChange(option)} /><span lang={task.language}>{option}</span></label>)}</div>}
    {task.kind === 'input' && <label className="level-input-task"><span className="sr-only">{c.input}</span><input type="text" lang={task.language} value={value ?? ''} autoComplete="off" spellCheck={false} onChange={event => onChange(event.target.value)} /></label>}
    {task.kind === 'order' && <div className="level-order-task"><div className="level-token-list">{shuffled(task.tokens.map((_, i) => i), optionsSeed).map(i => <button type="button" className="button button-secondary" key={i} disabled={ordering.includes(i)} onClick={() => onChange(JSON.stringify([...ordering, i]))} lang={task.language}>{task.tokens[i]}</button>)}</div><p aria-label={c.selected} lang={task.language}>{ordering.map(i => task.tokens[i]).join(' ') || '…'}</p><button type="button" className="button button-secondary" onClick={() => onChange('')}>{c.clear}</button></div>}
    {task.kind === 'match' && <div className="level-match-task">{task.pairs.map(pair => <label key={pair.id}><span lang={task.language}>{pair.left}</span><select value={matching[pair.id] ?? ''} onChange={event => onChange(JSON.stringify({ ...matching, [pair.id]: event.target.value }))} lang={support}><option value="">{c.choose}</option>{shuffled(task.pairs, optionsSeed).map(option => <option key={option.id} value={option.id}>{option.right[support]}</option>)}</select></label>)}</div>}
    {feedback && <div className="level-explanation" lang={support}><p>{checkAnswer(task, value) ? `✓ ${c.right}` : `↻ ${c.wrong}`}</p><p>{c.correct}: <span lang={task.language}>{correctAnswer(task, support)}</span></p><p>{task.explanation[support]}</p></div>}
  </fieldset>;
}
export function AnswerReview({ tasks, answers, support }: { tasks: readonly Task[]; answers: Record<string, string>; support: UiLanguage }) {
  const c = courseCopy(support);
  return <ol className="level-answer-review">{tasks.map(task => {
    let answer = answers[task.id] ?? c.noAnswer;
    if (task.kind === 'order') { const order = parsed(answer); if (Array.isArray(order)) answer = order.map(i => task.tokens[i]).join(' '); }
    if (task.kind === 'match') { const pairs = parsed(answer); if (pairs) answer = task.pairs.map(pair => `${pair.left} → ${task.pairs.find(option => option.id === pairs[pair.id])?.right[support] ?? '—'}`).join('; '); }
    return <li key={task.id} data-correct={checkAnswer(task, answers[task.id])}><strong lang={task.prompt ? support : task.language}>{task.prompt?.[support] || task.stem || task.instruction[support]}</strong><p>{checkAnswer(task, answers[task.id]) ? `✓ ${c.right}` : '↻'}</p><p>{c.answer}: <span lang={task.language}>{answer}</span></p><p>{c.correct}: <span lang={task.language}>{correctAnswer(task, support)}</span></p><p lang={support}>{task.explanation[support]}</p></li>;
  })}</ol>;
}
