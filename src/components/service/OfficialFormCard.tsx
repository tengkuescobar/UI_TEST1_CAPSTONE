import { ExternalLink, FileDown } from 'lucide-react';
import type { OfficialForm } from '../../types';

export function OfficialFormCard({ form }: { form: OfficialForm }) {
  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-ui)] border border-line bg-surface p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-ui)] bg-sand-soft text-terracotta" aria-hidden="true">
        <FileDown className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">Kode {form.code}</p>
        <h3 className="text-sm font-bold text-ink">{form.title}</h3>
        <p className="mt-0.5 text-sm text-muted">{form.description}</p>
        <a
          href={form.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] border border-[#c3ccd0] px-3 text-sm font-semibold text-primary-dark transition-colors hover:border-primary hover:bg-[#f2f5f6]"
        >
          Buka formulir
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">(membuka Google Drive di tab baru)</span>
        </a>
      </div>
    </div>
  );
}
