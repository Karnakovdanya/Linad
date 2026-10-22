import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { messages } from '../src/i18n/messages';
import { DEFAULT_PREFERENCES, parsePreferences, PREFERENCES_KEY } from '../src/storage/preferences';

mkdirSync('qa/learning', { recursive: true });

test('approved Learning photographs are preserved byte for byte', () => {
  const originals = {
    'learning-everyday-life.png': '63ede71d235da060ebf5346a981117273124b7811274f71f7e908327f327a50e',
    'learning-by-level.png': '054b4660ccbd43ecbfbcb30d123ec65b9deab5c1b016312b2fb1f2ad62fb94d2',
  };
  for (const [name, hash] of Object.entries(originals)) expect(createHash('sha256').update(readFileSync(`public/assets/learning/${name}`)).digest('hex')).toBe(hash);
});

test('learning preference is backward compatible and independent of the interface language', () => {
  expect(parsePreferences(null).preferences).toEqual(DEFAULT_PREFERENCES);
  for (const uiLanguage of ['ru', 'de', 'en']) for (const theme of ['light', 'dark']) {
    const old = { version: 1, uiLanguage, theme };
    expect(parsePreferences(JSON.stringify(old))).toEqual({ preferences: { ...old, learningLanguage: 'de' }, warning: null });
    expect(parsePreferences(JSON.stringify({ ...old, learningLanguage: 'en' })).preferences).toEqual({ ...old, learningLanguage: 'en' });
    expect(parsePreferences(JSON.stringify({ ...old, learningLanguage: 'fr' })).preferences).toEqual({ ...old, learningLanguage: 'de' });
  }
  expect(parsePreferences('{broken').warning).toBe('invalid');
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) {
  test(`Learning landing, language and paths: ${language} ${theme}`, async ({ page }) => {
    test.setTimeout(90_000);
    const t = messages[language];
    const errors: string[] = [];
    const failed: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => failed.push(request.url()));
    await page.addInitScript(({ language, theme }) => {
      if (localStorage.getItem('linad.preferences.v1') === null) localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme }));
    }, { language, theme });
    await page.goto('/#/learn');
    const learning = page.locator('.learning-page');
    await expect(page.locator('h1')).toHaveText(t.learnTitle);
    await expect(learning.locator('.learning-intro > p')).toHaveText(t.learningIntro);
    await expect(learning.locator('.version-note, .pending-state, .image-placeholder')).toHaveCount(0);
    await expect(learning.locator('.learning-language-panel')).toHaveCount(0);
    await expect(learning.locator('.learning-path-card')).toHaveCount(2);
    await expect(learning.locator('.learning-level-list li')).toHaveText(['A1', 'A2', 'B1', 'B2', 'C1']);
    await expect(learning.locator('.learning-situation-list li')).toHaveText([t.learningJobInterview, t.learningDoctor, t.learningTravel, t.learningDocuments, t.learningCommunication]);
    for (const [index, file] of ['learning-everyday-life.png', 'learning-by-level.png'].entries()) {
      const image = learning.locator('.learning-path-photo').nth(index);
      await expect(image).toHaveAttribute('src', `./assets/learning/${file}`);
      await expect(image).toHaveAttribute('alt', /.+/);
      await image.evaluate(node => (node as HTMLImageElement).decode());
      await expect(image).toHaveCSS('object-fit', 'cover');
      await expect(image).toHaveCSS('filter', 'none');
      await expect(image).toHaveCSS('opacity', '1');
    }
    const footer = await page.locator('.site-footer').evaluate(node => node.outerHTML);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.mouse.move(0, 0);
      await page.evaluate(() => scrollTo(0, 0));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth)).toBe(true);
      const outer = (await learning.boundingBox())!;
      expect(outer.width).toBeCloseTo(width * .9, 1);
      const cards = await learning.locator('.learning-path-card').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        const image = node.querySelector('img')!.getBoundingClientRect();
        const heading = node.querySelector('h3')!.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom, imageBottom: image.bottom, headingTop: heading.top };
      }));
      expect(cards[0]!.width).toBeCloseTo(cards[1]!.width, 1);
      expect(cards[0]!.height).toBeCloseTo(cards[1]!.height, 1);
      if (width >= 900) { expect(cards[1]!.x).toBeGreaterThan(cards[0]!.x); expect(cards[1]!.y).toBeCloseTo(cards[0]!.y, 1); }
      else expect(cards[1]!.y).toBeGreaterThanOrEqual(cards[0]!.bottom + 19);
      for (const card of cards) expect(card.headingTop).toBeGreaterThan(card.imageBottom);
      const overflow = await learning.locator('h1,h2,h3,p,li,.button').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent));
      expect(overflow).toEqual([]);
      for (const control of await learning.locator('.button').all()) {
        const box = (await control.boundingBox())!;
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      await page.screenshot({ path: `qa/learning/learn-${width}-${language}-${theme}.png`, fullPage: true });
    }

    for (const [path, action, title] of [['/learn/de/situations', t.learningSituationsCta, t.learningEverydayTitle], ['/learn/levels', t.learningLevelsCta, `${t.levelsSetupLead} ${t.levelsSetupAccent}`]] as const) {
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page).toHaveURL(/#\/learn$/);
        const link = learning.getByRole('link', { name: action, exact: true });
        await expect(link).toHaveAttribute('href', `#${path}`);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${path}$`));
        await expect(page.locator('h1')).toHaveText(title);
        await expect(page.locator('h1')).toBeFocused();
        await expect(page).toHaveTitle(`${title} | LINAD`);
        await expect(page.locator('.learning-path-card')).toHaveCount(0);
        await expect(page.locator('.primary-nav a[aria-current="page"]')).toHaveText(t.learn);
        expect(await page.locator('.site-footer').evaluate(node => node.outerHTML)).toBe(footer);
        await page.reload();
        await expect(page.locator('h1')).toHaveText(title);
        await page.getByRole('link', { name: new RegExp(t.learningBack) }).click();
        await expect(page).toHaveURL(/#\/learn$/);
        await expect(page.locator('.learning-language-panel')).toHaveCount(0);
    }
    await page.reload();
    await expect(page.locator('.learning-language-panel')).toHaveCount(0);
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).uiLanguage, PREFERENCES_KEY)).toBe(language);
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
  });
}

test('Learning paths survive interface/theme changes and support keyboard focus', async ({ page }) => {
  await page.goto('/#/learn');
  const levels = page.locator('.learning-path-cta').nth(1);
  await levels.focus();
  await expect(levels).toBeFocused();
  await expect(levels).toHaveCSS('outline-width', '3px');
  for (const language of ['de', 'en', 'ru'] as const) {
    await page.locator('.language-select select').selectOption(language);
    await expect(page.locator('.learning-intro > p')).toHaveText(messages[language].learningIntro);
    await expect(levels).toHaveAttribute('href', '#/learn/levels');
  }
  await page.getByRole('button', { name: messages.ru.switchDark }).click();
  await expect(levels).toHaveAttribute('href', '#/learn/levels');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await levels.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('h1')).toHaveText(`${messages.ru.levelsSetupLead} ${messages.ru.levelsSetupAccent}`);
});

test('level language pairs sync across tabs without changing interface language', async ({ context }) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await first.goto('/#/learn/levels'); await second.goto('/#/learn/levels');
  await first.locator('.level-target-options button').nth(1).click();
  await expect(second.locator('.level-target-options button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await second.locator('.level-target-options button').nth(0).click();
  await expect(first.locator('.level-target-options button').nth(0)).toHaveAttribute('aria-pressed', 'true');
  await expect(first.locator('html')).toHaveAttribute('lang', 'ru');
});

test('mobile Learning taps and blocked storage remain functional', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true });
  await context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/#/learn');
    await page.getByRole('link', { name: messages.ru.learningSituationsCta, exact: true }).tap();
    await expect(page).toHaveURL(/#\/learn\/de\/situations$/);
    await expect(page.locator('.situations-grid')).toBeVisible();
    await expect(page.locator('.situations-language')).toHaveCount(0);
    await page.getByRole('link', { name: messages.ru.learningBack, exact: true }).tap();
    await expect(page.locator('.learning-language-panel')).toHaveCount(0);
    await expect(page.locator('.learning-path-cta').first()).toHaveCSS('transform', 'none');
  } finally { await context.close(); }
});
