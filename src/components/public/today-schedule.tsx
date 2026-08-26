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

  const activeClass = list[selectedIndex] || list[0]

  const timePills = [
    { label: "09 am", index: 0, color: "bg-[#FFF4D6] text-[#B47D00] border-[#FFE7A3]" },
    { label: "11 am", index: 1, color: "bg-[#E6F7ED] text-[#0D824B] border-[#B9ECCE]" },
    { label: "12 am", index: 2, color: "bg-[#E8F2FE] text-[#2563EB] border-[#BFDBFE]" },
  ]

  return (
    <div id="schedule" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left 2 Cols: Todays Schedule Timeline */}
      <div className="lg:col-span-2 rounded-[32px] bg-white p-6 soft-card-shadow border border-slate-100/90 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg text-[#131E29]">Jadwal Kuliah Hari Ini</h4>
            <span className="rounded-full bg-[#E6F7ED] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0D824B]">
              Realtime
            </span>
          </div>
          <button
            onClick={() => setIsAllModalOpen(true)}
            className="text-xs font-bold text-[#6B7C93] hover:text-[#0D3830] transition inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Schedule Rail & Floating Interactive Card */}
        <div className="space-y-4">
          {/* Time Rail Header */}
          <div className="relative flex items-center justify-between px-2 pt-2">
            <div className="absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 bg-slate-100 z-0" />
            
            {timePills.map((pill) => {
              const isSelected = selectedIndex === pill.index
              return (
                <button
                  key={pill.index}
                  onClick={() => setSelectedIndex(pill.index % list.length)}
                  className={`relative z-10 rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer border ${
                    pill.color
                  } ${
                    isSelected
                      ? "ring-2 ring-[#0D3830] ring-offset-2 scale-105 shadow-md"
                      : "opacity-80 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  {pill.label}
                </button>
              )
            })}
          </div>

          {/* Floating Highlight Card */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#F8FAFC] border border-slate-200/70 p-5 shadow-lg shadow-slate-200/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0D3830] text-white shadow-md">
                  <span className="font-extrabold text-sm">
                    {activeClass?.subject_name.substring(0, 2).toUpperCase() || "IT"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-base text-[#131E29]">
                      {activeClass?.subject_name || "Information Technology"}
                    </h5>
                  </div>
                  <p className="text-xs text-[#6B7C93]">
                    {activeClass?.lecturer || "Dr. Irfan Hakim"} • {activeClass?.room || "Lab Komputer 3"}
                  </p>

                  {/* Avatar Group */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {["#FF7643", "#0D3830", "#2563EB", "#7E22CE"].map((c, i) => (
                        <div
                          key={i}
                          style={{ backgroundColor: c }}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-[#6B7C93]">
                      Jam: {activeClass?.start_time} - {activeClass?.end_time} WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {activeClass?.meeting_link ? (
                  <a href={activeClass.meeting_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm" icon={<Video className="h-3.5 w-3.5" />}>
                      Join Kelas
                    </Button>
                  </a>
                ) : (
                  <Button variant="primary" size="sm" icon={<Check className="h-3.5 w-3.5" />}>
                    Hadir di Ruang
                  </Button>
                )}
              </div>
            </div>

            {/* Sub-pills under schedule */}
            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-200/50">
              <span className="rounded-full bg-white px-3 py-0.5 text-[10px] font-bold text-[#131E29] border border-slate-200 shadow-xs">
                Mata Kuliah Wajib
              </span>
              <span className="rounded-full bg-[#FFEADA] px-3 py-0.5 text-[10px] font-bold text-[#EA580C]">
                {activeClass?.day || "Rabu"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Last 20 Days Progress Card */}
      <div className="rounded-[32px] bg-white p-6 soft-card-shadow border border-slate-100/90 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-[#131E29]">Aktivitas 20 Hari</h4>
            <span className="text-xs font-bold text-[#0D824B] bg-[#E6F7ED] px-2.5 py-0.5 rounded-full">
              98% Sukses
            </span>
          </div>

          {/* Large Circular Gauge */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#0D3830]"
                  strokeDasharray="80, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#FF7643]"
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
                <span className="text-3xl font-extrabold text-[#131E29]">50</span>
                <p className="text-[10px] font-semibold text-[#8C9BAE] uppercase tracking-wider">
                  Tugas Selesai
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Software / Subject Badges */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2 text-xs font-bold text-[#131E29]">
            <span className="h-2 w-2 rounded-full bg-[#FF7643]" />
            <span>Next.js Web</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2 text-xs font-bold text-[#131E29]">
            <span className="h-2 w-2 rounded-full bg-[#0D3830]" />
            <span>Python AI</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2 text-xs font-bold text-[#131E29]">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
            <span>PostgreSQL</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2 text-xs font-bold text-[#131E29]">
            <span className="h-2 w-2 rounded-full bg-[#7E22CE]" />
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
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {list.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 border border-slate-200/70 gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#0D3830] px-2 py-0.5 text-[10px] font-bold text-white">
                    {item.day}
                  </span>
                  <h5 className="font-bold text-sm text-[#131E29]">{item.subject_name}</h5>
                </div>
                <p className="text-xs text-[#6B7C93]">
                  {item.lecturer} • {item.room}
                </p>
                <p className="text-[11px] font-mono text-[#0D824B] font-semibold">
                  {item.start_time} - {item.end_time} WIB
                </p>
              </div>

              {item.meeting_link && (
                <a href={item.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" icon={<Video className="h-3.5 w-3.5" />}>
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
