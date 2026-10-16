import type { ServiceCase } from '../../types';
import { cx } from '../../lib/format';

interface Props {
  cases: ServiceCase[];
  value: string;
  onChange: (caseId: string) => void;
  label?: string;
}

/** Radio-group style selector; changing it updates requirements immediately. */
export function ServiceCaseSelector({ cases, value, onChange, label = 'Pilih kondisi Anda' }: Props) {
  if (cases.length <= 1) return null;
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-ink">{label}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cases.map((c) => {
          const checked = c.id === value;
          return (
            <label
              key={c.id}
              className={cx(
                'flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-ui)] border p-3 transition-colors duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta',
                checked ? 'border-primary bg-[#eef4f7]' : 'border-line bg-surface hover:border-[#b9c5ca]',
              )}
            >
              <input
                type="radio"
                name="service-case"
                value={c.id}
                checked={checked}
                onChange={() => onChange(c.id)}
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{c.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{c.summary}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
