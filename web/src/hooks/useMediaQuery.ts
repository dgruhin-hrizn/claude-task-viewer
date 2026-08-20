import { useEffect, useState } from 'react';

/** Matches the breakpoints the shipped vanilla CSS uses, so behaviour can't drift. */
export const BREAKPOINTS = {
  /** below this the sidebar becomes a drawer and the detail panel a sheet */
  drawer: '(max-width: 1023px)',
  /** below this the kanban collapses to one column behind status tabs */
  phone: '(max-width: 767px)',
  /** capability, not width -- also covers touch laptops and iPads */
  touch: '(hover: none)',
} as const;

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}
