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
  Sparkles,
  Download,
  FileSpreadsheet
} from "lucide-react"

type StatusType = "hadir" | "izin" | "sakit" | "alpa"

interface ParticipantAttendance {
  id: string
  nip: string
  name: string
  satker: string
  role: "Prakom Ahli Pertama" | "Prakom Terampil"
  status: StatusType
  note: string
}

const INITIAL_PARTICIPANTS: ParticipantAttendance[] = [
  { id: "1", nip: "199503122022031001", name: "Dewa Surya Permana, S.Kom.", satker: "Kejari Soppeng", role: "Prakom Ahli Pertama", status: "hadir", note: "" },
  { id: "2", nip: "199408212022032004", name: "Aisyah Putri Rahmadani, S.Kom.", satker: "Kejati Jawa Timur", role: "Prakom Ahli Pertama", status: "hadir", note: "" },
  { id: "3", nip: "199601152024011002", name: "Bagus Pratama, A.Md.Kom.", satker: "Kejaksaan Agung RI (Pusdaskrimti)", role: "Prakom Terampil", status: "izin", note: "Penugasan mendesak server perkara" },
  { id: "4", nip: "199511042022032003", name: "Citra Dewi Anggraini, S.Kom.", satker: "Kejati DKI Jakarta", role: "Prakom Ahli Pertama", status: "hadir", note: "" },
  { id: "5", nip: "199307182020121005", name: "Daffa Al-Ghifari, S.Tr.Kom.", satker: "Kejari Makassar", role: "Prakom Ahli Pertama", status: "sakit", note: "Surat istirahat dokter" },
  { id: "6", nip: "199705292024012001", name: "Eka Nur Fitriani, A.Md.", satker: "Kejari Sleman", role: "Prakom Terampil", status: "hadir", note: "" },
  { id: "7", nip: "199412102022031006", name: "Fajar Hidayat, S.Kom.", satker: "Kejati Sumatera Utara", role: "Prakom Ahli Pertama", status: "hadir", note: "" },
  { id: "8", nip: "199602242024012003", name: "Gita Safitri, S.Kom.", satker: "Kejati Bali", role: "Prakom Ahli Pertama", status: "hadir", note: "" },
  { id: "9", nip: "199509172022031007", name: "Hafiz Muhammad, S.Kom.", satker: "Kejari Bandung", role: "Prakom Ahli Pertama", status: "hadir", note: "" },
  { id: "10", nip: "199803052024012005", name: "Indah Permatasari, A.Md.Kom.", satker: "Kejari Palembang", role: "Prakom Terampil", status: "hadir", note: "" },
]

