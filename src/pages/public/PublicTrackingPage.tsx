import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, MessageSquare, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge, ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { StatusProgress, ActivityTimeline } from '../../components/application/Timeline';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { formatDate } from '../../lib/format';

export function PublicTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('id') || '';
  const [inputCode, setInputCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);

  const { applications, complaints } = useStore();

  useEffect(() => {
    if (initialCode) {
      setInputCode(initialCode);
      setSearchedCode(initialCode.trim().toUpperCase());
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    setSearchedCode(clean);
    setSearchParams(clean ? { id: clean } : {});
  };

  const handleSelectSample = (code: string) => {
    setInputCode(code);
    setSearchedCode(code);
    setSearchParams({ id: code });
  };

  // Find matching application or complaint
  const matchedApp = searchedCode
    ? applications.find((a) => a.id.toUpperCase() === searchedCode)
    : undefined;

  const matchedComplaint = searchedCode && !matchedApp
    ? complaints.find((c) => c.id.toUpperCase() === searchedCode)
    : undefined;

  const matchedService = matchedApp ? SERVICES.find((s) => s.id === matchedApp.serviceId) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />

      <main id="main-content" className="flex-1 py-10 lg:py-14">
        <div className="container-page max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Transparansi Layanan</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-dark mt-1">
              Lacak Status Pengajuan & Pengaduan
            </h1>
            <p className="text-muted-strong text-sm sm:text-base mt-2">
              Masukkan nomor registrasi surat (misal: <code>SRT-2026-0012</code>) atau nomor tiket pengaduan (misal: <code>ADU-2026-0031</code>).
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-8 card p-4 sm:p-6 bg-surface shadow-card">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted" aria-hidden="true" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Contoh: SRT-2026-0012 atau ADU-2026-0031"
                  className="field-input pl-11! uppercase font-mono font-bold tracking-wider"
                  aria-label="Nomor registrasi berkas"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-ui)] bg-primary px-6 font-bold text-white hover:bg-primary-dark transition-colors cursor-pointer"
              >
                <Search className="size-4" aria-hidden="true" />
                Lacak Berkas
              </button>
            </div>

            {/* Quick sample chips for Capstone evaluation */}
            <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-semibold">Contoh kode pengajuan demo:</span>
              <button
                type="button"
                onClick={() => handleSelectSample('SRT-2026-0012')}
                className="rounded bg-[#eef4f7] px-2.5 py-1 font-mono font-bold text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                SRT-2026-0012 (Diverifikasi)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('SRT-2026-0015')}
                className="rounded bg-sand-soft px-2.5 py-1 font-mono font-bold text-terracotta hover:bg-terracotta hover:text-white transition-colors cursor-pointer"
              >
                SRT-2026-0015 (Menunggu Lurah)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('ADU-2026-0031')}
                className="rounded bg-[#edf5f0] px-2.5 py-1 font-mono font-bold text-green hover:bg-green hover:text-white transition-colors cursor-pointer"
              >
                ADU-2026-0031 (Pengaduan)
              </button>
            </div>
          </form>

          {/* RESULTS DISPLAY */}
          {searchedCode && (
            <div className="mt-8 space-y-6">
              {matchedApp ? (
                /* Application Result Card */
                <div className="card p-6 sm:p-8 bg-surface shadow-card space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Permohonan Surat Administrasi
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-primary-dark font-mono">
                        {matchedApp.id}
                      </h2>
                    </div>
                    <ApplicationStatusBadge status={matchedApp.status} />
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="rounded-[var(--radius-ui)] bg-[#f8f9f9] p-4 border border-line">
                    <StatusProgress status={matchedApp.status} />
                  </div>

                  {/* Info Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-muted uppercase">Layanan</p>
                      <p className="font-bold text-ink mt-0.5">{matchedService?.title ?? matchedApp.serviceId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted uppercase">Nama Pemohon</p>
                      <p className="font-bold text-ink mt-0.5">{matchedApp.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted uppercase">Tanggal Pengajuan</p>
                      <p className="font-medium text-ink mt-0.5">{formatDate(matchedApp.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted uppercase">Terakhir Diperbarui</p>
                      <p className="font-medium text-ink mt-0.5">{formatDate(matchedApp.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Document Requirements Uploaded */}
                  <div className="border-t border-line pt-4">
                    <h3 className="text-sm font-bold text-primary-dark mb-3">
                      Dokumen yang Dilampirkan ({matchedApp.documents.length})
                    </h3>
                    <ul className="space-y-2">
                      {matchedApp.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center justify-between rounded-md bg-[#f4f6f7] px-3.5 py-2.5 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="size-4 text-primary shrink-0" aria-hidden="true" />
                            <span className="font-semibold text-ink truncate">{doc.requirementLabel}</span>
                          </div>
                          <span className="text-muted font-mono text-xs">{doc.fileName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Activity Timeline */}
                  <div className="border-t border-line pt-4">
                    <h3 className="text-sm font-bold text-primary-dark mb-4">
                      Riwayat & Catatan Pemeriksaan
                    </h3>
                    <ActivityTimeline entries={matchedApp.timeline} />
                  </div>
                </div>
              ) : matchedComplaint ? (
                /* Complaint Result Card */
                <div className="card p-6 sm:p-8 bg-surface shadow-card space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Tiket Pengaduan Warga
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-primary-dark font-mono">
                        {matchedComplaint.id}
                      </h2>
                    </div>
                    <ComplaintStatusBadge status={matchedComplaint.status} />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-ink">{matchedComplaint.title}</h3>
                    <p className="text-sm text-muted-strong">{matchedComplaint.description}</p>
                    <p className="text-xs text-muted">
                      Lokasi: <strong>{matchedComplaint.location}</strong>
                    </p>
                  </div>

                  {matchedComplaint.referredTo && (
                    <div className="rounded-[var(--radius-ui)] border border-sand bg-sand-soft/60 p-3 text-xs text-[#523e32]">
                      Dirujuk ke unit penanganan: <strong>{matchedComplaint.referredTo}</strong>
                    </div>
                  )}

                  <div className="border-t border-line pt-4">
                    <h3 className="text-sm font-bold text-primary-dark mb-4">
                      Riwayat Tindak Lanjut Pengaduan
                    </h3>
                    <ActivityTimeline entries={matchedComplaint.timeline} />
                  </div>
                </div>
              ) : (
                /* Not Found Card */
                <div className="card p-8 text-center bg-surface">
                  <div className="size-12 rounded-full bg-[#fbecea] text-danger flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-primary-dark">
                    Nomor Registrasi "{searchedCode}" Tidak Ditemukan
                  </h3>
                  <p className="text-xs text-muted max-w-md mx-auto mt-1">
                    Pastikan kode yang Anda masukkan sudah benar (misal: SRT-2026-0012). Coba salah satu tombol sampel di atas untuk menguji tampilan berkas.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
