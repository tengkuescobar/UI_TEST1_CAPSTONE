import { useState } from 'react';
import { History, Search, Shield, Filter } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { ROLE_LABEL } from '../../data/status';
import type { AuditEntry } from '../../types';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatDateTime } from '../../lib/format';

export function AdminAudit() {
  const { audit } = useStore();
  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filtered = audit.filter((entry) => {
    if (filterRole !== 'all' && entry.role !== filterRole) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        entry.action.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q) ||
        entry.actor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<AuditEntry>[] = [
    {
      key: 'at',
      header: 'Waktu Kejadian',
      render: (row) => <span className="font-mono text-xs text-muted">{formatDateTime(row.at)}</span>,
    },
    {
      key: 'actor',
      header: 'Pelaku Aksi & Peran',
      render: (row) => (
        <div>
          <span className="font-bold text-ink block">{row.actor}</span>
          <span className="text-[11px] font-semibold text-terracotta bg-sand-soft px-2 py-0.5 rounded-full inline-block mt-0.5">
            {ROLE_LABEL[row.role]}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Aksi yang Dilakukan',
      render: (row) => <span className="font-semibold text-primary-dark">{row.action}</span>,
    },
    {
      key: 'target',
      header: 'Sasaran / Objek',
      render: (row) => <span className="font-mono text-xs text-ink font-bold">{row.target}</span>,
    },
  ];

  return (
    <DashboardLayout title="Log Audit Sistem">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Catatan Audit Log Sistem</h1>
          <p className="text-xs text-muted mt-1">
            Rekam jejak seluruh aktivitas otorisasi, perubahan status permohonan, dan konfigurasi data dalam sesi demonstrasi.
          </p>
        </div>

        {/* Filter */}
        <div className="card p-4 bg-surface flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari aksi, pelaku, atau target objek..."
              className="field-input pl-9! text-xs"
              aria-label="Cari audit log"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-audit-role" className="text-xs font-bold text-muted whitespace-nowrap">
              Peran:
            </label>
            <select
              id="filter-audit-role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="field-input min-h-9 py-1 px-3 text-xs w-auto cursor-pointer"
            >
              <option value="all">Semua Peran ({audit.length})</option>
              <option value="warga">Warga</option>
              <option value="petugas">Petugas</option>
              <option value="lurah">Lurah</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <DataTable
          caption="Tabel Log Audit"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="action"
          emptyTitle="Belum Ada Catatan Log"
          emptyDescription="Aktivitas yang Anda lakukan di dalam aplikasi demo akan otomatis tercatat di sini."
        />
      </div>
    </DashboardLayout>
  );
}
