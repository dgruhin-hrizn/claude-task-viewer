import * as React from 'react';
import * as A from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { useOverlayFocus } from '@/hooks/useRestoreFocus';

const OverlayFocusContext = React.createContext<((e: Event) => void) | null>(null);

export function AlertDialog({
  open, onOpenChange, children,
}: { open?: boolean; onOpenChange?: (o: boolean) => void; children: React.ReactNode }) {
  const onCloseAutoFocus = useOverlayFocus(!!open);
  return (
    <OverlayFocusContext.Provider value={onCloseAutoFocus}>
      <A.Root open={open} onOpenChange={onOpenChange}>{children}</A.Root>
    </OverlayFocusContext.Provider>
  );
}
export const AlertDialogAction = A.Action;
export const AlertDialogCancel = A.Cancel;

export const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof A.Content>,
  React.ComponentPropsWithoutRef<typeof A.Content> & { title: string; description: string }
>(({ className, children, title, description, ...props }, ref) => {
  const ctxCloseAutoFocus = React.useContext(OverlayFocusContext);
  return (
  <A.Portal>
    <A.Overlay className="fixed inset-0 z-50 bg-black/60" />
    <A.Content
      ref={ref}
      onCloseAutoFocus={(e) => ctxCloseAutoFocus?.(e)}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 -translate-y-1/2',
        'rounded-lg border border-border bg-surface p-5 shadow-xl',
        className,
      )}
      {...props}
    >
      <A.Title className="font-serif text-lg text-foreground">{title}</A.Title>
      <A.Description className="mt-2 text-sm text-text-secondary">{description}</A.Description>
      <div className="mt-5 flex justify-end gap-2">{children}</div>
    </A.Content>
  </A.Portal>
  );
});
AlertDialogContent.displayName = 'AlertDialogContent';

export const btn = {
  base: 'min-h-9 rounded-md px-4 text-sm',
  ghost: 'border border-border text-text-secondary hover:bg-elevated',
  danger: 'bg-destructive text-white hover:opacity-90',
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
};
