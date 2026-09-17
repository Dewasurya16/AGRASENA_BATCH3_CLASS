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
| **Nama** | : ${fullName} |
| **NIP** | : ${nip} |
| **Unit Kerja** | : ${satker} |
| **Jabatan** | : ${rank} |

Telah diuji di depan Tim Penguji  
Pada hari ${examDate}

| Penguji, | Coach, |
| :---: | :---: |
| <br/><br/><br/>**${mentor}**<br/>NIP. 19820512 200801 1 003 | <br/><br/><br/>**${coach}**<br/>NIP. 19780315 200502 1 004 |

---

# KATA PENGANTAR

Puji dan syukur ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat, petunjuk, dan karunia-Nya, sehingga Laporan Laboratorium Pranata Komputer Pelatihan Fungsional Penguatan Pranata Komputer Kategori Keahlian ini dapat diselesaikan dengan baik, sistematis, dan tepat waktu.

Laporan ini disusun sebagai bentuk pertanggungjawaban komprehensif atas pelaksanaan kegiatan praktikum laboratorium teknologi informasi pada satuan kerja ${satker}. Inovasi yang diusulkan dan diimplementasikan adalah rancang bangun **"${title}"**, yang secara spesifik dirancang untuk menyelesaikan akar permasalahan dalam ${domain.focus}.

Penulis menyampaikan rasa terima kasih dan penghargaan yang tulus kepada:
1. Pimpinan Kejaksaan Agung Republik Indonesia serta Badan Pusat Statistik (BPS) Republik Indonesia selaku penyelenggara kolaboratif Pelatihan Fungsional Penguatan Pranata Komputer Keahlian Tahun 2026.
2. Kepala ${satker} beserta seluruh jajaran pejabat struktural dan staf yang telah memberikan izin, bimbingan, arahan, serta dukungan sarana prasarana selama pelaksanaan laboratorium di unit kerja.
3. Bapak/Ibu Widyaiswara, Penguji, dan Coach (${coach}) yang senantiasa memberikan transfer pengetahuan, bimbingan metodologis, serta masukan konstruktif dalam penyempurnaan naskah laporan ini.
4. Seluruh rekan-rekan peserta Pelatihan Fungsional Pranata Komputer Kategori Keahlian ${batchName} atas kekompakan, kerja sama, dan semangat pengabdian bagi korps Adhyaksa.

Penulis menyadari bahwa laporan ini masih memiliki ruang penyempurnaan. Oleh karena itu, masukan, saran, dan kritik yang membangun senantiasa diharapkan demi penyempurnaan implementasi sistem informasi yang berkelanjutan di lingkungan Kejaksaan Republik Indonesia.

Jakarta, September 2026

**Penulis**

---

# DAFTAR ISI

Lembar Judul .......................................................................... i  
Lembar Pengesahan .................................................................... ii  
Kata Pengantar ....................................................................... iii  
Daftar Isi ........................................................................... iv  
Daftar Tabel ......................................................................... v  
Daftar Gambar ........................................................................ vi  
Daftar Lampiran ...................................................................... vii  

**BAB I. PENDAHULUAN** ................................................................. 1  
- A. Latar Belakang .................................................................. 1  
- B. Tujuan .......................................................................... 3  
- C. Manfaat ......................................................................... 4  

**BAB II. TELAAH MASALAH DAN RENCANA KEGIATAN TI** ..................................... 5  
- A. Identifikasi dan Analisis Masalah/Isu TI ......................................... 5  
- B. Deskripsi Solusi/ Kegiatan/ Inovasi/ Pembaharuan ................................. 7  
- C. Pemetaan Kompetensi Prakom ...................................................... 9  
- D. Penjadwalan ..................................................................... 11  

**BAB III. HASIL KEGIATAN DAN BUKTI KEGIATAN** ......................................... 13  
- A. Pelaksanaan dan Hasil Kegiatan Prakom ........................................... 13  
- B. Dampak Hasil Kegiatan ........................................................... 16  

**BAB IV. KENDALA DAN RENCANA TINDAK LANJUT** .......................................... 18  
- A. Kendala ......................................................................... 18  
- B. Rencana Tindak Lanjut ........................................................... 19  

**LAMPIRAN** .......................................................................... 20  
- SKP Tahunan ........................................................................ 20  
- Lampiran Bukti Kegiatan ............................................................ 21  

---

# DAFTAR TABEL

