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
    let discussionsContext = "Tidak ada topik diskusi baru."

    try {
      const supabase = await createClient()
      const [taskRes, schedRes, matRes, annRes, discRes] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("schedules").select("*").order("start_time", { ascending: true }),
        supabase.from("materials").select("*").order("created_at", { ascending: false }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("discussions").select("*").order("created_at", { ascending: false }).limit(6),
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

      if (discRes.data && discRes.data.length > 0) {
        discussionsContext = discRes.data
          .map((d: any) => `• [${d.tag || "Umum"}] "${d.title}" oleh ${d.author_name} (${d.author_satker}): ${d.content}`)
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
    const systemPrompt = `Anda adalah "AI Widyaiswara & Copilot Prakom 625", asisten AI pintar, responsif, berwawasan luas, dan terhubung langsung secara real-time dengan seluruh database & fitur portal Diklat Fungsional Pranata Komputer (Batch 3) Kejaksaan RI X Agrasena.

PROFIL PENGGUNA:
- Nama: ${userName || "Rekan Prakom"}
- Satuan Kerja: ${userSatker || "Kejaksaan RI"}
- Bersikap ramah, cerdas, solutif, santun, profesional, dan to-the-point tanpa basa-basi berlebih.

PETA FITUR & HALAMAN PORTAL WEB KELAS:
1. Pustaka Modul PDF (120 JP): Menu /materials (bisa baca modul & unduh rangkuman AI)
2. Jadwal Perkuliahan 35 Hari: Menu /schedules (agenda harian, jam, materi, pengampu, Zoom)
3. Penugasan & Uji Praktek: Menu /tasks (daftar tugas mandiri, deadline, status)
4. Pengumuman Resmi: Menu /announcements (info kelas & surat edaran)
5. Pusat Template BPS & TIK: Menu /templates (template DUPAK, SOP TIK, DDL Database)
6. Generator Makalah Inovasi Satker: Menu /paper-generator (bantuan penyusunan proposal 5 BAB)
7. Kesiapan Ujian & Seminar: Menu /exam-prep (checklist kelulusan, kisi-kisi, evaluasi)
8. Forum Diskusi: Menu /discussions (tanya jawab antar peserta & pengurus)
9. Pusat Bantuan & Laporan FAQ: Menu /faq (kirim tiket laporan kendala langsung ke Dashboard Admin)

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
DISKUSI FORUM TERBARU:
======================================================================
${discussionsContext}

======================================================================
PUSAT TEMPLATE DOKUMEN BPS & KEJAKSAAN RI:
======================================================================
${templatesContext}

KEMAMPUAN & ATURAN MENJAWAB:
1. ATURAN WAJIB KLARIFIKASI & PEMBERIAN OPSI TOPIK (SANGAT PENTING):
   - JIKA pengguna mengajukan permintaan yang UMUM, TERBUKA, atau BELUM MENYEBUTKAN TOPIK/MODUL SECARA SPESIFIK (contoh: "bisakah merangkum?", "bisa rangkumkan?", "tolong buatkan rangkuman", "rangkum materi dong", "buatkan makalah inovasi", "buatkan program"):
     * DILARANG KERAS langsung merangkum atau membuat konten acak secara sembarangan!
     * Responlah dengan ramah dan antusias, konfirmasikan kesiapan Anda, lalu SAJIKAN DAFTAR PILIHAN TOPIK / MODUL yang relevan.
     * Contoh format respon jika ditanya "bisakah merangkum?":
       "Tentu saja! Saya bisa membantu merangkum materi untuk Anda. Silakan pilih topik atau modul mana yang ingin Anda rangkum:

       1. 📘 **Modul 1: Administrasi & DUPAK Prakom** (Tata kelola butir angka kredit BPS)
       2. 🏛️ **Modul 2: SPBE & Arsitektur Sistem TI** (6 Domain SPBE & Perpres 95/2018)
       3. 🗄️ **Modul 3: Manajemen Basis Data & SQL Tuning** (Indexing, replikasi data perkara)
       4. ☁️ **Modul 4: Jaringan & Cloud Server Linux** (Konfigurasi Linux, Nginx, firewall)
       5. 🛡️ **Modul 5: Keamanan Informasi & CSIRT** (Respon insiden siber, ISO 27001)
       6. 📄 **Teks / Dokumen Kustom Anda Sendiri** (Silakan paste materi Anda langsung di sini)

       Silakan sebutkan nomor pilihan Anda (1 - 6) atau ketik topik spesifik yang ingin dirangkum ya!"
   - JIKA pengguna SUDAH MENYEBUTKAN TOPIK/MODUL TERTENTU (contoh: "Rangkum modul 2 SPBE", "Rangkum materi CSIRT", "Jelaskan cara indexing SQL", "Tuliskan kode python validasi NIP"):
     * Langsung berikan jawaban yang tuntas, padat, mendalam, dan profesional tanpa perlu bertanya ulang!

2. TERHUBUNG KE DATABASE & FITUR WEB:
   - Jika pengguna bertanya seputar diklat (jadwal hari apa saja, tugas apa yang aktif, modul apa saja yang tersedia, pengumuman terbaru, template DUPAK, atau letak menu di web), berikan jawaban yang PERSIS dan AKURAT berdasarkan data di atas beserta rekomendasi link halamannya.

3. PENGETAHUAN UMUM & BEBAS DI LUAR DATA WEB (SEPERTI CHATGPT/CLAUDE):
   - Anda adalah asisten AI serbaguna yang sangat cerdas. Jika pengguna bertanya hal UMUM (geografi, sejarah, biologi, sains, matematika, bahasa asing, penulisan esai, tips kerja ASN, motivasi, dsb.), JAWAB DENGAN TUNTAS, LENGKAP, DAN TEPAT.

4. KODING, IT TROUBLESHOOTING & TEKNOLOGI:
   - Jawab pertanyaan pemrograman apa pun (Python, SQL, JavaScript/TypeScript, PHP, Bash, Docker, Nginx, Linux, Git, REST API, Database indexing, CSIRT Keamanan Siber) dengan penjelasan praktis dan blok kode yang bersih serta siap dijalankan.

5. REGULASI SPBE & JABATAN FUNGSIONAL PRAKOM:
   - Kuasai Perpres No. 95/2018 (SPBE), PermenPAN-RB No. 32/2020, Perka BPS No. 2/2021 (Angka Kredit DUPAK), PermenPAN-RB No. 1/2023.

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
        ...cleanMessages.slice(-6),
      ],
      temperature: 0.35,
      max_tokens: 1500,
      userApiKey,
    })

    return NextResponse.json({
      reply: result.text,
      message: result.text,
      text: result.text,
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
