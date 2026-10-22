import type { LearningLanguage } from '../../../../domain/types';
import type { Lesson, Question, Text } from '../model';
import { text as t } from '../model';

const partner = t('Собеседник', 'Gesprächspartner', 'Partner');
const learner = t('Вы', 'Du', 'You');
export function enrichIntroduction(lesson: Lesson): Lesson {
  const de = lesson.language === 'de';
  return { ...lesson,
    forms: { headings: [t('Местоимение', 'Pronomen', 'Pronoun'), t('Форма', 'Form', 'Form'), t('Пример', 'Beispiel', 'Example')], rows: de
      ? [['ich', 'bin', 'Ich bin Alex.'], ['du', 'bist', 'Du bist neu.'], ['er / sie / es', 'ist', 'Mia ist hier.'], ['wir', 'sind', 'Wir sind im Kurs.'], ['ihr', 'seid', 'Ihr seid neu.'], ['sie / Sie', 'sind', 'Sind Sie aus Bern?']]
      : [['I', 'am', 'I am Alex.'], ['you', 'are', 'You are new.'], ['he / she / it', 'is', 'Mia is here.'], ['we', 'are', 'We are in class.'], ['they', 'are', 'They are students.']] },
    important: [de ? t('Вежливое Sie пишется с большой буквы и используется с sind.', 'Die höfliche Anrede Sie wird grossgeschrieben und steht mit sind.', 'Polite Sie is capitalised and takes sind.') : t('В утвердительном кратком ответе используйте Yes, I am, а не Yes, I’m.', 'In einer positiven Kurzantwort heisst es Yes, I am, nicht Yes, I’m.', 'In an affirmative short answer, use Yes, I am, not Yes, I’m.')],
    dialogues: [{ title: t('Знакомство на занятии', 'Kennenlernen im Kurs', 'Meeting in class'), lines: de ? [
      { speaker: partner, sentence: 'Hallo! Ich bin Mia. Bist du neu hier?', translation: t('Привет! Я Миа. Ты здесь недавно?', 'Hallo! Ich bin Mia. Bist du neu hier?', 'Hi! I am Mia. Are you new here?') },
      { speaker: learner, sentence: 'Ja, ich bin Alex. Ich wohne in Bern.', translation: t('Да, я Алекс. Я живу в Берне.', 'Ja, ich bin Alex. Ich wohne in Bern.', 'Yes, I am Alex. I live in Bern.') },
      { speaker: partner, sentence: 'Ich wohne in Luzern. Schön, dich kennenzulernen.', translation: t('Я живу в Люцерне. Приятно познакомиться.', 'Ich wohne in Luzern. Schön, dich kennenzulernen.', 'I live in Lucerne. Nice to meet you.') },
      { speaker: learner, sentence: 'Freut mich auch!', translation: t('Мне тоже приятно!', 'Freut mich auch!', 'Nice to meet you too!') },
    ] : [
      { speaker: partner, sentence: 'Hi! I am Mia. Are you a new student?', translation: t('Привет! Я Миа. Ты новый студент?', 'Hallo! Ich bin Mia. Bist du neu im Kurs?', 'Hi! I am Mia. Are you a new student?') },
      { speaker: learner, sentence: 'Yes, I am. My name is Alex.', translation: t('Да. Меня зовут Алекс.', 'Ja. Ich heisse Alex.', 'Yes, I am. My name is Alex.') },
      { speaker: partner, sentence: 'Nice to meet you. I am from Bristol.', translation: t('Приятно познакомиться. Я из Бристоля.', 'Schön, dich kennenzulernen. Ich komme aus Bristol.', 'Nice to meet you. I am from Bristol.') },
      { speaker: learner, sentence: 'Nice to meet you too. I am from London.', translation: t('Мне тоже приятно. Я из Лондона.', 'Freut mich auch. Ich komme aus London.', 'Nice to meet you too. I am from London.') },
    ] }],
  };
}

