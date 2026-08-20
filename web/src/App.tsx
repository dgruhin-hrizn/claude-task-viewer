import { useSessions } from './hooks/useSessions';
import { useEventStream } from './hooks/useEventStream';
import { useUrlState } from './hooks/useUrlState';
import { useUiStore } from './stores/uiStore';
import { AppShell } from './components/layout/AppShell';

function StoreProbe() {
  const status = useEventStream();
  useUrlState();
  const { sessionFilter, sessionLimit, boardView, selectedSessionId, selectedTaskId,
          setSessionFilter, setBoardView, selectSession, selectTask } = useUiStore();
  const { data } = useSessions(sessionLimit, sessionFilter === 'with-tasks');

  return (
    <div className="space-y-3 p-6 font-mono text-xs">
      <p data-testid="sse-status">sse: <b>{status}</b></p>
      <p data-testid="store-state">
        filter=<b data-testid="s-filter">{sessionFilter}</b>{' '}
        view=<b data-testid="s-view">{boardView}</b>{' '}
        session=<b data-testid="s-session">{selectedSessionId ?? '—'}</b>{' '}
        task=<b data-testid="s-task">{selectedTaskId ?? '—'}</b>{' '}
        count=<b data-testid="s-count">{data?.sessions.length ?? '—'}</b>
      </p>
      <div className="flex flex-wrap gap-2">
        {(['with-tasks','all','active'] as const).map(f => (
          <button key={f} data-testid={`filter-${f}`} onClick={() => setSessionFilter(f)}
            className="min-h-9 rounded border border-border px-3">{f}</button>
        ))}
        {(['kanban','timeline'] as const).map(v => (
          <button key={v} data-testid={`view-${v}`} onClick={() => setBoardView(v)}
            className="min-h-9 rounded border border-border px-3">{v}</button>
        ))}
        <button data-testid="pick-first" onClick={() => {
          const s = data?.sessions[0]; if (s) { selectSession(s.id); selectTask('1'); }
        }} className="min-h-9 rounded border border-border px-3">select first</button>
        <button data-testid="clear-sel" onClick={() => { selectSession(null); selectTask(null); }}
          className="min-h-9 rounded border border-border px-3">clear</button>
      </div>
    </div>
  );
}

export default function App() {
  return <AppShell><StoreProbe /></AppShell>;
}
