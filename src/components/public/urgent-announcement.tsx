'use client'

import * as React from "react"
import { BellRing, Pin, X } from "lucide-react"

export interface UrgentAnnouncementProps {
  announcements?: Array<{
    id: string
    title: string
    content: string
    is_urgent: boolean
    author: string
    created_at: string
  }>
}

export function UrgentAnnouncement({ announcements }: UrgentAnnouncementProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

  const activeAnnouncement =
    announcements && announcements.length > 0
      ? announcements.find((a) => a.is_urgent)
      : null

  if (isDismissed || !activeAnnouncement) return null

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#FFEADA]/60 dark:bg-[#2A1810]/70 border border-[#FFCDCA] dark:border-amber-900/50 p-4 sm:p-5 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FF7643] text-white shadow-md shadow-[#FF7643]/20">
            <BellRing className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FF7643] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <Pin className="h-2.5 w-2.5" />
                Pengumuman Cepat
              </span>
              <h3 className="text-sm font-bold text-[#131E29] dark:text-white tracking-tight">
                {activeAnnouncement.title}
              </h3>
            </div>
            <p className="text-xs text-[#52647C] dark:text-slate-300 leading-relaxed max-w-3xl">
              {activeAnnouncement.content}
            </p>
            <p className="text-[10px] text-[#FF7643] dark:text-[#FFA07A] font-semibold pt-0.5">
              Dari: {activeAnnouncement.author} • {new Date(activeAnnouncement.created_at).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="self-start sm:self-center shrink-0 rounded-full bg-white/80 dark:bg-[#1E2433] p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors shadow-sm cursor-pointer"
          title="Tutup Pengumuman"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
