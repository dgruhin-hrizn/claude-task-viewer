export function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${(ms / 3_600_000).toFixed(1)}h`;
}

export function formatAxisLabel(t: number, spanMs: number): string {
  const d = new Date(t);
  const hours = spanMs / 3_600_000;
  if (hours < 1) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (hours < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Bars convey duration purely visually, so each row needs this spoken instead.
 *  A real string-building function, not a wrapper -- it is the only way the
 *  timeline is usable without sight. */
export function describeBar(
  id: string, subject: string, status: string, start: number, end: number,
): string {
  const when = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const label = status === 'in_progress' ? 'in progress' : status;
  return `#${id} ${subject}, ${label}, started ${when}, duration ${formatDuration(end - start)}`;
}
