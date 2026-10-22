# LINAD — навигация Learning by Level

Дата: 19 октября 2026.

## Готово

- Последовательность настройки: Languages → Placement → Level Selection. Stepper содержит три некликабельных шага и показывает текущий этап как при первом входе, так и при возврате к настройке. На страницах модулей и уроков Stepper не показывается.
- Первый экран выбора языков переделан по новому макету: заголовок, описание, элементы выбора и CTA находятся внутри общего блока с прежней фотографией книжного магазина. По последнему уточнению восстановлены прежние крупные кнопки Deutsch/English с флагами и кнопки выбора языка объяснений с отметкой выбора. Выпадающего списка больше нет. Светлая и тёмная версии используют точные градиенты первых двух блоков страницы «Об авторе»; сама страница автора не изменена. На телефоне немецкий и английский остаются рядом, а кнопка продолжения находится под выбором объяснений.
- Ссылка языка в Breadcrumbs возвращает к выбору языков. «Продолжить» открывает сохранённый уровень выбранного языка, если он уже выбран, и Placement — только при первоначальном выборе уровня для этого языка. Начальное значение A1 без завершённой настройки не считается выбранным уровнем. Смена уровня остаётся отдельным действием через «Изменить уровень». Отдельные кнопки возврата сохранены, прогресс и незавершённый тест не сбрасываются.
- Самостоятельный выбор уровня и путь через настоящий диагностический тест используют один экран выбора A1–C1. Рекомендация показывается после теста; самостоятельный выбор не создаёт результата.
- В новых диагностических тестах только грамматика, лексика и чтение: 30 адаптивно выбираемых заданий. Аудиозадания и проверка звука из интерфейса удалены. Микрофон, распознавание речи и оценка произношения не используются.
- Modules: Breadcrumbs, отдельный баннер с настоящими HTML-заголовком, описанием, кнопкой смены уровня и прогрессом; восемь компактных строк модулей для каждого уровня и каждого языка.
- В баннер Modules подключена отдельно предоставленная фотография студентов с видом на город, озеро и горы. Оригинал скопирован без изменения содержимого; CSS использует object-fit: cover и градиент на основе цветов текущей темы. На других экранах эта фотография не используется.
- Lesson: интерактивные Breadcrumbs, название, переходы между соседними опубликованными уроками, прогресс и две колонки. На телефоне меню разделов превращается в прокручиваемые вкладки без переполнения страницы.
- Семь разделов: теория, лексика, примеры, диалоги, чтение, упражнения, тест. Теория включает пример с переводом, таблицу форм и блок «Важно» там, где они предусмотрены данными урока.
- Опубликованный модуль A1 содержит два работающих урока для каждого языка. Это позволяет проверить настоящие переходы «Предыдущий/Следующий урок». На границах списка соответствующая кнопка недоступна; несуществующие уроки не имитируются.
- Упражнения проверяют ответы; мини-тест сохраняет фактический результат, включая 0/5. Результат находится внутри раздела теста, а не в дополнительной ступени навигации.
- Произношение слов и предложений сохранено. Проверено, что немецкий текст отправляется в de-DE, английский — в en-GB. Ошибки/отсутствие браузерного голоса обрабатывает прежний механизм.
- Прогресс модулей и уровня рассчитывается по завершённым опубликованным урокам. Просмотр теории сам по себе не завершает модуль. Пустые модули отмечены как готовящиеся, без выдуманных уроков и процентов.
- Выбор языка, уровень, последний посещённый урок и раздел сохраняются локально. Возвращение в Learning by Level открывает последний урок либо список модулей выбранного уровня. Прогресс DE и EN разделён.
- Старые записи локального хранилища мигрируют без сброса учебных результатов. Подписка на изменения хранилища закрывает промежуток между чтением состояния и подключением второй вкладки.
- Повторный диагностический тест сохраняет предыдущие ответы и рекомендацию в истории; учебный прогресс не сбрасывается. Подготовлена отдельная функция политики доступа для будущей настоящей авторизации. Сейчас регистрация не имитируется и повторный тест доступен локально.

## Что остаётся

