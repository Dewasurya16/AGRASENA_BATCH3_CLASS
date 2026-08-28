'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Flame, Sparkles, BookOpen, Clock, CheckCircle2, Coffee } from "lucide-react"
import Link from "next/link"

import { getTaskDeadlineTimestamp } from "@/lib/utils"

export interface TaskItem {
  id: string
  title: string
  subject_name: string
  due_date: string
  description?: string | null
  submission_link?: string | null
}

export function HeroCountdown({ targetTask }: { targetTask?: TaskItem | null }) {
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

  // JIKA TIDAK ADA TUGAS MENDATANG ATAU TUGAS SUDAH KEDALUWARSA -> TAMPILKAN HERO CELEBRATION & REHAT
  if (!targetTask || (mounted && timeLeft.isExpired)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#0D3830] via-[#0A2E27] to-[#08221D] p-6 sm:p-7 text-white shadow-xl shadow-[#0D3830]/25 border border-white/10"
      >
        {/* Decorative Ambient Subtle Glow */}
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-8 h-28 w-28 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Copy */}
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[11px] font-bold text-[#E6F7ED] tracking-wider uppercase">
                Pelatihan Fungsional Pranata Komputer — Batch 3
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug flex items-center gap-2">
              <span>🎉 Semua Tugas Selesai Dikumpulkan!</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              Tidak ada tanggungan tugas mendesak saat ini. Seluruh tugas telah terselesaikan dengan baik. Nikmati waktu istirahat dan persiapan menuju perkuliahan pekan depan!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Bebas Tugas Aktif</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <Coffee className="h-3.5 w-3.5 text-amber-400" />
                <span>Masa Rehat & Persiapan TMO</span>
              </span>
            </div>
          </div>

          {/* Right Action Cards */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 w-full md:w-56">
            <Link href="/materials" className="w-full">
              <button className="w-full flex items-center justify-center gap-2 rounded-[8px] bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 text-xs font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
                <span>Modul 120 JP</span>
              </button>
            </Link>
            <Link href="/schedules" className="w-full">
              <button className="w-full flex items-center justify-center gap-2 rounded-[8px] bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Jadwal Pekan Depan</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#0D3830] via-[#0A2E27] to-[#08221D] p-6 sm:p-7 text-white shadow-xl shadow-[#0D3830]/25 border border-white/10"
    >
      {/* Decorative Floating Elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#E6F7ED]/20 blur-xl pointer-events-none" />
      <div className="absolute right-40 -bottom-8 h-24 w-24 rounded-full bg-[#FF7643]/30 blur-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Welcome Copy */}
        <div className="space-y-2.5 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#FF7643] animate-ping" />
            <p className="text-[11px] font-bold text-[#E6F7ED] tracking-wider uppercase">
              Pelatihan Fungsional Pranata Komputer — Batch 3
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug">
            Tenggat Pengumpulan Tugas Terdekat
          </h2>
          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
            {targetTask.description || "Pastikan berkas tugas telah diunggah ke Portal LMS Kejaksaan sebelum batas waktu berakhir."}
          </p>

          <div className="pt-1">
            <a
              href={targetTask.submission_link || "/tasks"}
              target={targetTask.submission_link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF7643] hover:text-[#FFA07A] transition group"
            >
              <span>Buka Portal Pengumpulan Tugas</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Countdown Ticker Box */}
        <div className="flex flex-col items-center sm:items-end gap-3 rounded-[12px] bg-black/30 border border-white/15 p-4 sm:p-5 backdrop-blur-md shadow-inner">
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="flex items-center gap-1 rounded-full bg-[#FF7643] px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-xs">
              <Flame className="h-3 w-3" />
              Countdown Deadline
            </span>
            <span className="text-xs text-[#E6F7ED] font-bold line-clamp-1 max-w-[150px]">
              {targetTask.subject_name}
            </span>
          </div>

          {/* 4 Unit Live Countdown */}
          <div className="grid grid-cols-4 gap-2 text-center" suppressHydrationWarning>
            {[
              { label: "Hari", value: mounted ? timeLeft.days : 0 },
              { label: "Jam", value: mounted ? timeLeft.hours : 0 },
              { label: "Mnt", value: mounted ? timeLeft.minutes : 0 },
              { label: "Dtk", value: mounted ? timeLeft.seconds : 0 },
            ].map((unit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center rounded-[8px] bg-white/10 px-3 py-2 min-w-[50px] sm:min-w-[56px] border border-white/10"
              >
                <span className="font-mono text-lg sm:text-2xl font-black text-white">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-300">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] text-slate-300 line-clamp-1 max-w-[240px]">
            {targetTask.title}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
