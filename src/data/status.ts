import type { ApplicationStatus, ComplaintStatus, Role } from '../types';

export type Tone = 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'accent';

export const APPLICATION_STATUS: Record<ApplicationStatus, { label: string; tone: Tone; description: string }> = {
  diajukan: { label: 'Diajukan', tone: 'info', description: 'Pengajuan diterima dan menunggu pemeriksaan petugas.' },
  diverifikasi: { label: 'Sedang Diverifikasi', tone: 'accent', description: 'Petugas sedang memeriksa kelengkapan dokumen.' },
  perlu_perbaikan: { label: 'Perlu Perbaikan', tone: 'warning', description: 'Pemohon perlu memperbaiki atau melengkapi dokumen.' },
  menunggu_persetujuan: { label: 'Menunggu Persetujuan Lurah', tone: 'accent', description: 'Dokumen telah diverifikasi dan menunggu persetujuan Lurah.' },
  disetujui: { label: 'Disetujui Lurah', tone: 'success', description: 'Disetujui Lurah dan dikembalikan ke petugas untuk penyelesaian.' },
  selesai: { label: 'Selesai', tone: 'success', description: 'Surat siap diambil di kantor kelurahan.' },
  ditolak: { label: 'Ditolak', tone: 'danger', description: 'Pengajuan tidak dapat diproses.' },
};

export const APPLICATION_STAGES: ApplicationStatus[] = [
  'diajukan',
  'diverifikasi',
  'menunggu_persetujuan',
  'disetujui',
  'selesai',
];

export const COMPLAINT_STATUS: Record<ComplaintStatus, { label: string; tone: Tone }> = {
  diterima: { label: 'Diterima', tone: 'info' },
  diverifikasi: { label: 'Diverifikasi', tone: 'accent' },
  ditindaklanjuti: { label: 'Ditindaklanjuti', tone: 'warning' },
  dirujuk: { label: 'Dirujuk', tone: 'neutral' },
  selesai: { label: 'Selesai', tone: 'success' },
  ditolak: { label: 'Ditolak', tone: 'danger' },
};

export const ROLE_LABEL: Record<Role, string> = {
  pengunjung: 'Pengunjung',
  warga: 'Warga',
  petugas: 'Petugas Kelurahan',
  lurah: 'Pimpinan / Lurah',
  admin: 'Admin Sistem',
};

export const ROLE_HOME: Record<Role, string> = {
  pengunjung: '/',
  warga: '/warga',
  petugas: '/petugas',
  lurah: '/lurah',
  admin: '/admin',
};

/** Synthetic demo identities used when switching roles. */
export const ROLE_PERSONA: Record<Role, { id: string; name: string }> = {
  pengunjung: { id: 'guest', name: 'Pengunjung' },
  warga: { id: 'u-warga-1', name: 'Rina Lestari (Demo)' },
  petugas: { id: 'u-petugas-1', name: 'Andi Pratama (Demo)' },
  lurah: { id: 'u-lurah-1', name: 'Lurah (Akun Demo)' },
  admin: { id: 'u-admin-1', name: 'Admin Sistem (Demo)' },
};
