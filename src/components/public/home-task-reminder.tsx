'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Flame, CheckCircle2 } from "lucide-react"
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

export function HomeTaskReminder({ targetTask }: { targetTask?: TaskItem }) {
  if (!targetTask) return null

  const task = targetTask
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
    const calculateTime = () => {
      const targetDate = getTaskDeadlineTimestamp(task.due_date)
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
  }, [task.due_date])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl bg-white dark:bg-[#12161F] p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFEADA] dark:bg-amber-950/80 text-[#EA580C] dark:text-amber-400">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#EA580C] dark:text-amber-300">
                Tenggat Tugas Terdekat
              </span>
              <span className="text-[11px] font-bold text-[#6B7C93] dark:text-slate-400">
                {task.subject_name}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-[#18181B] dark:text-white line-clamp-1">
              {task.title}
            </h4>
          </div>
        </div>

        {/* Right Mini Countdown & CTA Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <div
            className="flex items-center gap-1.5 rounded-full bg-[#F4F6FA] dark:bg-[#1A202C] px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-mono font-black text-[#18181B] dark:text-white"
            suppressHydrationWarning
          >
            <Clock className="h-3.5 w-3.5 text-[#FF7643] dark:text-amber-400" />
            {mounted ? (
              timeLeft.isExpired ? (
                <span className="text-slate-400 font-bold">Waktu Berakhir</span>
              ) : (
                <div className="flex items-center gap-1">
                  {timeLeft.days > 0 && <span>{timeLeft.days}h</span>}
                  <span>{String(timeLeft.hours).padStart(2, "0")}j</span>
                  <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                  <span className="text-[#FF7643] dark:text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}d</span>
                </div>
              )
            ) : (
              <span>--:--:--</span>
            )}
          </div>

          <Link href="/tasks">
            <button className="flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-emerald-600 hover:bg-[#27272A] dark:hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:scale-102 transition-all shadow-xs cursor-pointer">
              <span>Buka Tugas</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#FFD280] dark:text-white" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
