'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Search,
  UploadCloud
} from "lucide-react"

interface Assignment {
  id: string
  title: string
  className: string
  description: string
  dueDate: string
  maxScore: number
  submittedCount: number
  totalStudents: number
  status: "active" | "closed"
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    title: "Latihan Soal Aljabar Linear & Matriks",
    className: "X IPA 1 - Matematika Wajib",
    description: "Kerjakan soal nomor 1-15 pada modul halaman 45. Unggah jawaban dalam bentuk file PDF.",
    dueDate: "2026-08-30 23:59",
    maxScore: 100,
    submittedCount: 28,
    totalStudents: 32,
    status: "active",
  },
  {
    id: "2",
    title: "Laporan Praktikum Hukum Newton",
    className: "XI IPA 2 - Fisika Dasar",
    description: "Tulis laporan praktikum gerak lurus berubah beraturan beserta grafik dan kesimpulan analisa data.",
    dueDate: "2026-09-02 18:00",
    maxScore: 100,
    submittedCount: 14,
    totalStudents: 30,
    status: "active",
  },
  {
    id: "3",
    title: "Essay Analisis Laporan Keuangan Perusahaan",
    className: "XII IPS 1 - Ekonomi & Akuntansi",
    description: "Buat essay minimal 500 kata mengenai neraca lajur dan arus kas perusahaan manufaktur.",
    dueDate: "2026-08-25 23:59",
    maxScore: 100,
    submittedCount: 34,
    totalStudents: 34,
    status: "closed",
  },
]

export default function AssignmentsPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>(INITIAL_ASSIGNMENTS)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [title, setTitle] = React.useState("")
  const [selectedClass, setSelectedClass] = React.useState("X IPA 1 - Matematika Wajib")
  const [dueDate, setDueDate] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [maxScore, setMaxScore] = React.useState(100)

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) return

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      className: selectedClass,
      description,
      dueDate,
      maxScore,
      submittedCount: 0,
      totalStudents: 32,
      status: "active",
    }

    setAssignments([newAssignment, ...assignments])
    setIsModalOpen(false)
    setTitle("")
    setDescription("")
  }

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.className.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="purple" dot>
            Evaluasi & Tugas
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Manajemen Tugas & Ujian
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Publikasikan penugasan, kelola batas waktu, dan periksa submisi siswa
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          icon={<Plus className="h-4 w-4" />}
        >
          Buat Tugas Baru
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas berdasarkan judul atau kelas..."
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const submissionRate = Math.round((item.submittedCount / item.totalStudents) * 100)
          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={item.status === "active" ? "success" : "default"} dot>
                    {item.status === "active" ? "Aktif" : "Selesai"}
                  </Badge>
                  <span className="text-[11px] font-mono text-indigo-300">
                    Maks. {item.maxScore} Poin
                  </span>
                </div>
                <CardTitle className="mt-2 text-base line-clamp-1">{item.title}</CardTitle>
                <p className="text-xs text-indigo-400 font-medium">{item.className}</p>
                <CardDescription className="line-clamp-2 mt-1">{item.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* Due Date & Submission Progress */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Tenggat: {item.dueDate}</span>
                </div>

                <div className="space-y-1.5 border-t border-white/[0.05] pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Pengumpulan</span>
                    <span className="font-semibold text-slate-200">
                      {item.submittedCount}/{item.totalStudents} Siswa ({submissionRate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${submissionRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm">
                    Periksa Jawaban
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal Buat Tugas */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Tugas Baru"
        description="Isi informasi tugas yang akan dibagikan kepada siswa di kelas."
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input
            label="Judul Tugas"
            placeholder="Contoh: Latihan Soal Bab 2"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Pilih Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none"
            >
              <option value="X IPA 1 - Matematika Wajib">X IPA 1 - Matematika Wajib</option>
              <option value="XI IPA 2 - Fisika Dasar">XI IPA 2 - Fisika Dasar</option>
              <option value="XII IPS 1 - Ekonomi & Akuntansi">XII IPS 1 - Ekonomi & Akuntansi</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Batas Waktu (Tenggat)
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none"
              />
            </div>

            <div>
              <Input
                label="Skor Maksimal"
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Instruksi / Deskripsi Tugas
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan petunjuk pengerjaan tugas..."
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md">
              Publikasikan Tugas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
