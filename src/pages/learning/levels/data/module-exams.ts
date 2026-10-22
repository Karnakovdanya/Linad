import { asTask, type ModuleExam, type Task } from '../tasks';
import { input, question } from './a1-builders';

const lessons = ['first-introductions', 'introduction-questions', 'a1-introductions-3', 'a1-introductions-4', 'a1-introductions-5'];
const groups: [string, string[], string, string][][] = [
  [
    ['Ihr ___ neu im Kurs.', ['seid', 'sind', 'ist', 'bist'], 'С ihr используется seid.', 'Ihr takes seid.'],
    ['Alex und Mia ___ hier.', ['sind', 'ist', 'bin', 'bist'], 'Два человека: sie sind.', 'Two people take sie sind.'],
    ['Ich ___ Nora.', ['bin', 'bist', 'ist', 'seid'], 'С ich используется bin.', 'Ich takes bin.'],
    ['___ Sie neu? (höflich)', ['Sind', 'Seid', 'Bist', 'Bin'], 'Вежливое Sie требует sind.', 'Polite Sie requires sind.'],
  ],
  [
    ['Welche Frage passt zu „Ja, ich bin neu“?', ['Bist du neu?', 'Wo bist du?', 'Wie heisst du?', 'Wer ist Mia?'], 'Да или нет — ответ на вопрос с глаголом в начале.', 'A yes/no reply answers a verb-first question.'],
    ['___ ist das? — Das ist Leo.', ['Wer', 'Wo', 'Wann', 'Woher'], 'Вопрос о человеке: wer.', 'Ask about a person with wer.'],
    ['Welche Frage ist richtig?', ['Wo wohnen Sie?', 'Wo Sie wohnen?', 'Wohnen wo Sie?', 'Sie wo wohnen?'], 'В прямом W-вопросе глагол после вопросительного слова.', 'A direct W-question puts the verb after the question word.'],
    ['Wie heisst du? — ___', ['Ich heisse Nora.', 'In Bern.', 'Ja, ich bin.', 'Aus Wien.'], 'Вопрос просит назвать имя.', 'The question asks for a name.'],
  ],
  [
    ['Wir ___ aus Wien.', ['kommen', 'kommt', 'kommst', 'komme'], 'С wir: kommen.', 'Wir takes kommen.'],
    ['Leo kommt aus Berlin. Jetzt wohnt er in Bern. Wo wohnt Leo?', ['In Bern.', 'In Berlin.', 'In Wien.', 'In Luzern.'], 'Берн — место жительства, Берлин — происхождение.', 'Bern is his residence; Berlin is his origin.'],
    ['Nora wohnt ___ Zürich.', ['in', 'aus', 'woher', 'wer'], 'Место жительства: wohnen in.', 'Residence uses wohnen in.'],
    ['Woher kommt Mia? — ___', ['Aus der Schweiz.', 'In der Schweiz.', 'Ich wohne.', 'Mia heissen.'], 'Для происхождения: aus der Schweiz.', 'For origin, use aus der Schweiz.'],
  ],
  [
    ['17 = ___', ['siebzehn', 'siebenzehn', 'siebzig', 'sieben'], 'В siebzehn нет en после sieben.', 'Siebzehn drops the en from sieben.'],
    ['16 = ___', ['sechzehn', 'sechszehn', 'sechzig', 'sechs'], 'В sechzehn нет s после sechs.', 'Sechzehn drops the s from sechs.'],
    ['Vorname: Leo. Nachname: Meier. Wie ist der Nachname?', ['Meier.', 'Leo.', 'Vorname.', 'Zwölf.'], 'Nachname — фамилия.', 'Nachname means surname.'],
    ['Was bedeutet „Buchstabieren Sie bitte“?', ['M – E – I – E – R.', 'Ich bin neu.', 'Ich wohne in Bern.', 'Auf Wiedersehen.'], 'Нужно назвать буквы имени или слова.', 'Spell the letters of the name or word.'],
  ],
  [
    ['Mia ist neu. ___ kommt aus Luzern.', ['Sie', 'Er', 'Wir', 'Ihr'], 'Местоимение sie относится к Миа.', 'Sie refers to Mia.'],
    ['Ich bin Nora ___ komme aus Wien.', ['und', 'wo', 'wer', 'aus'], 'Und соединяет сведения о том же лице.', 'Und links information about the same person.'],
    ['Was ist ein passender Anfang im Kurschat?', ['Hallo zusammen!', 'Viele Grüsse!', 'Bis bald!', 'Auf Wiedersehen!'], 'Hallo zusammen — приветствие группе.', 'Hallo zusammen is a greeting to a group.'],
    ['Leo schreibt: „Jetzt wohne ich in Bern.“ Was ist richtig?', ['Leo wohnt jetzt in Bern.', 'Leo kommt aus Bern.', 'Leo heisst Bern.', 'Leo ist ein Kurs.'], 'Wohnen описывает проживание, не происхождение.', 'Wohnen describes residence, not origin.'],
  ],
];
const bank: Task[] = groups.flatMap((group, i) => group.map(([stem, options, ru, en], j) => asTask(question(`de-a1-introductions-final-${i + 1}-${j + 1}`, stem, options, ru, en), lessons[i]!)));
bank.push(
  input(lessons[0]!, 'de-a1-introductions-final-1-5', 'gap', 'Du ___ im Kurs. (sein)', ['bist'], 'Du требует bist.', 'Du takes bist.'),
  input(lessons[1]!, 'de-a1-introductions-final-2-5', 'correction', 'Wie Sie heissen?', ['Wie heissen Sie?', 'Wie heißen Sie?'], 'В прямом вопросе глагол после wie.', 'In a direct question the verb follows wie.', true),
  input(lessons[2]!, 'de-a1-introductions-final-3-5', 'gap', 'Er ___ in Basel. (wohnen)', ['wohnt'], 'С er: wohnt.', 'Er takes wohnt.'),
  input(lessons[3]!, 'de-a1-introductions-final-4-5', 'gap', '20 = ___', ['zwanzig'], 'Двадцать — zwanzig.', 'Twenty is zwanzig.'),
  input(lessons[4]!, 'de-a1-introductions-final-5-5', 'gap', 'Nora und Leo ___ zusammen im Kurs. (sein)', ['sind'], 'Два человека: множественное число sind.', 'Two people require plural sind.'),
);
export const moduleExams: ModuleExam[] = [{ id: 'de-A1-introductions-final', language: 'de', level: 'A1', moduleId: 'introductions', bank, perLesson: 2 }];
export const findExam = (language: string, level: string, moduleId: string) => moduleExams.find(exam => exam.language === language && exam.level === level && exam.moduleId === moduleId);
