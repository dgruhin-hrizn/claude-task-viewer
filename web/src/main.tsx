import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './stores/theme-provider';
import { queryClient } from './lib/queryClient';
import './styles/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
