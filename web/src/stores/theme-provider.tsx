import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type Palette = 'warm';

const STORAGE_KEY = 'theme';
const PALETTE_KEY = 'palette';

type Ctx = {
  theme: ThemeChoice;
  resolved: 'light' | 'dark';
  palette: Palette;
  setTheme: (t: ThemeChoice) => void;
};

const ThemeContext = createContext<Ctx | null>(null);

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStoredTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    // The vanilla app stored only 'light' | 'dark'; 'system' is new here, and
    // an absent value now means system rather than dark.
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch { /* private mode */ }
  return 'system';
}

/** Applies the resolved mode to <html> and keeps meta[theme-color] in step. */
function applyTheme(resolved: 'light' | 'dark', palette: Palette) {
  const el = document.documentElement;
  el.classList.toggle('light', resolved === 'light');
  el.dataset.palette = palette;
  el.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      'content',
      getComputedStyle(el).getPropertyValue('--p-accent').trim() || '#e86f33',
    );
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(readStoredTheme);
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    readStoredTheme() === 'system'
      ? (systemPrefersDark() ? 'dark' : 'light')
      : (readStoredTheme() as 'light' | 'dark'),
  );
  const palette: Palette = 'warm';

  useEffect(() => {
    const next = theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme;
    setResolved(next);
    applyTheme(next, palette);
  }, [theme, palette]);

  // Track OS changes live while the app is open. Without this a tool left on a
  // second monitor keeps yesterday's mode after the OS flips at sunset.
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light';
      setResolved(next);
      applyTheme(next, palette);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, palette]);

  const setTheme = useCallback((t: ThemeChoice) => {
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* private mode */ }
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolved, palette, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export { STORAGE_KEY as THEME_STORAGE_KEY, PALETTE_KEY };
