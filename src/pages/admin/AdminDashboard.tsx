import { Link } from 'react-router-dom';
import { Users, Settings, Tags, History, Shield, ArrowRight } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDateTime } from '../../lib/format';

export function AdminDashboard() {
  const { users, services, categories, audit } = useStore();

  return (
    <DashboardLayout title="Ikhtisar Admin Sistem">
      <div className="space-y-8">
        <div className="card p-6 sm:p-8 bg-surface border-line">
          <span className="eyebrow">Pengelola Sistem</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mt-1">
            Panel Administrasi & Konfigurasi Sistem
          </h1>
          <p className="text-xs sm:text-sm text-muted-strong mt-1 max-w-2xl">
            Kelola akun pengguna, peran akses petugas, katalog layanan administrasi, kategori pengaduan, dan pantau catatan audit log.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Pengguna Terdaftar</span>
            <p className="text-3xl font-extrabold text-primary-dark mt-1 tabular-nums">
              {users.length}
            </p>
            <p className="text-xs text-muted mt-1">{users.filter((u) => u.active).length} akun aktif</p>
          </div>

          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Katalog Layanan</span>
            <p className="text-3xl font-extrabold text-primary-dark mt-1 tabular-nums">
              {services.length}
            </p>
            <p className="text-xs text-muted mt-1">7 Adminduk, 2 Surat Demo</p>
          </div>

          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Kategori Pengaduan</span>
            <p className="text-3xl font-extrabold text-terracotta mt-1 tabular-nums">
              {categories.length}
            </p>
            <p className="text-xs text-muted mt-1">Topik keluhan warga</p>
          </div>

          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Catatan Log Audit</span>
            <p className="text-3xl font-extrabold text-green mt-1 tabular-nums">
              {audit.length}
            </p>
            <p className="text-xs text-muted mt-1">Riwayat aktivitas terekam</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/pengguna"
            className="card p-6 bg-surface hover:border-primary transition-all flex items-start gap-4"
          >
            <div className="size-11 rounded-[var(--radius-ui)] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-primary-dark">Manajemen Pengguna & Peran</h2>
              <p className="text-xs text-muted mt-1">
                Kelola hak akses untuk akun Warga, Petugas Pelayanan, Lurah, dan Administrator.
              </p>
            </div>
            <ArrowRight className="size-4 text-muted shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/audit"
            className="card p-6 bg-surface hover:border-primary transition-all flex items-start gap-4"
          >
            <div className="size-11 rounded-[var(--radius-ui)] bg-green/10 text-green flex items-center justify-center shrink-0">
              <History className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-primary-dark">Pemeriksaan Log Audit</h2>
              <p className="text-xs text-muted mt-1">
                Pantau setiap aksi perubahan status berkas, otorisasi surat, dan pembaruan sistem.
              </p>
            </div>
            <ArrowRight className="size-4 text-muted shrink-0 mt-1" />
          </Link>
        </div>

        {/* Recent Audit Activities */}
        <section className="card p-6 bg-surface" aria-labelledby="audit-terkini-title">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
            <h2 id="audit-terkini-title" className="text-base font-bold text-primary-dark">
              Catatan Aktivitas Terbaru (Audit Trail)
            </h2>
            <Link to="/admin/audit" className="text-xs font-bold text-primary hover:underline">
              Buka Semua Log &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {audit.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-md bg-[#f8f9f9] text-xs"
              >
                <div>
                  <span className="font-bold text-ink">{a.action}: </span>
                  <span className="text-primary font-semibold">{a.target}</span>
                  <span className="text-muted block mt-0.5">
                    Oleh: {a.actor} ({a.role})
                  </span>
                </div>
                <span className="text-muted font-mono">{formatDateTime(a.at)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
