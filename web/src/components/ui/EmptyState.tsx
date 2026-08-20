import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** An empty state should say what to do next, not restate what is missing.
 *  "No pending tasks" tells you nothing you cannot already see. */
export function EmptyState({
  icon: Icon, title, hint, action, className,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}>
      {Icon && <Icon className="mb-3 size-6 text-text-muted" aria-hidden="true" />}
      <p className="text-sm text-text-secondary">{title}</p>
      {hint && <p className="mt-1 max-w-[42ch] text-xs text-text-muted">{hint}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 min-h-11 rounded-md border border-border px-4 text-xs text-text-secondary hover:bg-elevated md:min-h-9"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
