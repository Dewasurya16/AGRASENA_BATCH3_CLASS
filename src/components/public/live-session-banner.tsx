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
  const nextActiveDayNum = React.useMemo(() => {
    if (activeDayNum < 35) return activeDayNum + 1
    return 35
  }, [activeDayNum])

  const nextCurriculum = RAW_DAYS_DATA.find((d) => d.day === nextActiveDayNum) || RAW_DAYS_DATA[0]

  // Sesi perkuliahan hari berikutnya
  const nextDaySchedules = React.useMemo(() => {
    const sourceSchedules =
      todaySchedules && todaySchedules.length > 0
        ? todaySchedules
        : (DEFAULT_SCHEDULES_DATA as any[])

    return sourceSchedules
      .filter((s) => {
        const explicitDay = getScheduleDayNumber(s)
        if (explicitDay !== null) {
          return explicitDay === nextActiveDayNum
        }
        const dayVal = String(s.day || "").toLowerCase().trim()
        return dayVal === `hari ${nextActiveDayNum}` || dayVal === String(nextActiveDayNum)
      })
      .sort((a, b) => {
        const aStart = parseTimeToMinutes(a.start_time) ?? 0
        const bStart = parseTimeToMinutes(b.start_time) ?? 0
        return aStart - bStart
      })
  }, [todaySchedules, nextActiveDayNum])

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

  const firstNextSession = nextDaySchedules[0] || {
    id: `next-day-${nextActiveDayNum}`,
    subject_name: `[Hari ${nextActiveDayNum}] Perkuliahan Diklat Fungsional Prakom`,
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
        setActiveSession(firstNextSession)

        // Hitung countdown presisi menuju jam mulai sesi pertama hari Senin
        const nextStartMins = parseTimeToMinutes(firstNextSession.start_time) ?? (9 * 60 + 30)
        const nextStartH = Math.floor(nextStartMins / 60)
        const nextStartM = nextStartMins % 60
        const cleanStart = cleanTimeDisplay(firstNextSession.start_time, "09:30")

        const targetDateObj = parseDiklatDate(nextCurriculum.date) || new Date()
        targetDateObj.setHours(nextStartH, nextStartM, 0, 0)
        const diffMs = targetDateObj.getTime() - now.getTime()

        if (diffMs > 0) {
          const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
          const days = Math.floor(totalHours / 24)
          const remHours = totalHours % 24
          if (days > 0) {
            setCountdownText(`Sesi dimulai dalam ${days} hari ${remHours} jam (${nextCurriculum.dayOfWeek}, ${cleanStart} WIB)`)
          } else {
            const remMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            setCountdownText(`Sesi dimulai dalam ${remHours} jam ${remMins} mnt (${nextCurriculum.dayOfWeek}, ${cleanStart} WIB)`)
          }
        } else {
          setCountdownText(`Sesi dimulai ${nextCurriculum.dayOfWeek}, ${cleanStart} WIB`)
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
          setActiveSession(firstNextSession)
          const cleanStart = cleanTimeDisplay(firstNextSession.start_time, "09:30")
          setCountdownText(`Sesi pekan depan: ${nextCurriculum.dayOfWeek}, ${cleanStart} WIB`)
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
          setActiveSession(firstNextSession)
          setCountdownText(`Sesi dimulai Senin, 09:30 WIB`)
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
  }, [daysSchedules, activeDayNum, firstNextSession, nextCurriculum])

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
  const nextCleanStart = cleanTimeDisplay(firstNextSession.start_time, "09:30")
  const nextCleanEnd = cleanTimeDisplay(firstNextSession.end_time, "10:15")

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-[32px] p-5 sm:p-7 text-white shadow-xl border transition-all ${
        phase === 'in_class'
          ? "bg-gradient-to-r from-[#0D3830] via-[#0E443B] to-[#0A2E27] shadow-[#0D3830]/25 border-emerald-500/20"
          : phase === 'in_break'
          ? "bg-gradient-to-r from-[#1B3630] via-[#144439] to-[#0A2E27] shadow-emerald-950/30 border-amber-500/30"
          : phase === 'task_time'
          ? "bg-gradient-to-r from-[#1E1B4B] via-[#2A1B4E] to-[#111827] shadow-indigo-950/40 border-indigo-500/30"
          : phase === 'prep_time'
          ? "bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0D2822] shadow-black/30 border-sky-500/20"
          : "bg-gradient-to-r from-[#0A2821] via-[#133E35] to-[#08221B] shadow-[#0D3830]/30 border-emerald-500/30"
      }`}
    >
      {/* Decorative ambient glows based on active phase */}
      <div
        className={`absolute -left-12 -top-12 h-48 w-48 rounded-full blur-3xl pointer-events-none ${
          phase === 'in_class'
            ? "bg-[#E6F7ED]/25"
            : phase === 'in_break'
            ? "bg-amber-400/20"
            : phase === 'task_time'
            ? "bg-indigo-500/25"
            : phase === 'prep_time'
            ? "bg-amber-400/15"
            : "bg-emerald-400/20"
        }`}
      />
      <div
        className={`absolute -right-10 -bottom-10 h-48 w-48 rounded-full blur-3xl pointer-events-none ${
          phase === 'in_class'
            ? "bg-[#FF7643]/30"
            : phase === 'in_break'
            ? "bg-emerald-400/25"
            : phase === 'task_time'
            ? "bg-purple-500/25"
            : phase === 'prep_time'
            ? "bg-emerald-400/20"
            : "bg-amber-400/20"
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left Status & Contextual Info */}
        <div className="space-y-3 max-w-2xl">
          
          {/* Phase Badges Rail */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. Sesi Pembelajaran Aktif */}
            {phase === 'in_class' && (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
                Sesi Pembelajaran Aktif
              </span>
            )}

            {/* 2. Jeda Istirahat Antar Sesi */}
            {phase === 'in_break' && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500 text-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <Coffee className="h-3.5 w-3.5 text-slate-950" />
                Jeda Istirahat • Menuju Sesi Berikutnya
              </span>
            )}

            {/* 3. Kelas Selesai -> Waktu Tugas Mandiri */}
            {phase === 'task_time' && (
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                Kelas Selesai • Waktu Pengerjaan Tugas
              </span>
            )}

            {/* 4. Dini Hari -> Persiapan Kelas Pagi Ini */}
            {phase === 'prep_time' && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/90 text-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <Coffee className="h-3.5 w-3.5 text-slate-950" />
                Persiapan Kelas Hari Ini • Menunggu Sesi Mulai
              </span>
            )}

            {/* 5. Weekend / Hari Libur -> SELAMAT BERLIBUR */}
            {phase === 'weekend' && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 text-slate-950 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-md border border-emerald-400">
                <span>🏖️</span>
                <span>Libur Akhir Pekan • Selamat Berlibur!</span>
              </span>
            )}

            {/* Day & Stage Tag */}
            <span className="rounded-full bg-white/15 text-slate-100 border border-white/10 px-3 py-1 text-[10px] font-extrabold">
              {phase === 'weekend' ? `Rehat • Menuju Hari ${nextActiveDayNum}` : displayDayName}
            </span>

            {/* Realtime Clock */}
            {mounted && (
              <span className="rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-mono text-slate-200 font-bold border border-white/5">
                ⏰ {currentTimeStr}
              </span>
            )}

            {/* Dynamic Countdown Pill */}
            {mounted && countdownText && (
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                phase === 'weekend'
                  ? "bg-amber-400/25 text-amber-200 border-amber-400/40"
                  : phase === 'in_break'
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : phase === 'task_time'
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : phase === 'prep_time'
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-white/10 text-slate-300 border-white/10"
              }`}>
                ⏳ {countdownText}
              </span>
            )}
          </div>

          {/* Main Title & Metadata by Phase */}
          <div>
            {phase === 'in_class' && (
              <>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                  {activeSession.subject_name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#FFD280]" />
                    Jam Diklat: {cleanStart} – {cleanEnd} WIB
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-[#A7F3D0]" />
                      {activeSession.lecturer}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    {activeSession.room || "Ruang Zoom Diklat"}
                  </span>
                </div>
              </>
            )}

            {phase === 'in_break' && (
              <>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                  Jeda Sesi — Sesi Berikutnya: {activeSession.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-1">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    Jadwal Mulai: {cleanStart} – {cleanEnd} WIB
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-[#A7F3D0]" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    {activeSession.room || "Ruang Zoom Diklat"}
                  </span>
                </div>
              </>
            )}

            {phase === 'task_time' && (
              <>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                  Tugas Hari ke-{activeDayNum}: {matchedTask.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-1">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                    Batas Upload: {matchedTask.due_date || "Malam ini 23:59 WIB"}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-300" />
                    Mata Kuliah: {activeSession.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")}
                  </span>
                </div>
              </>
            )}

            {phase === 'prep_time' && (
              <>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                  Persiapan Sesi Hari ke-{activeDayNum}: {activeSession.subject_name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-1">
                  <span className="flex items-center gap-1 text-emerald-300 font-bold">
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    Perkuliahan Dimulai Pukul {cleanStart} WIB (Pagi Ini)
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="h-3.5 w-3.5 text-[#A7F3D0]" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Weekend / Libur Mode with Highlighted Next Session Schedule Box */}
            {phase === 'weekend' && (
              <div className="space-y-2.5">
                <div>
                  <h3 className="text-base sm:text-2xl font-black text-white tracking-tight leading-snug flex items-center gap-2">
                    <span>Selamat Berlibur & Selamat Rehat, Rekan Prakom! ✨</span>
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed mt-1">
                    Tidak ada sesi perkuliahan aktif hari ini. Selamat menikmati waktu rehat bersama keluarga dan me-recharge energi untuk perkuliahan berikutnya.
                  </p>
                </div>

                {/* Box Pengingat Jadwal Mendatang Terperinci Sesuai Jamnya */}
                <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-400/30 backdrop-blur-sm space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      Pengingat Jadwal Sesi Berikutnya ({nextCurriculum.dayOfWeek}, {nextCurriculum.date}):
                    </span>
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700">
                      Hari ke-{nextActiveDayNum} • {nextCurriculum.stageName}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white flex flex-wrap items-center gap-2">
                    <span className="font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                      ⏰ {nextCleanStart} – {nextCleanEnd} WIB
                    </span>
                    <span className="text-sm font-black text-white">
                      {firstNextSession.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                    {firstNextSession.lecturer && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-emerald-300" />
                        Pengampu: <strong className="text-white">{firstNextSession.lecturer}</strong>
                      </span>
                    )}
                    {nextDaySchedules.length > 1 && (
                      <span className="text-slate-300">
                        • Sesi ke-2: <strong className="text-amber-200">{cleanTimeDisplay(nextDaySchedules[1].start_time)} WIB ({nextDaySchedules[1].subject_name.replace(/\[Hari\s*\d+\]\s*/i, "")})</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Dynamic Actions by Phase */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
          
          {/* Action on Active Class (08:00 - 16:00) or Break */}
          {(phase === 'in_class' || phase === 'in_break') && (
            <a
              href={activeSession.zoom_url || activeSession.meeting_link || RUANG_DIKLAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#FF7643] hover:bg-[#F06530] px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-[#FF7643]/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Video className="h-4 w-4 text-white animate-bounce" />
              <span>Masuk Ruang Zoom / LMS</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/80" />
            </a>
          )}

          {/* Action on Task Time (16:00 - 23:59) */}
          {phase === 'task_time' && (
            <>
              <Link href="/tasks">
                <button className="flex items-center gap-2 rounded-full bg-[#FF7643] hover:bg-[#F06530] px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-[#FF7643]/30 hover:scale-102 active:scale-98 transition-all cursor-pointer">
                  <Upload className="h-4 w-4 text-white" />
                  <span>Buka & Kumpulkan Tugas</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#FFD280]" />
                </button>
              </Link>
              <Link href="/materials">
                <button className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-black text-slate-200 hover:text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5 text-amber-300" />
                  <span>Bahan Ajar PDF</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Prep Time (00:00 - 08:00) */}
          {phase === 'prep_time' && (
            <>
              <Link href="/materials">
                <button className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-600/30 hover:scale-102 active:scale-98 transition-all cursor-pointer">
                  <BookOpen className="h-4 w-4 text-white" />
                  <span>Pelajari Modul Hari ke-{activeDayNum}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-200" />
                </button>
              </Link>
              <Link href="/schedules">
                <button className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-black text-slate-200 hover:text-white transition-all cursor-pointer">
                  <Calendar className="h-3.5 w-3.5 text-sky-300" />
                  <span>Jadwal Sesi</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Weekend -> Explore Modul & Roadmap */}
          {phase === 'weekend' && (
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link href="/schedules">
                <button className="flex items-center gap-2 rounded-full bg-[#0D824B] hover:bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all cursor-pointer">
                  <Calendar className="h-4 w-4 text-emerald-200" />
                  <span>Lihat Jadwal {nextCurriculum.dayOfWeek}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </button>
              </Link>
              <Link href="/materials">
                <button className="flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-3 text-xs font-black text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5 text-amber-300" />
                  <span>Modul 120 JP</span>
                </button>
              </Link>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  )
}

