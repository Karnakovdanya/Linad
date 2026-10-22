import { Link } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { assets } from '../config/assets';
import { ContactLink } from './ContactLink';

export function Footer() {
  const { t } = usePreferences();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="author-credit" to="/author" aria-label={t.authorLink}>
          <span className="author-avatar"><img src={assets.author} alt={t.authorPhoto} width="52" height="52" /></span>
          <span className="author-credit-text"><strong>{t.authorProject}</strong><span>{t.authorFooter}</span></span>
        </Link>
        <nav className="footer-nav" aria-label={t.footerNav}>
          <Link to="/author"><span>{t.author}</span></Link>
          <ContactLink contact="projectTelegram" label={t.telegram} className="footer-telegram" showIcon={false} />
          <Link to="/profile"><span>{t.profile}</span></Link>
        </nav>
        <p className="copyright">© 2026 {t.copyright}</p>
      </div>
    </footer>
  );
}
