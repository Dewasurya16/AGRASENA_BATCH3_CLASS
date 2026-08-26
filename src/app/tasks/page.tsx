import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { HeroCountdown } from "@/components/public/hero-countdown"
import { TaskBoard } from "@/components/public/task-board"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TasksPage() {
  let tasks: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })

      tasks = data || []
    } catch {
      // Fallback
    }
  }

  const closestTask = tasks.find((t) => t.status !== "completed")

  return (
    <PublicShell>
      <div className="space-y-6">
        <HeroCountdown targetTask={closestTask} />
        <TaskBoard tasks={tasks} />
      </div>
    </PublicShell>
  )
}
