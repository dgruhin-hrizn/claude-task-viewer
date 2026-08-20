import { Activity, Columns3, GanttChartSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUiStore, type MobileTab } from '@/stores/uiStore';

const ITEMS: { id: MobileTab; label: string; Icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', Icon: Activity },
  { id: 'board', label: 'Board', Icon: Columns3 },
  { id: 'timeline', label: 'Timeline', Icon: GanttChartSquare },
];

/** Navigation belongs under the thumb. The hamburger it replaces sat in the
 *  top-right corner, the hardest place to reach one-handed on a large phone. */
export function BottomNav() {
  const mobileTab = useUiStore((s) => s.mobileTab);
  const setMobileTab = useUiStore((s) => s.setMobileTab);

  return (
    <nav
      aria-label="Views"
      className="shrink-0 border-t border-border bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul role="list" className="flex">
        {ITEMS.map(({ id, label, Icon }) => {
          const active = mobileTab === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => setMobileTab(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 w-full flex-col items-center justify-center gap-0.5',
                  active ? 'text-primary' : 'text-text-tertiary',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="text-[10px]">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
