import type { Page } from '@playwright/test';
import type { AccountDocument } from '../src/account/document';
import type { UiLanguage } from '../src/domain/types';
export const host = 'https://agcvacclaebekvcblvod.supabase.co';
export const uuid = '11111111-1111-4111-8111-111111111111';
const secondId = '22222222-2222-4222-8222-222222222222';
function identity(id = uuid) { return { id, aud: 'authenticated', role: 'authenticated', email: id === uuid ? 'learner@example.test' : 'second@example.test', email_confirmed_at: '2026-10-20T10:00:00Z', user_metadata: { full_name: id === uuid ? 'Learner' : 'Second' }, app_metadata: { provider: 'email', providers: ['email'] }, identities: [{ id, user_id: id, provider: 'email' }], created_at: '2026-10-20T10:00:00Z' }; }
function session(id = uuid) {
  const enc = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return { access_token: `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc({ sub: id, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.test-signature`, refresh_token: `test-refresh-${id}`, token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: identity(id) };
}
export async function mockSupabase(page: Page, options: { signedIn?: boolean; language?: UiLanguage; theme?: 'light' | 'dark'; guest?: AccountDocument; schemaMissing?: boolean } = {}) {
  const calls: { path: string; body: Record<string, unknown> }[] = []; const cloud = new Map<string, { revision: number; data: AccountDocument }>(); const profiles = new Map<string, object>();
  const images = new Set<string>(); const users = new Map([[uuid, identity(uuid)], [secondId, identity(secondId)]]);
  const controls = { uploadError: false, bucketMissing: false, profileError: false, profileMissing: false, authUpdateError: false, schemaMissing: options.schemaMissing ?? false };
  await page.addInitScript(({ signedIn, language, theme, guest, session }) => {
    if (!sessionStorage.getItem('account-test-initialized')) {
      localStorage.setItem('linad.preferences.v1', JSON.stringify({ version: 1, uiLanguage: language, theme, learningLanguage: 'de' }));
      if (signedIn) localStorage.setItem('sb-agcvacclaebekvcblvod-auth-token', JSON.stringify(session));
      if (guest) { localStorage.setItem('linad.levels.v1', JSON.stringify(guest.levels)); localStorage.setItem('linad.practice.v1', JSON.stringify(guest.practice)); }
      sessionStorage.setItem('account-test-initialized', 'yes');
    }
  }, { signedIn: options.signedIn ?? false, language: options.language ?? 'en', theme: options.theme ?? 'light', guest: options.guest, session: session() });
  await page.route(`${host}/**`, async route => {
    const req = route.request(); const url = new URL(req.url()); const body = req.headers()['content-type']?.includes('application/json') ? req.postDataJSON() ?? {} : {}; const headers = req.headers();
    calls.push({ path: url.pathname + url.search, body });
    const token = headers.authorization?.slice(7); let id = uuid;
    try { const payload = token?.split('.')[1]; if (payload) id = JSON.parse(Buffer.from(payload, 'base64url').toString()).sub ?? uuid; } catch { /* public key requests have no JWT. */ }
    const reply = (json: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'x-supabase-api-version': '2024-01-01' }, body: JSON.stringify(json) });
    if (url.pathname.includes('/storage/v1/')) {
      if (url.pathname.includes('/object/sign/') && req.method() === 'POST') return reply({ signedURL: url.pathname.replace('/storage/v1', '') + '?token=test-only' });
      if (req.method() === 'POST' && url.pathname.includes('/object/linad-avatars/')) {
        if (controls.bucketMissing) return reply({ statusCode: '404', error: 'Bucket not found', message: 'Bucket not found', code: 'NoSuchBucket' }, 400);
        if (controls.uploadError) return reply({ statusCode: 403, error: 'Unauthorized', message: 'RLS denied' }, 403);
        images.add(url.pathname); return reply({ Key: url.pathname.split('/object/')[1], Id: 'test-object' });
      }
      if (req.method() === 'DELETE') { for (const prefix of body.prefixes ?? []) images.delete('/storage/v1/object/linad-avatars/' + prefix); return reply([]); }
      if (req.method() === 'GET') return route.fulfill({ path: 'public/assets/account/profile-lake.png', contentType: 'image/png' });
    }
    if (url.pathname.endsWith('/signup')) return reply({ user: identity(), session: null });
    if (url.pathname.endsWith('/recover')) return reply({});
    if (url.pathname.endsWith('/logout')) return route.fulfill({ status: 204 });
    if (url.pathname.endsWith('/token')) {
      if (body.password === 'wrong-password') return reply({ code: 'invalid_credentials', msg: 'Invalid login credentials' }, 400);
      const targetId = body.email === 'second@example.test' ? secondId : uuid;
      return reply({ ...session(targetId), user: users.get(targetId) });
    }
    if (url.pathname.endsWith('/user')) {
      if (req.method() === 'PUT' && body.data) {
        if (controls.authUpdateError) return reply({ code: 'unexpected_failure', message: 'Unavailable' }, 503);
        const current = users.get(id) ?? identity(id); users.set(id, { ...current, user_metadata: { ...current.user_metadata, ...body.data } });
      }
      return reply(users.get(id) ?? identity(id));
    }
    if (url.pathname.endsWith('/profiles')) {
      if (controls.profileMissing) return reply({ code: 'PGRST205', message: 'Missing table' }, 404);
      if (['POST', 'PATCH'].includes(req.method())) {
        if (controls.profileError) return reply({ code: '42501', message: 'RLS denied' }, 403);
        const previous = (profiles.get(id) ?? { display_name: identity(id).user_metadata.full_name }) as Record<string, unknown>;
        const stamp = url.searchParams.get('profile_saved_at');
        if (stamp && (stamp === 'is.null' ? previous.profile_saved_at != null : stamp.slice(3) !== previous.profile_saved_at)) return reply([]);
        const saved = { ...previous, ...body }; profiles.set(id, saved); return reply(saved);
      }
      return reply([profiles.get(id) ?? { display_name: identity(id).user_metadata.full_name, ui_language: null, theme: null }]);
    }
    if (url.pathname.endsWith('/account_state')) return controls.schemaMissing ? reply({ code: 'PGRST205', message: 'Missing table' }, 404) : reply(cloud.has(id) ? [cloud.get(id)] : []);
    if (url.pathname.endsWith('/linad_commit_account')) {
      if (controls.schemaMissing) return reply({ code: 'PGRST202', message: 'Missing function' }, 404);
      const current = cloud.get(id); if (Number(body.p_expected_revision) !== (current?.revision ?? 0)) return reply({ code: 'PT409', message: 'Changed' }, 409);
      const revision = (current?.revision ?? 0) + 1; cloud.set(id, { revision, data: body.p_document as AccountDocument }); return reply(revision);
    }
    return reply({ message: 'Unexpected mocked endpoint' }, 404);
  });
  return { calls, cloud, profiles, images, users, controls };
}
