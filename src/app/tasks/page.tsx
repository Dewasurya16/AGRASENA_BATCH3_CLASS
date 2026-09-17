import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { HeroCountdown } from "@/components/public/hero-countdown"
import { TaskBoard, TaskRecord } from "@/components/public/task-board"
import { getTaskDeadlineTimestamp } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Daftar Tugas Agrasena Batch 3 - Diklat Prakom Kejaksaan RI",
  description: "Daftar penugasan mandiri, tugas praktikum laboratorium, dan tenggat waktu kelulusan peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 3 Kejaksaan RI 2026.",
}

export default async function TasksPage() {
  let allTasks: TaskRecord[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })

      allTasks = data || []
    } catch {
      // Fallback
    }
  }

  // Filter out any tasks specifically assigned to Batch 4
  const batch3Tasks = allTasks.filter((t: any) =>
    !t.title?.toLowerCase().includes("batch 4") &&
    !t.subject_name?.toLowerCase().includes("batch 4") &&
    t.batch !== 4 &&
    t.batch !== "batch-4"
  )

  const now = new Date().getTime()
  const activeTasks = batch3Tasks.filter((t) => t.status !== "completed")
  const futureTasks = activeTasks.filter((t) => getTaskDeadlineTimestamp(t.due_date) > now)
  const closestTask = futureTasks.length > 0 ? futureTasks[0] : (activeTasks.length > 0 ? activeTasks[0] : null)

  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Switcher notice to Batch 4 */}
        <div className="rounded-[16px] bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#007aff] text-white text-xs font-black shrink-0">
              3
            </span>
            <div className="text-xs">
              <span className="font-bold text-sky-950 dark:text-sky-200">
                Daftar Penugasan & Uji Kompetensi: Agrasena Batch 3.
              </span>{" "}
              <span className="text-sky-800/80 dark:text-sky-300/80">
                Tenggat pengumpulan terintegrasi dengan LMS Badiklat Kejaksaan RI.
              </span>
            </div>
          </div>
          <Link
            href="/batch-4/tasks"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] hover:underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Tugas Batch 4</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <HeroCountdown targetTask={closestTask} />
        <TaskBoard tasks={batch3Tasks} />
      </div>
    </PublicShell>
  )
}

