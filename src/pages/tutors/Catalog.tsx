import { useLayoutEffect, useRef } from 'react';
import { Link, useNavigationType, useSearchParams } from 'react-router-dom';
import { tutors, tutorImage } from './data';
import { filterTutors, defaultFilters } from './service';
import { levels } from './model';
import type { CatalogFilters } from './model';
import { LessonPrices, TutorFlag, TutorHeading, TutorIdentityBadge } from './TutorUI';
import { useTutorLocale } from './useTutorLocale';
import { Icon } from '../../components/Icon';
import { TutorFavoriteButton } from '../../account/actions';

export function Catalog() {
  const { copy, language } = useTutorLocale();
  const [params, setParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const navigationType = useNavigationType();
  const allowed = { language: ['de', 'en'], level: [...levels], price: ['low', 'middle', 'high'], sort: ['price-asc', 'price-desc', 'name-asc', 'name-desc'] };
  const filters: CatalogFilters = { ...defaultFilters, search: (params.get('search') ?? '').slice(0, 120) };
  for (const key of Object.keys(allowed) as (keyof typeof allowed)[]) {
    const value = params.get(key) ?? '';
    if ((allowed[key] as readonly string[]).includes(value)) filters[key] = value;
  }
  // Keep typing in the native input immediate. Router transitions can lag behind
  // rapid keystrokes; feeding that older URL value back into a controlled input
  // would drop letters. Back/forward and external navigation still restore it.
  useLayoutEffect(() => {
    if (searchInput.current && (navigationType !== 'REPLACE' || document.activeElement !== searchInput.current)) searchInput.current.value = filters.search;
  }, [filters.search, navigationType]);
  function change(key: keyof CatalogFilters, value: string) {
    const next = new URLSearchParams(params);
    next.delete('goal');
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  }
  const result = filterTutors(tutors, filters, language);
  const suffix = params.size ? `?${params}` : '';
  return <>
    <div className="tutors-catalog-heading"><div><TutorHeading title={`${copy.title} ${copy.titleAccent}`}>{copy.title} <span className="tutors-accent">{copy.titleAccent}</span></TutorHeading><p className="tutors-intro">{copy.intro}</p></div><Link to="/tutors/become" className="button button-secondary tutors-become-link">{copy.become}<Icon name="arrow" /></Link></div>
    <div className="tutors-filter-bar" role="search" aria-label={copy.search}>
      <label className="tutors-search"><span>{copy.search}</span><span className="tutors-search-input"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg><input ref={searchInput} type="search" name="search" defaultValue={filters.search} onChange={event => change('search', event.target.value)} placeholder={copy.searchPlaceholder} maxLength={120} /></span></label>
      <label>{copy.language}<select name="language" value={filters.language} onChange={event => change('language', event.target.value)}><option value="">{copy.allLanguages}</option><option value="de">{copy.de}</option><option value="en">{copy.en}</option></select></label>
      <label>{copy.level}<select name="level" value={filters.level} onChange={event => change('level', event.target.value)}><option value="">{copy.allLevels}</option>{levels.map(level => <option key={level}>{level}</option>)}</select></label>
      <label>{copy.price}<select name="price" value={filters.price} onChange={event => change('price', event.target.value)}><option value="">{copy.allPrices}</option><option value="low">{copy.priceLow}</option><option value="middle">{copy.priceMiddle}</option><option value="high">{copy.priceHigh}</option></select></label>
    </div>
    <div className="tutors-results-bar"><h2 aria-live="polite">{copy.results} <span>({result.length})</span></h2><div>{Object.values(filters).some(Boolean) && <button type="button" className="tutors-reset" onClick={() => setParams({})}>{copy.reset}</button>}<label className="tutors-sort"><span className="sr-only">{copy.sort}</span><select name="sort" value={filters.sort} onChange={event => change('sort', event.target.value)}><option value="">{copy.sort}: {copy.recommended}</option><option value="price-asc">{copy.priceAsc}</option><option value="price-desc">{copy.priceDesc}</option><option value="name-asc">{copy.nameAsc}</option><option value="name-desc">{copy.nameDesc}</option></select></label></div></div>
    {result.length ? <div className="tutors-grid">{result.map(tutor => <article className="tutor-card" key={tutor.id} data-tutor-id={tutor.id}>
      <img className="tutor-card-photo" src={tutorImage(tutor)} alt={`${tutor.name}${tutor.demo ? ' · Demo' : ''}`} width="1374" height="1145" loading="lazy" />
      <div className="tutor-card-details"><div className="tutor-card-name"><h2>{tutor.name}</h2><TutorFavoriteButton tutorId={tutor.id} /><TutorIdentityBadge tutor={tutor} /></div><p className="tutor-card-language">{tutor.languages.map(lang => <span key={lang}><TutorFlag language={lang} />{copy[lang]}</span>)}</p></div>
      <p className="tutor-card-spoken"><strong>{copy.speaks}:</strong> {tutor.spokenLanguages[language]}</p><p className="tutor-card-story">{tutor.story[language]}</p>
      <div className="tutor-card-bottom"><LessonPrices tutor={tutor} /><Link to={`/tutors/${tutor.id}${suffix}`} className="button button-primary" aria-label={`${copy.more} — ${tutor.name}`}>{copy.more}<Icon name="arrow" /></Link></div>
    </article>)}</div> : <div className="tutors-no-results"><Icon name="people" /><h2>{copy.noResults}</h2><p>{copy.noResultsHelp}</p><button type="button" className="button button-primary" onClick={() => setParams({})}>{copy.reset}</button></div>}
  </>;
}
