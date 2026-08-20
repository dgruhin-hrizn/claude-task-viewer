import { useMemo } from 'react';
import { Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAllTasks, useSessions } from '@/hooks/useSessions';
import { useUiStore } from '@/stores/uiStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { Session, Task } from '@/types/task';

function ago(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60_000) return 'just now';
  if (d < 3_600_000) return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  return new Date(iso).toLocaleDateString();
}

/** The phone home. On desktop this app is a dashboard you leave open, so a
 *  board is the right entry point. On a phone it is a status check you run
 *  while away from your desk, and the question is "what is Claude doing, and
 *  is it done?" -- which the board cannot answer without first picking a
 *  session. This answers it with zero taps, across every session at once. */
export function MobileOverview() {
  const { data: all = [], isLoading } = useAllTasks(true);
  const { data: sessionData } = useSessions('all', true);
  const sessions = sessionData?.sessions ?? [];
  const selectSession = useUiStore((s) => s.selectSession);
  const selectTask = useUiStore((s) => s.selectTask);

  const { running, done } = useMemo(() => ({
    running: all.filter((t) => t.status === 'in_progress'),
    done: all
      .filter((t) => t.status === 'completed')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
  }), [all]);

  const open = (t: Task) => { if (t.sessionId) selectSession(t.sessionId); selectTask(t.id); };
  const openSession = (s: Session) => selectSession(s.id);

  if (isLoading) {
    return <div data-testid="overview" className="p-6 text-sm text-text-muted">Loading…</div>;
  }

  return (
    <div data-testid="overview" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <section aria-labelledby="ov-running" className="px-4 pt-4">
        <h2 id="ov-running" className="text-[11px] uppercase tracking-wider text-text-muted">
          Working on now
        </h2>
        {running.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Nothing running"
            hint="Claude Code is idle across every session."
            className="py-6"
          />
        ) : (
          <ul role="list" className="mt-2 space-y-2">
            {running.map((t) => (
              <li key={`${t.sessionId}:${t.id}`}>
                <button
                  type="button"
                  onClick={() => open(t)}
                  className="flex w-full items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3 text-left"
                >
                  <span className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">{t.activeForm || t.subject}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-text-tertiary">
                      {t.sessionName ?? t.sessionId?.slice(0, 8)}
                    </span>
                  </span>
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-text-muted" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section aria-labelledby="ov-done" className="px-4 pt-6">
          <h2 id="ov-done" className="text-[11px] uppercase tracking-wider text-text-muted">
            Recently finished
          </h2>
          <ul role="list" className="mt-2 space-y-1">
            {done.map((t) => (
              <li key={`${t.sessionId}:${t.id}`}>
                <button
                  type="button"
                  onClick={() => open(t)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left hover:bg-elevated"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-xs text-text-secondary">{t.subject}</span>
                  <span className="shrink-0 text-[10px] text-text-muted">{ago(t.updatedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="ov-sessions" className="px-4 pb-6 pt-6">
        <h2 id="ov-sessions" className="text-[11px] uppercase tracking-wider text-text-muted">
          Sessions
        </h2>
        {sessions.length === 0 ? (
          <EmptyState title="No sessions with tasks" hint="They appear here as Claude Code writes tasks." className="py-6" />
        ) : (
          <ul role="list" className="mt-2 space-y-1">
            {sessions.map((s) => {
              const pct = s.taskCount ? Math.round((s.completed / s.taskCount) * 100) : 0;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => openSession(s)}
                    className="w-full rounded-lg px-2 py-2.5 text-left hover:bg-elevated"
                  >
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {s.project ? s.project.split('/').pop() : s.name ?? s.id.slice(0, 8)}
                      </span>
                      {s.inProgress > 0 && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                      <span className="shrink-0 text-[10px] text-text-muted">{s.completed}/{s.taskCount}</span>
                    </span>
                    <span className="mt-1.5 block h-0.5 overflow-hidden rounded bg-border">
                      <span className={cn('block h-full', pct === 100 ? 'bg-success' : 'bg-primary')} style={{ width: `${pct}%` }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
