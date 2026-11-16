import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { formatDate, kindLabel, confidenceTone } from '../../lib/utils';
import type { MemoryItem } from '../../lib/types';
import { MemoryThumb } from './MemoryThumb';

export function MemoryCard({ item, index = 0 }: { item: MemoryItem; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[22px] border border-line bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-card)]"
    >
      <Link to={`/memories/${item.id}`} className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
        <MemoryThumb item={item} />
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Badge className="border-primary/15 bg-primary-soft text-primary-dark">{kindLabel(item.kind)}</Badge>
            <Badge className={confidenceTone(item.confidence)}>{item.confidence === 'strong' ? 'Strong' : item.confidence === 'possible' ? 'Possible' : 'Related'}</Badge>
          </div>
          <h3 className="truncate font-heading text-[17px] font-bold text-ink">{item.title}</h3>
          <p className="mt-1 truncate text-xs text-muted">{item.fileName}</p>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
            <span>{formatDate(item.date)}</span>
            <span className="truncate">{item.location ?? item.dateField?.replaceAll('_', ' ') ?? 'Metadata limited'}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
