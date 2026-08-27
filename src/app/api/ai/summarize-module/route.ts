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

    let text = ""
    if (typeof result === "string") {
      text = result
    } else if (result?.text) {
      text = result.text
    } else if (Array.isArray(result?.pages)) {
      text = result.pages.map((p: any) => p.text || "").join("\n")
    }

    if (text && text.trim().length > 50) {
      // Clean up whitespace while preserving paragraphs
      const clean = text
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
    const systemInstruction = `Anda adalah Widyaiswara Utama dan Pakar Kurikulum Resmi Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena.
Tugas Anda adalah menyusun Rangkuman Bahan Ajar yang sangat terstruktur, komprehensif, akademis, mendalam, dan langsung siap dipelajari oleh peserta diklat.

ATURAN MUTLAK & PENTING:
1. DILARANG KERAS memberikan kalimat pembuka basa-basi, disclaimer, atau peringatan seperti "Saya tidak memiliki akses...", "Peringatan:", "Tanpa informasi tersebut...", atau meminta pengguna mengunggah teks.
2. LANGSUNG sajikan RANGKUMAN LENGKAP & MENDALAM per bab dengan format Markdown yang rapi (#, ##, ###, bullet points •, dan penomoran).
3. Kupas tuntas konsep utama, dasar hukum SPBE (Perpres 95/2018), PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021, arsitektur teknis, implementasi praktis di lingkungan Kejaksaan RI, dan tips uji kompetensi.`

    let userPrompt = ""

    if (extractedPdfText && extractedPdfText.length > 100) {
      // Send up to 18,000 characters of the real PDF text
      const truncatedText = extractedPdfText.slice(0, 18000)

      userPrompt = `Berikut adalah KUTIPAN TEKS ASLI DARI DOKUMEN BERKAS PDF MODUL (Total ${extractedPdfText.length} karakter):
=====================================================
JUDUL MODUL: ${title}
MATA KULIAH: ${subject_name || "Diklat Fungsional Prakom"}
BERKAS: ${file_name}

TEKS DOKUMEN PDF:
${truncatedText}
=====================================================

PETUNJUK FORMAT PENULISAN:
- Gunakan format hierarki heading (#, ##, ###), bullet point tebal (• **Poin:** Uraian), dan penomoran rapi agar mudah dibaca sebagai catatan belajar.
- Jangan gunakan tabel markdown pipa (| col | col |).

TUGAS ANDA:
Susunlah RANGKUMAN BELAJAR LENGKAP & MENDALAM DARI DOKUMEN ASLI DI ATAS:

# 📘 1. IDENTITAS & RUANG LINGKUP MODUL
• **Judul Modul:** ${title}
• **Tahapan & Topik:** ${subject_name || "Diklat Fungsional Prakom 120 JP"}
• **Dasar Regulasi Terkait:** PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021, Perpres No. 95/2018 (SPBE)
• **Tujuan Pembelajaran:** (Uraikan tujuan umum & kompetensi yang dicapai)

# 📖 2. BEDAH MATERI BAB PER BAB (MENDALAM & TUNTAS)
(Uraikan secara detail tiap bab, teori, formula, tahapan SDLC/Teknis, dan penjelasan penting yang terdapat dalam dokumen)

# 🎯 3. KONSEP KUNCI & INDIKATOR HASIL BELAJAR
• **Konsep Inti:** (Daftar istilah dan konsep teknis yang wajib dikuasai)
• **Parameter Keberhasilan:** (Indikator penguasaan materi)

# 🏢 4. PENERAPAN PRAKTIS DI KEJAKSAAN RI
• **Studi Kasus & Implementasi Satker:** (Penerapan modul ini di Kejati, Kejari, maupun Badiklat)

# 💡 5. KISI-KISI UJIAN MOOC & TIPS KELULUSAN
• **Poin Kritis / Potensi Soal Ujian:** (Poin-poin penting yang sering menjadi materi uji kompetensi)
• **Rekomendasi Tindak Lanjut Belajar:** (Langkah praktis peserta)`
    } else {
      userPrompt = `Susunlah RANGKUMAN KOMPREHENSIF & MENDALAM BAB PER BAB untuk materi modul Diklat Fungsional Pranata Komputer Kejaksaan RI:

- Judul Modul: ${title}
- Tahapan Diklat: ${subject_name || "Tahap 1 • MOOC"}
- Minggu Pertemuan: Ke-${week_number || 1}
- Topik / Deskripsi: ${description || "Materi Pembelajaran Kurikulum Fungsional Prakom 120 JP"}

STRUKTUR RANGKUMAN YANG HARUS ANDA BUAT (LANGSUNG SAJIKAN MATERI TANPA DISCLAIMER/PERINGATAN):

# 📘 1. IDENTITAS & RUANG LINGKUP MODUL
• **Judul Modul:** ${title}
• **Mata Kuliah / Tahap:** ${subject_name || "Diklat Fungsional Prakom 120 JP"}
• **Dasar Hukum & Regulasi:** PermenPAN-RB No. 32/2020 (Jabatan Fungsional Pranata Komputer), Perka BPS No. 2/2021 (Petunjuk Teknis Penilaian Angka Kredit Prakom), PermenPAN-RB No. 1/2023, Perpres No. 95/2018 (SPBE).
• **Tujuan Pembelajaran:** (Uraikan tujuan dan kompetensi utama yang ditargetkan)

# 📖 2. BEDAH MATERI BAB PER BAB (KOMPREHENSIF)
(Kupas tuntas seluruh bab penting terkait "${title}", mulai dari konsep dasar, arsitektur teknis, metodologi, standar tata kelola TI, hingga operasional sistem)

# 🎯 3. KONSEP KUNCI & GLOSARIUM TEKNIS
• **Konsep Utama:** (Definisi dan uraian konsep penting)
• **Standar Teknis:** (Standar industri dan tata kelola SPBE)

# 🏢 4. IMPLEMENTASI PADA SATUAN KERJA KEJAKSAAN RI
• **Penerapan Sistem:** (Bagaimana materi ini diimplementasikan pada operasional penegakan hukum dan manajemen perkara di Kejaksaan)

# 💡 5. KISI-KISI UJIAN MOOC & TIPS KELULUSAN
• **Fokus Uji Kompetensi:** (Topik-topik penting yang wajib dikuasai untuk kelulusan)
• **Strategi Belajar Peserta:** (Langkah konkret pemahaman materi)`
    }

    // 3. Call Groq API with groq/compound-mini
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
            temperature: 0.3,
            max_tokens: 3000,
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

    const fallbackSummary = `# 📘 RANGKUMAN MODUL: ${title.toUpperCase()}\n\n` +
      `• **Nama Berkas:** ${file_name}\n` +
      `• **Tahapan Diklat:** ${subject_name || "Diklat Fungsional Prakom 120 JP"}\n` +
      `• **Regulasi Terkait:** PermenPAN-RB No. 32/2020 & Perpres No. 95/2018 (SPBE)\n\n` +
      `# 📖 Intisari Pokok Materi:\n` +
      (extractedPdfText ? extractedPdfText.slice(0, 3000) + "\n\n*(Dokumen resmi bahan ajar telah dianalisis sistem)*" : "Dokumen bahan ajar resmi Diklat Fungsional Pranata Komputer Kejaksaan RI.")

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
