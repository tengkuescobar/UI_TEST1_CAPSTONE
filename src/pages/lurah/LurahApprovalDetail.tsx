import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  Building2,
  RotateCcw,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { StatusProgress, ActivityTimeline } from '../../components/application/Timeline';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function LurahApprovalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, lurahApprove, lurahReturn } = useStore();
  const { toast } = useToast();

  const app = applications.find((a) => a.id === id);
  const service = app ? SERVICES.find((s) => s.id === app.serviceId) : undefined;

  const [dialogMode, setDialogMode] = useState<'none' | 'approve' | 'return'>('none');

  if (!app) {
    return (
      <DashboardLayout title="Pengajuan Tidak Ditemukan">
        <div className="card p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-bold text-primary-dark">Berkas tidak ditemukan</p>
          <Link
            to="/lurah/persetujuan"
            className="mt-4 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white"
          >
            Kembali ke Daftar Persetujuan
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleConfirmAction = (note: string) => {
    if (dialogMode === 'approve') {
      lurahApprove(app.id, note || 'Disetujui oleh Lurah Kelurahan Pesanggrahan.');
      toast({
        title: 'Berkas Disetujui Lurah',
        description: `Berkas ${app.id} disetujui dan dikembalikan ke antrean petugas untuk penyelesaian akhir.`,
        tone: 'success',
      });
      navigate('/lurah/persetujuan');
    } else if (dialogMode === 'return') {
      lurahReturn(app.id, note);
      toast({
        title: 'Berkas Dikembalikan ke Petugas',
        description: `Berkas ${app.id} dikembalikan ke petugas dengan catatan: "${note}"`,
        tone: 'warning',
      });
      navigate('/lurah/persetujuan');
    }
    setDialogMode('none');
  };

  return (
    <DashboardLayout title={`Persetujuan Berkas ${app.id}`}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/lurah/persetujuan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Antrean Persetujuan
          </Link>
          <span className="text-xs font-semibold text-muted">ID: {app.id}</span>
        </div>

        {/* Lurah Action Bar */}
        <div className="card p-5 bg-[#f4f7f9] border-line flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-muted uppercase">Otorisasi Pimpinan:</span>
            <p className="text-xs font-semibold text-ink mt-0.5">
              Status: <strong className="text-primary-dark">{app.status.toUpperCase()}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {app.status === 'menunggu_persetujuan' && (
              <>
                <button
                  type="button"
                  onClick={() => setDialogMode('return')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] border border-warning/60 bg-[#fffbeb] px-4 text-xs font-bold text-[#b7791f] hover:bg-[#fef3c7] cursor-pointer"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Kembalikan ke Petugas
                </button>

                <button
                  type="button"
                  onClick={() => setDialogMode('approve')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-ui)] bg-green px-5 text-xs font-bold text-white hover:bg-[#325a44] cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Setujui Permohonan Surat
                </button>
              </>
            )}

            {app.status === 'disetujui' && (
              <span className="inline-flex items-center gap-1.5 rounded bg-[#e7f1eb] px-3 py-1.5 text-xs font-bold text-green">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Telah Anda Setujui (Sedang Ditangani Petugas)
              </span>
            )}
          </div>
        </div>

        {/* Detail Card */}
        <div className="card p-6 sm:p-8 bg-surface space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Verifikasi Dokumen Oleh Pimpinan
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

          {/* Applicant & Service Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold text-muted uppercase">Layanan</p>
              <p className="font-bold text-primary-dark mt-0.5">{service?.title ?? app.serviceId}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Nama Pemohon</p>
              <p className="font-semibold text-ink mt-0.5">{app.applicantName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Alamat Domisili</p>
              <p className="font-medium text-ink mt-0.5">{app.address}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Kontak</p>
              <p className="font-medium text-ink mt-0.5">{app.applicantPhone}</p>
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

          {/* Verified Documents Verified By Officer */}
          <div className="border-t border-line pt-5">
            <h2 className="text-sm font-bold text-primary-dark mb-3">
              Dokumen Persyaratan (Telah Diverifikasi Petugas)
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
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green bg-[#e7f1eb] px-2 py-0.5 rounded">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    Terverifikasi
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Timeline */}
          <div className="border-t border-line pt-5">
            <h2 className="text-sm font-bold text-primary-dark mb-4">
              Riwayat Penanganan Dokumen
            </h2>
            <ActivityTimeline entries={app.timeline} />
          </div>
        </div>
      </div>

      {/* Lurah Action Dialogs */}
      <ConfirmationDialog
        open={dialogMode === 'approve'}
        title="Setujui Permohonan Surat"
        description="Dengan menyetujui, surat akan diteruskan kembali ke petugas pelayanan untuk disiapkan dan diserahkan kepada pemohon."
        noteLabel="Catatan Otorisasi Lurah (Opsional)"
        confirmLabel="Setujui Dokumen"
        tone="success"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />

      <ConfirmationDialog
        open={dialogMode === 'return'}
        title="Kembalikan Berkas ke Petugas"
        description="Berikan catatan alasan pengembalian berkas agar petugas pelayanan dapat menindaklanjuti atau meminta konfirmasi pemohon."
        noteLabel="Catatan Pengembalian (Wajib)"
        noteRequired
        confirmLabel="Kembalikan ke Petugas"
        tone="primary"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogMode('none')}
      />
    </DashboardLayout>
  );
}
