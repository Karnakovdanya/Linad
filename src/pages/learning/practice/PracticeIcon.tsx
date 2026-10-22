import { Icon } from '../../../components/Icon';

const paths = {
  work: 'M9 7V4h6v3M3 7h18v14H3V7Zm0 6c6 3 12 3 18 0M10 13h4v3h-4v-3Z',
  health: 'M5 3v5a5 5 0 0 0 10 0V3M3 3h4m6 0h4M10 13v3a5 5 0 0 0 10 0v-3m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  plane: 'm22 3-7 18-4-8-8-4 19-6ZM11 13 22 3M7 17l-4 4',
  cart: 'M2 3h3l3 13h11l3-9H6M10 21h.01M18 21h.01',
  home: 'm2 11 10-9 10 9M5 9v13h5v-8h4v8h5V9',
  bank: 'M3 5h18v15H3V5Zm0 5h18M6 16h5',
  sport: 'M3 8v8m3-10v12m12-12v12m3-10v8M6 12h12',
  volume: 'm11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
  bookmark: 'M6 3h12v19l-6-4-6 4V3Z',
  chevron: 'm6 9 6 6 6-6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  stop: 'M6 6h12v12H6V6Z',
} as const;
type ExistingIcon = 'file' | 'chat' | 'graduation' | 'book' | 'people' | 'arrow' | 'check';
export type PracticeIconName = keyof typeof paths | ExistingIcon;
export function PracticeIcon({ name }: { name: PracticeIconName }) {
  if (!(name in paths)) return <Icon name={name as ExistingIcon} />;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name as keyof typeof paths]} /></svg>;
}
