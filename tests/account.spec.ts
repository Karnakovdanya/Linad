import { host, uuid, mockSupabase } from './account-helpers';
import type { AccountDocument } from '../src/account/document';
import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, sep } from 'node:path';
import { emptyDocument, mergeDocuments, parseDocument } from '../src/account/document';
import { defaultLevelsState } from '../src/pages/learning/levels/storage';
import { practiceWord } from '../src/account/collection';
import { lessonCatalog } from '../src/pages/learning/levels/data/lessons';
import { lessonStatus } from '../src/pages/learning/levels/progress';
import { commitCloud, moduleRecords } from '../src/account/sync';
import type { SupabaseClient } from '@supabase/supabase-js';
import { approvedReleaseSources } from './protected-source';

mkdirSync('qa/account', { recursive: true });
function guestDocument() {
  const doc = emptyDocument(); doc.levels.setupComplete.de = true; doc.levels.selectedLevels.de = 'B1';
  doc.levels.lessons['de:first-introductions'] = { visited: [0], attempts: [] };
  doc.practice.savedItems.push({ id: 'doctor.symptoms.word.head', kind: 'word', categoryId: 'doctor', situationId: 'symptoms', text: { ru: 'Голова', de: 'der Kopf', en: 'head' }, savedAt: '2026-10-20T10:00:00.000Z' });
  doc.updatedAt = '2026-10-20T10:00:00.000Z'; return parseDocument(doc);
}

test('merge preserves attempts, separate languages, completed runs and deletion tombstones; opening a lesson is not completion', () => {
  const a = guestDocument(); const b = emptyDocument(); b.updatedAt = '2026-10-20T11:00:00.000Z';
  b.levels.lessons['en:first-introductions'] = { visited: [0], attempts: [] };
  b.levels.lessons['de:first-introductions'] = { visited: [1], attempts: [] };
  const word = practiceWord(a.practice.savedItems[0]!); b.collection.words[word.id] = { ...word, deletedAt: b.updatedAt, updatedAt: b.updatedAt };
  b.collection.favorites['daniil-karnakov'] = { id: 'daniil-karnakov', updatedAt: b.updatedAt, deletedAt: null };
  const merged = mergeDocuments(a, b);
  expect(merged.practice.savedItems).toHaveLength(0); expect(merged.collection.words[word.id]!.deletedAt).toBe(b.updatedAt);
  expect(merged.levels.lessons['de:first-introductions']!.visited.sort()).toEqual([0, 1]); expect(merged.levels.lessons['en:first-introductions']).toBeDefined();
  expect(lessonStatus(lessonCatalog.de['first-introductions']!, merged.levels.lessons['de:first-introductions']).completed).toBe(false);
  expect(merged.levels.supportLanguage).toBe('ru'); expect(mergeDocuments(merged, a).practice.savedItems).toHaveLength(0);
  expect(moduleRecords(merged)['de:A1:introductions']).toMatchObject({ completedLessons: 0, completed: false, percent: 0 });
  expect(() => parseDocument({ ...merged, levels: { invalid: true } })).toThrow('invalid-account-data');
});

test('SQL protects every user table with auth.uid and uses an authenticated security-invoker CAS commit', () => {
  const sql = readFileSync('supabase/migrations/202610200001_linad_accounts.sql', 'utf8');
  for (const table of ['profiles', 'account_state', 'lesson_progress', 'module_progress', 'test_results', 'saved_words', 'favorite_tutors']) expect(sql).toContain(`public.${table}`);
  expect(sql).toContain('enable row level security'); expect(sql).toContain('with check ((select auth.uid()) = user_id)'); expect(sql).toContain('security invoker'); expect(sql).toContain('for update'); expect(sql).toContain("errcode='PT409'"); expect(sql).toContain('from public, anon');
});

test('concurrent cloud revision reloads and merges instead of overwriting another device', async () => {
  const remote = guestDocument(); const local = emptyDocument(); local.updatedAt = '2026-10-20T12:00:00.000Z';
  local.levels.lessons['en:first-introductions'] = { visited: [0], attempts: [] };
  const committed: AccountDocument[] = []; let count = 0;
  const client = {
    rpc: async (_name: string, values: { p_document: AccountDocument; p_expected_revision: number }) => {
      committed.push(values.p_document); count++;
      return count === 1 ? { data: null, error: { code: 'PT409' } } : { data: values.p_expected_revision + 1, error: null };
    },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { revision: 7, data: remote }, error: null }) }) }) }),
  } as unknown as SupabaseClient;
  const result = await commitCloud(client, uuid, local, 2);
  expect(result.revision).toBe(8); expect(committed).toHaveLength(2);
  expect(result.document.practice.savedItems).toHaveLength(1); expect(result.document.levels.lessons['en:first-introductions']).toBeDefined();
});

