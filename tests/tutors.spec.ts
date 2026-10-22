import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tutors, tutorContacts } from '../src/pages/tutors/data';
import { tutorCopy } from '../src/pages/tutors/copy';
import { contactLinks, defaultFilters, filterTutors } from '../src/pages/tutors/service';
import { tutorWeb3Forms } from '../src/pages/tutors/web3forms';
import { approvedTelegramSources } from './protected-source';

mkdirSync('qa/tutors-final/screens', { recursive: true });
const root = '/#/tutors';
const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
const read = (file: string) => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
async function preferences(page: Page, language = 'en', theme = 'light') {
  await page.addInitScript(({ language, theme }) => localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme })), { language, theme });
}
async function mockedEmail(page: Page, mode: 'accepted' | 'error' | 'unconfirmed' = 'accepted', delay = 0) {
  const requests: Record<string, unknown>[] = [];
  await page.route(tutorWeb3Forms.endpoint, async route => {
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type, accept' };
    if (route.request().method() === 'OPTIONS') { await route.fulfill({ status: 204, headers }); return; }
    expect(route.request().method()).toBe('POST');
    requests.push(route.request().postDataJSON()); if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    await route.fulfill({ headers, status: mode === 'error' ? 502 : 200, json: mode === 'error' ? { success: false } : mode === 'unconfirmed' ? { message: 'Unconfirmed' } : { success: true, message: 'Email sent successfully!' } });
  });
  return requests;
}
async function fillRequest(page: Page) {
  await page.locator('#name').fill('Даниил & Anna'); await page.locator('#email').fill('student@example.org');
  await page.locator('#level').selectOption('B1'); await page.locator('#goal').selectOption('work'); await page.locator('#time').selectOption('evening'); await page.locator('#message').fill('Grüße! ü ß & + ? #\nМой вопрос.');
}
async function noOverflow(page: Page) {
  const sizes = await page.evaluate(() => [document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.scrollWidth]); expect(sizes[1]).toBeLessThanOrEqual(sizes[0]!); expect(sizes[2]).toBeLessThanOrEqual(sizes[0]!);
}

test('five Demo profiles and Daniil: biographies, regular/trial EUR prices, truthful language information and isolated contacts', () => {
  expect(tutors).toHaveLength(6); expect(tutors.filter(tutor => tutor.demo)).toHaveLength(5);
  const daniil = tutors[0]!; expect(daniil.id).toBe('daniil-karnakov'); expect(daniil.name).toBe('Daniil Karnakov'); expect(daniil.price).toBe(30); expect(daniil.trialPrice).toBe(10); expect(daniil.demo).toBe(false); expect(daniil.image).toBe('tutor_01.png');
  expect(daniil.experience).toBeNull(); expect(daniil.nativeTeachingLanguage).toBeNull(); expect(daniil.levels).toEqual([]); expect(daniil.spokenLanguages.ru).toContain('Русский и украинский — родные'); expect(daniil.spokenLanguages.ru).toContain('немецкий — B2; английский — B2');
  expect(daniil.story.ru).toBe('Меня зовут Даниил Карнаков. Я живу в Швейцарии и знаю, насколько важно владеть иностранными языками для повседневной жизни, работы и общения. Я изучал немецкий и английский до уровня B2 и продолжаю развивать свои языковые навыки.');
  expect(Object.keys(tutorContacts)).toEqual(['daniil-karnakov']); expect(contactLinks(tutorContacts[daniil.id])).toEqual({ telegram: 'https://t.me/linadkarnakov', email: null });
  for (const tutor of tutors) {
    expect(tutor.price).toBeGreaterThan(0); expect(tutor.trialPrice).toBeGreaterThan(0); expect(tutor).not.toHaveProperty('goals'); expect(tutor).not.toHaveProperty('rating'); expect(tutor).not.toHaveProperty('certificates');
    for (const language of ['ru', 'de', 'en'] as const) { expect(tutor.story[language].length).toBeGreaterThan(70); expect(tutor.about[language].length).toBeGreaterThan(200); expect(tutor.spokenLanguages[language]).toBeTruthy(); }
    if (tutor.demo) { expect(tutorContacts[tutor.id]).toBeUndefined(); expect(tutor.nativeTeachingLanguage).toBeNull(); expect(hash(`public/assets/tutors/${tutor.image}`)).toBe(read('tests/fixtures/tutor-photo-originals.json')[tutor.image]); }
  }
  for (const copy of Object.values(tutorCopy)) { expect(Object.keys(copy).sort()).toEqual(Object.keys(tutorCopy.en).sort()); expect(JSON.stringify(copy)).not.toContain('CHF'); }
  expect(contactLinks(undefined)).toEqual({ telegram: null, email: null });
});

