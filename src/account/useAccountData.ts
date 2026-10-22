import { useState, useSyncExternalStore } from 'react';
import { readDocument, emptyDocument } from './document';
import { subscribeData } from './storage';
function controller() {
  const read = () => { try { return readDocument(); } catch { return emptyDocument(); } };
  let snapshot = read();
  return { snapshot: () => snapshot, subscribe: (listener: () => void) => subscribeData(() => { snapshot = read(); listener(); }) };
}
export function useAccountData() { const [store] = useState(controller); return useSyncExternalStore(store.subscribe, store.snapshot); }
