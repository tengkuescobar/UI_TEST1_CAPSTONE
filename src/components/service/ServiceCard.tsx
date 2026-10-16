import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, Send } from 'lucide-react';
import type { Service } from '../../types';
import { CATEGORY_LABEL } from '../../data/services';
import { StatusBadge } from '../ui/StatusBadge';

export function ServiceCard({ service }: { service: Service }) {
  const isDemo = service.serviceMode === 'demo_submission';
  return (
    <article className="card group relative flex h-full flex-col p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-raised)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-ui)] ${isDemo ? 'bg-sand-soft text-terracotta' : 'bg-[#eaf0f3] text-primary'}`}
          aria-hidden="true"
        >
          {isDemo ? <FileText className="size-5" /> : <BookOpen className="size-5" />}
        </span>
        <StatusBadge
          label={isDemo ? 'Pengajuan demo' : 'Informasi saja'}
          tone={isDemo ? 'accent' : 'neutral'}
        />
      </div>
      <p className="mt-4 text-xs font-semibold tracking-wide text-muted uppercase">
        {service.group ?? CATEGORY_LABEL[service.category]}
      </p>
      <h3 className="mt-1 text-lg font-bold">
        <Link
          to={`/layanan/${service.id}`}
          className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none"
        >
          {service.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted">{service.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="text-muted">
          {service.cases.length > 1 ? `${service.cases.length} kondisi layanan` : 'Persyaratan & prosedur'}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:text-primary-dark">
          {isDemo ? <Send className="size-4" aria-hidden="true" /> : null}
          Lihat detail
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
