import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-sand-soft text-terracotta" aria-hidden="true">
        {icon ?? <Inbox className="size-6" />}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Memuat data…' }: { label?: string }) {
  return (
    <div role="status" className="card flex items-center gap-3 p-6 text-sm text-muted">
      <span className="size-4 animate-spin rounded-full border-2 border-line border-t-primary" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div role="alert" className="card border-danger/30 px-6 py-10 text-center">
      <h3 className="text-lg font-bold text-danger">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
