import {
  demoCapabilities,
  demoCollections,
  demoMemories,
  demoScope,
  getDemoMemoriesByIds,
} from './demoData';
import type {
  AlbumCreatePayload,
  AlbumResult,
  Collection,
  CollectionsPayload,
  ConnectionStatus,
  Confidence,
  CoverStyle,
  DataMode,
  MediaDetailsPayload,
  MediaKind,
  MemoryItem,
  RecallVaultHostBridge,
  SearchFilters,
  SearchPayload,
  TimelineBucket,
  TimelinePayload,
} from './types';

type UnknownRecord = Record<string, unknown>;

const defaultCovers: Record<MediaKind, CoverStyle> = {
  photo: { from: '#6d5df6', to: '#c9bdff', accent: '#a8c7f7' },
  video: { from: '#4f46e5', to: '#c7d2fe', accent: '#a5b4fc' },
  document: { from: '#7c3aed', to: '#ddd6fe', accent: '#c4b5fd' },
};

function hostBridge(): RecallVaultHostBridge | null {
  if (typeof window === 'undefined') return null;
  const candidate = (window as Window & { ugreenRecallVault?: RecallVaultHostBridge }).ugreenRecallVault;
  return candidate && typeof candidate === 'object' ? candidate : null;
}

function hasMethod<K extends keyof RecallVaultHostBridge>(bridge: RecallVaultHostBridge | null, name: K) {
  return Boolean(bridge && typeof bridge[name] === 'function');
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? (value as UnknownRecord) : {};
}

