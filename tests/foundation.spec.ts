import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { confirmedContacts, confirmedAuthorEmail } from './confirmed-contacts';

const widths = [320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920];
const routes = ['/', '/learn', '/tutors', '/profile', '/author'];
const key = 'linad.preferences.v1';
const headings: Record<string, { ru: string; de: string; en: string }> = {
  '/': { ru: 'Изучай язык для реальной жизни', de: 'Lerne Sprachen für das echte Leben', en: 'Learn a language for real life' },
  '/learn': { ru: 'Обучение', de: 'Lernen', en: 'Learning' },
  '/tutors': { ru: 'Найдите своего репетитора', de: 'Finde deine Sprachlehrkraft', en: 'Find your language tutor' },
  '/profile': { ru: 'Создай аккаунт в LINAD', de: 'Erstelle dein LINAD-Konto', en: 'Create your LINAD account' },
  '/author': { ru: 'Привет, я Данил!', de: 'Hallo, ich bin Danil!', en: 'Hi, I’m Danil!' },
};

async function assertNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
}

for (const width of widths) {
  for (const uiLanguage of ['ru', 'de', 'en'] as const) {
    for (const theme of ['light', 'dark'] as const) {
      test(`${width}px ${uiLanguage} ${theme}: all routes`, async ({ page }) => {
        const errors: string[] = [];
        const failedRequests: string[] = [];
        const externalRequests: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('requestfailed', (request) => failedRequests.push(request.url()));
        page.on('request', (request) => {
          if (!request.url().startsWith('http://127.0.0.1:4173/')) externalRequests.push(request.url());
        });
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(({ key, uiLanguage, theme }) => {
          localStorage.setItem(key, JSON.stringify({ version: 1, uiLanguage, theme }));
        }, { key, uiLanguage, theme });

        for (const route of routes) {
          const response = await page.goto(`/#${route}`);
          // Hash-only navigation reuses the document and has no HTTP response.
          if (route === '/') expect(response?.status()).toBe(200);
          await expect(page.locator('h1')).toHaveCount(1);
          await expect(page.locator('h1')).toHaveText(headings[route]![uiLanguage]);
          await expect(page.locator('html')).toHaveAttribute('lang', uiLanguage);
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await expect(page.locator('main')).toBeVisible();
          await expect(page.locator('h1')).toBeVisible();
          await expect(page).toHaveTitle(/LINAD/);
          await expect(page.locator('.language-select select').locator('option')).toHaveText(['RU', 'DE', 'EN']);
          for (const lazyImage of await page.locator('img[loading="lazy"]').all()) {
            await lazyImage.scrollIntoViewIfNeeded();
            await lazyImage.evaluate(node => (node as HTMLImageElement).decode());
          }
          await page.evaluate(() => scrollTo(0, 0));
          await page.locator('img').evaluateAll(async (images) => {
            await Promise.all(images.map((img) => img instanceof HTMLImageElement ? img.decode() : Promise.resolve()));
          });
          await assertNoOverflow(page);
          const containers = await page.locator('.container').evaluateAll((nodes) => nodes.map((node) => {
            const box = node.getBoundingClientRect();
            return { x: box.x, width: box.width, viewport: innerWidth };
          }));
          for (const box of containers) {
            if (route === '/profile') { expect(box.width).toBeLessThanOrEqual(box.viewport * .9 + 1); expect(Math.abs(box.x - (box.viewport - box.width) / 2)).toBeLessThan(1); }
            else { expect(Math.abs(box.width - box.viewport * .9)).toBeLessThan(1); expect(Math.abs(box.x - box.viewport * .05)).toBeLessThan(1); }
          }
          const brand = page.getByRole('banner').getByRole('img');
          await expect(brand).toHaveAttribute('src', `./assets/brand/linad-logo-${route === '/' ? 'dark' : theme}.svg`);
          await expect(brand).toHaveCSS('filter', 'none');
          for (const [contact, href] of Object.entries(confirmedContacts)) {
            // The shared footer has only the text link to the channel.
            // All other contacts remain on the author and relevant section pages.
            if (contact !== 'projectTelegram') {
              await expect(page.getByRole('contentinfo').locator(`[data-contact="${contact}"]`)).toHaveCount(0);
              continue;
            }
            await expect(page.getByRole('contentinfo').locator(`[data-contact="${contact}"]`)).toHaveAttribute('href', href);
          }
          await expect(page.locator('[data-contact="instagram"]')).toHaveCount(0);
          for (const link of await page.locator('a[href^="https:"]').all()) {
            await expect(link).toHaveAttribute('target', '_blank');
            await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          }
          if (route !== '/author') {
            await expect(page.locator('#primary-navigation a[aria-current="page"]')).toHaveCount(1);
          }

          if (route === '/' && (width === 390 || width === 1440)) {
            await page.screenshot({ path: `qa/home-approved/home-${width}-${uiLanguage}-${theme}.png`, fullPage: true });
          }
          if (route === '/author' && uiLanguage === 'en' && (width === 390 || width === 1440)) {
            await page.screenshot({ path: `qa/confirmed-contacts/author-${width}-${uiLanguage}-${theme}.png`, fullPage: true });
          }
        }
        expect(errors).toEqual([]);
        expect(failedRequests).toEqual([]);
        expect(externalRequests).toEqual([]);
      });
    }
  }
}

