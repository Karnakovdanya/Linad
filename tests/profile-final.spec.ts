import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { mockSupabase, uuid, host } from './account-helpers';
import { approvedLinSources } from './protected-source';
import { accountCopy, streakDays } from '../src/account/copy';
import { activityTimes, knownActivity, studyStreak } from '../src/account/activity';
import { emptyDocument, mergeDocuments, parseDocument } from '../src/account/document';

mkdirSync('qa/profile-final', { recursive: true });
const baseProfile = () => ({ first_name: 'Daniil', last_name: 'Karnakov', display_name: 'Daniil Karnakov', avatar_path: null, study_languages: [] as { language: 'de' | 'en'; level: 'A1' | 'B1' | 'B2' }[], study_goal: null, ui_language: null, theme: null });

test('streak uses real calendar days, handles DST, duplicates and missed days; history merges without changing courses', () => {
  const now = new Date('2026-10-26T12:00:00Z'); const dates = ['2026-10-24T12:00:00Z', '2026-10-25T12:00:00Z', '2026-10-26T10:00:00Z', '2026-10-26T11:00:00Z'];
  expect(studyStreak(dates, now, 'Europe/Zurich')).toBe(3);
  expect(studyStreak(dates.slice(0, 2), now, 'Europe/Zurich')).toBe(2);
  expect(studyStreak([dates[0]!], now, 'Europe/Zurich')).toBe(0);
  expect(studyStreak(['bad date', '2099-01-01'], now, 'Europe/Zurich')).toBe(0);
  expect(studyStreak(['2026-10-25T23:30:00Z'], now, 'Europe/Zurich')).toBe(1);
  expect([1, 2, 5].map(count => streakDays(count, 'ru'))).toEqual(['день подряд', 'дня подряд', 'дней подряд']);
  expect(streakDays(1, 'de')).toBe('Tag in Folge'); expect(streakDays(1, 'en')).toBe('day in a row');
  const a = emptyDocument(); const b = emptyDocument(); a.studyActivity = dates.slice(0, 2); b.studyActivity = dates.slice(2);
  expect(mergeDocuments(a, b).studyActivity).toEqual(activityTimes(dates)); expect(mergeDocuments(a, b).levels.selectedLevels).toEqual(a.levels.selectedLevels);
  const legacy = { ...a, studyActivity: undefined }; expect(parseDocument(legacy).studyActivity).toEqual([]);
  const history = emptyDocument(); history.levels.activity.de = { at: dates[0]!, kind: 'lesson' };
  expect(knownActivity(history.levels)).toEqual([dates[0]]);
});

test('Save applies theme/interface immediately, waits for the server before success and retains names after a failed save', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.profiles.set(uuid, baseProfile());
  await page.goto('/#/profile/settings'); await expect(page.locator('.account-study-editor')).toHaveCount(0);
  await expect(page.getByLabel('Last name', { exact: true })).toHaveValue('Karnakov');
  await page.getByLabel('First name', { exact: true }).fill('Saved'); await page.getByLabel('Last name', { exact: true }).fill('Learner');
  await page.locator('select[name=ui]').selectOption('de'); await page.locator('select[name=theme]').selectOption('dark');
  let release!: () => void; const response = new Promise<void>(resolve => { release = resolve; });
  await page.route(`${host}/rest/v1/profiles**`, async route => { if (route.request().method() === 'POST') await response; await route.fallback(); });
  await page.locator('.account-settings button[type=submit]').click(); await expect(page.locator('html')).toHaveAttribute('lang', 'de'); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.account-settings [role=status]')).toHaveCount(0); await expect(page.locator('.account-settings button[type=submit]')).toBeDisabled(); release();
  await expect(page.locator('.account-settings [role=status]')).toContainText('Änderungen gespeichert');
  await page.reload(); await expect(page.locator('input[name=last_name]')).toHaveValue('Learner'); await expect(page.locator('select[name=ui]')).toHaveValue('de'); await expect(page.locator('select[name=theme]')).toHaveValue('dark');
  backend.controls.profileError = true; await page.locator('input[name=last_name]').fill('Unsaved input'); await page.locator('.account-settings button[type=submit]').click();
  await expect(page.getByRole('alert')).toContainText('Konto konnte nicht aktualisiert'); await expect(page.locator('input[name=last_name]')).toHaveValue('Unsaved input');
  await expect(page.locator('.account-settings [role=status]')).toHaveCount(0);
});

