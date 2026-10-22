import { useId } from 'react';
import type { UiLanguage } from '../domain/types';
import type { StudyGoal } from './profile';
import { accountCopy, streakDays } from './copy';
import '../styles/profile-milestones.css';

const streakTitles: Record<UiLanguage, string> = { ru: 'Дни подряд', de: 'Lernserie', en: 'Learning streak' };
const goalLanguages: Record<UiLanguage, Record<StudyGoal['language'], string>> = {
  ru: { de: 'Немецкий', en: 'Английский' },
  de: { de: 'Deutsch', en: 'Englisch' },
  en: { de: 'German', en: 'English' },
};

function MilestoneArt({ kind, days = 0 }: { kind: 'goal' | 'streak'; days?: number }) {
  const id = useId();
  const paper = `calendar-paper-${id}`;
  const softEdge = `calendar-edge-${id}`;
  return <svg className="account-milestone-art" viewBox="0 0 1643 957" preserveAspectRatio={kind === 'goal' ? 'xMaxYMin slice' : 'xMaxYMid slice'} aria-hidden="true" focusable="false">
    <image href={`${import.meta.env.BASE_URL}assets/account/${kind === 'goal' ? 'goal-mountain' : 'streak-calendar'}.png`} width="1643" height="957" />
    {kind === 'streak' && <>
      <defs>
        <linearGradient id={paper} x1="1090" y1="510" x2="1210" y2="660" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e9edff" /><stop offset="1" stopColor="#dedafd" />
        </linearGradient>
        <filter id={softEdge} x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      {/* Cover only the printed numeral; the supplied illustration remains intact.
          This decorative copy uses the same real count as the accessible text. */}
      <g transform="rotate(11 1148 586)">
        <rect x="1090" y="510" width="120" height="150" rx="12" fill={`url(#${paper})`} filter={`url(#${softEdge})`} />
        <text x="1150" y="608" textAnchor="middle" fill="#20347b" fontFamily="Segoe UI, Arial, sans-serif" fontWeight="750" fontStyle="italic" fontSize={Math.min(138, 220 / String(days).length)}>{days}</text>
      </g>
    </>}
  </svg>;
}

export function ProfileMilestones({ goal, streak, language, onEditGoal }: {
  goal: StudyGoal | null | undefined;
  streak: number;
  language: UiLanguage;
  onEditGoal: () => void;
}) {
  const c = accountCopy(language);
  return <>
    <article className="account-panel account-summary-goal account-milestone">
      <MilestoneArt kind="goal" />
      <div className="account-milestone-content">
        <h2>{c.goal}</h2>
        {goal ? <div className="account-goal-value">
          <strong className="account-goal-level">{goal.level}</strong>
          <div className="account-goal-details"><span className="account-goal-language">{goalLanguages[language][goal.language]}</span><small className="account-goal-caption">{c.targetLevel}</small></div>
        </div> : <strong>{c.noGoal}</strong>}
        <button className="text-link" type="button" onClick={onEditGoal}>{goal ? c.editGoal : c.setGoal} →</button>
      </div>
    </article>
    <article className="account-panel account-summary-streak account-milestone">
      <MilestoneArt kind="streak" days={streak} />
      <div className="account-milestone-content">
        <h2>{streakTitles[language]}</h2>
        <div className="account-streak-value"><strong data-testid="study-streak">{streak}</strong>{' '}<span className="account-streak-unit">{streakDays(streak, language)}</span></div>
        <small>{streak ? c.keepStreak : c.startToday}</small>
      </div>
    </article>
  </>;
}
