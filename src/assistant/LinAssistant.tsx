import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePreferences } from '../app/preferences-context';
import { Icon } from '../components/Icon';
import { getContactHref } from '../config/contact-links';
import { assistantCopy, topicActions, topicIds } from './content';
import type { ActionId, TopicId } from './content';
import { findTopic } from './search';
import { LinArt } from './LinArt';
import { useLinDock } from './useLinDock';
import './lin.css';

type Screen = { kind: 'topics'; returned: boolean } | { kind: 'answer'; topic: TopicId } | { kind: 'unknown' | 'searching'; query: string };
const icons = { about: 'book', learn: 'chat', guide: 'file', level: 'check', save: 'cards', telegram: 'telegram', tutors: 'people', author: 'chat' } as const;
const actionIcons = { learning: 'book', languages: 'globe', situations: 'check', placement: 'chart', profile: 'user', words: 'cards', tutors: 'people', author: 'user', channel: 'telegram', contact: 'telegram' } as const;

function Launcher({ open, onClick, panelId, label, buttonRef, unread = false }: { open: boolean; onClick: () => void; panelId: string; label: string; buttonRef: RefObject<HTMLButtonElement | null>; unread?: boolean }) {
  return <button ref={buttonRef} className="lin-launcher" type="button" onClick={onClick} aria-label={label} aria-expanded={open} aria-controls={open ? panelId : undefined} aria-haspopup="dialog" data-unread={unread}>
    <LinArt pose={unread ? 'unread' : 'idle'} className="lin-launcher-idle" />
    {!unread && <LinArt pose="hover" className="lin-launcher-hover" />}
  </button>;
}

