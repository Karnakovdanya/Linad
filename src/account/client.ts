import { createClient } from '@supabase/supabase-js';
import { authReturn, clearAuthReturn } from './trial';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const supabase = url && key ? createClient(url, key, {
  auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: true, autoRefreshToken: true },
  global: { fetch: (input, options) => fetch(input, { ...options, signal: options?.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(15_000)]) : AbortSignal.timeout(15_000) }) },
}) : null;
export function authRedirect(mode: 'confirm' | 'recovery' = 'confirm') {
  const base = new URL('./', window.location.href.split('#')[0]);
  return new URL(`auth-callback.html?mode=${mode}`, base).href;
}
let callback: Promise<void> | undefined;
export function processAuthCallback() {
  return callback ??= (async () => {
    if (!supabase) return;
    const url = new URL(window.location.href); const params = url.searchParams;
    if (!params.has('code') && !params.has('token_hash') && !params.has('error')) return;
    let error: Error | null;
    if (params.has('error')) error = new Error(params.get('error_description') ?? 'invalid-callback');
    else if (params.has('code')) ({ error } = await supabase.auth.exchangeCodeForSession(params.get('code')!));
    else {
      const type = params.get('type');
      if (type === 'signup' || type === 'recovery' || type === 'email') ({ error } = await supabase.auth.verifyOtp({ token_hash: params.get('token_hash')!, type }));
      else error = new Error('invalid-callback');
    }
    const recovery = params.get('mode') === 'recovery' || params.get('type') === 'recovery';
    for (const key of ['code', 'token_hash', 'type', 'mode', 'error', 'error_code', 'error_description']) params.delete(key);
    url.hash = error ? '/auth/login?callback=error' : recovery ? '/auth/update-password' : authReturn();
    if (!error && !recovery) clearAuthReturn();
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (error) throw error;
  })();
}
