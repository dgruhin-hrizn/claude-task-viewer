import { Columns3, GanttChartSquare, Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme, type ThemeChoice } from '@/stores/theme-provider';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const NEXT: Record<ThemeChoice, ThemeChoice> = { light: 'dark', dark: 'system', system: 'light' };
const ICON = { light: Sun, dark: Moon, system: SunMoon };

export function ViewHeader({ compact, right, subtitle }: { compact: boolean; right?: React.ReactNode; subtitle?: string }) {
  const { theme, setTheme } = useTheme();
  const { boardView, setBoardView } = useUiStore();
  const Icon = ICON[theme];
  return (
    <header
      className={cn(
        'flex shrink-0 items-start justify-between border-b border-border bg-surface',
        // right padding clears the absolutely-positioned menu button
        compact ? 'gap-2 py-3 pl-4 pr-[76px]' : 'gap-4 px-6 py-4',
      )}
    >
      <div className="min-w-0">
        <h1 className={cn('truncate font-serif', compact ? 'text-[17px]' : 'text-xl')}>
          Claude Tasks
        </h1>
        <p className="mt-1 text-xs text-text-tertiary">{subtitle ?? 'No session selected'}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
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
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg border border-border text-text-tertiary hover:text-foreground',
          compact ? 'size-11' : 'size-8',
        )}
      >
        <Icon className={compact ? 'size-5' : 'size-4'} />
      </button>
      </div>
    </header>
  );
}
