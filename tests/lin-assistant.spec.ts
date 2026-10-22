import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { assistantCopy, topicActions, topicIds } from '../src/assistant/content';
import { findTopic, normalizeQuestion } from '../src/assistant/search';
import { contacts } from '../src/config/contacts';
import { mockSupabase } from './account-helpers';
import { approvedHomeAboutSources } from './protected-source';

mkdirSync('qa/lin-assistant', { recursive: true });

test('local FAQ search understands the eight topics in all languages and declines unrelated/ambiguous requests', () => {
  for (const language of ['ru', 'de', 'en'] as const) for (const id of topicIds) {
    const c = assistantCopy(language); expect(findTopic(c.topics[id].question, language)).toBe(id);
    expect(c.topics[id].answer.join(' ').length).toBeGreaterThan(80); expect(topicActions[id].length).toBeGreaterThan(0);
  }
  for (const [query, language, expected] of [
    ['Как сохранить мой прогресс?', 'ru', 'save'], ['Мне нужен репетитор по английскому', 'ru', 'tutors'],
    ['Хочу учить немецкий с нуля', 'ru', 'learn'], ['Выбрать B2', 'ru', 'level'], ['Telegram канал', 'ru', 'telegram'],
    ['Как связаться с преподавателем?', 'ru', 'tutors'], ['contact a teacher', 'en', 'tutors'],
    ['Wörter speichern', 'de', 'save'], ['Lehrkraft finden', 'de', 'tutors'], ['Wie kontaktiere ich den Autor?', 'de', 'author'],
    ['save vocabulary', 'en', 'save'], ['find a teacher', 'en', 'tutors'], ['placement test', 'en', 'level'],
  ] as const) expect(findTopic(query, language), query).toBe(expected);
  for (const language of ['ru', 'de', 'en'] as const) for (const query of ['', '???', 'Что', '2 + 2', 'weather tomorrow', '<script>alert(1)</script>', 'x'.repeat(241)]) expect(findTopic(query, language), query).toBeNull();
  expect(normalizeQuestion('WÖRTER, Straße!')).toBe('worter strasse');
});

