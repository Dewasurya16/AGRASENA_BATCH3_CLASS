export interface DocumentTemplate {
  id: string
  title: string
  category: "Administrasi & SPT" | "DUPAK & SKP BPS" | "SOP & Keamanan" | "Seminar Akhir"
  format: string
  description: string
  legalReference: string
  bpsCode?: string
  tags: string[]
  contentDoc?: string
  file_url?: string
  file_name?: string
  file_size?: number
  created_at?: string
}

export const TEMPLATES_DATA: DocumentTemplate[] = [
  {
    id: "spt-ti",
    title: "Surat Perintah Tugas (SPT) Pemeliharaan & Troubleshooting TIK Satker",
    category: "Administrasi & SPT",
    format: ".doc Word",
    description: "Format surat perintah tugas resmi penugasan Pranata Komputer untuk pemeliharaan server, jaringan lokal, basis data, dan aplikasi perkara di Kejati/Kejari.",
    legalReference: "Pedoman Tata Naskah Dinas Kejaksaan RI & PermenPAN-RB No. 32 Tahun 2020",
    tags: ["Bukti Fisik Sah", "Pemeliharaan", "Kejati/Kejari", "Tata Naskah Kejaksaan"],
  },
  {
    id: "laporan-pemeliharaan",
    title: "Laporan Hasil Pemeliharaan Perangkat Keras, Server & Jaringan",
    category: "Administrasi & SPT",
    format: ".doc Word",
    description: "Laporan terperinci pelaksanaan kegiatan teknis mencakup spesifikasi perangkat, tindakan troubleshooting, status sebelum/sesudah penanganan, dan dokumentasi foto.",
    legalReference: "Petunjuk Teknis BPS No. 2 Tahun 2021 (Butir II.A.3 & II.A.4)",
    bpsCode: "II.A.4",
    tags: ["Laporan Teknis", "Troubleshooting", "Bukti DUPAK", "Lampiran SPT"],
  },
  {
    id: "dupak-prakom-pertama",
    title: "Format Formulir DUPAK / PAK Integrasi Pranata Komputer Ahli Pertama",
    category: "DUPAK & SKP BPS",
    format: ".xlsx Excel",
    description: "Template rekapitulasi butir kegiatan angka kredit tahunan, matriks konversi predikat kinerja (SKP) ke angka kredit integrasi, dan rekap bukti dukung.",
    legalReference: "PermenPAN-RB No. 32/2020 & Surat Edaran BPS Tata Cara PAK Integrasi",
    bpsCode: "PAK-INTEGRASI-01",
    tags: ["DUPAK BPS", "Ahli Pertama", "SKP Integrasi", "Kenaikan Pangkat"],
  },
  {
    id: "spmk-prakom",
    title: "Surat Pernyataan Melakukan Kegiatan (SPMK) Bidang Teknologi Informasi",
    category: "DUPAK & SKP BPS",
    format: ".doc Word",
    description: "Surat pernyataan resmi dari atasan langsung (Kasi Penkum / Kasubbag Bin / Kasi Intel) yang mengesahkan keabsahan butir kegiatan yang diajukan oleh Pranata Komputer.",
    legalReference: "Perka BPS No. 2/2021 Tata Cara Penilaian Kinerja Prakom",
    bpsCode: "SPMK-TIK-2026",
    tags: ["Pengesahan Atasan", "Legalitas DUPAK", "Bukti Wajib"],
  },
  {
    id: "sop-penanganan-insiden",
    title: "SOP Penanganan Insiden Keamanan Informasi & Tanggap Darurat Siber",
    category: "SOP & Keamanan",
    format: ".pdf / .doc",
    description: "Standar Operasional Prosedur penanganan kebocoran data, serangan ransomware, defacement portal web satker, isolasi jaringan terdampak, dan eskalasi ke CSIRT Kejaksaan RI.",
    legalReference: "Perpres 95/2018 (Domain Manajemen SPBE Keamanan Informasi) & ISO/IEC 27001",
    tags: ["Cybersecurity", "CSIRT", "Tanggap Darurat", "Audit Keamanan"],
  },
  {
    id: "proposal-aktualisasi",
    title: "Template Naskah Proposal Aktualisasi & Seminar Akhir Diklat Prakom",
    category: "Seminar Akhir",
    format: ".doc Word",
    description: "Struktur dokumen lengkap laporan inovasi digital: Latar Belakang Masalah (Issue Scan), Gagasan Pemecahan Isu, Rancangan Sistem, Uji Coba, dan Matriks Kemanfaatan bagi Satker Kejaksaan RI.",
    legalReference: "Kurikulum 120 JP Diklat Fungsional Prakom Kejaksaan RI 2026",
    tags: ["Seminar Tahap 4", "Rancangan Inovasi", "Laporan Akhir", "Gagasan Solutif"],
  },
]
