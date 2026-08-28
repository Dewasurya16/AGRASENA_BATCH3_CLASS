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

    const systemPrompt = `Anda adalah Widyaiswara Pembimbing Utama Penulisan Makalah Proyek Akhir / Seminar Rencana Aksi Inovasi Pelatihan Fungsional Pranata Komputer (Batch 3) Kejaksaan RI.
Tugas Anda adalah menyusun PROPOSAL MAKALAH RANCANG BANGUN INOVASI TEKNOLOGI INFORMASI SATKER secara LENGKAP, OTENTIK, AKADEMIK, DAN RAPI DENGAN FORMAT BAKU BIROKRASI KEJAKSAAN RI.`

    const userPrompt = `SUSUNLAH DRAF PROPOSAL MAKALAH INOVASI SATKER LENGKAP 5 BAB DENGAN DATA BERIKUT:

DATA PENYUSUN:
- Nama Peserta: ${authorName || "Peserta Diklat"}
- NIP / Pangkat: ${authorNip || "-"} / ${authorRank || "Pranata Komputer Ahli Pertama (Gol. III/a)"}
- Satuan Kerja: ${authorSatker} (Kejaksaan RI)
- Judul Inovasi / Makalah: "${topicTitle}"
- Masalah Aktual di Satker: "${problemStatement || "Keterbatasan otomatisasi sistem dan kebutuhan peningkatan efisiensi layanan TI di satker"}"
- Hasil yang Diharapkan: "${desiredOutcome || "Peningkatan kualitas tata kelola SPBE dan percepatan layanan publik kejaksaan"}"

ATURAN FORMAT PENULISAN (PENTING & WAJIB DIPATUHI):
1. DILARANG MEMBUAT DIAGRAM GAMBAR ASCII ART (+----+ ATAU | | |) KARENA AKAN RUSAK SAAT DIBACA.
2. DILARANG MENGGUNAKAN FORMAT TABEL PIPA MARKDOWN (| col1 | col2 |).
3. Untuk Alur Proses Bisnis / Arsitektur, jelaskan secara naratif terstruktur dengan tahapan panah teks bersih (contoh: Tahap 1: Input → Tahap 2: Proses → Tahap 3: Output) atau daftar nomor langkah.
4. Setiap butir poin WAJIB berada di baris baru tersendiri dengan format: • **Nama Poin:** Penjelasan detail.
5. Gunakan tata bahasa formal birokrasi kejaksaan yang padat, berbobot, dan tidak normatif.

STRUKTUR MAKALAH:

# 🎓 PROPOSAL RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
## ${topicTitle.toUpperCase()}
**Disusun Oleh:** ${authorName || "Peserta"} (NIP. ${authorNip || "-"})
**Satuan Kerja:** ${authorSatker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN
### 1.1 Latar Belakang
(Uraikan kondisi riil satker ${authorSatker}, tantangan penegakan hukum di era transformasi digital, dan urgensi otomatisasi layanan TIK.)

### 1.2 Identifikasi & Rumusan Masalah
(Sebutkan minimal 3 butir masalah konkrit yang dihadapi saat ini di ${authorSatker}.)
• **Masalah 1:** (Uraian masalah)
• **Masalah 2:** (Uraian masalah)
• **Masalah 3:** (Uraian masalah)

### 1.3 Maksud dan Tujuan Inovasi
• **Maksud:** (Penjelasan maksud perancangan inovasi)
• **Tujuan Jangka Pendek (2 Bulan):** (Target operasional awal & prototipe)
• **Tujuan Jangka Panjang (6 Bulan):** (Integrasi penuh & penetapan SOP)

### 1.4 Ruang Lingkup & Batasan Sistem
• **Batasan Pengguna:** (Pengguna internal satker dan masyarakat pemohon layanan)
• **Batasan Teknis:** (Cakupan modul sistem yang dibangun)

---

# BAB II: LANDASAN REGULASI & KERANGKA TEORI
### 2.1 Dasar Hukum & Regulasi Pokok
• **Peraturan Presiden No. 95 Tahun 2018** tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).
• **Peraturan Presiden No. 132 Tahun 2022** tentang Arsitektur SPBE Nasional.
• **PermenPAN-RB No. 32 Tahun 2020** tentang Jabatan Fungsional Pranata Komputer.
• **Peraturan Kepala BPS No. 2 Tahun 2021** tentang Petunjuk Teknis Penilaian Angka Kredit Pranata Komputer.
• **Instruksi Jaksa Agung RI** tentang Percepatan Transformasi Digital dan Keterpaduan Layanan Kejaksaan.

### 2.2 Landasan Teori Arsitektur Sistem & Basis Data
• **Konsep Tata Kelola Layanan TI:** Penerapan prinsip CIA Triad (Confidentiality, Integrity, Availability) dan High Availability.
• **Perancangan Basis Data Relasional:** Standarisasi kamus data, integritas referensial (Foreign Key), dan pengindeksan B-Tree query.
• **Arsitektur Integrasi API:** Pemanfaatan RESTful API terenkripsi TLS 1.3 untuk pertukaran data antar-aplikasi perkara.

---

# BAB III: RANCANGAN INOVASI & ARSITEKTUR TEKNIS
### 3.1 Gambaran Umum Solusi Inovasi
(Deskripsi arsitektur solusi inovasi secara menyeluruh dan keterkaitannya dengan aplikasi eksisting Kejaksaan.)

### 3.2 Alur Proses Bisnis (Workflow)
(Jelaskan langkah-langkah alur kerja sistem dari awal hingga akhir:)
• **Langkah 1 (Input Data):** Penginputan data transaksi perkara atau dokumen oleh petugas PTSP/staf teknis.
• **Langkah 2 (Validasi & Proses):** Sistem melakukan validasi skema data dan menjalankan logika proses otomatis.
• **Langkah 3 (Pencadangan & Replikasi):** Data tersimpan aman di database utama dan otomatis direplikasi ke storage cadangan.
• **Langkah 4 (Output & Notifikasi):** Penerbitan laporan status perkara kepada pimpinan dan pengiriman notifikasi instan ke pemohon.

### 3.3 Kebutuhan Spesifikasi Infrastruktur TIK
• **Spesifikasi Server:** Server Linux (Ubuntu 22.04 / Rocky Linux), Minimal 4 vCPU, RAM 8 GB, Storage SSD NVMe 256 GB.
• **Spesifikasi Database & Backend:** PostgreSQL 15 / MySQL 8.0, Engine NodeJS / Python FastAPI / PHP 8.2.
• **Standar Keamanan:** Autentikasi Role-Based Access Control (RBAC), Enkripsi AES-256 untuk password & data sensitif, Firewall UFW & SSL/TLS.

---

# BAB IV: RENCANA AKSI IMPLEMENTASI & MANFAAT
### 4.1 Rencana Aksi Pentahapan (Milestone 6 Bulan)
• **Bulan 1-2 (Tahap Perancangan & Development):** Penyusunan DDL database, arsitektur sistem, dan pembuatan prototipe antarmuka.
• **Bulan 3-4 (Tahap Uji Coba & Testing):** Uji coba fungsional (UAT), stress test server, dan pelatihan teknis bagi staf satker.
• **Bulan 5-6 (Tahap Peluncuran & Evaluasi):** Penerbitan SK Inovasi dari Kajari, penerapan resmi, dan evaluasi berkala kepuasan pengguna.

### 4.2 Analisis Manfaat & Dampak Layanan
• **Manfaat Internal Satker (${authorSatker}):** Efisiensi waktu administrasi perkara hingga 70%, akurasi data terjamin, dan peningkatan Indeks SPBE Satker.
• **Manfaat Eksternal Masyarakat:** Kemudahan akses informasi perkara secara transparan, cepat, dan tanpa calo.

### 4.3 Mitigasi Risiko Teknis & Keberlanjutan
• **Risiko Gangguan Jaringan / Listrik:** Penerapan UPS cadangan 2 KVA dan konfigurasi failover koneksi backup.
• **Risiko Kehilangan Data:** Otomasi backup harian terjadwal (Cron job) ke cloud storage/NAS terpisah dengan retensi 30 hari.
• **Risiko Pergantian Personel:** Penyusunan Manual Book Lengkap dan dokumentasi source code terstandarisasi.

---

# BAB V: KESIMPULAN & REKOMENDASI
### 5.1 Kesimpulan
(Ringkasan komitmen inovasi ${topicTitle} dalam mendukung penegakan hukum modern di ${authorSatker}.)

### 5.2 Rekomendasi
• **Dukungan Pimpinan:** Diterbitkannya Surat Keputusan (SK) Standar Operasional Prosedur Inovasi dari Kepala Kejaksaan Negeri.
• **Keberlanjutan Anggaran:** Alokasi pemeliharaan perangkat server dan lisensi keamanan pada DIPA tahun berikutnya.`

    // Generate AI Paper via OpenRouter (with Multi-Model & Groq Fallback)
    const result = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 3800,
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
