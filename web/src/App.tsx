import { useTheme, type ThemeChoice } from './stores/theme-provider';

const CHOICES: ThemeChoice[] = ['light', 'dark', 'system'];

export default function App() {
  const { theme, resolved, setTheme } = useTheme();
  return (
    <main className="min-h-dvh bg-background p-8 text-foreground">
      <h1 className="font-serif text-2xl">Claude Tasks</h1>
      <p className="mt-2 text-text-secondary">
        theme=<b>{theme}</b> resolved=<b data-testid="resolved">{resolved}</b>
      </p>

      <div className="mt-4 flex gap-2">
        {CHOICES.map((c) => (
          <button
            key={c}
            data-testid={`theme-${c}`}
            onClick={() => setTheme(c)}
            className={`min-h-11 rounded-lg border px-4 ${
              theme === c ? 'border-primary bg-hover text-foreground' : 'border-border text-text-tertiary'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid max-w-md gap-2">
        {['bg-background', 'bg-surface', 'bg-elevated', 'bg-hover'].map((c) => (
          <div key={c} className={`${c} rounded border border-border p-3 text-sm`}>{c}</div>
        ))}
        <p className="text-foreground">text-foreground</p>
        <p className="text-text-secondary">text-secondary</p>
        <p className="text-text-tertiary">text-tertiary</p>
        <p className="text-text-muted">text-muted</p>
        <p className="text-primary">accent</p>
      </div>
    </main>
  );
}
