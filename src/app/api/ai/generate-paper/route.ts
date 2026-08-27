import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { authorName, authorNip, authorSatker, authorRank, topicTitle, problemStatement, desiredOutcome } = body

    if (!topicTitle || !authorSatker) {
      return NextResponse.json({ error: "Judul topik inovasi dan nama satker wajib diisi." }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY

    const systemPrompt = `Anda adalah Widyaiswara Pembimbing Utama Penulisan Makalah Proyek Akhir / Seminar Rencana Aksi Inovasi Pelatihan Fungsional Pranata Komputer (Batch 3) Kejaksaan RI.
Tugas Anda adalah menyusun PROPOSAL MAKALAH RANCANG BANGUN INOVASI TEKNOLOGI INFORMASI SATKER secara LENGKAP, OTENTIK, AKADEMIK, DAN SIAP SEMINAR.`

    const userPrompt = `SUSUNLAH DRAF PROPOSAL MAKALAH INOVASI SATKER LENGKAP 4 BAB DENGAN DATA BERIKUT:

DATA PENYUSUN:
- Nama Peserta: ${authorName || "Peserta Diklat"}
- NIP / Pangkat: ${authorNip || "-"} / ${authorRank || "Pranata Komputer Ahli Pertama"}
- Satuan Kerja: ${authorSatker} (Kejaksaan RI)
- Judul Inovasi / Makalah: "${topicTitle}"
- Masalah Aktual di Satker: "${problemStatement || "Keterbatasan otomatisasi sistem dan kebutuhan peningkatan efisiensi layanan TI di satker"}"
- Hasil yang Diharapkan: "${desiredOutcome || "Peningkatan kualitas tata kelola SPBE dan percepatan layanan publik kejaksaan"}"

STRUKTUR MAKALAH HARUS SANGAT DETAIL, FORMAL, DAN MENCAKUP 4 BAB:

# 🎓 PROPOSAL MAKALAH RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
## ${topicTitle.toUpperCase()}
**Disusun Oleh:** ${authorName || "Peserta"} (NIP. ${authorNip || "-"}) — ${authorSatker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN
### 1.1 Latar Belakang
(Uraikan kondisi umum satker ${authorSatker}, tuntutan modernisasi penegakan hukum digital, dan urgensi transformasi teknologi informasi.)
### 1.2 Identifikasi & Rumusan Masalah
(Sebutkan 3 poin permasalahan konkrit yang dihadapi saat ini di ${authorSatker}.)
### 1.3 Maksud dan Tujuan Inovasi
• **Maksud:** (Penjelasan maksud inovasi)
• **Tujuan Jangka Pendek (2 Bulan):** (Target operasional awal)
• **Tujuan Jangka Panjang (6 Bulan):** (Integrasi berkelanjutan)
### 1.4 Ruang Lingkup dan Batasan Sistem
(Batasan teknis dan pengguna sistem di lingkungan satker.)

---

# BAB II: LANDASAN REGULASI & KERANGKA TEORI
### 2.1 Dasar Hukum dan Regulasi Terkait
• **Peraturan Presiden No. 95 Tahun 2018** tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).
• **Peraturan Presiden No. 132 Tahun 2022** tentang Arsitektur SPBE Nasional.
• **PermenPAN-RB No. 32 Tahun 2020** & **Perka BPS No. 2 Tahun 2021** tentang Jabatan Fungsional Pranata Komputer.
• **Instruksi Jaksa Agung RI** tentang Digitalisasi Manajemen Perkara dan Pelayanan Publik Kejaksaan.
### 2.2 Landasan Teori Arsitektur Sistem & Basis Data
(Uraikan konsep teknis yang digunakan: arsitektur client-server / microservices, keamanan enkripsi data, manajemen basis data relasional, dan integrasi API.)

---

# BAB III: RANCANGAN INOVASI & ARSITEKTUR TEKNIS
### 3.1 Gambaran Umum Inovasi yang Diusulkan
(Deskripsi arsitektur solusi inovasi secara menyeluruh.)
### 3.2 Alur Proses Bisnis & Diagram Alir (Workflow)
(Jelaskan langkah demi langkah proses dari input data, pemrosesan server, hingga output laporan bagi pimpinan/masyarakat.)
### 3.3 Kebutuhan Spesifikasi Infrastruktur TIK
• **Spesifikasi Server / Cloud:** (Kebutuhan RAM, CPU, Storage, OS Linux)
• **Spesifikasi Database & Backend:** (PostgreSQL / MySQL, RESTful API)
• **Aspek Keamanan Sistem:** (Autentikasi akun, Backup otomatis harian, Enkripsi TLS 1.3)

---

# BAB IV: RENCANA AKSI IMPLEMENTASI & MANFAAT
### 4.1 Rencana Aksi Pentahapan (Milestone 6 Bulan)
• **Bulan 1-2 (Tahap Perancangan & Development):** Analisis kebutuhan data satker, skema database, dan pembuatan prototipe.
• **Bulan 3-4 (Tahap Uji Coba & Testing):** Uji penetrasi, sinkronisasi data perkara, dan pelatihan admin/staf satker.
• **Bulan 5-6 (Tahap Peluncuran & Evaluasi):** Penerbitan SK/SOP Inovasi, operasional penuh, dan monitoring berkala.
### 4.2 Analisis Manfaat & Dampak Layanan
• **Bagi Satuan Kerja (${authorSatker}):** Efisiensi waktu kerja, akurasi data perkara, dan peningkatan Indeks SPBE Satker.
• **Bagi Masyarakat / Stakeholder:** Transparansi informasi dan kemudahan akses layanan.
### 4.3 Mitigasi Risiko Teknis & Keberlanjutan
(Antisipasi kendala jaringan, mati listrik, human error, dan prosedur pencadangan data.)

---

# BAB V: KESIMPULAN & REKOMENDASI
### 5.1 Kesimpulan
(Ringkasan komitmen inovasi.)
### 5.2 Rekomendasi
(Dukungan pimpinan Kajati/Kajari dan tindak lanjut anggaran pemeliharaan.)

Gunakan gaya bahasa akademik birokrasi Kejaksaan yang profesional, mantap, dan siap dipertanggungjawabkan di hadapan Penguji Seminar Akhir!`

    if (!apiKey) {
      return NextResponse.json({
        paper: `# 🎓 PROPOSAL MAKALAH INOVASI SATKER\n## ${topicTitle.toUpperCase()}\n**Penyusun:** ${authorName || "Peserta"} (${authorSatker})\n\n*(Server AI sedang offline, silakan periksa konfigurasi API Key)*`,
        model: "offline",
      })
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "groq/compound-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.35,
        max_tokens: 3000,
      }),
    })

    if (!groqResponse.ok) {
      const err = await groqResponse.json().catch(() => ({}))
      return NextResponse.json({
        error: "GROQ_ERROR",
        message: err?.error?.message || "Gagal menghasilkan draf makalah.",
      }, { status: 500 })
    }

    const data = await groqResponse.json()
    const paper = data.choices?.[0]?.message?.content || "Gagal menyusun proposal makalah."

    return NextResponse.json({
      paper,
      model: data.model || "groq/compound-mini",
      authorSatker,
      topicTitle,
    })
  } catch (err: any) {
    console.error("Paper Generator Error:", err)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan pada server generator makalah." },
      { status: 500 }
    )
  }
}
