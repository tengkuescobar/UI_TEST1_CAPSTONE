import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  MapPin,
  Tag,
  Clock,
  CheckCircle2,
  Share2,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { ActivityTimeline } from '../../components/application/Timeline';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function PetugasComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { complaints, categories, updateComplaint } = useStore();
  const { toast } = useToast();

  const complaint = complaints.find((c) => c.id === id);
  const category = complaint ? categories.find((x) => x.id === complaint.categoryId) : undefined;

  const [dialogMode, setDialogMode] = useState<'none' | 'progress' | 'refer' | 'resolve'>('none');
  const [referTarget, setReferTarget] = useState('Suku Dinas Lingkungan Hidup Jakarta Selatan');

  if (!complaint) {
    return (
      <DashboardLayout title="Pengaduan Tidak Ditemukan">
        <div className="card p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-bold text-primary-dark">Tiket pengaduan tidak ditemukan</p>
          <Link
            to="/petugas/pengaduan"
            className="mt-4 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white"
          >
            Kembali ke Daftar Pengaduan
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleVerify = () => {
    updateComplaint(complaint.id, 'diverifikasi', 'Pengaduan diverifikasi oleh petugas pelayanan.');
    toast({
      title: 'Pengaduan Diverifikasi',
      description: `Tiket ${complaint.id} diverifikasi.`,
      tone: 'info',
    });
  };

  const handleConfirmAction = (note: string) => {
    if (dialogMode === 'progress') {
      updateComplaint(complaint.id, 'ditindaklanjuti', note || 'Sedang ditindaklanjuti oleh petugas.');
      toast({
        title: 'Status Ditindaklanjuti',
        description: `Tindak lanjut dicatat: "${note}"`,
        tone: 'success',
      });
    } else if (dialogMode === 'refer') {
      updateComplaint(complaint.id, 'dirujuk', note || `Dirujuk ke ${referTarget}`, referTarget);
      toast({
        title: 'Pengaduan Dirujuk',
        description: `Pengaduan diteruskan ke ${referTarget}.`,
        tone: 'info',
      });
    } else if (dialogMode === 'resolve') {
      updateComplaint(complaint.id, 'selesai', note || 'Laporan telah selesai ditangani di lapangan.');
      toast({
        title: 'Pengaduan Selesai',
        description: `Tiket ${complaint.id} ditandai selesai.`,
        tone: 'success',
      });
    }
    setDialogMode('none');
  };

  return (
    <DashboardLayout title={`Penanganan Tiket ${complaint.id}`}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/petugas/pengaduan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Daftar Pengaduan
          </Link>
          <span className="text-xs font-semibold text-muted">ID: {complaint.id}</span>
        </div>

        {/* Action Panel for Officer */}
        <div className="card p-5 bg-[#f4f7f9] border-line flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-muted uppercase">Tindakan Petugas:</span>
            <p className="text-xs font-semibold text-ink mt-0.5">
              Status: <strong className="text-primary-dark">{complaint.status.toUpperCase()}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {complaint.status === 'diterima' && (
              <button
                type="button"
                onClick={handleVerify}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Verifikasi Pengaduan
              </button>
            )}

            {complaint.status !== 'selesai' && (
              <>
                <button
                  type="button"
                  onClick={() => setDialogMode('progress')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-terracotta px-4 text-xs font-bold text-white hover:bg-[#834f36] cursor-pointer"
                >
                  <Wrench className="size-4" aria-hidden="true" />
                  Tindak Lanjut
                </button>

                <button
                  type="button"
                  onClick={() => setDialogMode('refer')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] border border-line bg-surface px-3 text-xs font-bold text-primary-dark hover:border-primary cursor-pointer"
                >
                  <Share2 className="size-4" aria-hidden="true" />
                  Rujuk ke Sudin / Unit Lain
                </button>

                <button
                  type="button"
                  onClick={() => setDialogMode('resolve')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-green px-4 text-xs font-bold text-white hover:bg-[#325a44] cursor-pointer"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Selesaikan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Complaint Details Card */}
        <div className="card p-6 sm:p-8 bg-surface space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Laporan Masyarakat
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
              <p className="text-xs font-bold text-muted uppercase mb-1">Rincian Laporan Warga:</p>
              {complaint.description}
            </div>

            {complaint.referredTo && (
              <div className="rounded-[var(--radius-ui)] border border-sand bg-sand-soft/60 p-3 text-xs text-[#523e32]">
                Dirujuk ke unit: <strong>{complaint.referredTo}</strong>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="border-t border-line pt-6">
            <h3 className="text-sm font-bold text-primary-dark mb-4">
              Riwayat Tindak Lanjut Penanganan
            </h3>
            <ActivityTimeline entries={complaint.timeline} />
          </div>
        </div>
      </div>

      {/* Action Dialogs */}
      <ConfirmationDialog
        open={dialogMode === 'progress'}
        title="Catat Tindak Lanjut Penanganan"
        description="Tuliskan tindakan atau koordinasi yang sedang/telah dilakukan oleh petugas."
        noteLabel="Catatan Tindak Lanjut (Wajib)"
        noteRequired
        confirmLabel="Simpan Tindak Lanjut"
        tone="primary"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />

      {dialogMode === 'refer' && (
        <ConfirmationDialog
          open={true}
          title="Rujuk Pengaduan ke Unit Lain"
          description={
            <div className="space-y-3">
              <p>Pilih instansi atau suku dinas yang berwenang menindaklanjuti laporan ini:</p>
              <select
                value={referTarget}
                onChange={(e) => setReferTarget(e.target.value)}
                className="field-input text-xs w-full mt-2"
              >
                <option value="Suku Dinas Lingkungan Hidup Jakarta Selatan">
                  Sudin Lingkungan Hidup (Sampah & Kebersihan)
                </option>
                <option value="Suku Dinas Bina Marga Jakarta Selatan">
                  Sudin Bina Marga (Jalan & Jembatan)
                </option>
                <option value="Suku Dinas Sumber Daya Air Jakarta Selatan">
                  Sudin SDA (Saluran & Banjir)
                </option>
                <option value="Satuan Polisi Pamong Praja (Satpol PP) Kelurahan">
                  Satpol PP (Ketertiban Umum)
                </option>
              </select>
            </div>
          }
          noteLabel="Catatan Pengantar Rujukan (Opsional)"
          confirmLabel="Kirim Rujukan"
          tone="primary"
          onConfirm={handleConfirmAction}
          onClose={() => setDialogMode('none')}
        />
      )}

      <ConfirmationDialog
        open={dialogMode === 'resolve'}
        title="Selesaikan Penanganan Pengaduan"
        description="Pastikan permasalahan yang dilaporkan telah terselesaikan di lapangan."
        noteLabel="Catatan Penyelesaian Laporan (Wajib)"
        noteRequired
        confirmLabel="Tandai Selesai"
        tone="success"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />
    </DashboardLayout>
  );
}
