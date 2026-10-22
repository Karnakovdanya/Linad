import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const primary = { normal: 'rgb(54, 95, 173)', hover: 'rgb(86, 128, 210)', active: 'rgb(41, 75, 139)' };
const actionSelector = '.button, .icon-button, .footer-contact, .home-photo-card';
const matrix = (scale: number) => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`;

async function layout(page: Page) {
  return page.locator('main, main section, .site-header, .site-footer').evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return [box.x + scrollX, box.y + scrollY, box.width, box.height].map((n) => Math.round(n * 100) / 100);
  }));
}

async function noDecoration(target: Locator) {
  await expect(target).toHaveCSS('text-decoration-line', 'none');
  expect(await target.evaluate((node) => [...node.querySelectorAll('span, h2, p, strong')].every((child) => getComputedStyle(child).textDecorationLine === 'none'))).toBe(true);
}

async function noOverlapOrOverflow(page: Page, target: Locator) {
  const overlaps = await target.evaluate((node, selector) => {
    const box = node.getBoundingClientRect();
    return [...node.parentElement!.children].filter((other) => other !== node && other.matches(selector)).some((other) => {
      const peer = other.getBoundingClientRect();
      return peer.width > 0 && peer.height > 0 && Math.min(box.right, peer.right) - Math.max(box.left, peer.left) > .5 && Math.min(box.bottom, peer.bottom) - Math.max(box.top, peer.top) > .5;
    });
  }, `${actionSelector}, .language-select`);
  expect(overlaps).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth)).toBe(true);
}

async function captureState(page: Page, target: Locator) {
  const box = (await target.boundingBox())!;
  return page.screenshot({ clip: { x: Math.max(0, Math.floor(box.x) - 12), y: Math.max(0, Math.floor(box.y) - 12), width: Math.ceil(box.width) + 24, height: Math.ceil(box.height) + 24 } });
}

async function exerciseAction(page: Page, target: Locator, capture = false) {
  const snapshots: string[] = [];
  const isPrimary = await target.evaluate((node) => node.classList.contains('button-primary'));
  await page.mouse.move(0, 0);
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveCSS('transform', 'none');
  await noDecoration(target);
  if (isPrimary) {
    await expect(target).toHaveCSS('background-color', primary.normal);
    await expect(target).toHaveCSS('color', 'rgb(255, 255, 255)');
  }
  const before = await layout(page);
  const baseBackground = await target.evaluate((node) => getComputedStyle(node).backgroundColor);
  if (capture) snapshots.push((await captureState(page, target)).toString('base64'));

  await target.hover();
  await expect(target).toHaveCSS('transform', matrix(1.025));
  await noDecoration(target);
  if (isPrimary) {
    await expect(target).toHaveCSS('background-color', primary.hover);
    await expect(target).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(target).not.toHaveCSS('box-shadow', 'none');
  } else if (await target.evaluate((node) => !node.classList.contains('home-photo-card'))) {
    await expect.poll(() => target.evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(baseBackground);
  }
  expect(await layout(page)).toEqual(before);
  await noOverlapOrOverflow(page, target);
  if (capture) snapshots.push((await captureState(page, target)).toString('base64'));

  await page.mouse.down();
  try {
    await expect(target).toHaveCSS('transform', matrix(.98));
    if (isPrimary) await expect(target).toHaveCSS('background-color', primary.active);
    await noDecoration(target);
    expect(await layout(page)).toEqual(before);
    if (capture) snapshots.push((await captureState(page, target)).toString('base64'));
  } finally {
    // Release outside the control: exercise :active without following an href.
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
  await expect(target).toHaveCSS('transform', 'none');

  // Tab selects keyboard modality; focus each control to cover every CTA.
  await page.keyboard.press('Tab');
  await target.focus();
  await expect(target).toBeFocused();
  expect(await target.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
  await expect(target).toHaveCSS('outline-style', 'solid');
  await expect(target).toHaveCSS('outline-width', '3px');
  await noDecoration(target);
  if (capture) snapshots.push((await captureState(page, target)).toString('base64'));
  return snapshots;
}

for (const language of ['ru', 'de', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`desktop actions ${language} ${theme}: menu and every CTA state`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.setViewportSize({ width: 1448, height: 1000 });
      await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
      await page.goto('/#/');
      const nav = page.locator('.primary-nav a');
      const navPositions = await nav.evaluateAll((links) => links.map((node) => ({ x: node.getBoundingClientRect().x, width: node.getBoundingClientRect().width })));
      for (const link of await nav.all()) {
        const label = link.locator('.nav-label');
        await expect(label).toHaveCSS('transition-duration', '0.28s');
        await expect(label).toHaveCSS('transition-timing-function', 'cubic-bezier(0.22, 1, 0.36, 1)');
        await link.hover();
        await expect(label).toHaveCSS('transform', matrix(1.05));
        await noDecoration(link);
        expect(await nav.evaluateAll((links) => links.map((node) => ({ x: node.getBoundingClientRect().x, width: node.getBoundingClientRect().width })))).toEqual(navPositions);
        await page.mouse.down(); await noDecoration(link); await page.mouse.move(0, 0); await page.mouse.up();
        await page.keyboard.press('Tab'); await link.focus();
        await expect(link).toHaveCSS('outline-width', '3px');
        await noDecoration(link);
      }
      expect(await nav.evaluateAll((links) => links.filter((node) => getComputedStyle(node, '::after').backgroundColor !== 'rgba(0, 0, 0, 0)').length)).toBe(1);

      const proof: { label: string; images: string[] }[] = [];
      for (const route of ['/', '/learn', '/tutors', '/profile', '/author']) {
        if (route !== '/') await page.goto(`/#${route}`);
        const actions = await page.locator('main .button, main .home-photo-card').all();
        for (let i = 0; i < actions.length; i++) {
          const capture = language === 'ru' && route === '/' && i < 2;
          const images = await exerciseAction(page, actions[i]!, capture);
          if (capture) proof.push({ label: i === 0 ? 'Основная кнопка' : 'Контурная кнопка', images });
        }
        await expect(page).toHaveURL(new RegExp(route === '/profile' ? '#/auth/login$' : `#${route}$`));
      }
      for (const control of await page.locator('.site-header .icon-button:visible, .site-footer .footer-contact').all()) await exerciseAction(page, control);
      await page.goto('/#/learn');
      await expect(page.locator('.text-link')).toHaveCSS('text-decoration-line', 'underline');

      await page.goto('/#/');
      await page.mouse.move(0, 0);
      await page.locator('.hero-actions .button-primary').hover();
      await expect(page.locator('.hero-actions .button-primary')).toHaveCSS('background-color', primary.hover);
      await page.screenshot({ path: `qa/interactions/home-${language}-${theme}-hover.png`, fullPage: true });
      if (proof.length) {
        const states = ['Обычное', 'Наведение', 'Нажатие', 'Фокус клавиатуры'];
        await page.setViewportSize({ width: 1340, height: 480 });
        await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:24px;font:16px Segoe UI;background:${theme === 'light' ? '#E6DDEE' : '#24262D'};color:${theme === 'light' ? '#25283B' : '#F2F2F4'}}h1{font-size:22px;margin:0 0 20px}section{margin-top:20px}h2{font-size:16px}article{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}figure{margin:0;min-width:0}img{display:block;max-width:100%;height:auto}figcaption{font-size:13px;margin-bottom:8px}</style><h1>LINAD · ${theme === 'light' ? 'Светлая' : 'Тёмная'} тема</h1>${proof.map((row) => `<section><h2>${row.label}</h2><article>${row.images.map((data, i) => `<figure><figcaption>${states[i]}</figcaption><img src="data:image/png;base64,${data}" alt="${states[i]}"></figure>`).join('')}</article></section>`).join('')}`);
        await page.locator('img').evaluateAll(async (images) => Promise.all(images.map((node) => (node as HTMLImageElement).decode())));
        await page.screenshot({ path: `qa/interactions/states-${theme}.png`, fullPage: true });
      }
    });
  }
}

for (const theme of ['light', 'dark'] as const) {
  test(`fine pointer responsive ${theme}: long German labels keep their spacing`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript((theme) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: 'de', theme })), theme);
    await page.goto('/#/');
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const action of await page.locator('main .button, main .home-photo-card, .site-header .icon-button:visible').all()) {
        await page.mouse.move(0, 0);
        await action.scrollIntoViewIfNeeded();
        const before = await layout(page);
        await action.hover();
        await expect(action).toHaveCSS('transform', matrix(1.025));
        await noDecoration(action);
        await noOverlapOrOverflow(page, action);
        expect(await layout(page)).toEqual(before);
      }
      await page.mouse.move(0, 0);
    }
  });

  for (const width of [320, 390, 768]) {
    test(`touch actions ${width} ${theme}: no sticky hover and working destinations`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
      await context.addInitScript((theme) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: 'en', theme })), theme);
      const page = await context.newPage();
      try {
        await context.route('https://t.me/**', route => route.fulfill({ body: '<title>Local Telegram link check</title>' }));
        await page.goto('http://127.0.0.1:4173/#/');
        expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(false);
        const primaryButton = page.locator('.hero-actions .button-primary');
        await primaryButton.hover(); // Even a synthesized hover must have no visual effect.
        await expect(primaryButton).toHaveCSS('transform', 'none');
        await expect(primaryButton).toHaveCSS('background-color', primary.normal);
        await page.mouse.down();
        await expect(primaryButton).toHaveCSS('transform', matrix(.98));
        await expect(primaryButton).toHaveCSS('background-color', primary.active);
        await page.mouse.move(0, 0); await page.mouse.up();
        await expect(primaryButton).toHaveCSS('background-color', primary.normal);
        for (const selector of ['.hero-actions .button-primary', '.hero-actions .button-hero-secondary', '.learning-overview .button', '.home-photo-card:nth-child(1)', '.home-photo-card:nth-child(2)', '.home-photo-card:nth-child(3)']) {
          const action = page.locator(selector);
          const destination = await action.getAttribute('href');
          if (await action.getAttribute('target') === '_blank') {
            await expect(action).toHaveAttribute('rel', 'noopener noreferrer');
            const popupReady = page.waitForEvent('popup');
            await action.tap(); const popup = await popupReady;
            await expect(popup).toHaveURL(destination!);
            expect(await popup.evaluate(() => window.opener === null)).toBe(true);
            await popup.close();
            await expect(page).toHaveURL('http://127.0.0.1:4173/#/');
          } else {
            await action.tap();
            await expect(page).toHaveURL(new URL(destination!, 'http://127.0.0.1:4173/').href);
            await page.goBack();
          }
          await expect(action).toBeVisible();
          await expect(action).toHaveCSS('transform', 'none');
          await noDecoration(action);
          await noOverlapOrOverflow(page, action);
        }
        await expect(primaryButton).toHaveCSS('background-color', primary.normal);
        await page.locator('.menu-toggle').tap();
        for (const label of await page.locator('.primary-nav .nav-label').all()) await expect(label).toHaveCSS('transform', 'none');
        await page.locator('.menu-toggle').tap();
        if (width === 390) await page.screenshot({ path: `qa/interactions/touch-${theme}.png`, fullPage: true });
      } finally { await context.close(); }
    });
  }

  test(`reduced motion ${theme}: instant colour feedback, visible focus, no scaling`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((theme) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: 'ru', theme })), theme);
    await page.goto('/#/');
    const button = page.locator('.hero-actions .button-primary');
    await button.hover();
    await expect(button).toHaveCSS('transition-duration', '0s');
    await expect(button).toHaveCSS('transform', 'none');
    await expect(button).toHaveCSS('background-color', primary.hover);
    await page.mouse.down();
    await expect(button).toHaveCSS('background-color', primary.active);
    await expect(button).toHaveCSS('transform', 'none');
    await page.mouse.move(0, 0); await page.mouse.up();
    await page.keyboard.press('Tab'); await button.focus();
    await expect(button).toHaveCSS('outline-width', '3px');
    const label = page.locator('.primary-nav a').first().locator('.nav-label');
    await label.hover();
    await expect(label).toHaveCSS('transition-duration', '0s');
    await expect(label).toHaveCSS('transform', 'none');
  });
}
