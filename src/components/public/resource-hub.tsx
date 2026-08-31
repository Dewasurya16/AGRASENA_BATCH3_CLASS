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
  Shield,
  Loader2,
  Copy,
  Check,
  Trash2,
  Maximize2,
  Edit3,
  BookMarked
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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

// Inline Markdown & HTML Tag Parser for bold, italic, code, and <br> line breaks
function renderInlineFormatted(text: string) {
  if (!text) return null

  // Replace &nbsp; with space
  const sanitized = text.replace(/&nbsp;/g, " ")

  // Split by line break tags: <br>, <br/>, <br />
  const lines = sanitized.split(/<br\s*\/?>/gi)

  return lines.map((line, lineIdx) => {
    // Matches **bold**, *italic*, `code`, <b>bold</b>, <strong>bold</strong>, <i>italic</i>, <em>italic</em>
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|<b>.*?<\/b>|<strong>.*?<\/strong>|<i>.*?<\/i>|<em>.*?<\/em>)/gi)

    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {parts.map((part, idx) => {
          if (!part) return null

          // Markdown **bold**
          if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
            return (
              <strong key={idx} className="font-extrabold text-[#0D3830] dark:text-emerald-300">
                {part.slice(2, -2)}
              </strong>
            )
          }

          // HTML <b> or <strong>
          const lowerPart = part.toLowerCase()
          if (
            (lowerPart.startsWith("<b>") && lowerPart.endsWith("</b>")) ||
            (lowerPart.startsWith("<strong>") && lowerPart.endsWith("</strong>"))
          ) {
            const inner = part.replace(/^<[^>]+>|<\/[^>]+>$/g, "")
            return (
              <strong key={idx} className="font-extrabold text-[#0D3830] dark:text-emerald-300">
                {inner}
              </strong>
            )
          }

          // Markdown *italic*
          if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
            return (
              <em key={idx} className="italic text-slate-700 dark:text-slate-200">
                {part.slice(1, -1)}
              </em>
            )
          }

          // HTML <i> or <em>
          if (
            (lowerPart.startsWith("<i>") && lowerPart.endsWith("</i>")) ||
            (lowerPart.startsWith("<em>") && lowerPart.endsWith("</em>"))
          ) {
            const inner = part.replace(/^<[^>]+>|<\/[^>]+>$/g, "")
            return (
              <em key={idx} className="italic text-slate-700 dark:text-slate-200">
                {inner}
              </em>
            )
          }

          // Markdown `code`
          if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
            return (
              <code
                key={idx}
                className="rounded bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-[#0D824B] dark:text-emerald-400 border border-slate-300 dark:border-slate-700 font-semibold"
              >
                {part.slice(1, -1)}
              </code>
            )
          }

          return part
        })}
      </React.Fragment>
    )
  })
}

