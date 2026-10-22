import { chromium } from '@playwright/test';
const browser = await chromium.launch({channel:'chrome', headless:true});
for (const theme of ['light','dark']) {
 const context = await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(theme=>localStorage.setItem('linad.preferences.v1',JSON.stringify({version:1,uiLanguage:'de',theme})),theme);
 const page=await context.newPage();
 for(const [name,route] of [['catalog','/tutors'],['profile','/tutors/anna-mueller'],['request','/tutors/anna-mueller/request'],['teacher','/tutors/become']]) {
  await page.goto('http://127.0.0.1:5173/#'+route);
  await page.locator('.tutors-page h1').waitFor();
  for(const portrait of await page.locator('.tutors-page img').all()) {await portrait.scrollIntoViewIfNeeded(); await portrait.evaluate(img=>img.decode());}
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`qa/tutors/${name}-1440-${theme}.png`,fullPage:true});
 }
 await context.close();
}
await browser.close();
