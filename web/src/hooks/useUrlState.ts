import { useEffect, useRef } from 'react';
import { useUiStore } from '@/stores/uiStore';

/** Query params rather than path routes, deliberately: server.js serves public/
 *  with express.static and no catch-all, so a path route would 404 on refresh.
 *  Query params need no server change at all. */
export function useUrlState() {
  const selectedSessionId = useUiStore((s) => s.selectedSessionId);
  const selectedTaskId = useUiStore((s) => s.selectedTaskId);
  const boardView = useUiStore((s) => s.boardView);
  const hydrated = useRef(false);

  // read once on mount; the URL wins over anything persisted
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const session = p.get('session');
    const task = p.get('task');
    const view = p.get('view');
    const st = useUiStore.getState();
    if (session) st.selectSession(session);
    if (task) st.selectTask(task);
    if (view === 'kanban' || view === 'timeline') st.setBoardView(view);
    hydrated.current = true;
  }, []);

  // write back, without adding history entries for every click
  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams(window.location.search);
    selectedSessionId ? p.set('session', selectedSessionId) : p.delete('session');
    selectedTaskId ? p.set('task', selectedTaskId) : p.delete('task');
    boardView === 'timeline' ? p.set('view', 'timeline') : p.delete('view');
    const qs = p.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, '', next);
    }
  }, [selectedSessionId, selectedTaskId, boardView]);
}
