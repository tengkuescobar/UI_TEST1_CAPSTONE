import type {
  AppNotification,
  Application,
  AuditEntry,
  Complaint,
  ComplaintCategory,
  DemoUser,
} from '../types';

/** Synthetic records only. No real citizen data or identifiers. */

export const MOCK_USERS: DemoUser[] = [
  { id: 'u-warga-1', name: 'Rina Lestari (Demo)', email: 'rina.demo@contoh.id', role: 'warga', unit: 'RW 03', active: true },
  { id: 'u-warga-2', name: 'Bayu Saputra (Demo)', email: 'bayu.demo@contoh.id', role: 'warga', unit: 'RW 05', active: true },
  { id: 'u-warga-3', name: 'Sari Wulandari (Demo)', email: 'sari.demo@contoh.id', role: 'warga', unit: 'RW 01', active: false },
  { id: 'u-petugas-1', name: 'Andi Pratama (Demo)', email: 'andi.petugas@contoh.id', role: 'petugas', unit: 'Seksi Pelayanan', active: true },
  { id: 'u-petugas-2', name: 'Dewi Anggraini (Demo)', email: 'dewi.petugas@contoh.id', role: 'petugas', unit: 'Seksi Pemerintahan', active: true },
  { id: 'u-lurah-1', name: 'Lurah (Akun Demo)', email: 'lurah.demo@contoh.id', role: 'lurah', unit: 'Pimpinan', active: true },
  { id: 'u-admin-1', name: 'Admin Sistem (Demo)', email: 'admin.demo@contoh.id', role: 'admin', unit: 'Pengelola Sistem', active: true },
];

export const MOCK_COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  { id: 'kebersihan', name: 'Kebersihan & Sampah', description: 'Penumpukan sampah, kebersihan saluran, dan lingkungan.' },
  { id: 'infrastruktur', name: 'Jalan & Infrastruktur', description: 'Jalan rusak, penerangan jalan, dan fasilitas umum.' },
  { id: 'pelayanan', name: 'Pelayanan Kelurahan', description: 'Masukan terhadap kualitas pelayanan administrasi.' },
  { id: 'ketertiban', name: 'Ketertiban Umum', description: 'Gangguan ketertiban dan keamanan lingkungan.' },
  { id: 'banjir', name: 'Genangan & Banjir', description: 'Genangan air, saluran tersumbat, dan potensi banjir.' },
];

