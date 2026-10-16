import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Send,
  Info,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { SERVICES, CATEGORY_LABEL } from '../../data/services';
import { getServiceCase, getCaseForms, canSubmitOnline } from '../../lib/requirements';
import { ServiceCaseSelector } from '../../components/service/ServiceCaseSelector';
import { RequirementChecklist } from '../../components/service/RequirementChecklist';
import { OfficialFormCard } from '../../components/service/OfficialFormCard';
import { ProcedureTimeline } from '../../components/service/ProcedureTimeline';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useStore } from '../../state/AppStore';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setRole } = useStore();

  const service = SERVICES.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-bg text-ink">
        <PublicNavbar />
        <main className="container-page flex-1 py-16 text-center">
          <p className="text-xl font-bold text-primary-dark">Layanan tidak ditemukan</p>
          <p className="text-sm text-muted mt-2">ID layanan yang Anda cari tidak tersedia dalam katalog.</p>
          <Link
            to="/layanan"
            className="mt-6 inline-flex min-h-11 items-center rounded-[var(--radius-ui)] bg-primary px-5 text-sm font-bold text-white"
          >
            Kembali ke Katalog
          </Link>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Active case state within the service
  const [selectedCaseId, setSelectedCaseId] = useState(service.cases[0].id);
  const currentCase = getServiceCase(service, selectedCaseId);
  const caseForms = getCaseForms(currentCase);
  const isSubmissionAllowed = canSubmitOnline(service);

  const handleStartSubmission = () => {
    // Switch role to warga so the citizen submission flow works smoothly
    setRole('warga');
    navigate(`/warga/pengajuan/baru?service=${service.id}&case=${currentCase.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />

      <main id="main-content" className="flex-1 py-8 lg:py-12">
        <div className="container-page max-w-5xl">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              to="/layanan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Kembali ke Katalog Layanan
            </Link>
          </div>

          {/* Service Header Card */}
          <div className="card p-6 sm:p-8 bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold tracking-wider uppercase text-terracotta">
                {service.group ?? CATEGORY_LABEL[service.category]}
              </span>
              <StatusBadge
                label={isSubmissionAllowed ? 'Pengajuan Daring (Demo)' : 'Panduan Resmi Adminduk'}
                tone={isSubmissionAllowed ? 'accent' : 'info'}
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mt-2">
              {service.title}
            </h1>
            <p className="text-muted-strong text-base mt-2 max-w-3xl leading-relaxed">
              {service.description}
            </p>

            {/* Banner based on service mode */}
            {isSubmissionAllowed ? (
              <div className="mt-6 rounded-[var(--radius-ui)] border border-sand bg-sand-soft/70 p-4 text-sm text-[#523e32]">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-5 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-primary-dark">
                      Layanan Ini Mendukung Pengajuan Daring (Simulasi Prototipe)
                    </p>
                    <p className="mt-0.5 text-xs text-muted-strong">
                      Anda dapat mengunggah dokumen persyaratan simulasi dan memantau status verifikasi petugas hingga persetujuan Lurah.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartSubmission}
                      className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                      <Send className="size-3.5" aria-hidden="true" />
                      Ajukan Surat Ini Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[var(--radius-ui)] border border-[#c8d8e0] bg-[#eef4f7] p-4 text-sm text-primary-dark">
                <div className="flex items-start gap-3">
                  <Info className="size-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">
                      Layanan Berupa Panduan Persyaratan & Formulir Resmi
                    </p>
                    <p className="mt-0.5 text-xs text-muted-strong leading-relaxed">
                      Perekaman biometrik, validasi identitas penduduk, dan penerbitan dokumen resmi dilakukan secara langsung melalui loket Dukcapil di Kantor Kelurahan Pesanggrahan sesuai regulasi pemerintah.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC REQUIREMENT ENGINE SECTION */}
          <div className="mt-8 space-y-8">
            {/* Case Selector */}
            {service.cases.length > 1 && (
              <section className="card p-6 bg-surface" aria-labelledby="skenario-kasus-title">
                <h2 id="skenario-kasus-title" className="text-base font-bold text-primary-dark mb-1">
                  Pilih Kondisi / Skenario Permohonan
                </h2>
                <p className="text-xs text-muted mb-4">
                  Persyaratan dokumen dan formulir resmi di bawah ini akan otomatis menyesuaikan dengan pilihan kondisi Anda.
                </p>
                <ServiceCaseSelector
                  cases={service.cases}
                  value={selectedCaseId}
                  onChange={setSelectedCaseId}
                />
              </section>
            )}

            {/* Requirements Checklist Card */}
            <section className="card p-6 sm:p-8 bg-surface" aria-labelledby="persyaratan-title">
              <div className="border-b border-line pb-4 mb-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 id="persyaratan-title" className="text-lg font-bold text-primary-dark">
                    Daftar Dokumen Persyaratan
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Kondisi terpilih: <strong className="text-ink">{currentCase.label}</strong>
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted bg-[#f4f6f7] px-3 py-1 rounded-full">
                  {currentCase.requirements.length} Dokumen
                </span>
              </div>

              <RequirementChecklist
                requirements={currentCase.requirements}
                resetKey={selectedCaseId}
              />

              {/* Special Case Procedure Notes if any */}
              {currentCase.procedureNotes && currentCase.procedureNotes.length > 0 && (
                <div className="mt-6 rounded-[var(--radius-ui)] border border-sand bg-sand-soft/50 p-4 text-xs text-[#523e32]">
                  <p className="font-bold flex items-center gap-1.5 text-terracotta mb-1">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    Catatan Tambahan untuk Kasus Ini:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentCase.procedureNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related services links if any */}
              {currentCase.relatedServiceIds && currentCase.relatedServiceIds.length > 0 && (
                <div className="mt-6 pt-4 border-t border-line text-xs">
                  <span className="text-muted font-semibold">Terkait dengan prosedur layanan lain: </span>
                  {currentCase.relatedServiceIds.map((relId) => {
                    const relService = SERVICES.find((s) => s.id === relId);
                    if (!relService) return null;
                    return (
                      <Link
                        key={relId}
                        to={`/layanan/${relId}`}
                        className="inline-flex items-center gap-1 ml-2 font-bold text-primary hover:underline"
                      >
                        {relService.title} &rarr;
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Official Forms Cards Section */}
            {caseForms.length > 0 && (
              <section className="card p-6 sm:p-8 bg-surface" aria-labelledby="formulir-title">
                <div className="border-b border-line pb-4 mb-6">
                  <h2 id="formulir-title" className="text-lg font-bold text-primary-dark">
                    Formulir Resmi yang Diperlukan
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Unduh dan cetak formulir resmi yang telah diverifikasi sebelum mendatangi loket pelayanan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caseForms.map((form) => (
                    <OfficialFormCard key={form.id} form={form} />
                  ))}
                </div>
              </section>
            )}

            {/* Procedure Steps Section */}
            <section className="card p-6 sm:p-8 bg-surface" aria-labelledby="prosedur-title">
              <div className="border-b border-line pb-4 mb-6">
                <h2 id="prosedur-title" className="text-lg font-bold text-primary-dark">
                  Tahapan Prosedur Pelayanan
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Langkah yang harus dilalui pemohon mulai dari penyiapan berkas hingga selesai.
                </p>
              </div>

              <ProcedureTimeline steps={service.procedureSteps} />
            </section>

            {/* General Notes & Boundary Notice */}
            <section className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-xs text-muted-strong space-y-2">
              <h3 className="font-bold text-ink text-sm">Ketentuan & Batasan Layanan</h3>
              <ul className="list-disc pl-5 space-y-1">
                {service.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
                <li>
                  Prototipe Capstone ini tidak menggantikan integrasi sistem pusat Dukcapil atau aplikasi JAKI resmi Pemprov DKI Jakarta.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
