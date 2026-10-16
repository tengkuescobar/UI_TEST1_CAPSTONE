import { describe, expect, it } from 'vitest';
import { SERVICES, countAdmindukCategories } from '../data/services';
import { OFFICIAL_FORMS } from '../data/forms';
import { canSubmitOnline, getCaseForms, getServiceCase, searchServices } from './requirements';

const byId = (id: string) => SERVICES.find((s) => s.id === id)!;

describe('katalog layanan', () => {
  it('menampilkan tujuh kategori Adminduk', () => {
    expect(countAdmindukCategories(SERVICES)).toBe(7);
  });

  it('mempertahankan dua layanan surat demo', () => {
    const letters = SERVICES.filter((s) => s.category === 'surat');
    expect(letters.map((s) => s.id).sort()).toEqual(['ahli-waris', 'rekomendasi-taspen']);
    letters.forEach((s) => expect(canSubmitOnline(s)).toBe(true));
  });

  it('tidak mengaktifkan pengajuan untuk dokumen identitas', () => {
    SERVICES.filter((s) => s.category === 'adminduk').forEach((s) => {
      expect(s.serviceMode).toBe('information_only');
      expect(canSubmitOnline(s)).toBe(false);
    });
  });

  it('memisahkan Pindah Datang dan Pindah Keluar', () => {
    expect(byId('pindah-datang').group).toBe('Perpindahan Penduduk');
    expect(byId('pindah-keluar').group).toBe('Perpindahan Penduduk');
  });

  it('semua referensi formulir valid dan memakai Google Drive', () => {
    SERVICES.forEach((s) =>
      s.cases.forEach((c) =>
        c.formIds.forEach((id) => {
          expect(OFFICIAL_FORMS[id]).toBeDefined();
          expect(OFFICIAL_FORMS[id].url).toMatch(/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/);
        }),
      ),
    );
  });
});

describe('mesin persyaratan dinamis', () => {
  it('KTP-el hilang membutuhkan surat kepolisian', () => {
    const c = getServiceCase(byId('ktp-el'), 'hilang');
    expect(c.requirements.map((r) => r.id)).toContain('surat-polisi');
  });

  it('KTP-el rusak membutuhkan KTP-el rusak, bukan surat kepolisian', () => {
    const ids = getServiceCase(byId('ktp-el'), 'rusak').requirements.map((r) => r.id);
    expect(ids).toContain('ktp-rusak');
    expect(ids).not.toContain('surat-polisi');
  });

  it('KIA di bawah 5 tahun tidak memerlukan pas foto, 5+ memerlukan', () => {
    const kia = byId('kia');
    expect(getServiceCase(kia, 'baru-bawah-5').requirements.some((r) => r.id === 'pas-foto')).toBe(false);
    expect(getServiceCase(kia, 'baru-5-plus').requirements.some((r) => r.id === 'pas-foto')).toBe(true);
  });

  it('Pindah Keluar dengan anak menambah dokumen kondisional', () => {
    const c = getServiceCase(byId('pindah-keluar'), 'dengan-anak');
    const anak = c.requirements.find((r) => r.id === 'dok-anak');
    expect(anak?.condition).toBe('specific_condition');
  });

  it('kasus tidak dikenal kembali ke kasus pertama', () => {
    expect(getServiceCase(byId('kartu-keluarga'), 'tidak-ada').id).toBe('baru');
  });

  it('formulir berubah sesuai kasus', () => {
    const forms = getCaseForms(getServiceCase(byId('ktp-el'), 'datang')).map((f) => f.id);
    expect(forms).toEqual(['ktp-f102', 'kk-f106']);
  });

  it('pencarian menemukan layanan berdasarkan kata kunci kasus', () => {
    const res = searchServices(SERVICES, 'hilang', 'semua').map((s) => s.id);
    expect(res).toEqual(expect.arrayContaining(['ktp-el', 'kartu-keluarga', 'kia']));
    expect(searchServices(SERVICES, '', 'surat')).toHaveLength(2);
  });
});