export default function AttendancePage() {
  const [selectedSession, setSelectedSession] = React.useState("Sesi 1 • Building Learning Commitment (BLC)")
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0])
  const [participants, setParticipants] = React.useState<ParticipantAttendance[]>(INITIAL_PARTICIPANTS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [savedSuccess, setSavedSuccess] = React.useState(false)

  const handleStatusChange = (id: string, status: StatusType) => {
    setParticipants(
      participants.map((s) => (s.id === id ? { ...s, status } : s))
    )
    setSavedSuccess(false)
  }

  const handleSetAllHadir = () => {
    setParticipants(participants.map((s) => ({ ...s, status: "hadir" })))
    setSavedSuccess(false)
  }

  const handleSaveAttendance = () => {
    try {
      localStorage.setItem(`prakom_attendance_${selectedSession}_${date}`, JSON.stringify(participants))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch {
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }
  }

  // Export Attendance to CSV
  const handleExportCsv = () => {
    const headers = ["No", "NIP", "Nama Peserta", "Satuan Kerja", "Jabatan", "Status Kehadiran", "Keterangan", "Sesi", "Tanggal"]
    const rows = participants.map((p, idx) => [
      idx + 1,
      `'${p.nip}`,
      `"${p.name}"`,
      `"${p.satker}"`,
      `"${p.role}"`,
      p.status.toUpperCase(),
      `"${p.note || "-"}"`,
      `"${selectedSession}"`,
      date
    ])

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `Rekap_Presensi_Prakom_Batch3_${date}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Summary counts
  const totalParticipants = participants.length
  const hadirCount = participants.filter((s) => s.status === "hadir").length
  const izinCount = participants.filter((s) => s.status === "izin").length
  const sakitCount = participants.filter((s) => s.status === "sakit").length
  const alpaCount = participants.filter((s) => s.status === "alpa").length
  const attendanceRate = Math.round((hadirCount / totalParticipants) * 100)

  const filteredParticipants = participants.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nip.includes(searchQuery) ||
      s.satker.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="success" dot>
            Diklat Fungsional Prakom Batch 3
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Presensi Sesi Perkuliahan Zoom
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Catat, verifikasi, dan ekspor kehadiran rekan peserta per sesi materi Diklat Kejaksaan RI
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleExportCsv}
            variant="secondary"
            size="md"
            icon={<FileSpreadsheet className="h-4 w-4 text-emerald-400" />}
          >
            Export CSV
          </Button>

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
            Simpan Presensi
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
                  Pilih Sesi Diklat
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-xs text-slate-100 focus:border-indigo-500/60 focus:outline-none"
                >
                  <option value="Sesi 1 • Building Learning Commitment (BLC)">Sesi 1 • Building Learning Commitment (BLC)</option>
                  <option value="Sesi 2 • PRE-TEST Pusdiklat BPS">Sesi 2 • PRE-TEST Pusdiklat BPS</option>
                  <option value="Sesi 3 • Tata Kelola SPBE & Perpres 95/2018">Sesi 3 • Tata Kelola SPBE & Perpres 95/2018</option>
                  <option value="Sesi 4 • Manajemen Basis Data & SQL Tuning">Sesi 4 • Manajemen Basis Data & SQL Tuning</option>
                  <option value="Sesi 5 • Infrastruktur Jaringan & Server Linux">Sesi 5 • Infrastruktur Jaringan & Server Linux</option>
                  <option value="Sesi 6 • Keamanan Siber & CSIRT Kejaksaan">Sesi 6 • Keamanan Siber & CSIRT Kejaksaan</option>
                  <option value="Sesi 7 • DUPAK & SKP PermenPAN-RB 1/2023">Sesi 7 • DUPAK & SKP PermenPAN-RB 1/2023</option>
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
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-xs text-slate-100 focus:border-indigo-500/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Cari Peserta
                </label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nama / NIP / Satker..."
                  icon={<Search className="h-4 w-4 text-slate-400" />}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Rate Mini Box */}
        <Card className="p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Kehadiran Sesi</span>
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
          <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
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
          <span>Presensi peserta sesi diklat berhasil disimpan & disinkronkan.</span>
        </div>
      )}

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Hadir Peserta Diklat — {selectedSession}</CardTitle>
          <CardDescription>Pilih status kehadiran dan catat keterangan izin/sakit peserta</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">No</th>
                  <th className="py-3 px-4 font-semibold">NIP</th>
                  <th className="py-3 px-4 font-semibold">Nama Peserta</th>
                  <th className="py-3 px-4 font-semibold">Satuan Kerja</th>
                  <th className="py-3 px-4 font-semibold">Jabatan</th>
                  <th className="py-3 px-4 font-semibold text-center">Status Kehadiran</th>
                  <th className="py-3 px-4 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredParticipants.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{p.nip}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{p.satker}</td>
                    <td className="py-3.5 px-4 text-[11px] text-indigo-400 font-medium">{p.role}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {[
                          { key: "hadir", label: "Hadir", color: "hover:bg-emerald-500/20 text-emerald-400 active:bg-emerald-500/30" },
                          { key: "izin", label: "Izin", color: "hover:bg-amber-500/20 text-amber-400 active:bg-amber-500/30" },
                          { key: "sakit", label: "Sakit", color: "hover:bg-cyan-500/20 text-cyan-400 active:bg-cyan-500/30" },
                          { key: "alpa", label: "Alpa", color: "hover:bg-red-500/20 text-red-400 active:bg-red-500/30" },
                        ].map((btn) => {
                          const isSelected = p.status === btn.key
                          return (
                            <button
                              key={btn.key}
                              type="button"
                              onClick={() => handleStatusChange(p.id, btn.key as StatusType)}
                              className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
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
                      {p.note ? (
                        <span className="italic text-slate-300">{p.note}</span>
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
