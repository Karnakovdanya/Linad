import type { LearningLanguage } from '../../../../domain/types';
import type { CefrLevel } from '../model';

// Editorial module outlines; no unpublished lesson is presented as completed content.
export const additionalModules: Record<LearningLanguage, Record<CefrLevel, string>> = {
  de: {
    A1: `numbers|Числа и время~Zahlen und Uhrzeit~Numbers and time|Даты, цены и договорённости о времени.~Datum, Preise und Zeitangaben.~Dates, prices and arranging times.
everyday-requests|Еда и простые просьбы~Essen und einfache Bitten~Food and simple requests|Möchten, покупки и заказ в кафе.~Möchten, Einkaufen und im Café bestellen.~Möchten, shopping and ordering in a café.
family|Семья и личные вещи~Familie und persönliche Dinge~Family and belongings|Притяжательные слова и описание близких.~Possessivartikel und Familie beschreiben.~Possessive determiners and describing family.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Повторение основных тем A1.~Die wichtigsten A1-Themen wiederholen.~Reviewing the main A1 topics.`,
    A2: `comparison|Сравнения и предпочтения~Vergleiche und Vorlieben~Comparisons and preferences|Komparativ, Superlativ и прилагательные.~Komparativ, Superlativ und Adjektive.~Comparatives, superlatives and adjectives.
appointments|Договорённости и услуги~Termine und Dienstleistungen~Appointments and services|Время, предлоги и повседневная переписка.~Zeitangaben, Präpositionen und Alltagskorrespondenz.~Time expressions, prepositions and everyday correspondence.
work|Работа и повседневная жизнь~Arbeit und Alltag~Work and everyday life|Обязанности, распорядок и опыт.~Aufgaben, Tagesablauf und Erfahrungen.~Responsibilities, routines and experiences.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Объединение основных тем A2.~Die wichtigsten A2-Themen verbinden.~Bringing the main A2 topics together.`,
    B1: `work-society|Работа и общество~Arbeit und Gesellschaft~Work and society|Профессиональная лексика и обсуждение актуальных тем.~Berufswortschatz und aktuelle Themen besprechen.~Work vocabulary and discussing current topics.
problem-solving|Проблемы и решения~Probleme und Lösungen~Problems and solutions|Жалобы, объяснения и договорённости.~Beschwerden, Erklärungen und Absprachen.~Complaints, explanations and agreements.
presentations|Презентации и диалоги~Präsentationen und Dialoge~Presentations and dialogues|Тексты презентаций и совместное планирование.~Präsentationstexte und gemeinsam planen.~Presentation scripts and planning together.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Повторение и комплексные задания B1.~Wiederholung und vernetzte B1-Aufgaben.~Review and integrated B1 practice.`,
    B2: `professional|Профессиональная коммуникация~Berufliche Kommunikation~Professional communication|Обсуждение решений и формальная переписка.~Entscheidungen besprechen und formell schreiben.~Discussing decisions and formal correspondence.
media|Медиа и достоверность~Medien und Glaubwürdigkeit~Media and credibility|Основная мысль, позиция и скрытые оценки.~Kernaussage, Standpunkt und implizite Wertungen.~Main ideas, stance and implied evaluation.
discussion|Дискуссии и компромиссы~Diskussionen und Kompromisse~Discussion and compromise|Уточнение позиции и поиск общего решения.~Standpunkte präzisieren und Lösungen aushandeln.~Clarifying positions and negotiating solutions.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Связная практика грамматики и текстов B2.~Grammatik und Texte auf B2 verknüpfen.~Integrated B2 grammar and text practice.`,
    C1: `discourse|Структура сложного текста~Aufbau komplexer Texte~Complex text structure|Связность, отсылки и развитие аргумента.~Kohärenz, Verweise und Argumententwicklung.~Cohesion, reference and developing an argument.
professional|Профессиональные переговоры~Berufliche Verhandlungen~Professional negotiation|Точные условия, возражения и компромиссы.~Präzise Bedingungen, Einwände und Kompromisse.~Precise conditions, objections and compromise.
idioms|Устойчивые выражения~Feste Wendungen~Fixed expressions|Коллокации и оттенки значения в контексте.~Kollokationen und Bedeutungsnuancen im Kontext.~Collocations and nuances in context.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Анализ и применение сложных конструкций.~Komplexe Strukturen analysieren und anwenden.~Analysing and applying complex structures.`,
  },
  en: {
    A1: `abilities|Умения и просьбы~Fähigkeiten und Bitten~Abilities and requests|Can/can’t, простые просьбы и ответы.~Can/can’t, einfache Bitten und Antworten.~Can/can’t, simple requests and replies.
family|Семья и принадлежность~Familie und Besitz~Family and possession|Have got, possessive ’s и притяжательные слова.~Have got, possessive ’s und Possessivwörter.~Have got, possessive ’s and possessive determiners.
time|Время и встречи~Uhrzeit und Verabredungen~Time and arrangements|Дни, даты и at/on/in.~Tage, Daten und at/on/in.~Days, dates and at/on/in.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Повторение основных тем A1.~Die wichtigsten A1-Themen wiederholen.~Reviewing the main A1 topics.`,
    A2: `experience|Жизненный опыт~Lebenserfahrung~Life experience|Present perfect с ever/never.~Present perfect mit ever/never.~Present perfect with ever/never.
services|Повседневные услуги~Dienstleistungen im Alltag~Everyday services|Вежливые просьбы с could и вопросы.~Höfliche Bitten mit could und Fragen.~Polite requests with could and questions.
travel|Поездки и договорённости~Reisen und Absprachen~Travel and arrangements|Предложения, приглашения и инструкции.~Vorschläge, Einladungen und Anweisungen.~Suggestions, invitations and instructions.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Объединение основных тем A2.~Die wichtigsten A2-Themen verbinden.~Bringing the main A2 topics together.`,
    B1: `modals|Советы и обязательства~Ratschläge und Verpflichtungen~Advice and obligations|Should, ought to, have to и must.~Should, ought to, have to und must.~Should, ought to, have to and must.
work|Работа и общение~Arbeit und Kommunikation~Work and communication|Письма, уточнения и рабочие договорённости.~E-Mails, Rückfragen und berufliche Absprachen.~Emails, clarification and workplace arrangements.
narratives|Связные рассказы~Zusammenhängend erzählen~Connected narratives|Past perfect и последовательность событий.~Past perfect und zeitliche Abfolge.~Past perfect and sequencing events.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Повторение и комплексные задания B1.~Wiederholung und vernetzte B1-Aufgaben.~Review and integrated B1 practice.`,
    B2: `verb-patterns|Глагольные конструкции~Verbkonstruktionen~Verb patterns|Gerund/infinitive и изменения смысла.~Gerund/Infinitiv und Bedeutungsunterschiede.~Gerunds/infinitives and changes in meaning.
lexis|Лексические связи~Lexikalische Verbindungen~Lexical connections|Phrasal verbs и сочетаемость в контексте.~Phrasal verbs und Kollokationen im Kontext.~Phrasal verbs and collocation in context.
writing|Письмо и обсуждение~Schreiben und Diskutieren~Writing and discussion|Регистр, структура текста и точные доводы.~Register, Textaufbau und präzise Argumente.~Register, text organisation and precise arguments.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Связная практика грамматики и текстов B2.~Grammatik und Texte auf B2 verknüpfen.~Integrated B2 grammar and text practice.`,
    C1: `discourse|Связность и акценты~Kohärenz und Akzente~Cohesion and emphasis|Ellipsis, substitution и информационная структура.~Ellipse, Substitution und Informationsstruktur.~Ellipsis, substitution and information structure.
negotiation|Переговоры и компромиссы~Verhandeln und Kompromisse~Negotiation and compromise|Точные оговорки, уступки и предложения.~Präzise Einschränkungen, Zugeständnisse und Vorschläge.~Precise qualifications, concessions and proposals.
analysis|Критическое чтение~Kritisches Lesen~Critical reading|Аргументация, подтекст и надёжность источника.~Argumentation, implizite Bedeutung und Quellenqualität.~Argument, implication and source reliability.
review|Итоговая практика~Abschliessende Praxis~Consolidation|Анализ и применение сложных конструкций.~Komplexe Strukturen analysieren und anwenden.~Analysing and applying complex structures.`,
  },
};
