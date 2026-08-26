'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import {
  Bell,
  Pin,
  Plus,
  Calendar,
  User,
  Search,
  MessageSquare
} from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  className: string
  isPinned: boolean
  author: string
  date: string
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Jadwal Penilaian Tengah Semester (PTS) Ganjil 2026",
    content: "PTS akan dilaksanakan mulai tanggal 15 September 2026. Harap seluruh siswa mempersiapkan materi bab 1 sampai bab 3 dan melengkapi seluruh tugas sebelum batas waktu.",
    className: "Semua Kelas",
    isPinned: true,
    author: "Wakil Kepala Sekolah Bid. Kurikulum",
    date: "26 Agustus 2026",
  },
  {
    id: "2",
    title: "Pelaksanaan Praktikum Fisika di Laboratorium",
    content: "Untuk kelas XI IPA 2, praktikum hari Selasa wajib mengenakan jas lab dan membawa modul praktikum yang telah diisi landasan teorinya.",
    className: "XI IPA 2",
    isPinned: true,
    author: "Ir. Hendra Wijaya",
    date: "25 Agustus 2026",
  },
  {
    id: "3",
    title: "Pengumpulan Iuran Kas Kelas Bulan Agustus",
    content: "Batas pengumpulan kas kelas sebesar Rp 10.000,- sampai hari Jumat pekan ini. Uang kas akan digunakan untuk keperluan kebersihan dan fotokopi modul.",
    className: "X IPA 1",
    isPinned: false,
    author: "Bendahara Kelas",
    date: "24 Agustus 2026",
  },
]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(INITIAL_ANNOUNCEMENTS)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [className, setClassName] = React.useState("Semua Kelas")
  const [isPinned, setIsPinned] = React.useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    const newPost: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      className,
      isPinned,
      author: "Guru Pengajar",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    }

    setAnnouncements([newPost, ...announcements])
    setIsModalOpen(false)
    setTitle("")
    setContent("")
    setIsPinned(false)
  }

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.className.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="purple" dot>
            Pusat Informasi
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Papan Pengumuman Kelas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Publikasikan informasi penting, edaran sekolah, dan kegiatan kelas
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          icon={<Plus className="h-4 w-4" />}
        >
          Buat Pengumuman
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengumuman..."
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-2">
                {item.isPinned && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/20">
                    <Pin className="h-3 w-3" />
                    Tersemat
                  </span>
                )}
                <Badge variant="purple">{item.className}</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.date}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <CardTitle className="text-base text-slate-100">{item.title}</CardTitle>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="flex items-center gap-2 border-t border-white/[0.05] pt-3 text-[11px] text-slate-400">
                <User className="h-3 w-3 text-indigo-400" />
                <span>Diumumkan oleh: <strong className="text-slate-200">{item.author}</strong></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Buat Pengumuman */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Pengumuman Baru"
        description="Pengumuman akan langsung tampil di dashboard seluruh anggota kelas terkait."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Judul Pengumuman"
            placeholder="Contoh: Perubahan Jadwal Praktikum"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Kelas
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none"
              >
                <option value="Semua Kelas">Semua Kelas</option>
                <option value="X IPA 1">X IPA 1</option>
                <option value="XI IPA 2">XI IPA 2</option>
                <option value="XII IPS 1">XII IPS 1</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="pin"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4 w-4 rounded bg-[#0c101d] border-white/20 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="pin" className="text-xs text-slate-300 font-medium">
                Sematkan di atas (Pin)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Isi Pengumuman
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi pengumuman lengkap..."
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
              Kirim Pengumuman
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
