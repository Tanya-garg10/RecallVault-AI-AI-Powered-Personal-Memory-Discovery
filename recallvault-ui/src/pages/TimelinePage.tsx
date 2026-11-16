import { motion } from 'framer-motion';
import { CalendarDays, Images } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { MemoryThumb } from '../components/memory/MemoryThumb';
import { EmptyState, ErrorState, LoadingState } from '../components/memory/States';
import { Skeleton } from '../components/ui/skeleton';
import { getTimeline } from '../lib/bridge';
import { cn, formatDate } from '../lib/utils';
import type { TimelinePayload } from '../lib/types';

export function TimelinePage({ demoMode }: { demoMode: boolean }) {
  const [year, setYear] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [payload, setPayload] = useState<TimelinePayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      setError(null);
      try {
        const result = await getTimeline(year, { demoMode });
        if (cancelled) return;
        if (result.years.length) setYears(result.years);
        if (year === null && result.year) setYear(result.year);
        setPayload(result);
        setStatus('success');
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Timeline could not be loaded.');
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [year, demoMode]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-primary/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,234,254,0.82))] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <Badge className="mb-4 border-primary/15 bg-white/80 text-primary-dark"><CalendarDays className="h-3 w-3" /> Read-only timeline</Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Memories by time.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Year and month buckets are generated only from dates returned by the NAS. Event labels appear only when evidence supports them.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {years.map((item) => (
            <button key={item} type="button" onClick={() => setYear(item)} className={cn('rounded-full border px-4 py-2 text-sm font-bold transition', year === item ? 'border-primary bg-primary text-white' : 'border-line bg-white text-muted hover:text-ink')}>
              {item}
            </button>
          ))}
          {!years.length && status !== 'loading' && <span className="text-sm text-muted">No timeline years were returned.</span>}
        </div>
      </section>

      {status === 'loading' && <LoadingState label="Summarizing memory buckets…" />}
      {status === 'error' && <ErrorState message={error ?? 'Unknown timeline error.'} />}
      {status === 'success' && payload?.buckets.length === 0 && <EmptyState title="No timeline buckets">No dated memories were returned for this selection.</EmptyState>}

      {status === 'success' && payload?.buckets.map((bucket, bucketIndex) => (
        <motion.section
          key={`${bucket.bucket}-${bucket.label}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, delay: Math.min(bucketIndex * 0.05, 0.25) }}
          className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[280px_1fr]">
            <div className="relative">
              {bucket.cover ? <MemoryThumb item={bucket.cover} large className="min-h-52 rounded-[20px]" /> : <Skeleton className="min-h-52 rounded-[20px]" />}
              <div className="absolute left-4 top-4 rounded-full bg-ink/45 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">{bucket.count} memories</div>
            </div>
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-extrabold tracking-tight">{bucket.label}</h2>
                  <p className="mt-1 text-sm text-muted">{formatDate(bucket.bucket ? `${bucket.bucket}-01` : null)} · {bucket.count} returned items</p>
                </div>
                <Badge className={bucket.eventLabel ? 'border-primary/15 bg-primary-soft text-primary-dark' : 'border-line bg-slate-50 text-muted'}>
                  {bucket.eventLabel ? `Event: ${bucket.eventLabel}` : 'Event label unavailable'}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {bucket.items.slice(0, 6).map((item) => (
                  <Link key={item.id} to={`/memories/${item.id}`} className="group overflow-hidden rounded-2xl border border-line bg-paper transition hover:border-primary/25">
                    <MemoryThumb item={item} className="aspect-[4/3]" />
                    <div className="p-3">
                      <p className="truncate text-sm font-bold">{item.title}</p>
                      <p className="mt-1 text-xs text-muted">{formatDate(item.date)}</p>
                    </div>
                  </Link>
                ))}
                {bucket.items.length > 6 && (
                  <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-line bg-primary-soft/40 p-4 text-center text-sm font-semibold text-muted">
                    <span className="inline-flex items-center gap-2"><Images className="h-4 w-4" /> {bucket.items.length - 6} more in this bucket</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      ))}

      {status === 'success' && payload?.undated.length ? (
        <section className="rounded-[24px] border border-dashed border-line bg-white/70 p-5">
          <h3 className="font-heading text-lg font-extrabold">Undated memories</h3>
          <p className="mt-1 text-sm text-muted">{payload.undated.length} items without a verified capture date.</p>
        </section>
      ) : null}
    </div>
  );
}
