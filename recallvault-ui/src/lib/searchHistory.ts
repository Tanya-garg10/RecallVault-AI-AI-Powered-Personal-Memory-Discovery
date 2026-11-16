const STORAGE_KEY = 'recallvault-search-history';
const MAX_ITEMS = 6;

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string) {
  const trimmed = query.trim();
  if (!trimmed || typeof window === 'undefined') return;
  const next = [trimmed, ...getSearchHistory().filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
