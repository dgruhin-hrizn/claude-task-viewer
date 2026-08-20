import { isTaskActuallyBlocked } from '@/lib/tasks';
import { useUiStore } from '@/stores/uiStore';
import type { Task } from '@/types/task';
import { MarkdownBody } from './MarkdownBody';

const STATUS_LABEL: Record<Task['status'], string> = {
  pending: 'Pending', in_progress: 'In Progress', completed: 'Completed',
};

function DepList({ label, ids }: { label: string; ids: string[] }) {
  const selectTask = useUiStore((s) => s.selectTask);
  return (
    <section className="mt-5">
      <h3 className="text-[11px] uppercase tracking-wider text-text-muted">{label}</h3>
      {ids.length === 0 ? (
        <p className="mt-1 text-xs italic text-text-muted">No dependencies</p>
      ) : (
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {ids.map((id) => (
            <li key={id}>
              {/* clickable, unlike the vanilla panel where these were plain text */}
              <button
                type="button"
                onClick={() => selectTask(id)}
                className="rounded border border-border px-2 py-1 text-xs text-primary hover:bg-elevated"
              >
                #{id}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TaskDetailBody({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const blocked = isTaskActuallyBlocked(task, allTasks);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
      <p className="text-[11px] uppercase tracking-wider text-text-muted">Task #{task.id}</p>
      <h2 className="mt-1 font-serif text-lg text-foreground">{task.subject}</h2>

      <section className="mt-5">
        <h3 className="text-[11px] uppercase tracking-wider text-text-muted">Status</h3>
        <p className="mt-1 text-sm text-foreground">{STATUS_LABEL[task.status]}</p>
        <p className="mt-1 text-[11px] text-text-muted">Status is controlled by Claude Code</p>
      </section>

      {task.status === 'in_progress' && task.activeForm && (
        <p className="mt-4 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
          Currently: {task.activeForm}
        </p>
      )}
      {blocked && (
        <p className="mt-4 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          Blocked by {task.blockedBy.map((i) => `#${i}`).join(', ')}
        </p>
      )}

      <DepList label="Blocked By" ids={task.blockedBy ?? []} />
      <DepList label="Blocks" ids={task.blocks ?? []} />

      <section className="mt-5">
        <h3 className="text-[11px] uppercase tracking-wider text-text-muted">Description</h3>
        <div className="mt-1 text-sm text-text-secondary">
          {task.description ? <MarkdownBody>{task.description}</MarkdownBody>
                            : <p className="italic text-text-muted">No description</p>}
        </div>
      </section>
    </div>
  );
}