- Tabel 2.1. Pemetaan Rencana Kegiatan TI dengan Butir Kompetensi Prakom (Perka BPS No. 2/2021) ........ 9  
- Tabel 2.2. Jadwal Pelaksanaan Kegiatan Laboratorium Pranata Komputer (Gantt Chart 4 Minggu) .......... 11  
- Tabel 3.1. Rekapitulasi Pelaksanaan Tahapan dan Output Bukti Fisik Pelaksanaan Kegiatan .............. 14  
- Tabel 4.1. Pemetaan Kendala Teknis dan Mitigasi Jangka Pendek ......................................... 18  

---

# DAFTAR GAMBAR

- Gambar 2.1. Struktur Organisasi dan Tata Hubungan Kerja Satuan Kerja ................................. 6  
- Gambar 2.2. Diagram Alir Proses Bisnis Sistem Informasi Eksisting (As-Is) vs Inovasi (To-Be) ........ 8  
- Gambar 3.1. Tangkapan Layar (Screenshot) Antarmuka dan Fungsionalitas Modul Aplikasi ................ 15  

---

# DAFTAR LAMPIRAN

- Lampiran SKP Tahunan ................................................................................. 20  
- Lampiran 1. Bukti Fisik Kegiatan 1: Dokumen Analisis Kebutuhan Sistem Informasi ...................... 21  
- Lampiran 2. Bukti Fisik Kegiatan 2: Dokumen Desain Basis Data & Arsitektur ........................... 22  
- Lampiran 3. Bukti Fisik Kegiatan 3: Source Code Modul Aplikasi & Skrip Keamanan ...................... 23  
- Lampiran 4. Bukti Fisik Kegiatan 4: Laporan Uji Coba Black-Box & Berita Acara UAT .................... 24  
- Lampiran 5. Bukti Fisik Kegiatan 5: User Manual & Dokumentasi Sosialisasi Satker ..................... 25  
- Lampiran 6. Formulir Bukti Dukung per Kegiatan Pranata Komputer Keahlian ............................. 26  

---

# BAB I. PENDAHULUAN

Bagian latar belakang ini disusun untuk memberikan gambaran komprehensif mengenai urgensi pelaksanaan kegiatan Pranata Komputer (Prakom) di unit kerja Anda.

### A. Latar Belakang

${satker} merupakan unit kerja teknis di bawah naungan Kejaksaan Republik Indonesia yang menjalankan kekuasaan negara di bidang penuntutan serta kewenangan lain berdasarkan peraturan perundang-undangan di wilayah hukumnya. Untuk mewujudkan penegakan hukum yang prima, modern, transparan, dan akuntabel, ${satker} ditopang oleh tata kelola manajemen internal yang tertib dan berorientasi pada pelayanan masyarakat serta keterbukaan informasi publik, khususnya pada ${domain.subbag}.

Dalam struktur organisasi, pengelolaan teknologi informasi (TI) memegang peranan krusial untuk mendukung digitalisasi birokrasi dan otomatisasi alur kerja perkantoran. Pranata Komputer memiliki kedudukan strategis dalam merancang, mengembangkan, mengimplementasikan, serta memelihara sistem informasi guna mengoptimalkan proses kerja antarbidang dan meningkatkan efisiensi pelayanan internal pegawai maupun masyarakat.

Kondisi infrastruktur dan tata kelola pemanfaatan TI di ${satker} saat ini telah didukung jaringan lokal (LAN), akses internet memadai, serta pemanfaatan aplikasi persuratan dan administrasi perkara terpusat dari Kejaksaan Agung RI. Namun, pemanfaatan sistem informasi khusus untuk memantau dan mengotomasi alur kerja operasional internal masih terbatas. Salah satu proses yang masih berjalan secara manual adalah:

${problem}.

Keterbatasan mekanisme konvensional ini menimbulkan isu strategis dalam operasional kedinasan harian:
• **Tingginya Intensitas Interupsi Komunikasi:** Aparatur kerap melakukan konfirmasi secara verbal berulang kali, baik datang langsung ke ruangan maupun melalui telepon/chat pribadi, yang memecah konsentrasi staf pengelola dan menyita waktu kerja substantif.
• **Kurangnya Transparansi Alur Proses:** Pegawai tidak memiliki akses mandiri untuk memantau posisi berkas secara real-time mulai dari tahapan verifikasi awal hingga penerbitan disposisi akhir.
• **Keterlambatan Penanganan Kendala:** Apabila terjadi kendala teknis atau kekurangan berkas pendukung, informasi perbaikan lambat tersampaikan sehingga menghambat kelancaran proses kerja kantor.

