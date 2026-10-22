import type { LearningLanguage } from '../../../../domain/types';
import type { Lesson, Question, Skill, Text } from '../model';
import { text as t } from '../model';
import { enrichIntroduction, introductionQuestions } from './lesson-navigation-samples';
import { germanIntroductionLessons, prepareGermanIntroduction } from './german-a1-introductions';

function choice(language: LearningLanguage, id: string, stem: string, options: string[], explanation: Text, skill: Skill = 'grammar'): Question {
  return { id: `${language}-lesson-${id}`, language, level: 'A1', skill, topic: t('Знакомство', 'Sich vorstellen', 'Introductions'),
    instruction: t('Выберите правильный ответ.', 'Wähle die richtige Antwort.', 'Choose the correct answer.'), stem, options, correct: options[0]!, explanation };
}

const de: Lesson = {
  id: 'first-introductions', language: 'de', level: 'A1', moduleId: 'introductions',
  title: t('Знакомимся: ich bin, du bist', 'Sich vorstellen: ich bin, du bist', 'Introductions: ich bin, du bist'),
  description: t('Представьтесь, назовите место жительства и задайте простой вопрос.', 'Stelle dich vor, nenne deinen Wohnort und stelle eine einfache Frage.', 'Introduce yourself, say where you live and ask a simple question.'),
  theory: [
    { heading: t('Местоимение и sein', 'Pronomen und sein', 'Pronouns and sein'), body: t('Sein означает «быть». Формы нужно запомнить: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind. В немецком подлежащее обычно не опускается.', 'Sein verbindet das Subjekt mit einer Eigenschaft oder Angabe. Die Formen lauten: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind. Das Subjekt wird normalerweise genannt.', 'Sein means “to be”. Learn these forms: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind. German normally keeps the subject.'), example: 'Ich bin Alex. Wir sind neu hier.' },
    { heading: t('Порядок слов', 'Wortstellung', 'Word order'), body: t('В обычном утверждении спрягаемый глагол стоит на второй позиции. В простом вопросе без вопросительного слова глагол идёт первым. После wo стоит глагол, затем подлежащее.', 'Im Aussagesatz steht das konjugierte Verb an zweiter Position. In einer Ja-Nein-Frage steht es zuerst. Nach wo folgt das Verb und danach das Subjekt.', 'In a statement, the conjugated verb is in second position. In a yes/no question, it comes first. After wo, put the verb and then the subject.'), example: 'Du bist neu. Bist du neu? Wo bist du?' },
    { heading: t('Du и Sie', 'Du und Sie', 'Du and Sie'), body: t('Du — неформальное «ты». Sie с большой буквы — вежливое обращение к одному или нескольким людям. С Sie используется sind. Для места жительства пригодится ich wohne in …', 'Du ist die vertraute Anrede. Sie mit grossem S ist die höfliche Anrede für eine oder mehrere Personen und steht mit sind. Für den Wohnort sagt man ich wohne in …', 'Du is informal “you”. Capitalised Sie is polite “you” for one or more people and takes sind. To say where you live, use ich wohne in …'), example: 'Sind Sie neu hier? Ich wohne in Bern.' },
  ],
  vocabulary: [
    { word: 'ich', translation: t('я', 'ich', 'I') }, { word: 'du', translation: t('ты', 'du', 'you, informal') },
    { word: 'Sie', translation: t('Вы, вежливо', 'Sie, höflich', 'you, polite') }, { word: 'sein', translation: t('быть', 'sein', 'to be') },
    { word: 'wohnen', translation: t('жить, проживать', 'wohnen', 'to live, reside') }, { word: 'neu', translation: t('новый', 'neu', 'new') },
    { word: 'hier', translation: t('здесь', 'hier', 'here') }, { word: 'der Name', translation: t('имя', 'der Name', 'name') },
  ],
  examples: [
    { sentence: 'Ich bin Alex.', translation: t('Я Алекс.', 'Ich bin Alex.', 'I am Alex.') },
    { sentence: 'Wir sind neu hier.', translation: t('Мы здесь недавно.', 'Wir sind neu hier.', 'We are new here.') },
    { sentence: 'Bist du aus Bern?', translation: t('Ты из Берна?', 'Bist du aus Bern?', 'Are you from Bern?') },
    { sentence: 'Ich wohne in Luzern.', translation: t('Я живу в Люцерне.', 'Ich wohne in Luzern.', 'I live in Lucerne.') },
  ],
  reading: {
    passage: 'Hallo! Ich bin Alex. Ich bin neu im Deutschkurs. Ich wohne in Bern. Meine Freundin heisst Mia. Sie wohnt in Luzern. Wir sind heute zusammen im Kurs.',
    translation: t('Привет! Я Алекс. Я недавно в группе немецкого. Я живу в Берне. Мою подругу зовут Миа. Она живёт в Люцерне. Сегодня мы вместе на занятии.', 'Hallo! Ich bin Alex. Ich bin neu im Deutschkurs. Ich wohne in Bern. Meine Freundin heisst Mia. Sie wohnt in Luzern. Wir sind heute zusammen im Kurs.', 'Hello! I am Alex. I am new to the German class. I live in Bern. My friend’s name is Mia. She lives in Lucerne. We are in class together today.'),
    questions: [
      choice('de', 'read1', 'Wo wohnt Alex?', ['In Bern.', 'In Luzern.', 'In Zürich.', 'In Basel.'], t('Алекс говорит: Ich wohne in Bern.', 'Alex sagt: Ich wohne in Bern.', 'Alex says: Ich wohne in Bern.'), 'reading'),
      choice('de', 'read2', 'Wie heisst die Freundin?', ['Mia.', 'Anna.', 'Eva.', 'Lea.'], t('Подругу зовут Миа.', 'Die Freundin heisst Mia.', 'The friend’s name is Mia.'), 'reading'),
      choice('de', 'read3', 'Wo sind Alex und Mia heute?', ['Im Deutschkurs.', 'Im Kino.', 'Im Hotel.', 'Im Bahnhof.'], t('Они вместе на занятии.', 'Sie sind zusammen im Kurs.', 'They are in class together.'), 'reading'),
    ],
  },
  exercises: [
    choice('de', 'practice1', 'Ich ___ neu hier.', ['bin', 'bist', 'ist', 'seid'], t('С ich используется bin.', 'Mit ich steht bin.', 'Use bin with ich.')),
    choice('de', 'practice2', 'Du ___ aus Bern.', ['bist', 'bin', 'sind', 'seid'], t('С du используется bist.', 'Mit du steht bist.', 'Use bist with du.')),
    choice('de', 'practice3', '___ Sie neu hier?', ['Sind', 'Seid', 'Bin', 'Ist'], t('Вежливое Sie требует sind; в вопросе глагол первый.', 'Die höfliche Anrede Sie steht mit sind; in der Frage steht das Verb zuerst.', 'Polite Sie takes sind; the verb comes first in the question.')),
    choice('de', 'practice4', 'Welche Frage passt zu: Ich wohne in Bern?', ['Wo wohnst du?', 'Wer bist du?', 'Wie alt bist du?', 'Wann kommst du?'], t('О месте спрашивают wo.', 'Nach dem Ort fragt man mit wo.', 'Ask about a place with wo.')),
  ],
  quiz: [
    choice('de', 'quiz1', 'Wir ___ im Kurs.', ['sind', 'ist', 'seid', 'bin'], t('С wir используется sind.', 'Mit wir steht sind.', 'Use sind with wir.')),
    choice('de', 'quiz2', 'Mia ___ meine Freundin.', ['ist', 'bin', 'sind', 'bist'], t('Миа — третье лицо единственного числа: ist.', 'Mia ist die dritte Person Singular: ist.', 'Mia is third person singular: ist.')),
    choice('de', 'quiz3', '___ du aus Luzern?', ['Bist', 'Bin', 'Sind', 'Seid'], t('Вопрос к du начинается с bist.', 'Die Frage mit du beginnt mit bist.', 'A question with du begins with bist.')),
    choice('de', 'quiz4', 'Welche Anrede ist höflich?', ['Sie', 'du', 'ihr beide', 'er'], t('Sie с большой буквы — вежливое обращение.', 'Sie mit grossem S ist die höfliche Anrede.', 'Capitalised Sie is the polite form of address.')),
    choice('de', 'quiz5', 'Ich wohne ___ Bern.', ['in', 'aus', 'von', 'nach'], t('Место жительства: wohnen in + город.', 'Den Wohnort nennt man mit wohnen in plus Stadt.', 'Use wohnen in plus a city for where you live.')),
  ],
};