const t = (iso: string) => new Date(iso).toISOString();

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'SRT-2026-0012',
    serviceId: 'ahli-waris',
    caseId: 'umum',
    applicantName: 'Rina Lestari (Demo)',
    applicantPhone: '0800-0000-0001',
    address: 'Jl. Contoh No. 1, RT 002/RW 003',
    purpose: 'Pengurusan administrasi warisan keluarga.',
    extra: { namaPewaris: 'Almarhum Contoh', tanggalWafat: '2026-08-02', jumlahAhliWaris: '3 orang' },
    documents: [
      { requirementId: 'ktp-pemohon', requirementLabel: 'KTP-el pemohon', fileName: 'ktp-demo.pdf', fileSize: 220000, fileType: 'application/pdf' },
      { requirementId: 'kk-pemohon', requirementLabel: 'Kartu Keluarga pemohon', fileName: 'kk-demo.pdf', fileSize: 310000, fileType: 'application/pdf' },
      { requirementId: 'akta-kematian', requirementLabel: 'Akta kematian pewaris', fileName: 'akta-kematian-demo.pdf', fileSize: 280000, fileType: 'application/pdf' },
      { requirementId: 'pernyataan-waris', requirementLabel: 'Surat pernyataan ahli waris', fileName: 'pernyataan-demo.pdf', fileSize: 190000, fileType: 'application/pdf' },
    ],
    status: 'diverifikasi',
    createdAt: t('2026-10-10T09:12:00+07:00'),
    updatedAt: t('2026-10-11T10:30:00+07:00'),
    ownerId: 'u-warga-1',
    timeline: [
      { id: 'tl-1', at: t('2026-10-10T09:12:00+07:00'), actor: 'Rina Lestari (Demo)', role: 'warga', title: 'Pengajuan dikirim' },
      { id: 'tl-2', at: t('2026-10-11T10:30:00+07:00'), actor: 'Andi Pratama (Demo)', role: 'petugas', title: 'Verifikasi dimulai' },
    ],
  },
  {
    id: 'SRT-2026-0015',
    serviceId: 'rekomendasi-taspen',
    caseId: 'umum',
    applicantName: 'Bayu Saputra (Demo)',
    applicantPhone: '0800-0000-0002',
    address: 'Jl. Contoh No. 5, RT 001/RW 005',
    purpose: 'Persyaratan administrasi klaim Taspen.',
    extra: { namaPeserta: 'Peserta Contoh', hubungan: 'Anak' },
    documents: [
      { requirementId: 'ktp-pemohon', requirementLabel: 'KTP-el pemohon', fileName: 'ktp-bayu-demo.jpg', fileSize: 410000, fileType: 'image/jpeg', verified: true },
      { requirementId: 'kk-pemohon', requirementLabel: 'Kartu Keluarga pemohon', fileName: 'kk-bayu-demo.pdf', fileSize: 330000, fileType: 'application/pdf', verified: true },
      { requirementId: 'kartu-peserta', requirementLabel: 'Kartu atau bukti kepesertaan Taspen', fileName: 'kartu-taspen-demo.pdf', fileSize: 150000, fileType: 'application/pdf', verified: true },
    ],
    status: 'menunggu_persetujuan',
    createdAt: t('2026-10-08T13:40:00+07:00'),
    updatedAt: t('2026-10-12T15:05:00+07:00'),
    ownerId: 'u-warga-2',
    timeline: [
      { id: 'tl-1', at: t('2026-10-08T13:40:00+07:00'), actor: 'Bayu Saputra (Demo)', role: 'warga', title: 'Pengajuan dikirim' },
      { id: 'tl-2', at: t('2026-10-09T09:00:00+07:00'), actor: 'Dewi Anggraini (Demo)', role: 'petugas', title: 'Verifikasi dimulai' },
      { id: 'tl-3', at: t('2026-10-12T15:05:00+07:00'), actor: 'Dewi Anggraini (Demo)', role: 'petugas', title: 'Dokumen terverifikasi, diteruskan ke Lurah' },
    ],
  },
  {
    id: 'SRT-2026-0009',
    serviceId: 'rekomendasi-taspen',
    caseId: 'umum',
    applicantName: 'Rina Lestari (Demo)',
    applicantPhone: '0800-0000-0001',
    address: 'Jl. Contoh No. 1, RT 002/RW 003',
    purpose: 'Pengurusan pensiun janda/duda.',
    extra: { namaPeserta: 'Peserta Contoh', hubungan: 'Pasangan' },
    documents: [
      { requirementId: 'ktp-pemohon', requirementLabel: 'KTP-el pemohon', fileName: 'ktp-demo.pdf', fileSize: 220000, fileType: 'application/pdf', verified: true },
      { requirementId: 'kk-pemohon', requirementLabel: 'Kartu Keluarga pemohon', fileName: 'kk-demo.pdf', fileSize: 310000, fileType: 'application/pdf', verified: true },
      { requirementId: 'kartu-peserta', requirementLabel: 'Kartu atau bukti kepesertaan Taspen', fileName: 'taspen-demo.pdf', fileSize: 120000, fileType: 'application/pdf', verified: true },
    ],
    status: 'selesai',
    createdAt: t('2026-09-20T08:20:00+07:00'),
    updatedAt: t('2026-09-25T14:00:00+07:00'),
    ownerId: 'u-warga-1',
    timeline: [
      { id: 'tl-1', at: t('2026-09-20T08:20:00+07:00'), actor: 'Rina Lestari (Demo)', role: 'warga', title: 'Pengajuan dikirim' },
      { id: 'tl-2', at: t('2026-09-21T10:00:00+07:00'), actor: 'Andi Pratama (Demo)', role: 'petugas', title: 'Dokumen terverifikasi, diteruskan ke Lurah' },
      { id: 'tl-3', at: t('2026-09-24T11:00:00+07:00'), actor: 'Lurah (Akun Demo)', role: 'lurah', title: 'Disetujui Lurah' },
      { id: 'tl-4', at: t('2026-09-25T14:00:00+07:00'), actor: 'Andi Pratama (Demo)', role: 'petugas', title: 'Surat selesai dan siap diambil' },
    ],
  },
  {
    id: 'SRT-2026-0016',
    serviceId: 'ahli-waris',
    caseId: 'umum',
    applicantName: 'Sari Wulandari (Demo)',
    applicantPhone: '0800-0000-0003',
    address: 'Jl. Contoh No. 9, RT 004/RW 001',
    purpose: 'Balik nama sertifikat (contoh).',
    extra: { namaPewaris: 'Almarhumah Contoh', tanggalWafat: '2026-07-14', jumlahAhliWaris: '2 orang' },
    documents: [
      { requirementId: 'ktp-pemohon', requirementLabel: 'KTP-el pemohon', fileName: 'ktp-sari-demo.pdf', fileSize: 200000, fileType: 'application/pdf' },
      { requirementId: 'kk-pemohon', requirementLabel: 'Kartu Keluarga pemohon', fileName: 'kk-sari-demo.pdf', fileSize: 260000, fileType: 'application/pdf' },
      { requirementId: 'akta-kematian', requirementLabel: 'Akta kematian pewaris', fileName: 'akta-demo.pdf', fileSize: 240000, fileType: 'application/pdf' },
      { requirementId: 'pernyataan-waris', requirementLabel: 'Surat pernyataan ahli waris', fileName: 'pernyataan-sari-demo.pdf', fileSize: 180000, fileType: 'application/pdf' },
    ],
    status: 'diajukan',
    createdAt: t('2026-10-14T10:05:00+07:00'),
    updatedAt: t('2026-10-14T10:05:00+07:00'),
    ownerId: 'u-warga-3',
    timeline: [
      { id: 'tl-1', at: t('2026-10-14T10:05:00+07:00'), actor: 'Sari Wulandari (Demo)', role: 'warga', title: 'Pengajuan dikirim' },
    ],
  },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'ADU-2026-0031',
    title: 'Penumpukan sampah di dekat taman',
    categoryId: 'kebersihan',
    location: 'Sekitar taman lingkungan RW 03 (contoh)',
    description: 'Sampah menumpuk selama beberapa hari dan menimbulkan bau.',
    status: 'ditindaklanjuti',
    createdAt: t('2026-10-09T07:45:00+07:00'),
    updatedAt: t('2026-10-10T09:00:00+07:00'),
    ownerId: 'u-warga-1',
    timeline: [
      { id: 'c1', at: t('2026-10-09T07:45:00+07:00'), actor: 'Rina Lestari (Demo)', role: 'warga', title: 'Pengaduan dibuat' },
      { id: 'c2', at: t('2026-10-09T13:00:00+07:00'), actor: 'Andi Pratama (Demo)', role: 'petugas', title: 'Pengaduan diverifikasi' },
      { id: 'c3', at: t('2026-10-10T09:00:00+07:00'), actor: 'Andi Pratama (Demo)', role: 'petugas', title: 'Ditindaklanjuti', note: 'Koordinasi jadwal pengangkutan dengan petugas kebersihan.' },
    ],
  },
  {
    id: 'ADU-2026-0034',
    title: 'Lampu penerangan jalan padam',
    categoryId: 'infrastruktur',
    location: 'Gang contoh RT 001/RW 05',
    description: 'Lampu penerangan jalan padam sejak satu minggu sehingga gang gelap pada malam hari.',
    status: 'diterima',
    createdAt: t('2026-10-15T19:20:00+07:00'),
    updatedAt: t('2026-10-15T19:20:00+07:00'),
    ownerId: 'u-warga-2',
    timeline: [
      { id: 'c1', at: t('2026-10-15T19:20:00+07:00'), actor: 'Bayu Saputra (Demo)', role: 'warga', title: 'Pengaduan dibuat' },
    ],
  },
  {
    id: 'ADU-2026-0027',
    title: 'Saluran air tersumbat',
    categoryId: 'banjir',
    location: 'Jalan contoh RW 03',
    description: 'Saluran air tersumbat dan menyebabkan genangan setelah hujan.',
    status: 'selesai',
    createdAt: t('2026-09-28T16:00:00+07:00'),
    updatedAt: t('2026-10-02T11:00:00+07:00'),
    ownerId: 'u-warga-1',
    timeline: [
      { id: 'c1', at: t('2026-09-28T16:00:00+07:00'), actor: 'Rina Lestari (Demo)', role: 'warga', title: 'Pengaduan dibuat' },
      { id: 'c2', at: t('2026-09-29T09:00:00+07:00'), actor: 'Dewi Anggraini (Demo)', role: 'petugas', title: 'Pengaduan diverifikasi' },
      { id: 'c3', at: t('2026-10-02T11:00:00+07:00'), actor: 'Dewi Anggraini (Demo)', role: 'petugas', title: 'Selesai', note: 'Saluran telah dibersihkan (data contoh).' },
    ],
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', role: 'warga', title: 'Pengajuan sedang diverifikasi', body: 'SRT-2026-0012 sedang diperiksa petugas.', at: t('2026-10-11T10:30:00+07:00'), read: false, link: '/warga/pengajuan/SRT-2026-0012' },
  { id: 'n2', role: 'warga', title: 'Pengaduan ditindaklanjuti', body: 'ADU-2026-0031 sedang ditindaklanjuti.', at: t('2026-10-10T09:00:00+07:00'), read: true, link: '/warga/pengaduan/ADU-2026-0031' },
  { id: 'n3', role: 'petugas', title: 'Pengajuan baru masuk', body: 'SRT-2026-0016 menunggu pemeriksaan.', at: t('2026-10-14T10:05:00+07:00'), read: false, link: '/petugas/pengajuan/SRT-2026-0016' },
  { id: 'n4', role: 'petugas', title: 'Pengaduan baru', body: 'ADU-2026-0034 menunggu verifikasi.', at: t('2026-10-15T19:20:00+07:00'), read: false, link: '/petugas/pengaduan/ADU-2026-0034' },
  { id: 'n5', role: 'lurah', title: 'Persetujuan diperlukan', body: 'SRT-2026-0015 menunggu persetujuan Anda.', at: t('2026-10-12T15:05:00+07:00'), read: false, link: '/lurah/persetujuan/SRT-2026-0015' },
  { id: 'n6', role: 'admin', title: 'Akun dinonaktifkan', body: 'Akun Sari Wulandari (Demo) berstatus nonaktif.', at: t('2026-10-05T08:00:00+07:00'), read: true, link: '/admin/pengguna' },
];

export const MOCK_AUDIT: AuditEntry[] = [
  { id: 'a1', at: t('2026-10-12T15:05:00+07:00'), actor: 'Dewi Anggraini (Demo)', role: 'petugas', action: 'Meneruskan ke Lurah', target: 'SRT-2026-0015' },
  { id: 'a2', at: t('2026-10-11T10:30:00+07:00'), actor: 'Andi Pratama (Demo)', role: 'petugas', action: 'Memulai verifikasi', target: 'SRT-2026-0012' },
  { id: 'a3', at: t('2026-10-05T08:00:00+07:00'), actor: 'Admin Sistem (Demo)', role: 'admin', action: 'Menonaktifkan akun', target: 'Sari Wulandari (Demo)' },
];
