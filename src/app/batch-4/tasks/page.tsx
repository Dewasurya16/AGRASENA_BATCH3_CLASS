import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { HeroCountdown } from "@/components/public/hero-countdown"
import { TaskBoard, TaskRecord } from "@/components/public/task-board"
import { DEFAULT_BATCH4_TASKS } from "@/data/batch4/tasks-data"
import { getTaskDeadlineTimestamp } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Daftar Tugas Agrasena Batch 4 - Diklat Prakom Kejaksaan RI",
  description: "Daftar penugasan mandiri, tugas praktikum laboratorium, dan tenggat waktu kelulusan peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI 2026.",
}

export default async function Batch4TasksPage() {
  let dbTasks: TaskRecord[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })

      if (data && data.length > 0) {
        // Filter tasks explicitly for Batch 4
        dbTasks = data.filter((t: any) =>
          (t.title && t.title.toLowerCase().includes("batch 4")) ||
          (t.subject_name && t.subject_name.toLowerCase().includes("batch 4")) ||
          t.batch === 4 ||
          t.batch === "batch-4"
        )
      }
    } catch {
      // Fallback to default Batch 4 tasks
    }
  }

  // Combine or fallback to DEFAULT_BATCH4_TASKS
  const allBatch4Tasks: TaskRecord[] = dbTasks.length > 0 ? dbTasks : DEFAULT_BATCH4_TASKS

  const now = new Date().getTime()
  const activeTasks = allBatch4Tasks.filter((t) => t.status !== "completed")
  const futureTasks = activeTasks.filter((t) => getTaskDeadlineTimestamp(t.due_date) > now)
  const closestTask = futureTasks.length > 0 ? futureTasks[0] : (activeTasks.length > 0 ? activeTasks[0] : null)

  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Switcher notice to Batch 3 */}
        <div className="rounded-[16px] bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black shrink-0">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                Daftar Penugasan & Uji Kompetensi: Agrasena Batch 4.
              </span>{" "}
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                Tenggat pengumpulan terintegrasi dengan LMS Badiklat Kejaksaan RI.
              </span>
            </div>
          </div>
          <Link
            href="/tasks?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Tugas Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Hero Countdown Target Batch 4 */}
        <HeroCountdown targetTask={closestTask} />

        {/* Task Board Component */}
        <TaskBoard tasks={allBatch4Tasks} />

      </div>
    </PublicShell>
  )
}
