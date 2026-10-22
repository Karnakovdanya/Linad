import { NavLink } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { useAdminAccess } from './role';
import { adminCopy } from './copy';
import { Icon } from '../components/Icon';
export function AdminLink() {
  const access = useAdminAccess(); const { preferences } = usePreferences();
  return access === 'allowed' ? <NavLink to="/admin"><Icon name="chart" /><span>{adminCopy(preferences.uiLanguage).title}</span></NavLink> : null;
}
