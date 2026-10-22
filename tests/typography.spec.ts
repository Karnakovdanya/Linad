import { readFileSync, writeFileSync } from 'node:fs';
import { expect, test, type Locator, type Page } from '@playwright/test';

const widths = [320, 390, 768, 1024, 1440];
const routes = ['/', '/learn', '/tutors', '/profile', '/author', '/unknown-page'];
const selectors = ['body', 'h1', '.lead', '.hero-description', '.hero-actions .button', '.photo-card-copy h2', '.photo-card-copy p', '.learning-overview .button', '.learning-overview h2', '.learning-overview p', '.learning-steps h3', '.learning-steps p', '.telegram-banner h2', '.telegram-banner p', '.telegram-banner .button', '.surface h2', '.surface p', '.pending-state h2', '.pending-state p', '.text-link', '.button', '.language-select select', '.copyright'];
type Font = { size: string; weight: string; lineHeight: string; family: string; spacing: string };
type Navigation = { family: string; size: string; weight: string; spacing: string; lineHeight: string; padding: string; transition: string; origin: string }[];
type Record = { language: string; theme: string; width: number; route: string; data: { [selector: string]: Font }; nav: Navigation; cards: { width: number; height: number }[] };
const before = JSON.parse(readFileSync('qa/typography-menu/before.json', 'utf8')) as Record[];

async function settleMenu(nav: Locator) {
  await nav.evaluate(async (node) => { node.getBoundingClientRect(); await Promise.all(node.getAnimations().map((animation) => animation.finished)); });
}

async function navigation(page: Page): Promise<Navigation> {
  return page.locator('.primary-nav a').evaluateAll((nodes) => nodes.map((node) => {
    const style = getComputedStyle(node); const label = getComputedStyle(node.querySelector('.nav-label')!);
    return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, spacing: style.letterSpacing, lineHeight: style.lineHeight, padding: style.padding, transition: label.transition, origin: label.transformOrigin };
  }));
}

async function layout(page: Page) {
  return page.locator('.site-header, .home-hero, .hero-photo, .hero-inner h1, .hero-actions, .home-features, .page-content, .site-footer').evaluateAll((nodes) => nodes.map((node) => {
    const r = node.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height];
  }));
}

