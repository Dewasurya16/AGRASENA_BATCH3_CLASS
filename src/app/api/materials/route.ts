import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createDirectClient } from "@supabase/supabase-js"
import { DEFAULT_MATERIALS } from "@/data/materials-data"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
      // 1. Try server client with cookies
      let materialsData: any[] | null = null

      try {
        const supabase = await createClient()
        const { data, error } = await supabase
          .from("materials")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          materialsData = data
        }
      } catch (serverClientErr) {
        console.warn("Server cookie client failed, trying direct Supabase client:", serverClientErr)
      }

      // 2. Direct client fallback (independent of cookies/headers)
      if (!materialsData) {
        const directClient = createDirectClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        })
        const { data, error } = await directClient
          .from("materials")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          materialsData = data
        }
      }

      if (materialsData && materialsData.length > 0) {
        return NextResponse.json(
          {
            success: true,
            count: materialsData.length,
            data: materialsData,
            source: "database",
            timestamp: new Date().toISOString(),
          },
          {
            headers: NO_CACHE_HEADERS,
          }
        )
      }
    }
  } catch (err: any) {
    console.error("GET /api/materials error:", err)
  }

  // Fallback to static official materials (now complete with all 24 modules)
  return NextResponse.json(
    {
      success: true,
      count: DEFAULT_MATERIALS.length,
      data: DEFAULT_MATERIALS,
      source: "fallback",
      timestamp: new Date().toISOString(),
    },
    {
      headers: NO_CACHE_HEADERS,
    }
  )
}

