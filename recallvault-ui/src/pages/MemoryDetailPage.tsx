import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MemoryCard } from '../components/memory/MemoryCard';
import { MemoryThumb } from '../components/memory/MemoryThumb';
import { EmptyState, ErrorState, LoadingState } from '../components/memory/States';
import { getMediaDetails } from '../lib/bridge';
import { confidenceTone, formatDate, kindLabel } from '../lib/utils';
import type { MediaDetailsPayload, MemoryItem } from '../lib/types';

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="rounded-2xl border border-line bg-white/80 px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

export function MemoryDetailPage({ demoMode }: { demoMode: boolean }) {
  const { memoryId } = useParams<{ memoryId: string }>();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<MediaDetailsPayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      setError(null);
      try {
        const result = await getMediaDetails(memoryId ?? '', { demoMode });
        if (!cancelled) { setPayload(result); setStatus('success'); }
      } catch (err) {
        if (!cancelled) { setStatus('error'); setError(err instanceof Error ? err.message : 'Memory details could not be loaded.'); }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [memoryId, demoMode]);

  if (status === 'loading') return <LoadingState label="Loading memory details…" />;
  if (status === 'error') return <ErrorState message={error ?? 'Unknown error.'} />;
  if (!payload) return <EmptyState title="Memory not found">The requested memory was not returned by the active source.</EmptyState>;

  const item = payload.item;
  const pool: MemoryItem[] = [item, ...payload.related];
  const index = pool.findIndex((entry) => entry.id === item.id);
  const prev = index > 0 ? pool[index - 1] : null;
  const next = index >= 0 && index < pool.length - 1 ? pool[index + 1] : null;

  function goTo(target: MemoryItem | null) {
    if (target) navigate(`/memories/${target.id}`);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-primary-dark">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => goTo(prev)} disabled={!prev}><ChevronLeft className="h-4 w-4" /> Previous</Button>
          <Button variant="secondary" size="sm" onClick={() => goTo(next)} disabled={!next}>Next <ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-white shadow-[var(--shadow-card)]">
          <MemoryThumb item={item} large className="min-h-[420px]" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="border-white/30 bg-ink/45 text-white backdrop-blur-sm">{kindLabel(item.kind)}</Badge>
            <Badge className={confidenceTone(item.confidence)}>{item.confidence}</Badge>
          </div>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-ink/55 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-ink/70"
            aria-label="Open fullscreen preview"
          >
            <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[var(--shadow-soft)]">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">{item.title}</h1>
            <p className="mt-1 truncate text-sm text-muted">{item.fileName}</p>
            {item.description && <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>}
            {item.aiDescription && (
              <div className="mt-4 rounded-2xl bg-primary-soft/60 p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">AI description (host-provided)</div>
                <p className="mt-1 text-sm leading-6 text-ink">{item.aiDescription}</p>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Capture date" value={formatDate(item.date)} />
            <Field label="Date source" value={item.dateField?.replaceAll('_', ' ')} />
            <Field label="Upload date" value={formatDate(item.uploadDate)} />
            <Field label="Location" value={item.location} />
            <Field label="Camera" value={item.camera} />
            <Field label="Duration" value={item.duration} />
            <Field label="Codec" value={item.codec} />
            <Field label="Resolution" value={item.resolution} />
            <Field label="Pages" value={item.pageCount} />
            <Field label="Document type" value={item.documentType} />
            <Field label="Size" value={item.size} />
            <Field label="Event" value={item.eventLabel} />
          </div>

          {item.path && (
            <div className="rounded-2xl border border-line bg-white/80 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Path (as returned by source)</div>
              <div className="mt-1 break-all font-mono text-xs text-ink">{item.path}</div>
            </div>
          )}

          {item.matchReasons.length > 0 && (
            <div className="rounded-[24px] border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-heading text-lg font-extrabold">Why this matched</h2>
              <ul className="mt-3 space-y-2">
                {item.matchReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.evidence.length > 0 && (
            <div className="rounded-[24px] border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-heading text-lg font-extrabold">Evidence channels</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.evidence.map((entry) => <Badge key={entry} className="border-line bg-slate-50 font-mono text-[11px] text-muted">{entry}</Badge>)}
              </div>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => <Badge key={tag} className="border-primary/15 bg-primary-soft text-primary-dark">{tag}</Badge>)}
            </div>
          )}
        </div>
      </section>

      {payload.related.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-2xl font-extrabold tracking-tight">Related memories</h2>
          <p className="mb-5 text-sm text-muted">Connected by shared collections, tags, event labels, or nearby dates.</p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {payload.related.map((related, index) => <MemoryCard key={related.id} item={related} index={index} />)}
          </div>
        </section>
      )}

      {fullscreen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Fullscreen memory preview" onClick={() => setFullscreen(false)}>
          <button type="button" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" onClick={() => setFullscreen(false)} aria-label="Close fullscreen"><X className="h-5 w-5" /></button>
          <div className="max-h-[90vh] max-w-5xl overflow-hidden rounded-[28px] bg-white" onClick={(event) => event.stopPropagation()}>
            <MemoryThumb item={item} large className="max-h-[70vh] min-h-[320px]" />
            <div className="p-5">
              <h3 className="font-heading text-xl font-extrabold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{formatDate(item.date)} · {item.location ?? 'Location unavailable'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
