import type { ProcedureStep } from '../../types';

export function ProcedureTimeline({ steps }: { steps: ProcedureStep[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && <span className="absolute top-9 bottom-0 left-[17px] w-px bg-line" aria-hidden="true" />}
          <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-[#eef4f7] text-sm font-bold text-primary tabular-nums">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="text-sm font-bold text-ink">{s.title}</h3>
            <p className="mt-0.5 text-sm text-muted">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
