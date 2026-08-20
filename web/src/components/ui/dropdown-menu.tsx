import * as React from 'react';
import * as M from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

export const DropdownMenu = M.Root;
export const DropdownMenuTrigger = M.Trigger;

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof M.Content>,
  React.ComponentPropsWithoutRef<typeof M.Content>
>(({ className, ...props }, ref) => (
  <M.Portal>
    <M.Content
      ref={ref}
      sideOffset={6}
      align="end"
      className={cn('z-50 min-w-[11rem] rounded-md border border-border bg-popover p-1 shadow-lg', className)}
      {...props}
    />
  </M.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof M.Item>,
  React.ComponentPropsWithoutRef<typeof M.Item>
>(({ className, ...props }, ref) => (
  <M.Item
    ref={ref}
    className={cn(
      'flex min-h-11 cursor-pointer select-none items-center gap-2.5 rounded px-2.5 text-sm outline-none',
      'text-text-secondary data-[highlighted]:bg-hover data-[highlighted]:text-foreground md:min-h-9 md:text-xs',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';
