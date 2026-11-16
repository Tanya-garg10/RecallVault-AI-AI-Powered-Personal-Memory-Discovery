import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export function EmptyState({ title = 'No memories found', children, action }: { title?: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-dashed border-primary/20 bg-white/70 px-6 py-14 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Searching authorized NAS scope…' }: { label?: string }) {
  return (
    <div className="grid gap-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-muted">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        {label}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-64" />)}
      </div>
    </div>
  );
}

export function DemoDataNote() {
  return (
    <div className="rounded-[24px] border border-primary/15 bg-primary-soft/60 px-5 py-4 text-sm font-medium text-primary-dark">
      Demo data is synthetic and exists only in this browser session. It is never represented as a NAS result.
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50/70 p-6 text-center">
      <AlertTriangle className="mx-auto mb-3 h-7 w-7 text-red-600" />
      <h3 className="font-heading text-lg font-bold text-ink">Search could not be completed</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
