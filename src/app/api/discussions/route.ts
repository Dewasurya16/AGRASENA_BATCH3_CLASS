import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// In-memory persistent discussion store fallback
let DISCUSSIONS_STORE = [
  {
    id: "disc-1",
    authorName: "Ahmad Fauzi, S.Kom.",
    authorSatker: "Kejati Sulawesi Selatan",
    tag: "#TugasMandiri",
    title: "Tanya format penulisan query EXPLAIN ANALYZE pada tugas database PostgreSQL?",
    content: "Rekan-rekan, untuk tugas hari 3 modul database, apakah kita cukup melampirkan screenshot hasil execution plan atau wajib menyertakan file DDL script .sql lengkap dengan index B-tree?",
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
    id: "disc-3",
    authorName: "Bambang Kurniawan",
    authorSatker: "Kejati Sumatera Utara",
    tag: "#Jaringan",
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
    const body = await req.json()
    const { action, threadId, authorName, authorSatker, title, content, tag } = body

    if (action === "create_thread") {
      if (!title || !content || !authorSatker) {
        return NextResponse.json({ error: "Judul, isi pertanyaan, dan satker wajib diisi." }, { status: 400 })
      }

      const newThread = {
        id: `disc-${Date.now()}`,
        authorName: authorName || "Rekan Prakom",
        authorSatker,
        tag: tag || "#TugasMandiri",
        title,
        content,
        upvotes: 1,
        createdAt: new Date().toISOString(),
        replies: []
      }

      DISCUSSIONS_STORE = [newThread, ...DISCUSSIONS_STORE]
      return NextResponse.json({ success: true, thread: newThread })
    }

    if (action === "reply") {
      if (!threadId || !content) {
        return NextResponse.json({ error: "Thread ID dan isi balasan wajib diisi." }, { status: 400 })
      }

      const thread = DISCUSSIONS_STORE.find((t) => t.id === threadId)
      if (!thread) {
        return NextResponse.json({ error: "Diskusi tidak ditemukan." }, { status: 404 })
      }

      const newReply = {
        id: `rep-${Date.now()}`,
        authorName: authorName || "Rekan Prakom",
        authorSatker: authorSatker || "Kejaksaan RI",
        isOfficial: false,
        content,
        createdAt: new Date().toISOString()
      }

      thread.replies.push(newReply)
      return NextResponse.json({ success: true, reply: newReply })
    }

    if (action === "upvote") {
      if (!threadId) {
        return NextResponse.json({ error: "Thread ID wajib disertakan." }, { status: 400 })
      }
      const thread = DISCUSSIONS_STORE.find((t) => t.id === threadId)
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