test('name-only search and three useful filters, price/name sorting and no invented level match for Daniil', () => {
  const filter = (patch = {}) => filterTutors(tutors, { ...defaultFilters, ...patch }, 'en');
  expect(filter({ search: 'MULLER' }).map(tutor => tutor.id)).toEqual(['anna-mueller']); expect(filter({ search: 'grammar' })).toHaveLength(0);
  expect(filter({ language: 'de', level: 'A1', price: 'middle' }).map(tutor => tutor.id)).toEqual(['lukas-schneider']);
  expect(filter({ level: 'C1' }).some(tutor => tutor.founder)).toBe(false); expect(filter({ price: 'middle' }).map(tutor => tutor.price).sort()).toEqual([28, 30, 30]);
  expect(filter({ sort: 'price-asc' }).map(tutor => tutor.price)).toEqual([25, 25, 28, 30, 30, 35]); expect(filter({ sort: 'name-desc' }).map(tutor => tutor.name)).toEqual(tutors.map(tutor => tutor.name).sort().reverse());
});

test('all unrelated sources, existing photos and global settings stay unchanged; secrets and admin routing stay out of browser JavaScript', () => {
  const before: Record<string, string> = approvedTelegramSources(read('qa/tutors-final/before.json'));
  const allowed = new Set(['src/pages/tutors/Catalog.tsx', 'src/pages/tutors/Profile.tsx', 'src/pages/tutors/Forms.tsx', 'src/pages/tutors/Prepared.tsx', 'src/pages/tutors/Tutors.tsx', 'src/pages/tutors/TutorUI.tsx', 'src/pages/tutors/copy.ts', 'src/pages/tutors/data.ts', 'src/pages/tutors/model.ts', 'src/pages/tutors/service.ts', 'src/styles/tutors.css', 'vite.config.ts', 'eslint.config.js', 'tsconfig.node.json']);
  const changed = Object.keys(before).filter(file => hash(file) !== before[file]); expect(changed.filter(file => !allowed.has(file))).toEqual([]);
  const browserCode = readdirSync('dist/assets').filter(file => file.endsWith('.js')).map(file => readFileSync(`dist/assets/${file}`, 'utf8')).join('');
  for (const secret of ['RESEND_API_KEY', 'TUTORS_RATE_LIMIT_SECRET', 'test-adapter-only-not-a-real-api-key']) expect(browserCode).not.toContain(secret);
  expect(browserCode).not.toMatch(/\bsb_secret_[A-Za-z0-9_-]{15,}/);
  // The author's published contact address is intentional public information.
  expect(browserCode).toContain('danikkarnakov@gmail.com');
  expect(browserCode).toContain(tutorWeb3Forms.accessKey); expect(browserCode).toContain(tutorWeb3Forms.endpoint);
  writeFileSync('qa/tutors-final/protected-audit.json', JSON.stringify({ tracked: Object.keys(before).length, changed, unrelatedChanges: [], photosUnchanged: true, clientSecretsAbsent: true }, null, 2));
});

