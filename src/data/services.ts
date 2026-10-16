import type { Requirement, RequirementCondition, Service } from '../types';

const req = (
  id: string,
  label: string,
  condition: RequirementCondition = 'required',
  detail?: string,
): Requirement => ({ id, label, condition, detail });

const ADMINDUK_STEPS = [
  {
    title: 'Siapkan persyaratan',
    description: 'Pilih kondisi yang sesuai, lalu siapkan dokumen pada daftar persyaratan.',
  },
  {
    title: 'Unduh dan isi formulir',
    description: 'Gunakan formulir resmi yang tercantum pada halaman ini, isi dengan data yang benar.',
  },
  {
    title: 'Datang ke loket pelayanan',
    description: 'Serahkan berkas ke petugas pelayanan kelurahan untuk diperiksa kelengkapannya.',
  },
  {
    title: 'Ikuti arahan petugas',
    description: 'Petugas akan menginformasikan proses lanjutan dan waktu pengambilan dokumen.',
  },
];

/**
 * Single source of truth for the service catalog.
 * Admindukcapil services are information_only: guidance + official forms, no simulated submission.
 * Administrative letters are demo_submission for the Capstone prototype.
 */
export const SERVICES: Service[] = [
  {
    id: 'ktp-el',
    title: 'KTP Elektronik (KTP-el)',
    shortTitle: 'KTP-el',
    category: 'adminduk',
    description: 'Informasi persyaratan perekaman, perubahan data, serta penggantian KTP-el yang hilang atau rusak.',
    serviceMode: 'information_only',
    officialForms: ['ktp-f102'],
    procedureSteps: ADMINDUK_STEPS,
    notes: [
      'Perekaman data biometrik dilakukan secara langsung oleh petugas.',
      'Penerbitan dokumen kependudukan dilakukan melalui sistem resmi Dukcapil, bukan melalui prototipe ini.',
    ],
    active: true,
    cases: [
      {
        id: 'baru',
        label: 'Perekaman / Penerbitan Baru',
        summary: 'Untuk penduduk yang baru pertama kali melakukan perekaman KTP-el.',
        formIds: ['ktp-f102'],
        requirements: [
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
          req('fc-akta-lahir', 'Fotokopi Akta Kelahiran'),
        ],
      },
      {
        id: 'perubahan',
        label: 'Perubahan Biodata',
        summary: 'Untuk perubahan elemen data pada KTP-el.',
        formIds: ['ktp-f102'],
        requirements: [
          req('kk-asli', 'Kartu Keluarga asli'),
          req('ktp-asli', 'KTP-el asli'),
          req(
            'bukti-perubahan',
            'Dokumen pendukung perubahan data',
            'specific_condition',
            'Sesuai elemen data yang berubah.',
          ),
        ],
      },
      {
        id: 'hilang',
        label: 'KTP-el Hilang',
        summary: 'Untuk penggantian KTP-el yang hilang.',
        formIds: ['ktp-f102'],
        requirements: [
          req('surat-polisi', 'Surat keterangan kehilangan dari Kepolisian'),
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
        ],
      },
      {
        id: 'rusak',
        label: 'KTP-el Rusak',
        summary: 'Untuk penggantian KTP-el yang rusak.',
        formIds: ['ktp-f102'],
        requirements: [
          req('ktp-rusak', 'KTP-el yang rusak'),
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
        ],
      },
      {
        id: 'datang',
        label: 'Pendatang dari Luar Daerah',
        summary: 'KTP-el bagi pendatang diproses bersamaan dengan prosedur Kartu Keluarga.',
        formIds: ['ktp-f102', 'kk-f106'],
        relatedServiceIds: ['kartu-keluarga', 'pindah-datang'],
        requirements: [
          req(
            'ikuti-kk',
            'Mengikuti persyaratan prosedur Kartu Keluarga',
            'required',
            'Lihat layanan Kartu Keluarga dan Pindah Datang.',
          ),
        ],
        procedureNotes: ['Selesaikan proses pindah datang dan Kartu Keluarga terlebih dahulu.'],
      },
    ],
  },
  {
    id: 'kartu-keluarga',
    title: 'Kartu Keluarga',
    shortTitle: 'Kartu Keluarga',
    category: 'adminduk',
    description: 'Informasi penerbitan Kartu Keluarga baru, perubahan data, serta penggantian karena hilang atau rusak.',
    serviceMode: 'information_only',
    officialForms: ['kk-f106'],
    procedureSteps: ADMINDUK_STEPS,
    notes: ['Rincian lengkap persyaratan mengacu pada poster resmi layanan kelurahan.'],
    active: true,
    cases: [
      {
        id: 'baru',
        label: 'Kartu Keluarga Baru',
        summary: 'Untuk pembentukan Kartu Keluarga baru.',
        formIds: ['kk-f106'],
        requirements: [
          req('ktp-el', 'KTP-el pemohon'),
          req(
            'bukti-peristiwa',
            'Bukti peristiwa kependudukan yang mendasari',
            'specific_condition',
            'Sesuai peristiwa yang menjadi dasar penerbitan KK baru.',
          ),
        ],
      },
      {
        id: 'perubahan',
        label: 'Perubahan Biodata',
        summary: 'Untuk perubahan elemen data anggota keluarga.',
        formIds: ['kk-f106'],
        requirements: [
          req('kk-asli', 'Kartu Keluarga asli'),
          req('ktp-asli', 'KTP-el asli'),
          req(
            'bukti-perubahan',
            'Dokumen pendukung sesuai peristiwa perubahan',
            'specific_condition',
          ),
        ],
      },
      {
        id: 'hilang',
        label: 'Kartu Keluarga Hilang',
        summary: 'Untuk penggantian Kartu Keluarga yang hilang.',
        formIds: ['kk-f106'],
        requirements: [
          req('surat-polisi', 'Surat keterangan kehilangan dari Kepolisian'),
          req('ktp-el', 'KTP-el'),
        ],
      },
      {
        id: 'rusak',
        label: 'Kartu Keluarga Rusak',
        summary: 'Untuk penggantian Kartu Keluarga yang rusak.',
        formIds: ['kk-f106'],
        requirements: [req('kk-rusak', 'Kartu Keluarga yang rusak'), req('ktp-el', 'KTP-el')],
      },
    ],
  },
  {
    id: 'kia',
    title: 'Kartu Identitas Anak',
    shortTitle: 'KIA',
    category: 'adminduk',
    description: 'Informasi penerbitan KIA untuk anak, termasuk penggantian karena hilang, rusak, atau pindah datang.',
    serviceMode: 'information_only',
    officialForms: ['kia-f102'],
    procedureSteps: ADMINDUK_STEPS,
    notes: ['Pas foto hanya diperlukan untuk anak berusia 5 tahun ke atas.'],
    active: true,
    cases: [
      {
        id: 'baru-bawah-5',
        label: 'Baru — di bawah 5 tahun',
        summary: 'Penerbitan KIA pertama untuk anak berusia di bawah 5 tahun.',
        formIds: ['kia-f102'],
        requirements: [
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
          req('fc-akta-lahir', 'Fotokopi Akta Kelahiran anak'),
        ],
      },
      {
        id: 'baru-5-plus',
        label: 'Baru — 5 tahun ke atas',
        summary: 'Penerbitan KIA pertama untuk anak berusia 5 tahun ke atas.',
        formIds: ['kia-f102'],
        requirements: [
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
          req('fc-akta-lahir', 'Fotokopi Akta Kelahiran anak'),
          req('pas-foto', 'Pas foto anak'),
        ],
      },
      {
        id: 'hilang',
        label: 'KIA Hilang',
        summary: 'Penggantian KIA yang hilang.',
        formIds: ['kia-f102'],
        requirements: [
          req('surat-polisi', 'Surat keterangan kehilangan dari Kepolisian'),
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
          req('pas-foto', 'Pas foto anak', 'specific_condition', 'Untuk anak berusia 5 tahun ke atas.'),
        ],
      },
      {
        id: 'rusak',
        label: 'KIA Rusak',
        summary: 'Penggantian KIA yang rusak.',
        formIds: ['kia-f102'],
        requirements: [
          req('kia-rusak', 'KIA yang rusak'),
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
          req('pas-foto', 'Pas foto anak', 'specific_condition', 'Untuk anak berusia 5 tahun ke atas.'),
        ],
      },
      {
        id: 'datang',
        label: 'Pindah Datang',
        summary: 'KIA bagi anak yang pindah datang dari daerah lain.',
        formIds: ['kia-f102'],
        relatedServiceIds: ['pindah-datang'],
        requirements: [
          req('kia-lama', 'KIA dari daerah asal'),
          req('fc-kk', 'Fotokopi Kartu Keluarga'),
          req('pas-foto', 'Pas foto anak', 'specific_condition', 'Untuk anak berusia 5 tahun ke atas.'),
        ],
      },
    ],
  },
  {
    id: 'pindah-datang',
    title: 'Pindah Datang',
    shortTitle: 'Pindah Datang',
    category: 'adminduk',
    group: 'Perpindahan Penduduk',
    description: 'Informasi pendaftaran penduduk yang pindah datang ke wilayah Kelurahan Pesanggrahan.',
    serviceMode: 'information_only',
    officialForms: ['datang-b4', 'pindah-f103'],
    procedureSteps: ADMINDUK_STEPS,
    notes: ['Dokumen penjamin hanya diminta apabila diperlukan sesuai kondisi tempat tinggal.'],
    active: true,
    cases: [
      {
        id: 'umum',
        label: 'Pindah Datang',
        summary: 'Pendaftaran kedatangan penduduk dari daerah lain.',
        formIds: ['datang-b4', 'pindah-f103'],
        requirements: [
          req('surat-pindah', 'Surat keterangan pindah dari daerah asal'),
          req('biodata', 'Biodata penduduk'),
          req('jaminan-tempat-tinggal', 'Surat jaminan tempat tinggal / domisili', 'if_needed'),
          req('identitas-penjamin', 'Identitas penjamin', 'if_needed'),
          req('dokumen-lain', 'Dokumen pendukung lainnya', 'specific_condition'),
        ],
      },
    ],
  },
  {
    id: 'pindah-keluar',
    title: 'Pindah Keluar',
    shortTitle: 'Pindah Keluar',
    category: 'adminduk',
    group: 'Perpindahan Penduduk',
    description: 'Informasi pengurusan surat pindah bagi penduduk yang akan pindah keluar dari Kelurahan Pesanggrahan.',
    serviceMode: 'information_only',
    officialForms: ['pindah-f103'],
    procedureSteps: ADMINDUK_STEPS,
    notes: ['Persyaratan tambahan berlaku apabila terdapat anggota keluarga di bawah umur yang ikut pindah.'],
    active: true,
    cases: [
      {
        id: 'dewasa',
        label: 'Pemohon Dewasa',
        summary: 'Perpindahan tanpa anggota keluarga di bawah umur.',
        formIds: ['pindah-f103'],
        requirements: [
          req('kk', 'Kartu Keluarga'),
          req('ktp-el', 'KTP-el'),
          req('f103', 'Formulir F-1.03 yang telah diisi'),
        ],
      },
      {
        id: 'dengan-anak',
        label: 'Disertai Anak di Bawah Umur',
        summary: 'Perpindahan yang menyertakan anggota keluarga di bawah umur.',
        formIds: ['pindah-f103'],
        requirements: [
          req('kk', 'Kartu Keluarga'),
          req('ktp-el', 'KTP-el'),
          req('f103', 'Formulir F-1.03 yang telah diisi'),
          req(
            'dok-anak',
            'Dokumen pendukung untuk anggota keluarga di bawah umur',
            'specific_condition',
            'Sesuai ketentuan yang diinformasikan petugas.',
          ),
        ],
      },
    ],
  },
  {
    id: 'akta-kelahiran',
    title: 'Akta Kelahiran',
    shortTitle: 'Akta Kelahiran',
    category: 'adminduk',
    description: 'Informasi persyaratan pencatatan kelahiran dan penerbitan Akta Kelahiran.',
    serviceMode: 'information_only',
    officialForms: ['lahir-f201'],
    procedureSteps: ADMINDUK_STEPS,
    notes: ['SPTJM hanya digunakan pada kondisi tertentu sesuai arahan petugas.'],
    active: true,
    cases: [
      {
        id: 'dengan-bukti-nikah',
        label: 'Orang Tua Memiliki Bukti Perkawinan',
        summary: 'Pencatatan kelahiran dengan bukti perkawinan orang tua.',
        formIds: ['lahir-f201'],
        requirements: [
          req('ket-lahir', 'Surat keterangan kelahiran'),
          req('identitas-ortu', 'KTP-el dan Kartu Keluarga orang tua'),
          req('bukti-nikah', 'Buku nikah / akta perkawinan orang tua'),
          req('ktp-saksi', 'KTP-el saksi'),
          req('sptjm-lahir', 'SPTJM kebenaran data kelahiran', 'specific_condition', 'Apabila surat keterangan kelahiran tidak tersedia.'),
        ],
      },
      {
        id: 'tanpa-bukti-nikah',
        label: 'Tanpa Bukti Perkawinan Tercatat',
        summary: 'Pencatatan kelahiran apabila bukti perkawinan orang tua tidak tersedia.',
        formIds: ['lahir-f201'],
        requirements: [
          req('ket-lahir', 'Surat keterangan kelahiran'),
          req('identitas-ortu', 'KTP-el dan Kartu Keluarga orang tua'),
          req('sptjm-nikah', 'SPTJM kebenaran sebagai pasangan suami istri', 'specific_condition'),
          req('ktp-saksi', 'KTP-el saksi'),
          req('sptjm-lahir', 'SPTJM kebenaran data kelahiran', 'specific_condition', 'Apabila surat keterangan kelahiran tidak tersedia.'),
        ],
      },
    ],
  },
  {
    id: 'akta-kematian',
    title: 'Akta Kematian',
    shortTitle: 'Akta Kematian',
    category: 'adminduk',
    description: 'Informasi persyaratan pencatatan kematian dan penerbitan Akta Kematian.',
    serviceMode: 'information_only',
    officialForms: ['mati-f201'],
    procedureSteps: ADMINDUK_STEPS,
    notes: ['Dokumen kondisi pengecualian hanya diminta pada kondisi tertentu.'],
    active: true,
    cases: [
      {
        id: 'umum',
        label: 'Pencatatan Kematian',
        summary: 'Pelaporan kematian oleh keluarga atau pihak pelapor.',
        formIds: ['mati-f201'],
        requirements: [
          req('ket-kematian', 'Surat keterangan kematian'),
          req('identitas-almarhum', 'KTP-el dan Kartu Keluarga almarhum/almarhumah'),
          req('identitas-pemohon', 'KTP-el dan Kartu Keluarga pemohon'),
          req('ktp-saksi', 'KTP-el saksi'),
          req('dok-pengecualian', 'Dokumen untuk kondisi pengecualian', 'specific_condition', 'Sesuai arahan petugas.'),
        ],
      },
    ],
  },
  {
    id: 'ikd',
    title: 'Identitas Kependudukan Digital',
    shortTitle: 'IKD',
    category: 'adminduk',
    description: 'Panduan informasi aktivasi Identitas Kependudukan Digital melalui kanal resmi Dukcapil.',
    serviceMode: 'information_only',
    officialForms: [],
    procedureSteps: [
      {
        title: 'Pastikan memiliki KTP-el',
        description: 'Aktivasi IKD hanya dapat dilakukan oleh penduduk yang telah memiliki KTP-el.',
      },
      {
        title: 'Gunakan kanal resmi Dukcapil',
        description: 'Aktivasi dilakukan melalui aplikasi dan kanal resmi Dukcapil, bukan melalui prototipe ini.',
      },
      {
        title: 'Verifikasi bersama petugas',
        description: 'Tanyakan kepada petugas pelayanan mengenai jadwal dan tata cara verifikasi aktivasi.',
      },
    ],
    notes: [
      'Prototipe ini tidak melayani pendaftaran, aktivasi, maupun penerbitan IKD.',
      'Tautan resmi aktivasi belum diverifikasi sehingga tidak dicantumkan.',
    ],
    active: true,
    cases: [
      {
        id: 'informasi',
        label: 'Informasi Aktivasi',
        summary: 'Hal yang perlu disiapkan sebelum aktivasi melalui kanal resmi.',
        formIds: [],
        requirements: [
          req('ktp-el', 'KTP-el yang sudah terekam'),
          req('ponsel', 'Ponsel pintar milik pribadi', 'required', 'Informasi umum; ikuti arahan petugas Dukcapil.'),
        ],
      },
    ],
  },
  {
    id: 'ahli-waris',
    title: 'Surat Keterangan Ahli Waris',
    shortTitle: 'Ahli Waris',
    category: 'surat',
    description: 'Simulasi pengajuan surat keterangan ahli waris dengan verifikasi petugas dan persetujuan Lurah.',
    serviceMode: 'demo_submission',
    officialForms: [],
    procedureSteps: [
      { title: 'Ajukan secara daring', description: 'Isi data pemohon dan unggah dokumen persyaratan (simulasi).' },
      { title: 'Verifikasi petugas', description: 'Petugas memeriksa kelengkapan dan kesesuaian dokumen.' },
      { title: 'Persetujuan Lurah', description: 'Lurah memeriksa dan menyetujui dokumen yang telah diverifikasi.' },
      { title: 'Surat selesai', description: 'Pemohon menerima notifikasi bahwa surat siap diambil.' },
    ],
    notes: [
      'Persyaratan pada layanan ini bersifat contoh untuk prototipe dan perlu dikonfirmasi ke kantor kelurahan.',
      'Tidak ada tanda tangan elektronik tersertifikasi pada prototipe ini.',
    ],
    illustrativeRequirements: true,
    needsLurahApproval: true,
    active: true,
    extraFields: [
      { id: 'namaPewaris', label: 'Nama pewaris (almarhum/almarhumah)', type: 'text', required: true },
      { id: 'tanggalWafat', label: 'Tanggal wafat pewaris', type: 'date', required: true },
      { id: 'jumlahAhliWaris', label: 'Jumlah ahli waris', type: 'text', hint: 'Contoh: 3 orang', required: true },
    ],
    cases: [
      {
        id: 'umum',
        label: 'Pengajuan Ahli Waris',
        summary: 'Pengajuan surat keterangan ahli waris (contoh prototipe).',
        formIds: [],
        requirements: [
          req('ktp-pemohon', 'KTP-el pemohon'),
          req('kk-pemohon', 'Kartu Keluarga pemohon'),
          req('akta-kematian', 'Akta kematian pewaris'),
          req('pernyataan-waris', 'Surat pernyataan ahli waris'),
          req('dok-lain', 'Dokumen pendukung lainnya', 'if_needed'),
        ],
      },
    ],
  },
  {
    id: 'rekomendasi-taspen',
    title: 'Surat Rekomendasi Taspen',
    shortTitle: 'Rekomendasi Taspen',
    category: 'surat',
    description: 'Simulasi pengajuan surat rekomendasi untuk keperluan administrasi Taspen.',
    serviceMode: 'demo_submission',
    officialForms: [],
    procedureSteps: [
      { title: 'Ajukan secara daring', description: 'Isi data pemohon dan unggah dokumen persyaratan (simulasi).' },
      { title: 'Verifikasi petugas', description: 'Petugas memeriksa kelengkapan dan kesesuaian dokumen.' },
      { title: 'Persetujuan Lurah', description: 'Lurah memeriksa dan menyetujui surat rekomendasi.' },
      { title: 'Surat selesai', description: 'Pemohon menerima notifikasi bahwa surat siap diambil.' },
    ],
    notes: [
      'Persyaratan pada layanan ini bersifat contoh untuk prototipe dan perlu dikonfirmasi ke kantor kelurahan.',
      'Prototipe ini tidak terhubung dengan sistem Taspen.',
    ],
    illustrativeRequirements: true,
    needsLurahApproval: true,
    active: true,
    extraFields: [
      { id: 'namaPeserta', label: 'Nama peserta Taspen', type: 'text', required: true },
      { id: 'hubungan', label: 'Hubungan pemohon dengan peserta', type: 'text', hint: 'Contoh: anak, pasangan', required: true },
    ],
    cases: [
      {
        id: 'umum',
        label: 'Pengajuan Rekomendasi',
        summary: 'Pengajuan surat rekomendasi Taspen (contoh prototipe).',
        formIds: [],
        requirements: [
          req('ktp-pemohon', 'KTP-el pemohon'),
          req('kk-pemohon', 'Kartu Keluarga pemohon'),
          req('kartu-peserta', 'Kartu atau bukti kepesertaan Taspen'),
          req('dok-lain', 'Dokumen pendukung lainnya', 'if_needed'),
        ],
      },
    ],
  },
];

export const CATEGORY_LABEL: Record<Service['category'], string> = {
  adminduk: 'Panduan Adminduk',
  surat: 'Surat Administrasi',
};

export const SERVICE_MODE_LABEL: Record<Service['serviceMode'], string> = {
  information_only: 'Informasi saja',
  demo_submission: 'Pengajuan daring (demo)',
};

export const CONDITION_LABEL: Record<Requirement['condition'], string> = {
  required: 'Wajib',
  if_needed: 'Jika diperlukan',
  specific_condition: 'Khusus kondisi tertentu',
};

/** Number of distinct public Admindukcapil service categories (Perpindahan groups two services). */
export function countAdmindukCategories(services: Service[]): number {
  const keys = new Set(
    services.filter((s) => s.category === 'adminduk').map((s) => s.group ?? s.id),
  );
  return keys.size;
}
