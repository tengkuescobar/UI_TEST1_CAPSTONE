import { BarChart3, TrendingUp, CheckCircle2, Clock, FileText, MessageSquare } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function LurahReports() {
  const { applications, complaints, categories } = useStore();

  const totalApps = applications.length;
  const completedApps = applications.filter((a) => a.status === 'selesai').length;
  const inProgressApps = applications.filter((a) => a.status !== 'selesai' && a.status !== 'ditolak').length;

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'selesai').length;

  // App count per service
  const serviceStats = SERVICES.map((s) => {
    const count = applications.filter((a) => a.serviceId === s.id).length;
    return { ...s, count };
  });

  // Complaint count per category
  const categoryStats = categories.map((cat) => {
    const count = complaints.filter((c) => c.categoryId === cat.id).length;
    return { ...cat, count };
  });

  return (
    <DashboardLayout title="Laporan & Monitoring Eksekutif">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Laporan & Kinerja Pelayanan</h1>
          <p className="text-xs text-muted mt-1">
            Ringkasan data operasional permohonan surat administrasi dan pengaduan warga Kelurahan Pesanggrahan.
          </p>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Tingkat Penyelesaian Surat</span>
            <p className="text-3xl font-extrabold text-green mt-1 tabular-nums">
              {totalApps > 0 ? `${Math.round((completedApps / totalApps) * 100)}%` : '0%'}
            </p>
            <p className="text-xs text-muted mt-1">{completedApps} dari {totalApps} berkas selesai</p>
          </div>

          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Tingkat Penanganan Aduan</span>
            <p className="text-3xl font-extrabold text-terracotta mt-1 tabular-nums">
              {totalComplaints > 0 ? `${Math.round((resolvedComplaints / totalComplaints) * 100)}%` : '0%'}
            </p>
            <p className="text-xs text-muted mt-1">{resolvedComplaints} dari {totalComplaints} laporan selesai</p>
          </div>

          <div className="card p-5">
            <span className="text-xs font-bold text-muted uppercase">Rata-rata Waktu Verifikasi</span>
            <p className="text-3xl font-extrabold text-primary-dark mt-1 tabular-nums">
              &lt; 24 Jam
            </p>
            <p className="text-xs text-muted mt-1">Standar operasional pelayanan</p>
          </div>
        </div>

        {/* Services Breakdown */}
        <section className="card p-6 bg-surface" aria-labelledby="rekap-surat-title">
          <h2 id="rekap-surat-title" className="text-lg font-bold text-primary-dark mb-4">
            Distribusi Permohonan Surat Administrasi
          </h2>
          <div className="space-y-4">
            {serviceStats
              .filter((s) => s.count > 0 || s.serviceMode === 'demo_submission')
              .map((s) => {
                const pct = totalApps > 0 ? Math.round((s.count / totalApps) * 100) : 0;
                return (
                  <div key={s.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-ink">{s.title}</span>
                      <span className="text-muted tabular-nums">{s.count} berkas ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#eef1f2] overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(pct, 5)}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Complaints Breakdown */}
        <section className="card p-6 bg-surface" aria-labelledby="rekap-aduan-title">
          <h2 id="rekap-aduan-title" className="text-lg font-bold text-primary-dark mb-4">
            Rekapitulasi Kategori Pengaduan Warga
          </h2>
          <div className="space-y-4">
            {categoryStats.map((cat) => {
              const pct = totalComplaints > 0 ? Math.round((cat.count / totalComplaints) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink">{cat.name}</span>
                    <span className="text-muted tabular-nums">{cat.count} aduan ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#eef1f2] overflow-hidden">
                    <div className="h-full bg-terracotta rounded-full transition-all" style={{ width: `${Math.max(pct, 5)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
