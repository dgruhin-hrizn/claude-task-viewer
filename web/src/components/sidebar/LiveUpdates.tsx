import { useAllTasks } from '@/hooks/useSessions';
import { useUiStore } from '@/stores/uiStore';

/** aria-live is on this feed and the connection pill only. It is deliberately
 *  NOT on the kanban columns: a TodoWrite touching a dozen tasks would produce
 *  a torrent of announcements and make the app unusable with a screen reader. */
export function LiveUpdates() {
  const { data: all } = useAllTasks(true);
  const selectSession = useUiStore((s) => s.selectSession);
  const selectTask = useUiStore((s) => s.selectTask);

  const active = (all ?? []).filter((t) => t.status === 'in_progress');
  const CAP = 5;
  const overflow = Math.max(0, active.length - CAP);

  return (
    <div aria-live="polite" aria-atomic="false" className="mt-2 space-y-1">
      {active.length === 0 ? (
        <p className="py-2 text-center text-[11px] text-text-muted">No active tasks</p>
      ) : (
        active.slice(0, CAP).map((t) => (
          <button
            key={`${t.sessionId}:${t.id}`}
            type="button"
            onClick={() => { if (t.sessionId) selectSession(t.sessionId); selectTask(t.id); }}
            className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-elevated"
          >
            <span className="mt-1 size-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
            <span className="min-w-0">
              <span className="block truncate text-xs text-foreground">{t.activeForm || t.subject}</span>
              <span className="block truncate text-[10px] text-text-muted">
                {t.sessionName ?? t.sessionId?.slice(0, 8)}
              </span>
            </span>
          </button>
        ))
      )}
      {overflow > 0 && (
        // Same reasoning as the sidebar's hidden-session row: truncating without
        // saying so reads as "that is all there is".
        <p className="px-2 pt-1 text-[10px] text-text-muted">+{overflow} more active</p>
      )}
    </div>
  );
}