function asArray(value: unknown): UnknownRecord[] {
  if (Array.isArray(value)) return value.map((item) => asRecord(item));
  return [];
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function bool(value: unknown): boolean {
  return value === true;
}

function toDateString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
    return trimmed;
  }
  const timestamp = num(value);
  if (timestamp === null) return null;
  const date = new Date(timestamp > 10_000_000_000 ? timestamp : timestamp * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeKind(value: unknown): MediaKind {
  return value === 'video' || value === 'document' ? value : 'photo';
}

function normalizeConfidence(value: unknown): Confidence {
  return value === 'strong' || value === 'related' ? value : 'possible';
}

function normalizeCover(value: unknown, kind: MediaKind): CoverStyle {
  const record = asRecord(value);
  const from = str(record.from) ?? str(record.color) ?? defaultCovers[kind].from;
  const to = str(record.to) ?? defaultCovers[kind].to;
  const accent = str(record.accent) ?? undefined;
  return { from, to, accent };
}

function normalizeMemoryItem(input: unknown): MemoryItem {
  const record = asRecord(input);
  const kind = normalizeKind(record.kind ?? record.type);
  const id = str(record.id) ?? str(record.picture_id) ?? str(record.pictureId) ?? str(record.path) ?? str(record.file_path) ?? str(record.fileName) ?? str(record.file_name) ?? 'unknown-memory';
  const fileName = str(record.fileName) ?? str(record.file_name) ?? str(record.name) ?? 'Unknown file';
  const title = str(record.title) ?? str(record.name) ?? fileName;
  const date = toDateString(record.date ?? record.capture_date ?? record.captureDate ?? record.create_time_utc ?? record.createTime ?? record.mtime);
  const matchReasons = stringArray(record.matchReasons ?? record.match_reasons ?? record.evidence ?? record.reasons);
  return {
    id,
    kind,
    title,
    fileName,
    path: str(record.path) ?? str(record.file_path) ?? '',
    date,
    dateField: (['capture_time', 'upload_time', 'modified_time', 'unknown'] as const).includes(record.dateField as never)
      ? (record.dateField as MemoryItem['dateField'])
      : 'unknown',
    uploadDate: toDateString(record.uploadDate ?? record.upload_date ?? record.upload_time),
    location: str(record.location) ?? str(record.address),
    camera: str(record.camera) ?? str(record.camera_model) ?? str(record.cameraModel),
    duration: str(record.duration),
    codec: str(record.codec) ?? str(record.video_codec),
    resolution: str(record.resolution) ?? str(record.video_resolution),
    pageCount: num(record.pageCount ?? record.page_count),
    documentType: str(record.documentType ?? record.document_type ?? record.type),
    size: str(record.size),
    tags: stringArray(record.tags ?? record.labels),
    collectionIds: stringArray(record.collectionIds ?? record.collection_ids),
    matchReasons,
    confidence: normalizeConfidence(record.confidence ?? record.match_confidence),
    description: str(record.description) ?? str(record.aiDescription) ?? str(record.ai_description) ?? '',
    aiDescription: str(record.aiDescription ?? record.ai_description),
    previewAvailable: bool(record.previewAvailable ?? record.preview_available ?? record.has_preview),
    previewUrl: str(record.previewUrl ?? record.preview_url ?? record.thumbnailUrl ?? record.thumbnail_url),
    evidence: stringArray(record.evidence),
    eventLabel: str(record.eventLabel ?? record.event_label),
    cover: normalizeCover(record.cover, kind),
  };
}

function normalizeCollection(input: unknown): Collection {
  const record = asRecord(input);
  const id = str(record.id) ?? str(record.album_uuid) ?? str(record.albumUuid) ?? str(record.album_name) ?? str(record.albumName) ?? 'collection';
  const title = str(record.title) ?? str(record.album_name) ?? str(record.albumName) ?? str(record.name) ?? id;
  const memberIds = stringArray(record.memberIds ?? record.member_ids ?? record.photo_ids ?? record.items);
  return {
    id,
    title,
    description: str(record.description) ?? '',
    suggestedAlbumName: str(record.suggestedAlbumName ?? record.suggested_album_name) ?? title,
    memberIds,
    lastUpdated: toDateString(record.lastUpdated ?? record.last_updated ?? record.updated_at) ?? '',
    evidence: str(record.evidence) ?? '',
    requiresConfirmation: record.requiresConfirmation !== false,
    canCreateInDemo: bool(record.canCreateInDemo ?? record.can_create_in_demo),
    cover: normalizeCover(record.cover, 'photo'),
    sourceRef: str(record.sourceRef ?? record.source_ref),
  };
}

function normalizeTimelinePayload(payload: unknown, requestedYear: string | null): TimelinePayload {
  const record = asRecord(payload);
  const years = stringArray(record.years).length ? stringArray(record.years) : [];
  const rawBuckets = Array.isArray(record.buckets) ? record.buckets : Array.isArray(record.items) ? record.items : [];
  const buckets: TimelineBucket[] = rawBuckets.map((bucketInput) => {
    const bucket = asRecord(bucketInput);
    const items = asArray(bucket.items).map(normalizeMemoryItem);
    return {
      bucket: str(bucket.bucket) ?? str(bucket.key) ?? '',
      label: str(bucket.label) ?? str(bucket.bucket) ?? str(bucket.key) ?? 'Untitled bucket',
      count: num(bucket.count) ?? items.length,
      eventLabel: str(bucket.eventLabel ?? bucket.event_label),
      items,
      cover: bucket.cover ? normalizeMemoryItem(bucket.cover) : items[0] ?? null,
    };
  }).filter((bucket) => bucket.bucket || bucket.label);
  return {
    year: str(record.year) ?? requestedYear,
    years,
    buckets,
    undated: asArray(record.undated ?? record.undated_items).map(normalizeMemoryItem),
    mode: 'live',
  };
}

function normalizeSearchPayload(payload: unknown): SearchPayload {
  const record = asRecord(payload);
  const results = asArray(record.results ?? record.items ?? payload).map(normalizeMemoryItem);
  const related = asArray(record.related ?? record.related_memories).map(normalizeMemoryItem);
  return {
    results,
    related,
    mode: 'live',
    note: str(record.note) ?? 'Results returned by the UGREEN host bridge.',
    resultRef: str(record.resultRef ?? record.result_ref),
    total: num(record.total) ?? results.length,
  };
}

function normalizeCollectionsPayload(payload: unknown): CollectionsPayload {
  const record = asRecord(payload);
  const collections = asArray(record.collections ?? record.items).map(normalizeCollection);
  const memories = asArray(record.memories ?? record.items).map(normalizeMemoryItem);
  return { collections, memories, mode: 'live' };
}

function requireLiveMethod<K extends keyof RecallVaultHostBridge>(bridge: RecallVaultHostBridge | null, name: K, demoMode: boolean) {
  if (demoMode) return false;
  if (!bridge) throw new Error('No UGREEN RecallVault bridge is available. Enable demo mode to preview synthetic data.');
  if (!hasMethod(bridge, name)) throw new Error(`The UGREEN host bridge does not implement ${name}.`);
  return true;
}

export async function getConnectionStatus(): Promise<ConnectionStatus> {
  const bridge = hostBridge();
  const required = ['searchMemories', 'getTimeline', 'getCollections', 'getMediaDetails', 'createAlbum'] as const;
  const available = Boolean(bridge && required.every((name) => hasMethod(bridge, name)));
  return {
    mode: available ? 'live' : 'demo',
    bridgeAvailable: available,
    nasConnected: available ? Boolean(bridge?.status?.connected ?? bridge?.connected) : false,
    library: available ? bridge?.status?.library ?? bridge?.library ?? { name: 'Reported by UGREEN host bridge', status: 'connected' } : demoScope,
    capabilities: available ? bridge?.status?.capabilities ?? demoCapabilities : demoCapabilities,
    skillStatus: available ? bridge?.status?.skillStatus ?? 'bridge-detected' : 'demo-mode',
    privacy: 'Read-only by default. Album and file writes require explicit confirmation and platform approval.',
  };
}

export async function searchMemories(query: string, filters: SearchFilters = {}, { demoMode = true }: { demoMode?: boolean } = {}): Promise<SearchPayload> {
  const bridge = hostBridge();
  if (requireLiveMethod(bridge, 'searchMemories', demoMode)) {
    return normalizeSearchPayload(await bridge!.searchMemories!({ query, filters }));
  }
  return demoSearch(query, filters);
}

export async function getRecentMemories({ demoMode = true }: { demoMode?: boolean } = {}): Promise<MemoryItem[]> {
  const bridge = hostBridge();
  if (requireLiveMethod(bridge, 'getRecentMemories', demoMode)) {
    const payload = await bridge!.getRecentMemories!();
    const record = asRecord(payload);
    return asArray(Array.isArray(payload) ? payload : record.results ?? record.items).map(normalizeMemoryItem);
  }
  return demoMemories.slice(0, 8);
}

export async function getTimeline(year: string | null = null, { demoMode = true }: { demoMode?: boolean } = {}): Promise<TimelinePayload> {
  const bridge = hostBridge();
  if (requireLiveMethod(bridge, 'getTimeline', demoMode)) {
    return normalizeTimelinePayload(await bridge!.getTimeline!(year), year);
  }
  return demoTimeline(year);
}

export async function getCollections({ demoMode = true }: { demoMode?: boolean } = {}): Promise<CollectionsPayload> {
  const bridge = hostBridge();
  if (requireLiveMethod(bridge, 'getCollections', demoMode)) {
    return normalizeCollectionsPayload(await bridge!.getCollections!());
  }
  return { collections: demoCollections, memories: demoMemories, mode: 'demo' };
}

export async function getCollectionDetail(id: string, { demoMode = true }: { demoMode?: boolean } = {}): Promise<{ collection: Collection; members: MemoryItem[]; mode: DataMode }> {
  const bridge = hostBridge();
  if (!demoMode && bridge && hasMethod(bridge, 'getCollectionDetail')) {
    const payload = normalizeCollectionsPayload(await bridge.getCollectionDetail!(id));
    const collection = payload.collections[0];
    if (!collection) throw new Error('Collection not found.');
    const members = getDemoMemoriesByIds(collection.memberIds);
    return { collection, members: members.length ? members : payload.memories, mode: 'live' };
  }
  if (requireLiveMethod(bridge, 'getCollections', demoMode)) {
    const payload = normalizeCollectionsPayload(await bridge!.getCollections!());
    const collection = payload.collections.find((item) => item.id === id);
    if (!collection) throw new Error('Collection not found.');
    return { collection, members: getDemoMemoriesByIds(collection.memberIds), mode: 'live' };
  }
  const collection = demoCollections.find((item) => item.id === id);
  if (!collection) throw new Error('Demo collection not found.');
  return { collection, members: getDemoMemoriesByIds(collection.memberIds), mode: 'demo' };
}

export async function getMediaDetails(id: string, { demoMode = true }: { demoMode?: boolean } = {}): Promise<MediaDetailsPayload> {
  const bridge = hostBridge();
  if (!demoMode && bridge && hasMethod(bridge, 'getMediaDetails')) {
    const record = asRecord(await bridge.getMediaDetails!(id));
    const item = normalizeMemoryItem(record.item ?? record.memory ?? record);
    const related = asArray(record.related).map(normalizeMemoryItem);
    return { item, related: related.length ? related : relatedMemoriesFor(item, demoMemories), mode: 'live' };
  }
  if (requireLiveMethod(bridge, 'getMediaDetails', demoMode)) {
    const record = asRecord(await bridge!.getMediaDetails!(id));
    const item = normalizeMemoryItem(record.item ?? record.memory ?? record);
    return { item, related: relatedMemoriesFor(item, demoMemories), mode: 'live' };
  }
  const item = demoMemories.find((memory) => memory.id === id);
  if (!item) throw new Error('Demo memory not found.');
  return { item, related: relatedMemoriesFor(item, demoMemories), mode: 'demo' };
}

export async function getRelatedMemories(id: string, { demoMode = true }: { demoMode?: boolean } = {}): Promise<MemoryItem[]> {
  const bridge = hostBridge();
  if (!demoMode && bridge && hasMethod(bridge, 'getRelatedMemories')) {
    const payload = await bridge.getRelatedMemories!(id);
    return asArray(Array.isArray(payload) ? payload : asRecord(payload).results ?? asRecord(payload).items).map(normalizeMemoryItem);
  }
  const details = await getMediaDetails(id, { demoMode });
  return details.related;
}

export async function createAlbum(payload: AlbumCreatePayload, { demoMode = true }: { demoMode?: boolean } = {}): Promise<AlbumResult> {
  const bridge = hostBridge();
  if (requireLiveMethod(bridge, 'createAlbum', demoMode)) {
    return bridge!.createAlbum!(payload);
  }
  return {
    status: 'demo-only',
    verified: false,
    albumId: null,
    message: 'Demo mode cannot create or verify a NAS album. No write was performed.',
    mode: 'demo',
  };
}

function relatedMemoriesFor(item: MemoryItem, pool: MemoryItem[]) {
  return pool
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.collectionIds.some((id) => item.collectionIds.includes(id))) score += 4;
      if (candidate.tags.some((tag) => item.tags.includes(tag))) score += 2;
      if (candidate.eventLabel && candidate.eventLabel === item.eventLabel) score += 3;
      if (item.date && candidate.date) {
        const diff = Math.abs(new Date(candidate.date).getTime() - new Date(item.date).getTime()) / 86_400_000;
        if (diff <= 3) score += 2;
        else if (diff <= 30) score += 1;
      }
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((entry) => ({ ...entry.candidate, confidence: 'related' as Confidence }));
}

