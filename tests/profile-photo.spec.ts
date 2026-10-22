import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mockSupabase, uuid, host } from './account-helpers';
import { accountCopy } from '../src/account/copy';
import { avatarStorageError } from '../src/account/avatar-storage';
import { approvedLinSources } from './protected-source';

const profile = () => ({ display_name: 'Daniil Karnakov', first_name: 'Daniil', last_name: 'Karnakov', avatar_path: null, study_languages: [{ language: 'de', level: 'A2' }, { language: 'en', level: 'B1' }], study_goal: { language: 'de', level: 'B2' }, ui_language: null, theme: null });

test('hero camera opens the file picker without navigation; duplicate clicks cannot race an upload', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true }); backend.profiles.set(uuid, profile());
  await page.goto('/#/profile');
  const photo = { name: 'photo.png', mimeType: 'image/png', buffer: await page.locator('.account-avatar').screenshot() };
  writeFileSync('qa/profile-photo/avatar-test.png', photo.buffer);
  const chooserEvent = page.waitForEvent('filechooser'); await page.getByRole('button', { name: 'Upload photo', exact: true }).click();
  const chooser = await chooserEvent; expect(page.url()).toContain('/#/profile'); expect(page.url()).not.toContain('settings');
  let finish!: () => void; const pending = new Promise<void>(resolve => { finish = resolve; });
  await page.route(`${host}/storage/v1/object/linad-avatars/**`, async route => { await pending; await route.fallback(); });
  await chooser.setFiles(photo); await expect(page.locator('.account-avatar-edit')).toBeDisabled();
  await expect(page.locator('.account-avatar-feedback [role=status]')).toHaveCount(0);
  await expect(page.locator('.account-avatar img')).toHaveCount(0);
  finish(); await expect(page.locator('.account-avatar img')).toBeVisible(); await expect(page.locator('.account-avatar-feedback [role=status]')).toHaveText('Changes saved.');
  expect(backend.calls.filter(call => /\/object\/linad-avatars\//.test(call.path)).length).toBe(1);
  await page.reload(); await expect(page.locator('.account-avatar img')).toBeVisible();
});

test('missing bucket, denied storage and network errors preserve the old photo and allow retrying the same file', async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true }); const oldPath = `${uuid}/old.png`; backend.profiles.set(uuid, { ...profile(), avatar_path: oldPath });
  backend.images.add(`/storage/v1/object/linad-avatars/${oldPath}`);
  await page.goto('/#/profile'); await expect(page.locator('.account-avatar img')).toBeVisible(); const input = page.locator('input[type=file]');
  const photo = { name: 'photo.png', mimeType: 'image/png', buffer: await page.locator('.account-avatar').screenshot() };
  backend.controls.bucketMissing = true; await input.setInputFiles(photo); await expect(page.getByRole('alert')).toContainText('Photo storage is not set up');
  expect((backend.profiles.get(uuid) as { avatar_path: string }).avatar_path).toBe(oldPath); expect(backend.images.size).toBe(1); await expect(page.locator('.account-avatar img')).toBeVisible();
  backend.controls.bucketMissing = false; backend.controls.uploadError = true; await input.setInputFiles(photo); await expect(page.getByRole('alert')).toContainText('Photo storage access was denied');
  backend.controls.uploadError = false;
  await page.route(`${host}/storage/v1/object/linad-avatars/**`, route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Temporarily unavailable' }) }));
  await input.setInputFiles(photo); await expect(page.getByRole('alert')).toContainText('request failed');
  await page.unroute(`${host}/storage/v1/object/linad-avatars/**`);
  await input.setInputFiles(photo); await expect(page.getByRole('alert')).toHaveCount(0); await expect(page.locator('.account-avatar-feedback [role=status]')).toBeVisible();
  await expect.poll(() => backend.images.size).toBe(1); expect(backend.images.has(`/storage/v1/object/linad-avatars/${oldPath}`)).toBe(false);
});

