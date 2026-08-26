import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { ShowcaseGallery } from "@/components/public/showcase-gallery"

export default async function ShowcasePage() {
  let showcases: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("showcases")
        .select("*")
        .order("created_at", { ascending: false })

      showcases = data || []
    } catch {
      // Fallback
    }
  }

  return (
    <PublicShell>
      <ShowcaseGallery showcases={showcases} />
    </PublicShell>
  )
}
