import type { UiLanguage } from '../../../domain/types';
import { practiceSpeechCopy } from '../../../i18n/practice-speech-messages';
import { chooseVoice, rankedVoices, voiceId } from '../../../speech/voices';
import type { usePracticeSpeech } from './usePracticeSpeech';

export function PracticeVoiceSettings({ speech, uiLanguage, names }: { speech: ReturnType<typeof usePracticeSpeech>; uiLanguage: UiLanguage; names: Record<UiLanguage, string> }) {
  const c = practiceSpeechCopy(uiLanguage);
  return <details className="practice-voice-settings"><summary>{c.settings}</summary><p>{c.hint}</p><div>
    {(['ru', 'de', 'en'] as const).map(language => {
      const voices = rankedVoices(speech.voices, language); const selected = speech.preferences[language] ?? '';
      const automatic = chooseVoice(speech.voices, language);
      return <label key={language} htmlFor={`practice-voice-${language}`}><span>{names[language]}</span><select id={`practice-voice-${language}`} value={selected} disabled={!voices.length} onChange={event => speech.selectVoice(language, event.target.value)}>
        <option value="">{automatic ? `${c.automatic} · ${automatic.name}` : c.unavailable}</option>
        {selected && !voices.some(voice => voiceId(voice) === selected) && <option value={selected}>{c.previousMissing}</option>}
        {voices.map(voice => <option key={voiceId(voice)} value={voiceId(voice)}>{voice.name} · {voice.lang}</option>)}
      </select></label>;
    })}
  </div></details>;
}
