import * as React from 'react';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOverlayFocus } from '@/hooks/useRestoreFocus';

const OverlayFocusContext = React.createContext<((e: Event) => void) | null>(null);

/** Wraps Root so the opener is captured during the open transition, while the
 *  trigger is still document.activeElement. */
export function Dialog({
  open, onOpenChange, children,
}: { open?: boolean; onOpenChange?: (o: boolean) => void; children: React.ReactNode }) {
  const onCloseAutoFocus = useOverlayFocus(!!open);
  return (
    <OverlayFocusContext.Provider value={onCloseAutoFocus}>
      <D.Root open={open} onOpenChange={onOpenChange}>{children}</D.Root>
    </OverlayFocusContext.Provider>
  );
}
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof D.Content>,
  React.ComponentPropsWithoutRef<typeof D.Content> & { title: string; description?: string }
>(({ className, children, title, description, ...props }, ref) => {
  const ctxCloseAutoFocus = React.useContext(OverlayFocusContext);
  return (
  <D.Portal>
    <D.Overlay className="fixed inset-0 z-50 bg-black/60" />
    <D.Content
      ref={ref}
      onCloseAutoFocus={(e) => ctxCloseAutoFocus?.(e)}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-[calc(100%-24px)] max-w-lg -translate-x-1/2 -translate-y-1/2',
        'rounded-lg border border-border bg-surface p-5 shadow-xl',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        {/* DialogTitle renders an h2, which sits correctly under the page h1 */}
        <D.Title className="font-serif text-lg text-foreground">{title}</D.Title>
        <D.Close aria-label="Close dialog" className="flex size-8 items-center justify-center rounded text-text-tertiary hover:text-foreground">
          <X className="size-4" />
        </D.Close>
      </div>
      {description ? <D.Description className="mt-1 text-xs text-text-tertiary">{description}</D.Description> : null}
      <div className="mt-4">{children}</div>
    </D.Content>
  </D.Portal>
  );
});
DialogContent.displayName = 'DialogContent';
