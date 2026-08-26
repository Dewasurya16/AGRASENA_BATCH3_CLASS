import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { SchedulesList } from "@/components/public/schedules-list"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SchedulesPage() {
  let schedules: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("schedules")
        .select("*")
        .order("created_at", { ascending: true })

      schedules = data || []
    } catch {
      // Fallback
    }
  }

  return (
    <PublicShell>
      <SchedulesList schedules={schedules} />
    </PublicShell>
  )
}
