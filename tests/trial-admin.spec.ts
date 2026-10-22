import { test, expect, type Page } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { emptyDocument, mergeDocuments } from '../src/account/document';
import { firstModule, mergeTrial, safeReturn, trialDocument } from '../src/account/trial';
import { lessonCatalog, lessonKey } from '../src/pages/learning/levels/data/lessons';
import { requiredTasks, miniTestTasks, moduleStatus } from '../src/pages/learning/levels/progress';
import { moduleExams } from '../src/pages/learning/levels/data/module-exams';
import { examTasks, gradeTasks, type Task } from '../src/pages/learning/levels/tasks';
import { courseCopy } from '../src/pages/learning/levels/course-copy';
import { trialCopy } from '../src/account/trial-copy';
import { adminCopy } from '../src/admin/copy';
import { mockSupabase, host, uuid } from './account-helpers';
import type { AdminDashboard } from '../src/admin/types';
import { approvedReleaseSources } from './protected-source';
mkdirSync('qa/trial-admin', { recursive: true });
const modulePath = '/learn/levels/modules/A1/introductions';
const trialScope = { language: 'de' as const, level: 'A1' as const, moduleId: 'introductions' };
function answer(task: Task) {
  return task.kind === 'choice' ? task.correct : task.kind === 'input' ? task.accepted[0]! : task.kind === 'order' ? JSON.stringify(task.acceptedOrders[0]) : JSON.stringify(Object.fromEntries(task.pairs.map(pair => [pair.id, pair.id])));
}
function finishedGuest(exam = true) {
  const doc = emptyDocument(); const at = new Date().toISOString(); doc.updatedAt = at;
  doc.levels.setupComplete.de = true;
  for (const lesson of Object.values(lessonCatalog.de)) {
    const tasks = miniTestTasks(lesson); const answers = Object.fromEntries(tasks.map(task => [task.id, answer(task)]));
    doc.levels.lessons[lessonKey('de', lesson.id)] = { visited: [0,1,2,3,4,5,6], practice: requiredTasks(lesson).map(task => ({ taskId: task.id, answer: answer(task), checkedAt: at })), attempts: [{ answers, ...gradeTasks(tasks, answers), completedAt: at }] };
  }
  if (exam) {
    const tasks = examTasks(moduleExams[0]!, 23); const answers = Object.fromEntries(tasks.map(task => [task.id, answer(task)]));
    doc.levels.moduleAttempts['de:A1:introductions'] = [{ id: 'guest-first-pass', seed: 23, taskIds: tasks.map(task => task.id), answers, ...gradeTasks(tasks, answers), completedAt: at }];
  }
  return doc;
}
async function fillTask(page: Page, task: Task, right = true) {
  const field = page.locator(`[data-question-id="${task.id}"]`);
  if (task.kind === 'choice') await field.getByRole('radio', { name: right ? task.correct : task.options.find(option=>option!==task.correct)!, exact: true }).check();
  else if (task.kind === 'input') await field.getByRole('textbox').fill(right ? task.accepted[0]! : 'falsch');
}
async function login(page: Page) {
  await page.getByLabel('Email', { exact: true }).fill('learner@example.test'); await page.locator('input[name=password]').fill('safe-password-123');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

test('first module is determined per language and level; trial extraction/merge is scoped, idempotent and preserves other account history', () => {
  expect(firstModule('de','A1')?.id).toBe('introductions');expect(firstModule('de','A2')?.id).toBe('past');expect(firstModule('en','B1')?.id).toBe('perfect');
  const guest = finishedGuest(); const unrelated = lessonCatalog.en['first-introductions']!;
  guest.levels.lessons[lessonKey('en',unrelated.id)] = { visited:[0], attempts:[] };
  const trial = trialDocument(guest,[trialScope]); expect(Object.keys(trial.levels.lessons)).toHaveLength(5); expect(trial.levels.lessons['en:first-introductions']).toBeUndefined();
  const account = emptyDocument(); account.levels.lessons['en:first-introductions'] = { visited:[0,1],attempts:[] }; account.levels.selectedLevels.en = 'B2'; account.levels.setupComplete.en = true;
  const merged = mergeTrial(account,trial); expect(merged.levels.selectedLevels.en).toBe('B2'); expect(merged.levels.lessons['en:first-introductions']?.visited).toEqual([0,1]);
  expect(moduleStatus(merged.levels,'de','A1','introductions').completed).toBe(true);
  expect(mergeTrial(merged,trial)).toEqual(merged); expect(mergeDocuments(merged,trial).levels.moduleAttempts['de:A1:introductions']).toHaveLength(1);
  for (const path of ['https://evil.test','//evil.test','/admin','/auth/login','javascript:alert(1)']) expect(safeReturn(path)).toBe('/profile');
});

test('guest can finish real first-module exam; prompt survives reload; direct second module and its exam require login', async ({ page }) => {
  const backend = await mockSupabase(page,{language:'en',guest:finishedGuest(false)});
  await page.goto(`/#${modulePath}/final`); const c = courseCopy('ru');
  await expect(page.getByRole('dialog')).toHaveCount(0); await page.getByRole('button',{name:c.start,exact:true}).click();
  let ids = await page.locator('[data-question-id]').evaluateAll(fields => fields.map(field => field.getAttribute('data-question-id')!));
  for (const [index,id] of ids.entries()) await fillTask(page,moduleExams[0]!.bank.find(task => task.id === id)!,index<7);
  await page.getByRole('button',{name:c.submit,exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('.level-exam-result')).toContainText('70%');
  await page.getByRole('button',{name:c.retry,exact:true}).click();ids=await page.locator('[data-question-id]').evaluateAll(fields=>fields.map(field=>field.getAttribute('data-question-id')!));
  for (const id of ids) await fillTask(page,moduleExams[0]!.bank.find(task=>task.id===id)!);
  await page.getByRole('button',{name:c.submit,exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText(trialCopy('en').done);
  await page.reload(); await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/#/learn/levels/modules/A1/nouns/final'); await expect(page.locator('.trial-gate')).toBeVisible(); await expect(page.locator('[data-question-id]')).toHaveCount(0);
  await page.goto('/#/learn/levels/modules/A1/nouns'); await expect(page.locator('.trial-gate')).toBeVisible();
  expect(backend.calls.filter(call => call.path.includes('linad_commit_account'))).toHaveLength(0);
});

test('signup without session preserves trial until confirmed login, cloud retries are idempotent, reload and another account are isolated', async ({ page }) => {
  const backend = await mockSupabase(page,{language:'en',guest:finishedGuest()});
  const remote=emptyDocument();remote.levels.lessons['en:first-introductions']={visited:[0,1],attempts:[]};backend.cloud.set(uuid,{revision:4,data:remote});
  await page.goto(`/#${modulePath}`); await page.getByRole('dialog').getByRole('button',{name:trialCopy('en').register}).click();
  await page.getByLabel('First name',{exact:true}).fill('Learner');await page.getByLabel('Last name',{exact:true}).fill('Test');await page.getByLabel('Email',{exact:true}).fill('learner@example.test');
  await page.locator('input[name=password]').fill('safe-password-123');await page.locator('input[name=confirm]').fill('safe-password-123');await page.getByRole('button',{name:'Create account',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('confirm your email');
  await page.reload();
  const before=await page.evaluate(() => ({tickets:JSON.parse(localStorage.getItem('linad.trial-transfers.v1')!),guest:JSON.parse(localStorage.getItem('linad.levels.v1')!)}));
  expect(before.tickets[0].userId).toBeNull();expect(before.guest.moduleAttempts['de:A1:introductions']).toHaveLength(1);
  backend.controls.schemaMissing=true;
  await page.goto('/#/auth/login');await login(page);await expect(page).toHaveURL(new RegExp(modulePath+'$'));await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.trial-pending')).toBeVisible();await page.reload();await expect(page.locator('.trial-pending')).toBeVisible();
  backend.controls.schemaMissing=false;await page.getByRole('button',{name:trialCopy('en').retry}).click();
  await expect.poll(() => backend.cloud.get(uuid)?.data.levels.moduleAttempts['de:A1:introductions']?.length).toBe(1);
  await expect.poll(() => backend.cloud.get(uuid)?.data.levels.lessons['en:first-introductions']?.visited).toEqual([0,1]);
  await page.reload();await expect(page.locator('.trial-pending')).toHaveCount(0);expect(moduleStatus(backend.cloud.get(uuid)!.data.levels,'de','A1','introductions').completed).toBe(true);
  await page.goto('/#/learn/levels/modules/A1/nouns');await expect(page.locator('.trial-gate')).toHaveCount(0);
  await page.goto('/#/profile/settings');await page.getByRole('button',{name:'Sign out',exact:true}).click();
  await page.goto('/#/auth/login');await page.getByLabel('Email',{exact:true}).fill('second@example.test');await page.locator('input[name=password]').fill('safe-password-123');await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect.poll(()=>backend.cloud.has('22222222-2222-4222-8222-222222222222')).toBe(true);expect(backend.cloud.get('22222222-2222-4222-8222-222222222222')?.data.levels.moduleAttempts['de:A1:introductions']).toBeUndefined();
});

for (const language of ['ru','de','en'] as const) for (const theme of ['light','dark'] as const) test(`trial dialog ${language} ${theme} mobile keyboard and no overflow`, async ({page}) => {
  await mockSupabase(page,{language,theme,guest:finishedGuest()});await page.setViewportSize({width:390,height:844});await page.goto(`/#${modulePath}`);
  const dialog=page.getByRole('dialog');await expect(dialog).toContainText(trialCopy(language).done);await expect(dialog.getByRole('button',{name:trialCopy(language).register})).toBeVisible();
  await dialog.getByRole('button',{name:trialCopy(language).login}).focus();await page.keyboard.press('Tab');expect(await dialog.evaluate(element=>element.contains(document.activeElement))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await dialog.evaluate(element => element.scrollWidth<=element.clientWidth)).toBe(true);
  if(language==='ru') await page.screenshot({path:`qa/trial-admin/trial-mobile-${theme}.png`});
  await page.setViewportSize({width:1440,height:1000});await expect(dialog).toBeVisible();if(language==='ru')await page.screenshot({path:`qa/trial-admin/trial-desktop-${theme}.png`});
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
});

async function adminBackend(page:Page,allowed=true,language:'ru'|'de'|'en'='en',theme:'light'|'dark'='light') {
  const backend=await mockSupabase(page,{signedIn:true,language,theme});
  let dashboardCalls=0;
  const user={user_id:uuid,full_name:'Learner Test',email:'learner@example.test',created_at:'2026-10-20T10:00:00Z',email_confirmed_at:'2026-10-20T10:00:00Z',study_languages:[{language:'de' as const,level:'A2' as const}],lessons_completed:5,modules_completed:1};
  const response:AdminDashboard={total:1,today:0,registrations_7d:1,registrations_30d:1,active_7d:null,active_30d:null,activity_since:'2026-10-21T10:00:00Z',progress_accounts:1,users:[user],filtered_total:1,courses:[{language:'de',level:'A1',learners:1,completed_lessons:5,completed_modules:1}]};
  await page.route(`${host}/rest/v1/rpc/linad_is_admin`,route=>route.fulfill({json:allowed}));
  await page.route(`${host}/rest/v1/rpc/linad_admin_dashboard`,route=>{dashboardCalls++;const body=route.request().postDataJSON();return route.fulfill({json:{...response,users:body.p_search==='missing'?[]:response.users,filtered_total:body.p_search==='missing'?0:1}});});
  await page.route(`${host}/rest/v1/rpc/linad_admin_user`,route=>route.fulfill({json:{user,modules:[{module_id:'de:A1:introductions',language:'de',completed_lessons:5,completed:true,percent:100}],lessons:[{lesson_id:'de:first-introductions',attempts:1,score:5,total:5,updated_at:'2026-10-20T10:00:00Z'}]}}));
  return {...backend,dashboardCalls:()=>dashboardCalls};
}
test('admin is denied to an ordinary user even with client metadata; missing migration fails closed',async({page})=>{
  const backend=await adminBackend(page,false);backend.users.get(uuid)!.user_metadata={full_name:'admin'};
  await page.goto('/#/admin');await expect(page.getByRole('heading',{name:'Administrators only'})).toBeVisible();expect(backend.dashboardCalls()).toBe(0);
  await page.route(`${host}/rest/v1/rpc/linad_is_admin`,route=>route.fulfill({status:404,json:{code:'PGRST202'}}));await page.reload();await expect(page.getByRole('heading')).toContainText('Server verification is unavailable');expect(backend.dashboardCalls()).toBe(0);
});
test('anonymous admin route requests no administrative API',async({page})=>{
  const backend=await mockSupabase(page);await page.goto('/#/admin');await expect(page.getByRole('heading',{name:'Administrators only'})).toBeVisible();expect(backend.calls.some(call=>call.path.includes('linad_admin_'))).toBe(false);
});
test('admin dashboard uses real server values, unknown analytics, search, filters and detailed progress',async({page})=>{
  await adminBackend(page);await page.goto('/#/admin');await expect(page.locator('.admin-table').first()).toContainText('learner@example.test');
  await expect(page.locator('.admin-metrics article').filter({hasText:'Active: 7 days'})).toContainText('No reliable data');
  await page.getByRole('button',{name:'Progress',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('100%');await expect(page.getByRole('dialog')).toContainText('5/5');await page.keyboard.press('Escape');
  await page.getByLabel('Search name or email').fill('missing');await page.getByRole('combobox',{name:'Learning language',exact:true}).selectOption('de');await page.getByRole('combobox',{name:'Self-assessed level',exact:true}).selectOption('A2');await page.getByRole('button',{name:'Search',exact:true}).click();await expect(page.getByText('No matching users')).toBeVisible();
});
for (const language of ['ru','de','en'] as const) for (const theme of ['light','dark'] as const) test(`admin ${language} ${theme} mobile and theme`,async({page})=>{
  await adminBackend(page,true,language,theme);await page.setViewportSize({width:390,height:844});await page.goto('/#/admin');await expect(page.getByRole('heading',{name:adminCopy(language).title,exact:true})).toBeVisible();await expect(page.locator('.admin-metrics')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(language==='ru')await page.screenshot({path:`qa/trial-admin/admin-mobile-${theme}.png`});
  await page.setViewportSize({width:1440,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(language==='ru')await page.screenshot({path:`qa/trial-admin/admin-desktop-${theme}.png`});
});

test('static email confirmation callback transfers first module and restores it on another device',async({page,browser})=>{
  const backend=await mockSupabase(page,{language:'en',guest:finishedGuest()});await page.goto(`/#${modulePath}`);await page.getByRole('dialog').getByRole('button',{name:trialCopy('en').register}).click();
  await page.getByLabel('First name',{exact:true}).fill('Learner');await page.getByLabel('Last name',{exact:true}).fill('Test');await page.getByLabel('Email',{exact:true}).fill('learner@example.test');await page.locator('input[name=password]').fill('safe-password-123');await page.locator('input[name=confirm]').fill('safe-password-123');await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(page.getByRole('status')).toContainText('confirm your email');
  await page.goto('/auth-callback.html?mode=confirm&code=first-module-confirmation');await expect(page).toHaveURL(new RegExp(modulePath+'$'));await expect.poll(()=>backend.cloud.get(uuid)?.data.levels.moduleAttempts['de:A1:introductions']?.length).toBe(1);
  expect(await page.evaluate(()=>localStorage.getItem('linad.auth-return.v1'))).toBeNull();
  const context=await browser.newContext();const device=await context.newPage();const remote=await mockSupabase(device,{signedIn:true});remote.cloud.set(uuid,structuredClone(backend.cloud.get(uuid)!));await device.goto(`/#${modulePath}`);await expect(device.getByRole('dialog')).toHaveCount(0);await expect.poll(async()=>device.locator('.level-card').first().locator('progress').getAttribute('value')).toBe('100');await context.close();
});

test('real authenticated learning emits own activity; profile reads and imported history do not',async({page})=>{
  const backend=await mockSupabase(page,{signedIn:true});await page.goto('/#/profile');await expect(page.locator('.account-content')).toBeVisible();expect(backend.calls.some(call=>call.path.includes('linad_record_learning_activity'))).toBe(false);
  await page.goto('/#/learn/levels/lessons/A1/introductions/first-introductions');await expect.poll(()=>backend.calls.filter(call=>call.path.includes('linad_record_learning_activity')).length).toBe(1);expect(backend.calls.find(call=>call.path.includes('linad_record_learning_activity'))?.body).toEqual({p_kind:'lesson',p_language:'de'});
});

test('signing in from a later English module preserves the chosen language and level without inventing progress',async({page})=>{
  const guest=emptyDocument();guest.levels.targetLanguage='en';guest.levels.selectedLevels.en='A2';
  const backend=await mockSupabase(page,{guest});await page.goto('/#/learn/levels/modules/A2/quantity');await expect(page.locator('.trial-gate')).toBeVisible();await page.getByRole('button',{name:trialCopy('en').login,exact:true}).click();await login(page);await expect(page).toHaveURL(/modules\/A2\/quantity$/);await expect(page.locator('.trial-gate')).toHaveCount(0);
  await expect.poll(()=>backend.cloud.get(uuid)?.data.levels.targetLanguage).toBe('en');expect(backend.cloud.get(uuid)?.data.levels.selectedLevels.en).toBe('A2');expect(backend.cloud.get(uuid)?.data.levels.moduleAttempts).toEqual({});
});

test('only the necessary auth, routing and learning integration files change; all other existing sources and SQL stay byte-identical',()=>{
  const before=approvedReleaseSources(JSON.parse(readFileSync('qa/trial-admin/source-before.json','utf8').replace(/^\uFEFF/,'')));
  const allowed=new Set(['src/account/AuthProvider.tsx','src/account/AuthPage.tsx','src/account/client.ts','src/account/Account.tsx','src/app/App.tsx','src/pages/learning/levels/LevelLearning.tsx','src/pages/learning/levels/useLevelsStore.ts','src/pages/learning/practice/PracticeWorkspace.tsx']);
  for(const [path,hash] of Object.entries(before))if(!allowed.has(path.replaceAll('\\','/')))expect(createHash('sha256').update(readFileSync(path)).digest('hex'),path).toBe(hash);
});

test('migration uses server role checks, fixed search paths, private RLS, own server-timed activity and no general user-data grants',()=>{
  const sql=readFileSync('supabase/migrations/202610210003_trial_admin.sql','utf8');
  expect(sql.match(/if not public.linad_is_admin\(\)/g)).toHaveLength(2);expect(sql).toContain('a.user_id=auth.uid()');expect(sql).toContain('set search_path = \'\'');
  expect(sql).toContain('revoke all on schema linad_private from public, anon, authenticated');expect(sql).toContain('alter table linad_private.admin_members enable row level security');expect(sql).toContain('primary key(user_id,activity_date)');
  expect(sql).not.toMatch(/grant\s+(?:all|select).*on\s+(?:table\s+)?(?:auth\.users|public\.(?:profiles|account_state))/i);
  expect(sql).not.toMatch(/insert into linad_private.admin_members|service_role|delete from public\./i);
  const original=readFileSync('supabase/INSTALL_LINAD_ACCOUNTS.sql','utf8');expect(original).toContain('using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)');
});
