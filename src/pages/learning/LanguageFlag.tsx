import { useId } from 'react';
import type { LearningLanguage } from '../../domain/types';

export function LanguageFlag({ language }: { language: LearningLanguage }) {
  const clip = useId();
  return <svg className="learning-language-flag" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <defs><clipPath id={clip}><circle cx="16" cy="16" r="16" /></clipPath></defs>
    <g clipPath={`url(#${clip})`}>
      {language === 'de' ? <>
        <path fill="#000000" d="M0 0h32v11H0z" />
        <path fill="#DD0000" d="M0 11h32v10H0z" />
        <path fill="#FFCE00" d="M0 21h32v11H0z" />
      </> : <>
        <path fill="#012169" d="M0 0h32v32H0z" />
        <path stroke="#FFFFFF" strokeWidth="8" d="m0 0 32 32M32 0 0 32" />
        <path stroke="#C8102E" strokeWidth="3" d="m0 0 32 32M32 0 0 32" />
        <path stroke="#FFFFFF" strokeWidth="11" d="M16 0v32M0 16h32" />
        <path stroke="#C8102E" strokeWidth="6" d="M16 0v32M0 16h32" />
      </>}
    </g>
  </svg>;
}