test('photo path persists through Auth metadata when profile SQL is absent and restores on another device', async ({ page, browser }) => {
  const backend = await mockSupabase(page, { signedIn: true, schemaMissing: true }); backend.controls.profileMissing = true;
  await page.goto('/#/profile'); const photo = { name: 'photo.png', mimeType: 'image/png', buffer: await page.locator('.account-avatar').screenshot() };
  await page.locator('input[type=file]').setInputFiles(photo); await expect(page.locator('.account-avatar img')).toBeVisible();
  const data = backend.users.get(uuid)!.user_metadata as Record<string, unknown>;
  const record = data.linad_profile as { profile: { avatar_path: string } };
  expect(record.profile.avatar_path).toMatch(new RegExp(`^${uuid}/[a-f0-9-]+\\.png$`)); expect(JSON.stringify(data)).not.toContain('data:image');
  const context = await browser.newContext(); const device = await context.newPage(); const remote = await mockSupabase(device, { signedIn: true, schemaMissing: true }); remote.controls.profileMissing = true;
  remote.users.set(uuid, structuredClone(backend.users.get(uuid)!));
  await device.goto('/#/profile'); await expect(device.locator('.account-avatar img')).toBeVisible(); await context.close();
  await page.goto('/#/profile/settings'); await expect(page.locator('.account-avatar img')).toBeVisible();
  const chooserEvent = page.waitForEvent('filechooser'); await page.getByRole('button', { name: 'Replace photo', exact: true }).click(); await (await chooserEvent).setFiles(photo);
  await expect(page.locator('.account-avatar-actions [role=status]')).toHaveText('Changes saved.');
  await page.getByRole('button', { name: 'Remove photo', exact: true }).click(); await expect(page.locator('.account-avatar img')).toHaveCount(0);
  await page.reload(); await expect(page.locator('.account-avatar img')).toHaveCount(0); expect(backend.images.size).toBe(0);
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`matte quote, larger goal, blue edit action and outline-free fields ${language}/${theme}`, async ({ page }) => {
  const backend = await mockSupabase(page, { signedIn: true, language, theme }); backend.profiles.set(uuid, profile()); const c = accountCopy(language);
  for (const width of [1440, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/#/profile'); await expect(page.locator('.account-goal-level')).toHaveText('B2'); await expect(page.locator('.account-goal-language')).toHaveText({ ru: 'Немецкий', de: 'Deutsch', en: 'German' }[language]);
    expect(parseFloat(await page.locator('.account-goal-level').evaluate(el => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(28);
    await expect(page.locator('.account-summary-goal button')).toHaveCSS('color', theme === 'dark' ? 'rgb(189, 200, 232)' : 'rgb(54, 95, 173)');
    await expect(page.locator('.account-profile-quote')).toHaveCSS('backdrop-filter', 'blur(18px) saturate(0.75)');
    const background = await page.locator('.account-profile-quote').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(background).toMatch(theme === 'light' ? /0\.76\)/ : /0\.48\)/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (language === 'ru' && [1440, 390].includes(width)) await page.screenshot({ path: `qa/profile-photo/${theme}-${width}.png`, fullPage: true });
  }
  await page.getByRole('button', { name: new RegExp(c.editGoal) }).click();
  for (const label of [c.studyLanguage, c.targetLevel]) {
    const input = page.getByRole('combobox', { name: label, exact: true }); await input.focus();
    await expect(input).toHaveCSS('outline-style', 'none'); await expect(input).toHaveCSS('box-shadow', 'none');
  }
  await page.keyboard.press('Escape'); await page.goto('/#/profile/settings');
  for (const input of [page.locator('input[name=first_name]'), page.locator('input[name=last_name]'), page.locator('input[type=email]'), page.locator('select[name=ui]'), page.locator('select[name=theme]')]) {
    await input.click(); await expect(input).toHaveCSS('outline-style', 'none'); await input.press('Tab'); await input.focus(); await expect(input).toHaveCSS('outline-style', 'none');
  }
});

test('storage errors are distinguished without mislabelling network failures', () => {
  expect(avatarStorageError({ code: 'NoSuchBucket' })).toEqual({ code: 'avatar_storage' });
  expect(avatarStorageError({ statusCode: '403', message: 'new row violates row-level security policy' })).toEqual({ code: 'avatar_permission' });
  const error = new Error('Network unavailable'); expect(avatarStorageError(error)).toBe(error);
});

test('only the requested profile UI, avatar handling and localized errors changed', () => {
  const snapshot: Record<string, string> = JSON.parse(readFileSync('qa/profile-photo/before.json', 'utf8'));
  const protectedPaths = approvedLinSources(Object.fromEntries(Object.entries(snapshot).map(([path, hash]) => ['src/' + path, hash])));
  const before = Object.fromEntries(Object.entries(protectedPaths).map(([path, hash]) => [path.slice(4), hash]));
  const allowed = new Set(['account/Avatar.tsx', 'account/avatar-storage.ts', 'account/ProfileOverview.tsx', 'account/copy.ts', 'styles/account.css']); const changed: string[] = [];
  for (const [path, hash] of Object.entries(before)) {
    const current = createHash('sha256').update(readFileSync('src/' + path)).digest('hex');
    if (hash !== current) { expect(allowed.has(path), path).toBe(true); changed.push('src/' + path); }
  }
  writeFileSync('qa/profile-photo/protected-audit.json', JSON.stringify(changed, null, 2));
});
