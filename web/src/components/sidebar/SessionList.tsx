import { useMemo } from 'react';
import type { Session } from '@/types/task';
import { useSessions } from '@/hooks/useSessions';
import { fuzzyMatch, isSessionStale } from '@/lib/tasks';
import { useUiStore } from '@/stores/uiStore';
import { FilterBar } from './FilterBar';
import { SearchBox } from './SearchBox';
import { SessionItem } from './SessionItem';

export function SessionList() {
  const { sessionFilter, sessionLimit, filterProject, searchQuery, setSessionFilter } = useUiStore();
  const { data, isLoading } = useSessions(sessionLimit, sessionFilter === 'with-tasks');
  const sessions = data?.sessions ?? [];

  const visible = useMemo(() => {
    let out = sessions;
    if (filterProject) out = out.filter((s) => s.project === filterProject);
    if (sessionFilter === 'active') out = out.filter((s) => s.pending > 0 || s.inProgress > 0);
    if (searchQuery) {
      out = out.filter((s) =>
        fuzzyMatch(`${s.name ?? ''} ${s.project ?? ''} ${s.gitBranch ?? ''}`, searchQuery));
    }
    return out;
  }, [sessions, filterProject, sessionFilter, searchQuery]);

  // Both filters can hide sessions with no indication anything is missing. The
  // with-tasks count comes from the server; active is filtered client-side.
  const hidden = sessionFilter === 'with-tasks'
    ? (data?.filteredOut ?? 0)
    : sessionFilter === 'active' ? sessions.length - visible.length : 0;

  const { current, archived } = useMemo(() => {
    if (sessionFilter === 'active' || searchQuery) return { current: visible, archived: [] };
    const c: Session[] = [], a: Session[] = [];
    for (const s of visible) (isSessionStale(s.modifiedAt, s.inProgress) ? a : c).push(s);
    return { current: c, archived: a };
  }, [visible, sessionFilter, searchQuery]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SearchBox />
      <FilterBar sessions={sessions} />

      <div className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setSessionFilter('all')}
            className="mb-2 w-full rounded-md border border-dashed border-border px-3 py-2 text-left text-[11px] text-text-tertiary hover:text-text-secondary"
          >
            {hidden} session{hidden === 1 ? '' : 's'} hidden
            {sessionFilter === 'with-tasks' ? ' (without tasks)' : ' (not active)'} — show all
          </button>
        )}

        {isLoading && <p className="px-3 py-4 text-xs text-text-muted">Loading…</p>}
        {!isLoading && visible.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-text-muted">No sessions match</p>
        )}

        {current.map((s) => <SessionItem key={s.id} session={s} />)}
        {archived.length > 0 && <ArchivedGroup sessions={archived} />}
      </div>
    </div>
  );
}

function ArchivedGroup({ sessions }: { sessions: Session[] }) {
  const { archivedExpanded, setArchivedExpanded } = useUiStore();
  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        type="button"
        aria-expanded={archivedExpanded}
        aria-controls="archived-sessions"
        onClick={() => setArchivedExpanded(!archivedExpanded)}
        className="w-full px-3 py-2 text-left text-[11px] text-text-muted hover:text-text-secondary"
      >
        Archived ({sessions.length})
      </button>
      <div id="archived-sessions" hidden={!archivedExpanded} className="space-y-1">
        {sessions.map((s) => <SessionItem key={s.id} session={s} />)}
      </div>
    </div>
  );
}
