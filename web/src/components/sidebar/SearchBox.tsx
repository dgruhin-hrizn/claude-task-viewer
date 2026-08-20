import { Search, X } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

/** A plain input, not shadcn's Command. Command is a modal palette that filters
 *  its own children; this filters the persistent sidebar list in place, which
 *  is a different interaction. A palette would be an addition, not a swap. */
export function SearchBox() {
  const { searchQuery, setSearchQuery } = useUiStore();
  return (
    <div className="relative mt-2">
      <label htmlFor="session-search" className="sr-only">Search tasks, sessions and projects</label>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" />
      <input
        id="session-search"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks, sessions, projects…"
        className="min-h-11 w-full rounded-md border border-border bg-elevated pl-9 pr-9 text-[16px] text-foreground placeholder:text-text-muted md:min-h-9 md:text-xs"
      />
      {searchQuery && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded text-text-tertiary hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
