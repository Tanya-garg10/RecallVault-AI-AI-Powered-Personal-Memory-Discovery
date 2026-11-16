import { FileText, Image as ImageIcon, Play } from 'lucide-react';
import { useState } from 'react';
import { cn, initials, kindLabel } from '../../lib/utils';
import type { MemoryItem } from '../../lib/types';

export function MemoryThumb({ item, className, large = false }: { item: MemoryItem; className?: string; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = item.kind === 'video' ? Play : item.kind === 'document' ? FileText : ImageIcon;
  const showImage = Boolean(item.previewUrl) && !imageFailed;
  return (
    <div
      className={cn('relative overflow-hidden bg-primary-soft', large ? 'min-h-72' : 'aspect-[4/3]', className)}
      style={{ background: `linear-gradient(135deg, ${item.cover.from}, ${item.cover.to})` }}
      aria-label={`${kindLabel(item.kind)} preview for ${item.title}`}
    >
      {showImage ? (
        <img
          src={item.previewUrl ?? undefined}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3 p-5 text-white/90">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.16em]">{initials(item.title)}</span>
        </div>
      )}
      {!item.previewAvailable && (
        <span className="absolute bottom-3 right-3 rounded-full bg-ink/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          Preview unavailable
        </span>
      )}
    </div>
  );
}
