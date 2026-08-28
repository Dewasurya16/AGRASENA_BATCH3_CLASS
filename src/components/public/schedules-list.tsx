'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Video,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  Download,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { getAutoRoadmapData, RoadmapDayDetail, parseDiklatDate, parseTimeToMins } from "@/lib/roadmap-utils"
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar-utils"
import { DEFAULT_SCHEDULES_DATA } from "@/lib/default-schedules"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"

export interface ScheduleItem {
  id: string
  subject_name: string
  day: string
  start_time: string
  end_time: string
  lecturer: string
  room: string
  meeting_link?: string | null
}

function computeSessionCountdown(dateStr: string, timeRange: string, nowTime: number) {
  const itemDate = parseDiklatDate(dateStr)
  if (!itemDate) return null

  // Extract start and end times e.g. "09:30 - 10:15" or "09:30"
  const parts = timeRange.split("-")
  const startPart = parts[0]?.trim() || "08:00"
  const endPart = parts[1]?.trim() || "15:30"

  const startMins = parseTimeToMins(startPart) || (8 * 60)
  const endMins = parseTimeToMins(endPart) || (startMins + 90)

  const startDate = new Date(itemDate)
  startDate.setHours(Math.floor(startMins / 60), startMins % 60, 0, 0)

  const endDate = new Date(itemDate)
  endDate.setHours(Math.floor(endMins / 60), endMins % 60, 0, 0)

  const startMs = startDate.getTime()
  const endMs = endDate.getTime()

  // 1. Finished
  if (nowTime >= endMs) {
    return {
      status: "completed",
      label: "✅ Selesai",
      badgeClass: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#161B26] border border-slate-200/60 dark:border-[#2A3550]",
    }
  }

  // 2. Active Now
  if (nowTime >= startMs && nowTime < endMs) {
    const remMinutes = Math.max(1, Math.floor((endMs - nowTime) / (1000 * 60)))
    return {
      status: "in_class",
      label: `🟢 Sesi Aktif (${remMinutes}m lagi)`,
      badgeClass: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 animate-pulse",
    }
  }

  // 3. Upcoming Countdown
  const diffMs = startMs - nowTime
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const remHours = totalHours % 24
  const remMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const remSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

  let label = ""
  if (days > 0) {
    label = `⏳ Mulai ${days}h ${remHours}j ${remMins}m`
  } else if (remHours > 0) {
    label = `⏳ Mulai ${remHours}j ${remMins}m ${remSecs}d`
  } else {
    label = `⏳ Mulai ${remMins}m ${remSecs}d`
  }

  return {
    status: "upcoming",
    label,
    badgeClass: "text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-200/60 dark:border-sky-800/40 font-mono",
  }
}

