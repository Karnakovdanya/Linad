import { usePreferences } from '../../../app/preferences-context';
import type { LearningLanguage } from '../../../domain/types';
import { LanguageFlag } from '../LanguageFlag';

export function SelectedLearningLanguage({ language }: { language: LearningLanguage }) {
  const { t } = usePreferences();
  return <div className="situations-language" data-learning-language={language}>
    <LanguageFlag language={language} />
    <div><span>{t.learningSelectedLanguage}</span><strong>{language === 'de' ? t.learnGerman : t.learnEnglish}</strong></div>
  </div>;
}
