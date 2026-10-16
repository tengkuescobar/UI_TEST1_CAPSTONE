import { Check } from 'lucide-react';
import type { ApplicationStatus, TimelineEntry } from '../../types';
import { APPLICATION_STAGES, APPLICATION_STATUS, ROLE_LABEL } from '../../data/status';
import { formatDateTime, cx } from '../../lib/format';

export function ActivityTimeline({ entries }: { entries: TimelineEntry[] }) {
  const sorted = [...entries].reverse();
  return (
    <ol className="space-y-0">
      {sorted.map((e, i) => (
        <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < sorted.length - 1 && <span className="absolute top-4 bottom-0 left-[5px] w-px bg-line" aria-hidden="true" />}
          <span className={cx('relative mt-1.5 size-[11px] shrink-0 rounded-full border-2', i === 0 ? 'border-primary bg-primary' : 'border-[#b9c5ca] bg-surface')} aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{e.title}</p>
            <p className="text-xs text-muted">
              {formatDateTime(e.at)} · {e.actor} ({ROLE_LABEL[e.role]})
            </p>
            {e.note && <p className="mt-1 rounded-md bg-[#f4f6f7] px-3 py-2 text-sm text-ink">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Horizontal/vertical progress tracker for the application lifecycle. */
export function StatusProgress({ status }: { status: ApplicationStatus }) {
  const stageIndex =
    status === 'perlu_perbaikan' ? 0 : status === 'ditolak' ? -1 : APPLICATION_STAGES.indexOf(status);
  return (
    <div>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-2" aria-label="Tahapan pengajuan">
        {APPLICATION_STAGES.map((s, i) => {
          const done = stageIndex > i || (status === 'selesai' && i === stageIndex);
          const current = stageIndex === i && status !== 'selesai';
          return (
            <li key={s} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2" aria-current={current ? 'step' : undefined}>
              <span className={cx('h-1.5 w-8 shrink-0 rounded-full sm:w-full', done ? 'bg-green' : current ? 'bg-primary' : 'bg-line')} aria-hidden="true" />
              <span className={cx('flex items-center gap-1 text-xs', current ? 'font-bold text-ink' : done ? 'font-medium text-ink' : 'text-muted')}>
                {done && <Check className="size-3.5 text-green" aria-hidden="true" />}
                {APPLICATION_STATUS[s].label}
                <span className="sr-only">{done ? ' — selesai' : current ? ' — tahap saat ini' : ' — belum'}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm text-muted">{APPLICATION_STATUS[status].description}</p>
    </div>
  );
}
