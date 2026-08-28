import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAutoRoadmapData } from "@/lib/roadmap-utils"
import { TEMPLATES_DATA } from "@/lib/templates-data"
import { generateAiCompletion } from "@/lib/ai-provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, userApiKey, userName, userSatker, currentDayNumber = 3 } = body

    // 1. Fetch ALL real-time data from Supabase without low limits
    let rawSchedules: any[] = []
    let tasksContext = "Tugas Aktif: Rangkuman Materi Hari 2 — Manajemen Layanan TI & SPBE (Tenggat: 26 Agustus 2026, 23:59 WIB)"
    let materialsContext = `• [Pertemuan 1] Modul Administrasi Prakom (Bahan Ajar Fungsional) - Tata kelola administrasi dan butir DUPAK (File: administrasi-prakom.pdf)
• [Pertemuan 2] Modul SPBE & Arsitektur Sistem (Tata Kelola TI) - 6 Domain SPBE dan Perpres 95/2018
• [Pertemuan 3] Modul Manajemen Basis Data & Big Data (Database) - Indexing, replikasi data perkara, dan query SQL tuning
• [Pertemuan 4] Modul Jaringan & Cloud Server (Infrastruktur TI) - Konfigurasi Linux server, Nginx, dan backup otomatis
• [Pertemuan 5] Modul Keamanan Informasi & CSIRT (Cybersecurity) - Respon insiden, enkripsi data, dan ISO 27001`
    let announcementsContext = "Tidak ada pengumuman mendesak saat ini."

    try {
      const supabase = await createClient()
      const [taskRes, schedRes, matRes, annRes] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("schedules").select("*").order("start_time", { ascending: true }),
        supabase.from("materials").select("*").order("created_at", { ascending: false }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      ])

      if (schedRes.data && schedRes.data.length > 0) {
        rawSchedules = schedRes.data
      }

      if (taskRes.data && taskRes.data.length > 0) {
        tasksContext = taskRes.data
          .map((t: any) => `• "${t.title}" (${t.subject_name}) | Deadline: ${t.due_date} | Status: ${t.status || "Aktif"} | Rincian: ${t.description || "-"}`)
          .join("\n")
      }

      if (matRes.data && matRes.data.length > 0) {
        materialsContext = matRes.data
          .map((m: any) => `• [Tahap/Pertemuan ${m.week_number || 1}] "${m.title}" (${m.subject_name}) — ${m.description || "Modul Kurikulum 120 JP"} (File: ${m.file_name || "-"})`)
          .join("\n")
      }

      if (annRes.data && annRes.data.length > 0) {
        announcementsContext = annRes.data
          .map((a: any) => `• [${a.is_urgent ? "PENTING" : "INFO"}] "${a.title}" (${a.author || "Pengurus"}): ${a.content}`)
          .join("\n")
      }
    } catch {
      // Supabase offline fallback
    }

    // 2. Build structured 35-Day Roadmap Master Schedule (Token-Efficient & Complete)
    const roadmapData = getAutoRoadmapData(currentDayNumber, rawSchedules)
    const todayDetail = roadmapData.days.find((d) => d.dayNumber === currentDayNumber) || roadmapData.days[0]
    const tomorrowDetail = roadmapData.days.find((d) => d.dayNumber === currentDayNumber + 1) || roadmapData.days[1]

    const all35DaysScheduleText = roadmapData.days
      .map((d) => {
        const sessionSummary =
          d.sessions && d.sessions.length > 0
            ? d.sessions
                .map((s) => `[${s.time} WIB: ${s.title}${s.instructor ? ` (${s.instructor})` : ""}]`)
                .join(" ")
            : "Pembelajaran Mandiri"

        return `• Hari ${d.dayNumber} (${d.dayOfWeek}, ${d.dateStr} | ${d.stageName}): ${sessionSummary}`
      })
      .join("\n")

    const templatesContext = TEMPLATES_DATA
      .map((t) => `• [${t.category}] "${t.title}" (${t.format}) — ${t.description}`)
      .join("\n")

    // 3. System Prompt with Complete Ground Truth & General Knowledge Capabilities
    const systemPrompt = `Anda adalah "AI Widyaiswara & Copilot Prakom 625", asisten AI resmi yang cerdas, serba bisa, dan berpengetahuan komprehensif untuk Pelatihan Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena sekaligus Chatbot AI Pintar Serbaguna.

PROFIL PENGGUNA:
- Nama: ${userName || "Rekan Prakom"}
- Satuan Kerja: ${userSatker || "Kejaksaan RI"}
- Sapa pengguna dengan ramah, santun, profesional, cerdas, dan solutif.

STATUS DIKLAT HARI INI:
- Hari Ini: Hari ke-${currentDayNumber} (${todayDetail.dateStr}, ${todayDetail.dayOfWeek}) — ${todayDetail.stageName} (${todayDetail.stageSubtitle})
- Status Hari Ini: ${todayDetail.status.toUpperCase()}
- Sesi Hari Ini:
${todayDetail.sessions && todayDetail.sessions.length > 0 ? todayDetail.sessions.map((s) => `  * ${s.time} WIB: ${s.title}${s.instructor ? ` (${s.instructor})` : ""}`).join("\n") : "  * Pembelajaran Mandiri MOOC"}
- Jadwal Besok: Hari ke-${currentDayNumber + 1} (${tomorrowDetail?.dateStr || "-"}, ${tomorrowDetail?.dayOfWeek || "-"}) — ${tomorrowDetail?.stageName || "-"}
- Jam Belajar Resmi Diklat: 08:00 - 15:30 WIB (Senin s.d. Jumat)

======================================================================
MASTER JADWAL 35 HARI LENGKAP (SUMBER KEBENARAN UTAMA / GROUND TRUTH):
======================================================================
${all35DaysScheduleText}

======================================================================
DAFTAR MODUL PDF & BAHAN AJAR 120 JP:
======================================================================
${materialsContext}

======================================================================
DAFTAR TUGAS AKTIF & DEADLINE:
======================================================================
${tasksContext}

======================================================================
PENGUMUMAN KELAS TERBARU:
======================================================================
${announcementsContext}

======================================================================
PUSAT TEMPLATE DOKUMEN BPS & KEJAKSAAN RI:
======================================================================
${templatesContext}

KEMAMPUAN & ATURAN MENJAWAB:
1. PENGETAHUAN UMUM & BEBAS DI LUAR DATA KELAS (SERBA BISA LAYAKNYA CHATGPT/CLAUDE):
   - Anda adalah LLM cerdas yang berpengetahuan luas. Jika pengguna menanyakan hal UMUM di luar diklat (contoh: geografi, sejarah, sains, tips hidup/kerja, penulisan esai, matematika, bahasa asing, humor, dsb.), JAWAB DENGAN TUNTAS, LENGKAP, DAN AKURAT tanpa membatasi diri pada data kelas.
   - Jawab secara langsung, jelas, dan informatif!
2. KODING, TROUBLESHOOTING & TEKNOLOGI:
   - Jawab pertanyaan pemrograman apa pun (Python, SQL, JavaScript, Bash, Rust, Go, PHP, Docker, Git, Linux, dsb.) dengan contoh kode yang bersih dan penjelasan siap pakai.
3. SINKRONISASI JADWAL HARIAN DIKLAT:
   - Jika pengguna menanyakan jadwal hari tertentu, BACA LANGSUNG dari [MASTER JADWAL 35 HARI LENGKAP] di atas dan sebutkan secara persis sesi, jam, pengampu, dan ruangannya.
4. PENGUASAAN MODUL & MATERI DIKLAT:
   - Mampu menjelaskan secara mendalam materi SPBE (Perpres 95/2018), 6 Domain SPBE, Arsitektur Sistem, Manajemen Database, Jaringan, CSIRT Keamanan Informasi, dan Tata Kelola TI Kejaksaan.
5. ANGKA KREDIT & DUPAK BPS:
   - PermenPAN-RB No. 32/2020 & Perka BPS No. 2/2021 (Ahli Pertama 12.5 AK/thn, Ahli Muda 25 AK/thn, Ahli Madya 37.5 AK/thn).

Format jawaban dengan Markdown rapi, bullet points, dan blok kode dengan sintaks yang jelas!`

    // Sanitize incoming messages
    const cleanMessages = Array.isArray(messages)
      ? messages
          .filter((m: any) => m && typeof m.content === "string" && m.content.trim())
          .map((m: any) => ({
            role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
            content: String(m.content).trim(),
          }))
      : []

    if (cleanMessages.length === 0) {
      return NextResponse.json({
        reply: `Halo Pak/Ibu **${userName || "Rekan Prakom"}**! Ada yang bisa saya bantu terkait jadwal, materi modul 120 JP, atau kendala kodingan hari ini?`,
        todayDay: currentDayNumber,
      })
    }

    // 4. Generate AI Completion via OpenRouter (with Multi-Model & Groq Fallback)
    const result = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages.slice(-8),
      ],
      temperature: 0.45,
      max_tokens: 2000,
      userApiKey,
    })

    return NextResponse.json({
      reply: result.text,
      model: result.model,
      provider: result.provider,
      todayDay: currentDayNumber,
      todayStage: todayDetail.stageName,
    })
  } catch (err: any) {
    console.error("[AI Chat Exception]:", err)
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: err.message || "Terjadi kesalahan pada server AI.",
      },
      { status: 500 }
    )
  }
}
