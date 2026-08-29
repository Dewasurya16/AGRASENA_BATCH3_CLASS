import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isRequestAdminAuthenticated, sanitizeInput, getClientIp, checkRateLimit } from "@/lib/security"

export const maxDuration = 300 // 5 minutes timeout
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)

    // Rate Limiting: Max 20 upload attempts per 10 minutes per IP
    const rateLimit = checkRateLimit(clientIp, 'material_upload', 20, 10 * 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan unggah. Silakan tunggu ${rateLimit.retryAfter} detik.` },
        { status: 429 }
      )
    }

    // Security Gate: Only authenticated admins can upload materials
    if (!isRequestAdminAuthenticated(req)) {
      return NextResponse.json(
        { error: "Akses ditolak. Mengunggah modul materi memerlukan hak akses pengurus terautentikasi." },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
      return NextResponse.json(
        { error: "Konfigurasi database Supabase belum tersedia di .env.local." },
        { status: 500 }
      )
    }

    const contentType = req.headers.get("content-type") || ""

    // 1. DIRECT METADATA SAVE MODE (File uploaded directly to Supabase Storage by Browser)
    if (contentType.includes("application/json")) {
      const body = await req.json()
      const {
        title,
        subject_name,
        week_number = 1,
        description,
        file_url,
        file_name,
        file_size,
        file_type = "application/pdf",
      } = body

      const cleanTitle = sanitizeInput(title, 200)
      const cleanSubject = sanitizeInput(subject_name, 200)
      const cleanDesc = description ? sanitizeInput(description, 1000) : null
      const cleanFileName = sanitizeInput(file_name, 255).replace(/[^a-zA-Z0-9._-]/g, "_")
      const cleanUrl = String(file_url || "").trim()

      if (!cleanTitle || !cleanSubject || !cleanUrl || !cleanFileName) {
        return NextResponse.json(
          { error: "Judul modul, tahapan diklat, dan tautan berkas wajib diisi." },
          { status: 400 }
        )
      }

      // Security check: ensure URL is from valid HTTP(S) protocol and ends with or references PDF
      if (!cleanUrl.startsWith("https://") && !cleanUrl.startsWith("http://")) {
        return NextResponse.json(
          { error: "Tautan berkas harus menggunakan protokol HTTPS yang valid." },
          { status: 400 }
        )
      }

      const supabase = await createClient()
      const { data: dbData, error: dbError } = await supabase
        .from("materials")
        .insert({
          title: cleanTitle,
          subject_name: cleanSubject,
          week_number: Number(week_number) || 1,
          description: cleanDesc,
          file_url: cleanUrl,
          file_name: cleanFileName,
          file_size: Math.max(0, Number(file_size) || 0),
          file_type: "application/pdf",
        })
        .select()
        .single()

      if (dbError) {
        console.error("[Save Material Metadata DB Error]:", dbError)
        return NextResponse.json(
          { error: "Gagal menyimpan metadata ke database: " + dbError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Modul PDF berhasil disimpan ke Pustaka Materi!",
        material: dbData,
      })
    }

    // 2. FALLBACK MULTIPART FORM-DATA MODE (For small uploads)
    const formData = await req.formData()
    const title = (formData.get("title") as string)?.trim()
    const subject_name = (formData.get("subject_name") as string)?.trim()
    const week_number = Number(formData.get("week_number")) || 1
    const description = (formData.get("description") as string)?.trim()
    const file = formData.get("file") as File | null

    const cleanTitle = sanitizeInput(title, 200)
    const cleanSubject = sanitizeInput(subject_name, 200)
    const cleanDesc = description ? sanitizeInput(description, 1000) : null

    if (!cleanTitle || !cleanSubject || !file || file.size === 0) {
      return NextResponse.json(
        { error: "Judul, tahapan diklat, dan berkas PDF wajib diisi." },
        { status: 400 }
      )
    }

    // Strict PDF MIME and Extension check
    const isPdfExt = file.name.toLowerCase().endsWith(".pdf")
    const isPdfMime = file.type === "application/pdf" || file.type === "application/x-pdf" || file.type === ""

    if (!isPdfExt && !isPdfMime) {
      return NextResponse.json(
        { error: "Format berkas tidak diizinkan. Hanya berkas PDF (.pdf) yang diperbolehkan." },
        { status: 400 }
      )
    }

    const MAX_SIZE = 100 * 1024 * 1024 // 100 MB
    if (file.size > MAX_SIZE) {
      const actualSizeMB = (file.size / (1024 * 1024)).toFixed(1)
      return NextResponse.json(
        { error: `Ukuran berkas (${actualSizeMB} MB) melebihi batas 100MB.` },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Path traversal sanitization
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/\.\.+/g, "")
      .replace(/-+/g, "-")
    const filePath = `materials/${Date.now()}_${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage bucket: class-materials
    const { error: uploadError } = await supabase.storage
      .from("class-materials")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("[Upload Material Error]:", uploadError)
      return NextResponse.json(
        {
          error: `Gagal mengunggah ke Supabase Storage: ${uploadError.message}. Pastikan bucket 'class-materials' tersedia.`,
        },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("class-materials")
      .getPublicUrl(filePath)

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from("materials")
      .insert({
        title: cleanTitle,
        subject_name: cleanSubject,
        week_number,
        description: cleanDesc,
        file_url: publicUrlData.publicUrl,
        file_name: sanitizedName,
        file_size: file.size,
        file_type: "application/pdf",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[Insert Material Error]:", dbError)
      return NextResponse.json(
        { error: "Gagal menyimpan metadata modul: " + dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Modul PDF berhasil diunggah ke Supabase Storage!",
      material: dbData,
    })
  } catch (err: unknown) {
    console.error("[API Upload Catch Error]:", err)
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat mengunggah berkas."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
