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
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  LayoutGrid,
  List,
  X,
} from "lucide-react"
import { DEFAULT_BATCH4_SCHEDULES } from "@/data/batch4/schedules-data"
import { useTimezone } from "@/components/timezone-provider"
import { ZoomClassAccess } from "@/components/public/zoom-class-access"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"
import {
  getScheduleDayNumber,
  getItemBatch,
  getAutoRoadmapData,
  RoadmapDayDetail,
  parseTimeToMins,
  getScheduleDate,
  formatIndonesianDate,
} from "@/lib/roadmap-utils"
import { Modal } from "@/components/ui/modal"

export interface SchedulesListB4Props {
  initialSchedules?: any[]
}

export function SchedulesListB4({ initialSchedules = [] }: SchedulesListB4Props) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStage, setSelectedStage] = React.useState<number>(0) // 0 = Semua, 1 = MOOC, 2 = TMO, 3 = Lab, 4 = Seminar
  const [viewMode, setViewMode] = React.useState<"list" | "roadmap">("list")
  const [activeModalDay, setActiveModalDay] = React.useState<RoadmapDayDetail | null>(null)
  const { timezone, setTimezone, convertWibTimeToCurrent } = useTimezone()

  const [liveSchedules, setLiveSchedules] = React.useState<any[]>(() => {
    if (initialSchedules && initialSchedules.length > 0) return initialSchedules
    return DEFAULT_BATCH4_SCHEDULES as any[]
  })

  // Synchronize with props and fetch latest client-side
  React.useEffect(() => {
    if (initialSchedules && initialSchedules.length > 0) {
      setLiveSchedules(initialSchedules)
    }

    try {
      const supabase = createBrowserSupabaseClient()
      supabase
        .from("schedules")
        .select("*")
        .order("start_time", { ascending: true })
        .then(({ data }) => {
          if (data && data.length > 0) {
            const b4Scheds = data.filter((s) => getItemBatch(s) === "batch-4")
            if (b4Scheds.length > 0) {
              setLiveSchedules(b4Scheds)
            }
          }
        })
    } catch {
      // Offline fallback
    }
  }, [initialSchedules])

  // Hitung jumlah sesi per tahap secara dinamis dari jadwal nyata
  const stages = React.useMemo(() => {
    const totalCount = liveSchedules.length
    const t1 = liveSchedules.filter((s) => {
      const d = getScheduleDayNumber(s)
      return d !== null && d >= 1 && d <= 5
    }).length
    const t2 = liveSchedules.filter((s) => {
      const d = getScheduleDayNumber(s)
      return d !== null && d >= 6 && d <= 15
    }).length
    const t3 = liveSchedules.filter((s) => {
      const d = getScheduleDayNumber(s)
      return d !== null && d >= 16 && d <= 30
    }).length
    const t4 = liveSchedules.filter((s) => {
      const d = getScheduleDayNumber(s)
      return d !== null && d >= 31 && d <= 35
    }).length

    return [
      { id: 0, label: "Semua Sesi", count: totalCount },
      { id: 1, label: "Tahap 1: MOOC (H1-H5)", count: t1 },
      { id: 2, label: "Tahap 2: TMO (H6-H15)", count: t2 },
      { id: 3, label: "Tahap 3: Lab Satker (H16-H30)", count: t3 },
      { id: 4, label: "Tahap 4: Seminar (H31-H35)", count: t4 },
    ]
  }, [liveSchedules])

  // Filter schedules berdasarkan stage dan search
  const filteredSchedules = React.useMemo(() => {
    return liveSchedules
      .filter((sched) => {
        const dayNum = getScheduleDayNumber(sched) || 1

        // Stage filter
        if (selectedStage === 1 && (dayNum < 1 || dayNum > 5)) return false
        if (selectedStage === 2 && (dayNum < 6 || dayNum > 15)) return false
        if (selectedStage === 3 && (dayNum < 16 || dayNum > 30)) return false
        if (selectedStage === 4 && (dayNum < 31 || dayNum > 35)) return false

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesSubject = (sched.subject_name || "").toLowerCase().includes(q)
          const matchesLecturer = (sched.lecturer || "").toLowerCase().includes(q)
          const matchesDay = (sched.day || "").toLowerCase().includes(q) || `hari ${dayNum}`.includes(q)
          const matchesRoom = (sched.room || "").toLowerCase().includes(q)
          return matchesSubject || matchesLecturer || matchesDay || matchesRoom
        }

        return true
      })
      .sort((a, b) => {
        const dayA = getScheduleDayNumber(a) || 1
        const dayB = getScheduleDayNumber(b) || 1
        if (dayA !== dayB) return dayA - dayB
        return (parseTimeToMins(a.start_time) || 0) - (parseTimeToMins(b.start_time) || 0)
      })
  }, [liveSchedules, selectedStage, searchQuery])

  // Roadmap 35 Days Data
  const { days: roadmapDays } = React.useMemo(() => {
    return getAutoRoadmapData(undefined, liveSchedules, "batch-4")
  }, [liveSchedules])

  const filteredRoadmapDays = React.useMemo(() => {
    return roadmapDays.filter((d) => {
      if (selectedStage !== 0 && d.stageNumber !== selectedStage) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesDay = `hari ${d.dayNumber}`.includes(q) || d.stageName.toLowerCase().includes(q)
        const matchesSession = d.sessions.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            (s.instructor && s.instructor.toLowerCase().includes(q))
        )
        return matchesDay || matchesSession
      }
      return true
    })
  }, [roadmapDays, selectedStage, searchQuery])

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* 1. Header Card with Title & Filters */}
      <div className="rounded-[18px] bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-bold shadow-2xs">
                <Calendar className="h-3.5 w-3.5" />
                <span>Roadmap 35 Hari Sesi</span>
              </span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-xs font-bold">
                Agrasena Batch 4
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 text-xs font-semibold">
                {liveSchedules.length} Sesi Terjadwal
              </span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#18181B] dark:text-white">
              Jadwal Lengkap & Rundown Harian Batch 4
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pelajari timeline perkuliahan, narasumber pengampu, pembagian jam JP, dan link tatap muka virtual Zoom tiap angkatan.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-full p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Tampilan Daftar Sesi Rinci"
              >
                <List className="h-3.5 w-3.5" />
                <span>Daftar Sesi</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("roadmap")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === "roadmap"
                    ? "bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Tampilan Kalender 35 Hari"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>35 Hari</span>
              </button>
            </div>

            <a
              href="#zoom-access"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 text-xs font-bold hover:bg-emerald-600 hover:text-white transition cursor-pointer"
            >
              <Video className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Akses Zoom Angkatan 1–6</span>
              <span className="sm:hidden">Zoom</span>
            </a>
          </div>
        </div>

        {/* Search & Timezone Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, pemateri, hari..."
              className="w-full rounded-full bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-1.5 text-xs text-[#18181B] dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          {/* Timezone Switcher Pill */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1">Zona:</span>
            {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
              <button
                key={tz}
                type="button"
                onClick={() => setTimezone(tz)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  timezone === tz
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#18181B] dark:hover:text-white"
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Tabs with accurate live counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {stages.map((stg) => (
            <button
              key={stg.id}
              type="button"
              onClick={() => setSelectedStage(stg.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedStage === stg.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{stg.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedStage === stg.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {stg.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Akses Ruang Zoom Meeting Tiap Angkatan */}
      <div id="zoom-access">
        <ZoomClassAccess batchNum={4} />
      </div>

      {/* 3. TAMPILAN VIEW MODE: LIST ATAU ROADMAP 35 HARI */}
      {viewMode === "roadmap" ? (
        /* ROADMAP 35 DAYS GRID */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
              Kalender Roadmap 35 Hari Batch 4 ({filteredRoadmapDays.length} Hari)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Klik kartu hari untuk rincian sesi & Zoom
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRoadmapDays.map((item) => {
              const hasSess = item.sessions.length > 0
              let stageBadgeColor =
                "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800"
              if (item.stageNumber === 2) {
                stageBadgeColor =
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              } else if (item.stageNumber === 3) {
                stageBadgeColor =
                  "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800"
              } else if (item.stageNumber === 4) {
                stageBadgeColor =
                  "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }

              return (
                <div
                  key={item.dayNumber}
                  onClick={() => setActiveModalDay(item)}
                  className="rounded-[16px] bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 p-3.5 sm:p-4.5 transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageBadgeColor}`}>
                        {item.stageName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
                        <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.dayOfWeek}, {item.dateStr}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-slate-100 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 shrink-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">HARI</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {item.dayNumber}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white truncate">
                          {hasSess ? item.sessions[0].title : item.stageSubtitle}
                        </h4>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {hasSess ? `${item.sessions.length} Sesi Terjadwal` : "Jadwal Mandiri"}
                          </span>
                          {item.isTodayExact && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {hasSess && (
                      <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        {item.sessions.slice(0, 2).map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 truncate">
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold shrink-0">
                              {convertWibTimeToCurrent(s.time.split(" - ")[0])}
                            </span>
                            <span className="truncate">{s.title}</span>
                          </div>
                        ))}
                        {item.sessions.length > 2 && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            +{item.sessions.length - 2} sesi lainnya...
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-2 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Lihat Rundown Hari {item.dayNumber}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* DAFTAR SESI RINCI (CHRONOLOGICAL RUNDOWN) */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
              Daftar Sesi Perkuliahan ({filteredSchedules.length} Sesi)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Sesuai urutan hari & jam tayang
            </span>
          </div>

          {filteredSchedules.length === 0 ? (
            <div className="rounded-[18px] bg-white dark:bg-[#151c28] border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-200 dark:border-emerald-800">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#18181B] dark:text-white">
                Tidak Ditemukan Sesi Jadwal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Tidak ada sesi yang sesuai dengan kriteria pencarian atau filter tahap yang dipilih.
              </p>
            </div>
          ) : (
            filteredSchedules.map((sched) => {
              const dayNum = getScheduleDayNumber(sched) || 1
              const sDate = getScheduleDate(sched)
              const matchedRoadmapDay = roadmapDays.find((d) => d.dayNumber === dayNum)
              const schedDateFormatted = sDate
                ? formatIndonesianDate(sDate, { withDayName: true, shortMonth: true })
                : matchedRoadmapDay
                ? `${matchedRoadmapDay.dayOfWeek}, ${matchedRoadmapDay.dateStr}`
                : sched.day

              // Stage identifier
              let stageBadge = "Tahap 1: MOOC"
              let stageBadgeColor =
                "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800"
              if (dayNum >= 6 && dayNum <= 15) {
                stageBadge = "Tahap 2: TMO Zoom"
                stageBadgeColor =
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              } else if (dayNum >= 16 && dayNum <= 30) {
                stageBadge = "Tahap 3: Lab Satker"
                stageBadgeColor =
                  "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800"
              } else if (dayNum >= 31) {
                stageBadge = "Tahap 4: Seminar"
                stageBadgeColor =
                  "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }

              const startTimeDisplay = convertWibTimeToCurrent(sched.start_time)
              const endTimeDisplay = convertWibTimeToCurrent(sched.end_time)

              const cleanTitle = (sched.subject_name || "")
                .replace(/\[Hari\s*\d+\]\s*/i, "")
                .replace(/\[Batch\s*4\]\s*/i, "")
                .trim()

              return (
                <motion.div
                  key={sched.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-[16px] bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 p-3.5 sm:p-4.5 transition-all hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Day Number Pill */}
                      <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-slate-100 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 text-[#18181B] dark:text-white shrink-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">HARI</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {dayNum}
                        </span>
                      </div>

                      {/* Schedule Content */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageBadgeColor}`}>
                            {stageBadge}
                          </span>
                          
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                            <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{schedDateFormatted}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                            <Clock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{startTimeDisplay} – {endTimeDisplay} {timezone}</span>
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white leading-snug">
                          {cleanTitle || sched.subject_name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{sched.lecturer || "Fasilitator Diklat"}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{sched.room || "Ruang Diklat Virtual"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                      {sched.meeting_link ? (
                        <a
                          href={sched.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold transition cursor-pointer"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Link Zoom</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      ) : (
                        <a
                          href="#zoom-access"
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1 text-[11px] font-semibold hover:border-emerald-500 transition"
                        >
                          <Video className="h-3 w-3 text-emerald-600" />
                          <span>Zoom Angkatan</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}

      {/* 4. MODAL DETAIL HARI (Ketik diklik dari Roadmap 35 Hari) */}
      {activeModalDay && (
        <Modal
          isOpen={!!activeModalDay}
          onClose={() => setActiveModalDay(null)}
          title={`Rincian Jadwal Hari ${activeModalDay.dayNumber} • Agrasena Batch 4`}
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {activeModalDay.stageName} ({activeModalDay.stageSubtitle})
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{activeModalDay.dayOfWeek}, {activeModalDay.dateStr}</span>
              </span>
            </div>

            {activeModalDay.sessions.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Calendar className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Belum ada sesi spesifik yang diinput untuk hari ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {activeModalDay.sessions.map((sess, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#101520] border border-slate-200/80 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {convertWibTimeToCurrent(sess.time.split(" - ")[0])} – {convertWibTimeToCurrent(sess.time.split(" - ")[1])} {timezone}
                        </span>
                        {sess.sessionDateFormatted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-700/60">
                            <Calendar className="h-3 w-3 text-emerald-600" />
                            <span>{sess.sessionDateFormatted}</span>
                          </span>
                        )}
                      </div>
                      {sess.zoomUrl && (
                        <a
                          href={sess.zoomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <Video className="h-3 w-3" />
                          <span>Buka Zoom</span>
                        </a>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white">
                      {sess.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      {sess.instructor && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-emerald-600" />
                          <span>{sess.instructor}</span>
                        </span>
                      )}
                      {sess.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{sess.room}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  )
}
