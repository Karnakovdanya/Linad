// Run before CI builds. Never print configuration values, including rejected keys.
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
const issues = [];
const address = process.env.VITE_SUPABASE_URL?.trim();
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
if (!address) issues.push('VITE_SUPABASE_URL is required.');
else {
  try {
    const url = new URL(address);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error();
  } catch { issues.push('VITE_SUPABASE_URL must be an HTTPS project origin without credentials or query parameters.'); }
}
if (!key) issues.push('VITE_SUPABASE_PUBLISHABLE_KEY is required.');
else if (!/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(key)) issues.push('Use a public sb_publishable key; secret and service_role keys are forbidden.');
for (const [name, value] of Object.entries(process.env)) {
  if (name.startsWith('VITE_') && (/SECRET|PASSWORD|SERVICE_ROLE|PRIVATE/.test(name) || value?.includes('sb_secret_'))) {
    issues.push('A private credential was supplied through a VITE_ variable. Remove it from the frontend build.');
  }
}
if (issues.length) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else console.log('Public Supabase build configuration is valid.');
