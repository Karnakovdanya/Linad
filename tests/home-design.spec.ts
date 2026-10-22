import { expect, test } from '@playwright/test';
import { confirmedContacts } from './confirmed-contacts';

for (const language of ['ru', 'de', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`home design refinement: ${language} ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      await page.goto('/#/');
      const bannerImage = await page.locator('.telegram-banner').first().evaluate(async (node) => {
        const url = getComputedStyle(node).backgroundImage.match(/url\("?([^")]+)"?\)/)![1]!;
        const image = new Image(); image.src = url; await image.decode();
        return { url, width: image.naturalWidth, height: image.naturalHeight };
      });
      expect(bannerImage.url).toMatch(/\/assets\/home\/telegram-banner-background\.png$/);
      expect([bannerImage.width, bannerImage.height]).toEqual([2171, 724]);
      for (const width of [320, 390, 768, 1024, 1100, 1280, 1448, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        const header = page.locator('.home-header');
        const photo = page.locator('.hero-photo');
        await photo.evaluate((node) => (node as HTMLImageElement).decode());
        // One photo covers the header, title and buttons at every breakpoint.
        await expect.poll(async () => Math.abs((await photo.boundingBox())!.y)).toBeLessThan(1);
        const buttons = (await page.locator('.hero-actions').boundingBox())!;
        const imageBox = (await photo.boundingBox())!;
        expect(imageBox.y + imageBox.height).toBeGreaterThan(buttons.y + buttons.height);
        const glass = await header.evaluate((node) => getComputedStyle(node).backgroundColor);
        expect(glass).toMatch(/^rgba\(/);
        const cards = await page.locator('.home-photo-card').all();
        const cardBoxes = await Promise.all(cards.map((card) => card.boundingBox()));
        expect(Math.max(...cardBoxes.map((box) => box!.height)) - Math.min(...cardBoxes.map((box) => box!.height))).toBeLessThan(1);
        const steps = await page.locator('.learning-steps li').all();
        for (const step of steps) {
          const arrow = step.locator('.step-connector');
          if (!await arrow.count() || !await arrow.isVisible()) continue;
          const arrowBox = (await arrow.boundingBox())!;
          const titleBox = (await step.locator('h3').boundingBox())!;
          const nextBox = (await step.locator('xpath=following-sibling::li[1]').boundingBox())!;
          expect(arrowBox.x + arrowBox.width).toBeLessThanOrEqual(nextBox.x - 4);
          expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(arrowBox.x);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const telegram = page.locator('.home-telegram');
        const learningBox = (await page.locator('.home-learning').boundingBox())!;
        const telegramBox = (await telegram.boundingBox())!;
        const footerBox = (await page.locator('.site-footer').boundingBox())!;
        const above = telegramBox.y - learningBox.y - learningBox.height;
        const below = footerBox.y - telegramBox.y - telegramBox.height;
        expect(above).toBeGreaterThan(0);
        expect(below).toBeCloseTo(above, 1);
        for (const banner of await telegram.locator('.telegram-banner').all()) {
          await expect(banner).toHaveCSS('background-size', 'cover');
          await expect(banner).toHaveCSS('background-position', '100% 50%');
          await expect(banner).toHaveCSS('background-image', `url("${bannerImage.url}")`);
          await expect(banner.locator('.button')).toHaveAttribute('target', '_blank');
          await expect(banner.locator('.button')).toHaveAttribute('rel', 'noopener noreferrer');
        }
        const footer = page.getByRole('contentinfo');
        await expect(footer.locator('.footer-nav a')).toHaveCount(3);
        await expect(footer.locator('.author-credit')).toHaveCount(1);
        await expect(footer.locator('.contact-icon, .footer-contact')).toHaveCount(0);
        await expect(footer.locator('[data-contact="projectTelegram"]')).toHaveAttribute('href', confirmedContacts.projectTelegram);
        await expect(footer.locator('[data-contact="projectTelegram"]')).toHaveAttribute('rel', 'noopener noreferrer');

        if (width === 1448) {
          const nav = page.locator('.primary-nav a');
          const before = await nav.evaluateAll((links) => links.map((link) => ({ x: link.getBoundingClientRect().x, width: link.getBoundingClientRect().width })));
          await nav.nth(1).hover();
          await expect(nav.nth(1)).toHaveCSS('text-decoration-line', 'none');
          await expect.poll(() => nav.nth(1).locator('.nav-label').evaluate((node) => getComputedStyle(node).transform)).toMatch(/^matrix\(1\.05/);
          expect(await nav.evaluateAll((links) => links.map((link) => ({ x: link.getBoundingClientRect().x, width: link.getBoundingClientRect().width })))).toEqual(before);
          const underlines = await nav.evaluateAll((links) => links.filter((link) => getComputedStyle(link, '::after').backgroundColor !== 'rgba(0, 0, 0, 0)').length);
          expect(underlines).toBe(1);
          await page.mouse.move(0, 0);
        }
        if ([390, 768, 1448].includes(width)) {
          await page.screenshot({ path: `qa/home-refinement/home-${width}-${language}-${theme}.png`, fullPage: true });
          await footer.scrollIntoViewIfNeeded();
          const start = Math.max(0, Math.floor((await telegram.boundingBox())!.y - above));
          const end = (await footer.boundingBox())!;
          await page.screenshot({ path: `qa/home-refinement/telegram-${width}-${language}-${theme}.png`, clip: { x: 0, y: start, width, height: Math.ceil(end.y + end.height - start) } });
          await page.evaluate(() => scrollTo(0, 0));
        }
      }
      await page.setViewportSize({ width: 390, height: 844 });
      const headingBeforeMenu = await page.locator('h1').boundingBox();
      await page.locator('.menu-toggle').click();
      expect(await page.locator('h1').boundingBox()).toEqual(headingBeforeMenu);
      await expect.poll(async () => Math.abs((await page.locator('.hero-photo').boundingBox())!.y)).toBeLessThan(1);
      await page.screenshot({ path: `qa/home-refinement/menu-390-${language}-${theme}.png` });
      await page.keyboard.press('Escape');
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
      await page.goto('/#/author');
      for (const contact of ['github', 'linkedin'] as const) {
        await expect(page.locator(`.contacts-section [data-contact="${contact}"]`)).toHaveAttribute('href', confirmedContacts[contact]);
      }
      await expect(page.locator('.author-contact-email [data-contact="email"]')).toHaveAttribute('href','mailto:danikkarnakov@gmail.com');
    });
  }
}
