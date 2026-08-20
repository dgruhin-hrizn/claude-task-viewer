import { useCallback, useRef } from 'react';

/** Restores focus to whatever opened an overlay.
 *
 *  Radix restores to its own Trigger, but every overlay here is opened from
 *  controlled state with the trigger outside the Radix tree, so there is none.
 *  Three approaches that do NOT work, all tried:
 *   - reading activeElement in the Content's effect: Radix has already moved
 *     focus into the dialog by then, so it captures a doomed element;
 *   - a document-level focusin tracker: if the trigger already had focus no
 *     focus change occurs, so no event ever fires;
 *   - Radix's onOpenChange: it does not fire when the parent flips `open`
 *     externally, which is exactly how these are driven.
 *
 *  What does work is observing the false -> true transition during render. That
 *  render is scheduled from the click handler, so activeElement is still the
 *  trigger and Content has not mounted yet. */
export function useOverlayFocus(open: boolean) {
  const opener = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  if (open && !wasOpen.current) {
    opener.current = document.activeElement as HTMLElement | null;
  }
  wasOpen.current = open;

  const onCloseAutoFocus = useCallback((e: Event) => {
    const el = opener.current;
    if (!el || !document.contains(el)) return;
    e.preventDefault();
    el.focus();
  }, []);

  return onCloseAutoFocus;
}