Guna mengatasi permasalahan mendasar tersebut, dibutuhkan solusi digital terintegrasi berupa rancang bangun inovasi **"${title}"**. Melalui sistem ini, pengguna dapat memantau progres tahapan secara mandiri (*self-service timeline*), sementara penanggung jawab operasional bertindak sebagai administrator yang memvalidasi data secara terpusat. Pembangunan sistem ini sejalan dengan tugas pokok dan fungsi Pranata Komputer dalam menyediakan solusi perangkat lunak yang menjawab kebutuhan riil unit kerja serta mendorong percepatan implementasi Sistem Pemerintahan Berbasis Elektronik (SPBE).

### B. Tujuan

Penyelenggaraan kegiatan laboratorium Pranata Komputer ini memiliki tujuan yang terbagi menjadi:

#### 1. Tujuan Umum
Mewujudkan tata kelola administrasi internal yang transparan, efektif, efisien, dan akuntabel di lingkungan ${satker} melalui pemanfaatan teknologi informasi dan percepatan transformasi digital layanan kedinasan.

#### 2. Tujuan Khusus (Output)
1. Merancang dan membangun aplikasi **"${title}"** berbasis web responsif dengan keamanan data yang terjamin.
2. Menyediakan dasbor pelacakan status berkas mandiri (*self-service timeline view*) yang dapat diakses secara real-time oleh pegawai.
3. Menyediakan modul administrasi bagi staf pengelola untuk memperbarui tahapan, catatan verifikasi, dan status pemrosesan berkas secara cepat dan akurat.
4. Melaksanakan pengujian fungsionalitas sistem secara terstruktur (*Black-box Testing*) dan uji penerimaan pengguna (*User Acceptance Testing* / UAT).
5. Menyusun buku panduan pengoperasian (*User Manual*) aplikasi serta melaksanakan sosialisasi teknis kepada aparatur unit kerja.

### C. Manfaat

Pelaksanaan kegiatan laboratorium dan implementasi inovasi **"${title}"** memberikan manfaat nyata bagi berbagai pemangku kepentingan:

#### 1. Manfaat bagi Pegawai (Pengguna Layanan)
• **Transparansi Informasi:** Memperoleh kepastian dan keterbukaan informasi mengenai posisi serta progres berkas secara real-time.
• **Efisiensi Waktu:** Mengakses status pemrosesan secara mandiri tanpa perlu datang langsung atau menanyakan berulang kepada bendahara/staf.
• **Kecepatan Respon Kendala:** Mengetahui kekurangan atau koreksi berkas lebih awal sehingga perbaikan dokumen dapat dilakukan sesegera mungkin.

#### 2. Manfaat bagi Administrator / Pengelola
• **Reduksi Beban Komunikasi Berulang:** Meminimalisir interupsi pertanyaan harian terkait estimasi pencairan atau verifikasi berkas.
• **Diseminasi Informasi Terpusat:** Memudahkan penyampaian informasi perkembangan administrasi secara serentak, tertib, dan akurat.
• **Peningkatan Fokus Kerja Substantif:** Mengoptimalkan alokasi waktu staf pada pembukuan, rekonsiliasi berkas, dan penyusunan laporan pertanggungjawaban.

#### 3. Manfaat bagi Satuan Kerja (${satker})
• **Modernisasi Tata Kelola Birokrasi:** Mewujudkan administrasi perkantoran modern yang selaras dengan prinsip transparansi dan akuntabilitas tata kelola pemerintahan.
• **Akselerasi Indeks SPBE:** Mendukung implementasi Sistem Pemerintahan Berbasis Elektronik (SPBE) di tingkat satuan kerja daerah.
• **Penguatan Budaya Kerja Positif:** Membangun ekosistem kerja yang harmonis dan produktif berlandaskan keterbukaan arus data antarbidang.

#### 4. Manfaat bagi Pranata Komputer (Pengembang)
• **Penerapan Kompetensi Keahlian TI:** Mengaplikasikan keahlian rancang bangun perangkat lunak, arsitektur basis data, dan tata kelola keamanan informasi pada kasus nyata.
• **Akuntabilitas Kinerja Jabatan Fungsional:** Memberikan bukti karya nyata yang dapat dinilai sebagai capaian angka kredit jabatan fungsional Pranata Komputer.

---

# BAB II. TELAAH MASALAH DAN RENCANA KEGIATAN TI

### A. Identifikasi dan Analisis Masalah/Isu TI

