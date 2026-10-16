import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, Send, ArrowLeft, AlertCircle } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { TextField, TextAreaField, SelectField, ErrorSummary } from '../../components/ui/Field';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { simulateDelay } from '../../lib/format';

export function WargaNewComplaint() {
  const navigate = useNavigate();
  const { categories, createComplaint } = useStore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'kebersihan');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Array<{ field: string; message: string }> = [];
    if (!title.trim()) errs.push({ field: 'title', message: 'Judul pengaduan wajib diisi.' });
    if (!location.trim()) errs.push({ field: 'location', message: 'Lokasi kejadian / fasilitas wajib diisi.' });
    if (!description.trim()) errs.push({ field: 'description', message: 'Deskripsi rincian pengaduan wajib diisi.' });

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    await simulateDelay(500);

    const newId = createComplaint({
      title,
      categoryId,
      location,
      description,
      attachmentName: attachmentName.trim() || undefined,
    });

    toast({
      title: 'Pengaduan Terkirim',
      description: `Nomor tiket pengaduan Anda: ${newId}. Petugas akan memverifikasi laporan Anda.`,
      tone: 'success',
    });

    setIsSubmitting(false);
    navigate(`/warga/pengaduan/${newId}`);
  };

  return (
    <DashboardLayout title="Buat Pengaduan Warga">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Sampaikan Pengaduan Warga</h1>
          <p className="text-xs text-muted mt-1">
            Laporkan masalah fasilitas umum, kebersihan lingkungan, atau gangguan pelayanan di wilayah Kelurahan Pesanggrahan.
          </p>
        </div>

        <ErrorSummary errors={errors} />

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 bg-surface space-y-5 shadow-card">
          <TextField
            id="title"
            label="Judul Laporan Singkat"
            placeholder="Contoh: Lampu penerangan jalan padam di Gang Contoh"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <SelectField
            id="category"
            label="Kategori Pengaduan"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <TextField
            id="location"
            label="Lokasi Spesifik / RT & RW"
            placeholder="Contoh: Depan Pos RT 003 / RW 002, Jl. Contoh"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            hint="Sebutkan patokan tempat agar petugas mudah meninjau"
            required
          />

          <TextAreaField
            id="description"
            label="Deskripsi Lengkap Masalah"
            placeholder="Jelaskan kondisi permasalahan yang terjadi, perkiraan waktu kejadian, dan dampaknya bagi warga sekitar..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            id="attachment"
            label="Nama Berkas / Foto Bukti (Simulasi)"
            placeholder="Contoh: foto-jalan-rusak.jpg"
            value={attachmentName}
            onChange={(e) => setAttachmentName(e.target.value)}
            hint="Opsional: masukkan nama file foto dokumentasi kondisi lapangan"
          />

          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/warga/pengaduan')}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] border border-line px-5 text-sm font-semibold text-muted-strong hover:bg-[#f4f6f7]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-terracotta px-6 text-sm font-bold text-white hover:bg-[#834f36] transition-colors cursor-pointer"
            >
              <Send className="size-4" aria-hidden="true" />
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
