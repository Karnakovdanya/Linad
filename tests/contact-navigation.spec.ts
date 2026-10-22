import { expect, test } from '@playwright/test';
import { confirmedContacts } from './confirmed-contacts';

for (const language of ['ru', 'de', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`mobile contact links open the supplied destinations safely: ${language} ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      // Intercept destinations: check real tap/new-tab behaviour without contacting or messaging anyone.
      await context.route('https://**/*', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Contact destination</title>' }));
      await context.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4173/#/author');
      const section = page.locator('.contacts-section');
      for (const contact of ['authorTelegram', 'github', 'linkedin', 'whatsapp', 'behance'] as const) {
        const link = section.locator(`[data-contact="${contact}"]`);
        const box = await link.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        const opened = page.waitForEvent('popup');
        await link.tap();
        const popup = await opened;
        await expect(popup).toHaveURL(contact === 'whatsapp' ? 'https://wa.me/41765389162' : confirmedContacts[contact]);
        expect(await popup.evaluate(() => window.opener === null)).toBe(true);
        await popup.close();
      }
      await page.goto('http://127.0.0.1:4173/#/');
      await page.locator('.menu-toggle').tap();
      await expect(page.locator('.primary-nav a')).toHaveCount(4);
      await expect(page.locator('.primary-nav a[href^="https://t.me/"]')).toHaveCount(0);
      await page.locator('.primary-nav a[href="#/"]').tap();
      await expect(page).toHaveURL(/#\/$/);
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
      await page.goto('http://127.0.0.1:4173/#/tutors');
      // The approved demo catalogue no longer assigns the author's contacts to tutors.
      await expect(page.locator('.tutor-card .tutor-demo')).toHaveCount(5);
      await expect(page.locator('main [data-contact="email"]')).toHaveCount(0);
      await page.locator('.tutor-card[data-tutor-id="anna-mueller"] a').tap();
      await expect(page.locator('.tutor-direct-contact')).toHaveCount(0);
      await expect(page.locator('[data-tutor-contact]')).toHaveCount(0);
      await expect(page.locator('form')).toHaveCount(0);
      await context.close();
    });
  }
}
