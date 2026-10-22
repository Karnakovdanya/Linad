import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { messages } from '../src/i18n/messages';

mkdirSync('qa/situations', { recursive: true });

const categories = [
  ['job-interview', 'categoryJobTitle', 'topicJobSearch'], ['doctor', 'categoryDoctorTitle', 'practiceSymptoms'],
  ['travel', 'categoryTravelTitle', 'topicTravelTickets'], ['documents', 'categoryDocumentsTitle', 'topicDocumentsResidence'],
  ['everyday-communication', 'categoryEverydayTitle', 'topicEverydayIntroduction'], ['shopping', 'categoryShoppingTitle', 'topicShoppingSupermarket'],
  ['housing', 'categoryHousingTitle', 'topicHousingSearch'], ['banking-finance', 'categoryBankingTitle', 'topicBankAccount'],
  ['education-learning', 'categoryEducationTitle', 'topicEducationProgramme'], ['sport-fitness', 'categorySportTitle', 'topicSportMembership'],
] as const;

test('all ten approved category photographs remain original', () => {
  const originals = {
    'job-interview': 'fd9e899e3edc52bfe0a05ce7a7729c8b62625b950337978d038b0a8b46e3abd0',
    doctor: '358475d6cd82401c6b9277845aec0f80879cf2b06f9e2a3502e2205e00b4e689',
    travel: '9bc199e7f911c24db0a6d8e5e48f8152c4ca511ddf70e9e8147864939576cd49',
    documents: '0896fd6c01fcd7066ae38231e5cf016e06f49496ae2997c263e3dcb15883a806',
    'everyday-communication': 'a15497b7cae054bf4bccf49a64b3f834f45cb451e86d078b16e0a40170b1f513',
    shopping: '1e7f59389ee11ad9a2d0e7911656e91db99c9ce9877e19b0608a2ef439986603',
    housing: 'f24b6d5166b4b4cdad6a583105e53275f851ba480d130cfca394a1d6a369de45',
    'banking-finance': '6d93db3d16f2cfec2b069127739079f769f6980974bb6c0acd5f3f4f43a15956',
    'education-learning': 'a0d267e9dade000b9c4ab5a4a18bc96f4f0f3055380893540d6f4424b03723a3',
    'sport-fitness': 'ade95bdb6aca815f8992a80f59e005cb9b658bbc7e189460ad762e7afe40e7a3',
  };
  for (const [id, hash] of Object.entries(originals)) expect(createHash('sha256').update(readFileSync(`public/assets/learning/situations/${id}.png`)).digest('hex'), id).toBe(hash);
});

