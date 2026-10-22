import { useId } from 'react';
import type { UiLanguage } from '../../../domain/types';
import { LanguageFlag } from '../LanguageFlag';

export function PracticeLanguageFlag({ language }: { language: UiLanguage }) {
  const clip = useId();
  if (language !== 'ru') return <LanguageFlag language={language} />;
  return <svg className="learning-language-flag" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <defs><clipPath id={clip}><circle cx="16" cy="16" r="16" /></clipPath></defs>
    <g clipPath={`url(#${clip})`}>
      <path fill="#FFFFFF" d="M0 0h32v11H0z" />
      <path fill="#0039A6" d="M0 11h32v10H0z" />
      <path fill="#D52B1E" d="M0 21h32v11H0z" />
    </g>
  </svg>;
}
