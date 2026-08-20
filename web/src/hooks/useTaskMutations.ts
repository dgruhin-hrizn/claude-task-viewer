import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNote, deleteTask } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { topologicalSort } from '@/lib/tasks';
import type { Task } from '@/types/task';

export function useAddNote(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, note }: { taskId: string; note: string }) => addNote(sessionId, taskId, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sessionTasks(sessionId) }),
  });
}

export function useDeleteTask(sessionId: string) {
  const qc = useQueryClient();
  const key = queryKeys.sessionTasks(sessionId);
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(sessionId, taskId),
    // optimistic: the card should vanish immediately, with rollback if the
    // server's dependency guard refuses
    onMutate: async (taskId) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<Task[]>(key);
      qc.setQueryData<Task[]>(key, (old) => (old ?? []).filter((t) => t.id !== taskId));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}

/** Bulk delete must run in dependency order or the server's blocker guard
 *  rejects mid-sequence and leaves the session half-deleted. */
export function useDeleteAllTasks(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tasks: Task[]) => {
      const ordered = topologicalSort(tasks);
      const failed: string[] = [];
      for (const t of ordered) {
        try { await deleteTask(sessionId, t.id); } catch { failed.push(t.id); }
      }
      return failed;
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessionTasks(sessionId) });
      qc.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
