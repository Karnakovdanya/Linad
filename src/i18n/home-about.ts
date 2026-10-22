import type { UiLanguage } from '../domain/types';

interface HomeAboutCopy {
  eyebrow: string;
  titleBefore: string;
  titleAfter: string;
  description: [string, string];
  benefits: [string, string][];
}

export const homeAboutCopy: Record<UiLanguage, HomeAboutCopy> = {
  ru: {
    eyebrow: 'О ПЛАТФОРМЕ', titleBefore: 'Что такое ', titleAfter: '?',
    description: [
      'LINAD — это платформа для изучения немецкого и английского языков с упором на реальную жизнь. Здесь ты можешь учиться по уровням A1–C1, изучать полезные фразы и диалоги для повседневных ситуаций, выполнять упражнения, сохранять слова и отслеживать свой прогресс.',
      'Если понадобится помощь, ты можешь найти преподавателя, а в Telegram-канале LINAD — дополнительные слова, фразы и материалы для обучения.',
    ],
    benefits: [
      ['Курсы A1–C1', 'Пошаговые уроки, темы и тесты.'],
      ['Личный прогресс', 'Отслеживай свои результаты.'],
      ['Реальные ситуации', 'Диалоги, фразы и слова из повседневной жизни.'],
      ['Преподаватели', 'Найди репетитора, если нужна помощь.'],
      ['Карточки и упражнения', 'Эффективное запоминание слов.'],
      ['Telegram-канал', 'Новые слова, фразы и полезные материалы.'],
    ],
  },
  de: {
    eyebrow: 'ÜBER DIE PLATTFORM', titleBefore: 'Was ist ', titleAfter: '?',
    description: [
      'LINAD ist eine Plattform zum Deutsch- und Englischlernen mit Fokus auf das echte Leben. Hier kannst du auf den Niveaus A1–C1 lernen, nützliche Sätze und Dialoge für Alltagssituationen entdecken, Übungen machen, Wörter speichern und deinen Fortschritt verfolgen.',
      'Wenn du Hilfe brauchst, kannst du eine Lehrkraft finden. Im Telegram-Kanal von LINAD gibt es zusätzliche Wörter, Sätze und Lernmaterialien.',
    ],
    benefits: [
      ['Kurse A1–C1', 'Schrittweise Lektionen, Themen und Tests.'],
      ['Dein Lernfortschritt', 'Behalte deine Ergebnisse im Blick.'],
      ['Echte Alltagssituationen', 'Dialoge, Sätze und Wörter aus dem Alltag.'],
      ['Lehrkräfte', 'Finde eine Lehrkraft, wenn du Hilfe brauchst.'],
      ['Karteikarten und Übungen', 'Wörter effektiv lernen und behalten.'],
      ['Telegram-Kanal', 'Neue Wörter, Sätze und nützliche Materialien.'],
    ],
  },
  en: {
    eyebrow: 'ABOUT THE PLATFORM', titleBefore: 'What is ', titleAfter: '?',
    description: [
      'LINAD is a platform for learning German and English with a focus on real life. Here you can study at levels A1–C1, explore useful phrases and dialogues for everyday situations, do exercises, save words and track your progress.',
      'If you need help, you can find a tutor. The LINAD Telegram channel offers extra words, phrases and learning materials.',
    ],
    benefits: [
      ['Courses A1–C1', 'Step-by-step lessons, topics and tests.'],
      ['Personal progress', 'Keep track of your results.'],
      ['Real-life situations', 'Dialogues, phrases and words from everyday life.'],
      ['Tutors', 'Find a tutor whenever you need help.'],
      ['Flashcards and exercises', 'Learn and remember words effectively.'],
      ['Telegram channel', 'New words, phrases and useful materials.'],
    ],
  },
};