test('provided robot assets are byte-for-byte originals and the unread image is reserved rather than shown as a fake notification', async ({ page, request }) => {
  const manifest: Record<string, { original: string; sha256: string }> = JSON.parse(readFileSync('qa/lin-assistant/asset-provenance.json', 'utf8'));
  const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
  for (const [file, source] of Object.entries(manifest)) {
    expect(hash('public/assets/lin/' + file), source.original).toBe(source.sha256);
    const asset = await request.get('/assets/lin/' + file); expect(asset.ok()).toBe(true); expect(asset.headers()['content-type']).toContain('image/png');
  }
  await mockSupabase(page); await page.goto('/#/');
  await expect(page.locator('.lin-launcher')).toHaveAttribute('data-unread', 'false'); await expect(page.locator('[data-pose=unread]')).toHaveCount(0);
  await expect(page.locator('.lin-launcher-idle img')).toHaveAttribute('src', /button-idle.png$/);
  await page.locator('.lin-launcher').hover(); await expect(page.locator('.lin-launcher-hover')).toHaveCSS('opacity', '1');
  await expect(page.locator('.lin-launcher-hover img')).toHaveAttribute('src', /button-hover.png$/);
  const normal = await page.locator('.lin-launcher').boundingBox(); await page.mouse.move(0, 0);
  expect((await page.locator('.lin-launcher').boundingBox())?.width).toBe(normal?.width);
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) test(`eight answers, localized cards, full-size art and responsive panel ${language}/${theme}`, async ({ page }) => {
  await mockSupabase(page, { language, theme }); const c = assistantCopy(language);
  for (const viewport of [{ width: 1440, height: 1080 }, { width: 390, height: 844 }, { width: 320, height: 640 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport); await page.goto('/#/'); await page.locator('.lin-launcher').click();
    const dialog = page.getByRole('dialog', { name: c.name, exact: true }); await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('opacity', '1');
    await expect(dialog.getByText(c.subtitle, { exact: true })).toBeVisible(); await expect(dialog.getByText(c.intro, { exact: true })).toBeVisible();
    await expect(dialog.locator('.lin-topic')).toHaveCount(8);
    expect(await dialog.locator('.lin-topic').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-topic')))).toEqual([...topicIds]);
    await expect(dialog.locator('.lin-welcome-art [data-pose=welcome] img')).toHaveAttribute('src', /welcome.png$/);
    const bounds = (await dialog.boundingBox())!; expect(bounds.x).toBeGreaterThanOrEqual(0); expect(bounds.y).toBeGreaterThanOrEqual(0); expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width); expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
    const field = (await dialog.locator('.lin-composer input').boundingBox())!; expect(field.y + field.height).toBeLessThanOrEqual(viewport.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (viewport.width !== 844) {
      await expect.poll(() => dialog.locator('[data-pose=welcome] img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      await dialog.locator('[data-pose=welcome] img').evaluate((img: HTMLImageElement) => img.decode());
      if (language === 'ru') await page.screenshot({ path: `qa/lin-assistant/${theme}-${viewport.width}-welcome.png`, fullPage: false, animations: 'disabled' });
    }
    // All eight topics remain reachable in the independently scrolling pane.
    for (const id of topicIds) {
      await dialog.locator(`[data-topic=${id}]`).click(); await expect(dialog.locator('.lin-question-bubble')).toHaveText(c.topics[id].question);
      await expect(dialog.locator('.lin-answer-card')).toHaveText(c.topics[id].answer.join(''));
      await expect(dialog.locator('.lin-answer-avatar')).toHaveAttribute('data-pose', 'help');
      await expect(dialog.locator('.lin-action')).toHaveCount(topicActions[id].length);
      if (id === 'about' && language === 'ru' && viewport.width !== 844) await page.screenshot({ path: `qa/lin-assistant/${theme}-${viewport.width}-answer.png` });
      await dialog.getByRole('button', { name: c.back, exact: true }).click();
      await expect(dialog.locator('.lin-welcome-art [data-pose=hello]')).toHaveCount(1);
    }
    await dialog.getByRole('button', { name: c.close, exact: true }).click(); await expect(page.locator('.lin-window')).toHaveCount(0); await expect(page.locator('.lin-launcher')).toBeVisible();
  }
});

test('typed lookup stays local, accepts Enter, handles unknown input safely and uses the supplied positive pose', async ({ page }) => {
  await mockSupabase(page, { language: 'ru' }); await page.goto('/#/'); const c = assistantCopy('ru');
  const before = await page.evaluate(() => JSON.stringify({ ...localStorage })); const sent: string[] = []; page.on('request', req => { if (req.method() === 'POST') sent.push(req.url()); });
  await page.locator('.lin-launcher').click(); const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: c.send, exact: true })).toBeDisabled();
  await dialog.getByLabel(c.input).fill('Как сохранить прогресс?'); await dialog.getByLabel(c.input).press('Enter');
  await expect(dialog.locator('.lin-question-bubble')).toHaveText(c.topics.save.question);
  await dialog.getByRole('button', { name: c.understood, exact: true }).click(); await expect(dialog.getByRole('status')).toContainText(c.great); await expect(dialog.locator('[data-pose=great]')).toBeVisible();
  const unknown = '<img src=x onerror="alert(1)">'; await dialog.getByLabel(c.input).fill(unknown); await dialog.getByRole('button', { name: c.send, exact: true }).click();
  await expect(dialog.locator('.lin-question-bubble')).toHaveText(unknown); await expect(dialog.locator('.lin-answer-card')).toContainText(c.unknown); await expect(dialog.locator('.lin-answer-card [data-pose=ask]')).toBeVisible();
  await expect(dialog.locator('.lin-answer-card img[src=x]')).toHaveCount(0); await expect(dialog.locator('.lin-actions a')).toHaveCount(0);
  await dialog.locator('.lin-all-topics').click(); await expect(dialog.locator('.lin-topic')).toHaveCount(8);
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).toBe(before); expect(sent).toEqual([]);
});

test('all assistant destinations use real routes and configured external contacts without reloading FAQ screens', async ({ page }) => {
  await mockSupabase(page, { signedIn: true }); await page.goto('/#/');
  const visited = new Set<string>();
  for (const id of topicIds) for (const action of topicActions[id]) {
    if (visited.has(action)) continue; visited.add(action); await page.locator('.lin-launcher').click();
    const dialog = page.getByRole('dialog'); await dialog.locator(`[data-topic=${id}]`).click(); const link = dialog.locator(`[data-action=${action}]`);
    if (action === 'channel' || action === 'contact') {
      await expect(link).toHaveAttribute('href', action === 'channel' ? contacts.projectTelegram! : contacts.authorTelegram!); await expect(link).toHaveAttribute('target', '_blank'); await expect(link).toHaveAttribute('rel', 'noopener noreferrer'); await dialog.getByRole('button', { name: 'Close assistant', exact: true }).click();
    } else {
      const href = await link.getAttribute('href'); expect(href).toMatch(/^#\//); await link.click(); await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
      await expect(page.locator('.lin-window')).toHaveCount(0); await expect(page.locator('#page-heading')).toBeVisible(); await expect(page.locator('#page-heading')).not.toContainText('Page not found');
    }
    await expect(page.locator('.lin-window')).toHaveCount(0);
  }
  expect(visited.size).toBe(10);
});

test('keyboard focus, Escape, rapid reopen and live language/theme changes work without a modal trap', async ({ page }) => {
  await mockSupabase(page); await page.goto('/#/'); const launcher = page.locator('.lin-launcher'); await launcher.focus(); await page.keyboard.press('Enter');
  let dialog = page.getByRole('dialog'); await expect(dialog.getByRole('heading', { name: 'Hi! 👋' })).toBeFocused();
  await expect(dialog).toHaveAttribute('aria-modal', 'false'); await page.keyboard.press('Tab'); await expect(dialog.locator('[data-topic=about]')).toBeFocused(); await page.keyboard.press('Enter');
  await expect(dialog.locator('.lin-question-bubble')).toBeFocused(); await page.keyboard.press('Escape'); await expect(launcher).toBeFocused(); await expect(page.locator('.lin-window')).toHaveCount(0);
  await launcher.click(); await launcher.click(); await launcher.click(); dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  await page.locator('.language-select select').selectOption('de'); await expect(dialog.getByText('LINAD-Assistent', { exact: true })).toBeVisible();
  await page.locator('.language-select select').selectOption('ru'); await expect(dialog.locator('[data-topic=about]')).toContainText('Что такое LINAD?');
  await page.getByRole('button', { name: 'Включить тёмную тему', exact: true }).focus(); await page.keyboard.press('Enter'); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark'); await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Закрыть помощника', exact: true }).click(); await expect(launcher).toBeFocused();
});

