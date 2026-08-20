import { useEffect } from 'react';

/** Ignores keystrokes while typing, which the vanilla handler also did -- but
 *  it checked tagName only, so a contenteditable or a Radix combobox would
 *  still have swallowed 'D' as a delete. */
function isTyping(el: EventTarget | null): boolean {
  const n = el as HTMLElement | null;
  if (!n) return false;
  const tag = n.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || n.isContentEditable === true;
}

export function useKeyboardShortcuts(handlers: {
  onHelp?: () => void;
  onEscape?: () => void;
  onDelete?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handlers.onEscape?.(); return; }
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '?') { e.preventDefault(); handlers.onHelp?.(); }
      else if (e.key === 'd' || e.key === 'D') { e.preventDefault(); handlers.onDelete?.(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handlers]);
}
