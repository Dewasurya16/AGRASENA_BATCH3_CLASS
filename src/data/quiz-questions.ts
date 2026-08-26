export interface QuizQuestion {
  id: number
  category: "SPBE & Tata Kelola" | "Manajemen Layanan TI" | "Basis Data & Sistem" | "Keamanan Informasi" | "Angka Kredit Prakom"
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- KATEGORI 1: SPBE & TATA KELOLA PEMERINTAHAN (1 - 6) ---
  {
    id: 1,
    category: "SPBE & Tata Kelola",
    question: "Berdasarkan Perpres No. 95 Tahun 2018 tentang SPBE, apa tujuan utama penerapan Arsitektur SPBE pada instansi pemerintah?",
    options: [
      "Membeli infrastruktur server dengan anggaran terbesar setiap tahun",
      "Memberikan panduan integrasi proses bisnis, data, aplikasi, dan infrastruktur untuk layanan terpadu nasional",
      "Membuat aplikasi mandiri sebanyak mungkin di tiap unit kerja",
      "Menyerahkan seluruh pengelolaan data pemerintah ke pihak swasta tanpa kontrol"
    ],
    correctIndex: 1,
    explanation: "Arsitektur SPBE bertujuan menyusun kerangka dasar yang mengintegrasikan proses bisnis, data dan informasi, infrastruktur, aplikasi, dan keamanan SPBE untuk menghasilkan layanan SPBE yang terpadu secara nasional."
  },
  {
    id: 2,
    category: "SPBE & Tata Kelola",
    question: "Prinsip 'Satu Data Indonesia' (Perpres No. 39 Tahun 2019) mewajibkan data yang dihasilkan instansi pemerintah memenuhi 4 kaidah, KECUALI...",
    options: [
      "Memenuhi Standar Data yang ditetapkan",
      "Memiliki Metadata Baku",
      "Memenuhi Kaidah Interoperabilitas Data & Menggunakan Kode Referensi",
      "Data harus selalu dirahasiakan dan dilarang untuk dibagi-pakaikan antar instansi"
    ],
    correctIndex: 3,
    explanation: "Satu Data Indonesia justru mendorong prinsip 'Bagi Pakai Data' antar instansi pemerintah guna mewujudkan keterpaduan layanan publik. Empat prinsip SDI adalah: Standar Data, Metadata, Interoperabilitas, dan Kode Referensi/Data Induk."
  },
  {
    id: 3,
    category: "SPBE & Tata Kelola",
    question: "Dalam Domain Manajemen SPBE, proses audit TIK secara berkala wajib dilakukan untuk menilai aspek...",
    options: [
      "Hanya harga pembelian laptop pegawai",
      "Tata kelola, fungsionalitas aplikasi, infrastruktur, dan kepatuhan keamanan informasi",
      "Jumlah jam lembur operator komputer",
      "Banyaknya dokumen cetak yang dihasilkan satker"
    ],
    correctIndex: 1,
    explanation: "Audit TIK dalam SPBE mencakup pemeriksaan kepatuhan tata kelola, keandalan infrastruktur, fungsionalitas sistem aplikasi, serta kecukupan kontrol keamanan informasi."
  },
  {
    id: 4,
    category: "SPBE & Tata Kelola",
    question: "Tingkat Kematangan (Maturity Level) evaluasi SPBE instansi pemerintah dengan nilai Level 3 menunjukkan bahwa tata kelola berada pada tahap...",
    options: [
      "Rintisan (Ad-hoc)",
      "Terdefinisi (Standardized & Defined)",
      "Terpadu (Integrated)",
      "Optimum (Continuous Improvement)"
    ],
    correctIndex: 1,
    explanation: "Skala Kematangan SPBE: Level 1 (Rintisan), Level 2 (Terkelola), Level 3 (Terdefinisi), Level 4 (Terpadu/Terintegrasi), dan Level 5 (Optimum)."
  },
  {
    id: 5,
    category: "SPBE & Tata Kelola",
    question: "Kementerian yang bertindak sebagai Koordinator Tim Koordinasi SPBE Nasional sesuai regulasi adalah...",
    options: [
      "Kementerian BUMN",
      "Kementerian PANRB",
      "Kementerian Pertahanan",
      "Kementerian Keuangan"
    ],
    correctIndex: 1,
    explanation: "Kementerian PANRB bertindak sebagai Koordinator Tim Koordinasi SPBE Nasional bersama Kementerian Kominfo (Komdigi), Bappenas, BSSN, BRIN, dan BPKP."
  },

  // --- KATEGORI 2: MANAJEMEN LAYANAN TI (ITSM / ITIL) (6 - 10) ---
  {
    id: 6,
    category: "Manajemen Layanan TI",
    question: "Dalam kerangka kerja ITIL / Manajemen Layanan TI (ITSM), dokumen yang mendefinisikan kesepakatan tingkat ketersediaan dan performa layanan TI antara penyedia layanan dengan pengguna disebut...",
    options: [
      "Service Level Agreement (SLA)",
      "Operational Level Agreement (OLA)",
      "Configuration Management Database (CMDB)",
      "Underpinning Contract (UC)"
    ],
    correctIndex: 0,
    explanation: "SLA (Service Level Agreement) adalah dokumen kesepakatan formal antara penyedia layanan TI dengan pengguna yang mendefinisikan standar layanan, target respons, dan ketersediaan sistem."
  },
  {
    id: 7,
    category: "Manajemen Layanan TI",
    question: "Perbedaan mendasar antara 'Incident Management' dan 'Problem Management' pada operasional TI adalah...",
    options: [
      "Incident mencari penyebab akar masalah permanen, Problem hanya me-restart server",
      "Incident fokus memulihkan layanan secepat mungkin, Problem fokus menganalisis & menyelesaikan akar penyebab gangguan (root cause)",
      "Incident hanya menangani perangkat keras, Problem hanya menangani software",
      "Tidak ada perbedaan di antara keduanya"
    ],
    correctIndex: 1,
    explanation: "Incident Management bertujuan memulihkan gangguan operasional secepat mungkin ke kondisi normal, sedangkan Problem Management bertugas menganalisis dan mengeliminasi akar penyebab (root cause) agar gangguan tidak berulang."
  },
  {
    id: 8,
    category: "Manajemen Layanan TI",
    question: "Database yang menyimpan informasi seluruh aset TI, atribut konfigurasi, dan keterkaitan dependensi antar sistem disebut...",
    options: [
      "Data Warehouse (DWH)",
      "Configuration Management Database (CMDB)",
      "Relational Cache Store",
      "Enterprise Resource Planning (ERP)"
    ],
    correctIndex: 1,
    explanation: "CMDB (Configuration Management Database) adalah repositori terpusat yang menyimpan daftar Configuration Items (CI) beserta relasi dependensi antar infrastruktur TI."
  },
  {
    id: 9,
    category: "Manajemen Layanan TI",
    question: "Tujuan utama dari dibentuknya Change Advisory Board (CAB) dalam manajemen perubahan sistem TI adalah...",
    options: [
      "Menyetujui kenaikan gaji tim developer",
      "Menilai dampak, risiko, dan urgensi sebelum suatu perubahan pada sistem produksi diizinkan untuk di-deploy",
      "Menghapus database cadangan",
      "Menulis kode program secara bergiliran"
    ],
    correctIndex: 1,
    explanation: "CAB (Change Advisory Board) bertugas mengevaluasi permintaan perubahan (RFC), menilai risiko gangguan terhadap operasional bisnis, serta menjadwalkan deployment yang aman."
  },
  {
    id: 10,
    category: "Manajemen Layanan TI",
    question: "Metrik 'Mean Time to Repair' (MTTR) dalam pengelolaan sistem kejaksaan merepresentasikan...",
    options: [
      "Waktu rata-rata yang dibutuhkan untuk memperbaiki sistem kembali normal setelah terjadi insiden kegagalan",
      "Waktu rata-rata server menyala tanpa pernah mati",
      "Durasi pembuatan laporan angka kredit tahunan",
      "Banyaknya tiket kendala yang masuk per hari"
    ],
    correctIndex: 0,
    explanation: "MTTR (Mean Time to Repair) mengukur rata-rata waktu yang dihabiskan tim teknis untuk mendeteksi, memperbaiki, dan mengembalikan layanan yang down ke kondisi normal."
  },

  // --- KATEGORI 3: BASIS DATA & ARSITEKTUR SISTEM (11 - 16) ---
  {
    id: 11,
    category: "Basis Data & Sistem",
    question: "Teknik optimasi basis data relasional yang digunakan untuk mempercepat pencarian data pada kolom yang sering dijadikan kondisi WHERE tanpa melakukan full table scan adalah...",
    options: [
      "Database Normalization 3NF",
      "Indexing (misalnya B-Tree Index)",
      "Database Truncate",
      "Foreign Key Cascading"
    ],
    correctIndex: 1,
    explanation: "Indexing (seperti B-Tree atau Hash Index) membuat struktur data penunjuk khusus yang memungkinkan database engine menemukan record yang cocok jauh lebih cepat tanpa harus memindai seluruh baris tabel (full table scan)."
  },
  {
    id: 12,
    category: "Basis Data & Sistem",
    question: "Karakteristik transaksi database yang menjamin bahwa seluruh rangkaian perintah SQL berhasil dieksekusi bersama atau dibatalkan seutuhnya (all-or-nothing) dikenal dengan prinsip...",
    options: [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability"
    ],
    correctIndex: 0,
    explanation: "Atomicity (dalam prinsip ACID) memastikan bahwa seluruh operasi dalam suatu transaksi dianggap sebagai satu kesatuan tunggal: jika satu bagian gagal, seluruh transaksi di-rollback tanpa mengubah data."
  },
  {
    id: 13,
    category: "Basis Data & Sistem",
    question: "Kondisi di mana sebuah tabel berada pada bentuk normal ketiga (3NF) mensyaratkan...",
    options: [
      "Sudah memenuhi 2NF dan tidak memiliki ketergantungan transitif (non-key attribute bergantung pada non-key lain)",
      "Setiap kolom bernilai array atau tabel bersarang",
      "Semua kolom harus memiliki tipe data VARCHAR",
      "Tidak boleh ada relasi antar tabel"
    ],
    correctIndex: 0,
    explanation: "Bentuk Normal Ketiga (3NF) mensyaratkan tabel telah memenuhi 2NF dan menghilangkan 'Transitive Dependency', di mana setiap kolom non-primary key harus bergantung secara langsung hanya pada primary key."
  },
  {
    id: 14,
    category: "Basis Data & Sistem",
    question: "Kelebihan utama penggunaan arsitektur Microservices dibandingkan Monolithic pada sistem SPBE skala besar adalah...",
    options: [
      "Lebih mudah dideploy ke satu komputer laptop pribadi",
      "Skalabilitas modular independen, fault isolation (kegagalan satu modul tidak mematikan seluruh sistem), dan fleksibilitas teknologi",
      "Tidak memerlukan koneksi jaringan sama sekali",
      "Menghilangkan kebutuhan basis data"
    ],
    correctIndex: 1,
    explanation: "Microservices memecah aplikasi menjadi layanan-layanan independen yang dapat diskalakan dan di-deploy terpisah tanpa saling mengganggu ketersediaan layanan lainnya."
  },
  {
    id: 15,
    category: "Basis Data & Sistem",
    question: "Perintah SQL manakah yang paling tepat untuk menghitung jumlah total pegawai dan rata-rata Angka Kredit per satuan kerja?",
    options: [
      "SELECT satker, COUNT(*), AVG(ak) FROM pegawai GROUP BY satker;",
      "SELECT satker, SUM(ak) FROM pegawai WHERE satker IS NOT NULL;",
      "SELECT satker, ak FROM pegawai ORDER BY ak DESC;",
      "UPDATE pegawai SET ak = AVG(ak);"
    ],
    correctIndex: 0,
    explanation: "Fungsi agregasi COUNT(*) dan AVG(ak) yang dikombinasikan dengan klausa GROUP BY satker digunakan untuk mengelompokkan dan menghitung statistik per kategori."
  },
  {
    id: 16,
    category: "Basis Data & Sistem",
    question: "Teknik 'Database Sharding' pada sistem basis data data besar (Big Data) berarti...",
    options: [
      "Menghapus data lama secara permanen",
      "Memecah tabel database berukuran raksasa secara horizontal ke beberapa server fisik/node yang berbeda",
      "Mengompresi data menjadi file ZIP",
      "Mengganti seluruh query SQL menjadi file teks"
    ],
    correctIndex: 1,
    explanation: "Sharding adalah teknik partisi horizontal yang membagi baris data besar ke dalam beberapa database server independen untuk meningkatkan throughput dan performa penyimpanan."
  },

  // --- KATEGORI 4: KEAMANAN INFORMASI & KRIPTOGRAFI (17 - 21) ---
  {
    id: 17,
    category: "Keamanan Informasi",
    question: "Prinsip dasar keamanan informasi yang disingkat CIA Triad terdiri dari tiga elemen fundamental, yaitu...",
    options: [
      "Control, Inspection, Audit",
      "Confidentiality, Integrity, Availability",
      "Cryptography, Infrastructure, Authentication",
      "Consistency, Isolation, Atomicity"
    ],
    correctIndex: 1,
    explanation: "CIA Triad adalah fondasi standar keamanan informasi: Confidentiality (Kerahasiaan data), Integrity (Keutuhan data dari manipulasi), dan Availability (Ketersediaan data saat dibutuhkan)."
  },
  {
    id: 18,
    category: "Keamanan Informasi",
    question: "Serangan rekayasa sosial (Social Engineering) yang memanipulasi korban melalui email atau situs tiruan untuk mencuri kredensial login akun kedinasan disebut...",
    options: [
      "Phishing",
      "DDoS Attack",
      "SQL Injection",
      "Buffer Overflow"
    ],
    correctIndex: 0,
    explanation: "Phishing adalah teknik penipuan siber di mana penyerang menyamar sebagai institusi resmi guna memancing pengguna memasukkan username, password, atau token OTP."
  },
  {
    id: 19,
    category: "Keamanan Informasi",
    question: "Teknik pengamanan query aplikasi terhadap kerentanan SQL Injection yang paling direkomendasikan adalah...",
    options: [
      "Menggabungkan string input pengguna secara langsung ke dalam string query SQL",
      "Menggunakan Parameterized Queries / Prepared Statements",
      "Menonaktifkan firewall server",
      "Memberikan hak akses superuser (root/dba) pada user aplikasi"
    ],
    correctIndex: 1,
    explanation: "Prepared Statements / Parameterized Queries memisahkan logika query SQL dari data input pengguna, sehingga karakter berbahaya yang diinput pengguna tidak dieksekusi sebagai perintah SQL."
  },
  {
    id: 20,
    category: "Keamanan Informasi",
    question: "Dalam kriptografi kunci asimetris (Public-Key Cryptography) yang digunakan pada Tanda Tangan Elektronik (TTE) sertifikasi BSRE, pesan dienkripsi/ditandatangani dengan...",
    options: [
      "Private Key pemilik dan diverifikasi oleh penerima menggunakan Public Key",
      "Satu kunci rahasia yang sama untuk pengirim dan penerima",
      "Password akun email atasan",
      "Nomor Induk Pegawai (NIP)"
    ],
    correctIndex: 0,
    explanation: "Digital signature dibuat menggunakan Private Key milik penandatangan (yang dirahasiakan), dan keabsahannya dapat diverifikasi oleh publik menggunakan Public Key penandatangan."
  },
  {
    id: 21,
    category: "Keamanan Informasi",
    question: "Standar internasional Sistem Manajemen Keamanan Informasi (SMKI) yang wajib diadopsi oleh penyelenggara SPBE strategis adalah...",
    options: [
      "ISO 9001",
      "ISO 27001",
      "ISO 14001",
      "ISO 22000"
    ],
    correctIndex: 1,
    explanation: "ISO/IEC 27001 adalah standar internasional untuk Information Security Management Systems (ISMS) yang memberikan kerangka kerja perlindungan aset informasi secara komprehensif."
  },

  // --- KATEGORI 5: ANGKA KREDIT JABATAN FUNGSIONAL PRAKOM (22 - 26) ---
  {
    id: 22,
    category: "Angka Kredit Prakom",
    question: "Menurut PermenPAN-RB No. 32 Tahun 2020, jenjang jabatan fungsional Pranata Komputer Kategori Keahlian berturut-turut dari tingkat pertama hingga tertinggi adalah...",
    options: [
      "Prakom Terampil -> Mahir -> Penyelia",
      "Prakom Ahli Pertama -> Ahli Muda -> Ahli Madya -> Ahli Utama",
      "Operator -> Junior -> Senior -> Master",
      "Staff TI -> Kepala Seksi -> Asisten Direktur"
    ],
    correctIndex: 1,
    explanation: "Kategori Keahlian terdiri dari: Ahli Pertama (Gol. III/a-III/b), Ahli Muda (Gol. III/c-III/d), Ahli Madya (Gol. IV/a-IV/c), dan Ahli Utama (Gol. IV/d-IV/e)."
  },
  {
    id: 23,
    category: "Angka Kredit Prakom",
    question: "Menurut regulasi Jabatan Fungsional Pranata Komputer, bukti fisik yang sah untuk pengajuan butir kegiatan pengelolaan data atau pengembangan sistem informasi umumnya berupa...",
    options: [
      "Hanya foto selfie di depan komputer",
      "Laporan pelaksanaan tugas, dokumen spesifikasi teknis/query/source code, dan surat penugasan resmi pimpinan",
      "Struk belanja perangkat keras pribadi",
      "Screenshot status media sosial"
    ],
    correctIndex: 1,
    explanation: "Bukti fisik butir kegiatan Prakom wajib memuat surat tugas/SK, laporan hasil kegiatan yang ditandatangani atasan langsung, dokumentasi teknis (spesifikasi teknis, source code, data dictionary, dsb.)."
  },
  {
    id: 24,
    category: "Angka Kredit Prakom",
    question: "Berapa target Angka Kredit (AK) pemeliharaan minimal per tahun bagi pejabat fungsional Pranata Komputer jenjang Ahli Pertama?",
    options: [
      "5.0 Angka Kredit",
      "12.5 Angka Kredit",
      "25.0 Angka Kredit",
      "50.0 Angka Kredit"
    ],
    correctIndex: 1,
    explanation: "Berdasarkan regulasi konversi predikat kinerja (PermenPAN-RB No. 1/2023), target angka kredit tahunan jenjang Ahli Pertama adalah 12.5 AK per tahun (predikat Baik = 100% x 12.5 = 12.5 AK)."
  },
  {
    id: 25,
    category: "Angka Kredit Prakom",
    question: "Kegiatan 'Melakukan perancangan basis data terdistribusi atau arsitektur SPBE instansi' umumnya merupakan butir kegiatan jenjang...",
    options: [
      "Pranata Komputer Terampil",
      "Pranata Komputer Ahli Muda / Ahli Madya",
      "Petugas Keamanan Satker",
      "Admin Gudang"
    ],
    correctIndex: 1,
    explanation: "Perancangan arsitektur kompleks, pemodelan data terdistribusi, dan audit keamanan sistem merupakan butir kompetensi analisis tingkat lanjut yang berada pada jenjang Ahli Muda ke atas."
  },
  {
    id: 26,
    category: "Angka Kredit Prakom",
    question: "Dokumen penetapan resmi perolehan total angka kredit yang diterbitkan oleh Pejabat Pembina Kepegawaian (PPK) atau Tim Penilai disebut...",
    options: [
      "DUPAK (Daftar Usul Penetapan Angka Kredit)",
      "PAK (Penetapan Angka Kredit)",
      "SKP (Sasaran Kinerja Pegawai)",
      "KTP Pegawai"
    ],
    correctIndex: 1,
    explanation: "PAK (Penetapan Angka Kredit) adalah surat keputusan penetapan angka kredit resmi yang telah disetujui oleh Tim Penilai/PPK sebagai dasar kenaikan pangkat atau jabatan."
  }
]
