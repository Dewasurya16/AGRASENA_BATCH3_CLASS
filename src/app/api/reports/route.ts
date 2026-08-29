import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp, isRequestAdminAuthenticated, sanitizeInput } from "@/lib/security"

export const dynamic = "force-dynamic"

export interface ReportItem {
  id: string
  name: string
  satker: string
  category: string
  message: string
  contact?: string
  status: "pending" | "in_progress" | "resolved"
  admin_notes?: string
  created_at: string
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes("your-project-id"))
}

// In-memory fallback persistent store
let IN_MEMORY_REPORTS: ReportItem[] = [
  {
    id: "rep-seed-1",
    name: "Ahmad Fauzi, S.Kom.",
    satker: "Kejati Sulawesi Selatan",
    category: "Kendala LMS & Pengumpulan Tugas",
    message: "Terdapat kendala saat mengunggah berkas format PDF tugas mandiri Hari ke-4 di portal LMS Pusdiklat. Muncul notifikasi file size error padahal ukuran file 3.2 MB.",
    contact: "081234567890",
    status: "in_progress",
    admin_notes: "Sedang dikomunikasikan dengan tim helpdesk Pusdiklat untuk penyesuaian limit upload 10 MB.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: "rep-seed-2",
    name: "Rina Marlina, S.T.",
    satker: "Kejari Surabaya",
    category: "Kendala Link Zoom & Ruang Perkuliahan",
    message: "Izin pengurus kelas, link Zoom breakout room kelompok 2 pada sesi pagi sempat mengalami audio echo. Mohon bantuan co-host untuk reset audio saat sesi esok hari.",
    contact: "082198765432",
    status: "resolved",
    admin_notes: "Sudah diselesaikan dan ditunjuk co-host tambahan dari pengurus kelas.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: "rep-seed-3",
    name: "Bambang Kurniawan",
    satker: "Kejati Sumatera Utara",
    category: "Masukan & Saran Pembangunan Kelas",
    message: "Usulan penambahan fitur pencarian cepat pada modul DUPAK & Angka Kredit di portal web kelas ini agar rekan-rekan lebih mudah memetakan butir kegiatan kepegawaian.",
    contact: "081345678901",
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
]

export async function GET(req: NextRequest) {
  // Only authenticated admins can read all contact details & tickets
  if (!isRequestAdminAuthenticated(req)) {
    return NextResponse.json(
      { error: "Akses ditolak. Rekapitulasi laporan hanya dapat diakses oleh akun pengurus." },
      { status: 401 }
    )
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data && data.length > 0) {
        return NextResponse.json({ reports: data })
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  return NextResponse.json({ reports: IN_MEMORY_REPORTS })
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)
    const body = await req.json()
    const { action, id, name, satker, category, message, contact, status, admin_notes } = body

    // 1. Create Public Report (Subject to Rate Limiting: Max 6 per 10 minutes per IP)
    if (action === "create" || !action) {
      const rateLimit = checkRateLimit(clientIp, 'report_create', 6, 10 * 60 * 1000)
      if (rateLimit.isLimited) {
        return NextResponse.json(
          { error: `Terlalu banyak laporan dikirim dari IP Anda. Silakan coba lagi dalam ${rateLimit.retryAfter} detik.` },
          { status: 429 }
        )
      }

      const cleanName = sanitizeInput(name, 100)
      const cleanSatker = sanitizeInput(satker, 100)
      const cleanCategory = sanitizeInput(category, 100) || "Kendala Teknis Web & Lainnya"
      const cleanMessage = sanitizeInput(message, 3000)
      const cleanContact = sanitizeInput(contact, 50)

      if (!cleanName || !cleanSatker || !cleanMessage) {
        return NextResponse.json(
          { error: "Nama, satuan kerja, dan uraian kendala wajib diisi." },
          { status: 400 }
        )
      }

      const newReport: ReportItem = {
        id: `rep-${Date.now()}`,
        name: cleanName,
        satker: cleanSatker,
        category: cleanCategory,
        message: cleanMessage,
        contact: cleanContact,
        status: "pending",
        admin_notes: "",
        created_at: new Date().toISOString()
      }

      if (isSupabaseConfigured()) {
        try {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("reports")
            .insert({
              name: newReport.name,
              satker: newReport.satker,
              category: newReport.category,
              message: newReport.message,
              contact: newReport.contact,
              status: newReport.status,
              admin_notes: "",
            })
            .select()
            .single()

          if (!error && data) {
            IN_MEMORY_REPORTS = [data as ReportItem, ...IN_MEMORY_REPORTS]
            return NextResponse.json({ success: true, report: data })
          }
        } catch {
          // Fallback to in-memory
        }
      }

      IN_MEMORY_REPORTS = [newReport, ...IN_MEMORY_REPORTS]
      return NextResponse.json({ success: true, report: newReport })
    }

    // 2. Update Status / Notes (Protected: Admin Auth Required)
    if (action === "update_status") {
      if (!isRequestAdminAuthenticated(req)) {
        return NextResponse.json({ error: "Akses ditolak. Memperbarui tiket memerlukan hak akses pengurus." }, { status: 401 })
      }

      const cleanId = sanitizeInput(id, 50)
      const cleanStatus = sanitizeInput(status, 50) as "pending" | "in_progress" | "resolved"
      const cleanAdminNotes = admin_notes !== undefined ? sanitizeInput(admin_notes, 1000) : undefined

      if (!cleanId || !cleanStatus) {
        return NextResponse.json({ error: "ID laporan dan status wajib disertakan." }, { status: 400 })
      }

      if (isSupabaseConfigured()) {
        try {
          const supabase = await createClient()
          const updatePayload: any = { status: cleanStatus }
          if (cleanAdminNotes !== undefined) {
            updatePayload.admin_notes = cleanAdminNotes
          }
          const { error } = await supabase.from("reports").update(updatePayload).eq("id", cleanId)
          if (!error) {
            const existing = IN_MEMORY_REPORTS.find((r) => r.id === cleanId)
            if (existing) {
              existing.status = cleanStatus
              if (cleanAdminNotes !== undefined) existing.admin_notes = cleanAdminNotes
            }
            return NextResponse.json({ success: true })
          }
        } catch {
          // Fallback
        }
      }

      const existing = IN_MEMORY_REPORTS.find((r) => r.id === cleanId)
      if (existing) {
        existing.status = cleanStatus
        if (cleanAdminNotes !== undefined) existing.admin_notes = cleanAdminNotes
      }
      return NextResponse.json({ success: true })
    }

    // 3. Delete Report (Protected: Admin Auth Required)
    if (action === "delete") {
      if (!isRequestAdminAuthenticated(req)) {
        return NextResponse.json({ error: "Akses ditolak. Menghapus tiket memerlukan hak akses pengurus." }, { status: 401 })
      }

      const cleanId = sanitizeInput(id, 50)
      if (!cleanId) {
        return NextResponse.json({ error: "ID laporan wajib disertakan." }, { status: 400 })
      }

      if (isSupabaseConfigured()) {
        try {
          const supabase = await createClient()
          await supabase.from("reports").delete().eq("id", cleanId)
        } catch {
          // Fallback
        }
      }

      IN_MEMORY_REPORTS = IN_MEMORY_REPORTS.filter((r) => r.id !== cleanId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server.", details: err?.message },
      { status: 500 }
    )
  }
}
