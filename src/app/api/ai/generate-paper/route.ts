import { NextRequest, NextResponse } from "next/server"
import { generateAiCompletion } from "@/lib/ai-provider"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Bulletproof 5-Chapter Academic Paper Draft Builder (Standar Format Pusdiklat Kejaksaan RI)
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

  return `# 🎓 DRAF PROPOSAL RENCANA AKSI INOVASI TIK
## ${title.toUpperCase()}

**Disusun Oleh:** ${name} (NIP. ${nip})
**Jabatan / Golongan:** ${rank}
**Satuan Kerja:** ${satker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN

### 1.1 Latar Belakang
Transformasi digital di lingkungan Kejaksaan Republik Indonesia merupakan pilar strategis dalam mewujudkan tata kelola birokrasi yang modern, transparan, dan akuntabel sesuai amanat Perpres Sistem Pemerintahan Berbasis Elektronik (SPBE). Setiap satuan kerja dituntut untuk menghadirkan layanan berbasis teknologi informasi yang mampu menunjang tugas pokok fungsi penegakan hukum dan pelayanan publik.

Kondisi faktual saat ini di ${satker} menunjukkan bahwa pengelolaan administrasi dan data perkara masih membutuhkan penguatan otomasi. Adanya inovasi "${title}" dirancang untuk menjawab tantangan operasional tersebut, mengeliminasi risiko kehilangan data, mempercepat proses birokrasi, serta mewujudkan transparansi layanan prima kepada masyarakat.

### 1.2 Identifikasi & Rumusan Masalah
Berdasarkan analisis kondisi kerja eksisting di ${satker}, dirumuskan permasalahan pokok sebagai berikut:
• **Aspek Efisiensi Operasional:** ${problem}, yang berdampak pada lambatnya waktu pemrosesan berkas kerja.
• **Aspek Integritas Data & Keamanan:** Prosedur pencadangan dan sinkronisasi data yang belum terpusat secara otomatis sehingga rentan terhadap risiko kegagalan sistem.
• **Aspek Kualitas Layanan Publik:** Keterbatasan akses monitoring informasi real-time bagi pimpinan dan pihak berkepentingan.

### 1.3 Maksud dan Tujuan Inovasi
• **Maksud:** Merancang dan mengimplementasikan "${title}" sebagai solusi modernisasi layanan administrasi TIK di ${satker}.
• **Tujuan Jangka Pendek (2 Bulan):** Penyusunan analisis kebutuhan, perancangan skema database, pembuatan modul inti, serta pengujian internal (*alpha testing*).
• **Tujuan Jangka Menengah (4 Bulan):** Pelaksanaan User Acceptance Testing (UAT), sosialisasi pengguna, serta penerbitan SOP baku oleh pimpinan satker.
• **Tujuan Jangka Panjang (6 Bulan & Seterusnya):** Integrasi sistem ke ekosistem Satu Data Kejaksaan RI dan standarisasi replikasi untuk satker lain.

### 1.4 Ruang Lingkup Sistem
• **Batasan Pengguna (User Scope):** Administrator TIK Satker, Operator Seksi/Bidang, Pimpinan/Kajari, serta Publik/Pemohon Layanan.
• **Batasan Fungsional & Teknis:** Otomasi alur data, validasi logika input, pencadangan basis data otomatis, dan dashboard analitik.

### 1.5 Manfaat Inovasi
• **Bagi Satuan Kerja (${satker}):** Peningkatan efisiensi waktu kerja pegawai, akurasi data administrasi, dan akselerasi Indeks SPBE Satker.
• **Bagi Institusi Kejaksaan RI:** Penguatan Satu Data Kejaksaan Agung RI serta kemudahan audit kepatuhan TIK.
• **Bagi Masyarakat:** Layanan publik yang lebih cepat, transparan, akurat, dan bebas dari pungutan liar.

---

# BAB II: LANDASAN REGULASI & KERANGKA TEORI

### 2.1 Landasan Regulasi Kebijakan
Inovasi ini disusun berdasarkan landasan yuridis kedinasan:
• **Peraturan Presiden No. 95 Tahun 2018** tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).
• **Peraturan Presiden No. 132 Tahun 2022** tentang Arsitektur SPBE Nasional.
• **PermenPAN-RB No. 32 Tahun 2020** tentang Jabatan Fungsional Pranata Komputer.
• **Peraturan Kepala BPS No. 2 Tahun 2021** tentang Petunjuk Teknis Penilaian Angka Kredit Pranata Komputer.
• **Instruksi Jaksa Agung RI** mengenai Percepatan Transformasi Digital dan Keterpaduan Layanan Kejaksaan RI.

### 2.2 Landasan Teori TIK & Keamanan Informasi
• **Prinsip CIA Triad & High Availability:** Menjamin Kerahasiaan (*Confidentiality*), Keutuhan (*Integrity*), dan Ketersediaan (*Availability*) layanan TIK secara berkelanjutan (24/7).
• **Tata Kelola Basis Data Relasional & Normalisasi:** Penerapan kaidah normalisasi 3NF dan strategi indexing B-Tree untuk kecepatan query data.
• **Standar Keamanan Siber & CSIRT:** Penerapan Role-Based Access Control (RBAC), sanitasi input terhadap serangan siber, dan kepatuhan ISO/IEC 27001.

---

# BAB III: RANCANGAN INOVASI & ARSITEKTUR TEKNIS

### 3.1 Gambaran Umum (Analisis As-Is vs To-Be)
• **Kondisi Eksisting (As-Is):** Pengelolaan data masih manual/semi-otomatis, risiko human-error tinggi, dan rekapitulasi data membutuhkan waktu lama.
• **Kondisi Target (To-Be):** Alur kerja terotomatisasi secara digital, validasi sistem terpusat, backup otomatis, dan laporan tersaji real-time.

### 3.2 Alur Proses Bisnis Terperinci
• **Tahap 1 (Inisiasi & Input Transaksi):** Penginputan data oleh operator melalui antarmuka web terenkripsi SSL/TLS.
• **Tahap 2 (Validasi Data & Eksekusi Otomatis):** Verifikasi format data, pencegahan duplikasi, dan pemrosesan otomatis di backend.
• **Tahap 3 (Penyimpanan & Replikasi Basis Data):** Penyimpanan transaksi ke database utama dengan audit logging dan pencadangan instan.
• **Tahap 4 (Output Layanan & Diseminasi):** Penerbitan laporan analitik pimpinan dan pengiriman notifikasi status secara real-time.

### 3.3 Spesifikasi Infrastruktur TIK & Keamanan
• **Spesifikasi Server & Jaringan:** VPS / On-Premise Linux Ubuntu Server 22.04 LTS, RAM 8-16 GB, Storage SSD NVMe RAID-1, IP Statis Dedicated.
• **Spesifikasi Basis Data & Backend:** DBMS PostgreSQL v15 / MySQL 8.0 Enterprise, Backend NodeJS / Python FastAPI / PHP 8.3.
• **Manajemen Keamanan:** Multi-Factor Authentication (MFA), Hashing password Argon2id / bcrypt, Reverse Proxy Nginx dengan WAF.

---

# BAB IV: RENCANA AKSI PENTAHAPAN & MANFAAT

### 4.1 Milestone Rencana Aksi Pentahapan (6 Bulan)
• **Bulan 1 (Analisis & Perancangan):** Pengumpulan kebutuhan satker, penyusunan DFD/ERD, dan perancangan prototype UI/UX.
• **Bulan 2 (Pengembangan Kode & Basis Data):** Penulisan kode program modul utama, konfigurasi database, dan pembuatan REST API.
• **Bulan 3 (Pengujian Terpadu / Testing):** Pelaksanaan Unit Testing, Penetration Testing, dan User Acceptance Testing (UAT).
• **Bulan 4 (Deployment & Sosialisasi):** Peluncuran sistem di lingkungan produksi, pelatihan pengguna, dan penyusunan User Manual.
• **Bulan 5 (Penetapan Regulasi SOP):** Penerbitan SK Standar Operasional Prosedur (SOP) dari Kepala Kejaksaan Negeri.
• **Bulan 6 (Monitoring & Evaluasi):** Evaluasi kinerja sistem, pengumpulan feedback pengguna, dan penyusunan laporan seminar akhir.

### 4.2 Analisis Manfaat & Efisiensi Layanan
• **Efisiensi Waktu:** Pemangkasan waktu pemrosesan data administrasi hingga 80%.
• **Akurasi Data:** Menghilangkan potensi kesalahan pencatatan dan memastikan jejak audit (*audit trail*) tercatat rapi.
• **Akuntabilitas Satker:** Kemudahan pengawasan langsung bagi pimpinan satker.

### 4.3 Mitigasi Risiko & Keberlanjutan Sistem
• **Mitigasi Daya & Server:** Pemanfaatan UPS Online 3 KVA dan automated monitoring server.
• **Mitigasi Kehilangan Data:** Penjadwalan pencadangan otomatis harian (Automated Cron Backup) terenkripsi ke NAS dan Cloud.
• **Mitigasi Personel:** Dokumentasi teknis terstandarisasi dan kegiatan alih pengetahuan (*knowledge transfer*) berkala.

---

# BAB V: KESIMPULAN & REKOMENDASI

### 5.1 Kesimpulan
Draf rancang bangun inovasi "${title}" di ${satker} merupakan langkah strategis dalam memodernisasi tata kelola TIK di lingkungan Kejaksaan RI. Inovasi ini secara nyata mampu mengatasi kendala ${problem} serta mewujudkan ${outcome} yang akuntabel dan berkelanjutan.

### 5.2 Rekomendasi
• **Rekomendasi Kebijakan:** Penetapan Standar Operasional Prosedur (SOP) resmi melalui SK Kepala Satuan Kerja.
• **Rekomendasi Sumber Daya:** Alokasi anggaran pemeliharaan perangkat TIK, upgrade lisensi keamanan, dan bandwidth jaringan.
• **Rekomendasi Replikasi:** Pengintegrasian sistem ke aplikasi nasional Kejaksaan Agung RI agar dapat direplikasi ke satker lain di seluruh Indonesia.`
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
