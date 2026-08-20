import { Dialog, DialogContent } from '@/components/ui/dialog';

const SHORTCUTS: [string, string][] = [
  ['?', 'Show this help'],
  ['Esc', 'Close panel or dialog'],
  ['D', 'Delete the selected task'],
  ['←  →', 'Move between status tabs (on phones)'],
];

export function HelpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Keyboard shortcuts" description="Available anywhere except while typing.">
        {/* the vanilla help modal styled every cell inline; this is a plain table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {SHORTCUTS.map(([key, what]) => (
                <tr key={key}>
                  <td className="py-1.5 pr-4">
                    <kbd className="rounded bg-hover px-2 py-0.5 font-mono text-xs text-foreground">{key}</kbd>
                  </td>
                  <td className="py-1.5 text-text-secondary">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
