import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { RAW_DAYS_DATA } from "@/lib/roadmap-utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, userApiKey, userName, userSatker, currentDayNumber = 3 } = body

    // 1. Fetch real-time context from Supabase if available
    let tasksContext = "Tugas Aktif: Rangkuman Materi Hari 2 — Manajemen Layanan TI & SPBE (Tenggat: 26 Agustus 2026, 23:59 WIB)"
    let scheduleContext = ""
    let materialsContext = `• [Pertemuan 1] Modul Administrasi Prakom (Bahan Ajar Fungsional) - Tata kelola administrasi dan butir DUPAK (File: administrasi-prakom.pdf)
• [Pertemuan 2] Modul SPBE & Arsitektur Sistem (Tata Kelola TI) - 6 Domain SPBE dan Perpres 95/2018
• [Pertemuan 3] Modul Manajemen Basis Data & Big Data (Database) - Indexing, replikasi data perkara, dan query SQL tuning
• [Pertemuan 4] Modul Jaringan & Cloud Server (Infrastruktur TI) - Konfigurasi Linux server, Nginx, dan backup otomatis
• [Pertemuan 5] Modul Keamanan Informasi & CSIRT (Cybersecurity) - Respon insiden, enkripsi data, dan ISO 27001`

    try {
      const supabase = await createClient()
      const [taskRes, schedRes, matRes] = await Promise.all([
        supabase.from("tasks").select("*").limit(10),
        supabase.from("schedules").select("*").limit(15),
        supabase.from("materials").select("title, subject_name, description, file_name, week_number").limit(25),
      ])

      if (taskRes.data && taskRes.data.length > 0) {
        tasksContext = taskRes.data
          .map((t: any) => `• ${t.title} (${t.subject_name}) - Deadline: ${t.due_date}`)
          .join("\n")
      }

      if (schedRes.data && schedRes.data.length > 0) {
        scheduleContext = schedRes.data
          .map((s: any) => `• [${s.day || "Sesi"}] ${s.subject_name} (${s.start_time || "08:00"} - ${s.end_time || "15:30"} WIB)`)
          .join("\n")
      }

      if (matRes.data && matRes.data.length > 0) {
        materialsContext = matRes.data
          .map((m: any) => `• [Pertemuan ${m.week_number || 1}] ${m.title} (${m.subject_name}) - ${m.description || "Modul Kurikulum 120 JP"} (File: ${m.file_name})`)
          .join("\n")
      }
    } catch {
      // Offline fallback
    }

    // 2. Resolve current and tomorrow's schedule
    const todayObj = RAW_DAYS_DATA.find((d) => d.day === currentDayNumber) || RAW_DAYS_DATA[2]
    const tomorrowObj = RAW_DAYS_DATA.find((d) => d.day === currentDayNumber + 1) || RAW_DAYS_DATA[3]

    // 3. Versatile, All-Knowing System Prompt
    const systemPrompt = `Anda adalah "AI Widyaiswara & Copilot Prakom 625", asisten AI resmi yang cerdas, serba bisa, dan siap membantu segala topik untuk Pelatihan Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena.

PROFIL PENGGUNA:
- Nama: ${userName || "Rekan Prakom"}
- Satuan Kerja: ${userSatker || "Kejaksaan RI"}
- Selalu panggil dan sapa pengguna dengan namanya secara ramah, santun, dan solutif.

KONTEKS DIKLAT HARI INI:
- Hari Ini: Hari ke-${currentDayNumber} (${todayObj.date}, ${todayObj.dayOfWeek}) — ${todayObj.stageName} (${todayObj.stageSubtitle})
- Topik Hari Ini: Tata Kelola TI & SPBE Nasional (120 JP)
- Jadwal Besok: Hari ke-${currentDayNumber + 1} (${tomorrowObj.date}, ${tomorrowObj.dayOfWeek}) — ${tomorrowObj.stageName}
- Jam Belajar Resmi: 08:00 - 15:30 WIB (Senin s.d. Jumat)

PUSTAKA MODUL PDF & BAHAN AJAR 120 JP YANG TERSEDIA DI KELAS:
${materialsContext}
(Jika peserta menanyakan isi modul, materi, konsep, bab tertentu, atau minta dirangkumkan salah satu modul di atas, jelaskan secara mendalam, terstruktur, dan tuntas sesuai isi modul tersebut!)

TUGAS AKTIF DI DATABASE:
${tasksContext}

KEMAMPUAN UTAMA ANDA (SERBA BISA):
1. 📚 PENGUASAAN MODUL & MATERI DIKLAT: Kuasai penuh seluruh modul bahan ajar 120 JP yang diunggah di kelas. Mampu merangkum materi, menjelaskan bab dan istilah teknis, serta membantu persiapan ujian seminar dan tugas mandiri.
2. 💻 CODING & TROUBLESHOOTING: Anda adalah pakar pemrograman tingkat mahir. Jawab semua kendala coding, query SQL, Python, JavaScript, TypeScript, PHP, Bash Script, Docker, Git, REST API, optimasi database, dan arsitektur sistem. Berikan solusi kode yang bersih, efisien, dan siap pakai.
3. 🏛️ REGULASI & SPBE: Kuasai penuh Perpres No. 95/2018 (SPBE), Perpres No. 132/2022, 6 Domain SPBE, Keamanan Siber (CSIRT/BSSN), dan Standar TIK Nasional.
4. 📈 JABATAN FUNGSIONAL & ANGKA KREDIT: Pahami PermenPAN-RB No. 32/2020 & Perka BPS No. 2/2021 untuk perhitungan DUPAK/PAK, pembagian butir kegiatan Ahli Pertama (12.5 AK/thn) dan Ahli Muda (25 AK/thn), serta syarat bukti fisik yang sah.
5. 🌐 PENGETAHUAN UMUM & PRODUKTIVITAS: Anda juga dapat menjawab pertanyaan umum lainnya di luar diklat dengan cerdas, logis, dan akurat.

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
            temperature: 0.6,
            max_tokens: 1500,
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
              todayStage: todayObj.stageName,
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
      todayStage: todayObj.stageName,
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
