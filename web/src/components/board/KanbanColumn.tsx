import { cn } from '@/lib/utils';
import type { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';

/** Says why the column is empty, which is the part a person cannot infer. */
const EMPTY_HINT: Record<TaskStatus, string> = {
  pending: 'Everything queued has been picked up.',
  in_progress: 'Claude Code is not working on anything in this session right now.',
  completed: 'Nothing finished yet.',
};

export const COLUMNS: { status: TaskStatus; label: string; short: string; dot: string }[] = [
  { status: 'pending', label: 'Pending', short: 'Pending', dot: 'bg-text-muted' },
  { status: 'in_progress', label: 'In Progress', short: 'Active', dot: 'bg-primary' },
  { status: 'completed', label: 'Completed', short: 'Done', dot: 'bg-success' },
];

export function KanbanColumn({
  status, label, dot, tasks, allTasks, hideHeader,
}: {
  status: TaskStatus; label: string; dot: string;
  tasks: Task[]; allTasks: Task[]; hideHeader?: boolean;
}) {
  const headingId = `col-${status}`;
  return (
    <section
      aria-labelledby={headingId}
      className="flex h-full min-h-0 w-full flex-col md:h-auto md:w-[320px] md:shrink-0"
    >
      <h2
        id={headingId}
        className={cn('flex items-center gap-2 pb-3 text-[11px] uppercase tracking-wider', hideHeader && 'sr-only')}
      >
        <span className={cn('size-2 rounded-full', dot)} />
        <span className="text-text-secondary">{label}</span>
        <span className="rounded-full bg-elevated px-2 py-0.5 text-[11px] text-text-tertiary">{tasks.length}</span>
      </h2>
      {/* real list semantics: a screen reader announces "list, N items" */}
      <ul role="list" className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain">
        {tasks.length === 0 ? (
          <li>
            <EmptyState
              title={`Nothing ${label.toLowerCase()}`}
              hint={EMPTY_HINT[status]}
              className="py-8"
            />
          </li>
        ) : (
          tasks.map((t) => <TaskCard key={t.id} task={t} allTasks={allTasks} />)
        )}
      </ul>
    </section>
  );
}
