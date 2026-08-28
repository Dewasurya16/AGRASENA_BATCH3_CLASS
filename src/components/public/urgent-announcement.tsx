'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, ArrowRight, BellRing } from "lucide-react"
import Link from "next/link"

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

  const item = announcements?.find((a) => a.is_urgent) ?? null

  if (isDismissed || !item) return null

  const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Pengumuman penting"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className="relative overflow-hidden rounded-[14px] bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.04] to-orange-500/[0.02] dark:from-amber-950/40 dark:via-[#1C1713] dark:to-[#181E2C] border border-amber-500/25 dark:border-amber-500/35 p-3.5 sm:p-4 shadow-xs transition-all"
      >
        <div className="flex items-start gap-3 sm:gap-3.5">
          {/* Refined Icon Pod */}
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 mt-0.5">
            <Bell className="h-4 w-4 animate-[swing_2s_ease-in-out_infinite]" />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            {/* Top Bar: Badge + Title */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-200 border border-amber-500/35 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                  Pengumuman Mendesak
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {item.author} · {formattedDate}
                </span>
              </div>
            </div>

            {/* Title */}
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
              {item.title}
            </h4>

            {/* Content Body: Full Text Visibility */}
            <div className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {item.content}
            </div>

            {/* Bottom Actions Bar with Navigation to /announcements */}
            <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2">
              <Link href="/announcements">
                <button className="inline-flex items-center gap-1.5 rounded-[8px] bg-amber-500/20 hover:bg-amber-500/30 dark:bg-amber-500/25 dark:hover:bg-amber-500/35 border border-amber-500/35 px-3 py-1.5 text-xs font-black text-amber-900 dark:text-amber-200 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                  <BellRing className="h-3.5 w-3.5" />
                  <span>Lihat Semua Pengumuman</span>
                  <ArrowRight className="h-3 w-3 text-amber-800 dark:text-amber-300" />
                </button>
              </Link>
            </div>
          </div>

          {/* Close Action Button */}
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Tutup pengumuman"
            className="p-1 rounded-[6px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-amber-500/15 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 absolute right-3 top-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