test('registration requires email confirmation; invalid credentials and recovery show honest messages', async ({ page }) => {
  const { calls } = await mockSupabase(page);
  await page.goto('/#/auth/register'); await expect(page.getByRole('heading', { name: 'Create account', exact: true })).toBeVisible();
  await page.getByLabel('First name', { exact: true }).fill('Learner'); await page.getByLabel('Last name', { exact: true }).fill('Test'); await page.getByLabel('Email', { exact: true }).fill('learner@example.test');
  await page.locator('input[name=password]').fill('new-password-123'); await page.getByLabel('Confirm password', { exact: true }).fill('new-password-123');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await expect(page.getByRole('status')).toContainText('confirm your email');
  expect(calls.find(call => call.path.includes('/signup'))?.body.data).toEqual({ first_name: 'Learner', last_name: 'Test', full_name: 'Learner Test' });
  await page.getByRole('link', { name: 'Sign in', exact: true }).last().click(); await page.getByLabel('Email', { exact: true }).fill('learner@example.test'); await page.locator('input[name=password]').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click(); await expect(page.getByRole('alert')).toContainText('Incorrect email');
  await page.getByRole('link', { name: 'Forgot password?' }).click(); await page.getByLabel('Email', { exact: true }).fill('learner@example.test'); await page.getByRole('button', { name: 'Send reset link' }).click(); await expect(page.getByRole('status')).toContainText('If an account exists');
  expect(calls.find(call => call.path.startsWith('/auth/v1/recover'))?.path).toContain(encodeURIComponent('http://127.0.0.1:4173/auth-callback.html?mode=recovery'));
});

test('guest import is explicit, cloud restores on a new device, logout keeps guest progress, and another user is isolated', async ({ page, browser }) => {
  const backend = await mockSupabase(page, { signedIn: true, guest: guestDocument() });
  await page.goto('/#/profile'); await expect(page.getByRole('heading', { name: 'Hello, Learner!' })).toBeVisible();
  await expect.poll(() => backend.cloud.get(uuid)?.data.practice.savedItems.length).toBe(0);
  await page.getByRole('button', { name: 'Merge data', exact: true }).click(); await expect.poll(() => backend.cloud.get(uuid)?.data.practice.savedItems.length).toBe(1);
  expect(backend.cloud.get(uuid)?.data.levels.selectedLevels.de).toBe('B1');
  await page.getByRole('link', { name: 'My words', exact: true }).click(); await expect(page.getByText('der Kopf', { exact: true })).toBeVisible();
  const context = await browser.newContext(); const device = await context.newPage(); const remote = await mockSupabase(device, { signedIn: true }); remote.cloud.set(uuid, structuredClone(backend.cloud.get(uuid)!));
  await device.goto('/#/profile/words'); await expect(device.getByText('der Kopf', { exact: true })).toBeVisible(); await context.close();
  await page.getByRole('link', { name: 'Settings', exact: true }).click(); await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/auth\/login/); expect(await page.evaluate(() => JSON.parse(localStorage.getItem('linad.levels.v1')!).selectedLevels.de)).toBe('B1');
  await page.getByLabel('Email', { exact: true }).fill('second@example.test'); await page.locator('input[name=password]').fill('password-123'); await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Second!' })).toBeVisible(); await page.getByRole('link', { name: 'My words', exact: true }).click(); await expect(page.getByText('No saved words yet.', { exact: false })).toBeVisible();
  expect(backend.cloud.get(uuid)?.data.practice.savedItems).toHaveLength(1);
});

