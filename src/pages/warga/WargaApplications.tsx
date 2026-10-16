import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FilePlus, Search, ArrowRight } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import type { ApplicationStatus } from '../../types';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function WargaApplications() {
  const { persona, applications } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [query, setQuery] = useState('');

  const myApps = applications.filter((a) => a.ownerId === persona.id);

  const filtered = myApps.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const s = SERVICES.find((x) => x.id === app.serviceId);
      const matchId = app.id.toLowerCase().includes(q);
      const matchTitle = (s?.title ?? '').toLowerCase().includes(q);
      return matchId || matchTitle;
    }
    return true;
  });

  const columns: Column<(typeof myApps)[0]>[] = [
    {
      key: 'id',
      header: 'No. Registrasi',
      render: (row) => <span className="font-mono font-bold text-ink">{row.id}</span>,
    },
    {
      key: 'service',
      header: 'Jenis Surat',
      render: (row) => {
        const s = SERVICES.find((x) => x.id === row.serviceId);
        return <span className="font-semibold text-primary-dark">{s?.title ?? row.serviceId}</span>;
      },
    },
    {
      key: 'date',
      header: 'Tanggal Diajukan',
      render: (row) => <span className="text-muted text-xs">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <ApplicationStatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout title="Riwayat Pengajuan Surat">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary-dark">Daftar Pengajuan Surat Anda</h1>
            <p className="text-xs text-muted mt-1">
              Pantau seluruh berkas surat administrasi yang sedang berjalan atau telah selesai.
            </p>
          </div>
          <Link
            to="/warga/pengajuan/baru"
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-5 text-sm font-bold text-white shadow-xs hover:bg-primary-dark transition-colors self-start sm:self-auto"
          >
            <FilePlus className="size-4" aria-hidden="true" />
            Ajukan Surat Baru
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
              placeholder="Cari nomor berkas atau jenis surat..."
              className="field-input pl-9! text-xs"
              aria-label="Cari pengajuan"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-status" className="text-xs font-bold text-muted whitespace-nowrap">
              Status:
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="field-input min-h-9 py-1 px-3 text-xs w-auto cursor-pointer"
            >
              <option value="all">Semua Status ({myApps.length})</option>
              <option value="diajukan">Diajukan</option>
              <option value="diverifikasi">Sedang Diverifikasi</option>
              <option value="perlu_perbaikan">Perlu Perbaikan</option>
              <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
              <option value="disetujui">Disetujui Lurah</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Data Table / Cards */}
        <DataTable
          caption="Tabel Pengajuan Surat Warga"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="service"
          emptyTitle="Belum Ada Pengajuan Surat"
          emptyDescription="Anda belum pernah mengajukan surat administrasi pada sesi demo ini."
          actions={(row) => (
            <Link
              to={`/warga/pengajuan/${row.id}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] border border-line bg-surface px-3 text-xs font-bold text-primary-dark hover:border-primary"
            >
              Detail
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
