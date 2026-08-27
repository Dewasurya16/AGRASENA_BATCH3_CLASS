import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAutoRoadmapData, RAW_DAYS_DATA } from "@/lib/roadmap-utils"
import { TEMPLATES_DATA } from "@/components/public/templates-hub"

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

    // 2. Build structured 35-Day Roadmap Master Schedule
    const roadmapData = getAutoRoadmapData(currentDayNumber, rawSchedules)
    const todayDetail = roadmapData.days.find((d) => d.dayNumber === currentDayNumber) || roadmapData.days[0]
    const tomorrowDetail = roadmapData.days.find((d) => d.dayNumber === currentDayNumber + 1) || roadmapData.days[1]

    const all35DaysScheduleText = roadmapData.days
      .map((d) => {
        const sessionList =
          d.sessions && d.sessions.length > 0
            ? d.sessions
                .map(
                  (s) =>
                    `    - ${s.time} WIB: ${s.title}${s.instructor ? ` (Pengampu: ${s.instructor})` : ""}${s.room ? ` [Ruangan: ${s.room}]` : ""}`
                )
                .join("\n")
            : "    - Pembelajaran Mandiri / Belum ada sesi terperinci yang dijadwalkan."

        return `• [HARI ${d.dayNumber}] ${d.dayOfWeek}, ${d.dateStr} | ${d.stageName} (${d.stageSubtitle}) [Status: ${d.status.toUpperCase()}]:\n${sessionList}`
      })
      .join("\n\n")

    const templatesContext = TEMPLATES_DATA
      .map((t) => `• [${t.category}] "${t.title}" (${t.format}) — Dasar: ${t.legalReference}`)
      .join("\n")

    // 3. System Prompt with Complete Ground Truth
    const systemPrompt = `Anda adalah "AI Widyaiswara & Copilot Prakom 625", asisten AI resmi yang cerdas, serba bisa, dan berpengetahuan komprehensif untuk Pelatihan Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena.

PROFIL PENGGUNA:
- Nama: ${userName || "Rekan Prakom"}
- Satuan Kerja: ${userSatker || "Kejaksaan RI"}
- Sapa pengguna dengan ramah, santun, profesional, dan solutif.

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

ATURAN WAJIB DALAM MENJAWAB:
1. AKURASI JADWAL HARIAN:
   - Jika pengguna menanyakan jadwal hari tertentu (misal: "jadwal hari ke-5", "jadwal hari jumat", "jadwal hari 8", "jadwal besok", dsb.), BACA LANGSUNG dari bagian [MASTER JADWAL 35 HARI LENGKAP] di atas.
   - Sebutkan secara persis: Tanggal, Hari, Tahap Diklat, serta SELURUH SESI & JAM yang terdaftar (contoh untuk Hari ke-5: 08:00 - 08:45 WIB: Area TI Spesial, 08:45 - 09:30 WIB: Pembuatan Dokumentasi dan Laporan, dst.).
   - JANGAN PERNAH menyatakan "topik menyusul" atau "belum ada di database" jika di atas sudah tercatat rincian sesinya!
2. PENGUASAAN MODUL & MATERI:
   - Mampu menjelaskan secara mendalam isi modul, konsep SPBE (Perpres 95/2018), 6 Domain SPBE, Arsitektur Sistem, Manajemen Database, CSIRT Keamanan Siber, dan Tata Kelola TI.
3. KODING & TROUBLESHOOTING:
   - Berikan kode SQL, Python, JavaScript, Bash, atau Docker yang rapi di dalam blok kode markdown.
4. ANGKA KREDIT & DUPAK BPS:
   - PermenPAN-RB No. 32/2020 & Perka BPS No. 2/2021 (Ahli Pertama 12.5 AK/thn, Ahli Muda 25 AK/thn).

Format jawaban dengan Markdown rapi, bullet points, dan blok kode dengan sintaks yang jelas. Berikan jawaban yang tuntas dan solutif!`

    // 4. Determine Groq API Key
    const apiKey = process.env.GROQ_API_KEY || userApiKey

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "NO_GROQ_KEY",
          message: "Groq API Key belum dikonfigurasi di server (.env.local).",
        },
        { status: 400 }
      )
    }

    // 5. Call Groq API with Multi-Model Fallback
    const CANDIDATE_MODELS = [
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "groq/compound",
    ]

    for (const model of CANDIDATE_MODELS) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.slice(-8),
            ],
            temperature: 0.5,
            max_tokens: 2000,
          }),
        })

        if (groqResponse.ok) {
          const data = await groqResponse.json()
          const reply = data.choices?.[0]?.message?.content
          if (reply) {
            return NextResponse.json({
              reply,
              model,
              todayDay: currentDayNumber,
              todayStage: todayDetail.stageName,
            })
          }
        }
      } catch (apiErr) {
        console.warn(`[AI Chat] Model ${model} failed:`, apiErr)
      }
    }

    return NextResponse.json({
      reply: "Halo Rekan Prakom! Maaf, server AI sedang mengalami beban tinggi. Silakan ulangi pertanyaan Anda dalam beberapa saat.",
      model: "system-fallback",
      todayDay: currentDayNumber,
      todayStage: todayDetail.stageName,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: err.message || "Terjadi kesalahan pada server AI.",
      },
      { status: 500 }
    )
  }
}
