import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { useAccount } from '../account/auth-context';
import { supabase } from '../account/client';
import { ProfileDialog } from '../account/ProfileDialog';
import { cefrLevels } from '../pages/learning/levels/model';
import { curricula } from '../pages/learning/levels/data/curriculum';
import { lessonCatalog } from '../pages/learning/levels/data/lessons';
import { useAdminAccess } from './role';
import { adminCopy } from './copy';
import type { AdminDashboard, AdminDetail, AdminUser } from './types';
import '../styles/account.css';
import './admin.css';

function Languages({ user }: { user: AdminUser }) {
  const { preferences } = usePreferences(); const c = adminCopy(preferences.uiLanguage);
  return user.study_languages.length ? user.study_languages.map(item => `${item.language === 'de' ? 'Deutsch' : 'English'}${item.level ? ` · ${item.level}` : ''}`).join(', ') : c.notChosen;
}
function UserDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { preferences } = usePreferences(); const c = adminCopy(preferences.uiLanguage);
  const [detail, setDetail] = useState<AdminDetail | null>(null); const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    void supabase!.rpc('linad_admin_user', { p_user_id: id }).then(({ data, error }) => { if (active) { if (error || !data?.user) setFailed(true); else setDetail(data as AdminDetail); } }, () => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [id]);
  return <ProfileDialog title={c.details} onClose={onClose}>{failed ? <p role="alert">{c.error}</p> : !detail ? <p role="status">{c.checking}</p> : <div className="admin-detail"><h3>{detail.user.full_name || detail.user.email}</h3><p><Languages user={detail.user} /></p><p className="account-muted">{c.progressHint}</p><h3>{c.modules}</h3>{detail.modules.length ? <ul>{detail.modules.map(module => {
    const [, level, moduleId] = module.module_id.split(':'); const title = curricula[module.language]?.find(item => item.id === moduleId && item.level === level)?.title[preferences.uiLanguage] ?? moduleId;
    return <li key={module.module_id}><strong>{module.language.toUpperCase()} · {level} · {title}</strong><span>{c.lessons}: {module.completed_lessons ?? c.unknown} · {module.percent == null ? c.unknown : `${module.percent}%`} · {c.completion}: {module.completed == null ? c.unknown : module.completed ? c.yes : c.no}</span></li>;
  })}</ul> : <p>{c.unknown}</p>}<h3>{c.lessons}</h3>{detail.lessons.length ? <ul>{detail.lessons.map(lesson => {
    const [language, ...parts] = lesson.lesson_id.split(':'); const title = lessonCatalog[language === 'de' ? 'de' : 'en'][parts.join(':')]?.title[preferences.uiLanguage] ?? lesson.lesson_id;
    return <li key={lesson.lesson_id}><strong>{title}</strong><span>{lesson.attempts} {c.attempts} · {lesson.score == null || !lesson.total ? '—' : `${lesson.score}/${lesson.total}`}</span></li>;
  })}</ul> : <p>{c.unknown}</p>}</div>}</ProfileDialog>;
}
function Dashboard() {
  const { preferences } = usePreferences(); const c = adminCopy(preferences.uiLanguage);
  const [query, setQuery] = useState({ search: '', language: '', level: '', confirmed: '', offset: 0, revision: 0 });
  const [result, setResult] = useState<AdminDashboard | null>(null); const [failed, setFailed] = useState(false); const [busy, setBusy] = useState(true); const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void supabase!.rpc('linad_admin_dashboard', { p_search: query.search, p_language: query.language || null, p_level: query.level || null, p_confirmed: query.confirmed ? query.confirmed === 'yes' : null, p_offset: query.offset }).then(({ data, error }) => { if (active) { if (error || !data || !Array.isArray(data.users)) setFailed(true); else setResult(data as AdminDashboard); setBusy(false); } }, () => { if (active) { setFailed(true); setBusy(false); } });
    return () => { active = false; };
  }, [query]);
  function update(next: typeof query) { setBusy(true); setFailed(false); setResult(null); setQuery(next); }
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); update({ search: String(data.get('search') ?? '').trim(), language: String(data.get('language') ?? ''), level: String(data.get('level') ?? ''), confirmed: String(data.get('confirmed') ?? ''), offset: 0, revision: query.revision + 1 }); }
  const date = (value: string) => new Date(value).toLocaleDateString(preferences.uiLanguage);
  return <>
    <div className="admin-heading"><h1 id="page-heading" tabIndex={-1}>{c.title}</h1><button type="button" className="button button-secondary" disabled={busy} onClick={() => update({ ...query, revision: query.revision + 1 })}>{c.refreshed}</button></div>
    {result && <><div className="admin-metrics">{[[c.total, result.total], [c.today, result.today], [c.week, result.registrations_7d], [c.month, result.registrations_30d], [c.active7, result.active_7d], [c.active30, result.active_30d]].map(([label, value]) => <article className="account-panel" key={String(label)}><span>{label}</span><strong className={value == null ? 'admin-metric-unknown' : undefined}>{value ?? c.unknown}</strong></article>)}</div><p className="account-muted">{c.coverage}: {date(result.activity_since)}. {c.activityHint}</p></>}
    <section className="account-panel"><h2>{c.users}</h2><form className="admin-filters" onSubmit={search}><label>{c.search}<input type="search" name="search" maxLength={200} defaultValue={query.search} /></label><label>{c.language}<select name="language" defaultValue={query.language}><option value="">{c.all}</option><option value="de">Deutsch</option><option value="en">English</option></select></label><label>{c.level}<select name="level" defaultValue={query.level}><option value="">{c.all}</option>{cefrLevels.map(level => <option key={level}>{level}</option>)}</select></label><label>{c.status}<select name="confirmed" defaultValue={query.confirmed}><option value="">{c.all}</option><option value="yes">{c.confirmed}</option><option value="no">{c.unconfirmed}</option></select></label><button className="button button-primary" disabled={busy}>{c.apply}</button></form>
      {busy && <p role="status">{c.checking}</p>}{failed && <p role="alert">{c.error}</p>}
      {result && <><p>{result.filtered_total} · {c.page} {query.offset / 25 + 1}</p>{result.users.length ? <div className="admin-table"><table><thead><tr>{[c.name, c.email, c.registered, c.status, c.languages, c.lessons, c.modules, c.details].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{result.users.map(user => <tr key={user.user_id}><th scope="row">{user.full_name || '—'}</th><td>{user.email}</td><td>{date(user.created_at)}</td><td>{user.email_confirmed_at ? c.confirmed : c.unconfirmed}</td><td><Languages user={user} /></td><td>{user.lessons_completed ?? '—'}</td><td>{user.modules_completed ?? '—'}</td><td><button type="button" className="text-link" onClick={() => setSelected(user.user_id)}>{c.details}</button></td></tr>)}</tbody></table></div> : <p>{c.empty}</p>}<div className="admin-pagination"><button className="button button-secondary" disabled={query.offset === 0} onClick={() => update({ ...query, offset: Math.max(0, query.offset - 25) })}>{c.previous}</button><button className="button button-secondary" disabled={query.offset + 25 >= result.filtered_total} onClick={() => update({ ...query, offset: query.offset + 25 })}>{c.next}</button></div></>}
    </section>
    {result && <section className="account-panel"><h2>{c.courses}</h2><p className="account-muted">{c.progressHint}</p><p>{c.available}: {result.progress_accounts}</p>{result.courses.length ? <div className="admin-table"><table><thead><tr>{[c.course, c.learners, c.lessons, c.modules].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{result.courses.map(course => <tr key={course.language + course.level}><th scope="row">{course.language === 'de' ? 'Deutsch' : 'English'} · {course.level}</th><td>{course.learners}</td><td>{course.completed_lessons}</td><td>{course.completed_modules}</td></tr>)}</tbody></table></div> : <p>{c.unknown}</p>}</section>}
    {selected && <UserDetail key={selected} id={selected} onClose={() => setSelected(null)} />}
  </>;
}
export default function AdminPage() {
  const access = useAdminAccess(); const { user } = useAccount(); const { preferences } = usePreferences(); const c = adminCopy(preferences.uiLanguage);
  useEffect(() => { document.title = `${c.title} | LINAD`; }, [c.title]);
  return <section className="container admin-page"><Link className="text-link" to="/profile">← {c.back}</Link>{access === 'allowed' ? <Dashboard /> : <div className="account-panel"><h1 id="page-heading" tabIndex={-1}>{access === 'checking' ? c.checking : access === 'unavailable' ? c.unavailable : c.denied}</h1>{!user && <Link className="button button-primary" to="/auth/login">{c.login}</Link>}{access === 'unavailable' && <button className="button button-secondary" onClick={() => window.location.reload()}>{c.retry}</button>}</div>}</section>;
}
