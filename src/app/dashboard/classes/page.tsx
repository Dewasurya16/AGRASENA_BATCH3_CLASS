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
  GraduationCap,
  Building2,
  Sparkles
} from "lucide-react"

interface CohortGroup {
  id: string
  name: string
  stage: string
  batchYear: string
  code: string
  description: string
  memberCount: number
}

const INITIAL_GROUPS: CohortGroup[] = [
  {
    id: "1",
    name: "Kelompok 1 — Kejaksaan Agung & Badan Diklat",
    stage: "Tahap 2 • TMO Zoom",
    batchYear: "Batch 3 — 2026",
    code: "AGR-P01",
    description: "Fokus koordinasi SPBE Nasional, arsitektur data warehouse perkara terpadu, dan CSIRT Kejaksaan RI.",
    memberCount: 35,
  },
  {
    id: "2",
    name: "Kelompok 2 — Wilayah Kejati Jawa, Bali & NTB/NTT",
    stage: "Tahap 2 • TMO Zoom",
    batchYear: "Batch 3 — 2026",
    code: "AGR-P02",
    description: "Pendalaman infrastruktur server Linux satker, query tuning database perkara CMS, dan SOP TIK pelayanan publik.",
    memberCount: 42,
  },
  {
    id: "3",
    name: "Kelompok 3 — Wilayah Kejati se-Sumatera",
    stage: "Tahap 2 • TMO Zoom",
    batchYear: "Batch 3 — 2026",
    code: "AGR-P03",
    description: "Manajemen jaringan intra-pemerintah, mitigasi risiko siber ISO 31000, dan bukti fisik DUPAK fungsional.",
    memberCount: 36,
  },
  {
    id: "4",
    name: "Kelompok 4 — Wilayah Kalimantan, Sulawesi, Maluku & Papua",
    stage: "Tahap 2 • TMO Zoom",
    batchYear: "Batch 3 — 2026",
    code: "AGR-P04",
    description: "Optimalisasi bandwidth satker kepulauan, sistem backup cloud otomatis, dan proposal aksi perubahan seminar.",
    memberCount: 38,
  },
]

export default function ClassesPage() {
  const [groups, setGroups] = React.useState<CohortGroup[]>(INITIAL_GROUPS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  // Form State
  const [name, setName] = React.useState("")
  const [stage, setStage] = React.useState("Tahap 2 • TMO Zoom")
  const [batchYear, setBatchYear] = React.useState("Batch 3 — 2026")
  const [description, setDescription] = React.useState("")

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const randomCode =
      "AGR-" +
      Math.floor(100 + Math.random() * 900)

    const newGroup: CohortGroup = {
      id: Date.now().toString(),
      name,
      stage,
      batchYear,
      code: randomCode,
      description: description || "Kelompok studi diklat fungsional aktif",
      memberCount: 0,
    }

    setGroups([newGroup, ...groups])
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
            Pengelompokan Belajar & Satker
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Kelompok Belajar Diklat Prakom
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Kelola pembagian kelompok regional, kode penugasan lab satker, dan pendampingan widyaiswara
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          icon={<Plus className="h-4 w-4" />}
        >
          Buat Kelompok Baru
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama kelompok atau kode..."
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>
        <span className="text-xs text-slate-400 ml-auto hidden sm:block">
          Menampilkan {filteredGroups.length} dari {groups.length} kelompok regional
        </span>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filteredGroups.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <Badge variant="purple" dot>
                  {item.stage}
                </Badge>
                <CardTitle className="mt-2 text-base line-clamp-1">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Code Box */}
              <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Kode Kelompok / Penugasan</p>
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
                  {item.memberCount} Rekan Prakom Terdaftar
                </span>
                <span className="font-mono">{item.batchYear}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Buat Kelompok Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Kelompok Belajar Baru"
        description="Lengkapi informasi kelompok regional untuk sesi diskusi dan penugasan lab satker."
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <Input
            label="Nama Kelompok / Regional Satker"
            placeholder="Contoh: Kelompok 5 — Wilayah Kalimantan Barat & Tengah"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tahap Diklat
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] px-4 py-2.5 text-xs text-slate-100 focus:border-indigo-500/60 focus:outline-none"
              >
                <option value="Tahap 1 • MOOC 120 JP">Tahap 1 • MOOC 120 JP</option>
                <option value="Tahap 2 • TMO Zoom">Tahap 2 • TMO Zoom</option>
                <option value="Tahap 3 • Lab Satker">Tahap 3 • Lab Satker</option>
                <option value="Tahap 4 • Seminar Aksi Perubahan">Tahap 4 • Seminar Aksi Perubahan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Angkatan / Batch
              </label>
              <Input
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                placeholder="Batch 3 — 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Fokus Penugasan / Deskripsi
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi fokus kajian TIK atau penugasan satker..."
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none"
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
              Simpan Kelompok
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
