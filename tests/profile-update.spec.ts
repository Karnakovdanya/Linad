import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { mockSupabase, uuid } from './account-helpers';
import { emptyDocument } from '../src/account/document';
import { practiceWord } from '../src/account/collection';
import { normalizeProfile, syncIssue } from '../src/account/profile';
import { accountCopy } from '../src/account/copy';
import { approvedLinSources } from './protected-source';

mkdirSync('qa/profile-update', { recursive: true });
const profile = () => ({ display_name: 'Daniil Karnakov', first_name: 'Daniil', last_name: 'Karnakov', avatar_path: null, study_languages: [{ language: 'de', level: 'B2' }, { language: 'en', level: 'B1' }], ui_language: null, theme: null });
function wordsDocument() {
  const doc = emptyDocument();
  const word = practiceWord({ id: 'test-head', kind: 'word', categoryId: 'doctor', situationId: 'symptoms', text: { ru: 'голова', de: 'der Kopf', en: 'head' }, savedAt: '2026-10-20T12:00:00.000Z' });
  doc.collection.words[word.id] = word; return doc;
}

test('legacy names remain intact; profile levels and avatar paths are validated without course defaults', () => {
  const user = { id: uuid, user_metadata: { full_name: 'Old single name' } };
  expect(normalizeProfile(null, user)).toMatchObject({ first_name: 'Old single name', last_name: '', display_name: 'Old single name', study_languages: [], avatar_path: null });
  expect(normalizeProfile({ ...profile(), avatar_path: 'another-user/photo.png', study_languages: [{ language: 'en', level: 'C7' }, { language: 'ru', level: 'B1' }] }, user)).toMatchObject({ study_languages: [{ language: 'en', level: null }], avatar_path: null });
  expect(syncIssue({ code: 'PGRST205' })).toBe('schema'); expect(syncIssue({ code: '42501' })).toBe('permission'); expect(syncIssue({ status: 401 })).toBe('session'); expect(syncIssue(new TypeError())).toBe('network');
});

test('profile SQL retains data, validates declarations, restricts private avatar storage and limits image types/size', () => {
  const sql = readFileSync('supabase/migrations/202610210001_profile_details.sql', 'utf8');
  expect(sql).toContain('add column if not exists first_name'); expect(sql).toContain('add column if not exists last_name');
  expect(sql).toContain('linad_valid_study_languages(study_languages)'); expect(sql).toContain("lang = any(seen)");
  expect(sql).toContain("values('linad-avatars','linad-avatars',false,3145728");
  expect(sql).toContain("array['image/jpeg','image/png','image/webp']");
  expect(sql).toContain('for all to authenticated'); expect(sql).toContain('(storage.foldername(name))[1] = (select auth.uid())::text');
  expect(sql).not.toMatch(/delete from|drop table|truncate|service_role/i);
});

test('names and personal language choices persist on a second device without changing course state', async ({ page, browser }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.profiles.set(uuid, profile());
  await page.goto('/#/profile/settings'); await expect(page.getByLabel('First name', { exact: true })).toHaveValue('Daniil');
  await expect.poll(() => backend.cloud.get(uuid)?.revision).toBeGreaterThan(0);
  const before = structuredClone(backend.cloud.get(uuid)!.data.levels);
  await page.getByLabel('First name', { exact: true }).fill('Danya'); await page.getByLabel('Last name', { exact: true }).fill('Karnakov');
  await page.locator('.account-settings button[type=submit]').click(); await expect(page.locator('.account-settings [role=status]')).toContainText('Changes saved');
  await page.goto('/#/profile'); await page.locator('.account-language-edit').first().click();
  const editor = page.locator('.account-study-editor');
  const otherDevicePhoto = `${uuid}/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.png`;
  backend.profiles.set(uuid, { ...backend.profiles.get(uuid), avatar_path: otherDevicePhoto });
  await editor.getByRole('checkbox', { name: 'German', exact: true }).uncheck();
  await editor.getByRole('combobox', { name: 'Self-assessed level · English', exact: true }).selectOption('C1');
  await editor.getByRole('button', { name: 'Save', exact: true }).click();
  await expect.poll(() => backend.profiles.get(uuid)).toMatchObject({ first_name: 'Danya', last_name: 'Karnakov', avatar_path: otherDevicePhoto, study_languages: [{ language: 'en', level: 'C1' }] });
  await page.goto('/#/profile'); await expect(page.getByRole('heading', { name: 'Hello, Danya Karnakov!' })).toBeVisible();
  await expect(page.locator('.account-personal-language')).toHaveCount(1); await expect(page.locator('.account-personal-language')).toContainText('English');
  await expect(page.locator('.account-personal-language')).toContainText('Self-assessed level');
  expect(backend.cloud.get(uuid)!.data.levels).toEqual(before);
  const context = await browser.newContext(); const device = await context.newPage(); const remote = await mockSupabase(device, { signedIn: true }); remote.profiles.set(uuid, structuredClone(backend.profiles.get(uuid)!));
  await device.goto('/#/profile'); await expect(device.getByRole('heading', { name: 'Hello, Danya Karnakov!' })).toBeVisible(); await expect(device.locator('.account-personal-language')).toHaveCount(1);
  await context.close();
});

