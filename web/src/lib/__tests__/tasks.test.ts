import { describe, expect, it } from 'vitest';
import { fuzzyMatch, isSessionStale, isTaskActuallyBlocked, topologicalSort } from '../tasks';
import type { Task } from '@/types/task';

const task = (id: string, over: Partial<Task> = {}): Task => ({
  id, subject: `task ${id}`, description: '', status: 'pending',
  blocks: [], blockedBy: [], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  ...over,
});

describe('fuzzyMatch', () => {
  it('matches a subsequence, not just a substring', () => {
    expect(fuzzyMatch('responsive-mobile-layout', 'rml')).toBe(true);
    expect(fuzzyMatch('responsive-mobile-layout', 'mobile')).toBe(true);
  });
  it('is case insensitive', () => {
    expect(fuzzyMatch('Responsive Mobile', 'rEsP')).toBe(true);
  });
  it('respects order', () => {
    expect(fuzzyMatch('abc', 'cb')).toBe(false);
  });
  it('treats an empty query as matching everything', () => {
    expect(fuzzyMatch('anything', '')).toBe(true);
  });
  it('rejects characters that are not present', () => {
    expect(fuzzyMatch('abc', 'abz')).toBe(false);
  });
});

describe('isTaskActuallyBlocked', () => {
  it('is false with no blockers', () => {
    expect(isTaskActuallyBlocked(task('1'), [])).toBe(false);
  });
  it('is false once every blocker is completed', () => {
    const all = [task('1', { status: 'completed' }), task('2', { blockedBy: ['1'] })];
    expect(isTaskActuallyBlocked(all[1], all)).toBe(false);
  });
  it('is true while any blocker is incomplete', () => {
    const all = [task('1', { status: 'in_progress' }), task('2', { blockedBy: ['1'] })];
    expect(isTaskActuallyBlocked(all[1], all)).toBe(true);
  });
  it('treats an unresolvable blocker id as blocking', () => {
    // matters in the all-sessions view, where a referenced task may not be loaded
    const t = task('2', { blockedBy: ['999'] });
    expect(isTaskActuallyBlocked(t, [t])).toBe(true);
  });
});

describe('topologicalSort', () => {
  it('puts a blocked task before the one that blocks it', () => {
    // deleting must start at the leaves or the server's guard rejects
    const all = [task('1', { blocks: ['2'] }), task('2', { blockedBy: ['1'] })];
    expect(topologicalSort(all).map((t) => t.id)).toEqual(['2', '1']);
  });
  it('returns every task exactly once', () => {
    const all = [task('1', { blocks: ['2', '3'] }), task('2', { blockedBy: ['1'] }), task('3', { blockedBy: ['1'] })];
    const ids = topologicalSort(all).map((t) => t.id);
    expect(ids.sort()).toEqual(['1', '2', '3']);
  });
  it('does not hang on a cycle', () => {
    const all = [task('1', { blocks: ['2'] }), task('2', { blocks: ['1'] })];
    expect(topologicalSort(all)).toHaveLength(2);
  });
  it('ignores references to tasks that are not present', () => {
    const all = [task('1', { blocks: ['404'] })];
    expect(topologicalSort(all).map((t) => t.id)).toEqual(['1']);
  });
});

describe('isSessionStale', () => {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
  it('is false while work is in progress, however old', () => {
    expect(isSessionStale(daysAgo(365), 1)).toBe(false);
  });
  it('is true past the threshold with nothing in progress', () => {
    expect(isSessionStale(daysAgo(8), 0)).toBe(true);
  });
  it('is false inside the threshold', () => {
    expect(isSessionStale(daysAgo(6), 0)).toBe(false);
  });
});
