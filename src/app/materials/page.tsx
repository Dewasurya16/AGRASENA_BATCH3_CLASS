import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { ResourceHub } from "@/components/public/resource-hub"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function MaterialsPage() {
  let materials: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("materials")
        .select("*")
        .order("created_at", { ascending: false })

      materials = data || []
    } catch {
      // Fallback
    }
  }

  return (
    <PublicShell>
      <ResourceHub materials={materials} />
    </PublicShell>
  )
}
