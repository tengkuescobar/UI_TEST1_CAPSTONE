import type { ApplicationStatus, ComplaintStatus } from '../../types';
import { APPLICATION_STATUS, COMPLAINT_STATUS, type Tone } from '../../data/status';
import { cx } from '../../lib/format';

const toneClass: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: 'bg-[#eef1f2] text-[#3d4c56] border-[#d5dcdf]', dot: 'bg-[#6b7a84]' },
  info: { box: 'bg-[#e8f0f4] text-primary-dark border-[#c8d8e0]', dot: 'bg-primary' },
  accent: { box: 'bg-sand-soft text-[#6e4630] border-sand', dot: 'bg-terracotta' },
  warning: { box: 'bg-[#fbf1df] text-[#7a4f0f] border-[#efd9ae]', dot: 'bg-[#b7791f]' },
  success: { box: 'bg-[#e7f1eb] text-[#2f5a42] border-[#c5ddcf]', dot: 'bg-green' },
  danger: { box: 'bg-[#fbecea] text-[#8a2f24] border-[#efc9c3]', dot: 'bg-danger' },
};

export function StatusBadge({ label, tone, className }: { label: string; tone: Tone; className?: string }) {
  const c = toneClass[tone];
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap', c.box, className)}>
      <span className={cx('size-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {label}
    </span>
  );
}

export const ApplicationStatusBadge = ({ status }: { status: ApplicationStatus }) => (
  <StatusBadge label={APPLICATION_STATUS[status].label} tone={APPLICATION_STATUS[status].tone} />
);

export const ComplaintStatusBadge = ({ status }: { status: ComplaintStatus }) => (
  <StatusBadge label={COMPLAINT_STATUS[status].label} tone={COMPLAINT_STATUS[status].tone} />
);
