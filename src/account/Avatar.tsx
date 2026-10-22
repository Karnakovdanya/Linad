import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '../app/preferences-context';
import { Icon } from '../components/Icon';
import { useAccount } from './auth-context';
import { supabase } from './client';
import { accountCopy, accountError } from './copy';

import { AVATAR_BUCKET, avatarStorageError, validateAvatar } from './avatar-storage';

export function Avatar({ editable = false }: { editable?: boolean }) {
  const { user, profile, updateProfile } = useAccount(); const { preferences } = usePreferences(); const c = accountCopy(preferences.uiLanguage);
  const [image, setImage] = useState<{ path: string; url: string } | null>(null); const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>(null); const [notice, setNotice] = useState(false);
  const input = useRef<HTMLInputElement>(null); const inFlight = useRef(false);
  const path = profile?.avatar_path; const id = user?.id;
  useEffect(() => {
    if (!path || !id || !supabase || !path.startsWith(id + '/')) return;
    const storage = supabase.storage.from(AVATAR_BUCKET); let active = true;
    async function load() {
      const { data, error } = await storage.createSignedUrl(path!, 3600);
      if (active) { setFailed(Boolean(error)); if (data) setImage({ path: path!, url: data.signedUrl }); }
    }
    void load(); const refresh = window.setInterval(() => void load(), 50 * 60 * 1000);
    return () => { active = false; window.clearInterval(refresh); };
  }, [path, id]);
  async function change(file: File | null) {
    if (!user || !supabase || inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(null); setNotice(false);
    const storage = supabase.storage.from(AVATAR_BUCKET); let uploaded: string | null = null;
    try {
      if (file) {
        const extension = await validateAvatar(file);
        uploaded = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error } = await storage.upload(uploaded, file, { contentType: file.type, cacheControl: '3600', upsert: false });
        if (error) throw avatarStorageError(error);
      }
      try { await updateProfile({ avatar_path: uploaded }); }
      catch (error) {
        if (uploaded) {
          // A timeout can happen after PostgreSQL committed. Do not delete a photo
          // that may already be referenced by the saved profile.
          const check = await supabase.from('profiles').select('avatar_path').eq('user_id', user.id).maybeSingle();
          if (!check.error && check.data?.avatar_path !== uploaded) await storage.remove([uploaded]);
        }
        throw error;
      }
      // The old photo remains intact until the profile update is confirmed.
      if (path) await storage.remove([path]);
      setFailed(false); setNotice(true);
    } catch (issue) { setError(issue); }
    finally { inFlight.current = false; setBusy(false); if (input.current) input.current.value = ''; }
  }
  const name = profile?.display_name || user?.user_metadata.full_name || user?.email || '';
  const initials = String(name).trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const url = image?.path === path && !failed ? image?.url : null;
  const feedback = <>{notice && <p role="status">{c.saved}</p>}{Boolean(error) && <p role="alert">{accountError(error, c)}</p>}{failed && <p role="status">{c.photoError}</p>}</>;
  return <div className={`account-avatar-control ${editable ? 'editable' : 'compact'}`} aria-busy={busy}>
    <span className="account-avatar" aria-label={c.photo}>{url ? <img src={url} alt={c.photo} onError={() => setFailed(true)} /> : <span aria-hidden="true">{initials}</span>}</span>
    <input className="account-avatar-file" ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label={c.uploadPhoto} disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) void change(file); }} />
    {editable ? <div className="account-avatar-actions">
      <div className="account-actions"><button type="button" className="button button-secondary" disabled={busy} onClick={() => input.current?.click()}>{busy ? c.saving : path ? c.replacePhoto : c.uploadPhoto}</button>
        {path && <button type="button" className="button button-secondary" disabled={busy} onClick={() => void change(null)}>{c.deletePhoto}</button>}</div><small>{c.photoHint}</small>
      {feedback}
    </div> : <><button type="button" className="account-avatar-edit" disabled={busy} aria-label={busy ? c.saving : path ? c.replacePhoto : c.uploadPhoto} onClick={() => input.current?.click()}><Icon name="image" /></button>
      {(notice || Boolean(error) || failed) && <div className="account-avatar-feedback">{feedback}</div>}</>}
  </div>;
}