test('lesson words and real tutor favourites save, delete and survive reload without fictional completed lessons', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true });
  await page.goto('/#/tutors'); await page.getByRole('button', { name: 'Save tutor', exact: true }).click();
  await page.goto('/#/profile/tutors'); await expect(page.getByRole('heading', { name: 'Daniil Karnakov', exact: true })).toBeVisible();
  await page.goto('/#/learn/levels/lessons/A1/introductions/first-introductions'); await page.getByRole('tab', { name: /Vocabulary/ }).click();
  await page.getByRole('button', { name: /Save word/ }).first().click();
  await page.goto('/#/profile/words'); await expect(page.locator('.account-word')).toHaveCount(1); await page.reload(); await expect(page.locator('.account-word')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remove', exact: true }).click(); await expect(page.locator('.account-word')).toHaveCount(0);
  await expect.poll(() => Object.values(backend.cloud.get(uuid)?.data.collection.words ?? {}).filter(word => !word.deletedAt).length).toBe(0);
  await page.goto('/#/profile'); await expect(page.locator('.account-stats strong').first()).toHaveText('0');
});

test('missing database never shows cloud success, failed profile save never reports success, and retry works', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true, schemaMissing: true });
  await page.goto('/#/profile'); await expect(page.getByRole('status')).toContainText('Cloud progress sync requires database setup'); await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect.poll(() => backend.calls.filter(call => call.path.includes('/account_state')).length).toBeGreaterThan(1);
  await expect(page.getByText('Data synchronised', { exact: true })).toHaveCount(0);
  await page.route(`${host}/rest/v1/profiles**`, async route => route.request().method() === 'POST' ? route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ code: '42501', message: 'RLS denied' }) }) : route.fallback());
  await page.goto('/#/profile/settings'); await page.getByLabel('First name', { exact: true }).fill('New Name'); await page.locator('.account-settings').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('request failed'); await expect(page.getByText('Changes saved.', { exact: true })).toHaveCount(0);
});

