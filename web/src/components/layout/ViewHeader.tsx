import { Columns3, GanttChartSquare, MoreVertical, Moon, Sun, SunMoon, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme, type ThemeChoice } from '@/stores/theme-provider';
import { useUiStore } from '@/stores/uiStore';
import { SessionSwitcher } from '@/components/sidebar/SessionSwitcher';
import type { ConnectionState } from '@/hooks/useEventStream';
import { cn } from '@/lib/utils';

const NEXT: Record<ThemeChoice, ThemeChoice> = { light: 'dark', dark: 'system', system: 'light' };
const ICON = { light: Sun, dark: Moon, system: SunMoon };

export function ViewHeader({
  compact, phone, status, right, subtitle, onDeleteAll,
}: {
  compact: boolean;
  phone: boolean;
  status?: ConnectionState;
  right?: React.ReactNode;
  subtitle?: string;
  onDeleteAll?: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const { boardView, setBoardView } = useUiStore();
  const Icon = ICON[theme];

  // On a phone the bottom nav owns view switching and everything secondary
  // lives in one overflow, so the header carries only title, subtitle and a
  // single control. That is what takes it from 194px to one row.
  if (phone) {
    return (
      <header className="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-serif text-base leading-tight">Claude Tasks</h1>
          <span className="flex min-w-0 items-center gap-1">
            {/* Phones do not render the sidebar, so without this a dropped
                stream leaves the UI silently stale with no indication. */}
            {status && (
              <span
                aria-live="polite"
                aria-atomic="true"
                title={`Connection: ${status}`}
                className="flex shrink-0 items-center"
              >
                <span className="sr-only">Connection: {status}</span>
                <span
                  aria-hidden="true"
                  className={cn('size-1.5 rounded-full',
                    status === 'connected' && 'bg-success',
                    status === 'connecting' && 'animate-pulse bg-warning motion-reduce:animate-none',
                    status === 'disconnected' && 'bg-destructive')}
                />
              </span>
            )}
            <SessionSwitcher />
            {subtitle && <span className="shrink-0 text-[11px] text-text-muted">· {subtitle}</span>}
          </span>
        </div>
        {right}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More options"
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-text-tertiary"
          >
            <MoreVertical className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setTheme(NEXT[theme])}>
              <Icon className="size-4" /> Theme: {theme}
            </DropdownMenuItem>
            {onDeleteAll && (
              <DropdownMenuItem onSelect={onDeleteAll} className="text-destructive">
                <Trash2 className="size-4" /> Delete all tasks
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    );
  }

  return (
    <header
      className={cn(
        'shrink-0 border-b border-border bg-surface',
        compact ? 'flex flex-col gap-2 py-3 pl-4 pr-[76px]' : 'flex items-start justify-between gap-4 px-6 py-4',
      )}
    >
      <div className="min-w-0">
        <h1 className={cn('truncate font-serif', compact ? 'text-[17px]' : 'text-xl')}>Claude Tasks</h1>
        <p className="mt-1 text-xs text-text-tertiary">{subtitle ?? 'No session selected'}</p>
      </div>
      <div className={cn('flex items-center gap-3', compact ? 'flex-wrap' : 'shrink-0')}>
        {right}
        <div role="group" aria-label="Board view" className="flex overflow-hidden rounded-lg border border-border">
          {([['kanban', Columns3, 'Kanban view'], ['timeline', GanttChartSquare, 'Timeline view']] as const).map(([v, I, label]) => (
            <button
              key={v}
              type="button"
              aria-label={label}
              aria-pressed={boardView === v}
              onClick={() => setBoardView(v)}
              className={cn('flex items-center justify-center', compact ? 'size-11' : 'size-8',
                boardView === v ? 'bg-hover text-primary' : 'text-text-tertiary')}
            >
              <I className={compact ? 'size-5' : 'size-4'} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTheme(NEXT[theme])}
          aria-label={`Theme: ${theme}. Switch to ${NEXT[theme]}`}
          data-testid="theme-cycle"
          className={cn('flex shrink-0 items-center justify-center rounded-lg border border-border text-text-tertiary hover:text-foreground',
            compact ? 'size-11' : 'size-8')}
        >
          <Icon className={compact ? 'size-5' : 'size-4'} />
        </button>
      </div>
    </header>
  );
}
