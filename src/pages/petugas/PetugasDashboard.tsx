import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Send,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge, ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function PetugasDashboard() {
  const { persona, applications, complaints } = useStore();

  const needVerifyApps = applications.filter(
    (a) => a.status === 'diajukan' || a.status === 'diverifikasi',
  );
  const waitingLurahApps = applications.filter((a) => a.status === 'menunggu_persetujuan');
  const lurahApprovedApps = applications.filter((a) => a.status === 'disetujui');
  const pendingComplaints = complaints.filter(
    (c) => c.status === 'diterima' || c.status === 'diverifikasi',
  );

  return (
    <DashboardLayout title="Antrean Pelayanan Kelurahan">
      <div className="space-y-8">
        {/* Officer Welcome Card */}
        <div className="card p-6 sm:p-8 bg-surface border-line">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Petugas Pelayanan Terpadu</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mt-1">
                Halo, {persona.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-strong mt-1">
                Periksa kelengkapan berkas pemohon, lakukan verifikasi dokumen, dan tangani pengaduan warga.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/petugas/pengajuan"
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark"
              >
                <FileText className="size-4" aria-hidden="true" />
                Daftar Pengajuan ({applications.length})
              </Link>
              <Link
                to="/petugas/pengaduan"
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-terracotta px-4 text-xs font-bold text-white hover:bg-[#834f36]"
              >
                <MessageSquare className="size-4" aria-hidden="true" />
                Daftar Pengaduan ({complaints.length})
              </Link>
            </div>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Perlu Diverifikasi</span>
            <p className="text-3xl font-extrabold text-primary-dark mt-1 tabular-nums">
              {needVerifyApps.length}
            </p>
            <p className="text-xs text-muted mt-1">Pengajuan baru / sedang diperiksa</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Menunggu Lurah</span>
            <p className="text-3xl font-extrabold text-terracotta mt-1 tabular-nums">
              {waitingLurahApps.length}
            </p>
            <p className="text-xs text-muted mt-1">Berkas telah diteruskan ke Lurah</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Disetujui Lurah</span>
            <p className="text-3xl font-extrabold text-green mt-1 tabular-nums">
              {lurahApprovedApps.length}
            </p>
            <p className="text-xs text-muted mt-1">Siap diselesaikan & diambil warga</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Pengaduan Masuk</span>
            <p className="text-3xl font-extrabold text-terracotta mt-1 tabular-nums">
              {pendingComplaints.length}
            </p>
            <p className="text-xs text-muted mt-1">Perlu ditindaklanjuti petugas</p>
          </div>
        </div>

        {/* Priority Incoming Queue */}
        <section className="card p-6 bg-surface" aria-labelledby="antrean-masuk-title">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
            <div>
              <h2 id="antrean-masuk-title" className="text-lg font-bold text-primary-dark">
                Antrean Pengajuan Masuk Terkini
              </h2>
              <p className="text-xs text-muted">Berkas warga yang memerlukan penanganan verifikasi</p>
            </div>
            <Link to="/petugas/pengajuan" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Buka Semua Antrean &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {needVerifyApps.slice(0, 4).map((app) => {
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
                      {s?.title ?? app.serviceId} — Pemohon: {app.applicantName}
                    </h3>
                    <p className="text-xs text-muted">
                      Masuk: {formatDate(app.createdAt)} · Kontak: {app.applicantPhone}
                    </p>
                  </div>

                  <Link
                    to={`/petugas/pengajuan/${app.id}`}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark"
                  >
                    Periksa Berkas
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
