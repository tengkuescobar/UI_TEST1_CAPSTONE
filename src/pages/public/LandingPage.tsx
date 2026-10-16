import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  FileText,
  MessageSquare,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { SITE } from '../../data/site';
import { SERVICES } from '../../data/services';
import { ServiceCard } from '../../components/service/ServiceCard';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';

export function LandingPage() {
  const [photoError, setPhotoError] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Top featured services to display on the landing page
  const featuredServices = SERVICES.slice(0, 4);

  const howItWorks = [
    {
      step: '01',
      title: 'Daftar atau Masuk',
      description: 'Gunakan akun warga atau akses panduan publik langsung tanpa memerlukan login awal.',
    },
    {
      step: '02',
      title: 'Pilih Layanan',
      description: 'Temukan informasi persyaratan kependudukan atau pilih pengajuan surat administrasi.',
    },
    {
      step: '03',
      title: 'Lengkapi Persyaratan',
      description: 'Periksa daftar berkas wajib dan kondisional, lalu unduh formulir resmi yang dibutuhkan.',
    },
    {
      step: '04',
      title: 'Pantau Status',
      description: 'Lacak tahapan proses verifikasi berkas dan tindak lanjut pengaduan Anda secara berkala.',
    },
  ];

  const faqs = [
    {
      q: 'Apakah semua dokumen kependudukan dapat dicetak secara mandiri melalui website ini?',
      a: 'Tidak. Penerbitan fisik dokumen kependudukan seperti KTP-el dan KIA tetap mengacu pada prosedur resmi Dukcapil dan dilakukan melalui loket kelurahan/Dukcapil. Website ini menyediakan panduan resmi persyaratan dokumen, unduhan formulir, serta simulasi pengajuan surat administrasi kelurahan.',
    },
    {
      q: 'Bagaimana cara melacak berkas permohonan yang telah diajukan?',
      a: 'Anda dapat menggunakan fitur "Lacak Status" pada menu atas dengan memasukkan nomor registrasi pengajuan (contoh: SRT-2026-0012) atau kode tiket pengaduan (contoh: ADU-2026-0031).',
    },
    {
      q: 'Apakah pengaduan warga diproses secara langsung?',
      a: 'Pengaduan yang masuk akan diverifikasi terlebih dahulu oleh petugas kelurahan sesuai kewenangan wilayah, kemudian ditindaklanjuti atau dikoordinasikan dengan instansi teknis terkait.',
    },
    {
      q: 'Bagaimana bila persyaratan saya berbeda dengan daftar umum?',
      a: 'Gunakan fitur pemilihan skenario kondisi pada halaman detail layanan (misalnya penggantian karena hilang vs rusak) untuk melihat daftar dokumen spesifik yang sesuai dengan kondisi Anda.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />

      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="relative border-b border-line bg-gradient-to-b from-surface via-surface to-bg py-12 lg:py-20">
          <div className="container-page">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left Column: Headlines & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-sand bg-sand-soft px-3.5 py-1 text-xs font-bold text-terracotta">
                  <Building2 className="size-3.5" aria-hidden="true" />
                  <span>Kantor Kelurahan Pesanggrahan, Jakarta Selatan</span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl lg:text-5xl leading-tight">
                  Pelayanan Kelurahan Lebih Mudah, Cepat, dan Transparan
                </h1>

                <p className="text-base sm:text-lg text-muted-strong leading-relaxed max-w-2xl">
                  Ajukan layanan administrasi dan sampaikan pengaduan melalui satu platform digital Kelurahan Pesanggrahan.
                </p>

                {/* Primary & Secondary CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    to="/layanan"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-ui)] bg-primary px-6 text-base font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
                  >
                    Ajukan Layanan
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/pengaduan"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-ui)] border border-[#c3ccd0] bg-surface px-6 text-base font-bold text-primary-dark hover:border-primary hover:bg-[#f2f5f6] transition-colors"
                  >
                    Buat Pengaduan
                  </Link>
                </div>

                {/* Micro Highlights */}
                <div className="grid grid-cols-3 gap-4 border-t border-line/80 pt-6 text-xs text-muted-strong">
                  <div>
                    <span className="block font-extrabold text-lg text-primary-dark">7 Panduan</span>
                    <span>Admindukcapil Resmi</span>
                  </div>
                  <div>
                    <span className="block font-extrabold text-lg text-terracotta">2 Surat</span>
                    <span>Simulasi Administrasi</span>
                  </div>
                  <div>
                    <span className="block font-extrabold text-lg text-green">1 Kanal</span>
                    <span>Pengaduan Warga</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Building Photograph */}
              <div className="lg:col-span-5">
                <div className="card overflow-hidden border-line shadow-card bg-surface">
                  {!photoError ? (
                    <div className="relative aspect-4/3 sm:aspect-1/1 w-full overflow-hidden bg-sand-soft">
                      <img
                        src={SITE.buildingPhoto}
                        alt="Gedung Kantor Lurah Pesanggrahan, Jakarta Selatan"
                        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-102"
                        onError={() => {
                          // Try the URL-encoded fallback or show fallback card
                          if (SITE.fallbackPhoto && SITE.buildingPhoto !== SITE.fallbackPhoto) {
                            const img = new Image();
                            img.src = SITE.fallbackPhoto;
                            img.onload = () => {
                              // If fallback works, update src
                            };
                            img.onerror = () => setPhotoError(true);
                          } else {
                            setPhotoError(true);
                          }
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/40 to-transparent p-4 text-white">
                        <p className="text-xs font-semibold tracking-wider uppercase text-sand">
                          Dokumentasi Wilayah
                        </p>
                        <p className="text-sm font-bold">
                          Kantor Lurah Pesanggrahan, Jakarta Selatan
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Fallback when image asset is unavailable */
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-sand-soft min-h-[320px]">
                      <div className="size-16 rounded-full bg-white flex items-center justify-center text-primary-dark shadow-sm mb-4">
                        <Building2 className="size-8" aria-hidden="true" />
                      </div>
                      <p className="font-bold text-primary-dark text-base">
                        Kantor Kelurahan Pesanggrahan
                      </p>
                      <p className="text-xs text-muted mt-1 max-w-xs">
                        Foto gedung asli sedang dimuat atau tidak tersedia pada peramban ini.
                      </p>
                      <span className="mt-4 inline-block text-[11px] font-semibold text-terracotta bg-white px-3 py-1 rounded-full border border-sand">
                        Kecamatan Pesanggrahan, Jakarta Selatan
                      </span>
                    </div>
                  )}

                  <div className="p-4 border-t border-line/60 bg-surface flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" aria-hidden="true" />
                      Loket: Mengikuti Jam Pelayanan
                    </span>
                    <span className="font-semibold text-primary">Pesanggrahan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE SERVICE PILLARS */}
        <section className="py-14 lg:py-18 container-page" aria-labelledby="layanan-utama-title">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow">Fokus Layanan</p>
            <h2 id="layanan-utama-title" className="text-2xl sm:text-3xl font-extrabold mt-1">
              Tiga Pilar Pelayanan Digital Warga
            </h2>
            <p className="text-muted-strong text-sm sm:text-base mt-2">
              Kemudahan akses administrasi kependudukan dan penyaluran aspirasi warga dalam satu ekosistem terpadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Pelayanan Administrasi Kependudukan */}
            <div className="card p-6 flex flex-col justify-between hover:border-primary transition-all duration-200">
              <div>
                <div className="size-12 rounded-[var(--radius-ui)] bg-[#eef4f7] text-primary flex items-center justify-center mb-4">
                  <FileText className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-primary-dark">
                  1. Pelayanan Administrasi Kependudukan
                </h3>
                <p className="text-sm text-muted-strong mt-2 leading-relaxed">
                  Panduan lengkap persyaratan dokumen kependudukan seperti KTP-el, Kartu Keluarga, KIA, Akta, serta unduhan formulir resmi.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to="/layanan"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
                >
                  Buka Katalog Layanan
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Card 2: Pengaduan Warga */}
            <div className="card p-6 flex flex-col justify-between hover:border-terracotta transition-all duration-200">
              <div>
                <div className="size-12 rounded-[var(--radius-ui)] bg-sand-soft text-terracotta flex items-center justify-center mb-4">
                  <MessageSquare className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-primary-dark">
                  2. Pengaduan Warga
                </h3>
                <p className="text-sm text-muted-strong mt-2 leading-relaxed">
                  Kanal penyampaian keluhan fasilitas publik, kebersihan, saluran air, dan ketertiban lingkungan dengan proses verifikasi jelas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to="/pengaduan"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta hover:text-[#844b32]"
                >
                  Sampaikan Pengaduan
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Card 3: Lacak Status Pengajuan */}
            <div className="card p-6 flex flex-col justify-between hover:border-green transition-all duration-200">
              <div>
                <div className="size-12 rounded-[var(--radius-ui)] bg-[#edf5f0] text-green flex items-center justify-center mb-4">
                  <Search className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-primary-dark">
                  3. Lacak Status Pengajuan
                </h3>
                <p className="text-sm text-muted-strong mt-2 leading-relaxed">
                  Pantau berkas pengajuan surat dan tiket pengaduan Anda secara transparan dari tahap pemeriksaan hingga selesai.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to="/lacak"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-green hover:text-[#325a44]"
                >
                  Lacak Berkas Sekarang
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / ALUR PELAYANAN */}
        <section className="bg-surface border-y border-line py-14 lg:py-20" aria-labelledby="alur-pelayanan-title">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow">Alur Sistem</p>
              <h2 id="alur-pelayanan-title" className="text-2xl sm:text-3xl font-extrabold mt-1">
                Cara Kerja Layanan Digital
              </h2>
              <p className="text-muted-strong text-sm sm:text-base mt-2">
                Empat langkah mudah dalam memanfaatkan platform pelayanan Kelurahan Pesanggrahan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-[var(--radius-card)] border border-line bg-bg/50 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl font-black text-sand-soft tracking-tight block mb-2 tabular-nums">
                      {item.step}
                    </span>
                    <h3 className="text-base font-bold text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-strong mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-line/60">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <CheckCircle2 className="size-3.5 text-green" aria-hidden="true" />
                      Langkah {item.step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED SERVICES CATALOG TEASER */}
        <section className="py-14 lg:py-20 container-page" aria-labelledby="katalog-unggulan-title">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow">Katalog Layanan</p>
              <h2 id="katalog-unggulan-title" className="text-2xl sm:text-3xl font-extrabold mt-1">
                Layanan Kependudukan Populer
              </h2>
              <p className="text-muted-strong text-sm mt-1">
                Pilih layanan untuk memeriksa persyaratan khusus, alur, dan tautan formulir resmi.
              </p>
            </div>
            <Link
              to="/layanan"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
            >
              Lihat Semua 9 Layanan
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="bg-surface border-t border-line py-14 lg:py-20" aria-labelledby="faq-title">
          <div className="container-page max-w-3xl">
            <div className="text-center mb-10">
              <p className="eyebrow">Pusat Bantuan</p>
              <h2 id="faq-title" className="text-2xl sm:text-3xl font-extrabold mt-1">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="text-muted-strong text-sm mt-2">
                Informasi penting seputar batas wewenang sistem dan alur pelayanan di Kelurahan Pesanggrahan.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="card overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base text-ink hover:text-primary cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle className="size-4.5 text-primary shrink-0" aria-hidden="true" />
                        {faq.q}
                      </span>
                      <ChevronRight
                        className={`size-5 text-muted transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-muted-strong border-t border-line/60 bg-[#fbfaf8] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-muted">
                Memerlukan panduan persyaratan yang lebih mendalam?
              </p>
              <Link
                to="/panduan"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                <BookOpen className="size-4" aria-hidden="true" />
                Buka Halaman Panduan Lengkap
              </Link>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-primary-dark text-white py-12 lg:py-16">
          <div className="container-page text-center max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Siap Mengurus Berkas Kependudukan Anda?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-sand/90 leading-relaxed">
              Dapatkan kepastian dokumen dan formulir resmi sebelum datang ke kantor kelurahan, atau ajukan surat administrasi percontohan secara daring.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/layanan"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-ui)] bg-sand px-6 font-bold text-primary-dark hover:bg-white transition-colors"
              >
                Jelajahi Persyaratan
              </Link>
              <Link
                to="/masuk"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-ui)] border border-sand/40 px-6 font-bold text-white hover:bg-white/10 transition-colors"
              >
                Coba Simulasi Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
