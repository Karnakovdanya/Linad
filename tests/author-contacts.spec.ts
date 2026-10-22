import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync } from 'node:fs';
import { messages } from '../src/i18n/messages';
import { approvedReleaseSources } from './protected-source';
mkdirSync('qa/author-contacts', { recursive: true });
type Styles = {backgroundColor:string;color:string;fontFamily:string;fontSize:string;fontWeight:string;borderRadius:string};
type Layout = { sections:{html:string;rect:{x:number;y:number;width:number;height:number}}[];header:string;footer:string;contacts:Styles[] };
const before=JSON.parse(readFileSync('qa/author-contacts/layout-before.json','utf8')) as Record<string,Layout>;
// Vite dev uses /assets/, while the GitHub Pages build uses ./assets/.
const normalizeAssetBase=(layout:Layout)=> {
  const normalized = JSON.parse(JSON.stringify(layout).replaceAll('./assets/','/assets/')) as Layout;
  // The sole approved Header change since this layout fixture is removal of Telegram.
  normalized.header = normalized.header.replace(/<a\b(?=[^>]*data-contact="headerTelegramBot")[\s\S]*?<\/a>/, '');
  return normalized;
};

for(const language of ['ru','de','en'] as const)for(const theme of ['light','dark'] as const)test(`contact layout, unchanged page and real clipboard: ${language} ${theme}`,async({page,context})=>{
  test.setTimeout(60_000);const t=messages[language];
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:'http://127.0.0.1:4173'});
  await page.addInitScript(({language,theme})=>localStorage.setItem('linad.preferences.v1',JSON.stringify({version:1,uiLanguage:language,theme})),{language,theme});
  await page.goto('/#/author');const section=page.locator('#author-contacts');await expect(section.locator('.author-contact-grid a')).toHaveCount(5);
  await expect(section.locator('[data-contact=whatsapp]')).toContainText(t.authorContactWhatsapp);await expect(section.locator('[data-contact=behance]')).toContainText(t.authorContactBehance);
  expect(await section.innerText()).not.toMatch(/41765389162|76\s*538\s*91\s*62/);
  for(const image of await page.locator('.author-page img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(node=>(node as HTMLImageElement).decode());}
  for(const width of [320,768,1440,1920]){
    await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    const actual=await page.evaluate(()=>({sections:[...document.querySelectorAll('.author-page > section:not(.author-contacts)')].map(n=>({html:n.outerHTML,rect:{x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height}})),header:document.querySelector('.site-header')!.outerHTML,footer:document.querySelector('.site-footer')!.outerHTML,contacts:['.author-contacts','.author-contacts h2','.author-contact-link'].map(sel=>{const s=getComputedStyle(document.querySelector(sel)!);return {backgroundColor:s.backgroundColor,color:s.color,fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,borderRadius:s.borderRadius};})}));
    expect(normalizeAssetBase(actual)).toEqual(normalizeAssetBase(before[`${language}-${theme}-${width}`]!));
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await section.locator('p,a').evaluateAll(nodes=>nodes.filter(node=>node.scrollWidth>node.clientWidth+1).map(node=>node.textContent))).toEqual([]);
    if(width===1920){const rows=await section.locator('.author-contact-grid a').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().y));expect(rows.every(row=>Math.abs(row-rows[0]!)<1)).toBe(true);}
    if(language==='ru'&&(width===320||width===1920)){await section.scrollIntoViewIfNeeded();await section.screenshot({path:`qa/author-contacts/contacts-${width}-${theme}.png`});}
  }
  const url=page.url();await section.getByRole('button',{name:t.authorCopyEmail,exact:true}).click();await expect(section.getByRole('status')).toHaveText(t.authorEmailCopied);
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('danikkarnakov@gmail.com');expect(context.pages()).toHaveLength(1);expect(page.url()).toBe(url);
  await expect(section.locator('[data-contact=email]')).toHaveAttribute('href','mailto:danikkarnakov@gmail.com');
  await page.keyboard.press('Tab');await expect(section.getByRole('status')).toBeEmpty({timeout:5000});
});

test('clipboard denial and unavailable API show an honest localized message and allow retry',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('Denied','NotAllowedError');}}}));
  await page.goto('/#/author');const section=page.locator('#author-contacts');await section.getByRole('button',{name:messages.ru.authorCopyEmail,exact:true}).click();await expect(section.getByRole('status')).toHaveText(messages.ru.authorEmailCopyError);
  await page.locator('.language-select select').selectOption('de');await expect(section.getByRole('status')).toHaveText(messages.de.authorEmailCopyError);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined}));await section.getByRole('button',{name:messages.de.authorCopyEmail,exact:true}).click();await expect(section.getByRole('status')).toHaveText(messages.de.authorEmailCopyError);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));await section.getByRole('button',{name:messages.de.authorCopyEmail,exact:true}).click();await expect(section.getByRole('status')).toHaveText(messages.de.authorEmailCopied);
});

test('all unrelated sources, SQL and existing images/icons retain their original hashes',()=>{
  const source=approvedReleaseSources(JSON.parse(readFileSync('qa/author-contacts/source-before.json','utf8').replace(/^\uFEFF/,'')));
  const allowed=new Set(['src/pages/AuthorContent.tsx','src/styles/author.css','src/config/contacts.ts','src/components/ContactIcon.tsx','src/i18n/author-messages.ts','src/i18n/messages.ts']);
  for(const [file,hash]of Object.entries(source))if(!allowed.has(file.replaceAll('\\','/')))expect(createHash('sha256').update(readFileSync(file)).digest('hex'),file).toBe(hash);
});