export function LinAssistant() {
  const { preferences } = usePreferences(); const c = assistantCopy(preferences.uiLanguage); const { pathname } = useLocation();
  const [phase, setPhase] = useState<'closed' | 'open' | 'closing'>('closed');
  const [screen, setScreen] = useState<Screen>({ kind: 'topics', returned: false });
  const [query, setQuery] = useState(''); const [acknowledged, setAcknowledged] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null); const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLElement>(null); const scroll = useRef<HTMLDivElement>(null); const searchFrames = useRef<number[]>([]);
  const id = useId(); const panelId = `lin-panel-${id}`, titleId = `lin-title-${id}`, subtitleId = `lin-subtitle-${id}`;
  const dock = useLinDock(); const open = phase === 'open';
  function cancelSearch() { searchFrames.current.forEach(cancelAnimationFrame); searchFrames.current = []; }
  function close(restoreFocus = true) { cancelSearch(); setPhase('closing'); if (restoreFocus) launcher.current?.focus({ preventScroll: true }); }
  function showTopics(returned = true) { cancelSearch(); setScreen({ kind: 'topics', returned }); setAcknowledged(false); setQuery(''); }
  function showAnswer(topic: TopicId) { cancelSearch(); setScreen({ kind: 'answer', topic }); setAcknowledged(false); setQuery(''); }
  function toggle() { if (open) close(); else { showTopics(false); setPhase('open'); } }
  useEffect(() => {
    if (phase === 'closing') { const timer = window.setTimeout(() => setPhase('closed'), 160); return () => clearTimeout(timer); }
  }, [phase]);
  useEffect(() => {
    if (open) { heading.current?.focus({ preventScroll: true }); scroll.current?.scrollTo(0, 0); }
  }, [open, screen]);
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        event.preventDefault(); searchFrames.current.forEach(cancelAnimationFrame); searchFrames.current = [];
        setPhase('closing'); launcher.current?.focus({ preventScroll: true });
      }
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  useEffect(() => () => { searchFrames.current.forEach(cancelAnimationFrame); }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const text = query.trim(); if (!text || screen.kind === 'searching') return;
    cancelSearch(); setAcknowledged(false); setScreen({ kind: 'searching', query: text });
    // Yield one paint for the real local lookup, without simulating AI generation.
    searchFrames.current.push(requestAnimationFrame(() => { searchFrames.current.push(requestAnimationFrame(() => {
      const topic = findTopic(text, preferences.uiLanguage);
      setScreen(topic ? { kind: 'answer', topic } : { kind: 'unknown', query: text }); setQuery(''); searchFrames.current = [];
    })); }));
  }
  const destinations: Record<ActionId, string | null> = {
    learning: '/learn', languages: '/learn/levels/languages', situations: `/learn/${preferences.learningLanguage}/situations`,
    placement: '/learn/levels/placement', profile: '/profile', words: '/profile/words', tutors: '/tutors', author: '/author',
    channel: getContactHref('projectTelegram'), contact: getContactHref('authorTelegram'),
  };
  const topic = screen.kind === 'answer' ? c.topics[screen.topic] : null;
  const styles = { '--lin-dock-bottom': phase === 'closed' ? `${dock.bottom}px` : `calc(var(--lin-gap) + ${dock.keyboard ?? 0}px)`, '--lin-viewport-height': `${dock.height}px` } as CSSProperties;
  return <div className="lin-assistant" style={styles}>
    {phase !== 'closed' && <section ref={panel} id={panelId} className="lin-window" role="dialog" aria-modal="false" aria-labelledby={titleId} aria-describedby={subtitleId} data-open={open} inert={!open} aria-hidden={!open}>
      <header className="lin-header"><LinArt pose="idle" className="lin-header-avatar" /><div><h2 id={titleId}>{c.name}</h2><p id={subtitleId}>{c.subtitle}</p></div><button className="lin-close" type="button" onClick={() => close()} aria-label={c.close}><Icon name="close" /></button></header>
      <div className="lin-scroll" ref={scroll}>
        {screen.kind === 'topics' ? <>
          <figure className={`lin-welcome-art ${screen.returned ? 'returned' : ''}`}><LinArt pose={screen.returned ? 'hello' : 'welcome'} /></figure>
          <div className="lin-greeting"><h3 tabIndex={-1} ref={heading}>{c.greeting}</h3><p>{c.intro}</p></div>
          <nav className="lin-topics" aria-label={c.topicsLabel}>{topicIds.map(topicId => <button key={topicId} className="lin-topic" type="button" onClick={() => showAnswer(topicId)} data-topic={topicId}><span className="lin-topic-icon"><Icon name={icons[topicId]} /></span><span><strong>{c.topics[topicId].question}</strong><small>{c.topics[topicId].subtitle}</small></span><Icon name="arrow" /></button>)}</nav>
        </> : <div className="lin-conversation" key={screen.kind === 'answer' ? screen.topic : screen.kind}>
          <button type="button" className="lin-back" onClick={() => showTopics()}><span aria-hidden="true">←</span> {c.back}</button>
          <h3 className="lin-question-bubble" tabIndex={-1} ref={heading}>{topic?.question ?? ('query' in screen ? screen.query : '')}</h3>
          {screen.kind === 'searching' ? <div className="lin-searching" role="status"><LinArt pose="searching" /><p>{c.searching}</p></div>
            : <><div className="lin-answer-row"><LinArt pose={screen.kind === 'unknown' ? 'ask' : 'help'} className="lin-answer-avatar" /><div className="lin-answer-card">{topic ? topic.answer.map(paragraph => <p key={paragraph}>{paragraph}</p>) : <><LinArt pose="ask" className="lin-unknown-art" /><p>{c.unknown}</p></>}</div></div>
              {screen.kind === 'answer' && <div className="lin-actions">{topicActions[screen.topic].map(action => {
                const to = destinations[action]; if (!to) return null;
                const body = <><Icon name={actionIcons[action]} /><span>{c.actions[action]}</span><Icon name="arrow" /></>;
                return action === 'channel' || action === 'contact' ? <a key={action} href={to} target="_blank" rel="noopener noreferrer" className="lin-action" data-action={action}>{body}</a>
                  : <Link key={action} to={to} className="lin-action" data-action={action} onClick={() => close(pathname === to)}>{body}</Link>;
              })}</div>}
              {screen.kind === 'unknown' ? <button className="lin-all-topics" type="button" onClick={() => showTopics()}>{c.back} <Icon name="arrow" /></button>
                : acknowledged ? <div className="lin-acknowledged" role="status"><LinArt pose="great" /><p>{c.great}</p></div> : <button className="lin-understood" type="button" onClick={() => setAcknowledged(true)}><Icon name="check" />{c.understood}</button>}
            </>}
        </div>}
      </div>
      <footer className="lin-composer"><form onSubmit={submit}><label className="sr-only" htmlFor={`lin-input-${id}`}>{c.input}</label><input id={`lin-input-${id}`} value={query} onChange={event => setQuery(event.target.value)} placeholder={c.placeholder} maxLength={240} autoComplete="off" enterKeyHint="send" disabled={screen.kind === 'searching'} /><button type="submit" aria-label={c.send} disabled={!query.trim() || screen.kind === 'searching'}><Icon name="telegram" /></button></form><small>{c.helpNote}</small></footer>
    </section>}
    <Launcher open={open} onClick={toggle} panelId={panelId} label={open ? c.close : c.open} buttonRef={launcher} />
  </div>;
}
