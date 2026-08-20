import type { Task } from '@/types/task';

/** Subsequence match, ported from the vanilla app so filtering behaves
 *  identically. Not fuzzy scoring -- every query char must appear in order. */
export function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return i === q.length;
}

/** A blocker that cannot be resolved is treated as blocking, which matters in
 *  the all-sessions view where a referenced id may not be loaded. */
export function isTaskActuallyBlocked(task: Task, all: Task[]): boolean {
  if (!task.blockedBy?.length) return false;
  return task.blockedBy.some((id) => {
    const b = all.find((t) => t.id === id);
    return !b || b.status !== 'completed';
  });
}

/** Depth-first topological order, used to sequence bulk deletes so the
 *  server's blocker guard never rejects mid-run. Cycles are tolerated: a node
 *  already being visited is skipped rather than throwing. */
export function topologicalSort(tasks: Task[]): Task[] {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const out: Task[] = [];

  const visit = (t: Task) => {
    if (visited.has(t.id) || visiting.has(t.id)) return;
    visiting.add(t.id);
    for (const id of t.blocks ?? []) {
      const dep = byId.get(id);
      if (dep) visit(dep);
    }
    visiting.delete(t.id);
    visited.add(t.id);
    out.push(t);
  };

  for (const t of tasks) visit(t);
  return out;
}

export function isSessionStale(modifiedAt: string, inProgress: number, days = 7): boolean {
  if (inProgress > 0) return false;
  const age = (Date.now() - new Date(modifiedAt).getTime()) / 86400000;
  return age > days;
}
