import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Helper to extract text from a remote PDF URL
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
    console.warn("Could not parse PDF buffer directly, using fallback:", err)
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

    // 2. Build Groq AI Prompt based on whether real PDF text was extracted
    let systemInstruction = "Anda adalah AI Widyaiswara Utama dan Pakar Kurikulum Diklat Fungsional Pranata Komputer Kejaksaan RI."
    let userPrompt = ""

    if (extractedPdfText && extractedPdfText.length > 100) {
      // Limit to first ~12,000 characters of clean text for optimal precision & token speed
      const truncatedText = extractedPdfText.slice(0, 14000)

      userPrompt = `Berikut adalah TEKS ASLI HASIL EKSTRAKSI DOKUMEN PDF MODUL:
=====================================================
JUDUL MODUL: ${title}
MATA KULIAH: ${subject_name || "Diklat Fungsional Prakom"}
NAMA BERKAS: ${file_name}

ISI TEKS DOKUMEN PDF:
${truncatedText}
=====================================================

TUGAS ANDA:
Buatlah RANGKUMAN BELAJAR AKADEMIK YANG SANGAT LENGKAP, MENDALAM, DAN DETAIL BAB PER BAB HANYA BERDASARKAN ISI DOKUMEN PDF ASLI DI ATAS.

SUSUNAN RANGKUMAN HARUS MENCAKUP (Gunakan format Markdown rapi, bullet points, dan penomoran jelas):
1. 📘 **Identitas & Ruang Lingkup Dokumen PDF** (Sebutkan judul, katalog/edisi, dasar hukum/peraturan yang tertulis di dalam PDF, dan sasaran peserta).
2. 📖 **Uraian Rinci Bab per Bab (Sesuai Struktur di PDF)**:
   - Tuliskan setiap Bab / Sub-bab yang dibahas di PDF dan jelaskan materi kuncinya secara gamblang dan padat.
   - Jangan menyederhanakan terlalu pendek, jelaskan mekanisme teknis, alur, dan ketentuannya.
3. 🎯 **Konsep, Istilah Kunci & Definisi Resmi**:
   - Jelaskan istilah-istilah penting, singkatan, dan formula/standar yang dimuat di PDF.
4. 📋 **Ketentuan Bukti Fisik / Prosedur / Standarisasi**:
   - Uraikan aturan administratif, syarat bukti fisik, atau SOP teknis yang diatur dalam modul.
5. 🏢 **Relevansi & Contoh Penerapan di Satker Kejaksaan**:
   - Bagaimana materi dalam PDF ini diterapkan dalam tugas sehari-hari di Kejati/Kejari/Badiklat.
6. 💡 **Poin Penting untuk Uji Kompetensi MOOC & Persiapan Tugas Mandiri**:
   - Hal-hal penting yang sering keluar dalam ujian pemahaman materi modul ini.

Pastikan rangkuman 100% akurat sesuai isi PDF dan sangat bermanfaat untuk catatan belajar peserta!`
    } else {
      // Fallback prompt with title and subject if PDF is purely scanned images
      userPrompt = `Buatlah RANGKUMAN KOMPREHENSIF BAB PER BAB untuk modul kurikulum Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI:

- Judul Modul: ${title}
- Mata Kuliah: ${subject_name || "Bahan Ajar Fungsional"}
- Berkas: ${file_name}
- Pertemuan: Ke-${week_number || 1}
- Deskripsi: ${description || "Modul Kurikulum 120 JP"}
- Regulasi Terkait: PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021 (Petunjuk Teknis Angka Kredit Prakom), PermenPAN-RB No. 1/2023 (Konversi SKP ke Angka Kredit), Perpres No. 95/2018 (SPBE).

Format dengan Markdown rapi:
1. 📘 **Identitas & Ruang Lingkup Modul**
2. 📖 **Rangkuman Rinci Bab per Bab (Bab I Pendahuluan, Bab II Butir Tugas & Ketentuan Teknis, Bab III Standarisasi Bukti Fisik, Bab IV Penilaian PAK, Bab V Penutup)**
3. 📊 **Rumus Perhitungan Angka Kredit & Target Tahunan (Ahli Pertama 12.5 AK, Ahli Muda 25 AK)**
4. 🏢 **Contoh Implementasi Riil di Lingkungan Kejaksaan RI**
5. 💡 **Kisi-kisi Uji Kompetensi MOOC & Tugas Diklat**`
    }

    // 3. Call Groq API
    if (apiKey) {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.35,
          max_tokens: 2500,
        }),
      })

      if (groqResponse.ok) {
        const data = await groqResponse.json()
        const aiSummary = data.choices?.[0]?.message?.content
        if (aiSummary && aiSummary.length > 200) {
          return NextResponse.json({
            summary: aiSummary,
            model: data.model || "llama-3.3-70b-versatile",
            extractedChars: extractedPdfText ? extractedPdfText.length : 0,
            source: extractedPdfText ? "pdf-extracted" : "curriculum-synthesis",
          })
        }
      }
    }

    return NextResponse.json({
      summary: `📑 *RANGKUMAN MODUL: ${title.toUpperCase()}*\n\nMaaf, server AI sedang mengalami beban tinggi. Silakan coba klik tombol '✨ Rangkum dengan AI' sekali lagi dalam beberapa detik.`,
      model: "fallback",
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
