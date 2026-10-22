import { readFileSync } from 'node:fs';
import { expect, test, type Locator } from '@playwright/test';

const widths = [320, 375, 390, 430, 480, 768, 1024, 1440];
const before = JSON.parse(readFileSync('qa/home-three-fixes/before-measurements.json', 'utf8')) as Record<string, {
  hero: { x: number; y: number; width: number; height: number };
  cards: { width: number; height: number; src: string }[];
}>;
const labels = {
  ru: ['Главная', 'Обучение', 'Репетиторы', 'Войти'],
  de: ['Startseite', 'Lernen', 'Lehrkräfte', 'Anmelden'],
  en: ['Home', 'Learning', 'Tutors', 'Sign in'],
};

async function settleMenu(nav: Locator) {
  await nav.evaluate(async (node) => {
    node.getBoundingClientRect();
    await Promise.all(node.getAnimations().map((animation) => animation.finished));
  });
}

for (const language of ['ru', 'de', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`home: content height, overlay menu, exact 90% cards: ${language} ${theme}`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.mouse.move(0, 0);
        await page.goto('/#/');
        await page.locator('img').evaluateAll((images) => Promise.all(images.map((image) => (image as HTMLImageElement).decode())));
        const hero = page.locator('.home-hero');
        const photo = page.locator('.hero-photo');
        const heading = page.locator('h1');
        await expect.poll(async () => Math.abs((await photo.boundingBox())!.y)).toBeLessThan(1);
        await expect(photo).toHaveCSS('object-fit', 'cover');
        await expect(photo).toHaveAttribute('src', './assets/home/hero.png');
        await expect(page.locator('.hero-actions a')).toHaveCount(2);
        const actions = (await page.locator('.hero-actions').boundingBox())!;
        const heroBox = (await hero.boundingBox())!;
        expect(actions.y + actions.height).toBeLessThan(heroBox.y + heroBox.height - 20);

        // The photos, card geometry and icons retain their previous layout.
        const cards = await page.locator('.home-photo-card').evaluateAll((nodes) => nodes.map((node) => ({
          width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height,
          src: node.querySelector('img')!.getAttribute('src')!.replace(/^\./, ''),
        })));
        cards.forEach((card, index) => {
          // The historical photo baseline predates the 480px breakpoint.
          // Existing widths retain their exact photo/geometry comparisons.
          const original = before[`${language}-${theme}-${width}`]?.cards[index];
          if (!original) return;
          expect(card.width).toBe(original.width);
          expect(card.src).toBe(original.src);
          expect(Math.abs(card.height - original.height)).toBeLessThan(.1);
        });
        await expect(page.locator('.home-feature-icon')).toHaveCount(3);
        for (const overlay of await page.locator('.photo-card-overlay').all()) {
          await expect(overlay).toHaveCSS('background-image', 'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0) 60%)');
          await expect(overlay).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
          await expect(overlay).toHaveCSS('opacity', '1');
        }
        for (const node of await page.locator('.photo-card-copy h2, .photo-card-copy p').all()) {
          await expect(node).toHaveCSS('color', 'rgb(255, 255, 255)');
          await expect(node).toHaveCSS('text-shadow', 'none');
        }
        for (const node of await page.locator('.home-photo-card, .home-photo-card > img, .photo-card-overlay, .photo-card-copy').all()) {
          await expect(node).toHaveCSS('filter', 'none');
          await expect(node).toHaveCSS('backdrop-filter', 'none');
          expect(await node.evaluate((element) => getComputedStyle(element, '::before').content)).toBe('none');
          expect(await node.evaluate((element) => getComputedStyle(element, '::after').content)).toBe('none');
        }

        if (width < 1100) {
          const innerHeight = (await page.locator('.hero-inner').boundingBox())!.height;
          expect(Math.abs(heroBox.height - innerHeight)).toBeLessThan(1);
          // A taller or shorter window must not manufacture extra Hero space.
          for (const height of [500, 1200, 900]) {
            await page.setViewportSize({ width, height });
            expect(Math.abs((await hero.boundingBox())!.height - heroBox.height)).toBeLessThan(1);
          }
          const toggle = page.locator('.menu-toggle');
          const nav = page.locator('.primary-nav');
          const controls = (await page.locator('.header-controls').boundingBox())!;
          await expect(nav).toBeHidden();
          await toggle.click();
          await page.mouse.move(0, 0);
          await expect(toggle).toHaveCSS('transform', 'none');
          await expect(toggle).toHaveAttribute('aria-expanded', 'true');
          await expect(nav).toHaveCSS('transition-duration', '0.22s, 0.22s, 0s');
          await settleMenu(nav);
          await expect(nav.locator('a')).toHaveText(labels[language]);
          const panel = (await nav.boundingBox())!;
          expect(panel.x + panel.width).toBeCloseTo(width * .95, 1);
          expect(panel.width).toBe(width <= 480 ? 210 : 260);
          expect(panel.y).toBe(68);
          expect((await page.locator('.header-controls').boundingBox())!).toEqual(controls);
          const links = await nav.locator('a').evaluateAll((nodes) => nodes.map((node) => {
            const rect = node.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          }));
          links.forEach((link, index) => {
            expect(link.x).toBeCloseTo(panel.x + 1, 1);
            expect(link.width).toBeCloseTo(panel.width - 2, 1);
            if (index > 0) expect(link.y).toBeGreaterThan(links[index - 1]!.y + links[index - 1]!.height);
          });
          expect((await heading.boundingBox())!.y).toBeCloseTo(heroBox.y + (width < 768 ? 36 : 52), 1);
          await expect.poll(async () => Math.abs((await photo.boundingBox())!.y)).toBeLessThan(1);
          if ([390, 768, 1024].includes(width)) await page.screenshot({ path: `qa/home-three-fixes/menu-${width}-${language}-${theme}.png` });
          // Toggle closes with the same transition; Escape also restores focus.
          await toggle.click();
          await expect(nav).toHaveCSS('transition-duration', '0.22s, 0.22s, 0s');
          await settleMenu(nav);
          await expect(nav).toBeHidden();
          expect((await page.locator('.home-header').boundingBox())!.height).toBe(76);
          await toggle.click();
          await settleMenu(nav);
          await page.keyboard.press('Escape');
          await settleMenu(nav);
          await expect(toggle).toBeFocused();
          await expect(toggle).toHaveAttribute('aria-expanded', 'false');
          await expect(nav).toBeHidden();
          if (width === 390) {
            for (const [index, route] of [[0, '/'], [1, '/learn'], [2, '/tutors'], [3, '/auth/login']] as const) {
              await toggle.click();
              await settleMenu(nav);
              await nav.locator('a').nth(index).click();
              await expect(page).toHaveURL(new RegExp(`#${route}$`));
              await expect(toggle).toHaveAttribute('aria-expanded', 'false');
              await expect(nav).toBeHidden();
              await page.goto('/#/');
            }
            await page.screenshot({ path: `qa/home-three-fixes/home-390-${language}-${theme}.png`, fullPage: true });
          }
        } else {
          expect(heroBox).toEqual(before[`${language}-${theme}-${width}`]!.hero);
          await page.screenshot({ path: `qa/home-three-fixes/hero-1440-${language}-${theme}.png`, clip: { x: 0, y: 0, width, height: Math.ceil(heroBox.y + heroBox.height) } });
          await page.screenshot({ path: `qa/home-three-fixes/home-1440-${language}-${theme}.png`, fullPage: true });
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.locator('.menu-toggle').click();
      await expect(page.locator('.primary-nav')).toHaveCSS('transition-duration', '0s');
      await expect(page.locator('.primary-nav a')).toHaveCount(4);
    });
  }
}
