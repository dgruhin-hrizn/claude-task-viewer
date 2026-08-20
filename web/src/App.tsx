import { useEventStream } from './hooks/useEventStream';
import { useUrlState } from './hooks/useUrlState';
import { useUiStore } from './stores/uiStore';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  useEventStream();
  useUrlState();
  const selectedSessionId = useUiStore((s) => s.selectedSessionId);
  return (
    <AppShell>
      <div className="p-6 text-sm text-text-tertiary">
        {selectedSessionId
          ? <>Session <b data-testid="sel">{selectedSessionId}</b> — board arrives in t11.</>
          : <>Select a session. Board arrives in t11.</>}
      </div>
    </AppShell>
  );
}
