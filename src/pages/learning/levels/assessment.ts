import type { LearningLanguage } from '../../../domain/types';
import { cefrLevels } from './model';
import type { AssessmentResult, AssessmentRun, Question, Skill, SkillResult } from './model';
import { questionBank, questionById } from './data/questions';

export const assessmentLength = 30;
const skills: Skill[] = ['grammar', 'vocabulary', 'reading', 'listening'];
function hash(value: string, seed: number) {
  let n = seed >>> 0;
  for (const c of value) n = Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0;
  n ^= n >>> 16; n = Math.imul(n, 0x85ebca6b); n ^= n >>> 13; n = Math.imul(n, 0xc2b2ae35);
  return (n ^ (n >>> 16)) >>> 0;
}
export function orderedOptions(question: Question, seed: number) { return [...question.options].sort((a, b) => hash(`${question.id}:${a}`, seed) - hash(`${question.id}:${b}`, seed)); }
export function newAssessment(language: LearningLanguage, audioEnabled: boolean, seed = crypto.getRandomValues(new Uint32Array(1))[0]!): AssessmentRun {
  return { id: `${language}-${Date.now()}-${seed}`, language, seed, audioEnabled, questionIds: [], responses: [], heardIds: [], completed: false, startedAt: new Date().toISOString() };
}

/** Bayesian one-parameter screening estimate with a 25% guessing floor.
 * Editorial item difficulties are not empirically calibrated CEFR cut scores.
 * The prior regularises short or extreme response patterns. */
export function estimateAbility(run: AssessmentRun) {
  const observations = run.responses.flatMap(response => {
    const q = questionById.get(response.questionId);
    return q && q.language === run.language && q.options.includes(response.answer) && (q.skill !== 'listening' || (run.audioEnabled && run.heardIds.includes(q.id))) ? [{ q, right: response.answer === q.correct }] : [];
  });
  if (!observations.length) return 1;
  const grid = Array.from({ length: 81 }, (_, i) => -2 + i / 10);
  const logs = grid.map(theta => -0.5 * ((theta - 1.5) / 1.8) ** 2 + observations.reduce((sum, { q, right }) => {
    const p = .25 + .75 / (1 + Math.exp(-(theta - cefrLevels.indexOf(q.level)) * 1.5));
    return sum + Math.log(right ? p : 1 - p);
  }, 0));
  const max = Math.max(...logs); const weights = logs.map(log => Math.exp(log - max));
  return grid.reduce((sum, theta, i) => sum + theta * weights[i]!, 0) / weights.reduce((sum, weight) => sum + weight, 0);
}

export function nextQuestion(run: AssessmentRun): Question | undefined {
  if (run.completed || run.responses.length >= assessmentLength) return undefined;
  const availableSkills = run.audioEnabled ? skills : skills.filter(skill => skill !== 'listening');
  const targets: Record<Skill, number> = run.audioEnabled ? { grammar: 8, vocabulary: 8, reading: 8, listening: 6 } : { grammar: 10, vocabulary: 10, reading: 10, listening: 0 };
  const answered = run.responses.map(response => questionById.get(response.questionId)!).filter(Boolean);
  const used = new Set(run.responses.map(response => response.questionId));
  const skill = [...availableSkills].sort((a, b) => answered.filter(q => q.skill === a).length / targets[a] - answered.filter(q => q.skill === b).length / targets[b])[0];
  const candidates = questionBank[run.language].filter(q => q.skill === skill && !used.has(q.id));
  const theta = estimateAbility(run);
  // Cover every band for each text skill; subsequent items target the estimated ability.
  // Coverage probes prevent a lucky early answer from being treated as evidence for C1.
  const skillAnswers = answered.filter(q => q.skill === skill);
  const covered = new Set(skillAnswers.map(q => q.level));
  const unseen = cefrLevels.filter(level => !covered.has(level));
  const probe = skill !== 'listening' && unseen.length && skillAnswers.length >= 2 && skillAnswers.length % 2 === 0;
  const target = probe ? [...unseen].sort((a, b) => Math.abs(cefrLevels.indexOf(a) - theta) - Math.abs(cefrLevels.indexOf(b) - theta))[0] : undefined;
  return candidates.sort((a, b) => {
    const distanceA = Math.abs(cefrLevels.indexOf(a.level) - (target ? cefrLevels.indexOf(target) : theta));
    const distanceB = Math.abs(cefrLevels.indexOf(b.level) - (target ? cefrLevels.indexOf(target) : theta));
    return distanceA - distanceB || hash(a.id, run.seed) - hash(b.id, run.seed);
  })[0];
}

export function commitResponse(run: AssessmentRun, index: number, questionId: string, answer: string): AssessmentRun {
  const q = questionById.get(questionId);
  if (!q || q.language !== run.language || !q.options.includes(answer) || index < 0 || index > run.responses.length || index >= assessmentLength || run.questionIds[index] !== questionId) throw new Error('Invalid assessment response');
  if (q.skill === 'listening' && (!run.audioEnabled || !run.heardIds.includes(q.id))) throw new Error('Listening was not verified');
  if (run.responses[index]?.questionId === questionId && run.responses[index]?.answer === answer) return run;
  const questionIds = run.questionIds.slice(0, index + 1);
  return { ...run, completed: false, questionIds, heardIds: run.heardIds.filter(id => questionIds.includes(id)), responses: [...run.responses.slice(0, index), { questionId, answer }] };
}
export function withoutListening(run: AssessmentRun): AssessmentRun {
  const responses = run.responses.filter(response => questionById.get(response.questionId)?.skill !== 'listening');
  return { ...run, audioEnabled: false, completed: false, heardIds: [], responses, questionIds: responses.map(response => response.questionId) };
}
export function assessmentResult(run: AssessmentRun): AssessmentResult {
  const bySkill = Object.fromEntries(skills.map(skill => [skill, { correct: 0, total: 0, percent: null }])) as Record<Skill, SkillResult>;
  const wrong: Question[] = [];
  const valid = run.responses.flatMap(response => {
    const q = questionById.get(response.questionId);
    if (!q || !q.options.includes(response.answer) || q.language !== run.language || (q.skill === 'listening' && (!run.audioEnabled || !run.heardIds.includes(q.id)))) return [];
    const right = response.answer === q.correct;
    bySkill[q.skill].total++; if (right) bySkill[q.skill].correct++; else wrong.push(q);
    return [{ q, right }];
  });
  for (const result of Object.values(bySkill)) result.percent = result.total ? Math.round(result.correct / result.total * 100) : null;
  const theta = estimateAbility(run);
  let index = Math.max(0, Math.min(4, Math.floor(theta + .5)));
  // Require actual successful reading and grammar evidence at the proposed band.
  while (index > 0) {
    const evidence = valid.filter(({ q }) => cefrLevels.indexOf(q.level) >= index);
    if (evidence.filter(item => item.right).length >= 3 && ['grammar', 'reading'].every(skill => evidence.some(item => item.right && item.q.skill === skill))) break;
    index--;
  }
  const beginner = valid.filter(item => item.q.level === 'A1');
  return { runId: run.id, language: run.language, level: cefrLevels[index]!, theta, total: valid.length, correct: valid.filter(item => item.right).length,
    skills: bySkill, weakTopics: [...new Map(wrong.map(q => [q.topic.en, q.topic])).values()].slice(0, 8),
    belowA1: beginner.length >= 3 && beginner.filter(item => item.right).length / beginner.length < .5,
    completedAt: new Date().toISOString() };
}
