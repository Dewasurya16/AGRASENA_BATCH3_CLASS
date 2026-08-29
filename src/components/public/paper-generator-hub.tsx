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

// Clean Document Viewer (Filters out broken ASCII boxes)
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

        // Heading 1 (# ) - Title & BAB
        if (trimmed.startsWith("# ")) {
          const titleText = trimmed.replace(/^#\s+/, "")
          let chapterId = ""
          if (/BAB I\b|BAB 1\b/i.test(titleText)) chapterId = "bab-1"
          else if (/BAB II\b|BAB 2\b/i.test(titleText)) chapterId = "bab-2"
          else if (/BAB III\b|BAB 3\b/i.test(titleText)) chapterId = "bab-3"
          else if (/BAB IV\b|BAB 4\b/i.test(titleText)) chapterId = "bab-4"
          else if (/BAB V\b|BAB 5\b/i.test(titleText)) chapterId = "bab-5"

          return (
            <div key={idx} id={chapterId || undefined} className="mt-7 mb-3 pb-2 border-b-2 border-slate-200 dark:border-slate-700 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-[#0D3830] dark:text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                {formatInline(titleText)}
              </h2>
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

        // Heading 3 (### ) - Sub-Bab (e.g. 1.1 Latar Belakang)
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-black text-[#FF7643] dark:text-amber-400 mt-3.5 mb-1">
              {formatInline(trimmed.replace(/^###\s+/, ""))}
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
  const [topicTitle, setTopicTitle] = React.useState(PRESET_TOPICS[0].title)
  const [problemStatement, setProblemStatement] = React.useState(PRESET_TOPICS[0].problem)
  const [desiredOutcome, setDesiredOutcome] = React.useState("Tersusunnya sistem otomatisasi yang aman, efisien, dan siap diintegrasikan dengan aplikasi perkara Kejaksaan.")
  
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedPaper, setGeneratedPaper] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  // Load saved profile on mount
  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem("prakom_user_name")
      const savedSatker = localStorage.getItem("prakom_user_satker")
      if (savedName) setAuthorName(savedName)
      if (savedSatker) setAuthorSatker(savedSatker)
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
        setGeneratedPaper(data.paper)
      } else {
        alert(data.message || "Gagal menyusun proposal makalah.")
      }
    } catch {
      alert("Terjadi kendala koneksi ke server AI generator.")
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

  // Clean Microsoft Word Document Exporter (Standar Naskah Dinas Pusdiklat: Margin 4cm Kiri, 3cm Atas/Bawah/Kanan)
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
    <section className="space-y-5">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[14px] bg-white dark:bg-[#1B2130] p-5 sm:p-7 border border-slate-200/90 dark:border-[#2A3550] shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-3 py-0.5 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Asisten Draf Seminar Diklat</span>
          </span>
          <span className="rounded-full bg-orange-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-xs font-bold text-orange-700 dark:text-amber-300">
            Standar Format Pusdiklat Kejaksaan RI
          </span>
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          AI Generator Draf Proposal Makalah & <br className="hidden sm:block" />
          <span className="text-emerald-700 dark:text-emerald-400">Rencana Aksi Inovasi Satker</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
          Susun draf kerangka proposal inovasi teknologi informasi (5 Bab Lengkap: Pendahuluan, Regulasi SPBE, Arsitektur Sistem, Rencana Aksi 6 Bulan, dan Rekomendasi). Unduh langsung dalam format <strong>Microsoft Word (.doc)</strong> dengan standar naskah dinas resmi (Margin 4-3-3-4) untuk disempurnakan sesuai data satker Anda.
        </p>
      </motion.div>

      {/* Preset Inspiration Topics */}
      <div className="rounded-[12px] bg-white dark:bg-[#1B2130] p-4 sm:p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span>Pilih Topik Inspirasi Proyek Inovasi Satker:</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_TOPICS.map((preset) => {
            const isSelected = topicTitle === preset.title
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col text-left p-3 rounded-[8px] border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 shadow-2xs"
                    : "bg-slate-50 dark:bg-[#161B26] border-slate-200/80 dark:border-[#2A3550] hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-slate-700">
                    {preset.category}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
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
          <form onSubmit={handleGenerate} className="rounded-[12px] bg-white dark:bg-[#1B2130] p-4 sm:p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-[#2A3550] pb-2.5">
              <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Data Penyusun & Satuan Kerja</span>
            </h3>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Peserta:
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Kom."
                  className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NRP:
                  </label>
                  <input
                    type="text"
                    value={authorNip}
                    onChange={(e) => setAuthorNip(e.target.value)}
                    placeholder="1995xxxx xxxxx"
                    className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenjang Jabatan:
                  </label>
                  <input
                    type="text"
                    value={authorRank}
                    onChange={(e) => setAuthorRank(e.target.value)}
                    placeholder="Ahli Pertama (III/a)"
                    className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asal Satuan Kerja (Kejati / Kejari / Cabjari):
                </label>
                <input
                  type="text"
                  value={authorSatker}
                  onChange={(e) => setAuthorSatker(e.target.value)}
                  placeholder="Contoh: Kejaksaan Negeri Soppeng"
                  required
                  className="h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] px-3 text-xs font-bold text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Proyek Inovasi TI:
                </label>
                <textarea
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  rows={2}
                  required
                  placeholder="Ketik judul inovasi atau pilih dari inspirasi di atas..."
                  className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] p-2.5 text-xs font-bold text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isu / Masalah Nyata yang Dihadapi di Satker:
                </label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan kendala teknis atau masalah layanan di kantor..."
                  className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#181D28] p-2.5 text-xs font-medium text-[#18181B] dark:text-white focus:border-[#0D824B] focus:outline-none resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="orange"
              size="lg"
              isLoading={isGenerating}
              loadingText="Menyusun Draf Makalah 5 Bab..."
              className="w-full font-black text-xs uppercase tracking-wider shadow-md cursor-pointer justify-center"
              icon={<Sparkles className="h-4 w-4" />}
            >
              ✨ Susun Proposal Makalah AI
            </Button>
          </form>
        </div>

        {/* Output Paper Preview */}
        <div className="lg:col-span-7">
          <div className="rounded-[28px] bg-white dark:bg-[#12161F] border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[550px] overflow-hidden">
            {/* Output Header Controls */}
            <div className="flex flex-col gap-2.5 border-b border-slate-200 dark:border-slate-800 p-4 bg-[#FAFBFD] dark:bg-[#161B26] shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#0D824B] dark:text-emerald-400" />
                  <span className="text-xs font-black text-[#131E29] dark:text-white">
                    Draf Naskah Seminar Proyek Akhir (5 Bab Lengkap)
                  </span>
                  {generatedPaper && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                      <Check className="h-3 w-3" />
                      5 Bab Tuntas ({generatedPaper.length.toLocaleString("id-ID")} Karakter)
                    </span>
                  )}
                </div>

                {generatedPaper && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Tersalin!" : "Salin"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadDoc}
                      className="flex items-center gap-1.5 bg-[#0D824B] hover:bg-[#0B6B3E] text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh (.doc Word)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Chapter Jump Pills when paper is generated */}
              {generatedPaper && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">Navigasi Bab:</span>
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
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-[10.5px] border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Output Body */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[700px] bg-white dark:bg-[#181D28]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center space-y-5 p-6">
                  <div className="relative flex items-center justify-center">
                    <Spinner size="2xl" variant="amber" thickness="thin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h4 className="text-sm sm:text-base font-black text-[#131E29] dark:text-white">
                      Sedang Merancang Draf Makalah 5 Bab Lengkap...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      AI sedang menyusun Latar Belakang, Dasar Hukum SPBE, Arsitektur Sistem, dan Rencana Aksi 6 Bulan untuk <strong className="text-slate-700 dark:text-slate-300">{authorSatker}</strong>.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span>Tahap Kompilasi Dokumen Word Standar Pusdiklat</span>
                  </div>
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
