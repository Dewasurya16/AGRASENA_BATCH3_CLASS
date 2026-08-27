export interface QuizQuestion {
  id: number
  category: "Overview & Administrasi Prakom" | "Audit TI & IT Enterprise" | "Manajemen Layanan ITIL 4" | "Manajemen Risiko ISO 31000" | "Pengolahan Data & DAMA DMBOK" | "Sistem Informasi & SDLC" | "LMS & Regulasi ASN"
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

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
    question: "Sebutkan 3 (tiga) pilar kompetensi utama yang dibangun dalam Pelatihan Fungsional Pranata Komputer Kejaksaan RI!",
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
    explanation: "Berdasarkan PermenPAN-RB No. 1 Tahun 2023 dan regulasi BKN, usulan kenaikan pangkat PNS kini disederhanakan dan diperluas menjadi 6 (enam) periode dalam satu tahun yaitu per 1 Februari, 1 April, 1 Juni, 1 Agustus, 1 Oktober, dan 1 Desember."
  },

  // =========================================================================
  // 2. AUDIT TEKNOLOGI INFORMASI (MODUL 3)
  // =========================================================================
  {
    id: 5,
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
    id: 6,
    category: "Audit TI & IT Enterprise",
    question: "Organisasi internasional manakah yang merilis dan mengelola kepemilikan kerangka kerja Information Technology Infrastructure Library (ITIL)?",
    options: [
      "ISACA (Information Systems Audit and Control Association)",
      "AXELOS Limited",
      "IEEE (Institute of Electrical and Electronics Engineers)",
      "ISO (International Organization for Standardization)"
    ],
    correctIndex: 1,
    explanation: "ITIL (Information Technology Infrastructure Library) adalah seperangkat panduan best practices untuk IT Service Management (ITSM) yang dirilis dan dimiliki oleh AXELOS Limited."
  },

  // =========================================================================
  // 3. IT ENTERPRISE & ARSITEKTUR SPBE (MODUL 4)
  // =========================================================================
  {
    id: 7,
    category: "Audit TI & IT Enterprise",
    question: "Instrumen teknologi informasi apakah yang digunakan untuk menjamin aspek kenirsangkalan (non-repudiation) dan keaslian pada arsitektur data SPBE Kejaksaan RI?",
    options: [
      "Koneksi kabel LAN Cat6 dan switch unmanaged",
      "Enkripsi simetris, Sertifikat Elektronik, Tanda Tangan Elektronik (ETTD), Hash kriptografi, dan Public Key Infrastructure (PKI)",
      "Antivirus gratis dan firewall bawaan Windows",
      "Pencetakan fisik berkas perkara rangkap tiga"
    ],
    correctIndex: 1,
    explanation: "Kenirsangkalan (Non-Repudiation) dan keaslian data dalam SPBE dijamin melalui kombinasi algoritma enkripsi, Sertifikat Elektronik Balai Sertifikasi Elektronik (BSrE BSSN), Tanda Tangan Elektronik Tersertifikasi (ETTD), fungsi Hash, dan infrastruktur kunci publik (PKI)."
  },
  {
    id: 8,
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

  // =========================================================================
  // 4. MANAJEMEN LAYANAN TEKNOLOGI INFORMASI (ITIL 4) (MODUL 5)
  // =========================================================================
  {
    id: 9,
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
    id: 10,
    category: "Manajemen Layanan ITIL 4",
    question: "Apa fungsi fundamental dari Configuration Management Database (CMDB) dalam manajemen konfigurasi layanan TI?",
    options: [
      "Menyimpan password akun email seluruh pegawai",
      "Menyimpan data atribut konfigurasi dan memetakan relasi ketergantungan antar-komponen layanan TI (Configuration Item / CI)",
      "Sebagai tempat penyimpanan file backup video rekaman CCTV kantor",
      "Mencatat absensi kehadiran harian staf fungsional"
    ],
    correctIndex: 1,
    explanation: "CMDB (Configuration Management Database) berfungsi menyimpan informasi rinci tentang seluruh Configuration Item (CI) seperti server, database, jaringan, dan aplikasi, serta memetakan hubungan ketergantungan antar-komponen untuk mempermudah analisis dampak insiden dan perubahan sistem."
  },
  {
    id: 11,
    category: "Manajemen Layanan ITIL 4",
    question: "Manakah yang BUKAN merupakan salah satu dari 4 Dimensi Manajemen Layanan pada ITIL 4?",
    options: [
      "Organizations and People",
      "Information and Technology",
      "Hardware and Physical Device Purchases Only",
      "Value Streams and Processes"
    ],
    correctIndex: 2,
    explanation: "4 Dimensi Manajemen Layanan ITIL 4 adalah: (1) Organizations and People, (2) Information and Technology, (3) Partners and Suppliers, dan (4) Value Streams and Processes."
  },

  // =========================================================================
  // 5. MANAJEMEN RISIKO TEKNOLOGI INFORMASI (ISO 31000) (MODUL 6)
  // =========================================================================
  {
    id: 12,
    category: "Manajemen Risiko ISO 31000",
    question: "Sebutkan 3 (tiga) sub-tahapan yang wajib dilaksanakan dalam proses Penilaian Risiko (Risk Assessment) menurut standar ISO 31000!",
    options: [
      "Perencanaan, Pembiayaan, dan Pengadaan",
      "Identifikasi Risiko, Analisis Risiko, dan Evaluasi Risiko",
      "Mitigasi Risiko, Transfer Risiko, dan Penerimaan Risiko",
      "Penyusunan SOP, Sosialisasi, dan Uji Petik"
    ],
    correctIndex: 1,
    explanation: "Tahap Penilaian Risiko (Risk Assessment) terdiri dari 3 sub-proses: (1) Identifikasi Risiko (mengenali sumber bahaya & aset), (2) Analisis Risiko (mengukur likelihood x impact untuk besaran risiko), dan (3) Evaluasi Risiko (menentukan prioritas berdasarkan selera risiko)."
  },
  {
    id: 13,
    category: "Manajemen Risiko ISO 31000",
    question: "Opsi penanganan risiko (Risk Treatment) apakah yang tepat dipilih apabila estimasi biaya mitigasi teknis jauh lebih besar daripada potensi dampak kerugian finansial/operasional yang timbul?",
    options: [
      "Penghindaran Risiko (Risk Avoidance)",
      "Penerimaan Risiko (Risk Acceptance)",
      "Pembagian Risiko (Risk Sharing / Transfer)",
      "Mitigasi Risiko Maksimal (Risk Mitigation)"
    ],
    correctIndex: 1,
    explanation: "Penerimaan Risiko (Risk Acceptance) diambil sebagai keputusan rasional manakala tingkat risiko berada dalam batas selera risiko (risk appetite) organisasi dan biaya pengendalian/mitigasi tidak ekonomis dibandingkan potensi kerugian."
  },

  // =========================================================================
  // 6. HUKUM ADMINISTRASI NEGARA & LMS (MODUL 7)
  // =========================================================================
  {
    id: 14,
    category: "LMS & Regulasi ASN",
    question: "Berdasarkan modul hukum administrasi ASN, apa perbedaan mendasar antara konsep 'Fungsi' dan 'Tugas' bagi seorang Pegawai Negeri Sipil?",
    options: [
      "Fungsi mengatur gaji pokok, sedangkan Tugas mengatur tunjangan kinerja",
      "Fungsi menjawab alasan filosofis mengapa ASN ada (misal: pelaksana kebijakan, pelayan publik, pemersatu bangsa), sedangkan Tugas menjawab apa pekerjaan konkrit yang dikerjakan",
      "Fungsi berlaku hanya untuk PPPK, sedangkan Tugas berlaku hanya untuk PNS",
      "Tidak ada perbedaan sama sekali antara fungsi dan tugas dalam hukum administrasi"
    ],
    correctIndex: 1,
    explanation: "Dalam hukum administrasi kepegawaian ASN: 'Fungsi' menjawab tujuan eksistensi/alasan mengapa institusi dan ASN ada, sedangkan 'Tugas' merupakan mandat operasional mengenai apa yang dikerjakan dalam rutinitas kerja pelayanan publik."
  },
  {
    id: 15,
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

  // =========================================================================
  // 7. PENGOLAHAN DATA & DAMA DMBOK (MODUL 8)
  // =========================================================================
  {
    id: 16,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Dalam pembersihan data perkara (data preparation & cleaning), proses penanganan nilai data yang menyimpang sangat jauh secara ekstrem dari sebaran data mayoritas disebut...",
    options: [
      "Penanganan Outlier (Pencilan)",
      "Normalisasi Database 3NF",
      "Data Indexing",
      "Data Deduplication"
    ],
    correctIndex: 0,
    explanation: "Outlier (Pencilan) adalah titik data yang nilainya berbeda signifikan/ekstrem dari distribusi kumpulan data lainnya. Deteksi dan perlakuan outlier wajib dilakukan agar tidak mendistorsi hasil analisis dan model prediksi statistik."
  },
  {
    id: 17,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Fungsi pivot_wider() pada bahasa pemrograman R (paket tidyr) dan fungsi pivot() pada library Python Pandas digunakan untuk melakukan manipulasi data jenis apa?",
    options: [
      "Menghapus seluruh kolom database secara permanen",
      "Mengubah bentuk struktur data dari format panjang (long format) menjadi format lebar (wide format)",
      "Melakukan kompresi file zip database",
      "Melakukan koneksi socket jaringan lokal"
    ],
    correctIndex: 1,
    explanation: "Pivoting data adalah teknik restructuring data. `pivot_wider()` di R dan `.pivot()` / `.pivot_table()` di Python Pandas digunakan untuk mengubah baris-baris data observasi berformat panjang menjadi kolom-kolom berformat lebar (wide format) untuk mempermudah tabulasi statistik."
  },
  {
    id: 18,
    category: "Pengolahan Data & DAMA DMBOK",
    question: "Sebutkan teknik akuisisi data otomatis dari halaman web pemerintah atau portal publik menggunakan skrip bot/spider terprogram!",
    options: [
      "Data Loading",
      "Web Crawling / Scraping",
      "Data Deduplication",
      "Data Imputation"
    ],
    correctIndex: 1,
    explanation: "Web Crawling / Scraping adalah metode pengambilan data mentah secara otomatis dari halaman situs web menggunakan bot terprogram untuk dikumpulkan ke dalam repositori analitik."
  },

  // =========================================================================
  // 8. REKAYASA SISTEM INFORMASI & SDLC (MODUL 9)
  // =========================================================================
  {
    id: 19,
    category: "Sistem Informasi & SDLC",
    question: "Berdasarkan riset rekayasa perangkat lunak dan tata kelola TI, faktor non-teknis apakah yang menduduki peringkat teratas sebagai penyebab utama kegagalan proyek sistem informasi?",
    options: [
      "Spesifikasi monitor komputer staf kurang besar",
      "Manajemen kebutuhan pengguna yang buruk (poor requirements management & scope creep)",
      "Penggunaan bahasa pemrograman open-source",
      "Kecepatan mengetik programmer yang lambat"
    ],
    correctIndex: 1,
    explanation: "Riset rekayasa perangkat lunak menunjukkan bahwa penyebab utama kegagalan proyek TI bukanlah keterbatasan hardware atau bahasa pemrograman, melainkan ketidakjelasan pendefinisian kebutuhan pengguna, komunikasi yang buruk, dan perubahan lingkup yang tidak terkendali (poor requirements management)."
  },
  {
    id: 20,
    category: "Sistem Informasi & SDLC",
    question: "Dalam tahap analisis kelayakan sistem informasi, sebutkan kepanjangan dari kerangka uji kelayakan metode TELOS!",
    options: [
      "Technology, Engineering, Logistics, Operation, Security",
      "Technical, Economic, Legal, Operational, Schedule",
      "Total, Enterprise, Level, Optimization, Standard",
      "Testing, Execution, Logging, Overview, Support"
    ],
    correctIndex: 1,
    explanation: "Kerangka Studi Kelayakan TELOS mencakup 5 dimensi evaluasi: (1) Technical (kemampuan teknologi & SDM), (2) Economic (analisis biaya vs manfaat), (3) Legal (kepatuhan regulasi & hukum), (4) Operational (kesiapan prosedur & pengguna), dan (5) Schedule (ketepatan jadwal peluncuran)."
  },
  {
    id: 21,
    category: "Sistem Informasi & SDLC",
    question: "Prinsip Pemrograman Berorientasi Objek (OOP) yang berfungsi menyembunyikan detail implementasi internal dan membatasi akses langsung ke variabel melalui metode getter/setter disebut...",
    options: [
      "Inheritance (Pewarisan)",
      "Polymorphism (Banyak Bentuk)",
      "Encapsulation (Enkapsulasi / Pembungkusan)",
      "Abstraction (Abstraksi)"
    ],
    correctIndex: 2,
    explanation: "Enkapsulasi (Encapsulation) adalah mekanisme OOP untuk membungkus data (atribut) dan kode (metode) dalam satu kesatuan kelas serta menyembunyikan detail internal objek dari manipulasi langsung dari luar kelas guna menjaga integritas data."
  }
]
