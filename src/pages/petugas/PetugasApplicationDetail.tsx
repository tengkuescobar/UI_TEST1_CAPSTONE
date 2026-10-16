import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  CheckSquare,
  Send,
  XCircle,
  FileCheck,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { StatusProgress, ActivityTimeline } from '../../components/application/Timeline';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate, formatDateTime, cx } from '../../lib/format';

export function PetugasApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    applications,
    startVerification,
    toggleDocVerified,
    requestRevision,
    forwardToLurah,
    completeApplication,
    rejectApplication,
  } = useStore();
  const { toast } = useToast();

  const app = applications.find((a) => a.id === id);
  const service = app ? SERVICES.find((s) => s.id === app.serviceId) : undefined;

  // Dialog states
  const [dialogMode, setDialogMode] = useState<
    'none' | 'revision' | 'forward' | 'complete' | 'reject'
  >('none');

  if (!app) {
    return (
      <DashboardLayout title="Pengajuan Tidak Ditemukan">
        <div className="card p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-bold text-primary-dark">Berkas pengajuan tidak ditemukan</p>
          <Link
            to="/petugas/pengajuan"
            className="mt-4 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white"
          >
            Kembali ke Antrean Pengajuan
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const allDocsVerified = app.documents.length > 0 && app.documents.every((d) => d.verified);

  const handleStartVerify = () => {
    startVerification(app.id);
    toast({
      title: 'Verifikasi Dimulai',
      description: `Status berkas ${app.id} kini diverifikasi.`,
      tone: 'info',
    });
  };

  const handleConfirmAction = (note: string) => {
    if (dialogMode === 'revision') {
      requestRevision(app.id, note);
      toast({
        title: 'Permintaan Perbaikan Dikirim',
        description: `Notifikasi dikirimkan ke pemohon: "${note}"`,
        tone: 'warning',
      });
    } else if (dialogMode === 'forward') {
      forwardToLurah(app.id, note || undefined);
      toast({
        title: 'Diteruskan ke Lurah',
        description: `Berkas ${app.id} kini menunggu persetujuan Lurah.`,
        tone: 'success',
      });
    } else if (dialogMode === 'complete') {
      completeApplication(app.id);
      toast({
        title: 'Pengajuan Selesai',
        description: `Surat telah dinyatakan siap diambil oleh pemohon.`,
        tone: 'success',
      });
    } else if (dialogMode === 'reject') {
      rejectApplication(app.id, note);
      toast({
        title: 'Pengajuan Ditolak',
        description: `Pengajuan ${app.id} telah ditolak dengan catatan: "${note}"`,
        tone: 'danger',
      });
    }
    setDialogMode('none');
  };

  return (
    <DashboardLayout title={`Verifikasi Berkas ${app.id}`}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/petugas/pengajuan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Antrean Pelayanan
          </Link>
          <span className="text-xs font-semibold text-muted">ID: {app.id}</span>
        </div>

        {/* Action Bar (Top Floating on Officer View) */}
        <div className="card p-5 bg-[#f4f7f9] border-line flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-muted uppercase">Tindakan Petugas:</span>
            <p className="text-xs font-semibold text-ink mt-0.5">
              Status saat ini: <strong className="text-primary-dark">{app.status.toUpperCase()}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {app.status === 'diajukan' && (
              <button
                type="button"
                onClick={handleStartVerify}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer"
              >
                <CheckSquare className="size-4" aria-hidden="true" />
                Mulai Verifikasi
              </button>
            )}

            {(app.status === 'diajukan' || app.status === 'diverifikasi') && (
              <>
                <button
                  type="button"
                  onClick={() => setDialogMode('revision')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] border border-warning/60 bg-[#fffbeb] px-4 text-xs font-bold text-[#b7791f] hover:bg-[#fef3c7] cursor-pointer"
                >
                  <AlertCircle className="size-4" aria-hidden="true" />
                  Minta Perbaikan
                </button>

                <button
                  type="button"
                  onClick={() => setDialogMode('forward')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-green px-4 text-xs font-bold text-white hover:bg-[#325a44] cursor-pointer shadow-xs"
                >
                  <Send className="size-4" aria-hidden="true" />
                  Teruskan ke Lurah
                </button>

                <button
                  type="button"
                  onClick={() => setDialogMode('reject')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] border border-danger/60 bg-[#fff5f5] px-3 text-xs font-bold text-danger hover:bg-[#fee2e2] cursor-pointer"
                >
                  <XCircle className="size-4" aria-hidden="true" />
                  Tolak
                </button>
              </>
            )}

            {app.status === 'disetujui' && (
              <button
                type="button"
                onClick={() => setDialogMode('complete')}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-green px-5 text-xs font-bold text-white hover:bg-[#325a44] cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Tandai Selesai & Siap Diambil
              </button>
            )}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="card p-6 sm:p-8 bg-surface space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Verifikasi Dokumen Permohonan
              </span>
              <h1 className="text-2xl font-extrabold text-primary-dark font-mono mt-0.5">
                {app.id}
              </h1>
            </div>
            <ApplicationStatusBadge status={app.status} />
          </div>

          {/* Progress Tracker */}
          <div className="rounded-[var(--radius-ui)] bg-[#f8f9f9] p-4 border border-line">
            <StatusProgress status={app.status} />
          </div>

          {/* Applicant Info Grid */}
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
              <p className="text-xs font-bold text-muted uppercase">Keperluan Surat</p>
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

          {/* Document Verification Checklist Interactive */}
          <div className="border-t border-line pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-primary-dark">
                  Pemeriksaan Berkas Dokumen Persyaratan
                </h2>
                <p className="text-xs text-muted">
                  Centang berkas untuk menandai dokumen telah valid dan memenuhi syarat.
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-[#eef4f7] px-3 py-1 rounded-full">
                {app.documents.filter((d) => d.verified).length} dari {app.documents.length} Valid
              </span>
            </div>

            <ul className="space-y-2.5">
              {app.documents.map((doc) => (
                <li
                  key={doc.requirementId}
                  className={cx(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border p-3.5 transition-colors',
                    doc.verified ? 'border-green/40 bg-[#f4faf6]' : 'border-line bg-surface',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className={cx('size-5 shrink-0', doc.verified ? 'text-green' : 'text-primary')} aria-hidden="true" />
                    <div>
                      <p className="font-bold text-sm text-ink">{doc.requirementLabel}</p>
                      <p className="text-xs text-muted font-mono">{doc.fileName}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDocVerified(app.id, doc.requirementId)}
                    className={cx(
                      'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-ui)] px-3 text-xs font-bold transition-colors cursor-pointer',
                      doc.verified
                        ? 'bg-green text-white hover:bg-[#325a44]'
                        : 'border border-line bg-surface text-muted-strong hover:border-primary hover:text-primary',
                    )}
                  >
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    {doc.verified ? 'Terverifikasi (Valid)' : 'Tandai Valid'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Timeline */}
          <div className="border-t border-line pt-6">
            <h2 className="text-base font-bold text-primary-dark mb-4">
              Riwayat Aktivitas & Catatan Petugas
            </h2>
            <ActivityTimeline entries={app.timeline} />
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={dialogMode === 'revision'}
        title="Minta Perbaikan Dokumen"
        description="Jelaskan kekurangan berkas atau instruksi perbaikan yang harus dipenuhi oleh pemohon."
        noteLabel="Catatan Perbaikan Dokumen (Wajib)"
        noteRequired
        confirmLabel="Kirim Permintaan Perbaikan"
        tone="primary"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />

      <ConfirmationDialog
        open={dialogMode === 'forward'}
        title="Teruskan Berkas ke Lurah"
        description="Pastikan seluruh dokumen pemohon telah lengkap dan diverifikasi sebelum diteruskan ke Lurah untuk mendapatkan persetujuan resmi."
        noteLabel="Catatan Rekomendasi Petugas (Opsional)"
        confirmLabel="Teruskan ke Lurah"
        tone="success"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />

      <ConfirmationDialog
        open={dialogMode === 'complete'}
        title="Selesaikan Berkas Pengajuan"
        description="Surat telah disetujui Lurah. Dengan menyelesaikan berkas, sistem akan memberi notifikasi kepada pemohon bahwa surat fisik siap diambil di kantor kelurahan."
        confirmLabel="Tandai Selesai"
        tone="success"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />

      <ConfirmationDialog
        open={dialogMode === 'reject'}
        title="Tolak Pengajuan Surat"
        description="Pengajuan yang ditolak tidak dapat diproses lebih lanjut. Berikan alasan penolakan yang jelas kepada pemohon."
        noteLabel="Alasan Penolakan (Wajib)"
        noteRequired
        confirmLabel="Tolak Pengajuan"
        tone="danger"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />
    </DashboardLayout>
  );
}
