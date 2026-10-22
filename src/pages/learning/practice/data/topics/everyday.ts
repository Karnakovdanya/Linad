import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const everydayMaterials = {
  'introductions': topicDraft({ participants: p.friends,
    phrases: `p01|Привет, меня зовут Алекс.|Hallo, ich heisse Alex.|Hi, my name is Alex.
p02|А как тебя зовут?|Und wie heisst du?|And what is your name?
p03|Приятно познакомиться.|Freut mich, dich kennenzulernen.|Nice to meet you.
p04|Ты здесь впервые?|Bist du zum ersten Mal hier?|Is this your first time here?
p05|Я недавно переехал сюда.|Ich bin vor Kurzem hierhergezogen.|I moved here recently.
p06|Ты давно здесь живёшь?|Wohnst du schon lange hier?|Have you lived here long?
p07|Я родом из Украины.|Ich komme ursprünglich aus der Ukraine.|I am originally from Ukraine.
p08|Сейчас я живу в Люцерне.|Zurzeit wohne ich in Luzern.|I currently live in Lucerne.
p09|Я только начинаю учить немецкий.|Ich fange gerade an, Deutsch zu lernen.|I am just starting to learn German.
p10|На каких языках ты говоришь?|Welche Sprachen sprichst du?|Which languages do you speak?
p11|Можно перейти на «ты»?|Können wir uns duzen?|Can we use first names?
p12|Прости, я не запомнил твоё имя.|Entschuldige, ich habe mir deinen Namen nicht gemerkt.|Sorry, I did not catch your name.
p13|Как произносится твоё имя?|Wie spricht man deinen Namen aus?|How do you pronounce your name?
p14|Я здесь со своим другом.|Ich bin mit einem Freund hier.|I am here with a friend.
p15|Рад, что мы познакомились.|Schön, dass wir uns kennengelernt haben.|I am glad we met.`,
    replies: `r01|Привет, рад тебя видеть.|Hallo, schön, dich zu sehen.|Hi, good to see you.
r02|Меня зовут Сэм.|Ich heisse Sam.|My name is Sam.
r03|Мне тоже очень приятно.|Freut mich auch sehr.|It is lovely to meet you too.
r04|Да, я пришёл впервые.|Ja, ich bin zum ersten Mal da.|Yes, this is my first time.
r05|Добро пожаловать в наш город!|Willkommen in unserer Stadt!|Welcome to our city!
r06|Да, уже несколько лет.|Ja, schon seit ein paar Jahren.|Yes, for a few years now.`,
    dialogues: `d01|Обменяться именами|Sich vorstellen|Exchanging names
d02|Первая встреча|Das erste Treffen|A first meeting
d03|Новый житель города|Neu in der Stadt|New to town`,
    words: `w01|Имя|der Vorname|First name
w02|Фамилия|der Nachname|Surname
w03|Знакомство|das Kennenlernen|Introduction
w04|Родина|die Heimat|Home country
w05|Город|die Stadt|City
w06|Сосед|die Nachbarin / der Nachbar|Neighbour
w07|Друг|die Freundin / der Freund|Friend
w08|Гость|der Gast|Guest
w09|Язык|die Sprache|Language
w10|Произношение|die Aussprache|Pronunciation
w11|Встреча|das Treffen|Meeting
w12|Приглашение|die Einladung|Invitation
w13|Контакт|der Kontakt|Contact
w14|Новый|neu|New
w15|Недавно|vor Kurzem|Recently
w16|Впервые|zum ersten Mal|For the first time
w17|Родом из|ursprünglich aus|Originally from
w18|Жить|wohnen|To live
w19|Знакомиться|kennenlernen|To get acquainted
w20|Переехать|umziehen|To move home` }),
  'about-yourself-interests': topicDraft({ participants: p.friends,
    phrases: `p01|В свободное время я люблю готовить.|In meiner Freizeit koche ich gerne.|I enjoy cooking in my free time.
p02|А что нравится делать тебе?|Und was machst du gerne?|And what do you enjoy doing?
p03|Мне нравятся прогулки в горах.|Ich gehe gerne in den Bergen wandern.|I enjoy hiking in the mountains.
p04|Ты знаешь хороший маршрут поблизости?|Kennst du einen schönen Wanderweg in der Nähe?|Do you know a nice hiking trail nearby?
p05|Я интересуюсь фотографией.|Ich interessiere mich für Fotografie.|I am interested in photography.
p06|Ты тоже любишь фотографировать?|Fotografierst du auch gerne?|Do you enjoy taking photographs too?
p07|По профессии я инженер.|Ich bin von Beruf Ingenieur.|I am an engineer by profession.
p08|Сейчас я изучаю английский.|Zurzeit lerne ich Englisch.|I am currently learning English.
p09|Я живу вместе с семьёй.|Ich lebe mit meiner Familie zusammen.|I live with my family.
p10|Мне нравится знакомиться с новыми людьми.|Ich lerne gerne neue Leute kennen.|I enjoy meeting new people.
p11|Обычно я читаю перед сном.|Ich lese meistens vor dem Schlafengehen.|I usually read before going to bed.
p12|Какая музыка тебе нравится?|Welche Musik hörst du gerne?|What music do you like?
p13|Я хотел бы попробовать что-нибудь новое.|Ich würde gerne etwas Neues ausprobieren.|I would like to try something new.
p14|В последнее время у меня мало свободного времени.|In letzter Zeit habe ich wenig Freizeit.|I have not had much free time lately.
p15|Почему тебя заинтересовало это хобби?|Wie bist du zu diesem Hobby gekommen?|How did you get into this hobby?`,
    replies: `r01|Здорово! Какое блюдо ты готовишь чаще всего?|Schön! Welches Gericht kochst du am häufigsten?|Lovely! What dish do you cook most often?
r02|Я люблю музыку и плавание.|Ich mag Musik und Schwimmen.|I like music and swimming.
r03|Мне тоже, особенно осенью.|Ich auch, besonders im Herbst.|So do I, especially in autumn.
r04|Да, есть красивый путь вдоль озера.|Ja, es gibt einen schönen Weg am See entlang.|Yes, there is a lovely path along the lake.
r05|Что тебе больше нравится фотографировать?|Was fotografierst du am liebsten?|What do you most like photographing?
r06|Да, особенно природу.|Ja, besonders die Natur.|Yes, especially nature.`,
    dialogues: `d01|Разговор о досуге|Über Freizeit sprechen|Talking about free time
d02|Общее увлечение|Ein gemeinsames Hobby|A shared hobby
d03|Интерес к фотографии|Interesse an Fotografie|An interest in photography`,
    words: `w01|Свободное время|die Freizeit|Free time
w02|Увлечение|das Hobby|Hobby
w03|Интерес|das Interesse|Interest
w04|Семья|die Familie|Family
w05|Профессия|der Beruf|Profession
w06|Прогулка|der Spaziergang|Walk
w07|Поход|die Wanderung|Hike
w08|Фотография|die Fotografie|Photography
w09|Природа|die Natur|Nature
w10|Музыка|die Musik|Music
w11|Чтение|das Lesen|Reading
w12|Приготовление еды|das Kochen|Cooking
w13|Плавание|das Schwimmen|Swimming
w14|Книга|das Buch|Book
w15|Блюдо|das Gericht|Dish
w16|Маршрут для прогулки|der Wanderweg|Hiking trail
w17|Часто|oft|Often
w18|Иногда|manchmal|Sometimes
w19|Обычно|meistens|Usually
w20|Пробовать|ausprobieren|To try out` }),
  'talking-with-friends': topicDraft({ participants: p.friends,
    phrases: `p01|Как прошли твои выходные?|Wie war dein Wochenende?|How was your weekend?
p02|Чем вы занимались?|Was habt ihr gemacht?|What did you do?
p03|Как у тебя дела на работе?|Wie läuft es bei dir bei der Arbeit?|How are things at work?
p04|Ты уже привык к новой команде?|Hast du dich im neuen Team schon eingelebt?|Have you settled into the new team?
p05|Кажется, у тебя был трудный день.|Du hattest wohl einen anstrengenden Tag.|It sounds like you had a tiring day.
p06|Хочешь об этом поговорить?|Möchtest du darüber reden?|Would you like to talk about it?
p07|Давно не виделись!|Wir haben uns lange nicht gesehen!|Long time no see!
p08|Рад слышать хорошие новости.|Das sind schöne Neuigkeiten.|That is lovely news.
p09|Как поживает твоя семья?|Wie geht es deiner Familie?|How is your family?
p10|Поздравляю с новой работой!|Gratuliere zur neuen Stelle!|Congratulations on your new job!
p11|Спасибо, что выслушал меня.|Danke, dass du mir zugehört hast.|Thank you for listening to me.
p12|Если нужна помощь, дай знать.|Sag Bescheid, wenn du Hilfe brauchst.|Let me know if you need help.
p13|Я перезвоню тебе вечером.|Ich rufe dich heute Abend zurück.|I will call you back this evening.
p14|Передавай всем привет.|Grüss bitte alle von mir.|Please give everyone my regards.
p15|Давай будем чаще общаться.|Lass uns öfter voneinander hören.|Let us keep in touch more often.`,
    replies: `r01|Очень хорошо, мы были у друзей.|Sehr schön, wir waren bei Freunden.|Very good, we visited friends.
r02|Готовили вместе и много разговаривали.|Wir haben zusammen gekocht und viel geredet.|We cooked together and talked a lot.
r03|Хорошо, но сейчас много задач.|Gut, aber im Moment gibt es viel zu tun.|Good, but there is a lot to do at the moment.
r04|Да, коллеги очень дружелюбные.|Ja, die Leute im Team sind sehr freundlich.|Yes, my colleagues are very friendly.
r05|Да, сегодня всё было непросто.|Ja, heute war es nicht einfach.|Yes, today was not easy.
r06|Спасибо, мне это поможет.|Danke, das würde mir helfen.|Thank you, that would help.`,
    dialogues: `d01|После выходных|Nach dem Wochenende|After the weekend
d02|Новости с работы|Neuigkeiten von der Arbeit|News from work
d03|Поддержать друга|Für jemanden da sein|Supporting a friend`,
    words: `w01|Дружба|die Freundschaft|Friendship
w02|Новость|die Neuigkeit|News
w03|Выходные|das Wochenende|Weekend
w04|Разговор|das Gespräch|Conversation
w05|Поддержка|die Unterstützung|Support
w06|Совет|der Rat|Advice
w07|Доверие|das Vertrauen|Trust
w08|Настроение|die Stimmung|Mood
w09|Радость|die Freude|Joy
w10|Забота|die Sorge|Concern
w11|Поздравление|der Glückwunsch|Congratulations
w12|Воспоминание|die Erinnerung|Memory
w13|Звонок|der Anruf|Phone call
w14|Сообщение|die Nachricht|Message
w15|Внимание|die Aufmerksamkeit|Attention
w16|Слушать|zuhören|To listen
w17|Рассказывать|erzählen|To tell
w18|Поддерживать связь|in Kontakt bleiben|To keep in touch
w19|Уставший|müde|Tired
w20|Радоваться|sich freuen|To be pleased` }),
  'invitations-meetings': topicDraft({ participants: p.friends,
    phrases: `p01|Хочешь выпить кофе в субботу?|Hast du Lust, am Samstag einen Kaffee zu trinken?|Would you like to have coffee on Saturday?
p02|В какое время тебе удобно?|Um wie viel Uhr passt es dir?|What time suits you?
p03|Встретимся перед вокзалом?|Treffen wir uns vor dem Bahnhof?|Shall we meet outside the station?
p04|Можешь прислать точный адрес?|Kannst du mir die genaue Adresse schicken?|Could you send me the exact address?
p05|К сожалению, сегодня не получится.|Leider klappt es heute nicht.|Unfortunately, I cannot make it today.
p06|Может, перенесём встречу на воскресенье?|Können wir das Treffen auf Sonntag verschieben?|Could we move our meeting to Sunday?
p07|Спасибо за приглашение, с удовольствием приду.|Danke für die Einladung, ich komme gerne.|Thank you for inviting me, I would love to come.
p08|Можно прийти с другом?|Darf ich einen Freund mitbringen?|May I bring a friend?
p09|Нужно что-нибудь принести?|Soll ich etwas mitbringen?|Should I bring anything?
p10|Я немного опаздываю.|Ich komme etwas später.|I am running a little late.
p11|Буду примерно через десять минут.|Ich bin in etwa zehn Minuten da.|I will be there in about ten minutes.
p12|Давай подтвердим встречу завтра.|Lass uns das Treffen morgen bestätigen.|Let us confirm our meeting tomorrow.
p13|У тебя есть другие планы на вечер?|Hast du heute Abend schon etwas vor?|Do you already have plans for this evening?
p14|Я зарезервирую столик.|Ich reserviere einen Tisch.|I will book a table.
p15|До встречи, я с нетерпением жду.|Bis dann, ich freue mich darauf.|See you then, I am looking forward to it.`,
    replies: `r01|Да, с удовольствием.|Ja, sehr gerne.|Yes, I would love to.
r02|После обеда, около двух.|Am Nachmittag, gegen zwei.|In the afternoon, around two.
r03|Хорошо, у главного входа.|Gut, beim Haupteingang.|All right, by the main entrance.
r04|Конечно, отправлю тебе сообщение.|Natürlich, ich schicke dir eine Nachricht.|Of course, I will send you a message.
r05|Жаль, но ничего страшного.|Schade, aber das ist kein Problem.|That is a shame, but no problem.
r06|Да, воскресенье мне тоже подходит.|Ja, Sonntag passt mir auch.|Yes, Sunday works for me too.`,
    dialogues: `d01|Приглашение на кофе|Eine Einladung zum Kaffee|An invitation for coffee
d02|Место встречи|Der Treffpunkt|The meeting place
d03|Перенести встречу|Ein Treffen verschieben|Rescheduling a meeting`,
    words: `w01|Приглашение|die Einladung|Invitation
w02|Договорённость|die Verabredung|Arrangement
w03|Место встречи|der Treffpunkt|Meeting point
w04|Время|die Uhrzeit|Time
w05|Адрес|die Adresse|Address
w06|Главный вход|der Haupteingang|Main entrance
w07|Столик|der Tisch|Table
w08|Бронирование|die Reservation|Reservation
w09|Опоздание|die Verspätung|Lateness
w10|План|der Plan|Plan
w11|Подтверждение|die Bestätigung|Confirmation
w12|Перенос|die Verschiebung|Rescheduling
w13|Суббота|der Samstag|Saturday
w14|Воскресенье|der Sonntag|Sunday
w15|Вечер|der Abend|Evening
w16|После обеда|am Nachmittag|In the afternoon
w17|Подходить по времени|zeitlich passen|To suit someone’s schedule
w18|Отменять|absagen|To cancel
w19|Приносить с собой|mitbringen|To bring along
w20|Вовремя|pünktlich|On time` }),
  'opinions-emotions': topicDraft({ participants: p.friends,
    phrases: `p01|Как тебе этот фильм?|Wie hat dir der Film gefallen?|How did you like the film?
p02|Мне особенно понравилась музыка.|Die Musik hat mir besonders gefallen.|I especially liked the music.
p03|По-моему, нам нужно больше времени.|Meiner Meinung nach brauchen wir mehr Zeit.|In my opinion, we need more time.
p04|Что ты об этом думаешь?|Was denkst du darüber?|What do you think about that?
p05|Я переживаю из-за этой ситуации.|Ich mache mir wegen dieser Situation Sorgen.|I am worried about this situation.
p06|Можно поделиться с тобой своими мыслями?|Darf ich meine Gedanken mit dir teilen?|May I share my thoughts with you?
p07|Я с тобой согласен.|Ich bin deiner Meinung.|I agree with you.
p08|Я смотрю на это немного иначе.|Ich sehe das etwas anders.|I see it a little differently.
p09|Это меня приятно удивило.|Das hat mich positiv überrascht.|That was a pleasant surprise.
p10|Я пока не знаю, что чувствую.|Ich weiss noch nicht, wie ich mich fühle.|I do not yet know how I feel.
p11|Меня это расстроило.|Das hat mich traurig gemacht.|That made me sad.
p12|Я очень рад за тебя.|Ich freue mich sehr für dich.|I am very happy for you.
p13|Мне нужно немного времени подумать.|Ich brauche etwas Zeit zum Nachdenken.|I need some time to think.
p14|Для меня это особенно важно.|Das ist mir besonders wichtig.|That is particularly important to me.
p15|Спасибо, что уважаешь моё мнение.|Danke, dass du meine Meinung respektierst.|Thank you for respecting my opinion.`,
    replies: `r01|Мне понравился, особенно конец.|Er hat mir gefallen, besonders das Ende.|I liked it, especially the ending.
r02|Да, музыка была замечательная.|Ja, die Musik war wunderbar.|Yes, the music was wonderful.
r03|Я тоже думаю, что мы торопимся.|Ich denke auch, dass wir uns zu sehr beeilen.|I also think we are rushing too much.
r04|Давай ещё раз обсудим наш план.|Lass uns unseren Plan noch einmal besprechen.|Let us discuss our plan again.
r05|Я понимаю, это непросто.|Ich verstehe, das ist nicht einfach.|I understand, it is not easy.
r06|Конечно, я слушаю.|Natürlich, ich höre dir zu.|Of course, I am listening.`,
    dialogues: `d01|Впечатления от фильма|Eindrücke vom Film|Impressions of a film
d02|Обсудить мнение|Eine Meinung besprechen|Discussing an opinion
d03|Поделиться переживаниями|Über Sorgen sprechen|Sharing worries`,
    words: `w01|Мнение|die Meinung|Opinion
w02|Чувство|das Gefühl|Feeling
w03|Мысль|der Gedanke|Thought
w04|Радость|die Freude|Joy
w05|Грусть|die Traurigkeit|Sadness
w06|Беспокойство|die Sorge|Worry
w07|Удивление|die Überraschung|Surprise
w08|Разочарование|die Enttäuschung|Disappointment
w09|Надежда|die Hoffnung|Hope
w10|Облегчение|die Erleichterung|Relief
w11|Согласие|die Zustimmung|Agreement
w12|Уважение|der Respekt|Respect
w13|Причина|der Grund|Reason
w14|Впечатление|der Eindruck|Impression
w15|Уверенный|sicher|Confident
w16|Неуверенный|unsicher|Unsure
w17|Спокойный|ruhig|Calm
w18|Взволнованный|aufgeregt|Excited
w19|Размышлять|nachdenken|To reflect
w20|Соглашаться|zustimmen|To agree` }),
  'misunderstandings-conflicts': topicDraft({ participants: p.friends,
    phrases: `p01|Кажется, мы неправильно друг друга поняли.|Ich glaube, wir haben uns missverstanden.|I think we misunderstood each other.
p02|Можно уточнить, что ты имел в виду?|Kannst du erklären, wie du das gemeint hast?|Could you explain what you meant?
p03|Мне неприятно, когда меня перебивают.|Ich finde es unangenehm, wenn ich unterbrochen werde.|I find it upsetting when I am interrupted.
p04|Давай дадим друг другу договорить.|Lass uns einander ausreden lassen.|Let us give each other time to finish speaking.
p05|Я хочу решить это спокойно.|Ich möchte das in Ruhe klären.|I would like to resolve this calmly.
p06|Какой вариант подошёл бы нам обоим?|Welche Lösung würde für uns beide passen?|What solution would work for both of us?
p07|Извини, я выразился неудачно.|Entschuldige, ich habe mich unglücklich ausgedrückt.|Sorry, I did not express myself well.
p08|Я не хотел тебя обидеть.|Ich wollte dich nicht verletzen.|I did not mean to hurt you.
p09|Мне важно услышать твою точку зрения.|Mir ist wichtig, deine Sichtweise zu hören.|It matters to me to hear your perspective.
p10|Давай обсудим конкретную проблему.|Lass uns über das konkrete Problem sprechen.|Let us discuss the specific problem.
p11|Мне сейчас нужна небольшая пауза.|Ich brauche jetzt eine kurze Pause.|I need a short break now.
p12|Вернёмся к разговору позже?|Können wir später weiterreden?|Can we continue talking later?
p13|Я понимаю, почему ты расстроен.|Ich verstehe, warum du verärgert bist.|I understand why you are upset.
p14|Давай договоримся, как поступать дальше.|Lass uns vereinbaren, wie es weitergeht.|Let us agree on how to move forward.
p15|Спасибо, что мы смогли это обсудить.|Danke, dass wir darüber sprechen konnten.|Thank you for talking this through with me.`,
    replies: `r01|Да, давай разберёмся.|Ja, lass uns das klären.|Yes, let us clear it up.
r02|Я хотел сказать, что мне нужно больше времени.|Ich meinte, dass ich mehr Zeit brauche.|I meant that I need more time.
r03|Извини, я буду внимательнее.|Entschuldige, ich werde besser darauf achten.|Sorry, I will be more careful.
r04|Хорошо, сначала скажи ты.|Gut, sprich du zuerst.|All right, you speak first.
r05|Я тоже хочу найти решение.|Ich möchte auch eine Lösung finden.|I want to find a solution too.
r06|Давай начнём с того, в чём мы согласны.|Fangen wir damit an, worüber wir uns einig sind.|Let us start with what we agree on.`,
    dialogues: `d01|Прояснить смысл|Ein Missverständnis klären|Clearing up a misunderstanding
d02|Говорить по очереди|Einander ausreden lassen|Taking turns to speak
d03|Найти компромисс|Einen Kompromiss finden|Finding a compromise`,
    words: `w01|Недоразумение|das Missverständnis|Misunderstanding
w02|Конфликт|der Konflikt|Conflict
w03|Извинение|die Entschuldigung|Apology
w04|Точка зрения|die Sichtweise|Perspective
w05|Компромисс|der Kompromiss|Compromise
w06|Решение|die Lösung|Solution
w07|Пауза|die Pause|Break
w08|Терпение|die Geduld|Patience
w09|Граница|die Grenze|Boundary
w10|Уважение|der Respekt|Respect
w11|Договорённость|die Vereinbarung|Agreement
w12|Объяснение|die Erklärung|Explanation
w13|Понимание|das Verständnis|Understanding
w14|Раздражение|der Ärger|Annoyance
w15|Слушать|zuhören|To listen
w16|Перебивать|unterbrechen|To interrupt
w17|Прояснять|klären|To clarify
w18|Обвинять|beschuldigen|To accuse
w19|Извиняться|sich entschuldigen|To apologise
w20|Спокойно|in Ruhe|Calmly` }),
};