test('real Auth persistence path works without profile SQL, restores on another device, then migrates to SQL without overwriting preferences', async ({ page, browser }) => {
  const backend = await mockSupabase(page, { signedIn: true, schemaMissing: true }); backend.controls.profileMissing = true;
  await page.goto('/#/profile/settings'); await page.locator('input[name=last_name]').fill('Account surname'); await page.locator('.account-settings button[type=submit]').click();
  await expect(page.locator('.account-settings [role=status]')).toContainText('Changes saved');
  expect(backend.calls.some(call => call.path.includes('/auth/v1/user') && typeof call.body.data === 'object' && call.body.data !== null && 'linad_profile' in call.body.data)).toBe(true);
  await page.goto('/#/profile'); await page.getByRole('button', { name: /Add a language to study/ }).click();
  let dialog = page.getByRole('dialog'); await dialog.getByRole('checkbox', { name: 'English', exact: true }).check();
  await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Self-assessed level · English', exact: true }).selectOption('B2');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.locator('.account-personal-language')).toHaveCount(1); await expect(page.locator('.account-course-card')).toHaveCount(1); await expect(page.locator('.account-course-card img')).toHaveAttribute('src', /study-english.png$/);
  await page.getByRole('button', { name: 'Set a goal →', exact: true }).click(); dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox', { name: 'Language', exact: true }).selectOption('en'); await dialog.getByRole('combobox', { name: 'Target level', exact: true }).selectOption('C1'); await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.locator('.account-goal-level')).toHaveText('C1'); await expect(page.locator('.account-goal-language')).toHaveText('English'); await expect(page.getByTestId('study-streak')).toHaveText('0');
  const context = await browser.newContext(); const device = await context.newPage(); const remote = await mockSupabase(device, { signedIn: true, schemaMissing: true }); remote.controls.profileMissing = true;
  remote.users.set(uuid, structuredClone(backend.users.get(uuid)!));
  await device.goto('/#/profile'); await expect(device.getByRole('heading', { name: 'Hello, Learner Account surname!' })).toBeVisible(); await expect(device.locator('.account-personal-language')).toContainText('B2'); await expect(device.locator('.account-goal-level')).toHaveText('C1'); await expect(device.locator('.account-goal-language')).toHaveText('English'); await context.close();
  backend.controls.profileMissing = false; backend.controls.schemaMissing = false;
  await page.getByRole('button', { name: 'Retry', exact: true }).click(); await expect.poll(() => backend.profiles.get(uuid)).toMatchObject({ study_languages: [{ language: 'en', level: 'B2' }], study_goal: { language: 'en', level: 'C1' } });
  await expect(page.locator('.account-sync-notice')).toHaveCount(0); await expect.poll(() => backend.cloud.get(uuid)?.data.levels.selectedLevels.en).toBe('A1');
  await page.reload(); await expect(page.locator('.account-personal-language')).toHaveCount(1); await expect(page.locator('.account-goal-level')).toHaveText('C1'); await expect(page.locator('.account-goal-language')).toHaveText('English');
});

test('languages can be added, edited and removed; a goal can be changed or cleared without modifying course levels', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.profiles.set(uuid, baseProfile());
  await page.goto('/#/profile'); await expect(page.locator('.account-profile-learning-empty')).toBeVisible();
  const add = page.getByRole('button', { name: /Add a language to study/ }); await expect(add).toHaveCount(1);
  await add.click(); let dialog = page.getByRole('dialog');
  for (const [language, level] of [['German', 'B1'], ['English', 'B2']]) { await dialog.getByRole('checkbox', { name: language, exact: true }).check(); await dialog.getByRole('combobox', { name: `Self-assessed level · ${language}`, exact: true }).selectOption(level); }
  await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(add).toHaveCount(0); await expect(page.locator('.account-personal-language')).toHaveCount(2); await expect(page.locator('.account-course-card')).toHaveCount(2);
  await expect(page.locator('.account-course-card .account-progress span')).toHaveText(['0%', '0%']); await expect(page.locator('.account-course-card').first()).toContainText('A1');
  await page.locator('.account-language-edit').first().click(); dialog = page.getByRole('dialog'); await dialog.getByRole('checkbox', { name: 'German', exact: true }).uncheck(); await dialog.getByRole('combobox', { name: 'Self-assessed level · English', exact: true }).selectOption('C1'); await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.locator('.account-personal-language')).toHaveCount(1); await expect(page.locator('.account-personal-language')).toContainText('English'); await expect(add).toHaveCount(1);
  await page.getByRole('button', { name: 'Set a goal →', exact: true }).click(); dialog = page.getByRole('dialog'); await dialog.getByRole('combobox', { name: 'Language', exact: true }).selectOption('en'); await dialog.getByRole('combobox', { name: 'Target level', exact: true }).selectOption('C1'); await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await page.getByRole('button', { name: 'Edit goal →', exact: true }).click(); await page.getByRole('dialog').getByRole('button', { name: 'Remove goal', exact: true }).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.locator('.account-summary-goal')).toContainText('Not chosen');
  await page.locator('.account-language-edit').click(); dialog = page.getByRole('dialog'); await dialog.getByRole('checkbox', { name: 'English', exact: true }).uncheck(); await dialog.getByRole('button', { name: 'Save', exact: true }).click(); await expect(dialog).toHaveCount(0); await expect(page.locator('.account-personal-language')).toHaveCount(0); await expect(page.locator('.account-course-card')).toHaveCount(0);
  expect(backend.cloud.get(uuid)!.data.levels.selectedLevels).toEqual({ de: 'A1', en: 'A1' });
});

