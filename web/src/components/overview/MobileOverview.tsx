import { EmptyState } from '@/components/ui/EmptyState';
import { Activity } from 'lucide-react';

/** Placeholder destination so t3's navigation is testable on its own.
 *  t4 replaces this with the real cross-session activity view. */
export function MobileOverview() {
  return (
    <div data-testid="overview" className="min-h-0 flex-1 overflow-y-auto">
      <EmptyState icon={Activity} title="Overview" hint="Cross-session activity lands here in t4." />
    </div>
  );
}
