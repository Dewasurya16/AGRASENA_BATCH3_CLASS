import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { BATCH3_ZOOM_CONFIG } from "@/data/batch3/zoom-config"
import { BATCH4_ZOOM_CONFIG, BatchZoomConfig } from "@/data/batch4/zoom-config"

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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { batch, zoomUrl, meetingId, passcode, sessionScheduleText, hostName } = body

    const batchNum = Number(batch) === 3 ? 3 : 4
    const key = batchNum === 3 ? "zoom_config_batch3" : "zoom_config_batch4"
    const baseConfig = batchNum === 3 ? BATCH3_ZOOM_CONFIG : BATCH4_ZOOM_CONFIG

    const updatedConfig: BatchZoomConfig = {
      ...baseConfig,
      zoomUrl: typeof zoomUrl === "string" ? zoomUrl.trim() : baseConfig.zoomUrl,
      meetingId: typeof meetingId === "string" ? meetingId.trim() : baseConfig.meetingId,
      passcode: typeof passcode === "string" ? passcode.trim() : baseConfig.passcode,
      sessionScheduleText: typeof sessionScheduleText === "string" ? sessionScheduleText.trim() : baseConfig.sessionScheduleText,
      hostName: typeof hostName === "string" ? hostName.trim() : baseConfig.hostName,
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
        message: `Kredensial Zoom untuk Batch ${batchNum} berhasil diperbarui.`,
        config: updatedConfig,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memperbarui konfigurasi Zoom." },
      { status: 500 }
    )
  }
}
