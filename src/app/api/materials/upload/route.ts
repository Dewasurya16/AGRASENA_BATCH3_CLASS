import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const maxDuration = 300 // 5 minutes timeout for large file uploads
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("prakom_admin_session")?.value

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
      return NextResponse.json(
        { error: "Konfigurasi Supabase belum tersedia di .env.local." },
        { status: 500 }
      )
    }

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
        { error: `Ukuran berkas (${actualSizeMB} MB) melebihi batas maksimum 100MB. Silakan kompres PDF terlebih dahulu.` },
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
          error: `Gagal mengunggah berkas ke Supabase Storage (${uploadError.message}). Pastikan bucket 'class-materials' tersedia dan memiliki izin Public/Anon.`,
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
        {
          error: `Berkas terunggah ke Storage, tetapi gagal menyimpan metadata ke database: ${dbError.message}`,
        },
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
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan internal saat memproses unggahan berkas."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
