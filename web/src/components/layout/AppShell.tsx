import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BREAKPOINTS, useMediaQuery } from '@/hooks/useMediaQuery';
import { useEventStream } from '@/hooks/useEventStream';
import { SidebarContent } from './Sidebar';
import { SkipNav } from './SkipNav';
import { ViewHeader } from './ViewHeader';

export function AppShell({
  children, headerRight, subtitle,
}: {
  children?: React.ReactNode; headerRight?: React.ReactNode; subtitle?: string;
}) {
  const isDrawer = useMediaQuery(BREAKPOINTS.drawer);
  const status = useEventStream();
  const [open, setOpen] = useState(false);

  // Crossing up to desktop while the drawer is open would otherwise leave a
  // focus-trapping overlay mounted over a layout that no longer needs it.
  useEffect(() => {
    if (!isDrawer) setOpen(false);
  }, [isDrawer]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <SkipNav />

      {!isDrawer && (
        <aside
          aria-label="Sessions"
          className="w-[280px] shrink-0 border-r border-border bg-surface"
        >
          <SidebarContent status={status} />
        </aside>
      )}

      <main id="main" className="relative flex min-w-0 flex-1 flex-col bg-background">
        {isDrawer && (
          // The trigger must live inside <Sheet> and be Radix's own Trigger:
          // a button outside it leaves Radix with nothing to return focus to
          // when the drawer closes, so focus falls to <body>.
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open sessions menu"
              className="absolute right-3 top-3 z-30 flex size-11 items-center justify-center rounded-lg border border-border bg-elevated text-text-secondary"
            >
              <Menu className="size-[22px]" />
            </SheetTrigger>
            <SheetContent side="right" title="Sessions">
              <SidebarContent status={status} />
            </SheetContent>
          </Sheet>
        )}
        <ViewHeader compact={isDrawer} right={headerRight} subtitle={subtitle} />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
