import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Compass, History, Images, Lock, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { MemoryCard } from '../components/memory/MemoryCard';
import { MemoryThumb } from '../components/memory/MemoryThumb';
import { SearchBar } from '../components/memory/SearchBar';
import { EmptyState } from '../components/memory/States';
import { getCollections, getRecentMemories, getTimeline, searchMemories } from '../lib/bridge';
import { addSearchHistory, getSearchHistory } from '../lib/searchHistory';
import { formatDate } from '../lib/utils';
import type { Collection, MemoryItem, TimelinePayload } from '../lib/types';

const suggestions = [
  'That sunset trip with my friends',
  'Photos from my last birthday',
  'Documents related to my college project',
  'Pictures with my family during winter',
  'Find my college farewell photos from 2025',
];

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HomePage({ demoMode }: { demoMode: boolean }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(() => getSearchHistory());
  const [recent, setRecent] = useState<MemoryItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [timeline, setTimeline] = useState<TimelinePayload | null>(null);
  const [featured, setFeatured] = useState<MemoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const [recentResult, collectionsResult, timelineResult] = await Promise.allSettled([
        getRecentMemories({ demoMode }),
        getCollections({ demoMode }),
        getTimeline(null, { demoMode }),
      ]);
      if (cancelled) return;
      if (recentResult.status === 'fulfilled') setRecent(recentResult.value);
      if (collectionsResult.status === 'fulfilled') setCollections(collectionsResult.value.collections);
      if (timelineResult.status === 'fulfilled') setTimeline(timelineResult.value);
      const firstError = [recentResult, collectionsResult, timelineResult].find((result) => result.status === 'rejected');
      if (firstError?.status === 'rejected') setError(firstError.reason?.message ?? 'Some dashboard data could not be loaded.');
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [demoMode]);

  useEffect(() => {
    let cancelled = false;
    searchMemories('vacation sunset trip', {}, { demoMode })
      .then((payload) => { if (!cancelled && payload.results[0]) setFeatured(payload.results[0]); })
      .catch(() => { if (!cancelled) setFeatured(recent.find((item) => item.previewUrl) ?? null); });
    return () => { cancelled = true; };
  }, [demoMode, recent]);

  const rediscovered = useMemo(() => recent.slice(0, 7), [recent]);
  const smallPreviews = rediscovered.slice(1, 4);

  function submitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    addSearchHistory(trimmed);
    setHistory(getSearchHistory());
    navigate(`/explore?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl pt-6 text-center sm:pt-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 border-primary/15 bg-white/85 px-4 py-1.5 text-primary-dark"><Sparkles className="h-3 w-3" /> Your personal memory intelligence</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            Your memories are<br />closer than you think.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg"
          >
            Search through years of photos, videos and moments on your UGREEN NAS. Just describe what you remember.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }} className="mx-auto mt-9 max-w-2xl">
            <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} large placeholder="Try “That sunset trip with my friends”…" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button key={item} type="button" onClick={() => submitSearch(item)} className="rounded-full border border-line bg-white/80 px-4 py-2 text-[13px] font-semibold text-muted transition hover:border-primary/35 hover:text-primary-dark">
                {item}
              </button>
            ))}
          </motion.div>
          {history.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
              <History className="h-3.5 w-3.5" />
              <span className="font-bold uppercase tracking-[0.12em]">Recent</span>
              {history.slice(0, 3).map((item) => (
                <button key={item} type="button" onClick={() => submitSearch(item)} className="rounded-full bg-white/70 px-3 py-1 font-semibold text-ink/70 transition hover:text-primary-dark">{item}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div>}

      {/* Recently rediscovered — asymmetric editorial */}
      <section>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Recently rediscovered</div>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Moments worth reliving</h2>
            </div>
            <Link to="/explore" className="group inline-flex items-center gap-2 text-sm font-bold text-primary-dark transition hover:text-primary">
              View all memories <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        {loading ? (
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Skeleton className="h-[420px] rounded-[28px]" />
            <div className="grid gap-5">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-[22px]" />)}</div>
          </div>
        ) : featured ? (
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Reveal className="relative">
              <Link to={`/memories/${featured.id}`} className="group block overflow-hidden rounded-[28px] border border-line shadow-[var(--shadow-card)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {featured.previewUrl
                    ? <img src={featured.previewUrl} alt={featured.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    : <MemoryThumb item={featured} large />}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <Badge className="mb-3 border-white/25 bg-white/15 text-white backdrop-blur-sm">{featured.eventLabel ?? 'Featured memory'}</Badge>
                    <h3 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">{featured.title}</h3>
                    <p className="mt-2 max-w-lg text-sm text-white/80">{featured.description || 'Open to see the full story behind this memory.'}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-white/70">
                      <span>{formatDate(featured.date)}</span>
                      {featured.location && <span className="truncate">{featured.location}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
            <div className="grid gap-5">
              {smallPreviews.map((item, index) => (
                <Reveal key={item.id} delay={0.08 + index * 0.06}>
                  <Link to={`/memories/${item.id}`} className="group flex gap-4 overflow-hidden rounded-[22px] border border-line bg-white p-3 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary/25">
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl">
                      {item.previewUrl
                        ? <img src={item.previewUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                        : <MemoryThumb item={item} className="h-full w-full" />}
                    </div>
                    <div className="min-w-0 py-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{item.eventLabel ?? item.kind}</div>
                      <h4 className="mt-1 truncate font-heading text-base font-extrabold">{item.title}</h4>
                      <p className="mt-1 text-xs text-muted">{formatDate(item.date)}</p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 self-center text-muted transition group-hover:text-primary" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="No memories to feature">Completed searches and timeline data will surface memories here.</EmptyState>
        )}
        {rediscovered.length > 4 && (
          <Reveal className="mt-10">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {rediscovered.slice(4, 8).map((item, index) => <MemoryCard key={item.id} item={item} index={index} />)}
            </div>
          </Reveal>
        )}
      </section>

      {/* Collections band */}
      <section>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Smart collections</div>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Your stories, gathered</h2>
            </div>
            <Link to="/collections" className="group inline-flex items-center gap-2 text-sm font-bold text-primary-dark transition hover:text-primary">
              Browse collections <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-[24px]" />)}</div>
        ) : collections.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {collections.slice(0, 4).map((collection, index) => {
              const firstMember = recent.find((item) => collection.memberIds.includes(item.id));
              return (
                <Reveal key={collection.id} delay={index * 0.06}>
                  <Link to={`/collections/${collection.id}`} className="group relative block overflow-hidden rounded-[24px] border border-line shadow-[var(--shadow-soft)]">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {firstMember?.previewUrl
                        ? <img src={firstMember.previewUrl} alt={collection.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" loading="lazy" />
                        : <div className="h-full w-full" style={{ background: `linear-gradient(160deg, ${collection.cover?.from ?? '#6d5df6'}, ${collection.cover?.to ?? '#c9bdff'})` }} />}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <Badge className="mb-2 border-white/25 bg-white/15 text-white backdrop-blur-sm">{collection.requiresConfirmation ? 'Suggestion' : 'Collection'}</Badge>
                        <h3 className="font-heading text-xl font-extrabold text-white">{collection.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75">{collection.description}</p>
                        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-white/70">
                          <span>{collection.memberIds.length} memories</span>
                          <span className="inline-flex items-center gap-1 opacity-0 transition group-hover:opacity-100">Open <ArrowUpRight className="h-3.5 w-3.5" /></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No collections yet">Smart collection suggestions will appear here.</EmptyState>
        )}
      </section>

      {/* Timeline strip */}
      <section>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Memory timeline</div>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Years, months, moments</h2>
            </div>
            <Link to="/timeline" className="group inline-flex items-center gap-2 text-sm font-bold text-primary-dark transition hover:text-primary">
              Open timeline <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(timeline?.years ?? []).slice(0, 4).map((year) => (
              <Link key={year} to="/timeline" className="group relative overflow-hidden rounded-[24px] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/25">
                <div className="font-heading text-5xl font-extrabold tracking-tight text-primary/15 transition group-hover:text-primary/30">{year}</div>
                <div className="mt-3 text-sm font-bold text-ink">{timeline?.buckets.filter((b) => b.bucket.startsWith(year)).reduce((sum, b) => sum + b.count, 0) ?? 0} memories</div>
                <div className="mt-1 text-xs text-muted">{timeline?.buckets.find((b) => b.bucket.startsWith(year))?.label ?? 'Browse the year'}</div>
                <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-muted transition group-hover:text-primary" />
              </Link>
            ))}
            {loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-[24px]" />)}
          </div>
        </Reveal>
      </section>

      {/* Privacy band */}
      <Reveal>
        <section className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-[linear-gradient(135deg,#ffffff,rgba(238,234,254,0.75))] p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-dark"><Lock className="h-3.5 w-3.5" /> Private by design</div>
              <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Your memories stay on your NAS.</h2>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                RecallVault uses only documented UGREEN NAS capabilities. Read-only by default — albums and organization happen only after your explicit approval. No credentials, no hidden uploads.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/about"><Button variant="secondary"><Compass className="h-4 w-4" /> How it works</Button></Link>
              <Link to="/settings"><Button><Images className="h-4 w-4" /> NAS status</Button></Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
