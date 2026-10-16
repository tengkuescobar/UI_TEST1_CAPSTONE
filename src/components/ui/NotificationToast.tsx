import { CheckCircle2, Info, TriangleAlert, XCircle, X } from 'lucide-react';
import { cx } from '../../lib/format';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: 'success' | 'info' | 'warning' | 'danger';
}

const icons = {
  success: <CheckCircle2 className="size-5 text-green" aria-hidden="true" />,
  info: <Info className="size-5 text-primary" aria-hidden="true" />,
  warning: <TriangleAlert className="size-5 text-terracotta" aria-hidden="true" />,
  danger: <XCircle className="size-5 text-danger" aria-hidden="true" />,
};

export function NotificationToast({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cx(
            'animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-raised)]',
          )}
        >
          {icons[t.tone ?? 'success']}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{t.title}</p>
            {t.description && <p className="mt-0.5 text-sm text-muted">{t.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="-m-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-[#eef1f2] hover:text-ink"
            aria-label="Tutup notifikasi"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
