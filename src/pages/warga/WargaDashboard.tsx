import { Link } from 'react-router-dom';
import {
  FileText,
  FilePlus,
  MessageSquarePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge, ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function WargaDashboard() {
  const { persona, applications, complaints } = useStore();

  const myApps = applications.filter((a) => a.ownerId === persona.id);
  const myComplaints = complaints.filter((c) => c.ownerId === persona.id);

  const activeApps = myApps.filter((a) => a.status !== 'selesai' && a.status !== 'ditolak');
  const completedApps = myApps.filter((a) => a.status === 'selesai');
  const activeComplaints = myComplaints.filter((c) => c.status !== 'selesai' && c.status !== 'ditolak');

  return (
    <DashboardLayout title="Ringkasan Layanan Warga">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="card p-6 sm:p-8 bg-gradient-to-r from-surface to-sand-soft/40 border-line">
          <span className="eyebrow">Portal Pelayanan Digital</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mt-1">
            Selamat Datang, {persona.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-strong mt-1 max-w-2xl">
            Ajukan permohonan surat administrasi kelurahan, pantau status verifikasi dokumen, dan sampaikan pengaduan warga dengan mudah.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/warga/pengajuan/baru"
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-5 text-sm font-bold text-white shadow-xs hover:bg-primary-dark transition-colors"
            >
              <FilePlus className="size-4" aria-hidden="true" />
              Ajukan Surat Baru
            </Link>
            <Link
              to="/warga/pengaduan/baru"
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-terracotta px-5 text-sm font-bold text-white shadow-xs hover:bg-[#834f36] transition-colors"
            >
              <MessageSquarePlus className="size-4" aria-hidden="true" />
              Buat Pengaduan
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Pengajuan Berjalan</span>
            <p className="text-3xl font-extrabold text-primary-dark mt-1 tabular-nums">
              {activeApps.length}
            </p>
            <p className="text-xs text-muted mt-1">Menunggu atau sedang diverifikasi</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Surat Siap / Selesai</span>
            <p className="text-3xl font-extrabold text-green mt-1 tabular-nums">
              {completedApps.length}
            </p>
            <p className="text-xs text-muted mt-1">Siap diambil di kantor kelurahan</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Pengaduan Aktif</span>
            <p className="text-3xl font-extrabold text-terracotta mt-1 tabular-nums">
              {activeComplaints.length}
            </p>
            <p className="text-xs text-muted mt-1">Sedang ditindaklanjuti petugas</p>
          </div>
        </div>

        {/* Recent Applications Section */}
        <section className="card p-6 bg-surface" aria-labelledby="pengajuan-terkini-title">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
            <div>
              <h2 id="pengajuan-terkini-title" className="text-lg font-bold text-primary-dark">
                Pengajuan Surat Terkini
              </h2>
              <p className="text-xs text-muted">Daftar permohonan surat administrasi Anda</p>
            </div>
            <Link
              to="/warga/pengajuan"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua ({myApps.length})
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {myApps.length === 0 ? (
            <div className="text-center py-8 text-muted text-sm">
              <p>Belum ada permohonan surat yang diajukan.</p>
              <Link
                to="/warga/pengajuan/baru"
                className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Mulai pengajuan surat pertama &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myApps.slice(0, 3).map((app) => {
                const s = SERVICES.find((x) => x.id === app.serviceId);
                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-[var(--radius-ui)] border border-line bg-[#fbfcfc] hover:bg-[#f4f7f9] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-muted-strong bg-surface px-2 py-0.5 rounded border border-line">
                          {app.id}
                        </span>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                      <h3 className="font-bold text-base text-ink mt-1">
                        {s?.title ?? app.serviceId}
                      </h3>
                      <p className="text-xs text-muted">Diajukan: {formatDate(app.createdAt)}</p>
                    </div>

                    <Link
                      to={`/warga/pengajuan/${app.id}`}
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-ui)] border border-line bg-surface px-3 text-xs font-bold text-primary-dark hover:border-primary"
                    >
                      Detail & Tracking
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Complaints Section */}
        <section className="card p-6 bg-surface" aria-labelledby="pengaduan-terkini-title">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
            <div>
              <h2 id="pengaduan-terkini-title" className="text-lg font-bold text-primary-dark">
                Pengaduan Warga Terkini
              </h2>
              <p className="text-xs text-muted">Aspirasi dan laporan fasilitas lingkungan</p>
            </div>
            <Link
              to="/warga/pengaduan"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua ({myComplaints.length})
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {myComplaints.length === 0 ? (
            <div className="text-center py-8 text-muted text-sm">
              <p>Belum ada pengaduan warga yang dikirimkan.</p>
              <Link
                to="/warga/pengaduan/baru"
                className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-bold text-terracotta hover:underline"
              >
                Buat laporan pengaduan baru &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myComplaints.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-[var(--radius-ui)] border border-line bg-[#fbfcfc] hover:bg-[#f4f7f9] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-muted-strong bg-surface px-2 py-0.5 rounded border border-line">
                        {comp.id}
                      </span>
                      <ComplaintStatusBadge status={comp.status} />
                    </div>
                    <h3 className="font-bold text-sm text-ink mt-1">{comp.title}</h3>
                    <p className="text-xs text-muted">Lokasi: {comp.location}</p>
                  </div>

                  <Link
                    to={`/warga/pengaduan/${comp.id}`}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-ui)] border border-line bg-surface px-3 text-xs font-bold text-primary-dark hover:border-primary"
                  >
                    Pantau Tiket
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
