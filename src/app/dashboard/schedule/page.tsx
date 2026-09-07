'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, User, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ScheduleItem {
  id: string
  day: string
  subject: string
  time: string
  room: string
  teacher: string
  zoomLink?: string
  color: string
}

const SCHEDULE_DATA: { [day: string]: ScheduleItem[] } = {
  Senin: [
    { id: "1", day: "Senin", subject: "Building Learning Commitment (BLC)", time: "09:30 - 10:15 WIB", room: "Zoom Meeting Utama", teacher: "Tiyar Tunjungsari, S.Kom., M.T.I.", zoomLink: "https://zoom.us", color: "border-indigo-500/30 bg-indigo-500/10" },
    { id: "2", day: "Senin", subject: "PRE TEST MOOC Pusdiklat BPS", time: "13:00 - 13:45 WIB", room: "Portal MOOC Pusdiklat BPS", teacher: "Tim Evaluasi Pusdiklat BPS", zoomLink: "https://mooc.bps.go.id", color: "border-cyan-500/30 bg-cyan-500/10" },
  ],
  Selasa: [
    { id: "3", day: "Selasa", subject: "Tata Kelola SPBE & Perpres No. 95/2018", time: "08:00 - 11:30 WIB", room: "Zoom Room A (SPBE)", teacher: "Widyaiswara Pusdaskrimti Kejaksaan RI", zoomLink: "https://zoom.us", color: "border-purple-500/30 bg-purple-500/10" },
    { id: "4", day: "Selasa", subject: "Arsitektur Enterprise & Interoperabilitas Data", time: "13:00 - 15:30 WIB", room: "Zoom Room A (SPBE)", teacher: "Widyaiswara Ahli Madya BPS", zoomLink: "https://zoom.us", color: "border-amber-500/30 bg-amber-500/10" },
  ],
  Rabu: [
    { id: "5", day: "Rabu", subject: "Manajemen Basis Data & SQL Query Tuning", time: "08:00 - 11:30 WIB", room: "Zoom Room B (Database)", teacher: "Tim Pengampu Basis Data BPS", zoomLink: "https://zoom.us", color: "border-emerald-500/30 bg-emerald-500/10" },
    { id: "6", day: "Rabu", subject: "Praktik Replikasi Data Perkara CMS & DDL", time: "13:00 - 15:30 WIB", room: "Lab Virtual TIK Satker", teacher: "Fasilitator Lab TIK", zoomLink: "https://zoom.us", color: "border-cyan-500/30 bg-cyan-500/10" },
  ],
  Kamis: [
    { id: "7", day: "Kamis", subject: "Infrastruktur Jaringan & Server Linux Kejaksaan", time: "08:00 - 11:30 WIB", room: "Zoom Room C (Infrastruktur)", teacher: "Narasumber Pusdaskrimti", zoomLink: "https://zoom.us", color: "border-indigo-500/30 bg-indigo-500/10" },
    { id: "8", day: "Kamis", subject: "Keamanan Siber CSIRT & Penanganan Insiden", time: "13:00 - 15:30 WIB", room: "Zoom Room C (Keamanan)", teacher: "Tim CSIRT Kejaksaan RI", zoomLink: "https://zoom.us", color: "border-red-500/30 bg-red-500/10" },
  ],
  Jumat: [
    { id: "9", day: "Jumat", subject: "Penyusunan DUPAK & SKP PermenPAN-RB 1/2023", time: "08:00 - 11:00 WIB", room: "Zoom Room Utama", teacher: "Tim Pembina Fungsional BPS", zoomLink: "https://zoom.us", color: "border-emerald-500/30 bg-emerald-500/10" },
    { id: "10", day: "Jumat", subject: "Evaluasi Mingguan & Coaching Aksi Perubahan", time: "13:30 - 15:00 WIB", room: "Breakout Room Per Regional", teacher: "Coach / Widyaiswara Pendamping", zoomLink: "https://zoom.us", color: "border-amber-500/30 bg-amber-500/10" },
  ],
}

export default function SchedulePage() {
  const [selectedGroup, setSelectedGroup] = React.useState("Semua Kelompok")
  const [activeDay, setActiveDay] = React.useState<string>("Senin")

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="info" dot>
            Rundown Perkuliahan
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Jadwal Sesi Perkuliahan Zoom
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Jadwal tatap muka daring, mata pelatihan 120 JP, dan widyaiswara pengampu Diklat Prakom Batch 3
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/schedules">
            <Button
              variant="secondary"
              size="md"
              icon={<ExternalLink className="h-4 w-4 text-indigo-400" />}
            >
              Lihat Roadmap 35 Hari
            </Button>
          </Link>
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
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                  : "bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-200"
              }`}
            >
              <span>{day}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                {itemCount} Sesi
              </span>
            </button>
          )
        })}
      </div>

      {/* Schedule Slices for Selected Day */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
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

            <CardContent className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Video className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>{item.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{item.teacher}</span>
              </div>

              {item.zoomLink && (
                <div className="pt-2 border-t border-white/[0.05]">
                  <a
                    href={item.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>Masuk ke Tautan Sesi</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