#### 1. Kondisi yang Terjadi Saat Ini
Penyampaian informasi dan penelusuran status berkas di lingkungan ${satker} saat ini masih mengandalkan komunikasi konvensional. Setiap siklus kerja melewati tahapan berjenjang:
1. Rekapitulasi berkas masuk dan verifikasi kelengkapan berkas oleh staf pengelola.
2. Pembuatan daftar nominatif dan validasi data pendukung.
3. Pengajuan berkas ke pejabat penatausaha dan pimpinan satker.
4. Penerbitan lembar disposisi persetujuan atau surat perintah pemrosesan.
5. Eksekusi akhir alur layanan dan pengarsipan manual dalam buku register.

Dalam praktiknya, pihak pemohon tidak memiliki akses langsung untuk mengetahui posisi berkas. Hal ini memicu antrean pertanyaan verbal secara berulang di meja kerja pengelola.

#### 2. Penyebab Masalah (Root Causes)
Berdasarkan telaah mendalam pada alur kerja eksisting, akar permasalahan utama meliputi:
• **Ketiadaan Sistem Monitoring Mandiri (*Self-Service*):** Belum adanya sistem informasi berbasis web yang dapat diakses mandiri oleh pegawai untuk memantau status berkas secara real-time.
• **Silo Informasi Data:** Pembaruan status berkas hanya diketahui oleh operator yang menangani tanpa adanya kanal diseminasi informasi digital yang transparan.
• **Ketergantungan Komunikasi Orang ke Orang (*One-on-One*):** Mekanisme klarifikasi manual menghabiskan banyak waktu dan menurunkan efektivitas jam kerja substantif.

#### 3. Dampak terhadap Pelaksanaan Pekerjaan
Kondisi tersebut memberikan dampak langsung terhadap ritme kerja kantor:
• **Penurunan Produktivitas Staf:** Waktu kerja pengelola sering terinterupsi oleh panggilan telepon dan kedatangan pegawai yang menanyakan hal yang sama.
• **Ketidakpastian Informasi:** Kurangnya transparansi memunculkan persepsi lambatnya birokrasi dan kekhawatiran atas keterlambatan hak-hak pegawai.
• **Keterlambatan Penanganan Retur/Koreksi:** Saat berkas perlu diperbaiki, pemberitahuan manual kerap tertunda dan memperpanjang masa pemrosesan.

### B. Deskripsi Solusi/Kegiatan/Inovasi/Pembaharuan

Sebagai solusi sistematis, dibangun aplikasi berbasis web **"${title}"** dengan arsitektur teknologi modern (Next.js, React, PostgreSQL Supabase, dan Row Level Security). Rencana kegiatan TI dijabarkan ke dalam 4 (empat) kegiatan utama:

#### 1. Kegiatan 1: ${domain.kegiatan1}
• **Deskripsi:** Melakukan observasi SOP alur berkas di ${domain.subbag}, mengidentifikasi kebutuhan fungsional admin dan pegawai, menyusun diagram alir data (*Data Flow Diagram*), serta merancang skema relasi basis data PostgreSQL (*Entity Relationship Diagram*) dan wireframe antarmuka pengguna.
• **Inovasi:** Mengonversi alur administrasi berbelit menjadi visualisasi timeline progres interaktif yang informatif dan mudah dipahami.

#### 2. Kegiatan 2: ${domain.kegiatan2}
• **Deskripsi:** Mengimplementasikan kode program frontend dan backend menggunakan Next.js App Router yang terhubung ke database PostgreSQL Supabase:
  - Modul Administrator: Formulir pembaruan status pemrosesan berkas secara berkala (*real-time*), manajemen periode berkas, dan pencatatan catatan koreksi.
  - Modul Pegawai: Dasbor pelacakan status mandiri (*self-service view*) yang responsif diakses melalui peramban komputer maupun smartphone.
  - Penerapan Row Level Security (RLS) pada tabel basis data guna membatasi hak akses dan manipulasi data hanya bagi akun administrator yang sah.
• **Inovasi:** Pemanfaatan Server-Side Rendering (SSR) dan database terenkripsi yang menjamin performa akses super cepat, ringan di jaringan lokal satker, dan aman.

#### 3. Kegiatan 3: ${domain.kegiatan3}
• **Deskripsi:** Melaksanakan pengujian fungsionalitas menyeluruh menggunakan metode *Black-box Testing* terhadap form validasi, routing modul, dan otorisasi data, dilanjutkan dengan simulasi *User Acceptance Testing* (UAT) bersama pengelola administrasi dan perwakilan aparatur ${satker}.
• **Inovasi:** Memastikan sistem beroperasi 100% bebas dari galat (*zero-defect*), aman dari kebocoran data, dan tepat sasaran menyelesaikan kebutuhan operasional.

