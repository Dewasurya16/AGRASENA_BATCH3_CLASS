import { createClient } from "@/lib/supabase/server"
import { AdminDashboardClient } from "./admin-dashboard-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminDashboardPage() {
  // 1. Periksa hak akses: Hanya Super Admin yang berwenang mengakses data log pengunjung & IP
  const { cookies } = await import("next/headers")
  const { verifySuperAdminSessionToken } = await import("@/lib/security")
  const cookieStore = await cookies()
  const superAdminCookie = cookieStore.get("prakom_super_admin")?.value
  const isSuperAdmin = verifySuperAdminSessionToken(superAdminCookie)

  let materials: any[] = []
  let schedules: any[] = []
  let tasks: any[] = []
  let announcements: any[] = []
  let visitorLogs: any[] = []
  let reports: any[] = []
  let totalVisitorCount = 0

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const queries: PromiseLike<any>[] = [
        supabase.from("materials").select("*").order("created_at", { ascending: false }),
        supabase.from("schedules").select("*").order("created_at", { ascending: true }),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("reports").select("*").order("created_at", { ascending: false }),
      ]

      // HANYA Super Admin yang mengambil data log IP & pengunjung
      if (isSuperAdmin) {
        queries.push(
          supabase.from("visitor_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(1000)
        )
      }

      const results = await Promise.all(queries)
      materials = results[0]?.data || []
      schedules = results[1]?.data || []
      tasks = results[2]?.data || []
      announcements = results[3]?.data || []
      reports = results[4]?.data || []

      if (isSuperAdmin && results[5]) {
        visitorLogs = results[5]?.data || []
        totalVisitorCount = results[5]?.count ?? visitorLogs.length
      }
    } catch {
      // Fallback if offline / connection issue
    }
  }

  return (
    <AdminDashboardClient
      initialMaterials={materials}
      initialSchedules={schedules}
      initialTasks={tasks}
      initialAnnouncements={announcements}
      initialVisitorLogs={visitorLogs}
      totalVisitorCount={totalVisitorCount}
      initialReports={reports}
      isSuperAdmin={isSuperAdmin}
    />
  )
}
