'use client'

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Download,
  Eye,
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Award,
  UploadCloud,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

export interface MaterialItem {
  id: string
  title: string
  subject_name: string
  week_number: number
  file_url: string
  file_name: string
  file_size?: number | null
  description?: string | null
  created_at: string
}

export function ResourceHub({ materials = [] }: { materials?: MaterialItem[] }) {
  const items = materials
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSubject, setSelectedSubject] = React.useState("Semua")
  const [selectedWeek, setSelectedWeek] = React.useState("Semua")
  const [previewMaterial, setPreviewMaterial] = React.useState<MaterialItem | null>(null)
  const [readerTab, setReaderTab] = React.useState<"pdf" | "notes">("pdf")
  const [studyNotes, setStudyNotes] = React.useState<Record<string, string>>({})

  // Load study notes from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("prakom_study_notes")
      if (saved) {
        setStudyNotes(JSON.parse(saved))
      }
    } catch {
      // Ignore
    }
  }, [])

  const subjects = ["Semua", ...Array.from(new Set(items.map((m) => m.subject_name)))]
  const weeks = ["Semua", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]

  const filtered = items.filter((m) => {
    const q = searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.file_name.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q))
    const matchSubject = selectedSubject === "Semua" || m.subject_name === selectedSubject
    const matchWeek = selectedWeek === "Semua" || `Week ${m.week_number}` === selectedWeek
    return matchSearch && matchSubject && matchWeek
  })

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedSubject("Semua")
    setSelectedWeek("Semua")
  }

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "PDF Dokumen"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  return (
    <section id="resources" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E6F7ED] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0D824B]">
              Bahan Ajar Diklat 120 JP • Supabase Storage
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#131E29] mt-2">
            Pustaka Modul Bahan Ajar PDF
          </h3>
          <p className="text-xs text-[#6B7C93]">
            Akses dan unduh modul resmi Agrasena (Prakom 625) atau buka langsung melalui modal preview
          </p>
        </div>

        <span className="text-xs font-bold text-[#FF7643] bg-[#FFEADA] px-3 py-1 rounded-full self-start sm:self-auto">
          {filtered.length} Modul Tersedia
        </span>
      </div>

      {/* Filter & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] bg-white p-4 soft-card-shadow border border-slate-100/90"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul modul / topik SPBE..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-medium text-[#131E29] placeholder-[#9AA8BA] focus:border-[#0D3830] focus:outline-none"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#131E29] focus:border-[#0D3830] focus:outline-none"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub === "Semua" ? "Semua Tahapan Diklat" : sub}
              </option>
            ))}
          </select>

          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#131E29] focus:border-[#0D3830] focus:outline-none"
          >
            {weeks.map((w) => (
              <option key={w} value={w}>
                {w === "Semua" ? "Semua Pertemuan (Week)" : w}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Materials Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-[32px] bg-white p-10 text-center soft-card-shadow border border-slate-100 space-y-3">
          <FileText className="mx-auto h-12 w-12 text-[#8C9BAE]" />
          <h4 className="font-bold text-base text-[#131E29]">Tidak Ada Modul yang Sesuai</h4>
          <p className="text-xs text-[#6B7C93] max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter tahapan diklat dan minggu pertemuan.
          </p>
          <Button variant="secondary" size="sm" onClick={resetFilters} icon={<RotateCcw className="h-3.5 w-3.5" />}>
            Reset Filter
          </Button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group flex flex-col justify-between rounded-[28px] bg-white p-5 soft-card-shadow border border-slate-100 hover:border-[#0D3830]/40 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#E6F7ED] px-3 py-0.5 text-xs font-bold text-[#0D824B]">
                    Pertemuan {item.week_number}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#8C9BAE]">
                    {formatFileSize(item.file_size)}
                  </span>
                </div>

                <h4 className="font-bold text-base text-[#131E29] group-hover:text-[#0D3830] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs font-bold text-[#FF7643]">{item.subject_name}</p>
                <p className="text-xs text-[#6B7C93] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs text-[#6B7C93] gap-3">
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#8C9BAE] truncate max-w-[180px]">
                  <FileText className="h-3.5 w-3.5 text-[#0D3830] shrink-0" />
                  {item.file_name}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewMaterial(item)}
                    icon={<Eye className="h-3.5 w-3.5" />}
                  >
                    Preview
                  </Button>
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={item.file_name}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Download className="h-3.5 w-3.5" />}
                    >
                      Unduh
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal PDF Preview & Personal Study Notes */}
      {previewMaterial && (
        <Modal
          isOpen={Boolean(previewMaterial)}
          onClose={() => setPreviewMaterial(null)}
          title={previewMaterial.title}
          description={`${previewMaterial.subject_name} • Modul Bahan Ajar (Prakom 625)`}
          className="max-w-4xl"
        >
          <div className="space-y-4 pt-1">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReaderTab("pdf")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    readerTab === "pdf"
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Dokumen PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReaderTab("notes")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    readerTab === "notes"
                      ? "bg-[#0D3830] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#A7F3D0]" />
                  <span>Catatan Belajar Pribadi</span>
                  {studyNotes[previewMaterial.id]?.trim() && (
                    <span className="h-2 w-2 rounded-full bg-[#FF7643]" />
                  )}
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500 font-semibold hidden sm:inline-block">
                {previewMaterial.file_size ? formatFileSize(previewMaterial.file_size) : "PDF Dokumen"}
              </span>
            </div>

            {/* Content Area */}
            {readerTab === "pdf" ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden h-[60vh]">
                <iframe
                  src={previewMaterial.file_url}
                  className="w-full h-full"
                  title={previewMaterial.title}
                />
              </div>
            ) : (
              <div className="space-y-3 h-[60vh] flex flex-col">
                <div className="rounded-2xl bg-[#FFF9F5] p-3.5 border border-[#FFEADA] text-xs text-[#EA580C] font-semibold flex items-center justify-between">
                  <span>💡 Catatan belajar ini tersimpan otomatis di browser Anda.</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-[#FFEADA]">Auto-Saved</span>
                </div>
                <textarea
                  value={studyNotes[previewMaterial.id] || ""}
                  onChange={(e) => {
                    const val = e.target.value
                    setStudyNotes((prev) => {
                      const updated = { ...prev, [previewMaterial.id]: val }
                      try {
                        localStorage.setItem("prakom_study_notes", JSON.stringify(updated))
                      } catch {
                        // Ignore
                      }
                      return updated
                    })
                  }}
                  placeholder="Tuliskan rangkuman, poin penting, pertanyaan diskusi, atau catatan persiapan tugas di sini..."
                  className="flex-1 w-full rounded-2xl border-2 border-slate-200 bg-[#F8FAFC] p-4 text-xs font-medium text-[#18181B] focus:border-[#0D3830] focus:bg-white focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#8C9BAE] font-mono truncate">
                Storage: class-materials/{previewMaterial.file_name}
              </span>
              <div className="flex gap-2">
                <a
                  href={previewMaterial.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="md" icon={<ExternalLink className="h-4 w-4" />}>
                    Buka Tab Baru
                  </Button>
                </a>
                <a
                  href={previewMaterial.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={previewMaterial.file_name}
                >
                  <Button variant="orange" size="md" icon={<Download className="h-4 w-4" />}>
                    Unduh PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
