import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquarePlus, MessageSquare, ArrowRight, Search } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { ComplaintStatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function WargaComplaints() {
  const { persona, complaints, categories } = useStore();
  const [filterCategory, setFilterCategory] = useState('all');
  const [query, setQuery] = useState('');

  const myComplaints = complaints.filter((c) => c.ownerId === persona.id);

  const filtered = myComplaints.filter((c) => {
    if (filterCategory !== 'all' && c.categoryId !== filterCategory) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    }
    return true;
  });

  const columns: Column<(typeof myComplaints)[0]>[] = [
    {
      key: 'id',
      header: 'No. Tiket',
      render: (row) => <span className="font-mono font-bold text-ink">{row.id}</span>,
    },
    {
      key: 'title',
      header: 'Judul Pengaduan',
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
      header: 'Tanggal',
      render: (row) => <span className="text-xs text-muted">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <ComplaintStatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout title="Daftar Pengaduan Warga">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary-dark">Pengaduan yang Anda Laporkan</h1>
            <p className="text-xs text-muted mt-1">
              Pantau proses tindak lanjut atas aspirasi dan keluhan fasilitas lingkungan Anda.
            </p>
          </div>
          <Link
            to="/warga/pengaduan/baru"
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-terracotta px-5 text-sm font-bold text-white shadow-xs hover:bg-[#834f36] transition-colors self-start sm:self-auto"
          >
            <MessageSquarePlus className="size-4" aria-hidden="true" />
            Buat Pengaduan Baru
          </Link>
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
            <label htmlFor="filter-cat" className="text-xs font-bold text-muted whitespace-nowrap">
              Kategori:
            </label>
            <select
              id="filter-cat"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="field-input min-h-9 py-1 px-3 text-xs w-auto cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
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
          caption="Tabel Pengaduan Warga"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="title"
          emptyTitle="Belum Ada Pengaduan"
          emptyDescription="Anda belum pernah membuat pengaduan pada sesi demo ini."
          actions={(row) => (
            <Link
              to={`/warga/pengaduan/${row.id}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] border border-line bg-surface px-3 text-xs font-bold text-primary-dark hover:border-primary"
            >
              Pantau
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
