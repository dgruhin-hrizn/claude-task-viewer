import { SessionList } from '@/components/sidebar/SessionList';
import { ClaudeLogo } from './ClaudeLogo';

/** Sidebar contents, shared by the desktop rail and the mobile drawer so the
 *  two can never drift. Regions fill in from t9/t10. */
export function SidebarContent() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <ClaudeLogo className="size-4" />
          </span>
          <span className="font-serif text-base">Claude Tasks</span>
        </div>
      </header>

      <section aria-labelledby="live-heading" className="border-b border-border px-4 py-3">
        <h2 id="live-heading" className="text-[11px] uppercase tracking-wider text-text-muted">
          Live Updates
        </h2>
      </section>

      <section aria-labelledby="sessions-heading" className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <h2 id="sessions-heading" className="text-[11px] uppercase tracking-wider text-text-muted">
          Sessions
        </h2>
        <SessionList />
      </section>

      <footer className="border-t border-border px-4 py-3 text-[11px] text-text-muted">
        <a href="https://github.com/dgruhin-hrizn/claude-task-viewer" target="_blank" rel="noreferrer" className="hover:text-text-secondary">
          GitHub
        </a>
      </footer>
    </div>
  );
}
