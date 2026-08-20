import type { SessionLimit } from './api';

export const queryKeys = {
  sessions: (limit: SessionLimit, withTasks: boolean) =>
    ['sessions', { limit, withTasks }] as const,
  sessionTasks: (sessionId: string) => ['tasks', 'session', sessionId] as const,
  allTasks: () => ['tasks', 'all'] as const,
} as const;
