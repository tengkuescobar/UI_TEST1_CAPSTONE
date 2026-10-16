import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, UserCheck, ShieldCheck, ArrowRight, User } from 'lucide-react';
import type { Role } from '../../types';
import { ROLE_LABEL, ROLE_PERSONA, ROLE_HOME } from '../../data/status';
import { useStore } from '../../state/AppStore';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';

export function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>('warga');

  const demoAccounts: Array<{ role: Role; title: string; desc: string; persona: string }> = [
    {
      role: 'warga',
      title: 'Akun Warga (Demo)',
      desc: 'Simulasi mengajukan surat administrasi, mengunggah berkas, dan memantau status pengaduan.',
      persona: 'Rina Lestari (RW 03)',
    },
    {
      role: 'petugas',
      title: 'Petugas Pelayanan Kelurahan',
      desc: 'Memeriksa berkas permohonan masuk, menandai verifikasi dokumen, dan menindaklanjuti pengaduan warga.',
      persona: 'Andi Pratama (Seksi Pelayanan)',
    },
    {
      role: 'lurah',
      title: 'Pimpinan / Lurah',
      desc: 'Dashboard eksekutif untuk meninjau dan menyetujui surat keterangan yang telah diverifikasi petugas.',
      persona: 'Lurah Kelurahan Pesanggrahan',
    },
    {
      role: 'admin',
      title: 'Admin Sistem',
      desc: 'Pengaturan pengguna & peran, konfigurasi katalog layanan, kategori pengaduan, dan pemeriksaan log audit.',
      persona: 'Admin Sistem (Demo)',
    },
  ];

  const handleQuickLogin = (role: Role) => {
    setRole(role);
    navigate(ROLE_HOME[role]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />

      <main id="main-content" className="flex-1 py-12 lg:py-16">
        <div className="container-page max-w-xl">
          <div className="card p-6 sm:p-8 bg-surface shadow-card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="size-12 rounded-[var(--radius-ui)] bg-primary-dark text-sand flex items-center justify-center mx-auto mb-3">
                <Building2 className="size-6" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-extrabold text-primary-dark">
                Masuk ke Portal Layanan
              </h1>
              <p className="text-xs text-muted mt-1">
                Sistem Informasi Pelayanan Kelurahan Pesanggrahan (Prototipe Capstone)
              </p>
            </div>

            {/* Capstone Simulation Banner */}
            <div className="mb-6 rounded-[var(--radius-ui)] border border-sand bg-sand-soft/70 p-4 text-xs text-[#523e32]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold text-primary-dark">Simulasi Akses Demo Bebas Sandi</p>
                  <p className="mt-0.5 leading-relaxed">
                    Untuk memudahkan pengujian dan penilaian Capstone, Anda dapat langsung memilih salah satu peran pengguna di bawah ini untuk mengakses dashboard terkait.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Demo Role Cards */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted uppercase tracking-wider">
                Pilih Akun Demo untuk Masuk:
              </p>

              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickLogin(acc.role)}
                  className="w-full text-left p-4 rounded-[var(--radius-ui)] border border-line bg-surface hover:border-primary hover:bg-[#f4f7f9] transition-all flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-primary-dark group-hover:text-primary">
                        {acc.title}
                      </span>
                      <span className="text-[11px] font-semibold text-terracotta bg-sand-soft px-2 py-0.5 rounded-full">
                        {acc.persona}
                      </span>
                    </div>
                    <p className="text-xs text-muted-strong mt-1 leading-relaxed">
                      {acc.desc}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" aria-hidden="true" />
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-line text-center text-xs text-muted">
              <span>Hanya ingin memeriksa informasi syarat Adminduk? </span>
              <Link to="/layanan" className="font-bold text-primary hover:underline">
                Buka Katalog Layanan Publik
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
