import * as Tabs from '@radix-ui/react-tabs';
import { useMediaQuery, BREAKPOINTS } from '@/hooks/useMediaQuery';
import { useUiStore, type KanbanTab } from '@/stores/uiStore';
import type { Task } from '@/types/task';
import { COLUMNS, KanbanColumn } from './KanbanColumn';

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const isPhone = useMediaQuery(BREAKPOINTS.phone);
  const { kanbanTab, setKanbanTab } = useUiStore();
  const by = (s: Task['status']) => tasks.filter((t) => t.status === s);

  if (isPhone) {
    return (
      <Tabs.Root
        value={kanbanTab}
        onValueChange={(v) => setKanbanTab(v as KanbanTab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        {/* Radix supplies roving tabindex and arrow-key navigation, which the
            hand-rolled vanilla tab strip never had. */}
        <Tabs.List
          aria-label="Task status"
          className="flex shrink-0 gap-1.5 border-b border-border bg-surface p-3"
        >
          {COLUMNS.map((c) => {
            const key = (c.status === 'in_progress' ? 'in-progress' : c.status) as KanbanTab;
            return (
              <Tabs.Trigger
                key={key}
                value={key}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-elevated px-1 text-xs text-text-tertiary data-[state=active]:border-primary data-[state=active]:bg-hover data-[state=active]:text-foreground"
              >
                <span className={`size-1.5 rounded-full ${c.dot}`} />
                <span className="truncate">{c.short}</span>
                <span className="text-[11px] text-text-muted">{by(c.status).length}</span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {COLUMNS.map((c) => {
          const key = (c.status === 'in_progress' ? 'in-progress' : c.status) as KanbanTab;
          return (
            <Tabs.Content key={key} value={key} className="min-h-0 flex-1 overflow-hidden p-3">
              <KanbanColumn {...c} tasks={by(c.status)} allTasks={tasks} hideHeader />
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 gap-6 overflow-x-auto p-6">
      {COLUMNS.map((c) => (
        <KanbanColumn key={c.status} {...c} tasks={by(c.status)} allTasks={tasks} />
      ))}
    </div>
  );
}
