import type { Session, SessionsResult, Task } from '@/types/task';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, `${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export type SessionLimit = number | 'all';

/** GET /api/sessions — the filtered-out count only arrives via a header, so
 *  this returns both rather than a bare array. */
export async function fetchSessions(
  limit: SessionLimit = 20,
  withTasks = false,
): Promise<SessionsResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (withTasks) params.set('withTasks', '1');
  const res = await fetch(`/api/sessions?${params}`);
  const sessions = await json<Session[]>(res);
  return {
    sessions,
    filteredOut: Number(res.headers.get('X-Sessions-Filtered-Out') ?? 0) || 0,
  };
}

/** GET /api/sessions/:id — 404 is expected and not an error: a session with no
 *  tasks directory is legitimate and simply has no tasks. */
export async function fetchSessionTasks(sessionId: string): Promise<Task[]> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`);
  if (res.status === 404) return [];
  return json<Task[]>(res);
}

export function fetchAllTasks(): Promise<Task[]> {
  return fetch('/api/tasks/all').then((r) => json<Task[]>(r));
}

export async function addNote(sessionId: string, taskId: string, note: string): Promise<void> {
  const res = await fetch(
    `/api/tasks/${encodeURIComponent(sessionId)}/${encodeURIComponent(taskId)}/note`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    },
  );
  await json<unknown>(res);
}

export async function deleteTask(sessionId: string, taskId: string): Promise<void> {
  const res = await fetch(
    `/api/tasks/${encodeURIComponent(sessionId)}/${encodeURIComponent(taskId)}`,
    { method: 'DELETE' },
  );
  // 400 here is the server's dependency guard refusing to orphan a blocker
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? `${res.status} ${res.statusText}`);
  }
}

export const EVENTS_URL = '/api/events';