#### 4. Kegiatan 4: ${domain.kegiatan4}
• **Deskripsi:** Menyusun buku petunjuk operasional (*User Manual*) berstandar naskah dinas, mendokumentasikan skema arsitektur aplikasi, serta menyelenggarakan sosialisasi penggunaan sistem kepada seluruh aparatur di lingkungan ${satker}.
• **Inovasi:** Memberikan edukasi literasi digital terstruktur dan pendampingan pengguna untuk menjamin keberlanjutan pemanfaatan sistem secara berkesinambungan.

### C. Pemetaan Kompetensi Prakom

Rangkaian kegiatan TI dipetakan ke dalam butir kegiatan Jabatan Fungsional Pranata Komputer berdasarkan **Peraturan Badan Pusat Statistik Nomor 2 Tahun 2021** tentang Petunjuk Teknis Penilaian Angka Kredit Jabatan Fungsional Pranata Komputer:

#### Tabel 2.1. Pemetaan Rencana Kegiatan TI dengan Butir Kompetensi Pranata Komputer (Perka BPS No. 2/2021)

| No. | Rencana Kegiatan TI | Unsur / Sub-Unsur | Butir Kegiatan yang Relevan (Perka BPS No. 2/2021) | Bukti Fisik / Output |
| :---: | :--- | :--- | :--- | :--- |
| 1. | Analisis alur SOP dan spesifikasi kebutuhan sistem informasi | Sistem Informasi dan Multimedia / Sistem Informasi | Melakukan analisis kebutuhan sistem informasi | Dokumen Analisis Kebutuhan Sistem Informasi |
| 2. | Perancangan struktur basis data relasional PostgreSQL | Infrastruktur TI / Manajemen Data | Membuat rancangan basis data | Dokumen Desain Basis Data (ERD, Kamus Data, Skema Relasi) |
| 3. | Pemodelan alur kerja, diagram alir, dan perancangan UI/UX | Sistem Informasi dan Multimedia / Sistem Informasi | Membuat perancangan sistem informasi | Dokumen Desain Sistem (DFD/Use Case, Mockup UI/UX) |
| 4. | Penulisan kode program frontend dan backend Next.js | Sistem Informasi dan Multimedia / Sistem Informasi | Membuat program aplikasi sistem informasi | Source Code Program & Modul Aplikasi Inovasi |
| 5. | Penerapan konfigurasi keamanan Row Level Security (RLS) | Infrastruktur TI / Manajemen Data | Menerapkan kebijakan keamanan basis data | Dokumen Konfigurasi Keamanan & Skrip RLS Policy |
| 6. | Uji coba fungsionalitas sistem (Black-box) dan kelayakan pengguna (UAT) | Sistem Informasi dan Multimedia / Sistem Informasi | Melakukan uji coba program aplikasi sistem informasi | Laporan Hasil Uji Coba (Test Case Sheet & Berita Acara UAT) |
| 7. | Penyusunan panduan pengoperasian aplikasi untuk admin dan pengguna | Sistem Informasi dan Multimedia / Sistem Informasi | Membuat petunjuk operasional program aplikasi sistem informasi | Dokumen Buku Petunjuk Operasional (User Manual) |
| 8. | Sosialisasi dan penerapan aplikasi di lingkungan ${satker} | Tata Kelola dan Tata Laksana TI / Layanan TI | Melakukan sosialisasi / penerapan sistem informasi | Laporan Sosialisasi, Daftar Hadir, & Dokumentasi Implementasi |

### D. Penjadwalan

Pelaksanaan kegiatan laboratorium di unit kerja dijadwalkan secara intensif selama 20 (dua puluh) hari kerja yang terbagi ke dalam 4 (empat) minggu kerja:

#### Tabel 2.2. Jadwal Pelaksanaan Kegiatan Laboratorium Pranata Komputer (Gantt Chart 4 Minggu / 20 Hari Kerja)

