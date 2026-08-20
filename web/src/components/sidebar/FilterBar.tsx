import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUiStore, type SessionFilter } from '@/stores/uiStore';
import type { Session } from '@/types/task';

/** Every control gets a real label. The vanilla app had zero <label> elements
 *  in 3,572 lines, so all three of these announced as unnamed comboboxes. */
function Labelled({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="sr-only">{label}</label>
      {children}
    </div>
  );
}

export function FilterBar({ sessions }: { sessions: Session[] }) {
  const { sessionFilter, sessionLimit, filterProject,
          setSessionFilter, setSessionLimit, setFilterProject } = useUiStore();

  const projects = [...new Set(sessions.map((s) => s.project).filter(Boolean) as string[])].sort();

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-2">
        <Labelled id="project-filter" label="Filter by project">
          <Select value={filterProject || '__all'} onValueChange={(v) => setFilterProject(v === '__all' ? '' : v)}>
            <SelectTrigger id="project-filter" aria-label="Filter by project">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p} value={p}>{p.split('/').pop()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Labelled>

        <Labelled id="session-filter" label="Filter sessions">
          <Select value={sessionFilter} onValueChange={(v) => setSessionFilter(v as SessionFilter)}>
            <SelectTrigger id="session-filter" aria-label="Filter sessions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="with-tasks">With Tasks</SelectItem>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
            </SelectContent>
          </Select>
        </Labelled>
      </div>

      <Labelled id="session-limit" label="Number of sessions to show">
        <Select value={String(sessionLimit)} onValueChange={(v) => setSessionLimit(v === 'all' ? 'all' : Number(v))}>
          <SelectTrigger id="session-limit" aria-label="Number of sessions to show">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['10', '20', '50', 'all'].map((v) => (
              <SelectItem key={v} value={v}>{v === 'all' ? 'Show All' : `Show ${v}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Labelled>
    </div>
  );
}
