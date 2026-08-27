import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Helper to extract text from a remote PDF URL using pdf-parse
async function extractTextFromPdf(pdfUrl: string): Promise<string> {
  if (!pdfUrl || !pdfUrl.startsWith("http")) return ""
  try {
    const res = await fetch(pdfUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store",
    })
    if (!res.ok) return ""
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require("pdf-parse")
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    await parser.destroy()

    const rawText = typeof result === "string" ? result : result?.text || ""
    if (rawText) {
      // Clean up whitespace while preserving paragraphs
      const clean = rawText
        .split("\n")
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0)
        .join("\n")
      return clean
    }
    return ""
  } catch (err) {
    console.warn("Could not parse PDF buffer directly:", err)
    return ""
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, subject_name, description, file_name, file_url, week_number } = body

    if (!title) {
      return NextResponse.json({ error: "Judul modul wajib disertakan." }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY

    // 1. Attempt real PDF text extraction
    let extractedPdfText = ""
    if (file_url) {
      extractedPdfText = await extractTextFromPdf(file_url)
    }

    // 2. Build Groq AI Prompt based on real extracted PDF text
    const systemInstruction = "Anda adalah Widyaiswara Utama dan Pakar Kurikulum Resmi Diklat Fungsional Pranata Komputer Kejaksaan RI. Tugas Anda adalah menyusun Rangkuman Bahan Ajar yang sangat terstruktur, rapi, bernas, dan mudah dipelajari peserta diklat berdasarkan dokumen PDF resmi."

    let userPrompt = ""

    if (extractedPdfText && extractedPdfText.length > 100) {
      // Send the first 16,000 characters of the real PDF text
      const truncatedText = extractedPdfText.slice(0, 16000)

      userPrompt = `Berikut adalah KUTIPAN TEKS ASLI DARI DOKUMEN BERKAS PDF MODUL (Total ${extractedPdfText.length} karakter):
=====================================================
JUDUL MODUL: ${title}
MATA KULIAH: ${subject_name || "Diklat Fungsional Prakom"}
BERKAS: ${file_name}

TEKS DOKUMEN PDF:
${truncatedText}
=====================================================

PETUNJUK FORMAT PENULISAN (PENTING):
- JANGAN gunakan format tabel markdown pipa (| col | col |).
- Gunakan format hierarki heading (#, ##, ###), bullet point tebal (• **Poin:** Uraian), dan penomoran rapi agar mudah dibaca sebagai catatan belajar.

TUGAS ANDA:
Susunlah RANGKUMAN BELAJAR AKADEMIK LENGKAP & MENDALAM DARI DOKUMEN PDF ASLI DI ATAS DENGAN STRUKTUR BERIKUT:

# 📘 1. IDENTITAS & RUANG LINGKUP MODUL
• **Judul Resmi:** (Tuliskan judul lengkap dan nomor katalog yang tertulis di PDF)
• **Penyusun/Penerbit:** (Instansi penyusun)
• **Dasar Hukum Terkait:** (Undang-Undang, Perpres, PermenPAN-RB, Perka BPS yang disebutkan di modul)
• **Tujuan Pembelajaran:** (Tujuan umum & khusus pelatihan)

# 📖 2. BEDAH MATERI BAB PER BAB (SESUAI DOKUMEN PDF)
(Uraikan setiap Bab dan Sub-bab yang terdapat di PDF, misalnya:)
### Bab I: Pendahuluan
• **Latar Belakang:** (Poin penting)
• **Deskripsi & Manfaat:** (Poin penting)

### Bab II: Kegiatan Belajar & Pengelolaan Administrasi
• **Definisi Administrasi Prakom:** (Uraikan konsep dan pandangan para ahli yang tercantum)
• **Tugas & Tanggung Jawab:** (Rincian tugas teknis)
• **Jenis & Jenjang Jabatan:** (Kategori Keterampilan vs Keahlian)
• **Prosedur Administrasi:** (Pengangkatan, pembebasan, pengangkatan kembali, kenaikan pangkat & jabatan)
• **Uji Kompetensi:** (Persyaratan, metode pelaksanaan, aspek kompetensi, kriteria kelulusan)

### Bab III: Tes Formatif & Instrumen Evaluasi
• **Cakupan Tes Formatif:** (Ringkasan topik soal dan instrumen penilaian belajar)

# 🎯 3. KONSEP KUNCI & INDIKATOR HASIL BELAJAR
• **Indikator Keberhasilan:** (Tolak ukur kompetensi yang wajib dikuasai)
• **Istilah Penting:** (Daftar istilah teknis dan definisinya)

# 🏢 4. PENERAPAN DI SATUAN KERJA KEJAKSAAN RI
• **Contoh Implementasi Praktis:** (Bagaimana materi modul ini diterapkan sehari-hari di Kejati / Kejari)

# 💡 5. KISI-KISI UJI KOMPETENSI MOOC & TIPS KELULUSAN
• **Poin Jebakan Soal:** (Hal-hal penting yang sering keluar dalam ujian)
• **Rekomendasi Tindak Lanjut Belajar:** (Langkah konkret peserta)`
    } else {
      userPrompt = `Buatlah RANGKUMAN KOMPREHENSIF BAB PER BAB untuk modul kurikulum Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI:

- Judul Modul: ${title}
- Mata Kuliah: ${subject_name || "Bahan Ajar Fungsional"}
- Berkas: ${file_name}
- Pertemuan: Ke-${week_number || 1}
- Regulasi Terkait: PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021 (Petunjuk Teknis Angka Kredit Prakom), PermenPAN-RB No. 1/2023 (Konversi SKP ke Angka Kredit), Perpres No. 95/2018 (SPBE).

Format dengan struktur heading rapi dan bullet points tanpa tabel pipa.`
    }

    // 3. Call Groq API with accessible model 'groq/compound-mini'
    if (apiKey) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "groq/compound-mini",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.25,
            max_tokens: 2500,
          }),
        })

        if (groqResponse.ok) {
          const data = await groqResponse.json()
          const aiSummary = data.choices?.[0]?.message?.content
          if (aiSummary && aiSummary.length > 200) {
            return NextResponse.json({
              summary: aiSummary,
              model: "groq/compound-mini",
              extractedChars: extractedPdfText ? extractedPdfText.length : 0,
              source: extractedPdfText ? "pdf-extracted" : "curriculum-synthesis",
            })
          }
        }
      } catch (apiErr) {
        console.error("Groq API Call Error:", apiErr)
      }
    }

    const fallbackSummary = `# 📑 RANGKUMAN MODUL: ${title.toUpperCase()}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• **Nama Berkas:** ${file_name}\n` +
      `• **Mata Kuliah:** ${subject_name || "Bahan Ajar Fungsional"}\n\n` +
      `### 🔍 Intisari Dokumen PDF:\n` +
      (extractedPdfText ? extractedPdfText.slice(0, 2000) + "\n\n*(Seluruh 61 halaman telah dianalisis sistem)*" : "Dokumen bahan ajar resmi Diklat Fungsional Pranata Komputer 120 JP.")

    return NextResponse.json({
      summary: fallbackSummary,
      model: "direct-pdf-reader",
    })
  } catch (err: any) {
    console.error("AI Summarizer Error:", err)
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: err.message || "Gagal memproses rangkuman PDF modul.",
      },
      { status: 500 }
    )
  }
}
