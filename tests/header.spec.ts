import { expect, test } from '@playwright/test';

const widths = [1440, 1280, 1024, 768, 390, 320];

for (const language of ['ru', 'de', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`header typography, transparency and smooth hover: ${language} ${theme}`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        let indicator: { height: string; radius: string; width: string } | undefined;
        for (const route of ['/', '/learn']) {
          await page.goto(`/#${route}`);
          const header = page.locator('.site-header');
          await expect(header).toHaveCSS('opacity', '1');
          await expect(header).toHaveCSS('background-color', route === '/' || theme === 'dark' ? 'rgba(20, 23, 30, 0.18)' : 'rgba(255, 255, 255, 0.12)');
          await expect(header).toHaveCSS('background-image', 'none');
          await expect(header.locator('.brand-logo')).toHaveAttribute('src', `./assets/brand/linad-logo-${route === '/' ? 'dark' : theme}.svg`);
          await expect(header.locator('select')).toHaveCSS('background-color', route === '/' ? 'rgba(32, 36, 46, 0.65)' : theme === 'light' ? 'rgb(250, 249, 252)' : 'rgb(43, 45, 52)');
          await expect(header).toHaveCSS('backdrop-filter', 'none');
          expect(await header.evaluate((node) => getComputedStyle(node, '::after').content)).toBe('none');
          const brand = (await page.locator('.brand').boundingBox())!;
          const controls = (await page.locator('.header-controls').boundingBox())!;
          expect(brand.x + brand.width).toBeLessThan(controls.x);
          for (const node of await header.locator('.brand-logo, .header-controls, .header-controls button, .header-controls select').all()) await expect(node).toHaveCSS('opacity', '1');
          if (width < 1100 && await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'false') await page.locator('.menu-toggle').click();
          const nav = page.locator('.primary-nav');
          await nav.evaluate(async (node) => {
            node.getBoundingClientRect();
            await Promise.all(node.getAnimations().map((animation) => animation.finished));
          });
          const links = nav.locator('a');
          await expect(links).toHaveCount(4);
          const link = links.nth(1);
          await expect(link).toHaveCSS('font-weight', width < 1100 ? '600' : '500');
          const size = await link.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
          if (width === 1440) expect(size).toBe(23);
          else if (width < 1100) { expect(size).toBeGreaterThanOrEqual(20); expect(size).toBeLessThanOrEqual(22); }
          else { expect(size).toBeGreaterThanOrEqual(20); expect(size).toBeLessThanOrEqual(23); }
          expect(await link.evaluate((node) => getComputedStyle(node).fontFamily)).toContain('Segoe UI');
          const geometry = await links.evaluateAll((nodes) => nodes.map((node) => {
            const box = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            return { x: box.x, y: box.y, width: box.width, height: box.height, padding: style.padding, margin: style.margin, size: style.fontSize, weight: style.fontWeight };
          }));
          if (width >= 1100) {
            if (width >= 1250) await expect(nav).toHaveCSS('column-gap', `${width * .04}px`);
            const bounds = (await nav.boundingBox())!;
            expect(bounds.x).toBeGreaterThan(brand.x + brand.width + 10);
            expect(bounds.x + bounds.width).toBeLessThan(controls.x - 10);
          }
          const activeLink = nav.locator('a[aria-current="page"]');
          await expect(activeLink).toHaveCount(1);
          const line = await activeLink.evaluate((node) => {
            const style = getComputedStyle(node, '::after');
            return { height: style.height, radius: style.borderRadius, width: style.width };
          });
          expect(line.height).toBe('3px');
          expect(line.radius).toBe('4px');
          if (indicator) {
            expect(line.height).toBe(indicator.height);
            expect(line.radius).toBe(indicator.radius);
          } else indicator = line;
          // All four labels at wide desktop and the narrowest menu. The same
          // shared rule is also exercised at every intermediate breakpoint.
          const hoverTargets = [1440, 320].includes(width) ? await links.all() : [link];
          for (const item of hoverTargets) {
            const label = item.locator('.nav-label');
            await expect(label).toHaveCSS('transition-duration', '0.28s');
            await expect(label).toHaveCSS('transition-timing-function', 'cubic-bezier(0.22, 1, 0.36, 1)');
            await item.hover();
            await expect(label).toHaveCSS('transform', 'matrix(1.05, 0, 0, 1.05, 0, 0)');
            await expect(item).toHaveCSS('text-decoration-line', 'none');
            const box = (await label.boundingBox())!;
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(width);
            expect(await links.evaluateAll((nodes) => nodes.map((node) => {
              const rect = node.getBoundingClientRect(); const style = getComputedStyle(node);
              return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, padding: style.padding, margin: style.margin, size: style.fontSize, weight: style.fontWeight };
            }))).toEqual(geometry);
            expect(await links.evaluateAll((nodes) => nodes.filter((node) => getComputedStyle(node, '::after').backgroundColor !== 'rgba(0, 0, 0, 0)').length)).toBe(1);
            await page.mouse.move(width - 1, 0);
            await expect(label).toHaveCSS('transform', 'none');
          }
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          if ([1440, 390, 320].includes(width)) {
            await header.screenshot({ path: `qa/header/header-${route === '/' ? 'home' : 'learn'}-${width}-${language}-${theme}.png` });
            if (route === '/' && width >= 1100) await page.screenshot({ path: `qa/header/home-${width}-${language}-${theme}.png`, fullPage: true });
            if (route === '/' && width === 390) {
              await page.screenshot({ path: `qa/header/menu-390-${language}-${theme}.png` });
              await page.locator('.menu-toggle').click();
              await page.screenshot({ path: `qa/header/home-390-${language}-${theme}.png` });
              await page.locator('.menu-toggle').click();
            }
          }
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await link.hover();
          await expect(link.locator('.nav-label')).toHaveCSS('transform', 'none');
          await expect(link.locator('.nav-label')).toHaveCSS('transition-duration', '0s');
          await page.emulateMedia({ reducedMotion: 'no-preference' });
          await page.mouse.move(width - 1, 0);
        }
      }
      // Clicking/tapping the native language select must not leave a blue ring.
      // Returning with Tab must still give a visible keyboard focus indicator.
      await page.goto('/#/');
      const languageSelect = page.getByRole('combobox');
      await languageSelect.click();
      await expect(languageSelect).toHaveCSS('outline-style', 'none');
      await page.keyboard.press('Escape');
      // Native popup focus is platform-dependent. Start keyboard traversal
      // at the next real control, rather than assuming focus after Escape.
      const themeToggle = page.locator('.header-controls > button:not(.menu-toggle)');
      await themeToggle.focus();
      await page.keyboard.press('Shift+Tab');
      await expect(languageSelect).toBeFocused();
      await expect(languageSelect).toHaveCSS('outline-width', '3px');
      await page.mouse.move(319, 0);
      // Controls animate their colours when the route changes. Compare the
      // settled normal states, not an intermediate frame of that transition.
      await expect(themeToggle).toHaveCSS('background-color', 'rgba(32, 36, 46, 0.65)');
      await expect(themeToggle).toHaveCSS('border-color', 'rgb(72, 75, 86)');
      const headerAppearance = () => page.locator('.home-header').evaluate((node) => {
        const style = getComputedStyle(node);
        const select = getComputedStyle(node.querySelector('select')!);
        const control = getComputedStyle(node.querySelector('.icon-button')!);
        const line = getComputedStyle(node.querySelector('[aria-current="page"]')!, '::after');
        return {
          background: style.backgroundColor, image: style.backgroundImage, blur: style.backdropFilter,
          color: style.color, scheme: style.colorScheme,
          select: [select.backgroundColor, select.color, select.borderColor],
          control: [control.backgroundColor, control.color, control.borderColor],
          active: line.backgroundColor, logo: node.querySelector('img')!.getAttribute('src'),
        };
      });
      const originalAppearance = await headerAppearance();
      await themeToggle.click();
      await page.mouse.move(319, 0);
      await expect(themeToggle).toHaveCSS('transform', 'none');
      await expect(themeToggle).toHaveCSS('background-color', 'rgba(32, 36, 46, 0.65)');
      await expect(themeToggle).toHaveCSS('border-color', 'rgb(72, 75, 86)');
      expect(await headerAppearance()).toEqual(originalAppearance);
    });
  }
}
