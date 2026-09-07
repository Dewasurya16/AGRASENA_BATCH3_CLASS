import { createClient } from "@/lib/supabase/server"
import { createClient as createDirectClient } from "@supabase/supabase-js"
import { PublicShell } from "@/components/public/public-shell"
import { ResourceHub } from "@/components/public/resource-hub"
import { DEFAULT_MATERIALS } from "@/data/materials-data"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default async function MaterialsPage() {
  let materials: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    // 1. Try server client with cookies
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data && data.length > 0) {
        materials = data
      }
    } catch (err) {
      console.warn("MaterialsPage SSR fetch error with cookies client:", err)
    }

    // 2. Direct client fallback if cookie-based client returned empty/errored
    if (!materials || materials.length === 0) {
      try {
        const directClient = createDirectClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        })
        const { data, error } = await directClient
          .from("materials")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          materials = data
        }
      } catch (directErr) {
        console.error("MaterialsPage SSR direct client error:", directErr)
      }
    }
  }

  // If no materials fetched from Supabase, use the official default materials dataset (24 items)
  if (!materials || materials.length === 0) {
    materials = DEFAULT_MATERIALS
  }

  return (
    <PublicShell>
      <ResourceHub materials={materials} />
    </PublicShell>
  )
}

