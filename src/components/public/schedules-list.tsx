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
import { getAutoRoadmapData, RoadmapDayDetail } from "@/lib/roadmap-utils"

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

export function SchedulesList({ schedules = [] }: { schedules?: ScheduleItem[] }) {
  const [activeDayOverride, setActiveDayOverride] = React.useState<number>(3)
  const [selectedStage, setSelectedStage] = React.useState<number>(0)
  const [activeModalDay, setActiveModalDay] = React.useState<RoadmapDayDetail | null>(null)
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  // Automatic calculation based on 35 days + Live manual sessions from Supabase
  const { days, summary } = React.useMemo(
    () => getAutoRoadmapData(activeDayOverride, schedules),
    [activeDayOverride, schedules]
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-[36px] bg-white p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF7643] animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-[#FF7643]">
                Roadmap 35 Hari Diklat Fungsional
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#18181B] tracking-tight">
              Jadwal 35 Hari Pelatihan
            </h2>
            <p className="text-xs sm:text-sm text-[#52647C] leading-relaxed">
              Struktur lengkap 35 hari perkuliahan Pranata Komputer Kejaksaan RI. Isi kegiatan dan modul disinkronkan langsung dari data manual pengurus di Supabase.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-4 rounded-3xl border-2 border-slate-200 self-start lg:self-auto">
            <div className="text-center px-3">
              <div className="text-2xl font-black text-[#18181B]">{summary.completedDays}</div>
              <div className="text-[10px] font-bold uppercase text-[#0D824B]">Selesai</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-2xl font-black text-[#FF7643]">Hari {summary.currentDayNumber}</div>
              <div className="text-[10px] font-bold uppercase text-[#FF7643]">Hari Ini</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-2xl font-black text-[#18181B]">{summary.totalDays - summary.completedDays}</div>
              <div className="text-[10px] font-bold uppercase text-[#6B7C93]">Tersisa</div>
            </div>
          </div>
        </div>

        {/* Filter Stage Tabs & Search */}
        <div className="pt-4 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {stageCategories.map((tab) => {
              const isSelected = selectedStage === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStage(tab.id)}
                  className={`rounded-full px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#18181B] text-white shadow-md scale-102"
                      : "bg-[#F4F6FA] text-[#52647C] hover:bg-slate-200 hover:text-[#18181B]"
                  }`}
                >
                  {tab.name}
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hari / tanggal / sesi..."
              className="h-10 w-full rounded-full border-2 border-slate-200 bg-white pl-10 pr-4 text-xs font-bold text-[#18181B] placeholder-[#9AA8BA] focus:border-[#18181B] focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Structured 35 Days Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg sm:text-xl font-black text-[#18181B]">
            Daftar 35 Hari Pelatihan ({filteredDays.length} Hari Ditampilkan)
          </h3>
          <span className="text-xs font-bold text-[#6B7C93]">
            Klik kartu untuk rincian sesi & link Zoom
          </span>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredDays.map((item) => {
            const isCompleted = item.status === "completed"
            const isCurrent = item.status === "in_progress"

            let headerBg = "bg-[#F4F6FA] text-[#52647C]"
            if (item.stageNumber === 1) headerBg = "bg-[#D7F3FE] text-[#0369A1]"
            if (item.stageNumber === 2) headerBg = "bg-[#E6F7ED] text-[#0D824B]"
            if (item.stageNumber === 3) headerBg = "bg-[#FFE3EB] text-[#E11D48]"
            if (item.stageNumber === 4) headerBg = "bg-[#FFF2D1] text-[#B47D00]"

            return (
              <motion.div
                key={item.dayNumber}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModalDay(item)}
                className={`group cursor-pointer rounded-2xl bg-white border-2 overflow-hidden flex flex-col justify-between transition-all ${
                  isCurrent
                    ? "border-[#FF7643] ring-4 ring-[#FF7643]/15 shadow-lg"
                    : isCompleted
                    ? "border-slate-200 hover:border-[#0D824B] shadow-xs hover:shadow-md"
                    : "border-slate-200 hover:border-[#18181B] shadow-xs hover:shadow-md"
                }`}
              >
                {/* Window Header */}
                <div className={`flex items-center justify-between px-3.5 py-2 border-b-2 border-slate-200 ${headerBg}`}>
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    <span>Hari {item.dayNumber}</span>
                    <span>•</span>
                    <span className="text-[11px] font-bold">{item.stageName}</span>
                  </div>
                  <span className="font-mono text-xs font-black text-slate-600">_oX</span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Top Day info + Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h4 className="font-black text-base text-[#18181B] group-hover:text-[#FF7643] transition">
                        Hari ke-{item.dayNumber}
                      </h4>
                      <p className="flex items-center gap-1.5 text-xs text-[#6B7C93] font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-[#8C9BAE]" />
                        <span>{item.dateStr}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xs font-black text-[#18181B] bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.sessions.length} Sesi
                      </span>
                    </div>
                  </div>

                  {/* Sessions Preview (Manual from Supabase) */}
                  <div className="space-y-2">
                    {item.sessions.length > 0 ? (
                      item.sessions.slice(0, 2).map((ses, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-xl bg-[#F8FAFC] p-2.5 border border-slate-200/80 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#0369A1]">
                            <span>{ses.time} WIB</span>
                          </div>
                          <p className="font-bold text-[#18181B] line-clamp-1">
                            {ses.title}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-3 text-center border border-dashed border-slate-200 text-[11px] text-[#8C9BAE]">
                        Belum ada kegiatan manual yang diisi
                      </div>
                    )}
                  </div>

                  {/* Bottom Status Pill */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span
                      className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase ${
                        isCompleted
                          ? "bg-[#E6F7ED] text-[#0D824B]"
                          : isCurrent
                          ? "bg-[#FFEADA] text-[#EA580C]"
                          : "bg-slate-100 text-[#6B7C93]"
                      }`}
                    >
                      {isCompleted
                        ? "Selesai"
                        : isCurrent
                        ? "Sedang Berjalan (Hari Ini)"
                        : "Jadwal Mendatang"}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#8C9BAE] group-hover:text-[#18181B] transition">
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
        <div className="rounded-2xl bg-white p-4 border-2 border-slate-200 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-black text-[#52647C]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#0D824B]" />
            <span>Selesai (Sudah Terlaksana)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF7643]" />
            <span>Sedang Berjalan (Jadwal Hari Ini)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
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
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border-2 border-slate-200">
              <span className="text-xs font-black text-[#18181B]">Status Perkuliahan:</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                  activeModalDay.status === "completed"
                    ? "bg-[#E6F7ED] text-[#0D824B]"
                    : activeModalDay.status === "in_progress"
                    ? "bg-[#FFEADA] text-[#EA580C]"
                    : "bg-slate-100 text-[#64748B]"
                }`}
              >
                {activeModalDay.status === "completed"
                  ? "Selesai"
                  : activeModalDay.status === "in_progress"
                  ? "Sedang Berjalan Hari Ini"
                  : "Jadwal Mendatang"}
              </span>
            </div>

            {/* Session Items from Supabase */}
            <div className="space-y-3">
              <h5 className="font-black text-xs text-[#8C9BAE] uppercase tracking-wider">
                Rincian Sesi & Kegiatan:
              </h5>

              {activeModalDay.sessions && activeModalDay.sessions.length > 0 ? (
                activeModalDay.sessions.map((ses, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 border-2 border-slate-200/80 gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-black text-[#0369A1] bg-[#D7F3FE] px-2 py-0.5 rounded-md">
                        {ses.time} WIB
                      </span>
                      <h6 className="font-black text-sm text-[#18181B] mt-1">{ses.title}</h6>
                      {ses.instructor && (
                        <p className="text-xs text-[#6B7C93]">
                          Pengampu: <strong>{ses.instructor}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {ses.zoomUrl && (
                        <a href={ses.zoomUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="primary" size="sm" icon={<Video className="h-3.5 w-3.5" />}>
                            Masuk Ruang Diklat (LMS)
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center space-y-2 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
                  <p className="text-xs font-bold text-[#18181B]">Belum ada kegiatan manual untuk Hari ke-{activeModalDay.dayNumber}</p>
                  <p className="text-[11px] text-[#6B7C93]">
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
