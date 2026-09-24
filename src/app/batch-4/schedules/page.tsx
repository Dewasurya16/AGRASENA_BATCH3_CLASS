import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { LiveSessionBannerB4 } from "@/components/public/batch4/live-session-banner-b4"
import { SchedulesListB4 } from "@/components/public/batch4/schedules-list-b4"
import { getItemBatch } from "@/lib/roadmap-utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Jadwal 35 Hari Agrasena Batch 4 - Diklat Prakom Kejaksaan RI",
  description: "Kalender 35 hari roadmap, jadwal kuliah virtual Zoom, rincian JP, dan narasumber Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI 2026.",
}

export default async function Batch4SchedulesPage() {
  let schedules: any[] = []
  let tasks: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const [schedRes, taskRes] = await Promise.all([
        supabase.from("schedules").select("*").order("start_time", { ascending: true }),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
      ])

      const allScheds = schedRes.data || []
      schedules = allScheds.filter((s: any) => getItemBatch(s) === "batch-4")

      const allTasks = taskRes.data || []
      tasks = allTasks.filter((t: any) => getItemBatch(t) === "batch-4")
    } catch {
      // Offline fallback
    }
  }

  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Switcher Back to Batch 3 Header Pill */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Jadwal Khusus: <strong className="text-emerald-600 dark:text-emerald-400">Agrasena Batch 4</strong>
          </span>
          <Link
            href="/schedules?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <span>Buka Jadwal Batch 3</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Live Zoom Banner Batch 4 */}
        <LiveSessionBannerB4 todaySchedules={schedules} todayTasks={tasks} variant="schedule" />

        {/* 35 Days Schedule List Batch 4 */}
        <SchedulesListB4 initialSchedules={schedules} />

      </div>
    </PublicShell>
  )
}