test('word visibility reuses Practice settings, never reaches zero and searches hidden translations', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.cloud.set(uuid, { revision: 1, data: wordsDocument() });
  await page.goto('/#/profile/words'); await expect(page.locator('.account-word')).toHaveCount(1);
  const group = page.locator('.practice-language-options'); const buttons = group.getByRole('button'); await expect(buttons).toHaveCount(3);
  await buttons.nth(1).click(); await buttons.nth(2).click(); await expect(page.locator('.account-word [lang=de]')).toHaveCount(0); await expect(page.locator('.account-word [lang=en]')).toHaveCount(0);
  await buttons.nth(0).click(); await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
  const search = page.getByRole('searchbox'); await search.click(); await expect(search).toHaveCSS('outline-style', 'none'); await search.fill('head');
  await expect(page.locator('.account-word')).toHaveCount(1); await expect(page.locator('.account-word [lang=ru]')).toHaveText('голова');
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await expect(search).toBeFocused(); await expect(search).toHaveCSS('outline-style', 'solid');
  await expect.poll(() => backend.cloud.get(uuid)?.data.practice.visibleLanguages).toEqual(['ru']);
  await page.goto('/#/learn/de/situations/doctor/describe-symptoms'); await expect(page.locator('.practice-language-options button[aria-pressed=true]')).toHaveCount(1);
  await expect(page.locator('.practice-language-options button').first()).toHaveAttribute('aria-pressed', 'true');
});

test('retry repairs sync after schema installation without losing the account cache; healthy sync has no technical strip', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true, schemaMissing: true });
  await page.addInitScript(({ uuid, document }) => {
    localStorage.setItem(`linad.account.${uuid}.linad.collection.v1`, JSON.stringify(document.collection));
  }, { uuid, document: wordsDocument() });
  await page.goto('/#/profile/words'); await expect(page.locator('.account-sync-notice')).toContainText('Cloud progress sync requires database setup'); await expect(page.locator('.account-word')).toHaveCount(1);
  backend.controls.schemaMissing = false; await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect.poll(() => Object.keys(backend.cloud.get(uuid)?.data.collection.words ?? {}).length).toBe(1);
  await expect(page.locator('.account-sync-notice')).toHaveCount(0); await expect(page.locator('.account-sync')).toHaveCount(0); await page.reload(); await expect(page.locator('.account-word')).toHaveCount(1);
});

