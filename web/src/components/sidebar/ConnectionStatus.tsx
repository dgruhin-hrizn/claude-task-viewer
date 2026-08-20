import { cn } from '@/lib/utils';
import type { ConnectionState } from '@/hooks/useEventStream';

const LABEL: Record<ConnectionState, string> = {
  connecting: 'Connecting',
  connected: 'Connected',
  disconnected: 'Disconnected',
};

export function ConnectionStatus({ status }: { status: ConnectionState }) {
  return (
    <p
      aria-live="polite"
      aria-atomic="true"
      className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-muted"
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'connected' && 'bg-success',
          status === 'connecting' && 'animate-pulse bg-warning',
          status === 'disconnected' && 'bg-destructive',
        )}
      />
      {LABEL[status]}
    </p>
  );
}
