import type { UiLanguage } from '../domain/types';

export const topicIds = ['about', 'learn', 'guide', 'level', 'save', 'telegram', 'tutors', 'author'] as const;
export type TopicId = typeof topicIds[number];
export type ActionId = 'learning' | 'languages' | 'situations' | 'placement' | 'profile' | 'words' | 'tutors' | 'author' | 'channel' | 'contact';
export interface Topic { question: string; subtitle: string; answer: string[]; keywords: string[] }
export interface AssistantCopy {
  name: string; subtitle: string; open: string; close: string; back: string; greeting: string; intro: string;
  placeholder: string; input: string; send: string; searching: string; unknown: string; helpNote: string;
  understood: string; great: string; topicsLabel: string;
  actions: Record<ActionId, string>; topics: Record<TopicId, Topic>;
}
const ru: AssistantCopy = {
  name: 'Лин', subtitle: 'Помощник LINAD', open: 'Открыть помощника Лина', close: 'Закрыть помощника', back: 'К вопросам',
  greeting: 'Привет! 👋', intro: 'Я Лин — твой помощник на LINAD. Чем могу помочь?',
  placeholder: 'Напиши свой вопрос…', input: 'Твой вопрос Лину', send: 'Найти ответ', searching: 'Ищу в готовых ответах…',
  unknown: 'Пока я не знаю ответа на этот вопрос. Попробуй выбрать одну из предложенных тем.',
  helpNote: 'Ответы из справки LINAD', understood: 'Спасибо, понятно', great: 'Отлично! Я рядом, если появится ещё вопрос.', topicsLabel: 'Чем может помочь Лин',
  actions: { learning: 'Перейти к обучению', languages: 'Выбрать язык', situations: 'Посмотреть ситуации', placement: 'Определить уровень', profile: 'Личный кабинет', words: 'Мои слова', tutors: 'Найти преподавателя', author: 'Об авторе', channel: 'Перейти в Telegram LINAD', contact: 'Написать автору в Telegram' },
  topics: {
    about: { question: 'Что такое LINAD?', subtitle: 'Краткое описание платформы',
      answer: ['LINAD — платформа для изучения немецкого и английского языков с упором на реальную жизнь.', 'Здесь можно выбрать уровень A1–C1, изучать доступные уроки, полезные фразы и диалоги, выполнять практические задания, сохранять слова и отслеживать свой прогресс. Учебная программа постепенно пополняется.'],
      keywords: ['linad', 'линад', 'платформ', 'что это', 'о проекте'] },
    learn: { question: 'Хочу изучать языки', subtitle: 'Выбор языка и начало обучения',
      answer: ['В разделе «Обучение» есть два пути: обучение по уровням и «Практика для жизни».', 'Для курса выбери немецкий или английский, язык объяснений и уровень. Для повседневной практики открой ситуации: там есть фразы, диалоги, словарь и задания. Начать можно без регистрации.'],
      keywords: ['изучать', 'изучени', 'учить', 'немецк', 'английск', 'начать', 'начал', 'с нуля', 'хочу учиться'] },
    guide: { question: 'Как пользоваться сайтом?', subtitle: 'Разделы и основные функции',
      answer: ['Открой «Обучение», чтобы выбрать курс по уровню или практическую ситуацию. В уроках переключай разделы материала и выполняй задания; в ситуациях можно включать нужные языки текста и сохранять слова.', 'В «Репетиторах» можно посмотреть профили и отправить заявку на занятие. В личном кабинете находятся обучение, сохранённые слова, избранные репетиторы и настройки.'],
      keywords: ['пользоваться', 'работает сайт', 'инструкц', 'навигац', 'разделы', 'функции сайта'] },
    level: { question: 'Как выбрать уровень?', subtitle: 'Курсы A1–C1 и рекомендации',
      answer: ['При настройке курса можно пройти диагностический тест или самостоятельно выбрать уровень A1, A2, B1, B2 или C1. Если только начинаешь, начни с A1.', 'Позже уровень можно поменять через «Изменить уровень». Самооценка уровня в профиле и цель — отдельные настройки: они не засчитывают уроки и тесты как пройденные.'],
      keywords: ['уров', 'a1', 'a2', 'b1', 'b2', 'c1', 'диагност', 'определен', 'определить', 'тест уровня'] },
    save: { question: 'Как сохранить слова и прогресс?', subtitle: 'Карточки, тесты и личный кабинет',
      answer: ['Нажимай кнопку сохранения рядом со словом в лексике урока или «Практике для жизни». Сохранённые слова находятся в личном кабинете, в разделе «Мои слова».', 'Гостевой прогресс хранится в этом браузере. После входа можно подтвердить перенос гостевых данных в аккаунт. Статус облачной синхронизации показан в личном кабинете; при ошибке LINAD сохраняет локальные данные. Открытие урока само по себе не завершает его.'],
      keywords: ['сохран', 'прогресс', 'словар', 'заклад', 'аккаунт', 'регистрац', 'кабинет', 'облако', 'синхрон', 'мои слова'] },
    telegram: { question: 'Зачем нужен Telegram-канал?', subtitle: 'Слова, фразы, материалы и новости',
      answer: ['В Telegram LINAD публикуются полезные слова, фразы, материалы и обновления, которые помогают продолжать изучение языков и оставаться на связи с проектом.', 'Канал открывается отдельно в Telegram. Подписка не обязательна для обучения на сайте.'],
      keywords: ['telegram', 'телеграм', 'канал', 'подпис', 'новост', 'материалы'] },
    tutors: { question: 'Как найти преподавателя?', subtitle: 'Поиск и связь с репетиторами',
      answer: ['Открой раздел «Репетиторы». Используй поиск по имени и фильтры по языку, уровню и стоимости, затем нажми «Подробнее». Демонстрационные профили отмечены Demo.', 'Кнопка «Запросить занятие» открывает форму заявки. После подтверждённой отправки администратор получает обращение и связывается с тобой по email. Оплата и время занятия обсуждаются лично; автоматического бронирования здесь нет.'],
      keywords: ['преподав', 'репетитор', 'учител', 'занятие', 'заявк', 'пробный урок', 'стоимость', 'цена'] },
    author: { question: 'Как связаться с автором?', subtitle: 'Вопросы, предложения, поддержка',
      answer: ['Автор и основатель LINAD — Daniil Karnakov. О проекте и его истории можно прочитать на странице «Об авторе».', 'С вопросом, предложением или идеей напиши Даниилу через его личный Telegram. Кнопка ниже открывает именно контакт автора.'],
      keywords: ['автор', 'даниил', 'карнаков', 'основател', 'связаться', 'контакт', 'поддержк', 'предложен'] },
  },
};
const de: AssistantCopy = {
  name: 'Lin', subtitle: 'LINAD-Assistent', open: 'Assistent Lin öffnen', close: 'Assistent schließen', back: 'Zu den Fragen',
  greeting: 'Hallo! 👋', intro: 'Ich bin Lin, dein Assistent auf LINAD. Wie kann ich dir helfen?',
  placeholder: 'Stelle deine Frage…', input: 'Deine Frage an Lin', send: 'Antwort finden', searching: 'Ich suche in den vorbereiteten Antworten…',
  unknown: 'Darauf habe ich noch keine Antwort. Wähle bitte eines der vorgeschlagenen Themen.',
  helpNote: 'Antworten aus der LINAD-Hilfe', understood: 'Danke, verstanden', great: 'Super! Ich bin da, wenn du noch eine Frage hast.', topicsLabel: 'Wie Lin helfen kann',
  actions: { learning: 'Zum Lernen', languages: 'Sprache wählen', situations: 'Situationen ansehen', placement: 'Niveau bestimmen', profile: 'Mein Konto', words: 'Meine Wörter', tutors: 'Lehrkraft finden', author: 'Über den Autor', channel: 'Zum LINAD-Telegram-Kanal', contact: 'Autor auf Telegram kontaktieren' },
  topics: {
    about: { question: 'Was ist LINAD?', subtitle: 'Die Plattform kurz erklärt',
      answer: ['LINAD ist eine Plattform zum Deutsch- und Englischlernen mit Fokus auf das echte Leben.', 'Du kannst ein Niveau von A1 bis C1 wählen, verfügbare Lektionen, nützliche Ausdrücke und Dialoge bearbeiten, Wörter speichern und deinen Fortschritt verfolgen. Das Lernangebot wird schrittweise erweitert.'],
      keywords: ['linad', 'plattform', 'projekt', 'was ist das'] },
    learn: { question: 'Ich möchte Sprachen lernen', subtitle: 'Sprache wählen und anfangen',
      answer: ['Unter „Lernen“ gibt es zwei Wege: Kurse nach Niveau und „Praxis für den Alltag“.', 'Für einen Kurs wählst du Deutsch oder Englisch, die Erklärungssprache und dein Niveau. Für Alltagspraxis öffnest du eine Situation mit Ausdrücken, Dialogen, Wortschatz und Aufgaben. Du kannst ohne Registrierung anfangen.'],
      keywords: ['lernen', 'anfang', 'beginnen', 'deutsch', 'englisch', 'sprachen', 'einsteiger'] },
    guide: { question: 'Wie benutze ich die Website?', subtitle: 'Bereiche und wichtige Funktionen',
      answer: ['Unter „Lernen“ wählst du einen Kurs nach Niveau oder eine Alltagssituation. In Lektionen wechselst du zwischen den Abschnitten und bearbeitest Aufgaben. In Situationen kannst du Textsprachen einblenden und Wörter speichern.', 'Unter „Lehrkräfte“ findest du Profile und kannst eine Unterrichtsanfrage senden. Dein Konto enthält deinen Lernbereich, gespeicherte Wörter, Lieblingslehrkräfte und Einstellungen.'],
      keywords: ['benutz', 'bedien', 'anleitung', 'navigation', 'funktionen', 'website funktioniert', 'bereiche'] },
    level: { question: 'Wie wähle ich mein Niveau?', subtitle: 'Kurse A1–C1 und Orientierung',
      answer: ['Bei der Kurseinrichtung kannst du einen Einstufungstest machen oder A1, A2, B1, B2 oder C1 selbst wählen. Wenn du ganz am Anfang stehst, beginne mit A1.', 'Später kannst du dein Kursniveau über „Niveau ändern“ wechseln. Die Selbsteinschätzung im Profil und dein Ziel sind davon getrennt: Sie schließen keine Lektionen oder Tests ab.'],
      keywords: ['niveau', 'einstuf', 'a1', 'a2', 'b1', 'b2', 'c1', 'sprachstand', 'level'] },
    save: { question: 'Wie speichere ich Wörter und Fortschritt?', subtitle: 'Wortschatz, Tests und dein Konto',
      answer: ['Nutze die Speichern-Schaltfläche neben einem Wort im Wortschatz einer Lektion oder in der Alltagspraxis. Gespeicherte Wörter findest du im Konto unter „Meine Wörter“.', 'Gastfortschritt bleibt in diesem Browser. Nach der Anmeldung kannst du die Übernahme der Gastdaten bestätigen. Dein Konto zeigt den Status der Cloud-Synchronisierung; bei einem Fehler bleiben lokale Daten erhalten. Das Öffnen einer Lektion allein schließt sie nicht ab.'],
      keywords: ['speicher', 'worter', 'wortschatz', 'fortschritt', 'konto', 'anmeld', 'registrier', 'synchron', 'cloud', 'lesezeichen'] },
    telegram: { question: 'Wozu dient der Telegram-Kanal?', subtitle: 'Wörter, Ausdrücke, Material und Neuigkeiten',
      answer: ['Im LINAD-Telegram-Kanal erscheinen nützliche Wörter, Ausdrücke, Materialien und Neuigkeiten. So kannst du weiterlernen und mit dem Projekt in Verbindung bleiben.', 'Der Kanal öffnet sich separat in Telegram. Ein Abonnement ist zum Lernen auf der Website nicht erforderlich.'],
      keywords: ['telegram', 'kanal', 'abonn', 'neuigkeiten', 'nachrichten', 'materialien'] },
    tutors: { question: 'Wie finde ich eine Lehrkraft?', subtitle: 'Lehrkräfte suchen und kontaktieren',
      answer: ['Öffne „Lehrkräfte“. Suche nach Namen und filtere nach Sprache, Niveau und Preis. Mit „Mehr erfahren“ öffnest du ein Profil. Beispielprofile sind mit Demo gekennzeichnet.', '„Unterricht anfragen“ öffnet ein Formular. Nach bestätigtem Versand erhält der Administrator deine Anfrage und meldet sich per E-Mail. Unterrichtszeit und Zahlung werden persönlich vereinbart; eine automatische Buchung gibt es nicht.'],
      keywords: ['lehrkraft', 'lehrer', 'tutor', 'unterricht', 'anfrage', 'probestunde', 'preis', 'kosten'] },
    author: { question: 'Wie kontaktiere ich den Autor?', subtitle: 'Fragen, Vorschläge und Unterstützung',
      answer: ['Autor und Gründer von LINAD ist Daniil Karnakov. Auf „Über den Autor“ erfährst du mehr über ihn und die Geschichte des Projekts.', 'Fragen, Vorschläge und Ideen kannst du Daniil über seinen persönlichen Telegram-Kontakt schicken. Die Schaltfläche unten öffnet diesen Kontakt.'],
      keywords: ['autor', 'grunder', 'daniil', 'karnakov', 'kontakt', 'support', 'vorschlag', 'unterstutzung'] },
  },
};
const en: AssistantCopy = {
  name: 'Lin', subtitle: 'LINAD assistant', open: 'Open assistant Lin', close: 'Close assistant', back: 'Back to questions',
  greeting: 'Hi! 👋', intro: 'I’m Lin, your assistant on LINAD. How can I help?',
  placeholder: 'Type your question…', input: 'Your question for Lin', send: 'Find an answer', searching: 'Searching the prepared answers…',
  unknown: 'I don’t have an answer to that question yet. Try choosing one of the suggested topics.',
  helpNote: 'Answers from the LINAD help guide', understood: 'Thanks, got it', great: 'Great! I’m here if you have another question.', topicsLabel: 'How Lin can help',
  actions: { learning: 'Go to learning', languages: 'Choose a language', situations: 'Explore situations', placement: 'Find your level', profile: 'My account', words: 'My words', tutors: 'Find a tutor', author: 'About the author', channel: 'Open LINAD on Telegram', contact: 'Contact the author on Telegram' },
  topics: {
    about: { question: 'What is LINAD?', subtitle: 'A quick introduction to the platform',
      answer: ['LINAD is a platform for learning German and English with a focus on real life.', 'You can choose a level from A1 to C1, study available lessons, useful phrases and dialogues, do practical exercises, save words and track your progress. The course content is being expanded gradually.'],
      keywords: ['linad', 'platform', 'project', 'what is this'] },
    learn: { question: 'I want to learn languages', subtitle: 'Choose a language and get started',
      answer: ['Under “Learning”, you can choose a course by level or “Practice for Everyday Life”.', 'For a course, choose German or English, your explanation language and your level. For everyday practice, open a situation with phrases, dialogues, vocabulary and exercises. You can get started without registering.'],
      keywords: ['learn', 'start', 'begin', 'german', 'english', 'language', 'beginner'] },
    guide: { question: 'How do I use the website?', subtitle: 'Sections and main features',
      answer: ['Open “Learning” to choose a course by level or an everyday situation. In a lesson, switch between the sections and complete the activities. In situations, you can turn text languages on or off and save words.', 'Under “Tutors”, you can view profiles and send a lesson request. Your account contains your learning, saved words, favourite tutors and settings.'],
      keywords: ['use the site', 'use the website', 'how it works', 'instructions', 'navigation', 'features', 'sections'] },
    level: { question: 'How do I choose my level?', subtitle: 'A1–C1 courses and guidance',
      answer: ['When setting up a course, you can take a placement test or choose A1, A2, B1, B2 or C1 yourself. If you’re just beginning, start with A1.', 'You can later use “Change level” to select another course level. Your self-assessed profile level and goal are separate settings: they do not mark any lessons or tests as completed.'],
      keywords: ['level', 'placement', 'a1', 'a2', 'b1', 'b2', 'c1', 'assessment', 'proficiency'] },
    save: { question: 'How do I save words and progress?', subtitle: 'Vocabulary, tests and your account',
      answer: ['Use the save button next to a word in a lesson’s vocabulary or in everyday practice. Saved words appear in your account under “My words”.', 'Guest progress stays in this browser. After signing in, you can confirm importing your guest data into your account. Your account shows the cloud sync status; local data is kept if syncing fails. Opening a lesson alone does not complete it.'],
      keywords: ['save', 'words', 'vocabulary', 'progress', 'bookmark', 'account', 'register', 'sign in', 'sync', 'cloud'] },
    telegram: { question: 'What is the Telegram channel for?', subtitle: 'Words, phrases, materials and news',
      answer: ['The LINAD Telegram channel shares useful words, phrases, learning materials and updates to help you keep learning and stay in touch with the project.', 'The channel opens separately in Telegram. Following it is optional for learning on the website.'],
      keywords: ['telegram', 'channel', 'subscribe', 'news', 'materials', 'updates'] },
    tutors: { question: 'How do I find a tutor?', subtitle: 'Find and contact a tutor',
      answer: ['Open “Tutors”. Search by name and filter by language, level and price, then open a profile with “View profile”. Example profiles are marked Demo.', '“Request a lesson” opens a form. After confirmed submission, the administrator receives your request and contacts you by email. Lesson times and payment are arranged personally; there is no automatic booking.'],
      keywords: ['tutor', 'teacher', 'instructor', 'lesson request', 'trial', 'price', 'cost', 'booking'] },
    author: { question: 'How do I contact the author?', subtitle: 'Questions, suggestions and support',
      answer: ['The author and founder of LINAD is Daniil Karnakov. “About the author” tells you more about him and the story behind the project.', 'For a question, suggestion or idea, contact Daniil through his personal Telegram account. The button below opens the author’s contact.'],
      keywords: ['author', 'founder', 'daniil', 'karnakov', 'contact', 'support', 'suggestion', 'feedback'] },
  },
};
export const assistantCopy = (language: UiLanguage) => ({ ru, de, en })[language];
export const topicActions: Record<TopicId, ActionId[]> = {
  about: ['learning', 'languages', 'situations'], learn: ['languages', 'situations'], guide: ['learning', 'profile', 'tutors'],
  level: ['placement', 'languages'], save: ['words', 'profile'], telegram: ['channel'], tutors: ['tutors'], author: ['contact', 'author'],
};
