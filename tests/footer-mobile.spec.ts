import { expect, test, type Page } from '@playwright/test';
import { confirmedContacts } from './confirmed-contacts';

// Check the actual hover result against Header, including the absence of
// movement in the portrait, subtitle and surrounding link hit areas.
async function footerGeometry(page: Page) {
  return page.locator('.author-credit, .author-avatar, .author-avatar img, .author-credit-text > span, .footer-nav a, .copyright').evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return [box.x, box.y, box.width, box.height];
  }));
}

const routes = ['/', '/learn', '/tutors', '/profile', '/author', '/unknown-page'];
const labels = {
  ru: ['Об авторе', 'Telegram', 'Профиль'],
  de: ['Über den Autor', 'Telegram', 'Profil'],
  en: ['About the author', 'Telegram', 'Profile'],
};

for (const language of ['ru', 'de', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`one footer on every route: ${language} ${theme}`, async ({ page, context }) => {
      test.setTimeout(90_000);
      await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      let markup: string | undefined;
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
        let geometry: number[] | undefined;
        for (const route of routes) {
          await page.goto(`/#${route}`);
          const footer = page.getByRole('contentinfo');
          await expect(footer).toHaveCount(1);
          const portrait = footer.locator('.author-credit img');
          await portrait.evaluate((img) => (img as HTMLImageElement).decode());
          await expect(portrait).toHaveAttribute('src', './assets/danil-author.png');
          await expect(footer.locator('.author-credit strong')).toHaveText('Daniil');
          await expect(footer.locator('.footer-nav a')).toHaveText(labels[language]);
          await expect(footer.locator('.contact-icon, svg, .footer-contact')).toHaveCount(0);
          await expect(footer.locator('[data-contact]:not([data-contact="projectTelegram"])')).toHaveCount(0);
          const currentMarkup = await footer.evaluate((node) => node.outerHTML);
          if (markup) expect(currentMarkup, route).toBe(markup);
          else markup = currentMarkup;

          const boxes = await footer.evaluate((node) => {
            const root = node.getBoundingClientRect();
            return ['.author-credit', '.footer-nav', '.copyright'].map((selector) => {
              const box = node.querySelector(selector)!.getBoundingClientRect();
              return { x: box.x - root.x, y: box.y - root.y, width: box.width, height: box.height };
            });
          });
          const [author, nav, copyright] = boxes;
          const dimensions = boxes.flatMap((box) => [box.x, box.y, box.width, box.height]);
          if (geometry) dimensions.forEach((value, index) => expect(Math.abs(value - geometry![index]!), route).toBeLessThan(1));
          else geometry = dimensions;
          expect(Math.abs(nav!.x + nav!.width / 2 - width / 2)).toBeLessThan(1);
          if (width < 900) {
            expect(author!.y + author!.height).toBeLessThan(nav!.y);
            expect(nav!.y + nav!.height).toBeLessThan(copyright!.y);
          } else {
            expect(author!.x + author!.width).toBeLessThan(nav!.x);
            expect(nav!.x + nav!.width).toBeLessThan(copyright!.x);
            expect(Math.abs(author!.y + author!.height / 2 - nav!.y - nav!.height / 2)).toBeLessThan(1);
            expect(Math.abs(copyright!.y + copyright!.height / 2 - nav!.y - nav!.height / 2)).toBeLessThan(1);
          }
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
          if ([390, 1440].includes(width) && ['/', '/learn', '/tutors'].includes(route)) {
            await footer.screenshot({ path: `qa/footer-mobile/footer-${route === '/' ? 'home' : route.slice(1)}-${width}-${language}-${theme}.png` });
          }
          if (route === '/' && width === 1440) {
            await page.evaluate(() => scrollTo(0, 0));
            await page.locator('img').evaluateAll((images) => Promise.all(images.map((img) => (img as HTMLImageElement).decode())));
            await page.screenshot({ path: `qa/footer-mobile/home-1440-${language}-${theme}.png`, fullPage: true });
          }
        }
        const footer = page.locator('.site-footer');
        await footer.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        const stableGeometry = await footerGeometry(page);
        const approvedMotion = await page.locator('.primary-nav .nav-label').first().evaluate((node) => {
          const style = getComputedStyle(node);
          const link = getComputedStyle(node.parentElement!);
          return { transition: style.transition, family: link.fontFamily };
        });
        for (const link of await footer.locator('a').all()) {
          const animatedLabel = link.locator('strong, :scope > span:not(.author-avatar):not(.author-credit-text)');
          await expect(link).toHaveCSS('text-decoration-line', 'none');
          await expect(animatedLabel).toHaveCSS('transition', approvedMotion.transition);
          await expect(animatedLabel).toHaveCSS('font-family', approvedMotion.family);
          await expect(animatedLabel).toHaveCSS('font-weight', await link.locator('strong').count() ? '600' : '500');
          await link.hover();
          await expect(animatedLabel).toHaveCSS('transform', 'matrix(1.05, 0, 0, 1.05, 0, 0)');
          expect(await footerGeometry(page)).toEqual(stableGeometry);
          await expect(link).toHaveCSS('text-decoration-line', 'none');
          await expect(animatedLabel).toHaveCSS('text-decoration-line', 'none');
          await page.mouse.down();
          await expect(link).toHaveCSS('text-decoration-line', 'none');
          await page.mouse.move(0, 0);
          await page.mouse.up();
          await expect(animatedLabel).toHaveCSS('transform', 'none');
          await link.focus();
          // Step back first: Tab after the last page link enters browser chrome.
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          await expect(link).toBeFocused();
          await expect(link).toHaveCSS('outline-style', 'solid');
          await expect(link).toHaveCSS('outline-width', '3px');
          await expect(link).toHaveCSS('text-decoration-line', 'none');
        }
        await expect(footer.locator('.author-avatar')).toHaveCSS('width', '52px');
        await expect(footer.locator('.author-avatar')).toHaveCSS('height', '52px');
        await expect(footer.locator('.author-avatar')).toHaveCSS('overflow', 'hidden');
      }

      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const link of await page.locator('.site-footer a').all()) {
        await link.hover();
        const label = link.locator('strong, :scope > span:not(.author-avatar):not(.author-credit-text)');
        await expect(label).toHaveCSS('transform', 'none');
        await expect(label).toHaveCSS('transition-duration', '0s');
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      // Exercise the actual footer links, including a safe new tab for Telegram.
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/#/learn');
      const nav = page.locator('.footer-nav');
      await nav.getByRole('link', { name: labels[language][0], exact: true }).click();
      await expect(page).toHaveURL(/#\/author$/);
      await nav.getByRole('link', { name: labels[language][2], exact: true }).click();
      await expect(page).toHaveURL(/#\/auth\/login$/);
      await expect(page.locator('.account-auth-form input[type="email"]')).toBeVisible();
      const telegram = nav.getByRole('link', { name: 'Telegram', exact: true });
      await expect(telegram).toHaveAttribute('href', confirmedContacts.projectTelegram);
      await expect(telegram).toHaveAttribute('target', '_blank');
      await expect(telegram).toHaveAttribute('rel', 'noopener noreferrer');
      // Do not call a third-party service during local QA.
      await context.route('https://t.me/**', (route) => route.fulfill({ body: '<!doctype html><title>Local link check</title>' }));
      const popupReady = context.waitForEvent('page');
      await telegram.click();
      const popup = await popupReady;
      await popup.waitForLoadState();
      expect(popup.url()).toBe(confirmedContacts.projectTelegram);
      expect(await popup.evaluate(() => window.opener === null)).toBe(true);
      await popup.close();
    });

    test(`unified mobile hero: ${language} ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      await page.goto('http://127.0.0.1:4173/#/');
      for (const width of [320, 375, 390, 430, 768]) {
        await page.setViewportSize({ width, height: 844 });
        const photo = page.locator('.hero-photo');
        await photo.evaluate((node) => (node as HTMLImageElement).decode());
        await expect(photo).toHaveAttribute('src', './assets/home/hero.png');
        await expect(photo).toHaveCSS('object-fit', 'cover');
        await expect(page.locator('.home-header')).not.toHaveCSS('background-image', /url\(/);
        const image = (await photo.boundingBox())!;
        expect(Math.abs(image.y)).toBeLessThan(1);
        const header = (await page.locator('.home-header').boundingBox())!;
        const heading = (await page.locator('h1').boundingBox())!;
        const actions = (await page.locator('.hero-actions').boundingBox())!;
        const hero = (await page.locator('.home-hero').boundingBox())!;
        expect(heading.y).toBeGreaterThan(header.y + header.height + 20);
        expect(actions.y + actions.height).toBeLessThan(image.y + image.height - 20);
        expect(heading.x).toBeGreaterThanOrEqual(width * .05 - 1);
        expect(heading.x + heading.width).toBeLessThanOrEqual(width * .95 + 1);
        expect(hero.y + hero.height).toBeLessThanOrEqual(844);
        if (width < 768) {
          const size = await page.locator('h1').evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
          expect(size).toBeGreaterThanOrEqual(28);
          expect(size).toBeLessThanOrEqual(34);
        }
        const controls = await page.locator('.brand, .header-controls').all();
        const logo = (await controls[0]!.boundingBox())!;
        const switches = (await controls[1]!.boundingBox())!;
        expect(logo.x + logo.width).toBeLessThanOrEqual(switches.x);
        expect(Math.abs(logo.y + logo.height / 2 - switches.y - switches.height / 2)).toBeLessThan(1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (width === 390) {
          await page.screenshot({ path: `qa/footer-mobile/home-390-${language}-${theme}.png` });
          await page.screenshot({ path: `qa/footer-mobile/home-390-full-${language}-${theme}.png`, fullPage: true });
          const headingBeforeMenu = await page.locator('h1').boundingBox();
          await page.locator('.menu-toggle').tap();
          await page.locator('.primary-nav').evaluate(async (node) => {
            node.getBoundingClientRect();
            await Promise.all(node.getAnimations().map((animation) => animation.finished));
          });
          expect(await page.locator('h1').boundingBox()).toEqual(headingBeforeMenu);
          expect(Math.abs((await photo.boundingBox())!.y)).toBeLessThan(1);
          await page.screenshot({ path: `qa/footer-mobile/menu-390-${language}-${theme}.png` });
          await page.locator('.menu-toggle').tap();
          await page.locator('.primary-nav').evaluate(async (node) => {
            node.getBoundingClientRect();
            await Promise.all(node.getAnimations().map((animation) => animation.finished));
          });
        }
      }
      // Short viewport: content may grow the hero rather than being clipped.
      await page.setViewportSize({ width: 320, height: 500 });
      const hero = (await page.locator('.home-hero').boundingBox())!;
      const actions = (await page.locator('.hero-actions').boundingBox())!;
      expect(actions.y + actions.height).toBeLessThan(hero.y + hero.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await context.close();
    });
  }
}
