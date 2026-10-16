import { useLocation, useNavigate } from 'react-router-dom';
import { UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import type { Role } from '../../types';
import { ROLE_HOME, ROLE_LABEL, ROLE_PERSONA } from '../../data/status';
import { useStore } from '../../state/AppStore';
import { cx } from '../../lib/format';

interface Props {
  compact?: boolean;
}

export function DemoRoleSwitcher({ compact = false }: Props) {
  const { role, setRole } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    // If user is switching to a different role dashboard or from public to role dashboard
    const home = ROLE_HOME[nextRole];
    if (nextRole === 'pengunjung') {
      if (!location.pathname.startsWith('/layanan') && !location.pathname.startsWith('/panduan') && !location.pathname.startsWith('/lacak') && location.pathname !== '/') {
        navigate('/');
      }
    } else {
      navigate(home);
    }
  };

  const roles: Role[] = ['pengunjung', 'warga', 'petugas', 'lurah', 'admin'];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <label htmlFor="role-select-compact" className="sr-only">
          Pilih Peran Demo
        </label>
        <span className="text-xs font-semibold text-muted flex items-center gap-1">
          <Sparkles className="size-3 text-terracotta" aria-hidden="true" />
          Peran:
        </span>
        <select
          id="role-select-compact"
          value={role}
          onChange={(e) => handleRoleChange(e.target.value as Role)}
          className="rounded border border-line bg-surface px-2.5 py-1 text-xs font-bold text-primary-dark shadow-xs focus-visible:outline-2 focus-visible:outline-terracotta"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="border-b border-sand bg-[#f5ede2] px-4 py-2 text-xs text-[#523e32]">
      <div className="container-page flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-[#e7d8c4] px-2 py-0.5 font-bold uppercase tracking-wider text-[11px] text-[#69432f]">
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            Prototipe Capstone
          </span>
          <span className="hidden sm:inline text-muted-strong font-medium">
            Simulasi frontend tanpa backend. Masuk sebagai:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map((r) => {
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                aria-pressed={active}
                className={cx(
                  'inline-flex min-h-[30px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all duration-150',
                  active
                    ? 'bg-primary-dark text-white shadow-xs'
                    : 'bg-surface/80 text-ink hover:bg-surface hover:text-primary-dark border border-line/60',
                )}
              >
                {active && <UserCheck className="size-3 text-sand" aria-hidden="true" />}
                <span>{ROLE_LABEL[r]}</span>
                {r !== 'pengunjung' && (
                  <span className={cx('text-[10px] opacity-75 hidden md:inline', active ? 'text-sand' : 'text-muted')}>
                    ({ROLE_PERSONA[r].name.split(' ')[0]})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
