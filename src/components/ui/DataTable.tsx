import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Hide on mobile card layout. */
  hideOnMobile?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Primary column rendered as the card heading on mobile. */
  primaryKey?: string;
  actions?: (row: T) => ReactNode;
}

/** Table on md+; stacked cards on small screens to avoid horizontal scrolling. */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  emptyTitle = 'Belum ada data',
  emptyDescription = 'Data akan muncul di sini setelah tersedia.',
  primaryKey,
  actions,
}: DataTableProps<T>) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const primary = columns.find((c) => c.key === primaryKey) ?? columns[0];
  const rest = columns.filter((c) => c !== primary && !c.hideOnMobile);

  return (
    <div className="card overflow-hidden">
      <table className="hidden w-full text-left text-sm md:table">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-line bg-[#f8f9f9] text-xs font-semibold tracking-wide text-muted uppercase">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="px-4 py-3">
                {c.header}
              </th>
            ))}
            {actions && (
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Aksi</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-[#fafbfb]">
              {columns.map((c) => (
                <td key={c.key} className={c.className ?? 'px-4 py-3.5 align-middle'}>
                  {c.render(row)}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-line md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="p-4">
            <div className="font-semibold text-ink">{primary.render(row)}</div>
            <dl className="mt-2 grid grid-cols-1 gap-1.5 text-sm">
              {rest.map((c) => (
                <div key={c.key} className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="text-muted">{c.header}</dt>
                  <dd className="text-right text-ink">{c.render(row)}</dd>
                </div>
              ))}
            </dl>
            {actions && <div className="mt-3 flex flex-wrap gap-2">{actions(row)}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
