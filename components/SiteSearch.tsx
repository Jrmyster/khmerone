'use client';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Search, ArrowUpRight, X } from 'lucide-react';
import { searchSite, siteSearchDocuments, resourceSearchDocuments, searchKindLabels, type SearchDocument, type SearchKind } from '@/data/siteSearch';
import { searchExcerpt, textValues } from '@/lib/search';
import { fetchPublishedResources } from '@/lib/search-resources';
import type { Locale } from '@/types/app';

const tr = (locale: Locale, en: string, km: string) => locale === 'km' ? km : en;

export function usePublishedSearch(active: boolean) {
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    let disposed = false;
    async function load() {
      setStatus('loading');
      try {
        const resources = await fetchPublishedResources(controller.signal);
        if (!disposed) { setDocuments(resourceSearchDocuments(resources)); setStatus('ready'); }
      } catch { if (!disposed) { setDocuments([]); setStatus('error'); } }
      finally { clearTimeout(timer); }
    }
    void load();
    return () => { disposed = true; controller.abort(); clearTimeout(timer); };
  }, [active]);
  return { documents, status };
}

export function SearchResourceStatus({ status, locale }: { status: string; locale: Locale }) {
  return status === 'loading' ? <p className="site-search-note" role="status">{tr(locale, 'Checking published school resources…', 'កំពុងពិនិត្យធនធានសាលាដែលបានផ្សព្វផ្សាយ…')}</p>
    : status === 'error' ? <p className="site-search-note" role="status">{tr(locale, 'School resources are temporarily unavailable. You can still search the apps and lessons.', 'ធនធានសាលាមិនអាចប្រើបានបណ្ដោះអាសន្ន។ អ្នកនៅតែអាចស្វែងរកកម្មវិធី និងមេរៀន។')}</p> : null;
}

export function SearchResults({ results, query, locale, preview = false }: { results: SearchDocument[]; query: string; locale: Locale; preview?: boolean }) {
  const [limit, setLimit] = useState(preview ? 8 : 20);
  return <div className="site-search-results">
    <p className="site-search-count" role="status" aria-live="polite">{results.length} {tr(locale, 'matching results', 'លទ្ធផលត្រូវគ្នា')}</p>
    <ol>{results.slice(0, limit).map(result => {
      const external = /^https?:\/\//.test(result.href);
      const title = result.title[locale];
      const other = result.title[locale === 'en' ? 'km' : 'en'];
      return <li key={result.id}><a href={result.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        <span className="site-search-kind">{searchKindLabels[result.kind][locale]}{external ? tr(locale, ' · Linked app', ' · កម្មវិធីភ្ជាប់') : ''}</span>
        <h3>{title}<ArrowUpRight size={17} aria-hidden="true" /></h3>
        {other !== title && <span className="site-search-translation" lang={locale === 'en' ? 'km' : 'en'}>{other}</span>}
        <p>{searchExcerpt([result.summary[locale], ...textValues(result.summary), ...result.fields.filter(field => field !== title && field !== other)], query, result.summary[locale])}</p>
      </a></li>;
    })}</ol>
    {!results.length && <p className="site-search-empty">{tr(locale, 'No matches yet. Try a shorter word, another spelling, or the other language.', 'រកមិនឃើញលទ្ធផល។ សាកពាក្យខ្លីជាងនេះ អក្ខរាវិរុទ្ធផ្សេង ឬភាសាមួយទៀត។')}</p>}
    {results.length > limit && (preview ? <a className="site-search-more" href={`/search?q=${encodeURIComponent(query)}`}>{tr(locale, 'See all results', 'មើលលទ្ធផលទាំងអស់')} <ArrowUpRight size={16}/></a> : <button type="button" className="site-search-more" onClick={() => setLimit(value => value + 20)}>{tr(locale, 'Show more results', 'បង្ហាញលទ្ធផលបន្ថែម')}</button>)}
  </div>;
}

export function SiteSearch() {
  const [query, setQuery] = useState('');
  const [locale, setLocale] = useState<Locale>('en');
  const [kind, setKind] = useState<SearchKind | 'all'>('all');
  const [ready, setReady] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const published = usePublishedSearch(Boolean(query.trim()));
  useEffect(() => {
    const restore = () => {
      setQuery((new URLSearchParams(window.location.search).get('q') || '').slice(0, 240));
      try { setLocale(localStorage.getItem('khmerone-locale') === 'km' ? 'km' : 'en'); } catch { /* Session still works. */ }
      setReady(true);
    };
    restore();
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => { const url = new URL(window.location.href); if (query) url.searchParams.set('q', query); else url.searchParams.delete('q'); window.history.replaceState(null, '', url); }, 250);
    return () => clearTimeout(timer);
  }, [query, ready]);
  const results = useMemo(() => searchSite(deferredQuery, [...siteSearchDocuments, ...published.documents]), [deferredQuery, published.documents]);
  const filtered = kind === 'all' ? results : results.filter(result => result.kind === kind);
  return <main className="site-search-page" lang={locale}>
    <header><a href="/">← Khmer One</a><a href="/learning">{tr(locale, 'Learning studio', 'កន្លែងសិក្សា')}</a><button type="button" onClick={() => { const next = locale === 'en' ? 'km' : 'en'; setLocale(next); try { localStorage.setItem('khmerone-locale', next); } catch { /* Session still works. */ } }}>{locale === 'en' ? 'ខ្មែរ' : 'English'}</button></header>
    <h1>{tr(locale, 'Search Khmer One', 'ស្វែងរកក្នុងខ្មែរ វ័ន')}</h1>
    <p>{tr(locale, 'Find a word, a lesson, a story or your next learning tool.', 'ស្វែងរកពាក្យ មេរៀន រឿង ឬឧបករណ៍សិក្សា។')}</p>
    <form role="search" className="site-search-form" onSubmit={event => event.preventDefault()}>
      <Search size={22} aria-hidden="true"/><input type="search" value={query} maxLength={240} onChange={event => { setQuery(event.target.value); setKind('all'); }} placeholder={tr(locale, 'Search in English or Khmer…', 'ស្វែងរកជាអង់គ្លេស ឬខ្មែរ…')} aria-label={tr(locale, 'Search all content', 'ស្វែងរកមាតិកាទាំងអស់')} aria-controls="site-search-matches"/>
      {query && <button type="button" onClick={() => { setQuery(''); setKind('all'); }} aria-label={tr(locale, 'Clear search', 'លុបពាក្យស្វែងរក')}><X size={20}/></button>}
    </form>
    {query.trim() ? <><label className="site-search-filter">{tr(locale, 'Result type', 'ប្រភេទលទ្ធផល')} <select value={kind} onChange={event => setKind(event.target.value as SearchKind | 'all')}><option value="all">{tr(locale, 'All results', 'លទ្ធផលទាំងអស់')}</option>{Object.entries(searchKindLabels).map(([value, label]) => <option value={value} key={value}>{label[locale]}</option>)}</select></label><SearchResourceStatus status={published.status} locale={locale}/><section id="site-search-matches" aria-busy={deferredQuery !== query}><SearchResults key={deferredQuery + kind} results={filtered} query={deferredQuery} locale={locale}/></section></>
      : <div className="site-search-suggestions"><p>{tr(locale, 'Try a topic', 'សាកល្បងប្រធានបទ')}</p>{['Photosynthesis', 'កោសិកា', 'water cycle', 'Python', 'translation', 'school announcements'].map(example => <button type="button" key={example} onClick={() => setQuery(example)}>{example}</button>)}</div>}
  </main>;
}
