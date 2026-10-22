import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { AuthContext } from './auth-context';
import type { AccountContext, AccountProfile } from './auth-context';
import { processAuthCallback, supabase } from './client';
import { DATA_EVENT, dataOwner, setDataOwner } from './storage';
import { installDocument, mergeDocuments, readDocument } from './document';
import { commitCloud, loadCloud } from './sync';
import { usePreferences } from '../app/preferences-context';
import { cacheProfile, cachedProfile, syncIssue } from './profile';
import type { SyncIssue } from './profile';
import { loadProfile, saveProfile } from './profile-persistence';
import { captureActivity } from './activity';
import { acknowledgeTrials, bindTrialToAccount, mergeTrial, pendingTrial } from './trial';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setAppearance } = usePreferences(); const appearance = useRef(setAppearance);
  useEffect(() => { appearance.current = setAppearance; }, [setAppearance]);
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<AccountContext['syncStatus']>('guest');
  const [syncError, setSyncError] = useState<SyncIssue | null>(null);
  const profileRevision = useRef(0);
  const currentUser = useRef(user);
  useEffect(() => { currentUser.current = user; }, [user]);
  useEffect(() => {
    function record(event: Event) { if ((event as CustomEvent).detail?.local !== false) captureActivity(); }
    captureActivity(); window.addEventListener(DATA_EVENT, record);
    return () => window.removeEventListener(DATA_EVENT, record);
  }, []);
  const retry = useRef<() => void>(() => {}); const generation = useRef(0);
  const userId = user?.id; const displayName = String(user?.user_metadata.full_name ?? '');
  const refreshAuth = useCallback(async () => {
    const current = ++generation.current;
    // Wait for persisted-session recovery before deciding to redirect to sign-in.
    const session = supabase ? await supabase.auth.getSession().catch(() => null) : null;
    const result = supabase && session?.data.session ? await supabase.auth.getUser().catch(() => null) : null;
    if (current !== generation.current) return;
    const status = result?.error?.status;
    const next = result?.data.user ?? (session?.data.session && (!result || status === 0 || (status && status >= 500)) ? session.data.session.user : null);
    if (dataOwner() !== (next?.id ?? null)) {
      setProfile(next ? cachedProfile(next) : null); setSyncError(null); setSyncStatus(next ? 'syncing' : 'guest');
      try { if (next) bindTrialToAccount(next.id, next.email); } catch { setSyncError('network'); }
      setDataOwner(next?.id ?? null);
      try { if (next) { const trials = pendingTrial(next.id); if (trials.length) installDocument(trials.reduce((doc, trial) => mergeTrial(doc, trial.document), readDocument())); } } catch { setSyncError('network'); }
    }
    setUser(next); setReady(true);
  }, []);
  useEffect(() => {
    let active = true;
    void processAuthCallback().catch(() => { /* The callback page displays a translated error. */ }).then(() => { if (active) void refreshAuth(); });
    const subscription = supabase?.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') { generation.current++; setDataOwner(null); setUser(null); setProfile(null); setReady(true); }
      else if (event !== 'INITIAL_SESSION') queueMicrotask(() => { if (active) void refreshAuth(); });
    }).data.subscription;
    return () => { active = false; subscription?.unsubscribe(); };
  }, [refreshAuth]);
  useEffect(() => {
    if (!userId || !supabase) return;
    const client = supabase; const id = userId; let active = true; let busy = false; let pending = false; let timer: number | undefined; let appearanceLoaded = false;
    const valid = () => active && dataOwner() === id;
    async function sync() {
      if (!valid()) return;
      if (busy) { pending = true; return; }
      busy = true; setSyncStatus('syncing'); let operation = 'account_state';
      try {
        const revision = profileRevision.current;
        operation = 'profiles';
        const identity = currentUser.current; if (!identity || identity.id !== id) return;
        // Retry a failed durable checkpoint too; never report a successful transfer
        // merely because the unrelated account document synchronized.
        bindTrialToAccount(id, identity.email);
        const next = await loadProfile(client, identity);
        if (!valid()) return;
        if (revision === profileRevision.current) {
          setProfile(next); cacheProfile(next);
          if (!appearanceLoaded) appearance.current({ ...(next.ui_language ? { uiLanguage: next.ui_language } : {}), ...(next.theme ? { theme: next.theme } : {}) });
          appearanceLoaded = true;
        }
        operation = 'account_state';
        const cloud = await loadCloud(client, id);
        if (!valid()) return;
        const trials = pendingTrial(id);
        const local = readDocument();
        const combined = cloud.document ? mergeDocuments(cloud.document, local) : local;
        const document = trials.reduce((doc, trial) => mergeTrial(doc, trial.document), combined);
        const submitted = JSON.stringify(document);
        operation = 'linad_commit_account';
        const result = cloud.document && JSON.stringify(cloud.document) === submitted ? { revision: cloud.revision, document } : await commitCloud(client, id, document, cloud.revision);
        if (!valid()) return;
        const changed = JSON.stringify(readDocument()) !== JSON.stringify(local);
        installDocument(changed ? mergeDocuments(result.document, readDocument()) : result.document);
        acknowledgeTrials(id, trials.map(trial => trial.id));
        pending ||= changed; setSyncError(null); setSyncStatus('synced');
      } catch (error) { if (valid()) {
        if (import.meta.env.DEV) console.warn('LINAD cloud sync:', operation, (error as { code?: string })?.code ?? 'network');
        setSyncError(syncIssue(error)); setSyncStatus('error');
      } }
      finally { busy = false; if (pending && valid()) { pending = false; timer = window.setTimeout(() => void sync(), 250); } }
    }
    function changed(event: Event) {
      if ((event as CustomEvent).detail?.local === false || !valid()) return;
      setSyncStatus('syncing'); window.clearTimeout(timer); timer = window.setTimeout(() => void sync(), 600);
    }
    function refresh() { if (document.visibilityState === 'visible') void sync(); }
    retry.current = () => void sync();
    window.addEventListener(DATA_EVENT, changed); window.addEventListener('online', refresh); window.addEventListener('focus', refresh);
    const poll = window.setInterval(refresh, 30_000);
    void sync();
    return () => { active = false; window.clearTimeout(timer); window.clearInterval(poll); window.removeEventListener(DATA_EVENT, changed); window.removeEventListener('online', refresh); window.removeEventListener('focus', refresh); retry.current = () => {}; };
  }, [userId, displayName]); // Token refresh must not restart the data scope.
  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: 'local' }); if (error) throw error;
    generation.current++; setDataOwner(null); setUser(null); setProfile(null); setSyncStatus('guest');
  }
  async function updateProfile(change: Partial<AccountProfile>) {
    if (!user || !supabase) throw new Error('not-authenticated');
    profileRevision.current++;
    const saved = await saveProfile(supabase, user, profile ?? cachedProfile(user), change);
    if (dataOwner() === user.id) { setProfile(saved); cacheProfile(saved); }
  }
  return <AuthContext.Provider value={{ user, ready, profile, syncStatus: user ? syncStatus : 'guest', syncError, refreshAuth, signOut, updateProfile, retrySync: () => retry.current() }}>{children}</AuthContext.Provider>;
}
