/** The sidebar puts a search box, three selects and N session buttons ahead of
 *  the board, so keyboard users otherwise tab through all of it on every load. */
export function SkipNav() {
  return (
    <a
      href="#main"
      className="sr-only rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100]"
    >
      Skip to board
    </a>
  );
}