for (const language of ['ru', 'de', 'en']) for (const theme of ['light', 'dark']) {
  test(`typography and compact overlay: ${language} ${theme}`, async ({ page }) => {
    // Thirty page/viewport combinations plus screenshots and keyboard flows.
    test.setTimeout(120_000);
    await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
    const records: Record[] = [];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(`/#${route}`);
        // Tutors is now a lazy route: wait for its heading before collecting computed styles.
        await expect(page.locator('h1')).toBeVisible();
        await page.mouse.move(0, 0);
        await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => { scrollTo(0, 0); resolve(); }))));
        const previous = before.find((record) => record.language === language && record.theme === theme && record.width === width && record.route === route)!;
        const data = await page.evaluate((selectors) => Object.fromEntries(selectors.flatMap((selector) => {
          const node = document.querySelector(selector); if (!node) return [];
          const style = getComputedStyle(node); return [[selector, { size: style.fontSize, weight: style.fontWeight, lineHeight: style.lineHeight, family: style.fontFamily, spacing: style.letterSpacing }]];
        })), selectors) as Record['data'];
        const mobile = width < 768;
        expect(data.body!.size).toBe(mobile ? '16px' : '18px');
        expect(data.body!.weight).toBe('400');
        expect(data.body!.family).toBe(previous.data.body!.family);
        const heading = parseFloat(data.h1!.size);
        if (route === '/profile') {
          // A guest now sees the approved Auth hero: page-title token + 3px.
          const titleToken = Math.min(mobile ? 34 : 44, Math.max(mobile ? 28 : 36, width * (mobile ? .08 : .031)));
          expect(heading).toBeCloseTo(titleToken + 3, 1);
        } else {
          expect(heading).toBeGreaterThanOrEqual(mobile ? 28 : 36);
          expect(heading).toBeLessThanOrEqual(mobile ? 34 : 44);
        }
        expect(data.h1!.weight).toBe('700');
        for (const button of await page.locator('main .button').all()) {
          await expect(button).toHaveCSS('font-size', mobile ? '16px' : '17px');
          await expect(button).toHaveCSS('font-weight', '600');
        }
        const cards = await page.locator('.home-photo-card').evaluateAll((nodes) => nodes.map((node) => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
        if (route === '/') {
          cards.forEach((card, index) => {
            expect(card.width).toBe(previous.cards[index]!.width);
            expect(Math.abs(card.height - previous.cards[index]!.height)).toBeLessThan(.1);
          });
          await expect(page.locator('.photo-card-copy h2').first()).toHaveCSS('font-size', mobile ? '20px' : '22px');
          await expect(page.locator('.photo-card-copy p').first()).toHaveCSS('font-size', mobile ? '15.2px' : '17px');
          for (const overlay of await page.locator('.photo-card-overlay').all()) await expect(overlay).toHaveCSS('background-image', 'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0) 60%)');
        }
        const toggle = page.locator('.menu-toggle');
        const nav = page.locator('.primary-nav');
        const geometry = await layout(page);
        const scrollBefore = await page.evaluate(() => scrollY);
        if (width < 1100) {
          await expect(toggle).toHaveCSS('transform', 'none');
          await toggle.click(); await page.mouse.move(0, 0); await settleMenu(nav);
          await expect(toggle).toHaveCSS('transform', 'none');
          expect(await layout(page), 'Opening the overlay must not move page content').toEqual(geometry);
          if (route === '/') expect(await page.evaluate(() => scrollY), 'The Hero must stay at the same viewport position').toBe(scrollBefore);
          await expect(nav).toHaveCSS('position', 'absolute');
          await expect(nav).toHaveCSS('width', width <= 480 ? '210px' : '260px');
          await expect(nav).toHaveCSS('background-color', 'rgba(15, 20, 30, 0.7)');
          await expect(nav).toHaveCSS('backdrop-filter', 'blur(6px)');
          await expect(nav).toHaveCSS('transition-duration', '0.22s, 0.22s, 0s');
          const box = (await nav.boundingBox())!; const button = (await toggle.boundingBox())!;
          expect(box.x + box.width).toBeCloseTo(button.x + button.width, 1);
          expect(box.y - button.y - button.height).toBe(8);
          const links = await nav.locator('a').evaluateAll((nodes) => nodes.map((node) => {
            const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height };
          }));
          links.forEach((link, i) => {
            expect(link.x).toBeGreaterThanOrEqual(box.x);
            expect(link.x + link.width).toBeLessThanOrEqual(box.x + box.width);
            if (i) expect(link.y - links[i - 1]!.y - links[i - 1]!.height).toBeCloseTo(route === '/' || width < 390 ? 4 : 8, 1);
          });
        }
        const navFonts = await navigation(page);
        // Desktop is now capped at 23px/500 by explicit user approval.
        // Keep the saved mobile typography, line-height ratio and other
        // Header properties; normalize hidden/visible center serialization.
        // The approved Header removed the fourth (Telegram) entry.
        const expectedNavigation = previous.nav.filter((_, index) => index !== 3).map((font) => {
          if (width < 1100) return { ...font, origin: 'center' };
          const size = Math.min(parseFloat(font.size), 23);
          const lineHeight = Number((parseFloat(font.lineHeight) / parseFloat(font.size) * size).toFixed(4));
          return { ...font, size: `${size}px`, weight: '500', lineHeight: `${lineHeight}px`, origin: 'center' };
        });
        expect(navFonts.map((font) => ({ ...font, origin: 'center' }))).toEqual(expectedNavigation);
        records.push({ language, theme, width, route, data, nav: navFonts, cards });
        if (route === '/' && [390, 768, 1440].includes(width)) await page.screenshot({ path: `qa/typography-menu/${width < 1100 ? 'menu' : 'home'}-${width}-${language}-${theme}.png`, fullPage: width === 1440 });
        if (width < 1100) {
          await page.keyboard.press('Escape'); await settleMenu(nav);
          await expect(nav).toBeHidden(); await expect(toggle).toBeFocused();
          expect(await layout(page), 'Closing the overlay must not move page content').toEqual(geometry);
          await toggle.click(); await settleMenu(nav); await toggle.click(); await settleMenu(nav);
          await expect(nav).toBeHidden();
          if (route === '/' && width === 390) await page.screenshot({ path: `qa/typography-menu/home-390-${language}-${theme}.png` });
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth)).toBe(true);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/');
    for (const [index, route] of [[0, '/'], [1, '/learn'], [2, '/tutors'], [3, '/auth/login']] as const) {
      await page.locator('.menu-toggle').click(); await settleMenu(page.locator('.primary-nav'));
      await page.locator('.primary-nav a').nth(index).click();
      await expect(page).toHaveURL(new RegExp(`#${route}$`));
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
      await page.goto('/#/');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.menu-toggle').click();
    await expect(page.locator('.primary-nav')).toHaveCSS('transition-duration', '0s');
    writeFileSync(`qa/typography-menu/after-${language}-${theme}.json`, JSON.stringify(records, null, 2));
  });
}
