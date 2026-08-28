'use client'

import * as React from "react"
import { Clock, ExternalLink, Flame, CheckCircle2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TaskRecord {
  id: string
  title: string
  subject_name: string
  description?: string | null
  due_date: string
  status: "todo" | "in_progress" | "completed"
  submission_link?: string | null
}

export function TaskBoard({ tasks = [] }: { tasks?: TaskRecord[] }) {
  const [filterStatus, setFilterStatus] = React.useState<string>("all")

  const filtered = tasks.filter((t) => {
    if (filterStatus === "all") return true
    return t.status === filterStatus
  })

  return (
    <section id="tasks" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Daftar Tugas & Deadline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pantau status pengerjaan tugas akademik dan batas waktu pengumpulan
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 rounded-[8px] bg-slate-100 dark:bg-[#1B2130] p-1 border border-slate-200/80 dark:border-[#2A3550] shadow-2xs self-start sm:self-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "todo", label: "Belum Selesai" },
            { id: "completed", label: "Selesai" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`rounded-[6px] px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                filterStatus === f.id
                  ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#253045]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[14px] bg-white dark:bg-[#1B2130] p-10 text-center border border-dashed border-slate-200/90 dark:border-[#2A3550] space-y-2.5">
          <BookOpen className="h-9 w-9 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">Belum Ada Tugas Aktif</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tidak ada tugas yang perlu dikumpulkan saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="rounded-[12px] bg-white dark:bg-[#1B2130] p-4 sm:p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs hover:border-slate-400 dark:hover:border-slate-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-orange-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-[9px] font-black uppercase text-orange-700 dark:text-amber-300 border border-orange-200 dark:border-amber-900/60">
                    {task.subject_name.startsWith("Tahap") ? task.subject_name : `Tahap • ${task.subject_name}`}
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                    task.status === "completed" ? "text-emerald-700 dark:text-emerald-400" : "text-orange-600 dark:text-amber-400"
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(task.due_date).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" })} (23:59 WIB)</span>
                  </span>
                </div>

                <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {task.description}
                  </p>
                )}
              </div>

              {task.submission_link && (
                <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Pengumpulan: Portal LMS</span>
                  <a
                    href={task.submission_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-black text-orange-600 dark:text-amber-400 hover:underline"
                  >
                    <span>Kirim Tugas</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
