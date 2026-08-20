import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, btn } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

/** One AlertDialog covers delete-task, delete-all and the blocked warning.
 *  They differ only in copy and whether there is a destructive action. */
export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel, onConfirm, tone = 'danger',
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  tone?: 'danger' | 'primary';
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent title={title} description={description}>
        <AlertDialogCancel className={cn(btn.base, btn.ghost)}>
          {confirmLabel ? 'Cancel' : 'OK'}
        </AlertDialogCancel>
        {confirmLabel && (
          <AlertDialogAction onClick={onConfirm} className={cn(btn.base, tone === 'danger' ? btn.danger : btn.primary)}>
            {confirmLabel}
          </AlertDialogAction>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
