'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Flame, CheckCircle2, Sparkles, Coffee } from "lucide-react"
import Link from "next/link"

import { getTaskDeadlineTimestamp } from "@/lib/utils"

export interface TaskItem {
  id: string
  title: string
  subject_name: string
  due_date: string
  description?: string | null
  submission_link?: string | null
  status?: string
}

export function HomeTaskReminder({ targetTask }: { targetTask?: TaskItem | null }) {
  const [mounted, setMounted] = React.useState(false)

  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  React.useEffect(() => {
    setMounted(true)
    if (!targetTask) return

    const calculateTime = () => {
      const targetDate = getTaskDeadlineTimestamp(targetTask.due_date)
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [targetTask])

  // JIKA TIDAK ADA TUGAS AKTIF ATAU SUDAH MELEWATI BATAS WAKTU -> TAMPILKAN STATUS REHAT / SEMUA TUGAS BERES
  if (!targetTask || (mounted && timeLeft.isExpired)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-[14px] bg-gradient-to-r from-emerald-500/[0.06] via-teal-500/[0.04] to-indigo-500/[0.04] dark:from-emerald-950/30 dark:via-[#161F2E] dark:to-[#1B2130] p-3.5 sm:p-4 border border-emerald-500/20 dark:border-emerald-800/40 shadow-2xs transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          {/* Left Info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  ✨ Bebas Tanggungan Tugas
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Semua Tugas Selesai Dikumpulkan
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                Tidak ada tanggungan tugas mendesak saat ini • Selamat beristirahat!
              </h4>
            </div>
          </div>

          {/* Right Status & CTA */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            <div className="flex items-center gap-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1.5 border border-emerald-200/70 dark:border-emerald-800/40 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <Coffee className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Waktu Santai</span>
            </div>

            <Link href="/tasks">
              <button className="flex items-center gap-1 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xs cursor-pointer">
                <span>Daftar Tugas</span>
                <ArrowRight className="h-3 w-3 text-amber-300 dark:text-white" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-[14px] bg-white dark:bg-[#1B2130] p-3.5 sm:p-4 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs hover:border-slate-300 dark:hover:border-[#374563] transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-orange-100 dark:bg-amber-950/70 text-orange-600 dark:text-amber-400">
            <Flame className="h-4 w-4 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-100 dark:bg-amber-950/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-700 dark:text-amber-300">
                Tenggat Tugas Terdekat
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {targetTask.subject_name}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 line-clamp-1">
              {targetTask.title}
            </h4>
          </div>
        </div>

        {/* Right Mini Countdown & CTA Button */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <div
            className="flex items-center gap-1.5 rounded-[8px] bg-slate-100 dark:bg-[#161B26] px-2.5 py-1.5 border border-slate-200 dark:border-[#2A3550] text-[11px] font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums"
            suppressHydrationWarning
          >
            <Clock className="h-3 w-3 text-orange-500 dark:text-amber-400" />
            {mounted ? (
              <div className="flex items-center gap-1">
                {timeLeft.days > 0 && <span>{timeLeft.days}h</span>}
                <span>{String(timeLeft.hours).padStart(2, "0")}j</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                <span className="text-orange-600 dark:text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}d</span>
              </div>
            ) : (
              <span>--:--:--</span>
            )}
          </div>

          <Link href="/tasks">
            <button className="flex items-center gap-1 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xs cursor-pointer">
              <span>Buka Tugas</span>
              <ArrowRight className="h-3 w-3 text-amber-300 dark:text-white" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
