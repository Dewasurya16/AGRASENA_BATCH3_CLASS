import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { BATCH3_ZOOM_CONFIG } from "@/data/batch3/zoom-config"
import { BATCH4_ZOOM_CONFIG, BatchZoomConfig } from "@/data/batch4/zoom-config"
import {
  isRequestAdminAuthenticated,
  getClientIp,
  checkRateLimit,
  verifyCsrfOrigin,
  sanitizeInput,
} from "@/lib/security"

export const dynamic = "force-dynamic"
export const revalidate = 0

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
}

export async function GET() {
  let b3Config: BatchZoomConfig = { ...BATCH3_ZOOM_CONFIG }
  let b4Config: BatchZoomConfig = { ...BATCH4_ZOOM_CONFIG }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("wa_bot_config")
        .select("key, value")
        .in("key", ["zoom_config_batch3", "zoom_config_batch4"])

      if (data && Array.isArray(data)) {
        data.forEach((row) => {
          if (row.key === "zoom_config_batch3" && row.value && typeof row.value === "object") {
            b3Config = { ...b3Config, ...row.value }
          }
          if (row.key === "zoom_config_batch4" && row.value && typeof row.value === "object") {
            b4Config = { ...b4Config, ...row.value }
          }
        })
      }
    } catch (err) {
      console.warn("Error fetching zoom config from database:", err)
    }
  }

  return NextResponse.json(
    {
      success: true,
      batch3: b3Config,
      batch4: b4Config,
      timestamp: new Date().toISOString(),
    },
    { headers: NO_CACHE_HEADERS }
  )
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)

    // 1. Rate Limiting: Max 10 update requests per minute per IP (Protection against flood/DoS)
    const rateLimit = checkRateLimit(clientIp, "zoom_config_update", 10, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan pembaruan. Silakan tunggu ${rateLimit.retryAfter} detik.`,
        },
        { status: 429, headers: NO_CACHE_HEADERS }
      )
    }

    // 2. CSRF Origin Verification
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Invalid CSRF origin." },
        { status: 403, headers: NO_CACHE_HEADERS }
      )
    }

    // 3. Role-Based Authorization Guard (Spring Boot @PreAuthorize pattern)
    if (!isRequestAdminAuthenticated(req)) {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak: Pengaturan Zoom hanya dapat diubah oleh akun pengurus terautentikasi.",
        },
        { status: 401, headers: NO_CACHE_HEADERS }
      )
    }

    const body = await req.json()
    const { batch, zoomUrl, meetingId, passcode, sessionScheduleText, hostName } = body

    const batchNum = Number(batch) === 3 ? 3 : 4
    const key = batchNum === 3 ? "zoom_config_batch3" : "zoom_config_batch4"
    const baseConfig = batchNum === 3 ? BATCH3_ZOOM_CONFIG : BATCH4_ZOOM_CONFIG

    // 4. Input Validation & Strict Sanitization (Spring Boot Bean Validation pattern)
    const cleanZoomUrl = typeof zoomUrl === "string" ? sanitizeInput(zoomUrl.trim(), 500) : baseConfig.zoomUrl
    const cleanMeetingId = typeof meetingId === "string" ? sanitizeInput(meetingId.trim(), 100) : baseConfig.meetingId
    const cleanPasscode = typeof passcode === "string" ? sanitizeInput(passcode.trim(), 100) : baseConfig.passcode
    const cleanSchedule = typeof sessionScheduleText === "string" ? sanitizeInput(sessionScheduleText.trim(), 200) : baseConfig.sessionScheduleText
    const cleanHost = typeof hostName === "string" ? sanitizeInput(hostName.trim(), 150) : baseConfig.hostName

    // Validate Zoom URL scheme if provided
    if (cleanZoomUrl && !cleanZoomUrl.startsWith("https://") && !cleanZoomUrl.startsWith("http://")) {
      return NextResponse.json(
        {
          success: false,
          error: "Tautan Zoom harus berupa URL yang valid (diawali protokol https://).",
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const updatedConfig: BatchZoomConfig = {
      ...baseConfig,
      zoomUrl: cleanZoomUrl,
      meetingId: cleanMeetingId,
      passcode: cleanPasscode,
      sessionScheduleText: cleanSchedule,
      hostName: cleanHost,
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      try {
        const supabase = await createClient()
        await supabase.from("wa_bot_config").upsert(
          {
            key,
            value: updatedConfig,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
      } catch (dbErr: any) {
        console.warn("Supabase upsert zoom config error:", dbErr.message)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Kredensial Zoom untuk Agrasena Batch ${batchNum} berhasil diperbarui secara aman.`,
        config: updatedConfig,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses konfigurasi Zoom." },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)

    // 1. Rate Limiting: Max 10 delete requests per minute per IP
    const rateLimit = checkRateLimit(clientIp, "zoom_config_delete", 10, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan penghapusan. Silakan tunggu ${rateLimit.retryAfter} detik.`,
        },
        { status: 429, headers: NO_CACHE_HEADERS }
      )
    }

    // 2. CSRF Origin Verification
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Invalid CSRF origin." },
        { status: 403, headers: NO_CACHE_HEADERS }
      )
    }

    // 3. Role-Based Authorization Guard (Spring Boot @PreAuthorize pattern)
    if (!isRequestAdminAuthenticated(req)) {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak: Pengaturan Zoom hanya dapat dihapus oleh akun pengurus terautentikasi.",
        },
        { status: 401, headers: NO_CACHE_HEADERS }
      )
    }

    const { searchParams } = new URL(req.url)
    let batchParam = searchParams.get("batch")
    if (!batchParam) {
      try {
        const body = await req.json()
        batchParam = String(body.batch)
      } catch {}
    }

    const batchNum = Number(batchParam) === 3 ? 3 : 4
    const key = batchNum === 3 ? "zoom_config_batch3" : "zoom_config_batch4"
    const baseConfig = batchNum === 3 ? BATCH3_ZOOM_CONFIG : BATCH4_ZOOM_CONFIG

    // Hapus tautan dan kredensial akses
    const clearedConfig: BatchZoomConfig = {
      ...baseConfig,
      zoomUrl: "",
      meetingId: "",
      passcode: "",
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      try {
        const supabase = await createClient()
        await supabase.from("wa_bot_config").upsert(
          {
            key,
            value: clearedConfig,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
      } catch (dbErr: any) {
        console.warn("Supabase delete zoom config error:", dbErr.message)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Kredensial tautan Zoom untuk Agrasena Batch ${batchNum} berhasil dihapus.`,
        config: clearedConfig,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal menghapus konfigurasi Zoom." },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}

