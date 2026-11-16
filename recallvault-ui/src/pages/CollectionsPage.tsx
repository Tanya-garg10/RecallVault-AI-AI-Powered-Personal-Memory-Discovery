import { motion } from 'framer-motion';
import { ArrowRight, Check, Images, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { EmptyState, ErrorState, LoadingState } from '../components/memory/States';
import { createAlbum, getCollections } from '../lib/bridge';
import { cn, formatDate } from '../lib/utils';
import type { Collection, MemoryItem } from '../lib/types';

interface CollectionView extends Collection {
  members: MemoryItem[];
  isSuggestion: boolean;
}

export function CollectionsPage({ demoMode, onToast }: { demoMode: boolean; onToast: (message: string) => void }) {
  const [views, setViews] = useState<CollectionView[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [confirming, setConfirming] = useState<CollectionView | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      try {
        const payload = await getCollections({ demoMode });
        if (cancelled) return;
        const viewsResult: CollectionView[] = payload.collections.map((collection) => ({
          ...collection,
          members: payload.memories.filter((memory) => collection.memberIds.includes(memory.id)),
          isSuggestion: collection.requiresConfirmation,
        }));
        setViews(viewsResult);
        setNames(Object.fromEntries(viewsResult.map((item) => [item.id, item.suggestedAlbumName || item.title])));
        setSelected(Object.fromEntries(viewsResult.map((item) => [item.id, new Set(item.memberIds)])));
        setStatus('success');
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Collections could not be loaded.');
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [demoMode]);

  const suggestions = useMemo(() => views.filter((item) => item.isSuggestion), [views]);
  const existing = useMemo(() => views.filter((item) => !item.isSuggestion), [views]);

  function toggleFile(collectionId: string, memoryId: string) {
    setSelected((current) => {
      const next = new Set(current[collectionId] ?? []);
      if (next.has(memoryId)) next.delete(memoryId); else next.add(memoryId);
      return { ...current, [collectionId]: next };
    });
  }

  async function confirmCreate(collection: CollectionView) {
    const albumName = (names[collection.id] ?? collection.suggestedAlbumName).trim();
    const memberIds = Array.from(selected[collection.id] ?? []);
    if (!albumName || memberIds.length === 0) return;
    setSubmitting(true);
    try {
      const result = await createAlbum(
        { albumName, memberIds, sourceRef: collection.sourceRef ?? null, requiresConfirmation: true },
        { demoMode },
      );
      onToast(result.message ?? `Album action ${result.status}.`);
      setConfirming(null);
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Album creation failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-primary/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,234,254,0.82))] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <Badge className="mb-4 border-primary/15 bg-white/80 text-primary-dark"><Sparkles className="h-3 w-3" /> Smart collections</Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Your stories, gathered.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Suggestions are labelled explicitly. Albums are created only through the documented <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">ug-photo/create-album</code> approval flow and then verified by a read operation.
        </p>
      </section>

      {status === 'loading' && <LoadingState label="Loading collections…" />}
      {status === 'error' && <ErrorState message={error ?? 'Unknown collection error.'} />}
      {status === 'success' && views.length === 0 && <EmptyState title="No collections">No verified albums or suggestions were returned by the active source.</EmptyState>}

      {status === 'success' && suggestions.length > 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight">Suggested collections</h2>
            <p className="mt-1 text-sm text-muted">Evidence-backed proposals waiting for your confirmation.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {suggestions.map((collection, index) => (
              <SuggestionCard
                key={collection.id}
                collection={collection}
                index={index}
                name={names[collection.id] ?? collection.suggestedAlbumName}
                selected={selected[collection.id] ?? new Set()}
                onNameChange={(value) => setNames((current) => ({ ...current, [collection.id]: value }))}
                onToggle={(memoryId) => toggleFile(collection.id, memoryId)}
                onCreate={() => setConfirming(collection)}
              />
            ))}
          </div>
        </section>
      )}

      {status === 'success' && existing.length > 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight">NAS collections</h2>
            <p className="mt-1 text-sm text-muted">Collections returned without a pending confirmation requirement.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {existing.map((collection, index) => (
              <motion.article key={collection.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="overflow-hidden rounded-[26px] border border-line bg-white shadow-[var(--shadow-soft)]">
                <Link to={`/collections/${collection.id}`} className="group block">
                  <div className="relative aspect-[16/8] overflow-hidden">
                    {collection.members[0]?.previewUrl
                      ? <img src={collection.members[0].previewUrl} alt={collection.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
                      : <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${collection.cover?.from ?? '#6d5df6'}, ${collection.cover?.to ?? '#c9bdff'})` }} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    <span className="absolute bottom-4 left-5 font-heading text-2xl font-extrabold text-white drop-shadow">{collection.title}</span>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="mb-2 border-emerald-200 bg-emerald-50 text-emerald-700">NAS collection</Badge>
                      <h3 className="font-heading text-xl font-extrabold">{collection.title}</h3>
                      <p className="mt-1 text-sm text-muted">{collection.description}</p>
                    </div>
                    <Link to={`/collections/${collection.id}`} className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition hover:border-primary/30 hover:text-primary" aria-label={`Open ${collection.title}`}><ArrowRight className="h-4 w-4" /></Link>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
                    <span className="inline-flex items-center gap-1"><Images className="h-3.5 w-3.5" /> {collection.memberIds.length} items</span>
                    <span>Updated {formatDate(collection.lastUpdated)}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Confirm album creation">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-lg rounded-[28px] border border-line bg-white p-6 shadow-2xl">
            <Badge className="mb-4 border-primary/15 bg-primary-soft text-primary-dark"><ShieldCheck className="h-3 w-3" /> Approval required</Badge>
            <h3 className="font-heading text-2xl font-extrabold tracking-tight">Create this album?</h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              This requests the documented <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">ug-photo/create-album</code> workflow for <strong>{selected[confirming.id]?.size ?? 0}</strong> selected memories, then verifies the result with a documented read operation. No file is moved or deleted.
            </p>
            <label className="mt-5 grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Album name
              <Input value={names[confirming.id] ?? confirming.suggestedAlbumName} onChange={(event) => setNames((current) => ({ ...current, [confirming.id]: event.target.value }))} />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirming(null)} disabled={submitting}>Cancel</Button>
              <Button onClick={() => confirmCreate(confirming)} disabled={submitting || !(selected[confirming.id]?.size ?? 0)}>{submitting ? 'Working…' : 'Confirm create'}</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SuggestionCard({ collection, index, name, selected, onNameChange, onToggle, onCreate }: {
  collection: CollectionView;
  index: number;
  name: string;
  selected: Set<string>;
  onNameChange: (value: string) => void;
  onToggle: (memoryId: string) => void;
  onCreate: () => void;
}) {
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="overflow-hidden rounded-[26px] border border-line bg-white shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[16/8] overflow-hidden">
        {collection.members[0]?.previewUrl
          ? <img src={collection.members[0].previewUrl} alt={collection.title} className="h-full w-full object-cover" loading="lazy" />
          : <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${collection.cover?.from ?? '#6d5df6'}, ${collection.cover?.to ?? '#c9bdff'})` }} />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        {collection.members.length === 0 && <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-white/90"><Images className="mr-2 h-4 w-4" /> No preview members returned</div>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge className="mb-2 border-amber-200 bg-amber-50 text-amber-700">Suggestion</Badge>
            <h3 className="font-heading text-xl font-extrabold">{collection.title}</h3>
            <p className="mt-1 text-sm text-muted">{collection.description}</p>
          </div>
          <Badge className="border-line bg-slate-50 text-muted">{selected.size}/{collection.memberIds.length} selected</Badge>
        </div>
        {collection.evidence && <p className="mt-3 rounded-2xl bg-primary-soft/50 px-3 py-2 text-xs leading-5 text-primary-dark"><span className="font-bold">Evidence:</span> {collection.evidence}</p>}
        <label className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          Proposed album name
          <Input value={name} onChange={(event) => onNameChange(event.target.value)} />
        </label>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {collection.members.slice(0, 4).map((item) => {
            const checked = selected.has(item.id);
            return (
              <button key={item.id} type="button" onClick={() => onToggle(item.id)} className={cn('flex items-center gap-3 rounded-2xl border p-2 text-left transition', checked ? 'border-primary/40 bg-primary-soft/50' : 'border-line bg-white')}>
                <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full border', checked ? 'border-primary bg-primary text-white' : 'border-line text-transparent')}><Check className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{item.title}</span>
                  <span className="block truncate text-xs text-muted">{formatDate(item.date)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <Button className="mt-5 w-full" onClick={onCreate} disabled={selected.size === 0}><Plus className="h-4 w-4" /> Review album creation</Button>
      </div>
    </motion.article>
  );
}
