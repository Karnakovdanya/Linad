import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePreferences } from '../../../app/preferences-context';
import { assets } from '../../../config/assets';
import type { UiLanguage } from '../../../domain/types';
import { LanguageFlag } from '../LanguageFlag';
import { PracticeLanguageFlag } from '../practice/PracticeLanguageFlag';
import { languagePair } from './storage';
import { modulesPath } from './navigation';
import type { LevelsStore } from './useLevelsStore';
import { LevelSteps, levelRoot } from './LevelUI';

export function LanguageSetup({ store }: { store: LevelsStore }) {
  const { t } = usePreferences(); const navigate = useNavigate(); const [query, setQuery] = useSearchParams();
  const { targetLanguage, supportLanguage } = store.state;
  const hint = query.get('language');
  useEffect(() => {
    if (hint !== 'de' && hint !== 'en') return;
    store.update(state => languagePair(state, hint)); setQuery({}, { replace: true });
    // A legacy language URL establishes the target once, then becomes the canonical setup URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);
  const names = { ru: t.russian, de: t.german, en: t.english };
  return <>
    <LevelSteps active={0} />
    <section className="level-hero level-entry"><img src={assets.learning.levelsBookstore} alt={t.levelsPhotoAlt} />
      <div className="level-entry-content">
        <header className="level-heading"><h1 id="page-heading" tabIndex={-1}>{t.levelsSetupLead}{' '}<br /><span>{t.levelsSetupAccent}</span></h1><p>{t.levelsSetupIntro}</p></header>
        <fieldset><legend className="sr-only">{t.levelsTarget}</legend><div className="level-target-options">{(['de', 'en'] as const).map(language => <button type="button" key={language} aria-pressed={targetLanguage === language}
          onClick={() => store.update(state => languagePair(state, language))}>
          <LanguageFlag language={language} /><strong>{names[language]}</strong>
        </button>)}</div></fieldset>
        <div className="level-entry-bottom">
          <fieldset className="level-support-field"><legend>{t.levelsExplanationLanguage}</legend><div className="level-support-options">{(['ru', 'de', 'en'] as UiLanguage[]).filter(language => language !== targetLanguage).map(language => <button type="button" key={language}
            aria-pressed={supportLanguage === language} onClick={() => store.update(state => languagePair(state, targetLanguage, language))}>
            <PracticeLanguageFlag language={language} />{names[language]}<span aria-hidden="true">{supportLanguage === language ? '✓' : ''}</span>
          </button>)}</div></fieldset>
          <button type="button" className="button button-primary level-continue" onClick={() => navigate(store.state.setupComplete[targetLanguage] ? modulesPath(store.state.selectedLevels[targetLanguage]) : `${levelRoot}/placement`)}>{t.levelsContinue} <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  </>;
}
