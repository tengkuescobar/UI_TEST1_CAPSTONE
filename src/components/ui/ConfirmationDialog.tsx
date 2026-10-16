import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { TextAreaField } from './Field';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger' | 'success';
  /** When set, a note textarea is shown. */
  noteLabel?: string;
  noteRequired?: boolean;
  onConfirm: (note: string) => void;
  onClose: () => void;
}

/** Native <dialog> provides focus containment, Esc handling, and inert background. */
export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Batal',
  tone = 'primary',
  noteLabel,
  noteRequired,
  onConfirm,
  onClose,
}: ConfirmationDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setNote('');
      setError('');
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const submit = () => {
    if (noteLabel && noteRequired && !note.trim()) {
      setError('Catatan wajib diisi.');
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-desc`}
      onClose={onClose}
      onCancel={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[var(--radius-card)] border border-line bg-surface p-0 text-ink shadow-[var(--shadow-raised)]"
    >
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="p-6"
      >
        <h2 id={`${id}-title`} className="text-xl font-bold">
          {title}
        </h2>
        <div id={`${id}-desc`} className="mt-2 text-sm text-muted">
          {description}
        </div>
        {noteLabel && (
          <div className="mt-5">
            <TextAreaField
              id={`${id}-note`}
              label={noteLabel}
              required={noteRequired}
              value={note}
              error={error}
              rows={3}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
            />
          </div>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant={tone}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
