'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  Sparkles,
  FileText,
  Download,
  Copy,
  Check,
  Building2,
  Lightbulb,
  BookOpen,
  Loader2,
  Calendar,
  UserCheck,
  Zap,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  Sliders,
  RefreshCw,
  HelpCircle,
  Presentation,
  ShieldCheck,
  FileCheck2,
  Share2,
  ChevronRight,
  Info
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { MinimalistLoader } from "@/components/ui/minimalist-loader"
import { Modal } from "@/components/ui/modal"
import { exportToDocx } from "@/lib/export-docx"

const PRESET_TOPICS = [
  {
    id: "si-mantu",
    title: "Si Mantu (Sistem Monitoring Tunjangan Kinerja dan Uang Makan)",
    problem: "Penyampaian informasi tahapan pencairan hak-hak pegawai masih manual dan konvensional, menimbulkan tingginya interupsi pertanyaan berulang pada bendahara serta ketiadaan transparansi posisi berkas bagi pegawai.",
    category: "Sistem Informasi Layanan",
    satker: "Kejaksaan Negeri Soppeng"
  },
  {
    id: "backup-db",
    title: "Otomatisasi Backup & Replikasi Basis Data Perkara Tilang & CMS PTSP Satker",
    problem: "Proses pencadangan data server database di satker masih dilakukan secara manual dan rentan kehilangan data saat terjadi gangguan sistem operasional.",
    category: "Infrastruktur TI & Basis Data",
    satker: "Kejaksaan Negeri Soppeng"
  },
  {
    id: "dashboard-spbe",
    title: "Rancang Bangun Dashboard Monitoring Indeks SPBE & Logbook Pemeliharaan TIK Satker",
    problem: "Dokumentasi pemeliharaan perangkat keras dan monitoring kepatuhan domain SPBE di unit kerja belum terintegrasi secara terpusat.",
    category: "Tata Kelola TI",
    satker: "Kejaksaan Negeri Soppeng"
  },
  {
    id: "wa-bot-bb",
    title: "Sistem Notifikasi Digital Pengambilan Barang Bukti & Jadwal Sidang Berbasis Gateway API",
    problem: "Masyarakat sering mengalami keterlambatan informasi mengenai status barang bukti dan jadwal persidangan perkara tindak pidana.",
    category: "Layanan Publik & Komunikasi TI",
    satker: "Kejaksaan Negeri Soppeng"
  },
  {
    id: "security-csirt",
    title: "Penguatan Keamanan Jaringan Server Lokal & SOP Respon Tanggap Insiden Siber (CSIRT) Satker",
    problem: "Belum tersedianya standarisasi SOP penanganan insiden malware/ransomware dan kebijakan keamanan firewall jaringan lokal satker.",
    category: "Keamanan Informasi & Jaringan",
    satker: "Kejaksaan Negeri Soppeng"
  },
  {
    id: "sso-auth",
    title: "Implementasi Single Sign-On (SSO) & Manajemen Hak Akses Terpadu Staf Kejaksaan",
    problem: "Banyaknya aplikasi internal dengan kredensial login terpisah yang menyulitkan manajemen otorisasi akun pegawai dan pengawasan akses.",
    category: "Sistem Informasi Terintegrasi",
    satker: "Kejaksaan Negeri Soppeng"
  }
]

// Inline Bold/Italic/Code Formatter
function formatInline(text: string) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={idx} className="font-extrabold text-[#0D3830] dark:text-emerald-300">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={idx} className="italic text-slate-700 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={idx} className="rounded bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold border border-slate-300 dark:border-slate-700">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

