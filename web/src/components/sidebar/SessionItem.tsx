import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/uiStore';
import type { Session } from '@/types/task';

function relative(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60_000) return 'just now';
  if (d < 3_600_000) return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function SessionItem({ session }: { session: Session }) {
  const selectedSessionId = useUiStore((s) => s.selectedSessionId);
  const selectSession = useUiStore((s) => s.selectSession);
  const active = session.id === selectedSessionId;

  const project = session.project ? session.project.split('/').pop()! : null;
  const primary = project ?? session.name ?? `${session.id.slice(0, 8)}…`;
  const secondary = project ? session.name : null;
  const pct = session.taskCount > 0 ? Math.round((session.completed / session.taskCount) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => selectSession(session.id)}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'w-full rounded-md px-3 py-3 text-left transition-colors',
        active ? 'bg-hover' : 'hover:bg-elevated',
      )}
    >
      <span className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{primary}</span>
        {session.inProgress > 0 && (
          <span aria-label="has active tasks" className="size-1.5 shrink-0 rounded-full bg-primary" />
        )}
      </span>
      {secondary && <span className="mt-0.5 block truncate text-[11px] text-text-tertiary">{secondary}</span>}
      {session.gitBranch && (
        <span className="mt-1 inline-block rounded bg-elevated px-1.5 py-0.5 text-[10px] text-text-tertiary">
          {session.gitBranch}
        </span>
      )}

      {session.hasTasks ? (
        <span className="mt-2 flex items-center gap-2">
          <span className="h-0.5 flex-1 overflow-hidden rounded bg-border">
            <span className="block h-full bg-primary" style={{ width: `${pct}%` }} />
          </span>
          <span className="shrink-0 text-[10px] text-text-muted">{session.completed}/{session.taskCount}</span>
        </span>
      ) : (
        <span className="mt-2 block text-[11px] text-text-muted">No tasks</span>
      )}
      <span className="mt-1 block text-[10px] text-text-muted">{relative(session.modifiedAt)}</span>
    </button>
  );
}
