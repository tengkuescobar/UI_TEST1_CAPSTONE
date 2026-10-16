import { useState } from 'react';
import { Search, Filter, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { SERVICES, CATEGORY_LABEL, countAdmindukCategories } from '../../data/services';
import type { Service, ServiceCategory } from '../../types';
import { searchServices } from '../../lib/requirements';
import { ServiceCard } from '../../components/service/ServiceCard';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { cx } from '../../lib/format';

export function ServiceCatalogPage() {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<'semua' | ServiceCategory>('semua');

  const filtered = searchServices(SERVICES, query, selectedCat);
  const admindukCount = countAdmindukCategories(SERVICES);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />

      <main id="main-content" className="flex-1 py-10 lg:py-14">
        <div className="container-page">
          {/* Page Header */}
          <div className="max-w-3xl">
            <p className="eyebrow">Pelayanan Kelurahan</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-dark mt-1">
              Katalog Layanan Publik
            </h1>
            <p className="text-muted-strong text-base mt-2 leading-relaxed">
              Temukan informasi persyaratan resmi Admindukcapil dan simulasi pengajuan surat administrasi warga Kelurahan Pesanggrahan.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="mt-8 card p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari layanan (misal: KTP, akta, pindah, taspen, hilang)..."
                  className="field-input pl-10!"
                  aria-label="Cari layanan kependudukan"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted flex items-center gap-1 mr-1">
                  <Filter className="size-3.5" aria-hidden="true" />
                  Kategori:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCat('semua')}
                  aria-pressed={selectedCat === 'semua'}
                  className={cx(
                    'min-h-9 rounded-full px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer',
                    selectedCat === 'semua'
                      ? 'bg-primary-dark text-white'
                      : 'bg-[#f0f3f4] text-muted-strong hover:bg-[#e2e7e9]',
                  )}
                >
                  Semua ({SERVICES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCat('adminduk')}
                  aria-pressed={selectedCat === 'adminduk'}
                  className={cx(
                    'min-h-9 rounded-full px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer',
                    selectedCat === 'adminduk'
                      ? 'bg-primary-dark text-white'
                      : 'bg-[#f0f3f4] text-muted-strong hover:bg-[#e2e7e9]',
                  )}
                >
                  Panduan Adminduk ({admindukCount} klaster)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCat('surat')}
                  aria-pressed={selectedCat === 'surat'}
                  className={cx(
                    'min-h-9 rounded-full px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer',
                    selectedCat === 'surat'
                      ? 'bg-primary-dark text-white'
                      : 'bg-[#f0f3f4] text-muted-strong hover:bg-[#e2e7e9]',
                  )}
                >
                  Surat Administrasi (2 Demo)
                </button>
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-strong">
                Menampilkan <strong className="text-ink">{filtered.length}</strong> layanan yang tersedia:
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="card text-center p-12">
                <p className="text-base font-bold text-primary-dark">Layanan tidak ditemukan</p>
                <p className="text-sm text-muted mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSelectedCat('semua');
                  }}
                  className="mt-4 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
