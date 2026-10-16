import { Check } from 'lucide-react';
import { cx } from '../../lib/format';

export function ApplicationStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <nav aria-label="Langkah pengajuan">
      <p className="mb-3 text-sm font-semibold text-muted sm:hidden">
        Langkah {current + 1} dari {steps.length}: <span className="text-ink">{steps[current]}</span>
      </p>
      <ol className="flex items-center gap-2">
        {steps.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          return (
            <li key={s} className="flex min-w-0 flex-1 items-center gap-2" aria-current={state === 'current' ? 'step' : undefined}>
              <span
                className={cx(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums',
                  state === 'done' && 'bg-green text-white',
                  state === 'current' && 'bg-primary text-white',
                  state === 'todo' && 'border border-line bg-surface text-muted',
                )}
              >
                {state === 'done' ? <Check className="size-4" aria-hidden="true" /> : i + 1}
                <span className="sr-only">{state === 'done' ? ' (selesai)' : state === 'current' ? ' (saat ini)' : ''}</span>
              </span>
              <span className={cx('hidden truncate text-sm sm:inline', state === 'current' ? 'font-semibold text-ink' : 'text-muted')}>{s}</span>
              {i < steps.length - 1 && <span className={cx('h-px flex-1', i < current ? 'bg-green' : 'bg-line')} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
