import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Building2, Search, ArrowRight, User } from 'lucide-react';
import { SITE } from '../../data/site';
import { ROLE_HOME } from '../../data/status';
import { useStore } from '../../state/AppStore';
import { ResponsiveDrawer } from '../ui/ResponsiveDrawer';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { cx } from '../../lib/format';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { role } = useStore();

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Layanan Administrasi', to: '/layanan' },
    { label: 'Pengaduan Warga', to: '/pengaduan' },
    { label: 'Panduan Layanan', to: '/panduan' },
    { label: 'Lacak Status', to: '/lacak' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>

      {/* Top Banner for Capstone Demo Role Switcher */}
      <DemoRoleSwitcher />

      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="container-page flex h-20 items-center justify-between gap-4">
          {/* Institutional Brand */}
          <Link
            to="/"
            className="flex items-center gap-3.5 focus-visible:outline-none"
            aria-label="Beranda Kelurahan Pesanggrahan"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-ui)] bg-primary-dark text-sand shadow-xs">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block text-base font-extrabold tracking-tight text-primary-dark sm:text-lg">
                {SITE.name}
              </span>
              <span className="block text-xs font-medium text-muted truncate">
                {SITE.region}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navigasi Utama">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cx(
                  'rounded-[var(--radius-ui)] px-3.5 py-2 text-sm font-semibold transition-colors duration-150',
                  isActive(link.to)
                    ? 'bg-[#eef4f7] text-primary-dark'
                    : 'text-muted-strong hover:bg-[#f4f6f7] hover:text-ink',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Auth / Dashboard CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {role === 'pengunjung' ? (
              <>
                <Link
                  to="/masuk"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] px-4 py-2 text-sm font-bold text-primary-dark hover:bg-[#eef4f7] transition-colors"
                >
                  <User className="size-4" aria-hidden="true" />
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-primary-dark transition-colors"
                >
                  Daftar Akun
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <Link
                to={ROLE_HOME[role]}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-terracotta px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#855339] transition-colors"
              >
                Dashboard {role.toUpperCase()}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex size-11 items-center justify-center rounded-[var(--radius-ui)] border border-line bg-surface text-ink hover:bg-[#f4f6f7]"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <ResponsiveDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Menu Navigasi"
      >
        <div className="flex flex-col gap-1 p-4">
          <div className="mb-4 pb-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-[var(--radius-ui)] bg-primary-dark text-sand">
                <Building2 className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-sm text-primary-dark">{SITE.name}</p>
                <p className="text-xs text-muted">Kota Jakarta Selatan</p>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-muted px-3 py-1">
            Navigasi Halaman
          </p>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={cx(
                'flex min-h-11 items-center rounded-[var(--radius-ui)] px-3 py-2.5 text-base font-semibold',
                isActive(link.to)
                  ? 'bg-primary text-white'
                  : 'text-ink hover:bg-[#f4f6f7]',
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 pt-6 border-t border-line flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted px-3 py-1">
              Akses Pengguna
            </p>
            {role === 'pengunjung' ? (
              <>
                <Link
                  to="/masuk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-[var(--radius-ui)] border border-line bg-surface text-base font-bold text-primary-dark"
                >
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-[var(--radius-ui)] bg-primary text-base font-bold text-white"
                >
                  Daftar Akun
                </Link>
              </>
            ) : (
              <Link
                to={ROLE_HOME[role]}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-[var(--radius-ui)] bg-terracotta text-base font-bold text-white"
              >
                Buka Dashboard ({role})
              </Link>
            )}
          </div>
        </div>
      </ResponsiveDrawer>
    </>
  );
}
