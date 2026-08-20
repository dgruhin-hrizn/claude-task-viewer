import { useUrlState } from './hooks/useUrlState';
import { useSessionTasks } from './hooks/useSessions';
import { useUiStore } from './stores/uiStore';
import { AppShell } from './components/layout/AppShell';
import { KanbanBoard } from './components/board/KanbanBoard';
import { ProgressMeter } from './components/board/ProgressMeter';

export default function App() {
  useUrlState();
  const selectedSessionId = useUiStore((s) => s.selectedSessionId);
  const { data: tasks = [], isLoading } = useSessionTasks(selectedSessionId);

  const done = tasks.filter((t) => t.status === 'completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <AppShell
      headerRight={tasks.length > 0 ? <ProgressMeter value={pct} label="Session progress" /> : null}
      subtitle={selectedSessionId ? `${tasks.length} tasks` : 'No session selected'}
    >
      {!selectedSessionId ? (
        <p className="p-6 text-sm text-text-tertiary">Select a session to view its tasks.</p>
      ) : isLoading ? (
        <p className="p-6 text-sm text-text-muted">Loading…</p>
      ) : (
        <KanbanBoard tasks={tasks} />
      )}
    </AppShell>
  );
}
