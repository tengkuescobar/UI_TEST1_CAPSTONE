import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { SITE } from '../../data/site';

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface text-ink">
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Institutional Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-[var(--radius-ui)] bg-primary-dark text-sand">
                <Building2 className="size-5" aria-hidden="true" />
              </div>
              <div>
                <span className="block font-bold text-base text-primary-dark">
                  {SITE.name}
                </span>
                <span className="block text-xs text-muted">
                  Kecamatan Pesanggrahan, Jakarta Selatan
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-strong leading-relaxed">
              Portal pelayanan kependudukan dan pengaduan warga berbasis digital untuk mewujudkan pelayanan yang transparan, terpadu, dan akuntabel.
            </p>
            <div className="rounded-[var(--radius-ui)] border border-sand bg-sand-soft/60 p-3 text-xs text-[#523e32]">
              <span className="font-bold flex items-center gap-1.5 text-terracotta">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Prototipe Capstone
              </span>
              <p className="mt-1">
                Dikembangkan untuk demonstrasi akademik. Seluruh transaksi dan pengajuan bersifat simulasi.
              </p>
            </div>
          </div>

          {/* Col 2: Pelayanan Kependudukan */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-dark">
              Layanan Administrasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/layanan/ktp-el" className="text-muted-strong hover:text-primary transition-colors">
                  KTP Elektronik (KTP-el)
                </Link>
              </li>
              <li>
                <Link to="/layanan/kartu-keluarga" className="text-muted-strong hover:text-primary transition-colors">
                  Kartu Keluarga
                </Link>
              </li>
              <li>
                <Link to="/layanan/kia" className="text-muted-strong hover:text-primary transition-colors">
                  Kartu Identitas Anak (KIA)
                </Link>
              </li>
              <li>
                <Link to="/layanan/pindah-datang" className="text-muted-strong hover:text-primary transition-colors">
                  Pindah Datang & Keluar
                </Link>
              </li>
              <li>
                <Link to="/layanan/akta-kelahiran" className="text-muted-strong hover:text-primary transition-colors">
                  Akta Kelahiran & Kematian
                </Link>
              </li>
              <li>
                <Link to="/layanan/ahli-waris" className="text-muted-strong hover:text-primary transition-colors">
                  Surat Keterangan Ahli Waris (Demo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Akses Cepat */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-dark">
              Tautan Cepat
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/pengaduan" className="text-muted-strong hover:text-primary transition-colors">
                  Pengaduan Warga
                </Link>
              </li>
              <li>
                <Link to="/lacak" className="text-muted-strong hover:text-primary transition-colors">
                  Lacak Berkas Pengajuan
                </Link>
              </li>
              <li>
                <Link to="/panduan" className="text-muted-strong hover:text-primary transition-colors">
                  Panduan & Syarat Pelayanan
                </Link>
              </li>
              <li>
                <Link to="/masuk" className="text-muted-strong hover:text-primary transition-colors">
                  Portal Masuk Pegawai & Warga
                </Link>
              </li>
              <li>
                <a
                  href="https://drive.google.com/drive/folders/12_hV05Mnkq4q9eeh81kgKPY_54Sg1hiU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-strong hover:text-primary transition-colors"
                >
                  Arsip Formulir Resmi (Drive)
                  <ExternalLink className="size-3.5 text-muted" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi Kontak & Loket (Jelas Berupa Placeholder) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-dark">
              Informasi Kantor & Kontak
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-strong">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-primary mt-1" aria-hidden="true" />
                <span>{SITE.contact.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="size-4 shrink-0 text-primary mt-1" aria-hidden="true" />
                <span>{SITE.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="size-4 shrink-0 text-primary mt-1" aria-hidden="true" />
                <span>{SITE.contact.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="size-4 shrink-0 text-primary mt-1" aria-hidden="true" />
                <span>{SITE.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 border-t border-line pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>
            &copy; {new Date().getFullYear()} Kelurahan Pesanggrahan, Kota Administrasi Jakarta Selatan. Prototipe Capstone.
          </p>
          <p className="text-center md:text-right">
            Sistem Informasi Pelayanan Kependudukan dan Pengaduan Warga
          </p>
        </div>
      </div>
    </footer>
  );
}
