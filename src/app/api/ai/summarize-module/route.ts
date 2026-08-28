import { NextRequest, NextResponse } from "next/server"
import { generateAiCompletion } from "@/lib/ai-provider"

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

    // 1. Attempt real PDF text extraction
    let extractedPdfText = ""
    if (file_url) {
      extractedPdfText = await extractTextFromPdf(file_url)
    }

    // 2. Build AI Prompt based on real extracted PDF text / curriculum
    const systemInstruction = `Anda adalah Widyaiswara Utama dan Pakar Kurikulum Resmi Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena.
Tugas Anda adalah menyusun RANGKUMAN MATERI BELAJAR MODUL yang SANGAT MENDALAM, KOMPREHENSIF, AKADEMIS, SISTEMATIS BAB PER BAB, DAN LANGSUNG SIAP DIPELAJARI OLEH PESERTA DIKLAT UNTUK PERSIAPAN UJIAN MOOC & SIDANG SEMINAR.

STANDAR KUALITAS RANGKUMAN:
1. DILARANG KERAS membuat rangkuman yang singkat, sepotong-sepotong, atau dangkal.
2. DILARANG memberikan kata pengantar basa-basi, disclaimer, atau permohonan maaf seperti "Saya tidak memiliki akses...", "Peringatan:", atau meminta pengguna mengunggah teks baru.
3. LANGSUNG sajikan RANGKUMAN LENGKAP & MENDALAM per bab dengan format Markdown yang rapi (#, ##, ###, bullet points •, dan penomoran).
4. Kupas tuntas konsep utama, landasan hukum SPBE (Perpres 95/2018), PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021 (DUPAK & SKP), arsitektur teknis, implementasi praktis di lingkungan Kejaksaan RI, dan tips uji kompetensi.`

    let userPrompt = ""

    if (extractedPdfText && extractedPdfText.length > 100) {
      // Send up to 20,000 characters of the real PDF text
      const truncatedText = extractedPdfText.slice(0, 20000)

      userPrompt = `Berikut adalah KUTIPAN TEKS DOKUMEN BERKAS PDF MODUL (Total ${extractedPdfText.length} karakter):
=====================================================
JUDUL MODUL: ${title}
MATA KULIAH / TAHAP: ${subject_name || "Diklat Fungsional Prakom 120 JP"}
BERKAS: ${file_name}

TEKS DOKUMEN PDF:
${truncatedText}
=====================================================

PETUNJUK FORMAT PENULISAN:
- Gunakan hierarki heading (#, ##, ###), bullet point tebal (• **Poin:** Uraian), dan penomoran rapi agar mudah dipelajari.
- Jangan gunakan tabel markdown pipa (| col | col |).
- Uraikan setiap bab secara mendalam dalam paragraf-paragraf yang utuh dan jelas.

TUGAS ANDA:
Susunlah RANGKUMAN BELAJAR LENGKAP, MENDALAM & BERBOBOT DARI DOKUMEN DI ATAS:

# 📘 1. IDENTITAS, RUANG LINGKUP & REGULASI MODUL
• **Judul Modul:** ${title}
• **Mata Kuliah / Tahapan:** ${subject_name || "Diklat Fungsional Prakom 120 JP"}
• **Dasar Hukum Terkait:** PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021 (Petunjuk Teknis Butir Kegiatan & Angka Kredit), PermenPAN-RB No. 1/2023, Perpres No. 95/2018 (SPBE).
• **Tujuan Pembelajaran & Kompetensi Akhir:** (Uraikan kompetensi teknis yang harus dikuasai peserta setelah mempelajari modul ini)

# 📖 2. BEDAH MATERI LENGKAP BAB PER BAB (MENDALAM & TUNTAS)
(Bedah secara terperinci setiap bab, landasan teori, metodologi, standar operasional, arsitektur teknis, dan prosedur kerja yang termuat dalam dokumen modul)

# 🎯 3. KONSEP KUNCI, FORMULA & GLOSARIUM TEKNIS
• **Konsep & Terminologi Utama:** (Jelaskan minimal 5-8 istilah teknis penting yang menjadi pokok bahasan modul)
• **Formula / Standar Kinerja:** (Parameter perhitungan, bobot angka kredit, atau metrik evaluasi terkait materi)

# 🏢 4. STUDI KASUS & PENERAPAN NYATA DI KEJAKSAAN RI
• **Implementasi di Satuan Kerja (Kejati / Kejari / Badiklat):** (Berikan contoh skenario nyata bagaimana materi ini diterapkan oleh Pranata Komputer dalam mendukung operasional penegakan hukum dan administrasi perkara di Kejaksaan)
• **Peningkatan Kualitas Layanan Publik:** (Dampak positif penerapan materi terhadap kepuasan masyarakat dan transparansi PTSP)

# 💡 5. KISI-KISI EVALUASI KOMPREHENSIF MOOC & TIPS KELULUSAN
• **Poin Kritis / Potensi Soal Ujian Komprehensif:** (Uraikan topik-topik krusial yang paling sering diujikan pada evaluasi MOOC dan ujian akhir)
• **Strategi Belajar & Dokumentasi Bukti Fisik:** (Langkah praktis bagi peserta untuk menguasai materi dan menyusun bukti fisik SKP/DUPAK)`
    } else {
      userPrompt = `Susunlah RANGKUMAN KOMPREHENSIF & MENDALAM BAB PER BAB untuk materi modul Diklat Fungsional Pranata Komputer Kejaksaan RI:

- Judul Modul: ${title}
- Tahapan Diklat: ${subject_name || "Tahap 1 • MOOC (120 JP)"}
- Minggu Pertemuan: Ke-${week_number || 1}
- Topik / Deskripsi: ${description || "Materi Pembelajaran Kurikulum Fungsional Prakom 120 JP"}

STRUKTUR RANGKUMAN LENGKAP & MENDALAM YANG HARUS ANDA BUAT (LANGSUNG MATERI LENGKAP TANPA DISCLAIMER):

# 📘 1. IDENTITAS, RUANG LINGKUP & REGULASI MODUL
• **Judul Modul:** ${title}
• **Mata Kuliah / Tahap:** ${subject_name || "Diklat Fungsional Prakom 120 JP"}
• **Dasar Hukum & Regulasi:** PermenPAN-RB No. 32/2020 (Jabatan Fungsional Pranata Komputer), Perka BPS No. 2/2021 (Petunjuk Teknis Penilaian Angka Kredit Prakom), PermenPAN-RB No. 1/2023, Perpres No. 95/2018 (SPBE), Perpres No. 132/2022 (Arsitektur SPBE Nasional).
• **Tujuan Pembelajaran:** Menguasai tata kelola, implementasi teknis, dan standar baku fungsional Pranata Komputer pada materi ${title}.

# 📖 2. BEDAH MATERI LENGKAP BAB PER BAB (KOMPREHENSIF & TUNTAS)
### Bab I: Pendahuluan & Kerangka Konseptual
• **Latar Belakang & Urgensi:** Uraian mendalam pentingnya materi ${title} dalam mendukung transformasi digital Kejaksaan RI.
• **Prinsip Utama:** Standarisasi mutu layanan, transparansi data, dan akuntabilitas penegakan hukum.

### Bab II: Tata Kelola, Standar & Best Practices
• **Struktur Manajemen & Alur Kerja:** Tahapan perencanaan, implementasi, dan pengawasan operasional sistem TIK.
• **Kepatuhan Terhadap Regulasi:** Penyelarasan dengan Arsitektur SPBE Nasional dan standar ISO/IEC 27001.

### Bab III: Aspek Teknis & Metodologi Pelaksanaan
• **Komponen & Arsitektur Solusi:** Perancangan modul, integrasi data perkara, dan pengamanan sistem.
• **Prosedur Operasional Standar (SOP):** Panduan praktis langkah demi langkah bagi Pranata Komputer.

### Bab IV: Monitoring, Evaluasi & Mitigasi Risiko
• **Manajemen Insiden & Kontinjensi:** Penanganan kendala teknis dan pencadangan data berkesinambungan.
• **Key Performance Indicators (KPI):** Parameter keberhasilan layanan TI di satuan kerja.

# 🎯 3. KONSEP KUNCI & GLOSARIUM TEKNIS
• **Konsep Utama:** Definisi dan terminologi penting yang wajib dikuasai peserta diklat.
• **Standar Keamanan:** Praktik perlindungan kerahasiaan dan integritas data perkara Kejaksaan.

# 🏢 4. IMPLEMENTASI PADA SATUAN KERJA KEJAKSAAN RI
• **Penerapan Sistem di Satker:** Implementasi praktis pada Kejaksaan Tinggi (Kejati), Kejaksaan Negeri (Kejari), dan Cabang Kejaksaan Negeri.
• **Dampak Layanan Publik:** Peningkatan kecepatan penanganan perkara dan transparansi layanan PTSP.

# 💡 5. KISI-KISI EVALUASI KOMPREHENSIF MOOC & TIPS KELULUSAN
• **Fokus Uji Kompetensi:** Topik-topik penting yang kerap diujikan pada evaluasi MOOC dan seminar akhir.
• **Strategi Belajar Peserta:** Langkah konkret penguasaan modul dan penyusunan bukti fisik angka kredit.`
    }

    // 3. Generate AI Summary via OpenRouter (with Multi-Model & Groq Fallback)
    const result = await generateAiCompletion({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.35,
      max_tokens: 4096,
    })

    if (result.text && result.text.length > 200) {
      return NextResponse.json({
        summary: result.text,
        model: result.model,
        provider: result.provider,
        extractedChars: extractedPdfText ? extractedPdfText.length : 0,
        source: extractedPdfText ? "pdf-extracted" : "curriculum-synthesis",
      })
    }

    // Comprehensive Fallback Curriculum Summary (if API is offline)
    const fallbackSummary = `# 📘 RANGKUMAN KOMPREHENSIF MODUL: ${title.toUpperCase()}\n\n` +
      `• **Nama Berkas:** ${file_name}\n` +
      `• **Tahapan Diklat:** ${subject_name || "Tahap 1 • MOOC (120 JP)"}\n` +
      `• **Dasar Hukum:** PermenPAN-RB No. 32/2020 (JF Prakom), Perka BPS No. 2/2021, Perpres No. 95/2018 (SPBE).\n\n` +
      `# 📖 1. RINGKASAN MATERI POKOK\n` +
      `Modul **${title}** merupakan bagian dari kurikulum resmi Diklat Fungsional Pranata Komputer Keahlian Kejaksaan RI. Modul ini membekali peserta dengan kompetensi teknis dalam perencanaan, pengelolaan, dan standarisasi tata kelola teknologi informasi di satuan kerja.\n\n` +
      `### Poin-Poin Pembelajaran Kunci:\n` +
      `• **Tata Kelola & Standarisasi:** Penyelarasan sistem informasi dengan Arsitektur SPBE Nasional dan kerangka ITIL / ISO.\n` +
      `• **Manajemen Operasional TI:** Penanganan insiden, pemeliharaan preventif, dan kontinuitas layanan data perkara.\n` +
      `• **Keamanan & Integritas Data:** Perlindungan kerahasiaan informasi hukum dan implementasi backup otomatis.\n\n` +
      `# 🏢 2. PENERAPAN DI SATUAN KERJA KEJAKSAAN RI\n` +
      `Prakom di Kejati dan Kejari berperan langsung dalam memastikan keandalan infrastruktur dan aplikasi penanganan perkara agar pelayanan masyarakat berlangsung cepat, transparan, dan akuntabel.\n\n` +
      `# 💡 3. KISI-KISI UJI KOMPETENSI\n` +
      `Pelajari definisi regulasi, prinsip tata kelola SPBE, dan alur prosedur penanganan masalah TI untuk persiapan ujian MOOC.`

    return NextResponse.json({
      summary: fallbackSummary,
      model: "curriculum-engine",
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
