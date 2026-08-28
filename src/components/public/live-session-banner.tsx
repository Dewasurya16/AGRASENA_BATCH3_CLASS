'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Video,
  Clock,
  ExternalLink,
  Sparkles,
  Radio,
  Calendar,
  User,
  MapPin,
  Moon,
  Sun,
  BookOpen,
  FileText,
  CheckCircle2,
  Coffee,
  ArrowRight,
  Upload,
  Layers,
  Flame,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { RAW_DAYS_DATA, getCurrentDiklatDay, getScheduleDayNumber, parseDiklatDate } from "@/lib/roadmap-utils"
import { DEFAULT_SCHEDULES_DATA } from "@/lib/default-schedules"

export interface TaskItem {
  id: string
  title: string
  subject_name: string
  due_date: string
  description?: string | null
  submission_link?: string | null
  status?: string
}

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
    meeting_link?: string | null
    day?: string | null
  }>
  todayTasks?: TaskItem[]
  /** 'home' = dark banner (default), 'schedule' = light info card untuk halaman Rundown */
  variant?: 'home' | 'schedule'
}

const RUANG_DIKLAT_URL =
  'https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat'

export type DailyPhase = 'in_class' | 'in_break' | 'task_time' | 'prep_time' | 'weekend'

function parseTimeToMinutes(timeStr?: string | null): number | null {
  if (!timeStr) return null
  const cleaned = timeStr.trim().replace(/[^\d:]/g, '')
  const parts = cleaned.split(':')
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (!isNaN(h) && !isNaN(m)) {
      return h * 60 + m
    }
  }
  return null
}

function cleanTimeDisplay(timeStr?: string | null, fallback = "08:00"): string {
  if (!timeStr) return fallback
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})/)
  if (match) {
    const h = match[1].padStart(2, '0')
    const m = match[2]
    return `${h}:${m}`
  }
  return timeStr.trim()
}

