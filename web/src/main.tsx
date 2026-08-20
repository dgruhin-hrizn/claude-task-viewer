import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ThemeProvider } from './stores/theme-provider';
import { queryClient } from './lib/queryClient';
import './styles/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

// Dev-only handle for verifying cache behaviour (structural sharing) from the
// console. Stripped from production builds by the DEV guard.
if (import.meta.env.DEV) {
  (window as unknown as { __qc?: unknown }).__qc = queryClient;
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Tooltip.Provider delayDuration={200}>
          <App />
        </Tooltip.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
