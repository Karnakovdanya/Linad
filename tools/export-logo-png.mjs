// Rasterise the approved SVG paths for download; source photos/rasters are never edited.
/* global Image, document */ // Used only inside page.evaluate's browser context.
import { Buffer } from 'node:buffer';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'chrome' : undefined });
try {
  const page = await browser.newPage();
  for (const theme of ['light', 'dark']) {
    const base = new URL(`../public/assets/brand/linad-logo-${theme}`, import.meta.url);
    const svg = await readFile(`${fileURLToPath(base)}.svg`, 'utf8');
    const png = await page.evaluate(async (svg) => {
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 3860; canvas.height = 1092;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png').split(',')[1];
    }, svg);
    await writeFile(`${fileURLToPath(base)}.png`, Buffer.from(png, 'base64'));
    process.stdout.write(`linad-logo-${theme}.png: 3860 x 1092, RGBA\n`);
  }
} finally {
  await browser.close();
}