1. Наполнение остальных модулей учебными материалами. Подготовленные восемь модулей на каждом уровне доступны для открытия, но неопубликованные уроки обозначены честно. Полноценные образцы находятся в A1 → первый модуль.
2. Подключение настоящей авторизации и серверного хранения — отдельный будущий этап.

## Проверки

- `npm run build`: успешно, включая проверку TypeScript.
- `npm run lint`: успешно.
- Playwright: 33 проверки прошли. Оба пути, RU/DE/EN, обе темы, четыре языковые пары, пять ширин 320/375/768/1024/1440, Breadcrumbs, клавиатура, возврат к последнему уроку, мини-тест и реальный прогресс, история повторных тестов, синхронизация вкладок, недоступное localStorage.
- Полные диагностические прохождения DE/RU, DE/EN, EN/RU, EN/DE не выбирают ни одного аудиозадания.
- Контрольные SHA-256: 68 защищённых исходных файлов без изменений; утверждённые фотографии Learning сохранены побайтово.
- После подключения фотографии Modules отдельно проверены загрузка оригинала, обе темы, ширины 320/375/768/1024/1440 и RU/DE/EN. Фото отсутствует на экране Languages и в уроке. Повторные сборка и lint прошли. SHA-256 оригинала и копии: `b59d4314e272bf55a28e388c8b55a079cbc88ebae1b7e64a212f61c3fa80de04`.
- Для нового первого экрана отдельно сравнены вычисленные CSS-градиенты с Author в обеих темах: совпадение точное. Проверены пять ширин, восстановленные группы кнопок и сохранение четырёх языковых пар. Проверка возвращения пользователя охватывает сохранённый B1, явную смену на A2, первоначальную настройку английского, сохранение для него B2 и последующее переключение обратно на Deutsch A2 после перезагрузки. Stepper остаётся некликабельным.
- Header, Footer, Home, About Author, Practice, Tutors, Telegram, Profile и глобальные CSS-токены не изменены.

## Изменённые файлы

### Навигация, состояние и интерфейс

- [LevelLearning.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/LevelLearning.tsx)
- [LevelUI.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/LevelUI.tsx)
- [LanguageSetup.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/LanguageSetup.tsx)
- [PlacementPage.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/PlacementPage.tsx)
- [AssessmentPage.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/AssessmentPage.tsx)
- [ResultPage.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/ResultPage.tsx)
- [CurriculumPage.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/CurriculumPage.tsx)
- [LessonPage.tsx](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/LessonPage.tsx)
- [model.ts](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/model.ts)
- [storage.ts](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/storage.ts)
- [useLevelsStore.ts](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/useLevelsStore.ts)
- [navigation.ts — новый](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/navigation.ts)
- [assessment-access.ts — новый](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/assessment-access.ts)

### Данные, переводы и стили

- [curriculum.ts](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/data/curriculum.ts)
- [curriculum-extension.ts — новый](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/data/curriculum-extension.ts)
- [lessons.ts](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/data/lessons.ts)
- [lesson-navigation-samples.ts — новый](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/pages/learning/levels/data/lesson-navigation-samples.ts)
- [levels-messages.ts](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/i18n/levels-messages.ts)
- [levels.css](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/styles/levels.css)

### Проверки и отчёты

- [levels.spec.ts — проверки данных обновлены под восемь модулей; прежние UI-сценарии заменены актуальными](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/tests/levels.spec.ts)
- [levels-navigation.spec.ts — новые актуальные UI-сценарии и проверки состояния](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/tests/levels-navigation.spec.ts)
- [learning.spec.ts — ожидания заголовка обновлены под новый первый экран](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/tests/learning.spec.ts)
- Редакционные выгрузки и контрольные результаты в [каталоге QA](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/qa/levels).
- Снимки экранов модулей и урока в [каталоге этой проверки](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/qa/levels-navigation).
- [assets.ts — путь к фотографии баннера Modules](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/src/config/assets.ts)
- [modules-banner.png — предоставленная фотография](C:/Users/danil/Desktop/LINAD_CODEX_FINAL_RU_DE_RESPONSIVE/public/assets/learning/levels/modules-banner.png)