// Rich Formatted Note / Summary Document Viewer
function RichNoteRenderer({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
        <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="text-xs font-semibold">Belum ada catatan atau rangkuman untuk modul ini.</p>
        <p className="text-[11px] max-w-xs">
          Klik tombol <strong className="text-[#EA580C]">"✨ Rangkum dengan AI"</strong> di atas untuk membuat rangkuman akademik otomatis dari dokumen PDF resmi.
        </p>
      </div>
    )
  }

  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let tableBuffer: string[] = []

  const flushTable = (keyPrefix: number) => {
    if (tableBuffer.length < 2) {
      tableBuffer = []
      return
    }

    const rows = tableBuffer
      .filter((l) => !l.includes("---") && !l.includes("━━━"))
      .map((l) =>
        l
          .split("|")
          .map((c) => c.trim())
          .filter((c, i, arr) => (i > 0 && i < arr.length - 1) || arr.length === 1)
      )

    if (rows.length > 0) {
      const headerRow = rows[0]
      const dataRows = rows.slice(1)

      elements.push(
        <div key={`tbl-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            {headerRow && (
              <thead className="bg-slate-100 dark:bg-slate-800 text-[#131E29] dark:text-white border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="p-2.5 font-black uppercase text-[11px] tracking-wider">
                      {renderInlineFormatted(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#161B26]">
              {dataRows.map((r, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {renderInlineFormatted(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    tableBuffer = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      tableBuffer.push(trimmed)
      continue
    } else if (tableBuffer.length > 0) {
      flushTable(i)
    }

    if (!trimmed) {
      elements.push(<div key={`sp-${i}`} className="h-2" />)
      continue
    }

    // Heading 1 (# )
    if (trimmed.startsWith("# ")) {
      elements.push(
        <div key={`h1-${i}`} className="mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm sm:text-base font-black text-[#0D3830] dark:text-emerald-400 flex items-center gap-2">
            {renderInlineFormatted(trimmed.replace(/^#\s+/, ""))}
          </h2>
        </div>
      )
      continue
    }

    // Heading 2 (## )
    if (trimmed.startsWith("## ")) {
      elements.push(
        <div key={`h2-${i}`} className="mt-3.5 mb-1.5">
          <h3 className="text-xs sm:text-sm font-black text-[#131E29] dark:text-white flex items-center gap-1.5">
            {renderInlineFormatted(trimmed.replace(/^##\s+/, ""))}
          </h3>
        </div>
      )
      continue
    }

    // Heading 3 (### )
    if (trimmed.startsWith("### ")) {
      elements.push(
        <div key={`h3-${i}`} className="mt-3 mb-1">
          <h4 className="text-xs font-black text-[#FF7643] dark:text-amber-400">
            {renderInlineFormatted(trimmed.replace(/^###\s+/, ""))}
          </h4>
        </div>
      )
      continue
    }

    // Horizontal Divider
    if (trimmed.startsWith("---") || trimmed.startsWith("━━━")) {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-slate-200 dark:border-slate-800" />)
      continue
    }

    // Bullet Points (• , - , * )
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.replace(/^([•\-\*]\s+)/, "")
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 pl-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed my-1">
          <span className="text-[#0D824B] dark:text-emerald-400 font-bold select-none mt-0.5">•</span>
          <div className="flex-1">{renderInlineFormatted(content)}</div>
        </div>
      )
      continue
    }

    // Numbered List
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 pl-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed my-1">
          <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-black text-[#0D3830] dark:text-emerald-400 select-none shrink-0 border border-slate-200 dark:border-slate-700">
            {numMatch[1]}
          </span>
          <div className="flex-1">{renderInlineFormatted(numMatch[2])}</div>
        </div>
      )
      continue
    }

    // Regular Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        {renderInlineFormatted(line)}
      </p>
    )
  }

  if (tableBuffer.length > 0) {
    flushTable(lines.length)
  }

  return <div className="space-y-1 p-4 sm:p-5 text-[#18181B] dark:text-slate-100">{elements}</div>
}

export function ResourceHub({ materials = [] }: { materials?: MaterialItem[] }) {
  const items = materials
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSubject, setSelectedSubject] = React.useState("Semua")
  const [selectedWeek, setSelectedWeek] = React.useState("Semua")
  const [previewMaterial, setPreviewMaterial] = React.useState<MaterialItem | null>(null)
  const [readerTab, setReaderTab] = React.useState<"pdf" | "notes">("pdf")
  const [noteViewMode, setNoteViewMode] = React.useState<"rendered" | "edit">("rendered")
  const [studyNotes, setStudyNotes] = React.useState<Record<string, string>>({})
  const [isSummarizing, setIsSummarizing] = React.useState(false)
  const [copiedNote, setCopiedNote] = React.useState(false)
  const [isPdfLoading, setIsPdfLoading] = React.useState(true)
  const [pdfLoadProgress, setPdfLoadProgress] = React.useState(15)

  // Manage PDF Loading Progress Simulation
  React.useEffect(() => {
    if (previewMaterial && readerTab === "pdf") {
      setIsPdfLoading(true)
      setPdfLoadProgress(15)

      const interval = setInterval(() => {
        setPdfLoadProgress((prev) => {
          if (prev < 40) return prev + Math.floor(Math.random() * 12) + 8
          if (prev < 75) return prev + Math.floor(Math.random() * 8) + 5
          if (prev < 92) return prev + Math.floor(Math.random() * 4) + 2
          return prev
        })
      }, 350)

      return () => clearInterval(interval)
    }
  }, [previewMaterial?.id, readerTab])

  const handleIframeLoad = () => {
    setPdfLoadProgress(100)
    setTimeout(() => {
      setIsPdfLoading(false)
    }, 400)
  }

  // Read Progress tracking for Local Storage
  const [readMaterialIds, setReadMaterialIds] = React.useState<string[]>([])

  // Load read status from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("prakom_materials_read")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setReadMaterialIds(parsed)
      }
    } catch {}
  }, [])

  const markMaterialAsRead = React.useCallback((id: string) => {
    setReadMaterialIds((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      try {
        localStorage.setItem("prakom_materials_read", JSON.stringify(updated))
        window.dispatchEvent(new Event("storage"))
        window.dispatchEvent(new Event("prakom-progress-updated"))
      } catch {}
      return updated
    })
  }, [])

  const toggleMaterialRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setReadMaterialIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem("prakom_materials_read", JSON.stringify(next))
        window.dispatchEvent(new Event("storage"))
        window.dispatchEvent(new Event("prakom-progress-updated"))
      } catch {}
      return next
    })
  }

  // Load study notes from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("prakom_study_notes")
      if (saved) {
        setStudyNotes(JSON.parse(saved))
      }
    } catch {
      // LocalStorage access fallback
    }
  }, [])

  // Extract unique subjects & weeks for filter dropdowns
  const subjects = React.useMemo(() => {
    const set = new Set<string>()
    items.forEach((m) => {
      if (m.subject_name) set.add(m.subject_name)
    })
    return ["Semua", ...Array.from(set)]
  }, [items])

  const weeks = React.useMemo(() => {
    const set = new Set<number>()
    items.forEach((m) => {
      if (m.week_number) set.add(m.week_number)
    })
    return ["Semua", ...Array.from(set).sort((a, b) => a - b).map((w) => `Pertemuan ${w}`)]
  }, [items])

  // Filtered materials
  const filtered = React.useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchSubject = selectedSubject === "Semua" || item.subject_name === selectedSubject
      const matchWeek =
        selectedWeek === "Semua" || `Pertemuan ${item.week_number}` === selectedWeek

      return matchSearch && matchSubject && matchWeek
    })
  }, [items, searchQuery, selectedSubject, selectedWeek])

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "Dokumen PDF"
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedSubject("Semua")
    setSelectedWeek("Semua")
  }

  // AI Summarizer Handler
  const handleGenerateAISummary = async () => {
    if (!previewMaterial) return
    setIsSummarizing(true)
    try {
      const res = await fetch("/api/ai/summarize-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: previewMaterial.title,
          subject_name: previewMaterial.subject_name,
          description: previewMaterial.description,
          file_name: previewMaterial.file_name,
          file_url: previewMaterial.file_url,
          week_number: previewMaterial.week_number,
        }),
      })

      const data = await res.json()
      if (data.summary) {
        const newNotes = { ...studyNotes, [previewMaterial.id]: data.summary }
        setStudyNotes(newNotes)
        localStorage.setItem("prakom_study_notes", JSON.stringify(newNotes))
        setReaderTab("notes")
        setNoteViewMode("rendered")
      }
    } catch {
      // Fallback
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCopyNotes = () => {
    if (!previewMaterial) return
    const text = studyNotes[previewMaterial.id] || ""
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedNote(true)
    setTimeout(() => setCopiedNote(false), 2500)
  }

  const handleClearNotes = () => {
    if (!previewMaterial) return
    if (confirm("Apakah Anda yakin ingin mengosongkan catatan belajar modul ini?")) {
      const newNotes = { ...studyNotes, [previewMaterial.id]: "" }
      setStudyNotes(newNotes)
      localStorage.setItem("prakom_study_notes", JSON.stringify(newNotes))
    }
  }

  return (
    <section className="space-y-6">
      {/* 1. Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[16px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] border border-[#34c759]/30 px-3 py-0.5 text-xs font-semibold">
                <FileText className="h-3.5 w-3.5 text-[#34c759]" strokeWidth={2} />
                <span>Pustaka Bahan Ajar 120 JP</span>
              </span>
              <span className="rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-2.5 py-0.5 text-xs font-semibold">
                Akses Instan 24 Jam
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
              Pustaka Modul Bahan Ajar PDF & <br className="hidden sm:block" />
              <span className="text-[#007aff] dark:text-[#60a5fa]">AI Ringkasan Belajar.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
              Seluruh modul pelatihan fungsional 120 JP telah diarsipkan lengkap. Baca langsung di browser dengan PDF Reader responsif, buat rangkuman otomatis dengan asisten AI, dan simpan catatan belajar pribadi Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <span className="rounded-full bg-[#f6f5f4] dark:bg-[#141b27] px-3.5 py-1.5 text-xs font-semibold text-[#31302e] dark:text-[#cbd5e1] border border-[#e6e6e6] dark:border-white/10 shadow-2xs">
              Total {items.length} Modul Resmi
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Filter & Search Controls */}
      <div className="rounded-[12px] bg-white dark:bg-[#151c28] p-3 sm:p-4 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="relative sm:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#615d59]" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul modul / mata kuliah..."
              className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] pl-9 pr-3 text-xs font-normal text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#007aff] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-3.5 text-xs font-medium text-[#31302e] dark:text-[#cbd5e1] focus:border-[#007aff] focus:outline-none cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === "Semua" ? "📚 Semua Mata Kuliah" : sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-3.5 text-xs font-medium text-[#31302e] dark:text-[#cbd5e1] focus:border-[#007aff] focus:outline-none cursor-pointer"
            >
              {weeks.map((wk) => (
                <option key={wk} value={wk}>
                  {wk === "Semua" ? "📅 Semua Pertemuan" : wk}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Module Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[14px] bg-white dark:bg-[#141b27] p-10 text-center border border-dashed border-[#e6e6e6] dark:border-white/10 space-y-2.5">
          <FileText className="mx-auto h-10 w-10 text-[#615d59] dark:text-slate-500" strokeWidth={1.5} />
          <h4 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white">Tidak Ada Modul yang Sesuai</h4>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8] max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter tahapan diklat dan minggu pertemuan.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1f283a] px-4 py-2 text-xs font-semibold text-[#000000] dark:text-white border border-[#e6e6e6] dark:border-white/10 hover:bg-[#e6e6e6] dark:hover:bg-[#28354d] transition cursor-pointer"
            onClick={resetFilters}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Reset Filter</span>
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="group flex flex-col justify-between rounded-[14px] bg-white dark:bg-[#141b27] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/60 shadow-2xs transition-all duration-200"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] px-3 py-0.5 text-[10px] font-semibold border border-[#34c759]/30">
                    Pertemuan {item.week_number}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-[#615d59] dark:text-[#94a3b8]">
                    {formatFileSize(item.file_size)}
                  </span>
                </div>

                <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs font-semibold text-[#007aff] dark:text-[#60a5fa]">{item.subject_name}</p>
                <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                  {item.description || "Modul kurikulum 120 JP Fungsional Pranata Komputer Keahlian."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#e6e6e6] dark:border-white/10 pt-3.5 mt-4 text-xs text-[#615d59] dark:text-[#94a3b8] gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleMaterialRead(item.id, e)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition border cursor-pointer ${
                      readMaterialIds.includes(item.id)
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                        : "bg-slate-100 dark:bg-[#1f283a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                    }`}
                    title={readMaterialIds.includes(item.id) ? "Klik untuk tandai belum dibaca" : "Klik untuk tandai sudah dibaca"}
                  >
                    <Check className={`h-3 w-3 ${readMaterialIds.includes(item.id) ? "text-emerald-600 dark:text-emerald-400" : "opacity-40"}`} />
                    <span>{readMaterialIds.includes(item.id) ? "Selesai Dibaca" : "Tandai Dibaca"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-[#f6f5f4] dark:bg-[#1f283a] px-3.5 py-1.5 text-xs font-semibold text-[#000000] dark:text-white border border-[#e6e6e6] dark:border-white/10 hover:bg-[#e6e6e6] dark:hover:bg-[#28354d] transition shadow-2xs cursor-pointer"
                    onClick={() => {
                      setPreviewMaterial(item)
                      setReaderTab("pdf")
                      markMaterialAsRead(item.id)
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                    <span>Baca Modul</span>
                  </button>
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={item.file_name}
                    onClick={() => markMaterialAsRead(item.id)}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      <span>Unduh</span>
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 4. Modal PDF Preview & Personal Study Notes with AI Summarizer */}
      {previewMaterial && (
        <Modal
          isOpen={Boolean(previewMaterial)}
          onClose={() => setPreviewMaterial(null)}
          title={previewMaterial.title}
          description={`${previewMaterial.subject_name} • Modul Bahan Ajar (Prakom 625)`}
          className="max-w-6xl h-[94vh] flex flex-col p-0 overflow-hidden"
          bodyClassName="p-0 flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 bg-[#FAFBFD] dark:bg-[#161B26] shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReaderTab("pdf")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    readerTab === "pdf"
                      ? "bg-[#18181B] dark:bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                      ? "bg-[#0D3830] dark:bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#A7F3D0]" />
                  <span>Catatan & AI Rangkuman</span>
                  {studyNotes[previewMaterial.id]?.trim() && (
                    <span className="h-2 w-2 rounded-full bg-[#FF7643]" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  disabled={isSummarizing}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#EA580C] to-[#FF7643] hover:opacity-90 px-3.5 py-1 text-xs font-black text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSummarizing ? (
                    <>
                      <Spinner size="xs" variant="white" />
                      <span>Menganalisis PDF...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>✨ Rangkum dengan AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Middle Main Content Area */}
            <div className="flex-1 min-h-0 p-2 sm:p-3 overflow-hidden flex flex-col bg-slate-100/60 dark:bg-[#0D1117]">
              {readerTab === "pdf" ? (
                <div className="flex-1 w-full h-full min-h-[350px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-inner relative">
                  
                  {/* Ultra-Clean Modern Centered Loading Progress Overlay */}
                  {isPdfLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300">
                      <div className="flex flex-col items-center text-center max-w-xs w-full bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl shadow-black/60 space-y-3">
                        {/* Animated Icon */}
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/30 text-[#FF7643]">
                          <FileText className="h-6 w-6 animate-pulse" />
                          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF7643] text-white shadow">
                            <Spinner size="xs" variant="white" />
                          </div>
                        </div>

                        {/* Title & Size */}
                        <div className="space-y-0.5">
                          <p className="text-xs sm:text-sm font-black text-white">Memuat Dokumen PDF</p>
                          <p className="text-[10px] font-mono text-slate-400 truncate max-w-[220px]">
                            {previewMaterial.file_size ? `${(previewMaterial.file_size / (1024 * 1024)).toFixed(2)} MB • ` : ""}
                            Menyiapkan Reader...
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full space-y-1 pt-0.5">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-orange-400 font-bold">{pdfLoadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${pdfLoadProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <iframe
                    src={previewMaterial.file_url}
                    onLoad={handleIframeLoad}
                    className="w-full h-full border-0 absolute inset-0"
                    title={previewMaterial.title}
                  />
                </div>
              ) : (
                <div className="flex-1 min-h-[350px] flex flex-col space-y-2">
                  {/* Notes Control Bar & View Mode Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E2433] p-3 border border-[#FFD280] dark:border-slate-700 text-xs text-[#EA580C] dark:text-amber-400 font-semibold shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNoteViewMode("rendered")}
                        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                          noteViewMode === "rendered"
                            ? "bg-white dark:bg-slate-800 text-[#0D3830] dark:text-emerald-400 shadow-2xs border border-[#FFD280] dark:border-slate-600"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        <BookMarked className="h-3.5 w-3.5" />
                        <span>Tampilan Rapi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNoteViewMode("edit")}
                        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                          noteViewMode === "edit"
                            ? "bg-white dark:bg-slate-800 text-[#0D3830] dark:text-emerald-400 shadow-2xs border border-[#FFD280] dark:border-slate-600"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Mode Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyNotes}
                        className="flex items-center gap-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        {copiedNote ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleClearNotes}
                        className="flex items-center gap-1 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Kosongkan Catatan"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Rendered Document View or Raw Textarea View */}
                  {noteViewMode === "rendered" ? (
                    <div className="flex-1 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D28] overflow-y-auto shadow-inner">
                      <RichNoteRenderer content={studyNotes[previewMaterial.id] || ""} />
                    </div>
                  ) : (
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
                      placeholder="Ketik catatan tambahan atau edit rangkuman AI di sini..."
                      className="flex-1 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] p-4 text-xs font-mono text-[#18181B] dark:text-white focus:border-[#0D824B] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E2433] focus:outline-none resize-none leading-relaxed overflow-y-auto"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Bottom Toolbar Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] p-3 sm:p-3.5 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 truncate max-w-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/50 text-[#EA580C] shrink-0 border border-orange-200 dark:border-orange-900/50">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <span className="truncate font-medium">{previewMaterial.file_name}</span>
                {previewMaterial.file_size ? (
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400 shrink-0">
                    {formatFileSize(previewMaterial.file_size)}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href={previewMaterial.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center text-xs font-bold"
                    icon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    Buka Tab Baru
                  </Button>
                </a>

                <a
                  href={previewMaterial.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={previewMaterial.file_name}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="orange"
                    size="sm"
                    className="w-full justify-center text-xs font-black shadow-md shadow-orange-500/20"
                    icon={<Download className="h-3.5 w-3.5" />}
                  >
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