test('catalogue and six profiles preserve filters, direct links exist ONLY on Daniil, old URL redirects safely', async ({ page }) => {
  await preferences(page); await page.goto(root); await expect(page.locator('.tutor-card')).toHaveCount(6); await expect(page.locator('.tutor-card .tutor-demo')).toHaveCount(5);
  await expect(page.locator('select[name="goal"]')).toHaveCount(0); await page.locator('input[name="search"]').focus(); await page.keyboard.type('Anna'); await expect(page.locator('input[name="search"]')).toHaveValue('Anna'); await expect(page.locator('.tutor-card')).toHaveCount(1);
  await expect(page.locator('input[name="search"]')).toHaveCSS('outline-style', 'none'); await expect(page.locator('input[name="search"]')).toHaveCSS('box-shadow', 'none');
  await page.locator('.tutor-card a').click(); await page.locator('.tutors-back').click(); await expect(page.locator('input[name="search"]')).toHaveValue('Anna');
  await page.locator('input[name="search"]').fill('Unknown'); await expect(page.locator('.tutors-no-results')).toBeVisible(); await page.locator('.tutors-no-results button').click(); await expect(page.locator('.tutor-card')).toHaveCount(6);
  await page.locator('select[name="language"]').selectOption('de'); await page.locator('select[name="level"]').selectOption('A1'); await page.locator('select[name="price"]').selectOption('middle'); await expect(page.locator('.tutor-card h2')).toHaveText('Lukas Schneider');
  for (const field of ['language', 'level', 'price', 'sort']) { const select = page.locator(`select[name="${field}"]`); await select.focus(); await expect(select).toHaveCSS('outline-style', 'none'); await expect(select).toHaveCSS('box-shadow', 'none'); }
  for (const tutor of tutors) {
    await page.goto(`${root}/${tutor.id}`); await expect(page.locator('h1')).toHaveText(tutor.name); await expect(page.locator('.tutor-trial-price strong')).toHaveText(`${tutor.trialPrice} €`); await expect(page.locator('.tutor-biography')).toContainText(tutor.about.en.split('\n\n')[0]!);
    await expect(page.locator('.tutor-profile-bottom')).not.toContainText('Specialisations'); await expect(page.locator('.tutor-facts')).toHaveCount(0);
    if (tutor.founder) { await expect(page.locator('.tutor-direct-contact')).toBeVisible(); await expect(page.locator('[data-tutor-contact="telegram"]')).toHaveAttribute('href', 'https://t.me/linadkarnakov'); await expect(page.locator('[data-tutor-contact="email"]')).toHaveCount(0); await expect(page.locator('.tutor-profile-portrait img')).toHaveAttribute('src', './assets/tutors/tutor_01.png'); await expect(page.locator('.tutors-demo-note')).toHaveCount(0); }
    else await expect(page.locator('[data-tutor-contact], .tutor-direct-contact')).toHaveCount(0);
    await page.locator('.tutor-contact-card > a').click(); await expect(page.locator('#selected-tutor')).toHaveValue(tutor.name); await expect(page.locator('#selected-tutor')).toHaveAttribute('readonly', ''); await expect(page.locator('input[name="channel"], [data-tutor-contact]')).toHaveCount(0);
  }
  await page.goto(`${root}/daniel-wilson`); await expect(page).toHaveURL(/daniil-karnakov$/); await expect(page.locator('h1')).toHaveText('Daniil Karnakov');
  await page.goto(`${root}/prepared`); await expect(page).toHaveURL(/\/result$/); await expect(page.locator('h1')).toHaveText(tutorCopy.en.emptyTitle);
});

test('both forms are ready without a server handshake; validation and botcheck prevent API calls', async ({ page }) => {
  await preferences(page); const requests = await mockedEmail(page);
  for (const path of ['/anna-mueller/request', '/become']) { await page.goto(`${root}${path}`); await expect(page.locator('button[type="submit"]')).toBeEnabled(); await expect(page.locator('.tutors-form [role="status"]')).toHaveText(tutorCopy.en.ready); await expect(page.locator('input[name="botcheck"]')).toBeHidden(); await page.locator('button[type="submit"]').click(); await expect(page.locator('.tutors-error-summary')).toBeVisible(); }
  expect(requests).toHaveLength(0);
  await page.goto(`${root}/daniil-karnakov/request`); await fillRequest(page); await page.locator('#botcheck').evaluate(node => { (node as HTMLInputElement).checked = true; }); await page.locator('button[type="submit"]').click();
  await expect(page.locator('.tutors-form [role="alert"]')).toHaveText(tutorCopy.en.spam); expect(requests).toHaveLength(0);
});

test('all six student forms send complete Web3Forms payloads and show success only with a mocked success response', async ({ page }) => {
  await preferences(page); const requests = await mockedEmail(page, 'accepted', 100);
  for (const tutor of tutors) {
    await page.goto(`${root}/${tutor.id}/request`); await fillRequest(page); await expect(page.locator('button[type="submit"]')).toBeEnabled(); await page.locator('button[type="submit"]').dblclick();
    await expect(page).toHaveURL(/\/result$/); await expect(page.locator('h1')).toHaveText(tutorCopy.en.receivedTitle); await expect(page.locator('.tutors-prepared')).toContainText(tutorCopy.en.acceptedNote);
    expect(requests.at(-1)).toEqual(expect.objectContaining({ access_key: tutorWeb3Forms.accessKey, name: 'Даниил & Anna', email: 'student@example.org', replyto: 'student@example.org', botcheck: false, subject: `LINAD — Запрос на занятие — ${tutor.name}`, 'Преподаватель': tutor.name, 'ID преподавателя': tutor.id, 'Язык обучения': tutor.languages[0] === 'de' ? 'Немецкий' : 'Английский', 'Текущий уровень': 'B1', 'Цель обучения': 'Работа', 'Удобное время': 'Будни вечером', message: 'Grüße! ü ß & + ? #\nМой вопрос.' }));
  }
  expect(requests).toHaveLength(6); expect(requests.every(body => !('to' in body) && !('recipient' in body))).toBe(true); expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('student@example.org');
  await page.reload(); await expect(page.locator('h1')).toHaveText(tutorCopy.en.emptyTitle);
});