test('a failed Auth save cannot produce success, keeps input and prevents repeated clicks', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true, schemaMissing: true }); backend.controls.profileMissing = true; backend.controls.authUpdateError = true;
  await page.goto('/#/profile/settings'); await page.locator('input[name=last_name]').fill('Pending name');
  await page.locator('.account-settings button[type=submit]').dblclick(); await expect(page.getByRole('alert')).toBeVisible(); await expect(page.locator('.account-settings [role=status]')).toHaveCount(0); await expect(page.locator('input[name=last_name]')).toHaveValue('Pending name');
  expect(backend.calls.filter(call => call.path.includes('/auth/v1/user') && call.body.data).length).toBe(1);
  backend.controls.authUpdateError = false; await page.locator('.account-settings button[type=submit]').click(); await expect(page.locator('.account-settings [role=status]')).toContainText('Changes saved');
});

test('profile views do not create study days; real course activity adds to a durable journal', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.profiles.set(uuid, baseProfile());
  const doc = emptyDocument(); doc.studyActivity = [new Date(Date.now() - 2000).toISOString(), new Date(Date.now() - 86402000).toISOString()]; backend.cloud.set(uuid, { revision: 1, data: doc });
  await page.goto('/#/profile'); await expect(page.getByTestId('study-streak')).toHaveText('2');
  await page.goto('/#/profile/settings'); await page.locator('.account-settings button[type=submit]').click(); await expect(page.locator('.account-settings [role=status]')).toBeVisible();
  expect(backend.cloud.get(uuid)!.data.studyActivity).toHaveLength(2);
  await page.goto('/#/learn/levels/lessons/A1/introductions/first-introductions'); await expect(page.locator('#page-heading')).toBeVisible();
  await expect.poll(async () => page.evaluate(uuid => JSON.parse(localStorage.getItem(`linad.account.${uuid}.linad.study-activity.v1`) ?? '[]').length, uuid)).toBeGreaterThan(2);
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`approved empty/one/two-language layouts ${language}/${theme}, no horizontal overflow`, async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true, language, theme }); const c = accountCopy(language);
  const states = [[], [{ language: 'de', level: 'B1' }], [{ language: 'en', level: 'B2' }], [{ language: 'de', level: 'B1' }, { language: 'en', level: 'B2' }]] as const;
  for (const width of [1440, 820, 390, 320]) for (let index = 0; index < states.length; index++) {
    const state = states[index]!; backend.profiles.set(uuid, { ...baseProfile(), study_languages: state });
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/#/profile'); await page.reload(); await expect(page.locator('.account-personal-language')).toHaveCount(state.length); await expect(page.locator('.account-course-card')).toHaveCount(state.length);
    await expect(page.getByRole('button', { name: new RegExp(c.addStudyLanguage) })).toHaveCount(state.length < 2 ? 1 : 0); await expect(page.getByTestId('study-streak')).toHaveText('0');
    const bounds = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, nodes: [...document.querySelectorAll('.account-content *')].filter(el => el.getBoundingClientRect().right > innerWidth).map(el => el.className).slice(0, 10) }));
    expect(bounds.width <= bounds.viewport, JSON.stringify({ ...bounds, state: index })).toBe(true);
    if (language === 'ru' && [0, 3].includes(index)) await page.screenshot({ path: `qa/profile-final/${theme}-${width}-${index ? 'selected' : 'empty'}.png`, fullPage: true });
  }
  await page.getByRole('button', { name: new RegExp(c.editLanguage) }).first().click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Header/Footer, global styles, course logic, Home and Tutors are unchanged in this task', () => {
  const before: Record<string, string> = approvedLinSources(JSON.parse(readFileSync('qa/profile-final/before.json', 'utf8'))); const changed: Record<string, { before: string; after: string }> = {};
  const allowed = new Set(['src/account/Account.tsx','src/account/AuthProvider.tsx','src/account/copy.ts','src/account/document.ts','src/account/profile.ts','src/account/StudyLanguages.tsx','src/styles/account.css','src/account/Avatar.tsx','src/account/avatar-storage.ts','src/account/ProfileOverview.tsx']);
  for (const [path, hash] of Object.entries(before)) { const current = createHash('sha256').update(readFileSync(path)).digest('hex'); if (hash !== current) { expect(allowed.has(path), path).toBe(true); changed[path] = { before: hash, after: current }; } }
  writeFileSync('qa/profile-final/protected-audit.json', JSON.stringify(changed, null, 2));
});
