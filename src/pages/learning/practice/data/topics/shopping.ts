import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const shoppingMaterials = {
  'supermarket': topicDraft({ participants: p.shop,
    phrases: `p01|Где у вас молочные продукты?|Wo finde ich die Milchprodukte?|Where can I find the dairy products?
p02|Есть молоко без лактозы?|Haben Sie laktosefreie Milch?|Do you have lactose-free milk?
p03|Эти яблоки нужно взвесить самому?|Muss ich diese Äpfel selbst wiegen?|Do I need to weigh these apples myself?
p04|Где находятся весы?|Wo ist die Waage?|Where are the scales?
p05|Этот продукт сейчас есть в наличии?|Ist dieses Produkt zurzeit vorrätig?|Is this product currently in stock?
p06|Есть похожий вариант?|Haben Sie eine ähnliche Alternative?|Do you have a similar alternative?
p07|Я ищу хлеб без глютена.|Ich suche glutenfreies Brot.|I am looking for gluten-free bread.
p08|Сколько стоит один килограмм?|Wie viel kostet ein Kilo?|How much is a kilogram?
p09|До какой даты годен этот продукт?|Bis wann ist dieses Produkt haltbar?|What is the expiry date of this product?
p10|В составе есть орехи?|Enthält das Nüsse?|Does this contain nuts?
p11|Можно купить половину килограмма?|Kann ich ein halbes Kilo kaufen?|Can I buy half a kilogram?
p12|Где находятся замороженные овощи?|Wo finde ich Tiefkühlgemüse?|Where can I find frozen vegetables?
p13|Мне нужна небольшая упаковка.|Ich brauche eine kleine Packung.|I need a small pack.
p14|Это цена за штуку или за упаковку?|Ist das der Preis pro Stück oder pro Packung?|Is that the price per item or per pack?
p15|Спасибо, я нашёл всё необходимое.|Danke, ich habe alles gefunden, was ich brauche.|Thank you, I have found everything I need.`,
    replies: `r01|В холодильниках в конце прохода.|In den Kühlregalen am Ende des Gangs.|In the refrigerated section at the end of the aisle.
r02|Да, она рядом с обычным молоком.|Ja, sie steht neben der normalen Milch.|Yes, it is next to the regular milk.
r03|Да, пожалуйста, наклейте затем этикетку.|Ja, kleben Sie danach bitte das Etikett auf.|Yes, please attach the label afterwards.
r04|Рядом с отделом овощей.|Neben der Gemüseabteilung.|Next to the vegetable section.
r05|Я проверю, осталось ли что-нибудь на складе.|Ich prüfe, ob wir noch etwas im Lager haben.|I will check whether we have any left in storage.
r06|Да, вот другой продукт этой марки.|Ja, hier ist ein anderes Produkt dieser Marke.|Yes, here is another product from this brand.`,
    dialogues: `d01|Найти продукты|Lebensmittel finden|Finding groceries
d02|Взвесить фрукты|Obst wiegen|Weighing fruit
d03|Товар закончился|Ein Produkt ist ausverkauft|An item is out of stock`,
    words: `w01|Супермаркет|der Supermarkt|Supermarket
w02|Проход|der Gang|Aisle
w03|Полка|das Regal|Shelf
w04|Молочные продукты|die Milchprodukte|Dairy products
w05|Овощи|das Gemüse|Vegetables
w06|Фрукты|das Obst|Fruit
w07|Весы|die Waage|Scales
w08|Этикетка|das Etikett|Label
w09|Упаковка|die Packung|Pack
w10|Килограмм|das Kilo|Kilogram
w11|Состав|die Zutaten|Ingredients
w12|Срок годности|das Haltbarkeitsdatum|Expiry date
w13|Тележка|der Einkaufswagen|Shopping trolley
w14|Корзина|der Einkaufskorb|Shopping basket
w15|Орехи|die Nüsse|Nuts
w16|Без лактозы|laktosefrei|Lactose-free
w17|Без глютена|glutenfrei|Gluten-free
w18|Замороженный|tiefgekühlt|Frozen
w19|В наличии|vorrätig|In stock
w20|Штука|das Stück|Item` }),
  'clothes-fitting': topicDraft({ participants: p.shop,
    phrases: `p01|Можно примерить эту куртку?|Darf ich diese Jacke anprobieren?|May I try on this jacket?
p02|Где находится примерочная?|Wo ist die Umkleidekabine?|Where is the fitting room?
p03|Есть такой же свитер на размер больше?|Haben Sie diesen Pullover eine Nummer grösser?|Do you have this jumper one size larger?
p04|Можно посмотреть другой цвет?|Kann ich eine andere Farbe sehen?|Could I see another colour?
p05|Эти брюки мне слишком длинные.|Diese Hose ist mir zu lang.|These trousers are too long for me.
p06|У вас можно укоротить брюки?|Bieten Sie einen Kürzungsservice an?|Do you offer a shortening service?
p07|Мне нужен размер сорок.|Ich brauche Grösse vierzig.|I need size forty.
p08|Эти туфли немного жмут.|Diese Schuhe drücken etwas.|These shoes are a little tight.
p09|Мне подходит этот размер.|Diese Grösse passt mir.|This size fits me.
p10|Из какого материала это сделано?|Aus welchem Material ist das?|What material is this made from?
p11|Это можно стирать в машине?|Kann man das in der Maschine waschen?|Is this machine washable?
p12|Я ищу одежду для собеседования.|Ich suche Kleidung für ein Vorstellungsgespräch.|I am looking for clothes for a job interview.
p13|Я пока просто смотрю, спасибо.|Ich schaue mich nur um, danke.|I am just looking, thank you.
p14|Можно отложить это до вечера?|Können Sie das bis heute Abend zurücklegen?|Could you put this aside until this evening?
p15|Я возьму эту рубашку.|Ich nehme dieses Hemd.|I will take this shirt.`,
    replies: `r01|Конечно, какой размер вам нужен?|Natürlich, welche Grösse brauchen Sie?|Of course, what size do you need?
r02|В глубине магазина справа.|Hinten im Geschäft auf der rechten Seite.|At the back of the shop on the right.
r03|Сейчас принесу вам следующий размер.|Ich bringe Ihnen gleich die nächste Grösse.|I will bring you the next size up.
r04|Да, есть синий и серый.|Ja, wir haben Blau und Grau.|Yes, we have blue and grey.
r05|Давайте посмотрим более короткую модель.|Schauen wir nach einem kürzeren Modell.|Let us look for a shorter style.
r06|Я уточню это у коллеги.|Ich frage meine Kollegin danach.|I will ask my colleague about that.`,
    dialogues: `d01|Примерка куртки|Eine Jacke anprobieren|Trying on a jacket
d02|Размер и цвет|Grösse und Farbe|Size and colour
d03|Длина брюк|Die Hosenlänge|Trouser length`,
    words: `w01|Примерочная|die Umkleidekabine|Fitting room
w02|Размер|die Grösse|Size
w03|Куртка|die Jacke|Jacket
w04|Свитер|der Pullover|Jumper
w05|Брюки|die Hose|Trousers
w06|Рубашка|das Hemd|Shirt
w07|Платье|das Kleid|Dress
w08|Обувь|die Schuhe|Shoes
w09|Цвет|die Farbe|Colour
w10|Материал|das Material|Material
w11|Хлопок|die Baumwolle|Cotton
w12|Шерсть|die Wolle|Wool
w13|Рукав|der Ärmel|Sleeve
w14|Длина|die Länge|Length
w15|Примерять|anprobieren|To try on
w16|Подходить по размеру|passen|To fit
w17|Тесный|eng|Tight
w18|Свободный|weit|Loose
w19|Укорачивать|kürzen|To shorten
w20|Инструкция по уходу|die Pflegeanleitung|Care instructions` }),
  'prices-discounts': topicDraft({ participants: p.shop,
    phrases: `p01|Сколько стоит этот товар?|Wie viel kostet dieser Artikel?|How much does this item cost?
p02|На него сейчас действует скидка?|Ist er zurzeit reduziert?|Is it currently discounted?
p03|Эта акция ещё действует?|Gilt diese Aktion noch?|Is this offer still valid?
p04|До какого дня действует предложение?|Bis wann gilt das Angebot?|Until when is the offer valid?
p05|На полке указана другая цена.|Am Regal steht ein anderer Preis.|There is a different price on the shelf.
p06|Можете проверить цену?|Können Sie den Preis prüfen?|Could you check the price?
p07|Скидка уже учтена в цене?|Ist der Rabatt schon im Preis enthalten?|Is the discount already included in the price?
p08|Нужна ли карта клиента для этой цены?|Brauche ich für diesen Preis eine Kundenkarte?|Do I need a loyalty card for this price?
p09|Этот купон можно использовать сегодня?|Kann ich diesen Gutschein heute einlösen?|Can I use this voucher today?
p10|Есть более недорогой вариант?|Gibt es eine günstigere Variante?|Is there a cheaper option?
p11|Скидка действует на все размеры?|Gilt der Rabatt für alle Grössen?|Does the discount apply to all sizes?
p12|Это цена за два товара вместе?|Ist das der Preis für beide Artikel zusammen?|Is that the price for both items together?
p13|Я хочу сравнить цены.|Ich möchte die Preise vergleichen.|I would like to compare prices.
p14|Есть дополнительные расходы?|Gibt es zusätzliche Kosten?|Are there any extra costs?
p15|Спасибо, я ещё подумаю.|Danke, ich überlege es mir noch.|Thank you, I will think about it.`,
    replies: `r01|Я посмотрю цену на этикетке.|Ich schaue auf dem Preisschild nach.|I will check the price tag.
r02|Да, скидка уже отмечена.|Ja, die Reduktion ist bereits angeschrieben.|Yes, the reduction is already marked.
r03|Давайте проверим условия акции.|Schauen wir die Aktionsbedingungen an.|Let us check the offer conditions.
r04|Дата окончания указана здесь.|Das Enddatum steht hier.|The end date is shown here.
r05|Спасибо, что обратили внимание.|Danke für den Hinweis.|Thank you for pointing that out.
r06|Конечно, я уточню её в системе.|Natürlich, ich prüfe ihn im System.|Of course, I will check it in the system.`,
    dialogues: `d01|Узнать цену|Nach dem Preis fragen|Asking the price
d02|Условия акции|Die Aktionsbedingungen|Offer conditions
d03|Разные ценники|Unterschiedliche Preisangaben|Different price labels`,
    words: `w01|Цена|der Preis|Price
w02|Скидка|der Rabatt|Discount
w03|Акция|die Aktion|Special offer
w04|Предложение|das Angebot|Offer
w05|Ценник|das Preisschild|Price tag
w06|Купон|der Gutschein|Voucher
w07|Карта клиента|die Kundenkarte|Loyalty card
w08|Процент|das Prozent|Per cent
w09|Итоговая цена|der Endpreis|Final price
w10|Обычная цена|der Normalpreis|Regular price
w11|Распродажа|der Ausverkauf|Sale
w12|Срок действия|die Gültigkeit|Validity
w13|Условие|die Bedingung|Condition
w14|Дополнительные расходы|die Zusatzkosten|Extra costs
w15|Сравнение цен|der Preisvergleich|Price comparison
w16|Бюджет|das Budget|Budget
w17|Дешевле|günstiger|Cheaper
w18|Дороже|teurer|More expensive
w19|Сниженный в цене|reduziert|Reduced
w20|Использовать купон|einen Gutschein einlösen|To redeem a voucher` }),
  'checkout-payment': topicDraft({ participants: p.shop,
    phrases: `p01|Эта касса открыта?|Ist diese Kasse geöffnet?|Is this checkout open?
p02|Куда положить корзину?|Wo soll ich den Korb hinstellen?|Where should I put the basket?
p03|Я хотел бы заплатить картой.|Ich möchte mit Karte bezahlen.|I would like to pay by card.
p04|Нужно вставить карту в терминал?|Muss ich die Karte ins Gerät stecken?|Do I need to insert the card into the terminal?
p05|Кажется, платёж не прошёл.|Die Zahlung scheint nicht funktioniert zu haben.|It looks as though the payment did not go through.
p06|Можно попробовать другую карту?|Kann ich es mit einer anderen Karte versuchen?|Can I try another card?
p07|Можно оплатить наличными?|Kann ich bar bezahlen?|Can I pay in cash?
p08|Мне нужен пакет, пожалуйста.|Ich brauche bitte eine Tasche.|I need a bag, please.
p09|Чек, пожалуйста.|Den Kassenzettel bitte.|The receipt, please.
p10|У меня есть карта клиента.|Ich habe eine Kundenkarte.|I have a loyalty card.
p11|Этот товар пробили два раза.|Dieser Artikel wurde zweimal gescannt.|This item was scanned twice.
p12|Можно убрать этот товар из покупки?|Können Sie diesen Artikel bitte stornieren?|Could you remove this item from my purchase?
p13|Я плачу бесконтактно.|Ich bezahle kontaktlos.|I am paying contactlessly.
p14|Можно разделить оплату?|Kann ich die Zahlung aufteilen?|Can I split the payment?
p15|Кажется, мне неправильно дали сдачу.|Ich glaube, das Rückgeld stimmt nicht.|I think the change is incorrect.`,
    replies: `r01|Да, проходите, пожалуйста.|Ja, kommen Sie bitte.|Yes, please come forward.
r02|Поставьте её под лентой.|Stellen Sie ihn bitte unter das Förderband.|Please put it under the conveyor belt.
r03|Пожалуйста, используйте терминал.|Benutzen Sie bitte das Kartengerät.|Please use the card terminal.
r04|Сначала попробуйте приложить её.|Halten Sie sie zuerst an das Gerät.|Try tapping it first.
r05|На терминале написано, что операция отклонена.|Das Gerät zeigt an, dass die Zahlung abgelehnt wurde.|The terminal says the payment was declined.
r06|Да, я запущу оплату заново.|Ja, ich starte den Zahlungsvorgang neu.|Yes, I will restart the payment.`,
    dialogues: `d01|Подойти к кассе|An die Kasse gehen|At the checkout
d02|Оплата картой|Mit Karte bezahlen|Paying by card
d03|Отклонённый платёж|Eine abgelehnte Zahlung|A declined payment`,
    words: `w01|Касса|die Kasse|Checkout
w02|Кассир|die Kassiererin / der Kassierer|Cashier
w03|Лента|das Förderband|Conveyor belt
w04|Наличные|das Bargeld|Cash
w05|Карта|die Karte|Card
w06|Терминал|das Kartengerät|Card terminal
w07|ПИН-код|die PIN|PIN
w08|Чек|der Kassenzettel|Receipt
w09|Сдача|das Rückgeld|Change
w10|Пакет|die Tasche|Bag
w11|Сумма|der Betrag|Amount
w12|Штрихкод|der Strichcode|Barcode
w13|Оплата|die Bezahlung|Payment
w14|Отклонение|die Ablehnung|Decline
w15|Операция|der Vorgang|Transaction
w16|Монета|die Münze|Coin
w17|Купюра|die Banknote|Banknote
w18|Сканировать|scannen|To scan
w19|Бесконтактно|kontaktlos|Contactlessly
w20|Отменить позицию|einen Artikel stornieren|To void an item` }),
  'returns-exchanges': topicDraft({ participants: p.shop,
    phrases: `p01|Я хотел бы вернуть этот товар.|Ich möchte diesen Artikel zurückgeben.|I would like to return this item.
p02|Вот мой чек.|Hier ist mein Kassenzettel.|Here is my receipt.
p03|Можно обменять его на другой размер?|Kann ich ihn gegen eine andere Grösse umtauschen?|Can I exchange it for another size?
p04|У вас есть такая модель в наличии?|Haben Sie dieses Modell noch vorrätig?|Do you still have this model in stock?
p05|Товар оказался неисправным.|Der Artikel ist defekt.|The item is faulty.
p06|Как оформить рекламацию?|Wie kann ich eine Reklamation einreichen?|How can I make a complaint about it?
p07|Покупка была сделана на прошлой неделе.|Ich habe den Artikel letzte Woche gekauft.|I bought the item last week.
p08|Я сохранил оригинальную упаковку.|Ich habe die Originalverpackung aufbewahrt.|I kept the original packaging.
p09|Какие условия возврата у вашего магазина?|Welche Rückgabebedingungen gelten bei Ihnen?|What is your shop’s returns policy?
p10|Возврат будет на ту же карту?|Wird der Betrag auf dieselbe Karte zurückerstattet?|Will the refund go to the same card?
p11|Можно получить подтверждение возврата?|Kann ich eine Bestätigung der Rückgabe bekommen?|Could I get confirmation of the return?
p12|Размер не подошёл.|Die Grösse passt nicht.|The size does not fit.
p13|В упаковке не хватает детали.|In der Verpackung fehlt ein Teil.|A part is missing from the package.
p14|Мне прислали не тот товар.|Ich habe den falschen Artikel erhalten.|I received the wrong item.
p15|К кому обратиться по гарантии?|An wen wende ich mich wegen der Garantie?|Who should I contact about the warranty?`,
    replies: `r01|По какой причине вы его возвращаете?|Aus welchem Grund möchten Sie ihn zurückgeben?|Why would you like to return it?
r02|Спасибо, я проверю покупку.|Danke, ich prüfe den Kauf.|Thank you, I will check the purchase.
r03|Давайте посмотрим доступные размеры.|Schauen wir nach den verfügbaren Grössen.|Let us check the available sizes.
r04|Я проверю складской остаток.|Ich prüfe den Lagerbestand.|I will check the stock.
r05|Покажите, пожалуйста, в чём проблема.|Zeigen Sie bitte, was nicht funktioniert.|Please show me what is not working.
r06|Я объясню порядок рассмотрения.|Ich erkläre Ihnen den Ablauf.|I will explain the procedure.`,
    dialogues: `d01|Возврат покупки|Einen Einkauf zurückgeben|Returning a purchase
d02|Обмен размера|Eine Grösse umtauschen|Exchanging a size
d03|Неисправный товар|Ein defekter Artikel|A faulty item`,
    words: `w01|Возврат товара|die Rückgabe|Return
w02|Обмен|der Umtausch|Exchange
w03|Возврат денег|die Rückerstattung|Refund
w04|Чек|der Kaufbeleg|Proof of purchase
w05|Рекламация|die Reklamation|Complaint
w06|Неисправность|der Defekt|Fault
w07|Гарантия|die Garantie|Warranty
w08|Упаковка|die Verpackung|Packaging
w09|Деталь|das Teil|Part
w10|Покупка|der Kauf|Purchase
w11|Условие возврата|die Rückgabebedingung|Return condition
w12|Причина|der Grund|Reason
w13|Замена|der Ersatz|Replacement
w14|Модель|das Modell|Model
w15|Складской остаток|der Lagerbestand|Stock level
w16|Обработка|die Bearbeitung|Processing
w17|Повреждение|die Beschädigung|Damage
w18|Неисправный|defekt|Faulty
w19|Некомплектный|unvollständig|Incomplete
w20|Подтверждение|die Bestätigung|Confirmation` }),
  'online-orders': topicDraft({ participants: p.support,
    phrases: `p01|Я хочу проверить статус заказа.|Ich möchte den Status meiner Bestellung prüfen.|I would like to check my order status.
p02|Вот номер заказа.|Hier ist meine Bestellnummer.|Here is my order number.
p03|Посылка ещё не пришла.|Mein Paket ist noch nicht angekommen.|My parcel has not arrived yet.
p04|Можете прислать ссылку для отслеживания?|Können Sie mir den Link zur Sendungsverfolgung schicken?|Could you send me the tracking link?
p05|В заказе указан неправильный адрес.|In meiner Bestellung steht eine falsche Adresse.|There is a wrong address in my order.
p06|Можно изменить адрес до отправки?|Kann ich die Adresse vor dem Versand ändern?|Can I change the address before dispatch?
p07|Какие способы доставки доступны?|Welche Versandarten gibt es?|What delivery options are available?
p08|Сколько стоит доставка?|Wie viel kostet der Versand?|How much does delivery cost?
p09|Я хочу отменить заказ.|Ich möchte meine Bestellung stornieren.|I would like to cancel my order.
p10|Подтверждение заказа не пришло.|Ich habe keine Bestellbestätigung erhalten.|I have not received an order confirmation.
p11|Можно заказать без учётной записи?|Kann ich ohne Kundenkonto bestellen?|Can I order without an account?
p12|Пришла только часть заказа.|Nur ein Teil meiner Bestellung ist angekommen.|Only part of my order has arrived.
p13|Товар повреждён при доставке.|Der Artikel wurde beim Transport beschädigt.|The item was damaged in transit.
p14|Где скачать счёт за заказ?|Wo kann ich die Rechnung herunterladen?|Where can I download the invoice?
p15|Как оформить возврат через сайт?|Wie melde ich eine Rücksendung auf der Website an?|How do I arrange a return through the website?`,
    replies: `r01|Пожалуйста, назовите номер заказа.|Nennen Sie bitte Ihre Bestellnummer.|Please give me your order number.
r02|Спасибо, я открою данные заказа.|Danke, ich öffne die Bestelldaten.|Thank you, I will open the order details.
r03|Я проверю информацию перевозчика.|Ich prüfe die Angaben des Versanddienstleisters.|I will check the carrier’s information.
r04|Да, отправлю её на ваш электронный адрес.|Ja, ich schicke ihn an Ihre E-Mail-Adresse.|Yes, I will email it to you.
r05|Сообщите, пожалуйста, правильный адрес.|Teilen Sie uns bitte die richtige Adresse mit.|Please give us the correct address.
r06|Я проверю, отправлена ли уже посылка.|Ich prüfe, ob das Paket schon versandt wurde.|I will check whether the parcel has already been dispatched.`,
    dialogues: `d01|Статус заказа|Der Bestellstatus|Order status
d02|Задержка посылки|Ein verspätetes Paket|A delayed parcel
d03|Изменить адрес доставки|Die Lieferadresse ändern|Changing the delivery address`,
    words: `w01|Заказ|die Bestellung|Order
w02|Номер заказа|die Bestellnummer|Order number
w03|Подтверждение заказа|die Bestellbestätigung|Order confirmation
w04|Посылка|das Paket|Parcel
w05|Доставка|die Lieferung|Delivery
w06|Отправка|der Versand|Dispatch
w07|Отслеживание|die Sendungsverfolgung|Tracking
w08|Адрес доставки|die Lieferadresse|Delivery address
w09|Учётная запись|das Kundenkonto|Customer account
w10|Корзина на сайте|der Warenkorb|Online shopping basket
w11|Наличие|die Verfügbarkeit|Availability
w12|Срок доставки|die Lieferzeit|Delivery time
w13|Перевозчик|der Versanddienstleister|Carrier
w14|Счёт|die Rechnung|Invoice
w15|Отмена заказа|die Stornierung|Cancellation
w16|Обратная отправка|die Rücksendung|Return shipment
w17|Транспортное повреждение|der Transportschaden|Transit damage
w18|Ссылка|der Link|Link
w19|Скачать|herunterladen|To download
w20|Оформить заказ|bestellen|To place an order` }),
};