for (const mode of ['error', 'unconfirmed'] as const) test(`failed or unconfirmed send preserves fields and enables a real retry: ${mode}`, async ({ page }) => {
  await preferences(page); const requests = await mockedEmail(page, mode); await page.goto(`${root}/daniil-karnakov/request`); await fillRequest(page); await page.locator('button[type="submit"]').click();
  await expect(page.locator('.tutors-form [role="alert"]')).toHaveText(tutorCopy.en.sendError); await expect(page.locator('#name')).toHaveValue('Даниил & Anna'); await expect(page.locator('button[type="submit"]')).toBeEnabled(); await expect(page).not.toHaveURL(/\/result$/);
  await page.locator('button[type="submit"]').click(); await expect.poll(() => requests.length).toBe(2);
});

test('teacher application validates every required field, has no price/specialisation, and posts the full application', async ({ page }) => {
  await preferences(page); const requests = await mockedEmail(page); await page.goto(`${root}/become`); await expect(page.locator('#price, #specialization')).toHaveCount(0);
  await page.locator('button[type="submit"]').click(); await expect(page.locator('#languages-error')).toBeVisible(); await expect(page.locator('#levels-error')).toBeVisible();
  await page.locator('#name').fill('Candidate Test'); await page.locator('#email').fill('candidate@example.org'); await page.locator('input[name="languages"][value="de"]').check(); await page.locator('#spokenLanguages').fill('Русский, немецкий B2'); await page.locator('#education').fill('Нет сертификатов'); await page.locator('#experience').fill('Начинаю преподавать'); await page.locator('input[name="levels"][value="A1"]').check(); await page.locator('#about').fill('Моя история о языках.'); await page.locator('#additional').fill('Можно написать по email.');
  await page.locator('button[type="submit"]').click(); await expect(page.locator('h1')).toHaveText(tutorCopy.en.applicationReceived);
  expect(requests[0]).toEqual(expect.objectContaining({ access_key: tutorWeb3Forms.accessKey, name: 'Candidate Test', email: 'candidate@example.org', replyto: 'candidate@example.org', botcheck: false, subject: 'LINAD — Заявка преподавателя — Candidate Test', 'Языки преподавания': 'Немецкий', 'Языки общения': 'Русский, немецкий B2', 'Образование и сертификаты': 'Нет сертификатов', 'Опыт преподавания': 'Начинаю преподавать', 'Уровни учеников': 'A1', message: 'Моя история о языках.', 'Дополнительная информация': 'Можно написать по email.' }));
});

test('validation and service errors translate live in RU/DE/EN without losing typed values', async ({ page }) => {
  await preferences(page); await mockedEmail(page, 'error'); await page.goto(`${root}/become`); await page.locator('#name').fill('Candidate'); await page.locator('button[type="submit"]').click();
  for (const language of ['ru', 'de', 'en'] as const) { await page.locator('.language-select select').selectOption(language); await expect(page.locator('#email-error')).toHaveText(tutorCopy[language].emailError); await expect(page.locator('#levels-error')).toHaveText(tutorCopy[language].levelsError); await expect(page.locator('#name')).toHaveValue('Candidate'); }
  await page.goto(`${root}/anna-mueller/request`); await fillRequest(page); await page.locator('button[type="submit"]').click();
  for (const language of ['ru', 'de', 'en'] as const) { await page.locator('.language-select select').selectOption(language); await expect(page.locator('.tutors-form [role="alert"]')).toHaveText(tutorCopy[language].sendError); await expect(page.locator('#name')).toHaveValue('Даниил & Anna'); }
});