const en: Lesson = {
  id: 'first-introductions', language: 'en', level: 'A1', moduleId: 'introductions',
  title: t('Знакомимся: I am, you are', 'Sich vorstellen: I am, you are', 'Introductions: I am, you are'),
  description: t('Представьтесь и задайте простые вопросы с be.', 'Stelle dich vor und bilde einfache Fragen mit be.', 'Introduce yourself and ask simple questions with be.'),
  theory: [
    { heading: t('Формы be', 'Formen von be', 'Forms of be'), body: t('Be означает «быть». В настоящем времени: I am; he/she/it is; you/we/they are. Подлежащее обычно обязательно. Сокращения: I’m, you’re, she’s.', 'Be bedeutet sein. Im Präsens gilt: I am; he/she/it is; you/we/they are. Das Subjekt wird normalerweise genannt. Kurzformen sind I’m, you’re und she’s.', 'In the present tense, use I am; he/she/it is; you/we/they are. Keep the subject in ordinary statements. Common short forms are I’m, you’re and she’s.'), example: 'I am Alex. She is Mia. We are students.' },
    { heading: t('Вопросы и короткие ответы', 'Fragen und Kurzantworten', 'Questions and short answers'), body: t('Для вопроса поставьте am/is/are перед подлежащим. В коротком положительном ответе форму be не сокращают: Yes, I am. Вопросительное слово ставится перед глаголом.', 'Für eine Frage steht am/is/are vor dem Subjekt. In einer positiven Kurzantwort wird be nicht verkürzt: Yes, I am. Ein Fragewort steht vor dem Verb.', 'Put am/is/are before the subject in questions. Do not contract be in affirmative short answers: Yes, I am. Put a question word before the verb.'), example: 'Are you new? Yes, I am. Where are you from?' },
    { heading: t('Отрицание', 'Verneinung', 'Negatives'), body: t('Для отрицания добавьте not после be. Сокращённые формы: isn’t и aren’t; с I используется I’m not. Для места происхождения используется from, для местонахождения — in.', 'Für die Verneinung folgt not auf be. Kurzformen sind isn’t und aren’t; bei I sagt man I’m not. From nennt die Herkunft, in den Aufenthaltsort.', 'Add not after be to make a negative. Common forms are isn’t and aren’t; with I, use I’m not. From introduces origin, while in gives location.'), example: 'I’m not from London. I am in Bern.' },
  ],
  vocabulary: [
    { word: 'I', translation: t('я', 'ich', 'I') }, { word: 'you', translation: t('ты / вы', 'du / Sie / ihr', 'you') },
    { word: 'we', translation: t('мы', 'wir', 'we') }, { word: 'be', translation: t('быть', 'sein', 'be') },
    { word: 'from', translation: t('из, о происхождении', 'aus, Herkunft', 'from') }, { word: 'student', translation: t('учащийся', 'Lernende/r', 'student') },
    { word: 'new', translation: t('новый', 'neu', 'new') }, { word: 'here', translation: t('здесь', 'hier', 'here') },
  ],
  examples: [
    { sentence: 'I am Alex.', translation: t('Я Алекс.', 'Ich bin Alex.', 'I am Alex.') },
    { sentence: 'We are new here.', translation: t('Мы здесь недавно.', 'Wir sind neu hier.', 'We are new here.') },
    { sentence: 'Is she from London?', translation: t('Она из Лондона?', 'Kommt sie aus London?', 'Is she from London?') },
    { sentence: 'They aren’t in class today.', translation: t('Их сегодня нет на занятии.', 'Sie sind heute nicht im Unterricht.', 'They aren’t in class today.') },
  ],
  reading: {
    passage: 'Hello! I am Alex. I am from London, but I am in Bern now. My friend is Mia. She is from Bristol. We are new students in an English class. Our teacher is Sam.',
    translation: t('Привет! Я Алекс. Я из Лондона, но сейчас нахожусь в Берне. Моя подруга — Миа. Она из Бристоля. Мы новые ученики в группе английского. Нашего преподавателя зовут Сэм.', 'Hallo! Ich bin Alex. Ich komme aus London, bin aber jetzt in Bern. Meine Freundin heisst Mia. Sie kommt aus Bristol. Wir sind neu im Englischkurs. Unsere Lehrperson heisst Sam.', 'Hello! I am Alex. I am from London, but I am in Bern now. My friend is Mia. She is from Bristol. We are new students in an English class. Our teacher is Sam.'),
    questions: [
      choice('en', 'read1', 'Where is Alex now?', ['In Bern.', 'In London.', 'In Bristol.', 'In Oxford.'], t('Сейчас Алекс в Берне.', 'Alex ist jetzt in Bern.', 'Alex is in Bern now.'), 'reading'),
      choice('en', 'read2', 'Where is Mia from?', ['Bristol.', 'Bern.', 'London.', 'Dublin.'], t('Миа из Бристоля.', 'Mia kommt aus Bristol.', 'Mia is from Bristol.'), 'reading'),
      choice('en', 'read3', 'Who is Sam?', ['The teacher.', 'Alex’s brother.', 'Mia’s sister.', 'A new student.'], t('Сэм — преподаватель группы.', 'Sam ist die Lehrperson des Kurses.', 'Sam is the class teacher.'), 'reading'),
    ],
  },
  exercises: [
    choice('en', 'practice1', 'I ___ a student.', ['am', 'is', 'are', 'be'], t('С I используется am.', 'Mit I steht am.', 'Use am with I.')),
    choice('en', 'practice2', 'She ___ new here.', ['is', 'am', 'are', 'be'], t('С she используется is.', 'Mit she steht is.', 'Use is with she.')),
    choice('en', 'practice3', '___ you from London?', ['Are', 'Is', 'Am', 'Be'], t('В вопросе с you используется are перед подлежащим.', 'In der Frage mit you steht are vor dem Subjekt.', 'In a question with you, put are before the subject.')),
    choice('en', 'practice4', 'Are you a student? — Yes, ___.', ['I am', 'I’m', 'I is', 'am I'], t('В положительном коротком ответе am не сокращают.', 'In einer positiven Kurzantwort wird am nicht verkürzt.', 'Do not contract am in an affirmative short answer.')),
  ],
  quiz: [
    choice('en', 'quiz1', 'We ___ in class.', ['are', 'is', 'am', 'be'], t('С we используется are.', 'Mit we steht are.', 'Use are with we.')),
    choice('en', 'quiz2', 'Mia ___ from Bristol.', ['is', 'are', 'am', 'be'], t('Миа — третье лицо единственного числа: is.', 'Mia ist die dritte Person Singular: is.', 'Mia is third person singular: is.')),
    choice('en', 'quiz3', '___ they new students?', ['Are', 'Is', 'Am', 'Be'], t('Вопрос с they начинается с are.', 'Die Frage mit they beginnt mit are.', 'A question with they begins with are.')),
    choice('en', 'quiz4', 'Which sentence is negative?', ['I am not from London.', 'I am from London.', 'Are you from London?', 'She is from London.'], t('Отрицание образовано с not.', 'Die Verneinung wird mit not gebildet.', 'Not makes the sentence negative.')),
    choice('en', 'quiz5', 'Where are you ___? — London.', ['from', 'at', 'on', 'to'], t('О происхождении спрашивают where … from.', 'Nach der Herkunft fragt man mit where … from.', 'Ask about origin with where … from.')),
  ],
};

export const sampleLessons: Record<LearningLanguage, Lesson> = { de: prepareGermanIntroduction(enrichIntroduction(de)), en: { ...enrichIntroduction(en), contentStatus: 'sample' } };
export const lessonCatalog: Record<LearningLanguage, Readonly<Record<string, Lesson>>> = { de: { [de.id]: sampleLessons.de, 'introduction-questions': prepareGermanIntroduction(introductionQuestions('de')), ...Object.fromEntries(germanIntroductionLessons.map(lesson => [lesson.id, lesson])) }, en: { [en.id]: sampleLessons.en, 'introduction-questions': { ...introductionQuestions('en'), contentStatus: 'sample' } } };
export function lessonKey(language: LearningLanguage, id: string) { return `${language}:${id}`; }
export function gradeQuestions(questions: readonly Question[], answers: Record<string, string>) {
  return { score: questions.filter(question => answers[question.id] === question.correct).length, total: questions.length };
}