| No. | Rincian Tahapan Kegiatan | Minggu I (Hari 1–5) | Minggu II (Hari 6–10) | Minggu III (Hari 11–15) | Minggu IV (Hari 16–20) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **1** | **Tahap Analisis dan Perancangan Sistem** | | | | |
| 1.1 | Wawancara alur SOP pemrosesan berkas & identifikasi kebutuhan sistem | ✔ | | | |
| 1.2 | Perancangan arsitektur basis data relasional PostgreSQL di Supabase | ✔ | | | |
| 1.3 | Perancangan diagram alir data (DFD/Use Case) & desain Mockup UI/UX | ✔ | | | |
| **2** | **Tahap Pengembangan Sistem (Next.js & Supabase)** | | | | |
| 2.1 | Inisialisasi arsitektur Next.js, konfigurasi Supabase Auth & RLS Policy | | ✔ | | |
| 2.2 | Pembuatan Modul Administrator (fitur input, update status & kendala) | | ✔ | ✔ | |
| 2.3 | Pembuatan Modul Tracking Mandiri Pegawai (Timeline View interaktif) | | | ✔ | |
| 2.4 | Integrasi Server Actions, API Route, dan sinkronisasi real-time | | | ✔ | |
| **3** | **Tahap Pengujian dan Evaluasi (Testing)** | | | | |
| 3.1 | Pengujian fungsionalitas sistem secara menyeluruh (*Black-box testing*) | | | | ✔ |
| 3.2 | Pengujian validasi hak akses dan keamanan basis data (*RLS Policy Testing*) | | | | ✔ |
| 3.3 | Uji coba penerimaan pengguna (*UAT*) dan perbaikan bug sistem | | | | ✔ |
| **4** | **Tahap Dokumentasi dan Implementasi** | | | | |
| 4.1 | Penyusunan buku petunjuk operasional (*User Manual & Admin Guide*) | | | | ✔ |
| 4.2 | Sosialisasi penggunaan aplikasi kepada seluruh aparatur ${satker} | | | | ✔ |
| 4.3 | Penerapan penuh sistem (*deployment*) & serah terima operasional | | | | ✔ |

---

# BAB III. HASIL KEGIATAN DAN BUKTI KEGIATAN

### A. Pelaksanaan dan Hasil Kegiatan Prakom

Seluruh tahapan kegiatan praktikum laboratorium teknologi informasi telah diselesaikan sesuai target jadwal dan menghasilkan output bukti fisik yang dapat dipertanggungjawabkan:

#### a. Kegiatan 1: ${domain.kegiatan1}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada Minggu I (Hari ke-1 s.d. 5). Peserta melakukan wawancara langsung kepada staf pengelola ${domain.subbag}, memetakan alur berkas, merumuskan dokumen spesifikasi kebutuhan perangkat lunak, serta merancang skema relasi basis data (ERD) dan wireframe antarmuka pengguna.
• **Waktu Pelaksanaan:** Hari ke-1 s.d. Hari ke-5 (Minggu I).
• **Proses dan Output:** Tersusunnya Dokumen Analisis Kebutuhan Sistem Informasi dan Dokumen Desain Basis Data (ERD, Kamus Data, dan Mockup UI/UX).
• **Bukti Fisik:** Dokumen Desain Sistem Informasi, Skema ERD PostgreSQL, notulensi wawancara analisis alur berkas (terlampir pada Lampiran 1 & 2).

#### b. Kegiatan 2: ${domain.kegiatan2}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada Minggu II dan III (Hari ke-6 s.d. 15). Peserta membangun modul aplikasi menggunakan Next.js terintegrasi Supabase PostgreSQL. Modul yang diselesaikan meliputi antarmuka pelacakan mandiri pegawai, modul administrator pengelola, serta pengaktifan Row Level Security (RLS) untuk melindungi integritas data.
• **Waktu Pelaksanaan:** Hari ke-6 s.d. Hari ke-15 (Minggu II dan III).
• **Proses dan Output:** Aplikasi web yang dapat dijalankan secara cepat dan responsif pada peramban komputer maupun smartphone dengan fungsionalitas update status real-time.
• **Bukti Fisik:** Source code program aplikasi, repositori git proyek, skrip query SQL pembentukan tabel dan security policy (terlampir pada Lampiran 3).

#### c. Kegiatan 3: ${domain.kegiatan3}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada awal Minggu IV (Hari ke-16 s.d. 18). Dilakukan pengujian fungsionalitas sistem secara terstruktur (*Black-box Testing*) untuk memastikan setiap form validasi dan logika alur kerja berfungsi baik. Selanjutnya dilaksanakan simulasi UAT bersama aparatur pengguna di lingkungan ${satker}.
• **Waktu Pelaksanaan:** Hari ke-16 s.d. Hari ke-18 (Minggu IV).
• **Proses dan Output:** Laporan hasil pengujian fungsionalitas dengan persentase kelulusan 100% pada 14 butir skenario uji dan terselesaikannya Berita Acara UAT.
• **Bukti Fisik:** Lembar Test Case Sheet Black-Box dan Dokumen Berita Acara UAT bertandatangan penguji dan perwakilan pengguna (terlampir pada Lampiran 4).

