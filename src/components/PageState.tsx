import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { Icon } from './Icon';

export function PendingState({ children }: { children: ReactNode }) {
  const { t } = usePreferences();
  return (
    <aside className="pending-state">
      <span className="state-marker" aria-hidden="true" />
      <div><h2>{t.pending}</h2><p>{children}</p></div>
    </aside>
  );
}

export function BackHome() {
  const { t } = usePreferences();
  return <Link className="text-link" to="/">{t.backHome}<Icon name="arrow" /></Link>;
}
