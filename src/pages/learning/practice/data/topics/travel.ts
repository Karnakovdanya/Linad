import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const travelMaterials = {
  'buying-tickets': topicDraft({ participants: p.traveller,
    phrases: `p01|Мне нужен билет до Берна.|Ich brauche ein Billett nach Bern.|I need a ticket to Bern.
p02|Сколько стоит билет в одну сторону?|Wie viel kostet ein einfaches Billett?|How much is a one-way ticket?
p03|Можно купить билет туда и обратно?|Kann ich ein Retourbillett kaufen?|Can I buy a return ticket?
p04|Этот билет действует завтра?|Ist dieses Billett morgen gültig?|Is this ticket valid tomorrow?
p05|Есть билет на более ранний поезд?|Gibt es ein Billett für einen früheren Zug?|Is there a ticket for an earlier train?
p06|На этот поезд нужна бронь места?|Brauche ich für diesen Zug eine Sitzplatzreservation?|Do I need a seat reservation for this train?
p07|Я хочу ехать вторым классом.|Ich möchte in der zweiten Klasse reisen.|I would like to travel second class.
p08|Где находится билетный автомат?|Wo ist der Billettautomat?|Where is the ticket machine?
p09|Можно оплатить картой?|Kann ich mit Karte bezahlen?|Can I pay by card?
p10|Нужно ли распечатывать электронный билет?|Muss ich das elektronische Billett ausdrucken?|Do I need to print my electronic ticket?
p11|Покажите, пожалуйста, варианты маршрута.|Zeigen Sie mir bitte die möglichen Verbindungen.|Please show me the available connections.
p12|Сколько пересадок в этом маршруте?|Wie oft muss ich bei dieser Verbindung umsteigen?|How many changes are there on this route?
p13|У меня есть скидочная карта.|Ich habe eine Ermässigungskarte.|I have a discount card.
p14|Какие условия возврата билета?|Welche Bedingungen gelten für die Rückerstattung?|What are the ticket refund conditions?
p15|Пришлите подтверждение по почте.|Schicken Sie mir die Bestätigung bitte per E-Mail.|Please email me the confirmation.`,
    replies: `r01|На какое время вам нужен билет?|Für welche Uhrzeit brauchen Sie das Billett?|What time would you like to travel?
r02|Я посмотрю актуальную цену.|Ich schaue den aktuellen Preis nach.|I will check the current fare.
r03|Да, когда вы хотите вернуться?|Ja, wann möchten Sie zurückfahren?|Yes, when would you like to return?
r04|Давайте проверим дату в билете.|Prüfen wir das Datum auf dem Billett.|Let us check the date on the ticket.
r05|Да, есть поезд на час раньше.|Ja, es gibt einen Zug eine Stunde früher.|Yes, there is a train an hour earlier.
r06|Я проверю условия этого рейса.|Ich prüfe die Bedingungen für diese Verbindung.|I will check the requirements for this service.`,
    dialogues: `d01|Билет в кассе|Ein Billett am Schalter|At the ticket counter
d02|Обратная поездка|Die Rückfahrt|The return journey
d03|Выбор поезда|Einen Zug wählen|Choosing a train`,
    words: `w01|Билет|das Billett|Ticket
w02|Билет туда и обратно|das Retourbillett|Return ticket
w03|Поездка в одну сторону|die einfache Fahrt|One-way journey
w04|Касса|der Billettschalter|Ticket counter
w05|Билетный автомат|der Billettautomat|Ticket machine
w06|Второй класс|die zweite Klasse|Second class
w07|Первый класс|die erste Klasse|First class
w08|Скидка|die Ermässigung|Discount
w09|Маршрут|die Verbindung|Connection
w10|Пересадка|das Umsteigen|Changing trains
w11|Бронь места|die Sitzplatzreservation|Seat reservation
w12|Срок действия|die Gültigkeit|Validity
w13|Возврат денег|die Rückerstattung|Refund
w14|Подтверждение|die Bestätigung|Confirmation
w15|Стоимость проезда|der Fahrpreis|Fare
w16|Отправление|die Abfahrt|Departure
w17|Прибытие|die Ankunft|Arrival
w18|Дата поездки|das Reisedatum|Travel date
w19|Электронный билет|das elektronische Billett|Electronic ticket
w20|Оплата|die Zahlung|Payment` }),
  'station-train': topicDraft({ participants: p.traveller,
    phrases: `p01|С какого пути отправляется поезд?|Von welchem Gleis fährt der Zug ab?|Which platform does the train leave from?
p02|Как пройти на этот путь?|Wie komme ich zu diesem Gleis?|How do I get to that platform?
p03|Этот поезд идёт в Цюрих?|Fährt dieser Zug nach Zürich?|Does this train go to Zurich?
p04|Мне нужно пересаживаться?|Muss ich umsteigen?|Do I need to change trains?
p05|Это место свободно?|Ist dieser Platz frei?|Is this seat free?
p06|Куда можно поставить чемодан?|Wo kann ich meinen Koffer abstellen?|Where can I put my suitcase?
p07|Когда будет следующая остановка?|Wann kommt der nächste Halt?|When is the next stop?
p08|Я не расслышал объявление.|Ich habe die Durchsage nicht verstanden.|I did not catch the announcement.
p09|Поезд задерживается?|Hat der Zug Verspätung?|Is the train delayed?
p10|Здесь можно зарядить телефон?|Kann ich hier mein Handy laden?|Can I charge my phone here?
p11|Где находится вагон номер три?|Wo ist Wagen Nummer drei?|Where is carriage number three?
p12|Это тихий вагон?|Ist das ein Ruheabteil?|Is this a quiet carriage?
p13|Вот мой билет.|Hier ist mein Billett.|Here is my ticket.
p14|С какой стороны откроются двери?|Auf welcher Seite öffnen sich die Türen?|Which side will the doors open on?
p15|Мне выходить на следующей станции.|Ich steige am nächsten Bahnhof aus.|I am getting off at the next station.`,
    replies: `r01|С пути номер четыре.|Von Gleis vier.|From platform four.
r02|Пройдите через подземный переход.|Gehen Sie durch die Unterführung.|Go through the underpass.
r03|Да, это прямой поезд.|Ja, das ist ein direkter Zug.|Yes, this is a direct train.
r04|Нет, можно ехать без пересадки.|Nein, Sie können ohne Umsteigen fahren.|No, you can travel without changing.
r05|Да, садитесь, пожалуйста.|Ja, nehmen Sie bitte Platz.|Yes, please have a seat.
r06|На багажную полку в конце вагона.|In die Gepäckablage am Wagenende.|On the luggage rack at the end of the carriage.`,
    dialogues: `d01|Найти нужный путь|Das richtige Gleis finden|Finding the platform
d02|Проверить направление|Die Richtung prüfen|Checking the destination
d03|Место и багаж|Sitzplatz und Gepäck|Seat and luggage`,
    words: `w01|Вокзал|der Bahnhof|Railway station
w02|Путь|das Gleis|Platform track
w03|Вагон|der Wagen|Carriage
w04|Сиденье|der Sitzplatz|Seat
w05|Багаж|das Gepäck|Luggage
w06|Чемодан|der Koffer|Suitcase
w07|Багажная полка|die Gepäckablage|Luggage rack
w08|Задержка|die Verspätung|Delay
w09|Объявление|die Durchsage|Announcement
w10|Контролёр|die Zugbegleiterin / der Zugbegleiter|Train attendant
w11|Остановка|der Halt|Stop
w12|Расписание|der Fahrplan|Timetable
w13|Подземный переход|die Unterführung|Underpass
w14|Лифт|der Lift|Lift
w15|Эскалатор|die Rolltreppe|Escalator
w16|Дверь|die Tür|Door
w17|Розетка|die Steckdose|Power socket
w18|Тихий вагон|das Ruheabteil|Quiet carriage
w19|Прямой поезд|der direkte Zug|Direct train
w20|Конечная станция|die Endstation|Terminus` }),
  'airport-check-in': topicDraft({ participants: p.traveller,
    phrases: `p01|Где стойка регистрации на мой рейс?|Wo ist der Check-in-Schalter für meinen Flug?|Where is the check-in desk for my flight?
p02|Можно сдать здесь багаж?|Kann ich hier mein Gepäck aufgeben?|Can I check in my luggage here?
p03|Вот мой паспорт и бронирование.|Hier sind mein Pass und meine Buchung.|Here are my passport and booking.
p04|Можно место у прохода?|Kann ich einen Gangplatz bekommen?|Could I have an aisle seat?
p05|Где находится выход на посадку?|Wo ist mein Gate?|Where is my boarding gate?
p06|Когда начинается посадка?|Wann beginnt das Boarding?|When does boarding start?
p07|У меня только ручная кладь.|Ich habe nur Handgepäck.|I only have hand luggage.
p08|Сколько багажа входит в билет?|Wie viel Gepäck ist im Billett enthalten?|How much luggage is included in my ticket?
p09|Нужен ли мне новый посадочный талон?|Brauche ich eine neue Bordkarte?|Do I need a new boarding pass?
p10|Мой рейс перенесли?|Wurde mein Flug verschoben?|Has my flight been rescheduled?
p11|Как пройти к контролю безопасности?|Wie komme ich zur Sicherheitskontrolle?|How do I get to security?
p12|Это подходит по размеру для ручной клади?|Entspricht das den Handgepäckmassen?|Does this meet the hand luggage size limits?
p13|У меня есть пересадочный рейс.|Ich habe einen Anschlussflug.|I have a connecting flight.
p14|Багаж отправят до конечного пункта?|Wird mein Gepäck bis zum Ziel durchgecheckt?|Will my luggage be checked through to my final destination?
p15|Пожалуйста, помогите найти нужный терминал.|Helfen Sie mir bitte, das richtige Terminal zu finden.|Please help me find the right terminal.`,
    replies: `r01|Посмотрите номер стойки на табло.|Die Schalternummer steht auf der Anzeigetafel.|The desk number is on the departure board.
r02|Да, поставьте чемодан на весы.|Ja, stellen Sie den Koffer bitte auf die Waage.|Yes, please put your suitcase on the scales.
r03|Спасибо, я проверю ваши данные.|Danke, ich prüfe Ihre Angaben.|Thank you, I will check your details.
r04|Я посмотрю, есть ли свободное место.|Ich schaue nach, ob noch eines frei ist.|I will check whether one is available.
r05|Номер выхода указан на табло.|Die Gate-Nummer steht auf der Anzeigetafel.|The gate number is on the departure board.
r06|Время посадки указано в посадочном талоне.|Die Boardingzeit steht auf Ihrer Bordkarte.|The boarding time is on your boarding pass.`,
    dialogues: `d01|Регистрация багажа|Gepäck aufgeben|Checking in luggage
d02|Документы и место|Dokumente und Sitzplatz|Documents and seat
d03|Перед посадкой|Vor dem Boarding|Before boarding`,
    words: `w01|Аэропорт|der Flughafen|Airport
w02|Рейс|der Flug|Flight
w03|Регистрация|der Check-in|Check-in
w04|Стойка регистрации|der Check-in-Schalter|Check-in desk
w05|Посадочный талон|die Bordkarte|Boarding pass
w06|Выход на посадку|das Gate|Boarding gate
w07|Посадка|das Boarding|Boarding
w08|Ручная кладь|das Handgepäck|Hand luggage
w09|Сдаваемый багаж|das Aufgabegepäck|Checked luggage
w10|Паспорт|der Pass|Passport
w11|Терминал|das Terminal|Terminal
w12|Контроль безопасности|die Sicherheitskontrolle|Security check
w13|Табло|die Anzeigetafel|Departure board
w14|Место у прохода|der Gangplatz|Aisle seat
w15|Место у окна|der Fensterplatz|Window seat
w16|Весы|die Waage|Scales
w17|Стыковочный рейс|der Anschlussflug|Connecting flight
w18|Вылет|der Abflug|Departure
w19|Прилёт|die Landung|Landing
w20|Багажная бирка|der Gepäckanhänger|Luggage tag` }),
  'hotel-check-in': topicDraft({ participants: p.hotel,
    phrases: `p01|У меня забронирован номер.|Ich habe ein Zimmer reserviert.|I have a room reservation.
p02|Можно уже заселиться?|Kann ich schon einchecken?|Can I check in now?
p03|Завтрак включён в стоимость?|Ist das Frühstück im Preis inbegriffen?|Is breakfast included in the price?
p04|В какое время подают завтрак?|Wann gibt es Frühstück?|What time is breakfast served?
p05|В номере не работает отопление.|Die Heizung im Zimmer funktioniert nicht.|The heating in my room is not working.
p06|Можно перейти в другой номер?|Kann ich ein anderes Zimmer bekommen?|Could I move to another room?
p07|До какого времени нужно выехать?|Bis wann muss ich auschecken?|What time do I need to check out?
p08|Где можно оставить багаж после выезда?|Wo kann ich mein Gepäck nach dem Auschecken lassen?|Where can I leave my luggage after checking out?
p09|Какой пароль от Wi-Fi?|Wie lautet das WLAN-Passwort?|What is the Wi-Fi password?
p10|Можно получить ещё одно полотенце?|Kann ich noch ein Handtuch bekommen?|Could I have another towel?
p11|Мне нужен тихий номер.|Ich brauche ein ruhiges Zimmer.|I need a quiet room.
p12|Можно продлить проживание на одну ночь?|Kann ich meinen Aufenthalt um eine Nacht verlängern?|Can I extend my stay by one night?
p13|Пожалуйста, подготовьте счёт на моё имя.|Stellen Sie die Rechnung bitte auf meinen Namen aus.|Please make out the bill in my name.
p14|Где находится лифт?|Wo ist der Lift?|Where is the lift?
p15|Я хочу вернуть ключ от номера.|Ich möchte den Zimmerschlüssel zurückgeben.|I would like to return my room key.`,
    replies: `r01|На какое имя сделано бронирование?|Auf welchen Namen lautet die Reservation?|What name is the reservation under?
r02|Да, ваш номер уже готов.|Ja, Ihr Zimmer ist schon bereit.|Yes, your room is ready.
r03|Да, завтрак включён.|Ja, das Frühstück ist inbegriffen.|Yes, breakfast is included.
r04|С семи до десяти в ресторане.|Von sieben bis zehn im Restaurant.|From seven to ten in the restaurant.
r05|Я попрошу техника проверить её.|Ich bitte den Techniker, sie zu prüfen.|I will ask the technician to check it.
r06|Я проверю, какие номера свободны.|Ich prüfe, welche Zimmer frei sind.|I will check which rooms are available.`,
    dialogues: `d01|Заселение|Einchecken|Checking in
d02|Завтрак|Das Frühstück|Breakfast
d03|Проблема в номере|Ein Problem im Zimmer|A room problem`,
    words: `w01|Гостиница|das Hotel|Hotel
w02|Бронирование|die Reservation|Reservation
w03|Номер|das Zimmer|Room
w04|Ключ от номера|der Zimmerschlüssel|Room key
w05|Администратор|die Rezeption|Reception
w06|Заселение|das Einchecken|Check-in
w07|Выезд|das Auschecken|Check-out
w08|Завтрак|das Frühstück|Breakfast
w09|Ночь проживания|die Übernachtung|Overnight stay
w10|Полотенце|das Handtuch|Towel
w11|Отопление|die Heizung|Heating
w12|Кондиционер|die Klimaanlage|Air conditioning
w13|Счёт|die Rechnung|Bill
w14|Двухместный номер|das Doppelzimmer|Double room
w15|Одноместный номер|das Einzelzimmer|Single room
w16|Уборка|die Reinigung|Cleaning
w17|Багажная комната|der Gepäckraum|Luggage room
w18|Проживание|der Aufenthalt|Stay
w19|Пароль Wi-Fi|das WLAN-Passwort|Wi-Fi password
w20|Продление|die Verlängerung|Extension` }),
  'asking-directions': topicDraft({ participants: p.directions,
    phrases: `p01|Извините, как пройти к вокзалу?|Entschuldigung, wie komme ich zum Bahnhof?|Excuse me, how do I get to the station?
p02|Это далеко пешком?|Ist das zu Fuss weit?|Is it far to walk?
p03|Где ближайшая автобусная остановка?|Wo ist die nächste Bushaltestelle?|Where is the nearest bus stop?
p04|Какой автобус идёт в центр?|Welcher Bus fährt ins Zentrum?|Which bus goes to the city centre?
p05|Нужно повернуть здесь направо?|Muss ich hier rechts abbiegen?|Do I need to turn right here?
p06|Можно показать это на карте?|Können Sie mir das auf der Karte zeigen?|Could you show me on the map?
p07|Я, кажется, заблудился.|Ich glaube, ich habe mich verlaufen.|I think I am lost.
p08|В каком направлении находится озеро?|In welcher Richtung liegt der See?|Which direction is the lake in?
p09|Можно пройти через парк?|Kann ich durch den Park gehen?|Can I walk through the park?
p10|Где можно безопасно перейти дорогу?|Wo kann ich die Strasse sicher überqueren?|Where can I cross the road safely?
p11|Это правильная сторона улицы?|Bin ich auf der richtigen Strassenseite?|Am I on the right side of the street?
p12|Сколько остановок мне ехать?|Wie viele Haltestellen muss ich fahren?|How many stops do I need to travel?
p13|Здесь есть путь без лестниц?|Gibt es hier einen Weg ohne Treppen?|Is there a route without stairs?
p14|Повторите, пожалуйста, чуть медленнее.|Können Sie das bitte etwas langsamer wiederholen?|Could you repeat that a little more slowly?
p15|Спасибо, теперь я знаю дорогу.|Danke, jetzt weiss ich, wo es langgeht.|Thank you, now I know the way.`,
    replies: `r01|Идите прямо до светофора.|Gehen Sie geradeaus bis zur Ampel.|Go straight on until the traffic lights.
r02|Нет, примерно десять минут.|Nein, etwa zehn Minuten.|No, about ten minutes.
r03|Остановка за углом слева.|Die Haltestelle ist links um die Ecke.|The stop is around the corner on the left.
r04|Автобус номер два.|Der Bus Nummer zwei.|Bus number two.
r05|Нет, поверните на следующем перекрёстке.|Nein, biegen Sie an der nächsten Kreuzung ab.|No, turn at the next junction.
r06|Конечно, вот здесь вы находитесь.|Natürlich, hier befinden Sie sich.|Of course, this is where you are.`,
    dialogues: `d01|Пешком к вокзалу|Zu Fuss zum Bahnhof|Walking to the station
d02|Найти автобус|Den Bus finden|Finding a bus
d03|Уточнить поворот|Eine Abzweigung klären|Checking a turn`,
    words: `w01|Направо|rechts|Right
w02|Налево|links|Left
w03|Прямо|geradeaus|Straight ahead
w04|Перекрёсток|die Kreuzung|Junction
w05|Светофор|die Ampel|Traffic lights
w06|Угол|die Ecke|Corner
w07|Улица|die Strasse|Street
w08|Площадь|der Platz|Square
w09|Мост|die Brücke|Bridge
w10|Карта|die Karte|Map
w11|Остановка|die Haltestelle|Bus or tram stop
w12|Центр|das Zentrum|City centre
w13|Пешеходный переход|der Fussgängerstreifen|Pedestrian crossing
w14|Тротуар|das Trottoir|Pavement
w15|Лестница|die Treppe|Stairs
w16|Направление|die Richtung|Direction
w17|Расстояние|die Entfernung|Distance
w18|Парк|der Park|Park
w19|Вход|der Eingang|Entrance
w20|Пешком|zu Fuss|On foot` }),
  'travel-problems': topicDraft({ participants: p.traveller,
    phrases: `p01|Мой поезд отменили.|Mein Zug wurde gestrichen.|My train has been cancelled.
p02|Каким маршрутом теперь можно поехать?|Welche Verbindung kann ich stattdessen nehmen?|Which connection can I take instead?
p03|Я не получил свой чемодан.|Mein Koffer ist nicht angekommen.|My suitcase has not arrived.
p04|Где можно заявить о потере багажа?|Wo kann ich den Gepäckverlust melden?|Where can I report missing luggage?
p05|Я пропустил пересадку из-за задержки.|Wegen der Verspätung habe ich meinen Anschluss verpasst.|I missed my connection because of the delay.
p06|Нужно ли менять мой билет?|Muss mein Billett geändert werden?|Does my ticket need to be changed?
p07|Я потерял паспорт.|Ich habe meinen Pass verloren.|I have lost my passport.
p08|Где находится бюро находок?|Wo ist das Fundbüro?|Where is the lost property office?
p09|Мой телефон разрядился.|Mein Handy hat keinen Akku mehr.|My phone has run out of battery.
p10|Помогите связаться с гостиницей.|Helfen Sie mir bitte, das Hotel zu erreichen.|Please help me contact the hotel.
p11|В бронировании указана неверная дата.|In der Buchung steht ein falsches Datum.|There is an incorrect date in the booking.
p12|Можно получить письменное подтверждение задержки?|Kann ich eine schriftliche Bestätigung der Verspätung bekommen?|Could I get written confirmation of the delay?
p13|Я оставил сумку в поезде.|Ich habe meine Tasche im Zug liegen lassen.|I left my bag on the train.
p14|Куда обратиться за помощью?|An wen kann ich mich wenden?|Who can I contact for help?
p15|Пожалуйста, объясните мои варианты.|Erklären Sie mir bitte meine Möglichkeiten.|Please explain my options.`,
    replies: `r01|Мне жаль, давайте найдём другой вариант.|Das tut mir leid, suchen wir eine Alternative.|I am sorry, let us find an alternative.
r02|Я проверю следующие отправления.|Ich prüfe die nächsten Abfahrten.|I will check the next departures.
r03|У вас есть багажная квитанция?|Haben Sie Ihren Gepäckbeleg?|Do you have your baggage receipt?
r04|Подойдите к стойке розыска багажа.|Gehen Sie bitte zum Gepäckservice.|Please go to the baggage service desk.
r05|Я посмотрю, когда идёт следующий поезд.|Ich schaue nach, wann der nächste Zug fährt.|I will check when the next train leaves.
r06|Сначала проверим условия вашего билета.|Wir prüfen zuerst die Bedingungen Ihres Billetts.|Let us check your ticket conditions first.`,
    dialogues: `d01|Отмена поезда|Ein Zugausfall|A cancelled train
d02|Пропавший чемодан|Ein vermisster Koffer|A missing suitcase
d03|Пропущенная пересадка|Ein verpasster Anschluss|A missed connection`,
    words: `w01|Отмена|die Annullierung|Cancellation
w02|Задержка|die Verspätung|Delay
w03|Пересадочный рейс|der Anschluss|Connection
w04|Альтернатива|die Alternative|Alternative
w05|Потеря|der Verlust|Loss
w06|Бюро находок|das Fundbüro|Lost property office
w07|Розыск багажа|der Gepäckservice|Baggage service
w08|Багажная квитанция|der Gepäckbeleg|Baggage receipt
w09|Описание|die Beschreibung|Description
w10|Заявление о потере|die Verlustmeldung|Loss report
w11|Посольство|die Botschaft|Embassy
w12|Полиция|die Polizei|Police
w13|Зарядное устройство|das Ladegerät|Charger
w14|Аккумулятор|der Akku|Battery
w15|Помощь|die Hilfe|Help
w16|Ошибка бронирования|der Buchungsfehler|Booking error
w17|Подтверждение задержки|die Verspätungsbestätigung|Delay confirmation
w18|Замена|der Ersatz|Replacement
w19|Сумка|die Tasche|Bag
w20|Контактный номер|die Kontaktnummer|Contact number` }),
};
