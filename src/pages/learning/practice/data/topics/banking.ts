import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const bankingMaterials = {
  'open-account': topicDraft({ participants: p.bank,
    phrases: `p01|Я хочу открыть банковский счёт.|Ich möchte ein Bankkonto eröffnen.|I would like to open a bank account.
p02|Какие документы мне понадобятся?|Welche Dokumente brauche ich dafür?|Which documents will I need?
p03|Какие виды счетов вы предлагаете?|Welche Kontoarten bieten Sie an?|What types of account do you offer?
p04|Какая плата за обслуживание?|Welche Kontoführungsgebühren fallen an?|What account fees are there?
p05|Можно подключить интернет-банкинг?|Kann ich E-Banking einrichten?|Can I set up online banking?
p06|Как активировать доступ?|Wie aktiviere ich den Zugang?|How do I activate access?
p07|Мне нужен счёт для получения зарплаты.|Ich brauche ein Konto für meinen Lohn.|I need an account for receiving my salary.
p08|Можно назначить консультацию?|Kann ich einen Beratungstermin vereinbaren?|Could I arrange an appointment with an adviser?
p09|Пожалуйста, объясните условия простыми словами.|Erklären Sie die Bedingungen bitte in einfachen Worten.|Please explain the terms in simple words.
p10|В какой валюте ведётся счёт?|In welcher Währung wird das Konto geführt?|What currency is the account held in?
p11|Можно получить условия письменно?|Kann ich die Konditionen schriftlich bekommen?|Could I get the terms in writing?
p12|Как узнать мой IBAN?|Wo finde ich meine IBAN?|Where can I find my IBAN?
p13|Нужно ли подтверждение адреса?|Brauche ich einen Adressnachweis?|Do I need proof of address?
p14|Я хочу сравнить доступные тарифы.|Ich möchte die verfügbaren Gebührenmodelle vergleichen.|I would like to compare the available fee plans.
p15|Когда счётом можно будет пользоваться?|Ab wann kann ich das Konto nutzen?|When can I start using the account?`,
    replies: `r01|Для каких целей вам нужен счёт?|Wofür möchten Sie das Konto nutzen?|What would you like to use the account for?
r02|Я дам вам список для вашей ситуации.|Ich gebe Ihnen die Liste für Ihre Situation.|I will give you the list for your circumstances.
r03|Давайте посмотрим доступные варианты.|Schauen wir uns die verfügbaren Angebote an.|Let us look at the available options.
r04|Плата зависит от выбранной модели.|Das hängt vom gewählten Kontomodell ab.|That depends on the account plan you choose.
r05|Да, мы обсудим настройку доступа.|Ja, wir besprechen die Einrichtung des Zugangs.|Yes, we will discuss setting up access.
r06|Я покажу вам официальную инструкцию банка.|Ich zeige Ihnen die offizielle Anleitung der Bank.|I will show you the bank’s official instructions.`,
    dialogues: `d01|Первое обращение в банк|Die erste Anfrage bei der Bank|A first enquiry at the bank
d02|Выбор счёта|Ein Konto auswählen|Choosing an account
d03|Доступ онлайн|Der Onlinezugang|Online access`,
    words: `w01|Банковский счёт|das Bankkonto|Bank account
w02|Открытие счёта|die Kontoeröffnung|Account opening
w03|Владелец счёта|die Kontoinhaberin / der Kontoinhaber|Account holder
w04|Удостоверение личности|der Identitätsausweis|Identity document
w05|Подтверждение адреса|der Adressnachweis|Proof of address
w06|Обслуживание счёта|die Kontoführung|Account maintenance
w07|Комиссия|die Gebühr|Fee
w08|Условие|die Kondition|Term
w09|Валюта|die Währung|Currency
w10|Франк|der Franken|Franc
w11|Зарплата|der Lohn|Salary
w12|Номер счёта|die Kontonummer|Account number
w13|Международный номер счёта|die IBAN|IBAN
w14|Интернет-банкинг|das E-Banking|Online banking
w15|Доступ|der Zugang|Access
w16|Активация|die Aktivierung|Activation
w17|Консультация|die Beratung|Consultation
w18|Филиал|die Filiale|Branch
w19|Сберегательный счёт|das Sparkonto|Savings account
w20|Текущий счёт|das Privatkonto|Current account` }),
  'cards-atms': topicDraft({ participants: p.bank,
    phrases: `p01|Я потерял банковскую карту.|Ich habe meine Bankkarte verloren.|I have lost my bank card.
p02|Как её заблокировать?|Wie kann ich sie sperren lassen?|How can I have it blocked?
p03|Банкомат не вернул карту.|Der Bancomat hat meine Karte einbehalten.|The cash machine kept my card.
p04|Куда обратиться за помощью?|An wen soll ich mich wenden?|Who should I contact for help?
p05|Я хочу заказать новую карту.|Ich möchte eine neue Karte bestellen.|I would like to order a new card.
p06|Как проверить адрес доставки?|Wie kann ich die Lieferadresse prüfen?|How can I check the delivery address?
p07|Где ближайший банкомат?|Wo ist der nächste Bancomat?|Where is the nearest cash machine?
p08|Моя карта не работает.|Meine Karte funktioniert nicht.|My card is not working.
p09|Как изменить лимит снятия наличных?|Wie kann ich das Bezugslimit ändern?|How can I change my cash withdrawal limit?
p10|Предусмотрена комиссия за снятие?|Fällt beim Bargeldbezug eine Gebühr an?|Is there a cash withdrawal fee?
p11|Я забыл ПИН-код.|Ich habe meine PIN vergessen.|I have forgotten my PIN.
p12|Как безопасно получить новый ПИН-код?|Wie kann ich sicher eine neue PIN erhalten?|How can I safely obtain a new PIN?
p13|Срок действия карты скоро закончится.|Meine Karte läuft bald ab.|My card will expire soon.
p14|Бесконтактная оплата не проходит.|Die kontaktlose Zahlung funktioniert nicht.|Contactless payment is not working.
p15|Мне не выдали деньги, но сумма списана.|Ich habe kein Geld erhalten, aber der Betrag wurde abgebucht.|I did not receive any cash, but the amount was debited.`,
    replies: `r01|Я помогу вам найти службу блокировки.|Ich helfe Ihnen, die Sperrstelle zu erreichen.|I will help you reach the card blocking service.
r02|Я объясню официальный порядок блокировки.|Ich erkläre Ihnen den offiziellen Sperrablauf.|I will explain the official blocking procedure.
r03|Где находится этот банкомат?|Wo befindet sich dieser Bancomat?|Where is that cash machine?
r04|Я дам контакт оператора банкомата.|Ich gebe Ihnen den Kontakt des Bancomatbetreibers.|I will give you the cash machine operator’s contact details.
r05|Сначала проверим вашу личность.|Zuerst prüfen wir Ihre Identität.|First we will verify your identity.
r06|Проверим данные через защищённый канал банка.|Wir prüfen die Angaben über einen sicheren Kanal der Bank.|We will check the details through a secure bank channel.`,
    dialogues: `d01|Потерянная карта|Eine verlorene Karte|A lost card
d02|Карта в банкомате|Eine einbehaltene Karte|A retained card
d03|Замена карты|Eine Ersatzkarte bestellen|Ordering a replacement card`,
    words: `w01|Банковская карта|die Bankkarte|Bank card
w02|Банкомат|der Bancomat|Cash machine
w03|Блокировка|die Sperrung|Blocking
w04|ПИН-код|die PIN|PIN
w05|Снятие наличных|der Bargeldbezug|Cash withdrawal
w06|Лимит|das Limit|Limit
w07|Срок действия|die Gültigkeit|Validity
w08|Замена карты|die Ersatzkarte|Replacement card
w09|Дебетовая карта|die Debitkarte|Debit card
w10|Кредитная карта|die Kreditkarte|Credit card
w11|Комиссия|die Gebühr|Fee
w12|Списание|die Abbuchung|Debit
w13|Терминал|das Kartenterminal|Card terminal
w14|Чек банкомата|der Bancomatbeleg|Cash machine receipt
w15|Оператор банкомата|der Bancomatbetreiber|Cash machine operator
w16|Адрес доставки|die Lieferadresse|Delivery address
w17|Проверка личности|die Identitätsprüfung|Identity verification
w18|Бесконтактный|kontaktlos|Contactless
w19|Заблокированный|gesperrt|Blocked
w20|Потерять|verlieren|To lose` }),
  'transfers-payments': topicDraft({ participants: p.bank,
    phrases: `p01|Я хочу сделать банковский перевод.|Ich möchte eine Überweisung machen.|I would like to make a bank transfer.
p02|Какие данные получателя нужны?|Welche Angaben zum Empfänger brauche ich?|Which recipient details do I need?
p03|Я ошибся в назначении платежа.|Ich habe im Zahlungszweck einen Fehler gemacht.|I made a mistake in the payment reference.
p04|Можно исправить ещё не исполненный платёж?|Kann ich eine noch nicht ausgeführte Zahlung korrigieren?|Can I correct a payment that has not been processed yet?
p05|Как настроить регулярный перевод?|Wie richte ich einen Dauerauftrag ein?|How do I set up a standing order?
p06|Можно выбрать дату исполнения?|Kann ich ein Ausführungsdatum wählen?|Can I choose the execution date?
p07|Перевод ещё не дошёл до получателя.|Die Überweisung ist noch nicht beim Empfänger angekommen.|The recipient has not received the transfer yet.
p08|Где посмотреть статус платежа?|Wo sehe ich den Zahlungsstatus?|Where can I see the payment status?
p09|Мне нужно подтверждение перевода.|Ich brauche eine Zahlungsbestätigung.|I need a payment confirmation.
p10|Какая комиссия за международный перевод?|Welche Gebühren fallen für eine Auslandsüberweisung an?|What are the fees for an international transfer?
p11|Какой обменный курс будет применён?|Welcher Wechselkurs wird angewendet?|Which exchange rate will be used?
p12|Я хочу отменить регулярный платёж.|Ich möchte einen Dauerauftrag löschen.|I would like to cancel a standing order.
p13|Как отсканировать QR-счёт?|Wie scanne ich eine QR-Rechnung?|How do I scan a QR-bill?
p14|Проверьте, пожалуйста, реквизиты.|Prüfen Sie bitte die Zahlungsangaben.|Please check the payment details.
p15|Я хочу уточнить, можно ли отозвать перевод.|Ich möchte klären, ob ein Rückruf der Überweisung möglich ist.|I would like to check whether the transfer can be recalled.`,
    replies: `r01|Перевод внутри страны или за границу?|Ist es eine Inland- oder eine Auslandsüberweisung?|Is it a domestic or international transfer?
r02|Я покажу необходимые поля в форме.|Ich zeige Ihnen die erforderlichen Felder im Formular.|I will show you the required fields in the form.
r03|Когда вы отправили платёж?|Wann haben Sie die Zahlung erfasst?|When did you enter the payment?
r04|Проверим его текущий статус.|Wir prüfen den aktuellen Status.|Let us check its current status.
r05|Откройте раздел регулярных платежей.|Öffnen Sie den Bereich für Daueraufträge.|Open the standing orders section.
r06|Да, выберите дату в этом поле.|Ja, wählen Sie das Datum in diesem Feld.|Yes, select the date in this field.`,
    dialogues: `d01|Данные для перевода|Angaben für eine Überweisung|Transfer details
d02|Ошибка в платеже|Ein Fehler bei einer Zahlung|An error in a payment
d03|Регулярный перевод|Ein Dauerauftrag|A standing order`,
    words: `w01|Перевод|die Überweisung|Transfer
w02|Получатель|die Empfängerin / der Empfänger|Recipient
w03|Реквизиты|die Zahlungsangaben|Payment details
w04|Назначение платежа|der Zahlungszweck|Payment reference
w05|Дата исполнения|das Ausführungsdatum|Execution date
w06|Регулярный перевод|der Dauerauftrag|Standing order
w07|Международный перевод|die Auslandsüberweisung|International transfer
w08|Внутренний перевод|die Inlandüberweisung|Domestic transfer
w09|Обменный курс|der Wechselkurs|Exchange rate
w10|Подтверждение платежа|die Zahlungsbestätigung|Payment confirmation
w11|QR-счёт|die QR-Rechnung|QR-bill
w12|Сумма перевода|der Überweisungsbetrag|Transfer amount
w13|Статус платежа|der Zahlungsstatus|Payment status
w14|Отзыв перевода|der Zahlungsrückruf|Payment recall
w15|Валюта|die Währung|Currency
w16|Зачисление|die Gutschrift|Credit
w17|Комиссия|die Gebühr|Fee
w18|Банковский рабочий день|der Bankarbeitstag|Banking day
w19|Исполненный|ausgeführt|Processed
w20|Ожидающий|ausstehend|Pending` }),
  'bills-debts': topicDraft({ participants: p.support,
    phrases: `p01|У меня вопрос по вашему счёту.|Ich habe eine Frage zu Ihrer Rechnung.|I have a question about your invoice.
p02|За какую услугу начислена эта сумма?|Für welche Leistung wurde dieser Betrag verrechnet?|Which service is this amount for?
p03|Я уже оплатил этот счёт.|Ich habe diese Rechnung bereits bezahlt.|I have already paid this bill.
p04|Можно отправить подтверждение оплаты?|Kann ich Ihnen den Zahlungsbeleg schicken?|May I send you proof of payment?
p05|Я не могу внести всю сумму сразу.|Ich kann nicht den ganzen Betrag auf einmal bezahlen.|I cannot pay the full amount at once.
p06|Можно обсудить оплату частями?|Können wir eine Ratenzahlung besprechen?|Could we discuss paying in instalments?
p07|Когда истекает срок оплаты?|Wann ist die Zahlungsfrist?|When is the payment deadline?
p08|Я получил напоминание об оплате.|Ich habe eine Mahnung erhalten.|I have received a payment reminder.
p09|Мне кажется, в расчёте ошибка.|Ich glaube, die Berechnung enthält einen Fehler.|I think there is an error in the calculation.
p10|Можно получить подробную расшифровку?|Kann ich eine detaillierte Aufstellung bekommen?|Could I get an itemised breakdown?
p11|Прошу уточнить остаток задолженности.|Bitte teilen Sie mir den offenen Restbetrag mit.|Please tell me the outstanding balance.
p12|Я хочу договориться о новом сроке.|Ich möchte einen neuen Zahlungstermin vereinbaren.|I would like to agree on a new payment date.
p13|Этот счёт мне не принадлежит.|Diese Rechnung betrifft mich nicht.|This bill is not mine.
p14|Где получить независимую консультацию по долгам?|Wo bekomme ich eine unabhängige Schuldenberatung?|Where can I get independent debt advice?
p15|Подтвердите, пожалуйста, договорённость письменно.|Bestätigen Sie die Vereinbarung bitte schriftlich.|Please confirm the arrangement in writing.`,
    replies: `r01|Пожалуйста, назовите номер счёта.|Nennen Sie bitte die Rechnungsnummer.|Please give me the invoice number.
r02|Я посмотрю детализацию счёта.|Ich schaue in die Rechnungsdetails.|I will check the invoice details.
r03|Когда была произведена оплата?|Wann haben Sie bezahlt?|When did you pay?
r04|Да, отправьте его через наш защищённый канал.|Ja, senden Sie ihn über unseren sicheren Kanal.|Yes, send it through our secure channel.
r05|Давайте обсудим возможные варианты.|Besprechen wir die möglichen Optionen.|Let us discuss the available options.
r06|Я уточню, можем ли мы предложить такой план.|Ich kläre, ob wir einen solchen Plan anbieten können.|I will check whether we can offer such a plan.`,
    dialogues: `d01|Разобраться в счёте|Eine Rechnung klären|Clarifying a bill
d02|Оплата уже выполнена|Eine bereits bezahlte Rechnung|An already paid bill
d03|Обсудить рассрочку|Eine Ratenzahlung besprechen|Discussing instalments`,
    words: `w01|Счёт|die Rechnung|Invoice
w02|Номер счёта|die Rechnungsnummer|Invoice number
w03|Задолженность|der offene Betrag|Outstanding amount
w04|Долги|die Schulden|Debts
w05|Срок оплаты|die Zahlungsfrist|Payment deadline
w06|Напоминание об оплате|die Mahnung|Payment reminder
w07|Оплата частями|die Ratenzahlung|Payment in instalments
w08|Взнос|die Rate|Instalment
w09|Остаток|der Restbetrag|Remaining balance
w10|Подтверждение оплаты|der Zahlungsbeleg|Proof of payment
w11|Детализация|die Aufstellung|Breakdown
w12|Услуга|die Leistung|Service
w13|Расчёт|die Berechnung|Calculation
w14|Договорённость|die Vereinbarung|Arrangement
w15|Консультация по долгам|die Schuldenberatung|Debt advice
w16|Продление срока|die Fristverlängerung|Deadline extension
w17|Зачисление платежа|der Zahlungseingang|Receipt of payment
w18|Двойное начисление|die doppelte Verrechnung|Duplicate charge
w19|Оплаченный|bezahlt|Paid
w20|Неоплаченный|unbezahlt|Unpaid` }),
  'insurance-claims': topicDraft({ participants: p.insurance,
    phrases: `p01|Я хочу разобраться в своём страховом полисе.|Ich möchte meine Versicherungspolice verstehen.|I would like to understand my insurance policy.
p02|Что именно покрывает эта страховка?|Was deckt diese Versicherung genau ab?|What exactly does this insurance cover?
p03|Я хочу сообщить о страховом случае.|Ich möchte einen Schaden melden.|I would like to report an insurance claim.
p04|Какие подтверждения нужно приложить?|Welche Belege soll ich beilegen?|Which supporting documents should I attach?
p05|Как узнать статус моего обращения?|Wie erfahre ich den Stand meiner Schadensmeldung?|How can I check the status of my claim?
p06|Есть ли номер моего случая?|Gibt es eine Schadennummer für meinen Fall?|Is there a claim number for my case?
p07|Какова сумма франшизы по моему договору?|Wie hoch ist die Franchise in meinem Vertrag?|What is the deductible under my policy?
p08|Какая часть расходов остаётся за мной?|Welchen Teil der Kosten muss ich selbst tragen?|What share of the costs do I have to pay myself?
p09|Есть ли исключения из покрытия?|Gibt es Ausschlüsse vom Versicherungsschutz?|Are there any exclusions from cover?
p10|Я хочу сравнить условия страхования.|Ich möchte die Versicherungsbedingungen vergleichen.|I would like to compare the insurance terms.
p11|Можно прислать решение письменно?|Können Sie mir den Entscheid schriftlich schicken?|Could you send me the decision in writing?
p12|Мне нужно объяснение отказа.|Ich brauche eine Erklärung für die Ablehnung.|I need an explanation of the rejection.
p13|В какие сроки нужно сообщить о случае?|Welche Meldefrist gilt für diesen Schaden?|What reporting deadline applies to this claim?
p14|Я сохранил фотографии и чеки.|Ich habe Fotos und Belege aufbewahrt.|I have kept photographs and receipts.
p15|К кому обратиться с вопросом по договору?|An wen wende ich mich bei Fragen zum Vertrag?|Who should I contact about the policy?`,
    replies: `r01|Какой раздел вы хотите обсудить?|Welchen Abschnitt möchten Sie besprechen?|Which section would you like to discuss?
r02|Посмотрим покрытие в вашем договоре.|Wir schauen den Deckungsumfang in Ihrem Vertrag an.|Let us check the cover in your policy.
r03|Расскажите, что и когда произошло.|Schildern Sie bitte, was wann passiert ist.|Please describe what happened and when.
r04|Я пришлю список для вашего случая.|Ich schicke Ihnen die Liste für Ihren Fall.|I will send you the checklist for your claim.
r05|Я посмотрю ваше дело.|Ich schaue in Ihr Dossier.|I will check your file.
r06|Да, я укажу его в подтверждении.|Ja, ich nenne sie in der Bestätigung.|Yes, I will include it in the confirmation.`,
    dialogues: `d01|Страховое покрытие|Der Versicherungsschutz|Insurance cover
d02|Сообщить о случае|Einen Schaden melden|Reporting a claim
d03|Проверить рассмотрение|Die Bearbeitung prüfen|Checking claim progress`,
    words: `w01|Страхование|die Versicherung|Insurance
w02|Полис|die Police|Policy
w03|Покрытие|die Deckung|Cover
w04|Страховой взнос|die Prämie|Premium
w05|Франшиза|die Franchise|Deductible
w06|Собственное участие|der Selbstbehalt|Co-payment
w07|Страховой случай|der Versicherungsfall|Insured event
w08|Заявление об ущербе|die Schadensmeldung|Claim notification
w09|Номер случая|die Schadennummer|Claim number
w10|Ущерб|der Schaden|Damage
w11|Возмещение|die Entschädigung|Compensation
w12|Исключение|der Ausschluss|Exclusion
w13|Решение|der Entscheid|Decision
w14|Отказ|die Ablehnung|Rejection
w15|Подтверждающий документ|der Beleg|Supporting document
w16|Условия страхования|die Versicherungsbedingungen|Insurance terms
w17|Срок уведомления|die Meldefrist|Reporting deadline
w18|Дело|das Dossier|File
w19|Ответственность перед третьими лицами|die Haftpflicht|Third-party liability
w20|Страхователь|die versicherungsnehmende Person|Policyholder` }),
  'account-problems': topicDraft({ participants: p.bank,
    phrases: `p01|Я не могу войти в интернет-банк.|Ich kann mich nicht im E-Banking anmelden.|I cannot log in to online banking.
p02|Как восстановить доступ безопасно?|Wie kann ich den Zugang sicher wiederherstellen?|How can I safely restore access?
p03|Я не узнаю эту операцию по счёту.|Ich erkenne diese Kontobewegung nicht.|I do not recognise this transaction.
p04|Можно проверить её происхождение?|Können Sie prüfen, woher sie stammt?|Could you check where it came from?
p05|Мне пришло подозрительное сообщение от имени банка.|Ich habe eine verdächtige Nachricht im Namen der Bank erhalten.|I received a suspicious message claiming to be from the bank.
p06|Куда можно передать его для проверки?|Wohin kann ich sie zur Prüfung weiterleiten?|Where can I send it to be checked?
p07|Мой доступ заблокирован.|Mein Zugang ist gesperrt.|My access is blocked.
p08|Код подтверждения не приходит.|Der Bestätigungscode kommt nicht an.|The verification code is not arriving.
p09|У меня изменился номер телефона.|Meine Telefonnummer hat sich geändert.|My phone number has changed.
p10|Как обновить контактные данные?|Wie aktualisiere ich meine Kontaktdaten?|How do I update my contact details?
p11|Я хочу сообщить о возможном мошенничестве.|Ich möchte einen möglichen Betrugsfall melden.|I would like to report possible fraud.
p12|Баланс не совпадает с моими записями.|Der Kontostand stimmt nicht mit meinen Aufzeichnungen überein.|The balance does not match my records.
p13|Мне нужна выписка за прошлый месяц.|Ich brauche einen Kontoauszug für den letzten Monat.|I need a statement for last month.
p14|Как обратиться в официальную службу поддержки?|Wie erreiche ich den offiziellen Kundendienst?|How can I contact official customer support?
p15|Я хочу обсудить закрытие счёта.|Ich möchte die Kontoschliessung besprechen.|I would like to discuss closing the account.`,
    replies: `r01|Какое сообщение об ошибке появляется?|Welche Fehlermeldung erscheint?|What error message do you see?
r02|Я объясню процедуру банка.|Ich erkläre Ihnen das Verfahren der Bank.|I will explain the bank’s procedure.
r03|Назовите дату и сумму операции.|Nennen Sie bitte Datum und Betrag der Buchung.|Please tell me the transaction date and amount.
r04|Мы проверим данные этой операции.|Wir prüfen die Angaben zu dieser Buchung.|We will check the transaction details.
r05|Спасибо, что сообщили о подозрении.|Danke, dass Sie Ihren Verdacht melden.|Thank you for reporting your concern.
r06|Я укажу официальный канал для таких сообщений.|Ich nenne Ihnen den offiziellen Meldekanal.|I will give you the official reporting channel.`,
    dialogues: `d01|Восстановление доступа|Den Zugang wiederherstellen|Restoring access
d02|Незнакомая операция|Eine unbekannte Buchung|An unrecognised transaction
d03|Подозрительное сообщение|Eine verdächtige Nachricht|A suspicious message`,
    words: `w01|Доступ|der Zugang|Access
w02|Блокировка|die Sperrung|Block
w03|Ошибка входа|der Anmeldefehler|Login error
w04|Код подтверждения|der Bestätigungscode|Verification code
w05|Контактные данные|die Kontaktdaten|Contact details
w06|Операция по счёту|die Kontobewegung|Account transaction
w07|Списание|die Belastung|Debit
w08|Баланс|der Kontostand|Balance
w09|Выписка|der Kontoauszug|Bank statement
w10|Мошенничество|der Betrug|Fraud
w11|Подозрение|der Verdacht|Suspicion
w12|Подозрительное сообщение|die verdächtige Nachricht|Suspicious message
w13|Фишинг|das Phishing|Phishing
w14|Служба поддержки|der Kundendienst|Customer support
w15|Защищённый канал|der sichere Kanal|Secure channel
w16|Восстановление|die Wiederherstellung|Recovery
w17|Закрытие счёта|die Kontoschliessung|Account closure
w18|Сообщение об ошибке|die Fehlermeldung|Error message
w19|Официальный|offiziell|Official
w20|Неизвестный|unbekannt|Unknown` }),
};
