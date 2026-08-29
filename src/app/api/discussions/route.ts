import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIp, isRequestAdminAuthenticated, sanitizeInput } from "@/lib/security"

export const dynamic = "force-dynamic"

// In-memory persistent discussion store with rich technical discussions
let DISCUSSIONS_STORE = [
  {
    id: "disc-1",
    authorName: "Ahmad Fauzi, S.Kom.",
    authorSatker: "Kejati Sulawesi Selatan",
    tag: "#DatabasePostgres",
    title: "Tanya format penulisan query EXPLAIN ANALYZE pada tugas database PostgreSQL?",
    content: "Rekan-rekan, untuk tugas modul database, apakah kita cukup melampirkan screenshot hasil execution plan atau wajib menyertakan file DDL script .sql lengkap dengan index B-tree?",
    upvotes: 8,
    createdAt: "2026-08-26T14:30:00Z",
    replies: [
      {
        id: "rep-1",
        authorName: "Tim Widyaiswara Pusdiklat",
        authorSatker: "Badiklat Kejaksaan RI",
        isOfficial: true,
        content: "Sebaiknya sertakan keduanya rekan Ahmad: (1) File skrip DDL .sql berformat teks, dan (2) Hasil perbandingan Execution Time sebelum vs sesudah indexing agar nilai analisis optimal.",
        createdAt: "2026-08-26T15:10:00Z"
      },
      {
        id: "rep-2",
        authorName: "Dewa Surya",
        authorSatker: "Kejari Soppeng",
        isOfficial: false,
        content: "Saya lampirkan skrip .sql + ringkasan perbandingan cost query di lembar PDF tugasnya mas. Sudah dicek LMS dan status terverifikasi.",
        createdAt: "2026-08-26T16:05:00Z"
      }
    ]
  },
  {
    id: "disc-4",
    authorName: "Rizky Pratama, S.T.",
    authorSatker: "Kejati DKI Jakarta",
    tag: "#PengolahanData",
    title: "Contoh implementasi pivot_wider() di R dan pandas pivot() untuk olah laporan perkara",
    content: "Bagi rekan-rekan yang mengerjakan tugas Pengolahan Data (DAMA DMBOK), berikut snippet transformasi data dari long format ke wide format:\n\nDi R: `df_wide <- df %>% pivot_wider(names_from = jenis_perkara, values_from = jumlah_tilang)`\nDi Python: `df_wide = df.pivot(index='bulan', columns='jenis_perkara', values='jumlah_tilang').fillna(0)`\n\nSangat berguna untuk tabulasi grafik eksekutif pimpinan Kajati!",
    upvotes: 15,
    createdAt: "2026-08-27T07:20:00Z",
    replies: [
      {
        id: "rep-5",
        authorName: "Budi Santoso",
        authorSatker: "Kejari Bandung",
        isOfficial: false,
        content: "Mantap mas Rizky! Untuk penanganan missing values atau outlier nilai ekstrim, apakah disarankan menggunakan imputasi mean atau median?",
        createdAt: "2026-08-27T07:45:00Z"
      },
      {
        id: "rep-6",
        authorName: "Tim Widyaiswara Pusdiklat",
        authorSatker: "Badiklat Kejaksaan RI",
        isOfficial: true,
        content: "Sesuai modul Pengolahan Data: Jika data memiliki sebaran outlier yang ekstrem (skewed), gunakan Median. Jika data berdistribusi normal, gunakan Mean.",
        createdAt: "2026-08-27T08:10:00Z"
      }
    ]
  },
  {
    id: "disc-5",
    authorName: "Fajar Nugraha, S.Kom.",
    authorSatker: "Kejari Semarang",
    tag: "#TeknisKodingLab",
    title: "Penerapan Studi Kelayakan TELOS & Analisis PIECES pada Proyek Inovasi Satker",
    content: "Izin berdiskusi rekan-rekan, saat menyusun Bab I & III proposal inovasi sistem informasi, instrumen TELOS mencakup 5 dimensi evaluasi kelayakan:\n1. Technical (Kemampuan teknologi server/SDM)\n2. Economic (Cost-benefit analysis)\n3. Legal (Kepatuhan UU PDP & Perpres 95/2018)\n4. Operational (Kesiapan SOP & staf PTSP)\n5. Schedule (Milestone jadwal 6 bulan)\n\nPastikan kelima aspek ini dijabarkan secara kuantitatif agar penguji seminar puas!",
    upvotes: 11,
    createdAt: "2026-08-27T08:00:00Z",
    replies: [
      {
        id: "rep-7",
        authorName: "Anisa Rahmawati",
        authorSatker: "Kejati Jawa Timur",
        isOfficial: false,
        content: "Terima kasih sharingnya mas Fajar, ini sangat membantu pemetaan BAB III rancangan inovasi saya.",
        createdAt: "2026-08-27T08:30:00Z"
      }
    ]
  },
  {
    id: "disc-2",
    authorName: "Rina Marlina, S.T.",
    authorSatker: "Kejari Surabaya",
    tag: "#SeminarAkhir",
    title: "Berapa lama waktu maksimal presentasi saat Sidang Seminar Makalah Inovasi?",
    content: "Izin bertanya pengurus kelas, untuk alokasi waktu paparan makalah di hadapan penguji di Hari ke-35, apakah 10 menit atau 15 menit?",
    upvotes: 12,
    createdAt: "2026-08-27T08:15:00Z",
    replies: [
      {
        id: "rep-3",
        authorName: "Tim Pengurus Kelas",
        authorSatker: "Pusdiklat Kejaksaan RI",
        isOfficial: true,
        content: "Alokasi total 25 menit per peserta: 10 menit presentasi paparan slide, 12 menit tanya-jawab penguji & coach, dan 3 menit evaluasi penutup.",
        createdAt: "2026-08-27T08:45:00Z"
      }
    ]
  },
  {
    id: "disc-6",
    authorName: "Wahyu Hidayat",
    authorSatker: "Kejati Kalimantan Timur",
    tag: "#AuditTI",
    title: "Format Laporan Temuan Audit TI: Pemetaan Kondisi, Kriteria, dan Risiko",
    content: "Dalam modul Audit TI, setiap temuan kelemahan kontrol harus memuat 4 unsur wajib:\n• Temuan (Kondisi nyata di lapangan)\n• Kriteria (Dasar hukum/SOP standar)\n• Risiko (Potensi kerugian/dampak kegagalan layanan)\n• Rekomendasi (Langkah perbaikan solutif)\n\nJangan hanya menuliskan masalah tanpa kriteria dasar hukumnya ya rekan-rekan.",
    upvotes: 9,
    createdAt: "2026-08-27T09:00:00Z",
    replies: []
  },
  {
    id: "disc-3",
    authorName: "Bambang Kurniawan",
    authorSatker: "Kejati Sumatera Utara",
    tag: "#JaringanServer",
    title: "Kendala akses VPN Intra-Pemerintah saat sesi Lab Praktik Server?",
    content: "Apakah ada rekan yang mengalami timeout saat menghubungkan OpenVPN ke subnet server lab diklat pagi ini? Solusi sementaranya bagaimana ya?",
    upvotes: 6,
    createdAt: "2026-08-27T09:20:00Z",
    replies: [
      {
        id: "rep-4",
        authorName: "Hendro Wibowo",
        authorSatker: "Kejari Jakarta Selatan",
        isOfficial: false,
        content: "Coba flush DNS dulu di terminal `ipconfig /flushdns` dan pastikan adapter TAP-Windows sudah disetel metric rendah mas. Tadi saya lancar setelah reconnect.",
        createdAt: "2026-08-27T09:35:00Z"
      }
    ]
  }
]

