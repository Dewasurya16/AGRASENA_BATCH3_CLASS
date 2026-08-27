import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 300 // 5 minutes timeout
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
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
    // This mode handles 10MB - 100MB+ files without ever hitting Vercel 4.5MB Payload limit!
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

      if (!title || !subject_name || !file_url || !file_name) {
        return NextResponse.json(
          { error: "Judul modul, tahapan diklat, dan tautan berkas wajib diisi." },
          { status: 400 }
        )
      }

      const supabase = await createClient()
      const { data: dbData, error: dbError } = await supabase
        .from("materials")
        .insert({
          title: String(title).trim(),
          subject_name: String(subject_name).trim(),
          week_number: Number(week_number) || 1,
          description: description ? String(description).trim() : null,
          file_url: String(file_url).trim(),
          file_name: String(file_name).trim(),
          file_size: Number(file_size) || 0,
          file_type: String(file_type).trim(),
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

    if (!title || !subject_name || !file || file.size === 0) {
      return NextResponse.json(
        { error: "Judul, tahapan diklat, dan berkas PDF wajib diisi." },
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

    // Clean & sanitize file name
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/-+/g, "-")
    const filePath = `materials/${Date.now()}_${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage bucket: class-materials
    const { error: uploadError } = await supabase.storage
      .from("class-materials")
      .upload(filePath, buffer, {
        contentType: file.type || "application/pdf",
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
        title,
        subject_name,
        week_number,
        description: description || null,
        file_url: publicUrlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type || "application/pdf",
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
