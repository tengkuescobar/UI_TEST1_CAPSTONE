import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Send,
  Building2,
  Printer,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { SERVICES } from '../../data/services';
import type { UploadedDoc } from '../../types';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { StatusProgress, ActivityTimeline } from '../../components/application/Timeline';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate, formatDateTime, simulateDelay } from '../../lib/format';

export function WargaApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { applications, resubmitApplication } = useStore();
  const { toast } = useToast();

  const app = applications.find((a) => a.id === id);
  const service = app ? SERVICES.find((s) => s.id === app.serviceId) : undefined;

  // Re-submission state for perlu_perbaikan
  const [reNote, setReNote] = useState('');
  const [isSubmittingFix, setIsSubmittingFix] = useState(false);

  if (!app) {
    return (
      <DashboardLayout title="Pengajuan Tidak Ditemukan">
        <div className="card p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-bold text-primary-dark">Berkas pengajuan tidak ditemukan</p>
          <p className="text-xs text-muted mt-1">ID pengajuan tidak tercatat pada sistem demo.</p>
          <Link
            to="/warga/pengajuan"
            className="mt-4 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white"
          >
            Kembali ke Daftar Pengajuan
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFix(true);
    await simulateDelay(500);

    // Resubmit with note
    resubmitApplication(app.id, app.documents, reNote || 'Dokumen perbaikan telah diunggah kembali.');

    toast({
      title: 'Perbaikan Berhasil Dikirim',
      description: 'Berkas perbaikan telah dikembalikan ke antrean pemeriksaan petugas.',
      tone: 'success',
    });

    setIsSubmittingFix(false);
    setReNote('');
  };

  return (
    <DashboardLayout title={`Detail Pengajuan ${app.id}`}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/warga/pengajuan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Riwayat Pengajuan
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] border border-line bg-surface px-3 text-xs font-semibold text-muted-strong hover:bg-[#f4f6f7]"
          >
            <Printer className="size-3.5" aria-hidden="true" />
            Cetak Bukti Registrasi
          </button>
        </div>

        {/* Header Summary Card */}
        <div className="card p-6 sm:p-8 bg-surface space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Surat Administrasi Kelurahan
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark font-mono mt-0.5">
                {app.id}
              </h1>
            </div>
            <ApplicationStatusBadge status={app.status} />
          </div>

          {/* Progress Tracker */}
          <div className="rounded-[var(--radius-ui)] bg-[#f8f9f9] p-4 border border-line">
            <StatusProgress status={app.status} />
          </div>

          {/* Alert if perlu_perbaikan */}
          {app.status === 'perlu_perbaikan' && (
            <div className="rounded-[var(--radius-ui)] border border-warning/60 bg-[#fffbeb] p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-[#b7791f] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-[#7a4f0f]">
                    Perhatian: Petugas Meminta Perbaikan Berkas
                  </h2>
                  <p className="text-xs text-[#7a4f0f] mt-1 leading-relaxed">
                    Silakan periksa catatan perbaikan dari petugas pada riwayat aktivitas di bawah, lalu kirimkan konfirmasi perbaikan dokumen.
                  </p>

                  <form onSubmit={handleResubmit} className="mt-4 space-y-3">
                    <label htmlFor="resubmit-note" className="block text-xs font-bold text-[#7a4f0f]">
                      Catatan Perbaikan Anda:
                    </label>
                    <textarea
                      id="resubmit-note"
                      rows={2}
                      value={reNote}
                      onChange={(e) => setReNote(e.target.value)}
                      placeholder="Contoh: Lampiran KTP yang lebih jelas telah diperbarui..."
                      className="field-input text-xs bg-white"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingFix}
                      className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer"
                    >
                      <Send className="size-3.5" aria-hidden="true" />
                      {isSubmittingFix ? 'Mengirim...' : 'Kirim Ulang Dokumen Perbaikan'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold text-muted uppercase">Jenis Surat</p>
              <p className="font-bold text-primary-dark mt-0.5">{service?.title ?? app.serviceId}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Nama Pemohon</p>
              <p className="font-semibold text-ink mt-0.5">{app.applicantName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Nomor Kontak</p>
              <p className="font-medium text-ink mt-0.5">{app.applicantPhone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Alamat Domisili</p>
              <p className="font-medium text-ink mt-0.5">{app.address}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold text-muted uppercase">Keperluan</p>
              <p className="font-medium text-ink mt-0.5">{app.purpose}</p>
            </div>

            {/* Extra fields */}
            {Object.keys(app.extra).length > 0 && (
              <div className="sm:col-span-2 pt-3 border-t border-line space-y-1">
                <p className="text-xs font-bold text-muted uppercase">Data Tambahan:</p>
                {Object.entries(app.extra).map(([k, v]) => {
                  const label = service?.extraFields?.find((x) => x.id === k)?.label ?? k;
                  return (
                    <p key={k} className="text-xs">
                      <span className="text-muted">{label}: </span>
                      <strong className="text-ink">{v}</strong>
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Uploaded Documents List */}
          <div className="border-t border-line pt-5">
            <h2 className="text-sm font-bold text-primary-dark mb-3">
              Dokumen Persyaratan Terlampir ({app.documents.length})
            </h2>
            <ul className="space-y-2">
              {app.documents.map((doc, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-[#f4f6f7] p-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="size-4 text-primary shrink-0" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-ink block">{doc.requirementLabel}</span>
                      <span className="text-muted text-xs font-mono">{doc.fileName}</span>
                    </div>
                  </div>
                  {doc.verified && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#e7f1eb] px-2 py-0.5 text-xs font-bold text-green">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      Terverifikasi
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="border-t border-line pt-5">
            <h2 className="text-sm font-bold text-primary-dark mb-4">
              Riwayat Penanganan & Catatan
            </h2>
            <ActivityTimeline entries={app.timeline} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
