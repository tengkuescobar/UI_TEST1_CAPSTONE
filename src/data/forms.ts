import type { OfficialForm } from '../types';

/**
 * Verified Google Drive references supplied by the project team.
 * Do NOT add URLs here unless they have been verified.
 */
export const OFFICIAL_FORMS: Record<string, OfficialForm> = {
  'ktp-f102': {
    id: 'ktp-f102',
    code: 'F-1.02',
    title: 'Formulir KTP-el (F-1.02)',
    description: 'Formulir referensi kelurahan untuk layanan KTP Elektronik.',
    url: 'https://drive.google.com/file/d/1IKabxvvJ9q2R01Kj8UZBcHX3ZTjLEvbe/view',
  },
  'kk-f106': {
    id: 'kk-f106',
    code: 'F-1.06',
    title: 'Formulir Kartu Keluarga (F-1.06)',
    description: 'Formulir referensi kelurahan untuk layanan Kartu Keluarga.',
    url: 'https://drive.google.com/file/d/1tKiXeVEI_0c7HIZXyE-X901lZz6vmjgj/view',
  },
  'kia-f102': {
    id: 'kia-f102',
    code: 'F-1.02',
    title: 'Formulir Kartu Identitas Anak (F-1.02)',
    description: 'Formulir referensi kelurahan untuk layanan Kartu Identitas Anak.',
    url: 'https://drive.google.com/file/d/1uOwDcnLPLqqwm5UXLCW3ed9PTJsGzqGT/view',
  },
  'pindah-f103': {
    id: 'pindah-f103',
    code: 'F-1.03',
    title: 'Formulir Perpindahan Penduduk (F-1.03)',
    description: 'Formulir referensi kelurahan untuk layanan perpindahan penduduk.',
    url: 'https://drive.google.com/file/d/1NjqOc8I1V19UklKjm16NQnqWRAP3fhVD/view',
  },
  'datang-b4': {
    id: 'datang-b4',
    code: 'B-4',
    title: 'Formulir Pindah Datang (B-4)',
    description: 'Formulir referensi kelurahan untuk layanan pindah datang.',
    url: 'https://drive.google.com/file/d/1Vp06eYeWFfd02CclUb-cDDPQFZnD21V_/view',
  },
  'lahir-f201': {
    id: 'lahir-f201',
    code: 'F-2.01',
    title: 'Formulir Pencatatan Kelahiran (F-2.01)',
    description: 'Formulir referensi kelurahan untuk pencatatan Akta Kelahiran.',
    url: 'https://drive.google.com/file/d/13naAgUeNBCY_4Mret3Qdi-ekj0lPmYUk/view',
  },
  'mati-f201': {
    id: 'mati-f201',
    code: 'F-2.01',
    title: 'Formulir Pencatatan Kematian (F-2.01)',
    description: 'Formulir referensi kelurahan untuk pencatatan Akta Kematian.',
    url: 'https://drive.google.com/file/d/1vhW8hVRIS7RQHd7hndN3Yy7RPzAyaNDM/view',
  },
};

export function getForm(id: string): OfficialForm | undefined {
  return OFFICIAL_FORMS[id];
}