export async function GET() {
  return NextResponse.json({ discussions: DISCUSSIONS_STORE })
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)
    const body = await req.json()
    const { action, threadId, authorName, authorSatker, title, content, tag, replyId } = body

    // Rate Limiting: Max 15 forum actions per minute per IP
    const rateLimit = checkRateLimit(clientIp, 'discussion_actions', 15, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Silakan tunggu ${rateLimit.retryAfter} detik.` },
        { status: 429 }
      )
    }

    // 1. Create Discussion Thread
    if (action === "create_thread") {
      const cleanTitle = sanitizeInput(title, 200)
      const cleanContent = sanitizeInput(content, 3000)
      const cleanSatker = sanitizeInput(authorSatker, 100)
      const cleanAuthor = sanitizeInput(authorName, 100) || "Rekan Prakom"
      const cleanTag = sanitizeInput(tag, 50) || "#TugasMandiri"

      if (!cleanTitle || !cleanContent || !cleanSatker) {
        return NextResponse.json({ error: "Judul, isi pertanyaan, dan satker wajib diisi." }, { status: 400 })
      }

      const newThread = {
        id: `disc-${Date.now()}`,
        authorName: cleanAuthor,
        authorSatker: cleanSatker,
        tag: cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`,
        title: cleanTitle,
        content: cleanContent,
        upvotes: 1,
        createdAt: new Date().toISOString(),
        replies: []
      }

      DISCUSSIONS_STORE = [newThread, ...DISCUSSIONS_STORE]
      return NextResponse.json({ success: true, thread: newThread })
    }

    // 2. User Reply to Thread
    if (action === "reply") {
      const cleanThreadId = sanitizeInput(threadId, 50)
      const cleanContent = sanitizeInput(content, 2000)
      const cleanAuthor = sanitizeInput(authorName, 100) || "Rekan Prakom"
      const cleanSatker = sanitizeInput(authorSatker, 100) || "Kejaksaan RI"

      if (!cleanThreadId || !cleanContent) {
        return NextResponse.json({ error: "Thread ID dan isi balasan wajib diisi." }, { status: 400 })
      }

      const thread = DISCUSSIONS_STORE.find((t) => t.id === cleanThreadId)
      if (!thread) {
        return NextResponse.json({ error: "Diskusi tidak ditemukan." }, { status: 404 })
      }

      const newReply = {
        id: `rep-${Date.now()}`,
        authorName: cleanAuthor,
        authorSatker: cleanSatker,
        isOfficial: false,
        content: cleanContent,
        createdAt: new Date().toISOString()
      }

      thread.replies.push(newReply)
      return NextResponse.json({ success: true, reply: newReply })
    }

    // 3. Official Admin Reply (Protected: Admin Auth Required)
    if (action === "admin_reply") {
      if (!isRequestAdminAuthenticated(req)) {
        return NextResponse.json({ error: "Akses ditolak. Tindakan ini memerlukan hak akses pengurus." }, { status: 401 })
      }

      const cleanThreadId = sanitizeInput(threadId, 50)
      const cleanContent = sanitizeInput(content, 2500)
      const cleanAuthor = sanitizeInput(authorName, 100) || "Admin / Tim Widyaiswara Pusdiklat"
      const cleanSatker = sanitizeInput(authorSatker, 100) || "Badan Diklat Kejaksaan RI"

      if (!cleanThreadId || !cleanContent) {
        return NextResponse.json({ error: "Thread ID dan isi balasan wajib diisi." }, { status: 400 })
      }

      const thread = DISCUSSIONS_STORE.find((t) => t.id === cleanThreadId)
      if (!thread) {
        return NextResponse.json({ error: "Diskusi tidak ditemukan." }, { status: 404 })
      }

      const newReply = {
        id: `rep-${Date.now()}`,
        authorName: cleanAuthor,
        authorSatker: cleanSatker,
        isOfficial: true,
        content: cleanContent,
        createdAt: new Date().toISOString()
      }

      thread.replies.push(newReply)
      return NextResponse.json({ success: true, reply: newReply })
    }

    // 4. Delete Thread (Protected: Admin Auth Required)
    if (action === "delete_thread") {
      if (!isRequestAdminAuthenticated(req)) {
        return NextResponse.json({ error: "Akses ditolak. Hanya pengurus yang dapat menghapus topik diskusi." }, { status: 401 })
      }

      const cleanThreadId = sanitizeInput(threadId, 50)
      if (!cleanThreadId) {
        return NextResponse.json({ error: "Thread ID wajib disertakan." }, { status: 400 })
      }
      DISCUSSIONS_STORE = DISCUSSIONS_STORE.filter((t) => t.id !== cleanThreadId)
      return NextResponse.json({ success: true })
    }

    // 5. Delete Reply (Protected: Admin Auth Required)
    if (action === "delete_reply") {
      if (!isRequestAdminAuthenticated(req)) {
        return NextResponse.json({ error: "Akses ditolak. Hanya pengurus yang dapat menghapus balasan." }, { status: 401 })
      }

      const cleanThreadId = sanitizeInput(threadId, 50)
      const cleanReplyId = sanitizeInput(replyId, 50)
      if (!cleanThreadId || !cleanReplyId) {
        return NextResponse.json({ error: "Thread ID dan Reply ID wajib disertakan." }, { status: 400 })
      }
      const thread = DISCUSSIONS_STORE.find((t) => t.id === cleanThreadId)
      if (thread) {
        thread.replies = thread.replies.filter((r) => r.id !== cleanReplyId)
      }
      return NextResponse.json({ success: true })
    }

    // 6. Upvote
    if (action === "upvote") {
      const cleanThreadId = sanitizeInput(threadId, 50)
      if (!cleanThreadId) {
        return NextResponse.json({ error: "Thread ID wajib disertakan." }, { status: 400 })
      }
      const thread = DISCUSSIONS_STORE.find((t) => t.id === cleanThreadId)
      if (thread) {
        thread.upvotes += 1
      }
      return NextResponse.json({ success: true, upvotes: thread?.upvotes || 0 })
    }

    return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server.", message: err.message }, { status: 500 })
  }
}
