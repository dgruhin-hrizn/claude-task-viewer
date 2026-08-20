import { useEffect, useRef } from 'react';
import type { Task } from '@/types/task';

function chime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [523.25, 659.25].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.start(t); o.stop(t + 0.32);
    });
  } catch { /* audio unavailable */ }
}

/** Diffs previous vs current status in an effect rather than a query callback:
 *  v5 removed onSuccess from useQuery precisely because it is unreliable
 *  across cache hits, so a callback would miss or double-fire. */
export function useCompletionNotifications(tasks: Task[], enabled: boolean) {
  const previous = useRef<Map<string, string>>(new Map());
  const primed = useRef(false);

  useEffect(() => {
    const next = new Map(tasks.map((t) => [`${t.sessionId ?? ''}:${t.id}`, t.status]));
    // Skip the first pass, or every already-completed task fires on load.
    if (!primed.current) { previous.current = next; primed.current = true; return; }

    if (enabled) {
      for (const [key, status] of next) {
        const was = previous.current.get(key);
        if (was && was !== 'completed' && status === 'completed') {
          const t = tasks.find((x) => `${x.sessionId ?? ''}:${x.id}` === key);
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('Task completed', { body: t?.subject ?? key });
          }
          chime();
        }
      }
    }
    previous.current = next;
  }, [tasks, enabled]);
}
