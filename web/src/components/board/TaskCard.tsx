import { memo } from 'react';
import { cn } from '@/lib/utils';
import { isTaskActuallyBlocked } from '@/lib/tasks';
import { useUiStore } from '@/stores/uiStore';
import type { Task } from '@/types/task';

/** Stretched-link pattern. The card must be one keyboard stop, but a per-card
 *  action cannot nest inside a <button> -- invalid HTML, and browsers drop the
 *  inner control's events. So the title is the button and its ::after covers
 *  the card; actions sit as siblings above it on z-index. */
function TaskCardImpl({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const selectTask = useUiStore((s) => s.selectTask);
  const selectedTaskId = useUiStore((s) => s.selectedTaskId);
  const blocked = isTaskActuallyBlocked(task, allTasks);
  const selected = task.id === selectedTaskId;

  return (
    <li
      className={cn(
        'relative rounded-lg border bg-surface p-3 transition-colors',
        selected ? 'border-primary' : 'border-border hover:border-text-muted',
        task.status === 'completed' && 'opacity-80',
        blocked && 'opacity-70',
      )}
    >
      <div className="flex items-center gap-2 text-[11px] text-text-muted">
        <span>#{task.id}</span>
        {blocked && (
          <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] uppercase text-warning">
            Blocked
          </span>
        )}
      </div>

      <h3 className="mt-1">
        <button
          type="button"
          onClick={() => selectTask(task.id)}
          className={cn(
            'text-left text-sm after:absolute after:inset-0 after:content-[""]',
            task.status === 'completed' ? 'text-text-tertiary line-through' : 'text-foreground',
          )}
        >
          {task.subject}
        </button>
      </h3>

      {task.status === 'in_progress' && task.activeForm && (
        <p className="mt-1 text-xs text-primary">{task.activeForm}</p>
      )}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-text-tertiary">{task.description}</p>
      )}
      {blocked && (
        <p className="mt-1 text-[11px] text-text-muted">
          Waiting on {task.blockedBy.map((id) => `#${id}`).join(', ')}
        </p>
      )}
    </li>
  );
}

/** Memoised so an SSE tick only re-renders cards whose object identity changed.
 *  TanStack's structural sharing preserves identity for unchanged tasks, which
 *  is what makes this bite. */
export const TaskCard = memo(TaskCardImpl);
