import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mockSupabase, uuid } from './account-helpers';
import { emptyDocument } from '../src/account/document';
import { accountCopy, streakDays } from '../src/account/copy';
import { approvedMilestoneBackgroundSources, assertApprovedInventory } from './protected-source';

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) {
  test(`goal and real streak illustrations ${language}/${theme}: layouts, counter and empty state`, async ({ page, browser }) => {
    await page.clock.setFixedTime(new Date('2026-10-21T12:00:00Z'));
    const backend = await mockSupabase(page, { signedIn: true, language, theme });
    const c = accountCopy(language);
    const profile = { first_name: 'Test', last_name: 'Learner', display_name: 'Test Learner', avatar_path: null,
      study_languages: [{ language: 'de', level: 'A2' }, { language: 'en', level: 'B1' }], study_goal: { language: 'de', level: 'B2' }, ui_language: null, theme: null };
    backend.profiles.set(uuid, profile);
    const doc = emptyDocument();
    doc.studyActivity = Array.from({ length: 5 }, (_, index) => new Date(Date.UTC(2026, 9, 21 - index, 10)).toISOString());
    backend.cloud.set(uuid, { revision: 1, data: doc });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/#/profile');
    const goal = page.locator('.account-summary-goal'); const streak = page.locator('.account-summary-streak');
    await expect(goal.locator('.account-goal-level')).toHaveText('B2');
    await expect(goal.locator('.account-goal-language')).toHaveText({ ru: 'Немецкий', de: 'Deutsch', en: 'German' }[language]);
    await expect(goal.locator('.account-goal-caption')).toHaveText(c.targetLevel);
    expect(await goal.locator('.account-goal-level').evaluate(el => Number(getComputedStyle(el).fontWeight))).toBeGreaterThanOrEqual(700);
    await expect(page.getByTestId('study-streak')).toHaveText('5');
    await expect(streak.locator('.account-streak-value')).toHaveText(`5 ${streakDays(5, language)}`);
    await expect(streak.locator('.account-milestone-art text')).toHaveText('5');
    await expect(goal.locator('.account-milestone-art')).toHaveAttribute('aria-hidden', 'true');
    await expect(streak.locator('.account-milestone-art')).toHaveAttribute('aria-hidden', 'true');
    await expect(streak.locator('small')).toHaveText(c.keepStreak);
    expect(await streak.locator('.account-streak-value').evaluate(el => parseFloat(getComputedStyle(el.querySelector('strong')!).fontSize) / parseFloat(getComputedStyle(el.querySelector('span')!).fontSize))).toBeGreaterThan(1.5);
    await expect(page.locator('.account-personal-language')).toHaveCount(2);
    await expect(page.locator('.account-course-card')).toHaveCount(2);
    const cardSizes: { width: number; cards: { width: number; height: number }[] }[] = [];

    for (const width of [1440, 1196, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 1080 }); await goal.scrollIntoViewIfNeeded();
      const layout = await page.evaluate(() => {
        const cards = [...document.querySelectorAll<HTMLElement>('.account-milestone')];
        return { overflow: document.documentElement.scrollWidth > innerWidth, cards: cards.map(card => {
          const rect = card.getBoundingClientRect(); const copy = card.querySelector('.account-milestone-content')!.getBoundingClientRect();
          const art = card.querySelector('.account-milestone-art')!.getBoundingClientRect();
          const texts = [...card.querySelectorAll('h2, strong, small, button')];
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right,
            textOverflow: texts.some(el => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > rect.right || el.getBoundingClientRect().bottom > rect.bottom),
            reservedArtSpace: rect.right - copy.right,
            backgroundInsets: [art.x - rect.x, art.y - rect.y, rect.right - art.right, rect.bottom - art.bottom],
            titleOffset: card.querySelector('h2')!.getBoundingClientRect().y - rect.y,
            valueOffset: card.querySelector('.account-goal-value, .account-streak-value')!.getBoundingClientRect().y - rect.y,
            textLefts: [...card.querySelectorAll('h2, .account-goal-value, .account-streak-value, .account-milestone-content > small, button')].map(node => node.getBoundingClientRect().left - rect.left),
            outOfFlowText: [...card.querySelectorAll('.account-milestone-content, .account-milestone-content *')].some(node => ['absolute', 'fixed'].includes(getComputedStyle(node).position) || getComputedStyle(node).transform !== 'none') };
        }) };
      });
      expect(layout.overflow).toBe(false);
      cardSizes.push({ width, cards: layout.cards.map(({ width, height }) => ({ width, height })) });
      for (const card of layout.cards) {
        expect(card.textOverflow).toBe(false); expect(card.x).toBeGreaterThanOrEqual(0); expect(card.right).toBeLessThanOrEqual(width);
        expect(card.reservedArtSpace).toBeGreaterThan(45); expect(card.height).toBeLessThanOrEqual(210);
        for (const inset of card.backgroundInsets) expect(inset).toBeLessThanOrEqual(1.1);
        for (const left of card.textLefts) expect(left).toBeCloseTo(card.textLefts[0]!, 0);
        expect(card.outOfFlowText).toBe(false);
      }
      expect(layout.cards[0]!.titleOffset).toBeCloseTo(layout.cards[1]!.titleOffset, 0);
      expect(layout.cards[0]!.valueOffset).toBeCloseTo(layout.cards[1]!.valueOffset, 0);
      if (width >= 820) expect(layout.cards[0]!.y).toBe(layout.cards[1]!.y);
      else expect(layout.cards[1]!.y).toBeGreaterThan(layout.cards[0]!.y + layout.cards[0]!.height);
      if ([1440, 390].includes(width)) {
        await goal.screenshot({ path: `qa/profile-milestones/${language}-${theme}-${width}-goal.png`, animations: 'disabled' });
        await streak.screenshot({ path: `qa/profile-milestones/${language}-${theme}-${width}-streak.png`, animations: 'disabled' });
      }
    }
    const sizesFile = `qa/milestone-typography/${language}-${theme}-before-sizes.json`;
    if (process.env.LINAD_CAPTURE_CARD_SIZES) writeFileSync(sizesFile, JSON.stringify(cardSizes, null, 2));
    else {
      const original: typeof cardSizes = JSON.parse(readFileSync(sizesFile, 'utf8'));
      for (const [index, size] of cardSizes.entries()) {
        expect(size.width).toBe(original[index]!.width);
        for (const [cardIndex, card] of size.cards.entries()) {
          expect(card.width).toBe(original[index]!.cards[cardIndex]!.width);
          // Fractional line boxes can round within one CSS pixel after changing fonts.
          expect(Math.abs(card.height - original[index]!.cards[cardIndex]!.height)).toBeLessThan(1);
        }
      }
    }
    // Values come from account data; the numeral printed in the PNG is never the displayed statistic.
    for (const count of [0, 1]) {
      // A fresh device avoids correctly preserved cached activity from the five-day fixture.
      const context = await browser.newContext(); const device = await context.newPage();
      await device.clock.setFixedTime(new Date('2026-10-21T12:00:00Z'));
      const other = await mockSupabase(device, { signedIn: true, language, theme });
      other.cloud.set(uuid, { revision: 1, data: { ...doc, studyActivity: doc.studyActivity.slice(0, count) } });
      other.profiles.set(uuid, { ...profile, study_goal: null });
      await device.goto('/#/profile'); await expect(device.getByTestId('study-streak')).toHaveText(String(count));
      const otherStreak = device.locator('.account-summary-streak');
      await expect(otherStreak.locator('.account-milestone-art text')).toHaveText(String(count));
      await expect(otherStreak.locator('.account-streak-value')).toHaveText(`${count} ${streakDays(count, language)}`);
      await expect(device.locator('.account-summary-goal')).toContainText(c.noGoal);
      await expect(otherStreak.locator('small')).toHaveText(count ? c.keepStreak : c.startToday);
      await context.close();
    }
    // The same existing goal editor opens and retains keyboard dismissal; no account writes are needed here.
    await goal.getByRole('button', { name: `${c.editGoal} →`, exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('only the two profile cards changed; supplied illustrations remain original PNGs', () => {
  const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
  const before: Record<string, string> = approvedMilestoneBackgroundSources(JSON.parse(readFileSync('qa/profile-milestones/before.json', 'utf8')));
  expect(Object.keys(before).filter(file => hash(file) !== before[file])).toEqual([]);
  assertApprovedInventory();
  const normalize = (text: string) => text.replaceAll('\r\n', '\n');
  const old = normalize(readFileSync('qa/profile-milestones/ProfileOverview.before.tsx.txt', 'utf8'));
  const current = normalize(readFileSync('src/account/ProfileOverview.tsx', 'utf8'));
  // Everything surrounding the two original articles, including calculations, stays byte-identical.
  const tidy = (text: string) => text.replace("import { accountCopy, streakDays } from './copy';", "import { accountCopy } from './copy';")
    .replace("import { ProfileMilestones } from './ProfileMilestones';\n", '')
    .replace(/<article className="account-panel account-summary-goal">[\s\S]*?<\/article>\n {8}<article className="account-panel account-summary-streak">[\s\S]*?<\/article>/, '<CARDS>')
    .replace(/<ProfileMilestones [^\n]*?\/>/, '<CARDS>');
  expect(tidy(current)).toBe(tidy(old));
  const source: Record<string, { sha256: string }> = JSON.parse(readFileSync('qa/profile-milestones/asset-provenance.json', 'utf8'));
  for (const [file, metadata] of Object.entries(source)) expect(hash(`public/assets/account/${file}`)).toBe(metadata.sha256);
  const typographyBefore = approvedMilestoneBackgroundSources(JSON.parse(readFileSync('qa/milestone-typography/before.json', 'utf8')));
  expect(Object.keys(typographyBefore).filter(file => hash(file) !== typographyBefore[file]).sort()).toEqual([]);
  const oldCards = normalize(readFileSync('qa/milestone-typography/ProfileMilestones.tsx.before.txt', 'utf8'));
  const newCards = normalize(readFileSync('src/account/ProfileMilestones.tsx', 'utf8'));
  const art = (code: string) => code.slice(code.indexOf('function MilestoneArt'), code.indexOf('export function ProfileMilestones'));
  expect(art(newCards)).toBe(art(oldCards));
  const oldCss = normalize(readFileSync('qa/milestone-typography/profile-milestones.css.before.txt', 'utf8'));
  const newCss = normalize(readFileSync('src/styles/profile-milestones.css', 'utf8'));
  const block = (css: string, selector: string) => { const start = css.indexOf(selector + ' {'); return css.slice(start, css.indexOf('}', start) + 1); };
  for (const selector of ['.account-profile-final .account-milestone', '.account-milestone-art', '.account-milestone::after', ":root[data-theme='dark'] .account-profile-final .account-milestone", ":root[data-theme='dark'] .account-milestone::after"])
    expect(block(newCss, selector), selector).toBe(block(oldCss, selector));
});
