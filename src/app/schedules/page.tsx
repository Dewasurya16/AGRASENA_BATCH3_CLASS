import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { SchedulesList } from "@/components/public/schedules-list"
import { LiveSessionBanner } from "@/components/public/live-session-banner"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SchedulesPage() {
  let schedules: any[] = []
  let tasks: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const [schedRes, taskRes] = await Promise.all([
        supabase.from("schedules").select("*").order("created_at", { ascending: true }),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
      ])

      schedules = schedRes.data || []
      tasks = taskRes.data || []
    } catch {
      // Fallback
    }
  }

  return (
    <PublicShell>
      <div className="space-y-6">
        <LiveSessionBanner todaySchedules={schedules} todayTasks={tasks} variant="schedule" />
        <SchedulesList schedules={schedules} />
      </div>
    </PublicShell>
  )
}
