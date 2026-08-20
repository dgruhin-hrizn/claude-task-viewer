import { useSessions } from './hooks/useSessions';
import { useEventStream } from './hooks/useEventStream';
import { AppShell } from './components/layout/AppShell';

function StreamProbe() {
  const status = useEventStream();
  const { data, isLoading, dataUpdatedAt } = useSessions('all', false);
  return (
    <div className="p-6 font-mono text-xs">
      <p data-testid="sse-status" className="mb-2">
        sse: <b>{status}</b> · sessions: <b data-testid="session-count">{data?.sessions.length ?? '—'}</b>
        {' · '}filteredOut: <b>{data?.filteredOut ?? '—'}</b>
        {' · '}updatedAt: <b data-testid="updated-at">{dataUpdatedAt}</b>
      </p>
      <pre data-testid="dump" className="max-h-[60vh] overflow-auto rounded border border-border bg-surface p-3 text-text-tertiary">
        {isLoading ? 'loading…' : JSON.stringify(data?.sessions.slice(0, 6), null, 2)}
      </pre>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <StreamProbe />
    </AppShell>
  );
}
