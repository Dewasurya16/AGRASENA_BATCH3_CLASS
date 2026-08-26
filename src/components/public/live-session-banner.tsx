'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video, Clock, ExternalLink, Sparkles, Radio, Calendar, User, MapPin, Moon, Sun, BookOpen } from "lucide-react"
import { RAW_DAYS_DATA, getCurrentDiklatDay } from "@/lib/roadmap-utils"

export interface LiveSessionBannerProps {
  currentDayName?: string
  currentDayNumber?: number
  todaySchedules?: Array<{
    id: string
    subject_name: string
    start_time: string
    end_time: string
    lecturer?: string | null
    room?: string | null
    zoom_url?: string | null
    day?: string | null
  }>
}

const RUANG_DIKLAT_URL =
  'https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat'

export function LiveSessionBanner({
  currentDayName,
  currentDayNumber,
  todaySchedules = [],
}: LiveSessionBannerProps) {
  const [mounted, setMounted] = React.useState(false)
  const [currentTimeStr, setCurrentTimeStr] = React.useState("")
  const [isWorkingHours, setIsWorkingHours] = React.useState(false)

  const activeDayNum = currentDayNumber || getCurrentDiklatDay()
  const todayCurriculum = RAW_DAYS_DATA.find((d) => d.day === activeDayNum) || RAW_DAYS_DATA[2]
  const displayDayName = currentDayName || `Hari ${activeDayNum} • ${todayCurriculum.stageName}`

  React.useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday

      const hStr = String(hours).padStart(2, "0")
      const mStr = String(minutes).padStart(2, "0")
      const sStr = String(seconds).padStart(2, "0")
      setCurrentTimeStr(`${hStr}:${mStr}:${sStr} WIB`)

      // Jam kerja diklat resmi: Senin s.d. Jumat, 08:00 - 15:30 WIB
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
      const totalMins = hours * 60 + minutes
      const startMins = 8 * 60 // 08:00
      const endMins = 15 * 60 + 30 // 15:30

      setIsWorkingHours(isWeekday && totalMins >= startMins && totalMins <= endMins)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Find schedule that specifically matches today's day number (e.g. Hari 3)
  const matchedSchedule = todaySchedules.find((s) => {
    const subj = String(s.subject_name || "").toLowerCase()
    const dayVal = String(s.day || "").toLowerCase()
    const targetTag = `[hari ${activeDayNum}]`
    const targetDay = `hari ${activeDayNum}`
    return subj.includes(targetTag) || subj.includes(targetDay) || dayVal === targetDay || dayVal === String(activeDayNum)
  })

  const activeSession = matchedSchedule || {
    id: `live-day-${activeDayNum}`,
    subject_name: `[Hari ${activeDayNum}] Tata Kelola TI & SPBE Nasional (120 JP)`,
    start_time: "08:00",
    end_time: "15:30",
    lecturer: "Widyaiswara / Tim Pusdiklat Kejaksaan RI",
    room: "Ruang Diklat Virtual Zoom • Batch 3",
    zoom_url: RUANG_DIKLAT_URL,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-[32px] p-5 sm:p-7 text-white shadow-xl border transition-all ${
        isWorkingHours
          ? "bg-gradient-to-r from-[#0D3830] via-[#0E443B] to-[#0A2E27] shadow-[#0D3830]/20 border-white/15"
          : "bg-gradient-to-r from-[#131E29] via-[#1E293B] to-[#0F172A] shadow-black/20 border-slate-700/60"
      }`}
    >
      {/* Decorative ambient glows */}
      <div className={`absolute -left-12 -top-12 h-40 w-40 rounded-full blur-2xl pointer-events-none ${isWorkingHours ? "bg-[#E6F7ED]/20" : "bg-sky-500/10"}`} />
      <div className={`absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-2xl pointer-events-none ${isWorkingHours ? "bg-[#FF7643]/25" : "bg-indigo-500/15"}`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left Status & Session Info */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {isWorkingHours ? (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
                Sesi Pembelajaran Aktif
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                <Moon className="h-3 w-3 text-amber-400" />
                Di Luar Jam Perkuliahan (Istirahat)
              </span>
            )}

            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold border ${isWorkingHours ? "bg-white/15 text-[#E6F7ED] border-white/10" : "bg-slate-800/80 text-slate-300 border-slate-700"}`}>
              {displayDayName}
            </span>

            {mounted && (
              <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-mono text-slate-300 font-bold">
                ⏰ {currentTimeStr}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
              {isWorkingHours ? activeSession.subject_name : `Sesi Hari Ini Selesai • ${activeSession.subject_name}`}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#FFD280]" />
                Jam Diklat: {activeSession.start_time} – {activeSession.end_time} WIB
              </span>
              {activeSession.lecturer && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-[#A7F3D0]" />
                  {activeSession.lecturer}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
          {isWorkingHours ? (
            <a
              href={activeSession.zoom_url || RUANG_DIKLAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#FF7643] hover:bg-[#F06530] px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-[#FF7643]/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Video className="h-4 w-4 text-white animate-bounce" />
              <span>Masuk Ruang Zoom / LMS</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/80" />
            </a>
          ) : (
            <a
              href={RUANG_DIKLAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 px-5 py-2.5 text-xs font-black text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Akses Materi & LMS</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          )}
        </div>

      </div>
    </motion.div>
  )
}
