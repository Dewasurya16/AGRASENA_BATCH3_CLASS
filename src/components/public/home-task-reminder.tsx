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
        className="rounded-[14px] bg-white dark:bg-[#141b27] p-4 sm:p-5 border border-[#e6e6e6] dark:border-white/10 shadow-xs transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Info */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#16a34a]/10 dark:bg-[#16a34a]/20 text-[#16a34a] dark:text-[#4ade80] border border-[#16a34a]/20 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#16a34a]/10 dark:bg-[#16a34a]/20 text-[#16a34a] dark:text-[#4ade80] border border-[#16a34a]/20 px-2.5 py-0.5 text-[10px] font-semibold">
                  <Sparkles className="h-3 w-3 text-[#16a34a] dark:text-[#4ade80]" strokeWidth={2} />
                  <span>Bebas Tugas</span>
                </span>
                <span className="text-xs font-semibold text-[#16a34a] dark:text-[#4ade80]">
                  Semua Tugas Selesai Dikumpulkan
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#000000] dark:text-white">
                Tidak ada tanggungan tugas mendesak saat ini • Selamat beristirahat!
              </h4>
            </div>
          </div>

          {/* Right Status & CTA */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <div className="flex items-center gap-1.5 rounded-[8px] bg-[#f6f5f4] dark:bg-[#101520] px-3 py-1.5 border border-[#e6e6e6] dark:border-white/10 text-xs font-medium text-[#31302e] dark:text-[#cbd5e1] shadow-2xs">
              <Coffee className="h-3.5 w-3.5 text-[#16a34a] dark:text-[#4ade80]" strokeWidth={2} />
              <span>Waktu Santai</span>
            </div>

            <Link href="/tasks">
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-4 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer">
                <span>Daftar Tugas</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
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
      className="relative overflow-hidden rounded-[14px] bg-white dark:bg-[#141b27] p-4 sm:p-5 border border-[#e6e6e6] dark:border-white/10 shadow-xs transition-all"
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#d97706]/10 dark:bg-[#d97706]/20 text-[#d97706] dark:text-[#fbbf24] border border-[#d97706]/20 shadow-2xs mt-0.5">
            <Flame className="h-5 w-5 animate-pulse" strokeWidth={2} />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#d97706]/10 dark:bg-[#d97706]/20 text-[#d97706] dark:text-[#fbbf24] border border-[#d97706]/20 px-2.5 py-0.5 text-[10px] font-semibold">
                <Clock className="h-3 w-3 text-[#d97706] dark:text-[#fbbf24]" strokeWidth={2} />
                <span>Tugas Aktif LMS</span>
              </span>
              <span className="text-[11px] font-medium text-[#615d59] dark:text-[#94a3b8]">
                {targetTask.subject_name}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white">
              {targetTask.title}
            </h4>

            {targetTask.description && (
              <p className="text-xs text-[#31302e] dark:text-[#cbd5e1] leading-relaxed max-w-xl line-clamp-1">
                {targetTask.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Live Countdown + Action Button */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-center shrink-0">
          {mounted && (
            <div className="flex items-center gap-1.5 rounded-[8px] bg-[#f6f5f4] dark:bg-[#101520] px-3 py-1.5 border border-[#e6e6e6] dark:border-white/10 text-xs font-mono font-bold text-[#d97706] dark:text-[#fbbf24] tabular-nums shadow-2xs">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              <span>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          )}

          <Link href="/tasks">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-4 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer">
              <span>Buka Tugas</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
