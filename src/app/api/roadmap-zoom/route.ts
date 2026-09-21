import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  RoadmapZoomClass,
  RoadmapZoomConfig,
  getDefaultRoadmapConfig
} from "@/lib/roadmap-zoom-client"
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const batchNum = Number(searchParams.get("batch")) === 4 ? 4 : 3
  const key = batchNum === 4 ? "roadmap_zoom_batch4" : "roadmap_zoom_batch3"

  let resultPayload: RoadmapZoomConfig = getDefaultRoadmapConfig(batchNum)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("wa_bot_config")
        .select("key, value")
        .eq("key", key)
        .maybeSingle()

      if (data && data.value && typeof data.value === "object") {
        const val = data.value
        resultPayload = {
          globalPasscode: val.globalPasscode || resultPayload.globalPasscode,
          classes: Array.isArray(val.classes)
            ? val.classes.map((item: any, idx: number) => ({
                id: String(item.id || item.angkatan || idx + 1),
                name: String(item.name || `Angkatan ${idx + 1}`),
                badge: String(item.badge || "Ahli Pertama"),
                meetingId: String(item.meetingId || item.meetingIdDisplay || ""),
                passcode: String(item.passcode || val.globalPasscode || resultPayload.globalPasscode),
                url: String(item.url || item.joinUrl || ""),
                highlight: Boolean(item.highlight ?? item.isHighlight),
              }))
            : resultPayload.classes,
        }
      }
    } catch (err) {
      console.warn("Error fetching roadmap zoom from database:", err)
    }
  }

  return NextResponse.json(
    {
      success: true,
      batch: batchNum,
      globalPasscode: resultPayload.globalPasscode,
      classes: resultPayload.classes,
      data: resultPayload,
      timestamp: new Date().toISOString(),
    },
    { headers: NO_CACHE_HEADERS }
  )
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)

    // 1. Rate Limiting
    const rateLimit = checkRateLimit(clientIp, "roadmap_zoom_update", 15, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan. Silakan tunggu ${rateLimit.retryAfter} detik.`,
        },
        { status: 429, headers: NO_CACHE_HEADERS }
      )
    }

    // 2. CSRF Verification
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Invalid CSRF origin." },
        { status: 403, headers: NO_CACHE_HEADERS }
      )
    }

    // 3. Admin Authentication
    if (!isRequestAdminAuthenticated(req)) {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak: Hanya admin yang dapat mengubah ruang Zoom roadmap.",
        },
        { status: 401, headers: NO_CACHE_HEADERS }
      )
    }

    const body = await req.json()
    const { batch, globalPasscode, classes } = body
    const batchNum = Number(batch) === 4 ? 4 : 3
    const key = batchNum === 4 ? "roadmap_zoom_batch4" : "roadmap_zoom_batch3"

    const cleanGlobalPasscode = sanitizeInput(String(globalPasscode || "").trim(), 100)

    const cleanClasses: RoadmapZoomClass[] = Array.isArray(classes)
      ? classes.map((item: any, idx: number) => {
          const id = sanitizeInput(String(item.id || item.angkatan || idx + 1).trim(), 50)
          const name = sanitizeInput(String(item.name || `Angkatan ${id}`).trim(), 100)
          const badge = sanitizeInput(String(item.badge || "Ahli Pertama").trim(), 50)
          const meetingId = sanitizeInput(String(item.meetingId || item.meetingIdDisplay || "").trim(), 100)
          const passcode = sanitizeInput(String(item.passcode || cleanGlobalPasscode || "").trim(), 100)
          const url = sanitizeInput(String(item.url || item.joinUrl || "").trim(), 500)
          const highlight = Boolean(item.highlight ?? item.isHighlight)

          return {
            id,
            name,
            badge,
            meetingId,
            passcode,
            url,
            highlight,
          }
        })
      : getDefaultRoadmapConfig(batchNum).classes

    const payloadToSave: RoadmapZoomConfig = {
      globalPasscode: cleanGlobalPasscode || (batchNum === 4 ? "AGRASENA4" : "Biropeg-24"),
      classes: cleanClasses,
      updatedAt: new Date().toISOString(),
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      try {
        const supabase = await createClient()
        await supabase.from("wa_bot_config").upsert(
          {
            key,
            value: payloadToSave,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
      } catch (dbErr: any) {
        console.warn("Supabase upsert roadmap zoom error:", dbErr.message)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Ruang Zoom Roadmap Agrasena Batch ${batchNum} berhasil disimpan.`,
        data: payloadToSave,
        classes: cleanClasses,
        globalPasscode: payloadToSave.globalPasscode,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses ruang Zoom roadmap." },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)

    const rateLimit = checkRateLimit(clientIp, "roadmap_zoom_delete", 10, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { success: false, error: `Tunggu ${rateLimit.retryAfter} detik.` },
        { status: 429, headers: NO_CACHE_HEADERS }
      )
    }

    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json({ success: false, error: "Akses ditolak: Invalid CSRF origin." }, { status: 403, headers: NO_CACHE_HEADERS })
    }

    if (!isRequestAdminAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 401, headers: NO_CACHE_HEADERS })
    }

    const { searchParams } = new URL(req.url)
    const batchNum = Number(searchParams.get("batch")) === 4 ? 4 : 3
    const classIdToDelete = searchParams.get("id") || searchParams.get("angkatan")
    const key = batchNum === 4 ? "roadmap_zoom_batch4" : "roadmap_zoom_batch3"

    let currentData: RoadmapZoomConfig = getDefaultRoadmapConfig(batchNum)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      try {
        const supabase = await createClient()
        const { data } = await supabase.from("wa_bot_config").select("value").eq("key", key).maybeSingle()
        if (data && data.value) {
          currentData = data.value
        }
      } catch {}
    }

    if (classIdToDelete) {
      currentData.classes = currentData.classes.filter((c) => c.id !== String(classIdToDelete))
    } else {
      currentData = getDefaultRoadmapConfig(batchNum)
    }

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      try {
        const supabase = await createClient()
        await supabase.from("wa_bot_config").upsert(
          {
            key,
            value: currentData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
      } catch (dbErr: any) {
        console.warn("Supabase delete roadmap zoom error:", dbErr.message)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Ruang Zoom Roadmap Batch ${batchNum} berhasil di-reset / diperbarui.`,
        data: currentData,
        classes: currentData.classes,
        globalPasscode: currentData.globalPasscode,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Gagal menghapus ruang Zoom roadmap." }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}
