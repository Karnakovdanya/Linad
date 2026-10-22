// Guest records retain their original keys. Each authenticated account has its own cache.
export const DATA_EVENT = 'linad:account-data';
let owner: string | null = null;
export const dataOwner = () => owner;
export const scopedKey = (key: string, userId = owner) => userId ? `linad.account.${userId}.${key}` : key;
export function setDataOwner(userId: string | null) { owner = userId; announceData(false); }
export function announceData(local = true) { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DATA_EVENT, { detail: { local } })); }
export function readData(key: string, userId = owner) { return globalThis.localStorage.getItem(scopedKey(key, userId)); }
export function writeData(key: string, value: string, notify = true) {
  globalThis.localStorage.setItem(scopedKey(key), value);
  if (notify) {
    globalThis.localStorage.setItem(scopedKey('linad.data-clock'), new Date().toISOString());
    announceData();
  }
}
export function subscribeData(listener: () => void) {
  window.addEventListener(DATA_EVENT, listener); window.addEventListener('storage', listener);
  return () => { window.removeEventListener(DATA_EVENT, listener); window.removeEventListener('storage', listener); };
}
