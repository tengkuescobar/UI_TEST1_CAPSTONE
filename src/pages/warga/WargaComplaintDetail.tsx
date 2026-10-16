import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, MapPin, Tag, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { ActivityTimeline } from '../../components/application/Timeline';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function WargaComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { complaints, categories } = useStore();

  const complaint = complaints.find((c) => c.id === id);
  const category = complaint ? categories.find((x) => x.id === complaint.categoryId) : undefined;

  if (!complaint) {
    return (
      <DashboardLayout title="Pengaduan Tidak Ditemukan">
        <div className="card p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-bold text-primary-dark">Tiket pengaduan tidak ditemukan</p>
          <Link
            to="/warga/pengaduan"
            className="mt-4 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white"
          >
            Kembali ke Daftar Pengaduan
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Tiket ${complaint.id}`}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/warga/pengaduan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Daftar Pengaduan
          </Link>
        </div>

        <div className="card p-6 sm:p-8 bg-surface space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Tiket Pengaduan Warga
              </span>
              <h1 className="text-2xl font-extrabold text-primary-dark font-mono mt-0.5">
                {complaint.id}
              </h1>
            </div>
            <ComplaintStatusBadge status={complaint.status} />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-ink">{complaint.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Tag className="size-3.5 text-primary" aria-hidden="true" />
                {category?.name ?? complaint.categoryId}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                {complaint.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-primary" aria-hidden="true" />
                {formatDate(complaint.createdAt)}
              </span>
            </div>

            <div className="rounded-[var(--radius-ui)] bg-[#f8f9f9] p-4 text-sm text-ink leading-relaxed border border-line">
              <p className="text-xs font-bold text-muted uppercase mb-1">Rincian Laporan:</p>
              {complaint.description}
            </div>

            {complaint.attachmentName && (
              <p className="text-xs text-muted">
                Lampiran dokumentasi: <strong className="font-mono text-ink">{complaint.attachmentName}</strong>
              </p>
            )}

            {complaint.referredTo && (
              <div className="rounded-[var(--radius-ui)] border border-sand bg-sand-soft/60 p-3 text-xs text-[#523e32]">
                Dirujuk ke unit penanganan teknis: <strong>{complaint.referredTo}</strong>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="border-t border-line pt-6">
            <h3 className="text-sm font-bold text-primary-dark mb-4">
              Riwayat Tindak Lanjut Petugas
            </h3>
            <ActivityTimeline entries={complaint.timeline} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
