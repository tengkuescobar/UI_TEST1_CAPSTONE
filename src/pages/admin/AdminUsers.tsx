import { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, XCircle, Search, Edit2 } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import type { DemoUser, Role } from '../../types';
import { ROLE_LABEL } from '../../data/status';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { TextField, SelectField } from '../../components/ui/Field';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function AdminUsers() {
  const { users, saveUser, toggleUserActive } = useStore();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [editingUser, setEditingUser] = useState<DemoUser | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState<Exclude<Role, 'pengunjung'>>('warga');
  const [unit, setUnit] = useState('');

  const openAddModal = () => {
    setIsNew(true);
    setEditingUser({
      id: `u-${Date.now().toString(36)}`,
      name: '',
      email: '',
      role: 'warga',
      unit: 'RW 01',
      active: true,
    });
    setName('');
    setEmail('');
    setUserRole('warga');
    setUnit('RW 01');
  };

  const openEditModal = (u: DemoUser) => {
    setIsNew(false);
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setUserRole(u.role);
    setUnit(u.unit);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !name.trim() || !email.trim()) return;

    saveUser({
      ...editingUser,
      name,
      email,
      role: userRole,
      unit: unit || 'Unit Pelayanan',
    });

    toast({
      title: isNew ? 'Pengguna Ditambahkan' : 'Data Pengguna Diperbarui',
      description: `Akun ${name} (${ROLE_LABEL[userRole]}) berhasil disimpan.`,
      tone: 'success',
    });

    setEditingUser(null);
  };

  const handleToggleActive = (u: DemoUser) => {
    toggleUserActive(u.id);
    toast({
      title: u.active ? 'Akun Dinonaktifkan' : 'Akun Diaktifkan',
      description: `Status akun ${u.name} telah diubah.`,
      tone: 'info',
    });
  };

  const filtered = users.filter((u) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.unit.toLowerCase().includes(q);
  });

  const columns: Column<DemoUser>[] = [
    {
      key: 'name',
      header: 'Nama & Email',
      render: (row) => (
        <div>
          <span className="font-bold text-ink block">{row.name}</span>
          <span className="text-xs text-muted block">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Peran Akses',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-sand-soft text-[#69432f] border border-sand">
          <Shield className="size-3" aria-hidden="true" />
          {ROLE_LABEL[row.role]}
        </span>
      ),
    },
    {
      key: 'unit',
      header: 'Unit / Wilayah',
      render: (row) => <span className="text-xs text-muted-strong font-medium">{row.unit}</span>,
    },
    {
      key: 'status',
      header: 'Status Akun',
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
    <DashboardLayout title="Manajemen Pengguna & Peran">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary-dark">Manajemen Pengguna & Peran</h1>
            <p className="text-xs text-muted mt-1">
              Atur hak akses akun demo untuk simulasi alur Warga, Petugas Pelayanan, Lurah, dan Admin.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Tambah Pengguna Demo
          </button>
        </div>

        {/* Filter */}
        <div className="card p-3 bg-surface">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, email, atau unit..."
              className="field-input pl-9! text-xs"
              aria-label="Cari pengguna"
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          caption="Tabel Pengguna Sistem"
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          primaryKey="name"
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => openEditModal(row)}
                className="inline-flex min-h-8 items-center gap-1 rounded-[var(--radius-ui)] border border-line bg-surface px-2.5 text-xs font-semibold text-muted-strong hover:border-primary hover:text-primary cursor-pointer"
              >
                <Edit2 className="size-3" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(row)}
                className={`inline-flex min-h-8 items-center rounded-[var(--radius-ui)] px-2.5 text-xs font-bold transition-colors cursor-pointer ${row.active ? 'text-danger hover:bg-[#fbecea]' : 'text-green hover:bg-[#e7f1eb]'}`}
              >
                {row.active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          )}
        />

        {/* Edit / Add Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/50 p-4">
            <div className="card p-6 sm:p-8 bg-surface max-w-md w-full shadow-raised animate-toast-in">
              <h2 className="text-lg font-bold text-primary-dark mb-4">
                {isNew ? 'Tambah Pengguna Demo' : 'Ubah Data Pengguna & Peran'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <TextField
                  id="user-name"
                  label="Nama Pengguna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <TextField
                  id="user-email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <SelectField
                  id="user-role"
                  label="Peran Akses"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as Exclude<Role, 'pengunjung'>)}
                  options={[
                    { value: 'warga', label: 'Warga' },
                    { value: 'petugas', label: 'Petugas Kelurahan' },
                    { value: 'lurah', label: 'Pimpinan / Lurah' },
                    { value: 'admin', label: 'Admin Sistem' },
                  ]}
                  required
                />

                <TextField
                  id="user-unit"
                  label="Unit Kerja / Wilayah RW"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Misal: RW 03 atau Seksi Pelayanan"
                  required
                />

                <div className="pt-4 border-t border-line flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="inline-flex min-h-10 items-center rounded-[var(--radius-ui)] border border-line px-4 text-xs font-semibold text-muted hover:bg-[#f4f6f7]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-5 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
