import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, ArrowRight, Filter } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import type { ApplicationStatus } from '../../types';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function PetugasApplications() {
  const { applications } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const s = SERVICES.find((x) => x.id === app.serviceId);
      const matchId = app.id.toLowerCase().includes(q);
      const matchApplicant = app.applicantName.toLowerCase().includes(q);
      const matchTitle = (s?.title ?? '').toLowerCase().includes(q);
      return matchId || matchApplicant || matchTitle;
    }
    return true;
  });

  const columns: Column<(typeof applications)[0]>[] = [
    {
      key: 'id',
      header: 'No. Berkas',
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
      key: 'applicant',
      header: 'Pemohon & Kontak',
      render: (row) => (
        <div>
          <span className="font-bold text-ink block">{row.applicantName}</span>
          <span className="text-xs text-muted block">{row.applicantPhone}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Tanggal Masuk',
      render: (row) => <span className="text-muted text-xs">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status Berkas',
      render: (row) => <ApplicationStatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout title="Pengajuan Masuk Pelayanan">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Daftar Pengajuan Surat Warga</h1>
          <p className="text-xs text-muted mt-1">
            Seluruh berkas masuk yang memerlukan verifikasi administrasi dan persetujuan.
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
              placeholder="Cari nama pemohon, nomor berkas, atau jenis surat..."
              className="field-input pl-9! text-xs"
              aria-label="Cari pengajuan masuk"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="petugas-filter-status" className="text-xs font-bold text-muted whitespace-nowrap">
              Filter Status:
            </label>
            <select
              id="petugas-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="field-input min-h-9 py-1 px-3 text-xs w-auto cursor-pointer"
            >
              <option value="all">Semua Status ({applications.length})</option>
              <option value="diajukan">Diajukan (Belum Diperiksa)</option>
              <option value="diverifikasi">Sedang Diverifikasi</option>
              <option value="perlu_perbaikan">Perlu Perbaikan</option>
              <option value="menunggu_persetujuan">Menunggu Persetujuan Lurah</option>
              <option value="disetujui">Disetujui Lurah</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          caption="Tabel Pengajuan Petugas"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="applicant"
          emptyTitle="Tidak Ada Pengajuan Ditemukan"
          emptyDescription="Tidak ada data pengajuan yang sesuai dengan kriteria filter Anda."
          actions={(row) => (
            <Link
              to={`/petugas/pengajuan/${row.id}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] bg-primary px-3 text-xs font-bold text-white hover:bg-primary-dark"
            >
              Periksa & Verifikasi
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
