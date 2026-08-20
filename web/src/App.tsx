import { useCallback, useState } from 'react';
import { CircleHelp, Trash2 } from 'lucide-react';
import { useSessionTasks } from './hooks/useSessions';
import { useUrlState } from './hooks/useUrlState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDeleteAllTasks, useDeleteTask } from './hooks/useTaskMutations';
import { useCompletionNotifications } from './hooks/useCompletionNotifications';
import { useUiStore } from './stores/uiStore';
import { AppShell } from './components/layout/AppShell';
import { KanbanBoard } from './components/board/KanbanBoard';
import { ProgressMeter } from './components/board/ProgressMeter';
import { TaskDetail } from './components/detail/TaskDetail';
import { TimelineView } from './components/timeline/TimelineView';
import { HelpDialog } from './components/dialogs/HelpDialog';
import { ConfirmDialog } from './components/dialogs/ConfirmDialog';

export default function App() {
  useUrlState();
  const selectedSessionId = useUiStore((s) => s.selectedSessionId);
  const selectedTaskId = useUiStore((s) => s.selectedTaskId);
  const selectTask = useUiStore((s) => s.selectTask);
  const boardView = useUiStore((s) => s.boardView);
  const notificationsEnabled = useUiStore((s) => s.notificationsEnabled);

  const { data: tasks = [], isLoading } = useSessionTasks(selectedSessionId);
  const del = useDeleteTask(selectedSessionId ?? '');
  const delAll = useDeleteAllTasks(selectedSessionId ?? '');
  useCompletionNotifications(tasks, notificationsEnabled);

  const [help, setHelp] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [blockedWarning, setBlockedWarning] = useState<string | null>(null);

  const selected = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const requestDelete = useCallback(() => {
    if (!selected) return;
    // a task that blocks others cannot be deleted; say so instead of letting
    // the request fail with a bare 400
    const dependents = tasks.filter((t) => t.blockedBy?.includes(selected.id));
    if (dependents.length > 0) {
      setBlockedWarning(`#${selected.id} blocks ${dependents.map((d) => `#${d.id}`).join(', ')}. Delete those first.`);
      return;
    }
    setConfirmDelete(true);
  }, [selected, tasks]);

  useKeyboardShortcuts({
    onHelp: () => setHelp(true),
    onEscape: () => { if (!help && !confirmDelete && !confirmDeleteAll && !blockedWarning) selectTask(null); },
    onDelete: requestDelete,
  });

  const done = tasks.filter((t) => t.status === 'completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <>
      <AppShell
        subtitle={selectedSessionId ? `${tasks.length} tasks` : 'No session selected'}
        headerRight={
          <>
            {tasks.length > 0 && <ProgressMeter value={pct} label="Session progress" />}
            {tasks.length > 0 && (
              <button type="button" aria-label="Delete all tasks in this session"
                onClick={() => setConfirmDeleteAll(true)}
                className="flex size-8 items-center justify-center rounded-lg border border-border text-destructive max-md:size-11">
                <Trash2 className="size-4 max-md:size-5" />
              </button>
            )}
            <button type="button" aria-label="Keyboard shortcuts" onClick={() => setHelp(true)}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-text-tertiary max-md:hidden">
              <CircleHelp className="size-4" />
            </button>
          </>
        }
      >
        {!selectedSessionId ? (
          <p className="p-6 text-sm text-text-tertiary">Select a session to view its tasks.</p>
        ) : isLoading ? (
          <p className="p-6 text-sm text-text-muted">Loading…</p>
        ) : (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {boardView === 'timeline' ? <TimelineView tasks={tasks} /> : <KanbanBoard tasks={tasks} />}
            </div>
            <TaskDetail tasks={tasks} sessionId={selectedSessionId} />
          </div>
        )}
      </AppShell>

      <HelpDialog open={help} onOpenChange={setHelp} />

      <ConfirmDialog
        open={confirmDelete} onOpenChange={setConfirmDelete}
        title="Delete this task?"
        description={selected ? `"${selected.subject}" will be removed. This cannot be undone.` : ''}
        confirmLabel="Delete"
        onConfirm={() => { if (selected) { del.mutate(selected.id); selectTask(null); } }}
      />

      <ConfirmDialog
        open={confirmDeleteAll} onOpenChange={setConfirmDeleteAll}
        title="Delete all tasks in this session?"
        description={`All ${tasks.length} tasks will be removed, in dependency order. This cannot be undone.`}
        confirmLabel="Delete all"
        onConfirm={() => { delAll.mutate(tasks); selectTask(null); }}
      />

      <ConfirmDialog
        open={blockedWarning !== null} onOpenChange={(o) => { if (!o) setBlockedWarning(null); }}
        title="Cannot delete a blocking task"
        description={blockedWarning ?? ''}
      />
    </>
  );
}
