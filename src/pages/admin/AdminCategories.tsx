import { useState } from 'react';
import { Tags, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { useToast } from '../../state/ToastContext';
import { TextField, TextAreaField } from '../../components/ui/Field';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function AdminCategories() {
  const { categories, addCategory, removeCategory } = useStore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      description: description.trim() || 'Kategori pengaduan masyarakat.',
    });

    toast({
      title: 'Kategori Ditambahkan',
      description: `Kategori "${name}" berhasil ditambahkan ke pilihan pengaduan.`,
      tone: 'success',
    });

    setName('');
    setDescription('');
    setShowAdd(false);
  };

  const handleRemove = (id: string, catName: string) => {
    removeCategory(id);
    toast({
      title: 'Kategori Dihapus',
      description: `Kategori "${catName}" telah dihapus.`,
      tone: 'info',
    });
  };

  return (
    <DashboardLayout title="Kategori Pengaduan Warga">
      <div className="space-y-6 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary-dark">Kategori Pengaduan Warga</h1>
            <p className="text-xs text-muted mt-1">
              Atur topik dan klasifikasi bidang laporan pengaduan fasilitas lingkungan warga.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="size-4" aria-hidden="true" />
            Tambah Kategori
          </button>
        </div>

        {/* Add Category Form */}
        {showAdd && (
          <form onSubmit={handleAdd} className="card p-6 bg-surface border-primary space-y-4 shadow-sm animate-toast-in">
            <h2 className="text-base font-bold text-primary-dark">Tambah Kategori Baru</h2>
            <TextField
              id="cat-name"
              label="Nama Kategori"
              placeholder="Contoh: Penerangan Jalan Umum"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextAreaField
              id="cat-desc"
              label="Deskripsi Kategori"
              placeholder="Jelaskan jenis laporan yang termasuk dalam kategori ini..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="inline-flex min-h-10 items-center rounded-[var(--radius-ui)] border border-line px-4 text-xs font-semibold text-muted hover:bg-[#f4f6f7]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-primary px-5 text-xs font-bold text-white hover:bg-primary-dark"
              >
                Simpan Kategori
              </button>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="card divide-y divide-line bg-surface overflow-hidden">
          {categories.map((c) => (
            <div key={c.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#fbfcfc] transition-colors">
              <div className="min-w-0">
                <span className="font-bold text-sm sm:text-base text-primary-dark block">{c.name}</span>
                <span className="text-xs text-muted block mt-1">{c.description}</span>
                <span className="text-[11px] font-mono text-muted bg-[#f4f6f7] px-2 py-0.5 rounded mt-2 inline-block">
                  id: {c.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(c.id, c.name)}
                className="flex size-9 shrink-0 items-center justify-center rounded text-muted hover:text-danger hover:bg-[#fbecea] transition-colors"
                aria-label={`Hapus kategori ${c.name}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
