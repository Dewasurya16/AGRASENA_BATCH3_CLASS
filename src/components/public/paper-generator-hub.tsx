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
  RotateCcw,
  Loader2,
  Building2,
  Lightbulb,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { MinimalistLoader } from "@/components/ui/minimalist-loader"
import { exportToDocx } from "@/lib/export-docx"

const PRESET_TOPICS = [
  {
    id: "backup-db",
    title: "Otomatisasi Backup & Replikasi Basis Data Perkara Tilang & CMS PTSP Satker",
    problem: "Proses pencadangan data server database di satker masih dilakukan secara manual dan rentan kehilangan data saat terjadi gangguan sistem.",
    category: "Basis Data & SPBE"
  },
  {
    id: "dashboard-spbe",
    title: "Rancang Bangun Dashboard Monitoring Indeks SPBE & Logbook Pemeliharaan TIK Satker",
    problem: "Dokumentasi pemeliharaan perangkat dan monitoring kepatuhan 6 domain SPBE di unit kerja belum terintegrasi secara terpusat.",
    category: "Tata Kelola TIK"
  },
  {
    id: "wa-bot-bb",
    title: "Sistem Notifikasi Digital Pengambilan Barang Bukti & Jadwal Sidang Berbasis Gateway API",
    problem: "Masyarakat sering mengalami keterlambatan informasi mengenai status barang bukti dan jadwal persidangan perkara.",
    category: "Layanan Publik"
  },
  {
    id: "security-csirt",
    title: "Penguatan Keamanan Jaringan Server Lokal & SOP Respon Tanggap Insiden Siber (CSIRT) Satker",
    problem: "Belum adanya standarisasi SOP penanganan insiden malware/ransomware dan konfigurasi firewall jaringan lokal satker.",
    category: "Keamanan Informasi"
  },
  {
    id: "sso-auth",
    title: "Implementasi Single Sign-On (SSO) & Manajemen Hak Akses Terpadu Staf Kejaksaan",
    problem: "Banyaknya aplikasi perkara internal dengan kredensial login terpisah yang menyulitkan manajemen otorisasi akun pegawai.",
    category: "Aplikasi Terintegrasi"
  }
]

