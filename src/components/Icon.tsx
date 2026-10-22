type IconName = 'sun' | 'moon' | 'menu' | 'close' | 'arrow' | 'image' | 'book' | 'people' | 'telegram' | 'globe' | 'file' | 'chat' | 'cards' | 'check' | 'chart' | 'user' | 'graduation';

const paths: Record<IconName, string> = {
  sun: 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  image: 'M4 4h16v16H4V4Zm0 12 5-5 4 4 3-3 4 4M9 8h.01',
  book: 'M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1m0-14c3-2 6-2 9-1v14c-3-1-6-1-9 1V6Z',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  telegram: 'm21 3-5 18-5-7-8-4 18-7ZM11 14 21 3',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M5 6h14M5 18h14M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z',
  file: 'M14 2H6v20h14V8l-6-6Zm0 0v6h6M9 12h8M9 16h8',
  chat: 'M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.8-5A9 9 0 1 1 21 11ZM8 11h.01M12 11h.01M16 11h.01',
  cards: 'm8 3 12 2-3 17-12-2L8 3ZM4 7 2 19l3 1M11 7l5 1',
  check: 'M20 7a9 9 0 1 1-7-4m-5 9 4 4L22 5',
  chart: 'M3 14h4v7H3v-7Zm7-6h4v13h-4V8Zm7-6h4v19h-4V2Z',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  graduation: 'm2 9 10-5 10 5-10 5L2 9Zm4 2v7c4 3 8 3 12 0v-7m4-2v9',
};

export function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
