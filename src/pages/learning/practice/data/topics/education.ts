import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const educationMaterials = {
  'choosing-programme': topicDraft({ participants: p.school,
    phrases: `p01|Я ищу подходящий курс немецкого.|Ich suche einen passenden Deutschkurs.|I am looking for a suitable German course.
p02|Какие уровни вы предлагаете?|Welche Niveaus bieten Sie an?|Which levels do you offer?
p03|Можно узнать содержание программы?|Kann ich mehr über die Kursinhalte erfahren?|Could I learn more about the course content?
p04|Есть занятия по вечерам?|Gibt es Abendkurse?|Are there evening classes?
p05|Можно посетить пробное занятие?|Kann ich eine Probelektion besuchen?|May I attend a trial lesson?
p06|Как определить подходящую группу?|Wie finde ich die passende Gruppe?|How do I find the right group?
p07|Я хочу узнать о профессиональном обучении.|Ich möchte mich über eine Berufsausbildung informieren.|I would like information about vocational training.
p08|Курс проходит очно или онлайн?|Findet der Kurs vor Ort oder online statt?|Is the course in person or online?
p09|Сколько человек в группе?|Wie viele Personen sind in der Gruppe?|How many people are in the group?
p10|Сколько длится программа?|Wie lange dauert das Programm?|How long does the programme last?
p11|Какие знания нужны для поступления?|Welche Vorkenntnisse werden vorausgesetzt?|What prior knowledge is required?
p12|Материалы входят в стоимость?|Sind die Materialien im Preis enthalten?|Are materials included in the price?
p13|Можно сравнить две программы?|Kann ich zwei Programme vergleichen?|Could I compare two programmes?
p14|Есть консультация по выбору курса?|Gibt es eine Beratung zur Kurswahl?|Is there advice on choosing a course?
p15|Пожалуйста, пришлите описание программы.|Schicken Sie mir bitte die Programmbeschreibung.|Please send me the programme description.`,
    replies: `r01|Какой у вас сейчас уровень?|Welches Niveau haben Sie zurzeit?|What level are you at now?
r02|Я покажу вам список наших курсов.|Ich zeige Ihnen unsere Kursübersicht.|I will show you our course list.
r03|Конечно, вот описание модулей.|Natürlich, hier ist die Modulbeschreibung.|Of course, here is the module description.
r04|Да, есть группы по будним вечерам.|Ja, wir haben Gruppen an Werktagabenden.|Yes, we have groups on weekday evenings.
r05|Я проверю возможность пробного посещения.|Ich prüfe, ob ein Probebesuch möglich ist.|I will check whether a trial visit is possible.
r06|Мы можем обсудить ваш опыт и цели.|Wir können Ihre Erfahrung und Ziele besprechen.|We can discuss your experience and goals.`,
    dialogues: `d01|Выбрать языковой курс|Einen Sprachkurs auswählen|Choosing a language course
d02|Содержание и расписание|Inhalte und Kurszeiten|Content and class times
d03|Найти свою группу|Die passende Gruppe finden|Finding the right group`,
    words: `w01|Курс|der Kurs|Course
w02|Программа|das Programm|Programme
w03|Уровень|das Niveau|Level
w04|Модуль|das Modul|Module
w05|Языковая школа|die Sprachschule|Language school
w06|Профессиональное обучение|die Berufsausbildung|Vocational training
w07|Вечерний курс|der Abendkurs|Evening course
w08|Пробное занятие|die Probelektion|Trial lesson
w09|Группа|die Gruppe|Group
w10|Продолжительность|die Dauer|Duration
w11|Предварительные знания|die Vorkenntnisse|Prior knowledge
w12|Учебный материал|das Kursmaterial|Course material
w13|Описание программы|die Programmbeschreibung|Programme description
w14|Цель обучения|das Lernziel|Learning goal
w15|Очное занятие|der Präsenzunterricht|In-person teaching
w16|Онлайн-занятие|der Onlineunterricht|Online teaching
w17|Расписание курса|der Kursplan|Course schedule
w18|Консультация|die Beratung|Advice
w19|Выбор|die Auswahl|Choice
w20|Сравнивать|vergleichen|To compare` }),
  'admission-registration': topicDraft({ participants: p.school,
    phrases: `p01|Я хочу записаться на этот курс.|Ich möchte mich für diesen Kurs anmelden.|I would like to enrol on this course.
p02|Есть ещё свободные места?|Sind noch Plätze frei?|Are there any places left?
p03|Как подать документы на поступление?|Wie reiche ich meine Bewerbungsunterlagen ein?|How do I submit my admission documents?
p04|Нужен перевод моего диплома?|Brauche ich eine Übersetzung meines Diploms?|Do I need a translation of my diploma?
p05|Я отправил регистрационную форму.|Ich habe das Anmeldeformular abgeschickt.|I have submitted the registration form.
p06|Как узнать, что регистрация подтверждена?|Wie erfahre ich, ob die Anmeldung bestätigt ist?|How will I know whether my enrolment is confirmed?
p07|Когда заканчивается запись?|Wann endet die Anmeldefrist?|When is the enrolment deadline?
p08|Предусмотрен вступительный тест?|Gibt es einen Aufnahmetest?|Is there an entrance test?
p09|Какие требования к поступающим?|Welche Aufnahmebedingungen gelten?|What are the admission requirements?
p10|Можно подать заявку онлайн?|Kann ich mich online bewerben?|Can I apply online?
p11|Когда начинается обучение?|Wann beginnt der Unterricht?|When do classes start?
p12|Можно попасть в список ожидания?|Kann ich mich auf die Warteliste setzen lassen?|Can I join the waiting list?
p13|Мне нужно изменить данные в регистрации.|Ich muss Angaben in meiner Anmeldung ändern.|I need to change some details in my enrolment.
p14|Где посмотреть условия оплаты и отмены?|Wo finde ich die Zahlungs- und Abmeldebedingungen?|Where can I find the payment and cancellation terms?
p15|Кому отправить недостающий документ?|An wen schicke ich das fehlende Dokument?|Who should I send the missing document to?`,
    replies: `r01|Пожалуйста, заполните эту форму.|Füllen Sie bitte dieses Formular aus.|Please complete this form.
r02|Я проверю количество свободных мест.|Ich prüfe die freien Plätze.|I will check the available places.
r03|Я пришлю вам порядок подачи.|Ich schicke Ihnen die Informationen zur Einreichung.|I will send you the submission instructions.
r04|Проверим требования этой программы.|Wir prüfen die Anforderungen dieses Programms.|Let us check this programme’s requirements.
r05|Спасибо, назовите ваш регистрационный номер.|Danke, nennen Sie bitte Ihre Anmeldenummer.|Thank you, please give me your registration number.
r06|Подтверждение придёт на вашу почту.|Sie erhalten die Bestätigung per E-Mail.|You will receive confirmation by email.`,
    dialogues: `d01|Запись на курс|Sich für einen Kurs anmelden|Enrolling on a course
d02|Документы для поступления|Unterlagen für die Aufnahme|Admission documents
d03|Подтверждение регистрации|Die Anmeldebestätigung|Enrolment confirmation`,
    words: `w01|Поступление|die Aufnahme|Admission
w02|Регистрация|die Anmeldung|Enrolment
w03|Заявка|die Bewerbung|Application
w04|Формуляр регистрации|das Anmeldeformular|Enrolment form
w05|Свободное место|der freie Platz|Available place
w06|Список ожидания|die Warteliste|Waiting list
w07|Срок записи|die Anmeldefrist|Enrolment deadline
w08|Требования к поступлению|die Aufnahmebedingungen|Admission requirements
w09|Вступительный тест|der Aufnahmetest|Entrance test
w10|Диплом|das Diplom|Diploma
w11|Перевод документа|die Dokumentenübersetzung|Document translation
w12|Подтверждение регистрации|die Anmeldebestätigung|Enrolment confirmation
w13|Регистрационный номер|die Anmeldenummer|Registration number
w14|Начало курса|der Kursbeginn|Course start
w15|Учебный отдел|das Schulsekretariat|School office
w16|Оплата курса|die Kursgebühr|Course fee
w17|Отмена регистрации|die Abmeldung|Withdrawal
w18|Условие оплаты|die Zahlungsbedingung|Payment term
w19|Недостающий документ|das fehlende Dokument|Missing document
w20|Подавать документы|Unterlagen einreichen|To submit documents` }),
  'teacher-communication': topicDraft({ participants: p.teacher,
    phrases: `p01|Можно задать вопрос после занятия?|Darf ich nach dem Unterricht eine Frage stellen?|May I ask a question after class?
p02|Я не совсем понял эту тему.|Ich habe dieses Thema nicht ganz verstanden.|I did not quite understand this topic.
p03|Можете привести другой пример?|Können Sie ein anderes Beispiel geben?|Could you give another example?
p04|Можно повторить объяснение медленнее?|Können Sie die Erklärung langsamer wiederholen?|Could you repeat the explanation more slowly?
p05|Я хотел бы обсудить свой прогресс.|Ich möchte meinen Lernfortschritt besprechen.|I would like to discuss my progress.
p06|На что мне обратить больше внимания?|Worauf sollte ich besonders achten?|What should I pay particular attention to?
p07|Как правильно произнести это слово?|Wie spricht man dieses Wort richtig aus?|How do you pronounce this word correctly?
p08|Можно получить обратную связь по тексту?|Kann ich eine Rückmeldung zu meinem Text bekommen?|Could I get feedback on my text?
p09|Мне трудно понимать речь на слух.|Das Hörverstehen fällt mir schwer.|I find listening comprehension difficult.
p10|Я не смогу прийти на следующее занятие.|Ich kann am nächsten Unterricht nicht teilnehmen.|I cannot attend the next class.
p11|Как наверстать пропущенный материал?|Wie kann ich den verpassten Stoff nachholen?|How can I catch up on the material I missed?
p12|Где можно найти дополнительные упражнения?|Wo finde ich zusätzliche Übungen?|Where can I find additional exercises?
p13|Можно договориться о консультации?|Können wir einen Beratungstermin vereinbaren?|Could we arrange a consultation?
p14|Я постараюсь исправить эти ошибки.|Ich werde versuchen, diese Fehler zu korrigieren.|I will try to correct these mistakes.
p15|Спасибо за понятное объяснение.|Danke für die verständliche Erklärung.|Thank you for the clear explanation.`,
    replies: `r01|Да, я останусь на несколько минут.|Ja, ich bleibe noch ein paar Minuten.|Yes, I will stay for a few minutes.
r02|Какой момент вызывает вопросы?|Welcher Punkt ist noch unklar?|Which part is still unclear?
r03|Конечно, возьмём другую ситуацию.|Natürlich, nehmen wir eine andere Situation.|Of course, let us take another situation.
r04|Да, разберём всё ещё раз.|Ja, wir gehen alles noch einmal durch.|Yes, let us go through it all again.
r05|Давайте посмотрим ваши последние работы.|Schauen wir uns Ihre letzten Arbeiten an.|Let us look at your recent work.
r06|Обсудим сильные стороны и трудности.|Wir besprechen Ihre Stärken und Schwierigkeiten.|We will discuss your strengths and difficulties.`,
    dialogues: `d01|Вопрос после занятия|Eine Frage nach dem Unterricht|A question after class
d02|Дополнительное объяснение|Eine weitere Erklärung|A further explanation
d03|Обратная связь|Eine Rückmeldung|Feedback`,
    words: `w01|Преподаватель|die Lehrperson|Teacher
w02|Объяснение|die Erklärung|Explanation
w03|Вопрос|die Frage|Question
w04|Пример|das Beispiel|Example
w05|Тема|das Thema|Topic
w06|Произношение|die Aussprache|Pronunciation
w07|Понимание на слух|das Hörverstehen|Listening comprehension
w08|Обратная связь|die Rückmeldung|Feedback
w09|Прогресс в учёбе|der Lernfortschritt|Learning progress
w10|Ошибка|der Fehler|Mistake
w11|Исправление|die Korrektur|Correction
w12|Трудность|die Schwierigkeit|Difficulty
w13|Сильная сторона|die Stärke|Strength
w14|Консультация|die Sprechstunde|Consultation
w15|Пропущенный материал|der verpasste Stoff|Missed material
w16|Дополнительное упражнение|die Zusatzübung|Additional exercise
w17|Повторять|wiederholen|To repeat
w18|Навёрстывать|nachholen|To catch up
w19|Уточнять|nachfragen|To ask for clarification
w20|Понятный|verständlich|Clear` }),
  'classes-homework': topicDraft({ participants: p.teacher,
    phrases: `p01|Какую страницу мы открываем?|Welche Seite schlagen wir auf?|Which page should we open?
p02|Это задание нужно сделать письменно?|Sollen wir diese Aufgabe schriftlich machen?|Should we do this task in writing?
p03|Что задано на дом?|Was haben wir als Hausaufgabe auf?|What is the homework?
p04|К какому дню нужно сдать работу?|Bis wann sollen wir die Arbeit abgeben?|When do we need to hand in the work?
p05|У меня не открывается файл с заданием.|Ich kann die Datei mit der Aufgabe nicht öffnen.|I cannot open the assignment file.
p06|Можно получить его в другом формате?|Kann ich sie in einem anderen Format bekommen?|Could I get it in another format?
p07|Мы работаем в парах или самостоятельно?|Arbeiten wir zu zweit oder allein?|Are we working in pairs or individually?
p08|Я выполнил первую часть.|Ich habe den ersten Teil erledigt.|I have completed the first part.
p09|Я не успел закончить домашнее задание.|Ich konnte die Hausaufgaben nicht fertig machen.|I could not finish the homework.
p10|Можно прислать работу по электронной почте?|Kann ich die Arbeit per E-Mail schicken?|Can I email the work?
p11|Где загрузить выполненное задание?|Wo lade ich die fertige Aufgabe hoch?|Where do I upload the completed assignment?
p12|Я хочу проверить свои ответы.|Ich möchte meine Antworten überprüfen.|I would like to check my answers.
p13|Можно использовать словарь?|Dürfen wir ein Wörterbuch benutzen?|May we use a dictionary?
p14|Я не слышу запись.|Ich kann die Aufnahme nicht hören.|I cannot hear the recording.
p15|Сколько времени у нас на упражнение?|Wie viel Zeit haben wir für die Übung?|How much time do we have for the exercise?`,
    replies: `r01|Откройте страницу двадцать четыре.|Schlagen Sie Seite vierundzwanzig auf.|Open page twenty-four.
r02|Да, запишите полные предложения.|Ja, schreiben Sie ganze Sätze auf.|Yes, write complete sentences.
r03|Прочитайте текст и ответьте на вопросы.|Lesen Sie den Text und beantworten Sie die Fragen.|Read the text and answer the questions.
r04|Пожалуйста, к следующему занятию.|Bitte bis zur nächsten Lektion.|By the next lesson, please.
r05|Какое сообщение появляется?|Welche Meldung erscheint?|What message appears?
r06|Да, я отправлю вам PDF.|Ja, ich schicke Ihnen ein PDF.|Yes, I will send you a PDF.`,
    dialogues: `d01|Задание в классе|Eine Aufgabe im Unterricht|A classroom task
d02|Домашняя работа|Die Hausaufgaben|Homework
d03|Файл не открывается|Eine Datei lässt sich nicht öffnen|A file will not open`,
    words: `w01|Занятие|die Lektion|Lesson
w02|Домашняя работа|die Hausaufgaben|Homework
w03|Задание|die Aufgabe|Task
w04|Упражнение|die Übung|Exercise
w05|Страница|die Seite|Page
w06|Предложение|der Satz|Sentence
w07|Текст|der Text|Text
w08|Ответ|die Antwort|Answer
w09|Работа в парах|die Partnerarbeit|Pair work
w10|Самостоятельная работа|die Einzelarbeit|Individual work
w11|Словарь|das Wörterbuch|Dictionary
w12|Файл|die Datei|File
w13|Формат|das Format|Format
w14|Запись|die Aufnahme|Recording
w15|Срок сдачи|der Abgabetermin|Submission deadline
w16|Учебная платформа|die Lernplattform|Learning platform
w17|Загружать на сайт|hochladen|To upload
w18|Сдавать работу|abgeben|To hand in
w19|Письменно|schriftlich|In writing
w20|Самостоятельно|selbstständig|Independently` }),
  'exams-grades': topicDraft({ participants: p.teacher,
    phrases: `p01|Когда состоится экзамен?|Wann findet die Prüfung statt?|When will the exam take place?
p02|Какие темы будут на экзамене?|Welche Themen kommen in der Prüfung vor?|Which topics will be covered in the exam?
p03|Как устроена устная часть?|Wie ist der mündliche Teil aufgebaut?|How is the speaking section structured?
p04|Сколько времени длится письменная часть?|Wie lange dauert der schriftliche Teil?|How long is the written section?
p05|Я хотел бы понять свою оценку.|Ich möchte meine Note besser verstehen.|I would like to understand my grade better.
p06|Можно посмотреть проверенную работу?|Darf ich meine korrigierte Arbeit einsehen?|May I see my marked paper?
p07|По каким критериям оценивают ответы?|Nach welchen Kriterien werden die Antworten bewertet?|What criteria are used to assess the answers?
p08|Какие материалы разрешены?|Welche Hilfsmittel sind erlaubt?|Which materials are permitted?
p09|Нужно принести удостоверение личности?|Muss ich einen Ausweis mitbringen?|Do I need to bring identification?
p10|Где узнать правила пересдачи?|Wo finde ich die Regeln für eine Wiederholung?|Where can I find the resit rules?
p11|Я не смогу прийти по болезни.|Ich kann wegen Krankheit nicht kommen.|I cannot attend because I am ill.
p12|Как сообщить об отсутствии на экзамене?|Wie melde ich mich von der Prüfung ab?|How do I report that I cannot attend the exam?
p13|Когда будут известны результаты?|Wann werden die Ergebnisse bekannt gegeben?|When will the results be announced?
p14|Что мне улучшить перед следующим экзаменом?|Was sollte ich vor der nächsten Prüfung verbessern?|What should I improve before the next exam?
p15|Я хочу узнать порядок пересмотра оценки.|Ich möchte wissen, wie eine Überprüfung der Note abläuft.|I would like to know the procedure for reviewing a grade.`,
    replies: `r01|Дата указана в экзаменационном расписании.|Das Datum steht im Prüfungsplan.|The date is in the exam timetable.
r02|Я дам вам список тем для подготовки.|Ich gebe Ihnen die Themenliste zur Vorbereitung.|I will give you the topic list for revision.
r03|Сначала вы представитесь, затем будет беседа.|Zuerst stellen Sie sich vor, dann folgt ein Gespräch.|First you introduce yourself, then there is a conversation.
r04|Время для каждой части указано в инструкции.|Die Zeit für jeden Teil steht in der Anleitung.|The time for each section is in the instructions.
r05|Давайте посмотрим критерии оценивания.|Schauen wir uns die Bewertungskriterien an.|Let us look at the marking criteria.
r06|Да, договоримся о времени просмотра.|Ja, wir vereinbaren einen Termin für die Einsicht.|Yes, let us arrange a time to view it.`,
    dialogues: `d01|Подготовка к экзамену|Sich auf die Prüfung vorbereiten|Preparing for an exam
d02|Формат экзамена|Der Prüfungsaufbau|The exam format
d03|Обсудить оценку|Eine Note besprechen|Discussing a grade`,
    words: `w01|Экзамен|die Prüfung|Exam
w02|Оценка|die Note|Grade
w03|Результат|das Ergebnis|Result
w04|Устная часть|der mündliche Teil|Speaking section
w05|Письменная часть|der schriftliche Teil|Written section
w06|Критерий оценивания|das Bewertungskriterium|Marking criterion
w07|Баллы|die Punkte|Marks
w08|Пересдача|die Wiederholungsprüfung|Resit
w09|Подготовка|die Vorbereitung|Preparation
w10|Экзаменационное расписание|der Prüfungsplan|Exam timetable
w11|Допустимый материал|das erlaubte Hilfsmittel|Permitted aid
w12|Удостоверение личности|der Ausweis|Identification
w13|Проверенная работа|die korrigierte Arbeit|Marked paper
w14|Просмотр работы|die Prüfungseinsicht|Viewing an exam paper
w15|Продолжительность|die Dauer|Duration
w16|Объявление результатов|die Ergebnisbekanntgabe|Publication of results
w17|Пересмотр оценки|die Notenüberprüfung|Grade review
w18|Сдать экзамен успешно|die Prüfung bestehen|To pass an exam
w19|Не сдать экзамен|die Prüfung nicht bestehen|To fail an exam
w20|Оценивать|bewerten|To assess` }),
  'certificates-completion': topicDraft({ participants: p.school,
    phrases: `p01|Я завершил курс.|Ich habe den Kurs abgeschlossen.|I have completed the course.
p02|Когда я получу сертификат?|Wann erhalte ich mein Zertifikat?|When will I receive my certificate?
p03|В сертификате ошибка в имени.|Mein Name ist im Zertifikat falsch geschrieben.|My name is misspelled on the certificate.
p04|Можно получить исправленный экземпляр?|Kann ich ein korrigiertes Exemplar bekommen?|Could I get a corrected copy?
p05|Мне нужна справка об участии.|Ich brauche eine Teilnahmebestätigung.|I need a certificate of attendance.
p06|Можно получить её в электронном виде?|Kann ich sie elektronisch erhalten?|Could I receive it electronically?
p07|Какие условия для получения сертификата?|Welche Voraussetzungen gelten für das Zertifikat?|What are the requirements for the certificate?
p08|В документе указан пройденный уровень?|Ist das erreichte Niveau im Dokument angegeben?|Does the document state the level achieved?
p09|Можно получить копию утерянного сертификата?|Kann ich eine Kopie meines verlorenen Zertifikats bekommen?|Could I get a copy of my lost certificate?
p10|Как подтвердить подлинность документа?|Wie kann die Echtheit des Dokuments bestätigt werden?|How can the authenticity of the document be verified?
p11|Кому задать вопрос о признании диплома?|An wen wende ich mich zur Anerkennung meines Diploms?|Who should I contact about recognition of my diploma?
p12|Как называется следующая программа?|Wie heisst das weiterführende Programm?|What is the name of the next programme?
p13|Я хочу обсудить дальнейшее обучение.|Ich möchte meine Weiterbildung besprechen.|I would like to discuss further study.
p14|Можете прислать итоговую справку?|Können Sie mir die Abschlussbestätigung schicken?|Could you send me confirmation of completion?
p15|Спасибо за поддержку во время обучения.|Danke für Ihre Unterstützung während des Kurses.|Thank you for your support during the course.`,
    replies: `r01|Поздравляем с завершением!|Wir gratulieren Ihnen zum Abschluss!|Congratulations on completing it!
r02|Я уточню дату выдачи.|Ich kläre das Ausgabedatum.|I will check the issue date.
r03|Спасибо, сообщите правильное написание.|Danke, teilen Sie uns die richtige Schreibweise mit.|Thank you, please tell us the correct spelling.
r04|Да, мы проверим данные и подготовим исправление.|Ja, wir prüfen die Angaben und bereiten die Korrektur vor.|Yes, we will check the details and prepare a correction.
r05|Пожалуйста, укажите название и даты курса.|Nennen Sie bitte den Kursnamen und die Kursdaten.|Please give us the course name and dates.
r06|Я проверю доступный формат выдачи.|Ich prüfe das verfügbare Ausgabeformat.|I will check the available format.`,
    dialogues: `d01|Получить сертификат|Das Zertifikat erhalten|Receiving a certificate
d02|Исправить имя|Einen Namen korrigieren|Correcting a name
d03|Справка об участии|Eine Teilnahmebestätigung|A certificate of attendance`,
    words: `w01|Сертификат|das Zertifikat|Certificate
w02|Завершение|der Abschluss|Completion
w03|Диплом|das Diplom|Diploma
w04|Справка об участии|die Teilnahmebestätigung|Certificate of attendance
w05|Подтверждение завершения|die Abschlussbestätigung|Confirmation of completion
w06|Дата выдачи|das Ausgabedatum|Issue date
w07|Экземпляр|das Exemplar|Copy
w08|Исправление|die Korrektur|Correction
w09|Подлинность|die Echtheit|Authenticity
w10|Признание диплома|die Diplomanerkennung|Diploma recognition
w11|Достигнутый уровень|das erreichte Niveau|Level achieved
w12|Дальнейшее обучение|die Weiterbildung|Further study
w13|Учебное заведение|die Bildungseinrichtung|Educational institution
w14|Печать|der Stempel|Stamp
w15|Подпись|die Unterschrift|Signature
w16|Утеря|der Verlust|Loss
w17|Электронная копия|die elektronische Kopie|Electronic copy
w18|Условие получения|die Voraussetzung für die Ausstellung|Issue requirement
w19|Подтверждать|bestätigen|To confirm
w20|Завершать|abschliessen|To complete` }),
};
