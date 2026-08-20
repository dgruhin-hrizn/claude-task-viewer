import { useQuery } from '@tanstack/react-query';
import { fetchAllTasks, fetchSessionTasks, fetchSessions, type SessionLimit } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export function useSessions(limit: SessionLimit = 20, withTasks = true) {
  return useQuery({
    queryKey: queryKeys.sessions(limit, withTasks),
    queryFn: () => fetchSessions(limit, withTasks),
  });
}

export function useSessionTasks(sessionId: string | null) {
  return useQuery({
    queryKey: queryKeys.sessionTasks(sessionId ?? ''),
    queryFn: () => fetchSessionTasks(sessionId!),
    enabled: !!sessionId,
  });
}

export function useAllTasks(enabled = false) {
  return useQuery({ queryKey: queryKeys.allTasks(), queryFn: fetchAllTasks, enabled });
}
