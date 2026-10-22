import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { messages } from '../src/i18n/messages';
import { confirmedContacts } from './confirmed-contacts';

test('approved author photographs remain unchanged', () => {
  // SHA-256 of the four approved originals, checked before copying. This test
  // stays portable and does not depend on the user's temporary attachments.
  const originals = {
    'goal-workspace.png': 'cb10a72d94b98b5a7266f44d5eb0746b4d6a84f8abbe577a8c232757c394fdbb',
    'hero-landscape.png': '85b4740faf2da83e02496338377899c1ee6b17057682bfa7df416f50753e975d',
    'portrait.png': 'fadffe8b962254568a4487a833c65e7961ad59f30ddab8068ec4341801fec6ea',
    'story-workspace.png': 'e7fe3edf5a4ec33c0497eb631a231b5efbf0990f3c9734311c12faba5086203a',
  };
  for (const [name, hash] of Object.entries(originals)) expect(createHash('sha256').update(readFileSync(`public/assets/author/${name}`)).digest('hex'), name).toBe(hash);
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) {
  test(`author content, photos and responsive composition: ${language} ${theme}`, async ({ page }) => {
    test.setTimeout(90_000);
    const t = messages[language];
    await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({version:1,uiLanguage:language,theme})), {language,theme});
    await page.goto('/#/');
    const sharedFooter = await page.locator('.site-footer').evaluate(n => n.outerHTML);
    await page.goto('/#/author');
    const author = page.locator('.author-page');
    expect(await author.locator(':scope > section').evaluateAll(nodes => nodes.map(n => n.getAttribute('data-author-section')))).toEqual(['welcome','story','reasons','goal','contacts']);
    await expect(page.locator('h1')).toHaveText(t.authorTitle);
    await expect(author.locator('.pending-state, .version-note')).toHaveCount(0);
    await expect(author.locator('.author-story-copy .author-paragraphs p')).toHaveText([t.authorStoryP1,t.authorStoryP2,t.authorStoryP3,t.authorStoryP4]);
    await expect(author.locator('.author-welcome-copy .author-paragraphs p')).toHaveText([t.authorHeroP1,t.authorHeroP2]);
    await expect(author.locator('.author-goal .author-paragraphs p')).toHaveText([t.authorGoalP1,t.authorGoalP2]);
    const pictureMap = [['.author-profile-portrait','portrait.png'],['.author-landscape','hero-landscape.png'],['.author-story-media img','story-workspace.png'],['.author-goal-photo','goal-workspace.png']];
    for (const [selector, filename] of pictureMap) {
      const image = author.locator(selector!);
      await expect(image).toHaveAttribute('src', `./assets/author/${filename}`);
      await expect(image).toHaveAttribute('alt', /.+/);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(n => (n as HTMLImageElement).decode());
      await expect(image).toHaveCSS('object-fit','cover');
    }
    await expect(author.locator('img')).toHaveCount(4);
    const contactLinks = author.locator('.author-contact-grid a');
    expect(await contactLinks.evaluateAll(nodes => nodes.map(n => n.getAttribute('data-contact')))).toEqual(['authorTelegram','github','linkedin','whatsapp','behance']);
    for (const id of ['authorTelegram','github','linkedin','whatsapp','behance'] as const) {
      const link = author.locator(`[data-contact="${id}"]`);
      await expect(link).toHaveAttribute('href',id === 'whatsapp' ? 'https://wa.me/41765389162' : confirmedContacts[id]);
      await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','noopener noreferrer');
    }
    await expect(author.locator('.author-contact-email [data-contact="email"]')).toHaveAttribute('href','mailto:danikkarnakov@gmail.com');
    await expect(author.locator('[data-contact="instagram"]')).toHaveCount(0);
    const expected = [
      [t.authorProblem1Title,t.authorProblem1Body,t.authorSolution1],
      [t.authorProblem2Title,t.authorProblem2Body,t.authorSolution2],
      [t.authorProblem3Title,t.authorProblem3Body,t.authorSolution3],
      [t.authorProblem4Title,t.authorProblem4Body,t.authorSolution4],
      [t.authorProblem5Title,t.authorProblem5Body,t.authorSolution5],
    ];
    for (const [i, card] of (await author.locator('.author-problem-card').all()).entries()) {
      await expect(card.locator('h3')).toHaveText(expected[i]![0]!);
      await expect(card.locator('.author-problem-body')).toHaveText(`${t.authorProblemLabel} ${expected[i]![1]!}`);
      await expect(card.locator('.author-solution p')).toHaveText(`${t.authorSolutionLabel} ${expected[i]![2]!}`);
    }
    for (const width of [320,375,768,1024,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(() => scrollTo(0,0));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth)).toBe(true);
      const outer = (await author.boundingBox())!;
      expect(outer.width).toBeCloseTo(width*.9,1);
      const cards = await author.locator('.author-problem-card').evaluateAll(nodes => nodes.map(n => {const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}}));
      expect(cards.filter(card => Math.abs(card.y-cards[0]!.y)<1).length).toBe(width>=1280?5:width>=900?3:width>=600?2:1);
      const textOverflow = await author.locator('h1,h2,h3,p,.author-contact-link').evaluateAll(nodes => nodes.filter(n => n.scrollWidth>n.clientWidth+1).map(n=>n.textContent));
      expect(textOverflow).toEqual([]);
      const storyPanel=(await author.locator('.author-story').boundingBox())!, storyImage=(await author.locator('.author-story-media img').boundingBox())!;
      // The story photograph must extend behind the text from the panel's left edge.
      expect(storyImage.x).toBeCloseTo(storyPanel.x+1,0);
      expect(storyImage.y).toBeCloseTo(storyPanel.y+1,0);
      expect(storyImage.width).toBeCloseTo(storyPanel.width-2,0);
      expect(storyImage.height).toBeCloseTo(storyPanel.height-2,0);
      const overlays = await author.locator('.author-welcome, .author-story').evaluateAll(nodes => nodes.map(n => getComputedStyle(n,'::after').backgroundImage));
      expect(overlays[1]).toBe(overlays[0]);
      expect(overlays[1]).toContain('90deg');
      if (theme==='light') for (const paragraph of await author.locator('.author-welcome-copy .author-paragraphs p, .author-story-copy .author-paragraphs p').all()) await expect(paragraph).toHaveCSS('color','rgb(0, 0, 0)');
      const goalText=(await author.locator('.author-goal .author-copy').boundingBox())!, goalImage=(await author.locator('.author-goal-photo').boundingBox())!;
      if(width>=900){expect(goalImage.x+goalImage.width).toBeLessThan(goalText.x);}
      else {expect(goalImage.y+goalImage.height).toBeLessThanOrEqual(goalText.y);}
      if(width>=768) expect((await author.locator('.author-profile-portrait').boundingBox())!.x).toBeLessThan((await author.locator('.author-welcome-copy').boundingBox())!.x);
      for(const link of await author.locator('.button').all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect(await page.locator('.site-footer').evaluate(n => n.outerHTML)).toBe(sharedFooter);
      await page.screenshot({path:`qa/author/author-${width}-${language}-${theme}.png`,fullPage:true});
    }
    await page.setViewportSize({width:375,height:844});
    await page.evaluate(() => scrollTo(0,0));
    await author.getByRole('button',{name:t.authorContactMe,exact:true}).click();
    await expect(page.locator('#author-contacts')).toBeFocused();
    await expect(page).toHaveURL(/#\/author$/);
    await expect.poll(async()=>{const r=(await page.locator('#author-contacts').boundingBox())!;return r.y<844&&r.y+r.height>0;}).toBe(true);
    await author.getByRole('link',{name:t.authorGoHome,exact:true}).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.locator('.author-page')).toHaveCount(0);
  });
}

test('author language switching is immediate and other routes keep their presentation', async({page})=>{
  await page.goto('/#/author');
  for(const language of ['de','en','ru'] as const){
    await page.locator('.language-select select').selectOption(language);
    await expect(page.locator('h1')).toHaveText(messages[language].authorTitle);
    await expect(page.locator('.author-story-copy .author-paragraphs p').nth(1)).toHaveText(messages[language].authorStoryP2);
    await expect(page).toHaveURL(/#\/author$/);
  }
  for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('.header-controls button:not(.menu-toggle)').click();
    await page.setViewportSize({width:1448,height:1000});
    for(const route of ['/','/learn','/tutors','/profile']){
      await page.goto(`/#${route}`);
      await expect(page.locator('.author-page')).toHaveCount(0);
      await expect(page.locator('.site-header')).toHaveCount(1);
      await expect(page.locator('.site-footer')).toHaveCount(1);
      if(route==='/'){
        await page.locator('img').evaluateAll(nodes=>Promise.all(nodes.map(n=>(n as HTMLImageElement).decode())));
        await page.screenshot({path:`qa/author/home-regression-${theme}.png`,fullPage:true});
      }
    }
  }
});
