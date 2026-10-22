import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const documentMaterials = {
  'residence-registration': topicDraft({ participants: p.official,
    phrases: `p01|Я хочу зарегистрироваться по новому адресу.|Ich möchte mich an meiner neuen Adresse anmelden.|I would like to register at my new address.
p02|Какие документы мне принести?|Welche Unterlagen soll ich mitbringen?|Which documents should I bring?
p03|Нужна ли предварительная запись для регистрации?|Brauche ich für die Anmeldung einen Termin?|Do I need an appointment to register?
p04|Можно пройти регистрацию онлайн?|Kann ich mich online anmelden?|Can I register online?
p05|Мне нужна справка о месте жительства.|Ich brauche eine Wohnsitzbestätigung.|I need a certificate of residence.
p06|Как я могу её получить?|Wie kann ich sie erhalten?|How can I obtain it?
p07|Это мой новый адрес.|Das ist meine neue Adresse.|This is my new address.
p08|Я переехал из другой общины.|Ich bin aus einer anderen Gemeinde zugezogen.|I have moved from another municipality.
p09|Нужно ли предъявить договор аренды?|Muss ich den Mietvertrag vorlegen?|Do I need to present my tenancy agreement?
p10|Я пока живу у родственников.|Ich wohne vorläufig bei Verwandten.|I am temporarily staying with relatives.
p11|Где находится отдел регистрации жителей?|Wo sind die Einwohnerdienste?|Where is the residents’ registration office?
p12|Какой срок регистрации действует в моём случае?|Welche Anmeldefrist gilt in meinem Fall?|What registration deadline applies in my case?
p13|Предусмотрен ли сбор за эту услугу?|Wird für diese Dienstleistung eine Gebühr erhoben?|Is there a fee for this service?
p14|Можно получить подтверждение регистрации?|Kann ich eine Anmeldebestätigung bekommen?|Could I get confirmation of my registration?
p15|Кому сообщить об изменении адреса?|Wem muss ich meine Adressänderung melden?|Who should I inform about my change of address?`,
    replies: `r01|В какой общине вы теперь живёте?|In welcher Gemeinde wohnen Sie jetzt?|Which municipality do you live in now?
r02|Я дам вам список для вашей ситуации.|Ich gebe Ihnen die Liste für Ihre Situation.|I will give you the list for your circumstances.
r03|Я проверю порядок записи в нашей общине.|Ich prüfe die Terminregelung unserer Gemeinde.|I will check our municipality’s appointment procedure.
r04|Давайте посмотрим доступные способы регистрации.|Schauen wir, welche Anmeldewege möglich sind.|Let us check which registration methods are available.
r05|Она вам нужна на бумаге?|Brauchen Sie sie auf Papier?|Do you need it on paper?
r06|Я объясню, как подать запрос.|Ich erkläre Ihnen, wie Sie den Antrag stellen.|I will explain how to apply.`,
    dialogues: `d01|Сообщить о переезде|Einen Zuzug melden|Reporting a move
d02|Выбрать способ регистрации|Die Anmeldung organisieren|Arranging registration
d03|Справка о проживании|Eine Wohnsitzbestätigung|A certificate of residence`,
    words: `w01|Регистрация|die Anmeldung|Registration
w02|Место жительства|der Wohnsitz|Place of residence
w03|Адрес|die Adresse|Address
w04|Община|die Gemeinde|Municipality
w05|Отдел регистрации жителей|die Einwohnerdienste|Residents’ registration office
w06|Справка о проживании|die Wohnsitzbestätigung|Certificate of residence
w07|Переезд в общину|der Zuzug|Moving into a municipality
w08|Выезд из общины|der Wegzug|Moving out of a municipality
w09|Изменение адреса|die Adressänderung|Change of address
w10|Договор аренды|der Mietvertrag|Tenancy agreement
w11|Удостоверение личности|der Identitätsausweis|Identity document
w12|Сбор|die Gebühr|Fee
w13|Срок регистрации|die Anmeldefrist|Registration deadline
w14|Подтверждение|die Bestätigung|Confirmation
w15|Запрос|der Antrag|Application
w16|Формуляр|das Formular|Form
w17|Домохозяйство|der Haushalt|Household
w18|Гражданство|die Staatsangehörigkeit|Nationality
w19|Семейное положение|der Zivilstand|Marital status
w20|Временный адрес|die vorläufige Adresse|Temporary address` }),
  'authority-visit': topicDraft({ participants: p.official,
    phrases: `p01|У меня запись на десять часов.|Ich habe einen Termin um zehn Uhr.|I have an appointment at ten.
p02|Где мне взять номер очереди?|Wo bekomme ich eine Wartenummer?|Where do I get a queue number?
p03|Я не уверен, в тот ли отдел обратился.|Ich bin nicht sicher, ob ich bei der richtigen Stelle bin.|I am not sure whether I am at the right department.
p04|Кто отвечает за мой вопрос?|Wer ist für mein Anliegen zuständig?|Who handles my enquiry?
p05|Я пока не всё понимаю по-немецки.|Ich verstehe noch nicht alles auf Deutsch.|I do not understand everything in German yet.
p06|Можно объяснить это проще?|Können Sie das einfacher erklären?|Could you explain it more simply?
p07|Вот подтверждение моей записи.|Hier ist meine Terminbestätigung.|Here is my appointment confirmation.
p08|Как долго примерно ждать?|Wie lange muss ich ungefähr warten?|Approximately how long is the wait?
p09|Мне нужно уточнить статус заявления.|Ich möchte den Stand meines Antrags erfahren.|I would like to check the status of my application.
p10|Вот номер моего дела.|Hier ist mein Aktenzeichen.|Here is my case reference.
p11|Нужно ли оставить оригинал?|Muss ich das Original hierlassen?|Do I need to leave the original here?
p12|Можно получить копию этого документа?|Kann ich eine Kopie dieses Dokuments bekommen?|Could I get a copy of this document?
p13|Пожалуйста, запишите следующий шаг.|Schreiben Sie mir bitte den nächsten Schritt auf.|Please write down the next step for me.
p14|Можно прийти с переводчиком?|Darf ich eine dolmetschende Person mitbringen?|May I bring an interpreter?
p15|Как связаться с ответственным сотрудником?|Wie erreiche ich die zuständige Person?|How can I contact the person handling my case?`,
    replies: `r01|Покажите, пожалуйста, подтверждение записи.|Zeigen Sie bitte Ihre Terminbestätigung.|Please show your appointment confirmation.
r02|Возьмите его в автомате у входа.|Am Automaten beim Eingang.|At the machine by the entrance.
r03|Расскажите, с чем вы пришли.|Sagen Sie mir, worum es geht.|Tell me what you need help with.
r04|Я направлю вас к ответственному сотруднику.|Ich leite Sie an die zuständige Person weiter.|I will direct you to the person responsible.
r05|Хорошо, я буду говорить медленнее.|Gut, ich spreche langsamer.|All right, I will speak more slowly.
r06|Конечно, разберём это по шагам.|Natürlich, wir gehen es Schritt für Schritt durch.|Of course, let us go through it step by step.`,
    dialogues: `d01|У входа в учреждение|Am Empfang der Behörde|At the public office reception
d02|Нужный отдел|Die zuständige Stelle|The right department
d03|Попросить объяснение|Um eine Erklärung bitten|Asking for an explanation`,
    words: `w01|Учреждение|die Behörde|Public authority
w02|Отдел|die Abteilung|Department
w03|Окно приёма|der Schalter|Service counter
w04|Очередь|die Warteschlange|Queue
w05|Номер очереди|die Wartenummer|Queue number
w06|Приёмная|der Empfang|Reception
w07|Запись на приём|der Termin|Appointment
w08|Часы приёма|die Öffnungszeiten|Opening hours
w09|Обращение|das Anliegen|Enquiry
w10|Сотрудник учреждения|die Sachbearbeiterin / der Sachbearbeiter|Case officer
w11|Номер дела|das Aktenzeichen|Case reference
w12|Статус обработки|der Bearbeitungsstand|Processing status
w13|Оригинал|das Original|Original
w14|Копия|die Kopie|Copy
w15|Переводчик|die Dolmetscherin / der Dolmetscher|Interpreter
w16|Полномочие|die Zuständigkeit|Responsibility
w17|Указание|der Hinweis|Instruction
w18|Подпись|die Unterschrift|Signature
w19|Печать|der Stempel|Stamp
w20|Следующий шаг|der nächste Schritt|Next step` }),
  'forms-applications': topicDraft({ participants: p.official,
    phrases: `p01|Мне нужна помощь с формуляром.|Ich brauche Hilfe mit diesem Formular.|I need help with this form.
p02|Что нужно написать в этом поле?|Was muss ich in dieses Feld schreiben?|What should I write in this field?
p03|Это поле обязательно заполнять?|Ist dieses Feld ein Pflichtfeld?|Is this field mandatory?
p04|Что указать, если это ко мне не относится?|Was trage ich ein, wenn das auf mich nicht zutrifft?|What should I enter if this does not apply to me?
p05|Я заметил ошибку в заполненной форме.|Ich habe einen Fehler im ausgefüllten Formular bemerkt.|I noticed an error in the completed form.
p06|Как правильно её исправить?|Wie kann ich ihn richtig korrigieren?|How can I correct it properly?
p07|Где нужно поставить подпись?|Wo muss ich unterschreiben?|Where do I need to sign?
p08|Какие приложения нужны к заявлению?|Welche Beilagen brauche ich für den Antrag?|Which attachments do I need for the application?
p09|Можно заполнить форму на компьютере?|Kann ich das Formular am Computer ausfüllen?|Can I complete the form on a computer?
p10|Здесь нужно указать адрес для переписки?|Soll ich hier meine Korrespondenzadresse angeben?|Should I enter my correspondence address here?
p11|Я не понимаю это сокращение.|Ich verstehe diese Abkürzung nicht.|I do not understand this abbreviation.
p12|Нужно ли заверять копии?|Müssen die Kopien beglaubigt sein?|Do the copies need to be certified?
p13|Можно сохранить и закончить позже?|Kann ich speichern und später weitermachen?|Can I save it and finish later?
p14|Проверьте, пожалуйста, все ли поля заполнены.|Prüfen Sie bitte, ob alle Felder ausgefüllt sind.|Please check whether all the fields are completed.
p15|Как узнать, что форма отправлена?|Wie erkenne ich, ob das Formular abgeschickt wurde?|How do I know whether the form has been submitted?`,
    replies: `r01|Какое поле вызывает трудности?|Welches Feld bereitet Ihnen Schwierigkeiten?|Which field are you having difficulty with?
r02|Здесь укажите свою фамилию.|Tragen Sie hier Ihren Familiennamen ein.|Enter your surname here.
r03|Да, оно отмечено звёздочкой.|Ja, es ist mit einem Stern markiert.|Yes, it is marked with an asterisk.
r04|Проверим пояснение к этому пункту.|Schauen wir in die Erläuterung zu diesem Punkt.|Let us check the instructions for that item.
r05|В каком разделе ошибка?|In welchem Abschnitt ist der Fehler?|Which section contains the error?
r06|Я покажу предусмотренный способ исправления.|Ich zeige Ihnen, wie die Korrektur vorgesehen ist.|I will show you the prescribed way to correct it.`,
    dialogues: `d01|Непонятное поле|Ein unverständliches Feld|An unclear field
d02|Обязательные сведения|Erforderliche Angaben|Required information
d03|Исправление ошибки|Einen Fehler korrigieren|Correcting an error`,
    words: `w01|Анкета|das Formular|Form
w02|Поле|das Feld|Field
w03|Обязательное поле|das Pflichtfeld|Mandatory field
w04|Фамилия|der Familienname|Surname
w05|Имя|der Vorname|First name
w06|Дата рождения|das Geburtsdatum|Date of birth
w07|Место рождения|der Geburtsort|Place of birth
w08|Подпись|die Unterschrift|Signature
w09|Приложение|die Beilage|Attachment
w10|Раздел|der Abschnitt|Section
w11|Сокращение|die Abkürzung|Abbreviation
w12|Исправление|die Korrektur|Correction
w13|Пояснение|die Erläuterung|Explanation
w14|Звёздочка|der Stern|Asterisk
w15|Адрес для переписки|die Korrespondenzadresse|Correspondence address
w16|Достоверность|die Richtigkeit|Accuracy
w17|Заверенная копия|die beglaubigte Kopie|Certified copy
w18|Отправка|das Absenden|Submission
w19|Черновик|der Entwurf|Draft
w20|Указание данных|die Angabe|Entry of information` }),
  'visa-residence-permit': topicDraft({ participants: p.official,
    phrases: `p01|Я хочу узнать о разрешении на проживание.|Ich möchte mich über eine Aufenthaltsbewilligung informieren.|I would like information about a residence permit.
p02|Какой орган отвечает за моё заявление?|Welche Behörde ist für meinen Antrag zuständig?|Which authority handles my application?
p03|Какие документы нужны в моём случае?|Welche Unterlagen brauche ich in meinem Fall?|Which documents do I need in my case?
p04|Нужен ли официальный перевод?|Brauche ich eine offizielle Übersetzung?|Do I need an official translation?
p05|Как проверить ход рассмотрения?|Wie kann ich den Bearbeitungsstand prüfen?|How can I check the progress of my application?
p06|Нужно ли записаться для сдачи биометрии?|Brauche ich einen Termin für die Biometrie?|Do I need an appointment for biometrics?
p07|Я хочу уточнить условия подачи на визу.|Ich möchte die Voraussetzungen für einen Visumantrag klären.|I would like to clarify the visa application requirements.
p08|Где найти официальный список документов?|Wo finde ich die offizielle Unterlagenliste?|Where can I find the official document checklist?
p09|До какой даты действует моё разрешение?|Bis wann ist meine Bewilligung gültig?|Until when is my permit valid?
p10|Когда мне нужно подать на продление?|Wann muss ich die Verlängerung beantragen?|When do I need to apply for renewal?
p11|Изменились мои личные обстоятельства.|Meine persönlichen Verhältnisse haben sich geändert.|My personal circumstances have changed.
p12|Как сообщить об этих изменениях?|Wie melde ich diese Änderungen?|How do I report these changes?
p13|Можно получить письменный список требований?|Kann ich die Anforderungen schriftlich bekommen?|Could I get the requirements in writing?
p14|Мне пришло письмо с просьбой дополнить документы.|Ich habe eine Aufforderung erhalten, Unterlagen nachzureichen.|I received a request to provide additional documents.
p15|Где можно получить консультацию по моему случаю?|Wo kann ich mich zu meinem Fall beraten lassen?|Where can I get advice about my case?`,
    replies: `r01|Расскажите, пожалуйста, о вашей ситуации.|Schildern Sie bitte Ihre Situation.|Please describe your circumstances.
r02|Я уточню компетентное ведомство.|Ich kläre, welche Stelle zuständig ist.|I will check which office is responsible.
r03|Требования зависят от вашего заявления.|Die Anforderungen hängen von Ihrem Antrag ab.|The requirements depend on your application.
r04|Проверим требования к вашему документу.|Wir prüfen die Anforderungen für Ihr Dokument.|Let us check the requirements for your document.
r05|Пожалуйста, назовите номер дела.|Nennen Sie bitte Ihr Aktenzeichen.|Please provide your case reference.
r06|Я проверю, предусмотрен ли этот этап.|Ich prüfe, ob dieser Schritt vorgesehen ist.|I will check whether that step is required.`,
    dialogues: `d01|Первый запрос|Die erste Anfrage|An initial enquiry
d02|Требования к документам|Anforderungen an Unterlagen|Document requirements
d03|Ход рассмотрения|Der Bearbeitungsstand|Application progress`,
    words: `w01|Виза|das Visum|Visa
w02|Разрешение на проживание|die Aufenthaltsbewilligung|Residence permit
w03|Заявление|der Antrag|Application
w04|Продление|die Verlängerung|Renewal
w05|Миграционная служба|das Migrationsamt|Migration office
w06|Биометрия|die Biometrie|Biometrics
w07|Отпечаток пальца|der Fingerabdruck|Fingerprint
w08|Срок действия|die Gültigkeitsdauer|Validity period
w09|Гражданство|die Staatsangehörigkeit|Nationality
w10|Основание пребывания|der Aufenthaltszweck|Purpose of stay
w11|Требование|die Voraussetzung|Requirement
w12|Официальный перевод|die offizielle Übersetzung|Official translation
w13|Подтверждающий документ|der Nachweis|Supporting evidence
w14|Рассмотрение|die Bearbeitung|Processing
w15|Номер дела|das Aktenzeichen|Case reference
w16|Дополнительный документ|die zusätzliche Unterlage|Additional document
w17|Решение ведомства|der Entscheid|Official decision
w18|Срок подачи|die Einreichungsfrist|Submission deadline
w19|Консультация|die Beratung|Advice
w20|Обстоятельства|die Verhältnisse|Circumstances` }),
  'official-correspondence': topicDraft({ participants: p.official,
    phrases: `p01|Я получил от вас письмо.|Ich habe einen Brief von Ihnen erhalten.|I have received a letter from you.
p02|Можете объяснить, что от меня требуется?|Können Sie erklären, was ich tun muss?|Could you explain what I need to do?
p03|Я хочу отправить официальный запрос.|Ich möchte eine schriftliche Anfrage einreichen.|I would like to submit a written enquiry.
p04|На какой адрес его направить?|An welche Adresse soll ich sie schicken?|Which address should I send it to?
p05|Я не могу ответить в указанный срок.|Ich kann die angegebene Frist nicht einhalten.|I cannot reply within the stated deadline.
p06|Можно запросить продление срока?|Kann ich eine Fristverlängerung beantragen?|Can I request an extension of the deadline?
p07|В письме указан номер моего дела.|Im Brief steht mein Aktenzeichen.|My case reference is in the letter.
p08|Я приложил необходимые копии.|Ich habe die erforderlichen Kopien beigelegt.|I have enclosed the required copies.
p09|Прошу подтвердить получение письма.|Bitte bestätigen Sie den Eingang meines Schreibens.|Please confirm receipt of my letter.
p10|Я хочу исправить сведения в моём деле.|Ich möchte Angaben in meiner Akte korrigieren lassen.|I would like to correct information in my file.
p11|Могу ли я ответить по электронной почте?|Kann ich per E-Mail antworten?|Can I reply by email?
p12|Как правильно указать тему письма?|Wie soll ich den Betreff formulieren?|How should I word the subject line?
p13|Прошу прислать ответ в письменном виде.|Bitte antworten Sie mir schriftlich.|Please reply in writing.
p14|Я отправлю недостающий документ отдельно.|Ich reiche das fehlende Dokument separat nach.|I will send the missing document separately.
p15|Спасибо за рассмотрение моего запроса.|Vielen Dank für die Prüfung meiner Anfrage.|Thank you for considering my enquiry.`,
    replies: `r01|Пожалуйста, назовите дату письма.|Nennen Sie bitte das Datum des Briefes.|Please tell me the date of the letter.
r02|Давайте вместе прочитаем этот раздел.|Lesen wir diesen Abschnitt gemeinsam.|Let us read this section together.
r03|Опишите ваш вопрос как можно точнее.|Beschreiben Sie Ihr Anliegen möglichst genau.|Please describe your enquiry as clearly as possible.
r04|Я дам вам адрес ответственного отдела.|Ich gebe Ihnen die Adresse der zuständigen Abteilung.|I will give you the address of the responsible department.
r05|Сообщите об этом ответственному сотруднику.|Informieren Sie die zuständige Person darüber.|Please inform the person handling your case.
r06|Я объясню, как подать такой запрос.|Ich erkläre Ihnen, wie Sie das beantragen können.|I will explain how to make that request.`,
    dialogues: `d01|Понять письмо|Einen Brief verstehen|Understanding a letter
d02|Отправить запрос|Eine Anfrage senden|Sending an enquiry
d03|Обсудить срок|Eine Frist besprechen|Discussing a deadline`,
    words: `w01|Письмо|der Brief|Letter
w02|Запрос|die Anfrage|Enquiry
w03|Тема письма|der Betreff|Subject line
w04|Получатель|die Empfängerin / der Empfänger|Recipient
w05|Отправитель|die Absenderin / der Absender|Sender
w06|Вложение|die Beilage|Enclosure
w07|Срок ответа|die Antwortfrist|Reply deadline
w08|Продление срока|die Fristverlängerung|Deadline extension
w09|Подтверждение получения|die Eingangsbestätigung|Acknowledgement of receipt
w10|Переписка|die Korrespondenz|Correspondence
w11|Подпись|die Unterschrift|Signature
w12|Обращение в письме|die Anrede|Salutation
w13|Заказное письмо|das Einschreiben|Registered letter
w14|Дело|die Akte|File
w15|Дата|das Datum|Date
w16|Почтовый адрес|die Postadresse|Postal address
w17|Ответ|die Antwort|Reply
w18|Исправление|die Berichtigung|Correction
w19|Напоминание|die Erinnerung|Reminder
w20|Письменный вид|die Schriftform|Written form` }),
  'document-collection-renewal': topicDraft({ participants: p.official,
    phrases: `p01|Мне сообщили, что документ готов.|Ich habe die Nachricht erhalten, dass mein Dokument bereit ist.|I was told that my document is ready.
p02|Что нужно для его получения?|Was brauche ich für die Abholung?|What do I need to collect it?
p03|Срок действия документа скоро закончится.|Mein Dokument läuft bald ab.|My document will expire soon.
p04|Как подать заявление на продление?|Wie beantrage ich die Verlängerung?|How do I apply for renewal?
p05|В документе неправильно написано моё имя.|Mein Name ist im Dokument falsch geschrieben.|My name is misspelled in the document.
p06|Куда обратиться для исправления?|An wen wende ich mich für die Korrektur?|Who should I contact to correct it?
p07|Можно получить документ по почте?|Kann ich das Dokument per Post erhalten?|Can I receive the document by post?
p08|Нужна ли доверенность для получения другим человеком?|Braucht eine andere Person eine Vollmacht für die Abholung?|Does another person need authorisation to collect it?
p09|Нужно ли вернуть старый документ?|Muss ich das alte Dokument zurückgeben?|Do I need to return the old document?
p10|Требуется ли новая фотография?|Brauche ich ein neues Foto?|Do I need a new photograph?
p11|Как узнать, что продление одобрено?|Wie erfahre ich, ob die Verlängerung bewilligt wurde?|How will I know whether the renewal has been approved?
p12|Можно получить временное подтверждение?|Kann ich eine vorläufige Bestätigung bekommen?|Could I get temporary confirmation?
p13|Документ потерялся при доставке.|Das Dokument ist beim Versand verloren gegangen.|The document was lost in the post.
p14|Пожалуйста, проверьте мои данные перед выдачей.|Prüfen Sie bitte meine Angaben vor der Ausgabe.|Please check my details before issuing it.
p15|Я хочу записаться для получения документа.|Ich möchte einen Abholtermin vereinbaren.|I would like to arrange a collection appointment.`,
    replies: `r01|Назовите, пожалуйста, номер уведомления.|Nennen Sie bitte die Nummer der Mitteilung.|Please give me the notification number.
r02|Я проверю требования для выдачи.|Ich prüfe die Voraussetzungen für die Ausgabe.|I will check the collection requirements.
r03|Посмотрим дату окончания срока действия.|Schauen wir auf das Ablaufdatum.|Let us check the expiry date.
r04|Я покажу вам нужную форму заявления.|Ich zeige Ihnen das passende Antragsformular.|I will show you the correct application form.
r05|Спасибо, давайте сравним данные с оригиналом.|Danke, wir vergleichen die Angaben mit dem Original.|Thank you, let us compare the details with the original.
r06|Я передам запрос ответственному отделу.|Ich leite die Anfrage an die zuständige Abteilung weiter.|I will forward the request to the responsible department.`,
    dialogues: `d01|Получение готового документа|Ein fertiges Dokument abholen|Collecting a document
d02|Продление срока действия|Ein Dokument verlängern|Renewing a document
d03|Исправление имени|Einen Namen berichtigen|Correcting a name`,
    words: `w01|Получение|die Abholung|Collection
w02|Продление|die Verlängerung|Renewal
w03|Истечение срока|der Ablauf|Expiry
w04|Дата окончания|das Ablaufdatum|Expiry date
w05|Выдача|die Ausgabe|Issue
w06|Уведомление|die Mitteilung|Notification
w07|Доверенность|die Vollmacht|Authorisation
w08|Доставка|die Zustellung|Delivery
w09|Отправка|der Versand|Dispatch
w10|Фотография|das Foto|Photograph
w11|Временное подтверждение|die vorläufige Bestätigung|Temporary confirmation
w12|Ошибочное написание|der Schreibfehler|Spelling error
w13|Исправление данных|die Datenkorrektur|Data correction
w14|Старый документ|das alte Dokument|Old document
w15|Замена документа|das Ersatzdokument|Replacement document
w16|Утрата|der Verlust|Loss
w17|Подтверждение личности|der Identitätsnachweis|Proof of identity
w18|Формуляр заявления|das Antragsformular|Application form
w19|Проверка данных|die Datenprüfung|Data check
w20|Запись для получения|der Abholtermin|Collection appointment` }),
};
