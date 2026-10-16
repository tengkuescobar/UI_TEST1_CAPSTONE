import type { ReactNode } from 'react';
import { Info, TriangleAlert } from 'lucide-react';
import { cx } from '../../lib/format';

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted-strong">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Callout({ tone = 'info', title, children, className }: { tone?: 'info' | 'warning'; title?: string; children: ReactNode; className?: string }) {
  const Icon = tone === 'info' ? Info : TriangleAlert;
  return (
    <div
      className={cx(
        'flex gap-3 rounded-[var(--radius-ui)] border p-4 text-sm',
        tone === 'info' ? 'border-[#c8d8e0] bg-[#eef4f7] text-primary-dark' : 'border-sand bg-sand-soft text-[#5f3c29]',
        className,
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon && <span className="text-primary" aria-hidden="true">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold text-primary-dark tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function SectionCard({ title, children, actions, className }: { title: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <section className={cx('card p-5 sm:p-6', className)} aria-label={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
