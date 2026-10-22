import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { useAccount } from '../account/auth-context';
import { accountCopy } from '../account/copy';

const navigation = [
  { to: '/', key: 'home' },
  { to: '/learn', key: 'learn' },
  { to: '/tutors', key: 'tutors' },
  { to: '/profile', key: 'profile' },
] as const;

export function Header() {
  const { t, preferences, setLanguage, setTheme } = usePreferences();
  const { user } = useAccount();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [languagePointerFocus, setLanguagePointerFocus] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (pathname !== '/' || !header.current) return;
    // The hero image continues behind the header. The dropdown is positioned
    // outside normal flow and never contributes to this measured height.
    const root = document.documentElement;
    const updateHeight = () => root.style.setProperty('--home-header-height', `${header.current!.getBoundingClientRect().height}px`);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header.current);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--home-header-height');
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    }
    const desktop = window.matchMedia('(min-width: 1100px)');
    function closeOnResize(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    desktop.addEventListener('change', closeOnResize);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
      desktop.removeEventListener('change', closeOnResize);
    };
  }, [open]);

  const navigationLinks = navigation.map(item => {
    const label = <span className="nav-label">{item.key === 'profile' && !user ? accountCopy(preferences.uiLanguage).login : t[item.key]}</span>;
    return <NavLink to={item.key === 'profile' && !user ? '/auth/login' : item.to} end={item.to === '/'} key={item.key} onClick={() => setOpen(false)}>{label}</NavLink>;
  });

  return (
    <header className={`site-header${pathname === '/' ? ' home-header' : ''}`} ref={header}>
      <div className="header-inner container">
        <Link to="/" className="brand" aria-label={t.brand} onClick={() => setOpen(false)}>
          <Logo theme={pathname === '/' ? 'dark' : undefined} />
        </Link>
        <nav id="primary-navigation" className={`primary-nav${open ? ' is-open' : ''}`} aria-label={t.primaryNav}>
          {navigationLinks}
        </nav>
        <div className="header-controls">
          <label className="language-select">
            <span className="sr-only">{t.language}</span>
            <select value={preferences.uiLanguage} data-pointer-focus={languagePointerFocus || undefined}
              onPointerDown={() => setLanguagePointerFocus(true)}
              onKeyDown={() => setLanguagePointerFocus(false)}
              onBlur={() => setLanguagePointerFocus(false)}
              onChange={(event) => {
              const value = event.target.value;
              if (value === 'ru' || value === 'de' || value === 'en') setLanguage(value);
            }}>
              <option value="ru" lang="ru">RU</option>
              <option value="de" lang="de">DE</option>
              <option value="en" lang="en">EN</option>
            </select>
          </label>
          <button type="button" className="icon-button" onClick={() => setTheme(preferences.theme === 'light' ? 'dark' : 'light')}
            aria-label={preferences.theme === 'light' ? t.switchDark : t.switchLight}
            title={preferences.theme === 'light' ? t.switchDark : t.switchLight}>
            <Icon name={preferences.theme === 'light' ? 'moon' : 'sun'} />
          </button>
          <button type="button" ref={menuButton} className="icon-button menu-toggle" aria-expanded={open} aria-controls="primary-navigation"
            aria-label={open ? t.menuClose : t.menuOpen} onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