for (const language of ['ru', 'de', 'en'] as const) for (const theme of ['light', 'dark'] as const) for (const width of [360, 768, 1024, 1440]) test(`Tutors EUR content, forms, themes and layout: ${language} ${theme} ${width}px`, async ({ page }) => {
  await preferences(page, language, theme); await page.setViewportSize({ width, height: 950 }); await mockedEmail(page); const copy = tutorCopy[language]; const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  for (const [name, path] of [['catalog', ''], ['daniil', '/daniil-karnakov'], ['demo', '/anna-mueller'], ['request', '/daniil-karnakov/request'], ['teacher', '/become']] as const) {
    await page.goto(`${root}${path}`); await expect(page.locator('.tutors-page h1')).toBeVisible(); await noOverflow(page); await expect(page.locator('.tutors-page')).not.toContainText('CHF');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme); await expect(page.locator('.site-header')).toHaveCount(1); await expect(page.locator('.site-footer')).toHaveCount(1);
    if (name === 'catalog') {
      await expect(page.locator('.tutor-card .tutor-demo')).toHaveCount(5); await expect(page.locator('.tutor-card-story')).toHaveCount(6); await expect(page.locator('select[name="goal"]')).toHaveCount(0);
      await expect(page.locator('.tutor-card').first()).toHaveAttribute('data-tutor-id', 'daniil-karnakov'); await expect(page.locator('.tutors-demo-note')).toHaveCount(0);
      const cards = await page.locator('.tutor-card').evaluateAll(nodes => nodes.map(node => {
        const card = node.getBoundingClientRect(); const bottom = node.querySelector('.tutor-card-bottom')!.getBoundingClientRect(); const button = node.querySelector('.tutor-card-bottom .button')!.getBoundingClientRect(); const trial = node.querySelector('.tutor-trial-price')!.getBoundingClientRect();
        return { top: card.top, bottom: bottom.bottom, button: button.bottom, trial: trial.bottom, gap: card.bottom - bottom.bottom, padding: parseFloat(getComputedStyle(node).paddingBottom) + 1 };
      }));
      for (const card of cards) {
        expect(Math.abs(card.gap - card.padding)).toBeLessThan(2); expect(Math.abs(card.button - card.bottom)).toBeLessThan(2);
        for (const other of cards.filter(other => Math.abs(other.top - card.top) < 2)) { expect(Math.abs(other.bottom - card.bottom)).toBeLessThan(2); expect(Math.abs(other.trial - card.trial)).toBeLessThan(2); }
      }
    }
    if (name === 'daniil' || name === 'demo') {
      if (name === 'daniil') { await expect(page.locator('.tutors-demo-note')).toHaveCount(0); await expect(page.locator('.tutor-profile-portrait img')).toHaveAttribute('src', './assets/tutors/tutor_01.png'); }
      if (width >= 768 && width < 1200) {
        const portrait = (await page.locator('.tutor-profile-portrait').boundingBox())!; const contact = (await page.locator('.tutor-contact-card').boundingBox())!;
        expect(Math.abs(contact.x - portrait.x)).toBeLessThan(2); expect(Math.abs(contact.y - portrait.y - portrait.height - 24)).toBeLessThan(2);
        const biography = (await page.locator('.tutor-profile-main').boundingBox())!; const details = (await page.locator('.tutor-profile-bottom').boundingBox())!;
        expect(Math.abs(details.y - biography.y - biography.height - 24)).toBeLessThan(2);
      }
    }
    if (name === 'request' || name === 'teacher') await expect(page.locator('button[type="submit"]')).toHaveText(copy.send);
    if (language === 'de') { for (const image of await page.locator('.tutors-page img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(node => (node as HTMLImageElement).decode()); } await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `qa/tutors-final/screens/${name}-${width}-${theme}.png`, fullPage: true }); }
  }
  await page.goto(`${root}/daniil-karnakov/request`); await fillRequest(page); await page.locator('button[type="submit"]').click(); await expect(page.locator('h1')).toHaveText(copy.receivedTitle); await noOverflow(page); expect(errors).toEqual([]);
});

test('320px keyboard name search and EUR prices remain usable', async ({ page }) => {
  await preferences(page, 'de', 'dark'); await page.setViewportSize({ width: 320, height: 800 }); await page.goto(root); await expect(page.locator('h1')).toBeFocused(); await page.locator('input[name="search"]').focus(); await page.keyboard.type('Daniil'); await expect(page.locator('input[name="search"]')).toHaveValue('Daniil'); await expect(page.locator('.tutor-card')).toHaveCount(1); await noOverflow(page);
  await page.locator('.tutor-card a').focus(); await page.keyboard.press('Enter'); await expect(page.locator('h1')).toHaveText('Daniil Karnakov'); await noOverflow(page);
});
