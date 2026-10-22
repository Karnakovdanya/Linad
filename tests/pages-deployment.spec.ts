import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { assertApprovedInventory } from './protected-source';
import { mockSupabase, host } from './account-helpers';

test('the approved design, all application sources, SQL, learning materials and images remain intact', () => {
  assertApprovedInventory();
});

test('Pages deployment requires successful checks, the main branch and an explicit owner opt-in', () => {
  const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');
  expect(workflow).toContain("vars.PAGES_PUBLISH_ENABLED == 'true'");
  expect(workflow.match(/github\.event_name != 'pull_request'/g)).toHaveLength(2);
  expect(workflow.match(/github\.ref == 'refs\/heads\/main'/g)).toHaveLength(2);
  expect(workflow).toContain('needs: check');
  expect(workflow).toContain('path: dist');
  expect(workflow).toContain('run: npm test');
  expect(workflow).toContain('run: npm run build');
  expect(workflow).toContain('run: node tools/check-public-env.mjs');
  expect(workflow).not.toMatch(/pull_request_target|continue-on-error|service_role|sb_secret_/i);
  expect(workflow.slice(0, workflow.indexOf('  deploy:'))).not.toContain('pages: write');
});

test('build preflight accepts only public configuration and never logs rejected credentials', () => {
  const publicKey = 'sb_publishable_test_configuration_123456789';
  const privateKey = ['sb', 'secret', 'test_must_never_appear_in_logs'].join('_');
  const run = (change: Record<string, string>) => spawnSync(process.execPath, ['tools/check-public-env.mjs'], {
    env: { ...process.env, VITE_SUPABASE_URL: 'https://project.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: publicKey, ...change }, encoding: 'utf8',
  });
  expect(run({}).status).toBe(0);
  const rejected: Record<string, string>[] = [{ VITE_SUPABASE_URL: '' }, { VITE_SUPABASE_PUBLISHABLE_KEY: '' },
    { VITE_SUPABASE_PUBLISHABLE_KEY: privateKey }, { VITE_SUPABASE_URL: 'https://user:password@project.supabase.co' },
    { VITE_SUPABASE_SERVICE_ROLE_KEY: privateKey }];
  for (const change of rejected) {
    const result = run(change);
    expect(result.status).toBe(1);
    expect(result.stderr + result.stdout).not.toContain(privateKey);
    expect(result.stderr + result.stdout).not.toContain(publicKey);
    expect(result.stderr + result.stdout).not.toContain('user:password');
  }
  for (const apiPath of ['/rest/v1/', '/auth/v1/']) {
    const result = run({ VITE_SUPABASE_URL: `https://project.supabase.co${apiPath}` });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Remove API paths');
    expect(result.stderr).toContain('GitHub Actions repository variable');
    expect(result.stderr + result.stdout).not.toContain(publicKey);
  }
});

test('production artifacts contain every public resource and no environment files or private keys', () => {
  const files = readdirSync('dist', { recursive: true }).map(file => file.toString().replaceAll('\\', '/'));
  expect(files).not.toContain('.env.local');
  expect(files.filter(file => /(^|\/)\.env(?:\.|$)|\.(pem|pfx|p12|key)$/.test(file))).toEqual([]);
  for (const name of readdirSync('public', { recursive: true, withFileTypes: true }).filter(entry => entry.isFile())) {
    const relative = join(name.parentPath, name.name).replaceAll('\\', '/').replace(/^public\//, '');
    expect(files, relative).toContain(relative);
  }
  for (const file of files.filter(file => /\.(js|html|css)$/.test(file))) {
    const content = readFileSync(join('dist', file), 'utf8');
    expect(content).not.toMatch(/\bsb_secret_[A-Za-z0-9_-]{16,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
    for (const token of content.matchAll(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g)) {
      const payload = JSON.parse(Buffer.from(token[0].split('.')[1]!, 'base64url').toString());
      expect(payload.role).not.toBe('service_role');
    }
  }
});

test('HashRouter, authenticated profile, protected admin and callback work on a strict repository subpath', async ({ page, request }) => {
  const prefix = '/linad-pages-test/';
  const files = new Set(readdirSync('dist', { recursive: true, withFileTypes: true }).filter(entry => entry.isFile()).map(entry => join(entry.parentPath, entry.name).replaceAll('\\', '/').replace(/^dist\//, '')));
  const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
  const server = createServer((req, res) => {
    const pathname = new URL(req.url!, 'http://localhost').pathname;
    const file = pathname.startsWith(prefix) ? decodeURIComponent(pathname.slice(prefix.length)) || 'index.html' : '';
    if (!files.has(file)) { res.writeHead(404); res.end('Not found'); return; }
    res.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
    res.end(readFileSync(join('dist', file)));
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('No local test port');
  const base = `http://127.0.0.1:${address.port}${prefix}`;
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const backend = await mockSupabase(page, { signedIn: true, language: 'en' });
  await page.route(`${host}/rest/v1/rpc/linad_is_admin`, route => route.fulfill({ json: false }));
  try {
    await page.goto(base + '#/profile'); await expect(page.locator('.account-content')).toBeVisible();
    await page.reload(); await expect(page.locator('.account-content')).toBeVisible();
    await page.goto(base + '#/learn'); await expect(page.locator('main h1')).toHaveText('Learning');
    await page.goto(base + '#/admin'); await expect(page.locator('main h1')).toHaveText('Administrators only');
    expect(backend.calls.some(call => /linad_admin_(dashboard|user)/.test(call.path))).toBe(false);
    await page.goto(base + 'auth-callback.html?mode=confirm&code=pages-test-confirmation');
    await expect(page).toHaveURL(base + '#/profile');
    await expect(page.locator('.account-content')).toBeVisible();
    for (const file of files) expect((await request.get(base + file)).status(), file).toBe(200);
    expect((await request.get(base + 'profile')).status()).toBe(404);
    expect((await request.get(base + 'admin')).status()).toBe(404);
    expect(errors).toEqual([]);
  } finally { await page.goto('about:blank'); await new Promise<void>(resolve => server.close(() => resolve())); }
});
