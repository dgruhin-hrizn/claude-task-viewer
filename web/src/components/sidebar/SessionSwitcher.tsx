import { Check, ChevronsUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSessions } from '@/hooks/useSessions';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import type { Session } from '@/types/task';

function label(s: Session) {
  return s.project ? s.project.split('/').pop()! : s.name ?? `${s.id.slice(0, 8)}…`;
}

/** Changing session from the board previously meant going back to Overview
 *  (or, before that, a drawer round trip). This makes it two taps in place.
 *  The drawer keeps search and filters; this is only for switching. */
export function SessionSwitcher() {
  const { data } = useSessions('all', true);
  const sessions = data?.sessions ?? [];
  const selectedSessionId = useUiStore((s) => s.selectedSessionId);
  const selectSession = useUiStore((s) => s.selectSession);
  const current = sessions.find((s) => s.id === selectedSessionId);

  if (sessions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={current ? `Session: ${label(current)}. Change session` : 'Choose a session'}
        className="flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 text-left text-text-tertiary hover:text-text-secondary"
      >
        <span className="truncate text-[11px]">{current ? label(current) : 'Choose session'}</span>
        <ChevronsUpDown className="size-3 shrink-0" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[60vh] w-[min(20rem,calc(100vw-24px))] overflow-y-auto">
        {sessions.map((s) => {
          const active = s.id === selectedSessionId;
          const pct = s.taskCount ? Math.round((s.completed / s.taskCount) * 100) : 0;
          return (
            <DropdownMenuItem key={s.id} onSelect={() => selectSession(s.id)} className="items-start gap-2">
              <Check className={cn('mt-0.5 size-3.5 shrink-0', active ? 'opacity-100 text-primary' : 'opacity-0')} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate">{label(s)}</span>
                  {s.inProgress > 0 && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                  <span className="shrink-0 text-[10px] text-text-muted">{s.completed}/{s.taskCount}</span>
                </span>
                <span className="mt-1 block h-0.5 overflow-hidden rounded bg-border">
                  <span className={cn('block h-full', pct === 100 ? 'bg-success' : 'bg-primary')} style={{ width: `${pct}%` }} />
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
