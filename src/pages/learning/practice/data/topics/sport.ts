import { topicDraft } from './authoring';
import { participants as p } from './participants';

export const sportMaterials = {
  'gym-membership': topicDraft({ participants: p.club,
    phrases: `p01|Я хочу записаться в ваш спортзал.|Ich möchte mich in Ihrem Fitnessstudio anmelden.|I would like to join your gym.
p02|Можно сначала прийти на пробную тренировку?|Kann ich zuerst ein Probetraining machen?|Can I have a trial session first?
p03|Какие абонементы вы предлагаете?|Welche Abonnemente bieten Sie an?|What memberships do you offer?
p04|Есть абонемент на месяц?|Gibt es ein Monatsabo?|Is there a monthly membership?
p05|Можно посмотреть раздевалки?|Darf ich die Garderoben anschauen?|May I see the changing rooms?
p06|Для шкафчика нужен свой замок?|Brauche ich ein eigenes Schloss für das Schliessfach?|Do I need my own padlock for the locker?
p07|Групповые занятия входят в абонемент?|Sind Gruppenkurse im Abo enthalten?|Are group classes included in the membership?
p08|Какие часы работы в выходные?|Wann haben Sie am Wochenende geöffnet?|What are your weekend opening hours?
p09|Как записаться в спортивный клуб?|Wie melde ich mich im Sportverein an?|How do I join the sports club?
p10|Можно приостановить абонемент?|Kann ich mein Abo pausieren?|Can I pause my membership?
p11|Каковы условия расторжения?|Welche Kündigungsbedingungen gelten?|What are the cancellation terms?
p12|Я впервые в тренажёрном зале.|Ich bin zum ersten Mal in einem Fitnessstudio.|This is my first time in a gym.
p13|Нужен ли вводный инструктаж?|Brauche ich eine Einführung?|Do I need an induction?
p14|Что взять на первое занятие?|Was soll ich zum ersten Training mitbringen?|What should I bring to my first session?
p15|Можно получить правила клуба письменно?|Kann ich die Clubregeln schriftlich bekommen?|Could I get the club rules in writing?`,
    replies: `r01|С удовольствием покажу вам зал.|Gerne zeige ich Ihnen das Studio.|I would be happy to show you the gym.
r02|Да, давайте подберём время.|Ja, suchen wir einen passenden Termin.|Yes, let us find a suitable time.
r03|Я объясню наши варианты.|Ich erkläre Ihnen unsere Angebote.|I will explain our options.
r04|Я проверю доступные тарифы.|Ich prüfe die verfügbaren Tarife.|I will check the available plans.
r05|Конечно, они находятся слева.|Natürlich, sie sind auf der linken Seite.|Of course, they are on the left.
r06|Для этого шкафчика нужен свой замок.|Für dieses Schliessfach brauchen Sie ein eigenes Schloss.|You need your own padlock for this locker.`,
    dialogues: `d01|Пробное посещение|Ein Probetraining vereinbaren|Arranging a trial session
d02|Выбор абонемента|Ein Abo auswählen|Choosing a membership
d03|Раздевалка и шкафчик|Garderobe und Schliessfach|Changing room and locker`,
    words: `w01|Спортзал|das Fitnessstudio|Gym
w02|Спортивный клуб|der Sportverein|Sports club
w03|Абонемент|das Abonnement|Membership
w04|Пробная тренировка|das Probetraining|Trial session
w05|Членство|die Mitgliedschaft|Membership status
w06|Регистрация|die Anmeldung|Registration
w07|Раздевалка|die Garderobe|Changing room
w08|Шкафчик|das Schliessfach|Locker
w09|Замок|das Schloss|Padlock
w10|Душ|die Dusche|Shower
w11|Групповое занятие|der Gruppenkurs|Group class
w12|Вводный инструктаж|die Einführung|Induction
w13|Тариф|der Tarif|Plan
w14|Пауза абонемента|die Abopause|Membership pause
w15|Расторжение|die Kündigung|Cancellation
w16|Срок действия|die Laufzeit|Term
w17|Правила клуба|die Clubregeln|Club rules
w18|Часы работы|die Öffnungszeiten|Opening hours
w19|Полотенце|das Handtuch|Towel
w20|Кроссовки|die Sportschuhe|Trainers` }),
  'workouts-exercises': topicDraft({ participants: p.trainer,
    phrases: `p01|Покажите, пожалуйста, это упражнение.|Zeigen Sie mir bitte diese Übung.|Please show me this exercise.
p02|Я правильно выполняю движение?|Führe ich die Bewegung richtig aus?|Am I doing the movement correctly?
p03|Как настроить этот тренажёр?|Wie stelle ich dieses Gerät ein?|How do I adjust this machine?
p04|Можно начать с меньшего веса?|Kann ich mit weniger Gewicht anfangen?|Can I start with a lighter weight?
p05|Эта нагрузка для меня слишком большая.|Diese Belastung ist mir zu hoch.|This workload is too much for me.
p06|Можно выбрать более лёгкий вариант?|Können wir eine leichtere Variante wählen?|Can we choose an easier version?
p07|Сколько повторений запланировано?|Wie viele Wiederholungen sind vorgesehen?|How many repetitions are planned?
p08|Сколько подходов мы делаем?|Wie viele Sätze machen wir?|How many sets are we doing?
p09|Мне нужна короткая пауза.|Ich brauche eine kurze Pause.|I need a short break.
p10|Этот тренажёр сейчас свободен?|Ist dieses Gerät gerade frei?|Is this machine free at the moment?
p11|Я хочу сначала размяться.|Ich möchte mich zuerst aufwärmen.|I would like to warm up first.
p12|Когда нужно выдыхать?|Wann soll ich ausatmen?|When should I breathe out?
p13|Можем снизить темп?|Können wir das Tempo reduzieren?|Can we slow down?
p14|Я чувствую усталость в мышцах.|Meine Muskeln fühlen sich müde an.|My muscles feel tired.
p15|Какое упражнение следующее?|Welche Übung kommt als Nächstes?|Which exercise comes next?`,
    replies: `r01|Конечно, сначала посмотрите на движение.|Natürlich, schauen Sie sich zuerst die Bewegung an.|Of course, watch the movement first.
r02|Давайте вместе проверим технику.|Prüfen wir gemeinsam die Technik.|Let us check your technique together.
r03|Я покажу регулировку сиденья.|Ich zeige Ihnen die Sitzeinstellung.|I will show you how to adjust the seat.
r04|Да, подберём подходящий для вас вес.|Ja, wir wählen ein passendes Gewicht für Sie.|Yes, we will choose a suitable weight for you.
r05|Спасибо, что сказали об этом.|Danke, dass Sie das sagen.|Thank you for telling me.
r06|Да, я покажу другой вариант.|Ja, ich zeige Ihnen eine andere Variante.|Yes, I will show you another version.`,
    dialogues: `d01|Освоить движение|Eine Bewegung lernen|Learning a movement
d02|Настроить тренажёр|Ein Gerät einstellen|Adjusting a machine
d03|Изменить нагрузку|Die Belastung anpassen|Adjusting the workload`,
    words: `w01|Упражнение|die Übung|Exercise
w02|Движение|die Bewegung|Movement
w03|Повторение|die Wiederholung|Repetition
w04|Подход|der Satz|Set
w05|Вес|das Gewicht|Weight
w06|Гантель|die Hantel|Dumbbell
w07|Тренажёр|das Trainingsgerät|Exercise machine
w08|Сиденье|der Sitz|Seat
w09|Разминка|das Aufwärmen|Warm-up
w10|Растяжка|das Dehnen|Stretching
w11|Мышца|der Muskel|Muscle
w12|Нагрузка|die Belastung|Workload
w13|Техника|die Technik|Technique
w14|Темп|das Tempo|Pace
w15|Пауза|die Pause|Break
w16|Дыхание|die Atmung|Breathing
w17|Баланс|das Gleichgewicht|Balance
w18|Сила|die Kraft|Strength
w19|Выносливость|die Ausdauer|Endurance
w20|Настраивать|einstellen|To adjust` }),
  'trainer-communication': topicDraft({ participants: p.trainer,
    phrases: `p01|Можно обсудить мой план тренировок?|Können wir meinen Trainingsplan besprechen?|Could we discuss my training plan?
p02|Как оценить мой нынешний уровень?|Wie können wir mein aktuelles Niveau einschätzen?|How can we assess my current level?
p03|У меня мало опыта тренировок.|Ich habe wenig Trainingserfahrung.|I have little training experience.
p04|Можем начать с основ?|Können wir mit den Grundlagen anfangen?|Can we start with the basics?
p05|Мне трудно соблюдать этот график.|Es fällt mir schwer, diesen Zeitplan einzuhalten.|I find it difficult to keep to this schedule.
p06|Можно адаптировать план к моему времени?|Können wir den Plan an meine verfügbare Zeit anpassen?|Can we adapt the plan to the time I have available?
p07|Я хочу заниматься регулярно.|Ich möchte regelmässig trainieren.|I would like to train regularly.
p08|Мне удобнее тренироваться утром.|Training am Morgen passt mir besser.|Training in the morning suits me better.
p09|Можно записать ваши рекомендации?|Darf ich Ihre Hinweise aufschreiben?|May I write down your suggestions?
p10|Я не понял последнюю инструкцию.|Ich habe die letzte Anweisung nicht verstanden.|I did not understand the last instruction.
p11|Покажите, пожалуйста, ещё раз медленно.|Zeigen Sie es bitte noch einmal langsam.|Please show me again slowly.
p12|Когда мы пересмотрим план?|Wann überprüfen wir den Plan wieder?|When will we review the plan?
p13|Как отслеживать изменения?|Wie kann ich Veränderungen festhalten?|How can I record changes?
p14|Я хочу больше обратной связи по технике.|Ich wünsche mir mehr Rückmeldung zu meiner Technik.|I would like more feedback on my technique.
p15|Спасибо, теперь задача понятна.|Danke, jetzt ist die Aufgabe klar.|Thank you, the task is clear now.`,
    replies: `r01|Да, расскажите о своих целях.|Ja, erzählen Sie mir von Ihren Zielen.|Yes, tell me about your goals.
r02|Начнём с беседы о вашем опыте.|Wir beginnen mit einem Gespräch über Ihre Erfahrung.|We will start by discussing your experience.
r03|Хорошо, будем учитывать это.|Gut, das berücksichtigen wir.|All right, we will take that into account.
r04|Конечно, объясню всё постепенно.|Natürlich, ich erkläre alles Schritt für Schritt.|Of course, I will explain everything step by step.
r05|Какие дни для вас наиболее удобны?|Welche Tage passen Ihnen am besten?|Which days suit you best?
r06|Да, составим реалистичный график вместе.|Ja, wir erstellen gemeinsam einen realistischen Zeitplan.|Yes, we will make a realistic schedule together.`,
    dialogues: `d01|Обсуждение плана|Den Trainingsplan besprechen|Discussing a training plan
d02|Начать с основ|Mit den Grundlagen beginnen|Starting with the basics
d03|Подстроить график|Den Zeitplan anpassen|Adapting the schedule`,
    words: `w01|Тренер|die Trainerin / der Trainer|Trainer
w02|План тренировок|der Trainingsplan|Training plan
w03|Цель|das Ziel|Goal
w04|Уровень|das Niveau|Level
w05|Опыт|die Erfahrung|Experience
w06|Основа|die Grundlage|Basic principle
w07|Обратная связь|die Rückmeldung|Feedback
w08|Инструкция|die Anweisung|Instruction
w09|График|der Zeitplan|Schedule
w10|Оценка уровня|die Einschätzung|Assessment
w11|Регулярность|die Regelmässigkeit|Consistency
w12|Изменение|die Veränderung|Change
w13|Прогресс|der Fortschritt|Progress
w14|Заметка|die Notiz|Note
w15|Индивидуальная тренировка|das Einzeltraining|Individual training
w16|Доступное время|die verfügbare Zeit|Available time
w17|Мотивация|die Motivation|Motivation
w18|Адаптировать|anpassen|To adapt
w19|Проверять|überprüfen|To review
w20|Постепенно|Schritt für Schritt|Step by step` }),
  'competitions': topicDraft({ participants: p.club,
    phrases: `p01|Я хочу зарегистрироваться на соревнование.|Ich möchte mich für den Wettkampf anmelden.|I would like to register for the competition.
p02|Где найти условия участия?|Wo finde ich die Teilnahmebedingungen?|Where can I find the entry requirements?
p03|Во сколько начинается старт?|Um wie viel Uhr ist der Start?|What time does the event start?
p04|Когда нужно прибыть на место?|Wann soll ich vor Ort sein?|When should I arrive at the venue?
p05|Где получить стартовый номер?|Wo bekomme ich meine Startnummer?|Where can I collect my race number?
p06|Здесь можно оставить личные вещи?|Kann ich meine persönlichen Sachen hier abgeben?|Can I leave my belongings here?
p07|Есть категория для начинающих?|Gibt es eine Kategorie für Anfänger?|Is there a beginners’ category?
p08|Какова длина дистанции?|Wie lang ist die Strecke?|How long is the course?
p09|Где посмотреть маршрут?|Wo kann ich den Streckenplan sehen?|Where can I see the course map?
p10|На трассе будут пункты с водой?|Gibt es Wasserstellen an der Strecke?|Will there be water stations along the course?
p11|Какие правила действуют на этом соревновании?|Welche Regeln gelten bei diesem Wettkampf?|What rules apply to this competition?
p12|Где находится медицинский пункт?|Wo ist der Sanitätsposten?|Where is the first-aid post?
p13|Я не смогу участвовать.|Ich kann nicht teilnehmen.|I will not be able to take part.
p14|Как сообщить об отказе от участия?|Wie melde ich mich vom Wettkampf ab?|How do I withdraw from the competition?
p15|Где будут опубликованы результаты?|Wo werden die Ergebnisse veröffentlicht?|Where will the results be published?`,
    replies: `r01|Регистрация доступна на сайте мероприятия.|Die Anmeldung ist auf der Veranstaltungswebsite möglich.|You can register on the event website.
r02|Они указаны в разделе для участников.|Sie stehen im Bereich für Teilnehmende.|They are in the participants’ section.
r03|Время зависит от вашей группы.|Die Zeit hängt von Ihrer Startgruppe ab.|The time depends on your starting group.
r04|Посмотрите время сбора в подтверждении.|Die Treffzeit steht in Ihrer Bestätigung.|The arrival time is in your confirmation.
r05|У стойки регистрации рядом со входом.|Bei der Anmeldung neben dem Eingang.|At the registration desk next to the entrance.
r06|Да, здесь находится камера хранения.|Ja, hier ist die Gepäckaufbewahrung.|Yes, the bag storage area is here.`,
    dialogues: `d01|Подать заявку на участие|Sich für den Wettkampf anmelden|Entering a competition
d02|Время старта|Die Startzeit|The starting time
d03|Перед стартом|Vor dem Start|Before the start`,
    words: `w01|Соревнование|der Wettkampf|Competition
w02|Участие|die Teilnahme|Participation
w03|Заявка|die Anmeldung|Entry
w04|Участник|die Teilnehmerin / der Teilnehmer|Participant
w05|Старт|der Start|Start
w06|Финиш|das Ziel|Finish
w07|Дистанция|die Strecke|Course
w08|Стартовый номер|die Startnummer|Race number
w09|Стартовая группа|die Startgruppe|Starting group
w10|Правило|die Regel|Rule
w11|Судья|die Schiedsrichterin / der Schiedsrichter|Referee
w12|Время сбора|die Treffzeit|Assembly time
w13|Маршрут|der Streckenplan|Course map
w14|Пункт с водой|die Wasserstelle|Water station
w15|Медицинский пункт|der Sanitätsposten|First-aid post
w16|Камера хранения|die Gepäckaufbewahrung|Bag storage
w17|Результат соревнования|das Wettkampfergebnis|Competition result
w18|Отказ от участия|die Abmeldung|Withdrawal
w19|Организатор|die Veranstalterin / der Veranstalter|Organiser
w20|Условия участия|die Teilnahmebedingungen|Entry requirements` }),
  'injuries-recovery': topicDraft({ participants: p.medical,
    phrases: `p01|Я повредил лодыжку на тренировке.|Ich habe mich beim Training am Knöchel verletzt.|I injured my ankle during training.
p02|Боль появилась после неудачного движения.|Die Schmerzen begannen nach einer unglücklichen Bewegung.|The pain started after an awkward movement.
p03|Колено болит при нагрузке.|Mein Knie schmerzt bei Belastung.|My knee hurts when I put weight on it.
p04|Мне нужно пройти обследование?|Brauche ich eine Untersuchung?|Do I need an examination?
p05|Я хочу обсудить возвращение к тренировкам.|Ich möchte die Rückkehr zum Training besprechen.|I would like to discuss returning to training.
p06|По каким признакам можно оценить готовность?|Woran lässt sich erkennen, ob ich wieder bereit bin?|How can we tell whether I am ready to return?
p07|В этом месте есть отёк.|Hier ist eine Schwellung.|There is swelling here.
p08|Я пока не могу полностью опираться на ногу.|Ich kann das Bein noch nicht voll belasten.|I cannot put my full weight on the leg yet.
p09|Какие движения мне пока избегать?|Welche Bewegungen soll ich vorläufig vermeiden?|Which movements should I avoid for now?
p10|Нужна ли физиотерапия?|Ist Physiotherapie nötig?|Is physiotherapy needed?
p11|Боль усилилась после занятия.|Nach dem Training sind die Schmerzen stärker geworden.|The pain got worse after the session.
p12|Я следую вашему плану восстановления.|Ich halte mich an Ihren Rehabilitationsplan.|I am following your rehabilitation plan.
p13|Можно уточнить технику этого упражнения?|Können Sie mir die Technik dieser Übung genauer erklären?|Could you explain the technique for this exercise in more detail?
p14|Когда нужно прийти на контроль?|Wann soll ich zur Kontrolle kommen?|When should I come for a follow-up?
p15|Что делать, если боль вернётся?|Was soll ich tun, wenn die Schmerzen wiederkommen?|What should I do if the pain returns?`,
    replies: `r01|Расскажите, как это произошло.|Erzählen Sie, wie es passiert ist.|Tell me how it happened.
r02|Покажите, пожалуйста, где именно болит.|Zeigen Sie bitte, wo es genau wehtut.|Please show me exactly where it hurts.
r03|Как давно у вас эти боли?|Seit wann haben Sie diese Schmerzen?|How long have you had this pain?
r04|Сначала я задам вопросы и осмотрю колено.|Zuerst stelle ich Ihnen Fragen und untersuche das Knie.|First I will ask you some questions and examine your knee.
r05|Расскажите, как проходит восстановление.|Erzählen Sie, wie die Erholung verläuft.|Tell me how your recovery is going.
r06|Мы оценим ваше состояние на осмотре.|Wir beurteilen Ihren Zustand bei der Untersuchung.|We will assess your condition during the examination.`,
    dialogues: `d01|Рассказать о травме|Eine Verletzung beschreiben|Describing an injury
d02|Боль при нагрузке|Schmerzen bei Belastung|Pain under load
d03|Возвращение к спорту|Die Rückkehr zum Sport|Returning to sport`,
    words: `w01|Травма|die Verletzung|Injury
w02|Лодыжка|der Knöchel|Ankle
w03|Колено|das Knie|Knee
w04|Боль|der Schmerz|Pain
w05|Отёк|die Schwellung|Swelling
w06|Синяк|der Bluterguss|Bruise
w07|Связка|das Band|Ligament
w08|Сухожилие|die Sehne|Tendon
w09|Растяжение связок|die Verstauchung|Sprain
w10|Мышечное растяжение|die Muskelzerrung|Muscle strain
w11|Восстановление|die Erholung|Recovery
w12|Реабилитация|die Rehabilitation|Rehabilitation
w13|Физиотерапия|die Physiotherapie|Physiotherapy
w14|Подвижность|die Beweglichkeit|Mobility
w15|Нагрузка|die Belastung|Load
w16|Осмотр|die Untersuchung|Examination
w17|Контрольный приём|der Kontrolltermin|Follow-up appointment
w18|План восстановления|der Rehabilitationsplan|Rehabilitation plan
w19|Болезненный|schmerzhaft|Painful
w20|Избегать|vermeiden|To avoid` }),
  'nutrition-goals': topicDraft({ participants: p.trainer,
    phrases: `p01|Я хочу поставить реалистичную спортивную цель.|Ich möchte mir ein realistisches sportliches Ziel setzen.|I would like to set a realistic fitness goal.
p02|Как мы будем отслеживать мой прогресс?|Wie werden wir meinen Fortschritt festhalten?|How will we track my progress?
p03|Мне хочется улучшить выносливость.|Ich möchte meine Ausdauer verbessern.|I would like to improve my endurance.
p04|Можно учесть это в плане?|Können wir das im Plan berücksichtigen?|Can we take that into account in the plan?
p05|У меня есть вопросы о питании.|Ich habe Fragen zur Ernährung.|I have questions about nutrition.
p06|Можете порекомендовать квалифицированного специалиста?|Können Sie mir eine qualifizierte Fachperson empfehlen?|Could you recommend a qualified specialist?
p07|Я хочу выстроить устойчивые привычки.|Ich möchte dauerhafte Gewohnheiten aufbauen.|I would like to build lasting habits.
p08|Мне важно не перегружать себя.|Mir ist wichtig, mich nicht zu überfordern.|It is important to me not to overdo it.
p09|У меня есть пищевая аллергия.|Ich habe eine Lebensmittelallergie.|I have a food allergy.
p10|Я не хочу ориентироваться только на вес.|Ich möchte mich nicht nur am Gewicht orientieren.|I do not want to focus only on my weight.
p11|Мне трудно сохранять регулярность.|Es fällt mir schwer, regelmässig dranzubleiben.|I find it difficult to stay consistent.
p12|Давайте выберем небольшую промежуточную цель.|Lassen Sie uns ein kleines Zwischenziel wählen.|Let us choose a small intermediate goal.
p13|Я хочу лучше восстанавливаться после занятий.|Ich möchte mich nach dem Training besser erholen.|I would like to recover better after training.
p14|Сон тоже нужно учитывать в плане?|Sollten wir den Schlaf im Plan berücksichtigen?|Should we take sleep into account in the plan?
p15|Когда мы обсудим результаты снова?|Wann besprechen wir die Entwicklung wieder?|When will we review my progress again?`,
    replies: `r01|Что вы хотели бы изменить прежде всего?|Was möchten Sie vor allem verändern?|What would you most like to change?
r02|Давайте согласуем понятные критерии.|Legen wir gemeinsam klare Kriterien fest.|Let us agree on clear criteria together.
r03|Расскажите о вашем текущем опыте.|Erzählen Sie von Ihrer bisherigen Erfahrung.|Tell me about your experience so far.
r04|Да, мы скорректируем цель тренировок.|Ja, wir passen das Trainingsziel an.|Yes, we will adjust the training goal.
r05|Какие именно вопросы вас интересуют?|Welche Fragen beschäftigen Sie genau?|Which questions do you have in mind?
r06|Да, я помогу найти подходящую консультацию.|Ja, ich helfe Ihnen, eine passende Beratung zu finden.|Yes, I will help you find suitable advice.`,
    dialogues: `d01|Реалистичная цель|Ein realistisches Ziel|A realistic goal
d02|Развивать выносливость|Die Ausdauer verbessern|Improving endurance
d03|Вопросы о питании|Fragen zur Ernährung|Questions about nutrition`,
    words: `w01|Питание|die Ernährung|Nutrition
w02|Цель|das Ziel|Goal
w03|Промежуточная цель|das Zwischenziel|Intermediate goal
w04|Привычка|die Gewohnheit|Habit
w05|Выносливость|die Ausdauer|Endurance
w06|Прогресс|der Fortschritt|Progress
w07|Критерий|das Kriterium|Criterion
w08|Самочувствие|das Wohlbefinden|Well-being
w09|Восстановление|die Erholung|Recovery
w10|Сон|der Schlaf|Sleep
w11|Вес|das Gewicht|Weight
w12|Приём пищи|die Mahlzeit|Meal
w13|Перекус|die Zwischenmahlzeit|Snack
w14|Напиток|das Getränk|Drink
w15|Пищевая аллергия|die Lebensmittelallergie|Food allergy
w16|Белок|das Eiweiss|Protein
w17|Углеводы|die Kohlenhydrate|Carbohydrates
w18|Консультация по питанию|die Ernährungsberatung|Nutrition counselling
w19|Реалистичный|realistisch|Realistic
w20|Регулярный|regelmässig|Regular` }),
};
