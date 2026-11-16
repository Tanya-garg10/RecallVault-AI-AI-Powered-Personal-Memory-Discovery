import { Search, Sparkles } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export function SearchBar({ value, onChange, onSubmit, placeholder = 'Try “That sunset trip with my friends”…', large = false, autoFocus = false }: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  large?: boolean;
  autoFocus?: boolean;
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(value);
  }
  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center gap-2 rounded-[24px] border border-line bg-white p-2 shadow-[var(--shadow-soft)] transition focus-within:border-primary/45 focus-within:ring-4 focus-within:ring-primary/10', large && 'p-3')}>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Search className="h-5 w-5" />
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn('min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/75', large && 'text-base')}
        aria-label="Search memories"
      />
      <Button type="submit" size={large ? 'lg' : 'md'} disabled={!value.trim()}>
        <Sparkles className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
