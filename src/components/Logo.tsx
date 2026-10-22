import { usePreferences } from '../app/preferences-context';
import { assets } from '../config/assets';

/** Transparent exports traced from the user's approved theme variants. */
export function Logo({ theme }: { theme?: 'light' | 'dark' }) {
  const { t, preferences } = usePreferences();
  return <img className="brand-logo" src={assets.logo[theme ?? preferences.theme]} alt={t.brandAlt}
    width="965" height="273" decoding="sync" />;
}