// Clean Document Viewer with Markdown Table Rendering Support
function RenderPaperDocument({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed) {
      elements.push(<div key={`blank-${i}`} className="h-2" />)
      i++
      continue
    }

    // Skip raw ascii noise lines
    if (/^[+\-| ]{6,}$/.test(trimmed) || trimmed.startsWith("```")) {
      i++
      continue
    }

    // Horizontal Line / Page Break divider
    if (trimmed === "---" || trimmed === "━━━" || trimmed === "***") {
      elements.push(
        <div key={`hr-${i}`} className="my-6 flex items-center justify-center gap-3">
          <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Batas Halaman / Bagian Dokumen
          </span>
          <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
        </div>
      )
      i++
      continue
    }

    // Markdown Table Rendering (| ... |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = []
      const startIdx = i
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim())
        i++
      }

      const isSeparator = (str: string) => /^\|[\s:\-]+(\|[\s:\-]+)*\|$/.test(str)
      const combinedLower = tableLines.join(" ").toLowerCase()
      const isSignatureTable =
        combinedLower.includes("penguji") ||
        combinedLower.includes("coach") ||
        combinedLower.includes("mengetahui") ||
        combinedLower.includes("tanda tangan") ||
        combinedLower.includes("pejabat pranata komputer")
      const isIdentityTable =
        combinedLower.includes("identitas") ||
        (combinedLower.includes("nama") &&
          (combinedLower.includes("nip") || combinedLower.includes("unit kerja") || combinedLower.includes("jabatan") || combinedLower.includes("ppk")))

      if (isSignatureTable) {
        // Render clean 2-column signature layout
        const rows = tableLines.filter((r) => !isSeparator(r))
        elements.push(
          <div key={`sig-${startIdx}`} className="my-6 grid grid-cols-2 gap-6 text-center text-xs">
            {rows.map((rowStr, rIdx) => {
              const cells = rowStr.slice(1, -1).split("|").map((c) => c.trim())
              return (
                <React.Fragment key={rIdx}>
                  {cells.map((cVal, cIdx) => (
                    <div key={cIdx} className="space-y-1">
                      {cVal.split(/<br\s*\/?>/i).map((part, pIdx) => (
                        <div key={pIdx} className="leading-snug">
                          {formatInline(part.trim())}
                        </div>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              )
            })}
          </div>
        )
        continue
      }

      if (isIdentityTable) {
        // Render clean key-value identity block
        const rows = tableLines.filter((r) => !isSeparator(r))
        const contentRows = rows[0]?.toLowerCase().includes("identitas") ? rows.slice(1) : rows
        elements.push(
          <div
            key={`ident-${startIdx}`}
            className="my-4 rounded-[10px] bg-slate-50/70 dark:bg-[#121824] p-3.5 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-xs"
          >
            {contentRows.map((rowStr, rIdx) => {
              const cells = rowStr.slice(1, -1).split("|").map((c) => c.trim())
              if (cells.length < 2) return null
              return (
                <div key={rIdx} className="grid grid-cols-12 gap-2">
                  <div className="col-span-4 sm:col-span-3 font-semibold text-slate-700 dark:text-slate-300">
                    {formatInline(cells[0])}
                  </div>
                  <div className="col-span-8 sm:col-span-9 text-slate-900 dark:text-white font-medium">
                    {formatInline(cells[1].startsWith(":") ? cells[1] : `: ${cells[1]}`)}
                  </div>
                </div>
              )
            })}
          </div>
        )
        continue
      }

      // Regular Data Table
      const headerRow = tableLines[0]
      const hasSep = tableLines.length > 1 && isSeparator(tableLines[1])
      const headerCells = headerRow.slice(1, -1).split("|").map((c) => c.trim())
      const bodyLines = hasSep ? tableLines.slice(2) : tableLines.slice(1)

      elements.push(
        <div key={`table-${startIdx}`} className="my-4 overflow-x-auto rounded-[12px] border border-slate-200 dark:border-slate-700 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700">
                {headerCells.map((cell, cIdx) => (
                  <th key={cIdx} className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700 last:border-r-0 text-center">
                    {formatInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-[#151c28]">
              {bodyLines.map((rowStr, rIdx) => {
                if (isSeparator(rowStr)) return null
                const cells = rowStr.slice(1, -1).split("|").map((c) => c.trim())
                return (
                  <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    {cells.map((cVal, cIdx) => {
                      const isCheck = cVal === "✔" || cVal === "✓"
                      const isNumber = /^[0-9]+(\.[0-9]+)*$/.test(cVal)
                      return (
                        <td
                          key={cIdx}
                          className={`px-3 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${
                            isCheck
                              ? "text-center font-bold text-emerald-600 dark:text-emerald-400 text-sm"
                              : isNumber
                              ? "text-center font-medium"
                              : ""
                          }`}
                        >
                          {cVal.split(/<br\s*\/?>/i).map((part, pIdx) => (
                            <div key={pIdx}>{formatInline(part.trim())}</div>
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Chapter Header / H1 (# BAB I, # LAPORAN LABORATORIUM, # LEMBAR PENGESAHAN)
    if (trimmed.startsWith("# ")) {
      const title = trimmed.replace(/^#\s+/, "")
      let sectionId = ""
      if (/LAPORAN\s*LABORATORIUM|LEMBAR\s*PENGESAHAN/i.test(title)) sectionId = "cover"
      else if (/BAB\s*(I\b|1\b)|PENDAHULUAN/i.test(title)) sectionId = "bab-1"
      else if (/BAB\s*(II\b|2\b)|TELAAH\s*MASALAH/i.test(title)) sectionId = "bab-2"
      else if (/BAB\s*(III\b|3\b)|HASIL\s*KEGIATAN/i.test(title)) sectionId = "bab-3"
      else if (/BAB\s*(IV\b|4\b)|KENDALA/i.test(title)) sectionId = "bab-4"
      else if (/LAMPIRAN|FORMULIR/i.test(title)) sectionId = "lampiran"

      elements.push(
        <div key={`h1-${i}`} id={sectionId || undefined} className="mt-8 mb-3 pb-2 border-b-2 border-slate-200 dark:border-slate-700 scroll-mt-6 text-center">
          <h1 className="text-base sm:text-lg font-black text-[#0D3830] dark:text-emerald-400 uppercase tracking-tight">
            {formatInline(title)}
          </h1>
        </div>
      )
      i++
      continue
    }

    // Heading 2 (## PELATIHAN FUNGSIONAL, ## LAPORAN LABORATORIUM PRAKOM)
    if (trimmed.startsWith("## ")) {
      const title = trimmed.replace(/^##\s+/, "")
      elements.push(
        <h2 key={`h2-${i}`} className="text-xs sm:text-sm font-bold text-center text-slate-800 dark:text-slate-200 uppercase tracking-wide mt-2 mb-2">
          {formatInline(title)}
        </h2>
      )
      i++
      continue
    }

    // Sub-Bab / Heading 3 (### A. Latar Belakang, ### 1.1 ...)
    if (trimmed.startsWith("### ")) {
      const sub = trimmed.replace(/^###\s+/, "")
      elements.push(
        <h3 key={`h3-${i}`} className="text-xs sm:text-sm font-black text-[#007aff] dark:text-sky-400 mt-5 mb-2">
          {formatInline(sub)}
        </h3>
      )
      i++
      continue
    }

    // Sub-sub-bab / Heading 4 (#### 1. Tujuan Umum)
    if (trimmed.startsWith("#### ")) {
      const sub4 = trimmed.replace(/^####\s+/, "")
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3 mb-1 pl-1">
          {formatInline(sub4)}
        </h4>
      )
      i++
      continue
    }

    // Bullet Points (• , - , * )
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const textContent = trimmed.replace(/^([•\-\*]\s+)/, "")
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 pl-3 my-1">
          <span className="text-[#0D824B] dark:text-emerald-400 font-bold select-none mt-0.5">•</span>
          <div className="flex-1 text-slate-700 dark:text-slate-300 text-justify">{formatInline(textContent)}</div>
        </div>
      )
      i++
      continue
    }

    // Blockquote / Jawaban Taktis Sidang (> ...)
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s*/, "")
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-3 p-3.5 rounded-[12px] bg-emerald-500/10 dark:bg-emerald-500/15 border-l-4 border-emerald-600 dark:border-emerald-400 text-slate-800 dark:text-emerald-100 text-xs shadow-2xs leading-relaxed"
        >
          {formatInline(quoteText)}
        </div>
      )
      i++
      continue
    }

    // Centered Agency / Cover Text
    const isCenter =
      trimmed.includes("Kejaksaan Agung, 2026") ||
      trimmed.startsWith("**KEJAKSAAN AGUNG**") ||
      trimmed.startsWith("**BEKERJASAMA DENGAN") ||
      trimmed.startsWith("**PELATIHAN FUNGSIONAL") ||
      trimmed.startsWith("**KATEGORI KEAHLIAN") ||
      trimmed.startsWith("**JAKARTA 2026**") ||
      trimmed === "**Oleh:**" ||
      trimmed === "Oleh:" ||
      trimmed.startsWith("**NAMA") ||
      trimmed.includes("Telah diuji di depan Tim Penguji") ||
      trimmed.includes("Pada hari ") ||
      trimmed === "**Penulis**" ||
      (trimmed.startsWith("NIP. ") && i < 35)

    elements.push(
      <p key={`p-${i}`} className={`text-slate-700 dark:text-slate-300 leading-relaxed ${isCenter ? "text-center font-semibold" : "text-justify"}`}>
        {formatInline(rawLine)}
      </p>
    )
    i++
  }

  return <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">{elements}</div>
}

export function PaperGeneratorHub() {
  const [authorName, setAuthorName] = React.useState("Dewa Sinar Surya, S.Kom.")
  const [authorNip, setAuthorNip] = React.useState("200102052025051008")
  const [authorSatker, setAuthorSatker] = React.useState("Kejaksaan Negeri Soppeng")
  const [authorRank, setAuthorRank] = React.useState("Pranata Komputer Ahli Pertama")
  const [mentorName, setMentorName] = React.useState("Penguji Pelatihan, S.Kom., M.Si.")
  const [coachName, setCoachName] = React.useState("Coach Pembimbing, S.T., M.Kom.")
  const [examDate, setExamDate] = React.useState("Rabu, 30 September 2026")
  const [batchName, setBatchName] = React.useState("BATCH 02 ANGKATAN 05")

  const [topicTitle, setTopicTitle] = React.useState(PRESET_TOPICS[0].title)
  const [problemStatement, setProblemStatement] = React.useState(PRESET_TOPICS[0].problem)
  const [desiredOutcome, setDesiredOutcome] = React.useState("Terwujudnya tata kelola administrasi keuangan internal yang transparan, efisien, dan akuntabel melalui sistem monitoring mandiri secara real-time.")

  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isExportingDocx, setIsExportingDocx] = React.useState(false)
  const [generatedPaper, setGeneratedPaper] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  // AI Battery & Power System States
  const [batteryLevel, setBatteryLevel] = React.useState<number>(100)
  const [isCharging, setIsCharging] = React.useState<boolean>(false)
  const [powerMode, setPowerMode] = React.useState<"turbo" | "eco">("turbo")
  const [showBatteryModal, setShowBatteryModal] = React.useState<boolean>(false)

  // Smart Summary States
  const [activeViewTab, setActiveViewTab] = React.useState<"document" | "summary">("document")
  const [isSummarizing, setIsSummarizing] = React.useState<boolean>(false)
  const [generatedSummary, setGeneratedSummary] = React.useState<string | null>(null)
  const [copiedSummary, setCopiedSummary] = React.useState<boolean>(false)

  // Load saved profile on mount
  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem("prakom_user_name")
      const savedSatker = localStorage.getItem("prakom_user_satker")
      const savedNip = localStorage.getItem("prakom_user_nip")
      if (savedName) setAuthorName(savedName)
      if (savedSatker) setAuthorSatker(savedSatker)
      if (savedNip) setAuthorNip(savedNip)

      const savedDraft = localStorage.getItem("prakom_paper_draft")
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        if (parsed.paper) {
          setGeneratedPaper(parsed.paper)
          if (parsed.title) setTopicTitle(parsed.title)
        }
      }

      const savedBattery = localStorage.getItem("prakom_ai_battery")
      if (savedBattery) {
        const parsed = parseInt(savedBattery, 10)
        if (!isNaN(parsed) && parsed >= 15 && parsed <= 100) setBatteryLevel(parsed)
      }

      const savedPowerMode = localStorage.getItem("prakom_ai_power_mode")
      if (savedPowerMode === "turbo" || savedPowerMode === "eco") setPowerMode(savedPowerMode)

      const savedSummary = localStorage.getItem("prakom_paper_summary")
      if (savedSummary) setGeneratedSummary(savedSummary)
    } catch {
      // Ignore
    }
  }, [])

  // Battery Management Logic
  const consumeBattery = (amount: number) => {
    setBatteryLevel((prev) => {
      const nextLevel = Math.max(15, prev - amount)
      try {
        localStorage.setItem("prakom_ai_battery", nextLevel.toString())
      } catch {}
      return nextLevel
    })
  }

  const handleRecharge = () => {
    if (isCharging) return
    setIsCharging(true)
    let current = batteryLevel
    const interval = setInterval(() => {
      current += 6
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setIsCharging(false)
      }
      setBatteryLevel(current)
      try {
        localStorage.setItem("prakom_ai_battery", current.toString())
      } catch {}
    }, 45)
  }

  const handleTogglePowerMode = (mode: "turbo" | "eco") => {
    setPowerMode(mode)
    try {
      localStorage.setItem("prakom_ai_power_mode", mode)
    } catch {}
  }

  const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setTopicTitle(preset.title)
    setProblemStatement(preset.problem)
    if (preset.satker) setAuthorSatker(preset.satker)
  }

  // AI Smart Summarization (Executive Summary & Defense Prep)
  const handleSummarize = async () => {
    if (!generatedPaper && !topicTitle.trim()) {
      alert("Harap buat naskah laporan terlebih dahulu atau lengkapi judul inovasi.")
      return
    }

    setIsSummarizing(true)
    consumeBattery(powerMode === "turbo" ? 12 : 7)

    try {
      const res = await fetch("/api/ai/summarize-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperContent: generatedPaper || "",
          topicTitle,
          authorName,
          authorSatker,
          problemStatement,
          desiredOutcome,
          powerMode,
        }),
      })

      const data = await res.json()
      if (data.summary) {
        setGeneratedSummary(data.summary)
        setActiveViewTab("summary")
        try {
          localStorage.setItem("prakom_paper_summary", data.summary)
        } catch {}
      } else {
        alert(data.error || "Gagal memproses rangkuman cerdas.")
      }
    } catch (err: any) {
      alert("Kendala jaringan saat merangkum: " + err.message)
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCopySummary = () => {
    if (!generatedSummary) return
    navigator.clipboard.writeText(generatedSummary)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2500)
  }

  const handleDownloadSummaryDoc = () => {
    if (!generatedSummary) return
    const lines = generatedSummary.split("\n")
    let bodyHtml = ""
    for (const rawLine of lines) {
      const trimmed = rawLine.trim()
      if (!trimmed) {
        bodyHtml += "<p style='margin-bottom: 6pt;'></p>"
        continue
      }
      if (trimmed.startsWith("# ")) {
        bodyHtml += `<h2 style='font-size: 14pt; font-weight: bold; text-align: center; color: #0D3830; margin-top: 18pt; margin-bottom: 8pt;'>${trimmed.replace(/^#\s+/, "")}</h2>`
        continue
      }
      if (trimmed.startsWith("## ")) {
        bodyHtml += `<h3 style='font-size: 13pt; font-weight: bold; color: #1e293b; margin-top: 14pt; margin-bottom: 6pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt;'>${trimmed.replace(/^##\s+/, "")}</h3>`
        continue
      }
      if (trimmed.startsWith("### ")) {
        bodyHtml += `<h4 style='font-size: 12pt; font-weight: bold; color: #007aff; margin-top: 10pt; margin-bottom: 4pt;'>${trimmed.replace(/^###\s+/, "")}</h4>`
        continue
      }
      if (trimmed.startsWith("> ")) {
        bodyHtml += `<div style='background: #f0fdf4; border-left: 4px solid #16a34a; padding: 8pt; margin: 6pt 0; font-style: italic; color: #14532d;'>${trimmed.replace(/^>\s*/, "")}</div>`
        continue
      }
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        bodyHtml += `<p style='margin-left: 20pt; text-indent: -12pt; margin-bottom: 4pt;'>• ${trimmed.replace(/^([•\-\*]\s+)/, "")}</p>`
        continue
      }
      bodyHtml += `<p style='text-align: justify; margin-bottom: 6pt; line-height: 1.5;'>${trimmed}</p>`
    }

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Ringkasan Eksekutif & Kisi-kisi Seminar - ${topicTitle}</title>
    <style>
      @page { size: A4 portrait; margin: 25mm 25mm 25mm 25mm; }
      body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; }
    </style></head><body>`
    const footer = `</body></html>`
    const blob = new Blob(['\ufeff' + header + bodyHtml + footer], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Ringkasan_Eksekutif_Seminar_${authorSatker.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicTitle.trim() || !authorSatker.trim()) {
      alert("Harap lengkapi Judul Inovasi dan Nama Satuan Kerja.")
      return
    }

    setIsGenerating(true)
    setGeneratedPaper(null)
    consumeBattery(powerMode === "turbo" ? 18 : 10)

    try {
      const res = await fetch("/api/ai/generate-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          authorNip,
          authorSatker,
          authorRank,
          topicTitle,
          problemStatement,
          desiredOutcome,
          mentorName,
          coachName,
          examDate,
          batchName,
        })
      })

      const data = await res.json()
      if (data.paper) {
        setGeneratedPaper(data.paper)
        setActiveViewTab("document")
        try {
          localStorage.setItem("prakom_paper_draft", JSON.stringify({
            title: topicTitle,
            paper: data.paper,
            created_at: new Date().toISOString()
          }))
          localStorage.setItem("prakom_user_name", authorName)
          localStorage.setItem("prakom_user_satker", authorSatker)
          localStorage.setItem("prakom_user_nip", authorNip)
          window.dispatchEvent(new Event("storage"))
          window.dispatchEvent(new Event("prakom-progress-updated"))
        } catch {
          // Ignore
        }
      } else {
        alert(data.error || "Gagal menyusun naskah laporan. Silakan coba kembali.")
      }
    } catch (err: any) {
      alert("Terjadi kendala jaringan: " + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!generatedPaper) return
    navigator.clipboard.writeText(generatedPaper)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Native Microsoft Word (.docx) Exporter with OpenXML, Tables & 4-4-3-3 Dinas Margins
  const handleDownloadDocx = async () => {
    if (!generatedPaper) return
    try {
      setIsExportingDocx(true)
      await exportToDocx({
        title: topicTitle || "Laporan Laboratorium Pranata Komputer",
        authorName,
        authorNip,
        authorSatker,
        authorRank,
        mentorName,
        coachName,
        examDate,
        batchName,
        content: generatedPaper,
      })
    } catch (err) {
      console.error("Gagal ekspor .docx:", err)
      handleDownloadDoc()
    } finally {
      setIsExportingDocx(false)
    }
  }

  // Fallback Word Document (.doc) Exporter with HTML Tables and Margins
  const handleDownloadDoc = () => {
    if (!generatedPaper) return

    const lines = generatedPaper.split('\n')
    let bodyHtml = ""
    let i = 0

    while (i < lines.length) {
      const rawLine = lines[i]
      const trimmed = rawLine.trim()

      if (!trimmed) {
        bodyHtml += "<p style='margin-bottom: 6pt;'></p>"
        i++
        continue
      }

      // Divider / Page break
      if (trimmed === "---" || trimmed === "━━━" || trimmed === "***") {
        bodyHtml += "<div style='page-break-after: always;'></div>"
        i++
        continue
      }

      // Table parsing
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const tableLines: string[] = []
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim())
          i++
        }

        const isSeparator = (str: string) => /^\|[\s:\-]+(\|[\s:\-]+)*\|$/.test(str)
        const combinedLower = tableLines.join(' ').toLowerCase()
        const isSignatureTable =
          combinedLower.includes('penguji') ||
          combinedLower.includes('coach') ||
          combinedLower.includes('mengetahui') ||
          combinedLower.includes('tanda tangan') ||
          combinedLower.includes('pejabat pranata komputer')
        const isIdentityTable =
          combinedLower.includes('identitas') ||
          (combinedLower.includes('nama') &&
            (combinedLower.includes('nip') || combinedLower.includes('unit kerja') || combinedLower.includes('jabatan') || combinedLower.includes('ppk')))
        const isBorderless = isSignatureTable || isIdentityTable

        const headerRow = tableLines[0]
        const hasSep = tableLines.length > 1 && isSeparator(tableLines[1])
        const headerCells = headerRow.slice(1, -1).split("|").map(c => c.trim())
        const bodyRows = hasSep ? tableLines.slice(2) : tableLines.slice(1)

        if (isBorderless) {
          bodyHtml += "<table border='0' cellpadding='4' cellspacing='0' style='border-collapse: collapse; width: 100%; margin: 12pt 0; font-family: \"Times New Roman\", serif; font-size: 12pt; border: none;'>"
          bodyRows.forEach(br => {
            if (isSeparator(br)) return
            const cells = br.slice(1, -1).split("|").map(c => c.trim())
            bodyHtml += "<tr>"
            cells.forEach(c => {
              const align = isSignatureTable ? "center" : "left"
              const width = isSignatureTable ? "50%" : cells.length === 2 ? "30%" : "auto"
              const formattedCell = c.split(/<br\s*\/?>/i).map(part => 
                part.trim()
                  .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                  .replace(/\*(.*?)\*/g, "<i>$1</i>")
              ).join("<br/>")
              bodyHtml += `<td style='border: none; padding: 4pt 8pt; text-align: ${align}; vertical-align: top; width: ${width};'>${formattedCell}</td>`
            })
            bodyHtml += "</tr>"
          })
          bodyHtml += "</table>"
        } else {
          bodyHtml += "<table border='1' cellpadding='6' cellspacing='0' style='border-collapse: collapse; width: 100%; margin: 12pt 0; font-family: \"Times New Roman\", serif; font-size: 11pt; border: 1pt solid #333;'>"
          bodyHtml += "<thead><tr style='background-color: #f2f4f7; font-weight: bold; text-align: center;'>"
          headerCells.forEach(hc => {
            const formattedHc = hc.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*(.*?)\*/g, "<i>$1</i>")
            bodyHtml += `<th style='border: 1pt solid #333; padding: 6pt;'>${formattedHc}</th>`
          })
          bodyHtml += "</tr></thead><tbody>"

          bodyRows.forEach(br => {
            if (isSeparator(br)) return
            const cells = br.slice(1, -1).split("|").map(c => c.trim())
            bodyHtml += "<tr>"
            cells.forEach(c => {
              const isCenter = c === "✔" || c === "✓" || /^[0-9]+(\.[0-9]+)*$/.test(c)
              const formattedCell = c.split(/<br\s*\/?>/i).map(part => 
                part.trim()
                  .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                  .replace(/\*(.*?)\*/g, "<i>$1</i>")
              ).join("<br/>")
              bodyHtml += `<td style='border: 1pt solid #bbb; padding: 5pt; text-align: ${isCenter ? "center" : "left"};'>${formattedCell}</td>`
            })
            bodyHtml += "</tr>"
          })
          bodyHtml += "</tbody></table>"
        }
        continue
      }

      // Heading 1
      if (trimmed.startsWith("# ")) {
        const text = trimmed.replace(/^#\s+/, "")
        bodyHtml += `<h2 style='font-size: 14pt; font-weight: bold; text-align: center; color: #000; margin-top: 20pt; margin-bottom: 10pt; text-transform: uppercase;'>${text}</h2>`
        i++
        continue
      }

      // Heading 2
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace(/^##\s+/, "")
        bodyHtml += `<h3 style='font-size: 13pt; font-weight: bold; text-align: center; color: #000; margin-top: 14pt; margin-bottom: 8pt; text-transform: uppercase;'>${text}</h3>`
        i++
        continue
      }

      // Heading 3
      if (trimmed.startsWith("### ")) {
        const text = trimmed.replace(/^###\s+/, "")
        bodyHtml += `<h4 style='font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; color: #000;'>${text}</h4>`
        i++
        continue
      }

      // Heading 4
      if (trimmed.startsWith("#### ")) {
        const text = trimmed.replace(/^####\s+/, "")
        bodyHtml += `<h5 style='font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt; color: #222;'>${text}</h5>`
        i++
        continue
      }

      // Bullets
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.replace(/^([•\-\*]\s+)/, "")
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\*(.*?)\*/g, "<i>$1</i>")
        bodyHtml += `<p style='margin-left: 24pt; text-indent: -14pt; margin-bottom: 4pt; line-height: 1.5; text-align: justify;'>• ${content}</p>`
        i++
        continue
      }

      // Center paragraphs
      const isCenter =
        trimmed.includes("Kejaksaan Agung, 2026") ||
        trimmed.startsWith("**KEJAKSAAN AGUNG**") ||
        trimmed.startsWith("**BEKERJASAMA DENGAN") ||
        trimmed.startsWith("**PELATIHAN FUNGSIONAL") ||
        trimmed.startsWith("**KATEGORI KEAHLIAN") ||
        trimmed.startsWith("**JAKARTA 2026**") ||
        trimmed === "**Oleh:**" ||
        trimmed === "Oleh:" ||
        trimmed.startsWith("**NAMA") ||
        trimmed.includes("Telah diuji di depan Tim Penguji") ||
        trimmed.includes("Pada hari ") ||
        trimmed === "**Penulis**"

      const isSpecialNoIndent =
        isCenter ||
        trimmed.startsWith("Nama") ||
        trimmed.startsWith("NIP") ||
        trimmed.startsWith("Unit Kerja") ||
        trimmed.startsWith("Jabatan") ||
        trimmed.startsWith("Pangkat") ||
        trimmed.startsWith("Tanggal") ||
        trimmed.startsWith("Lokasi") ||
        trimmed.startsWith("Rencana") ||
        trimmed.startsWith("Indikator") ||
        trimmed.startsWith("Item") ||
        trimmed.startsWith("KETERANGAN") ||
        trimmed.startsWith("Tabel ") ||
        trimmed.startsWith("Gambar ") ||
        trimmed.startsWith("Lampiran ") ||
        /^[0-9]+(\.[0-9]+)*\s+/.test(trimmed) ||
        /^[a-z]\.\s+/.test(trimmed)

      const formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")

      bodyHtml += `<p style='text-align: ${isCenter ? "center" : "justify"}; margin-bottom: 6pt; line-height: 1.5; ${isSpecialNoIndent ? "" : "text-indent: 28pt;"}'>${formatted}</p>`
      i++
    }

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${topicTitle}</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 40mm 30mm 30mm 40mm; /* Atas 4cm, Kanan 3cm, Bawah 3cm, Kiri 4cm (Standar Naskah Dinas 4-4-3-3) */
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 1.5;
        color: #000000;
      }
      p {
        line-height: 1.5;
        margin-top: 0;
        margin-bottom: 6pt;
      }
      h2, h3, h4, h5 {
        font-family: 'Times New Roman', Times, serif;
        page-break-after: avoid;
      }
    </style></head><body>`
    const footer = `</body></html>`

    const source = header + bodyHtml + footer
    const blob = new Blob(['\ufeff' + source], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Laporan_Lab_Prakom_${authorSatker.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[16px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Official Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#af52de]/15 text-[#8a38b5] dark:text-[#d8b4fe] border border-[#af52de]/30 px-3 py-0.5 text-xs font-semibold">
              <GraduationCap className="h-3.5 w-3.5 text-[#af52de]" strokeWidth={2} />
              <span>Format Resmi Diklat BPS & Kejaksaan RI</span>
            </span>
            <span className="rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-2.5 py-0.5 text-xs font-semibold">
              Standar Laporan Laboratorium 4 BAB & Bukti Fisik
            </span>
          </div>

          {/* AI Battery & Power Widget */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBatteryModal(true)}
              className="group flex items-center gap-2.5 rounded-full bg-slate-100 dark:bg-[#101622] hover:bg-slate-200/80 dark:hover:bg-[#182133] border border-slate-200 dark:border-white/10 px-3 py-1.5 transition-all shadow-2xs cursor-pointer text-left"
              title="Klik untuk diagnosa daya dan kapasitas baterai AI"
            >
              {/* Battery Silhouette */}
              <div className="relative flex items-center">
                <div className="relative w-8 h-4 rounded-[3.5px] border-[1.5px] border-slate-400 dark:border-slate-500 p-[1px] bg-slate-200/80 dark:bg-slate-800 overflow-hidden flex items-center">
                  <motion.div
                    className={`h-full rounded-[1.5px] transition-all duration-300 ${
                      batteryLevel > 50
                        ? "bg-gradient-to-r from-emerald-500 to-green-400"
                        : batteryLevel > 25
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-rose-500 to-red-400"
                    }`}
                    style={{ width: `${batteryLevel}%` }}
                    animate={isCharging ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                    transition={isCharging ? { repeat: Infinity, duration: 0.7 } : undefined}
                  />
                  {isCharging && (
                    <Zap className="absolute inset-0 m-auto h-2.5 w-2.5 text-white drop-shadow animate-pulse" />
                  )}
                </div>
                {/* Positive terminal nipple */}
                <div className="w-[2px] h-[5px] bg-slate-400 dark:border-slate-500 rounded-r-[1px] -ml-[0.5px]" />
              </div>

              {/* Battery Metrics */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {batteryLevel}%
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                    powerMode === "turbo"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {powerMode === "turbo" ? "⚡ Turbo" : "🟢 Eco"}
                </span>
              </div>

              <Sliders className="h-3 w-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition" />
            </button>

            {/* Quick Recharge Button when battery drained */}
            {batteryLevel < 100 && (
              <button
                type="button"
                onClick={handleRecharge}
                disabled={isCharging}
                className="flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                title="Isi daya baterai AI kembali ke 100%"
              >
                {isCharging ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
                <span>{isCharging ? "Mengisi..." : "Isi Baterai"}</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
          AI Generator Laporan Laboratorium <br className="hidden sm:block" />
          <span className="text-[#007aff] dark:text-[#60a5fa]">Pranata Komputer Kategori Keahlian.</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed max-w-3xl">
          Bantu penyusunan naskah Laporan Laboratorium Prakom secara otomatis dan lengkap sesuai template resmi:
          Cover Luar & Dalam, Lembar Pengesahan Penguji & Coach, Bab I (Latar Belakang, Tujuan, Manfaat),
          Bab II (Telaah Masalah, Solusi TI, Tabel Pemetaan Butir BPS No. 2/2021, Gantt Chart 4 Minggu),
          Bab III (Pelaksanaan & Capaian Bukti Fisik), Bab IV (Kendala & Tindak Lanjut), serta Formulir Bukti Dukung Prakom Keahlian siap diekspor ke Word (.docx).
        </p>
      </motion.div>

      {/* Preset Inspiration Topics */}
      <div className="rounded-[14px] bg-white dark:bg-[#151c28] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-white uppercase tracking-wider">
          <Lightbulb className="h-4 w-4 text-[#ff9500]" strokeWidth={2} />
          <span>Pilih Contoh Proyek Inovasi / Topik Laboratorium Satker:</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_TOPICS.map((preset) => {
            const isSelected = topicTitle === preset.title
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col text-left p-3.5 rounded-[12px] border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#af52de]/15 border-[#af52de] shadow-xs ring-1 ring-[#af52de]"
                    : "bg-[#f6f5f4] dark:bg-[#141b27] border-[#e6e6e6] dark:border-white/10 hover:border-[#af52de]/50"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[9px] font-bold uppercase text-[#8a38b5] dark:text-[#d8b4fe] bg-white dark:bg-[#101520] px-2.5 py-0.5 rounded-full border border-[#af52de]/30">
                    {preset.category}
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-[#af52de]" strokeWidth={2} />}
                </div>
                <h4 className="text-xs font-bold text-[#000000] dark:text-white line-clamp-2 leading-snug">
                  {preset.title}
                </h4>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Grid: Form on Left, Output Paper on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleGenerate} className="rounded-[14px] bg-white dark:bg-[#151c28] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-[#000000] dark:text-white flex items-center gap-2 border-b border-[#e6e6e6] dark:border-white/10 pb-3">
              <Building2 className="h-4 w-4 text-[#af52de]" strokeWidth={2} />
              <span>Data Identitas & Satuan Kerja</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Nama Lengkap (dengan gelar):
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Dewa Sinar Surya, S.Kom."
                  className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-3.5 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                    NIP:
                  </label>
                  <input
                    type="text"
                    value={authorNip}
                    onChange={(e) => setAuthorNip(e.target.value)}
                    placeholder="200102052025051008"
                    className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-3.5 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                    Jenjang Jabatan:
                  </label>
                  <input
                    type="text"
                    value={authorRank}
                    onChange={(e) => setAuthorRank(e.target.value)}
                    placeholder="Pranata Komputer Ahli Pertama"
                    className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-3.5 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Satuan Kerja (Kejati / Kejari / Cabjari):
                </label>
                <input
                  type="text"
                  value={authorSatker}
                  onChange={(e) => setAuthorSatker(e.target.value)}
                  placeholder="Contoh: Kejaksaan Negeri Soppeng"
                  required
                  className="h-9 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-3.5 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                />
              </div>

              {/* Coach & Penguji & Seminar Date */}
              <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-white/5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  <UserCheck className="h-3.5 w-3.5 text-[#007aff]" />
                  <span>Data Pengesahan & Seminar</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Nama Penguji:</label>
                    <input
                      type="text"
                      value={mentorName}
                      onChange={(e) => setMentorName(e.target.value)}
                      placeholder="Penguji Pelatihan..."
                      className="h-8 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101520] px-2.5 text-[11px] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Nama Coach:</label>
                    <input
                      type="text"
                      value={coachName}
                      onChange={(e) => setCoachName(e.target.value)}
                      placeholder="Coach Pembimbing..."
                      className="h-8 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101520] px-2.5 text-[11px] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Hari / Tgl Uji:</label>
                    <input
                      type="text"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      placeholder="Rabu, 30 September 2026"
                      className="h-8 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101520] px-2.5 text-[11px] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Batch / Angkatan:</label>
                    <input
                      type="text"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="BATCH 02 ANGKATAN 05"
                      className="h-8 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101520] px-2.5 text-[11px] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Judul Inovasi / Kegiatan Laboratorium:
                </label>
                <textarea
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  rows={2}
                  required
                  placeholder="Ketik judul inovasi atau pilih dari inspirasi di atas..."
                  className="w-full rounded-[12px] border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] p-3 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Isu / Masalah TI Nyata yang Dihadapi di Satker:
                </label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan kondisi yang terjadi, penyebab, dan dampaknya pada pekerjaan kantor..."
                  className="w-full rounded-[12px] border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] p-3 text-xs font-medium text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Dampak / Hasil yang Diharapkan:
                </label>
                <textarea
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  rows={2}
                  placeholder="Uraikan efisiensi, akurasi, dan perbaikan layanan setelah sistem diterapkan..."
                  className="w-full rounded-[12px] border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] p-3 text-xs font-medium text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] py-2.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Spinner size="xs" variant="white" />
                  <span>Menyusun Laporan Laboratorium...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                  <span>Susun Laporan Lab Prakom Lengkap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Paper Preview */}
        <div className="lg:col-span-7">
          <div className="rounded-[14px] bg-white dark:bg-[#151c28] border border-[#e6e6e6] dark:border-white/10 shadow-xs flex flex-col h-full min-h-[550px] overflow-hidden">
            {/* Output Header Controls */}
            <div className="flex flex-col gap-2.5 border-b border-[#e6e6e6] dark:border-white/10 p-4 bg-[#f6f5f4] dark:bg-[#141b27] shrink-0">
              
              {/* Tab Switcher: Naskah Lengkap vs Rangkuman Eksekutif */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-200/70 dark:bg-[#101520] border border-slate-300/60 dark:border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveViewTab("document")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      activeViewTab === "document"
                        ? "bg-white dark:bg-[#1f283a] text-[#007aff] dark:text-sky-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Naskah Lengkap (.docx)</span>
                    {generatedPaper && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-sky-400">
                        {generatedPaper.length.toLocaleString("id-ID")} Karakter
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveViewTab("summary")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      activeViewTab === "summary"
                        ? "bg-white dark:bg-[#1f283a] text-emerald-600 dark:text-emerald-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    <span>⚡ Rangkuman Eksekutif & Sidang</span>
                    {generatedSummary && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Siap Ujian
                      </span>
                    )}
                  </button>
                </div>

                {/* Tombol Rangkum Cerdas Utama */}
                <button
                  type="button"
                  onClick={handleSummarize}
                  disabled={isSummarizing || isGenerating || (!generatedPaper && !topicTitle.trim())}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                  title="Ekstrak naskah menjadi ringkasan eksekutif 1-halaman, slide presentasi 7 menit, dan kisi-kisi pertanyaan penguji"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Merangkum Naskah...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 text-amber-300" />
                      <span>{generatedSummary ? "⚡ Perbarui Rangkuman" : "⚡ Rangkum Cerdas (Bahan Sidang)"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sub-bar: Title & Specific Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-2">
                  {activeViewTab === "document" ? (
                    <>
                      <BookOpen className="h-4 w-4 text-[#007aff]" strokeWidth={2} />
                      <span className="text-xs font-bold text-[#000000] dark:text-white">
                        Laporan Laboratorium Pranata Komputer Keahlian
                      </span>
                      {generatedPaper && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] px-2 py-0.5 rounded-full border border-[#34c759]/30">
                          <Check className="h-3 w-3" strokeWidth={2} />
                          Format Resmi Lengkap
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <Presentation className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                      <span className="text-xs font-bold text-[#000000] dark:text-white">
                        Ringkasan Eksekutif, Slide Paparan & Kisi-Kisi Sidang
                      </span>
                      {generatedSummary && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <Check className="h-3 w-3" strokeWidth={2} />
                          Defense Kit Aktif
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons for Document View */}
                {activeViewTab === "document" && generatedPaper && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-[#1f283a] text-[#000000] dark:text-white px-3 py-1.5 text-xs font-semibold border border-[#e6e6e6] dark:border-white/10 hover:bg-black/5 dark:hover:bg-[#28354d] transition shadow-2xs cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-[#16a34a]" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={2} />}
                      <span>{copied ? "Tersalin!" : "Salin"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadDoc}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1f283a] text-[#000000] dark:text-white px-3 py-1.5 text-xs font-semibold border border-[#e6e6e6] dark:border-white/10 hover:bg-black/5 dark:hover:bg-[#28354d] transition shadow-2xs cursor-pointer"
                      title="Unduh format Word 97-2003 .doc (Standar Margin Dinas 4-4-3-3)"
                    >
                      <Download className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                      <span>Unduh (.doc)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadDocx}
                      disabled={isExportingDocx}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] disabled:opacity-50 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                      title="Unduh format Office OpenXML .docx (Standar Margin Dinas 4-4-3-3)"
                    >
                      {isExportingDocx ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      <span>{isExportingDocx ? "Mengekspor..." : "Unduh (.docx Word)"}</span>
                    </button>
                  </div>
                )}

                {/* Action Buttons for Summary View */}
                {activeViewTab === "summary" && generatedSummary && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-[#1f283a] text-[#000000] dark:text-white px-3 py-1.5 text-xs font-semibold border border-[#e6e6e6] dark:border-white/10 hover:bg-black/5 dark:hover:bg-[#28354d] transition shadow-2xs cursor-pointer"
                    >
                      {copiedSummary ? <Check className="h-3.5 w-3.5 text-[#16a34a]" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={2} />}
                      <span>{copiedSummary ? "Tersalin!" : "Salin Rangkuman"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSummaryDoc}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                      title="Unduh format Ringkasan Eksekutif & Kisi-Kisi Seminar (.doc)"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      <span>Unduh Ringkasan (.doc)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Jump Pills */}
              {activeViewTab === "document" && generatedPaper && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
                  <span className="text-[10px] font-semibold text-[#615d59] dark:text-[#94a3b8] shrink-0">Navigasi Bagian:</span>
                  {[
                    { id: "cover", label: "Cover & Pengesahan" },
                    { id: "bab-1", label: "Bab I: Pendahuluan" },
                    { id: "bab-2", label: "Bab II: Telaah & Rencana TI" },
                    { id: "bab-3", label: "Bab III: Hasil & Bukti" },
                    { id: "bab-4", label: "Bab IV: Kendala & Tindak Lanjut" },
                    { id: "lampiran", label: "Lampiran & Form Bukti" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(ch.id)
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                      }}
                      className="shrink-0 px-2.5 py-0.5 rounded-full bg-white dark:bg-[#101520] hover:bg-[#af52de]/10 text-[#615d59] dark:text-[#cbd5e1] hover:text-[#af52de] font-semibold text-[10px] border border-[#e6e6e6] dark:border-white/10 transition cursor-pointer"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Output Body */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[720px] bg-white dark:bg-[#181D28] flex flex-col justify-center">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full min-h-[380px] p-4">
                  <MinimalistLoader
                    title="Menyusun Laporan Laboratorium Prakom"
                    subtitle={`Praktikum Inovasi di ${authorSatker}`}
                    steps={[
                      'Menyusun Halaman Judul Luar/Dalam & Lembar Pengesahan...',
                      'Menyusun Bab I: Latar Belakang, Tujuan, dan Manfaat...',
                      'Menyusun Bab II: Telaah Masalah & Pemetaan Butir BPS No. 2/2021...',
                      'Membuat Jadwal Gantt Chart 4 Minggu & Pelaksanaan Capaian...',
                      'Menyusun Bab III & IV: Bukti Fisik, Kendala, dan Tindak Lanjut...',
                      'Mengompilasi Formulir Bukti Dukung Prakom Keahlian...',
                    ]}
                    delayMs={0}
                    className="shadow-none border-0 bg-transparent dark:bg-transparent"
                  />
                </div>
              ) : isSummarizing ? (
                <div className="flex items-center justify-center h-full min-h-[380px] p-4">
                  <MinimalistLoader
                    title="Merangkum Cerdas Naskah Laboratorium"
                    subtitle={`Menyusun Bahan Ujian Seminar untuk ${authorName}`}
                    steps={[
                      'Mengekstrak Akar Masalah & Solusi Inovasi Utama...',
                      'Menyusun Ringkasan Eksekutif 1-Halaman & Poin Penting...',
                      'Menyusun Rancangan Slide Presentasi Seminar 7 Menit...',
                      'Merumuskan Prediksi Pertanyaan Kritis Tim Penguji Diklat...',
                      'Menyusun Rekomendasi Jawaban Taktis & Berbasis Data...',
                    ]}
                    delayMs={0}
                    className="shadow-none border-0 bg-transparent dark:bg-transparent"
                  />
                </div>
              ) : activeViewTab === "summary" ? (
                generatedSummary ? (
                  <div className="space-y-4">
                    <div className="rounded-[12px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-3.5 border border-emerald-500/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-600 text-white">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Ringkasan Eksekutif & Kisi-Kisi Seminar Evaluasi Akhir
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Disusun secara cerdas oleh AI berstandar Penguji Diklat Fungsional Prakom Kejaksaan RI.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="shrink-0 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#121824] px-3 py-1.5 rounded-full border border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition cursor-pointer"
                      >
                        {copiedSummary ? "Tersalin!" : "Salin Teks"}
                      </button>
                    </div>

                    <RenderPaperDocument content={generatedSummary} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center text-slate-400 dark:text-slate-500 space-y-3.5 p-6">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Presentation className="h-10 w-10" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Belum Ada Rangkuman Eksekutif
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Ekstrak intisari naskah 30.000 karakter ini menjadi Ringkasan Eksekutif 1-Halaman, Outline Slide Presentasi 7 Menit, dan Kisi-kisi Pertanyaan Penguji beserta Jawaban Taktis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSummarize}
                      disabled={isSummarizing || isGenerating || (!generatedPaper && !topicTitle.trim())}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="h-4 w-4 text-amber-300" />
                      <span>⚡ Ekstrak & Rangkum Cerdas Sekarang</span>
                    </button>
                  </div>
                )
              ) : generatedPaper ? (
                <RenderPaperDocument content={generatedPaper} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center text-slate-400 dark:text-slate-500 space-y-3">
                  <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-bold">Belum ada draf naskah laporan yang digenerate.</p>
                  <p className="text-[11px] max-w-xs leading-relaxed">
                    Pilih salah satu contoh topik di atas atau lengkapi data satker Anda, lalu klik tombol <strong className="text-[#007aff]">"✨ Susun Laporan Lab Prakom Lengkap"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Diagnostik & Manajemen Daya Baterai AI */}
      <Modal
        isOpen={showBatteryModal}
        onClose={() => setShowBatteryModal(false)}
        title="🔋 Status Daya & Kapasitas Baterai AI"
        description="Pantau konsumsi daya komputasi dan optimalkan kinerja AI untuk penyusunan laporan"
        className="max-w-md"
      >
        <div className="space-y-5 text-xs">
          {/* Visual Battery Gauge */}
          <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-[#101622] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center space-y-3 text-center">
            {/* Battery Box Large */}
            <div className="relative flex items-center">
              <div className="relative w-24 h-11 rounded-[8px] border-2 border-slate-400 dark:border-slate-500 p-[2.5px] bg-slate-200/90 dark:bg-slate-800 overflow-hidden flex items-center shadow-inner">
                <motion.div
                  className={`h-full rounded-[4px] transition-all duration-300 ${
                    batteryLevel > 50
                      ? "bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400"
                      : batteryLevel > 25
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "bg-gradient-to-r from-rose-500 to-red-400"
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                  animate={isCharging ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
                  transition={isCharging ? { repeat: Infinity, duration: 0.8 } : undefined}
                />
                {isCharging && (
                  <Zap className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow animate-pulse" />
                )}
              </div>
              <div className="w-[4px] h-[14px] bg-slate-400 dark:border-slate-500 rounded-r-[2px] -ml-[1px]" />
            </div>

            <div className="space-y-0.5">
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {batteryLevel}%
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {isCharging ? "⚡ Sedang Mengisi Daya Cepat..." : batteryLevel === 100 ? "Baterai 100% Supercharged (Prima)" : "Kapasitas Operasional Siap Tempur"}
              </p>
            </div>

            {/* Quick Recharge Action */}
            <button
              type="button"
              onClick={handleRecharge}
              disabled={isCharging || batteryLevel === 100}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 text-xs font-bold shadow-xs transition active:scale-98 cursor-pointer"
            >
              {isCharging ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Mengisi Baterai ke 100%...</span>
                </>
              ) : batteryLevel === 100 ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Baterai Sudah 100% Penuh</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                  <span>⚡ Isi Ulang Baterai Sekarang (Instant Recharge)</span>
                </>
              )}
            </button>
          </div>

          {/* Mode Daya Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Pilihan Mode Performa AI:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleTogglePowerMode("turbo")}
                className={`flex flex-col p-3 rounded-[12px] border text-left transition cursor-pointer ${
                  powerMode === "turbo"
                    ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500 shadow-xs"
                    : "bg-slate-50 dark:bg-[#101622] border-slate-200 dark:border-white/10 hover:border-amber-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Mode Turbo</span>
                  </span>
                  {powerMode === "turbo" && <Check className="h-3.5 w-3.5 text-amber-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Naskah lengkap 100% 4 BAB, butir BPS mendalam & kisi-kisi terperinci.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleTogglePowerMode("eco")}
                className={`flex flex-col p-3 rounded-[12px] border text-left transition cursor-pointer ${
                  powerMode === "eco"
                    ? "bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500 shadow-xs"
                    : "bg-slate-50 dark:bg-[#101622] border-slate-200 dark:border-white/10 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Mode Hemat (Eco)</span>
                  </span>
                  {powerMode === "eco" && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Generasi super kilat, hemat daya komputasi, dan langsung pada poin esensial.
                </p>
              </button>
            </div>
          </div>

          {/* Engine Specs */}
          <div className="rounded-[12px] bg-slate-100/80 dark:bg-[#121824] p-3 border border-slate-200/80 dark:border-white/5 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Model Komputasi:</span>
              <strong className="text-slate-800 dark:text-slate-200">Gemini 2.5 Flash / Groq LLM</strong>
            </div>
            <div className="flex justify-between">
              <span>Efisiensi Mesin:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">100% Optimal (Nol Latensi)</strong>
            </div>
            <div className="flex justify-between">
              <span>Standar Format:</span>
              <strong className="text-slate-800 dark:text-slate-200">Perka BPS No. 2/2021 & Diklat RI</strong>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  )
}
