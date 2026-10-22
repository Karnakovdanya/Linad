import type { ReactNode } from 'react';
import { usePreferences } from '../app/preferences-context';
import { BackHome, PendingState } from '../components/PageState';
import { ContactSection } from '../components/ContactSection';
import { AuthorContent } from './AuthorContent';

function PageShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  const { t } = usePreferences();
  return (
    <div className="container page-content section-page">
      <BackHome />
      <p className="version-note"><span aria-hidden="true" />{t.buildStatus}</p>
      <h1 id="page-heading" tabIndex={-1}>{title}</h1>
      {intro && <p className="lead">{intro}</p>}
      {children}
    </div>
  );
}

export function TutorsPage() {
  const { t } = usePreferences();
  return <PageShell title={t.tutorsTitle} intro={t.tutorsIntro}>
    <PendingState>{t.tutorsPending}</PendingState>
    <ContactSection title={t.tutorContactTitle} description={t.tutorContactDescription} items={['authorTelegram', 'email']}
      emailDraft={{ subject: t.tutorEmailSubject, body: t.tutorEmailBody }} />
  </PageShell>;
}

export function ProfilePage() {
  const { t, preferences } = usePreferences();
  const languageNames = { ru: t.russian, de: t.german, en: t.english };
  return (
    <PageShell title={t.profileTitle} intro={t.profileIntro}>
      <section className="surface" aria-labelledby="local-settings">
        <h2 id="local-settings">{t.profileIntro}</h2>
        <p>{t.localOnly}</p>
        <dl className="settings-list">
          <div><dt>{t.language}</dt><dd>{languageNames[preferences.uiLanguage]}</dd></div>
          <div><dt>{t.theme}</dt><dd>{preferences.theme === 'light' ? t.light : t.dark}</dd></div>
        </dl>
        <p className="muted">{t.preferenceHint}</p>
      </section>
      <PendingState>{t.profilePending}</PendingState>
    </PageShell>
  );
}

export function AuthorPage() {
  return <AuthorContent />;
}

export function NotFoundPage() {
  const { t } = usePreferences();
  return <PageShell title={t.notFoundTitle}><p className="lead">{t.notFoundText}</p></PageShell>;
}
