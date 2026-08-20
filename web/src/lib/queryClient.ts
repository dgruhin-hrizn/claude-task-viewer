import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // SSE is authoritative: a task file cannot change without chokidar
      // firing, so time-based staleness would only cause redundant refetches.
      staleTime: Infinity,
      // Cheap safety net for frames missed while the tab was backgrounded.
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
