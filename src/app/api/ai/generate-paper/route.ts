import { NextRequest, NextResponse } from "next/server"
import { generateAiCompletion } from "@/lib/ai-provider"
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security"

export const dynamic = "force-dynamic"
export const maxDuration = 60

interface PaperDataInput {
  authorName?: string
  authorNip?: string
  authorSatker?: string
  authorRank?: string
  topicTitle?: string
  problemStatement?: string
  desiredOutcome?: string
  mentorName?: string
  coachName?: string
  examDate?: string
  batchName?: string
}

// Helper: Memisahkan nama tanpa gelar untuk Halaman Cover Dalam
function stripAcademicTitles(name: string): string {
  if (!name) return "NAMA LENGKAP"
  return name
    .replace(/,\s*(S\.Kom|S\.T|S\.Si|S\.H|M\.Kom|M\.T|M\.Cs|M\.Si|M\.H|A\.Md|A\.Md\.Kom|B\.Sc|M\.Sc|Ph\.D).*$/i, "")
    .trim()
}

// Mesin Analisis Domain Cerdas: Menganalisis topik secara semantik untuk menghasilkan narasi dinas Kejaksaan yang spesifik & mendalam
function analyzeTopicDomain(title: string, satker: string, problem: string) {
  const lower = `${title} ${problem}`.toLowerCase()

  if (lower.includes("tukin") || lower.includes("makan") || lower.includes("keuangan") || lower.includes("mantu") || lower.includes("gaji")) {
    return {
      subbag: "Subbagian Pembinaan (Urusan Keuangan & Kepegawaian)",
      focus: "tata kelola administrasi keuangan dan pencairan hak-hak pegawai",
      stakeholders: "bendahara pengeluaran, pengelola keuangan, dan seluruh aparatur satker",
      kegiatan1: "Analisis Kebutuhan SOP Pencairan dan Perancangan Skema Database Keuangan",
      kegiatan2: "Pengembangan Modul Update Status Bendahara & Tracking Timeline Mandiri Pegawai",
      kegiatan3: "Uji Coba Fungsionalitas Black-Box dan Validasi Keamanan Row Level Security (RLS)",
      kegiatan4: "Penyusunan User Manual Operasional dan Bimbingan Teknis kepada Aparatur Satker",
      kendalaTeknis: "Fluktuasi koneksi jaringan lokal satker dan keterbatasan akses server saat jam sibuk penginputan berkas.",
      solusiTeknis: "Penerapan arsitektur Server-Side Rendering (SSR), optimasi indexing query PostgreSQL, dan caching lokal pada peramban.",
      kendalaNonTeknis: "Kebiasaan pegawai menanyakan status berkas secara verbal langsung ke meja bendahara.",
      solusiNonTeknis: "Penyusunan lembar panduan visual satu halaman (one-page cheat sheet) dan sosialisasi berkala di apel pagi.",
      evidenceLink: `https://github.com/kejaksaan-ri/simantu-${satker.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    }
  }

  if (lower.includes("backup") || lower.includes("database") || lower.includes("server") || lower.includes("pemulihan") || lower.includes("replikasi")) {
    return {
      subbag: "Subbagian Pembinaan (Urusan Daskrimti & Pengelolaan Teknologi Informasi)",
      focus: "keamanan data, pencegahan kehilangan arsip perkara, dan mitigasi disaster recovery",
      stakeholders: "administrator sistem, operator CMS perkara, dan staf pengelola TIK",
      kegiatan1: "Identifikasi Kebutuhan Retensi Data dan Perancangan Skrip Otomatisasi Backup",
      kegiatan2: "Konfigurasi Crontab, Enkripsi AES-256, dan Sinkronisasi Replikasi ke Cloud/NAS",
      kegiatan3: "Simulasi Uji Coba Pemulihan Data (Disaster Recovery Drill) dan Audit Integritas Hash SHA-256",
      kegiatan4: "Penyusunan Dokumen SOP Pencadangan Data dan Sosialisasi Tanggap Darurat Sistem",
      kendalaTeknis: "Kapasitas penyimpanan storage lokal yang terbatas dan kecepatan transfer data saat backup harian.",
      solusiTeknis: "Penerapan metode incremental backup terkompresi GZIP dan penjadwalan otomatis di luar jam kerja (pukul 02:00 WIB).",
      kendalaNonTeknis: "Kurangnya kesadaran staf dalam pelaporan jika terjadi galat (error) pada sinkronisasi arsip.",
      solusiNonTeknis: "Pembuatan bot alert otomatis via Telegram/WhatsApp yang mengirimkan status backup sukses/gagal setiap pagi.",
      evidenceLink: `https://github.com/kejaksaan-ri/backup-ops-${satker.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    }
  }

  if (lower.includes("barang bukti") || lower.includes("bb") || lower.includes("tilang") || lower.includes("sidang") || lower.includes("perkara")) {
    return {
      subbag: "Seksi Pengelolaan Barang Bukti dan Barang Rampasan (PB3R) & Seksi Tindak Pidana Umum",
      focus: "transparansi informasi status barang bukti, jadwal persidangan, dan pelayanan prima kepada masyarakat",
      stakeholders: "petugas PB3R, jaksa penuntut umum, staf PTSP, dan masyarakat pemohon layanan",
      kegiatan1: "Analisis Alur Registrasi Perkara dan Perancangan Integrasi API Gateway Layanan",
      kegiatan2: "Pembuatan Modul Verifikasi Status Barang Bukti & Mesin Notifikasi Otomatis Terenkripsi",
      kegiatan3: "Pengujian Pengiriman Notifikasi, Uji Validitas Kode Token, dan User Acceptance Testing (UAT)",
      kegiatan4: "Penyusunan Standar Operasional Prosedur (SOP) Digital dan Sosialisasi Petugas PTSP",
      kendalaTeknis: "Nomor kontak masyarakat yang tidak valid atau pergantian nomor pemohon layanan.",
      solusiTeknis: "Menyediakan opsi pengecekan mandiri via portal web publik menggunakan nomor registrasi perkara.",
      kendalaNonTeknis: "Kepadatan jadwal persidangan jaksa yang menunda penginputan data putusan perkara.",
      solusiNonTeknis: "Menyederhanakan formulir input putusan menjadi form cepat (quick-entry form) yang ramah smartphone.",
      evidenceLink: `https://github.com/kejaksaan-ri/layanan-pb3r-${satker.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    }
  }

  // Default: General Information System / Digital Governance
  return {
    subbag: "Subbagian Pembinaan dan Unit Layanan Terpadu Satu Pintu (PTSP)",
    focus: "transformasi digital layanan perkantoran, akurasi data administrasi, dan penguatan indeks SPBE",
    stakeholders: "pimpinan satker, pejabat struktural, staf operasional, dan Pranata Komputer",
    kegiatan1: "Identifikasi Kebutuhan Pengguna, Analisis Alur Kerja SOP, dan Perancangan Arsitektur Basis Data",
    kegiatan2: "Pengembangan dan Pengkodean Modul Aplikasi Berbasis Web Responsif dengan Next.js & PostgreSQL",
    kegiatan3: "Pelaksanaan Pengujian Fungsionalitas Black-Box Testing dan User Acceptance Testing (UAT)",
    kegiatan4: "Penyusunan Dokumentasi Teknis, User Manual Operasional, dan Sosialisasi Penggunaan Sistem",
    kendalaTeknis: "Keterbatasan spesifikasi hardware pada sebagian workstation staf dan variasi peramban web.",
    solusiTeknis: "Mengoptimalkan performa antarmuka (clean CSS, kompresi aset, tanpa plugin berat) agar ringan diakses.",
    kendalaNonTeknis: "Resistensi awal sebagian aparatur terhadap perubahan alur kerja manual ke alur kerja berbasis web.",
    solusiNonTeknis: "Memberikan pendampingan teknis secara personal (one-on-one assistance) serta reward bagi unit pengguna tercepat.",
    evidenceLink: `https://github.com/kejaksaan-ri/sistem-inovasi-${satker.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  }
}

// Generator Cerdas & Presisi Sesuai Template Resmi PDF Laporan Lab Diklat Prakom Kejaksaan Agung RI - BPS
function generateStructuredPaperFallback(data: PaperDataInput): string {
  const fullName = data.authorName || "Dewa Sinar Surya, S.Kom."
  const nameWithoutTitle = stripAcademicTitles(fullName)
  const nip = data.authorNip || "200102052025051008"
  const rank = data.authorRank || "Pranata Komputer Ahli Pertama"
  const satker = data.authorSatker || "Kejaksaan Negeri Soppeng"
  const title = data.topicTitle || "Si Mantu (Sistem Monitoring Tunjangan Kinerja dan Uang Makan)"
  const problem = data.problemStatement || "Penyampaian informasi alur pencairan hak-hak pegawai di unit kerja masih manual sehingga menimbulkan tingginya interupsi kerja pada bendahara dan kurangnya transparansi alur berkas bagi pegawai"
  const outcome = data.desiredOutcome || "Terwujudnya tata kelola administrasi keuangan internal yang transparan, efisien, dan akuntabel melalui sistem monitoring mandiri secara real-time"
  const coach = data.coachName || "Coach Pembimbing, S.T., M.Kom."
  const mentor = data.mentorName || "Penguji Pelatihan, S.Kom., M.Si."
  const examDate = data.examDate || "Rabu, 30 September 2026"
  const batchName = data.batchName || "BATCH 02 ANGKATAN 05"

  const domain = analyzeTopicDomain(title, satker, problem)

  return `# LAPORAN LABORATORIUM PRANATA KOMPUTER
## PELATIHAN FUNGSIONAL PENGUATAN PRANATA KOMPUTER KATEGORI KEAHLIAN
### ${satker.toUpperCase()}

Kejaksaan Agung, 2026

---

# LAPORAN LABORATORIUM PRANATA KOMPUTER

**Oleh:**
**${nameWithoutTitle.toUpperCase()}**
NIP. ${nip}

**KEJAKSAAN AGUNG**
**BEKERJASAMA DENGAN BADAN PUSAT STATISTIK**
**PELATIHAN FUNGSIONAL PENGUATAN PRANATA KOMPUTER**
**KATEGORI KEAHLIAN ${batchName}**
**JAKARTA 2026**

---

# LEMBAR PENGESAHAN
## LAPORAN LABORATORIUM PRAKOM

| Identitas | Keterangan |
| :--- | :--- |
| **Nama** | ${fullName} |
| **NIP** | ${nip} |
| **Unit Kerja** | ${satker} |
| **Jabatan** | ${rank} |

Telah diuji di depan Tim Penguji
Pada hari ${examDate}

| Penguji, | Coach, |
| :--- | :--- |
| <br/><br/><br/>**${mentor}**<br/>NIP. 19820512 200801 1 003 | <br/><br/><br/>**${coach}**<br/>NIP. 19780315 200502 1 004 |

---

# KATA PENGANTAR

Puji dan syukur ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat, hidayah, dan karunia-Nya, sehingga Laporan Laboratorium Pranata Komputer Pelatihan Fungsional Penguatan Pranata Komputer Kategori Keahlian ini dapat diselesaikan dengan baik, sistematis, dan tepat waktu.

Laporan ini disusun sebagai bentuk pertanggungjawaban komprehensif atas pelaksanaan kegiatan praktikum laboratorium teknologi informasi di unit kerja ${satker}. Inovasi yang diusulkan dan diimplementasikan adalah rancang bangun **"${title}"**, yang secara spesifik dirancang untuk menyelesaikan akar permasalahan dalam ${domain.focus}.

Penulis menyampaikan rasa terima kasih dan penghargaan yang tulus kepada:
1. Pimpinan Kejaksaan Agung Republik Indonesia serta Badan Pusat Statistik (BPS) Republik Indonesia selaku penyelenggara kolaboratif Pelatihan Fungsional Penguatan Pranata Komputer Keahlian Tahun 2026.
2. Kepala ${satker} beserta seluruh jajaran pejabat struktural dan staf yang telah memberikan izin, bimbingan, arahan, serta dukungan penuh selama pelaksanaan laboratorium di unit kerja.
3. Bapak/Ibu Widyaiswara, Penguji, dan Coach (${coach}) yang senantiasa memberikan transfer pengetahuan, bimbingan metodologis, serta masukan konstruktif dalam penyempurnaan naskah laporan ini.
4. Seluruh rekan-rekan peserta Pelatihan Fungsional Pranata Komputer Kategori Keahlian ${batchName} atas kekompakan, pertukaran wawasan, dan semangat pengabdian bagi korps Adhyaksa.

Penulis menyadari bahwa laporan ini masih memiliki ruang penyempurnaan. Oleh karena itu, masukan, saran, dan kritik yang membangun senantiasa diharapkan demi penyempurnaan implementasi sistem informasi yang berkelanjutan di lingkungan Kejaksaan Republik Indonesia.

Jakarta, September 2026

**Penulis**

---

# DAFTAR ISI

- Lembar Judul .......................................................................... i
- Lembar Pengesahan .................................................................... ii
- Kata Pengantar ....................................................................... iii
- Daftar Isi ........................................................................... iv
- Daftar Tabel ......................................................................... v
- Daftar Gambar ........................................................................ vi
- Daftar Lampiran ...................................................................... vii

**BAB I. PENDAHULUAN** ................................................................. 1
- A. Latar Belakang .................................................................... 1
- B. Tujuan ............................................................................ 3
- C. Manfaat ........................................................................... 4

**BAB II. TELAAH MASALAH DAN RENCANA KEGIATAN TI** ...................................... 5
- A. Identifikasi dan Analisis Masalah/Isu TI ........................................... 5
- B. Deskripsi Solusi/ Kegiatan/ Inovasi/ Pembaharuan ................................... 7
- C. Pemetaan Kompetensi Prakom ........................................................ 9
- D. Penjadwalan ....................................................................... 11

**BAB III. HASIL KEGIATAN DAN BUKTI KEGIATAN** .......................................... 13
- A. Pelaksanaan dan Hasil Kegiatan Prakom ............................................. 13
- B. Dampak Hasil Kegiatan ............................................................. 16

**BAB IV. KENDALA DAN RENCANA TINDAK LANJUT** ........................................... 18
- A. Kendala ........................................................................... 18
- B. Rencana Tindak Lanjut ............................................................. 19

**LAMPIRAN**
- SKP Tahunan .......................................................................... 20
- Lampiran Bukti Fisik Kegiatan Prakom ................................................. 21

---

# DAFTAR TABEL

- Tabel 2.1. Pemetaan Rencana Kegiatan TI dengan Butir Kompetensi Pranata Komputer (Perka BPS No. 2/2021)
- Tabel 2.2. Jadwal Pelaksanaan Kegiatan Laboratorium Pranata Komputer (Gantt Chart 4 Minggu / 20 Hari Kerja)
- Tabel 3.1. Rekapitulasi Pelaksanaan Tahapan dan Bukti Fisik Output Kegiatan
- Tabel 4.1. Pemetaan Kendala Teknis dan Solusi Mitigasi Jangka Pendek

---

# DAFTAR GAMBAR

- Gambar 2.1. Struktur Tata Kelola dan Hubungan Kerja Satuan Kerja
- Gambar 2.2. Diagram Alir Proses Bisnis Sistem Informasi Eksisting (As-Is) vs Target Inovasi (To-Be)
- Gambar 3.1. Tampilan Tangkapan Layar (Screenshot) Antarmuka Modul Aplikasi Hasil Implementasi

---

# DAFTAR LAMPIRAN

- Lampiran SKP Tahunan
- Lampiran 1. Bukti Fisik Kegiatan 1: Dokumen Analisis Kebutuhan Sistem Informasi
- Lampiran 2. Bukti Fisik Kegiatan 2: Dokumen Desain Basis Data & Arsitektur Relasi
- Lampiran 3. Bukti Fisik Kegiatan 3: Source Code Modul Aplikasi & Skrip Keamanan
- Lampiran 4. Bukti Fisik Kegiatan 4: Laporan Uji Coba Black-Box & Berita Acara UAT
- Lampiran 5. Bukti Fisik Kegiatan 5: User Manual & Dokumentasi Sosialisasi Satker
- Lampiran 6. Formulir Bukti Dukung per Kegiatan Pranata Komputer Keahlian

---

# BAB I. PENDAHULUAN

### A. Latar Belakang

${satker} merupakan unit kerja teknis di bawah naungan Kejaksaan Republik Indonesia yang menjalankan kekuasaan negara di bidang penuntutan serta kewenangan lain berdasarkan peraturan perundang-undangan di wilayah hukumnya. Untuk mewujudkan penegakan hukum yang prima, modern, dan akuntabel, ${satker} ditopang oleh tata kelola manajemen internal yang tertib dan berorientasi pada pelayanan masyarakat serta keterbukaan informasi publik, khususnya pada ${domain.subbag}.

Dalam struktur organisasi, pengelolaan teknologi informasi (TI) memegang peranan krusial untuk mendukung digitalisasi birokrasi dan otomatisasi alur kerja perkantoran. Pranata Komputer memiliki kedudukan strategis dalam merancang, mengembangkan, mengimplementasikan, serta memelihara sistem informasi guna mengoptimalkan proses kerja antarbidang dan meningkatkan efisiensi pelayanan internal pegawai maupun masyarakat.

Kondisi infrastruktur dan pemanfaatan TI di ${satker} saat ini telah didukung jaringan lokal (LAN), akses internet memadai, serta pemanfaatan aplikasi persuratan dan administrasi perkara terpusat dari Kejaksaan Agung RI. Namun, pemanfaatan sistem informasi khusus untuk memantau dan mengotomasi alur kerja operasional internal masih terbatas. Salah satu proses yang masih berjalan secara manual adalah:

${problem}.

Keterbatasan mekanisme ini menimbulkan isu strategis dalam operasional harian:
• **Tingginya Intensitas Interupsi Komunikasi:** Aparatur kerap melakukan konfirmasi secara verbal berulang kali, baik datang langsung maupun melalui pesan instan, yang memecah konsentrasi staf dan menyita waktu kerja substantif.
• **Kurangnya Transparansi Alur Proses:** Pegawai dan para pihak tidak memiliki akses langsung untuk melihat posisi berkas secara real-time mulai dari tahapan verifikasi awal hingga persetujuan akhir.
• **Keterlambatan Penanganan Kendala:** Jika terjadi penolakan atau perbaikan berkas, informasi kendala tersebut lambat tersampaikan sehingga menghambat kelancaran proses kerja kantor.

Guna mengatasi persoalan tersebut, dibutuhkan solusi digital terintegrasi berupa pengembangan inovasi **"${title}"**. Melalui aplikasi ini, pengguna dapat memantau progres tahapan secara mandiri (*self-service*), sementara penanggung jawab bertindak sebagai administrator yang memperbarui data secara terpusat. Pembangunan sistem ini sejalan dengan tugas pokok dan fungsi Pranata Komputer dalam menyediakan solusi perangkat lunak yang menjawab kebutuhan riil unit kerja serta mendorong implementasi Sistem Pemerintahan Berbasis Elektronik (SPBE).

### B. Tujuan

Penyelenggaraan kegiatan laboratorium Pranata Komputer ini memiliki tujuan yang terbagi menjadi:

#### 1. Tujuan Umum
Mewujudkan tata kelola administrasi internal yang transparan, efektif, efisien, dan akuntabel di lingkungan ${satker} melalui pemanfaatan teknologi informasi dan transformasi digital layanan kedinasan.

#### 2. Tujuan Khusus (Output)
1. Merancang dan membangun aplikasi **"${title}"** berbasis sistem informasi yang aman dan responsif.
2. Menyediakan dasbor pelacakan status mandiri (*self-service timeline view*) yang dapat diakses secara real-time.
3. Menyediakan modul administrasi bagi petugas pengelola untuk memperbarui tahapan dan status pemrosesan berkas secara cepat dan akurat.
4. Melakukan pengujian fungsionalitas sistem secara terstruktur (*Black-box testing*) dan uji penerimaan pengguna (*User Acceptance Testing* / UAT).
5. Menyusun dokumentasi teknis dan buku panduan operasional (*user manual*) aplikasi bagi pengguna dan administrator.

### C. Manfaat

Pelaksanaan kegiatan laboratorium dan implementasi inovasi **"${title}"** diharapkan memberikan manfaat signifikan bagi berbagai pihak:

#### 1. Manfaat bagi Pegawai (Pengguna Layanan)
• **Transparansi Informasi:** Memperoleh kepastian dan keterbukaan informasi mengenai posisi serta progres tahapan secara real-time.
• **Efisiensi Waktu:** Mengakses informasi secara mandiri (*self-service*) tanpa harus datang langsung atau mengirim pesan berulang kepada staf pengelola.
• **Kenyamanan Layanan:** Mengetahui kendala atau kekurangan berkas lebih awal sehingga proses perbaikan dapat dilakukan dengan cepat.

#### 2. Manfaat bagi Administrator / Pengelola
• **Pengurangan Beban Komunikasi Berulang:** Meminimalisir interupsi pertanyaan harian terkait status berkas kerja.
• **Diseminasi Informasi Terpusat:** Memudahkan penyampaian status pengajuan secara serentak, terstruktur, dan akurat.
• **Peningkatan Efektivitas Kerja:** Mengoptimalkan alokasi waktu dan fokus kerja staf pada tugas-tugas penatausahaan substantif dan penyusunan laporan.

#### 3. Manfaat bagi Satuan Kerja (${satker})
• **Modernisasi Tata Kelola Internal:** Mewujudkan tata kelola administrasi perkantoran yang akuntabel, transparan, dan modern.
• **Akselerasi SPBE:** Mendukung implementasi Sistem Pemerintahan Berbasis Elektronik (SPBE) dan digitalisasi birokrasi di lingkungan kejaksaan.
• **Peningkatan Budaya Kerja:** Menciptakan iklim kerja yang lebih kondusif, produktif, dan harmonis melalui keterbukaan arus data antarbidang.

#### 4. Manfaat bagi Pranata Komputer (Pengembang)
• **Penerapan Kompetensi Teknis:** Mengaplikasikan keahlian rancang bangun perangkat lunak dan manajemen basis data dalam menyelesaikan permasalahan riil di unit kerja.
• **Peningkatan Kinerja Individu:** Memberikan kontribusi nyata berupa inovasi teknologi informasi yang tercatat sebagai output kinerja Pranata Komputer.

---

# BAB II. TELAAH MASALAH DAN RENCANA KEGIATAN TI

### A. Identifikasi dan Analisis Masalah/Isu TI

#### 1. Kondisi yang Terjadi Saat Ini
Penyampaian informasi dan pemantauan berkas kerja di ${satker} saat ini masih dilakukan secara konvensional. Setiap siklus kerja melewati tahapan administratif berjenjang:
1. Rekapitulasi berkas masuk dan verifikasi administratif oleh staf seksi terkait.
2. Pembuatan daftar nominatif dan validasi kelengkapan dokumen pendukung.
3. Pengajuan berkas ke pejabat penatausaha dan pimpinan satker.
4. Penerbitan disposisi persetujuan atau surat perintah pemrosesan.
5. Eksekusi akhir alur layanan dan pencatatan dalam buku register manual.

Pada praktiknya, pihak pemohon tidak memiliki media untuk memantau sudah sampai mana tahapan berkas tersebut diproses. Akibatnya, pemohon sering mendatangi langsung ruangan staf, menelepon, atau mengirimkan pesan instan secara berulang hanya untuk menanyakan estimasi waktu penyelesaian berkas.

#### 2. Penyebab Masalah (Root Causes)
Berdasarkan hasil telaah mendalam, akar permasalahan meliputi:
• **Ketiadaan Sistem Pemantauan Mandiri (*Self-Service*):** Belum tersedianya aplikasi internal berbasis web/digital yang dapat diakses mandiri oleh pengguna untuk mengecek status pemrosesan berkas.
• **Sentralisasi Data yang Terisolasi:** Pembaruan status berkas hanya diketahui oleh operator atau pejabat pemeriksa tanpa adanya kanal diseminasi informasi otomatis atau terpusat.
• **Ketergantungan Komunikasi Verbal:** Mekanisme konfirmasi masih mengandalkan komunikasi orang ke orang (*one-on-one*), yang sangat tidak efisien untuk unit kerja dengan mobilitas tinggi.

#### 3. Dampak terhadap Pelaksanaan Pekerjaan
Kondisi ini menimbulkan dampak negatif pada operasional kerja, antara lain:
• **Terganggunya Produktivitas Staf Pengelola:** Waktu kerja kerap terdistraksi oleh interupsi pertanyaan berulang sehingga mengganggu konsentrasi dalam penyusunan pembukuan, laporan pertanggungjawaban, dan administrasi perkara.
• **Ketidakpastian dan Kesimpangsiuran Informasi:** Munculnya spekulasi atau ketidakjelasan di kalangan pegawai terkait kapan berkas akan rampung.
• **Keterlambatan Penanganan Kendala:** Jika terjadi penolakan atau perbaikan berkas di tingkat verifikasi, informasi kendala tersebut lambat sampai ke pihak yang bersangkutan.

### B. Deskripsi Solusi/Kegiatan/Inovasi/Pembaharuan

Sebagai solusi atas permasalahan tersebut, dirancang dan dibangun aplikasi berbasis web **"${title}"** dengan memanfaatkan arsitektur teknologi modern:
• **Next.js (React Framework):** Digunakan pada lapisan antarmuka (*frontend*) dan *server-side logic* guna menghadirkan akses web yang cepat, responsif di perangkat desktop maupun smartphone, serta struktur komponen modular.
• **PostgreSQL & Supabase BaaS:** Digunakan sebagai basis data relasional yang dilengkapi sistem autentikasi aman serta penerapan *Row Level Security* (RLS) untuk mengontrol hak akses data antara administrator dan pegawai.

Rencana kegiatan TI dijabarkan ke dalam 4 (empat) tahapan utama:

#### 1. Kegiatan 1: ${domain.kegiatan1}
• **Deskripsi:** Mengidentifikasi kebutuhan fungsional pengguna (administrator dan pegawai), menyusun diagram alir data (*DFD/Use Case*), merancang skema relasi tabel basis data (*Entity Relationship Diagram*) pada PostgreSQL, serta mendesain antarmuka pengguna (*UI/UX mockup*) yang responsif.
• **Inovasi:** Mengubah alur administrasi yang kompleks menjadi indikator tahapan progres visual yang mudah dipahami (*visual timeline progress*).

#### 2. Kegiatan 2: ${domain.kegiatan2}
• **Deskripsi:** Membangun aplikasi menggunakan Next.js (App Router/Server Actions) yang terhubung ke Supabase Client:
  - Modul Administrator: Formulir pembaruan status pemrosesan secara berkala (*real-time*), manajemen periode berkas, dan fitur pencatatan kendala berkas.
  - Modul Pengguna: Dasbor pelacakan status mandiri (*self-service timeline view*) tanpa perlu login berbelit.
  - Implementasi Keamanan: Penerapan kebijakan *Row Level Security* (RLS) pada tabel basis data untuk membatasi hak manipulasi data hanya bagi akun administrator yang sah.
• **Inovasi:** Pemanfaatan arsitektur serverless database dan Server-Side Rendering (SSR) yang menjamin performa tinggi, efisiensi bandwidth satker, dan keamanan akses data.

#### 3. Kegiatan 3: ${domain.kegiatan3}
• **Deskripsi:** Melakukan pengujian fungsionalitas (*Black-box Testing*) terhadap modul pelacakan dan autentikasi, menguji aturan keamanan RLS, serta melaksanakan *User Acceptance Testing* (UAT) bersama pengelola administrasi dan perwakilan aparatur ${satker}.
• **Inovasi:** Menjamin sistem bebas dari galat (*bug free*), aman dari manipulasi data, dan sesuai dengan alur kerja kedinasan riil.

#### 4. Kegiatan 4: ${domain.kegiatan4}
• **Deskripsi:** Menyusun buku petunjuk operasional (*User Manual*) untuk administrator dan pengguna, mendokumentasikan skema arsitektur basis data, serta melaksanakan sosialisasi penggunaan aplikasi sebelum diterapkan penuh (*deployment*).
• **Inovasi:** Menyediakan standarisasi panduan digital dan knowledge transfer terstruktur untuk menjaga keberlanjutan pemanfaatan sistem informasi.

### C. Pemetaan Kompetensi Prakom

Rangkaian kegiatan TI dipetakan ke dalam butir kegiatan Jabatan Fungsional Pranata Komputer berdasarkan **Peraturan Badan Pusat Statistik Nomor 2 Tahun 2021** tentang Petunjuk Teknis Penilaian Angka Kredit Jabatan Fungsional Pranata Komputer:

#### Tabel 2.1. Pemetaan Rencana Kegiatan TI dengan Butir Kompetensi Pranata Komputer (Perka BPS No. 2/2021)

| No. | Rencana Kegiatan TI | Unsur / Sub-Unsur | Butir Kegiatan yang Relevan (Perka BPS No. 2/2021) | Bukti Fisik / Output |
| :---: | :--- | :--- | :--- | :--- |
| 1. | Identifikasi alur SOP dan analisis kebutuhan sistem informasi | Sistem Informasi dan Multimedia / Sistem Informasi | Melakukan analisis kebutuhan sistem informasi | Dokumen Analisis Kebutuhan Sistem Informasi |
| 2. | Perancangan struktur data relasional PostgreSQL di Supabase | Infrastruktur TI / Manajemen Data | Membuat rancangan basis data | Dokumen Desain Basis Data (ERD, Kamus Data, Skema Relasi) |
| 3. | Pemodelan alur kerja, diagram alir, dan desain UI/UX responsif | Sistem Informasi dan Multimedia / Sistem Informasi | Membuat perancangan sistem informasi | Dokumen Desain Sistem (DFD/Use Case, Mockup UI/UX) |
| 4. | Penulisan kode program frontend dan backend menggunakan Next.js | Sistem Informasi dan Multimedia / Sistem Informasi | Membuat program aplikasi sistem informasi | Source Code Program & Modul Aplikasi Inovasi |
| 5. | Penerapan keamanan basis data melalui Row Level Security (RLS) | Infrastruktur TI / Manajemen Data | Menerapkan kebijakan keamanan basis data | Dokumen Konfigurasi Keamanan & Skrip RLS Policy |
| 6. | Pengujian fungsionalitas sistem (Black-box) dan kelayakan pengguna (UAT) | Sistem Informasi dan Multimedia / Sistem Informasi | Melakukan uji coba program aplikasi sistem informasi | Laporan Hasil Uji Coba (Test Case Sheet & Berita Acara UAT) |
| 7. | Penyusunan panduan pengoperasian aplikasi untuk admin dan pengguna | Sistem Informasi dan Multimedia / Sistem Informasi | Membuat petunjuk operasional program aplikasi sistem informasi | Dokumen Buku Petunjuk Operasional (User Manual) |
| 8. | Sosialisasi dan penerapan aplikasi di lingkungan ${satker} | Tata Kelola dan Tata Laksana TI / Layanan TI | Melakukan sosialisasi / penerapan sistem informasi | Laporan Sosialisasi, Daftar Hadir, & Dokumentasi Implementasi |

### D. Penjadwalan

Pelaksanaan kegiatan pengembangan dan implementasi aplikasi dijadwalkan secara intensif selama 20 (dua puluh) hari kerja yang terbagi ke dalam 4 (empat) minggu kerja:

#### Tabel 2.2. Jadwal Pelaksanaan Kegiatan Laboratorium Pranata Komputer (Gantt Chart 4 Minggu / 20 Hari Kerja)

| No. | Rincian Tahapan Kegiatan | Minggu I (Hari 1–5) | Minggu II (Hari 6–10) | Minggu III (Hari 11–15) | Minggu IV (Hari 16–20) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **1** | **Tahap Analisis dan Perancangan Sistem** | | | | |
| 1.1 | Wawancara alur SOP pemrosesan berkas & inventarisasi kebutuhan sistem | ✔ | | | |
| 1.2 | Perancangan arsitektur basis data relasional PostgreSQL di Supabase | ✔ | | | |
| 1.3 | Perancangan diagram alir data (DFD/Use Case) & perancangan Mockup UI/UX | ✔ | | | |
| **2** | **Tahap Pengembangan Sistem (Next.js & Supabase)** | | | | |
| 2.1 | Inisialisasi project Next.js, konfigurasi Supabase Auth & RLS Policy | | ✔ | | |
| 2.2 | Pembuatan Modul Administrator (fitur input & update status berkas) | | ✔ | ✔ | |
| 2.3 | Pembuatan Modul Tracking Mandiri Pegawai (Timeline View interaktif) | | | ✔ | |
| 2.4 | Integrasi Server Actions, API Route, dan sinkronisasi data real-time | | | ✔ | |
| **3** | **Tahap Pengujian dan Evaluasi (Testing)** | | | | |
| 3.1 | Pengujian fungsionalitas sistem secara menyeluruh (*Black-box testing*) | | | | ✔ |
| 3.2 | Pengujian validasi hak akses dan keamanan basis data (*RLS Policy Testing*) | | | | ✔ |
| 3.3 | Uji coba penerimaan pengguna (*UAT*) dan perbaikan galat (*bug fixing*) | | | | ✔ |
| **4** | **Tahap Dokumentasi dan Implementasi** | | | | |
| 4.1 | Penyusunan buku petunjuk operasional (*User Manual & Admin Guide*) | | | | ✔ |
| 4.2 | Sosialisasi penggunaan aplikasi kepada seluruh aparatur ${satker} | | | | ✔ |
| 4.3 | Deployment sistem ke environment production & serah terima sistem | | | | ✔ |

---

# BAB III. HASIL KEGIATAN DAN BUKTI KEGIATAN

### A. Pelaksanaan dan Hasil Kegiatan Prakom

Seluruh tahapan kegiatan laboratorium telah diselesaikan sesuai target waktu dan menghasilkan output bukti fisik yang dapat dipertanggungjawabkan:

#### 1. Kegiatan 1: ${domain.kegiatan1}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada Minggu I (Hari ke-1 s.d. 5). Peserta mengumpulkan informasi melalui wawancara dan observasi terhadap SOP yang berjalan di ${domain.subbag}, memetakan entitas data, menyusun spesifikasi kebutuhan sistem informasi, serta membuat diagram relasi tabel dan purwarupa tampilan antarmuka.
• **Waktu Pelaksanaan:** Hari ke-1 s.d. Hari ke-5.
• **Proses & Output:** Tersusunnya Dokumen Analisis Kebutuhan Sistem Informasi dan Dokumen Desain Basis Data (ERD, Kamus Data, dan Mockup UI/UX).
• **Bukti Fisik:** Dokumen Desain Sistem Informasi, Skema ERD PostgreSQL, notulensi wawancara analisis alur berkas (terlampir pada Lampiran 1 & 2).

#### 2. Kegiatan 2: ${domain.kegiatan2}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada Minggu II dan III (Hari ke-6 s.d. 15). Peserta melakukan penulisan kode program modular menggunakan framework Next.js dengan koneksi database PostgreSQL Supabase. Modul yang dibangun mencakup halaman login terenkripsi, formulir input berkas bagi admin, komponen timeline progres bagi pengguna, serta penerapan aturan Row Level Security.
• **Waktu Pelaksanaan:** Hari ke-6 s.d. Hari ke-15.
• **Proses & Output:** Aplikasi berbasis web yang dapat dijalankan secara lancar di peramban komputer dan perangkat mobile, dengan fungsionalitas pembaruan data secara real-time.
• **Bukti Fisik:** Source code program aplikasi, repositori git proyek, skrip query SQL pembentukan tabel dan security policy (terlampir pada Lampiran 3).

#### 3. Kegiatan 3: ${domain.kegiatan3}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada awal Minggu IV (Hari ke-16 s.d. 18). Dilakukan pengujian fungsionalitas (*Black-box Testing*) untuk memastikan setiap form validasi dan alur logika bekerja tanpa error. Pengujian dilanjutkan dengan simulasi User Acceptance Testing (UAT) bersama penanggung jawab operasional di ${satker}.
• **Waktu Pelaksanaan:** Hari ke-16 s.d. Hari ke-18.
• **Proses & Output:** Laporan hasil pengujian fungsionalitas dengan persentase keberhasilan 100% pada 14 butir skenario uji dan terselesaikannya Berita Acara UAT.
• **Bukti Fisik:** Lembar Test Case Sheet Black-Box dan Dokumen Berita Acara UAT bertandatangan penguji dan perwakilan pengguna (terlampir pada Lampiran 4).

#### 4. Kegiatan 4: ${domain.kegiatan4}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada akhir Minggu IV (Hari ke-18 s.d. 20). Peserta menyusun buku panduan pengguna (*User Manual*) yang dilengkapi petunjuk bergambar. Selanjutnya, dilakukan demonstrasi dan sosialisasi kepada jajaran pegawai ${satker} guna mengedukasi tata cara pelacakan berkas secara mandiri.
• **Waktu Pelaksanaan:** Hari ke-18 s.d. Hari ke-20.
• **Proses & Output:** Tersusunnya buku petunjuk digital format PDF dan terlaksananya sesi sosialisasi kepada aparatur kantor.
• **Bukti Fisik:** Buku Petunjuk Operasional (User Manual), daftar hadir peserta sosialisasi, notulensi sesi tanya jawab, dan dokumentasi foto kegiatan (terlampir pada Lampiran 5).

### B. Dampak Hasil Kegiatan

Implementasi inovasi **"${title}"** di lingkungan ${satker} memberikan dampak positif nyata:
1. **Peningkatan Transparansi Pelayanan:** Pegawai memperoleh kepastian informasi mengenai tahapan berkas secara real-time dan terbuka tanpa perlu bertanya berulang.
2. **Efisiensi Waktu dan Beban Kerja Staf:** Intensitas interupsi pertanyaan kepada staf berkurang hingga 85%, sehingga staf dapat fokus menuntaskan pembukuan dan administrasi substantif.
3. **Penyampaian Kendala Berkas Lebih Terukur:** Apabila berkas membutuhkan perbaikan atau kelengkapan tambahan, keterangan kendala langsung tercatat pada sistem dan segera dilengkapi oleh pemohon.
4. **Peningkatan Kesiapan SPBE Satuan Kerja:** Menjadi bukti konkret kontribusi Pranata Komputer dalam memodernisasi layanan birokrasi Kejaksaan RI sesuai standar digitalisasi nasional.

---

# BAB IV. KENDALA DAN RENCANA TINDAK LANJUT

### A. Kendala

Dalam pelaksanaan kegiatan laboratorium di unit kerja, terdapat beberapa kendala yang dihadapi:
1. **Kendala Teknis:** ${domain.kendalaTeknis}
   - *Solusi Jangka Pendek:* ${domain.solusiTeknis}
2. **Kendala Non-Teknis:** ${domain.kendalaNonTeknis}
   - *Solusi Jangka Pendek:* ${domain.solusiNonTeknis}

### B. Rencana Tindak Lanjut

Guna menjaga keberlanjutan dan pengembangan sistem di masa mendatang, direncanakan langkah tindak lanjut:
1. **Pemeliharaan dan Pencadangan Rutin:** Melakukan monitoring log server secara berkala dan menjalankan pencadangan data otomatis (*automated cron backup*) harian terenkripsi ke media penyimpanan sekunder.
2. **Integrasi WhatsApp Gateway API:** Menghubungkan sistem dengan nomor WhatsApp dinas resmi satker agar notifikasi perubahan status berkas dapat terkirim otomatis ke nomor handphone pegawai.
3. **Bimbingan Teknis Berkelanjutan:** Melakukan sesi pengenalan aplikasi secara berkala bagi pegawai baru atau aparatur yang baru mengalami mutasi tugas ke ${satker}.
4. **Penyusunan Usulan Replikasi ke Kejaksaan Agung:** Menyusun laporan efektivitas sistem untuk diajukan ke Pusdaskrimti Kejaksaan Agung RI sebagai model percontohan yang dapat direplikasi di satuan kerja lain.

---

# LAMPIRAN

### 1. SKP Tahunan
(Lampirkan Sasaran Kinerja Pegawai tahun berjalan yang telah diverifikasi oleh atasan langsung)

### 2. Bukti Kegiatan Laboratorium
- Lampiran 1: Dokumen Analisis Kebutuhan Sistem Informasi
- Lampiran 2: Dokumen Desain Basis Data & Skema Relasi
- Lampiran 3: Source Code Modul Program & Skrip RLS Policy
- Lampiran 4: Laporan Hasil Uji Coba Black-Box & Berita Acara UAT
- Lampiran 5: Buku Petunjuk Pengoperasian (User Manual) & Foto Sosialisasi Satker

---

# FORMULIR BUKTI DUKUNG KEGIATAN

### BUKTI KEGIATAN PRANATA KOMPUTER KEAHLIAN
**Halaman : 1 dari 1**

| Kolom Identitas | Uraian | Kolom Identitas | Uraian |
| :--- | :--- | :--- | :--- |
| **Nama PPK** | ${fullName} | **Tanggal** | ${examDate} |
| **NIP** | ${nip} | **Lokasi Pekerjaan** | ${satker} |
| **Pangkat/Golongan** | Penata Muda (III/a) | **Kategori IKU** | Kinerja Utama TI |
| **Jenjang Jabatan** | ${rank} | **Rencana Hasil Kerja** | Terwujudnya Sistem Informasi Manajemen Administrasi Satker |

**Indikator Kinerja Individu :** Persentase keberhasilan pembangunan dan penerapan sistem informasi di unit kerja.
**Nama Kegiatan :** Implementasi dan Pengembangan ${title} pada ${satker}.

**Item Bukti Kegiatan :**
1. Dokumen Analisis Kebutuhan Sistem Informasi
2. Dokumen Perancangan Basis Data dan Desain Sistem
3. Source Code Program Aplikasi dan Skrip Keamanan Basis Data
4. Laporan Hasil Uji Coba Black-Box dan Berita Acara UAT
5. Buku Petunjuk Pengoperasian (User Manual) dan Laporan Sosialisasi Satker

**KETERANGAN :**
Tautan Berkas Digital (*Evidence Repository*): \`${domain.evidenceLink}\`

| Mengetahui,<br/>Atasan langsung PPK | ${satker.replace(/^(Kejaksaan Negeri|Kejaksaan Tinggi|Cabang Kejaksaan Negeri)\s+/i, '')}, September 2026<br/>Pejabat Pranata Komputer |
| :---: | :---: |
| <br/><br/><br/>**KEPALA SUBBAGIAN PEMBINAAN**<br/>NIP. 19800101 200501 1 002 | <br/><br/><br/>**${fullName}**<br/>NIP. ${nip} |
`
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)
    const rateLimit = checkRateLimit(clientIp, "paper_generate", 10, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan generate laporan. Silakan tunggu ${rateLimit.retryAfter} detik.` },
        { status: 429 }
      )
    }

    const body: PaperDataInput = await req.json()
    const {
      authorName,
      authorNip,
      authorSatker,
      authorRank,
      topicTitle,
      problemStatement,
      desiredOutcome,
      mentorName,
      coachName,
      examDate,
      batchName,
    } = body

    const cleanTitle = sanitizeInput(topicTitle, 250)
    const cleanSatker = sanitizeInput(authorSatker, 150)
    const cleanName = sanitizeInput(authorName, 120) || "Dewa Sinar Surya, S.Kom."
    const cleanNip = sanitizeInput(authorNip, 50) || "200102052025051008"
    const cleanRank = sanitizeInput(authorRank, 100) || "Pranata Komputer Ahli Pertama"
    const cleanProblem =
      sanitizeInput(problemStatement, 600) ||
      "Penyampaian informasi pencairan tunjangan masih manual sehingga menimbulkan tingginya interupsi kerja pada bendahara dan kurangnya transparansi alur pencairan bagi pegawai"
    const cleanOutcome =
      sanitizeInput(desiredOutcome, 600) ||
      "Terwujudnya tata kelola administrasi keuangan internal yang transparan, efisien, dan akuntabel melalui sistem monitoring mandiri secara real-time"
    const cleanMentor = sanitizeInput(mentorName, 100) || "Penguji Pelatihan, S.Kom., M.Si."
    const cleanCoach = sanitizeInput(coachName, 100) || "Coach Pembimbing, S.T., M.Kom."
    const cleanDate = sanitizeInput(examDate, 50) || "Rabu, 30 September 2026"
    const cleanBatch = sanitizeInput(batchName, 80) || "BATCH 02 ANGKATAN 05"

    if (!cleanTitle || !cleanSatker) {
      return NextResponse.json({ error: "Judul inovasi dan nama satker wajib diisi." }, { status: 400 })
    }

    const sanitizedData: PaperDataInput = {
      authorName: cleanName,
      authorNip: cleanNip,
      authorSatker: cleanSatker,
      authorRank: cleanRank,
      topicTitle: cleanTitle,
      problemStatement: cleanProblem,
      desiredOutcome: cleanOutcome,
      mentorName: cleanMentor,
      coachName: cleanCoach,
      examDate: cleanDate,
      batchName: cleanBatch,
    }

    const domain = analyzeTopicDomain(cleanTitle, cleanSatker, cleanProblem)

    const systemPrompt = `Anda adalah Widyaiswara Senior & Penilai Utama Pelatihan Fungsional Penguatan Pranata Komputer Kategori Keahlian Kejaksaan Agung RI bekerjasama dengan Pusdiklat Badan Pusat Statistik (BPS) RI.

Tugas Anda adalah menghasilkan naskah "LAPORAN LABORATORIUM PRANATA KOMPUTER" yang SANGAT PINTAR, MATANG, FORMAL KEDINASAN KEJAKSAAN, DAN PERSIS 100% SESUAI TEMPLATE PDF RESMI.

PANDUAN KECERDASAN & KUALITAS TEKNIS TINGGI:
1. KONTEKS KEDINASAN KEJAKSAAN:
   - Hubungkan inovasi dengan unit kerja: ${domain.subbag}.
   - Kaitkan dengan tugas penegakan hukum prima, akuntabilitas birokrasi, transparansi publik, dan Sistem Pemerintahan Berbasis Elektronik (SPBE).
2. ARSITEKTUR TEKNOLOGI MODERN:
   - Gunakan teknologi nyata: Next.js (App Router, Server Actions), PostgreSQL Supabase, Tailwind CSS, Row Level Security (RLS), REST API, dan automated backup.
3. 8 BUTIR KEGIATAN PERATURAN BPS NO. 2 TAHUN 2021:
   - Buat TABEL MARKDOWN lengkap dengan kolom: No. | Rencana Kegiatan TI | Unsur / Sub-Unsur | Butir Kegiatan yang Relevan (Perka BPS No. 2/2021) | Bukti Fisik / Output.
4. GANTT CHART JADWAL (4 MINGGU / 20 HARI KERJA):
   - Buat TABEL MARKDOWN dengan kolom: No. | Rincian Tahapan Kegiatan | Minggu I (Hari 1–5) | Minggu II (Hari 6–10) | Minggu III (Hari 11–15) | Minggu IV (Hari 16–20) dengan tanda centang (✔).
5. STRUKTUR BAB PERSIS TEMPLATE:
   - Cover Luar & Cover Dalam (Nama tanpa gelar)
   - Lembar Pengesahan (Penguji & Coach)
   - Kata Pengantar, Daftar Isi, Daftar Tabel, Daftar Gambar, Daftar Lampiran
   - BAB I. PENDAHULUAN (A. Latar Belakang, B. Tujuan [1. Umum, 2. Khusus], C. Manfaat [1. Pegawai, 2. Admin, 3. Satker, 4. Prakom])
   - BAB II. TELAAH MASALAH DAN RENCANA KEGIATAN TI (A. Kondisi, Akar Masalah, Dampak; B. Deskripsi Solusi minimal 4 kegiatan dg Deskripsi & Inovasi; C. Tabel Pemetaan BPS No. 2/2021; D. Tabel Gantt Chart)
   - BAB III. HASIL KEGIATAN DAN BUKTI KEGIATAN (A. Capaian Kegiatan 1 s.d. 4 proses, waktu, output, bukti fisik; B. Dampak Hasil Kegiatan)
   - BAB IV. KENDALA DAN RENCANA TINDAK LANJUT (A. Kendala Teknis & Non-Teknis + Solusi Jangka Pendek; B. Rencana Tindak Lanjut & Integrasi Satu Data Kejaksaan)
   - LAMPIRAN: SKP & FORMULIR BUKTI DUKUNG KEGIATAN PRANATA KOMPUTER KEAHLIAN.

DILARANG MEMOTONG KONTEN. Tulis lengkap, presisi, dan elegan dalam Markdown formal.`

    const userPrompt = `TULISKAN LAPORAN LABORATORIUM PRANATA KOMPUTER LENGKAP PERSIS SESUAI TEMPLATE:
- Nama Lengkap (dengan gelar): ${cleanName}
- NIP: ${cleanNip}
- Jenjang Jabatan: ${cleanRank}
- Satuan Kerja: ${cleanSatker}
- Inovasi Proyek Lab: "${cleanTitle}"
- Isu/Masalah TI Riil di Satker: "${cleanProblem}"
- Hasil/Dampak Diharapkan: "${cleanOutcome}"
- Nama Coach: ${cleanCoach}
- Nama Penguji: ${cleanMentor}
- Tanggal Uji Seminar: ${cleanDate}
- Batch / Angkatan: ${cleanBatch}
- Bidang/Subbag Terkait: ${domain.subbag}

SUSUN LENGKAP SEMUA BAGIAN DARI COVER LUAR/DALAM, LEMBAR PENGESAHAN, KATA PENGANTAR, DAFTAR ISI, BAB I, BAB II (DENGAN TABEL BPS & TABEL GANTT CHART), BAB III, BAB IV, DAN LAMPIRAN FORMULIR BUKTI DUKUNG.`

    try {
      const result = await generateAiCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.35,
        max_tokens: 4000,
        timeoutMs: 30000, // Memberikan waktu 30 detik untuk menghasilkan dokumen komprehensif
        mustIncludeKeyPhrases: ["LAPORAN LABORATORIUM", "LEMBAR PENGESAHAN", "BAB I", "BAB II", "BAB III", "BAB IV"],
      })

      if (result.text && result.text.length > 1200) {
        let finalPaper = result.text.trim()

        // Verifikasi kelengkapan naskah (BAB I, BAB II, BAB III, BAB IV, dan Lembar Pengesahan)
        const hasBab1 = /BAB\s*(I\b|1\b)|PENDAHULUAN/i.test(finalPaper)
        const hasBab2 = /BAB\s*(II\b|2\b)|TELAAH\s*MASALAH/i.test(finalPaper)
        const hasBab3 = /BAB\s*(III\b|3\b)|HASIL\s*KEGIATAN/i.test(finalPaper)
        const hasBab4 = /BAB\s*(IV\b|4\b)|KENDALA/i.test(finalPaper)
        const hasPengesahan = /LEMBAR\s*PENGESAHAN/i.test(finalPaper)

        if (!hasBab1 || !hasBab2 || !hasBab3 || !hasBab4 || !hasPengesahan) {
          finalPaper = generateStructuredPaperFallback(sanitizedData)
        }

        return NextResponse.json({
          paper: finalPaper,
          model: result.model,
          provider: result.provider,
          authorSatker: cleanSatker,
          topicTitle: cleanTitle,
        })
      }
    } catch (err: any) {
      console.warn("AI Generation fallback triggered:", err?.message || err)
    }

    // Bulletproof Fallback: Generate perfectly structured official Lab Report locally
    const fallbackPaper = generateStructuredPaperFallback(sanitizedData)
    return NextResponse.json({
      paper: fallbackPaper,
      model: "lab-report-builder-v2026-pro",
      provider: "fallback",
      authorSatker: cleanSatker,
      topicTitle: cleanTitle,
    })
  } catch (err: any) {
    console.error("Lab Report Generator Fatal Error:", err)
    const fallbackPaper = generateStructuredPaperFallback({})
    return NextResponse.json({
      paper: fallbackPaper,
      model: "lab-report-builder-v2026-pro",
      provider: "fallback",
    })
  }
}
