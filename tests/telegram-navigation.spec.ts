import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { confirmedContacts } from './confirmed-contacts';
import { approvedReleaseSources } from './protected-source';

type Box = { x: number; y: number; width: number; height: number };
type Geometry = { header: Box; nav: Box; footer: Box; cards: Box[]; links: (Box & { text: string | null; font: string; color: string })[] };
const geometryBefore: Record<string, Geometry> = JSON.parse(readFileSync('qa/header-no-telegram/geometry-before.json', 'utf8'));

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) for (const width of [390, 820, 1440]) test(`Telegram is absent only in the header; other links and header appearance stay intact: ${language} ${theme} ${width}px`, async ({ context, page }) => {
  await context.route('https://t.me/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Telegram link test</title>' }));
  await context.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
  await page.setViewportSize({ width, height: 950 }); await page.goto('/#/'); await page.evaluate(() => document.fonts.ready);
  const menu = page.locator('.menu-toggle'); const nav = page.locator('.primary-nav');
  if (width < 1100) { await menu.click(); await expect(nav).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)'); await expect(nav).toHaveCSS('opacity', '1'); }
  const after = await page.evaluate(() => {
    const box = (element: Element): Box => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; };
    return { header: box(document.querySelector('.site-header')!), nav: box(document.querySelector('.primary-nav')!), footer: box(document.querySelector('.site-footer')!), cards: [...document.querySelectorAll('.home-photo-card')].map(box), links: [...document.querySelectorAll('.primary-nav a')].map(element => ({ ...box(element), text: element.textContent, font: getComputedStyle(element).font, color: getComputedStyle(element).color })) };
  });
  const before = geometryBefore[`${language}-${theme}-${width}`]!;
  // The baseline's initial scroll position can differ while the hero settles.
  for (const key of ['x', 'width', 'height'] as const) expect(Math.abs(after.header[key] - before.header[key]), key).toBeLessThan(1);
  // Footer/card document Y can shift while the home hero's measured height settles.
  // Their source and all styles are independently protected by the hash audit.
  for (const key of ['x', 'width', 'height'] as const) expect(Math.abs(after.footer[key] - before.footer[key])).toBeLessThan(1);
  expect(after.links).toHaveLength(4); expect(after.cards).toHaveLength(3);
  const retained = before.links.filter(link => link.text !== 'Telegram');
  after.links.forEach((link, index) => { expect(link.text).toBe(retained[index]!.text); expect(link.font).toBe(retained[index]!.font); expect(link.color).toBe(retained[index]!.color); expect(link.height).toBe(retained[index]!.height); });
  if (width < 1100) {
    expect(after.nav.x).toBe(before.nav.x); expect(after.nav.width).toBe(before.nav.width);
    // Existing placement: top: calc(50% + 30px); the snapshot may include -8px entrance translation.
    expect(after.nav.y).toBeCloseTo(after.header.y + after.header.height / 2 + 30, 0);
  }
  after.cards.forEach((card, index) => { for (const key of ['x', 'width', 'height'] as const) expect(Math.abs(card[key] - before.cards[index]![key])).toBeLessThan(1); });
  await expect(nav.getByRole('link', { name: 'Telegram', exact: true })).toHaveCount(0);
  await expect(nav.locator('[data-contact="headerTelegramBot"], a[href^="https://t.me/"]')).toHaveCount(0);
  const footerLink = page.locator('.footer-nav').getByRole('link', { name: 'Telegram', exact: true });
  const homeLink = page.locator('.home-photo-card').nth(2);
  const targets = [[footerLink, confirmedContacts.projectTelegram], [homeLink, confirmedContacts.projectTelegram]] as const;
  for (const [link, href] of targets) { await expect(link).toHaveAttribute('href', href); await expect(link).toHaveAttribute('target', '_blank'); await expect(link).toHaveAttribute('rel', 'noopener noreferrer'); }
  await expect(nav.locator('a[aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('a[href="#/telegram"], a[href="/#/telegram"], a[href="/telegram"]')).toHaveCount(0);
  for (const [link, href] of targets) {
    const opening = page.waitForEvent('popup'); await link.click(); const popup = await opening;
    await expect(popup).toHaveURL(href); expect(await popup.evaluate(() => window.opener === null)).toBe(true); await popup.close();
    await expect(page).toHaveURL(/#\/$/);
  }
  if (width < 1100) { await expect(menu).toHaveAttribute('aria-expanded', 'false'); await expect(nav).toBeHidden(); }
  await expect(page.locator('.home-telegram [data-contact="authorTelegram"]')).toHaveAttribute('href', confirmedContacts.authorTelegram);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (language === 'ru' && width !== 820) { if (width < 1100) await menu.click(); await page.locator('.site-header').screenshot({ path: `qa/header-no-telegram/header-${width}-${theme}.png` }); }
});

test('the removed Telegram route shows the existing not-found page in all interface languages', async ({ page }) => {
  await page.goto('/#/telegram');
  for (const [language, title] of [['ru', 'Страница не найдена'], ['de', 'Seite nicht gefunden'], ['en', 'Page not found']] as const) {
    await page.locator('.language-select select').selectOption(language); await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('main #contacts-status')).toHaveCount(0); await expect(page.locator('a[href="#/telegram"]')).toHaveCount(0);
  }
});

test('only Header changes; all styles, Footer, courses, SQL and other contacts stay byte-identical', () => {
  const before = approvedReleaseSources(JSON.parse(readFileSync('qa/header-no-telegram/source-before.json', 'utf8').replace(/^\uFEFF/, '')));
  const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
  const changed = Object.keys(before).filter(path => hash(path) !== before[path]).map(path => path.replaceAll('\\', '/')); expect(changed).toEqual([]);
  writeFileSync('qa/header-no-telegram/protected-audit.json', JSON.stringify({ tracked: Object.keys(before).length, changed, unrelatedChanges: [], footerAndStylesUnchanged: true, otherContactsUnchanged: true }, null, 2));
});
