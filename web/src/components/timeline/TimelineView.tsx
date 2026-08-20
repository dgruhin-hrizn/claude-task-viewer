import { useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Popover from '@radix-ui/react-popover';
import { BREAKPOINTS, useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { describeBar, formatAxisLabel, formatDuration } from '@/lib/time';
import { useUiStore } from '@/stores/uiStore';
import type { Task } from '@/types/task';

/** Shared by the axis and the rows. In the vanilla app this lived in CSS and
 *  was read back out with getComputedStyle; here it is simply a constant. */
const GUTTER_PX = 148;
const GUTTER_PX_PHONE = 92;

const BAR_TONE: Record<Task['status'], string> = {
  pending: 'bg-text-muted',
  in_progress: 'bg-primary',
  completed: 'bg-success/80',
};

export function TimelineView({ tasks }: { tasks: Task[] }) {
  const isPhone = useMediaQuery(BREAKPOINTS.phone);
  const isTouch = useMediaQuery(BREAKPOINTS.touch);
  const selectTask = useUiStore((s) => s.selectTask);
  const gutter = isPhone ? GUTTER_PX_PHONE : GUTTER_PX;

  const model = useMemo(() => {
    if (tasks.length === 0) return null;
    const starts = tasks.map((t) => new Date(t.createdAt).getTime());
    const ends = tasks.map((t) => new Date(t.updatedAt || t.createdAt).getTime());
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    // birthtime equals mtime on some filesystems, which would collapse every
    // bar to zero width; a floor keeps them visible and honest.
    const span = Math.max(max - min, 1000);
    // 7 timestamp labels overlap solid once the track is ~250px wide
    const ticks = isPhone ? 2 : 6;
    return { min, span, ticks, rows: tasks.map((t, i) => {
      const s = starts[i], e = Math.max(ends[i], starts[i]);
      return { task: t, start: s, end: e,
               left: ((s - min) / span) * 100,
               width: Math.max(((e - s) / span) * 100, 0.5) };
    }) };
  }, [tasks, isPhone]);

  if (!model) return <p className="p-6 text-sm text-text-muted">No tasks to plot.</p>;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
      <div className="relative mb-2 border-b border-border pb-2" style={{ paddingLeft: gutter }}>
        {Array.from({ length: model.ticks + 1 }, (_, i) => {
          const pct = (i / model.ticks) * 100;
          return (
            <span
              key={i}
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[9px] text-text-muted md:text-[10px]"
              style={{ left: `calc(${gutter}px + (100% - ${gutter}px - 12px) * ${pct} / 100)` }}
            >
              {formatAxisLabel(model.min + (model.span * i) / model.ticks, model.span)}
            </span>
          );
        })}
      </div>

      <ul role="list" className="space-y-1 pt-4">
        {model.rows.map(({ task, start, end, left, width }) => {
          const description = describeBar(task.id, task.subject, task.status, start, end);
          const bar = (
            // this span is what Tooltip/Popover Trigger clones via asChild, so
            // it must carry flex-1 itself -- an extra wrapper collapses the track
            <span className="relative block h-6 flex-1">
              <span
                className={cn('absolute top-1/2 h-2 -translate-y-1/2 rounded-full', BAR_TONE[task.status])}
                style={{ left: `${left}%`, width: `${width}%` }}
              />
            </span>
          );
          return (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => selectTask(task.id)}
                aria-label={description}
                className="flex min-h-11 w-full items-center gap-3 rounded px-1 text-left hover:bg-elevated"
              >
                <span
                  className="shrink-0 truncate text-right text-[11px] text-text-secondary md:text-xs"
                  style={{ width: gutter - 12 }}
                >
                  #{task.id} {task.subject}
                </span>
                {/* Radix Tooltip never fires on tap, so touch gets a Popover */}
                {isTouch ? (
                  <Popover.Root>
                    <Popover.Trigger asChild>{bar}</Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content side="top" sideOffset={6} className="z-50 max-w-[calc(100vw-24px)] rounded-md border border-border bg-popover px-3 py-2 text-[11px] text-foreground shadow-lg">
                        <p className="font-medium">{task.subject}</p>
                        <p className="mt-0.5 text-text-tertiary">{formatDuration(end - start)}</p>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                ) : (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>{bar}</Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content side="top" sideOffset={6} className="z-50 max-w-[300px] rounded-md border border-border bg-popover px-3 py-2 text-[11px] text-foreground shadow-lg">
                        <p className="font-medium">{task.subject}</p>
                        <p className="mt-0.5 text-text-tertiary">
                          {new Date(start).toLocaleString()} → {new Date(end).toLocaleString()} ({formatDuration(end - start)})
                        </p>
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
