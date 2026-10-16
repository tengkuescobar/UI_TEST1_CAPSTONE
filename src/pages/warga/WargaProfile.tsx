import { User, Shield, MapPin, Mail, Phone } from 'lucide-react';
import { useStore } from '../../state/AppStore';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function WargaProfile() {
  const { persona } = useStore();

  return (
    <DashboardLayout title="Profil Warga">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="card p-6 sm:p-8 bg-surface space-y-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl uppercase">
              {persona.name.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-primary-dark">{persona.name}</h1>
              <p className="text-xs font-semibold text-terracotta flex items-center gap-1 mt-0.5">
                <Shield className="size-3.5" aria-hidden="true" />
                Akun Warga Terverifikasi (Demo)
              </p>
            </div>
          </div>

          <div className="border-t border-line pt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted shrink-0" aria-hidden="true" />
              <span className="text-muted">Email:</span>
              <span className="font-semibold text-ink">rina.demo@contoh.id</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-4 text-muted shrink-0" aria-hidden="true" />
              <span className="text-muted">Telepon:</span>
              <span className="font-semibold text-ink">0800-0000-0001</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-4 text-muted shrink-0" aria-hidden="true" />
              <span className="text-muted">Wilayah:</span>
              <span className="font-semibold text-ink">RT 002 / RW 003, Kelurahan Pesanggrahan</span>
            </div>
          </div>

          <div className="rounded-[var(--radius-ui)] border border-sand bg-sand-soft/60 p-4 text-xs text-[#523e32]">
            <p className="font-bold">Akun Demo Mahasiswa:</p>
            <p className="mt-0.5 leading-relaxed">
              Profil ini merupakan data sintetis untuk pengujian fungsi prototipe frontend sistem informasi kelurahan.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
