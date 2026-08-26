'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Plus } from "lucide-react"

interface ScheduleItem {
  id: string
  day: string
  subject: string
  time: string
  room: string
  teacher: string
  color: string
}

const SCHEDULE_DATA: { [day: string]: ScheduleItem[] } = {
  Senin: [
    { id: "1", day: "Senin", subject: "Matematika Wajib", time: "07:30 - 09:00", room: "Ruang X-1", teacher: "Drs. Bambang S.", color: "border-indigo-500/30 bg-indigo-500/10" },
    { id: "2", day: "Senin", subject: "Bahasa Indonesia", time: "09:15 - 10:45", room: "Ruang X-1", teacher: "Siti Nurhaliza, M.Pd", color: "border-cyan-500/30 bg-cyan-500/10" },
    { id: "3", day: "Senin", subject: "Pendidikan Agama", time: "11:00 - 12:30", room: "Ruang X-1", teacher: "Ust. Ahmad Syakir", color: "border-emerald-500/30 bg-emerald-500/10" },
  ],
  Selasa: [
    { id: "4", day: "Selasa", subject: "Fisika Dasar", time: "07:30 - 09:45", room: "Lab Fisika", teacher: "Ir. Hendra Wijaya", color: "border-purple-500/30 bg-purple-500/10" },
    { id: "5", day: "Selasa", subject: "Bahasa Inggris", time: "10:00 - 11:30", room: "Ruang X-1", teacher: "Sarah Jenkins, B.A", color: "border-amber-500/30 bg-amber-500/10" },
  ],
  Rabu: [
    { id: "6", day: "Rabu", subject: "Kimia Organik", time: "07:30 - 09:00", room: "Lab Kimia", teacher: "Dr. Ratna Dewi", color: "border-red-500/30 bg-red-500/10" },
    { id: "7", day: "Rabu", subject: "Biologi Sel", time: "09:15 - 10:45", room: "Lab Biologi", teacher: "Sri Wahyuni, M.Si", color: "border-emerald-500/30 bg-emerald-500/10" },
    { id: "8", day: "Rabu", subject: "Sejarah Indonesia", time: "11:00 - 12:30", room: "Ruang X-1", teacher: "Agus Santoso, S.Pd", color: "border-amber-500/30 bg-amber-500/10" },
  ],
  Kamis: [
    { id: "9", day: "Kamis", subject: "Teknologi Informasi (TIK)", time: "07:30 - 09:45", room: "Lab Komputer 2", teacher: "Rian Pratama, S.Kom", color: "border-cyan-500/30 bg-cyan-500/10" },
    { id: "10", day: "Kamis", subject: "Seni Budaya & Prakarya", time: "10:00 - 11:30", room: "Ruang Kesenian", teacher: "Dewi Lestari, S.Sn", color: "border-purple-500/30 bg-purple-500/10" },
  ],
  Jumat: [
    { id: "11", day: "Jumat", subject: "Pendidikan Jasmani (PJOK)", time: "07:00 - 08:30", room: "Lapangan Olahraga", teacher: "Coach Ridwan, S.Pd", color: "border-emerald-500/30 bg-emerald-500/10" },
    { id: "12", day: "Jumat", subject: "Bimbingan Konseling (BK)", time: "08:45 - 10:00", room: "Ruang X-1", teacher: "Hj. Nurul Aini, S.Psi", color: "border-indigo-500/30 bg-indigo-500/10" },
  ],
}

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = React.useState("X IPA 1")
  const [activeDay, setActiveDay] = React.useState<string>("Senin")

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="info" dot>
            Kalender Akademik
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Jadwal Mata Pelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Jadwal tatap muka harian, ruang kelas, dan guru pengajar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2 text-xs font-semibold text-slate-200 focus:border-indigo-500/60 focus:outline-none"
          >
            <option value="X IPA 1">X IPA 1</option>
            <option value="XI IPA 2">XI IPA 2</option>
            <option value="XII IPS 1">XII IPS 1</option>
          </select>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
        {days.map((day) => {
          const isActive = activeDay === day
          const itemCount = SCHEDULE_DATA[day]?.length || 0
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                  : "bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-200"
              }`}
            >
              <span>{day}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                {itemCount} Sesi
              </span>
            </button>
          )
        })}
      </div>

      {/* Schedule Slices for Selected Day */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE_DATA[activeDay]?.map((item, idx) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="purple" dot>
                  Sesi #{idx + 1}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <Clock className="h-3 w-3 text-indigo-400" />
                  {item.time}
                </span>
              </div>
              <CardTitle className="mt-2 text-base">{item.subject}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>{item.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{item.teacher}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
