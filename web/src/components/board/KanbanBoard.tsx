import { useEffect, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useMediaQuery, BREAKPOINTS } from '@/hooks/useMediaQuery';
import { useUiStore, type KanbanTab } from '@/stores/uiStore';
import type { Task } from '@/types/task';
import { COLUMNS, KanbanColumn } from './KanbanColumn';

const TAB_FOR: Record<Task['status'], KanbanTab> = {
  pending: 'pending', in_progress: 'in-progress', completed: 'completed',
};
const STATUS_FOR: Record<KanbanTab, Task['status']> = {
  pending: 'pending', 'in-progress': 'in_progress', completed: 'completed',
};
/** Where the work is most likely to be, in the order a person cares about it. */
const PREFERENCE: Task['status'][] = ['in_progress', 'pending', 'completed'];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const isPhone = useMediaQuery(BREAKPOINTS.phone);
  const { kanbanTab, setKanbanTab, selectedSessionId } = useUiStore();
  const by = (s: Task['status']) => tasks.filter((t) => t.status === s);

  // A fixed 'pending' default means a session that is 22/22 done opens on an
  // empty tab reading "No pending tasks". Auto-pick a populated tab, but only
  // ONCE per session: keying off "is the current tab empty" instead would bounce
  // the user back every time they deliberately opened an empty column.
  const autoPickedFor = useRef<string | null>(null);
  useEffect(() => {
    if (tasks.length === 0) return;
    if (autoPickedFor.current === selectedSessionId) return;
    autoPickedFor.current = selectedSessionId;
    if (by(STATUS_FOR[kanbanTab]).length > 0) return;
    const target = PREFERENCE.find((st) => by(st).length > 0);
    if (target) setKanbanTab(TAB_FOR[target]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, selectedSessionId]);

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
          className="flex shrink-0 gap-1.5 border-b border-border bg-surface px-3 py-2"
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
            <Tabs.Content key={key} value={key} className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
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
