import { Link } from 'react-router-dom';
import {
  CheckSquare,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function LurahDashboard() {
  const { persona, applications, complaints } = useStore();

  const pendingApprovals = applications.filter((a) => a.status === 'menunggu_persetujuan');
  const approvedApps = applications.filter(
    (a) => a.status === 'disetujui' || a.status === 'selesai',
  );
  const totalApps = applications.length;
  const totalComplaints = complaints.length;

  return (
    <DashboardLayout title="Dashboard Eksekutif Lurah">
      <div className="space-y-8">
        {/* Lurah Welcome Banner */}
        <div className="card p-6 sm:p-8 bg-surface border-line">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Pimpinan Wilayah</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mt-1">
                Ikhtisar Pimpinan & Persetujuan Dokumen
              </h1>
              <p className="text-xs sm:text-sm text-muted-strong mt-1">
                Monitoring berkas pelayanan administrasi warga, verifikasi pimpinan, dan pengawasan penanganan pengaduan.
              </p>
            </div>
            <Link
              to="/lurah/persetujuan"
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-5 text-sm font-bold text-white hover:bg-primary-dark"
            >
              <CheckSquare className="size-4" aria-hidden="true" />
              Periksa Persetujuan ({pendingApprovals.length})
            </Link>
          </div>
        </div>

        {/* Executive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Menunggu Persetujuan</span>
            <p className="text-3xl font-extrabold text-terracotta mt-1 tabular-nums">
              {pendingApprovals.length}
            </p>
            <p className="text-xs text-muted mt-1">Berkas telah diverifikasi petugas</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Telah Disetujui</span>
            <p className="text-3xl font-extrabold text-green mt-1 tabular-nums">
              {approvedApps.length}
            </p>
            <p className="text-xs text-muted mt-1">Surat disetujui / siap diambil</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Total Berkas Layanan</span>
            <p className="text-3xl font-extrabold text-primary-dark mt-1 tabular-nums">
              {totalApps}
            </p>
            <p className="text-xs text-muted mt-1">Seluruh pengajuan tercatat</p>
          </div>
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Total Pengaduan Warga</span>
            <p className="text-3xl font-extrabold text-ink mt-1 tabular-nums">
              {totalComplaints}
            </p>
            <p className="text-xs text-muted mt-1">Aspirasi & laporan masuk</p>
          </div>
        </div>

        {/* Pending Approvals Queue */}
        <section className="card p-6 bg-surface" aria-labelledby="antrean-persetujuan-title">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
            <div>
              <h2 id="antrean-persetujuan-title" className="text-lg font-bold text-primary-dark">
                Berkas Menunggu Persetujuan Anda
              </h2>
              <p className="text-xs text-muted">
                Dokumen telah diperiksa dan diverifikasi oleh petugas pelayanan
              </p>
            </div>
            <Link to="/lurah/persetujuan" className="text-xs font-bold text-primary hover:underline">
              Buka Semua ({pendingApprovals.length}) &rarr;
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-muted text-sm">
              <CheckCircle2 className="size-8 text-green mx-auto mb-2" aria-hidden="true" />
              <p className="font-semibold text-ink">Tidak ada berkas yang menunggu persetujuan saat ini.</p>
              <p className="text-xs mt-1">Seluruh pengajuan yang telah diverifikasi telah diproses.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((app) => {
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
                        Keperluan: {app.purpose} · Terakhir diperiksa petugas
                      </p>
                    </div>

                    <Link
                      to={`/lurah/persetujuan/${app.id}`}
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark"
                    >
                      Tinjau & Setujui
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