test('language and theme persist across navigation and reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/');
  await page.locator('.language-select select').selectOption('de');
  await page.getByRole('button', { name: 'Dunkles Design aktivieren' }).click();
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Lernen' }).click();
  await expect(page.locator('h1')).toHaveText('Lernen');
  await expect(page.locator('h1')).toBeFocused();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('h1')).toHaveText('Lernen');
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key)).toEqual({
    version: 1, uiLanguage: 'de', theme: 'dark', learningLanguage: 'de',
  });
  await page.locator('.language-select select').selectOption('en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('h1')).toHaveText('Learning');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.locator('.language-select select').selectOption('ru');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile menu: keyboard, touch targets, navigation and resize', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/');
  const menu = page.locator('.menu-toggle');
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeHidden();
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible();
  await assertNoOverflow(page);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Репетиторы' }).click();
  await expect(page.locator('h1')).toHaveText('Найдите своего репетитора');
  await expect(page.locator('h1')).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  for (const locator of [menu, page.locator('.language-select select'), page.getByRole('button', { name: 'Включить тёмную тему' })]) {
    const box = await locator.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await menu.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('touch navigation and portrait links work', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/#/');
  await page.getByRole('button', { name: 'Открыть меню' }).tap();
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Войти' }).tap();
  await expect(page.locator('h1')).toHaveText('Создай аккаунт в LINAD');
  await page.getByRole('link', { name: 'О Даниле и проекте LINAD' }).tap();
  await expect(page.locator('h1')).toHaveText('Привет, я Данил!');
  await expect(page.locator('.author-profile-portrait')).toHaveAttribute('src', './assets/author/portrait.png');
  await assertNoOverflow(page);
  await page.screenshot({ path: 'qa/phase-a/author-390-ru-light.png', fullPage: true });
  await context.close();
});

test('keyboard skip link and browser back work with hash routing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Перейти к содержимому' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(page.url()).toMatch(/#\/$/);
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Обучение' }).click();
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('Изучай язык для реальной жизни');
});

for (const value of ['broken JSON', '{"version":2,"theme":"dark","uiLanguage":"de"}', '{"version":1,"theme":"blue","uiLanguage":"en"}', '{"version":1,"theme":"light","uiLanguage":"fr"}']) {
  test(`corrupt or unsupported preferences recover: ${value}`, async ({ page }) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key, value });
    await page.goto('/#/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('status')).toContainText('Сохранённые настройки повреждены');
    await page.getByRole('button', { name: 'Включить тёмную тему' }).click();
    await expect(page.getByRole('status')).toHaveCount(0);
  });
}

test('blocked localStorage reports limitations while controls remain usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await page.goto('/#/');
  await expect(page.getByRole('status')).toContainText('Браузер не разрешил сохранить настройки');
  await page.getByRole('button', { name: 'Включить тёмную тему' }).click();
  await page.locator('.language-select select').selectOption('de');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('status')).toContainText('Der Browser hat das Speichern');
  await page.locator('.language-select select').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('status')).toContainText('Your browser could not save the settings');
});

test('same-browser tabs receive preference changes', async ({ context }) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await first.goto('/#/');
  await second.goto('/#/profile');
  await first.locator('.language-select select').selectOption('de');
  await first.getByRole('button', { name: 'Dunkles Design aktivieren' }).click();
  await expect(second.locator('html')).toHaveAttribute('lang', 'de');
  await expect(second.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(second.locator('h1')).toHaveText('Erstelle dein LINAD-Konto');
  await first.locator('.language-select select').selectOption('en');
  await expect(second.locator('html')).toHaveAttribute('lang', 'en');
  await expect(second.locator('h1')).toHaveText('Create your LINAD account');
  await expect(second.locator('input[type="email"]')).toBeVisible();
});

test('unknown route and confirmed contacts work in RU and EN', async ({ page }) => {
  await page.goto('/#/unknown-page');
  await expect(page.locator('h1')).toHaveText('Страница не найдена');
  await page.getByRole('link', { name: 'На главную', exact: true }).click();
  await page.goto('/#/');
  await expect(page.getByRole('main').getByRole('link', { name: 'Перейти в Telegram' })).toHaveAttribute('href', confirmedContacts.projectTelegram);
  await expect(page.locator('main [data-contact="authorTelegram"]')).toHaveAttribute('href', confirmedContacts.authorTelegram);
  await page.goto('/#/author');
  await expect(page.locator('main [data-contact="email"]')).toHaveAttribute('href', confirmedAuthorEmail);
  await page.locator('.language-select select').selectOption('en');
  await page.goto('/#/');
  await expect(page.getByRole('main').getByRole('link', { name: 'Go to Telegram' })).toHaveAttribute('href', confirmedContacts.projectTelegram);
  await expect(page.locator('main [data-contact="authorTelegram"]')).toHaveAttribute('href', confirmedContacts.authorTelegram);
  await page.goto('/#/unknown-page');
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Back to home', exact: true })).toBeVisible();
});

test('every page switches between RU, DE and EN, and keeps EN after reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(`/#${route}`);
    for (const language of ['ru', 'de', 'en'] as const) {
      await page.locator('.language-select select').selectOption(language);
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await expect(page.locator('h1')).toHaveText(headings[route]![language]);
      await expect(page).toHaveURL(new RegExp(`#${route === '/profile' ? '/auth/login' : route}$`));
    }
    await page.reload();
    await expect(page.locator('h1')).toHaveText(headings[route]!.en);
    await expect(page.locator('.language-select select')).toHaveValue('en');
    if (route === '/profile') await expect(page.locator('.account-auth-form input[type="email"]')).toBeVisible();
  }
});

