import type { LearningLanguage } from '../../../../domain/types';
import type { CefrLevel, CurriculumModule } from '../model';
import { text } from '../model';
import { additionalModules } from './curriculum-extension';

const definitions: Record<LearningLanguage, Record<CefrLevel, string>> = {
  de: {
    A1: `introductions|Знакомство и глагол sein~Sich vorstellen und das Verb sein~Introductions and the verb sein|Личные местоимения, имена и место жительства.~Personalpronomen, Namen und Wohnort.~Personal pronouns, names and where you live.
nouns|Существительные и артикли~Nomen und Artikel~Nouns and articles|Род, множественное число и Nominativ.~Genus, Plural und Nominativ.~Gender, plurals and the nominative case.
word-order|Предложения и вопросы~Sätze und Fragen~Sentences and questions|Позиция глагола, W-Fragen и вопросы без вопросительного слова.~Verbposition, W-Fragen und Ja-Nein-Fragen.~Verb position, W-questions and yes/no questions.
daily-verbs|Повседневные действия~Alltagshandlungen~Everyday actions|Präsens, отрицание и отделяемые приставки.~Präsens, Verneinung und trennbare Verben.~Present tense, negation and separable verbs.`,
    A2: `past|Рассказы о прошлом~Über Vergangenes sprechen~Talking about the past|Perfekt с haben и sein, частотный Präteritum.~Perfekt mit haben und sein, häufige Präteritumformen.~Perfect with haben and sein, common simple past forms.
cases|Предметы и направления~Objekte und Richtungen~Objects and directions|Akkusativ, Dativ и предлоги места.~Akkusativ, Dativ und lokale Präpositionen.~Accusative, dative and prepositions of place.
modals|Просьбы и обязанности~Bitten und Pflichten~Requests and obligations|Модальные глаголы, Imperativ и вежливые просьбы.~Modalverben, Imperativ und höfliche Bitten.~Modal verbs, imperatives and polite requests.
subclauses|Причины и планы~Gründe und Pläne~Reasons and plans|Weil, dass и позиция глагола в придаточном.~Weil, dass und Verbposition im Nebensatz.~Weil, dass and verb position in subordinate clauses.`,
    B1: `relative|Связные рассказы~Zusammenhängend erzählen~Connected narratives|Относительные предложения и временные союзы.~Relativsätze und temporale Konnektoren.~Relative clauses and time conjunctions.
conditional|Желания и советы~Wünsche und Ratschläge~Wishes and advice|Konjunktiv II в условиях, просьбах и советах.~Konjunktiv II in Bedingungen, Bitten und Ratschlägen.~Konjunktiv II for conditions, requests and advice.
passive|Процессы и правила~Abläufe und Regeln~Processes and rules|Vorgangspassiv в Präsens и Präteritum.~Vorgangspassiv im Präsens und Präteritum.~Process passive in present and simple past.
writing|Письма и мнения~Briefe und Meinungen~Letters and opinions|Связность, аргументы и структура повседневного письма.~Kohärenz, Argumente und Aufbau von Alltagsbriefen.~Cohesion, arguments and everyday correspondence.`,
    B2: `connectors|Сложные связи~Komplexe Verknüpfungen~Complex links|Je … desto, уступка и двухчастные союзы.~Je … desto, Konzession und zweiteilige Konnektoren.~Je … desto, concession and paired conjunctions.
passive-forms|Варианты пассива~Passivvarianten~Passive forms|Vorgangs- и Zustandspassiv, sein + zu.~Vorgangs- und Zustandspassiv, sein plus zu.~Process and state passive, sein plus zu.
nominal|Номинальный стиль~Nominalstil~Nominal style|Преобразования глагольных и именных конструкций.~Verbale und nominale Strukturen umformen.~Transforming verbal and nominal structures.
argument|Обоснованные мнения~Begründete Standpunkte~Reasoned opinions|Оценка аргументов, уточнения и модальные оттенки.~Argumente bewerten, Einschränkungen und modale Nuancen.~Evaluating arguments, qualifications and modal nuance.`,
    C1: `reported|Косвенная речь~Indirekte Rede~Reported speech|Konjunktiv I и разграничение фактов и сообщений.~Konjunktiv I und die Trennung von Fakten und Berichten.~Konjunktiv I and distinguishing facts from reports.
participles|Сжатые определения~Verdichtete Attribute~Condensed modifiers|Расширенные причастные определения и их раскрытие.~Erweiterte Partizipialattribute und ihre Auflösung.~Extended participial modifiers and their expansion.
academic|Аналитическое письмо~Analytisches Schreiben~Analytical writing|Синтез источников, оговорки и логика вывода.~Quellensynthese, Einschränkungen und Schlussfolgerungen.~Synthesising sources, qualifying claims and drawing conclusions.
register|Регистр и прагматика~Register und Pragmatik~Register and pragmatics|Точные формулировки, косвенность и речевое намерение.~Präzise Formulierungen, Indirektheit und kommunikative Absicht.~Precise wording, indirectness and communicative intent.`,
  },
  en: {
    A1: `introductions|Знакомство и глагол be~Sich vorstellen und das Verb be~Introductions and the verb be|Личные местоимения, am/is/are и короткие ответы.~Personalpronomen, am/is/are und Kurzantworten.~Personal pronouns, am/is/are and short answers.
articles|Предметы вокруг нас~Gegenstände um uns herum~Things around us|A/an, the, множественное число и this/these.~A/an, the, Plural und this/these.~A/an, the, plurals and this/these.
routines|Ежедневные привычки~Tägliche Gewohnheiten~Daily routines|Present simple, do/does и наречия частотности.~Simple present, do/does und Häufigkeitsadverbien.~Present simple, do/does and frequency adverbs.
places|Места и предметы~Orte und Gegenstände~Places and objects|There is/are и предлоги места.~There is/are und Ortspräpositionen.~There is/are and prepositions of place.`,
    A2: `past|События в прошлом~Ereignisse in der Vergangenheit~Past events|Past simple и past continuous в рассказе.~Simple past und past continuous beim Erzählen.~Past simple and past continuous in narratives.
quantity|Еда и количество~Essen und Mengen~Food and quantities|Исчисляемость, some/any, much/many и few/little.~Zählbarkeit, some/any, much/many und few/little.~Countability, some/any, much/many and few/little.
future|Планы и решения~Pläne und Entscheidungen~Plans and decisions|Going to, will и present continuous для будущего.~Going to, will und present continuous für die Zukunft.~Going to, will and present continuous for the future.
comparison|Сравнения и правила~Vergleiche und Regeln~Comparisons and rules|Comparatives, superlatives, must и have to.~Komparativ, Superlativ, must und have to.~Comparatives, superlatives, must and have to.`,
    B1: `perfect|Опыт и завершённое прошлое~Erfahrungen und abgeschlossene Vergangenheit~Experience and finished past|Present perfect и past simple, since и for.~Present perfect und simple past, since und for.~Present perfect versus past simple, since and for.
conditions|Условия и возможности~Bedingungen und Möglichkeiten~Conditions and possibilities|Zero, first и second conditional.~Zero, first und second conditional.~Zero, first and second conditionals.
relative|Описание людей и вещей~Menschen und Dinge beschreiben~Describing people and things|Defining и non-defining relative clauses.~Notwendige und ergänzende Relativsätze.~Defining and non-defining relative clauses.
reported|Передача сообщений~Nachrichten wiedergeben~Reporting messages|Reported speech и согласование времён.~Indirekte Rede und Zeitenverschiebung.~Reported speech and tense backshift.`,
    B2: `aspect|Время и аспект~Zeit und Aspekt~Tense and aspect|Perfect continuous и сопоставление временных перспектив.~Perfect continuous und zeitliche Perspektiven.~Perfect continuous and contrasting time perspectives.
passive|Процессы и услуги~Abläufe und Dienstleistungen~Processes and services|Passive voice и causative have/get.~Passiv und kausatives have/get.~Passive voice and causative have/get.
deduction|Выводы о прошлом~Schlussfolgerungen über Vergangenes~Deductions about the past|Must have, might have и другие perfect modals.~Must have, might have und weitere perfekte Modalformen.~Must have, might have and other perfect modals.
argument|Связная аргументация~Zusammenhängend argumentieren~Coherent argumentation|Контраргументы, связки и third conditional.~Gegenargumente, Verknüpfungen und third conditional.~Counterarguments, cohesive devices and the third conditional.`,
    C1: `emphasis|Инверсия и акценты~Inversion und Hervorhebung~Inversion and emphasis|Negative inversion и cleft sentences.~Negative Inversion und Spaltsätze.~Negative inversion and cleft sentences.
stance|Степень уверенности~Abstufungen der Sicherheit~Degrees of certainty|Hedging, stance и оценка источников.~Vorsichtige Formulierungen, Haltung und Quellenbewertung.~Hedging, stance and evaluating sources.
nominal|Академический стиль~Wissenschaftlicher Stil~Academic style|Номинализация и сложные именные группы.~Nominalisierung und komplexe Nominalgruppen.~Nominalisation and complex noun phrases.
register|Регистр и сочетаемость~Register und Kollokationen~Register and collocation|Точность выбора слов, идиомы и намерение автора.~Präzise Wortwahl, Idiome und Autorenabsicht.~Precise word choice, idioms and authorial intent.`,
  },
};
function triple(value: string) { const [ru = '', de = '', en = ''] = value.split('~'); return text(ru, de, en); }
export const curricula: Record<LearningLanguage, CurriculumModule[]> = Object.fromEntries(Object.entries(definitions).map(([language, levels]) => [language,
  Object.entries(levels).flatMap(([level, rows]) => `${rows}\n${additionalModules[language as LearningLanguage][level as CefrLevel]}`.split('\n').map((row, index) => {
    const [id = '', title = '', description = ''] = row.split('|');
    return { id, level: level as CefrLevel, title: triple(title), description: triple(description), icon: (['people', 'book', 'chat', 'graduation'] as const)[index % 4]!, lessonIds: level === 'A1' && id === 'introductions' ? ['first-introductions', 'introduction-questions', ...(language === 'de' ? ['a1-introductions-3', 'a1-introductions-4', 'a1-introductions-5'] : [])] : [] };
  })),
])) as Record<LearningLanguage, CurriculumModule[]>;
