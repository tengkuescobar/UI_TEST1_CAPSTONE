import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  RotateCcw,
  User,
  ShieldAlert,
  Building2,
  ExternalLink,
  Check,
} from 'lucide-react';
import { ROLE_HOME, ROLE_LABEL, ROLE_PERSONA } from '../../data/status';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { ResponsiveDrawer } from '../ui/ResponsiveDrawer';
import { DashboardSidebar } from './DashboardSidebar';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { cx, formatDateTime } from '../../lib/format';

interface Props {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { role, persona, notifications, markNotificationRead, markAllRead, resetDemo } = useStore();
  const { toast } = useToast();

  const roleNotifs = notifications.filter((n) => n.role === role);
  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  const handleReset = () => {
    resetDemo();
    toast({
      title: 'Data Demo Direset',
      description: 'Seluruh permohonan dan status dikembalikan ke kondisi awal contoh.',
      tone: 'info',
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      {/* Top Banner Role Switcher */}
      <DemoRoleSwitcher />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-72 lg:shrink-0">
          <DashboardSidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        <ResponsiveDrawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title={`Menu Dashboard ${ROLE_LABEL[role]}`}
        >
          <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
        </ResponsiveDrawer>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Top header bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex size-10 items-center justify-center rounded-[var(--radius-ui)] border border-line lg:hidden"
                aria-label="Buka menu navigasi"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted hidden sm:inline">
                  Portal {ROLE_LABEL[role]}
                </span>
                {title && <h2 className="text-base font-bold text-primary-dark truncate">{title}</h2>}
              </div>
            </div>

            {/* Actions: Notifications, Reset demo, User capsule */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Reset demo data button */}
              <button
                type="button"
                onClick={handleReset}
                title="Reset simulasi data ke awal"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] border border-line px-2.5 text-xs font-semibold text-muted hover:bg-[#f4f6f7] hover:text-ink transition-colors"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>

              {/* Notification Popover Button */}
              <button
                type="button"
                onClick={() => setNotifOpen(true)}
                className="relative flex size-10 items-center justify-center rounded-[var(--radius-ui)] border border-line bg-surface hover:bg-[#f4f6f7] transition-colors"
                aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
              >
                <Bell className="size-4.5 text-muted-strong" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-danger text-[11px] font-bold text-white tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Persona Chip */}
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-[#f8f9f9] pl-1 pr-3 py-1">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                  {role.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-ink truncate max-w-[120px]">
                  {persona.name}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      {/* Notifications Drawer */}
      <ResponsiveDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        title={`Notifikasi (${unreadCount} belum dibaca)`}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Peran: {ROLE_LABEL[role]}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead(role)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {roleNotifs.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">Belum ada notifikasi untuk peran ini.</p>
          ) : (
            <ul className="divide-y divide-line">
              {roleNotifs.map((n) => (
                <li
                  key={n.id}
                  className={cx(
                    'py-3 transition-colors',
                    n.read ? 'opacity-70' : 'bg-sand-soft/30 -mx-2 px-2 rounded-md font-medium',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-ink">{n.title}</p>
                    {!n.read && (
                      <span className="size-2 rounded-full bg-terracotta shrink-0 mt-1" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-strong">{n.body}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                    <span>{formatDateTime(n.at)}</span>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className="font-semibold text-primary hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ResponsiveDrawer>
    </div>
  );
}
