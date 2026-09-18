import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  DEFAULT_MAINTENANCE_CONFIG,
  MAINTENANCE_CONFIG_DB_KEY,
  MAINTENANCE_COOKIE_NAME,
  MaintenanceConfig,
} from "@/lib/maintenance"
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
  Pragma: "no-cache",
  Expires: "0",
}

export async function GET(req: NextRequest) {
  let config: MaintenanceConfig = { ...DEFAULT_MAINTENANCE_CONFIG }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("wa_bot_config")
        .select("value")
        .eq("key", MAINTENANCE_CONFIG_DB_KEY)
        .maybeSingle()

      if (data && data.value) {
        const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value
        config = {
          enabled: Boolean(val.enabled),
          title: String(val.title || DEFAULT_MAINTENANCE_CONFIG.title),
          message: String(val.message || DEFAULT_MAINTENANCE_CONFIG.message),
          estimatedEnd: val.estimatedEnd ? String(val.estimatedEnd) : null,
          emergencyContact: String(val.emergencyContact || DEFAULT_MAINTENANCE_CONFIG.emergencyContact),
          updatedAt: String(val.updatedAt || new Date().toISOString()),
          updatedBy: String(val.updatedBy || "Sistem Badiklat Kejaksaan RI"),
        }
      }
    } catch (err) {
      console.warn("[API/maintenance] Error fetching maintenance config:", err)
    }
  }

  const res = NextResponse.json({ success: true, config }, { headers: NO_CACHE_HEADERS })

  // Synchronize edge cookie with current db status
  res.cookies.set({
    name: MAINTENANCE_COOKIE_NAME,
    value: config.enabled ? "1" : "0",
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 86400 * 30, // 30 days
  })

  return res
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = getClientIp(req)
  const { isLimited } = checkRateLimit(ip, "maint_post", 30, 60000)
  if (isLimited) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
      { status: 429, headers: NO_CACHE_HEADERS }
    )
  }

  // 2. CSRF Origin Verification
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json(
      { error: "Validasi CSRF gagal: Permintaan berasal dari origin tidak sah." },
      { status: 403, headers: NO_CACHE_HEADERS }
    )
  }

  // 3. Admin Authentication Guard
  if (!isRequestAdminAuthenticated(req)) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi administrator tidak valid atau telah kedaluwarsa." },
      { status: 401, headers: NO_CACHE_HEADERS }
    )
  }

  try {
    const body = await req.json()
    const { enabled, title, message, estimatedEnd, emergencyContact } = body || {}

    const sanitizedTitle = sanitizeInput(title || DEFAULT_MAINTENANCE_CONFIG.title, 150)
    const sanitizedMessage = sanitizeInput(message || DEFAULT_MAINTENANCE_CONFIG.message, 1500)
    const sanitizedContact = sanitizeInput(emergencyContact || DEFAULT_MAINTENANCE_CONFIG.emergencyContact, 50).replace(/[^\d+]/g, "")

    let validEstimatedEnd: string | null = null
    if (estimatedEnd) {
      const parsedDate = new Date(estimatedEnd)
      if (!isNaN(parsedDate.getTime())) {
        validEstimatedEnd = parsedDate.toISOString()
      }
    }

    const newConfig: MaintenanceConfig = {
      enabled: Boolean(enabled),
      title: sanitizedTitle || DEFAULT_MAINTENANCE_CONFIG.title,
      message: sanitizedMessage || DEFAULT_MAINTENANCE_CONFIG.message,
      estimatedEnd: validEstimatedEnd,
      emergencyContact: sanitizedContact || DEFAULT_MAINTENANCE_CONFIG.emergencyContact,
      updatedAt: new Date().toISOString(),
      updatedBy: "Administrator Diklat",
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      const supabase = await createClient()
      const { error: upsertError } = await supabase.from("wa_bot_config").upsert(
        {
          key: MAINTENANCE_CONFIG_DB_KEY,
          value: newConfig,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )

      if (upsertError) {
        console.error("[API/maintenance] Error saving config to Supabase:", upsertError)
        return NextResponse.json(
          { error: `Gagal menyimpan konfigurasi: ${upsertError.message}` },
          { status: 500, headers: NO_CACHE_HEADERS }
        )
      }
    }

    const res = NextResponse.json(
      {
        success: true,
        message: newConfig.enabled
          ? "Mode pemeliharaan berhasil DIAKTIFKAN. Pengunjung umum akan melihat layar maintenance."
          : "Mode pemeliharaan berhasil DINONAKTIFKAN. Seluruh akses portal telah kembali normal.",
        config: newConfig,
      },
      { headers: NO_CACHE_HEADERS }
    )

    // Clear any previous bypass cookie so admin immediately experiences the live maintenance state
    res.cookies.delete("admin_maint_bypass")

    // Update the edge cookie
    res.cookies.set({
      name: MAINTENANCE_COOKIE_NAME,
      value: newConfig.enabled ? "1" : "0",
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 86400 * 30,
    })

    return res
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server internal"
    return NextResponse.json(
      { error: `Gagal memproses pengaturan maintenance: ${msg}` },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}
