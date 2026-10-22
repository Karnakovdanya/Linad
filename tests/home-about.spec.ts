import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homeAboutCopy } from '../src/i18n/home-about';
import { mockSupabase } from './account-helpers';
import { approvedColorPolishSources, approvedMilestoneBackgroundSources, assertApprovedInventory } from './protected-source';

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) {
  test(`home information: readable, localized and responsive ${language}/${theme}`, async ({ page }) => {
    await mockSupabase(page, { language, theme });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/#/');
    const about = page.getByRole('region', { name: homeAboutCopy[language].titleBefore + 'LINAD?' });
    await expect(about).toBeVisible();
    await expect(about.locator('a, button, input')).toHaveCount(0);
    await expect(about.locator('.home-about-eyebrow')).toHaveText(homeAboutCopy[language].eyebrow);
    await expect(about.locator('.home-about-description p')).toHaveText(homeAboutCopy[language].description);
    await expect(about.locator('h3')).toHaveText(homeAboutCopy[language].benefits.map(([title]) => title));
    await expect(about.locator('.home-about-benefits li p')).toHaveText(homeAboutCopy[language].benefits.map(([, description]) => description));
    await expect(about.locator('.home-about-icon svg')).toHaveCount(6);
    expect(await about.evaluate(el => [el.previousElementSibling?.className, el.nextElementSibling?.className])).toEqual(['home-features', 'home-learning']);
    await expect(page.locator('.home-photo-card')).toHaveCount(3);
    await expect(page.locator('.learning-steps li')).toHaveCount(6);
    await expect(page.locator('.telegram-banner')).toHaveCount(2);

    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: width >= 768 ? 1080 : 844 });
      await about.scrollIntoViewIfNeeded();
      const layout = await about.evaluate(el => {
        const box = el.getBoundingClientRect();
        const intro = el.querySelector('.home-about-intro')!.getBoundingClientRect();
        const items = [...el.querySelectorAll('li')].map(item => {
          const { x, y, width, height } = item.getBoundingClientRect(); return { x, y, width, height };
        });
        return { width: box.width, right: box.right, x: box.x, introBottom: intro.bottom, introRight: intro.right, items,
          overflowing: [el, ...el.querySelectorAll('p, h2, h3, li')].some(node => node.scrollWidth > node.clientWidth + 1),
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          background: getComputedStyle(el).backgroundColor,
          surface: getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(),
        };
      });
      expect(layout.x).toBeGreaterThanOrEqual(0); expect(layout.right).toBeLessThanOrEqual(width);
      expect(layout.overflowing).toBe(false); expect(layout.pageOverflow).toBe(false);
      expect(layout.background).toBe(theme === 'light' ? 'rgb(250, 249, 252)' : 'rgb(43, 45, 52)');
      const [first, second, third] = layout.items;
      if (width === 1440) expect(first!.x).toBeGreaterThan(layout.introRight);
      else expect(first!.y).toBeGreaterThan(layout.introBottom);
      if (width > 600) {
        expect(first!.y).toBe(second!.y); expect(second!.x).toBeGreaterThan(first!.x + first!.width);
        expect(third!.x).toBe(first!.x); expect(third!.y).toBeGreaterThan(first!.y);
      } else for (let i = 1; i < layout.items.length; i++) {
        expect(layout.items[i]!.x).toBe(first!.x);
        expect(layout.items[i]!.y).toBeGreaterThan(layout.items[i - 1]!.y + layout.items[i - 1]!.height);
      }
      if (width === 1440 || width === 390) await about.screenshot({ path: `qa/home-about/${language}-${theme}-${width}.png`, animations: 'disabled' });
    }
    expect(errors).toEqual([]);
  });
}

test('home copy responds to existing language/theme controls and only the first welcome illustration grows', async ({ page }) => {
  await mockSupabase(page, { language: 'ru' }); await page.goto('/#/');
  const about = page.locator('.home-about');
  for (const language of ['de', 'en', 'ru'] as const) {
    await page.locator('.language-select select').selectOption(language);
    await expect(about.locator('h2')).toHaveText(homeAboutCopy[language].titleBefore + 'LINAD?');
  }
  await page.getByRole('button', { name: 'Включить тёмную тему', exact: true }).click();
  await expect(about).toHaveCSS('background-color', 'rgb(43, 45, 52)');
  await page.getByRole('button', { name: 'Включить светлую тему', exact: true }).click();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1080 }); await page.goto('/#/'); await page.locator('.lin-launcher').click();
    const art = page.locator('.lin-welcome-art .lin-art');
    await expect(art).toHaveCSS('width', width === 1440 ? '330px' : '280px');
    const box = (await art.boundingBox())!; expect(box.width / box.height).toBeCloseTo(1.5, 2);
    await expect(art.locator('img')).toHaveAttribute('src', /\/welcome.png$/);
    await art.locator('img').evaluate((img: HTMLImageElement) => img.decode());
    await page.locator('.lin-window').screenshot({ path: `qa/home-about/lin-larger-${width}.png`, animations: 'disabled' });
    await page.locator('[data-topic=about]').click(); await page.getByRole('button', { name: 'К вопросам', exact: true }).click();
    await expect(art).toHaveCSS('width', width === 1440 ? '148px' : '112px');
    await expect(art).toHaveAttribute('data-pose', 'hello');
    await page.keyboard.press('Escape'); await expect(page.locator('.lin-window')).toHaveCount(0);
  }
});

test('scope audit: existing home blocks and assistant behavior are unchanged', () => {
  const before: Record<string, string> = approvedColorPolishSources(JSON.parse(readFileSync('qa/home-about/before.json', 'utf8')));
  const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
  const normalize = (text: string) => text.replaceAll('\r\n', '\n');
  const home = normalize(readFileSync('src/pages/HomePage.tsx', 'utf8'))
    .replace("import { HomeAbout } from '../components/HomeAbout';\n", '')
    .replace('        <HomeAbout />\n\n', '');
  expect(home).toBe(normalize(readFileSync('qa/home-about/HomePage.before.tsx.txt', 'utf8')));
  const lin = normalize(readFileSync('src/assistant/lin.css', 'utf8'))
    .replace('.lin-welcome-art .lin-art { width: 330px;', '.lin-welcome-art .lin-art { width: 216px;')
    .replace('.lin-welcome-art .lin-art { width: 280px;', '.lin-welcome-art .lin-art { width: 144px;');
  expect(lin).toBe(normalize(readFileSync('qa/home-about/lin.before.css.txt', 'utf8')));
  const polish: Record<string, { after: string }> = JSON.parse(readFileSync('qa/color-polish/approved-changes.json', 'utf8'));
  for (const [file, approved] of Object.entries(approvedColorPolishSources(Object.fromEntries(Object.entries(polish).map(([file, value]) => [file, value.after]))))) expect(hash(file)).toBe(approved);
  const modified = Object.keys(before).filter(file => hash(file) !== before[file]).sort();
  expect(modified).toEqual([]);
  const milestoneFiles: Record<string, string> = approvedMilestoneBackgroundSources(JSON.parse(readFileSync('qa/profile-milestones/added-sources.json', 'utf8')));
  for (const [file, approved] of Object.entries(milestoneFiles)) expect(hash(file)).toBe(approved);
  assertApprovedInventory();
});
