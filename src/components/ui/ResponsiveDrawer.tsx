import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ResponsiveDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/** Left slide-in drawer for mobile/tablet navigation, built on native <dialog>. */
export function ResponsiveDrawer({ open, onClose, title, children }: ResponsiveDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="animate-drawer-in m-0 h-dvh max-h-dvh w-[min(20rem,88vw)] max-w-none border-r border-line bg-surface p-0 text-ink"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-sm font-semibold text-muted">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 cursor-pointer items-center justify-center rounded-md hover:bg-[#eef1f2]"
            aria-label="Tutup menu"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
