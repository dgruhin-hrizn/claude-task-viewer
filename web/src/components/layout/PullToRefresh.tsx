import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/lib/utils';

export function PullToRefresh({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const { ref, pull, refreshing, armed } = usePullToRefresh(enabled);
  const shown = refreshing ? 44 : pull;

  return (
    <div ref={ref} className="relative flex min-h-0 flex-1 flex-col">
      {enabled && shown > 0 && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center"
          style={{ height: shown }}
        >
          <span className="flex items-center gap-2 self-center text-[11px] text-text-tertiary">
            <RefreshCw
              className={cn('size-3.5', refreshing && 'animate-spin motion-reduce:animate-none')}
              style={refreshing ? undefined : { transform: `rotate(${pull * 3}deg)` }}
              aria-hidden="true"
            />
            {refreshing ? 'Refreshing…' : armed ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ transform: shown ? `translateY(${shown}px)` : undefined,
                 transition: pull === 0 || refreshing ? 'transform 200ms' : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
