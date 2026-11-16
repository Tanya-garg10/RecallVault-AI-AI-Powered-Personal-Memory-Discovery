import { CalendarDays, Filter, MapPin, SearchX, Sparkles, Tag } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { MemoryCard } from '../components/memory/MemoryCard';
import { SearchBar } from '../components/memory/SearchBar';
import { EmptyState, ErrorState, LoadingState } from '../components/memory/States';
import { searchMemories } from '../lib/bridge';
import { addSearchHistory } from '../lib/searchHistory';
import { cn } from '../lib/utils';
import type { MediaKind, SearchFilters, SearchPayload } from '../lib/types';

const mediaTypes: Array<{ value: 'all' | MediaKind; label: string }> = [
  { value: 'all', label: 'All media' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Videos' },
  { value: 'document', label: 'Documents' },
];

const sortOptions: Array<{ value: NonNullable<SearchFilters['sort']>; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

const examples = [
  'Photos from my last birthday',
  'That trip where we watched the sunset',
  'Documents related to my college project',
  'Pictures with my family during winter',
  'Find my college farewell photos from 2025',
];

export function ExplorePage({ demoMode }: { demoMode: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [submittedQuery, setSubmittedQuery] = useState(urlQuery);
  const [filters, setFilters] = useState<SearchFilters>({ mediaType: 'all', sort: 'relevance' });
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
    setSubmittedQuery(urlQuery);
  }

  const runSearch = useCallback(async (value: string, nextFilters: SearchFilters) => {
    await Promise.resolve();
    const trimmed = value.trim();
    if (!trimmed) {
      setPayload(null);
      setStatus('idle');
      setError(null);
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const result = await searchMemories(trimmed, nextFilters, { demoMode });
      setPayload(result);
      setStatus('success');
    } catch (err) {
      setPayload(null);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Search failed.');
    }
  }, [demoMode]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- data fetch synchronized with query/filter state
    runSearch(submittedQuery, filters);
  }, [submittedQuery, filters, runSearch]);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    addSearchHistory(trimmed);
    setQuery(trimmed);
    setSubmittedQuery(trimmed);
    setSearchParams({ q: trimmed }, { replace: true });
  }

  function updateFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  const grouped = useMemo(() => {
    const results = payload?.results ?? [];
    return {
      strong: results.filter((item) => item.confidence === 'strong'),
      possible: results.filter((item) => item.confidence === 'possible'),
      related: payload?.related ?? [],
    };
  }, [payload]);

  const hasResults = grouped.strong.length + grouped.possible.length + grouped.related.length > 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-primary/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,234,254,0.82))] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="mb-6">
          <Badge className="mb-4 border-primary/15 bg-white/80 text-primary-dark"><Sparkles className="h-3 w-3" /> AI Memory Discovery</Badge>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">What are you trying to remember?</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Describe the moment in plain language. RecallVault routes the query to the registered NAS expert that owns the required capability and separates strong evidence from possible matches.
          </p>
        </div>
        <SearchBar value={query} onChange={setQuery} onSubmit={submit} large autoFocus={!urlQuery} />
        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((item) => (
            <button key={item} type="button" onClick={() => submit(item)} className="rounded-full border border-line bg-white/80 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary/30 hover:text-primary-dark">
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-white p-4 shadow-[var(--shadow-soft)]">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-ink"><Filter className="h-4 w-4 text-primary" /> Refinements</div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">Media type</div>
            <div className="flex flex-wrap gap-2">
              {mediaTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateFilter('mediaType', item.value)}
                  className={cn('rounded-full border px-3 py-2 text-xs font-bold transition', filters.mediaType === item.value ? 'border-primary bg-primary text-white' : 'border-line bg-white text-muted hover:text-ink')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> From</span>
            <Input type="date" value={filters.dateFrom ?? ''} onChange={(event) => updateFilter('dateFrom', event.target.value || undefined)} />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> To</span>
            <Input type="date" value={filters.dateTo ?? ''} onChange={(event) => updateFilter('dateTo', event.target.value || undefined)} />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Sort</span>
            <select value={filters.sort ?? 'relevance'} onChange={(event) => updateFilter('sort', event.target.value as SearchFilters['sort'])} className="h-11 rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-primary/50">
              {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location contains</span>
            <Input value={filters.location ?? ''} onChange={(event) => updateFilter('location', event.target.value || undefined)} placeholder="e.g. coast, university, home" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <span className="flex items-center gap-1"><SearchX className="h-3.5 w-3.5" /> Event keyword</span>
            <Input value={filters.event ?? ''} onChange={(event) => updateFilter('event', event.target.value || undefined)} placeholder="e.g. farewell, birthday, Diwali" />
          </label>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight">Search results</h2>
            <p className="mt-1 text-sm text-muted">
              {status === 'success' ? `${payload?.total ?? payload?.results.length ?? 0} verified candidates · ${payload?.mode ?? 'unknown'} source` : 'Evidence-backed matches will appear here.'}
            </p>
          </div>
          {payload?.resultRef && <Badge className="border-primary/15 bg-primary-soft text-primary-dark">Result reference available</Badge>}
        </div>

        {payload?.note && <div className="rounded-2xl border border-primary/15 bg-primary-soft/70 px-4 py-3 text-sm font-medium text-primary-dark">{payload.note}</div>}
        {status === 'idle' && <EmptyState title="Start a memory search">Try a suggested query or describe the moment you want to rediscover.</EmptyState>}
        {status === 'loading' && <LoadingState label="Searching authorized NAS scope and ranking evidence…" />}
        {status === 'error' && <ErrorState message={error ?? 'Unknown search error.'} onRetry={() => runSearch(submittedQuery, filters)} />}
        {status === 'success' && !hasResults && <EmptyState title="No verified matches">The active source returned no matching memories for this query and filter set.</EmptyState>}

        {status === 'success' && grouped.strong.length > 0 && (
          <ResultGroup title="Strong matches" description="Direct evidence satisfies the explicit constraints." items={grouped.strong} />
        )}
        {status === 'success' && grouped.possible.length > 0 && (
          <ResultGroup title="Possible matches" description="Partial or indirect evidence; review before treating as confirmed." items={grouped.possible} />
        )}
        {status === 'success' && grouped.related.length > 0 && (
          <ResultGroup title="Related memories" description="Connected by shared collections, tags, dates, or events." items={grouped.related} />
        )}
      </section>
    </div>
  );
}

function ResultGroup({ title, description, items }: { title: string; description: string; items: SearchPayload['results'] }) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading text-xl font-extrabold">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => <MemoryCard key={item.id} item={item} index={index} />)}
      </div>
    </div>
  );
}