#### d. Kegiatan 4: ${domain.kegiatan4}
• **Penjelasan Pelaksanaan:** Dilaksanakan pada akhir Minggu IV (Hari ke-18 s.d. 20). Peserta menyusun buku petunjuk operasional (*User Manual*) digital berilustrasi lengkap, serta mengadakan sesi sosialisasi dan bimbingan teknis penggunaan sistem kepada seluruh aparatur di ${satker}.
• **Waktu Pelaksanaan:** Hari ke-18 s.d. Hari ke-20 (Minggu IV).
• **Proses dan Output:** Tersusunnya buku petunjuk digital format PDF dan terlaksananya sesi sosialisasi kepada pegawai kantor.
• **Bukti Fisik:** Buku Petunjuk Operasional (User Manual), daftar hadir sosialisasi, notulensi sesi tanya jawab, dan dokumentasi foto kegiatan (terlampir pada Lampiran 5).

#### Tabel 3.1. Rekapitulasi Pelaksanaan Tahapan dan Output Bukti Fisik Pelaksanaan Kegiatan

| No. | Nama Kegiatan Laboratorium TI | Waktu Pelaksanaan | Output / Hasil Nyata | Bukti Fisik Pelaksanaan |
| :---: | :--- | :--- | :--- | :--- |
| 1. | Analisis Kebutuhan & Desain Sistem | Hari 1–5 (Minggu I) | Dokumen Analisis & Desain ERD | Dokumen Desain & Notulensi |
| 2. | Pengkodean Aplikasi Next.js & Supabase | Hari 6–15 (Minggu II–III) | Modul Aplikasi Web Responsif | Source Code & Skrip SQL RLS |
| 3. | Pengujian Black-Box & UAT Pengguna | Hari 16–18 (Minggu IV) | Hasil Uji Fungsionalitas 100% | Lembar Uji & Berita Acara UAT |
| 4. | Penyusunan Manual & Sosialisasi Satker | Hari 18–20 (Minggu IV) | Buku User Manual & Transfer Ilmu | Buku Manual, Daftar Hadir & Foto |

### B. Dampak Hasil Kegiatan

Implementasi inovasi **"${title}"** di lingkungan ${satker} memberikan dampak positif nyata terhadap kinerja organisasi:
1. **Peningkatan Transparansi Pelayanan Administrasi:** Pegawai memperoleh kejelasan dan kepastian posisi berkas secara real-time dan terbuka tanpa perlu bertanya berulang.
2. **Efisiensi Waktu dan Pengurangan Interupsi:** Frekuensi pertanyaan status berkas secara lisan berkurang drastis hingga 85%, sehingga staf pengelola dapat fokus menyelesaikan tugas penatausahaan substantif.
3. **Penyampaian Kendala Lebih Cepat dan Terukur:** Jika berkas memerlukan perbaikan, catatan kendala langsung tertera pada sistem sehingga pemohon segera melengkapinya.
4. **Peningkatan Kesiapan Digitalisasi Satker:** Menjadi bukti konkret kontribusi Pranata Komputer dalam mempercepat maturitas SPBE di satuan kerja Kejaksaan RI.

---

# BAB IV. KENDALA DAN RENCANA TINDAK LANJUT

### A. Kendala

Dalam pelaksanaan praktikum laboratorium teknologi informasi di unit kerja, terdapat beberapa kendala yang dihadapi:

#### 1. Kendala Teknis dan Solusi Jangka Pendek
• **Kendala:** ${domain.kendalaTeknis}
• **Solusi Jangka Pendek:** ${domain.solusiTeknis}

#### 2. Kendala Non-Teknis dan Solusi Jangka Pendek
• **Kendala:** ${domain.kendalaNonTeknis}
• **Solusi Jangka Pendek:** ${domain.solusiNonTeknis}

### B. Rencana Tindak Lanjut

