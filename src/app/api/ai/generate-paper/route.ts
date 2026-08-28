import { NextRequest, NextResponse } from "next/server"
import { generateAiCompletion } from "@/lib/ai-provider"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Bulletproof 5-Chapter Academic Paper Builder (Always delivers complete 5 chapters even if external API is throttled)
function generateStructuredPaperFallback(data: {
  authorName?: string
  authorNip?: string
  authorSatker?: string
  authorRank?: string
  topicTitle?: string
  problemStatement?: string
  desiredOutcome?: string
}): string {
  const name = data.authorName || "Peserta Pelatihan"
  const nip = data.authorNip || "19950101 202203 1 002"
  const rank = data.authorRank || "Pranata Komputer Ahli Pertama (Gol. III/a)"
  const satker = data.authorSatker || "Kejaksaan Negeri Soppeng"
  const title = data.topicTitle || "Otomatisasi Sistem Informasi Satuan Kerja"
  const problem = data.problemStatement || "Keterbatasan otomatisasi sistem dan risiko integritas data operasional"
  const outcome = data.desiredOutcome || "Peningkatan efisiensi layanan, akurasi data perkara, dan penguatan SPBE"

  return `# 🎓 PROPOSAL RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
## ${title.toUpperCase()}

**Disusun Oleh:** ${name} (NIP. ${nip})
**Jabatan:** ${rank}
**Satuan Kerja:** ${satker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN

### 1.1 Latar Belakang
Transformasi digital di lingkungan Kejaksaan Republik Indonesia merupakan komitmen strategis dalam mewujudkan tata kelola birokrasi yang modern, transparan, akuntabel, dan berorientasi pada pelayanan prima. Penerapan Sistem Pemerintahan Berbasis Elektronik (SPBE) menuntut setiap satuan kerja, termasuk ${satker}, untuk terus berinovasi dalam mengoptimalkan pengelolaan data operasional dan administrasi penegakan hukum.

Kondisi faktual saat ini di ${satker} menunjukkan bahwa proses pengelolaan informasi masih menghadapi berbagai tantangan operasional. Kebutuhan terhadap ketersediaan data yang cepat, aman, dan terintegrasi menuntut adanya inovasi TIK yang tepat guna. Melalui perancangan "${title}", diharapkan ${satker} dapat memangkas waktu birokrasi, mengeliminasi potensi kehilangan data, serta meningkatkan kepuasan masyarakat pencari keadilan.

### 1.2 Identifikasi & Rumusan Masalah
Berdasarkan analisis kondisi kerja eksisting di ${satker}, teridentifikasi 3 (tiga) permasalahan utama sebagai berikut:
• **Masalah 1 (Aspek Efisiensi Operasional):** ${problem}, yang mengakibatkan pemrosesan administrasi membutuhkan waktu lebih lama dan membebani tugas staf operasional.
• **Masalah 2 (Aspek Integritas & Keamanan Data):** Belum optimalnya prosedur pencadangan otomatis terpusat yang menimbulkan risiko *data loss* saat terjadi kendala infrastruktur atau gangguan perangkat keras.
• **Masalah 3 (Aspek Transparansi & Kualitas Layanan):** Akses informasi bagi pimpinan dan stakeholder masih terhambat akibat data yang terfragmentasi antar seksi kerja.

### 1.3 Maksud dan Tujuan Inovasi
• **Maksud:** Merancang, membangun, dan mengimplementasikan "${title}" sebagai instrumen modernisasi pelayanan administrasi TIK di ${satker}.
• **Tujuan Jangka Pendek (2 Bulan Pertama):** Menyelesaikan analisis kebutuhan, perancangan skema basis data, implementasi modul inti, serta pengujian internal sistem (*alpha testing*).
• **Tujuan Jangka Menengah (4 Bulan):** Melakukan User Acceptance Testing (UAT), pelatihan operasional bagi pengguna, dan pengesahan Standar Operasional Prosedur (SOP) oleh Kepala Satuan Kerja.
• **Tujuan Jangka Panjang (6 Bulan & Seterusnya):** Integrasi penuh dengan sistem nasional Kejaksaan RI, monitoring kinerja berkala, serta standarisasi model replikasi untuk satker Kejaksaan lainnya.

### 1.4 Ruang Lingkup Sistem
• **Batasan Pengguna (User Scope):** Sistem mencakup hak akses Administrator TIK (pengelolaan konfigurasi & database), Operator Seksi (input & validasi transaksi), Pimpinan Satker (monitoring dashboard analitik), dan Publik (pengecekan status layanan).
• **Batasan Fungsional & Teknis:** Sistem difokuskan pada otomatisasi alur kerja, validasi logika data secara otomatis, manajemen backup harian terenkripsi, serta penyajian laporan real-time.

### 1.5 Manfaat Inovasi
• **Manfaat Bagi Satuan Kerja (${satker}):** Meningkatkan efisiensi kerja pegawai, menjamin akurasi data administrasi, dan mempercepat kenaikan Indeks SPBE Satker.
• **Manfaat Bagi Institusi Kejaksaan RI:** Mendukung program Satu Data Kejaksaan Agung RI serta mempermudah audit tata kelola teknologi informasi.
• **Manfaat Bagi Masyarakat / Pencari Keadilan:** Memberikan kepastian pelayanan hukum yang cepat, transparan, akurat, dan bebas dari pungutan liar.

---

# BAB II: LANDASAN REGULASI & KERANGKA TEORI

### 2.1 Landasan Regulasi Kebijakan
Pelaksanaan inovasi TIK ini didasarkan pada landasan yuridis yang berlaku:
• **Peraturan Presiden No. 95 Tahun 2018** tentang Sistem Pemerintahan Berbasis Elektronik (SPBE), yang mengamanatkan keterpaduan dan efisiensi sistem digital instansi pemerintah.
• **Peraturan Presiden No. 132 Tahun 2022** tentang Arsitektur SPBE Nasional, yang menjadi rujukan standardisasi domain proses bisnis dan domain aplikasi kejaksaan.
• **PermenPAN-RB No. 32 Tahun 2020** tentang Jabatan Fungsional Pranata Komputer, yang mengatur tugas pokok Pranata Komputer dalam merancang dan mengembangkan sistem informasi.
• **Peraturan Kepala BPS No. 2 Tahun 2021** tentang Petunjuk Teknis Penilaian Angka Kredit Pranata Komputer.
• **Instruksi Jaksa Agung RI** mengenai percepatan transformasi digital dan keterpaduan layanan publik Kejaksaan RI menuju Satu Data Penegakan Hukum.

### 2.2 Landasan Teori TIK & Keamanan Informasi
• **Konsep CIA Triad & High Availability:** Menjamin tiga pilar utama keamanan informasi—Kerahasiaan (*Confidentiality*), Keutuhan (*Integrity*), dan Ketersediaan (*Availability*) layanan TIK secara berkelanjutan (24/7).
• **Perancangan Basis Data Relasional & Normalisasi:** Penerapan kaidah normalisasi 3NF, integritas referensial foreign key, dan pembuatan indeks B-Tree guna mengoptimalkan query transaksi data dalam jumlah besar.
• **Standar Keamanan Siber & CSIRT:** Penerapan Role-Based Access Control (RBAC), sanitasi input terhadap celah SQL Injection dan Cross-Site Scripting (XSS), serta kepatuhan pada standar ISO/IEC 27001.

---

# BAB III: RANCANGAN INOVASI & ARSITEKTUR TEKNIS

### 3.1 Gambaran Umum & Analisis As-Is vs To-Be
• **Kondisi Eksisting (As-Is):** Pencatatan dan pengelolaan data masih bersifat manual/semi-manual, rentan salah input (*human-error*), dan proses pelaporan ke pimpinan membutuhkan rekapitulasi berulang.
• **Kondisi Target (To-Be):** Seluruh alur kerja telah terotomatisasi secara digital melalui validasi sistem terpusat, pencadangan data otomatis harian, dan ketersediaan laporan analitik seketika (*real-time dashboard*).

### 3.2 Alur Proses Bisnis Terperinci
Alur kerja sistem inovasi dirancang dalam 4 (empat) tahapan utama:
• **Tahap 1 — Inisiasi & Input Transaksi:** Operator menginput data perkara/transaksi melalui antarmuka web yang terenkripsi SSL/TLS.
• **Tahap 2 — Validasi Data & Eksekusi Otomatis:** Sistem menjalankan verifikasi format logika, mencegah duplikasi data, dan memproses transaksi secara instan.
• **Tahap 3 — Penyimpanan & Replikasi Basis Data:** Data tersimpan ke DBMS utama dengan *audit logging* otomatis serta replikasi cadangan terenkripsi.
• **Tahap 4 — Output Layanan & Diseminasi Informasi:** Sistem menerbitkan tanda bukti elektronik, memperbarui dashboard analitik pimpinan, dan mengirimkan notifikasi status ke pihak berkepentingan.

### 3.3 Spesifikasi Infrastruktur TIK & Keamanan
• **Spesifikasi Server & Jaringan:** Dedicated Virtual Private Server (VPS) / On-Premise Server OS Linux Ubuntu Server 22.04 LTS, Minimal 4 vCPU, RAM 8-16 GB, SSD Storage NVMe 256-512 GB RAID-1, Bandwidth dedicated 100 Mbps dengan IP Statis.
• **Spesifikasi Basis Data & Backend:** DBMS PostgreSQL v15 / MySQL 8.0 Enterprise, Backend NodeJS / Python FastAPI / PHP 8.3 dengan arsitektur modular yang skalabel.
• **Manajemen Keamanan & Akses:** Autentikasi Multi-Factor Authentication (MFA), enkripsi password Argon2id / bcrypt, Reverse Proxy Nginx dengan Web Application Firewall (WAF).

---

# BAB IV: RENCANA AKSI PENTAHAPAN & MANFAAT

### 4.1 Milestone Rencana Aksi Pentahapan (6 Bulan)
• **Bulan 1 (Fase Analisis & Perancangan):** Pengumpulan kebutuhan satker, penyusunan Data Flow Diagram (DFD), Entity Relationship Diagram (ERD), dan mockup UI/UX.
• **Bulan 2 (Fase Pengembangan Kode & Basis Data):** Penulisan kode program inti, pembuatan REST API, konfigurasi database, dan integrasi modul.
• **Bulan 3 (Fase Pengujian Terpadu / Testing):** Pelaksanaan Unit Testing, Security Vulnerability Scanning, serta User Acceptance Testing (UAT) bersama pengguna di satker.
• **Bulan 4 (Fase Deployment & Sosialisasi):** Peluncuran sistem di lingkungan produksi, pelatihan operator dan staf, serta pembuatan User Manual Guide.
• **Bulan 5 (Fase Penetapan Regulasi SOP):** Penerbitan Surat Keputusan (SK) Standar Operasional Prosedur (SOP) dari Kepala Kejaksaan Negeri untuk kepastian hukum operasional.
• **Bulan 6 (Fase Monitoring & Evaluasi):** Evaluasi performa sistem, rekapitulasi indeks kepuasan, patching pemeliharaan, serta penyusunan laporan akhir seminar diklat.

### 4.2 Analisis Manfaat & Efisiensi Layanan
• **Efisiensi Waktu Kerja:** Memangkas waktu pemrosesan dan rekapitulasi data dari semula berhari-hari menjadi hitungan menit (efisiensi hingga 80%).
• **Akurasi & Integritas Informasi:** Mengurangi potensi kesalahan input manusia (*zero human-error*) dan menjamin riwayat transaksi tercatat secara permanen (*audit trail*).
• **Akuntabilitas Kinerja:** Memudahkan monitoring kinerja satker oleh pimpinan secara transparan dan terukur.

### 4.3 Mitigasi Risiko & Keberlanjutan Sistem (Sustainability Plan)
• **Mitigasi Gangguan Perangkat & Daya:** Pemanfaatan Uninterruptible Power Supply (UPS) online berkapasitas 3 KVA serta auto-restart daemon.
• **Mitigasi Bencana & Kehilangan Data (Disaster Recovery):** Penjadwalan pencadangan otomatis (*Automated Cron Backup*) harian terenkripsi ke NAS dan Cloud Storage dengan kebijakan retensi 30 hari.
• **Mitigasi Ketergantungan Personel:** Dokumentasi source code terstruktur, repository Git internal satker, dan pelaksanaan alih pengetahuan (*knowledge transfer*) berkala.

---

# BAB V: KESIMPULAN & REKOMENDASI

### 5.1 Kesimpulan
Rancang bangun inovasi "${title}" di ${satker} merupakan langkah nyata dan strategis dalam mendukung modernisasi birokrasi dan transformasi digital Kejaksaan RI. Inovasi ini mampu menyelesaikan permasalahan ${problem} secara tuntas, meningkatkan efisiensi operasional, serta mewujudkan ${outcome} secara berkelanjutan.

### 5.2 Rekomendasi
• **Rekomendasi Kebijakan:** Ditetapkannya Standar Operasional Prosedur (SOP) baku mengenai pemanfaatan inovasi melalui Surat Keputusan Kepala Satuan Kerja.
• **Rekomendasi Dukungan Sumber Daya:** Penyediaan alokasi anggaran pemeliharaan perangkat TIK, upgrade lisensi keamanan, dan pelatihan teknis staf secara berkelanjutan.
• **Rekomendasi Replikasi Nasional:** Pengembangan lanjutan agar modul inovasi ini dapat diintegrasikan dengan aplikasi induk Kejaksaan Agung RI dan direplikasi ke satker Kejaksaan lainnya di seluruh Indonesia.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { authorName, authorNip, authorSatker, authorRank, topicTitle, problemStatement, desiredOutcome } = body

    if (!topicTitle || !authorSatker) {
      return NextResponse.json({ error: "Judul topik inovasi dan nama satker wajib diisi." }, { status: 400 })
    }

    const systemPrompt = `Anda adalah Widyaiswara Penilai Makalah Diklat Pranata Komputer Kejaksaan RI. Tugas Anda menyusun Proposal Makalah Rencana Aksi Inovasi Satker yang LENGKAP 5 BAB (BAB I s/d BAB V). Format naskah harus padat, jelas, profesional, dan WAJIB MENYELESAIKAN KELIMA BAB HINGGA BAB V KESIMPULAN & REKOMENDASI.`

    const userPrompt = `SUSUNLAH PROPOSAL MAKALAH INOVASI SATKER (5 BAB LENGKAP, PADAT & PROFESIONAL):
- Nama Peserta: ${authorName || "Peserta Pelatihan"}
- NIP: ${authorNip || "19950101 202203 1 002"}
- Jabatan: ${authorRank || "Pranata Komputer Ahli Pertama (Gol. III/a)"}
- Satuan Kerja: ${authorSatker} (Kejaksaan Republik Indonesia)
- Judul Inovasi: "${topicTitle}"
- Masalah Aktual: "${problemStatement || "Keterbatasan otomatisasi sistem dan risiko integritas data operasional"}"
- Dampak Diharapkan: "${desiredOutcome || "Terwujudnya tata kelola SPBE yang terintegrasi, peningkatan akurasi data perkara, efisiensi waktu layanan publik, serta penguatan keamanan informasi satker"}"

STRUKTUR WAJIB LENGKAP 5 BAB:
# 🎓 PROPOSAL RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
## ${topicTitle.toUpperCase()}
**Disusun Oleh:** ${authorName || "Peserta Diklat"} (NIP. ${authorNip || "19950101 202203 1 002"})
**Jabatan:** ${authorRank || "Pranata Komputer Ahli Pertama (Gol. III/a)"}
**Satuan Kerja:** ${authorSatker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN
### 1.1 Latar Belakang
### 1.2 Identifikasi & Rumusan Masalah
### 1.3 Maksud dan Tujuan Inovasi (Jangka Pendek 2 bln, Menengah 4 bln, Panjang 6 bln)
### 1.4 Ruang Lingkup Sistem
### 1.5 Manfaat Inovasi

---

# BAB II: LANDASAN REGULASI & KERANGKA TEORI
### 2.1 Landasan Regulasi Kebijakan (Perpres 95/2018 SPBE, PermenPAN-RB 32/2020 JF Prakom, Perka BPS 2/2021, Instruksi Jaksa Agung)
### 2.2 Landasan Teori TIK & Keamanan Informasi (CIA Triad, Normalisasi Database, CSIRT)

---

# BAB III: RANCANGAN INOVASI & ARSITEKTUR TEKNIS
### 3.1 Gambaran Umum (Analisis As-Is vs To-Be)
### 3.2 Alur Proses Bisnis Terperinci (Tahap 1 Input → Tahap 2 Validasi → Tahap 3 Replikasi DB → Tahap 4 Output Notifikasi)
### 3.3 Spesifikasi Infrastruktur TIK & Keamanan

---

# BAB IV: RENCANA AKSI PENTAHAPAN & MANFAAT
### 4.1 Milestone Rencana Aksi (Bulan 1 s/d Bulan 6)
### 4.2 Analisis Manfaat & Efisiensi Layanan
### 4.3 Mitigasi Risiko & Keberlanjutan Sistem

---

# BAB V: KESIMPULAN & REKOMENDASI
### 5.1 Kesimpulan
### 5.2 Rekomendasi (Kebijakan SOP, Sumber Daya, Replikasi Nasional)`

    try {
      // Generate AI Paper via High-Speed Race
      const result = await generateAiCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2800,
        mustIncludeKeyPhrases: ["BAB V", "BAB 5", "Kesimpulan", "5.1"],
      })

      if (
        result.text &&
        result.text.length > 1000 &&
        (result.text.includes("BAB V") || result.text.includes("BAB 5") || result.text.includes("Kesimpulan"))
      ) {
        return NextResponse.json({
          paper: result.text,
          model: result.model,
          provider: result.provider,
          authorSatker,
          topicTitle,
        })
      }
    } catch {
      // AI generation failed or timed out, fallback to structured generator below
    }

    // Bulletproof Fallback: Generate perfectly structured 5-Chapter Proposal locally
    const fallbackPaper = generateStructuredPaperFallback(body)
    return NextResponse.json({
      paper: fallbackPaper,
      model: "academic-builder-v3",
      provider: "fallback",
      authorSatker,
      topicTitle,
    })
  } catch (err: any) {
    console.error("Paper Generator Error:", err)
    // Emergency Fallback
    const fallbackPaper = generateStructuredPaperFallback({})
    return NextResponse.json({
      paper: fallbackPaper,
      model: "academic-builder-v3",
      provider: "fallback",
    })
  }
}