test('photo upload validates files, handles rejection, rolls back failed saves and supports replacement/deletion across devices', async ({ page, browser }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.profiles.set(uuid, profile());
  await page.goto('/#/profile/settings'); await expect(page.getByLabel('First name', { exact: true })).toHaveValue('Daniil');
  const fileInput = page.locator('input[type=file]');
  await fileInput.setInputFiles({ name: 'unsafe.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') }); await expect(page.getByRole('alert')).toContainText('valid JPEG');
  await fileInput.setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(3 * 1024 * 1024 + 1) }); await expect(page.getByRole('alert')).toContainText('3 MB');
  await fileInput.setInputFiles({ name: 'renamed.png', mimeType: 'image/png', buffer: Buffer.from('not an image') }); await expect(page.getByRole('alert')).toContainText('valid JPEG');
  const png = await page.locator('.account-avatar').screenshot();
  backend.controls.uploadError = true; await fileInput.setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: png }); await expect(page.getByRole('alert')).toContainText('Photo storage access was denied'); expect(backend.images.size).toBe(0);
  backend.controls.uploadError = false; backend.controls.profileError = true; await fileInput.setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: png });
  await expect(page.getByRole('alert')).toContainText('request failed'); await expect.poll(() => backend.images.size).toBe(0);
  backend.controls.profileError = false; await fileInput.setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: png });
  await expect.poll(() => backend.images.size).toBe(1); await expect(page.locator('.account-avatar img')).toBeVisible();
  const first = (backend.profiles.get(uuid) as { avatar_path: string }).avatar_path; expect(first).toMatch(new RegExp(`^${uuid}/[0-9a-f-]+.png$`));
  await fileInput.setInputFiles({ name: 'replacement.png', mimeType: 'image/png', buffer: png });
  await expect.poll(() => (backend.profiles.get(uuid) as { avatar_path: string }).avatar_path).not.toBe(first); await expect.poll(() => backend.images.size).toBe(1);
  const context = await browser.newContext(); const device = await context.newPage(); const remote = await mockSupabase(device, { signedIn: true }); remote.profiles.set(uuid, structuredClone(backend.profiles.get(uuid)!));
  await device.goto('/#/profile'); await expect(device.locator('.account-avatar img')).toBeVisible(); await context.close();
  await page.getByRole('button', { name: 'Remove photo', exact: true }).click(); await expect(page.locator('.account-avatar img')).toHaveCount(0); await expect.poll(() => backend.images.size).toBe(0);
  await page.reload(); await expect(page.locator('.account-avatar img')).toHaveCount(0);
  expect(backend.calls.filter(call => call.path.includes('/object/sign/')).length).toBeGreaterThan(0);
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`approved profile layout, real zero stats and matching Telegram cards ${language}/${theme}`, async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true, language, theme }); backend.profiles.set(uuid, profile()); const c = accountCopy(language);
  for (const width of [1440, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/#/profile');
    await expect(page.locator('.account-personal-language')).toHaveCount(2); await expect(page.locator('.account-avatar')).toHaveCSS('width', '88px');
    await expect(page.locator('.account-profile-stats strong')).toHaveText(['0', '0', '0']); await expect(page.locator('.account-activity')).toContainText(c.noActivity);
    await expect(page.locator('.account-profile-background')).toHaveAttribute('src', /assets\/account\/profile-lake.png$/);
    await expect(page.locator('.home-telegram [data-contact=projectTelegram]')).toHaveAttribute('href', 'https://t.me/lernendeutschzussamen');
    await expect(page.locator('.home-telegram [data-contact=authorTelegram]')).toHaveAttribute('href', 'https://t.me/linadkarnakov');
    await expect(page.locator('.account-sidebar a').first()).toHaveText(c.overview);
    const overflow = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, nodes: [...document.querySelectorAll('.account-content *')].filter(el => el.getBoundingClientRect().right > innerWidth).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent?.slice(0, 60) })).slice(0, 12) }));
    expect(overflow.width <= overflow.viewport, JSON.stringify(overflow)).toBe(true);
    if (language === 'ru') await page.screenshot({ path: `qa/profile-update/profile-${theme}-${width}.png`, fullPage: true });
    const profileCards = await page.locator('.home-telegram').innerHTML();
    await page.goto('/#/'); expect(await page.locator('.home-telegram').innerHTML()).toBe(profileCards);
    await page.goto('/#/profile/settings'); await expect(page.locator('.account-settings')).toBeVisible();
    const card = (await page.locator('.account-settings').boundingBox())!; const content = (await page.locator('.account-content').boundingBox())!;
    expect(Math.abs(card.width - content.width)).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('only profile files and exact shared-component extractions changed; Header/Footer, course logic, Tutors and global styles remain intact', () => {
  const before: Record<string, string> = approvedLinSources(JSON.parse(readFileSync('qa/profile-update/before.json', 'utf8')));
  const allowed = new Set(['src/account/Account.tsx', 'src/account/AuthPage.tsx', 'src/account/AuthProvider.tsx', 'src/account/auth-context.ts', 'src/account/copy.ts', 'src/styles/account.css', 'src/pages/HomePage.tsx', 'src/pages/learning/practice/PracticeWorkspace.tsx', 'src/account/document.ts', 'src/account/StudyLanguages.tsx', 'src/account/profile.ts']);
  const changed: Record<string, { before: string; after: string }> = {};
  for (const [path, hash] of Object.entries(before)) {
    const current = createHash('sha256').update(readFileSync(path)).digest('hex');
    if (current !== hash) { expect(allowed.has(path), path).toBe(true); changed[path] = { before: hash, after: current }; }
  }
  writeFileSync('qa/profile-update/protected-audit.json', JSON.stringify(changed, null, 2));
});