function demoSearch(query: string, filters: SearchFilters): SearchPayload {
  const normalized = query.trim().toLowerCase();
  const terms = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  const searchable = (item: MemoryItem) =>
    [item.title, item.fileName, item.path, item.location, item.camera, item.description, item.aiDescription, item.eventLabel, ...item.tags, ...item.matchReasons]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

  let results = demoMemories.filter((item) => {
    const haystack = searchable(item);
    const queryMatch = !normalized || terms.some((term) => haystack.includes(term));
    const mediaMatch = !filters.mediaType || filters.mediaType === 'all' || item.kind === filters.mediaType;
    const dateMatch = (!filters.dateFrom || (item.date ?? '') >= filters.dateFrom) && (!filters.dateTo || (item.date ?? '') <= filters.dateTo);
    const locationMatch = !filters.location || (item.location ?? '').toLowerCase().includes(filters.location.toLowerCase());
    const eventMatch = !filters.event || haystack.includes(filters.event.toLowerCase());
    return queryMatch && mediaMatch && dateMatch && locationMatch && eventMatch;
  });

  if (/(document|pdf|docx|notes|checklist)/.test(normalized)) results = results.filter((item) => item.kind === 'document');
  if (/(photo|picture|image)/.test(normalized)) results = results.filter((item) => item.kind === 'photo');
  if (/(video|clip|movie)/.test(normalized)) results = results.filter((item) => item.kind === 'video');
  if (/(december|2025)/.test(normalized)) {
    results = results.filter((item) => item.date?.startsWith('2025-12') || item.date?.startsWith('2025'));
    if (normalized.includes('december')) results = results.filter((item) => item.date?.startsWith('2025-12'));
  }
  if (/(diwali|festival|celebration)/.test(normalized)) {
    results = results.filter((item) => item.tags.some((tag) => ['festival', 'diwali', 'celebration'].includes(tag)) || /diwali|festival|celebration/i.test(item.fileName));
  }
  if (/(vacation|travel|trip)/.test(normalized)) {
    results = results.filter((item) => item.tags.some((tag) => ['travel', 'vacation'].includes(tag)) || /vacation|travel/i.test(item.fileName));
  }
  if (/(college|farewell|event|graduation)/.test(normalized)) {
    results = results.filter((item) => item.kind === 'document' || item.tags.some((tag) => ['college', 'event', 'farewell', 'graduation'].includes(tag)));
  }

  const sorted = [...results].sort((a, b) => {
    if (filters.sort === 'newest') return (b.date ?? '').localeCompare(a.date ?? '');
    if (filters.sort === 'oldest') return (a.date ?? '').localeCompare(b.date ?? '');
    if (a.confidence === b.confidence) return (b.date ?? '').localeCompare(a.date ?? '');
    return a.confidence === 'strong' ? -1 : 1;
  });

  const top = sorted[0];
  const related = top ? relatedMemoriesFor(top, demoMemories).filter((item) => !sorted.some((result) => result.id === item.id)) : [];
  return {
    results: sorted,
    related,
    mode: 'demo',
    note: normalized ? 'Synthetic demo results. They demonstrate ranking and UI states only and are not NAS data.' : 'Enter a memory query to search the synthetic demo library.',
    resultRef: null,
    total: sorted.length,
  };
}

function demoTimeline(year: string | null): TimelinePayload {
  const years = [...new Set(demoMemories.map((item) => item.date?.slice(0, 4)).filter((value): value is string => Boolean(value)))].sort().reverse();
  const selectedYear = year ?? years[0] ?? null;
  const yearItems = demoMemories.filter((item) => item.date?.startsWith(selectedYear ?? ''));
  const buckets: TimelineBucket[] = [...new Set(yearItems.map((item) => item.date?.slice(0, 7)).filter((value): value is string => Boolean(value)))]
    .sort()
    .reverse()
    .map((bucket) => {
      const items = yearItems.filter((item) => item.date?.startsWith(bucket));
      const eventLabel = items.find((item) => item.eventLabel)?.eventLabel ?? null;
      return {
        bucket,
        label: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${bucket}-01T00:00:00`)),
        count: items.length,
        eventLabel,
        items,
        cover: items[0] ?? null,
      };
    });
  return { year: selectedYear, years, buckets, undated: demoMemories.filter((item) => !item.date), mode: 'demo' };
}
