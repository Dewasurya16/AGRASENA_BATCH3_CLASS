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
import { useTimezone } from "@/components/timezone-provider"

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

  const utcYear = itemDate.getFullYear()
  const utcMonth = itemDate.getMonth()
  const utcDate = itemDate.getDate()
  const startH = Math.floor(startMins / 60)
  const startM = startMins % 60
  const endH = Math.floor(endMins / 60)
  const endM = endMins % 60

  // WIB is UTC+7
  const startMs = Date.UTC(utcYear, utcMonth, utcDate, startH - 7, startM, 0)
  const endMs = Date.UTC(utcYear, utcMonth, utcDate, endH - 7, endM, 0)

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
  const { timezone, setTimezone, convertWibTimeToCurrent, convertTimeRange } = useTimezone()
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

  // Stage definitions for clean segmented views with Apple dynamic colors
  const stageCategories = [
    { id: 0, name: "Semua Tahap", range: "Hari 1 - 35", color: "bg-[#007aff] text-white" },
    { id: 1, name: "Tahap 1 • MOOC", range: "Hari 1 - 5 (24 - 28 Agu)", color: "bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa]" },
    { id: 2, name: "Tahap 2 • TMO", range: "Hari 6 - 15 (31 Agu - 11 Sep)", color: "bg-[#af52de]/15 text-[#8a38b5] dark:text-[#d8b4fe]" },
    { id: 3, name: "Tahap 3 • Lab Prakom", range: "Hari 16 - 30 (14 Sep - 2 Okt)", color: "bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80]" },
    { id: 4, name: "Tahap 4 • Seminar", range: "Hari 31 - 35 (5 - 9 Okt)", color: "bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24]" },
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
      
      {/* 1. Header Banner & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[16px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-3 py-0.5 text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Roadmap 35 Hari Kerja</span>
              </span>
              <span className="rounded-full bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] border border-[#34c759]/30 px-2.5 py-0.5 text-xs font-semibold">
                120 JP Full Kurikulum
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
              Jadwal & Roadmap Sesi <br className="hidden sm:block" />
              <span className="text-[#007aff] dark:text-[#60a5fa]">Pelatihan Fungsional Prakom</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
              Panduan lengkap hari perkuliahan, sesi Tatap Muka Online (TMO), praktikum laboratorium satker, hingga seminar akhir klasikal.
            </p>
          </div>

          {/* Quick Summary Pill Box */}
          <div className="flex items-center gap-3 bg-[#f6f5f4] dark:bg-[#141b27] p-3 rounded-[12px] border border-[#e6e6e6] dark:border-white/10 self-start lg:self-auto shadow-2xs">
            <div className="text-center px-3">
              <div className="text-xl font-bold text-[#000000] dark:text-white">{summary.completedDays}</div>
              <div className="text-[10px] font-semibold uppercase text-[#34c759] dark:text-[#4ade80]">Selesai</div>
            </div>
            <div className="h-7 w-px bg-[#e6e6e6] dark:border-white/10" />
            <div className="text-center px-3">
              <div className="text-xl font-bold text-[#007aff] dark:text-[#60a5fa]">Hari {summary.currentDayNumber}</div>
              <div className="text-[10px] font-semibold uppercase text-[#007aff] dark:text-[#60a5fa]">
                {summary.isTodayActive ? "Hari Ini" : "Sesi Berikutnya"}
              </div>
            </div>
            <div className="h-7 w-px bg-[#e6e6e6] dark:border-white/10" />
            <div className="text-center px-3">
              <div className="text-xl font-bold text-[#000000] dark:text-white">{summary.totalDays - summary.completedDays}</div>
              <div className="text-[10px] font-semibold uppercase text-[#615d59] dark:text-[#94a3b8]">Tersisa</div>
            </div>
          </div>
        </div>

        {/* Filter Stage Tabs & Search & Timezone Switcher */}
        <div className="pt-3.5 border-t border-[#e6e6e6] dark:border-[#333333] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {stageCategories.map((tab) => {
              const isSelected = selectedStage === tab.id
              let activeColor = "bg-[#0075de] text-white"

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStage(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? `${activeColor} shadow-2xs`
                      : "bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#a39e98] hover:bg-[#e6e6e6] dark:hover:bg-[#2c2c2c] hover:text-[#000000] dark:hover:text-white"
                  }`}
                >
                  {tab.name}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Timezone Switcher Pill */}
            <div className="flex items-center gap-0.5 bg-[#f6f5f4] dark:bg-[#252525] rounded-full p-1 border border-[#e6e6e6] dark:border-[#333333] text-[10px] font-semibold shrink-0">
              {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
                <button
                  key={tz}
                  type="button"
                  onClick={() => setTimezone(tz)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    timezone === tz
                      ? 'bg-[#0075de] text-white font-semibold shadow-2xs'
                      : 'text-[#615d59] dark:text-[#a39e98] hover:text-[#000000] dark:hover:text-white'
                  }`}
                  title={`Tampilkan jam perkuliahan dalam zona ${tz}`}
                >
                  {tz}
                </button>
              ))}
            </div>

            <div className="relative flex-1 md:w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#615d59]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari hari / tanggal / sesi..."
                className="h-8.5 w-full rounded-full border border-[#e6e6e6] dark:border-[#333333] bg-white dark:bg-[#252525] pl-9 pr-3 text-xs font-normal text-[#000000] dark:text-white placeholder-[#a39e98] focus:border-[#0075de] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Structured 35 Days Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-bold text-[#000000] dark:text-white">
            Daftar 35 Hari Pelatihan ({filteredDays.length} Hari Ditampilkan)
          </h3>
          <span className="text-xs font-semibold text-[#615d59] dark:text-[#94a3b8]">
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

            let headerBg = "bg-[#f6f5f4] dark:bg-[#101520] text-[#615d59] dark:text-[#94a3b8]"
            if (item.stageNumber === 1) headerBg = "bg-[#007aff]/10 dark:bg-[#007aff]/20 text-[#007aff] dark:text-[#60a5fa] border-b border-[#007aff]/20"
            if (item.stageNumber === 2) headerBg = "bg-[#af52de]/10 dark:bg-[#af52de]/20 text-[#8a38b5] dark:text-[#d8b4fe] border-b border-[#af52de]/20"
            if (item.stageNumber === 3) headerBg = "bg-[#ff2d55]/10 dark:bg-[#ff2d55]/20 text-[#e11d48] dark:text-[#fda4af] border-b border-[#ff2d55]/20"
            if (item.stageNumber === 4) headerBg = "bg-[#ff9500]/10 dark:bg-[#ff9500]/20 text-[#d97706] dark:text-[#fbbf24] border-b border-[#ff9500]/20"

            return (
              <motion.div
                key={item.dayNumber}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setActiveModalDay(item)}
                className={`group cursor-pointer rounded-[14px] bg-white dark:bg-[#141b27] border overflow-hidden flex flex-col justify-between transition-all ${
                  isToday
                    ? "border-[#ff9500] ring-2 ring-[#ff9500]/20 shadow-xs"
                    : isNextUpcoming
                    ? "border-[#007aff] ring-2 ring-[#007aff]/20 shadow-xs"
                    : isCompleted
                    ? "border-[#e6e6e6] dark:border-white/10 hover:border-[#34c759] shadow-2xs"
                    : "border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 shadow-2xs"
                }`}
              >
                {/* Window Header */}
                <div className={`flex items-center justify-between px-3.5 py-2 border-b border-[#e6e6e6] dark:border-white/10 ${headerBg}`}>
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span>Hari {item.dayNumber}</span>
                    <span>•</span>
                    <span className="text-[10px] font-semibold">{item.stageName}</span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold opacity-70">_oX</span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Top Day info + Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                        Hari ke-{item.dayNumber}
                      </h4>
                      <p className="flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#94a3b8] font-normal">
                        <Calendar className="h-3 w-3 text-[#615d59]" strokeWidth={2} />
                        <span>{item.dateStr}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[10px] font-semibold text-[#000000] dark:text-white bg-[#f6f5f4] dark:bg-[#101520] px-2.5 py-0.5 rounded-full border border-[#e6e6e6] dark:border-white/10">
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
                            className="rounded-[10px] bg-[#f6f5f4] dark:bg-[#101520] p-2.5 border border-[#e6e6e6] dark:border-white/10 text-xs space-y-1"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-semibold">
                              <span className="text-[#007aff] dark:text-[#60a5fa] font-mono font-bold">{convertTimeRange(ses.time)}</span>
                              {sesCountdown && (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-tight ${sesCountdown.badgeClass}`}>
                                  {sesCountdown.label}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-[#000000] dark:text-white line-clamp-1">
                              {ses.title}
                            </p>
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-[10px] bg-[#f6f5f4] dark:bg-[#101520] p-2.5 text-center border border-dashed border-[#e6e6e6] dark:border-white/10 text-[11px] text-[#615d59]">
                        Belum ada kegiatan manual yang diisi
                      </div>
                    )}
                  </div>

                  {/* Bottom Status Pill */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#e6e6e6] dark:border-white/10 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider tabular-nums ${
                        isCompleted
                          ? "bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] border border-[#34c759]/30"
                          : isToday
                          ? "bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 animate-pulse"
                          : isNextUpcoming
                          ? "bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 font-mono"
                          : "bg-[#f6f5f4] dark:bg-[#101520] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10"
                      }`}
                    >
                      {isCompleted
                        ? "Selesai"
                        : isToday
                        ? "Hari Ini"
                        : isNextUpcoming
                        ? (countdownText || `⏳ Menjelang (${item.dayOfWeek})`)
                        : "Mendatang"}
                    </span>

                    <span className="text-[11px] font-semibold text-[#615d59] group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] flex items-center gap-0.5 transition">
                      <span>Detail</span>
                      <ChevronRight className="h-3 w-3" strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
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
            <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#f6f5f4] dark:bg-[#101520] border border-[#e6e6e6] dark:border-white/10">
              <span className="text-xs font-bold text-[#000000] dark:text-white">Status Perkuliahan:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                  activeModalDay.status === "completed"
                    ? "bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80]"
                    : activeModalDay.isTodayExact
                    ? "bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] animate-pulse"
                    : activeModalDay.isNextUpcoming
                    ? "bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] font-mono"
                    : "bg-[#f6f5f4] dark:bg-[#101520] text-[#615d59] dark:text-[#94a3b8]"
                }`}
              >
                {activeModalDay.status === "completed"
                  ? "Selesai"
                  : activeModalDay.isTodayExact
                  ? "Sedang Berjalan Hari Ini"
                  : activeModalDay.isNextUpcoming
                  ? `⏳ Sesi Mendatang • ${activeModalDay.dayOfWeek}, ${activeModalDay.dateStr} (${convertWibTimeToCurrent("09:30")} ${timezone})`
                  : "Jadwal Mendatang"}
              </span>
            </div>

            {/* Session Items from Supabase with Live Session Countdown */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-xs text-[#615d59] dark:text-[#94a3b8] uppercase tracking-wider">
                Rincian Sesi & Kegiatan ({timezone}):
              </h5>

              {activeModalDay.sessions && activeModalDay.sessions.length > 0 ? (
                activeModalDay.sessions.map((ses, sIdx) => {
                  const sesCountdown = computeSessionCountdown(activeModalDay.dateStr, ses.time, nowTime)
                  return (
                    <div
                      key={sIdx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-[12px] bg-[#f6f5f4] dark:bg-[#101520] p-3.5 border border-[#e6e6e6] dark:border-white/10 gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#007aff] dark:text-[#60a5fa] bg-[#007aff]/15 px-2.5 py-0.5 rounded-full border border-[#007aff]/30">
                            {convertTimeRange(ses.time)}
                          </span>
                          {sesCountdown && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${sesCountdown.badgeClass}`}>
                              {sesCountdown.label}
                            </span>
                          )}
                        </div>
                        <h6 className="font-bold text-sm text-[#000000] dark:text-white">{ses.title}</h6>
                        {ses.instructor && (
                          <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
                            Pengampu: <strong className="text-[#000000] dark:text-white font-semibold">{ses.instructor}</strong>
                          </p>
                        )}
                        {ses.room && (
                          <p className="text-[11px] text-[#615d59] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#615d59]" strokeWidth={2} />
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
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                          >
                            <Video className="h-3.5 w-3.5" strokeWidth={2} />
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
                          className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1f283a] px-3 py-1.5 text-xs font-semibold text-[#000000] dark:text-white border border-[#e6e6e6] dark:border-white/10 hover:bg-black/5 dark:hover:bg-[#28354d] transition shadow-2xs"
                          title="Simpan ke Google Calendar"
                        >
                          <Calendar className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
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
                          className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1f283a] px-3 py-1.5 text-xs font-semibold text-[#000000] dark:text-white border border-[#e6e6e6] dark:border-white/10 hover:bg-black/5 dark:hover:bg-[#28354d] transition shadow-2xs cursor-pointer"
                          title="Unduh file .ics (Apple / Outlook)"
                        >
                          <Download className="h-3.5 w-3.5 text-[#34c759]" strokeWidth={2} />
                          <span>.ICS</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-5 text-center space-y-1.5 rounded-[12px] bg-[#f6f5f4] dark:bg-[#101520] border border-dashed border-[#e6e6e6] dark:border-white/10">
                  <p className="text-xs font-bold text-[#000000] dark:text-white">Belum ada kegiatan manual untuk Hari ke-{activeModalDay.dayNumber}</p>
                  <p className="text-[11px] text-[#615d59]">
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
