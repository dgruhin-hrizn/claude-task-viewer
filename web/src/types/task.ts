/** Mirrors the on-disk task JSON that Claude Code writes, plus the fields
 *  server.js synthesises. Nothing here is validated at runtime -- the data is
 *  local files written by the agent, not untrusted network input. */
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  /** numeric-as-string; the filename is <id>.json */
  id: string;
  subject: string;
  description: string;
  /** present-participle form, e.g. "Fixing the parser" */
  activeForm?: string;
  status: TaskStatus;
  /** ids this task blocks / is blocked by. An array, so the graph is a DAG. */
  blocks: string[];
  blockedBy: string[];
  /** from statSync: birthtime / mtime */
  createdAt: string;
  updatedAt: string;
  /** added by /api/tasks/all only */
  sessionId?: string;
  sessionName?: string | null;
  project?: string | null;
}

export interface Session {
  id: string;
  name: string | null;
  slug: string | null;
  project: string | null;
  description: string | null;
  gitBranch: string | null;
  taskCount: number;
  completed: number;
  inProgress: number;
  pending: number;
  createdAt: string | null;
  modifiedAt: string;
  /** false for sessions known only from a transcript, with no tasks directory */
  hasTasks: boolean;
}

export interface SessionsResult {
  sessions: Session[];
  /** from X-Sessions-Filtered-Out; how many the server-side filter removed */
  filteredOut: number;
}

export type SseEvent =
  | { type: 'connected' }
  | { type: 'metadata-update' }
  | { type: 'update'; event: string; sessionId: string; file: string };