test('static callback exchanges PKCE code, removes it, and opens an authenticated password form; bad links show an error', async ({ page }) => {
  const backend = await mockSupabase(page);
  await page.addInitScript(() => localStorage.setItem('sb-agcvacclaebekvcblvod-auth-token-code-verifier', JSON.stringify('test-code-verifier')));
  await page.goto('/auth-callback.html?mode=recovery&code=test-confirmation-code');
  await expect(page).toHaveURL(/#\/auth\/update-password$/); await expect(page.getByRole('heading', { name: 'Change password', exact: true })).toBeVisible();
  expect(page.url()).not.toContain('test-confirmation-code');
  await page.locator('input[name=password]').fill('changed-password-123'); await page.getByLabel('Confirm password', { exact: true }).fill('changed-password-123');
  await page.getByRole('button', { name: 'Change password', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Changes saved.');
  expect(backend.calls.some(call => call.path.endsWith('/user') && call.body.password === 'changed-password-123')).toBe(true);
  expect(backend.calls.find(call => call.body.auth_code === 'test-confirmation-code')?.body.code_verifier).toBe('test-code-verifier');
  await page.goto('/auth-callback.html?error=access_denied&error_description=expired');
  // An already authenticated session can return to its profile even after an old link fails.
  await expect(page).toHaveURL(/#\/(profile|auth\/login\?callback=error)$/);
});

test('production build and confirmation callback work under a repository subpath without server rewrites', async ({ page }) => {
  const backend = await mockSupabase(page);
  await page.route('http://127.0.0.1:4173/pages-test/**', async route => {
    const relative = new URL(route.request().url()).pathname.slice('/pages-test/'.length) || 'index.html';
    const file = resolve('dist', relative); expect(file.startsWith(resolve('dist') + sep)).toBe(true);
    await route.fulfill({ path: file });
  });
  await page.goto('/pages-test/#/auth/register');
  await page.getByLabel('First name', { exact: true }).fill('Learner'); await page.getByLabel('Last name', { exact: true }).fill('Test'); await page.getByLabel('Email', { exact: true }).fill('learner@example.test');
  await page.locator('input[name=password]').fill('password-123'); await page.getByLabel('Confirm password', { exact: true }).fill('password-123');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await expect(page.getByRole('status')).toContainText('confirm your email');
  expect(backend.calls.find(call => call.path.includes('/signup'))?.path).toContain(encodeURIComponent('http://127.0.0.1:4173/pages-test/auth-callback.html?mode=confirm'));
  await page.goto('/pages-test/auth-callback.html?mode=confirm&code=subpath-confirmation-code');
  await expect(page).toHaveURL('http://127.0.0.1:4173/pages-test/#/profile');
  await expect(page.getByRole('heading', { name: 'Hello, Learner!' })).toBeVisible(); await page.reload();
  await expect(page.getByRole('heading', { name: 'Hello, Learner!' })).toBeVisible();
});

test('profile settings use the real update endpoint and translate interface and theme without changing learning language', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true });
  await page.goto('/#/profile/settings'); await page.getByLabel('First name', { exact: true }).fill('Updated Learner');
  await page.getByRole('combobox', { name: 'Interface language', exact: true }).last().selectOption('de'); await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('dark');
  await page.locator('.account-settings').getByRole('button', { name: 'Save', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Einstellungen', exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark'); expect(backend.profiles.get(uuid)).toMatchObject({ display_name: 'Updated Learner', ui_language: 'de', theme: 'dark' });
  await page.goto('/#/profile'); await expect(page.getByRole('heading', { name: 'Hallo, Updated Learner!' })).toBeVisible();
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`auth screen fits ${language}/${theme} and uses the supplied photo`, async ({ page }) => {
  await mockSupabase(page, { language, theme });
  for (const width of [1440, 1024, 820, 768, 760, 700, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/#/auth/register');
    await expect(page.locator('input[name=first_name]')).toBeVisible(); await expect(page.locator('.account-auth-photo img')).toHaveAttribute('src', /assets\/account\/auth-lake-landscape.png$/);
    await expect(page.locator('.account-auth-form button')).toHaveCount(1);
    for (const name of ['first_name', 'last_name', 'email', 'password', 'confirm']) {
      const input = page.locator(`input[name=${name}]`); await input.focus();
      if (name === 'password' || name === 'confirm') await expect(input).toHaveAttribute('type', 'password');
      await expect(input).toHaveCSS('outline-style', 'none'); await expect(input).toHaveCSS('box-shadow', 'none');
    }
    const photo = (await page.locator('.account-auth-photo').boundingBox())!; const form = (await page.locator('.account-auth-form').boundingBox())!;
    if (width <= 760) expect(photo.y + photo.height).toBeLessThanOrEqual(form.y + 1);
    else { expect(form.y).toBeLessThan(photo.y + photo.height); expect(form.x).toBeGreaterThan(photo.x + photo.width / 2); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (language === 'ru') await page.screenshot({ path: `qa/account/auth-${theme}-${width}.png`, fullPage: true });
  }
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`account screens fit ${language}/${theme} at desktop, tablet and mobile`, async ({ page }) => {
  await mockSupabase(page, { signedIn: true, language, theme });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const screen of ['', '/learning', '/words', '/tutors', '/settings']) {
      await page.goto('/#/profile' + screen); await expect(page.locator('.account-content h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 1440 || width === 390) await page.screenshot({ path: `qa/account/${language}-${theme}-${width}-${screen.slice(1) || 'overview'}.png`, fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});

test('only authorised integration sources changed; global design, Footer, content and email forms are untouched', () => {
  const before = approvedReleaseSources(JSON.parse(readFileSync('qa/account/before.json', 'utf8').replace(/^\uFEFF/, '')));
  const allowed = new Set(['package.json', 'package-lock.json', 'src/main.tsx', 'src/app/App.tsx', 'src/app/preferences-context.ts', 'src/app/PreferencesProvider.tsx', 'src/components/Header.tsx', 'src/pages/learning/levels/storage.ts', 'src/pages/learning/levels/useLevelsStore.ts', 'src/pages/learning/levels/LessonPage.tsx', 'src/pages/learning/levels/LevelLearning.tsx', 'src/pages/learning/practice/usePracticeStorage.ts', 'src/storage/practice.ts', 'src/pages/tutors/Catalog.tsx', 'src/pages/tutors/Profile.tsx', 'src/pages/HomePage.tsx', 'src/pages/learning/practice/PracticeWorkspace.tsx']);
  const changed: Record<string, { before: string; after: string }> = {};
  for (const [file, hash] of Object.entries(before)) {
    const current = createHash('sha256').update(readFileSync(file)).digest('hex');
    if (hash !== current) { expect(allowed.has(file), file).toBe(true); changed[file] = { before: hash, after: current }; }
  }
  writeFileSync('qa/account/protected-audit.json', JSON.stringify(changed, null, 2));
  expect(readFileSync('src/components/Header.tsx', 'utf8')).not.toContain('https://t.me/LinadTeleBot');
  expect(defaultLevelsState().lessons).toEqual({});
});
