import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, subject_name, description, file_name, week_number } = body

    if (!title) {
      return NextResponse.json({ error: "Judul modul wajib disertakan." }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY

    // Fallback template builder if no API key or offline
    const generateFallbackSummary = () => {
      return `📌 *RANGKUMAN MATERI AI: ${title.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📖 *Mata Kuliah:* ${subject_name || "Bahan Ajar Fungsional Prakom"}
📅 *Tahap/Pertemuan:* Pertemuan ${week_number || 1}
📄 *Berkas:* ${file_name || "Modul PDF 120 JP"}

🎯 *1. RINGKASAN INTI & TUJUAN PEMBELAJARAN:*
• Memahami regulasi, kerangka kerja teknis, dan standar tata kelola teknologi informasi di lingkungan instansi Kejaksaan RI.
• Menyelaraskan implementasi infrastruktur, keamanan sistem, dan aplikasi berbasis SPBE (Perpres 95/2018).

🔑 *2. KONSEP & TEORI KUNCI:*
• **Tata Kelola & Standarisasi:** Penyusunan SOP Pengelolaan TI, manajemen hak akses, dan kepatuhan regulasi data.
• **Arsitektur Sistem & Database:** Penataan kamus data terpadu, interoperabilitas antar-aplikasi perkara, dan replikasi basis data.
• **Keamanan Informasi:** Prinsip CIA Triad (Confidentiality, Integrity, Availability) dan kesiapsiagaan insiden siber (CSIRT).

🏢 *3. PENERAPAN DI SATUAN KERJA (KEJATI/KEJARI):*
• Otomatisasi backup berkala data perkara dan log database server satker.
• Dokumentasi logbook teknis sebagai bukti fisik pemeliharaan jaringan & perangkat keras.
• Monitoring ketersediaan layanan publik (website, CMS tilang, PTSP).

📝 *4. POIN PENTING UJI KOMPETENSI & ANGKA KREDIT (AK):*
• Butir kegiatan yang relevan dapat diklaim dalam DUPAK Prakom Ahli Pertama (12.5 AK/thn) atau Ahli Muda (25 AK/thn).
• Pastikan menyimpan Surat Perintah Tugas (SPT), dokumentasi logbook, dan laporan yang disahkan atasan.

💡 _Catatan AI ini siap digunakan sebagai bahan belajar mandiri dan persiapan tugas diklat._`
    }

    if (!apiKey) {
      return NextResponse.json({
        summary: generateFallbackSummary(),
        model: "offline-template",
      })
    }

    const prompt = `Anda adalah AI Widyaiswara & Pakar Kurikulum Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI.
Tugas Anda adalah membuat RANGKUMAN BELAJAR LENGKAP, TERSTRUKTUR, DAN PRAKTIS untuk modul berikut:

- Judul Modul: ${title}
- Mata Kuliah: ${subject_name || "Bahan Ajar Fungsional"}
- Pertemuan: Ke-${week_number || 1}
- Deskripsi: ${description || "Modul kurikulum 120 JP"}
- Nama Berkas: ${file_name || "Dokumen PDF"}

SUSUN RANGKUMAN DALAM FORMAT BERIKUT (Gunakan Markdown rapi, bullet points, dan emoji yang relevan):
1. 📌 **Ringkasan Inti & Tujuan Pembelajaran**
2. 🎯 **Konsep & Istilah Kunci yang Wajib Dipahami**
3. 💡 **Contoh Implementasi Nyata di Satker Kejaksaan (Kejati/Kejari/Badiklat)**
4. 📝 **Poin Penting untuk Uji Kompetensi MOOC & Angka Kredit Prakom (PermenPAN-RB 32/2020)**
5. 🛠️ **Rekomendasi Tindak Lanjut & Persiapan Tugas Mandiri**

Buat rangkuman yang jelas, padat, berbobot, dan langsung siap dipakai peserta dalam catatan belajarnya!`

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Anda adalah asisten AI kurikulum resmi Diklat Pranata Komputer Kejaksaan RI." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    })

    if (!groqResponse.ok) {
      // Fallback if rate limit or groq issue
      return NextResponse.json({
        summary: generateFallbackSummary(),
        model: "fallback",
      })
    }

    const data = await groqResponse.json()
    const summary = data.choices?.[0]?.message?.content || generateFallbackSummary()

    return NextResponse.json({
      summary,
      model: data.model || "llama-3.3-70b-versatile",
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: err.message || "Gagal membuat rangkuman AI.",
      },
      { status: 500 }
    )
  }
}
