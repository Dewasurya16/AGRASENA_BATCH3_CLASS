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
    <section id="tasks" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#131E29]">
            Daftar Tugas & Deadline
          </h3>
          <p className="text-xs text-[#6B7C93]">
            Pantau status pengerjaan tugas akademik dan batas waktu pengumpulan
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs self-start sm:self-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "todo", label: "Belum Selesai" },
            { id: "completed", label: "Selesai" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterStatus === f.id
                  ? "bg-[#18181B] text-white shadow-xs"
                  : "text-[#6B7C93] hover:text-[#18181B] hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[32px] bg-white p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-base text-[#18181B]">Belum Ada Tugas Aktif</h4>
          <p className="text-xs text-[#6B7C93] max-w-md mx-auto">
            Tidak ada tugas yang perlu dikumpulkan saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="rounded-[28px] bg-white p-6 border border-slate-200 shadow-xs hover:border-[#18181B] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#FFEADA] px-3 py-1 text-[10px] font-black uppercase text-[#EA580C]">
                    {task.subject_name}
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    task.status === "completed" ? "text-[#0D824B]" : "text-[#EA580C]"
                  }`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(task.due_date).toLocaleDateString("id-ID")}</span>
                  </span>
                </div>

                <h4 className="font-black text-base text-[#18181B]">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-[#52647C] leading-relaxed line-clamp-3">
                    {task.description}
                  </p>
                )}
              </div>

              {task.submission_link && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#6B7C93] font-medium">Pengumpulan: Portal LMS</span>
                  <a
                    href={task.submission_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-black text-[#FF7643] hover:underline"
                  >
                    <span>Kirim Tugas</span>
                    <ExternalLink className="h-3.5 w-3.5" />
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
