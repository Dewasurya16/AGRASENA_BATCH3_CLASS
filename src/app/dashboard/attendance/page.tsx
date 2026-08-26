'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Save,
  Users,
  Sparkles
} from "lucide-react"

type StatusType = "hadir" | "izin" | "sakit" | "alpa"

interface StudentAttendance {
  id: string
  nisn: string
  name: string
  gender: "L" | "P"
  status: StatusType
  note: string
}

const INITIAL_STUDENTS: StudentAttendance[] = [
  { id: "1", nisn: "0081234501", name: "Achmad Fadillah", gender: "L", status: "hadir", note: "" },
  { id: "2", nisn: "0081234502", name: "Aisyah Putri Rahmadani", gender: "P", status: "hadir", note: "" },
  { id: "3", nisn: "0081234503", name: "Bagus Pratama", gender: "L", status: "izin", note: "Lomba olimpiade matematika" },
  { id: "4", nisn: "0081234504", name: "Citra Dewi Anggraini", gender: "P", status: "hadir", note: "" },
  { id: "5", nisn: "0081234505", name: "Daffa Al-Ghifari", gender: "L", status: "sakit", note: "Demam berdarah" },
  { id: "6", nisn: "0081234506", name: "Eka Nur Fitriani", gender: "P", status: "hadir", note: "" },
  { id: "7", nisn: "0081234507", name: "Fajar Hidayat", gender: "L", status: "hadir", note: "" },
  { id: "8", nisn: "0081234508", name: "Gita Safitri", gender: "P", status: "hadir", note: "" },
  { id: "9", nisn: "0081234509", name: "Hafiz Muhammad", gender: "L", status: "hadir", note: "" },
  { id: "10", nisn: "0081234510", name: "Indah Permatasari", gender: "P", status: "alpa", note: "Tanpa keterangan" },
]

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = React.useState("X IPA 1")
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = React.useState<StudentAttendance[]>(INITIAL_STUDENTS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [savedSuccess, setSavedSuccess] = React.useState(false)

  const handleStatusChange = (id: string, status: StatusType) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, status } : s))
    )
    setSavedSuccess(false)
  }

  const handleSetAllHadir = () => {
    setStudents(students.map((s) => ({ ...s, status: "hadir" })))
    setSavedSuccess(false)
  }

  const handleSaveAttendance = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  // Summary counts
  const totalStudents = students.length
  const hadirCount = students.filter((s) => s.status === "hadir").length
  const izinCount = students.filter((s) => s.status === "izin").length
  const sakitCount = students.filter((s) => s.status === "sakit").length
  const alpaCount = students.filter((s) => s.status === "alpa").length
  const attendanceRate = Math.round((hadirCount / totalStudents) * 100)

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="success" dot>
            Presensi Realtime
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Absensi & Kehadiran Digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Catat dan pantau kehadiran siswa per kelas secara real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSetAllHadir}
            variant="secondary"
            size="md"
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          >
            Set Semua Hadir
          </Button>

          <Button
            onClick={handleSaveAttendance}
            variant="primary"
            size="md"
            icon={<Save className="h-4 w-4" />}
          >
            Simpan Absensi
          </Button>
        </div>
      </div>

      {/* Filter Row & Summary Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Pilih Kelas
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none"
                >
                  <option value="X IPA 1">X IPA 1 - Matematika Wajib</option>
                  <option value="XI IPA 2">XI IPA 2 - Fisika Dasar</option>
                  <option value="XII IPS 1">XII IPS 1 - Ekonomi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tanggal Presensi
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Cari Siswa
                </label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nama / NISN..."
                  icon={<Search className="h-4 w-4 text-slate-400" />}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Rate Mini Box */}
        <Card className="p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Tingkat Hadir</span>
            <Badge variant="success" dot>
              {attendanceRate}%
            </Badge>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Hadir: {hadirCount}</span>
            <span>Izin: {izinCount}</span>
            <span>Sakit: {sakitCount}</span>
            <span>Alpa: {alpaCount}</span>
          </div>
        </Card>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 shadow-lg animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Data presensi berhasil disimpan ke Supabase database.</span>
        </div>
      )}

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kehadiran Siswa - {selectedClass}</CardTitle>
          <CardDescription>Pilih status kehadiran untuk setiap siswa terdaftar</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">No</th>
                  <th className="py-3 px-4 font-semibold">NISN</th>
                  <th className="py-3 px-4 font-semibold">Nama Siswa</th>
                  <th className="py-3 px-4 font-semibold">L/P</th>
                  <th className="py-3 px-4 font-semibold text-center">Status Kehadiran</th>
                  <th className="py-3 px-4 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{student.nisn}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{student.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{student.gender}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {[
                          { key: "hadir", label: "Hadir", color: "hover:bg-emerald-500/20 text-emerald-400 active:bg-emerald-500/30" },
                          { key: "izin", label: "Izin", color: "hover:bg-amber-500/20 text-amber-400 active:bg-amber-500/30" },
                          { key: "sakit", label: "Sakit", color: "hover:bg-cyan-500/20 text-cyan-400 active:bg-cyan-500/30" },
                          { key: "alpa", label: "Alpa", color: "hover:bg-red-500/20 text-red-400 active:bg-red-500/30" },
                        ].map((btn) => {
                          const isSelected = student.status === btn.key
                          return (
                            <button
                              key={btn.key}
                              type="button"
                              onClick={() => handleStatusChange(student.id, btn.key as StatusType)}
                              className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
                                isSelected
                                  ? btn.key === "hadir"
                                    ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                                    : btn.key === "izin"
                                    ? "bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                                    : btn.key === "sakit"
                                    ? "bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                                    : "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                                  : "bg-white/[0.04] text-slate-400 border border-white/[0.05]"
                              }`}
                            >
                              {btn.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {student.note ? (
                        <span className="italic text-slate-300">{student.note}</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
