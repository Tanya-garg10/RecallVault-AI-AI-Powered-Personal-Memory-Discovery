import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Confidence, MediaKind, MemoryItem } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null) {
  if (!value) return 'Date unavailable';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatMonthYear(bucket: string) {
  const [year, month] = bucket.split('-');
  if (!year || !month) return bucket;
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1, 1));
}

export function kindLabel(kind?: MediaKind | string | null) {
  if (kind === 'photo') return 'Photo';
  if (kind === 'video') return 'Video';
  if (kind === 'document') return 'Document';
  return 'Memory';
}

export function confidenceLabel(confidence?: Confidence | string | null) {
  if (confidence === 'strong') return 'Strong match';
  if (confidence === 'possible') return 'Possible match';
  if (confidence === 'related') return 'Related memory';
  return 'Unranked';
}

export function confidenceTone(confidence?: Confidence | string | null) {
  if (confidence === 'strong') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (confidence === 'possible') return 'border-violet-200 bg-primary-soft text-primary-dark';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'RV';
}

export function memoryPath(item: MemoryItem) {
  return `/memories/${item.id}`;
}
