'use client'

import * as React from "react"
import { Users, Video, Clock, MapPin, User, ArrowRight, Calendar, Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"

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

const DEFAULT_SCHEDULES: ScheduleItem[] = [
  {
    id: "sch-1",
    subject_name: "Information Technology",
    day: "Rabu",
    start_time: "09:00",
    end_time: "11:00",
    lecturer: "Dr. Irfan Hakim",
    room: "Lab Komputer 3 (Gedung B)",
    meeting_link: "https://zoom.us/j/1234567890",
  },
  {
    id: "sch-2",
    subject_name: "Machine Learning & AI",
    day: "Rabu",
    start_time: "11:00",
    end_time: "13:00",
    lecturer: "Prof. Dian Puspitasari",
    room: "Ruang Teori 402",
    meeting_link: null,
  },
  {
    id: "sch-3",
    subject_name: "UI/UX & Frontend Architecture",
    day: "Rabu",
    start_time: "14:00",
    end_time: "16:30",
    lecturer: "Bambang Sudarsono, M.Kom",
    room: "Lab Multimedia Lt. 3",
    meeting_link: "https://meet.google.com/abc-defg-hij",
  },
]

export function TodaySchedule({ schedules }: { schedules?: ScheduleItem[] }) {
  const list = schedules && schedules.length > 0 ? schedules : DEFAULT_SCHEDULES
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isAllModalOpen, setIsAllModalOpen] = React.useState(false)
  const [nowTime, setNowTime] = React.useState<number>(Date.now())

  React.useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeClass = list[selectedIndex] || list[0]

  const sessionCountdown = React.useMemo(() => {
    if (!activeClass?.start_time) return null
    const now = new Date(nowTime)
    const currentMins = now.getHours() * 60 + now.getMinutes()
    const currentSecs = now.getSeconds()

    const parseM = (t: string) => {
      const match = t.match(/^(\d{1,2}):(\d{2})/)
      return match ? parseInt(match[1], 10) * 60 + parseInt(match[2], 10) : 0
    }

    const startM = parseM(activeClass.start_time)
    const endM = parseM(activeClass.end_time) || (startM + 90)

    if (currentMins >= endM) {
      return { label: "✅ Selesai", color: "text-slate-500 bg-slate-100 dark:bg-slate-800" }
    }
    if (currentMins >= startM && currentMins < endM) {
      const rem = endM - currentMins
      return { label: `🟢 Sesi Aktif (${rem}m lagi)`, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/80 animate-pulse" }
    }

    const remMins = startM - currentMins - 1
    const remSecs = 60 - currentSecs
    const remH = Math.floor(remMins / 60)
    const m = remMins % 60
    return {
      label: `⏳ Mulai dalam ${remH > 0 ? `${remH}j ` : ''}${m}m ${remSecs}d`,
      color: "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 font-mono font-bold",
    }
  }, [activeClass, nowTime])

  const timePills = [
    { label: "09 am", index: 0, color: "bg-[#FFF4D6] text-[#B47D00] border-[#FFE7A3]" },
    { label: "11 am", index: 1, color: "bg-[#E6F7ED] text-[#0D824B] border-[#B9ECCE]" },
    { label: "12 am", index: 2, color: "bg-[#E8F2FE] text-[#2563EB] border-[#BFDBFE]" },
  ]

  return (
    <div id="schedule" className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Left 2 Cols: Todays Schedule Timeline */}
      <div className="lg:col-span-2 rounded-[14px] bg-white dark:bg-[#1B2130] p-5 sm:p-6 border border-slate-200/90 dark:border-[#2A3550] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">Jadwal Kuliah Hari Ini</h4>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Realtime
            </span>
          </div>
          <button
            onClick={() => setIsAllModalOpen(true)}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Schedule Rail & Floating Interactive Card */}
        <div className="space-y-3.5">
          {/* Time Rail Header */}
          <div className="relative flex items-center justify-between px-2 pt-1">
            <div className="absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 bg-slate-100 dark:bg-[#2A3550] z-0" />
            
            {timePills.map((pill) => {
              const isSelected = selectedIndex === pill.index
              return (
                <button
                  key={pill.index}
                  onClick={() => setSelectedIndex(pill.index % list.length)}
                  className={`relative z-10 rounded-full px-3 py-0.5 text-xs font-bold transition-all cursor-pointer border ${
                    pill.color
                  } ${
                    isSelected
                      ? "ring-2 ring-slate-900 dark:ring-indigo-500 scale-105 shadow-2xs"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {pill.label}
                </button>
              )
            })}
          </div>

          {/* Floating Highlight Card */}
          <div className="relative overflow-hidden rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] p-4 shadow-2xs transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs">
                  <span className="font-black text-xs">
                    {activeClass?.subject_name.substring(0, 2).toUpperCase() || "IT"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {activeClass?.subject_name || "Information Technology"}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeClass?.lecturer || "Dr. Irfan Hakim"} • {activeClass?.room || "Lab Komputer 3"}
                  </p>

                  {/* Avatar Group + Live Time Countdown */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {["#FF7643", "#0D3830", "#2563EB", "#7E22CE"].map((c, i) => (
                        <div
                          key={i}
                          style={{ backgroundColor: c }}
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-[#161B26] text-[8px] font-bold text-white flex items-center justify-center"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Jam: {activeClass?.start_time} - {activeClass?.end_time} WIB
                    </span>
                    {sessionCountdown && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${sessionCountdown.color}`}>
                        {sessionCountdown.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {activeClass?.meeting_link ? (
                  <a href={activeClass.meeting_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm" className="rounded-[8px] text-xs font-bold" icon={<Video className="h-3.5 w-3.5" />}>
                      Join Kelas
                    </Button>
                  </a>
                ) : (
                  <Button variant="primary" size="sm" className="rounded-[8px] text-xs font-bold" icon={<Check className="h-3.5 w-3.5" />}>
                    Hadir di Ruang
                  </Button>
                )}
              </div>
            </div>

            {/* Sub-pills under schedule */}
            <div className="mt-3 flex flex-wrap gap-1.5 pt-2.5 border-t border-slate-200/60 dark:border-[#2A3550]">
              <span className="rounded-[4px] bg-white dark:bg-[#1B2130] px-2 py-0.5 text-[9px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2A3550]">
                Mata Kuliah Wajib
              </span>
              <span className="rounded-[4px] bg-orange-100 dark:bg-amber-950/80 px-2 py-0.5 text-[9px] font-bold text-orange-700 dark:text-amber-300">
                {activeClass?.day || "Rabu"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Last 20 Days Progress Card */}
      <div className="rounded-[14px] bg-white dark:bg-[#1B2130] p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">Aktivitas 20 Hari</h4>
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-[4px] border border-emerald-200 dark:border-emerald-800">
              98% Sukses
            </span>
          </div>

          {/* Large Circular Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-[#161B26]"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-600 dark:text-emerald-400"
                  strokeDasharray="80, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-orange-500 dark:text-amber-400"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-80"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">50</span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Tugas Selesai
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Software / Subject Badges */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-[#2A3550]">
          <div className="flex items-center gap-1.5 rounded-[6px] bg-slate-50 dark:bg-[#161B26] p-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#2A3550]">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span>Next.js Web</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-[6px] bg-slate-50 dark:bg-[#161B26] p-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#2A3550]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Python AI</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-[6px] bg-slate-50 dark:bg-[#161B26] p-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#2A3550]">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span>PostgreSQL</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-[6px] bg-slate-50 dark:bg-[#161B26] p-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#2A3550]">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            <span>Figma UI/UX</span>
          </div>
        </div>
      </div>

      {/* Modal: Lihat Semua Jadwal Kuliah */}
      <Modal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        title="Daftar Lengkap Jadwal Kuliah"
        description="Jadwal mata kuliah tatap muka dan online sepekan"
        className="max-w-2xl"
      >
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {list.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-[8px] bg-slate-50 dark:bg-[#161B26] p-3 border border-slate-200/80 dark:border-[#2A3550] gap-2.5"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-[4px] bg-slate-900 dark:bg-indigo-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                    {item.day}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{item.subject_name}</h5>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.lecturer} • {item.room}
                </p>
                <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  {item.start_time} - {item.end_time} WIB
                </p>
              </div>

              {item.meeting_link && (
                <a href={item.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" className="rounded-[6px] text-xs font-bold" icon={<Video className="h-3 w-3" />}>
                    Join
                  </Button>
                </a>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