test('fixed launcher remains available on existing pages, clears the footer, and the mobile form stays usable', async ({ page }) => {
  await mockSupabase(page, { signedIn: true }); await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/learn', '/learn/levels/languages', '/learn/de/situations', '/tutors', '/profile', '/author', '/auth/register', '/not-a-real-page']) {
    await page.goto('/#' + route); const launcher = page.locator('.lin-launcher'); await expect(launcher).toBeVisible(); await expect(launcher).toHaveCSS('position', 'fixed');
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(async () => {
      const button = (await launcher.boundingBox())!, footer = (await page.locator('.site-footer').boundingBox())!;
      return button.y + button.height <= footer.y;
    }).toBe(true);
    await launcher.click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('.lin-window')).toHaveCount(0);
  }
  await page.goto('/#/tutors/daniil-karnakov/request'); const message = page.locator('#message'); await message.focus();
  await message.evaluate(el => el.scrollIntoView({ block: 'end' }));
  await expect.poll(async () => {
    const field = (await message.boundingBox())!, button = (await page.locator('.lin-launcher').boundingBox())!;
    return button.x >= field.x + field.width || button.x + button.width <= field.x || button.y + button.height <= field.y || button.y >= field.y + field.height;
  }).toBe(true);
});

test('reduced-motion preferences disable movement and source changes stay isolated from protected parts of LINAD', async ({ page }) => {
  await mockSupabase(page); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/#/'); await page.locator('.lin-launcher').click();
  await expect(page.locator('.lin-window')).toHaveCSS('animation-name', 'none'); await expect(page.locator('.lin-launcher')).toHaveCSS('transition-duration', '0s');
  const before: Record<string, string> = JSON.parse(readFileSync('qa/lin-assistant/before.json', 'utf8')); const changed: string[] = [];
  const integration: Record<string, { before: string; after: string }> = JSON.parse(readFileSync('qa/lin-assistant/integration-changes.json', 'utf8'));
  expect(integration['src/app/App.tsx']?.before).toBe(before['src/app/App.tsx']);
  expect(createHash('sha256').update(readFileSync('src/app/App.tsx')).digest('hex')).toBe(approvedHomeAboutSources({ 'src/app/App.tsx': integration['src/app/App.tsx']!.after })['src/app/App.tsx']);
  for (const [path, hash] of Object.entries(approvedHomeAboutSources(before))) {
    const current = createHash('sha256').update(readFileSync(path)).digest('hex'); if (hash !== current) { expect(path).toBe('src/app/App.tsx'); changed.push(path); }
  }
  writeFileSync('qa/lin-assistant/protected-audit.json', JSON.stringify({ modified: changed, added: ['src/assistant/', 'public/assets/lin/'] }, null, 2));
});
