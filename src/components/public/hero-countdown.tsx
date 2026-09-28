'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Flame, Sparkles, BookOpen, Clock, CheckCircle2, Coffee, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getTaskDeadlineTimestamp } from "@/lib/utils"

export interface TaskItem {
  id: string
  title: string
  subject_name: string
  due_date: string
  description?: string | null
  submission_link?: string | null
}

interface HeroCountdownProps {
  targetTask?: TaskItem | null
  batch?: "batch-3" | "batch-4"
}

export function HeroCountdown({ targetTask, batch }: HeroCountdownProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const pathname = usePathname()

  const isBatch4 =
    batch === "batch-4" ||
    (pathname && pathname.includes("/batch-4")) ||
    (targetTask && (
      targetTask.title.toLowerCase().includes("batch 4") ||
      targetTask.subject_name.toLowerCase().includes("batch 4")
    ))

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

  const formattedDeadline = React.useMemo(() => {
    if (!targetTask?.due_date) return "-"
    try {
      return new Date(targetTask.due_date).toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return targetTask.due_date
    }
  }, [targetTask?.due_date])

  const cleanTitle = React.useMemo(() => {
    if (!targetTask?.title) return "Tenggat Pengumpulan Tugas Terdekat"
    return targetTask.title.replace(/^\[Batch\s*4\]\s*/i, "").trim()
  }, [targetTask?.title])

  // JIKA TIDAK ADA TUGAS MENDATANG ATAU TUGAS SUDAH SELESAI
  if (!targetTask || (mounted && timeLeft.isExpired)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="relative overflow-hidden rounded-[20px] bg-slate-900/95 dark:bg-[#0f172a] text-white p-6 sm:p-7 shadow-sm border border-slate-800/80 backdrop-blur-md"
      >
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-8 h-28 w-28 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
                {isBatch4
                  ? "Diklat Fungsional Pranata Komputer — Agrasena Batch 4"
                  : "Diklat Fungsional Pranata Komputer — Agrasena Batch 3"}
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug flex items-center gap-2">
              <span>🎉 Semua Tugas Selesai Dikumpulkan!</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tidak ada tanggungan tugas aktif saat ini. Seluruh penugasan telah dikumpulkan dengan baik. Selamat beristirahat dan bersiap untuk agenda pembelajaran berikutnya!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Bebas Tanggungan Tugas</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Coffee className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
                <span>Masa Rehat & Belajar Mandiri</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 w-full md:w-56">
            <Link href={isBatch4 ? "/batch-4/materials" : "/materials"} className="w-full">
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white active:scale-[0.98] transition-all cursor-pointer">
                <BookOpen className="h-3.5 w-3.5 text-sky-400" strokeWidth={2} />
                <span>Modul 120 JP</span>
              </button>
            </Link>
            <Link href={isBatch4 ? "/batch-4/schedules" : "/schedules"} className="w-full">
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer">
                <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                <span>Jadwal Perkuliahan</span>
                <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="relative overflow-hidden rounded-[20px] bg-slate-900/95 dark:bg-[#0f172a] text-white p-6 sm:p-7 shadow-sm border border-slate-800/80 backdrop-blur-md"
    >
      {/* Subtle Ambient Decorative Glow */}
      <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl pointer-events-none ${isBatch4 ? "bg-emerald-500/15" : "bg-sky-500/15"}`} />
      <div className="absolute right-1/3 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Section: Information & Clean Instruction Preview */}
        <div className="space-y-3.5 max-w-xl">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tenggat Waktu Prioritas
            </span>
            <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
              {isBatch4
                ? "Diklat Fungsional Prakom • Agrasena Batch 4"
                : "Diklat Fungsional Prakom • Agrasena Batch 3"}
            </span>
          </div>

          {/* Main Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
              {cleanTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-slate-200 border border-white/10">
                {targetTask.subject_name}
              </span>
              <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Batas: {formattedDeadline} (23:59 WIB)</span>
              </span>
            </div>
          </div>

          {/* Clean Description Box with Expandable Option */}
          {targetTask.description && (
            <div className="rounded-[12px] bg-white/5 border border-white/10 p-3.5 space-y-2 text-xs leading-relaxed text-slate-300">
              <div className={isExpanded ? "whitespace-pre-line space-y-2" : "line-clamp-2"}>
                {targetTask.description}
              </div>

              {targetTask.description.length > 120 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors pt-0.5 cursor-pointer"
                >
                  <span>{isExpanded ? "Tutup Petunjuk Ringkas" : "Baca Petunjuk & Ketentuan Lengkap"}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
            </div>
          )}

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={targetTask.submission_link || "https://pengembangan.kejaksaan.go.id/dashboard"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <span>Kumpulkan di Portal LMS</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-90" />
            </a>

            <a
              href="#tasks"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-semibold text-xs px-4 py-2.5 transition active:scale-[0.98] cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-sky-400" />
              <span>Daftar Penugasan</span>
            </a>
          </div>
        </div>

        {/* Right Section: Minimalist Live Countdown Ticker */}
        <div className="flex flex-col items-center sm:items-end justify-center rounded-[16px] bg-white/5 dark:bg-black/30 border border-white/10 p-4 sm:p-5 backdrop-blur-md shadow-xs shrink-0 self-start lg:self-center">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2.5">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Sisa Waktu Pengumpulan</span>
          </div>

          {/* 4 Unit Monospace Counter Tiles */}
          <div className="grid grid-cols-4 gap-2 text-center" suppressHydrationWarning>
            {[
              { label: "Hari", value: mounted ? timeLeft.days : 0 },
              { label: "Jam", value: mounted ? timeLeft.hours : 0 },
              { label: "Menit", value: mounted ? timeLeft.minutes : 0 },
              { label: "Detik", value: mounted ? timeLeft.seconds : 0 },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-[12px] bg-white/10 px-3 py-2.5 min-w-[54px] sm:min-w-[62px] border border-white/10 shadow-xs"
              >
                <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-tight">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider pt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-3 line-clamp-1 max-w-[250px] text-center sm:text-right">
            Tenggat: {formattedDeadline} • 23:59 WIB
          </p>
        </div>
      </div>
    </motion.div>
  )
}
