import { expect, test } from '@playwright/test';

for (const width of [320, 390, 768, 1440]) {
  test(`approved logos switch without reload at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      if (!localStorage.getItem('linad.preferences.v1')) localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: 'ru', theme: 'light' }));
    });
    // Inner pages keep their original theme-dependent variants.
    await page.goto('/#/learn');
    const marker = await page.evaluate(() => {
      const marker = crypto.randomUUID();
      document.documentElement.dataset.logoTestDocument = marker;
      return marker;
    });
    for (const theme of ['light', 'dark'] as const) {
      const logo = page.locator('.brand-logo');
      await expect(logo).toHaveAttribute('src', `./assets/brand/linad-logo-${theme}.svg`);
      const pixels = await logo.evaluate(async (node) => {
        const img = node as HTMLImageElement;
        await img.decode();
        const canvas = document.createElement('canvas'); canvas.width = 965; canvas.height = 273;
        const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0);
        const rgba = (x: number, y: number) => [...ctx.getImageData(x, y, 1, 1).data];
        const all = ctx.getImageData(0, 0, 965, 273).data;
        const border: number[] = [];
        for (let x = 0; x < 965; x++) border.push(all[x * 4 + 3]!, all[((272 * 965) + x) * 4 + 3]!);
        for (let y = 0; y < 273; y++) border.push(all[(y * 965) * 4 + 3]!, all[((y * 965) + 964) * 4 + 3]!);
        return { borderMax: Math.max(...border), ink: rgba(30, 60), empty: rgba(360, 120), dHole: rgba(820, 100), tagline: rgba(14, 245), width: img.naturalWidth, height: img.naturalHeight };
      });
      expect(pixels.borderMax).toBe(0);
      expect(pixels.empty[3]).toBe(0);
      expect(pixels.dHole[3]).toBe(0);
      expect(pixels.ink).toEqual(theme === 'light' ? [22, 25, 44, 255] : [248, 247, 252, 255]);
      expect(pixels.tagline[3]).toBe(255);
      expect([pixels.width, pixels.height]).toEqual([965, 273]);
      const box = await logo.boundingBox();
      expect(box!.width / box!.height).toBeCloseTo(965 / 273, 2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('html')).toHaveAttribute('data-logo-test-document', marker);
      await page.locator('.site-header').screenshot({ path: `qa/logo/header-${width}-${theme}.png` });
      if (theme === 'light') await page.getByRole('button', { name: 'Включить тёмную тему' }).click();
    }
    await page.reload();
    await expect(page.locator('.brand-logo')).toHaveAttribute('src', './assets/brand/linad-logo-dark.svg');
    await page.goto('/#/');
    await page.getByRole('button', { name: 'Включить светлую тему' }).click();
    await expect(page.locator('.brand-logo')).toHaveAttribute('src', './assets/brand/linad-logo-dark.svg');
    await page.goto('/#/learn');
    await expect(page.locator('.brand-logo')).toHaveAttribute('src', './assets/brand/linad-logo-light.svg');
  });
}

test('transparent logo files contain paths and produce both theme previews', async ({ page, request }) => {
  for (const theme of ['light', 'dark']) {
    const response = await request.get(`/assets/brand/linad-logo-${theme}.svg`);
    expect(response.status()).toBe(200);
    const source = await response.text();
    expect(source).toContain('viewBox="0 0 965 273"');
    expect(source).toContain('<path');
    expect(source).not.toMatch(/<(image|filter|rect|text)\b/);
    expect(source).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
    const pngResponse = await request.get(`/assets/brand/linad-logo-${theme}.png`);
    expect(pngResponse.status()).toBe(200);
    const png = await pngResponse.body();
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([3860, 1092]);
    expect(png[25]).toBe(6); // PNG RGBA, with a real alpha channel.
  }
  await page.setViewportSize({ width: 1029, height: 674 });
  await page.goto('/#/');
  await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;font:16px Segoe UI;background:#eee}section{padding:16px 32px}p{margin:0 0 10px}img{display:block;width:965px;height:273px}section:first-child{background:#E6DDEE;color:#25283B}section:last-child{background:#24262D;color:#F2F2F4}</style><section><p>LINAD · Светлая тема</p><img src="/assets/brand/linad-logo-light.svg" alt="LINAD"></section><section><p>LINAD · Тёмная тема</p><img src="/assets/brand/linad-logo-dark.svg" alt="LINAD"></section>`);
  await page.locator('img').evaluateAll(async (images) => Promise.all(images.map((img) => (img as HTMLImageElement).decode())));
  await page.screenshot({ path: 'qa/logo/both-themes.png', fullPage: true });
});
