import { useEffect, useState } from 'react';
import { useAccount } from '../account/auth-context';
import { supabase } from '../account/client';
export type AdminAccess = 'checking' | 'allowed' | 'denied' | 'unavailable';
export function useAdminAccess() {
  const { user } = useAccount(); const [result, setResult] = useState<{ id: string; access: AdminAccess } | null>(null);
  const id = user?.id;
  useEffect(() => {
    if (!id || !supabase) return;
    let active = true;
    void supabase.rpc('linad_is_admin').then(({ data, error }) => { if (active) setResult({ id, access: error ? 'unavailable' : data === true ? 'allowed' : 'denied' }); }, () => { if (active) setResult({ id, access: 'unavailable' }); });
    return () => { active = false; };
  }, [id]);
  return !id ? 'denied' : result?.id === id ? result.access : 'checking';
}
