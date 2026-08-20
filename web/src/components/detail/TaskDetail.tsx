import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { BREAKPOINTS, useMediaQuery } from '@/hooks/useMediaQuery';
import { useUiStore } from '@/stores/uiStore';
import type { Task } from '@/types/task';
import { TaskDetailBody } from './TaskDetailBody';

export function TaskDetail({ tasks }: { tasks: Task[] }) {
  const isSheet = useMediaQuery(BREAKPOINTS.drawer);
  const selectedTaskId = useUiStore((s) => s.selectedTaskId);
  const selectTask = useUiStore((s) => s.selectTask);
  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;

  // The mobile sheet has no SheetTrigger -- it opens because a card set
  // selectedTaskId -- so Radix has nothing to return focus to on close.
  // Remember whatever was focused when it opened and restore that.
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (selectedTaskId) opener.current = document.activeElement as HTMLElement | null;
  }, [selectedTaskId]);

  if (!task) return null;

  const header = (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
      <span className="text-sm text-foreground">Task Details</span>
      <button
        type="button"
        aria-label="Close task details"
        onClick={() => selectTask(null)}
        className="flex size-11 items-center justify-center rounded-lg text-text-tertiary hover:text-foreground md:size-8"
      >
        <X className="size-5 md:size-4" />
      </button>
    </header>
  );

  // Mobile: a modal Sheet, so it fills the screen and traps focus.
  if (isSheet) {
    return (
      <Sheet open onOpenChange={(o) => { if (!o) selectTask(null); }}>
        <SheetContent
          side="right"
          title="Task Details"
          className="w-full max-w-none"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            opener.current?.focus();
          }}
        >
          <div className="flex h-full min-h-0 flex-col">
            {header}
            <TaskDetailBody task={task} allTasks={tasks} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: a plain aside, deliberately NOT a Sheet. Sheet traps focus and
  // locks scroll, which would break clicking from card to card with the panel
  // open -- the whole point of a side-by-side panel.
  return (
    <aside
      aria-label="Task details"
      className="flex w-[400px] shrink-0 flex-col border-l border-border bg-surface"
    >
      {header}
      <TaskDetailBody task={task} allTasks={tasks} />
    </aside>
  );
}
