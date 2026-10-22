import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = {};
for (const language of ['ru', 'de', 'en']) for (const theme of ['light', 'dark']) for (const width of [390, 820, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 950 } });
  await context.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:5173/#/');
  await page.evaluate(() => document.fonts.ready);
  if (width < 1100) { await page.locator('.menu-toggle').click(); await expectMenu(page); }
  records[`${language}-${theme}-${width}`] = await page.evaluate(() => {
    const box = element => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; };
    return { header: box(document.querySelector('.site-header')), nav: box(document.querySelector('.primary-nav')), links: [...document.querySelectorAll('.primary-nav a')].map(element => ({ ...box(element), text: element.textContent, font: getComputedStyle(element).font, color: getComputedStyle(element).color })), footer: box(document.querySelector('.site-footer')), cards: [...document.querySelectorAll('.home-photo-card')].map(box) };
  });
  await context.close();
}
await browser.close(); writeFileSync('qa/telegram-navigation/geometry-before.json', JSON.stringify(records, null, 2));
async function expectMenu(page) { await page.locator('.primary-nav').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished))); }
