import { NextRequest, NextResponse } from "next/server"
import { generateAiCompletion } from "@/lib/ai-provider"
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security"

interface GeneratedQuestion {
  id: number
  category: any
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const FALLBACK_AI_QUESTIONS: Record<string, GeneratedQuestion[]> = {
  default: [
    {
      id: 9001,
      category: "Overview & Administrasi Prakom",
      question: "Berdasarkan PermenPAN-RB No. 1 Tahun 2023, bagaimanakah mekanisme perolehan Angka Kredit bagi Pejabat Fungsional Pranata Komputer?",
      options: [
        "Wajib mengumpulkan butir DUPAK fisik setiap semester ke instansi pembina BPS",
        "Dikonversi secara otomatis dari evaluasi predikat kinerja tahunan (SKP)",
        "Hanya dihitung dari jumlah sertifikat pelatihan dan uji kompetensi eksternal",
        "Ditentukan berdasarkan masa kerja (senioritas) tanpa memandang capaian kinerja"
      ],
      correctIndex: 1,
      explanation: "PermenPAN-RB No. 1/2023 mengubah paradigma DUPAK konvensional menjadi Konversi Predikat Kinerja (SKP). Predikat 'Sangat Baik' bernilai 150%, 'Baik' 100%, dan 'Cukup' 75% dari koefisien tahunan."
    },
    {
      id: 9002,
      category: "Audit TI & IT Enterprise",
      question: "Manakah di bawah ini yang merupakan 4 domain utama Arsitektur SPBE sesuai Perpres No. 95 Tahun 2018?",
      options: [
        "Kebijakan, Tata Kelola, Manajemen, dan Layanan SPBE",
        "Hardware, Software, Brainware, dan Netware",
        "Frontend, Backend, Database, dan DevOps",
        "Perencanaan, Pengadaan, Pemeliharaan, dan Penghapusan"
      ],
      correctIndex: 0,
      explanation: "Perpres 95/2018 menetapkan 4 domain arsitektur SPBE: Domain Kebijakan SPBE, Domain Tata Kelola SPBE, Domain Manajemen SPBE, dan Domain Layanan SPBE."
    },
    {
      id: 9003,
      category: "Sistem Informasi & SDLC",
      question: "Dalam implementasi replikasi dan query tuning database PostgreSQL untuk sistem perkara, teknik apa yang paling efektif mempercepat pencarian teks nomor perkara?",
      options: [
        "Menonaktifkan autovacuum pada tabel perkara",
        "Membuat B-Tree index atau GIN index pada kolom pencarian teks",
        "Melakukan SELECT * secara berkala tanpa klausa WHERE",
        "Mengubah semua tipe data integer menjadi VARCHAR"
      ],
      correctIndex: 1,
      explanation: "Penggunaan B-Tree index untuk pencarian presisi (equality) atau GIN index untuk pencarian teks penuh (full-text search) secara drastis menurunkan cost eksekusi query dari Sequential Scan menjadi Index Scan."
    },
    {
      id: 9004,
      category: "Manajemen Layanan ITIL 4",
      question: "Dalam kerangka kerja ITIL 4, komponen apa yang mendefinisikan bagaimana seluruh aktivitas organisasi bekerja bersama untuk memfasilitasi penciptaan nilai (value co-creation)?",
      options: [
        "Service Value System (SVS)",
        "Service Level Agreement (SLA)",
        "Configuration Management Database (CMDB)",
        "Standard Operating Procedure (SOP)"
      ],
      correctIndex: 0,
      explanation: "Service Value System (SVS) dalam ITIL 4 menggambarkan bagaimana seluruh komponen dan aktivitas organisasi bekerja sebagai satu sistem untuk memfasilitasi penciptaan nilai (value co-creation)."
    },
    {
      id: 9005,
      category: "Audit TI & IT Enterprise",
      question: "Dalam penanganan insiden siber pada unit CSIRT instansi pemerintah, langkah pertama yang paling krusial setelah deteksi insiden adalah:",
      options: [
        "Menghapus seluruh hard disk server utama tanpa membuat snapshot",
        "Identifikasi cakupan dan isolasi/kontainmen aset yang terinfeksi agar malware tidak menyebar",
        "Mengumumkan insiden ke media sosial publik sebelum verifikasi internal",
        "Mematikan seluruh aliran listrik gedung kantor secara mendadak"
      ],
      correctIndex: 1,
      explanation: "Tahap kontainmen (containment/isolasi) bertujuan membatasi kerusakan dan mencegah penyebaran malware ke segmen jaringan lain seraya mempertahankan bukti forensik digital (volatile memory/logs)."
    }
  ]
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)
    const rateLimit = checkRateLimit(clientIp, "ai_quiz_gen", 20, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: `Terlalu banyak permintaan pembuatan kuis. Silakan tunggu ${rateLimit.retryAfter} detik.` },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { topic = "Umum Prakom", difficulty = "sedang", count = 5, userApiKey } = body

