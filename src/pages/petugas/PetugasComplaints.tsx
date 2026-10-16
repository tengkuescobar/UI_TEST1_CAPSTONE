import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function PetugasComplaints() {
  const { complaints, categories } = useStore();
  const [filterCategory, setFilterCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = complaints.filter((c) => {
    if (filterCategory !== 'all' && c.categoryId !== filterCategory) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<(typeof complaints)[0]>[] = [
    {
      key: 'id',
      header: 'No. Tiket',
      render: (row) => <span className="font-mono font-bold text-ink">{row.id}</span>,
    },
    {
      key: 'title',
      header: 'Judul Laporan & Lokasi',
      render: (row) => (
        <div>
          <span className="font-bold text-ink block">{row.title}</span>
          <span className="text-xs text-muted block mt-0.5">Lokasi: {row.location}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (row) => {
        const cat = categories.find((x) => x.id === row.categoryId);
        return <span className="text-xs font-semibold text-muted-strong">{cat?.name ?? row.categoryId}</span>;
      },
    },
    {
      key: 'date',
      header: 'Tanggal Masuk',
      render: (row) => <span className="text-xs text-muted">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <ComplaintStatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout title="Pengaduan Warga Masuk">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Daftar Pengaduan Warga Masuk</h1>
          <p className="text-xs text-muted mt-1">
            Verifikasi laporan masyarakat, lakukan peninjauan, dan koordinasikan tindak lanjut penanganan.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="card p-4 bg-surface flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tiket, judul pengaduan, atau lokasi..."
              className="field-input pl-9! text-xs"
              aria-label="Cari pengaduan"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-petugas-cat" className="text-xs font-bold text-muted whitespace-nowrap">
              Kategori:
            </label>
            <select
              id="filter-petugas-cat"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="field-input min-h-9 py-1 px-3 text-xs w-auto cursor-pointer"
            >
              <option value="all">Semua Kategori ({complaints.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          caption="Tabel Pengaduan Petugas"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="title"
          emptyTitle="Tidak Ada Pengaduan"
          emptyDescription="Belum ada tiket pengaduan yang sesuai dengan filter saat ini."
          actions={(row) => (
            <Link
              to={`/petugas/pengaduan/${row.id}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] bg-terracotta px-3 text-xs font-bold text-white hover:bg-[#834f36]"
            >
              Tindak Lanjut
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
