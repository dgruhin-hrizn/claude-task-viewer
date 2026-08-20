import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EVENTS_URL } from '@/lib/api';
import type { SseEvent } from '@/types/task';

export type ConnectionState = 'connecting' | 'connected' | 'disconnected';

/** chokidar emits add+change per file write, so one TodoWrite touching 8 tasks
 *  arrives as ~16 frames within a few milliseconds. Without coalescing that is
 *  16 refetch rounds for one logical change. */
const COALESCE_MS = 150;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

export function useEventStream() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<ConnectionState>('connecting');
  const pending = useRef(new Set<string>());
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    let closed = false;
    let attempt = 0;
    let retry: number | null = null;

    const flush = () => {
      timer.current = null;
      const ids = [...pending.current];
      pending.current.clear();
      // Only mounted queries actually refetch, so a closed detail panel or an
      // unopened All Tasks view costs nothing here.
      qc.invalidateQueries({ queryKey: ['sessions'] });
      if (ids.includes('*')) {
        qc.invalidateQueries({ queryKey: ['tasks'] });
        return;
      }
      qc.invalidateQueries({ queryKey: ['tasks', 'all'] });
      for (const id of ids) qc.invalidateQueries({ queryKey: ['tasks', 'session', id] });
    };

    const schedule = () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, COALESCE_MS);
    };

    const connect = () => {
      if (closed) return;
      es = new EventSource(EVENTS_URL);

      es.onopen = () => {
        attempt = 0;
        setStatus('connected');
      };

      es.onmessage = (e) => {
        let data: SseEvent;
        try { data = JSON.parse(e.data) as SseEvent; } catch { return; }
        if (data.type === 'connected') { setStatus('connected'); return; }
        if (data.type === 'metadata-update') pending.current.add('*');
        else if (data.type === 'update') pending.current.add(data.sessionId);
        schedule();
      };

      es.onerror = () => {
        es?.close();
        if (closed) return;
        setStatus('disconnected');
        // Same exponential backoff the vanilla app used: 1s doubling to 30s.
        const delay = Math.min(RECONNECT_BASE_MS * 2 ** attempt, RECONNECT_MAX_MS);
        attempt += 1;
        retry = window.setTimeout(() => {
          setStatus('connecting');
          // Events during the gap are lost, so resync everything once.
          qc.invalidateQueries();
          connect();
        }, delay);
      };
    };

    connect();
    return () => {
      closed = true;
      es?.close();
      if (retry !== null) window.clearTimeout(retry);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [qc]);

  return status;
}
