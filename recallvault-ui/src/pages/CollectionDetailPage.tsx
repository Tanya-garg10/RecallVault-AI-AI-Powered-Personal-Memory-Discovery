import { ArrowLeft, Images } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { MemoryCard } from '../components/memory/MemoryCard';
import { MemoryThumb } from '../components/memory/MemoryThumb';
import { EmptyState, ErrorState, LoadingState } from '../components/memory/States';
import { getCollections } from '../lib/bridge';
import { cn, formatDate } from '../lib/utils';
import type { Collection, MemoryItem } from '../lib/types';

const kindFilters = [
  { value: 'all', label: 'All' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Videos' },
  { value: 'document', label: 'Documents' },
] as const;

type KindFilter = (typeof kindFilters)[number]['value'];

export function CollectionDetailPage({ demoMode }: { demoMode: boolean }) {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [members, setMembers] = useState<MemoryItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<KindFilter>('all');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      try {
        const payload = await getCollections({ demoMode });
        if (cancelled) return;
        const found = payload.collections.find((item) => item.id === collectionId);
        if (!found) throw new Error('Collection not found in the active source.');
        setCollection(found);
        setMembers(payload.memories.filter((memory) => found.memberIds.includes(memory.id)));
        setStatus('success');
      } catch (err) {
        if (!cancelled) { setStatus('error'); setError(err instanceof Error ? err.message : 'Collection could not be loaded.'); }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [collectionId, demoMode]);

  const items = useMemo(() => members.filter((item) => kind === 'all' || item.kind === kind), [members, kind]);

  if (status === 'loading') return <LoadingState label="Opening collection…" />;
  if (status === 'error') return <ErrorState message={error ?? 'Unknown error.'} />;
  if (!collection) return <EmptyState title="Collection not found">The requested collection was not returned by the active source.</EmptyState>;

  const isSuggestion = collection.requiresConfirmation;
  const cover = collection.cover ?? { from: '#6d5df6', to: '#c9bdff' };

  return (
    <div className="space-y-8">
      <Link to="/collections" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-primary-dark">
        <ArrowLeft className="h-4 w-4" /> Back to collections
      </Link>

      <section className="overflow-hidden rounded-[32px] border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-4 gap-1 p-1">
          {members.slice(0, 4).map((item) => <MemoryThumb key={item.id} item={item} className="aspect-[16/10] rounded-[20px]" />)}
          {members.length === 0 && (
            <div className="col-span-4 grid aspect-[16/10] place-items-center rounded-[20px] text-sm font-semibold text-white/90" style={{ background: `linear-gradient(135deg, ${cover.from}, ${cover.to})` }}>
              <span className="inline-flex items-center gap-2"><Images className="h-4 w-4" /> No preview members returned</span>
            </div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">{collection.title}</h1>
                <Badge className={isSuggestion ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}>
                  {isSuggestion ? 'Suggestion — not yet created' : 'NAS collection'}
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{collection.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
                <span>{collection.memberIds.length} member references</span>
                <span>{members.length} members resolved</span>
                <span>Updated {formatDate(collection.lastUpdated)}</span>
              </div>
              {collection.evidence && <p className="mt-4 rounded-2xl bg-primary-soft/50 px-4 py-3 text-xs leading-5 text-primary-dark"><span className="font-bold">Evidence:</span> {collection.evidence}</p>}
            </div>
            {isSuggestion && (
              <Link to="/collections"><Badge className="border-primary/20 bg-primary-soft px-4 py-2 text-primary-dark">Review & create from Collections</Badge></Link>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight">Contents</h2>
          <div className="flex flex-wrap gap-2">
            {kindFilters.map((item) => (
              <button key={item.value} type="button" onClick={() => setKind(item.value)} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold transition', kind === item.value ? 'border-primary bg-primary text-white' : 'border-line bg-white text-muted hover:text-ink')}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {items.length === 0 ? (
          <EmptyState title="Nothing in this view">No items match the selected media-type filter.</EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => <MemoryCard key={item.id} item={item} index={index} />)}
          </div>
        )}
      </section>
    </div>
  );
}
