import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const workMaterials = {
  'job-search': topicDraft({ participants: p.careers,
    phrases: `p01|Вы сейчас ищете сотрудников?|Suchen Sie zurzeit Mitarbeitende?|Are you hiring at the moment?
p02|Где можно посмотреть ваши вакансии?|Wo finde ich Ihre offenen Stellen?|Where can I find your vacancies?
p03|Можно отправить вам резюме?|Darf ich Ihnen meinen Lebenslauf schicken?|May I send you my CV?
p04|Какие документы нужны для отклика?|Welche Unterlagen brauche ich für die Bewerbung?|Which documents do I need to apply?
p05|Эта вакансия ещё открыта?|Ist diese Stelle noch frei?|Is this position still available?
p06|Кому адресовать заявление?|An wen soll ich die Bewerbung richten?|Who should I address my application to?
p07|Я ищу работу на неполный день.|Ich suche eine Teilzeitstelle.|I am looking for a part-time job.
p08|У меня есть опыт в этой сфере.|Ich habe Erfahrung in diesem Bereich.|I have experience in this field.
p09|Какие навыки для вас особенно важны?|Welche Fähigkeiten sind Ihnen besonders wichtig?|Which skills are particularly important to you?
p10|Возможна ли работа без опыта?|Ist ein Einstieg ohne Erfahrung möglich?|Is it possible to start without experience?
p11|Какой уровень немецкого требуется?|Welche Deutschkenntnisse werden vorausgesetzt?|What level of German is required?
p12|Можно работать удалённо?|Ist Homeoffice möglich?|Is working from home possible?
p13|Когда заканчивается приём заявок?|Bis wann kann ich mich bewerben?|What is the application deadline?
p14|Я могу приступить со следующего месяца.|Ich kann ab nächsten Monat anfangen.|I can start next month.
p15|Спасибо за информацию о вакансии.|Vielen Dank für die Informationen zur Stelle.|Thank you for the information about the position.`,
    replies: `r01|Да, у нас есть несколько вакансий.|Ja, wir haben mehrere offene Stellen.|Yes, we have several vacancies.
r02|В разделе «Карьера» на нашем сайте.|Im Bereich Karriere auf unserer Website.|In the careers section of our website.
r03|Да, отправьте его по электронной почте.|Ja, schicken Sie ihn bitte per E-Mail.|Yes, please send it by email.
r04|Резюме и краткое сопроводительное письмо.|Einen Lebenslauf und ein kurzes Motivationsschreiben.|A CV and a short cover letter.
r05|Да, мы ещё рассматриваем заявки.|Ja, wir prüfen noch Bewerbungen.|Yes, we are still reviewing applications.
r06|Отделу кадров, пожалуйста.|An die Personalabteilung, bitte.|To the human resources department, please.`,
    dialogues: `d01|Узнать о вакансиях|Nach offenen Stellen fragen|Asking about vacancies
d02|Отправить документы|Unterlagen einreichen|Submitting documents
d03|Уточнить контакт|Die Kontaktperson klären|Checking the contact person`,
    words: `w01|Вакансия|die offene Stelle|Vacancy
w02|Резюме|der Lebenslauf|CV
w03|Заявка на работу|die Bewerbung|Job application
w04|Сопроводительное письмо|das Motivationsschreiben|Cover letter
w05|Работодатель|der Arbeitgeber|Employer
w06|Соискатель|der Bewerber|Applicant
w07|Опыт работы|die Berufserfahrung|Work experience
w08|Квалификация|die Qualifikation|Qualification
w09|Навык|die Fähigkeit|Skill
w10|Отдел кадров|die Personalabteilung|Human resources department
w11|Полная занятость|die Vollzeit|Full-time employment
w12|Неполная занятость|die Teilzeit|Part-time employment
w13|Срок подачи заявки|die Bewerbungsfrist|Application deadline
w14|Объявление о работе|das Stelleninserat|Job advertisement
w15|Профессия|der Beruf|Occupation
w16|Отрасль|die Branche|Industry
w17|Рекомендация|die Referenz|Reference
w18|Справка с работы|das Arbeitszeugnis|Employment reference
w19|Требование|die Anforderung|Requirement
w20|Контактное лицо|die Ansprechperson|Contact person` }),
  'interview-preparation': topicDraft({ participants: p.applicant,
    phrases: `p01|Во сколько начнётся собеседование?|Um wie viel Uhr beginnt das Vorstellungsgespräch?|What time does the interview start?
p02|Где мне отметиться по прибытии?|Wo soll ich mich bei der Ankunft melden?|Where should I check in when I arrive?
p03|Что мне взять с собой?|Was soll ich mitbringen?|What should I bring?
p04|Нужно подготовить презентацию?|Soll ich eine Präsentation vorbereiten?|Should I prepare a presentation?
p05|Собеседование будет по видеосвязи?|Findet das Gespräch per Video statt?|Will the interview be by video call?
p06|Можете отправить ссылку ещё раз?|Könnten Sie mir den Link noch einmal schicken?|Could you send me the link again?
p07|Я хочу лучше узнать вашу компанию.|Ich möchte Ihr Unternehmen besser kennenlernen.|I would like to learn more about your company.
p08|Я подготовлю примеры из своей работы.|Ich werde Beispiele aus meiner Arbeit vorbereiten.|I will prepare examples from my work.
p09|Как долго продлится встреча?|Wie lange dauert das Gespräch ungefähr?|How long will the interview take approximately?
p10|Кто будет участвовать во встрече?|Wer nimmt am Gespräch teil?|Who will take part in the interview?
p11|На каком языке пройдёт собеседование?|In welcher Sprache findet das Gespräch statt?|What language will the interview be in?
p12|Я заранее проверю камеру и микрофон.|Ich werde Kamera und Mikrofon vorher testen.|I will test my camera and microphone beforehand.
p13|Можно уточнить требования к должности?|Könnten Sie die Anforderungen an die Stelle genauer erklären?|Could you explain the job requirements in more detail?
p14|Я подготовлю вопросы о команде.|Ich werde Fragen zum Team vorbereiten.|I will prepare questions about the team.
p15|Благодарю за приглашение на встречу.|Vielen Dank für die Einladung zum Gespräch.|Thank you for inviting me to the interview.`,
    replies: `r01|В десять утра, в среду.|Am Mittwoch um zehn Uhr morgens.|At ten on Wednesday morning.
r02|Подойдите, пожалуйста, на ресепшен.|Melden Sie sich bitte am Empfang.|Please check in at reception.
r03|Возьмите резюме и свои вопросы.|Bringen Sie Ihren Lebenslauf und Ihre Fragen mit.|Bring your CV and your questions.
r04|Нет, отдельная презентация не нужна.|Nein, eine eigene Präsentation ist nicht nötig.|No, a separate presentation is not necessary.
r05|Да, мы встретимся онлайн.|Ja, wir treffen uns online.|Yes, we will meet online.
r06|Конечно, отправлю её сегодня.|Natürlich, ich schicke ihn Ihnen heute.|Of course, I will send it to you today.`,
    dialogues: `d01|Время и место|Zeit und Ort|Time and place
d02|Что подготовить|Was vorzubereiten ist|What to prepare
d03|Онлайн-встреча|Das Onlinegespräch|The online interview`,
    words: `w01|Собеседование|das Vorstellungsgespräch|Job interview
w02|Приглашение|die Einladung|Invitation
w03|Подготовка|die Vorbereitung|Preparation
w04|Компания|das Unternehmen|Company
w05|Должность|die Position|Position
w06|Команда|das Team|Team
w07|Презентация|die Präsentation|Presentation
w08|Пример|das Beispiel|Example
w09|Сильная сторона|die Stärke|Strength
w10|Слабая сторона|die Schwäche|Weakness
w11|Вопрос|die Frage|Question
w12|Ответ|die Antwort|Answer
w13|Видеозвонок|der Videoanruf|Video call
w14|Микрофон|das Mikrofon|Microphone
w15|Камера|die Kamera|Camera
w16|Ссылка|der Link|Link
w17|Ресепшен|der Empfang|Reception
w18|Участник|die teilnehmende Person|Participant
w19|Заметка|die Notiz|Note
w20|Продолжительность|die Dauer|Duration` }),
  'employer-interview': topicDraft({ participants: p.applicant,
    phrases: `p01|Спасибо, что нашли для меня время.|Danke, dass Sie sich Zeit für mich nehmen.|Thank you for taking the time to meet me.
p02|Можно кратко рассказать о своём опыте?|Darf ich kurz von meiner Erfahrung erzählen?|May I briefly tell you about my experience?
p03|Какие задачи входят в эту должность?|Welche Aufgaben gehören zu dieser Stelle?|What duties does this position involve?
p04|Как проходит обучение новых сотрудников?|Wie werden neue Mitarbeitende eingearbeitet?|How are new employees trained?
p05|Каковы следующие этапы отбора?|Wie geht es im Auswahlverfahren weiter?|What are the next steps in the selection process?
p06|Когда можно ожидать ваш ответ?|Wann kann ich mit einer Rückmeldung rechnen?|When can I expect to hear from you?
p07|На прежней работе я отвечал за клиентов.|Bei meiner letzten Stelle war ich für die Kundenbetreuung zuständig.|In my previous role I was responsible for customer service.
p08|Мне нравится решать сложные задачи.|Ich löse gerne anspruchsvolle Aufgaben.|I enjoy solving challenging problems.
p09|Я хорошо работаю в команде.|Ich arbeite gut im Team.|I work well in a team.
p10|Я хочу развиваться в этой области.|Ich möchte mich in diesem Bereich weiterentwickeln.|I would like to develop in this field.
p11|Можете привести пример обычного рабочего дня?|Können Sie einen typischen Arbeitstag beschreiben?|Could you describe a typical working day?
p12|Как вы оцениваете успех в этой роли?|Woran messen Sie den Erfolg in dieser Position?|How do you measure success in this role?
p13|Можно обсудить зарплатные ожидания?|Können wir über die Lohnvorstellungen sprechen?|Could we discuss salary expectations?
p14|Мне нужно уточнить дату выхода на работу.|Ich muss den möglichen Eintrittstermin noch klären.|I still need to confirm my possible starting date.
p15|Эта работа меня очень интересует.|Diese Stelle interessiert mich sehr.|I am very interested in this position.`,
    replies: `r01|Мы рады познакомиться с вами.|Wir freuen uns, Sie kennenzulernen.|We are pleased to meet you.
r02|Да, расскажите о последней работе.|Ja, erzählen Sie uns von Ihrer letzten Stelle.|Yes, tell us about your last job.
r03|Вы будете помогать клиентам и готовить отчёты.|Sie betreuen Kunden und erstellen Berichte.|You will support customers and prepare reports.
r04|Вначале вам будет помогать коллега.|Am Anfang begleitet Sie eine Person aus dem Team.|A team member will support you at first.
r05|Затем мы пригласим кандидатов на вторую встречу.|Danach laden wir die Bewerbenden zu einem zweiten Gespräch ein.|We will then invite candidates to a second interview.
r06|Мы свяжемся с вами на следующей неделе.|Wir melden uns nächste Woche bei Ihnen.|We will contact you next week.`,
    dialogues: `d01|Начало собеседования|Gesprächsbeginn|Starting the interview
d02|Обязанности и обучение|Aufgaben und Einarbeitung|Duties and training
d03|Следующие шаги|Die nächsten Schritte|Next steps`,
    words: `w01|Обязанность|die Aufgabe|Duty
w02|Ответственность|die Verantwortung|Responsibility
w03|Зарплата|der Lohn|Salary
w04|Ожидание|die Erwartung|Expectation
w05|Отбор|die Auswahl|Selection
w06|Ответ работодателя|die Rückmeldung|Employer feedback
w07|Дата выхода|der Eintrittstermin|Starting date
w08|Введение в работу|die Einarbeitung|Induction
w09|Развитие|die Entwicklung|Development
w10|Клиент|die Kundin / der Kunde|Customer
w11|Отчёт|der Bericht|Report
w12|Результат|das Ergebnis|Result
w13|Успех|der Erfolg|Success
w14|Сотрудничество|die Zusammenarbeit|Cooperation
w15|Руководство|die Führung|Leadership
w16|Опыт|die Erfahrung|Experience
w17|Мотивация|die Motivation|Motivation
w18|Решение|die Lösung|Solution
w19|Рабочий день|der Arbeitstag|Working day
w20|Кандидат|die Kandidatin / der Kandidat|Candidate` }),
  'first-working-day': topicDraft({ participants: p.colleague,
    phrases: `p01|Сегодня мой первый рабочий день.|Heute ist mein erster Arbeitstag.|Today is my first day at work.
p02|Где находится моё рабочее место?|Wo ist mein Arbeitsplatz?|Where is my workstation?
p03|Как войти в рабочую систему?|Wie melde ich mich im System an?|How do I log in to the work system?
p04|Кто поможет с доступом?|Wer kann mir mit dem Zugang helfen?|Who can help me with access?
p05|Когда у нас обеденный перерыв?|Wann haben wir Mittagspause?|When do we have our lunch break?
p06|Можно присоединиться к вам за обедом?|Darf ich mich beim Mittagessen zu euch setzen?|May I join you for lunch?
p07|Приятно познакомиться с командой.|Ich freue mich, das Team kennenzulernen.|I am pleased to meet the team.
p08|Кому я могу задавать вопросы?|An wen kann ich mich mit Fragen wenden?|Who can I ask if I have questions?
p09|Где можно оставить личные вещи?|Wo kann ich meine persönlichen Sachen lassen?|Where can I leave my personal belongings?
p10|Мне нужен пропуск.|Ich brauche einen Badge.|I need an access badge.
p11|Покажите, пожалуйста, как работает принтер.|Zeig mir bitte, wie der Drucker funktioniert.|Please show me how the printer works.
p12|Какая задача у меня первая?|Was ist meine erste Aufgabe?|What is my first task?
p13|Можно записать эти инструкции?|Darf ich mir diese Anweisungen notieren?|May I write down these instructions?
p14|Где находится комната для встреч?|Wo ist der Sitzungsraum?|Where is the meeting room?
p15|Спасибо за помощь в первый день.|Danke für deine Hilfe an meinem ersten Tag.|Thank you for helping me on my first day.`,
    replies: `r01|Добро пожаловать в нашу команду!|Willkommen in unserem Team!|Welcome to our team!
r02|Твой стол возле окна.|Dein Schreibtisch ist beim Fenster.|Your desk is by the window.
r03|Используй данные из приветственного письма.|Verwende die Angaben aus der Begrüssungsmail.|Use the details in your welcome email.
r04|Наша IT-служба поможет тебе.|Unser IT-Support hilft dir.|Our IT support team will help you.
r05|Обычно мы обедаем в двенадцать.|Wir machen meistens um zwölf Mittagspause.|We usually have lunch at twelve.
r06|Конечно, пойдём вместе.|Natürlich, wir gehen zusammen.|Of course, let us go together.`,
    dialogues: `d01|Знакомство с рабочим местом|Den Arbeitsplatz kennenlernen|Finding your workstation
d02|Доступ к системе|Zugang zum System|System access
d03|Обед с коллегами|Mittagessen mit dem Team|Lunch with colleagues`,
    words: `w01|Рабочее место|der Arbeitsplatz|Workstation
w02|Стол|der Schreibtisch|Desk
w03|Пропуск|der Badge|Access badge
w04|Пароль|das Passwort|Password
w05|Имя пользователя|der Benutzername|Username
w06|Доступ|der Zugang|Access
w07|Принтер|der Drucker|Printer
w08|Компьютер|der Computer|Computer
w09|Инструкция|die Anweisung|Instruction
w10|Перерыв|die Pause|Break
w11|Обед|das Mittagessen|Lunch
w12|Комната для встреч|der Sitzungsraum|Meeting room
w13|Коллега|die Kollegin / der Kollege|Colleague
w14|Поддержка IT|der IT-Support|IT support
w15|Электронное письмо|die E-Mail|Email
w16|Шкафчик|das Schliessfach|Locker
w17|Вход|der Eingang|Entrance
w18|Выход|der Ausgang|Exit
w19|Расписание|der Zeitplan|Schedule
w20|Знакомство|das Kennenlernen|Getting acquainted` }),
  'workplace-communication': topicDraft({ participants: p.colleague,
    phrases: `p01|У тебя есть минутка?|Hast du kurz Zeit?|Do you have a moment?
p02|Можешь объяснить эту задачу ещё раз?|Kannst du mir diese Aufgabe noch einmal erklären?|Could you explain this task to me again?
p03|Что сейчас важнее всего?|Was hat im Moment die höchste Priorität?|What is the top priority at the moment?
p04|К какому сроку нужен отчёт?|Bis wann brauchst du den Bericht?|When do you need the report?
p05|Мне нужна помощь с проектом.|Ich brauche Hilfe bei dem Projekt.|I need help with the project.
p06|Можем обсудить это после встречи?|Können wir das nach der Sitzung besprechen?|Can we discuss this after the meeting?
p07|Я закончил свою часть работы.|Ich bin mit meinem Teil der Arbeit fertig.|I have finished my part of the work.
p08|Я не совсем понял последнее замечание.|Ich habe die letzte Bemerkung nicht ganz verstanden.|I did not quite understand the last comment.
p09|Я предлагаю другой подход.|Ich schlage eine andere Vorgehensweise vor.|I suggest a different approach.
p10|Можно получить обратную связь?|Kann ich eine Rückmeldung bekommen?|Could I get some feedback?
p11|Я допустил ошибку и исправлю её.|Mir ist ein Fehler passiert, den ich korrigieren werde.|I made a mistake and will correct it.
p12|Давай распределим задачи.|Lass uns die Aufgaben aufteilen.|Let us divide up the tasks.
p13|Я сообщу руководителю о задержке.|Ich informiere die Teamleitung über die Verzögerung.|I will inform the team leader about the delay.
p14|Спасибо за конструктивный совет.|Danke für den hilfreichen Hinweis.|Thank you for the helpful suggestion.
p15|Можешь прислать итог встречи?|Kannst du mir die Zusammenfassung der Sitzung schicken?|Could you send me the meeting summary?`,
    replies: `r01|Да, чем я могу помочь?|Ja, wie kann ich dir helfen?|Yes, how can I help?
r02|Конечно, давай посмотрим вместе.|Natürlich, schauen wir es gemeinsam an.|Of course, let us look at it together.
r03|Сначала нужно ответить клиенту.|Zuerst müssen wir dem Kunden antworten.|First we need to reply to the customer.
r04|Пожалуйста, до завтрашнего обеда.|Bitte bis morgen Mittag.|By tomorrow lunchtime, please.
r05|Я помогу проверить данные.|Ich helfe dir, die Daten zu prüfen.|I will help you check the data.
r06|Да, я зайду к тебе после встречи.|Ja, ich komme nach der Sitzung zu dir.|Yes, I will come over after the meeting.`,
    dialogues: `d01|Уточнить задачу|Eine Aufgabe klären|Clarifying a task
d02|Приоритеты и сроки|Prioritäten und Termine|Priorities and deadlines
d03|Попросить о помощи|Um Hilfe bitten|Asking for help`,
    words: `w01|Совещание|die Sitzung|Meeting
w02|Проект|das Projekt|Project
w03|Срок|der Termin|Deadline
w04|Приоритет|die Priorität|Priority
w05|Обратная связь|die Rückmeldung|Feedback
w06|Ошибка|der Fehler|Mistake
w07|Исправление|die Korrektur|Correction
w08|Задержка|die Verzögerung|Delay
w09|Предложение|der Vorschlag|Suggestion
w10|Данные|die Daten|Data
w11|Обсуждение|die Besprechung|Discussion
w12|Итог|die Zusammenfassung|Summary
w13|Руководитель команды|die Teamleitung|Team leader
w14|Распределение задач|die Aufgabenverteilung|Task allocation
w15|Сотрудник|die Mitarbeiterin / der Mitarbeiter|Employee
w16|Договорённость|die Vereinbarung|Agreement
w17|Сообщение|die Nachricht|Message
w18|Проверка|die Prüfung|Check
w19|Поддержка|die Unterstützung|Support
w20|Подход|die Vorgehensweise|Approach` }),
  'schedule-leave-sickness': topicDraft({ participants: p.manager,
    phrases: `p01|Где можно посмотреть рабочий график?|Wo kann ich den Dienstplan sehen?|Where can I see the work rota?
p02|Можно поменяться сменами с коллегой?|Darf ich mit einer Kollegin die Schicht tauschen?|May I swap shifts with a colleague?
p03|Я хочу подать заявление на отпуск.|Ich möchte Ferien beantragen.|I would like to request some leave.
p04|Эти даты подходят команде?|Passen diese Daten für das Team?|Do these dates work for the team?
p05|Я заболел и сегодня не выйду на работу.|Ich bin krank und kann heute nicht zur Arbeit kommen.|I am ill and cannot come to work today.
p06|Нужно ли мне предоставить справку от врача?|Brauche ich ein Arztzeugnis?|Do I need to provide a medical certificate?
p07|Во сколько начинается моя смена?|Wann beginnt meine Schicht?|What time does my shift start?
p08|Можно сегодня начать немного позже?|Darf ich heute etwas später anfangen?|May I start a little later today?
p09|Как отмечать рабочее время?|Wie erfasse ich meine Arbeitszeit?|How do I record my working hours?
p10|Я сообщил о болезни руководителю.|Ich habe mich bei der Teamleitung krankgemeldet.|I have informed the team leader that I am ill.
p11|Когда нужно сообщить дату возвращения?|Wann soll ich meinen Rückkehrtermin mitteilen?|When should I report my return date?
p12|Кто меня заменит во время отпуска?|Wer übernimmt meine Aufgaben während der Ferien?|Who will cover my duties while I am on leave?
p13|Я передам текущие задачи перед отпуском.|Ich werde meine laufenden Aufgaben vor den Ferien übergeben.|I will hand over my current tasks before my leave.
p14|Можно уточнить правила сверхурочной работы?|Können Sie die Regeln für Überstunden erklären?|Could you explain the rules on overtime?
p15|Я снова могу работать с понедельника.|Ich kann ab Montag wieder arbeiten.|I can return to work on Monday.`,
    replies: `r01|Он находится во внутренней системе.|Er ist im internen System hinterlegt.|It is in the internal system.
r02|Сначала согласуйте это со мной.|Sprechen Sie das bitte zuerst mit mir ab.|Please agree it with me first.
r03|Пожалуйста, укажите желаемые даты.|Geben Sie bitte die gewünschten Daten an.|Please enter your preferred dates.
r04|Я проверю план отпусков и отвечу.|Ich prüfe den Ferienplan und gebe Ihnen Bescheid.|I will check the leave calendar and let you know.
r05|Спасибо за сообщение, поправляйтесь.|Danke für die Nachricht, gute Besserung.|Thank you for letting me know. Get well soon.
r06|Я уточню правила у отдела кадров.|Ich kläre die Regelung mit der Personalabteilung.|I will check the policy with human resources.`,
    dialogues: `d01|Рабочие смены|Die Arbeitsschichten|Work shifts
d02|Заявление на отпуск|Ferien beantragen|Requesting leave
d03|Сообщение о болезни|Sich krankmelden|Calling in sick`,
    words: `w01|График смен|der Dienstplan|Work rota
w02|Смена|die Schicht|Shift
w03|Рабочее время|die Arbeitszeit|Working hours
w04|Отпуск|die Ferien|Annual leave
w05|Заявление на отпуск|der Ferienantrag|Leave request
w06|Больничный лист|das Arztzeugnis|Medical certificate
w07|Отсутствие|die Abwesenheit|Absence
w08|Возвращение|die Rückkehr|Return
w09|Замена|die Stellvertretung|Cover
w10|Сверхурочная работа|die Überstunden|Overtime
w11|Учёт времени|die Zeiterfassung|Time recording
w12|Выходной|der freie Tag|Day off
w13|Праздничный день|der Feiertag|Public holiday
w14|Передача дел|die Übergabe|Handover
w15|Согласование|die Absprache|Coordination
w16|Разрешение|die Bewilligung|Approval
w17|Болезнь|die Krankheit|Illness
w18|Выздоровление|die Genesung|Recovery
w19|Ранняя смена|der Frühdienst|Early shift
w20|Поздняя смена|der Spätdienst|Late shift` }),
};
