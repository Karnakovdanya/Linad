import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const housingMaterials = {
  'apartment-search': topicDraft({ participants: p.housing,
    phrases: `p01|Квартира из объявления ещё свободна?|Ist die ausgeschriebene Wohnung noch frei?|Is the advertised flat still available?
p02|С какого числа можно въехать?|Ab wann kann man einziehen?|When is it available to move into?
p03|Можно договориться о просмотре?|Können wir einen Besichtigungstermin vereinbaren?|Could we arrange a viewing?
p04|Можно прийти вечером?|Kann ich am Abend kommen?|Could I come in the evening?
p05|Как подать заявку на эту квартиру?|Wie kann ich mich für diese Wohnung bewerben?|How can I apply for this flat?
p06|Какие документы нужны для заявки?|Welche Unterlagen brauchen Sie für die Bewerbung?|Which documents do you need for the application?
p07|Я ищу двухкомнатную квартиру.|Ich suche eine Zweizimmerwohnung.|I am looking for a two-room flat.
p08|Какова общая месячная аренда?|Wie hoch ist die monatliche Bruttomiete?|What is the total monthly rent?
p09|Дополнительные расходы уже включены?|Sind die Nebenkosten schon enthalten?|Are the additional charges already included?
p10|Можно держать домашних животных?|Sind Haustiere erlaubt?|Are pets allowed?
p11|Есть ли рядом общественный транспорт?|Gibt es in der Nähe öffentliche Verkehrsmittel?|Is there public transport nearby?
p12|На каком этаже находится квартира?|In welchem Stock liegt die Wohnung?|Which floor is the flat on?
p13|В доме есть лифт?|Hat das Haus einen Lift?|Does the building have a lift?
p14|Квартира сдаётся с мебелью?|Wird die Wohnung möbliert vermietet?|Is the flat let furnished?
p15|Когда вы сообщите о решении?|Wann geben Sie über die Entscheidung Bescheid?|When will you let me know your decision?`,
    replies: `r01|Да, мы ещё ищем жильца.|Ja, wir suchen noch eine Mietpartei.|Yes, we are still looking for a tenant.
r02|Она свободна с начала следующего месяца.|Sie ist ab Anfang nächsten Monats frei.|It is available from the start of next month.
r03|Да, какие дни вам подходят?|Ja, welche Tage passen Ihnen?|Yes, which days suit you?
r04|Да, в четверг после шести.|Ja, am Donnerstag nach sechs.|Yes, on Thursday after six.
r05|Отправьте анкету через наш сайт.|Senden Sie das Formular über unsere Website.|Submit the form through our website.
r06|Я пришлю вам список документов.|Ich schicke Ihnen die Unterlagenliste.|I will send you the document checklist.`,
    dialogues: `d01|Позвонить по объявлению|Auf ein Inserat antworten|Responding to an advert
d02|Договориться о просмотре|Eine Besichtigung vereinbaren|Arranging a viewing
d03|Подать заявку|Sich für die Wohnung bewerben|Applying for the flat`,
    words: `w01|Квартира|die Wohnung|Flat
w02|Объявление|das Inserat|Advertisement
w03|Аренда|die Miete|Rent
w04|Общая аренда|die Bruttomiete|Total rent
w05|Дополнительные расходы|die Nebenkosten|Additional charges
w06|Комната|das Zimmer|Room
w07|Этаж|der Stock|Floor
w08|Просмотр|die Besichtigung|Viewing
w09|Заявка на квартиру|die Wohnungsbewerbung|Rental application
w10|Арендодатель|die Vermieterin / der Vermieter|Landlord
w11|Жилец|die Mieterin / der Mieter|Tenant
w12|Домашнее животное|das Haustier|Pet
w13|Мебель|die Möbel|Furniture
w14|Лифт|der Lift|Lift
w15|Местоположение|die Lage|Location
w16|Балкон|der Balkon|Balcony
w17|Площадь|die Wohnfläche|Floor area
w18|Въезд|der Einzug|Moving in
w19|Свободный|frei|Available
w20|Меблированный|möbliert|Furnished` }),
  'apartment-viewing': topicDraft({ participants: p.housing,
    phrases: `p01|Можно посмотреть все комнаты?|Darf ich alle Zimmer anschauen?|May I look at all the rooms?
p02|Куда выходят окна?|In welche Richtung gehen die Fenster?|Which direction do the windows face?
p03|Здесь обычно тихо?|Ist es hier normalerweise ruhig?|Is it usually quiet here?
p04|Какая здесь система отопления?|Welche Heizung gibt es hier?|What type of heating is there?
p05|К квартире относится подвал?|Gehört ein Kellerabteil zur Wohnung?|Does the flat come with a cellar compartment?
p06|Можно посмотреть прачечную?|Darf ich die Waschküche sehen?|May I see the laundry room?
p07|Когда делали последний ремонт?|Wann wurde zuletzt renoviert?|When was it last renovated?
p08|Эта техника остаётся в квартире?|Bleiben diese Geräte in der Wohnung?|Will these appliances stay in the flat?
p09|Где можно поставить велосипед?|Wo kann ich mein Velo abstellen?|Where can I store my bicycle?
p10|Есть ли место для автомобиля?|Gibt es einen Parkplatz?|Is there a parking space?
p11|Я заметил пятно на стене.|Mir ist ein Fleck an der Wand aufgefallen.|I noticed a stain on the wall.
p12|Можно сделать несколько фотографий?|Darf ich ein paar Fotos machen?|May I take a few photographs?
p13|Как распределяется время стирки?|Wie sind die Waschzeiten geregelt?|How are laundry times arranged?
p14|Можно измерить эту стену?|Darf ich diese Wand ausmessen?|May I measure this wall?
p15|Спасибо, я сообщу о своём решении.|Danke, ich gebe Ihnen meine Entscheidung bekannt.|Thank you, I will let you know my decision.`,
    replies: `r01|Конечно, начнём с гостиной.|Natürlich, wir beginnen im Wohnzimmer.|Of course, let us start with the living room.
r02|Окна гостиной выходят на юг.|Die Wohnzimmerfenster gehen nach Süden.|The living room windows face south.
r03|Да, окна выходят во двор.|Ja, die Fenster gehen zum Innenhof.|Yes, the windows face the courtyard.
r04|Здесь центральное отопление.|Hier gibt es eine Zentralheizung.|There is central heating here.
r05|Да, я покажу его после осмотра.|Ja, ich zeige es Ihnen danach.|Yes, I will show it to you afterwards.
r06|Конечно, она находится внизу.|Natürlich, sie befindet sich unten.|Of course, it is downstairs.`,
    dialogues: `d01|Осмотр комнат|Die Zimmer anschauen|Viewing the rooms
d02|Тишина и отопление|Ruhe und Heizung|Noise and heating
d03|Общие помещения|Die Gemeinschaftsräume|Shared facilities`,
    words: `w01|Гостиная|das Wohnzimmer|Living room
w02|Спальня|das Schlafzimmer|Bedroom
w03|Кухня|die Küche|Kitchen
w04|Ванная|das Badezimmer|Bathroom
w05|Коридор|der Flur|Hallway
w06|Окно|das Fenster|Window
w07|Стена|die Wand|Wall
w08|Пол|der Boden|Floor
w09|Потолок|die Decke|Ceiling
w10|Подвал|das Kellerabteil|Cellar compartment
w11|Прачечная|die Waschküche|Laundry room
w12|Двор|der Innenhof|Courtyard
w13|Отопление|die Heizung|Heating
w14|Посудомоечная машина|der Geschirrspüler|Dishwasher
w15|Холодильник|der Kühlschrank|Fridge
w16|Парковочное место|der Parkplatz|Parking space
w17|Велосипед|das Velo|Bicycle
w18|Пятно|der Fleck|Stain
w19|Ремонт|die Renovation|Renovation
w20|Измерять|ausmessen|To measure` }),
  'landlord-communication': topicDraft({ participants: p.housing,
    phrases: `p01|К кому обращаться по вопросам квартиры?|An wen wende ich mich bei Fragen zur Wohnung?|Who should I contact about the flat?
p02|Как лучше с вами связаться?|Wie erreiche ich Sie am besten?|What is the best way to contact you?
p03|Можно установить полку на стене?|Darf ich ein Regal an der Wand montieren?|May I put a shelf on the wall?
p04|Нужно ваше письменное разрешение?|Brauche ich Ihre schriftliche Zustimmung?|Do I need your written consent?
p05|У соседей поздно вечером громкая музыка.|Bei den Nachbarn läuft spätabends laute Musik.|The neighbours play loud music late at night.
p06|Как лучше обсудить эту проблему?|Wie können wir dieses Problem am besten besprechen?|What is the best way to discuss this problem?
p07|Мне нужна копия правил проживания.|Ich brauche eine Kopie der Hausordnung.|I need a copy of the house rules.
p08|Я потерял один ключ.|Ich habe einen Schlüssel verloren.|I have lost one key.
p09|Когда может прийти смотритель?|Wann kann der Hauswart vorbeikommen?|When can the caretaker come round?
p10|Прошу заранее согласовать визит.|Bitte vereinbaren Sie den Besuch vorher mit mir.|Please arrange the visit with me in advance.
p11|Я буду отсутствовать на следующей неделе.|Ich bin nächste Woche nicht da.|I will be away next week.
p12|Можно уточнить правила пользования балконом?|Können Sie die Regeln für die Balkonnutzung erklären?|Could you explain the rules for using the balcony?
p13|Куда сообщать о проблемах в доме?|Wo melde ich Probleme im Haus?|Where should I report problems in the building?
p14|Спасибо за быстрый ответ.|Danke für Ihre schnelle Antwort.|Thank you for your quick reply.
p15|Я отправлю вам описание по почте.|Ich schicke Ihnen eine Beschreibung per E-Mail.|I will email you a description.`,
    replies: `r01|Обращайтесь в нашу управляющую компанию.|Wenden Sie sich an unsere Verwaltung.|Please contact our property management office.
r02|Лучше всего по электронной почте.|Am besten per E-Mail.|Email is best.
r03|Опишите, как вы хотите её закрепить.|Beschreiben Sie bitte, wie Sie es befestigen möchten.|Please describe how you would like to attach it.
r04|Я проверю договор и отвечу письменно.|Ich prüfe den Vertrag und antworte schriftlich.|I will check the agreement and reply in writing.
r05|Спасибо, что сообщили об этом.|Danke, dass Sie uns das melden.|Thank you for reporting that.
r06|Давайте сначала уточним время и обстоятельства.|Klären wir zuerst die Zeiten und die Umstände.|Let us first clarify the times and circumstances.`,
    dialogues: `d01|Контакты управления|Die Verwaltung erreichen|Contacting property management
d02|Изменения в квартире|Änderungen in der Wohnung|Changes to the flat
d03|Шум в доме|Lärm im Haus|Noise in the building`,
    words: `w01|Управляющая компания|die Verwaltung|Property management
w02|Смотритель|der Hauswart|Caretaker
w03|Правила проживания|die Hausordnung|House rules
w04|Сосед|die Nachbarin / der Nachbar|Neighbour
w05|Шум|der Lärm|Noise
w06|Время тишины|die Ruhezeit|Quiet hours
w07|Ключ|der Schlüssel|Key
w08|Разрешение|die Zustimmung|Consent
w09|Письменный ответ|die schriftliche Antwort|Written reply
w10|Визит|der Besuch|Visit
w11|Договорённость|die Vereinbarung|Arrangement
w12|Обращение|die Mitteilung|Notification
w13|Контактное лицо|die Kontaktperson|Contact person
w14|Лестничная клетка|das Treppenhaus|Stairwell
w15|Почтовый ящик|der Briefkasten|Letterbox
w16|Дверной звонок|die Klingel|Doorbell
w17|Полка|das Regal|Shelf
w18|Крепление|die Befestigung|Fixing
w19|Отсутствие|die Abwesenheit|Absence
w20|Общие помещения|die Gemeinschaftsräume|Shared rooms` }),
  'lease-costs': topicDraft({ participants: p.housing,
    phrases: `p01|Можно вместе пройтись по договору?|Können wir den Vertrag gemeinsam durchgehen?|Could we go through the agreement together?
p02|Что означает этот пункт?|Was bedeutet diese Klausel?|What does this clause mean?
p03|Какие расходы входят в аренду?|Welche Kosten sind in der Miete enthalten?|Which costs are included in the rent?
p04|За электричество нужно платить отдельно?|Wird der Strom separat verrechnet?|Is electricity billed separately?
p05|Как перечислить залог?|Wie überweise ich das Mietzinsdepot?|How do I transfer the rental deposit?
p06|Какие документы подтверждают внесение залога?|Welche Unterlagen bestätigen die Einzahlung des Depots?|Which documents confirm payment of the deposit?
p07|Каков срок уведомления о расторжении?|Welche Kündigungsfrist ist vereinbart?|What notice period is agreed?
p08|Какие даты расторжения указаны в договоре?|Welche Kündigungstermine stehen im Vertrag?|Which termination dates are listed in the agreement?
p09|Когда нужно платить аренду?|Wann ist die Miete fällig?|When is the rent due?
p10|Как составляется расчёт дополнительных расходов?|Wie wird die Nebenkostenabrechnung erstellt?|How is the additional charges statement prepared?
p11|Это авансовый платёж или фиксированная сумма?|Ist das eine Akontozahlung oder eine Pauschale?|Is that an advance payment or a flat rate?
p12|Можно получить копию подписанного договора?|Kann ich eine Kopie des unterschriebenen Vertrags bekommen?|Could I get a copy of the signed agreement?
p13|Я хочу проверить сумму в счёте.|Ich möchte den Rechnungsbetrag prüfen.|I would like to check the amount on the bill.
p14|Куда направлять вопросы по расчётам?|Wohin kann ich Fragen zur Abrechnung senden?|Where can I send questions about the statement?
p15|Мне нужно время, чтобы прочитать договор.|Ich brauche Zeit, um den Vertrag zu lesen.|I need time to read the agreement.`,
    replies: `r01|Конечно, что вы хотите уточнить?|Natürlich, was möchten Sie klären?|Of course, what would you like to clarify?
r02|Здесь описан порядок уведомления.|Hier wird das Mitteilungsverfahren beschrieben.|This describes the notification procedure.
r03|Давайте посмотрим раздел о расходах.|Schauen wir in den Abschnitt zu den Kosten.|Let us look at the section on costs.
r04|Я проверю, как это указано в договоре.|Ich prüfe, wie das im Vertrag geregelt ist.|I will check what the agreement says.
r05|Я пришлю инструкции по вашему договору.|Ich schicke Ihnen die Angaben zu Ihrem Vertrag.|I will send you the details for your agreement.
r06|Я уточню, какое подтверждение вам выдадут.|Ich kläre, welche Bestätigung Sie erhalten.|I will check which confirmation you will receive.`,
    dialogues: `d01|Прочитать условия|Vertragsbedingungen lesen|Reading the terms
d02|Уточнить расходы|Die Kosten klären|Clarifying costs
d03|Внесение залога|Das Depot einzahlen|Paying the deposit`,
    words: `w01|Договор аренды|der Mietvertrag|Tenancy agreement
w02|Пункт договора|die Vertragsklausel|Contract clause
w03|Арендная плата|der Mietzins|Rent
w04|Залог|das Mietzinsdepot|Rental deposit
w05|Дополнительные расходы|die Nebenkosten|Additional charges
w06|Электричество|der Strom|Electricity
w07|Расчёт|die Abrechnung|Statement
w08|Авансовый платёж|die Akontozahlung|Advance payment
w09|Фиксированная сумма|die Pauschale|Flat rate
w10|Срок уведомления|die Kündigungsfrist|Notice period
w11|Дата расторжения|der Kündigungstermin|Termination date
w12|Подпись|die Unterschrift|Signature
w13|Срок оплаты|die Zahlungsfrist|Payment deadline
w14|Банковский перевод|die Überweisung|Bank transfer
w15|Счёт|die Rechnung|Bill
w16|Сумма|der Betrag|Amount
w17|Условие|die Bedingung|Condition
w18|Начало аренды|der Mietbeginn|Start of tenancy
w19|Расторжение|die Kündigung|Termination
w20|Копия договора|die Vertragskopie|Copy of the agreement` }),
  'repairs-problems': topicDraft({ participants: p.housing,
    phrases: `p01|В ванной течёт кран.|Der Wasserhahn im Bad tropft.|The tap in the bathroom is dripping.
p02|Когда может прийти сантехник?|Wann kann ein Sanitär kommen?|When can a plumber come?
p03|У меня не работает отопление.|Meine Heizung funktioniert nicht.|My heating is not working.
p04|Можно проверить его как можно скорее?|Kann das möglichst bald geprüft werden?|Could it be checked as soon as possible?
p05|На стене появилась сырость.|An der Wand ist eine feuchte Stelle entstanden.|A damp patch has appeared on the wall.
p06|Куда отправить фотографии?|Wohin soll ich die Fotos schicken?|Where should I send the photographs?
p07|В кухне не работает розетка.|Die Steckdose in der Küche funktioniert nicht.|The socket in the kitchen is not working.
p08|Я хочу сообщить о повреждении.|Ich möchte einen Schaden melden.|I would like to report some damage.
p09|Можно согласовать время ремонта?|Können wir einen Reparaturtermin vereinbaren?|Could we arrange a repair appointment?
p10|В это время я буду дома.|Zu dieser Zeit bin ich zu Hause.|I will be at home at that time.
p11|Вода не уходит из раковины.|Das Wasser im Lavabo läuft nicht ab.|The water in the basin is not draining.
p12|Дверь больше не закрывается.|Die Tür lässt sich nicht mehr schliessen.|The door no longer closes.
p13|Нужно ли мне что-нибудь подготовить?|Muss ich etwas vorbereiten?|Do I need to prepare anything?
p14|Пожалуйста, сообщите о возможных расходах заранее.|Informieren Sie mich bitte vorher über mögliche Kosten.|Please tell me about any possible costs in advance.
p15|Проблема после ремонта осталась.|Das Problem besteht nach der Reparatur weiterhin.|The problem remains after the repair.`,
    replies: `r01|Спасибо, когда вы это заметили?|Danke, wann haben Sie das bemerkt?|Thank you, when did you notice it?
r02|Я свяжусь с мастером и сообщу время.|Ich kontaktiere den Sanitär und teile Ihnen den Termin mit.|I will contact the plumber and let you know the time.
r03|Это касается всех комнат?|Betrifft das alle Zimmer?|Does it affect all the rooms?
r04|Да, я передам сообщение в техническую службу.|Ja, ich leite die Meldung an den technischen Dienst weiter.|Yes, I will pass the report to the maintenance team.
r05|Пожалуйста, укажите точное место.|Beschreiben Sie bitte die genaue Stelle.|Please describe the exact location.
r06|Отправьте их на адрес нашей администрации.|Schicken Sie sie an die E-Mail-Adresse unserer Verwaltung.|Send them to our property management email address.`,
    dialogues: `d01|Протекающий кран|Ein tropfender Wasserhahn|A dripping tap
d02|Не работает отопление|Eine defekte Heizung|Heating not working
d03|Сообщить о сырости|Feuchtigkeit melden|Reporting damp`,
    words: `w01|Ремонт|die Reparatur|Repair
w02|Повреждение|der Schaden|Damage
w03|Кран|der Wasserhahn|Tap
w04|Сантехник|der Sanitär|Plumber
w05|Раковина|das Lavabo|Basin
w06|Розетка|die Steckdose|Socket
w07|Сырость|die Feuchtigkeit|Damp
w08|Плесень|der Schimmel|Mould
w09|Протечка|das Leck|Leak
w10|Отопление|die Heizung|Heating
w11|Техническая служба|der technische Dienst|Maintenance team
w12|Мастер|die Fachperson|Tradesperson
w13|Время ремонта|der Reparaturtermin|Repair appointment
w14|Дверной замок|das Türschloss|Door lock
w15|Труба|das Rohr|Pipe
w16|Слив|der Abfluss|Drain
w17|Сообщение о повреждении|die Schadensmeldung|Damage report
w18|Фотография|das Foto|Photograph
w19|Засорённый|verstopft|Blocked
w20|Неисправный|defekt|Faulty` }),
  'moving-address-change': topicDraft({ participants: p.housing,
    phrases: `p01|Я планирую переезд в конце месяца.|Ich plane meinen Umzug Ende Monat.|I am planning to move at the end of the month.
p02|Когда можно передать ключи?|Wann können wir die Schlüssel übergeben?|When can we hand over the keys?
p03|Нужно составить акт передачи квартиры?|Sollen wir ein Wohnungsübergabeprotokoll erstellen?|Should we draw up a flat handover report?
p04|Можно записать сюда имеющиеся повреждения?|Können wir die bestehenden Schäden hier festhalten?|Can we record the existing damage here?
p05|Я хочу сообщить новый адрес.|Ich möchte meine neue Adresse mitteilen.|I would like to notify you of my new address.
p06|Куда направят окончательный расчёт?|Wohin wird die Schlussabrechnung geschickt?|Where will the final statement be sent?
p07|Мне нужна коробка для хрупких вещей.|Ich brauche eine Schachtel für zerbrechliche Sachen.|I need a box for fragile items.
p08|Можно пользоваться лифтом во время переезда?|Darf ich den Lift für den Umzug benutzen?|May I use the lift during the move?
p09|Где может остановиться машина для переезда?|Wo darf der Umzugswagen stehen?|Where may the removal van park?
p10|Я хочу заказать пересылку почты.|Ich möchte einen Nachsendeauftrag einrichten.|I would like to arrange mail forwarding.
p11|Счётчики нужно снять в день передачи?|Sollen wir die Zählerstände am Übergabetag ablesen?|Should we read the meters on handover day?
p12|Я верну все комплекты ключей.|Ich gebe alle Schlüsselsätze zurück.|I will return all sets of keys.
p13|Какие требования к уборке перед выездом?|Welche Anforderungen gelten für die Endreinigung?|What are the end-of-tenancy cleaning requirements?
p14|Можно получить подписанную копию акта?|Kann ich eine unterschriebene Kopie des Protokolls bekommen?|Could I get a signed copy of the report?
p15|Я уточню регистрацию по новому адресу.|Ich werde die Anmeldung an der neuen Adresse klären.|I will check the registration process for my new address.`,
    replies: `r01|Давайте согласуем день передачи.|Vereinbaren wir den Übergabetag.|Let us agree on the handover day.
r02|Предлагаю понедельник утром.|Ich schlage Montagmorgen vor.|I suggest Monday morning.
r03|Да, мы пройдём по всем комнатам.|Ja, wir gehen durch alle Zimmer.|Yes, we will go through all the rooms.
r04|Да, внесём их в акт.|Ja, wir nehmen sie ins Protokoll auf.|Yes, we will include it in the report.
r05|Пришлите его, пожалуйста, письменно.|Schicken Sie sie bitte schriftlich.|Please send it in writing.
r06|На новый адрес, который вы нам укажете.|An die neue Adresse, die Sie uns angeben.|To the new address you provide.`,
    dialogues: `d01|Дата передачи ключей|Die Schlüsselübergabe planen|Planning the key handover
d02|Акт передачи|Das Übergabeprotokoll|The handover report
d03|Новый адрес|Die neue Adresse|The new address`,
    words: `w01|Переезд|der Umzug|Move
w02|Передача квартиры|die Wohnungsübergabe|Flat handover
w03|Акт передачи|das Übergabeprotokoll|Handover report
w04|Комплект ключей|der Schlüsselsatz|Set of keys
w05|Новый адрес|die neue Adresse|New address
w06|Пересылка почты|der Nachsendeauftrag|Mail forwarding
w07|Машина для переезда|der Umzugswagen|Removal van
w08|Коробка|die Schachtel|Box
w09|Упаковочный материал|das Verpackungsmaterial|Packing material
w10|Хрупкий|zerbrechlich|Fragile
w11|Уборка при выезде|die Endreinigung|End-of-tenancy cleaning
w12|Показание счётчика|der Zählerstand|Meter reading
w13|Окончательный расчёт|die Schlussabrechnung|Final statement
w14|Выезд|der Auszug|Moving out
w15|Въезд|der Einzug|Moving in
w16|Старая квартира|die alte Wohnung|Old flat
w17|Грузчик|die Umzugshilfe|Removal helper
w18|Упаковывать|einpacken|To pack
w19|Распаковывать|auspacken|To unpack
w20|Возвращать|zurückgeben|To return` }),
};
