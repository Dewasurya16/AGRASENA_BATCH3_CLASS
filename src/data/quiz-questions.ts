export interface QuizQuestion {
  id: number
  category:
    | "Overview & Administrasi Prakom"
    | "Audit TI & IT Enterprise"
    | "Manajemen Layanan ITIL 4"
    | "Manajemen Risiko ISO 31000"
    | "Pengolahan Data & DAMA DMBOK"
    | "Sistem Informasi & SDLC"
    | "LMS & Regulasi ASN"
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface QuizPackage {
  id: string
  title: string
  subtitle: string
  badge: string
  color: string
  durationMinutes: number
  questionCount: number
  passingScore: number
  categories: Array<QuizQuestion['category']>
  description: string
  iconName: string
}

export const QUIZ_PACKAGES: QuizPackage[] = [
  {
    id: "pack-1",
    title: "Paket 1: Regulasi ASN & Profesi Pranata Komputer",
    subtitle: "Modul 1, 2 & PermenPAN-RB No. 1/2023",
    badge: "Paket Dasar",
    color: "#007aff",
    durationMinutes: 15,
    questionCount: 10,
    passingScore: 75,
    categories: ["Overview & Administrasi Prakom", "LMS & Regulasi ASN"],
    description: "Evaluasi pemahaman seputar jenjang jabatan fungsional Prakom, SKP Integrasi, aturan jam pelajaran (120 JP), dan etika profesi ASN Kejaksaan.",
    iconName: "Shield"
  },
  {
    id: "pack-2",
    title: "Paket 2: SPBE Enterprise Architecture & Audit TI",
    subtitle: "Modul 3, 4 & Kematangan SPBE",
    badge: "Tata Kelola",
    color: "#8b5cf6",
    durationMinutes: 15,
    questionCount: 10,
    passingScore: 75,
    categories: ["Audit TI & IT Enterprise"],
    description: "Uji kompetensi arsitektur domain SPBE, sertifikat elektronik BSrE, 4 unsur laporan audit TI (Kondisi, Kriteria, Risiko, Rekomendasi), dan kontrol keamanan siber.",
    iconName: "Award"
  },
  {
    id: "pack-3",
    title: "Paket 3: ITIL 4 Service Management & Risiko ISO 31000",
    subtitle: "Modul 5, 6 & Standar Internasional",
    badge: "Manajemen Layanan",
    color: "#10b981",
    durationMinutes: 15,
    questionCount: 10,
    passingScore: 75,
    categories: ["Manajemen Layanan ITIL 4", "Manajemen Risiko ISO 31000"],
    description: "Pendalaman 6 rantai nilai layanan (SVC), CMDB, manajemen insiden vs problem, risk register, serta mitigasi ancaman pada infrastruktur TI satker.",
    iconName: "Flame"
  },
  {
    id: "pack-4",
    title: "Paket 4: Tata Kelola Data (DAMA DMBOK) & Rekayasa SDLC",
    subtitle: "Modul 7, 8 & Pengembangan Aplikasi",
    badge: "Data & Software",
    color: "#f59e0b",
    durationMinutes: 15,
    questionCount: 10,
    passingScore: 75,
    categories: ["Pengolahan Data & DAMA DMBOK", "Sistem Informasi & SDLC"],
    description: "Penguasaan 11 knowledge area DAMA DMBOK, normalisasi basis data perkara, data warehouse, serta metodologi pengembangan sistem SDLC dan analisis PIECES.",
    iconName: "BookOpen"
  },
  {
    id: "pack-5",
    title: "Paket 5: Tryout Komprehensif Uji Kompetensi CAT",
    subtitle: "Simulasi Ujian Akhir 120 JP (Campuran Semua Modul)",
    badge: "Tryout Akbar",
    color: "#ec4899",
    durationMinutes: 30,
    questionCount: 25,
    passingScore: 75,
    categories: [
      "Overview & Administrasi Prakom",
      "Audit TI & IT Enterprise",
      "Manajemen Layanan ITIL 4",
      "Manajemen Risiko ISO 31000",
      "Pengolahan Data & DAMA DMBOK",
      "Sistem Informasi & SDLC",
      "LMS & Regulasi ASN"
    ],
    description: "Simulasi kelulusan riil mencakup seluruh spektrum materi diklat fungsional dengan pengacakan soal dan timer ketat berstandar CAT Pusdiklat & BPS.",
    iconName: "Trophy"
  }
]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // 1. OVERVIEW PROGRAM PELATIHAN & ADMINISTRASI PRAKOM (MODUL 1 & 2)
  // =========================================================================
  {
    id: 1,
    category: "Overview & Administrasi Prakom",
    question: "Apa perbedaan mendasar porsi alokasi jam pelajaran (JP) dan metode pembelajaran antara Pelatihan Fungsional Prakom Terampil dan Ahli?",
    options: [
      "Terampil 120 JP (60% teori, 40% praktik) sedangkan Ahli 106 JP (40% teori, 60% praktik)",
      "Terampil 106 JP (40% teori, 60% praktik) sedangkan Ahli 120 JP (60% teori, 40% praktik)",
      "Keduanya memiliki alokasi 100 JP dengan porsi teori dan praktik 50%:50%",
      "Terampil 140 JP tanpa praktik, sedangkan Ahli 100% full praktik di laboratorium"
    ],
    correctIndex: 1,
    explanation: "Berdasarkan Modul Overview Program Pelatihan Prakom Kejaksaan RI: Pelatihan Fungsional Terampil berdurasi 106 JP dengan porsi praktik lebih dominan (60% praktik, 40% teori), sedangkan Pelatihan Fungsional Ahli berdurasi 120 JP dengan menitikberatkan pada aspek konseptual dan kebijakan (60% teori, 40% praktik)."
  },
  {
    id: 2,
    category: "Overview & Administrasi Prakom",
    question: "Sebutkan 3 (tiga) pilar standar kompetensi utama yang dibangun dalam Pelatihan Fungsional Pranata Komputer Kejaksaan RI!",
    options: [
      "Kompetensi Administrasi, Keuangan, dan Protokoler",
      "Kompetensi Teknis, Manajerial, dan Sosial Kultural",
      "Kompetensi Hardware, Software, dan Jaringan Komputer",
      "Kompetensi Pidana Umum, Pidana Khusus, dan Perdata"
    ],
    correctIndex: 1,
    explanation: "Standar Kompetensi ASN mencakup 3 pilar: (1) Kompetensi Teknis (spesifik bidang TI), (2) Kompetensi Manajerial (memimpin dan mengelola unit kerja), dan (3) Kompetensi Sosial Kultural (interaksi majemuk dengan masyarakat dan rekan kerja)."
  },
  {
    id: 3,
    category: "Overview & Administrasi Prakom",
    question: "Urutan jenjang jabatan fungsional Pranata Komputer Kategori Keterampilan mulai dari yang terendah adalah...",
    options: [
      "Pemula, Terampil, Mahir",
      "Terampil, Mahir, Penyelia",
      "Pertama, Muda, Madya, Utama",
      "Pelaksana, Pengatur, Penata"
    ],
    correctIndex: 1,
    explanation: "Berdasarkan PermenPAN-RB No. 32 Tahun 2020: Kategori Keterampilan terdiri dari Terampil (Gol. II/c - II/d), Mahir (Gol. III/a - III/b), dan Penyelia (Gol. III/c - III/d). Sedangkan Kategori Keahlian adalah Pertama, Muda, Madya, dan Utama."
  },
  {
    id: 4,
    category: "Overview & Administrasi Prakom",
    question: "Berdasarkan ketentuan terbaru PermenPAN-RB Nomor 1 Tahun 2023, berapa kali periode kenaikan pangkat bagi PNS dalam satu tahun kalender?",
    options: [
      "2 (dua) periode (April dan Oktober)",
      "4 (empat) periode (Januari, April, Juli, Oktober)",
      "6 (enam) periode (Februari, April, Juni, Agustus, Oktober, Desember)",
      "Setiap bulan tanpa batasan periode"
    ],
    correctIndex: 2,
    explanation: "Berdasarkan PermenPAN-RB No. 1 Tahun 2023 dan regulasi BKN, usulan kenaikan pangkat PNS disederhanakan dan diperluas menjadi 6 (enam) periode dalam satu tahun yaitu per 1 Februari, 1 April, 1 Juni, 1 Agustus, 1 Oktober, dan 1 Desember."
  },
  {
    id: 5,
    category: "Overview & Administrasi Prakom",
    question: "Manakah di bawah ini yang BUKAN merupakan salah satu dari 6 Bidang Standar Kompetensi Teknis Pranata Komputer?",
    options: [
      "Information Technology Enterprise (Tata Kelola SPBE)",
      "Manajemen Layanan TI & Pengelolaan Data",
      "Pengadaan Barang dan Jasa Konstruksi Gedung Kantor",
      "Infrastruktur TI, Sistem Informasi & Multimedia"
    ],
    correctIndex: 2,
    explanation: "6 Bidang Standar Kompetensi Teknis Prakom adalah: (1) IT Enterprise, (2) Manajemen Layanan TI, (3) Pengelolaan Data, (4) Manajemen Risiko TI, (5) Infrastruktur TI, dan (6) Sistem Informasi & Multimedia."
  },
  {
    id: 6,
    category: "Overview & Administrasi Prakom",
    question: "Berdasarkan regulasi integrasi kinerja terbaru, penilaian Angka Kredit (AK) fungsional Prakom diperoleh melalui...",
    options: [
      "Penghitungan manual butir kegiatan per lembar tanpa SKP",
      "Konversi Predikat Sasaran Kinerja Pegawai (SKP) tahunan ke Angka Kredit Integrasi",
      "Hanya berdasarkan jumlah sertifikat seminar yang dikumpulkan",
      "Ujian tulis kenaikan pangkat setiap semester"
    ],
    correctIndex: 1,
    explanation: "Berdasarkan PermenPAN-RB No. 1 Tahun 2023, Angka Kredit bagi Pejabat Fungsional diperoleh dari hasil konversi predikat kinerja tahunan (SKP) dengan koefisien: Sangat Baik (150%), Baik (100%), Cukup (75%), Kurang (50%), dan Sangat Kurang (25%)."
  },
  {
    id: 7,
    category: "Overview & Administrasi Prakom",
    question: "Seorang Pranata Komputer Ahli Pertama dengan predikat SKP 'Sangat Baik' memperoleh persentase konversi angka kredit tahunan sebesar...",
    options: [
      "100% dari koefisien tahunan (12.5 AK)",
      "125% dari koefisien tahunan (15.625 AK)",
      "150% dari koefisien tahunan (18.75 AK)",
      "200% dari koefisien tahunan (25 AK)"
    ],
    correctIndex: 2,
    explanation: "Koefisien tahunan Pranata Komputer Ahli Pertama adalah 12.5 AK. Dengan predikat SKP Sangat Baik (150%), angka kredit yang diperoleh adalah 150% x 12.5 = 18.75 AK per tahun."
  },
  {
    id: 8,
    category: "Overview & Administrasi Prakom",
    question: "Dokumen yang wajib disiapkan oleh Pejabat Fungsional Prakom sebagai bukti bahwa butir kegiatan pemeliharaan TIK benar-benar telah dilaksanakan di satker adalah...",
    options: [
      "Kwitansi pembelian barang pribadi",
      "Surat Pernyataan Melakukan Kegiatan (SPMK) disertai Laporan Pelaksanaan & Logbook TIK",
      "Surat Izin Mengemudi dinas",
      "Daftar hadir apel pagi saja"
    ],
    correctIndex: 1,
    explanation: "Bukti fisik pelaksanaan tugas mencakup Surat Pernyataan Melakukan Kegiatan (SPMK) yang ditandatangani atasan langsung beserta laporan teknis/logbook kegiatan pemeliharaan TIK di satuan kerja."
  },

  // =========================================================================
  // 2. AUDIT TEKNOLOGI INFORMASI & IT ENTERPRISE (MODUL 3 & 4)
  // =========================================================================
  {
    id: 9,
    category: "Audit TI & IT Enterprise",
    question: "Dalam penyusunan laporan temuan audit TI, unsur yang menjelaskan tentang konsekuensi, potensi ancaman, atau kerugian aktual yang dapat memengaruhi pencapaian sasaran sistem disebut...",
    options: [
      "Kondisi (Condition)",
      "Kriteria (Criteria)",
      "Risiko (Risk)",
      "Rekomendasi (Recommendation)"
    ],
    correctIndex: 2,
    explanation: "Struktur Laporan Temuan Audit TI terdiri dari: (1) Temuan/Kondisi (fakta aktual kelemahan kontrol), (2) Kriteria (standar pembanding/regulasi), (3) Risiko (dampak negatif/potensi kerugian yang ditimbulkan), dan (4) Rekomendasi (langkah perbaikan)."
  },
  {
    id: 10,
    category: "Audit TI & IT Enterprise",
    question: "Organisasi internasional manakah yang merilis dan mengelola kerangka kerja COBIT untuk tata kelola TI perusahaan dan audit sistem informasi?",
    options: [
      "ISACA (Information Systems Audit and Control Association)",
      "AXELOS Limited",
      "IEEE (Institute of Electrical and Electronics Engineers)",
      "The Open Group"
    ],
    correctIndex: 0,
    explanation: "COBIT (Control Objectives for Information and Related Technologies) adalah framework tata kelola dan manajemen TI yang dikembangkan oleh ISACA."
  },
  {
    id: 11,
    category: "Audit TI & IT Enterprise",
    question: "Instrumen teknologi informasi apakah yang digunakan untuk menjamin aspek kenirsangkalan (non-repudiation) dan keaslian pada arsitektur data SPBE Kejaksaan RI?",
    options: [
      "Koneksi kabel LAN Cat6 dan switch unmanaged",
      "Enkripsi simetris, Sertifikat Elektronik BSrE, Tanda Tangan Elektronik (ETTD), Hash kriptografi, dan Public Key Infrastructure (PKI)",
      "Antivirus gratis dan firewall bawaan Windows",
      "Pencetakan fisik berkas perkara rangkap tiga"
    ],
    correctIndex: 1,
    explanation: "Kenirsangkalan (Non-Repudiation) dan keaslian data dalam SPBE dijamin melalui kombinasi algoritma enkripsi, Sertifikat Elektronik Balai Sertifikasi Elektronik (BSrE BSSN), Tanda Tangan Elektronik Tersertifikasi (ETTD), fungsi Hash, dan infrastruktur kunci publik (PKI)."
  },
  {
    id: 12,
    category: "Audit TI & IT Enterprise",
    question: "Mengapa Enterprise Architecture (EA) diposisikan sebagai cetak biru (blueprint) utama dalam transformasi digital instansi pemerintah?",
    options: [
      "Agar instansi dapat melakukan pengadaan komputer setiap awal tahun",
      "Sebagai pengarah strategis untuk menyelaraskan proses bisnis, integrasi data perkara, aplikasi layanan publik, dan infrastruktur keamanan TIK secara terpadu dan berkelanjutan",
      "Untuk mengganti seluruh staf operator TI dengan sistem robot otomatis",
      "Hanya sebagai formalitas dokumen syarat pencairan anggaran DIPA"
    ],
    correctIndex: 1,
    explanation: "Enterprise Architecture (EA) berfungsi sebagai cetak biru (blueprint) yang memetakan keterpaduan antara proses bisnis institusi penegak hukum, standardisasi data, arsitektur aplikasi, dan ketahanan infrastruktur SPBE."
  },
  {
    id: 13,
    category: "Audit TI & IT Enterprise",
    question: "Tingkat Kematangan (Maturity Level) evaluasi SPBE instansi pemerintah dengan predikat Level 3 menunjukkan bahwa tata kelola berada pada tahap...",
    options: [
      "Rintisan (Ad-hoc)",
      "Terkelola (Managed)",
      "Terdefinisi (Standardized & Defined)",
      "Optimum (Continuous Improvement)"
    ],
    correctIndex: 2,
    explanation: "Tingkat Kematangan SPBE: Level 1 (Rintisan), Level 2 (Terkelola), Level 3 (Terdefinisi), Level 4 (Terpadu/Terintegrasi), dan Level 5 (Optimum)."
  },
  {
    id: 14,
    category: "Audit TI & IT Enterprise",
    question: "Dalam pelaksanaan audit keamanan informasi TIK, aspek apa yang diuji untuk memastikan data tidak dapat diubah oleh pihak yang tidak berhak?",
    options: [
      "Confidentiality (Kerahasiaan)",
      "Integrity (Keutuhan / Integritas Data)",
      "Availability (Ketersediaan Layanan)",
      "Usability (Kemudahan Antarmuka)"
    ],
    correctIndex: 1,
    explanation: "Aspek Integrity (Keutuhan) menjamin bahwa data, informasi, dan sistem perangkat lunak tetap akurat, lengkap, dan tidak dapat dimodifikasi atau dirusak oleh pihak yang tidak memiliki hak otorisasi."
  },
  {
    id: 15,
    category: "Audit TI & IT Enterprise",
    question: "Framework arsitektur enterprise global yang membagi siklus pengembangan arsitektur ke dalam metode Architecture Development Method (ADM) adalah...",
    options: [
      "Zachman Framework",
      "TOGAF (The Open Group Architecture Framework)",
      "FEAF (Federal Enterprise Architecture)",
      "DoDAF"
    ],
    correctIndex: 1,
    explanation: "TOGAF menggunakan Architecture Development Method (ADM) sebagai siklus berulang untuk merencanakan, merancang, mengimplementasikan, dan mengelola arsitektur enterprise."
  },
  {
    id: 16,
    category: "Audit TI & IT Enterprise",
    question: "Dalam audit sistem informasi berbasis ISO 27001, kontrol keamanan akses jaringan nirkabel (Wi-Fi) di satker mewajibkan implementasi...",
    options: [
      "Wi-Fi terbuka tanpa sandi agar mempermudah tamu",
      "Segmentasi VLAN terpisah antara jaringan operasional pegawai dan akses publik/tamu, disertai enkripsi WPA2/WPA3 Enterprise",
      "Menonaktifkan seluruh koneksi kabel LAN",
      "Hanya membatasi kecepatan unduhan menjadi 1 Mbps"
    ],
    correctIndex: 1,
    explanation: "Standar keamanan ISO 27001 mewajibkan isolasi dan segmentasi jaringan Wi-Fi tamu terpisah dari VLAN jaringan internal database perkara, dilengkapi enkripsi kuat WPA2/WPA3 Enterprise."
  },

  // =========================================================================
  // 3. MANAJEMEN LAYANAN TEKNOLOGI INFORMASI (ITIL 4) (MODUL 5)
  // =========================================================================
  {
    id: 17,
    category: "Manajemen Layanan ITIL 4",
    question: "Sebutkan 6 (enam) aktivitas utama dalam Rantai Nilai Layanan (Service Value Chain - SVC) pada kerangka kerja ITIL 4!",
    options: [
      "Input, Processing, Storage, Output, Distribution, Maintenance",
      "Plan, Improve, Engage, Design & Transition, Obtain/Build, Deliver & Support",
      "Requirements, Design, Coding, Testing, Deployment, Maintenance",
      "Identifikasi, Analisis, Evaluasi, Mitigasi, Monitoring, Pelaporan"
    ],
    correctIndex: 1,
    explanation: "Model operasional Rantai Nilai Layanan (Service Value Chain) ITIL 4 memuat 6 aktivitas inti: Plan (Perencanaan), Improve (Peningkatan), Engage (Pelibatan), Design & Transition (Desain & Transisi), Obtain/Build (Pengadaan/Pembangunan), dan Deliver & Support (Penyampaian & Dukungan)."
  },
  {
    id: 18,
    category: "Manajemen Layanan ITIL 4",
    question: "Apa fungsi fundamental dari Configuration Management Database (CMDB) dalam manajemen konfigurasi layanan TI?",
    options: [
      "Menyimpan password akun email seluruh pegawai",
      "Menyimpan data atribut konfigurasi dan memetakan relasi ketergantungan antar-komponen layanan TI (Configuration Item / CI)",
      "Sebagai tempat penyimpanan file backup video rekaman CCTV kantor",
      "Mencatat absensi kehadiran harian staf fungsional"
    ],
    correctIndex: 1,
    explanation: "CMDB berfungsi sebagai repositori terpusat yang mencatat detail atribut dan memetakan relasi saling ketergantungan di antara seluruh Configuration Item (CI) seperti server, switch, aplikasi perkara, dan lisensi."
  },
  {
    id: 19,
    category: "Manajemen Layanan ITIL 4",
    question: "Dalam manajemen insiden ITIL 4, apa perbedaan mendasar antara Insiden (Incident) dan Masalah (Problem)?",
    options: [
      "Insiden adalah gangguan operasional tidak terencana terhadap layanan, sedangkan Masalah adalah akar penyebab yang mendasari satu atau beberapa insiden",
      "Insiden terjadi pada software, sedangkan Masalah hanya terjadi pada hardware",
      "Insiden dilaporkan pimpinan, sedangkan Masalah dilaporkan operator",
      "Keduanya memiliki definisi yang sama persis tanpa perbedaan"
    ],
    correctIndex: 0,
    explanation: "Incident Management berfokus pada pemulihan cepat operasional layanan normal sesegera mungkin, sedangkan Problem Management berfokus pada analisis akar penyebab (Root Cause Analysis - RCA) untuk mencegah insiden berulang."
  },
  {
    id: 20,
    category: "Manajemen Layanan ITIL 4",
    question: "Sebutkan 4 (empat) dimensi manajemen layanan yang saling melengkapi dalam ITIL 4!",
    options: [
      "Hardware, Software, Network, Brainware",
      "Organizations & People, Information & Technology, Partners & Suppliers, Value Streams & Processes",
      "Plan, Do, Check, Act",
      "Input, Process, Output, Outcome"
    ],
    correctIndex: 1,
    explanation: "4 Dimensi Layanan ITIL 4: (1) Organisasi & Sumber Daya Manusia, (2) Informasi & Teknologi, (3) Mitra & Pemasok, dan (4) Aliran Nilai & Proses."
  },
  {
    id: 21,
    category: "Manajemen Layanan ITIL 4",
    question: "Kesepakatan tingkat layanan formal antara penyedia layanan TI internal dan unit kerja pengguna yang memuat metrik ketersediaan sistem disebut...",
    options: [
      "Memorandum of Understanding (MoU)",
      "Service Level Agreement (SLA)",
      "Operational Level Agreement (OLA)",
      "Underpinning Contract (UC)"
    ],
    correctIndex: 1,
    explanation: "Service Level Agreement (SLA) mendefinisikan target tingkat layanan, ketersediaan, waktu respon perbaikan, dan tanggung jawab antara penyedia layanan TI dengan pengguna akhir (end user)."
  },

  // =========================================================================
  // 4. MANAJEMEN RISIKO TEKNOLOGI INFORMASI (ISO 31000) (MODUL 6)
  // =========================================================================
  {
    id: 22,
    category: "Manajemen Risiko ISO 31000",
    question: "Berdasarkan standar ISO 31000:2018, apa definisi resmi dari kata 'Risiko'?",
    options: [
      "Kerusakan fatal pada motherboard server database",
      "Pengaruh ketidakpastian terhadap pencapaian sasaran / tujuan organisasi (Effect of uncertainty on objectives)",
      "Tindakan pelanggaran disiplin oleh pegawai",
      "Kekurangan anggaran operasional bulanan"
    ],
    correctIndex: 1,
    explanation: "ISO 31000:2018 mendefinisikan Risiko sebagai 'Effect of uncertainty on objectives' (dampak ketidakpastian terhadap pencapaian sasaran/tujuan), yang dapat berupa penyimpangan positif maupun negatif."
  },
  {
    id: 23,
    category: "Manajemen Risiko ISO 31000",
    question: "Tiga tahapan utama yang membentuk proses Penilaian Risiko (Risk Assessment) secara berurutan adalah...",
    options: [
      "Perencanaan, Pelaksanaan, Evaluasi",
      "Identifikasi Risiko, Analisis Risiko, dan Evaluasi Risiko",
      "Pencegahan, Penindakan, Pemulihan",
      "Deteksi Malware, Karantina, Hapus File"
    ],
    correctIndex: 1,
    explanation: "Risk Assessment terdiri dari 3 sub-proses: (1) Identifikasi Risiko (mengenali sumber bahaya), (2) Analisis Risiko (mengukur tingkat kemungkinan & dampak), dan (3) Evaluasi Risiko (membandingkan dengan selera risiko organisasi)."
  },
  {
    id: 24,
    category: "Manajemen Risiko ISO 31000",
    question: "Strategi penanganan risiko dengan cara memindahkan dampak finansial ke pihak ketiga (misalnya asuransi perangkat keras atau kontrak pihak ketiga) disebut...",
    options: [
      "Risk Mitigation (Pengurangan Risiko)",
      "Risk Avoidance (Menghindari Risiko)",
      "Risk Sharing / Transfer (Berbagi / Memindahkan Risiko)",
      "Risk Acceptance (Menerima Risiko)"
    ],
    correctIndex: 2,
    explanation: "Risk Sharing/Transfer mengalihkan sebagian atau seluruh konsekuensi risiko ke pihak eksternal, seperti perjanjian asuransi server atau kontrak garansi vendor SLA 24/7."
  },
  {
    id: 25,
    category: "Manajemen Risiko ISO 31000",
    question: "Dokumen yang memuat inventarisasi risiko, pemilik risiko (risk owner), skor kemungkinan, skor dampak, level risiko, dan rencana aksi mitigasi disebut...",
    options: [
      "Logbook Harian",
      "Risk Register (Daftar / Register Risiko)",
      "Surat Keputusan (SK) Tim TI",
      "Berita Acara Serah Terima (BAST)"
    ],
    correctIndex: 1,
    explanation: "Risk Register adalah dokumen hidup yang mencatat seluruh profil risiko, pemilik risiko, penilaian nilai dampak dan kemungkinan, serta status tindakan mitigasi yang harus dipantau berkala."
  },
  {
    id: 26,
    category: "Manajemen Risiko ISO 31000",
    question: "Dalam mitigasi bencana pusat data (Disaster Recovery Plan), parameter RPO (Recovery Point Objective) mengukur...",
    options: [
      "Batas maksimal kehilangan data yang dapat ditoleransi sejak insiden terjadi",
      "Lama waktu yang dibutuhkan teknisi untuk menyalakan genset",
      "Biaya pembelian harddisk eksternal baru",
      "Jarak fisik antara kantor utama dan data center cadangan"
    ],
    correctIndex: 0,
    explanation: "RPO (Recovery Point Objective) menentukan batas maksimal volume atau rentang waktu data yang hilang dan dapat diterima oleh organisasi (misal: RPO = 1 jam berarti data hilang maksimal 1 jam terakhir)."
  },

  // =========================================================================
  // 5. PENGOLAHAN DATA & DATA MANAGEMENT (DAMA DMBOK) (MODUL 7 & 8)
  // =========================================================================
  {
    id: 27,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Menurut kerangka kerja DAMA DMBOK edisi kedua (DMBOK2), fungsi manakah yang diposisikan di pusat (center) Roda Manajemen Data (DAMA Wheel)?",
    options: [
      "Data Storage & Operations",
      "Data Governance (Tata Kelola Data)",
      "Data Security",
      "Data Warehousing & BI"
    ],
    correctIndex: 1,
    explanation: "Data Governance (Tata Kelola Data) adalah pilar pusat (center of DAMA Wheel) yang mengarahkan dan mengendalikan 10 fungsi manajemen data lainnya (seperti Data Architecture, Data Modeling, Data Quality, dll.)."
  },
  {
    id: 28,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Proses normalisasi tabel basis data relasional untuk mengeliminasi ketergantungan fungsional parsial (partial dependency) menghasilkan bentuk normal...",
    options: [
      "Bentuk Normal Pertama (1NF)",
      "Bentuk Normal Kedua (2NF)",
      "Bentuk Normal Ketiga (3NF)",
      "Boyce-Codd Normal Form (BCNF)"
    ],
    correctIndex: 1,
    explanation: "2NF terpenuhi jika tabel sudah berada dalam 1NF dan setiap atribut bukan kunci primer bergantung penuh pada seluruh kunci primer (menghilangkan partial dependency)."
  },
  {
    id: 29,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Data tentang data yang menjelaskan struktur, format, definisi bisnis, silsilah data (data lineage), dan aturan validasi data disebut...",
    options: [
      "Master Data",
      "Metadata",
      "Transactional Data",
      "Reference Data"
    ],
    correctIndex: 1,
    explanation: "Metadata adalah data yang mendeskripsikan konteks, struktur, definisi kamus data, tipe data, dan alur pergerakan data dari sumber hingga penyajian (data about data)."
  },
  {
    id: 30,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Dalam prinsip ACID pada manajemen transaksi database relasional, huruf 'I' (Isolation) memastikan bahwa...",
    options: [
      "Transaksi berjalan cepat tanpa penguncian tabel",
      "Transaksi yang dieksekusi secara bersamaan (konkuren) tidak saling mengganggu dan menghasilkan kondisi data yang konsisten",
      "Database harus diisolasi di ruangan ber-AC",
      "Data hanya bisa diakses oleh 1 user saja secara permanen"
    ],
    correctIndex: 1,
    explanation: "Isolation memastikan bahwa eksekusi transaksi yang berlangsung secara bersamaan (concurrent) tidak saling mencemari (menghindari dirty reads, non-repeatable reads, phantom reads)."
  },
  {
    id: 31,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Dimensi kualitas data DAMA yang mengukur sejauh mana seluruh atribut data yang wajib telah terisi tanpa adanya kekosongan (null values) disebut...",
    options: [
      "Accuracy (Akurasi)",
      "Completeness (Kelengkapan)",
      "Consistency (Konsistensi)",
      "Timeliness (Ketepatan Waktu)"
    ],
    correctIndex: 1,
    explanation: "Completeness (Kelengkapan) mengukur proporsi data yang ada dibandingkan dengan data yang seharusnya ada untuk mendukung proses bisnis."
  },
  {
    id: 32,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Dalam arsitektur basis data relasional, perintah SQL yang termasuk ke dalam kategori Data Manipulation Language (DML) adalah...",
    options: [
      "CREATE, DROP, ALTER",
      "SELECT, INSERT, UPDATE, DELETE",
      "GRANT, REVOKE",
      "COMMIT, ROLLBACK"
    ],
    correctIndex: 1,
    explanation: "DML mencakup perintah manipulasi baris data yaitu SELECT, INSERT, UPDATE, dan DELETE. Sedangkan CREATE/DROP adalah DDL, GRANT/REVOKE adalah DCL, dan COMMIT/ROLLBACK adalah TCL."
  },

  // =========================================================================
  // 6. SISTEM INFORMASI & SDLC (MODUL 7 & 8)
  // =========================================================================
  {
    id: 33,
    category: "Sistem Informasi & SDLC",
    question: "Metodologi pengembangan perangkat lunak yang bersifat adaptif, iteratif, dan merilis fungsionalitas secara berkala dalam periode Sprint disebut...",
    options: [
      "Metode Waterfall Tradisional",
      "Scrum / Agile Framework",
      "Metode Big Bang",
      "Cleanroom Software Engineering"
    ],
    correctIndex: 1,
    explanation: "Scrum merupakan kerangka kerja Agile yang mengedepankan kolaborasi tim, transparansi, serta pengiriman perangkat lunak yang berfungsi secara bertahap dalam siklus sprint 1-4 minggu."
  },
  {
    id: 34,
    category: "Sistem Informasi & SDLC",
    question: "Teknik pengujian perangkat lunak di mana penguji mengevaluasi fungsionalitas sistem berdasarkan input dan output tanpa mengetahui kode program internal disebut...",
    options: [
      "White-Box Testing",
      "Black-Box Testing",
      "Unit Testing Berbasis Kode",
      "Static Code Analysis"
    ],
    correctIndex: 1,
    explanation: "Black-Box Testing (pengujian kotak hitam) fokus pada pengujian spesifikasi fungsional antarmuka dan respon logika aplikasi dari sudut pandang pengguna akhir tanpa melihat source code."
  },
  {
    id: 35,
    category: "Sistem Informasi & SDLC",
    question: "Kerangka Analisis PIECES yang dikembangkan oleh James Wetherbe digunakan untuk mengevaluasi kelayakan sistem informasi. Huruf 'E' dan 'S' melambangkan...",
    options: [
      "Electricity & Speed",
      "Economics (Ekonomi/Biaya) & Service (Layanan Pengguna)",
      "Encryption & Storage",
      "Engineering & Software"
    ],
    correctIndex: 1,
    explanation: "Kerangka Analisis PIECES mengevaluasi: Performance (kinerja), Information (kualitas informasi), Economics (biaya/keuntungan), Control (keamanan/kontrol data), Efficiency (efisiensi sumber daya), dan Service (kualitas layanan pengguna)."
  },
  {
    id: 36,
    category: "Sistem Informasi & SDLC",
    question: "Diagram pemodelan sistem yang menggambarkan interaksi antara aktor (pengguna/sistem lain) dengan fungsi-fungsi yang disediakan oleh sistem adalah...",
    options: [
      "Class Diagram",
      "Use Case Diagram",
      "Deployment Diagram",
      "Entity Relationship Diagram (ERD)"
    ],
    correctIndex: 1,
    explanation: "Use Case Diagram pada UML memetakan hubungan antara aktor (pengguna eksternal/internal) dengan use case (skenario fungsi spesifik yang disediakan oleh aplikasi)."
  },
  {
    id: 37,
    category: "Sistem Informasi & SDLC",
    question: "Dalam Continuous Integration / Continuous Deployment (CI/CD), apa manfaat utama dari automated testing pipeline?",
    options: [
      "Menghilangkan kebutuhan programmer di kantor",
      "Mendeteksi bug dan regresi kode lebih awal secara otomatis sebelum rilis ke lingkungan produksi",
      "Membuat ukuran file program menjadi lebih besar",
      "Menutup akses koneksi internet server"
    ],
    correctIndex: 1,
    explanation: "Pipeline CI/CD otomatis menjalankan build dan unit test pada setiap commit kode untuk memastikan stabilitas aplikasi dan mencegah regresi error merambah ke production server."
  },

  // =========================================================================
  // 7. HUKUM ADMINISTRASI NEGARA & LMS (MODUL 7 & REGULASI)
  // =========================================================================
  {
    id: 38,
    category: "LMS & Regulasi ASN",
    question: "Berdasarkan modul hukum administrasi ASN, apa perbedaan mendasar antara konsep 'Fungsi' dan 'Tugas' bagi seorang Pegawai Negeri Sipil?",
    options: [
      "Fungsi mengatur gaji pokok, sedangkan Tugas mengatur tunjangan kinerja",
      "Fungsi menjawab alasan filosofis mengapa ASN ada (pelaksana kebijakan, pelayan publik, pemersatu bangsa), sedangkan Tugas menjawab apa pekerjaan konkrit yang dikerjakan",
      "Fungsi berlaku hanya untuk PPPK, sedangkan Tugas berlaku hanya untuk PNS",
      "Tidak ada perbedaan sama sekali antara fungsi dan tugas dalam hukum administrasi"
    ],
    correctIndex: 1,
    explanation: "Dalam hukum administrasi kepegawaian ASN: 'Fungsi' menjawab tujuan eksistensi/alasan mengapa institusi dan ASN ada, sedangkan 'Tugas' merupakan mandat operasional mengenai apa yang dikerjakan dalam rutinitas kerja pelayanan publik."
  },
  {
    id: 39,
    category: "LMS & Regulasi ASN",
    question: "Regulasi Undang-Undang pokok yang menjadi landasan manajemen ASN, penguatan peran jabatan fungsional, dan digitalisasi manajemen kepegawaian saat ini adalah...",
    options: [
      "Undang-Undang Nomor 5 Tahun 2014",
      "Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara",
      "Undang-Undang Nomor 11 Tahun 2008 tentang ITE",
      "Peraturan Pemerintah Nomor 11 Tahun 2017"
    ],
    correctIndex: 1,
    explanation: "UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara mencabut UU No. 5/2014 dan menjadi dasar hukum utama manajemen ASN berbasis meritokrasi, kelincahan organisasi fungsional, dan transformasi digital kepegawaian."
  },
  {
    id: 40,
    category: "LMS & Regulasi ASN",
    question: "Mengapa pemahaman batas kewenangan dan integritas sistem TIK sangat krusial bagi tenaga fungsional di lingkungan Kejaksaan RI?",
    options: [
      "Karena Kejaksaan lembaga penegak hukum di mana kekeliruan akses data dan wewenang berdampak langsung pada keabsahan pembuktian perkara dan hak asasi manusia",
      "Hanya untuk memenuhi syarat formalitas penilaian sertifikat pelatihan",
      "Agar printer kantor tidak cepat rusak",
      "Karena anggaran internet kejaksaan sangat terbatas"
    ],
    correctIndex: 0,
    explanation: "Di lembaga penegak hukum seperti Kejaksaan RI, integritas data perkara dan kepatuhan wewenang sistem sangat vital karena menyangkut status hukum seseorang, asas kerahasiaan pra-penuntutan, dan perlindungan hak asasi warga negara."
  },
  {
    id: 41,
    category: "LMS & Regulasi ASN",
    question: "Berapa batas minimal persentase kehadiran perkuliahan Tatap Muka Online (TMO) dan MOOC untuk memenuhi syarat kelulusan Diklat Fungsional Prakom?",
    options: [
      "75% dari total JP",
      "80% dari total JP",
      "95% dari total jam pelajaran yang dialokasikan",
      "50% asalkan mengumpulkan tugas akhir"
    ],
    correctIndex: 2,
    explanation: "Standar operasional Pusdiklat Kejaksaan RI menetapkan batas kehadiran minimal 95% dari total alokasi jam pelajaran (JP) sebagai syarat mutlak kelulusan diklat dan penerbitan Surat Tanda Tamat Pendidikan dan Pelatihan (STTPP)."
  },
  {
    id: 42,
    category: "LMS & Regulasi ASN",
    question: "Core values ASN BerAKHLAK yang wajib diinternalisasi oleh setiap pejabat fungsional Pranata Komputer merupakan akronim dari...",
    options: [
      "Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif",
      "Bersih, Amanah, Kreatif, Hebat, Loyal, Adil, Konsisten",
      "Bekerja, Rajin, Andal, Kritis, Humanis, Lugas, Ksatria",
      "Berani, Edukatif, Resik, Aktif, Komitmen, Handal, Luwes"
    ],
    correctIndex: 0,
    explanation: "BerAKHLAK adalah nilai dasar ASN: Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, dan Kolaboratif."
  },
  {
    id: 43,
    category: "LMS & Regulasi ASN",
    question: "Dalam modul orientasi mandiri LMS, alokasi waktu 90 menit pembelajaran terbagi secara terstruktur menjadi...",
    options: [
      "10 menit pendahuluan, 65 menit materi inti, 15 menit rangkuman & refleksi",
      "30 menit teori, 30 menit praktik, 30 menit istirahat",
      "90 menit penuh ujian kuis pilihan ganda",
      "15 menit absen, 75 menit diskusi bebas"
    ],
    correctIndex: 0,
    explanation: "Struktur standar sesi 90 menit pembelajaran mandiri modul LMS: 10 menit pembuka/pendahuluan, 65 menit pendalaman materi inti, dan 15 menit penyimpulan/refleksi akhir."
  },
  {
    id: 44,
    category: "Audit TI & IT Enterprise",
    question: "Tim Tanggap Insiden Keamanan Siber di lingkungan Kejaksaan RI dikenal dengan singkatan CSIRT. Tugas pokok CSIRT satker adalah...",
    options: [
      "Melakukan pengadaan perangkat laptop dinas baru",
      "Menerima, meninjau, menganalisis, merespon, dan memulihkan insiden serangan siber (malware, ransomware, web defacement) pada aset TIK Kejaksaan",
      "Membuat absensi kehadiran sidik jari pegawai",
      "Mengatur jadwal sidang perkara pidana umum"
    ],
    correctIndex: 1,
    explanation: "Computer Security Incident Response Team (CSIRT) bertugas mencegah, mendeteksi, menangani, dan memitigasi insiden keamanan siber yang menyerang sistem dan jaringan instansi."
  },
  {
    id: 45,
    category: "Manajemen Layanan ITIL 4",
    question: "Komponen dasar dalam ITIL 4 yang menggambarkan bagaimana semua komponen dan aktivitas organisasi bekerja sama untuk memfasilitasi penciptaan nilai disebut...",
    options: [
      "Service Value System (SVS)",
      "Continual Improvement Model",
      "Four Dimensions of Service Management",
      "Guiding Principles"
    ],
    correctIndex: 0,
    explanation: "Service Value System (SVS) adalah kerangka menyeluruh dalam ITIL 4 yang mengintegrasikan Guiding Principles, Governance, Service Value Chain, Practices, dan Continual Improvement."
  }
]
