import { NextRequest, NextResponse } from "next/server"
import { generateAiCompletion } from "@/lib/ai-provider"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { authorName, authorNip, authorSatker, authorRank, topicTitle, problemStatement, desiredOutcome } = body

    if (!topicTitle || !authorSatker) {
      return NextResponse.json({ error: "Judul topik inovasi dan nama satker wajib diisi." }, { status: 400 })
    }

    const systemPrompt = `Anda adalah Widyaiswara Utama dan Pakar Penilai Seminar Proyek Perubahan / Makalah Inovasi Pelatihan Fungsional Pranata Komputer (Batch 3) Kejaksaan RI.
Tugas Anda adalah menyusun NASKAH LENGKAP PROPOSAL MAKALAH RANCANG BANGUN INOVASI TEKNOLOGI INFORMASI SATKER yang SANGAT MENDALAM, KOMPREHENSIF, AKADEMIK, UTUH 5 BAB, DAN LANGSUNG SIAP DIPERGUNAKAN SERTA DIPRESENTASIKAN DI HADAPAN PENGUJI SEMINAR PUSDIKLAT.

STANDAR KUALITAS PENULISAN:
1. DILARANG KERAS membuat naskah yang singkat, dangkal, atau sekadar ringkasan abstrak.
2. DILARANG menggunakan kata-kata pemotong seperti "dan lain-lain", "dan seterusnya", "... (isi sendiri)", atau placeholder.
3. Setiap Bab dan Sub-Bab WAJIB dijelaskan dalam paragraf-paragraf akademik yang matang, berbobot, berbasis fakta birokrasi Kejaksaan RI, dan mengaitkan regulasi SPBE & JF Pranata Komputer.
4. Gunakan bahasa Indonesia baku formal kedinasan tingkat tinggi yang mencerminkan kecakapan seorang Pranata Komputer Ahli Kejaksaan RI.`

    const userPrompt = `SUSUNLAH NASKAH LENGKAP PROPOSAL MAKALAH INOVASI SATKER (5 BAB LENGKAP & MENDALAM) DENGAN RINCIAN DATA BERIKUT:

DATA PENYUSUN:
- Nama Peserta: ${authorName || "Peserta Pelatihan"}
- NIP: ${authorNip || "19950101 202203 1 002"}
- Pangkat / Golongan: ${authorRank || "Pranata Komputer Ahli Pertama (Penata Muda / Gol. III/a)"}
- Satuan Kerja: ${authorSatker} (Kejaksaan Republik Indonesia)
- Judul Makalah Inovasi: "${topicTitle}"
- Masalah Aktual di Satker: "${problemStatement || "Keterbatasan otomatisasi sistem, pengelolaan data yang masih terfragmentasi, serta kebutuhan percepatan layanan penegakan hukum dan administrasi perkara berbasis digital di satuan kerja"}"
- Hasil & Dampak yang Diharapkan: "${desiredOutcome || "Terwujudnya tata kelola SPBE yang terintegrasi, peningkatan akurasi data perkara, efisiensi waktu layanan publik, serta penguatan keamanan informasi satker"}"

ATURAN FORMAT PENULISAN (WAJIB DIPATUHI):
1. DILARANG MEMBUAT DIAGRAM GAMBAR ASCII ART (+----+ ATAU | | |) KARENA AKAN RUSAK SAAT DIBACA.
2. DILARANG MENGGUNAKAN FORMAT TABEL PIPA MARKDOWN (| col1 | col2 |).
3. Untuk Alur Proses Bisnis / Arsitektur, jelaskan secara naratif terstruktur dengan tahapan panah teks bersih (contoh: Tahap 1: Input Data → Tahap 2: Validasi Logika → Tahap 3: Replikasi DB → Tahap 4: Output Layanan) serta rincian poin terperinci.
4. Setiap butir poin WAJIB berada di baris baru tersendiri dengan format: • **Nama Poin:** Penjelasan mendalam dan solutif.

SUSUNLAH KESELURUHAN 5 BAB BERIKUT DENGAN FORMAT MARKDOWN LENGKAP:

# 🎓 PROPOSAL RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
## ${topicTitle.toUpperCase()}
**Disusun Oleh:** ${authorName || "Peserta Diklat"} (NIP. ${authorNip || "19950101 202203 1 002"})
**Jabatan:** ${authorRank || "Pranata Komputer Ahli Pertama (Gol. III/a)"}
**Satuan Kerja:** ${authorSatker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN
### 1.1 Latar Belakang
(Tuliskan minimal 3-4 paragraf komprehensif mengenai kondisi riil di ${authorSatker}, tantangan penegakan hukum modern era digital, tuntutan transparansi publik, dan urgensi pembangunan inovasi ${topicTitle} dalam mendukung transformasi digital Kejaksaan Agung RI.)

### 1.2 Identifikasi & Rumusan Masalah
(Sebutkan minimal 3 butir permasalahan konkrit dan faktual yang dihadapi satker saat ini beserta dampak negatifnya jika tidak segera ditangani:)
• **Masalah 1 (Aspek Efisiensi Operasional):** (Uraian mendalam akar masalah dan dampaknya terhadap beban kerja pegawai)
• **Masalah 2 (Aspek Integritas & Akurasi Data):** (Uraian kendala sinkronisasi data, risiko kehilangan data, atau keterlambatan laporan)
• **Masalah 3 (Aspek Kualitas Layanan Publik & Stakeholder):** (Uraian hambatan akses informasi bagi pimpinan dan masyarakat pencari keadilan)

### 1.3 Maksud dan Tujuan Inovasi
• **Maksud:** (Penjelasan maksud strategis perancangan dan penerapan inovasi teknologi ${topicTitle})
• **Tujuan Jangka Pendek (2 Bulan Pertama):** (Target penyelesaian rancang bangun database, API, modul inti, dan prototipe sistem yang siap diuji coba secara internal)
• **Tujuan Jangka Menengah (4 Bulan):** (Uji coba fungsional menyeluruh / UAT, sosialisasi pengguna, serta penerbitan SOP operasional baku dari pimpinan)
• **Tujuan Jangka Panjang (6 Bulan & Seterusnya):** (Integrasi penuh dengan sistem nasional Kejaksaan RI, pemeliharaan berkelanjutan, dan standarisasi replikasi ke satker lain)

### 1.4 Ruang Lingkup & Batasan Sistem
• **Batasan Pengguna (User Scope):** (Rincian hak akses untuk Administrator TIK, Staf Operasional Satker, Pimpinan/Kajari, serta Publik/Pemohon)
• **Batasan Fungsional & Teknis:** (Cakupan modul yang dikembangkan, batasan integrasi, dan batasan infrastruktur jaringan satker)

### 1.5 Manfaat Inovasi
• **Manfaat Bagi Satuan Kerja (${authorSatker}):** (Efisiensi birokrasi, akselerasi Indeks SPBE Satker, dan kepatuhan audit TIK)
• **Manfaat Bagi Institusi Kejaksaan RI:** (Ketersediaan data terpusat, penguatan tata kelola Satu Data Kejaksaan, dan akuntabilitas kinerja)
• **Manfaat Bagi Masyarakat / Pencari Keadilan:** (Kepastian layanan yang transparan, cepat, responsif, dan bebas pungli)

---

# BAB II: LANDASAN REGULASI & KERANGKA TEORI
### 2.1 Landasan Hukum & Regulasi Kebijakan
(Jelaskan secara detail peran inovasi ini dalam memenuhi ketentuan regulasi berikut:)
• **Peraturan Presiden No. 95 Tahun 2018** tentang Sistem Pemerintahan Berbasis Elektronik (SPBE), khususnya terkait keterpaduan tata kelola dan efisiensi layanan digital instansi pemerintah.
• **Peraturan Presiden No. 132 Tahun 2022** tentang Arsitektur SPBE Nasional, dalam rangka standardisasi domain proses bisnis dan domain aplikasi layanan kejaksaan.
• **PermenPAN-RB No. 32 Tahun 2020** tentang Jabatan Fungsional Pranata Komputer, yang mendasari tugas pokok dan fungsi pengembangan sistem teknologi informasi.
• **Peraturan Kepala BPS No. 2 Tahun 2021** tentang Petunjuk Teknis Penilaian Angka Kredit Pranata Komputer, sebagai dasar pemenuhan butir kegiatan fungsional TIK.
• **Instruksi Jaksa Agung RI** mengenai Akselerasi Transformasi Digital dan Keterpaduan Layanan Kejaksaan Agung RI menuju Satu Data Penegakan Hukum.

### 2.2 Landasan Teori Arsitektur Sistem, Basis Data & Keamanan
• **Konsep Tata Kelola Layanan TIK:** Penerapan prinsip CIA Triad (Confidentiality, Integrity, Availability) dan arsitektur High Availability guna memastikan layanan aktif 24/7 tanpa downtime yang merugikan.
• **Perancangan Basis Data Relasional & Normalisasi:** Penerapan bentuk normalisasi 3NF, integritas referensial foreign key, skema partitioning, dan strategi indexing B-Tree untuk optimasi kecepatan query transaksi.
• **Arsitektur API & Interoperabilitas Sistem:** Pemanfaatan protokol RESTful API berbasis JSON dengan pengamanan otentikasi JWT dan enkripsi komunikasi data TLS 1.3.
• **Standar Keamanan Informasi & Manajemen Risiko Siber (CSIRT):** Penerapan prinsip Least Privilege pada Role-Based Access Control (RBAC), sanitasi input terhadap serangan SQL Injection dan XSS, serta kepatuhan ISO/IEC 27001.

---

# BAB III: RANCANGAN INOVASI & ARSITEKTUR TEKNIS
### 3.1 Gambaran Umum & Analisis Perbandingan (As-Is vs To-Be)
(Uraikan komparasi mendalam antara alur kerja konvensional saat ini (*As-Is*) dengan efisiensi dan otomasi sistem baru yang dibangun (*To-Be*).)

### 3.2 Alur Proses Bisnis Terperinci (Business Process Workflow)
(Uraikan langkah demi langkah proses sistem secara runtut dan mendalam:)
• **Tahap 1 — Inisiasi & Input Transaksi:** (Mekanisme penginputan berkas/data oleh operator satker secara terverifikasi)
• **Tahap 2 — Validasi Data & Eksekusi Otomatis:** (Validasi logika sistem, pencegahan duplikasi data, dan pemrosesan otomatis pada backend)
• **Tahap 3 — Penyimpanan & Sinkronisasi Basis Data:** (Penyimpanan data transaksi ke database utama dengan mekanisme audit logging dan replikasi data instan)
• **Tahap 4 — Output Layanan & Diseminasi Notifikasi:** (Penerbitan laporan analitik bagi pimpinan satker serta pengiriman notifikasi status secara real-time kepada pihak terkait)

### 3.3 Kebutuhan Spesifikasi Infrastruktur TIK & Perangkat Lunak
• **Spesifikasi Server & Jaringan:** Dedicated Virtual Private Server (VPS) atau On-Premise Server OS Linux Ubuntu Server 22.04 LTS / Rocky Linux 9, Minimal 4-8 vCPU, RAM 16 GB ECC, Storage SSD NVMe RAID-1 512 GB, Koneksi Jaringan Dedicated 100 Mbps dengan IP Statis.
• **Spesifikasi Basis Data & Framework:** Database Management System PostgreSQL v15 / MySQL 8.0 Enterprise, Backend Runtime NodeJS / Python FastAPI / PHP 8.3 dengan arsitektur Modular MVC / Clean Architecture.
• **Standar Keamanan & Manajemen Akses:** Autentikasi Multi-Factor Authentication (MFA), Hashing password Argon2id / bcrypt dengan salt dinamis, Reverse Proxy Nginx dengan modul SSL Certbot & Web Application Firewall (WAF) ModSecurity.

---

# BAB IV: RENCANA AKSI PENTAHAPAN IMPLEMENTASI & MANFAAT
### 4.1 Rencana Aksi Pentahapan (Milestone 6 Bulan)
• **Bulan 1 (Fase Analisis Kebutuhan & Perancangan):** Pengumpulan data eksisting satker, penyusunan Data Flow Diagram (DFD), Entity Relationship Diagram (ERD), dan perancangan prototype UI/UX.
• **Bulan 2 (Fase Pengembangan Kode & Basis Data):** Penulisan source code modul utama, migrasi skema database, pembuatan API endpoint, dan konfigurasi environment server.
• **Bulan 3 (Fase Pengujian Terpadu / Testing):** Pelaksanaan Unit Testing, Integration Testing, Security Penetration Testing, dan User Acceptance Testing (UAT) bersama calon pengguna internal satker.
• **Bulan 4 (Fase Deployment & Sosialisasi Pengguna):** Peluncuran versi beta pada lingkungan produksi, pelatihan teknis bagi staf dan admin, serta penyusunan buku petunjuk operasional (User Manual).
• **Bulan 5 (Fase Penetapan Regulasi & Operasional Resmi):** Penerbitan Surat Keputusan (SK) Standar Operasional Prosedur (SOP) Inovasi dari Kepala Kejaksaan Negeri, serta implementasi penuh pada layanan satker.
• **Bulan 6 (Fase Monitoring, Evaluasi & Penyempurnaan):** Evaluasi performa sistem, pengukuran indeks kepuasan pengguna, patching berkala, dan penyusunan laporan akhir seminar diklat.

### 4.2 Analisis Manfaat & Efisiensi Layanan
• **Efisiensi Waktu & Beban Kerja:** Pemangkasan waktu pemrosesan data administrasi dari hitungan hari menjadi hitungan menit (efisiensi hingga 80%).
• **Akurasi & Integritas Informasi:** Menghilangkan potensi human-error dalam pencatatan dan pelaporan data perkara.
• **Peningkatan Akuntabilitas Satker:** Memberikan kemudahan pengawasan langsung bagi pimpinan satker terhadap kinerja unit kerja TIK.

### 4.3 Mitigasi Risiko & Keberlanjutan Sistem (Sustainability Plan)
• **Mitigasi Kegagalan Daya & Perangkat Keras:** Penggunaan Uninterruptible Power Supply (UPS) online berkapasitas 3 KVA dan konfigurasi automated disaster recovery snapshot.
• **Mitigasi Kehilangan Data (Disaster Recovery Plan):** Penjadwalan pencadangan otomatis (Automated Cron Backup) harian terenkripsi ke media penyimpanan Network-Attached Storage (NAS) dan cloud backup terpisah dengan kebijakan retensi data 30 hari.
• **Mitigasi Ketergantungan Personel (Knowledge Transfer):** Dokumentasi teknis source code terstandarisasi, repository Git internal, dan pelaksanaan alih pengetahuan secara berkala bagi staf TIK satker.

---

# BAB V: KESIMPULAN & REKOMENDASI
### 5.1 Kesimpulan
(Tuliskan ringkasan 2 paragraf padat dan meyakinkan tentang keberhasilan rancang bangun inovasi ${topicTitle} sebagai wujud nyata dedikasi Pranata Komputer dalam memodernisasi tata kelola birokrasi Kejaksaan RI di ${authorSatker}.)

### 5.2 Rekomendasi
• **Rekomendasi Kebijakan:** Ditetapkannya Standar Operasional Prosedur (SOP) resmi mengenai pemanfaatan inovasi ${topicTitle} melalui Surat Keputusan Kepala Satuan Kerja.
• **Rekomendasi Dukungan Sumber Daya:** Penyediaan alokasi anggaran pemeliharaan perangkat TIK, upgrade lisensi keamanan, dan peningkatan bandwidth jaringan satker secara berkesinambungan.
• **Rekomendasi Pengembangan Lanjutan:** Pengintegrasian inovasi ini ke dalam ekosistem aplikasi nasional Kejaksaan Agung RI agar dapat direplikasi secara nasional ke seluruh Kejaksaan Tinggi dan Kejaksaan Negeri di Indonesia.`

    // Generate AI Paper via OpenRouter (with Multi-Model & Groq Fallback)
    const result = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.35,
      max_tokens: 6000,
      mustIncludeKeyPhrases: ["BAB V", "BAB 5", "Kesimpulan", "5.1", "5.2"],
    })

    if (result.text && result.text.length > 200) {
      return NextResponse.json({
        paper: result.text,
        model: result.model,
        provider: result.provider,
        authorSatker,
        topicTitle,
      })
    }

    return NextResponse.json({
      error: "AI_BUSY",
      message: "Server AI sedang sibuk. Silakan coba kembali dalam beberapa detik.",
    }, { status: 500 })
  } catch (err: any) {
    console.error("Paper Generator Error:", err)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan pada server generator makalah." },
      { status: 500 }
    )
  }
}
