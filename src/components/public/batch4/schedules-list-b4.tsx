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
  ArrowRight,
  Layers,
  ChevronRight,
  BookOpen,
  Laptop,
  Building2,
  Award,
  Copy,
  Check
} from "lucide-react"
import { DEFAULT_BATCH4_SCHEDULES } from "@/data/batch4/schedules-data"
import { BATCH4_ZOOM_CONFIG } from "@/data/batch4/zoom-config"
import { useTimezone } from "@/components/timezone-provider"

export function SchedulesListB4() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStage, setSelectedStage] = React.useState<number>(0) // 0 = Semua, 1 = MOOC, 2 = TMO, 3 = Lab, 4 = Seminar
  const [copied, setCopied] = React.useState(false)
  const { timezone, setTimezone, convertWibTimeToCurrent } = useTimezone()

  const stages = [
    { id: 0, label: "Semua Sesi", count: 35 },
    { id: 1, label: "Tahap 1: MOOC (H1-H5)", count: 5 },
    { id: 2, label: "Tahap 2: TMO (H6-H15)", count: 10 },
    { id: 3, label: "Tahap 3: Lab Satker (H16-H30)", count: 15 },
    { id: 4, label: "Tahap 4: Seminar (H31-H35)", count: 5 },
  ]

  // Filter schedules berdasarkan stage dan search
  const filteredSchedules = React.useMemo(() => {
    return DEFAULT_BATCH4_SCHEDULES.filter((sched, index) => {
      const dayNum = index + 1

      // Stage filter
      if (selectedStage === 1 && (dayNum < 1 || dayNum > 5)) return false
      if (selectedStage === 2 && (dayNum < 6 || dayNum > 15)) return false
      if (selectedStage === 3 && (dayNum < 16 || dayNum > 30)) return false
      if (selectedStage === 4 && (dayNum < 31 || dayNum > 35)) return false

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesSubject = sched.subject_name.toLowerCase().includes(q)
        const matchesLecturer = (sched.lecturer || "").toLowerCase().includes(q)
        const matchesDay = sched.day.toLowerCase().includes(q)
        return matchesSubject || matchesLecturer || matchesDay
      }

      return true
    })
  }, [selectedStage, searchQuery])

  const handleCopyZoom = () => {
    const text = `Zoom Agrasena Batch 4\nMeeting ID: ${BATCH4_ZOOM_CONFIG.meetingId}\nPasscode: ${BATCH4_ZOOM_CONFIG.passcode}\nLink: ${BATCH4_ZOOM_CONFIG.zoomUrl}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header Card with Quick Zoom Credentials */}
      <div className="rounded-[20px] bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3 py-0.5 text-xs font-bold shadow-2xs">
                <Calendar className="h-3.5 w-3.5" />
                <span>Roadmap 35 Hari Sesi</span>
              </span>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-bold">
                Agrasena Batch 4
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#18181B] dark:text-white">
              Jadwal Lengkap & Rundown Harian Batch 4
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pelajari timeline perkuliahan, narasumber pengampu, pembagian jam JP, dan link tatap muka virtual Zoom.
            </p>
          </div>

          {/* Quick Zoom Box */}
          <div className="rounded-xl bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between gap-4 shrink-0">
            <div className="text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Meeting ID Zoom</span>
              <span className="font-mono font-bold text-[#18181B] dark:text-white">{BATCH4_ZOOM_CONFIG.meetingId}</span>
              <span className="text-[10px] text-slate-500 block">Passcode: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{BATCH4_ZOOM_CONFIG.passcode}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyZoom}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2332] text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer"
                title="Salin Kredensial Zoom"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <a
                href={BATCH4_ZOOM_CONFIG.zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs font-bold shadow-xs transition"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Buka Zoom</span>
              </a>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, pemateri, atau hari perkuliahan..."
              className="w-full rounded-full bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2 text-xs text-[#18181B] dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition"
            />
          </div>

          {/* Timezone Switcher Pill */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1">Zona:</span>
            {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
              <button
                key={tz}
                type="button"
                onClick={() => setTimezone(tz)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  timezone === tz
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#18181B] dark:hover:text-white"
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {stages.map((stg) => (
            <button
              key={stg.id}
              type="button"
              onClick={() => setSelectedStage(stg.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedStage === stg.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{stg.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedStage === stg.id ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}>
                {stg.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. List of 35 Days Schedules */}
      <div className="space-y-3">
        {filteredSchedules.length === 0 ? (
          <div className="rounded-[20px] bg-white dark:bg-[#151c28] border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto border border-indigo-200 dark:border-indigo-800">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#18181B] dark:text-white">Belum Ada Sesi Jadwal Agrasena Batch 4</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Jadwal perkuliahan 35 hari untuk angkatan ini sedang dipersiapkan dan akan dipublikasikan oleh Panitia Diklat / Widyaiswara Badiklat Kejaksaan RI. Sesi tatap muka dan link Zoom akan tampil di sini setelah diinput oleh Admin.
            </p>
          </div>
        ) : (
          filteredSchedules.map((sched, idx) => {
            const rawIndex = DEFAULT_BATCH4_SCHEDULES.findIndex((s) => s.id === sched.id)
            const dayNum = rawIndex >= 0 ? rawIndex + 1 : idx + 1

            // Stage identifier
            let stageBadge = "Tahap 1: MOOC"
            let stageBadgeColor = "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800"
            if (dayNum >= 6 && dayNum <= 15) {
              stageBadge = "Tahap 2: TMO Zoom"
              stageBadgeColor = "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
            } else if (dayNum >= 16 && dayNum <= 30) {
              stageBadge = "Tahap 3: Lab Satker"
              stageBadgeColor = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
            } else if (dayNum >= 31) {
              stageBadge = "Tahap 4: Seminar"
              stageBadgeColor = "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800"
            }

            const startTimeDisplay = convertWibTimeToCurrent(sched.start_time)
            const endTimeDisplay = convertWibTimeToCurrent(sched.end_time)

            return (
              <motion.div
                key={sched.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="rounded-[16px] bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 p-4 sm:p-5 transition-all hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Day Number Pill */}
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-slate-100 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 text-[#18181B] dark:text-white shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">HARI</span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{dayNum}</span>
                    </div>

                    {/* Schedule Content */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageBadgeColor}`}>
                          {stageBadge}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {sched.day}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          <Clock className="h-3 w-3" />
                          <span>{startTimeDisplay} – {endTimeDisplay} {timezone}</span>
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white leading-snug">
                        {sched.subject_name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{sched.lecturer || "Fasilitator Diklat"}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{sched.room || "Ruang Kelas Virtual"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                    <a
                      href={sched.meeting_link || BATCH4_ZOOM_CONFIG.zoomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Link Zoom</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

    </div>
  )
}
