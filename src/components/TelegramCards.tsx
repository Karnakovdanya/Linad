import { usePreferences } from '../app/preferences-context';
import { ContactLink } from './ContactLink';
import { Icon } from './Icon';
import '../styles/home.css';

export function TelegramCards() {
  const { t } = usePreferences();
  return <section className="home-telegram" aria-label={t.telegramBlocksLabel}>
    <div className="telegram-banner">
      <span className="telegram-banner-icon"><Icon name="telegram" /></span>
      <div><h2>{t.telegramTitle}</h2><p>{t.telegramChannelDescription}</p></div>
      <ContactLink contact="projectTelegram" label={t.goToTelegram} className="button button-secondary" />
    </div>
    <div className="telegram-banner">
      <span className="telegram-banner-icon"><Icon name="user" /></span>
      <div><h2>{t.authorTelegram}</h2><p>{t.telegramAuthorDescription}</p></div>
      <ContactLink contact="authorTelegram" label={t.messageOnTelegram} className="button button-secondary" />
    </div>
  </section>;
}
