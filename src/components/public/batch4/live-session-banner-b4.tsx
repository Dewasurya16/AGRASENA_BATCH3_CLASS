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
  Coffee,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'
import {
  BATCH4_DAYS_DATA,
  getScheduleDayNumber,
  getScheduleDate,
  formatIndonesianDate,
  addWorkingDays,
} from '@/lib/roadmap-utils'
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

export type DailyPhaseB4 = 'in_class' | 'in_break' | 'task_time' | 'prep_time' | 'weekend' | 'standby'

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
  const { timezone, setTimezone, convertWibTimeToCurrent, getNowInCurrentZone } = useTimezone()

  // Batch 4 has its own active day selector (defaults to 1 or currentDayNumber)
  const [selectedDay, setSelectedDay] = React.useState<number>(currentDayNumber || 1)
  const activeDayNum = selectedDay

  const todayCurriculum = React.useMemo(() => {
    return BATCH4_DAYS_DATA.find((d) => d.day === activeDayNum) || BATCH4_DAYS_DATA[0]
  }, [activeDayNum])

  // Set of day numbers that have scheduled sessions in database
  const scheduledDaysSet = React.useMemo(() => {
    const set = new Set<number>()
    todaySchedules.forEach((s) => {
      const d = getScheduleDayNumber(s)
      if (d !== null) set.add(d)
    })
    return set
  }, [todaySchedules])

  // Get schedules strictly for activeDayNum
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

  // Compute exact date for activeDayNum
  const activeDayDateStr = React.useMemo(() => {
    for (const s of daysSchedules) {
      const d = getScheduleDate(s)
      if (d) return formatIndonesianDate(d, { withDayName: true, shortMonth: false })
    }
    for (const s of todaySchedules) {
      const dayNum = getScheduleDayNumber(s)
      const d = getScheduleDate(s)
      if (dayNum !== null && d) {
        const [y, m, dayVal] = d.split('-').map(Number)
        const anchor = new Date(y, m - 1, dayVal, 0, 0, 0, 0)
        const diff = activeDayNum - dayNum
        let targetDate: Date
        if (diff >= 0) {
          targetDate = addWorkingDays(anchor, diff)
        } else {
          const dt = new Date(anchor.getTime())
          let back = Math.abs(diff)
          while (back > 0) {
            dt.setDate(dt.getDate() - 1)
            if (dt.getDay() !== 0 && dt.getDay() !== 6) back--
          }
          targetDate = dt
        }
        return formatIndonesianDate(targetDate, { withDayName: true, shortMonth: false })
      }
    }
    const baseAnchor = new Date(2026, 8, 28, 0, 0, 0, 0)
    const calcDate = addWorkingDays(baseAnchor, activeDayNum - 1)
    return formatIndonesianDate(calcDate, { withDayName: true, shortMonth: false })
  }, [daysSchedules, todaySchedules, activeDayNum])

  const hasSessionsForDay = daysSchedules.length > 0

  // Real fallback based on Batch 4 data, not Batch 3
  const defaultFirstSession = React.useMemo(() => {
    if (daysSchedules.length > 0) return daysSchedules[0]
    return {
      id: `b4-day-${activeDayNum}`,
      subject_name: `[Hari ${activeDayNum}] Belum Ada Jadwal Khusus`,
      start_time: "08:00",
      end_time: "15:30",
      lecturer: "Widyaiswara / Panitia Diklat Batch 4",
      room: "Ruang Diklat Virtual Zoom • Batch 4",
      zoom_url: "/batch-4/schedules",
      meeting_link: "/batch-4/schedules"
    }
  }, [daysSchedules, activeDayNum])

  const [activeSession, setActiveSession] = React.useState(defaultFirstSession)
  const [phase, setPhase] = React.useState<DailyPhaseB4>(hasSessionsForDay ? 'prep_time' : 'standby')
  const [countdownText, setCountdownText] = React.useState(hasSessionsForDay ? "Jadwal Terdaftar" : "Masa Persiapan")

  // Update active session when day or schedules change
  React.useEffect(() => {
    if (daysSchedules.length > 0) {
      setActiveSession(daysSchedules[0])
    } else {
      setActiveSession(defaultFirstSession)
    }
  }, [daysSchedules, defaultFirstSession])

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

      if (!hasSessionsForDay) {
        setPhase('standby')
        setCountdownText("Menunggu Rilis Jadwal")
        return
      }

      // 1. Weekend
      if (wibDayOfWeek === 0 || wibDayOfWeek === 6) {
        setPhase('weekend')
        setActiveSession(daysSchedules[0])
        const cleanStart = convertWibTimeToCurrent(cleanTimeDisplay(daysSchedules[0].start_time, "08:00"))
        setCountdownText(`Sesi dimulai Senin, ${cleanStart} ${timezone}`)
        return
      }

      // 2. Active Session Detection
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
        setCountdownText(remH > 0 ? `Selesai dalam ${remH}j ${remM}m` : `Selesai dalam ${remM}m`)
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
        setCountdownText(`Mulai ${remH > 0 ? `${remH}j ` : ''}${remM}m lagi (${cleanStart} ${timezone})`)
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

      setPhase('task_time')
      setActiveSession(daysSchedules[daysSchedules.length - 1])
      setCountdownText(`Sesi hari ini selesai • Mandiri`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [daysSchedules, hasSessionsForDay, getNowInCurrentZone, timezone, convertWibTimeToCurrent])

  const cleanStart = convertWibTimeToCurrent(cleanTimeDisplay(activeSession.start_time, "08:00"))
  const cleanEnd = convertWibTimeToCurrent(cleanTimeDisplay(activeSession.end_time, "15:30"))

  const rawZoomUrl = activeSession.zoom_url || activeSession.meeting_link || ""
  const isDirectZoom = rawZoomUrl.startsWith("http")
  const zoomTargetUrl = isDirectZoom ? rawZoomUrl : "#zoom-access"

  const cleanTitle = (activeSession.subject_name || "")
    .replace(/\[Hari\s*\d+\]\s*/i, "")
    .replace(/\[Batch\s*4\]\s*/i, "")
    .trim()

  return (
    <div className="rounded-[18px] bg-gradient-to-br from-[#0c141d] via-[#101924] to-[#122229] border border-emerald-900/60 p-3.5 sm:p-5 text-white shadow-sm transition-all relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Status Phase Badge */}
            {phase === 'in_class' ? (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs">
                <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                Sesi Aktif
              </span>
            ) : phase === 'in_break' ? (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs">
                <Coffee className="h-3 w-3" />
                Jeda Istirahat
              </span>
            ) : phase === 'task_time' ? (
              <span className="flex items-center gap-1.5 rounded-full bg-teal-600 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs">
                <Clock className="h-3 w-3" />
                Mandiri / Selesai
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-700/80 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs">
                <Radio className="h-3 w-3 text-emerald-300" />
                Jadwal Diklat
              </span>
            )}

            {/* Day & Stage Tag */}
            <span className="rounded-full bg-white/10 text-slate-200 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold">
              Hari {activeDayNum} • {todayCurriculum.stageName}
            </span>

            {/* Batch 4 Badge */}
            <span className="rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
              Batch 4
            </span>

            {/* Timezone Switcher */}
            {mounted && currentTimeStr && (
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold border border-white/10 tabular-nums">
                  ⏰ {currentTimeStr.split(' ')[0]}
                </span>
                
                <div className="flex items-center gap-0.5 bg-black/40 rounded-full p-0.5 border border-white/10 text-[9px] font-bold">
                  {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
                    <button
                      key={tz}
                      type="button"
                      onClick={() => setTimezone(tz)}
                      className={`px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        timezone === tz
                          ? 'bg-emerald-500 text-white font-black shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Countdown / Info */}
            {countdownText && (
              <span className="rounded-full bg-white/10 text-slate-300 border border-white/10 px-2.5 py-0.5 text-[10px] font-medium hidden sm:inline-block">
                ⏳ {countdownText}
              </span>
            )}
          </div>

          {/* Quick Action Button for Zoom */}
          <div className="flex items-center gap-2">
            <a
              href={zoomTargetUrl}
              target={isDirectZoom ? "_blank" : undefined}
              rel={isDirectZoom ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0c141d] font-bold px-3 py-1.5 text-xs transition shadow-xs cursor-pointer"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Zoom Roadmap</span>
              {isDirectZoom && <ExternalLink className="h-3 w-3 opacity-70" />}
            </a>
            <Link
              href="/batch-4/materials"
              className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Bahan Ajar</span>
            </Link>
          </div>
        </div>

        {/* Main Title & Session Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 px-2.5 py-0.5 text-[11px] font-bold">
              <Calendar className="h-3 w-3 text-emerald-400" />
              <span>{activeDayDateStr}</span>
            </span>
            {hasSessionsForDay && (
              <span className="text-[11px] text-slate-300 font-semibold bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                {daysSchedules.length} Sesi Terjadwal
              </span>
            )}
          </div>

          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
            [Hari {activeDayNum}] {cleanTitle || activeSession.subject_name}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Clock className="h-3 w-3 text-amber-400 shrink-0" />
              Jam Diklat: {cleanStart} – {cleanEnd} {timezone}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-emerald-300 shrink-0" />
              Pengampu: {activeSession.lecturer || "Fasilitator Diklat"}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="h-3 w-3 text-teal-400 shrink-0" />
              {activeSession.room || "Ruang Diklat Virtual Zoom • Batch 4"}
            </span>
          </div>
        </div>

        {/* Day Selector Chips: Allows participant to browse all 35 days with scheduled session indicator */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Pilih Hari:
            </span>
            {Array.from({ length: 35 }).map((_, i) => {
              const d = i + 1
              const isSelected = selectedDay === d
              const hasSched = scheduledDaysSet.has(d)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  title={`Hari ${d}${hasSched ? " (Ada Sesi Terjadwal)" : ""}`}
                  className={`relative px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-emerald-500 text-[#0c141d] font-black shadow-xs"
                      : hasSched
                      ? "bg-white/15 text-white hover:bg-white/25"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  <span>H{d}</span>
                  {hasSched && !isSelected && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
                  )}
                </button>
              )
            })}
          </div>

          <Link
            href="/batch-4/schedules"
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 shrink-0 flex items-center gap-1 whitespace-nowrap pl-2"
          >
            <span>Semua Jadwal</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