export function LiveSessionBanner({
  currentDayName,
  currentDayNumber,
  todaySchedules = [],
  todayTasks = [],
  variant = 'home',
}: LiveSessionBannerProps) {
  const [mounted, setMounted] = React.useState(false)
  const [currentTimeStr, setCurrentTimeStr] = React.useState("")
  const [phase, setPhase] = React.useState<DailyPhase>('in_class')
  const [countdownText, setCountdownText] = React.useState("")

  const activeDayNum = currentDayNumber || getCurrentDiklatDay()
  const todayCurriculum = RAW_DAYS_DATA.find((d) => d.day === activeDayNum) || RAW_DAYS_DATA[0]
  const displayDayName = currentDayName || `Hari ${activeDayNum} • ${todayCurriculum.stageName}`

  // Sesi perkuliahan hari ini (hari aktif)
  const daysSchedules = React.useMemo(() => {
    const sourceSchedules =
      todaySchedules && todaySchedules.length > 0
        ? todaySchedules
        : (DEFAULT_SCHEDULES_DATA as any[])

    return sourceSchedules
      .filter((s) => {
        const explicitDay = getScheduleDayNumber(s)
        if (explicitDay !== null) {
          return explicitDay === activeDayNum
        }
        const dayVal = String(s.day || "").toLowerCase().trim()
        return dayVal === `hari ${activeDayNum}` || dayVal === String(activeDayNum)
      })
      .sort((a, b) => {
        const aStart = parseTimeToMinutes(a.start_time) ?? 0
        const bStart = parseTimeToMinutes(b.start_time) ?? 0
        return aStart - bStart
      })
  }, [todaySchedules, activeDayNum])

  // Cari hari diklat aktif berikutnya (untuk pengingat akhir pekan / malam hari)
  // PENTING: Jika hari ini adalah akhir pekan (Sabtu/Minggu), activeDayNum sudah menunjuk ke hari Senin berikutnya (misal Hari 6).
  // JANGAN melompat ke hari Selasa (activeDayNum + 1). Tahan tetap pada hari Senin (activeDayNum).
  const upcomingDayNum = React.useMemo(() => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Minggu, 6 = Sabtu, 5 = Jumat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return activeDayNum
    }
    // Jika Jumat malam setelah jam 16:00, sesi berikutnya adalah Senin (activeDayNum + 1)
    if (dayOfWeek === 5 && (now.getHours() * 60 + now.getMinutes() >= 16 * 60)) {
      return Math.min(35, activeDayNum + 1)
    }
    // Jika hari kerja biasa malam hari setelah jam 16:00, sesi berikutnya adalah hari esoknya
    if (now.getHours() * 60 + now.getMinutes() >= 16 * 60) {
      return Math.min(35, activeDayNum + 1)
    }
    return activeDayNum
  }, [activeDayNum])

  const upcomingCurriculum = RAW_DAYS_DATA.find((d) => d.day === upcomingDayNum) || RAW_DAYS_DATA[0]

  // Sesi perkuliahan hari mendatang
  const upcomingDaySchedules = React.useMemo(() => {
    const sourceSchedules =
      todaySchedules && todaySchedules.length > 0
        ? todaySchedules
        : (DEFAULT_SCHEDULES_DATA as any[])

    return sourceSchedules
      .filter((s) => {
        const explicitDay = getScheduleDayNumber(s)
        if (explicitDay !== null) {
          return explicitDay === upcomingDayNum
        }
        const dayVal = String(s.day || "").toLowerCase().trim()
        return dayVal === `hari ${upcomingDayNum}` || dayVal === String(upcomingDayNum)
      })
      .sort((a, b) => {
        const aStart = parseTimeToMinutes(a.start_time) ?? 0
        const bStart = parseTimeToMinutes(b.start_time) ?? 0
        return aStart - bStart
      })
  }, [todaySchedules, upcomingDayNum])

  const fallbackSession = {
    id: `live-day-${activeDayNum}`,
    subject_name: `[Hari ${activeDayNum}] Tata Kelola TI & SPBE Nasional (120 JP)`,
    start_time: "08:00",
    end_time: "15:30",
    lecturer: "Widyaiswara / Tim Pusdiklat Kejaksaan RI",
    room: "Ruang Diklat Virtual Zoom • Batch 3",
    zoom_url: RUANG_DIKLAT_URL,
  }

  const [activeSession, setActiveSession] = React.useState(
    daysSchedules[0] || fallbackSession
  )

  const firstUpcomingSession = upcomingDaySchedules[0] || {
    id: `upcoming-day-${upcomingDayNum}`,
    subject_name: `[Hari ${upcomingDayNum}] Perkuliahan Diklat Fungsional Prakom`,
    start_time: "09:30",
    end_time: "10:15",
    lecturer: "Widyaiswara Pusdiklat",
    room: "Ruang Diklat LMS",
    zoom_url: RUANG_DIKLAT_URL,
  }

  React.useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      const dayOfWeek = now.getDay() // 0 = Minggu, 6 = Sabtu, 5 = Jumat

      const hStr = String(hours).padStart(2, "0")
      const mStr = String(minutes).padStart(2, "0")
      const sStr = String(seconds).padStart(2, "0")
      setCurrentTimeStr(`${hStr}:${mStr}:${sStr} WIB`)

      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
      const totalMins = hours * 60 + minutes

      // 1. Akhir Pekan (Sabtu & Minggu) -> SELAMAT BERLIBUR
      if (!isWeekday) {
        setPhase('weekend')
        setActiveSession(firstUpcomingSession)

        // Hitung countdown presisi menuju jam mulai sesi pertama hari Senin
        const nextStartMins = parseTimeToMinutes(firstUpcomingSession.start_time) ?? (9 * 60 + 30)
        const nextStartH = Math.floor(nextStartMins / 60)
        const nextStartM = nextStartMins % 60
        const cleanStart = cleanTimeDisplay(firstUpcomingSession.start_time, "09:30")

        const targetDateObj = parseDiklatDate(upcomingCurriculum.date) || new Date()
        targetDateObj.setHours(nextStartH, nextStartM, 0, 0)
        const diffMs = targetDateObj.getTime() - now.getTime()

        if (diffMs > 0) {
          const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
          const days = Math.floor(totalHours / 24)
          const remHours = totalHours % 24
          if (days > 0) {
            setCountdownText(`Sesi dimulai dalam ${days} hari ${remHours} jam (${upcomingCurriculum.dayOfWeek}, ${cleanStart} WIB)`)
          } else {
            const remMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            setCountdownText(`Sesi dimulai dalam ${remHours} jam ${remMins} mnt (${upcomingCurriculum.dayOfWeek}, ${cleanStart} WIB)`)
          }
        } else {
          setCountdownText(`Sesi dimulai ${upcomingCurriculum.dayOfWeek}, ${cleanStart} WIB`)
        }
        return
      }

      // 2. Jika ada data jadwal spesifik di Supabase untuk hari aktif ini
      if (daysSchedules.length > 0) {
        // Cari apakah ada sesi yang sedang berlangsung saat ini
        const currentLive = daysSchedules.find((s) => {
          const start = parseTimeToMinutes(s.start_time) ?? 0
          const end = parseTimeToMinutes(s.end_time) ?? (start + 90)
          return totalMins >= start && totalMins < end
        })

        if (currentLive) {
          setPhase('in_class')
          setActiveSession(currentLive)
          const endMins = parseTimeToMinutes(currentLive.end_time) ?? (16 * 60)
          const remaining = Math.max(0, endMins - totalMins)
          const remH = Math.floor(remaining / 60)
          const remM = remaining % 60
          setCountdownText(remH > 0 ? `Selesai dalam ${remH} jam ${remM} mnt` : `Selesai dalam ${remM} mnt`)
          return
        }

        // Jika sebelum sesi pertama hari ini (Dini Hari / Pagi)
        const firstStart = parseTimeToMinutes(daysSchedules[0].start_time) ?? (8 * 60)
        if (totalMins < firstStart) {
          setPhase('prep_time')
          setActiveSession(daysSchedules[0])
          const remaining = Math.max(0, firstStart - totalMins)
          const remH = Math.floor(remaining / 60)
          const remM = remaining % 60
          const cleanStart = cleanTimeDisplay(daysSchedules[0].start_time, "08:00")
          setCountdownText(`Mulai dalam ${remH > 0 ? `${remH}j ` : ''}${remM}m (${cleanStart} WIB)`)
          return
        }

        // Jika berada di antara dua sesi (Jeda Istirahat / Antar Kelas)
        const nextUpcoming = daysSchedules.find((s) => {
          const start = parseTimeToMinutes(s.start_time) ?? 0
          return start > totalMins
        })

        if (nextUpcoming) {
          setPhase('in_break')
          setActiveSession(nextUpcoming)
          const startMins = parseTimeToMinutes(nextUpcoming.start_time) ?? 0
          const remaining = Math.max(0, startMins - totalMins)
          const remH = Math.floor(remaining / 60)
          const remM = remaining % 60
          const cleanStart = cleanTimeDisplay(nextUpcoming.start_time, "08:00")
          setCountdownText(`Sesi berikutnya dalam ${remH > 0 ? `${remH}j ` : ''}${remM}m (${cleanStart} WIB)`)
          return
        }

        // Jika semua sesi untuk hari ini sudah selesai (Sore / Malam)
        // Jika Jumat Sore/Malam -> Masuk fase akhir pekan (Selamat Berlibur)
        if (dayOfWeek === 5 && totalMins >= 16 * 60) {
          setPhase('weekend')
          setActiveSession(firstUpcomingSession)
          const cleanStart = cleanTimeDisplay(firstUpcomingSession.start_time, "09:30")
          setCountdownText(`Sesi pekan depan: ${upcomingCurriculum.dayOfWeek}, ${cleanStart} WIB`)
          return
        }

        setPhase('task_time')
        setActiveSession(daysSchedules[daysSchedules.length - 1])
        const remaining = Math.max(0, (24 * 60) - totalMins)
        const remH = Math.floor(remaining / 60)
        const remM = remaining % 60
        setCountdownText(`Tenggat ${remH}j ${remM}m lagi (23:59 WIB)`)
        return
      }

      // 3. Fallback jika belum ada rincian jadwal manual dari Supabase
      if (totalMins >= 8 * 60 && totalMins < 16 * 60) {
        setPhase('in_class')
        setActiveSession(fallbackSession)
        const remainingMinutes = 16 * 60 - totalMins
        const remH = Math.floor(remainingMinutes / 60)
        const remM = remainingMinutes % 60
        setCountdownText(remH > 0 ? `Selesai dalam ${remH} jam ${remM} mnt` : `Selesai dalam ${remM} mnt`)
        return
      }

      if (totalMins >= 16 * 60 && totalMins <= 23 * 60 + 59) {
        if (dayOfWeek === 5) {
          setPhase('weekend')
          setActiveSession(firstUpcomingSession)
          const cleanStart = cleanTimeDisplay(firstUpcomingSession.start_time, "09:30")
          setCountdownText(`Sesi dimulai ${upcomingCurriculum.dayOfWeek}, ${cleanStart} WIB`)
          return
        }
        setPhase('task_time')
        setActiveSession(fallbackSession)
        const remainingMinutes = (24 * 60) - totalMins
        const remH = Math.floor(remainingMinutes / 60)
        const remM = remainingMinutes % 60
        setCountdownText(`Tenggat ${remH}j ${remM}m lagi (23:59 WIB)`)
        return
      }

      if (totalMins >= 0 && totalMins < 8 * 60) {
        setPhase('prep_time')
        setActiveSession(fallbackSession)
        const remainingMinutes = (8 * 60) - totalMins
        const remH = Math.floor(remainingMinutes / 60)
        const remM = remainingMinutes % 60
        setCountdownText(`Mulai dalam ${remH}j ${remM}m (08:00 WIB)`)
        return
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [daysSchedules, activeDayNum, firstUpcomingSession, upcomingCurriculum])

  // Cari tugas aktif hari ini dari Supabase atau fallback
  const matchedTask = todayTasks.find((t) => {
    const titleMatch = t.title.toLowerCase().includes(`hari ${activeDayNum}`) ||
                       t.subject_name.toLowerCase().includes(`hari ${activeDayNum}`)
    return titleMatch && t.status !== 'completed'
  }) || todayTasks.find((t) => t.status !== 'completed') || {
    id: `task-day-${activeDayNum}`,
    title: `Tugas Mandiri & Evaluasi Pemahaman Modul Hari ke-${activeDayNum}`,
    subject_name: activeSession.subject_name,
    due_date: `${todayCurriculum.date}, 23:59 WIB`,
    submission_link: RUANG_DIKLAT_URL,
  }

  const cleanStart = cleanTimeDisplay(activeSession.start_time, "08:00")
  const cleanEnd = cleanTimeDisplay(activeSession.end_time, "15:30")
  const nextCleanStart = cleanTimeDisplay(firstUpcomingSession.start_time, "09:30")
  const nextCleanEnd = cleanTimeDisplay(firstUpcomingSession.end_time, "10:15")

  /* ────────────────────────────────────────────────
     VARIANT: 'schedule' — card ringan untuk halaman Rundown
     Layout lebih informatif, tidak pakai dark banner
  ─────────────────────────────────────────────────── */
  if (variant === 'schedule') {
    const phaseLabel = {
      in_class: 'Sesi Aktif',
      in_break: 'Jeda Istirahat',
      task_time: 'Waktu Tugas',
      prep_time: 'Persiapan Sesi',
      weekend: 'Libur Akhir Pekan',
    }[phase]

    const phaseColor = {
      in_class: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300',
      in_break: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300',
      task_time: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300',
      prep_time: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300',
      weekend: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400',
    }[phase]

    const phaseDot = {
      in_class: 'bg-indigo-500',
      in_break: 'bg-amber-500',
      task_time: 'bg-violet-500',
      prep_time: 'bg-sky-500',
      weekend: 'bg-slate-400',
    }[phase]

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200 dark:border-[#2A3550] shadow-sm overflow-hidden transition-colors duration-200"
      >
        {/* Header strip */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-[#2A3550] bg-slate-50/60 dark:bg-[#1E2535]/60">
          <div className="flex items-center gap-2.5">
            {/* Status dot + label */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${phaseColor}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${phaseDot} ${phase === 'in_class' ? 'animate-ping' : ''}`} />
              {phaseLabel}
            </span>
            {/* Day info */}
            {todayCurriculum && (
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Hari Ke-{todayCurriculum.day} ({todayCurriculum.dayOfWeek}) • Tahap {todayCurriculum.stage} • {todayCurriculum.stageName}
              </span>
            )}
          </div>
          {/* Live clock */}
          {currentTimeStr && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tabular-nums text-indigo-500 dark:text-indigo-400">
              <Clock className="h-3 w-3" />
              {currentTimeStr.replace(' WIB', '')} <span className="text-[9px] font-black tracking-wider opacity-70">WIB</span>
            </span>
          )}
        </div>

        {/* Body: sesi aktif atau info hari ini */}
        <div className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Left: info sesi */}
          <div className="flex-1 flex flex-col gap-2">
            {phase !== 'weekend' ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-[#8A9BB8]">
                    {cleanStart} – {cleanEnd} WIB
                  </span>
                  <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
                    Hari ke-{activeDayNum}
                  </span>
                </div>
                <p className="text-[14px] font-black text-[#131E29] dark:text-[#D8E0EC] leading-snug">
                  {activeSession.subject_name}
                </p>
                {activeSession.lecturer && (
                  <p className="text-[11px] text-slate-500 dark:text-[#8A9BB8]">
                    Pengampu: <span className="font-semibold text-slate-700 dark:text-[#C0CEDF]">{activeSession.lecturer}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-[13px] font-black text-[#131E29] dark:text-[#D8E0EC]">
                  Selamat Berlibur — Sesi berikutnya ({upcomingCurriculum.dayOfWeek}, {upcomingCurriculum.date}):
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#8A9BB8]">
                  {upcomingCurriculum ? `${upcomingCurriculum.dayOfWeek}, ${firstUpcomingSession?.start_time ? cleanTimeDisplay(firstUpcomingSession.start_time, "09:30") : "09:30"} WIB • Hari Ke-${upcomingCurriculum.day} • ${firstUpcomingSession?.subject_name?.replace(/\[Hari\s*\d+\]\s*/i, "") || ""}` : "Sesi berikutnya akan diumumkan"}
                </p>
              </>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            {phase !== 'weekend' && activeSession.zoom_url && (
              <a
                href={activeSession.zoom_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[8px] bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-[11px] font-black text-white transition-all cursor-pointer"
              >
                <Video className="h-3.5 w-3.5" />
                Buka Ruang Kelas
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            )}
            {/* Tombol relevan untuk halaman rundown: buka portal LMS */}
            <a
              href={RUANG_DIKLAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-slate-100 dark:bg-[#253045] hover:bg-slate-200 dark:hover:bg-[#2D3A52] px-4 py-2 text-[11px] font-black text-slate-600 dark:text-[#C0CEDF] transition-all cursor-pointer border border-slate-200 dark:border-[#2A3550]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Buka Portal Diklat
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  /* ─── VARIANT: 'home' — dark banner (default) ─── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className={`relative overflow-hidden rounded-[14px] p-4 sm:p-5 text-white shadow-lg border transition-all ${
        phase === 'in_class'
          ? "bg-gradient-to-r from-[#171C35] via-[#1B2342] to-[#121625] shadow-indigo-950/30 border-indigo-500/25"
          : phase === 'in_break'
          ? "bg-gradient-to-r from-[#1A1F35] via-[#182638] to-[#121828] shadow-slate-950/30 border-amber-500/25"
          : phase === 'task_time'
          ? "bg-gradient-to-r from-[#1A1842] via-[#241944] to-[#101524] shadow-indigo-950/30 border-indigo-500/25"
          : phase === 'prep_time'
          ? "bg-gradient-to-r from-[#0F1626] via-[#182338] to-[#111624] shadow-black/30 border-sky-500/20"
          : "bg-gradient-to-r from-[#161C32] via-[#1A223E] to-[#121626] shadow-indigo-950/30 border-indigo-500/25"
      }`}
    >
      {/* Decorative ambient subtle glows */}
      <div
        className={`absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl pointer-events-none ${
          phase === 'in_class'
            ? "bg-indigo-500/15"
            : phase === 'in_break'
            ? "bg-amber-500/15"
            : phase === 'task_time'
            ? "bg-indigo-500/15"
            : phase === 'prep_time'
            ? "bg-amber-500/10"
            : "bg-indigo-500/15"
        }`}
      />
      <div
        className={`absolute -right-8 -bottom-8 h-40 w-40 rounded-full blur-3xl pointer-events-none ${
          phase === 'in_class'
            ? "bg-violet-500/15"
            : phase === 'in_break'
            ? "bg-emerald-500/15"
            : phase === 'task_time'
            ? "bg-purple-500/15"
            : phase === 'prep_time'
            ? "bg-emerald-500/15"
            : "bg-violet-500/15"
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Status & Contextual Info */}
        <div className="flex flex-col gap-2.5 max-w-3xl flex-1 min-w-0">
          
          {/* Phase Badges Rail (Streamlined to 2-3 clean chips) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. Sesi Pembelajaran Aktif */}
            {phase === 'in_class' && (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500/90 text-white border border-rose-400/50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                Sesi Aktif
              </span>
            )}

            {/* 2. Jeda Istirahat Antar Sesi */}
            {phase === 'in_break' && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/90 text-slate-950 border border-amber-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <Coffee className="h-3 w-3 text-slate-950" />
                Jeda Istirahat
              </span>
            )}

            {/* 3. Kelas Selesai -> Waktu Tugas Mandiri */}
            {phase === 'task_time' && (
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-600/90 text-white border border-indigo-400/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                Waktu Tugas Mandiri
              </span>
            )}

            {/* 4. Dini Hari -> Persiapan Kelas Pagi Ini */}
            {phase === 'prep_time' && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/90 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <Coffee className="h-3 w-3 text-slate-950" />
                Persiapan Kelas Pagi Ini
              </span>
            )}

            {/* 5. Weekend / Hari Libur -> SELAMAT BERLIBUR */}
            {phase === 'weekend' && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Libur Akhir Pekan
              </span>
            )}

            {/* Day & Stage Tag */}
            <span className="rounded-full bg-white/10 text-slate-200 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold">
              {phase === 'weekend' ? `Rehat • Menuju Hari ${upcomingDayNum} (${upcomingCurriculum.dayOfWeek}, ${upcomingCurriculum.date})` : displayDayName}
            </span>

            {/* Realtime Clock */}
            {mounted && currentTimeStr && (
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-mono text-indigo-300 font-bold border border-white/5 tabular-nums">
                ⏰ {currentTimeStr.replace(' WIB', '')} <span className="text-[9px] opacity-70">WIB</span>
              </span>
            )}

            {/* Dynamic Countdown Pill */}
            {mounted && countdownText && phase !== 'weekend' && (
              <span className="rounded-full bg-white/10 text-slate-300 border border-white/10 px-2 py-0.5 text-[10px] font-bold">
                ⏳ {countdownText}
              </span>
            )}
          </div>

          {/* Main Title & Metadata by Phase */}
          <div className="space-y-1.5">
            {phase === 'in_class' && (
              <>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
                  {activeSession.subject_name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Clock className="h-3 w-3 text-amber-400" />
                    Jam Diklat: {cleanStart} – {cleanEnd} WIB
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-emerald-300" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3 w-3 text-sky-400" />
                    {activeSession.room || "Ruang Zoom Diklat"}
                  </span>
                </div>
              </>
            )}

            {phase === 'in_break' && (
              <>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
                  Jeda Sesi — Sesi Berikutnya: {activeSession.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Clock className="h-3 w-3 text-amber-400" />
                    Jadwal Mulai: {cleanStart} – {cleanEnd} WIB
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-emerald-300" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3 w-3 text-sky-400" />
                    {activeSession.room || "Ruang Zoom Diklat"}
                  </span>
                </div>
              </>
            )}

            {phase === 'task_time' && (
              <>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
                  Tugas Hari ke-{activeDayNum}: {matchedTask.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Flame className="h-3 w-3 text-amber-400 animate-pulse" />
                    Batas Upload: {matchedTask.due_date || "Malam ini 23:59 WIB"}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <BookOpen className="h-3 w-3 text-indigo-300" />
                    Mata Kuliah: {activeSession.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")}
                  </span>
                </div>
              </>
            )}

            {phase === 'prep_time' && (
              <>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
                  Persiapan Sesi Hari ke-{activeDayNum}: {activeSession.subject_name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-emerald-300 font-bold">
                    <Sun className="h-3 w-3 text-amber-400" />
                    Perkuliahan Dimulai Pukul {cleanStart} WIB (Pagi Ini)
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="h-3 w-3 text-emerald-300" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Weekend / Libur Mode with Compact Next Session Schedule Bar */}
            {phase === 'weekend' && (
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug flex items-center gap-1.5">
                    <span>Selamat Berlibur & Selamat Rehat, Rekan Prakom! ✨</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300/80 leading-relaxed">
                    Tidak ada sesi perkuliahan aktif hari ini. Selamat menikmati waktu rehat bersama keluarga.
                  </p>
                </div>

                {/* Compact Schedule Highlight Bar */}
                <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-[10px] bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 shrink-0">
                      <Calendar className="h-3 w-3 text-amber-400" />
                      {upcomingCurriculum.dayOfWeek}, {upcomingCurriculum.date}:
                    </span>
                    <span className="font-mono bg-sky-950/80 text-sky-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-sky-800/60 shrink-0">
                      {cleanTimeDisplay(firstUpcomingSession.start_time, "09:30")} – {cleanTimeDisplay(firstUpcomingSession.end_time, "10:15")} WIB
                    </span>
                    <span className="font-bold text-white text-[11px] sm:text-xs truncate">
                      {firstUpcomingSession.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
                    {firstUpcomingSession.lecturer && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="h-2.5 w-2.5 text-emerald-300" />
                        <span>{firstUpcomingSession.lecturer}</span>
                      </span>
                    )}
                    <span className="rounded-full bg-emerald-950/80 text-emerald-300 px-2 py-0.5 font-bold border border-emerald-800/60">
                      Hari ke-{upcomingDayNum}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Dynamic Actions by Phase (Compact, tactile buttons) */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 w-full lg:w-48">
          
          {/* Action on Active Class (08:00 - 16:00) or Break */}
          {(phase === 'in_class' || phase === 'in_break') && (
            <a
              href={activeSession.zoom_url || activeSession.meeting_link || RUANG_DIKLAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-[8px] bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-950/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Video className="h-3.5 w-3.5 text-white" />
              <span>Masuk Ruang Zoom</span>
              <ExternalLink className="h-3 w-3 text-white/80" />
            </a>
          )}

          {/* Action on Task Time (16:00 - 23:59) */}
          {phase === 'task_time' && (
            <>
              <Link href="/tasks" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 rounded-[8px] bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-indigo-950/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-white" />
                  <span>Kumpulkan Tugas</span>
                  <ArrowRight className="h-3 w-3 text-indigo-200" />
                </button>
              </Link>
              <Link href="/materials" className="w-full">
                <button className="w-full flex items-center justify-center gap-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-300" />
                  <span>Bahan Ajar PDF</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Prep Time (00:00 - 08:00) */}
          {phase === 'prep_time' && (
            <>
              <Link href="/materials" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 rounded-[8px] bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-950/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5 text-white" />
                  <span>Pelajari Modul</span>
                  <ArrowRight className="h-3 w-3 text-emerald-200" />
                </button>
              </Link>
              <Link href="/schedules" className="w-full">
                <button className="w-full flex items-center justify-center gap-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer">
                  <Calendar className="h-3.5 w-3.5 text-sky-300" />
                  <span>Jadwal Sesi</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Weekend -> Explore Modul & Roadmap (2 compact buttons) */}
          {phase === 'weekend' && (
            <>
              <Link href="/schedules" className="w-full">
                <button className="w-full flex items-center justify-center gap-1.5 rounded-[8px] bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-indigo-950/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                  <Calendar className="h-3.5 w-3.5 text-indigo-200" />
                  <span>Jadwal {upcomingCurriculum.dayOfWeek}</span>
                  <ArrowRight className="h-3 w-3 text-white" />
                </button>
              </Link>
              <Link href="/materials" className="w-full">
                <button className="w-full flex items-center justify-center gap-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-300" />
                  <span>Modul 120 JP</span>
                </button>
              </Link>
            </>
          )}

        </div>

      </div>
    </motion.div>
  )
}


