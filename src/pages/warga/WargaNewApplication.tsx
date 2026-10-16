import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Send,
  Building2,
} from 'lucide-react';
import { SERVICES } from '../../data/services';
import type { Service, ServiceCase, UploadedDoc } from '../../types';
import { getServiceCase } from '../../lib/requirements';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { ApplicationStepper } from '../../components/application/ApplicationStepper';
import { FileUploadPreview, type LocalFile } from '../../components/application/FileUploadPreview';
import { TextField, TextAreaField, ErrorSummary } from '../../components/ui/Field';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { cx, simulateDelay } from '../../lib/format';

export function WargaNewApplication() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { persona, submitApplication } = useStore();
  const { toast } = useToast();

  // Submission-capable services only
  const availableServices = SERVICES.filter((s) => s.serviceMode === 'demo_submission' && s.active);

  const initialServiceId = searchParams.get('service') || availableServices[0]?.id || 'ahli-waris';
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);

  const currentService = availableServices.find((s) => s.id === selectedServiceId) ?? availableServices[0];
  const currentCase = currentService.cases[0];

  const [step, setStep] = useState(0);
  const steps = ['Pilih Layanan', 'Data Pemohon', 'Unggah Berkas', 'Tinjau & Kirim'];

  // Form State
  const [applicantName, setApplicantName] = useState(persona.name);
  const [applicantPhone, setApplicantPhone] = useState('0812-3456-7890');
  const [address, setAddress] = useState('Jl. Contoh Warga No. 12, RT 003/RW 003, Pesanggrahan');
  const [purpose, setPurpose] = useState('');
  const [extraFieldsData, setExtraFieldsData] = useState<Record<string, string>>({});

  // Files State: mapped by requirement ID
  const [files, setFiles] = useState<Record<string, LocalFile>>({});
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Array<{ field: string; message: string }> = [];
    if (!applicantName.trim()) errs.push({ field: 'name', message: 'Nama pemohon wajib diisi.' });
    if (!applicantPhone.trim()) errs.push({ field: 'phone', message: 'Nomor telepon kontak wajib diisi.' });
    if (!address.trim()) errs.push({ field: 'address', message: 'Alamat domisili wajib diisi.' });
    if (!purpose.trim()) errs.push({ field: 'purpose', message: 'Keperluan pengajuan surat wajib diisi.' });

    // Validate extraFields
    if (currentService.extraFields) {
      for (const ef of currentService.extraFields) {
        if (ef.required && !extraFieldsData[ef.id]?.trim()) {
          errs.push({ field: ef.id, message: `${ef.label} wajib diisi.` });
        }
      }
    }

    setErrors(errs);
    return errs.length === 0;
  };

  // Step 2 Validation (Files)
  const validateStep2 = () => {
    const errs: Array<{ field: string; message: string }> = [];
    const requiredReqs = currentCase.requirements.filter((r) => r.condition === 'required');

    for (const r of requiredReqs) {
      if (!files[r.id]) {
        errs.push({ field: `upload-${r.id}`, message: `Berkas wajib: "${r.label}" belum diunggah.` });
      }
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (validateStep1()) {
        setErrors([]);
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setErrors([]);
        setStep(3);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await simulateDelay(600);

    const uploadedDocs: UploadedDoc[] = Object.entries(files).map(([reqId, file]) => {
      const r = currentCase.requirements.find((x) => x.id === reqId);
      return {
        requirementId: reqId,
        requirementLabel: r?.label ?? reqId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };
    });

    const newId = submitApplication({
      serviceId: currentService.id,
      caseId: currentCase.id,
      applicantName,
      applicantPhone,
      address,
      purpose,
      extra: extraFieldsData,
      documents: uploadedDocs,
    });

    toast({
      title: 'Permohonan Berhasil Dikirim',
      description: `Nomor registrasi Anda: ${newId}. Berkas telah masuk ke antrean petugas.`,
      tone: 'success',
    });

    setIsSubmitting(false);
    navigate(`/warga/pengajuan/${newId}`);
  };

  return (
    <DashboardLayout title="Ajukan Surat Administrasi">
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Stepper Header */}
        <div className="card p-5 sm:p-6 bg-surface">
          <ApplicationStepper steps={steps} current={step} />
        </div>

        {/* Error Summary if any */}
        <ErrorSummary errors={errors} />

        {/* STEP 0: Pilih Layanan */}
        {step === 0 && (
          <div className="card p-6 sm:p-8 bg-surface space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary-dark">Langkah 1: Pilih Surat Administrasi</h2>
              <p className="text-xs text-muted mt-1">
                Pilih jenis surat percontohan yang ingin Anda simulasikan pengajuannya secara daring.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {availableServices.map((srv) => {
                const active = srv.id === selectedServiceId;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={cx(
                      'p-5 rounded-[var(--radius-ui)] border text-left transition-all cursor-pointer flex items-start gap-4',
                      active ? 'border-primary bg-[#eef4f7] shadow-xs' : 'border-line bg-surface hover:border-[#b9c5ca]',
                    )}
                  >
                    <div className={cx('size-10 rounded-[var(--radius-ui)] flex items-center justify-center shrink-0', active ? 'bg-primary text-white' : 'bg-[#f4f6f7] text-muted')}>
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-ink">{srv.title}</span>
                        {active && <span className="text-xs font-bold text-primary flex items-center gap-1"><CheckCircle2 className="size-4" /> Dipilih</span>}
                      </div>
                      <p className="text-xs text-muted-strong mt-1 leading-relaxed">{srv.description}</p>
                      <p className="text-[11px] text-terracotta mt-2 font-semibold">
                        Simulasi alur: Verifikasi Petugas &rarr; Persetujuan Lurah
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-6 text-sm font-bold text-white hover:bg-primary-dark"
              >
                Lanjutkan ke Data Pemohon
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Data Pemohon */}
        {step === 1 && (
          <div className="card p-6 sm:p-8 bg-surface space-y-6">
            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">{currentService.title}</span>
              <h2 className="text-xl font-bold text-primary-dark mt-0.5">Langkah 2: Lengkapi Data Pemohon</h2>
              <p className="text-xs text-muted mt-1">
                Isi data diri pemohon dan rincian permohonan surat administrasi.
              </p>
            </div>

            <div className="space-y-4">
              <TextField
                id="name"
                label="Nama Lengkap Pemohon"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  id="phone"
                  label="Nomor Telepon / WhatsApp"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  hint="Untuk konfirmasi status berkas"
                  required
                />
                <TextField
                  id="address"
                  label="Alamat Domisili di Pesanggrahan"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <TextAreaField
                id="purpose"
                label="Keperluan Pengajuan Surat"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Misal: untuk keperluan pengurusan warisan keluarga / klaim pensiun Taspen"
                rows={3}
                required
              />

              {/* Extra fields specific to the service */}
              {currentService.extraFields && currentService.extraFields.length > 0 && (
                <div className="pt-4 border-t border-line space-y-4">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">
                    Data Tambahan Terkait Layanan Ini:
                  </p>
                  {currentService.extraFields.map((ef) => (
                    <TextField
                      key={ef.id}
                      id={ef.id}
                      label={ef.label}
                      type={ef.type === 'date' ? 'date' : 'text'}
                      hint={ef.hint}
                      value={extraFieldsData[ef.id] || ''}
                      onChange={(e) => setExtraFieldsData({ ...extraFieldsData, [ef.id]: e.target.value })}
                      required={ef.required}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] border border-line px-5 text-sm font-semibold text-muted-strong hover:bg-[#f4f6f7]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Kembali
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-6 text-sm font-bold text-white hover:bg-primary-dark"
              >
                Lanjutkan ke Unggah Berkas
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Unggah Persyaratan */}
        {step === 2 && (
          <div className="card p-6 sm:p-8 bg-surface space-y-6">
            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">{currentService.title}</span>
              <h2 className="text-xl font-bold text-primary-dark mt-0.5">Langkah 3: Unggah Dokumen Persyaratan</h2>
              <p className="text-xs text-muted mt-1">
                Unggah dokumen pendukung untuk diperiksa petugas. Gunakan file PDF atau foto dokumen contoh.
              </p>
            </div>

            <div className="rounded-[var(--radius-ui)] border border-sand bg-sand-soft/50 p-4 text-xs text-[#523e32]">
              <p className="font-bold">Ketentuan Unggah Simulasi:</p>
              <p className="mt-0.5">
                Batas ukuran per berkas 2 MB (format PDF, JPG, PNG). Berkas hanya diproses dalam peramban demo dan tidak dikirimkan ke server luar.
              </p>
            </div>

            <div className="space-y-4">
              {currentCase.requirements.map((req) => (
                <FileUploadPreview
                  key={req.id}
                  requirement={req}
                  value={files[req.id]}
                  onChange={(f) => {
                    if (f) setFiles({ ...files, [req.id]: f });
                    else {
                      const next = { ...files };
                      delete next[req.id];
                      setFiles(next);
                    }
                  }}
                />
              ))}
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] border border-line px-5 text-sm font-semibold text-muted-strong hover:bg-[#f4f6f7]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Kembali
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-6 text-sm font-bold text-white hover:bg-primary-dark"
              >
                Tinjau Pengajuan
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Tinjau & Kirim */}
        {step === 3 && (
          <div className="card p-6 sm:p-8 bg-surface space-y-6">
            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">Konfirmasi Akhir</span>
              <h2 className="text-xl font-bold text-primary-dark mt-0.5">Langkah 4: Tinjau Data Permohonan</h2>
              <p className="text-xs text-muted mt-1">
                Pastikan data yang Anda isi sudah benar sebelum dikirimkan ke petugas pelayanan.
              </p>
            </div>

            {/* Summary Details */}
            <div className="space-y-4 divide-y divide-line text-sm">
              <div className="pt-2">
                <span className="text-xs font-bold text-muted uppercase">Jenis Surat</span>
                <p className="font-bold text-primary-dark text-base mt-0.5">{currentService.title}</p>
              </div>

              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-bold text-muted uppercase">Nama Pemohon</span>
                  <p className="font-medium text-ink mt-0.5">{applicantName}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-muted uppercase">Kontak Telepon</span>
                  <p className="font-medium text-ink mt-0.5">{applicantPhone}</p>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-xs font-bold text-muted uppercase">Alamat Domisili</span>
                <p className="font-medium text-ink mt-0.5">{address}</p>
              </div>

              <div className="pt-3">
                <span className="text-xs font-bold text-muted uppercase">Keperluan</span>
                <p className="font-medium text-ink mt-0.5">{purpose}</p>
              </div>

              {/* Extra data review */}
              {Object.keys(extraFieldsData).length > 0 && (
                <div className="pt-3 space-y-2">
                  <span className="text-xs font-bold text-muted uppercase">Rincian Tambahan Layanan</span>
                  {Object.entries(extraFieldsData).map(([k, v]) => {
                    const label = currentService.extraFields?.find((x) => x.id === k)?.label ?? k;
                    return (
                      <p key={k} className="text-xs">
                        <span className="text-muted">{label}: </span>
                        <strong className="text-ink">{v}</strong>
                      </p>
                    );
                  })}
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="pt-3">
                <span className="text-xs font-bold text-muted uppercase block mb-2">
                  Dokumen yang Diunggah ({Object.keys(files).length})
                </span>
                <ul className="space-y-2">
                  {Object.entries(files).map(([reqId, file]) => {
                    const r = currentCase.requirements.find((x) => x.id === reqId);
                    return (
                      <li key={reqId} className="flex items-center justify-between rounded bg-[#f4f6f7] p-2.5 text-xs">
                        <span className="font-semibold text-ink">{r?.label ?? reqId}</span>
                        <span className="text-muted font-mono">{file.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] border border-line px-5 text-sm font-semibold text-muted-strong hover:bg-[#f4f6f7]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Ubah Berkas
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-7 text-sm font-bold text-white hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Kirim Permohonan
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