export function introductionQuestions(language: LearningLanguage): Lesson {
  const de = language === 'de';
  const title = t('Задаём вопросы при знакомстве', 'Fragen beim Kennenlernen', 'Asking questions when meeting someone');
  function q(id: string, stem: string, options: string[], explanation: Text, reading = false): Question {
    return { id: `${language}-intro-questions-${id}`, language, level: 'A1', skill: reading ? 'reading' : 'grammar', topic: title, instruction: t('Выберите правильный ответ.', 'Wähle die richtige Antwort.', 'Choose the correct answer.'), stem, options, correct: options[0]!, explanation };
  }
  const question = de ? 'Wo wohnst du?' : 'Where are you from?';
  const answer = de ? 'Ich wohne in Bern.' : 'I am from London.';
  const explanation = de ? t('О месте жительства спрашивают wo.', 'Nach dem Wohnort fragt man mit wo.', 'Ask about where someone lives with wo.') : t('О происхождении спрашивают where … from.', 'Nach der Herkunft fragt man mit where … from.', 'Ask about origin with where … from.');
  const translatedQuestion = de ? t('Где ты живёшь?', question, 'Where do you live?') : t('Откуда ты?', 'Woher kommst du?', question);
  const translatedAnswer = de ? t('Я живу в Берне.', answer, 'I live in Bern.') : t('Я из Лондона.', 'Ich komme aus London.', answer);
  const personQuestion = de ? 'Wer bist du?' : 'What is your name?';
  const personAnswer = de ? 'Ich bin Alex.' : 'My name is Alex.';
  const who = de ? t('О человеке спрашивают wer.', 'Nach einer Person fragt man mit wer.', 'Ask about a person with wer.') : t('Имя можно узнать вопросом What is your name?', 'Mit What is your name? fragt man nach dem Namen.', 'Ask someone’s name with What is your name?');
  const lesson: Lesson = { id: 'introduction-questions', language, level: 'A1', moduleId: 'introductions', title,
    description: t('Спросите имя, место жительства или происхождение и ответьте собеседнику.', 'Frage nach Namen, Wohnort oder Herkunft und antworte deinem Gegenüber.', 'Ask about names, where someone lives or where they are from, and reply.'),
    theory: [{ heading: title, body: de ? t('В вопросе с вопросительным словом сначала стоит wo, wer или wie, затем спрягаемый глагол и подлежащее.', 'In einer W-Frage steht zuerst wo, wer oder wie, dann das konjugierte Verb und das Subjekt.', 'In a W-question, put wo, wer or wie first, then the conjugated verb and the subject.') : t('В вопросе с be сначала стоит вопросительное слово, затем am/is/are и подлежащее. В Where are you from? предлог from остаётся в конце.', 'In einer Frage mit be steht zuerst das Fragewort, dann am/is/are und das Subjekt. In Where are you from? bleibt from am Ende.', 'In a question with be, put the question word first, then am/is/are and the subject. In Where are you from?, from stays at the end.'), example: `${question} — ${answer}` }],
    vocabulary: de ? [{ word: 'wo', translation: t('где', 'wo', 'where') }, { word: 'wer', translation: t('кто', 'wer', 'who') }, { word: 'wie', translation: t('как', 'wie', 'how') }, { word: 'woher', translation: t('откуда', 'woher', 'where from') }] : [{ word: 'where', translation: t('где, куда', 'wo, wohin', 'where') }, { word: 'who', translation: t('кто', 'wer', 'who') }, { word: 'what', translation: t('что, какой', 'was, welcher', 'what') }, { word: 'from', translation: t('из, от', 'aus, von', 'from') }],
    examples: [{ sentence: question, translation: translatedQuestion }, { sentence: answer, translation: translatedAnswer }],
    dialogues: [{ title, lines: [{ speaker: partner, sentence: personQuestion, translation: de ? t('Кто ты?', personQuestion, 'Who are you?') : t('Как тебя зовут?', 'Wie heisst du?', personQuestion) }, { speaker: learner, sentence: personAnswer, translation: t('Я Алекс.', 'Ich bin Alex.', 'My name is Alex.') }, { speaker: partner, sentence: question, translation: translatedQuestion }, { speaker: learner, sentence: answer, translation: translatedAnswer }] }],
    reading: { passage: de ? 'Alex wohnt in Bern. Mia wohnt in Luzern. Sie sind zusammen im Deutschkurs.' : 'Alex is from London. Mia is from Bristol. They are in the same English class.', translation: de ? t('Алекс живёт в Берне. Миа живёт в Люцерне. Они вместе на занятиях немецким.', 'Alex wohnt in Bern. Mia wohnt in Luzern. Sie sind zusammen im Deutschkurs.', 'Alex lives in Bern. Mia lives in Lucerne. They attend the German class together.') : t('Алекс из Лондона. Миа из Бристоля. Они в одной группе английского.', 'Alex kommt aus London. Mia kommt aus Bristol. Sie sind im selben Englischkurs.', 'Alex is from London. Mia is from Bristol. They are in the same English class.'), questions: [q('read', de ? 'Wo wohnt Mia?' : 'Where is Mia from?', de ? ['In Luzern.', 'In Bern.', 'In Basel.', 'In Zürich.'] : ['Bristol.', 'London.', 'Oxford.', 'Leeds.'], de ? t('В тексте: Mia wohnt in Luzern.', 'Im Text: Mia wohnt in Luzern.', 'The text says Mia lives in Lucerne.') : t('В тексте: Mia is from Bristol.', 'Im Text: Mia is from Bristol.', 'The text says Mia is from Bristol.'), true)] },
    exercises: [q('practice1', de ? '___ wohnst du?' : 'Where ___ you from?', de ? ['Wo', 'Wer', 'Was', 'Wann'] : ['are', 'is', 'am', 'be'], explanation), q('practice2', de ? '___ bist du? — Ich bin Alex.' : 'What ___ your name?', de ? ['Wer', 'Wo', 'Wann', 'Wohin'] : ['is', 'are', 'am', 'be'], who)],
    quiz: [q('quiz1', de ? 'Welche Frage passt zu: Ich wohne in Bern?' : 'Which question asks about origin?', de ? ['Wo wohnst du?', 'Wer bist du?', 'Wann kommst du?', 'Wie alt bist du?'] : ['Where are you from?', 'What is your name?', 'Are you tired?', 'Who is your teacher?'], explanation), q('quiz2', de ? 'Wie ___ du? — Alex.' : 'Where is she ___? — Bristol.', de ? ['heisst', 'heisse', 'heissen', 'heisstest'] : ['from', 'at', 'on', 'by'], de ? t('С du используется heisst.', 'Mit du steht heisst.', 'Use heisst with du.') : explanation), q('quiz3', de ? '___ Sie aus Bern?' : '___ you Alex?', de ? ['Sind', 'Ist', 'Bist', 'Seid'] : ['Are', 'Is', 'Am', 'Be'], de ? t('Вежливое Sie используется с sind.', 'Die höfliche Anrede Sie steht mit sind.', 'Polite Sie takes sind.') : t('С you используется are.', 'Mit you steht are.', 'Use are with you.'))],
  };
  return lesson;
}
