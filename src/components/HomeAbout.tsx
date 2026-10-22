import { usePreferences } from '../app/preferences-context';
import { homeAboutCopy } from '../i18n/home-about';
import { Icon } from './Icon';
import '../styles/home-about.css';

const benefitIcons = ['book', 'chart', 'chat', 'people', 'cards', 'telegram'] as const;

export function HomeAbout() {
  const { preferences } = usePreferences();
  const copy = homeAboutCopy[preferences.uiLanguage];

  return <section className="home-about" aria-labelledby="home-about-heading">
    <div className="home-about-intro">
      <p className="home-about-eyebrow">{copy.eyebrow}</p>
      <h2 id="home-about-heading">{copy.titleBefore}<span>LINAD</span>{copy.titleAfter}</h2>
      <div className="home-about-description">
        {copy.description.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </div>
    <ul className="home-about-benefits">
      {copy.benefits.map(([title, text], index) => <li key={benefitIcons[index]}>
        <span className="home-about-icon" aria-hidden="true"><Icon name={benefitIcons[index]!} /></span>
        <div><h3>{title}</h3><p>{text}</p></div>
      </li>)}
    </ul>
  </section>;
}