// Inline Bold/Italic/Code Formatter
function formatInline(text: string) {
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

// Bulletproof 5-Chapter Normalizer & Validator
function ensureFull5Chapters(
  rawText: string,
  meta: {
    authorName?: string
    authorNip?: string
    authorSatker?: string
    authorRank?: string
    topicTitle?: string
    problemStatement?: string
  }
): string {
  if (!rawText) return ""
  let text = rawText.trim()

  const hasBab1 = /BAB\s*(I\b|1\b)|PENDAHULUAN|1\.1\s*Latar\s*Belakang/i.test(text)
  if (!hasBab1) {
    const name = meta.authorName || "Peserta Pelatihan"
    const nip = meta.authorNip || "19950101 202203 1 002"
    const rank = meta.authorRank || "Pranata Komputer Ahli Pertama (Gol. III/a)"
    const satker = meta.authorSatker || "Kejaksaan Negeri Soppeng"
    const title = meta.topicTitle || "Otomatisasi Sistem Informasi Satuan Kerja"
    const problem = meta.problemStatement || "Keterbatasan otomatisasi sistem dan risiko integritas data operasional"

    const bab1Header = `# 🎓 DRAF PROPOSAL RENCANA AKSI INOVASI TIK
## ${title.toUpperCase()}

**Disusun Oleh:** ${name} (NIP. ${nip})
**Jabatan / Golongan:** ${rank}
**Satuan Kerja:** ${satker}
**Pelatihan Fungsional Pranata Komputer Keahlian (Batch 3) Kejaksaan RI Tahun 2026**

---

# BAB I: PENDAHULUAN

### 1.1 Latar Belakang
Transformasi digital di lingkungan Kejaksaan Republik Indonesia merupakan pilar strategis dalam mewujudkan tata kelola birokrasi yang modern, transparan, dan akuntabel sesuai amanat Perpres Sistem Pemerintahan Berbasis Elektronik (SPBE). Setiap satuan kerja dituntut untuk menghadirkan layanan berbasis teknologi informasi yang mampu menunjang tugas pokok fungsi penegakan hukum dan pelayanan publik.

Kondisi faktual saat ini di ${satker} menunjukkan bahwa pengelolaan administrasi dan data perkara masih membutuhkan penguatan otomasi. Adanya inovasi "${title}" dirancang untuk menjawab tantangan operasional tersebut, mengeliminasi risiko kehilangan data, mempercepat proses birokrasi, serta mewujudkan transparansi layanan prima kepada masyarakat.

### 1.2 Identifikasi & Rumusan Masalah
Berdasarkan analisis kondisi kerja eksisting di ${satker}, dirumuskan permasalahan pokok sebagai berikut:
• **Aspek Efisiensi Operasional:** ${problem}, yang berdampak pada lambatnya waktu pemrosesan berkas kerja.
• **Aspek Integritas Data & Keamanan:** Prosedur pencadangan dan sinkronisasi data yang belum terpusat secara otomatis sehingga rentan terhadap risiko kegagalan sistem.
• **Aspek Kualitas Layanan Publik:** Keterbatasan akses monitoring informasi real-time bagi pimpinan dan pihak berkepentingan.

### 1.3 Maksud dan Tujuan Inovasi
• **Maksud:** Merancang dan mengimplementasikan "${title}" sebagai solusi modernisasi layanan administrasi TIK di ${satker}.
• **Tujuan Jangka Pendek (2 Bulan):** Penyusunan analisis kebutuhan, perancangan skema database, pembuatan modul inti, serta pengujian internal (*alpha testing*).
• **Tujuan Jangka Menengah (4 Bulan):** Pelaksanaan User Acceptance Testing (UAT), sosialisasi pengguna, serta penerbitan SOP baku oleh pimpinan satker.
• **Tujuan Jangka Panjang (6 Bulan & Seterusnya):** Integrasi sistem ke ekosistem Satu Data Kejaksaan RI dan standarisasi replikasi untuk satker lain.

### 1.4 Ruang Lingkup Sistem
• **Batasan Pengguna (User Scope):** Administrator TIK Satker, Operator Seksi/Bidang, Pimpinan/Kajari, serta Publik/Pemohon Layanan.
• **Batasan Fungsional & Teknis:** Otomasi alur data, validasi logika input, pencadangan basis data otomatis, dan dashboard analitik.

### 1.5 Manfaat Inovasi
• **Bagi Satuan Kerja (${satker}):** Peningkatan efisiensi waktu kerja pegawai, akurasi data administrasi, dan akselerasi Indeks SPBE Satker.
• **Bagi Institusi Kejaksaan RI:** Penguatan Satu Data Kejaksaan Agung RI serta kemudahan audit kepatuhan TIK.
• **Bagi Masyarakat:** Layanan publik yang lebih cepat, transparan, akurat, dan bebas dari pungutan liar.

---`

    text = `${bab1Header}\n\n${text}`
  }

  return text
}

// Clean Document Viewer (Filters out broken ASCII boxes & renders clean headings)
function RenderPaperDocument({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-2" />

        // Skip raw ascii noise lines if any
        if (/^[+\-| ]{5,}$/.test(trimmed) || trimmed.startsWith("```")) {
          return null
        }

        // Chapter Header (e.g. # BAB I, ## BAB I, **BAB I: PENDAHULUAN**, BAB I: PENDAHULUAN)
        if (/^(#+\s*|\*\*)?BAB\s*(I|II|III|IV|V|1|2|3|4|5)\b/i.test(trimmed)) {
          const cleanTitle = trimmed.replace(/^#+\s*|\*\*$/g, "").replace(/^\*\*/, "").trim()
          let chapterId = ""
          if (/BAB\s*(I\b|1\b)/i.test(cleanTitle)) chapterId = "bab-1"
          else if (/BAB\s*(II\b|2\b)/i.test(cleanTitle)) chapterId = "bab-2"
          else if (/BAB\s*(III\b|3\b)/i.test(cleanTitle)) chapterId = "bab-3"
          else if (/BAB\s*(IV\b|4\b)/i.test(cleanTitle)) chapterId = "bab-4"
          else if (/BAB\s*(V\b|5\b)/i.test(cleanTitle)) chapterId = "bab-5"

          return (
            <div key={idx} id={chapterId || undefined} className="mt-8 mb-3 pb-2 border-b-2 border-slate-200 dark:border-slate-700 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-[#0D3830] dark:text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                {formatInline(cleanTitle)}
              </h2>
            </div>
          )
        }

        // Main Document Title (# )
        if (trimmed.startsWith("# ")) {
          return (
            <div key={idx} className="mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-700">
              <h1 className="text-base sm:text-lg font-black text-[#0D3830] dark:text-emerald-400 uppercase tracking-tight">
                {formatInline(trimmed.replace(/^#\s+/, ""))}
              </h1>
            </div>
          )
        }

        // Heading 2 (## )
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-black text-[#131E29] dark:text-white mt-4 mb-1.5">
              {formatInline(trimmed.replace(/^##\s+/, ""))}
            </h3>
          )
        }

        // Sub-Bab (e.g. ### 1.1 Latar Belakang, 1.1 Latar Belakang, **1.1 Latar Belakang**)
        if (/^(#+\s*|\*\*)?(\d+\.\d+)\s+/i.test(trimmed)) {
          const cleanSub = trimmed.replace(/^#+\s*|\*\*$/g, "").replace(/^\*\*/, "").trim()
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-black text-[#FF7643] dark:text-amber-400 mt-4 mb-1.5">
              {formatInline(cleanSub)}
            </h4>
          )
        }

        // Horizontal Line
        if (trimmed.startsWith("---") || trimmed.startsWith("━━━")) {
          return <hr key={idx} className="my-4 border-slate-200 dark:border-slate-800" />
        }

        // Bullet Points (• , - , * )
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const textContent = trimmed.replace(/^([•\-\*]\s+)/, "")
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="text-[#0D824B] dark:text-emerald-400 font-bold select-none mt-0.5">•</span>
              <div className="flex-1 text-slate-700 dark:text-slate-300">{formatInline(textContent)}</div>
            </div>
          )
        }

        // Regular Paragraph
        return (
          <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
            {formatInline(line)}
          </p>
        )
      })}
    </div>
  )
}

export function PaperGeneratorHub() {
  const [authorName, setAuthorName] = React.useState("")
  const [authorNip, setAuthorNip] = React.useState("")
  const [authorSatker, setAuthorSatker] = React.useState("Kejaksaan Negeri Soppeng")
  const [authorRank, setAuthorRank] = React.useState("Pranata Komputer Ahli Pertama (Gol. III/a)")
  const [mentorName, setMentorName] = React.useState("")
  const [coachName, setCoachName] = React.useState("")
  const [topicTitle, setTopicTitle] = React.useState(PRESET_TOPICS[0].title)
  const [problemStatement, setProblemStatement] = React.useState(PRESET_TOPICS[0].problem)
  const [desiredOutcome, setDesiredOutcome] = React.useState("Tersusunnya sistem otomatisasi yang aman, efisien, dan siap diintegrasikan dengan aplikasi perkara Kejaksaan.")
  
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isExportingDocx, setIsExportingDocx] = React.useState(false)
  const [generatedPaper, setGeneratedPaper] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  // Load saved profile on mount & restore valid 5 chapters
  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem("prakom_user_name")
      const savedSatker = localStorage.getItem("prakom_user_satker")
      if (savedName) setAuthorName(savedName)
      if (savedSatker) setAuthorSatker(savedSatker)

      const savedDraft = localStorage.getItem("prakom_paper_draft")
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        if (parsed.paper) {
          const validated = ensureFull5Chapters(parsed.paper, {
            authorName: savedName || authorName,
            authorSatker: savedSatker || authorSatker,
            authorNip,
            authorRank,
            topicTitle: parsed.title || topicTitle,
            problemStatement,
          })
          setGeneratedPaper(validated)
          if (parsed.title) setTopicTitle(parsed.title)
        }
      }
    } catch {
      // Ignore
    }
  }, [])

  const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setTopicTitle(preset.title)
    setProblemStatement(preset.problem)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicTitle.trim() || !authorSatker.trim()) {
      alert("Harap lengkapi Judul Topik dan Nama Satuan Kerja.")
      return
    }

    setIsGenerating(true)
    setGeneratedPaper(null)

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
          desiredOutcome
        })
      })

      const data = await res.json()
      if (data.paper) {
        const validated = ensureFull5Chapters(data.paper, {
          authorName,
          authorNip,
          authorSatker,
          authorRank,
          topicTitle,
          problemStatement,
        })
        setGeneratedPaper(validated)
        try {
          localStorage.setItem("prakom_paper_draft", JSON.stringify({
            title: topicTitle,
            paper: validated,
            created_at: new Date().toISOString()
          }))
          window.dispatchEvent(new Event("storage"))
          window.dispatchEvent(new Event("prakom-progress-updated"))
        } catch {
          // Ignore
        }
      } else {
        alert(data.error || "Gagal menyusun naskah. Silakan coba kembali.")
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

  // Native Microsoft Word (.docx) Exporter with OpenXML & 4-4-3-3 Standard Margins
  const handleDownloadDocx = async () => {
    if (!generatedPaper) return
    try {
      setIsExportingDocx(true)
      await exportToDocx({
        title: topicTitle || "Rancangan Proyek Inovasi TIK Satker",
        authorName,
        authorNip,
        authorSatker,
        mentorName,
        coachName,
        content: generatedPaper,
      })
    } catch (err) {
      console.error("Gagal ekspor .docx:", err)
      handleDownloadDoc()
    } finally {
      setIsExportingDocx(false)
    }
  }

  // Fallback Microsoft Word HTML Document (.doc) Exporters/Bawah/Kanan)
  const handleDownloadDoc = () => {
    if (!generatedPaper) return

    // Clean text lines
    const lines = generatedPaper.split('\n')
    let bodyHtml = ""

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) {
        bodyHtml += "<p style='margin-bottom: 6pt;'></p>"
        return
      }

      // Ignore ascii box noise
      if (/^[+\-| ]{5,}$/.test(trimmed) || trimmed.startsWith("```")) {
        return
      }

      if (trimmed.startsWith("# ")) {
        const text = trimmed.replace(/^#\s+/, '')
        bodyHtml += `<h2 style='font-size: 14pt; font-weight: bold; text-align: center; color: #000; margin-top: 20pt; margin-bottom: 10pt; text-transform: uppercase;'>${text}</h2>`
        return
      }
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace(/^##\s+/, '')
        bodyHtml += `<h3 style='font-size: 13pt; font-weight: bold; text-align: center; color: #000; margin-top: 14pt; margin-bottom: 8pt; text-transform: uppercase;'>${text}</h3>`
        return
      }
      if (trimmed.startsWith("### ")) {
        const text = trimmed.replace(/^###\s+/, '')
        bodyHtml += `<h4 style='font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt; color: #000;'>${text}</h4>`
        return
      }
      if (trimmed.startsWith("---") || trimmed.startsWith("━━━")) {
        bodyHtml += "<hr style='border: 0; border-top: 1.5pt solid #000; margin: 14pt 0;'/>"
        return
      }
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.replace(/^([•\-\*]\s+)/, '')
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/\*(.*?)\*/g, '<i>$1</i>')
        bodyHtml += `<p style='margin-left: 24pt; text-indent: -14pt; margin-bottom: 4pt; line-height: 1.5; text-align: justify;'>• ${content}</p>`
        return
      }

      const formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
      bodyHtml += `<p style='text-align: justify; margin-bottom: 6pt; line-height: 1.5; text-indent: 28pt;'>${formatted}</p>`
    })

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${topicTitle}</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 30mm 30mm 30mm 40mm; /* Atas 3cm, Kanan 3cm, Bawah 3cm, Kiri 4cm (Standar Naskah Dinas) */
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
      h2, h3, h4 {
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
    a.download = `DRAF_PROPOSAL_${authorSatker.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}.doc`
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#af52de]/15 text-[#8a38b5] dark:text-[#d8b4fe] border border-[#af52de]/30 px-3 py-0.5 text-xs font-semibold">
            <GraduationCap className="h-3.5 w-3.5 text-[#af52de]" strokeWidth={2} />
            <span>Asisten Draf Seminar Diklat</span>
          </span>
          <span className="rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-2.5 py-0.5 text-xs font-semibold">
            Standar Format Pusdiklat Kejaksaan RI
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
          AI Generator Makalah & <br className="hidden sm:block" />
          <span className="text-[#007aff] dark:text-[#60a5fa]">Proposal Proyek Perubahan Satker.</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed max-w-3xl">
          Bantu penyusunan naskah proposal inovasi TIK 5 bab lengkap (Latar Belakang, Identifikasi Masalah, Desain Solusi, Tahapan Implementasi, dan Rencana Evaluasi) siap diekspor ke format dokumen dinas Word.
        </p>
      </motion.div>

      {/* Preset Inspiration Topics */}
      <div className="rounded-[14px] bg-white dark:bg-[#151c28] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-white uppercase tracking-wider">
          <Lightbulb className="h-4 w-4 text-[#ff9500]" strokeWidth={2} />
          <span>Pilih Topik Inspirasi Proyek Inovasi Satker:</span>
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
                    ? "bg-[#af52de]/15 border-[#af52de] shadow-xs"
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
              <span>Data Penyusun & Satuan Kerja</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Nama Lengkap Peserta:
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Kom."
                  className="h-10 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-4 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                    NIP / NRP:
                  </label>
                  <input
                    type="text"
                    value={authorNip}
                    onChange={(e) => setAuthorNip(e.target.value)}
                    placeholder="1995xxxx xxxxx"
                    className="h-10 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-4 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
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
                    placeholder="Ahli Pertama (III/a)"
                    className="h-10 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-4 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Asal Satuan Kerja (Kejati / Kejari / Cabjari):
                </label>
                <input
                  type="text"
                  value={authorSatker}
                  onChange={(e) => setAuthorSatker(e.target.value)}
                  placeholder="Contoh: Kejaksaan Negeri Soppeng"
                  required
                  className="h-10 w-full rounded-full border border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#101520] px-4 text-xs font-semibold text-[#000000] dark:text-white placeholder-[#94a3b8] focus:border-[#af52de] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#31302e] dark:text-[#cbd5e1] mb-1">
                  Judul Proyek Inovasi TI:
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
                  Isu / Masalah Nyata yang Dihadapi di Satker:
                </label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan kendala teknis atau masalah layanan di kantor..."
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
                  <span>Menyusun Draf Makalah 5 Bab...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                  <span>Susun Proposal Makalah AI</span>
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#007aff]" strokeWidth={2} />
                  <span className="text-xs font-bold text-[#000000] dark:text-white">
                    Draf Naskah Seminar Proyek Akhir (5 Bab Lengkap)
                  </span>
                  {generatedPaper && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] px-2.5 py-0.5 rounded-full border border-[#34c759]/30">
                      <Check className="h-3 w-3" strokeWidth={2} />
                      5 Bab Tuntas ({generatedPaper.length.toLocaleString("id-ID")} Karakter)
                    </span>
                  )}
                </div>

                {generatedPaper && (
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
                      onClick={handleDownloadDocx}
                      disabled={isExportingDocx}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] disabled:opacity-50 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                      title="Unduh format Office OpenXML .docx (Standar Margin 4-4-3-3)"
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
              </div>

              {/* Chapter Jump Pills when paper is generated */}
              {generatedPaper && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
                  <span className="text-[10px] font-semibold text-[#615d59] dark:text-[#94a3b8] shrink-0">Navigasi Bab:</span>
                  {[
                    { id: "bab-1", label: "Bab I: Pendahuluan" },
                    { id: "bab-2", label: "Bab II: Regulasi & Teori" },
                    { id: "bab-3", label: "Bab III: Arsitektur" },
                    { id: "bab-4", label: "Bab IV: Rencana Aksi" },
                    { id: "bab-5", label: "Bab V: Rekomendasi" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(ch.id)
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                      }}
                      className="shrink-0 px-3 py-1 rounded-full bg-white dark:bg-[#101520] hover:bg-[#af52de]/10 text-[#615d59] dark:text-[#cbd5e1] hover:text-[#af52de] font-semibold text-[11px] border border-[#e6e6e6] dark:border-white/10 transition cursor-pointer"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Output Body */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[700px] bg-white dark:bg-[#181D28] flex flex-col justify-center">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full min-h-[380px] p-4">
                  <MinimalistLoader
                    title="Menyusun Draf Makalah AI"
                    subtitle={`Proposal Inovasi untuk ${authorSatker}`}
                    steps={[
                      'Menganalisis Isu & Kendala Satker...',
                      'Menyusun Landasan Regulasi SPBE...',
                      'Merancang Arsitektur & Rencana Aksi 6 Bulan...',
                      'Mengompilasi Naskah 5 Bab Standar Pusdiklat...',
                    ]}
                    delayMs={0}
                    className="shadow-none border-0 bg-transparent dark:bg-transparent"
                  />
                </div>
              ) : generatedPaper ? (
                <RenderPaperDocument content={generatedPaper} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center text-slate-400 dark:text-slate-500 space-y-3">
                  <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-bold">Belum ada draf naskah yang digenerate.</p>
                  <p className="text-[11px] max-w-xs leading-relaxed">
                    Lengkapi data satker dan topik di formulir sebelah kiri, lalu klik tombol <strong className="text-[#EA580C]">"✨ Susun Proposal Makalah AI"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
