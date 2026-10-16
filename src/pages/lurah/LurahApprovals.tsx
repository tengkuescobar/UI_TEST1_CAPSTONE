import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { SERVICES } from '../../data/services';
import { ApplicationStatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDate } from '../../lib/format';

export function LurahApprovals() {
  const { applications } = useStore();
  const [tab, setTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [query, setQuery] = useState('');

  const filtered = applications.filter((app) => {
    if (tab === 'pending' && app.status !== 'menunggu_persetujuan') return false;
    if (tab === 'approved' && app.status !== 'disetujui' && app.status !== 'selesai') return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const s = SERVICES.find((x) => x.id === app.serviceId);
      return (
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        (s?.title ?? '').toLowerCase().includes(q)
      );
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
      header: 'Pemohon',
      render: (row) => (
        <div>
          <span className="font-bold text-ink block">{row.applicantName}</span>
          <span className="text-xs text-muted block">Alamat: {row.address}</span>
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
      header: 'Status',
      render: (row) => <ApplicationStatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout title="Persetujuan Dokumen Lurah">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Persetujuan Dokumen Kelurahan</h1>
          <p className="text-xs text-muted mt-1">
            Peninjauan dan otorisasi persetujuan surat keterangan warga yang telah diverifikasi petugas.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
          <button
            type="button"
            onClick={() => setTab('pending')}
            className={`min-h-9 px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${tab === 'pending' ? 'bg-primary-dark text-white' : 'bg-surface border border-line text-muted-strong hover:bg-[#f4f6f7]'}`}
          >
            Menunggu Persetujuan ({applications.filter((a) => a.status === 'menunggu_persetujuan').length})
          </button>
          <button
            type="button"
            onClick={() => setTab('approved')}
            className={`min-h-9 px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${tab === 'approved' ? 'bg-primary-dark text-white' : 'bg-surface border border-line text-muted-strong hover:bg-[#f4f6f7]'}`}
          >
            Telah Disetujui ({applications.filter((a) => a.status === 'disetujui' || a.status === 'selesai').length})
          </button>
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`min-h-9 px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${tab === 'all' ? 'bg-primary-dark text-white' : 'bg-surface border border-line text-muted-strong hover:bg-[#f4f6f7]'}`}
          >
            Semua Berkas ({applications.length})
          </button>
        </div>

        {/* Search */}
        <div className="card p-3 bg-surface">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama pemohon atau nomor berkas..."
              className="field-input pl-9! text-xs"
              aria-label="Cari berkas"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          caption="Tabel Persetujuan Lurah"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="applicant"
          emptyTitle="Tidak Ada Berkas Menunggu"
          emptyDescription="Tidak ada permohonan surat yang memerlukan tindakan persetujuan saat ini."
          actions={(row) => (
            <Link
              to={`/lurah/persetujuan/${row.id}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-ui)] bg-primary px-3 text-xs font-bold text-white hover:bg-primary-dark"
            >
              Periksa & Otorisasi
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
