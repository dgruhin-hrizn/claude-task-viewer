import { useState } from 'react';
import { useAddNote } from '@/hooks/useTaskMutations';

export function NoteForm({ sessionId, taskId }: { sessionId: string; taskId: string }) {
  const [note, setNote] = useState('');
  const add = useAddNote(sessionId);
  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        const v = note.trim();
        if (!v) return;
        add.mutate({ taskId, note: v }, { onSuccess: () => setNote('') });
      }}
    >
      <label htmlFor="note-input" className="text-[11px] uppercase tracking-wider text-text-muted">
        Add note
      </label>
      <textarea
        id="note-input"
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note for Claude…"
        className="mt-1 w-full resize-y rounded-md border border-border bg-elevated p-2 text-[16px] text-foreground placeholder:text-text-muted md:text-xs"
      />
      <button
        type="submit"
        disabled={!note.trim() || add.isPending}
        className="mt-2 min-h-9 rounded-md bg-primary px-4 text-sm text-primary-foreground disabled:opacity-50"
      >
        {add.isPending ? 'Adding…' : 'Add Note'}
      </button>
      {add.isError && <p role="alert" className="mt-2 text-xs text-destructive">Could not add the note.</p>}
    </form>
  );
}
