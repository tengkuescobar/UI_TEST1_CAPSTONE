import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Requirement } from '../../types';
import { CONDITION_LABEL } from '../../data/services';
import { splitRequirements } from '../../lib/requirements';
import { StatusBadge } from '../ui/StatusBadge';
import { cx } from '../../lib/format';

interface Props {
  requirements: Requirement[];
  /** Personal checklist: lets users tick what they've prepared (local only). */
  interactive?: boolean;
  resetKey?: string;
}

export function RequirementChecklist({ requirements, interactive = true, resetKey }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [lastKey, setLastKey] = useState(resetKey);
  if (resetKey !== lastKey) {
    setLastKey(resetKey);
    setChecked({});
  }

  const { required, conditional } = splitRequirements(requirements);
  const done = required.filter((r) => checked[r.id]).length;

  const renderItem = (r: Requirement) => {
    const isChecked = !!checked[r.id];
    const content = (
      <>
        <span className="min-w-0 flex-1">
          <span className={cx('block text-sm font-medium text-ink', isChecked && 'text-muted line-through decoration-1')}>{r.label}</span>
          {r.detail && <span className="mt-0.5 block text-xs text-muted">{r.detail}</span>}
        </span>
        {r.condition !== 'required' && (
          <StatusBadge label={CONDITION_LABEL[r.condition]} tone={r.condition === 'if_needed' ? 'neutral' : 'accent'} className="mt-0.5 shrink-0" />
        )}
      </>
    );
    if (!interactive) {
      return (
        <li key={r.id} className="flex items-start gap-3 py-3">
          <Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />
          {content}
        </li>
      );
    }
    return (
      <li key={r.id}>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setChecked((c) => ({ ...c, [r.id]: !c[r.id] }))}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-green"
          />
          {content}
        </label>
      </li>
    );
  };

  return (
    <div aria-live="polite">
      {interactive && required.length > 0 && (
        <p className="mb-2 text-sm text-muted">
          Tandai dokumen yang sudah Anda siapkan: <strong className="text-ink tabular-nums">{done}/{required.length}</strong> dokumen wajib.
        </p>
      )}
      <h3 className="text-sm font-bold text-primary-dark">Dokumen wajib</h3>
      <ul className="divide-y divide-line">{required.map(renderItem)}</ul>
      {conditional.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-bold text-primary-dark">Dokumen kondisional</h3>
          <ul className="divide-y divide-line">{conditional.map(renderItem)}</ul>
        </>
      )}
    </div>
  );
}
