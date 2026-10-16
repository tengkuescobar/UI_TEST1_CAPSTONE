import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { OFFICIAL_FORMS } from '../../data/forms';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';

export function GuidePage() {
  const formsList = Object.values(OFFICIAL_FORMS);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />

      <main id="main-content" className="flex-1 py-10 lg:py-14">
        <div className="container-page max-w-4xl space-y-10">
          {/* Header */}
          <div>
            <p className="eyebrow">Panduan & Prosedur</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-dark mt-1">
              Panduan Pelayanan Warga Kelurahan
            </h1>
            <p className="text-muted-strong text-base mt-2 leading-relaxed">
              Petunjuk umum penyiapan dokumen administrasi kependudukan dan pemanfaatan sistem informasi digital Kelurahan Pesanggrahan.
            </p>
          </div>

          {/* Section 1: Prinsip Pelayanan */}
          <section className="card p-6 sm:p-8 bg-surface space-y-4">
            <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
              <BookOpen className="size-5 text-primary" aria-hidden="true" />
              1. Prinsip & Batasan Layanan Digital (Capstone)
            </h2>
            <p className="text-sm text-muted-strong leading-relaxed">
              Sistem Informasi ini dikembangkan sebagai prototipe Capstone mahasiswa untuk meningkatkan transparansi informasi dan kecepatan alur administrasi di lingkungan Kelurahan Pesanggrahan.
            </p>
            <div className="rounded-[var(--radius-ui)] border border-[#c8d8e0] bg-[#eef4f7] p-4 text-xs text-primary-dark space-y-2">
              <p className="font-bold">Ketentuan Penting yang Perlu Diketahui Warga:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Dokumen Kependudukan (KTP-el, KK, KIA, Akta):</strong> Sistem ini menyediakan panduan resmi persyaratan dan tautan formulir resmi. Pencetakan fisik dan perekaman biometrik tetap dilakukan di loket resmi Dukcapil Kelurahan Pesanggrahan.
                </li>
                <li>
                  <strong>Surat Administrasi Kelurahan (Ahli Waris & Rekomendasi Taspen):</strong> Disediakan simulasi pengajuan daring (demo submission) untuk memperlihatkan alur verifikasi berkas oleh staf pelayanan hingga persetujuan Lurah.
                </li>
                <li>
                  <strong>Keamanan Identitas:</strong> Prototipe ini menggunakan data sintetis demo dan tidak mengumpulkan NIK atau dokumen pribadi warga yang sebenarnya.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Arsip Formulir Resmi */}
          <section className="card p-6 sm:p-8 bg-surface space-y-4">
            <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
              <FileText className="size-5 text-terracotta" aria-hidden="true" />
              2. Daftar Formulir Resmi Kelurahan (Google Drive Terverifikasi)
            </h2>
            <p className="text-sm text-muted-strong">
              Gunakan formulir resmi berikut yang dapat diunduh langsung dari arsip Google Drive kelurahan:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {formsList.map((form) => (
                <div key={form.id} className="flex items-start justify-between gap-3 rounded-md border border-line bg-[#f8f9f9] p-3 text-xs">
                  <div className="min-w-0">
                    <span className="font-bold text-primary-dark block text-sm">{form.title}</span>
                    <span className="text-muted block mt-0.5">{form.description}</span>
                  </div>
                  <a
                    href={form.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1 rounded bg-primary px-3 text-white font-bold shrink-0 hover:bg-primary-dark"
                  >
                    Buka
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Alur Pengaduan */}
          <section className="card p-6 sm:p-8 bg-surface space-y-4">
            <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green" aria-hidden="true" />
              3. Tata Cara Pengaduan Warga
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-strong">
              <li>
                <strong>Pilih Kategori:</strong> Tentukan topik keluhan seperti kebersihan lingkungan, kerusakan jalan/lampu, saluran air/banjir, atau pelayanan kelurahan.
              </li>
              <li>
                <strong>Tuliskan Lokasi Spesifik:</strong> Sertakan informasi RT, RW, atau patokan tempat agar petugas mudah meninjau ke lapangan.
              </li>
              <li>
                <strong>Pantau Tiket:</strong> Setelah membuat pengaduan, Anda akan memperoleh nomor tiket unik untuk memantau status tindak lanjut petugas di halaman Lacak Status.
              </li>
            </ol>
            <div className="pt-2">
              <Link
                to="/pengaduan"
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-terracotta px-5 text-sm font-bold text-white hover:bg-[#834f36]"
              >
                Menuju Halaman Pengaduan
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