export function SchedulesList({ schedules = [] }: { schedules?: ScheduleItem[] }) {
  const [selectedStage, setSelectedStage] = React.useState<number>(0)
  const [activeModalDay, setActiveModalDay] = React.useState<RoadmapDayDetail | null>(null)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [nowTime, setNowTime] = React.useState<number>(Date.now())
  const [liveSchedules, setLiveSchedules] = React.useState<ScheduleItem[]>(
    schedules && schedules.length > 0 ? schedules : (DEFAULT_SCHEDULES_DATA as any[])
  )

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    if (schedules && schedules.length > 0) {
      setLiveSchedules(schedules)
    }

    try {
      const supabase = createBrowserSupabaseClient()
      supabase
        .from("schedules")
        .select("*")
        .order("start_time", { ascending: true })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setLiveSchedules(data as any[])
          }
        })
    } catch {
      // Ignore
    }
  }, [schedules])

  // Automatic calculation based on 35 days + Live manual sessions from Supabase
  const { days, summary } = React.useMemo(
    () => getAutoRoadmapData(undefined, liveSchedules),
    [liveSchedules]
  )

  // Stage definitions for clean segmented views
  const stageCategories = [
    { id: 0, name: "Semua Tahap", range: "Hari 1 - 35", color: "bg-[#18181B] text-white" },
    { id: 1, name: "Tahap 1 • MOOC", range: "Hari 1 - 5 (24 - 28 Agu)", color: "bg-[#D7F3FE] text-[#0369A1]" },
    { id: 2, name: "Tahap 2 • TMO", range: "Hari 6 - 15 (31 Agu - 11 Sep)", color: "bg-[#E6F7ED] text-[#0D824B]" },
    { id: 3, name: "Tahap 3 • Lab Prakom", range: "Hari 16 - 30 (14 Sep - 2 Okt)", color: "bg-[#FFE3EB] text-[#E11D48]" },
    { id: 4, name: "Tahap 4 • Seminar", range: "Hari 31 - 35 (5 - 9 Okt)", color: "bg-[#FFF2D1] text-[#B47D00]" },
  ]

  const filteredDays = days.filter((item) => {
    const matchStage = selectedStage === 0 || item.stageNumber === selectedStage
    const q = searchQuery.toLowerCase().trim()
    const matchQuery =
      !q ||
      `Hari ${item.dayNumber}`.toLowerCase().includes(q) ||
      item.stageName.toLowerCase().includes(q) ||
      item.dateStr.toLowerCase().includes(q) ||
      item.sessions.some((s) => s.title.toLowerCase().includes(q) || (s.instructor && s.instructor.toLowerCase().includes(q)))
    return matchStage && matchQuery
  })

  return (
    <div className="space-y-8">
      
      {/* 1. Header Hero Card with Progress Meter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-[14px] bg-white dark:bg-[#1B2130] p-5 sm:p-7 border border-slate-200/90 dark:border-[#2A3550] shadow-xs space-y-5 transition-colors duration-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-amber-400">
                Roadmap 35 Hari Diklat Fungsional
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Jadwal 35 Hari Pelatihan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Struktur lengkap 35 hari perkuliahan Pranata Komputer Kejaksaan RI. Isi kegiatan dan modul disinkronkan langsung dari data manual pengurus di Supabase.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#161B26] p-3 rounded-[10px] border border-slate-200/80 dark:border-[#2A3550] self-start lg:self-auto">
            <div className="text-center px-3">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">{summary.completedDays}</div>
              <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Selesai</div>
            </div>
            <div className="h-7 w-px bg-slate-200 dark:bg-[#2A3550]" />
            <div className="text-center px-3">
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">Hari {summary.currentDayNumber}</div>
              <div className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                {summary.isTodayActive ? "Hari Ini" : "Sesi Berikutnya"}
              </div>
            </div>
            <div className="h-7 w-px bg-slate-200 dark:bg-[#2A3550]" />
            <div className="text-center px-3">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">{summary.totalDays - summary.completedDays}</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Tersisa</div>
            </div>
          </div>
        </div>

        {/* Filter Stage Tabs & Search */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-[#2A3550] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {stageCategories.map((tab) => {
              const isSelected = selectedStage === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStage(tab.id)}
                  className={`rounded-[8px] px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-[#161B26] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#253045] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.name}
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hari / tanggal / sesi..."
              className="h-9 w-full rounded-[8px] border border-slate-200/90 dark:border-[#2A3550] bg-white dark:bg-[#161B26] pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Structured 35 Days Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
            Daftar 35 Hari Pelatihan ({filteredDays.length} Hari Ditampilkan)
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Klik kartu untuk rincian sesi & countdown
          </span>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {filteredDays.map((item) => {
            const isCompleted = item.status === "completed"
            const isToday = item.isTodayExact
            const isNextUpcoming = item.isNextUpcoming || (!isToday && item.dayNumber === summary.currentDayNumber && !isCompleted)

            // Calculate live countdown string for the upcoming card
            let countdownText = ""
            if (isNextUpcoming && item.targetTimestamp) {
              const diffMs = item.targetTimestamp - nowTime
              if (diffMs > 0) {
                const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
                const daysLeft = Math.floor(totalHours / 24)
                const remHours = totalHours % 24
                const remMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                const remSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

                if (daysLeft > 0) {
                  countdownText = `⏳ Mulai dalam ${daysLeft}h ${remHours}j ${remMins}m (${item.dayOfWeek})`
                } else {
                  countdownText = `⏳ Mulai ${remHours}j ${remMins}m ${remSecs}d (${item.dayOfWeek})`
                }
              } else {
                countdownText = `⏳ Mulai ${item.dayOfWeek} Pagi`
              }
            }

            let headerBg = "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            if (item.stageNumber === 1) headerBg = "bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300"
            if (item.stageNumber === 2) headerBg = "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
            if (item.stageNumber === 3) headerBg = "bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300"
            if (item.stageNumber === 4) headerBg = "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"

            return (
              <motion.div
                key={item.dayNumber}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setActiveModalDay(item)}
                className={`group cursor-pointer rounded-[12px] bg-white dark:bg-[#1B2130] border overflow-hidden flex flex-col justify-between transition-all ${
                  isToday
                    ? "border-orange-500/80 dark:border-amber-500 ring-2 ring-orange-500/20 shadow-xs"
                    : isNextUpcoming
                    ? "border-indigo-500/80 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                    : isCompleted
                    ? "border-slate-200/90 dark:border-[#2A3550] hover:border-emerald-500 dark:hover:border-emerald-500 shadow-2xs"
                    : "border-slate-200/90 dark:border-[#2A3550] hover:border-slate-400 dark:hover:border-slate-500 shadow-2xs"
                }`}
              >
                {/* Window Header */}
                <div className={`flex items-center justify-between px-3 py-1.5 border-b border-slate-200/80 dark:border-[#2A3550] ${headerBg}`}>
                  <div className="flex items-center gap-1.5 font-black text-[11px]">
                    <span>Hari {item.dayNumber}</span>
                    <span>•</span>
                    <span className="text-[10px] font-bold">{item.stageName}</span>
                  </div>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Top Day info + Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        Hari ke-{item.dayNumber}
                      </h4>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{item.dateStr}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[10px] font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#161B26] px-2 py-0.5 rounded-[6px] border border-slate-200/70 dark:border-[#2A3550]">
                        {item.sessions.length} Sesi
                      </span>
                    </div>
                  </div>

                  {/* Sessions Preview with Individual Session Countdown (Manual from Supabase) */}
                  <div className="space-y-2">
                    {item.sessions.length > 0 ? (
                      item.sessions.slice(0, 2).map((ses, sIdx) => {
                        const sesCountdown = computeSessionCountdown(item.dateStr, ses.time, nowTime)
                        return (
                          <div
                            key={sIdx}
                            className="rounded-[8px] bg-slate-50 dark:bg-[#161B26] p-2.5 border border-slate-200/70 dark:border-[#2A3550] text-xs space-y-1"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold">
                              <span className="text-sky-700 dark:text-sky-400 font-mono font-black">{ses.time} WIB</span>
                              {sesCountdown && (
                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black tracking-tight ${sesCountdown.badgeClass}`}>
                                  {sesCountdown.label}
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-slate-900 dark:text-slate-200 line-clamp-1">
                              {ses.title}
                            </p>
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-[8px] bg-slate-50 dark:bg-[#161B26] p-2.5 text-center border border-dashed border-slate-200 dark:border-[#2A3550] text-[11px] text-slate-400">
                        Belum ada kegiatan manual yang diisi
                      </div>
                    )}
                  </div>

                  {/* Bottom Status Pill */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-[#2A3550] text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider tabular-nums ${
                        isCompleted
                          ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                          : isToday
                          ? "bg-orange-100 dark:bg-amber-950/80 text-orange-700 dark:text-amber-300 border border-orange-200 dark:border-amber-800/60 animate-pulse"
                          : isNextUpcoming
                          ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 font-mono"
                          : "bg-slate-100 dark:bg-[#161B26] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-[#2A3550]"
                      }`}
                    >
                      {isCompleted
                        ? "Selesai"
                        : isToday
                        ? "Sedang Berjalan (Hari Ini)"
                        : isNextUpcoming
                        ? (countdownText || `⏳ Menjelang (${item.dayOfWeek})`)
                        : "Jadwal Mendatang"}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition">
                      <span>Detail</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 3. Clean Legend Bar */}
        <div className="rounded-[12px] bg-white dark:bg-[#1B2130] p-3.5 border border-slate-200/90 dark:border-[#2A3550] flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Selesai (Sudah Terlaksana)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span>Sedang Berjalan (Hari Ini)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>Countdown Sesi Mendatang</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Belum Mulai (Jadwal Mendatang)</span>
          </div>
        </div>

      </div>

      {/* Modal Detail Sesi Perkuliahan Hari Tertentu */}
      {activeModalDay && (
        <Modal
          isOpen={Boolean(activeModalDay)}
          onClose={() => setActiveModalDay(null)}
          title={`Hari ke-${activeModalDay.dayNumber} — ${activeModalDay.stageName}`}
          description={`Jadwal Sesi & Bahan Ajar • Tanggal: ${activeModalDay.dateStr}`}
          className="max-w-2xl"
        >
          <div className="space-y-4">
            
            {/* Status Header */}
            <div className="flex items-center justify-between p-3 rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550]">
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">Status Perkuliahan:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                  activeModalDay.status === "completed"
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                    : activeModalDay.isTodayExact
                    ? "bg-orange-100 dark:bg-amber-950/80 text-orange-700 dark:text-amber-300 animate-pulse"
                    : activeModalDay.isNextUpcoming
                    ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {activeModalDay.status === "completed"
                  ? "Selesai"
                  : activeModalDay.isTodayExact
                  ? "Sedang Berjalan Hari Ini"
                  : activeModalDay.isNextUpcoming
                  ? `⏳ Sesi Mendatang • ${activeModalDay.dayOfWeek}, ${activeModalDay.dateStr} (09:30 WIB)`
                  : "Jadwal Mendatang"}
              </span>
            </div>

            {/* Session Items from Supabase with Live Session Countdown */}
            <div className="space-y-2.5">
              <h5 className="font-black text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Rincian Sesi & Kegiatan:
              </h5>

              {activeModalDay.sessions && activeModalDay.sessions.length > 0 ? (
                activeModalDay.sessions.map((ses, sIdx) => {
                  const sesCountdown = computeSessionCountdown(activeModalDay.dateStr, ses.time, nowTime)
                  return (
                    <div
                      key={sIdx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-[10px] bg-slate-50 dark:bg-[#161B26] p-3.5 border border-slate-200/80 dark:border-[#2A3550] gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-black text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 px-2 py-0.5 rounded-[6px] border border-sky-200/60 dark:border-sky-800/40">
                            {ses.time} WIB
                          </span>
                          {sesCountdown && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight ${sesCountdown.badgeClass}`}>
                              {sesCountdown.label}
                            </span>
                          )}
                        </div>
                        <h6 className="font-black text-sm text-slate-900 dark:text-slate-100">{ses.title}</h6>
                        {ses.instructor && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengampu: <strong className="text-slate-700 dark:text-slate-200">{ses.instructor}</strong>
                          </p>
                        )}
                        {ses.room && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{ses.room}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                        {/* 1-Click Zoom Link */}
                        {ses.zoomUrl && (
                          <a
                            href={ses.zoomUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-[8px] bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-black text-white shadow-xs transition"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Zoom Kelas</span>
                          </a>
                        )}

                        {/* 1-Click Google Calendar */}
                        <a
                          href={generateGoogleCalendarUrl({
                            title: `Hari ke-${activeModalDay.dayNumber}: ${ses.title}`,
                            description: `Sesi Perkuliahan Diklat Fungsional Prakom Batch 3.\nPengampu: ${ses.instructor || 'Widyaiswara Pusdiklat'}\nModul: ${activeModalDay.stageName}`,
                            startDate: activeModalDay.dateStr,
                            startTime: ses.time.split(' - ')[0] || '08:00',
                            endTime: ses.time.split(' - ')[1] || '16:00'
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-[8px] bg-white dark:bg-[#1B2130] px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-[#253045] transition shadow-2xs"
                          title="Simpan ke Google Calendar"
                        >
                          <Calendar className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                          <span>Google Cal</span>
                        </a>

                        {/* Download .ics file */}
                        <button
                          type="button"
                          onClick={() => downloadIcsFile({
                            title: `Hari ke-${activeModalDay.dayNumber}: ${ses.title}`,
                            description: `Sesi Perkuliahan Diklat Fungsional Prakom Batch 3.\nPengampu: ${ses.instructor || 'Widyaiswara Pusdiklat'}`,
                            startDate: activeModalDay.dateStr,
                            startTime: ses.time.split(' - ')[0] || '08:00',
                            endTime: ses.time.split(' - ')[1] || '16:00'
                          })}
                          className="inline-flex items-center gap-1.5 rounded-[8px] bg-white dark:bg-[#1B2130] px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-[#253045] transition shadow-2xs cursor-pointer"
                          title="Unduh file .ics (Apple / Outlook)"
                        >
                          <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>.ICS</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-5 text-center space-y-1.5 rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-dashed border-slate-200 dark:border-[#2A3550]">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Belum ada kegiatan manual untuk Hari ke-{activeModalDay.dayNumber}</p>
                  <p className="text-[11px] text-slate-400">
                    Tambahkan sesi jadwal untuk <strong>Hari {activeModalDay.dayNumber}</strong> melalui Dashboard Pengurus.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}