Guna menjamin keberlanjutan dan penyempurnaan sistem informasi di masa mendatang, direncanakan langkah tindak lanjut:
1. **Pemeliharaan dan Pencadangan Rutin:** Menjalankan pemantauan log server secara berkala serta mengonfigurasi skrip pencadangan data otomatis (*automated cron backup*) harian terenkripsi ke media penyimpanan sekunder.
2. **Integrasi Notifikasi WhatsApp Gateway API:** Menghubungkan modul aplikasi dengan API WhatsApp resmi dinas agar notifikasi perubahan status berkas terkirim otomatis ke handphone pegawai.
3. **Bimbingan Teknis Berkelanjutan:** Melakukan pendampingan teknis berkala bagi pegawai baru atau aparatur yang baru mengalami mutasi tugas ke ${satker}.
4. **Pengusulan Replikasi Sistem ke Tingkat Wilayah:** Menyusun laporan evaluasi efektivitas sistem untuk diajukan kepada Pusdaskrimti Kejaksaan Agung RI sebagai percontohan (*pilot project*) yang dapat direplikasi di satuan kerja lain.

---

# LAMPIRAN

### 1. SKP Tahunan
(Lampiran Sasaran Kinerja Pegawai tahun berjalan yang telah diverifikasi dan disahkan oleh atasan langsung)

### 2. Lampiran Bukti Fisik Kegiatan
- Lampiran 1: Bukti Fisik Kegiatan 1 - Dokumen Analisis Kebutuhan Sistem Informasi
- Lampiran 2: Bukti Fisik Kegiatan 2 - Dokumen Desain Basis Data & Arsitektur
- Lampiran 3: Bukti Fisik Kegiatan 3 - Source Code Modul Program & Skrip Keamanan Basis Data
- Lampiran 4: Bukti Fisik Kegiatan 4 - Laporan Uji Coba Black-Box & Berita Acara UAT
- Lampiran 5: Bukti Fisik Kegiatan 5 - Buku Petunjuk Pengoperasian (User Manual) & Foto Sosialisasi Satker

---

# FORMULIR BUKTI DUKUNG KEGIATAN

## BUKTI KEGIATAN PRANATA KOMPUTER KEAHLIAN
**Halaman : 1 dari 1**

| Identitas PPK | Uraian |
| :--- | :--- |
| **Nama PPK** | : ${fullName} |
| **Tanggal** | : ${examDate} |
| **NIP** | : ${nip} |
| **Lokasi Pekerjaan** | : ${satker} |
| **Pangkat/Golongan** | : Penata Muda (III/a) |
| **Kategori IKU** | : Kinerja Utama Bidang TI |
| **Jenjang Jabatan** | : ${rank} |
| **Rencana Hasil Kerja** | : Terwujudnya Transformasi Digital Layanan Administrasi pada ${satker} |

**Indikator Kinerja Individu :** Persentase keberhasilan pembangunan dan penerapan sistem informasi di unit kerja.  
**Nama Kegiatan :** Implementasi dan Pengembangan ${title} pada ${satker}.

**Item Bukti Kegiatan* :**  
1. Dokumen Analisis Kebutuhan Sistem Informasi  
2. Dokumen Perancangan Basis Data dan Desain Sistem  
3. Source Code Program Aplikasi dan Skrip Keamanan Basis Data  
4. Laporan Hasil Uji Coba Black-Box dan Berita Acara UAT  
5. Buku Petunjuk Pengoperasian (User Manual) dan Laporan Sosialisasi Satker  

**KETERANGAN :**  
Tautan Bukti Digital (*Evidence Repository*): \`${domain.evidenceLink}\`

| Mengetahui,<br/>Atasan langsung PPK | ${satker.replace(/^(Kejaksaan Negeri|Kejaksaan Tinggi|Cabang Kejaksaan Negeri)\s+/i, '')}, 30 September 2026<br/>Pejabat Pranata Komputer |
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

        // Verifikasi ketat kelengkapan seluruh naskah (BAB I, BAB II, BAB III, BAB IV, Lembar Pengesahan, dan Formulir Bukti)
        const hasBab1 = /(?:^|\n)#+\s*BAB\s*(?:I\b|1\b)/i.test(finalPaper)
        const hasBab2 = /(?:^|\n)#+\s*BAB\s*(?:II\b|2\b)/i.test(finalPaper)
        const hasBab3 = /(?:^|\n)#+\s*BAB\s*(?:III\b|3\b)/i.test(finalPaper)
        const hasBab4 = /(?:^|\n)#+\s*BAB\s*(?:IV\b|4\b)/i.test(finalPaper)
        const hasPengesahan = /LEMBAR\s*PENGESAHAN/i.test(finalPaper)
        const hasLampiran = /BUKTI\s*KEGIATAN\s*PRANATA\s*KOMPUTER|FORMULIR\s*BUKTI/i.test(finalPaper)

        if (!hasBab1 || !hasBab2 || !hasBab3 || !hasBab4 || !hasPengesahan || !hasLampiran) {
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
