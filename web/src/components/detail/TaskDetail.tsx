import { X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { BREAKPOINTS, useMediaQuery } from '@/hooks/useMediaQuery';
import { useOverlayFocus } from '@/hooks/useRestoreFocus';
import { useUiStore } from '@/stores/uiStore';
import type { Task } from '@/types/task';
import { TaskDetailBody } from './TaskDetailBody';

export function TaskDetail({ tasks, sessionId }: { tasks: Task[]; sessionId: string }) {
  const isSheet = useMediaQuery(BREAKPOINTS.drawer);
  const selectedTaskId = useUiStore((s) => s.selectedTaskId);
  const selectTask = useUiStore((s) => s.selectTask);
  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;

  // shared with every other overlay: no SheetTrigger here either
  const onCloseAutoFocus = useOverlayFocus(!!selectedTaskId);

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
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <div className="flex h-full min-h-0 flex-col">
            {header}
            <TaskDetailBody task={task} allTasks={tasks} sessionId={sessionId} />
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
      <TaskDetailBody task={task} allTasks={tasks} sessionId={sessionId} />
    </aside>
  );
}
