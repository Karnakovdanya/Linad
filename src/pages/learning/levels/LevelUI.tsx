import { Link } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import type { ReactNode } from 'react';
import type { Question, Text } from './model';
import { orderedOptions } from './assessment';
import type { UiLanguage } from '../../../domain/types';

export const levelRoot = '/learn/levels';
export function LevelSteps({ active }: { active: number }) {
  const { t } = usePreferences();
  const steps = [t.levelsLanguages, t.levelsPlacement, t.levelsSelectTitle];
  const shortSteps = [t.levelsStepLanguages, t.levelsStepTest, t.levelsStepLevel];
  return <nav className="level-steps" aria-label={t.levelsTitle}><ol>{steps.map((step, index) => <li key={step} aria-current={index === active ? 'step' : undefined}>
    <div className="level-step-label"><span className="sr-only">{step}</span><span className="level-step-number" aria-hidden="true">{index + 1}</span><span className="level-step-name" aria-hidden="true">{step}</span><span className="level-step-short" aria-hidden="true">{shortSteps[index]}</span></div>
  </li>)}</ol></nav>;
}
export function LevelBreadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { t } = usePreferences();
  return <nav className="level-breadcrumbs" aria-label={t.levelsBreadcrumbs}><ol>{items.map((item, index) => <li key={`${index}:${item.label}`}>
    {index > 0 && <span aria-hidden="true">›</span>}{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
  </li>)}</ol></nav>;
}
export function LevelHeading({ title, children }: { title: string; children?: ReactNode }) {
  return <header className="level-heading"><h1 id="page-heading" tabIndex={-1}>{title}</h1>{children}</header>;
}
export function LevelProgress({ value, label }: { value: number; label: string }) {
  return <div className="level-progress"><div><span>{label}</span><strong>{value}%</strong></div><progress max={100} value={value} aria-label={label} /></div>;
}
export function ChoiceQuestion({ question, value, onChange, support, seed = 0, feedback }: {
  question: Question; value?: string; onChange: (answer: string) => void; support: UiLanguage; seed?: number; feedback?: boolean;
}) {
  return <fieldset className="level-question" data-question-id={question.id}>
    <legend><span lang={support}>{question.instruction[support]}</span><strong lang={question.language}>{question.stem}</strong></legend>
    <div className="level-options">{orderedOptions(question, seed).map(option => <label key={option} className={value === option ? 'is-selected' : undefined}>
      <input type="radio" name={question.id} value={option} checked={value === option} onChange={() => onChange(option)} />
      <span lang={question.language}>{option}</span>
    </label>)}</div>
    {feedback && <p className="level-explanation" lang={support}>{question.explanation[support]}</p>}
  </fieldset>;
}
export function Translated({ value, language, as = 'p' }: { value: Text; language: UiLanguage; as?: 'p' | 'span' }) {
  const Tag = as; return <Tag lang={language}>{value[language]}</Tag>;
}
