'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Video,
  Clock,
  ExternalLink,
  Sparkles,
  Radio,
  Calendar,
  User,
  MapPin,
  Sun,
  BookOpen,
  Coffee,
  ArrowRight,
  Upload,
  Flame,
} from 'lucide-react'
import Link from 'next/link'
import { RAW_DAYS_DATA, getCurrentDiklatDay, getScheduleDayNumber } from '@/lib/roadmap-utils'
import { DEFAULT_BATCH4_SCHEDULES } from '@/data/batch4/schedules-data'
import { useTimezone } from '@/components/timezone-provider'

export interface TaskItemB4 {
  id: string
  title: string
  subject_name: string
  due_date: string
  description?: string | null
  submission_link?: string | null
  status?: string
}

export interface LiveSessionBannerB4Props {
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
  todayTasks?: TaskItemB4[]
  variant?: 'home' | 'schedule'
}

export type DailyPhaseB4 = 'in_class' | 'in_break' | 'task_time' | 'prep_time' | 'weekend'

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

export function LiveSessionBannerB4({
  currentDayName,
  currentDayNumber,
  todaySchedules = [],
  todayTasks = [],
  variant = 'home',
}: LiveSessionBannerB4Props) {
  const [mounted, setMounted] = React.useState(false)
  const [currentTimeStr, setCurrentTimeStr] = React.useState("")
  const [phase, setPhase] = React.useState<DailyPhaseB4>('in_class')
  const [countdownText, setCountdownText] = React.useState("")
  const { timezone, setTimezone, convertWibTimeToCurrent, formatCurrentTime, getNowInCurrentZone } = useTimezone()

  const activeDayNum = currentDayNumber || getCurrentDiklatDay()
  const todayCurriculum = RAW_DAYS_DATA.find((d) => d.day === activeDayNum) || RAW_DAYS_DATA[0]
  const displayDayName = currentDayName || `Hari ${activeDayNum} • ${todayCurriculum.stageName}`

  const daysSchedules = React.useMemo(() => {
    const sourceSchedules =
      todaySchedules && todaySchedules.length > 0
        ? todaySchedules
        : (DEFAULT_BATCH4_SCHEDULES as any[])

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

  const upcomingDayNum = React.useMemo(() => {
    const now = new Date()
    const wibDate = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60 * 1000)
    const dayOfWeek = wibDate.getDay() // 0 = Minggu, 6 = Sabtu, 5 = Jumat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return activeDayNum
    }
    if (dayOfWeek === 5 && (wibDate.getHours() * 60 + wibDate.getMinutes() >= 16 * 60)) {
      return Math.min(35, activeDayNum + 1)
    }
    if (wibDate.getHours() * 60 + wibDate.getMinutes() >= 16 * 60) {
      return Math.min(35, activeDayNum + 1)
    }
    return activeDayNum
  }, [activeDayNum])

  const upcomingCurriculum = RAW_DAYS_DATA.find((d) => d.day === upcomingDayNum) || RAW_DAYS_DATA[0]

  const upcomingDaySchedules = React.useMemo(() => {
    const sourceSchedules =
      todaySchedules && todaySchedules.length > 0
        ? todaySchedules
        : (DEFAULT_BATCH4_SCHEDULES as any[])

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

  const fallbackSession = React.useMemo(() => ({
    id: `live-b4-day-${activeDayNum}`,
    subject_name: `[Hari ${activeDayNum}] Tata Kelola TI & SPBE Nasional (Batch 4)`,
    start_time: "08:00",
    end_time: "15:30",
    lecturer: "Widyaiswara / Tim Pusdiklat Kejaksaan RI",
    room: "Ruang Diklat Virtual Zoom • Batch 4",
    zoom_url: "/batch-4/schedules",
    meeting_link: "/batch-4/schedules"
  }), [activeDayNum])

  const firstUpcomingSession = React.useMemo(() => {
    if (upcomingDaySchedules.length > 0) return upcomingDaySchedules[0]
    return {
      id: `upcoming-b4-day-${upcomingDayNum}`,
      subject_name: `[Hari ${upcomingDayNum}] Pembelajaran Terstruktur Diklat Prakom Batch 4`,
      start_time: "08:00",
      end_time: "15:30",
      lecturer: "Widyaiswara Pusdiklat Kejaksaan RI",
      room: "Ruang Diklat Virtual Zoom • Batch 4",
      zoom_url: "/batch-4/schedules",
      meeting_link: "/batch-4/schedules"
    }
  }, [upcomingDaySchedules, upcomingDayNum])

  const [activeSession, setActiveSession] = React.useState(fallbackSession)

  React.useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      const nowInZone = getNowInCurrentZone()
      const hours = String(nowInZone.getHours()).padStart(2, "0")
      const minutes = String(nowInZone.getMinutes()).padStart(2, "0")
      const seconds = String(nowInZone.getSeconds()).padStart(2, "0")
      setCurrentTimeStr(`${hours}:${minutes}:${seconds} ${timezone}`)

      const now = new Date()
      const utc = now.getTime() + now.getTimezoneOffset() * 60000
      const wibTime = new Date(utc + 7 * 3600000)
      const wibHours = wibTime.getHours()
      const wibMinutes = wibTime.getMinutes()
      const totalMins = wibHours * 60 + wibMinutes
      const wibDayOfWeek = wibTime.getDay() // 0 = Minggu, 6 = Sabtu

      // 1. Weekend Check
      if (wibDayOfWeek === 0 || wibDayOfWeek === 6) {
        setPhase('weekend')
        setActiveSession(firstUpcomingSession)

        const convertedCleanStart = convertWibTimeToCurrent(cleanTimeDisplay(firstUpcomingSession.start_time, "08:00"))
        const daysUntilMonday = wibDayOfWeek === 0 ? 1 : 2
        const mondayWib = new Date(wibTime)
        mondayWib.setDate(mondayWib.getDate() + daysUntilMonday)
        mondayWib.setHours(8, 0, 0, 0)
        const targetUtcMs = mondayWib.getTime() - (7 * 60 * 60 * 1000)
        const diffMs = targetUtcMs - now.getTime()

        if (diffMs > 0) {
          const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
          const days = Math.floor(totalHours / 24)
          const remHours = totalHours % 24
          if (days > 0) {
            setCountdownText(`Sesi dimulai dalam ${days} hari ${remHours} jam (${upcomingCurriculum.dayOfWeek}, ${convertedCleanStart} ${timezone})`)
          } else {
            const remMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            setCountdownText(`Sesi dimulai dalam ${remHours} jam ${remMins} mnt (${upcomingCurriculum.dayOfWeek}, ${convertedCleanStart} ${timezone})`)
          }
        } else {
          setCountdownText(`Sesi dimulai ${upcomingCurriculum.dayOfWeek}, ${convertedCleanStart} ${timezone}`)
        }
        return
      }

      // 2. Schedule Check
      if (daysSchedules.length > 0) {
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

        const firstStart = parseTimeToMinutes(daysSchedules[0].start_time) ?? (8 * 60)
        if (totalMins < firstStart) {
          setPhase('prep_time')
          setActiveSession(daysSchedules[0])
          const remaining = Math.max(0, firstStart - totalMins)
          const remH = Math.floor(remaining / 60)
          const remM = remaining % 60
          const cleanStart = convertWibTimeToCurrent(cleanTimeDisplay(daysSchedules[0].start_time, "08:00"))
          setCountdownText(`Mulai dalam ${remH > 0 ? `${remH}j ` : ''}${remM}m (${cleanStart} ${timezone})`)
          return
        }

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
          const cleanStart = convertWibTimeToCurrent(cleanTimeDisplay(nextUpcoming.start_time, "08:00"))
          setCountdownText(`Sesi berikutnya dalam ${remH > 0 ? `${remH}j ` : ''}${remM}m (${cleanStart} ${timezone})`)
          return
        }

        if (wibDayOfWeek === 5 && totalMins >= 16 * 60) {
          setPhase('weekend')
          setActiveSession(firstUpcomingSession)
          const cleanStart = convertWibTimeToCurrent(cleanTimeDisplay(firstUpcomingSession.start_time, "08:00"))
          setCountdownText(`Sesi pekan depan: ${upcomingCurriculum.dayOfWeek}, ${cleanStart} ${timezone}`)
          return
        }

        setPhase('task_time')
        setActiveSession(daysSchedules[daysSchedules.length - 1])
        const remaining = Math.max(0, (24 * 60) - totalMins)
        const remH = Math.floor(remaining / 60)
        const remM = remaining % 60
        const taskDueConverted = convertWibTimeToCurrent("23:59")
        setCountdownText(`Tenggat ${remH}j ${remM}m lagi (${taskDueConverted} ${timezone})`)
        return
      }

      // 3. Fallback
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
        if (wibDayOfWeek === 5) {
          setPhase('weekend')
          setActiveSession(firstUpcomingSession)
          const cleanStart = convertWibTimeToCurrent(cleanTimeDisplay(firstUpcomingSession.start_time, "08:00"))
          setCountdownText(`Sesi dimulai ${upcomingCurriculum.dayOfWeek}, ${cleanStart} ${timezone}`)
          return
        }
        setPhase('task_time')
        setActiveSession(fallbackSession)
        const remainingMinutes = (24 * 60) - totalMins
        const remH = Math.floor(remainingMinutes / 60)
        const remM = remainingMinutes % 60
        const taskDueConverted = convertWibTimeToCurrent("23:59")
        setCountdownText(`Tenggat ${remH}j ${remM}m lagi (${taskDueConverted} ${timezone})`)
        return
      }

      if (totalMins >= 0 && totalMins < 8 * 60) {
        setPhase('prep_time')
        setActiveSession(fallbackSession)
        const remainingMinutes = (8 * 60) - totalMins
        const remH = Math.floor(remainingMinutes / 60)
        const remM = remainingMinutes % 60
        const cleanStart = convertWibTimeToCurrent("08:00")
        setCountdownText(`Mulai dalam ${remH}j ${remM}m (${cleanStart} ${timezone})`)
        return
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [daysSchedules, activeDayNum, firstUpcomingSession, upcomingCurriculum, timezone, convertWibTimeToCurrent, getNowInCurrentZone, fallbackSession])

  const matchedTask = todayTasks.find((t) => {
    const titleMatch = t.title.toLowerCase().includes(`hari ${activeDayNum}`) ||
                       t.subject_name.toLowerCase().includes(`hari ${activeDayNum}`)
    return titleMatch && t.status !== 'completed'
  }) || todayTasks.find((t) => t.status !== 'completed') || {
    id: `task-b4-day-${activeDayNum}`,
    title: `Tugas Mandiri & Praktik Lab Satker Hari ke-${activeDayNum}`,
    subject_name: activeSession.subject_name,
    due_date: `${todayCurriculum.date}, ${convertWibTimeToCurrent("23:59")} ${timezone}`,
    submission_link: '/batch-4/tasks',
  }

  const rawCleanStart = cleanTimeDisplay(activeSession.start_time, "08:00")
  const rawCleanEnd = cleanTimeDisplay(activeSession.end_time, "15:30")
  const rawNextCleanStart = cleanTimeDisplay(firstUpcomingSession.start_time, "08:00")
  const rawNextCleanEnd = cleanTimeDisplay(firstUpcomingSession.end_time, "15:30")

  const cleanStart = convertWibTimeToCurrent(rawCleanStart)
  const cleanEnd = convertWibTimeToCurrent(rawCleanEnd)
  const nextCleanStart = convertWibTimeToCurrent(rawNextCleanStart)
  const nextCleanEnd = convertWibTimeToCurrent(rawNextCleanEnd)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[20px] bg-[#0f172a] dark:bg-[#0b1120] text-white p-5 sm:p-6 border border-emerald-500/30 shadow-xl shadow-emerald-950/20"
    >
      {/* Decorative Emerald Glows */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left Side: Dynamic Phase Badges & Title */}
        <div className="space-y-3 flex-1 min-w-0">
          
          {/* Top Pill Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. Sesi Aktif */}
            {phase === 'in_class' && (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500 text-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-2xs">
                <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                Sesi Aktif
              </span>
            )}

            {/* 2. Jeda Istirahat */}
            {phase === 'in_break' && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-2xs">
                <Coffee className="h-3 w-3 text-white" />
                Jeda Istirahat
              </span>
            )}

            {/* 3. Waktu Tugas */}
            {phase === 'task_time' && (
              <span className="flex items-center gap-1.5 rounded-full bg-teal-600 text-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-2xs">
                <Clock className="h-3 w-3 text-white" />
                Waktu Tugas Mandiri
              </span>
            )}

            {/* 4. Persiapan Besok */}
            {phase === 'prep_time' && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 text-white border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-2xs">
                <Clock className="h-3 w-3 text-white" />
                Persiapan Besok
              </span>
            )}

            {/* 5. Weekend */}
            {phase === 'weekend' && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Libur Akhir Pekan
              </span>
            )}

            {/* Day & Stage Tag */}
            <span className="rounded-full bg-white/10 text-slate-200 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold">
              {phase === 'weekend' ? `Rehat • Menuju Hari ${upcomingDayNum} (${upcomingCurriculum.dayOfWeek}, ${upcomingCurriculum.date})` : displayDayName}
            </span>

            {/* Batch 4 Badge */}
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
              Batch 4
            </span>

            {/* Realtime Clock & Timezone Switcher */}
            {mounted && currentTimeStr && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold border border-white/10 tabular-nums">
                  ⏰ {currentTimeStr.split(' ')[0]} <span className="text-[9px] opacity-80">{timezone}</span>
                </span>
                
                {/* Timezone Pill Toggle */}
                <div className="flex items-center gap-0.5 bg-black/40 rounded-full p-0.5 border border-white/10 text-[9px] font-bold">
                  {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
                    <button
                      key={tz}
                      type="button"
                      onClick={() => setTimezone(tz)}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        timezone === tz
                          ? 'bg-emerald-500 text-white font-black shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                      title={`Ganti zona waktu ke ${tz}`}
                    >
                      {tz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Countdown Pill */}
            {mounted && countdownText && phase !== 'weekend' && (
              <span className="rounded-full bg-white/10 text-slate-300 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold">
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
                    Jam Diklat: {cleanStart} – {cleanEnd} {timezone}
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-emerald-300" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3 w-3 text-teal-400" />
                    {activeSession.room || "Ruang Zoom Roadmap • Batch 4"}
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
                    Jadwal Mulai: {cleanStart} – {cleanEnd} {timezone}
                  </span>
                  {activeSession.lecturer && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-emerald-300" />
                      Pengampu: {activeSession.lecturer}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3 w-3 text-teal-400" />
                    {activeSession.room || "Ruang Zoom Roadmap • Batch 4"}
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
                    Batas Upload: {matchedTask.due_date || `Malam ini ${convertWibTimeToCurrent("23:59")} ${timezone}`}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <BookOpen className="h-3 w-3 text-teal-300" />
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
                    Perkuliahan Dimulai Pukul {cleanStart} {timezone} (Pagi Ini)
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

            {/* Weekend Mode */}
            {phase === 'weekend' && (
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug flex items-center gap-1.5">
                    <span>Selamat Berlibur & Selamat Rehat, Rekan Agrasena Batch 4! ✨</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300/80 leading-relaxed">
                    Tidak ada sesi tatap muka online hari ini. Selamat menikmati waktu rehat bersama keluarga.
                  </p>
                </div>

                <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-[10px] bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 shrink-0">
                      <Calendar className="h-3 w-3 text-amber-400" />
                      {upcomingCurriculum.dayOfWeek}, {upcomingCurriculum.date}:
                    </span>
                    <span className="font-mono bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-800/60 shrink-0">
                      {nextCleanStart} – {nextCleanEnd} {timezone}
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

        {/* Right Dynamic Action Buttons (Focus on Roadmap Zoom & Academic Links) */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 w-full lg:w-48">
          
          {/* Action on Active Class or Break */}
          {(phase === 'in_class' || phase === 'in_break') && (
            <>
              <Link href="/batch-4/schedules#zoom-access" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer">
                  <Video className="h-3.5 w-3.5" />
                  <span>Zoom di Roadmap</span>
                  <ExternalLink className="h-3 w-3 opacity-80" />
                </button>
              </Link>
              <Link href="/batch-4/materials" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Bahan Ajar</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Task Time */}
          {phase === 'task_time' && (
            <>
              <Link href="/batch-4/tasks" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Kumpulkan Tugas</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
              <Link href="/batch-4/materials" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Bahan Ajar</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Prep Time */}
          {phase === 'prep_time' && (
            <>
              <Link href="/batch-4/materials" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Pelajari Modul</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
              <Link href="/batch-4/schedules" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-all cursor-pointer">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Jadwal Sesi</span>
                </button>
              </Link>
            </>
          )}

          {/* Action on Weekend */}
          {phase === 'weekend' && (
            <>
              <Link href="/batch-4/schedules" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Jadwal {upcomingCurriculum.dayOfWeek}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
              <Link href="/batch-4/materials" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-all cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5" />
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
