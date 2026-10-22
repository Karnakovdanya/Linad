import type { UiLanguage } from '../domain/types';
const ru = {
  addStudyLanguage: 'Добавить язык для изучения', addStudyHint: 'Выбери язык, укажи свой уровень и начни обучение.',
  editLanguage: 'Изменить язык или уровень', studyLanguage: 'Язык', chooseLanguage: 'Выберите язык', chooseLevel: 'Выберите уровень',
  quote: 'Новые языки — это новые возможности', profileTagline: 'Изучай языки. Открывай возможности.',
  goal: 'Цель', noGoal: 'Не выбрана', setGoal: 'Установить цель', editGoal: 'Изменить цель', removeGoal: 'Убрать цель', targetLevel: 'Целевой уровень',
  goalHint: 'Выбери язык и уровень, к которому стремишься. Цель не меняет результаты обучения.',
  studying: 'В обучении', consecutiveDays: 'дней подряд', startToday: 'Начни обучение сегодня!', keepStreak: 'Продолжай учиться каждый день.',
  consecutiveDay: 'день подряд', consecutiveFewDays: 'дня подряд',
  learningEmpty: 'Выбери язык для изучения, чтобы увидеть свой прогресс и начать обучение.', openAll: 'Открыть всё',
  settingsSaveError: 'Тема и язык применены на этом устройстве. Не удалось обновить аккаунт; введённые данные сохранены в форме. Повторите сохранение.',
  close: 'Закрыть', germanCountry: 'Берлин, Германия', englishCountry: 'Лондон, Великобритания',
  studySyncSchema: 'Учебный прогресс пока сохраняется на этом устройстве. Для облачной синхронизации нужна настройка базы.',
  firstName: 'Имя', lastName: 'Фамилия', resume: 'Продолжить', profileIntro: 'Продолжай обучение. Новые знания — больше возможностей.',
  studyLanguages: 'Мои языки', editLanguages: 'Изменить языки', languagePreferences: 'Языки и уровень владения',
  personalLevel: 'Уровень по самооценке', levelUnspecified: 'Не указан', courseProgress: 'Прогресс курса',
  personalHint: 'Выбери языки и укажи свой уровень. Эти настройки не меняют прогресс курсов и результаты тестов.',
  noLanguages: 'Добавь язык, который изучаешь, чтобы он появился в профиле.',
  photo: 'Фотография профиля', uploadPhoto: 'Загрузить фото', replacePhoto: 'Заменить фото', deletePhoto: 'Удалить фото',
  photoHint: 'JPEG, PNG или WebP, до 3 МБ. Фото доступно только в твоём аккаунте.',
  photoFormat: 'Выберите корректное изображение JPEG, PNG или WebP.', photoSize: 'Размер фотографии должен быть не больше 3 МБ.',
  photoError: 'Не удалось загрузить фото. Проверь соединение и повтори.',
  photoStorage: 'Хранилище фотографий ещё не подключено. Владелец сайта должен завершить настройку Supabase Storage.',
  photoPermission: 'Нет доступа к хранилищу фотографий. Требуется проверить права доступа в Supabase Storage.',
  syncShort: 'Не удалось синхронизировать. Данные сохранены на этом устройстве.',
  syncSchema: 'Облако ещё не настроено владельцем сайта. Данные сохранены на устройстве.',
  syncPermission: 'Синхронизация недоступна: требуется проверить права доступа в Supabase.',
  syncSession: 'Для синхронизации войди в аккаунт повторно. Локальные данные сохранены.',
  login: 'Войти', register: 'Регистрация', create: 'Создать аккаунт', authTitle: 'Создай аккаунт в LINAD', authIntro: 'Сохраняй прогресс, слова и избранных преподавателей на всех устройствах.',
  name: 'Имя', email: 'Email', password: 'Пароль', passwordHint: 'Не менее 8 символов', confirmPassword: 'Повторите пароль', forgot: 'Забыли пароль?', reset: 'Восстановить пароль', resetSend: 'Отправить ссылку', newPassword: 'Новый пароль', changePassword: 'Изменить пароль',
  confirmEmail: 'Проверьте почту и подтвердите email по ссылке Supabase. Затем войдите в аккаунт.', resetSent: 'Если аккаунт с таким email существует, на него придёт ссылка для восстановления пароля.', callbackError: 'Ссылка недействительна или истекла. Откройте её в браузере, где запрашивали письмо, либо запросите новую.',
  loading: 'Загрузка…', saving: 'Сохранение…', saved: 'Изменения сохранены.', logout: 'Выйти из аккаунта', guest: 'Продолжить без аккаунта', overview: 'Мой профиль', learning: 'Моё обучение', words: 'Мои слова', favorites: 'Избранные репетиторы', settings: 'Настройки', greeting: 'Привет', cabinet: 'Твой личный кабинет LINAD', lessons: 'Пройденные уроки', savedWords: 'Сохранённые слова', tests: 'Завершённые тесты', continue: 'Продолжить обучение', activity: 'Последняя активность', noActivity: 'Учебной активности пока нет. Начни с выбора языка и уровня.', german: 'Немецкий язык', english: 'Английский язык', all: 'Все', level: 'Уровень', modules: 'Модули', open: 'Открыть', noResults: 'Сохранённых результатов тестов пока нет.', results: 'Результаты тестов', score: 'правильных ответов', readyOnly: 'Прогресс учитывает только выполненные задания. Неопубликованные уроки не считаются пройденными.',
  search: 'Поиск по слову или переводу', noWords: 'Сохранённых слов пока нет. Добавляй слова и фразы в Practice или в лексике уроков.', noMatches: 'Ничего не найдено.', remove: 'Удалить', saveWord: 'Сохранить слово', wordSaved: 'Слово сохранено', addFavorite: 'Сохранить преподавателя', removeFavorite: 'Убрать из избранного', noFavorites: 'Избранных преподавателей пока нет.', tutors: 'Все преподаватели', details: 'Подробнее', perHour: '60 минут', listen: 'Прослушать', stop: 'Остановить', profile: 'Профиль', save: 'Сохранить', uiLanguage: 'Язык интерфейса', theme: 'Тема', light: 'Светлая', dark: 'Тёмная', emailManaged: 'Email аккаунта используется для входа и восстановления пароля.',
  cloud: 'Данные синхронизированы', syncing: 'Синхронизация…', syncError: 'Облачное сохранение недоступно. Изменения остаются в кеше этого аккаунта на устройстве. Проверьте соединение и настройку базы.', retry: 'Повторить', configError: 'Подключение Supabase не настроено. Укажите переменные окружения и перезапустите сборку.', importTitle: 'Перенести гостевой прогресс?', importBody: 'На этом устройстве есть данные, сохранённые без аккаунта. Объединить их с аккаунтом? История и облачный прогресс сохранятся. Гостевые записи останутся на устройстве.', importAction: 'Объединить данные', later: 'Позже', imported: 'Гостевые данные объединены. Дождитесь синхронизации.', importOpen: 'Перенести данные этого устройства',
  error: 'Не удалось выполнить запрос. Проверьте соединение и повторите.', credentials: 'Неверный email или пароль.', unconfirmed: 'Сначала подтвердите email по ссылке из письма.', exists: 'Аккаунт уже существует. Попробуйте войти или восстановить пароль.', rateLimit: 'Слишком много запросов. Подождите и повторите.', mismatch: 'Пароли не совпадают.', weak: 'Пароль слишком короткий или не соответствует требованиям Supabase.', required: 'Заполните обязательные поля корректно.', sessionMissing: 'Для изменения пароля откройте ссылку восстановления или войдите в аккаунт.', localError: 'Браузер не разрешает сохранять данные. Разрешите хранилище и повторите.', lesson: 'Урок', practice: 'Практика', miniTest: 'Мини-тест', moduleTest: 'Итоговый тест', placement: 'Определение уровня', back: 'Назад', security: 'Данные аккаунта доступны только после входа. Гостевое обучение остаётся доступным.',
};
type Copy = { [K in keyof typeof ru]: string };
const de: Copy = {
  addStudyLanguage: 'Lernsprache hinzufügen', addStudyHint: 'Wähle eine Sprache und dein Niveau und beginne zu lernen.',
  editLanguage: 'Sprache oder Niveau ändern', studyLanguage: 'Sprache', chooseLanguage: 'Sprache wählen', chooseLevel: 'Niveau wählen',
  quote: 'Neue Sprachen eröffnen neue Möglichkeiten', profileTagline: 'Lerne Sprachen. Entdecke Möglichkeiten.',
  goal: 'Ziel', noGoal: 'Nicht gewählt', setGoal: 'Ziel festlegen', editGoal: 'Ziel ändern', removeGoal: 'Ziel entfernen', targetLevel: 'Zielniveau',
  goalHint: 'Wähle die Sprache und das Niveau, das du erreichen möchtest. Das Ziel verändert keine Lernergebnisse.',
  studying: 'Lernserie', consecutiveDays: 'Tage in Folge', startToday: 'Beginne heute zu lernen!', keepStreak: 'Lerne jeden Tag weiter.',
  consecutiveDay: 'Tag in Folge', consecutiveFewDays: 'Tage in Folge',
  learningEmpty: 'Wähle eine Lernsprache, um deinen Fortschritt zu sehen und mit dem Lernen zu beginnen.', openAll: 'Alle ansehen',
  settingsSaveError: 'Design und Sprache sind auf diesem Gerät angewendet. Das Konto konnte nicht aktualisiert werden; deine Eingaben bleiben im Formular. Versuche erneut zu speichern.',
  close: 'Schließen', germanCountry: 'Berlin, Deutschland', englishCountry: 'London, Großbritannien',
  studySyncSchema: 'Der Lernfortschritt bleibt auf diesem Gerät gespeichert. Für die Cloud-Synchronisierung muss die Datenbank eingerichtet werden.',
  firstName: 'Vorname', lastName: 'Nachname', resume: 'Weiterlernen', profileIntro: 'Lerne weiter. Neues Wissen eröffnet neue Möglichkeiten.',
  studyLanguages: 'Meine Sprachen', editLanguages: 'Sprachen ändern', languagePreferences: 'Sprachen und Sprachniveau',
  personalLevel: 'Selbsteinschätzung', levelUnspecified: 'Nicht angegeben', courseProgress: 'Kursfortschritt',
  personalHint: 'Wähle deine Sprachen und dein selbst eingeschätztes Niveau. Kursfortschritt und Testergebnisse bleiben unverändert.',
  noLanguages: 'Füge eine Sprache hinzu, die du lernst. Sie erscheint dann in deinem Profil.',
  photo: 'Profilfoto', uploadPhoto: 'Foto hochladen', replacePhoto: 'Foto ersetzen', deletePhoto: 'Foto entfernen',
  photoHint: 'JPEG, PNG oder WebP, bis 3 MB. Das Foto ist nur in deinem Konto sichtbar.',
  photoFormat: 'Wähle eine gültige JPEG-, PNG- oder WebP-Datei.', photoSize: 'Das Foto darf höchstens 3 MB groß sein.',
  photoError: 'Foto konnte nicht geladen werden. Prüfe die Verbindung und versuche es erneut.',
  photoStorage: 'Der Fotospeicher ist noch nicht eingerichtet. Der Websitebetreiber muss Supabase Storage einrichten.',
  photoPermission: 'Kein Zugriff auf den Fotospeicher. Die Zugriffsrechte in Supabase Storage müssen überprüft werden.',
  syncShort: 'Synchronisierung fehlgeschlagen. Deine Daten bleiben auf diesem Gerät gespeichert.',
  syncSchema: 'Der Websitebetreiber muss den Cloud-Speicher noch einrichten. Deine Daten bleiben auf dem Gerät.',
  syncPermission: 'Synchronisierung nicht verfügbar: Supabase-Zugriffsrechte müssen überprüft werden.',
  syncSession: 'Melde dich für die Synchronisierung erneut an. Lokale Daten bleiben erhalten.',
  login: 'Anmelden', register: 'Registrieren', create: 'Konto erstellen', authTitle: 'Erstelle dein LINAD-Konto', authIntro: 'Speichere Lernfortschritt, Wörter und bevorzugte Lehrkräfte auf deinen Geräten.', name: 'Name', email: 'E-Mail', password: 'Passwort', passwordHint: 'Mindestens 8 Zeichen', confirmPassword: 'Passwort wiederholen', forgot: 'Passwort vergessen?', reset: 'Passwort zurücksetzen', resetSend: 'Link senden', newPassword: 'Neues Passwort', changePassword: 'Passwort ändern', confirmEmail: 'Bitte bestätige deine E-Mail über den Supabase-Link und melde dich danach an.', resetSent: 'Falls ein Konto mit dieser E-Mail existiert, erhältst du einen Link zum Zurücksetzen.', callbackError: 'Der Link ist ungültig oder abgelaufen. Öffne ihn im Browser der Anfrage oder fordere einen neuen an.', loading: 'Wird geladen…', saving: 'Wird gespeichert…', saved: 'Änderungen gespeichert.', logout: 'Abmelden', guest: 'Ohne Konto fortfahren', overview: 'Mein Profil', learning: 'Mein Lernen', words: 'Meine Wörter', favorites: 'Lieblingslehrkräfte', settings: 'Einstellungen', greeting: 'Hallo', cabinet: 'Dein persönlicher LINAD-Bereich', lessons: 'Abgeschlossene Lektionen', savedWords: 'Gespeicherte Wörter', tests: 'Abgeschlossene Tests', continue: 'Weiterlernen', activity: 'Letzte Aktivität', noActivity: 'Noch keine Lernaktivität. Wähle eine Sprache und ein Niveau.', german: 'Deutsch', english: 'Englisch', all: 'Alle', level: 'Niveau', modules: 'Module', open: 'Öffnen', noResults: 'Noch keine gespeicherten Testergebnisse.', results: 'Testergebnisse', score: 'richtige Antworten', readyOnly: 'Nur bearbeitete Aufgaben zählen zum Fortschritt. Unveröffentlichte Lektionen gelten nicht als abgeschlossen.', search: 'Wort oder Übersetzung suchen', noWords: 'Noch keine Wörter gespeichert. Speichere Wörter und Ausdrücke in Practice oder im Wortschatz einer Lektion.', noMatches: 'Keine Ergebnisse.', remove: 'Entfernen', saveWord: 'Wort speichern', wordSaved: 'Wort gespeichert', addFavorite: 'Lehrkraft speichern', removeFavorite: 'Aus Favoriten entfernen', noFavorites: 'Noch keine Lieblingslehrkräfte.', tutors: 'Alle Lehrkräfte', details: 'Mehr erfahren', perHour: '60 Minuten', listen: 'Anhören', stop: 'Stoppen', profile: 'Profil', save: 'Speichern', uiLanguage: 'Sprache der Oberfläche', theme: 'Design', light: 'Hell', dark: 'Dunkel', emailManaged: 'Die Konto-E-Mail wird für Anmeldung und Passwortwiederherstellung verwendet.', cloud: 'Daten synchronisiert', syncing: 'Synchronisierung…', syncError: 'Cloud-Speicherung nicht verfügbar. Änderungen bleiben im lokalen Cache dieses Kontos. Prüfe Verbindung und Datenbankeinrichtung.', retry: 'Erneut versuchen', configError: 'Supabase ist nicht eingerichtet. Setze die Umgebungsvariablen und starte den Build neu.', importTitle: 'Gastfortschritt übernehmen?', importBody: 'Auf diesem Gerät sind Gastdaten vorhanden. Mit diesem Konto zusammenführen? Verlauf und Cloud-Fortschritt bleiben erhalten. Die Gastdaten bleiben auf dem Gerät.', importAction: 'Daten zusammenführen', later: 'Später', imported: 'Gastdaten zusammengeführt. Warte auf die Synchronisierung.', importOpen: 'Daten dieses Geräts übernehmen', error: 'Anfrage fehlgeschlagen. Prüfe die Verbindung und versuche es erneut.', credentials: 'E-Mail oder Passwort falsch.', unconfirmed: 'Bestätige zuerst deine E-Mail über den Link in der Nachricht.', exists: 'Das Konto existiert bereits. Melde dich an oder setze das Passwort zurück.', rateLimit: 'Zu viele Anfragen. Warte bitte und versuche es erneut.', mismatch: 'Die Passwörter stimmen nicht überein.', weak: 'Das Passwort ist zu kurz oder erfüllt die Supabase-Anforderungen nicht.', required: 'Bitte fülle alle Pflichtfelder korrekt aus.', sessionMissing: 'Öffne einen Wiederherstellungslink oder melde dich an, um dein Passwort zu ändern.', localError: 'Der Browser erlaubt keine Datenspeicherung. Aktiviere den Speicher und versuche es erneut.', lesson: 'Lektion', practice: 'Übung', miniTest: 'Mini-Test', moduleTest: 'Modultest', placement: 'Einstufungstest', back: 'Zurück', security: 'Kontodaten sind nur nach der Anmeldung zugänglich. Lernen als Gast bleibt möglich.',
};
const en: Copy = {
  addStudyLanguage: 'Add a language to study', addStudyHint: 'Choose a language and your level, then start learning.',
  editLanguage: 'Edit language or level', studyLanguage: 'Language', chooseLanguage: 'Choose a language', chooseLevel: 'Choose a level',
  quote: 'New languages bring new opportunities', profileTagline: 'Learn languages. Discover opportunities.',
  goal: 'Goal', noGoal: 'Not chosen', setGoal: 'Set a goal', editGoal: 'Edit goal', removeGoal: 'Remove goal', targetLevel: 'Target level',
  goalHint: 'Choose the language and level you want to reach. Your goal does not change learning results.',
  studying: 'Learning streak', consecutiveDays: 'days in a row', startToday: 'Start learning today!', keepStreak: 'Keep learning every day.',
  consecutiveDay: 'day in a row', consecutiveFewDays: 'days in a row',
  learningEmpty: 'Choose a language to see your progress and start learning.', openAll: 'View all',
  settingsSaveError: 'Theme and language are applied on this device. Your account could not be updated; your entries remain in the form. Try saving again.',
  close: 'Close', germanCountry: 'Berlin, Germany', englishCountry: 'London, United Kingdom',
  studySyncSchema: 'Learning progress is saved on this device. Cloud progress sync requires database setup.',
  firstName: 'First name', lastName: 'Last name', resume: 'Continue', profileIntro: 'Keep learning. New knowledge brings new opportunities.',
  studyLanguages: 'My languages', editLanguages: 'Edit languages', languagePreferences: 'Languages and proficiency',
  personalLevel: 'Self-assessed level', levelUnspecified: 'Not specified', courseProgress: 'Course progress',
  personalHint: 'Choose your languages and self-assessed levels. These settings do not change course progress or test results.',
  noLanguages: 'Add a language you study to display it in your profile.',
  photo: 'Profile photo', uploadPhoto: 'Upload photo', replacePhoto: 'Replace photo', deletePhoto: 'Remove photo',
  photoHint: 'JPEG, PNG or WebP, up to 3 MB. Your photo is only visible in your account.',
  photoFormat: 'Choose a valid JPEG, PNG or WebP image.', photoSize: 'Your photo must be 3 MB or smaller.',
  photoError: 'Could not load your photo. Check your connection and try again.',
  photoStorage: 'Photo storage is not set up yet. The site owner needs to finish setting up Supabase Storage.',
  photoPermission: 'Photo storage access was denied. Supabase Storage access permissions need to be checked.',
  syncShort: 'Could not sync. Your data is saved on this device.',
  syncSchema: 'Cloud storage still needs to be set up by the site owner. Your data is saved on this device.',
  syncPermission: 'Sync is unavailable: Supabase access permissions need to be checked.',
  syncSession: 'Sign in again to sync. Your local data is saved.',
  login: 'Sign in', register: 'Register', create: 'Create account', authTitle: 'Create your LINAD account', authIntro: 'Keep your progress, saved words and favourite tutors across your devices.', name: 'Name', email: 'Email', password: 'Password', passwordHint: 'At least 8 characters', confirmPassword: 'Confirm password', forgot: 'Forgot password?', reset: 'Reset password', resetSend: 'Send reset link', newPassword: 'New password', changePassword: 'Change password', confirmEmail: 'Check your inbox and confirm your email using the Supabase link. Then sign in.', resetSent: 'If an account exists with this email, a password reset link will be sent.', callbackError: 'This link is invalid or expired. Open it in the browser where you requested it, or request a new one.', loading: 'Loading…', saving: 'Saving…', saved: 'Changes saved.', logout: 'Sign out', guest: 'Continue without an account', overview: 'My profile', learning: 'My learning', words: 'My words', favorites: 'Favourite tutors', settings: 'Settings', greeting: 'Hello', cabinet: 'Your personal LINAD space', lessons: 'Completed lessons', savedWords: 'Saved words', tests: 'Completed tests', continue: 'Continue learning', activity: 'Recent activity', noActivity: 'No learning activity yet. Choose a language and a level to start.', german: 'German', english: 'English', all: 'All', level: 'Level', modules: 'Modules', open: 'Open', noResults: 'No saved test results yet.', results: 'Test results', score: 'correct answers', readyOnly: 'Only completed tasks count towards progress. Unpublished lessons are not counted as completed.', search: 'Search words or translations', noWords: 'No saved words yet. Save words and phrases in Practice or in a lesson’s vocabulary section.', noMatches: 'Nothing found.', remove: 'Remove', saveWord: 'Save word', wordSaved: 'Word saved', addFavorite: 'Save tutor', removeFavorite: 'Remove from favourites', noFavorites: 'No favourite tutors yet.', tutors: 'All tutors', details: 'View profile', perHour: '60 minutes', listen: 'Listen', stop: 'Stop', profile: 'Profile', save: 'Save', uiLanguage: 'Interface language', theme: 'Theme', light: 'Light', dark: 'Dark', emailManaged: 'Your account email is used for sign-in and password recovery.', cloud: 'Data synchronised', syncing: 'Synchronising…', syncError: 'Cloud saving is unavailable. Changes remain in this account’s cache on this device. Check the connection and database setup.', retry: 'Retry', configError: 'Supabase is not configured. Set the environment variables and restart the build.', importTitle: 'Import guest progress?', importBody: 'This device has data saved without an account. Merge it into this account? History and cloud progress will be kept. Guest records will remain on the device.', importAction: 'Merge data', later: 'Later', imported: 'Guest data merged. Wait for synchronisation.', importOpen: 'Import data from this device', error: 'The request failed. Check your connection and try again.', credentials: 'Incorrect email or password.', unconfirmed: 'Confirm your email using the link in your inbox first.', exists: 'This account already exists. Try signing in or resetting your password.', rateLimit: 'Too many requests. Please wait and try again.', mismatch: 'The passwords do not match.', weak: 'The password is too short or does not meet the Supabase requirements.', required: 'Please complete the required fields correctly.', sessionMissing: 'Open a recovery link or sign in to change your password.', localError: 'Your browser is blocking data storage. Enable storage and try again.', lesson: 'Lesson', practice: 'Practice', miniTest: 'Mini-test', moduleTest: 'Module test', placement: 'Placement test', back: 'Back', security: 'Account data is accessible only after sign-in. Guest learning remains available.',
};
export const accountCopy = (language: UiLanguage): Copy => ({ ru, de, en })[language];
export function streakDays(count: number, language: UiLanguage) {
  const c = accountCopy(language); const plural = new Intl.PluralRules(language).select(count);
  return plural === 'one' ? c.consecutiveDay : plural === 'few' ? c.consecutiveFewDays : c.consecutiveDays;
}
export function accountError(error: unknown, c: Copy) {
  const issue = error as { code?: string; status?: number; message?: string };
  const code = issue?.code ?? ''; const message = issue?.message ?? '';
  if (code === 'avatar_format') return c.photoFormat;
  if (code === 'avatar_size') return c.photoSize;
  if (code === 'avatar_storage') return c.photoStorage;
  if (code === 'avatar_permission') return c.photoPermission;
  if (['PGRST205', 'PGRST202', 'PGRST204', '42P01', '42703'].includes(code)) return c.syncSchema;
  if (code === 'invalid_credentials' || /invalid login credentials/i.test(message)) return c.credentials;
  if (code === 'email_not_confirmed' || /email not confirmed/i.test(message)) return c.unconfirmed;
  if (code === 'user_already_exists') return c.exists;
  if (code === 'weak_password' || /password.*(least|short|weak)/i.test(message)) return c.weak;
  if (issue?.status === 429 || code.includes('rate_limit')) return c.rateLimit;
  return c.error;
}
