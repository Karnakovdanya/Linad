import { expect, test } from '@playwright/test';
import { confirmedContacts } from './confirmed-contacts';

for (const theme of ['light', 'dark'] as const) {
  test(`approved home: photos, composition and transparent logo ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1448, height: 1086 });
    await page.addInitScript((theme) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: 'ru', theme })), theme);
    await page.goto('/#/');
    await expect(page.locator('h1')).toHaveText('Изучай язык для реальной жизни');
    const photos = page.locator('main img');
    await expect(photos).toHaveCount(4);
    expect(await photos.evaluateAll(async (images) => Promise.all(images.map(async (image) => {
      const img = image as HTMLImageElement;
      await img.decode();
      return { file: img.getAttribute('src')?.split('/').pop(), width: img.naturalWidth };
    })))).toEqual([
      { file: 'hero.png', width: 2048 },
      { file: 'learning-card.png', width: 1671 },
      { file: 'tutors-card.png', width: 1672 },
      { file: 'telegram-card.png', width: 1672 },
    ]);
    await expect(page.locator('.home-photo-card')).toHaveCount(3);
    expect(await page.locator('.home-photo-card').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(['#/learn', '#/tutors', confirmedContacts.projectTelegram]);
    await expect(page.locator('.learning-steps li')).toHaveCount(6);
    await expect(page.locator('.home-telegram [data-contact="projectTelegram"]')).toHaveAttribute('href', confirmedContacts.projectTelegram);
    await expect(page.locator('.home-telegram [data-contact="authorTelegram"]')).toHaveAttribute('href', confirmedContacts.authorTelegram);
    await expect(page.locator('.home-page .image-placeholder, .home-page .pending-state')).toHaveCount(0);
    const boxes = await Promise.all(['.home-hero', '.home-features', '.home-learning', '.home-telegram', '.site-footer'].map((selector) => page.locator(selector).boundingBox()));
    for (let i = 1; i < boxes.length; i++) expect(boxes[i]!.y).toBeGreaterThanOrEqual(boxes[i - 1]!.y + boxes[i - 1]!.height - 1);
    await expect(page.locator('.brand')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const alpha = await page.locator('.brand-logo').evaluate(async (node) => {
      const image = node as HTMLImageElement;
      await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = 965; canvas.height = 273;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(image, 0, 0);
      const corners = [[0, 0], [964, 0], [0, 272], [964, 272]].map(([x, y]) => ctx.getImageData(x!, y!, 1, 1).data[3]);
      const pixels = ctx.getImageData(0, 0, 965, 273).data;
      let opaque = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i]! > 200) opaque++;
      return { corners, coverage: opaque / (965 * 273) };
    });
    expect(alpha.corners).toEqual([0, 0, 0, 0]);
    expect(alpha.coverage).toBeGreaterThan(.08);
    expect(alpha.coverage).toBeLessThan(.6);
    await page.screenshot({ path: `qa/home-approved/reference-1448-ru-${theme}.png`, fullPage: true });
  });
}
