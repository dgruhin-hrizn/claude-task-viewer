import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const THRESHOLD = 70;
const MAX_PULL = 110;

/** Pull-to-refresh maps onto the reflex people already have when they suspect
 *  stale data. Here it means "resync everything" rather than a page reload.
 *
 *  Only arms when the scroll container is genuinely at the top, so a pull that
 *  begins mid-list scrolls the list instead of hijacking the gesture. */
export function usePullToRefresh(enabled: boolean) {
  const qc = useQueryClient();
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const scroller = useRef<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try { await qc.invalidateQueries(); } finally {
      setRefreshing(false);
      setPull(0);
    }
  }, [qc]);

  useEffect(() => {
    if (!enabled) return;
    const host = ref.current;
    if (!host) return;

    /** Walk up to the first ancestor that genuinely scrolls vertically.
     *  Guessing by selector (ul, [role=tabpanel]) missed the overview's own
     *  container, so a pull begun halfway down the list still refreshed. */
    const findScroller = (from: HTMLElement | null): HTMLElement | null => {
      let el = from;
      while (el && el !== host.parentElement) {
        const oy = getComputedStyle(el).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) return el;
        el = el.parentElement;
      }
      return null;
    };

    const onStart = (e: TouchEvent) => {
      const s = findScroller(e.target as HTMLElement | null);
      scroller.current = s;
      startY.current = (s ? s.scrollTop <= 0 : true) ? e.touches[0].clientY : null;
    };

    const onMove = (e: TouchEvent) => {
      if (startY.current === null || refreshing) return;
      const s = scroller.current;
      if (s && s.scrollTop > 0) { startY.current = null; setPull(0); return; }
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) { setPull(0); return; }
      // resistance, so the sheet does not track the finger 1:1
      setPull(Math.min(MAX_PULL, dy * 0.5));
    };

    const onEnd = () => {
      if (startY.current !== null && pull >= THRESHOLD) refresh();
      else setPull(0);
      startY.current = null;
    };

    host.addEventListener('touchstart', onStart, { passive: true });
    host.addEventListener('touchmove', onMove, { passive: true });
    host.addEventListener('touchend', onEnd);
    host.addEventListener('touchcancel', onEnd);
    return () => {
      host.removeEventListener('touchstart', onStart);
      host.removeEventListener('touchmove', onMove);
      host.removeEventListener('touchend', onEnd);
      host.removeEventListener('touchcancel', onEnd);
    };
  }, [enabled, pull, refreshing, refresh]);

  return { ref, pull, refreshing, armed: pull >= THRESHOLD, refresh };
}
