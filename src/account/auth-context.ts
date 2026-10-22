import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { AccountProfile, SyncIssue } from './profile';
export type { AccountProfile } from './profile';
export interface AccountContext {
  user: User | null; ready: boolean; profile: AccountProfile | null;
  syncStatus: 'guest' | 'syncing' | 'synced' | 'error';
  syncError: SyncIssue | null;
  retrySync: () => void; refreshAuth: () => Promise<void>; signOut: () => Promise<void>;
  updateProfile: (profile: Partial<AccountProfile>) => Promise<void>;
}
export const AuthContext = createContext<AccountContext | null>(null);
export function useAccount() { const value = useContext(AuthContext); if (!value) throw new Error('Account provider missing'); return value; }
