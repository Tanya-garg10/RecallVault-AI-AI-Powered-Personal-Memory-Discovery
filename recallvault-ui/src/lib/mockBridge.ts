import { demoCapabilities, demoCollections, demoMemories, demoScope } from './demoData';
import type { AlbumCreatePayload, AlbumResult, MemoryItem, TimelineBucket } from './types';

/**
 * Simulated UGREEN host bridge for development and demos.
 *
 * Implements the same `window.ugreenRecallVault` contract the UI expects from
 * a real Uliya/UGOS host — but every response is synthetic and explicitly
 * labelled. It exists to exercise the live code path; it is NOT a NAS.
 *
 * Enable with: localStorage.setItem('recallvault-mock-nas', '1') then reload,
 * or via Settings → "Simulate NAS bridge".
 */

function score(item: MemoryItem, terms: string[]) {
  const haystack = [item.title, item.fileName, item.path, item.location, item.description, item.eventLabel, ...item.tags, ...item.matchReasons]
    .filter(Boolean).join(' ').toLowerCase();
  return terms.filter((term) => haystack.includes(term)).length;
}

function search(query: string) {
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const results = demoMemories
    .map((item) => ({ item, s: score(item, terms) }))
    .filter((entry) => !terms.length || entry.s > 0)
    .sort((a, b) => b.s - a.s || (b.item.date ?? '').localeCompare(a.item.date ?? ''))
    .map((entry, index) => ({ ...entry.item, confidence: index === 0 ? 'strong' as const : entry.item.confidence }));
  return {
    results,
    related: results.slice(1, 4).map((item) => ({ ...item, confidence: 'related' as const })),
    total: results.length,
    mode: 'live',
    note: 'Simulated bridge response — synthetic data shaped like a host payload. Not retrieved from a NAS.',
    resultRef: null,
  };
}

function timeline(year: string | null) {
  const dated = demoMemories.filter((item) => item.date);
  const years = [...new Set(dated.map((item) => item.date!.slice(0, 4)))].sort().reverse();
  const selected = year ?? years[0] ?? null;
  const buckets: TimelineBucket[] = [...new Set(dated.filter((i) => i.date!.startsWith(selected ?? '')).map((i) => i.date!.slice(0, 7)))]
    .sort().reverse()
    .map((bucket) => {
      const items = dated.filter((item) => item.date!.startsWith(bucket));
      return {
        bucket,
        label: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${bucket}-01T00:00:00`)),
        count: items.length,
        eventLabel: items.find((item) => item.eventLabel)?.eventLabel ?? null,
        items,
        cover: items[0] ?? null,
      };
    });
  return { year: selected, years, buckets, undated: demoMemories.filter((item) => !item.date), mode: 'live' };
}

export function installMockBridge() {
  const host = window as Window & { ugreenRecallVault?: Record<string, unknown> };
  host.ugreenRecallVault = {
    status: {
      connected: false,
      library: { ...demoScope, status: 'simulated' },
      capabilities: demoCapabilities,
      skillStatus: 'mock-bridge — synthetic host, not a real device',
    },
    async searchMemories(input: { query: string; filters?: unknown }) {
      return search(String((input as { query?: string })?.query ?? ''));
    },
    async getRecentMemories() {
      return demoMemories.slice(0, 8);
    },
    async getTimeline(year?: string | null) {
      return timeline(year ?? null);
    },
    async getCollections() {
      return { collections: demoCollections, memories: demoMemories, mode: 'live' };
    },
    async getMediaDetails(id: string) {
      const item = demoMemories.find((memory) => memory.id === id);
      if (!item) throw new Error('Memory not found.');
      return { item, related: demoMemories.filter((m) => m.id !== id && m.collectionIds.some((c) => item.collectionIds.includes(c))).slice(0, 4), mode: 'live' };
    },
    async getRelatedMemories(id: string) {
      const payload = await (host.ugreenRecallVault as { getMediaDetails: (id: string) => Promise<{ related: MemoryItem[] }> }).getMediaDetails(id);
      return payload.related;
    },
    async createAlbum(payload: AlbumCreatePayload): Promise<AlbumResult> {
      return {
        status: 'simulated',
        verified: false,
        albumId: null,
        message: `Mock bridge acknowledged "${payload.albumName}" for ${payload.memberIds?.length ?? 0} members. No NAS write was performed.`,
        mode: 'demo',
      };
    },
  };
}