for (const uiLanguage of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) {
  test(`catalog grid, original images and ten destinations: ${uiLanguage} ${theme}`, async ({ page }) => {
    test.setTimeout(120_000);
    const t = messages[uiLanguage];
    const errors: string[] = [];
    const failed: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => failed.push(request.url()));
    await page.addInitScript(({ uiLanguage, theme }) => {
      if (!localStorage.getItem('linad.preferences.v1')) localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage, theme, learningLanguage: 'de' }));
    }, { uiLanguage, theme });
    await page.goto('/#/learn');
    const footer = await page.locator('.site-footer').evaluate(node => node.outerHTML);
    for (const language of ['de', 'en'] as const) {
      await page.goto(`/#/learn/${language}/situations`);
      await expect(page).toHaveURL(new RegExp(`#/learn/${language}/situations$`));
      await expect(page.locator('h1')).toHaveText(t.learningEverydayTitle);
      await expect(page.locator('h1')).toBeFocused();
      await expect(page.locator('.situations-intro-row p')).toHaveText(t.situationsIntro);
      await expect(page.locator('.situations-language')).toHaveCount(0);
      await expect(page.locator('.situations-card')).toHaveCount(10);
      await expect(page.locator('.situations-grid img')).toHaveCount(10);
      for (const [id, key] of categories) {
        const card = page.getByRole('link', { name: t[key], exact: true });
        await expect(card).toHaveAttribute('href', `#/learn/${language}/situations/${id}`);
        const image = card.locator('img');
        await expect(image).toHaveAttribute('src', `./assets/learning/situations/${id}.png`);
        await expect(image).toHaveAttribute('alt', /.+/);
        await image.evaluate(node => (node as HTMLImageElement).decode());
        await expect(image).toHaveCSS('object-fit', 'cover');
        await expect(image).toHaveCSS('filter', 'none');
        await expect(image).toHaveCSS('opacity', '1');
      }
      for (const width of [320, 375, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.mouse.move(0, 0);
        await page.locator('.situations-card').evaluateAll(async nodes => Promise.all(nodes.flatMap(node => node.getAnimations().map(animation => animation.finished))));
        await page.evaluate(() => scrollTo(0, 0));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth)).toBe(true);
        const boxes = await page.locator('.situations-card').evaluateAll(nodes => nodes.map(node => {
          const box = node.getBoundingClientRect(), image = node.querySelector('img')!.getBoundingClientRect(), heading = node.querySelector('h2')!.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height, ratio: image.width / image.height, imageBottom: image.bottom, headingTop: heading.top };
        }));
        expect(boxes.filter(box => Math.abs(box.y - boxes[0]!.y) < 1).length).toBe(width >= 1200 ? 4 : width >= 768 ? 2 : 1);
        for (const box of boxes) {
          expect(box.width).toBeCloseTo(boxes[0]!.width, 1);
          expect(box.height).toBeCloseTo(boxes[0]!.height, 1);
          expect(box.ratio).toBeCloseTo(16 / 9, 2);
          expect(box.headingTop).toBeGreaterThan(box.imageBottom);
          expect(box.height).toBeGreaterThan(44);
        }
        const overflow = await page.locator('.situations-page h1,h2,p,.situations-language').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent));
        expect(overflow).toEqual([]);
        if (language === 'de') await page.screenshot({ path: `qa/situations/catalog-${width}-${uiLanguage}-${theme}.png`, fullPage: true });
      }
      for (const [id, , key] of categories) {
        await page.locator(`[data-category="${id}"] img`).click();
        await expect(page).toHaveURL(new RegExp(`#/learn/${language}/situations/${id}$`));
        await expect(page.locator('h1')).toHaveText(t[key]);
        await expect(page.locator('h1')).toBeFocused();
        await expect(page).toHaveTitle(`${t[key]} | LINAD`);
        await expect(page.locator('.practice-workspace')).toHaveCount(1);
        await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(3);
        await expect(page.locator('.situations-card, main form, main audio')).toHaveCount(0);
        await page.locator('.practice-sidebar').getByRole('link', { name: t.practiceBack, exact: true }).click();
        await expect(page.locator('.situations-card')).toHaveCount(10);
      }
      await page.reload();
      await expect(page.locator('.situations-language')).toHaveCount(0);
      await expect(page.locator('html')).toHaveAttribute('lang', uiLanguage);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      expect(await page.locator('.site-footer').evaluate(node => node.outerHTML)).toBe(footer);
      await page.getByRole('link', { name: t.learningBack, exact: true }).click();
      await expect(page).toHaveURL(/#\/learn$/);
      await expect(page.locator('.learning-language-panel')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
  });
}

test('catalog interface changes, keyboard focus and reduced motion', async ({ page }) => {
  await page.goto('/#/learn/en/situations');
  for (const uiLanguage of ['de', 'en', 'ru'] as const) {
    await page.locator('.language-select select').selectOption(uiLanguage);
    await expect(page.locator('.situations-intro-row p')).toHaveText(messages[uiLanguage].situationsIntro);
    await expect(page.locator('.situations-language')).toHaveCount(0);
    await expect(page).toHaveURL(/#\/learn\/en\/situations$/);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const first = page.locator('.situations-card').first();
  await first.focus();
  await expect(first).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/learn\/en\/situations\/job-interview$/);
  await page.locator('.practice-sidebar').getByRole('link', { name: messages.ru.practiceBack, exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await first.hover();
  await expect(first).toHaveCSS('transform', 'none');
  await expect(first).toHaveCSS('transition-duration', '0s');
  await expect(first).toHaveCSS('text-decoration-line', 'none');
});

test('direct category entry and unknown categories keep correct routing', async ({ page }) => {
  await page.goto('/#/learn/en/situations/housing');
  await expect(page.locator('.practice-language-button[aria-pressed="true"]')).toHaveCount(3);
  await page.locator('.practice-sidebar').getByRole('link', { name: messages.ru.practiceBack, exact: true }).click();
  await page.getByRole('link', { name: messages.ru.learningBack, exact: true }).click();
  await expect(page.locator('.learning-path-cta').first()).toHaveAttribute('href', '#/learn/en/situations');
  await page.reload();
  await expect(page.locator('.learning-path-cta').first()).toHaveAttribute('href', '#/learn/en/situations');
  for (const route of ['/learn/en/situations/unknown', '/learn/fr/situations']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('h1')).toHaveText(messages.ru.notFoundTitle);
    await expect(page).toHaveTitle(`${messages.ru.notFoundTitle} | LINAD`);
  }
});

test('mobile category photo taps work without sticky hover', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/#/learn/de/situations');
    const card = page.locator('[data-category="shopping"]');
    await card.locator('img').tap();
    await expect(page).toHaveURL(/#\/learn\/de\/situations\/shopping$/);
    await page.locator('.practice-sidebar').getByRole('link', { name: messages.ru.practiceBack, exact: true }).tap();
    await expect(card).toHaveCSS('transform', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});
