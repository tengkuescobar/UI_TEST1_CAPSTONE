import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  MessageSquarePlus,
  MessageSquare,
  User,
  CheckSquare,
  BarChart3,
  Users,
  Settings,
  Tags,
  History,
  Building2,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import type { Role } from '../../types';
import { ROLE_LABEL, ROLE_PERSONA } from '../../data/status';
import { useStore } from '../../state/AppStore';
import { cx } from '../../lib/format';

interface Props {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: Props) {
  const { role, applications, complaints, notifications } = useStore();
  const location = useLocation();

  const unreadNotifs = notifications.filter((n) => n.role === role && !n.read).length;
  const pendingPetugas = applications.filter((a) => a.status === 'diajukan' || a.status === 'diverifikasi').length;
  const pendingLurah = applications.filter((a) => a.status === 'menunggu_persetujuan').length;
  const pendingAduan = complaints.filter((c) => c.status === 'diterima').length;

  interface NavItem {
    label: string;
    to: string;
    icon: typeof LayoutDashboard;
    badge?: number;
  }

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'warga':
        return [
          { label: 'Ringkasan', to: '/warga', icon: LayoutDashboard },
          { label: 'Ajukan Surat Baru', to: '/warga/pengajuan/baru', icon: FilePlus },
          { label: 'Riwayat Pengajuan', to: '/warga/pengajuan', icon: FileText },
          { label: 'Buat Pengaduan', to: '/warga/pengaduan/baru', icon: MessageSquarePlus },
          { label: 'Daftar Pengaduan', to: '/warga/pengaduan', icon: MessageSquare },
          { label: 'Profil Saya', to: '/warga/profil', icon: User },
        ];
      case 'petugas':
        return [
          { label: 'Antrean Pelayanan', to: '/petugas', icon: LayoutDashboard },
          { label: 'Pengajuan Masuk', to: '/petugas/pengajuan', icon: FileText, badge: pendingPetugas },
          { label: 'Pengaduan Warga', to: '/petugas/pengaduan', icon: MessageSquare, badge: pendingAduan },
        ];
      case 'lurah':
        return [
          { label: 'Dashboard Eksekutif', to: '/lurah', icon: LayoutDashboard },
          { label: 'Persetujuan Dokumen', to: '/lurah/persetujuan', icon: CheckSquare, badge: pendingLurah },
          { label: 'Laporan & Monitoring', to: '/lurah/laporan', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { label: 'Ikhtisar Sistem', to: '/admin', icon: LayoutDashboard },
          { label: 'Manajemen Pengguna', to: '/admin/pengguna', icon: Users },
          { label: 'Katalog Layanan', to: '/admin/layanan', icon: Settings },
          { label: 'Kategori Pengaduan', to: '/admin/kategori', icon: Tags },
          { label: 'Riwayat Audit Log', to: '/admin/audit', icon: History },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const persona = ROLE_PERSONA[role];

  const isActive = (to: string) => {
    if (to === `/warga` || to === `/petugas` || to === `/lurah` || to === `/admin`) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  return (
    <aside className="flex h-full flex-col bg-surface border-r border-line">
      {/* Brand & Context */}
      <div className="border-b border-line p-5">
        <Link to="/" className="flex items-center gap-3 focus-visible:outline-none">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-ui)] bg-primary-dark text-sand">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-sm text-primary-dark truncate">
              Kelurahan Pesanggrahan
            </span>
            <span className="block text-xs text-muted">Portal Internal Digital</span>
          </div>
        </Link>
      </div>

      {/* User profile capsule in sidebar */}
      <div className="p-4 mx-3 my-3 rounded-[var(--radius-ui)] bg-[#f4f6f7] border border-line/60">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs uppercase">
            {role.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-ink truncate">{persona.name}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta">
              <Shield className="size-3" aria-hidden="true" />
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Navigasi Menu Dashboard">
        {navItems.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cx(
                'group flex min-h-11 items-center justify-between rounded-[var(--radius-ui)] px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150',
                active
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-strong hover:bg-[#f4f6f7] hover:text-ink',
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cx(
                    'size-4.5 shrink-0 transition-colors',
                    active ? 'text-white' : 'text-muted group-hover:text-primary',
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={cx(
                    'ml-2 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums',
                    active ? 'bg-white text-primary' : 'bg-terracotta text-white',
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer navigation (Exit to public) */}
      <div className="border-t border-line p-4 space-y-2">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-h-10 items-center gap-2 rounded-[var(--radius-ui)] px-3 py-2 text-xs font-bold text-muted hover:bg-[#f4f6f7] hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Lihat Halaman Publik
        </Link>
      </div>
    </aside>
  );
}
