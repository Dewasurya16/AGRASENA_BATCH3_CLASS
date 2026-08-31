export interface DupakItem {
  id: string
  code: string
  title: string
  level: 'Ahli Pertama' | 'Ahli Muda' | 'Ahli Madya' | 'Terampil/Mahir' | 'Semua Jenjang'
  subUnsur: 'Tata Kelola & SPBE' | 'Infrastruktur & Jaringan' | 'Sistem Informasi & Basis Data' | 'Pengolahan Data' | 'Pengembangan Profesi' | 'Penunjang Tugas'
  ak: number
  outputUnit: string
  evidence: string
  maxPerYear?: string
  keywords: string[]
  tipsKejaksaan?: string
}

export const DUPAK_ITEMS_DATA: DupakItem[] = [
  // ── 1. TATA KELOLA & SPBE ──
  {
    id: "tk-sop-01",
    code: "I.A.1",
    title: "Menyusun Standar Operasional Prosedur (SOP) Pengelolaan & Pemanfaatan TIK Satker",
    level: "Ahli Pertama",
    subUnsur: "Tata Kelola & SPBE",
    ak: 0.165,
    outputUnit: "Dokumen SOP",
    evidence: "Surat Perintah Tugas (SPT), Dokumen SOP disahkan pimpinan satker, Notula rapat penyusunan",
    maxPerYear: "4 SOP/tahun",
    keywords: ["sop", "tata kelola", "prosedur", "ruang server", "keamanan", "spbe", "kebijakan"],
    tipsKejaksaan: "Contoh di satker: SOP Akses Ruang Server Lokal Kejari/Kejati, SOP Backup Data Perkara Tilang, SOP Penanganan Gangguan Jaringan."
  },
  {
    id: "tk-audit-01",
    code: "I.A.2",
    title: "Melakukan Evaluasi Kepatuhan & Asesmen Mandiri Indeks SPBE Unit Kerja",
    level: "Ahli Pertama",
    subUnsur: "Tata Kelola & SPBE",
    ak: 0.220,
    outputUnit: "Laporan Evaluasi",
    evidence: "Surat Perintah Tugas (SPT), Kuesioner Asesmen SPBE, Lembar Rekomendasi Perbaikan, Tanda Terima",
    maxPerYear: "2 laporan/tahun",
    keywords: ["spbe", "evaluasi", "audit", "indeks", "tata kelola", "domain", "kematangan"],
    tipsKejaksaan: "Gunakan instrumen 6 Domain SPBE (Kebijakan, Tata Kelola, Manajemen, Layanan) sesuai Perpres 95/2018."
  },
  {
    id: "tk-arsitektur-01",
    code: "I.B.1",
    title: "Menyusun Arsitektur Layanan & Proses Bisnis TIK Instansi",
    level: "Ahli Muda",
    subUnsur: "Tata Kelola & SPBE",
    ak: 0.550,
    outputUnit: "Dokumen Arsitektur",
    evidence: "Surat Tugas, Diagram Proses Bisnis (BPMN), Dokumen Arsitektur SPBE, Pengesahan Eselon II/III",
    maxPerYear: "2 dokumen/tahun",
    keywords: ["arsitektur", "bpmn", "proses bisnis", "probis", "integrasi", "kejaksaan"],
    tipsKejaksaan: "Bisa diambil dari pemetaan proses penanganan perkara pidum/pidsus/perdata ke alur digital CMS PTSP."
  },

  // ── 2. INFRASTRUKTUR & JARINGAN ──
  {
    id: "inf-backup-01",
    code: "II.A.1",
    title: "Melakukan Uji Coba & Eksekusi Backup Berkala Basis Data / Server Satker",
    level: "Ahli Pertama",
    subUnsur: "Infrastruktur & Jaringan",
    ak: 0.055,
    outputUnit: "Laporan Backup & Log",
    evidence: "Surat Perintah Tugas (SPT), Screenshot Task Scheduler/Cron Job pg_dump, Log file backup, Form Berita Acara",
    maxPerYear: "12 kali/tahun (Bulanan)",
    keywords: ["backup", "restore", "database", "basis data", "server", "cron", "tilang", "ptsp"],
    tipsKejaksaan: "Lakukan rutin setiap bulan untuk database CMS PTSP, arsip digital, dan server lokal satker."
  },
  {
    id: "inf-firewall-01",
    code: "II.A.2",
    title: "Melakukan Konfigurasi & Pengujian Keamanan Jaringan (Firewall/VLAN/Router)",
    level: "Ahli Pertama",
    subUnsur: "Infrastruktur & Jaringan",
    ak: 0.110,
    outputUnit: "Laporan Konfigurasi Jaringan",
    evidence: "Surat Perintah Tugas (SPT), Topologi Jaringan, Export Script Config Router/Mikrotik, Log Pengujian",
    maxPerYear: "6 laporan/tahun",
    keywords: ["jaringan", "firewall", "router", "mikrotik", "vlan", "switch", "keamanan", "ip"],
    tipsKejaksaan: "Dokumentasikan segmentasi VLAN jaringan ruang pimpinan, ruang seksi intelijen/pidum, dan wifi publik tamu."
  },
  {
    id: "inf-server-01",
    code: "II.A.3",
    title: "Instalasi, Konfigurasi & Migrasi Sistem Operasi Server / Virtualisasi",
    level: "Ahli Pertama",
    subUnsur: "Infrastruktur & Jaringan",
    ak: 0.275,
    outputUnit: "Laporan Instalasi Server",
    evidence: "Surat Tugas, Lembar Spesifikasi Server, Log Instalasi Linux/Proxmox/Docker, Berita Acara",
    maxPerYear: "4 server/tahun",
    keywords: ["server", "linux", "proxmox", "virtualisasi", "docker", "instalasi", "migrasi"],
    tipsKejaksaan: "Lampirkan screenshot terminal Linux, alokasi IP statis satker, dan servis yang berjalan."
  },
  {
    id: "inf-csirt-01",
    code: "II.B.1",
    title: "Penanganan Insiden Siber & Investigasi Log Serangan Keamanan Informasi (CSIRT)",
    level: "Ahli Muda",
    subUnsur: "Infrastruktur & Jaringan",
    ak: 0.330,
    outputUnit: "Laporan Tanggap Insiden Siber",
    evidence: "Surat Tugas Khusus, Bukti Ekstraksi Log Akses/Malware, Analisis Forensik, Rekomendasi Mitigasi",
    maxPerYear: "4 laporan/tahun",
    keywords: ["csirt", "insiden", "keamanan", "malware", "ransomware", "serangan", "log", "cybersecurity"],
    tipsKejaksaan: "Sesuai tugas Tim CSIRT Kejaksaan RI dalam menangani anomali trafik server satker."
  },

  // ── 3. SISTEM INFORMASI & BASIS DATA ──
  {
    id: "si-db-design-01",
    code: "III.A.1",
    title: "Perancangan Skema Konseptual & Fisik Basis Data (ERD / Relasi Tabel)",
    level: "Ahli Pertama",
    subUnsur: "Sistem Informasi & Basis Data",
    ak: 0.220,
    outputUnit: "Dokumen Desain Database",
    evidence: "Surat Tugas, Diagram ERD, Kamus Data (Data Dictionary), DDL Script SQL, Pengesahan Atasan",
    maxPerYear: "4 dokumen/tahun",
    keywords: ["erd", "database", "skema", "sql", "tabel", "relasi", "basis data", "kamus data"],
    tipsKejaksaan: "Gunakan perancangan database dari proposal proyek akhir seminar atau aplikasi perkara satker."
  },
  {
    id: "si-dev-prog-01",
    code: "III.B.1",
    title: "Pembuatan Program Aplikasi / Modul Sistem Informasi Layanan Satker",
    level: "Ahli Pertama",
    subUnsur: "Sistem Informasi & Basis Data",
    ak: 0.660,
    outputUnit: "Program Aplikasi / Source Code",
    evidence: "Surat Tugas, Source Code / Git Repository, User Manual Aplikasi, Berita Acara Uji Fungsi (UAT)",
    maxPerYear: "3 program/tahun",
    keywords: ["aplikasi", "program", "coding", "web", "api", "nextjs", "php", "python", "fullstack"],
    tipsKejaksaan: "Aplikasi inovasi satker (misal: bot notifikasi tilang, dashboard persuratan) memiliki bobot AK tinggi!"
  },
  {
    id: "si-api-integ-01",
    code: "III.B.2",
    title: "Implementasi REST API & Interkoneksi Pertukaran Data Antar-Aplikasi",
    level: "Ahli Pertama",
    subUnsur: "Sistem Informasi & Basis Data",
    ak: 0.330,
    outputUnit: "Laporan Endpoint API & Dokumentasi",
    evidence: "Surat Tugas, Dokumentasi Swagger / Postman JSON, Log Pengujian Payload, Bukti Integrasi",
    maxPerYear: "4 integrasi/tahun",
    keywords: ["api", "rest", "json", "integrasi", "interoperabilitas", "endpoint", "webhook"],
    tipsKejaksaan: "Interkoneksi data CMS Kejaksaan dengan API WhatsApp Gateway atau portal e-Tilang."
  },
  {
    id: "si-testing-01",
    code: "III.B.3",
    title: "Pengujian Fungsional Sistem Informasi & Penyusunan Dokumen UAT (User Acceptance Test)",
    level: "Ahli Pertama",
    subUnsur: "Sistem Informasi & Basis Data",
    ak: 0.165,
    outputUnit: "Laporan Hasil Pengujian (UAT)",
    evidence: "Surat Tugas, Test Case Matrix, Lembar Sign-off Pengguna Akhir, Rekap Bug/Defect",
    maxPerYear: "6 pengujian/tahun",
    keywords: ["uat", "testing", "uji", "pengujian", "test case", "qa", "verifikasi"],
    tipsKejaksaan: "Lakukan uji fungsi bersama operator seksi Pidum/Pidsus/Pembinaan sebelum sistem live."
  },

  // ── 4. PENGOLAHAN DATA & STATISTIK ──
  {
    id: "pd-query-01",
    code: "IV.A.1",
    title: "Penyusunan Query SQL Kompleks & Ekstraksi Data Rekapitulasi Perkara",
    level: "Ahli Pertama",
    subUnsur: "Pengolahan Data",
    ak: 0.055,
    outputUnit: "Laporan Query & Data Output",
    evidence: "Surat Tugas, File Query .sql (JOIN/GROUP BY/Subquery), Sample Dataset Hasil Ekstraksi, Tanda Terima",
    maxPerYear: "12 laporan/tahun",
    keywords: ["query", "sql", "ekstraksi", "rekap", "data", "laporan", "tilang", "perkara"],
    tipsKejaksaan: "Query rekap bulanan perkara tilang, PNBP satker, atau inventaris barang bukti rampasan."
  },
  {
    id: "pd-dashboard-01",
    code: "IV.A.2",
    title: "Pembuatan Dashboard Visualisasi Data Interaktif & Business Intelligence Satker",
    level: "Ahli Pertama",
    subUnsur: "Pengolahan Data",
    ak: 0.275,
    outputUnit: "Dashboard Visualisasi",
    evidence: "Surat Tugas, Link/Screenshot Dashboard Aktif, Dokumentasi Metrik KPI, Panduan Operator",
    maxPerYear: "4 dashboard/tahun",
    keywords: ["dashboard", "visualisasi", "grafik", "bi", "tableau", "looker", "chart", "monitoring"],
    tipsKejaksaan: "Dashboard monitoring penyerapan anggaran DIPA atau monitoring perkara di layar monitor PTSP."
  },

  // ── 5. PENGEMBANGAN PROFESI / MAKALAH ──
  {
    id: "prof-makalah-01",
    code: "V.A.1",
    title: "Membuat Karya Tulis Ilmiah (KTI) / Makalah Inovasi TIK Kedinasan",
    level: "Ahli Pertama",
    subUnsur: "Pengembangan Profesi",
    ak: 3.500,
    outputUnit: "Naskah Makalah (5 Bab)",
    evidence: "Naskah Makalah lengkap berstandar DINAS, Berita Acara Seminar / Pengesahan Penguji Pusdiklat",
    maxPerYear: "2 makalah/tahun",
    keywords: ["makalah", "kti", "karya tulis", "seminar", "inovasi", "ilmiah", "proyek akhir", "120 jp"],
    tipsKejaksaan: "Makalah Seminar Proyek Akhir Diklat Prakom 120 JP ini otomatis sah diklaim sebagai KTI Pengembangan Profesi!"
  },
  {
    id: "prof-modul-01",
    code: "V.A.2",
    title: "Menyusun Modul / Petunjuk Teknis Pelatihan TIK Satker",
    level: "Ahli Muda",
    subUnsur: "Pengembangan Profesi",
    ak: 2.000,
    outputUnit: "Buku Modul / Juknis",
    evidence: "Buku Modul Ber-ISBN atau Disahkan Pejabat Eselon II, Surat Pengesahan",
    maxPerYear: "2 buku/tahun",
    keywords: ["modul", "buku", "juknis", "panduan", "pelatihan", "pedoman"],
    tipsKejaksaan: "Buku saku keamanan informasi atau panduan pengoperasian aplikasi internal Kejari."
  },

  // ── 6. PENUNJANG TUGAS ──
  {
    id: "pen-tim-01",
    code: "VI.A.1",
    title: "Menjadi Anggota Tim Kerja / Panitia Teknis SPBE & Transformasi Digital Satker",
    level: "Semua Jenjang",
    subUnsur: "Penunjang Tugas",
    ak: 0.500,
    outputUnit: "SK Tim Kerja",
    evidence: "Surat Keputusan (SK) Kepala Kejaksaan Tinggi / Negeri, Laporan Kontribusi Kegiatan",
    maxPerYear: "2 SK/tahun",
    keywords: ["sk", "tim kerja", "panitia", "spbe", "wbk", "wbbm", "penunjang"],
    tipsKejaksaan: "SK Tim Pengelola Website, Tim CSIRT Satker, atau Tim Pembangunan ZI (Zona Integritas WBK/WBBM)."
  }
]
