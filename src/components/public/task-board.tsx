'use client'

import * as React from "react"
import { Clock, ExternalLink, Flame, CheckCircle2, BookOpen } from "lucide-react"
import { getTaskDeadlineTimestamp } from "@/lib/utils"

export interface TaskRecord {
  id: string
  title: string
  subject_name: string
  description?: string | null
  due_date: string
  status: "todo" | "in_progress" | "completed"
  submission_link?: string | null
}

export function isTaskEffectivelyCompleted(task: { status?: string; due_date?: string }) {
  if (task.status === "completed") return true
  if (task.due_date) {
    const deadlineMs = getTaskDeadlineTimestamp(task.due_date)
    if (deadlineMs > 0 && Date.now() > deadlineMs) return true
  }
  return false
}

export function TaskBoard({ tasks = [] }: { tasks?: TaskRecord[] }) {
  const [filterStatus, setFilterStatus] = React.useState<string>("all")

  const filtered = tasks.filter((t) => {
    const isCompleted = isTaskEffectivelyCompleted(t)
    if (filterStatus === "all") return true
    if (filterStatus === "completed") return isCompleted
    if (filterStatus === "todo") return !isCompleted
    return true
  })

  return (
    <section id="tasks" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#000000] dark:text-white">
            Daftar Tugas Aktif
          </h3>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
            Pilih filter status untuk memilah tugas yang perlu diselesaikan ({tasks.length} tugas terdaftar)
          </p>
        </div>

        {/* Filter Stadium Pills */}
        <div className="flex items-center gap-1 rounded-full bg-[#f6f5f4] dark:bg-[#141b27] p-1 border border-[#e6e6e6] dark:border-white/10 self-start sm:self-auto">
          {[
            { id: "all", label: "Semua Tugas" },
            { id: "todo", label: "Belum Selesai" },
            { id: "completed", label: "Selesai" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === f.id
                  ? "bg-[#007aff] text-white shadow-2xs"
                  : "text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[12px] bg-white dark:bg-[#141b27] p-10 text-center border border-dashed border-[#e6e6e6] dark:border-white/10 space-y-2.5">
          <BookOpen className="h-9 w-9 text-[#94a3b8] mx-auto" strokeWidth={2} />
          <h4 className="font-bold text-base text-[#000000] dark:text-white">Belum Ada Tugas</h4>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8] max-w-md mx-auto">
            Tidak ada tugas yang sesuai untuk filter status ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((task) => {
            const isCompleted = isTaskEffectivelyCompleted(task)
            return (
              <div
                key={task.id}
                className="rounded-[14px] bg-white dark:bg-[#141b27] p-5 border border-[#e6e6e6] dark:border-white/10 shadow-2xs hover:border-[#007aff]/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-2.5 py-0.5 text-[10px] font-semibold">
                      {task.subject_name.startsWith("Tahap") ? task.subject_name : `Tahap • ${task.subject_name}`}
                    </span>
                    <span className={`text-xs font-semibold flex items-center gap-1 shrink-0 ${
                      isCompleted ? "text-[#34c759] dark:text-[#4ade80]" : "text-[#ff9500] dark:text-[#fbbf24]"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      <span>
                        {new Date(task.due_date).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" })} {isCompleted ? "• Selesai" : "(23:59 WIB)"}
                      </span>
                    </span>
                  </div>

                <h4 className="font-bold text-base text-[#000000] dark:text-white">{task.title}</h4>
                {task.description && (
                  <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed line-clamp-3">
                    {task.description}
                  </p>
                )}
              </div>

              {task.submission_link && (
                <div className="pt-3 border-t border-[#e6e6e6] dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#615d59] dark:text-[#94a3b8] font-medium">Pengumpulan: Portal LMS</span>
                  <a
                    href={task.submission_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer"
                  >
                    <span>Kumpulkan Tugas</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-90" strokeWidth={2} />
                  </a>
                </div>
              )}
            </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
