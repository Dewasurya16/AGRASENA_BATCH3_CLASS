import { createClient } from "@/lib/supabase/server"
import { AdminDashboardClient } from "./admin-dashboard-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminDashboardPage() {
  let materials: any[] = []
  let schedules: any[] = []
  let tasks: any[] = []
  let announcements: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const [matRes, schRes, taskRes, annRes] = await Promise.all([
        supabase.from("materials").select("*").order("created_at", { ascending: false }),
        supabase.from("schedules").select("*").order("created_at", { ascending: true }),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      ])

      materials = matRes.data || []
      schedules = schRes.data || []
      tasks = taskRes.data || []
      announcements = annRes.data || []
    } catch {
      // Fallback
    }
  }

  return (
    <AdminDashboardClient
      initialMaterials={materials}
      initialSchedules={schedules}
      initialTasks={tasks}
      initialAnnouncements={announcements}
    />
  )
}
