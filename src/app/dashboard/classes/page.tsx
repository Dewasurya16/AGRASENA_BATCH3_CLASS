'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import {
  Users,
  Plus,
  Copy,
  Check,
  Search,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react"

interface ClassItem {
  id: string
  name: string
  grade: string
  academicYear: string
  code: string
  description: string
  studentCount: number
}

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "1",
    name: "X IPA 1 - Matematika Wajib",
    grade: "Kelas 10",
    academicYear: "2026/2027",
    code: "MTK-X1",
    description: "Pembelajaran Aljabar, Trigonometri, dan Kalkulus Dasar",
    studentCount: 32,
  },
  {
    id: "2",
    name: "XI IPA 2 - Fisika Dasar",
    grade: "Kelas 11",
    academicYear: "2026/2027",
    code: "FSK-XI2",
    description: "Mekanika, Termodinamika, dan Gelombang Optik",
    studentCount: 30,
  },
  {
    id: "3",
    name: "XII IPS 1 - Ekonomi & Akuntansi",
    grade: "Kelas 12",
    academicYear: "2026/2027",
    code: "EKO-XII1",
    description: "Prinsip Akuntansi Dasar dan Ekonomi Makro",
    studentCount: 34,
  },
  {
    id: "4",
    name: "X IPS 3 - Bahasa Inggris",
    grade: "Kelas 10",
    academicYear: "2026/2027",
    code: "ING-X3",
    description: "English Grammar, Reading Comprehension, & Public Speaking",
    studentCount: 32,
  },
]

export default function ClassesPage() {
  const [classes, setClasses] = React.useState<ClassItem[]>(INITIAL_CLASSES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  // Form State
  const [name, setName] = React.useState("")
  const [grade, setGrade] = React.useState("Kelas 10")
  const [academicYear, setAcademicYear] = React.useState("2026/2027")
  const [description, setDescription] = React.useState("")

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const randomCode =
      name.substring(0, 3).toUpperCase() +
      "-" +
      Math.floor(100 + Math.random() * 900)

    const newClass: ClassItem = {
      id: Date.now().toString(),
      name,
      grade,
      academicYear,
      code: randomCode,
      description: description || "Kelas pembelajaran digital aktif",
      studentCount: 0,
    }

    setClasses([newClass, ...classes])
    setIsModalOpen(false)
    setName("")
    setDescription("")
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="purple" dot>
            Manajemen Akademik
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Manajemen Kelas & Rombel
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Kelola ruang kelas, kode pendaftaran siswa, dan kurikulum aktif
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          icon={<Plus className="h-4 w-4" />}
        >
          Buat Kelas Baru
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama mata pelajaran atau kode kelas..."
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>
        <span className="text-xs text-slate-400 ml-auto hidden sm:block">
          Menampilkan {filteredClasses.length} dari {classes.length} kelas
        </span>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <Badge variant="purple" dot>
                  {item.grade}
                </Badge>
                <CardTitle className="mt-2 text-base line-clamp-1">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Code Box */}
              <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Kode Kelas</p>
                  <p className="font-mono text-sm font-bold text-indigo-300">{item.code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(item.code)}
                  icon={
                    copiedCode === item.code ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                    )
                  }
                >
                  {copiedCode === item.code ? "Disalin!" : "Salin"}
                </Button>
              </div>

              {/* Meta information */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/[0.05] pt-3">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-indigo-400" />
                  {item.studentCount} Siswa Terdaftar
                </span>
                <span>{item.academicYear}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Buat Kelas Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Ruang Kelas Baru"
        description="Lengkapi detail kelas di bawah untuk membuat ruang kelas dan kode pendaftaran otomatis."
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Nama Kelas / Mata Pelajaran"
            placeholder="Contoh: X IPA 1 - Biologi"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tingkat
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none"
              >
                <option value="Kelas 10">Kelas 10</option>
                <option value="Kelas 11">Kelas 11</option>
                <option value="Kelas 12">Kelas 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tahun Ajaran
              </label>
              <Input
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026/2027"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Deskripsi Kelas
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi materi atau silabus kelas..."
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
              Simpan Kelas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
