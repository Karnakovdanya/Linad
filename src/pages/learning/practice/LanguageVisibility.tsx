import { useId } from 'react';
import type { UiLanguage } from '../../../domain/types';
import type { Messages } from '../../../i18n/messages';
import { practiceLanguages } from './data/types';
import { PracticeIcon } from './PracticeIcon';
import { PracticeLanguageFlag } from './PracticeLanguageFlag';

export function LanguageVisibility({ t, visible, onToggle, hintId }: { t: Messages; visible: UiLanguage[]; onToggle: (language: UiLanguage) => void; hintId?: string }) {
  const id = useId(); const names = { ru: t.russian, de: t.german, en: t.english };
  return <div className="practice-language-options" role="group" aria-label={t.practiceShowLanguages} id={id}>
    <span className="practice-language-label"><PracticeIcon name="eye" />{t.practiceShowLanguages}</span>
    {practiceLanguages.map(language => <button type="button" key={language} className="practice-language-button" aria-pressed={visible.includes(language)}
      aria-describedby={hintId} onClick={() => onToggle(language)}><PracticeLanguageFlag language={language} /><span lang={language}>{names[language]}</span><PracticeIcon name="check" /></button>)}
  </div>;
}