    const cleanTopic = sanitizeInput(topic, 120) || "Regulasi SPBE dan Tata Kelola TI Prakom"

    const systemPrompt = `Anda adalah "AI Exam Master & Widyaiswara Pusdiklat BPS & Kejaksaan RI".
Tugas Anda adalah menghasilkan soal latihan pilihan ganda (Multiple Choice Questions) berkualitas tinggi, akurat, profesional, dan menantang untuk peserta Diklat Fungsional Pranata Komputer (Batch 3).

Topik: "${cleanTopic}"
Tingkat Kesulitan: ${difficulty}
Jumlah Soal: ${count}

FORMAT KELUARAN WAJIB:
Anda WAJIB memberikan respon HANYA berupa JSON murni (valid JSON format) tanpa teks pengantar atau penutup. Format JSON:
[
  {
    "question": "Kalimat pertanyaan yang jelas dan berbasis kasus/regulasi...",
    "options": [
      "Pilihan A",
      "Pilihan B",
      "Pilihan C",
      "Pilihan D"
    ],
    "correctIndex": 0,
    "explanation": "Penjelasan mendalam mengapa opsi tersebut benar beserta dasar regulasi/teknisnya."
  }
]

ATURAN SOAL:
1. Soal harus relevan dengan tugas Pranata Komputer (SPBE, Jaringan, Database, Audit TI, Keamanan Siber CSIRT, ITIL 4, DUPAK/SKP).
2. Opsi jawaban harus terdiri dari tepat 4 pilihan (A, B, C, D) yang masuk akal dan memiliki pengecoh yang baik.
3. correctIndex berupa integer 0, 1, 2, atau 3 (sesuai indeks array options).
4. Penjelasan (explanation) harus edukatif dan informatif.`

    const completion = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Buatkan ${count} soal pilihan ganda tentang "${cleanTopic}" dalam format JSON murni.` },
      ],
      temperature: 0.4,
      max_tokens: 2200,
      userApiKey,
    })

    let rawText = completion.text.trim()
    // Strip markdown json wrappers
    if (rawText.includes("```json")) {
      rawText = rawText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim()
    } else if (rawText.includes("```")) {
      rawText = rawText.replace(/```\s*/gi, "").replace(/```\s*$/gi, "").trim()
    }

    let parsedQuestions: any[] = []
    try {
      parsedQuestions = JSON.parse(rawText)
      if (!Array.isArray(parsedQuestions)) {
        // Maybe wrapped in an object like { questions: [...] }
        if (Array.isArray((parsedQuestions as any).questions)) {
          parsedQuestions = (parsedQuestions as any).questions
        }
      }
    } catch {
      // JSON parse error on AI response, use fallback
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return NextResponse.json({
        success: true,
        topic: cleanTopic,
        isFallback: true,
        questions: FALLBACK_AI_QUESTIONS.default,
      })
    }

    // Validate and format questions
    const formatted: GeneratedQuestion[] = parsedQuestions.slice(0, count).map((q, idx) => {
      const opts = Array.isArray(q.options) && q.options.length >= 4
        ? q.options.slice(0, 4).map(String)
        : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"]

      const cIdx = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < 4
        ? q.correctIndex
        : 0

      return {
        id: Date.now() + idx,
        category: "Sistem Informasi & SDLC",
        question: String(q.question || `Pertanyaan seputar ${cleanTopic} #${idx + 1}`),
        options: opts,
        correctIndex: cIdx,
        explanation: String(q.explanation || "Jawaban didasarkan pada pedoman teknis dan tata kelola TI instansi."),
      }
    })

    return NextResponse.json({
      success: true,
      topic: cleanTopic,
      model: completion.model,
      provider: completion.provider,
      questions: formatted,
    })
  } catch (err: any) {
    console.error("[Generate Quiz Error]:", err)
    return NextResponse.json(
      {
        success: true,
        topic: "Prakom Standar",
        isFallback: true,
        questions: FALLBACK_AI_QUESTIONS.default,
      },
      { status: 200 }
    )
  }
}
