import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <AppShell>
      <div className="p-6 text-sm text-text-tertiary">
        Board renders here from t11. Legacy UI for comparison: <a className="text-primary underline" href="/legacy.html">/legacy.html</a>
      </div>
    </AppShell>
  );
}
