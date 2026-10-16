import { useState } from 'react';
import { Settings, CheckCircle2, XCircle, Search, FileText, BookOpen } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import type { Service } from '../../types';
import { CATEGORY_LABEL } from '../../data/services';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function AdminServices() {
  const { services, updateService } = useStore();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const toggleServiceActive = (s: Service) => {
    updateService({ ...s, active: !s.active });
    toast({
      title: s.active ? 'Layanan Dinonaktifkan' : 'Layanan Diaktifkan',
      description: `Status katalog ${s.title} berhasil diperbarui.`,
      tone: 'info',
    });
  };

  const filtered = services.filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });

  const columns: Column<Service>[] = [
    {
      key: 'title',
      header: 'Nama Layanan',
      render: (row) => (
        <div>
          <span className="font-bold text-primary-dark block">{row.title}</span>
          <span className="text-xs text-muted block mt-0.5">{row.group ?? CATEGORY_LABEL[row.category]}</span>
        </div>
      ),
    },
    {
      key: 'mode',
      header: 'Mode Layanan',
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.serviceMode === 'demo_submission' ? 'bg-sand-soft text-[#69432f]' : 'bg-[#eef4f7] text-primary'}`}
        >
          {row.serviceMode === 'demo_submission' ? 'Pengajuan Demo' : 'Panduan Resmi Adminduk'}
        </span>
      ),
    },
    {
      key: 'cases',
      header: 'Skenario Kasus',
      render: (row) => (
        <span className="text-xs text-muted-strong font-medium tabular-nums">
          {row.cases.length} kondisi
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status Katalog',
      render: (row) =>
        row.active ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger">
            <XCircle className="size-3.5" aria-hidden="true" />
            Nonaktif
          </span>
        ),
    },
  ];

  return (
    <DashboardLayout title="Pengaturan Katalog Layanan">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Konfigurasi Katalog Layanan</h1>
          <p className="text-xs text-muted mt-1">
            Pengaturan visibilitas dan mode operasional seluruh panduan Adminduk dan surat administrasi warga.
          </p>
        </div>

        {/* Filter */}
        <div className="card p-3 bg-surface">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari layanan dalam katalog..."
              className="field-input pl-9! text-xs"
              aria-label="Cari layanan"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          caption="Tabel Katalog Layanan Admin"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="title"
          actions={(row) => (
            <button
              type="button"
              onClick={() => toggleServiceActive(row)}
              className={`inline-flex min-h-8 items-center rounded-[var(--radius-ui)] px-3 text-xs font-bold transition-colors cursor-pointer ${row.active ? 'text-danger hover:bg-[#fbecea]' : 'text-green hover:bg-[#e7f1eb]'}`}
            >
              {row.active ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
