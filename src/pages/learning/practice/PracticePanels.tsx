import { useState } from 'react';
import { usePreferences } from '../../../app/preferences-context';
import type { UiLanguage } from '../../../domain/types';
import type { SavedPracticeItem } from '../../../storage/practice';
import type { PracticeEntry, PracticeMaterial } from './data/types';
import { practiceLanguages } from './data/types';
import { PracticeIcon } from './PracticeIcon';
import type { SpeechEntry } from './usePracticeSpeech';
import { usePracticeSpeech } from './usePracticeSpeech';
import { PracticeVoiceSettings } from './PracticeVoiceSettings';

interface Props {
  categoryId: string; situationId: string; material?: PracticeMaterial; visibleLanguages: readonly UiLanguage[];
  savedItems: readonly SavedPracticeItem[]; onSave: (item: Omit<SavedPracticeItem, 'savedAt'>) => void;
}
type Speech = ReturnType<typeof usePracticeSpeech>;
function ListenButton({ id, label, entries, speech }: { id: string; label: string; entries: readonly SpeechEntry[]; speech: Speech }) {
  const { t } = usePreferences();
  const active = speech.activeId === id;
  return <button type="button" className="practice-icon-button practice-listen" aria-label={active ? t.practiceStop : label} title={active ? t.practiceStop : label}
    aria-pressed={active} aria-busy={active && speech.playbackState === 'loading'} data-playback-state={active ? speech.playbackState : 'idle'} onClick={() => speech.speak(entries, id)}><PracticeIcon name={active ? 'stop' : 'volume'} /></button>;
}
export function PracticePanels({ categoryId, situationId, material, visibleLanguages, savedItems, onSave }: Props) {
  const { t, preferences } = usePreferences();
  const languages = practiceLanguages.filter(language => visibleLanguages.includes(language));
  const languageNames = { ru: t.russian, de: t.german, en: t.english };
  const speakerNames = { doctor: t.practiceDoctorSpeaker, patient: t.practicePatientSpeaker, receptionist: t.practiceReceptionistSpeaker,
    pharmacist: t.practicePharmacistSpeaker, dispatcher: t.practiceDispatcherSpeaker, helper: t.practiceHelperSpeaker, caller: t.practiceCallerSpeaker,
    learner: t.practiceParticipantOne, partner: t.practiceParticipantTwo };
  const [morePhrases, setMorePhrases] = useState(false);
  const [moreWords, setMoreWords] = useState(false);
  const [openDialogues, setOpenDialogues] = useState<string[]>(material?.dialogues[0] ? [material.dialogues[0].id] : []);
  const speech = usePracticeSpeech(t, languages.join(','), preferences.uiLanguage);
  function saveButton(entry: PracticeEntry, kind: 'phrase' | 'word') {
    const id = `${categoryId}.${situationId}.${kind}.${entry.id}`;
    const saved = savedItems.some(item => item.id === id);
    const label = `${saved ? t.practiceRemove : t.practiceSave}: ${entry.text[languages[0]!]}`;
    return <button type="button" className="practice-icon-button practice-save" aria-label={label} title={label} aria-pressed={saved}
      onClick={() => onSave({ id, kind, categoryId, situationId, text: entry.text })}><PracticeIcon name="bookmark" /></button>;
  }
  function entriesFor(entry: PracticeEntry): SpeechEntry[] { return languages.map(language => ({ language, text: entry.text[language] })); }
  return <>
    <p className="practice-status" role="status" aria-live="polite">{speech.notice}</p>
    <PracticeVoiceSettings speech={speech} uiLanguage={preferences.uiLanguage} names={languageNames} />
    <div className="practice-panels">
      <section className="practice-panel practice-phrases" aria-labelledby="practice-phrases-heading">
        <header className="practice-panel-heading"><span><PracticeIcon name="chat" /></span><div><h2 id="practice-phrases-heading">{t.practicePhrases}</h2><p>{t.practicePhrasesIntro}</p></div></header>
        {material ? <>
          <ol className="practice-phrase-list" id="practice-phrase-list">
            {material.phrases.slice(0, morePhrases ? undefined : 6).map((entry, index) => <li key={entry.id} className="practice-phrase-row" data-entry-id={entry.id}>
              <span className="practice-number" aria-hidden="true">{index + 1}</span>
              <div className="practice-translations">{languages.map(language => <div className="practice-translation" key={language} data-translation-language={language}>
                <p lang={language}>{entry.text[language]}</p>
                <ListenButton id={`phrase-${entry.id}-${language}`} label={`${t.practiceListen} · ${languageNames[language]}: ${entry.text[language]}`} entries={[{ language, text: entry.text[language] }]} speech={speech} />
              </div>)}</div>
              {saveButton(entry, 'phrase')}
            </li>)}
          </ol>
          {material.phrases.length > 6 && <button type="button" className="button button-secondary practice-more" aria-controls="practice-phrase-list" aria-expanded={morePhrases} onClick={() => setMorePhrases(!morePhrases)}>
            {morePhrases ? t.practiceShowLess : `${t.practiceMorePhrases} (+${material.phrases.length - 6})`}<PracticeIcon name="chevron" />
          </button>}
        </> : <p className="practice-empty">{t.practiceEmpty}</p>}
      </section>
      <section className="practice-panel practice-dialogues" aria-labelledby="practice-dialogues-heading">
        <header className="practice-panel-heading"><span><PracticeIcon name="people" /></span><div><h2 id="practice-dialogues-heading">{t.practiceDialogues}</h2><p>{t.practiceDialoguesIntro}</p></div></header>
        {material ? <div className="practice-accordion">{material.dialogues.map((dialogue, index) => {
          const open = openDialogues.includes(dialogue.id);
          return <div className="practice-dialogue" key={dialogue.id}>
            <div className="practice-dialogue-heading">
              <h3><button type="button" id={`dialogue-toggle-${dialogue.id}`} aria-expanded={open} aria-controls={`dialogue-${dialogue.id}`}
                onClick={() => setOpenDialogues(open ? openDialogues.filter(id => id !== dialogue.id) : [...openDialogues, dialogue.id])}>
                <span>{index + 1}. {dialogue.title[preferences.uiLanguage]}</span><PracticeIcon name="chevron" />
              </button></h3>
              <ListenButton id={`dialogue-${dialogue.id}`} label={`${t.practiceListenDialogue}: ${dialogue.title[preferences.uiLanguage]}`}
                entries={dialogue.lines.flatMap(line => languages.map(language => ({ language, text: line.text[language] })))} speech={speech} />
            </div>
            <div className="practice-dialogue-body" id={`dialogue-${dialogue.id}`} role="region" aria-labelledby={`dialogue-toggle-${dialogue.id}`} hidden={!open}>
              {dialogue.lines.map((line, lineIndex) => <div className="practice-dialogue-line" key={lineIndex}>
                <span className="practice-speaker-icon"><PracticeIcon name={line.speaker === 'doctor' ? 'health' : 'people'} /></span>
                <div><p className="practice-speaker">{dialogue.participants?.[line.speaker]?.[preferences.uiLanguage] ?? speakerNames[line.speaker]}</p>
                  {languages.map(language => <p key={language} lang={language} data-translation-language={language}>{line.text[language]}</p>)}
                </div>
                <ListenButton id={`dialogue-${dialogue.id}-${lineIndex}`} label={`${t.practiceListenAll}: ${line.text[languages[0]!]}`}
                  entries={languages.map(language => ({ language, text: line.text[language] }))} speech={speech} />
              </div>)}
            </div>
          </div>;
        })}</div> : <p className="practice-empty">{t.practiceEmpty}</p>}
      </section>
      <section className="practice-panel practice-words" aria-labelledby="practice-words-heading">
        <header className="practice-panel-heading"><span><PracticeIcon name="book" /></span><div><h2 id="practice-words-heading">{t.practiceWords}</h2><p>{t.practiceWordsIntro}</p></div></header>
        {material ? <>
          <table className="practice-word-table" id="practice-word-table">
            <caption className="sr-only">{t.practiceWordsIntro}</caption>
            <thead><tr>{languages.map(language => <th scope="col" key={language} data-translation-language={language}>{languageNames[language]}</th>)}<th scope="col" className="practice-word-controls"><span className="sr-only">{t.practiceListen} / {t.practiceSave}</span></th></tr></thead>
            <tbody>{material.words.slice(0, moreWords ? undefined : 12).map(entry => <tr key={entry.id} data-entry-id={entry.id}>
              {languages.map(language => <td key={language} lang={language} data-translation-language={language}>{entry.text[language]}</td>)}
              <td className="practice-word-controls"><div>
                <ListenButton id={`word-${entry.id}`} label={`${t.practiceListenAll}: ${entry.text[languages[0]!]}`} entries={entriesFor(entry)} speech={speech} />
                {saveButton(entry, 'word')}
              </div></td>
            </tr>)}</tbody>
          </table>
          {material.words.length > 12 && <button type="button" className="button button-secondary practice-more" aria-controls="practice-word-table" aria-expanded={moreWords} onClick={() => setMoreWords(!moreWords)}>
            {moreWords ? t.practiceShowLess : `${t.practiceMoreWords} (+${material.words.length - 12})`}<PracticeIcon name="chevron" />
          </button>}
        </> : <p className="practice-empty">{t.practiceEmpty}</p>}
      </section>
    </div>
  </>;
}
