export type MediaKind = 'photo' | 'video' | 'document';
export type Confidence = 'strong' | 'possible' | 'related';
export type DataMode = 'live' | 'demo';

export interface CoverStyle {
  from: string;
  to: string;
  accent?: string;
}

export interface MemoryItem {
  id: string;
  kind: MediaKind;
  title: string;
  fileName: string;
  path: string;
  date: string | null;
  dateField: 'capture_time' | 'upload_time' | 'modified_time' | 'unknown' | null;
  uploadDate?: string | null;
  location: string | null;
  camera?: string | null;
  duration?: string | null;
  codec?: string | null;
  resolution?: string | null;
  pageCount?: number | null;
  documentType?: string | null;
  size?: string | null;
  tags: string[];
  collectionIds: string[];
  matchReasons: string[];
  confidence: Confidence;
  description: string;
  aiDescription?: string | null;
  previewAvailable?: boolean;
  previewUrl?: string | null;
  evidence: string[];
  eventLabel?: string | null;
  cover: CoverStyle;
}

export interface SearchFilters {
  mediaType?: 'all' | MediaKind;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  event?: string;
  sort?: 'relevance' | 'newest' | 'oldest';
}

export interface SearchPayload {
  results: MemoryItem[];
  related: MemoryItem[];
  mode: DataMode;
  note?: string;
  resultRef?: string | null;
  total?: number;
}

export interface TimelineBucket {
  bucket: string;
  label: string;
  count: number;
  eventLabel?: string | null;
  items: MemoryItem[];
  cover?: MemoryItem | null;
}

export interface TimelinePayload {
  year: string | null;
  years: string[];
  buckets: TimelineBucket[];
  undated: MemoryItem[];
  mode: DataMode;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  suggestedAlbumName: string;
  memberIds: string[];
  lastUpdated: string;
  evidence: string;
  requiresConfirmation: boolean;
  canCreateInDemo: boolean;
  cover?: CoverStyle;
  sourceRef?: string | null;
}

export interface CollectionsPayload {
  collections: Collection[];
  memories: MemoryItem[];
  mode: DataMode;
}

export interface MediaDetailsPayload {
  item: MemoryItem;
  related: MemoryItem[];
  mode: DataMode;
}

export interface ConnectionStatus {
  mode: DataMode;
  bridgeAvailable: boolean;
  nasConnected: boolean;
  library: {
    name: string;
    type?: string;
    status?: string;
    note?: string;
  };
  capabilities: Capability[];
  skillStatus: string;
  privacy: string;
}

export interface Capability {
  name: string;
  agent: string;
  status: 'documented' | 'approval-required' | 'unsupported' | string;
  detail: string;
}

export interface AlbumCreatePayload {
  collectionId?: string;
  albumName: string;
  memberIds?: string[];
  selectedIds?: string[];
  sourceRef?: string | null;
  requiresConfirmation?: boolean;
}

export interface AlbumResult {
  status: string;
  verified: boolean;
  albumId?: string | null;
  message?: string;
  mode?: DataMode;
}

export interface RecallVaultHostBridge {
  status?: {
    connected?: boolean;
    library?: ConnectionStatus['library'];
    capabilities?: Capability[];
    skillStatus?: string;
  };
  connected?: boolean;
  library?: ConnectionStatus['library'];
  searchMemories?: (input: { query: string; filters?: SearchFilters }) => Promise<unknown> | unknown;
  getRecentMemories?: () => Promise<MemoryItem[] | { results?: MemoryItem[]; items?: MemoryItem[] }> | MemoryItem[] | { results?: MemoryItem[]; items?: MemoryItem[] };
  getTimeline?: (year?: string | null) => Promise<unknown> | unknown;
  getCollections?: () => Promise<unknown> | unknown;
  getCollectionDetail?: (id: string) => Promise<unknown> | unknown;
  getMediaDetails?: (id: string) => Promise<unknown> | unknown;
  getRelatedMemories?: (id: string) => Promise<MemoryItem[] | { results?: MemoryItem[]; items?: MemoryItem[] }> | MemoryItem[] | { results?: MemoryItem[]; items?: MemoryItem[] };
  createAlbum?: (payload: AlbumCreatePayload) => Promise<AlbumResult> | AlbumResult;
}
