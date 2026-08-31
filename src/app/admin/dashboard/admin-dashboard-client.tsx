'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  adminSignOut,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteVisitorLog,
  clearAllVisitorLogs,
} from "@/app/admin/actions"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"
import { TEMPLATES_DATA, DocumentTemplate } from "@/components/public/templates-hub"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  BookOpen,
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  Edit,
  Pencil,
  Clock,
  CheckCircle2,
  LogOut,
  Shield,
  Layers,
  ArrowRight,
  Download,
  AlertCircle,
  Pin,
  Sparkles,
  Home,
  Bot,
  RefreshCw,
  Eye,
  Check,
  Tag,
  Loader2,
  MessageCircle,
  FileSpreadsheet,
  FileCode,
  Users,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Copy,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Database,
  Activity,
  CheckCheck,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  FolderOpen,
  ChevronLeft,
  GraduationCap,
  MessageSquare,
  ThumbsUp,
  Send,
  Lightbulb,
  Award,
  Zap,
  User,
} from "lucide-react"
import { WhatsAppShareModal } from "@/components/public/whatsapp-share-modal"
import { getScheduleDayNumber } from "@/lib/roadmap-utils"

interface VisitorLog {
  id: string
  ip: string
  local_ip?: string
  device_id?: string
  visitor_name?: string
  visitor_nip?: string
  visitor_satker?: string
  user_agent?: string
  device: string
  os: string
  browser: string
  path: string
  referrer: string
  screen?: string
  language?: string
  created_at: string
}


interface AdminDashboardClientProps {
  initialMaterials: any[]
  initialSchedules: any[]
  initialTasks: any[]
  initialAnnouncements: any[]
  initialVisitorLogs?: VisitorLog[]
  initialReports?: any[]
}

const ITEMS_PER_PAGE = 5

function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize = ITEMS_PER_PAGE,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize?: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
      <div className="font-medium text-center sm:text-left">
        Menampilkan <span className="font-bold text-slate-900">{startItem}</span> -{" "}
        <span className="font-bold text-slate-900">{endItem}</span> dari{" "}
        <span className="font-bold text-slate-900">{totalItems}</span> data (5 per halaman)
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1
            if (totalPages > 7) {
              if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pageNum} className="px-1 text-slate-300">...</span>
                }
                return null
              }
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 rounded-xl font-black text-xs transition cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export function AdminDashboardClient({
  initialMaterials,
  initialSchedules,
  initialTasks,
  initialAnnouncements,
  initialVisitorLogs = [],
  initialReports = [],
}: AdminDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "visitors" | "reports" | "materials" | "schedules" | "tasks" | "announcements" | "discussions" | "templates" | "exam_prep" | "paper_gen"
  >("overview")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  // Discussions State for Admin
  const [adminDiscussions, setAdminDiscussions] = React.useState<any[]>([])
  const [discussionSearch, setDiscussionSearch] = React.useState("")
  const [discussionTagFilter, setDiscussionTagFilter] = React.useState("all")
  const [adminReplyTextMap, setAdminReplyTextMap] = React.useState<Record<string, string>>({})
  const [isReplyingAdminMap, setIsReplyingAdminMap] = React.useState<Record<string, boolean>>({})

  // Reports State for Admin
  const [adminReports, setAdminReports] = React.useState<any[]>(initialReports || [])
  const [reportSearch, setReportSearch] = React.useState("")
  const [reportStatusFilter, setReportStatusFilter] = React.useState<"all" | "pending" | "in_progress" | "resolved">("all")
  const [reportCategoryFilter, setReportCategoryFilter] = React.useState("Semua")
  const [adminNotesTextMap, setAdminNotesTextMap] = React.useState<Record<string, string>>({})
  const [isUpdatingReportMap, setIsUpdatingReportMap] = React.useState<Record<string, boolean>>({})
  const [reportPage, setReportPage] = React.useState(1)
  const [selectedReportForModal, setSelectedReportForModal] = React.useState<any | null>(null)

  // AI Diagnostic & Live Test State
  const [isTestingAi, setIsTestingAi] = React.useState(false)
  const [aiTestPrompt, setAiTestPrompt] = React.useState("Uji kesiapan asisten AI Diklat Prakom Kejaksaan RI Batch 3")
  const [aiTestResult, setAiTestResult] = React.useState<{
    success: boolean
    latencyMs?: number
    provider?: string
    model?: string
    text?: string
    error?: string
  } | null>(null)

  const fetchDiscussions = async () => {
    try {
      const res = await fetch("/api/discussions")
      const data = await res.json()
      if (data.discussions) {
        setAdminDiscussions(data.discussions)
      }
    } catch {
      // Ignore
    }
  }

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports")
      const data = await res.json()
      if (data.reports) {
        setAdminReports(data.reports)
      }
    } catch {
      // Ignore
    }
  }

  React.useEffect(() => {
    fetchDiscussions()
    fetchReports()
  }, [])

  const handleUpdateReportStatus = async (id: string, newStatus: string, notes?: string) => {
    setIsUpdatingReportMap((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          id,
          status: newStatus,
          admin_notes: notes !== undefined ? notes : (adminNotesTextMap[id] || ""),
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const label = newStatus === "resolved" ? "Selesai" : newStatus === "in_progress" ? "Sedang Diproses" : "Pending"
        showFeedback("success", `Status laporan berhasil diubah ke '${label}'.`)
        fetchReports()
      } else {
        showFeedback("error", data.error || "Gagal memperbarui status laporan.")
      }
    } catch {
      showFeedback("error", "Terjadi gangguan saat memperbarui status laporan.")
    } finally {
      setIsUpdatingReportMap((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Hapus laporan / aspirasi ini? Data yang dihapus tidak dapat dikembalikan.")) return
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      if (res.ok) {
        showFeedback("success", "Laporan berhasil dihapus.")
        setAdminReports((prev) => prev.filter((r) => r.id !== id))
        if (selectedReportForModal?.id === id) {
          setSelectedReportForModal(null)
        }
      } else {
        showFeedback("error", "Gagal menghapus laporan.")
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan saat menghapus laporan.")
    }
  }

  const handleTestAiConnection = async () => {
    setIsTestingAi(true)
    setAiTestResult(null)
    const startTime = Date.now()
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: aiTestPrompt || "Uji kesiapan asisten AI Diklat Prakom Kejaksaan RI Batch 3" }
          ]
        })
      })
      const latencyMs = Date.now() - startTime
      const data = await res.json()
      const replyText = data.reply || data.message || data.text
      if (res.ok && replyText) {
        setAiTestResult({
          success: true,
          latencyMs,
          provider: data.provider || "openrouter/groq",
          model: data.model || "z-ai/glm-5.2:free",
          text: replyText
        })
        showFeedback("success", `AI Engine aktif & merespon dalam ${(latencyMs / 1000).toFixed(2)} detik!`)
      } else {
        setAiTestResult({
          success: false,
          latencyMs,
          error: data.error || data.message || "Gagal mendapatkan respon dari AI Engine."
        })
        showFeedback("error", data.error || "Gagal menguji AI Engine.")
      }
    } catch (err: any) {
      const latencyMs = Date.now() - startTime
      setAiTestResult({
        success: false,
        latencyMs,
        error: err.message || "Koneksi ke API AI terputus."
      })
      showFeedback("error", "Koneksi ke API AI gagal.")
    } finally {
      setIsTestingAi(false)
    }
  }

  const handleExportReportsCSV = () => {
    if (adminReports.length === 0) {
      showFeedback("error", "Belum ada data laporan untuk diekspor.")
      return
    }
    const headers = [
      "No Tiket",
      "Waktu Kirim (WIB)",
      "Nama Peserta",
      "Satker Kejaksaan",
      "Kontak WhatsApp",
      "Kategori",
      "Status Tiket",
      "Isi Laporan / Aspirasi",
      "Catatan Tindak Lanjut Admin"
    ]
    const rows = adminReports.map((r, i) => [
      `"${r.id || i + 1}"`,
      `"${r.created_at ? formatWibDate(r.created_at) : '-'}"`,
      `"${(r.name || 'Anonim').replace(/"/g, '""')}"`,
      `"${(r.satker || '-').replace(/"/g, '""')}"`,
      `"${(r.contact || '-').replace(/"/g, '""')}"`,
      `"${(r.category || '-').replace(/"/g, '""')}"`,
      `"${r.status === 'resolved' ? 'Selesai' : r.status === 'in_progress' ? 'Diproses' : 'Pending'}"`,
      `"${(r.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(r.admin_notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ])
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rekap-laporan-aspirasi-prakom-batch3-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showFeedback("success", "Rekap laporan & saran berhasil diekspor ke CSV!")
  }

  const generateWaLink = (report: any) => {
    const rawContact = (report.contact || "").replace(/[^0-9]/g, "")
    let phone = rawContact
    if (phone.startsWith("08")) phone = "628" + phone.slice(2)
    else if (phone.startsWith("8")) phone = "62" + phone

    const notes = adminNotesTextMap[report.id] || report.admin_notes || "Laporan Anda telah dicatat oleh pengurus kelas dan segera kami tindaklanjuti."

    const text = encodeURIComponent(
      `*PEMBERITAHUAN TINDAK LANJUT PUSAT BANTUAN DIKLAT PRAKOM BATCH 3*\n` +
      `Kejaksaan Republik Indonesia\n\n` +
      `Halo Rekan *${report.name || "Peserta"}* (${report.satker || "Satker Kejaksaan"}),\n\n` +
      `Menindaklanjuti tiket laporan/aspirasi yang Anda kirimkan melalui Portal Diklat Kelas:\n` +
      `📌 *Kategori:* ${report.category || "Umum"}\n` +
      `📝 *Uraian:* "${(report.message || "").slice(0, 120)}${(report.message || "").length > 120 ? "..." : ""}"\n\n` +
      `📋 *Tanggapan/Tindak Lanjut Panitia/Pengurus:*\n` +
      `${notes}\n\n` +
      `Jika ada pertanyaan lebih lanjut, silakan balas pesan ini. Tetap semangat mengikuti seluruh rangkaian Diklat! 🙏✨`
    )
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchDiscussions(),
        fetchReports(),
        router.refresh(),
      ])
      showFeedback("success", "Data berhasil disinkronisasi.")
    } catch {
      showFeedback("error", "Gagal melakukan sinkronisasi data.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleAdminReplySubmit = async (threadId: string) => {
    const text = adminReplyTextMap[threadId]?.trim()
    if (!text) return

    setIsReplyingAdminMap((prev) => ({ ...prev, [threadId]: true }))
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin_reply",
          threadId,
          authorName: "Tim Widyaiswara / Panitia Diklat",
          authorSatker: "Pusdiklat Badiklat Kejaksaan RI",
          content: text,
        }),
      })
      const data = await res.json()
      if (data.success && data.reply) {
        setAdminDiscussions((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, replies: [...t.replies, data.reply] } : t))
        )
        setAdminReplyTextMap((prev) => ({ ...prev, [threadId]: "" }))
        showFeedback("success", "Tanggapan resmi admin/widyaiswara berhasil dikirim.")
      }
    } catch {
      showFeedback("error", "Gagal mengirim tanggapan admin.")
    } finally {
      setIsReplyingAdminMap((prev) => ({ ...prev, [threadId]: false }))
    }
  }

  const handleDeleteDiscussionThread = async (threadId: string) => {
    if (!confirm("Hapus pertanyaan diskusi ini secara permanen?")) return
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_thread", threadId }),
      })
      const data = await res.json()
      if (data.success) {
        setAdminDiscussions((prev) => prev.filter((t) => t.id !== threadId))
        showFeedback("success", "Topik diskusi berhasil dihapus.")
      }
    } catch {
      showFeedback("error", "Gagal menghapus topik diskusi.")
    }
  }

  const handleDeleteDiscussionReply = async (threadId: string, replyId: string) => {
    if (!confirm("Hapus komentar balasan ini?")) return
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_reply", threadId, replyId }),
      })
      const data = await res.json()
      if (data.success) {
        setAdminDiscussions((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? { ...t, replies: t.replies.filter((r: any) => r.id !== replyId) }
              : t
          )
        )
        showFeedback("success", "Balasan komentar berhasil dihapus.")
      }
    } catch {
      showFeedback("error", "Gagal menghapus balasan.")
    }
  }

  // Filters & Search State
  const [visitorSearch, setVisitorSearch] = React.useState("")
  const [visitorDeviceFilter, setVisitorDeviceFilter] = React.useState<string>("all")
  const [copiedIp, setCopiedIp] = React.useState<string | null>(null)
  const [copiedDeviceId, setCopiedDeviceId] = React.useState<string | null>(null)


  const [materialSearch, setMaterialSearch] = React.useState("")
  const [materialTahapFilter, setMaterialTahapFilter] = React.useState("all")

  const [scheduleSearch, setScheduleSearch] = React.useState("")
  const [taskFilter, setTaskFilter] = React.useState<"all" | "completed" | "pending">("all")

  // Pagination Pages (5 per page)
  const [visitorPage, setVisitorPage] = React.useState(1)
  const [materialPage, setMaterialPage] = React.useState(1)
  const [schedulePage, setSchedulePage] = React.useState(1)
  const [taskPage, setTaskPage] = React.useState(1)
  const [announcementPage, setAnnouncementPage] = React.useState(1)

  // Upload State
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [uploadProgressStatus, setUploadProgressStatus] = React.useState<string | null>(null)
  const [uploadProgressPercent, setUploadProgressPercent] = React.useState<number>(0)
  const [uploadProgressBytes, setUploadProgressBytes] = React.useState<string>("")
  const [uploadSpeedStr, setUploadSpeedStr] = React.useState<string>("")
  const [uploadModalError, setUploadModalError] = React.useState<string | null>(null)

  // Create Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false)
  const [isWAModalOpen, setIsWAModalOpen] = React.useState(false)

  // Edit Modals & State
  const [editingSchedule, setEditingSchedule] = React.useState<any | null>(null)
  const [editingTask, setEditingTask] = React.useState<any | null>(null)
  const [editingMaterial, setEditingMaterial] = React.useState<any | null>(null)
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<any | null>(null)

  // Templates Management State
  const [customTemplates, setCustomTemplates] = React.useState<DocumentTemplate[]>([])
  const [templateSearch, setTemplateSearch] = React.useState("")
  const [templateCategoryFilter, setTemplateCategoryFilter] = React.useState<string>("Semua")
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false)
  const [editingTemplate, setEditingTemplate] = React.useState<DocumentTemplate | null>(null)
  const [previewingTemplate, setPreviewingTemplate] = React.useState<DocumentTemplate | null>(null)
  const [templateCopied, setTemplateCopied] = React.useState(false)

  const [selectedTemplateFile, setSelectedTemplateFile] = React.useState<File | null>(null)
  const [templateUploadProgress, setTemplateUploadProgress] = React.useState<number>(0)
  const [templateUploadStatus, setTemplateUploadStatus] = React.useState<string | null>(null)
  const [isUploadingTemplate, setIsUploadingTemplate] = React.useState<boolean>(false)

  // Load custom templates on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("custom_prakom_templates")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCustomTemplates(parsed)
        }
      }
    } catch {
      // Ignore
    }
  }, [])

  // All combined templates
  const allAdminTemplates = React.useMemo(() => {
    const customIds = new Set(customTemplates.map((t) => t.id))
    const defaults = TEMPLATES_DATA.filter((t) => !customIds.has(t.id))
    return [...customTemplates, ...defaults]
  }, [customTemplates])

  const filteredAdminTemplates = React.useMemo(() => {
    return allAdminTemplates.filter((item) => {
      const matchesCategory = templateCategoryFilter === "Semua" || item.category === templateCategoryFilter
      const matchesSearch =
        templateSearch === "" ||
        item.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
        item.legalReference.toLowerCase().includes(templateSearch.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(templateSearch.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [allAdminTemplates, templateCategoryFilter, templateSearch])

  const handleCreateTemplateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const title = (formData.get("title") as string)?.trim()
    const category = formData.get("category") as any
    let format = (formData.get("format") as string) || ".doc Word"
    const legalReference = (formData.get("legalReference") as string)?.trim()
    const bpsCode = (formData.get("bpsCode") as string)?.trim()
    const rawTags = (formData.get("tags") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const contentDoc = (formData.get("contentDoc") as string)?.trim()

    if (!title || !category || !legalReference) {
      showFeedback("error", "Judul, kategori, dan dasar hukum wajib diisi.")
      return
    }

    let uploadedFileUrl: string | undefined = undefined
    let uploadedFileName: string | undefined = undefined
    let uploadedFileSize: number | undefined = undefined

    // Direct Browser Upload to Supabase Storage if file attached
    if (selectedTemplateFile) {
      setIsUploadingTemplate(true)
      setTemplateUploadProgress(0)
      setTemplateUploadStatus("Mengunggah berkas template ke Supabase Storage...")

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      const sanitizedName = selectedTemplateFile.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-")
        .replace(/-+/g, "-")
      const filePath = `templates/${Date.now()}_${sanitizedName}`
      const directUploadUrl = `${supabaseUrl}/storage/v1/object/class-materials/${filePath}`
      const publicFileUrl = `${supabaseUrl}/storage/v1/object/public/class-materials/${filePath}`

      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open("POST", directUploadUrl, true)
          xhr.setRequestHeader("apikey", supabaseKey)
          xhr.setRequestHeader("Authorization", `Bearer ${supabaseKey}`)
          xhr.setRequestHeader("x-upsert", "true")
          xhr.setRequestHeader("Content-Type", selectedTemplateFile.type || "application/octet-stream")

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.min(99, Math.round((evt.loaded / evt.total) * 100))
              setTemplateUploadProgress(pct)
              setTemplateUploadStatus(`Mengunggah berkas (${pct}%)...`)
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              uploadedFileUrl = publicFileUrl
              uploadedFileName = selectedTemplateFile.name
              uploadedFileSize = selectedTemplateFile.size
              resolve()
            } else {
              reject(new Error(`Gagal upload berkas (Status: ${xhr.status})`))
            }
          }
          xhr.onerror = () => reject(new Error("Gagal terhubung ke Supabase Storage"))
          xhr.send(selectedTemplateFile)
        })

        const lowerName = selectedTemplateFile.name.toLowerCase()
        if (lowerName.endsWith(".docx")) format = ".docx Word"
        else if (lowerName.endsWith(".doc")) format = ".doc Word"
        else if (lowerName.endsWith(".pdf")) format = ".pdf PDF"
        else if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) format = ".xlsx Excel"
      } catch (err: any) {
        showFeedback("error", `Gagal mengunggah berkas: ${err?.message || "Koneksi bermasalah"}`)
        setIsUploadingTemplate(false)
        return
      } finally {
        setIsUploadingTemplate(false)
      }
    }

    const tags = rawTags
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Template Dokumen", "Kejaksaan RI"]

    const newTemplate: DocumentTemplate = {
      id: `tpl-${Date.now()}`,
      title,
      category,
      format,
      legalReference,
      bpsCode: bpsCode || undefined,
      tags,
      description: description || "Format dokumen naskah dinas resmi Kejaksaan RI.",
      contentDoc: contentDoc || (uploadedFileName ? `Dokumen lampiran resmi: ${uploadedFileName}` : ""),
      file_url: uploadedFileUrl,
      file_name: uploadedFileName,
      file_size: uploadedFileSize,
      created_at: new Date().toISOString(),
    }

    const updated = [newTemplate, ...customTemplates]
    setCustomTemplates(updated)
    try {
      localStorage.setItem("custom_prakom_templates", JSON.stringify(updated))
      window.dispatchEvent(new Event("storage"))
    } catch {
      // Ignore
    }

    setIsTemplateModalOpen(false)
    setSelectedTemplateFile(null)
    setTemplateUploadProgress(0)
    setTemplateUploadStatus(null)
    form.reset()
    showFeedback("success", `Template dokumen "${title}" berhasil diterbitkan!`)
  }

  const handleUpdateTemplateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTemplate) return
    const form = e.currentTarget
    const formData = new FormData(form)

    const title = (formData.get("title") as string)?.trim()
    const category = formData.get("category") as any
    let format = (formData.get("format") as string) || editingTemplate.format
    const legalReference = (formData.get("legalReference") as string)?.trim()
    const bpsCode = (formData.get("bpsCode") as string)?.trim()
    const rawTags = (formData.get("tags") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const contentDoc = (formData.get("contentDoc") as string)?.trim()

    if (!title || !category || !legalReference) {
      showFeedback("error", "Judul, kategori, dan dasar hukum wajib diisi.")
      return
    }

    let uploadedFileUrl = editingTemplate.file_url
    let uploadedFileName = editingTemplate.file_name
    let uploadedFileSize = editingTemplate.file_size

    if (selectedTemplateFile) {
      setIsUploadingTemplate(true)
      setTemplateUploadProgress(0)
      setTemplateUploadStatus("Mengunggah berkas pembaruan ke Supabase Storage...")

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      const sanitizedName = selectedTemplateFile.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-")
        .replace(/-+/g, "-")
      const filePath = `templates/${Date.now()}_${sanitizedName}`
      const directUploadUrl = `${supabaseUrl}/storage/v1/object/class-materials/${filePath}`
      const publicFileUrl = `${supabaseUrl}/storage/v1/object/public/class-materials/${filePath}`

      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open("POST", directUploadUrl, true)
          xhr.setRequestHeader("apikey", supabaseKey)
          xhr.setRequestHeader("Authorization", `Bearer ${supabaseKey}`)
          xhr.setRequestHeader("x-upsert", "true")
          xhr.setRequestHeader("Content-Type", selectedTemplateFile.type || "application/octet-stream")

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.min(99, Math.round((evt.loaded / evt.total) * 100))
              setTemplateUploadProgress(pct)
              setTemplateUploadStatus(`Mengunggah berkas (${pct}%)...`)
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              uploadedFileUrl = publicFileUrl
              uploadedFileName = selectedTemplateFile.name
              uploadedFileSize = selectedTemplateFile.size
              resolve()
            } else {
              reject(new Error(`Gagal upload berkas (Status: ${xhr.status})`))
            }
          }
          xhr.onerror = () => reject(new Error("Gagal terhubung ke storage"))
          xhr.send(selectedTemplateFile)
        })

        const lowerName = selectedTemplateFile.name.toLowerCase()
        if (lowerName.endsWith(".docx")) format = ".docx Word"
        else if (lowerName.endsWith(".doc")) format = ".doc Word"
        else if (lowerName.endsWith(".pdf")) format = ".pdf PDF"
        else if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) format = ".xlsx Excel"
      } catch (err: any) {
        showFeedback("error", `Gagal mengunggah berkas: ${err?.message || "Koneksi bermasalah"}`)
        setIsUploadingTemplate(false)
        return
      } finally {
        setIsUploadingTemplate(false)
      }
    }

    const tags = rawTags
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : editingTemplate.tags

    const updatedItem: DocumentTemplate = {
      ...editingTemplate,
      title,
      category,
      format,
      legalReference,
      bpsCode: bpsCode || undefined,
      tags,
      description: description || editingTemplate.description,
      contentDoc: contentDoc !== undefined ? contentDoc : editingTemplate.contentDoc,
      file_url: uploadedFileUrl,
      file_name: uploadedFileName,
      file_size: uploadedFileSize,
    }

    const exists = customTemplates.some((t) => t.id === editingTemplate.id)
    const updated = exists
      ? customTemplates.map((t) => (t.id === editingTemplate.id ? updatedItem : t))
      : [updatedItem, ...customTemplates]

    setCustomTemplates(updated)
    try {
      localStorage.setItem("custom_prakom_templates", JSON.stringify(updated))
      window.dispatchEvent(new Event("storage"))
    } catch {
      // Ignore
    }

    setEditingTemplate(null)
    setSelectedTemplateFile(null)
    setTemplateUploadProgress(0)
    setTemplateUploadStatus(null)
    showFeedback("success", `Template "${title}" berhasil diperbarui!`)
  }

  const handleDeleteTemplate = (id: string, title: string) => {
    if (!confirm(`Hapus template dokumen "${title}"?`)) return
    const updated = customTemplates.filter((t) => t.id !== id)
    setCustomTemplates(updated)
    try {
      localStorage.setItem("custom_prakom_templates", JSON.stringify(updated))
      window.dispatchEvent(new Event("storage"))
    } catch {
      // Ignore
    }
    showFeedback("success", `Template "${title}" berhasil dihapus.`)
  }

  const handleDownloadTemplateDoc = (template: DocumentTemplate) => {
    if (template.file_url) {
      const a = document.createElement("a")
      a.href = template.file_url
      a.target = "_blank"
      a.download = template.file_name || `TEMPLATE_${template.id.toUpperCase()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${template.title}</title>
    <style>
      @page { size: A4; margin: 3cm 2.5cm 2.5cm 3cm; }
      body { font-family: 'Times New Roman', serif; font-size: 11.5pt; line-height: 1.4; color: #000; }
      h1, h2, h3 { text-align: center; font-weight: bold; }
      pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 11.5pt; line-height: 1.4; }
    </style></head><body><pre>`
    const footer = `</pre></body></html>`
    const source = header + (template.contentDoc || "") + footer
    const blob = new Blob(['\ufeff' + source], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TEMPLATE_${template.id.toUpperCase()}_KEJAKSAAN.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Reset page when filter changes
  React.useEffect(() => {
    setVisitorPage(1)
  }, [visitorSearch, visitorDeviceFilter])

  React.useEffect(() => {
    setMaterialPage(1)
  }, [materialSearch, materialTahapFilter])

  React.useEffect(() => {
    setSchedulePage(1)
  }, [scheduleSearch])

  React.useEffect(() => {
    setTaskPage(1)
  }, [taskFilter])

  // --- STATS & METRICS ---
  const totalVisitors = initialVisitorLogs.length
  const uniqueIps = React.useMemo(() => {
    return new Set(initialVisitorLogs.map((v) => v.ip)).size
  }, [initialVisitorLogs])

  const todayVisitors = React.useMemo(() => {
    const todayStr = new Date().toDateString()
    return initialVisitorLogs.filter((v) => new Date(v.created_at).toDateString() === todayStr).length
  }, [initialVisitorLogs])

  const deviceStats = React.useMemo(() => {
    const counts = { Desktop: 0, Mobile: 0, Tablet: 0, Bot: 0 }
    initialVisitorLogs.forEach((v) => {
      const dev = v.device || "Desktop"
      if (dev.includes("Mobile")) counts.Mobile++
      else if (dev.includes("Tablet")) counts.Tablet++
      else if (dev.includes("Bot")) counts.Bot++
      else counts.Desktop++
    })
    const total = initialVisitorLogs.length || 1
    return {
      desktop: counts.Desktop,
      desktopPct: Math.round((counts.Desktop / total) * 100),
      mobile: counts.Mobile,
      mobilePct: Math.round((counts.Mobile / total) * 100),
      tablet: counts.Tablet,
      tabletPct: Math.round((counts.Tablet / total) * 100),
      bot: counts.Bot,
    }
  }, [initialVisitorLogs])

  const completedTasksCount = initialTasks.filter((t) => t.status === "completed").length
  const totalMaterialSizeMB = initialMaterials.reduce((acc, m) => acc + (m.file_size || 0), 0) / (1024 * 1024)

  // --- FILTERED & PAGINATED DATA LISTS (5 PER PAGE) ---
  const filteredVisitorLogs = React.useMemo(() => {
    return initialVisitorLogs.filter((log) => {
      const q = visitorSearch.toLowerCase().trim()
      const matchesSearch =
        q === "" ||
        (log.ip || "").toLowerCase().includes(q) ||
        (log.local_ip || "").toLowerCase().includes(q) ||
        (log.device_id || "").toLowerCase().includes(q) ||
        (log.visitor_name || "").toLowerCase().includes(q) ||
        (log.visitor_nip || "").toLowerCase().includes(q) ||
        (log.visitor_satker || "").toLowerCase().includes(q) ||
        (log.path || "").toLowerCase().includes(q) ||
        (log.browser || "").toLowerCase().includes(q) ||
        (log.os || "").toLowerCase().includes(q) ||
        (log.referrer || "").toLowerCase().includes(q)

      const matchesDevice =
        visitorDeviceFilter === "all" ||
        (log.device || "").toLowerCase() === visitorDeviceFilter.toLowerCase()

      return matchesSearch && matchesDevice
    })
  }, [initialVisitorLogs, visitorSearch, visitorDeviceFilter])


  const totalVisitorPages = Math.ceil(filteredVisitorLogs.length / ITEMS_PER_PAGE) || 1
  const paginatedVisitorLogs = React.useMemo(() => {
    const start = (visitorPage - 1) * ITEMS_PER_PAGE
    return filteredVisitorLogs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredVisitorLogs, visitorPage])

  const filteredMaterials = React.useMemo(() => {
    return initialMaterials.filter((m) => {
      const matchesSearch =
        materialSearch === "" ||
        (m.title || "").toLowerCase().includes(materialSearch.toLowerCase()) ||
        (m.subject_name || "").toLowerCase().includes(materialSearch.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(materialSearch.toLowerCase())
      const matchesTahap =
        materialTahapFilter === "all" ||
        (m.subject_name || "").toLowerCase().includes(materialTahapFilter.toLowerCase())
      return matchesSearch && matchesTahap
    })
  }, [initialMaterials, materialSearch, materialTahapFilter])

  const totalMaterialPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE) || 1
  const paginatedMaterials = React.useMemo(() => {
    const start = (materialPage - 1) * ITEMS_PER_PAGE
    return filteredMaterials.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredMaterials, materialPage])

  const filteredSchedules = React.useMemo(() => {
    return initialSchedules.filter((s) => {
      return (
        scheduleSearch === "" ||
        (s.subject_name || "").toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        (s.lecturer || "").toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        (s.day || "").toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        (s.room || "").toLowerCase().includes(scheduleSearch.toLowerCase())
      )
    })
  }, [initialSchedules, scheduleSearch])

  const totalSchedulePages = Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE) || 1
  const paginatedSchedules = React.useMemo(() => {
    const start = (schedulePage - 1) * ITEMS_PER_PAGE
    return filteredSchedules.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredSchedules, schedulePage])

  const filteredTasks = React.useMemo(() => {
    return initialTasks.filter((t) => {
      if (taskFilter === "completed") return t.status === "completed"
      if (taskFilter === "pending") return t.status !== "completed"
      return true
    })
  }, [initialTasks, taskFilter])

  const totalTaskPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE) || 1
  const paginatedTasks = React.useMemo(() => {
    const start = (taskPage - 1) * ITEMS_PER_PAGE
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredTasks, taskPage])

  const totalAnnouncementPages = Math.ceil(initialAnnouncements.length / ITEMS_PER_PAGE) || 1
  const paginatedAnnouncements = React.useMemo(() => {
    const start = (announcementPage - 1) * ITEMS_PER_PAGE
    return initialAnnouncements.slice(start, start + ITEMS_PER_PAGE)
  }, [initialAnnouncements, announcementPage])

  // --- REPORTS FILTER & METRICS ---
  const pendingReportsCount = React.useMemo(() => {
    return adminReports.filter((r) => !r.status || r.status === "pending").length
  }, [adminReports])

  const inProgressReportsCount = React.useMemo(() => {
    return adminReports.filter((r) => r.status === "in_progress").length
  }, [adminReports])

  const resolvedReportsCount = React.useMemo(() => {
    return adminReports.filter((r) => r.status === "resolved").length
  }, [adminReports])

  const filteredReports = React.useMemo(() => {
    return adminReports.filter((r) => {
      const q = reportSearch.toLowerCase().trim()
      const matchesSearch =
        q === "" ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.satker || "").toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q) ||
        (r.contact || "").toLowerCase().includes(q) ||
        (r.message || "").toLowerCase().includes(q) ||
        (r.admin_notes || "").toLowerCase().includes(q)

      const status = r.status || "pending"
      const matchesStatus = reportStatusFilter === "all" || status === reportStatusFilter
      const matchesCategory = reportCategoryFilter === "Semua" || (r.category || "") === reportCategoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [adminReports, reportSearch, reportStatusFilter, reportCategoryFilter])

  const totalReportPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE) || 1
  const paginatedReports = React.useMemo(() => {
    const start = (reportPage - 1) * ITEMS_PER_PAGE
    return filteredReports.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredReports, reportPage])

  // --- ACTIONS ---
  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip)
    setCopiedIp(ip)
    setTimeout(() => setCopiedIp(null), 2000)
  }

  const handleCopyDeviceId = (deviceId: string) => {
    navigator.clipboard.writeText(deviceId)
    setCopiedDeviceId(deviceId)
    setTimeout(() => setCopiedDeviceId(null), 2000)
  }

  const handleExportVisitorsJSON = () => {
    const blob = new Blob([JSON.stringify(initialVisitorLogs, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `visitor-logs-prakom-batch3-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showFeedback("success", "Data log pengunjung berhasil diekspor ke JSON!")
  }

  const handleExportVisitorsCSV = () => {
    if (initialVisitorLogs.length === 0) {
      showFeedback("error", "Belum ada data pengunjung untuk diekspor.")
      return
    }
    const headers = [
      "Waktu Akses",
      "Nama Peserta",
      "NIP",
      "Satker Kejaksaan",
      "Device ID",
      "IP Publik",
      "IP Lokal (LAN)",
      "Media Akses",
      "OS",
      "Browser",
      "Halaman (Path)",
      "Referrer",
      "Resolusi Layar",
    ]
    const rows = initialVisitorLogs.map((v) => [
      `"${formatWibDate(v.created_at)}"`,
      `"${(v.visitor_name || "-").replace(/"/g, '""')}"`,
      `"${(v.visitor_nip || "-").replace(/"/g, '""')}"`,
      `"${(v.visitor_satker || "-").replace(/"/g, '""')}"`,
      `"${(v.device_id || "-").replace(/"/g, '""')}"`,
      `"${v.ip || "-"}"`,
      `"${v.local_ip || "-"}"`,
      `"${v.device || "-"}"`,
      `"${v.os || "-"}"`,
      `"${v.browser || "-"}"`,
      `"${v.path || "-"}"`,
      `"${(v.referrer || "-").replace(/"/g, '""')}"`,
      `"${v.screen || "-"}"`,
    ])
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `visitor-logs-prakom-batch3-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showFeedback("success", "Data log pengunjung berhasil diekspor ke CSV!")
  }


  const handleDeleteVisitor = async (id: string) => {
    if (!confirm("Hapus baris riwayat pengunjung ini?")) return
    setIsLoading(true)
    try {
      const res = await deleteVisitorLog(id)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Log riwayat pengunjung berhasil dihapus.")
        router.refresh()
      }
    } catch {
      showFeedback("error", "Gagal menghapus log pengunjung.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAllVisitors = async () => {
    if (!confirm("PERINGATAN: Yakin ingin membersihkan seluruh data riwayat kunjungan pengunjung?")) return
    setIsLoading(true)
    try {
      const res = await clearAllVisitorLogs()
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Semua riwayat pengunjung berhasil dibersihkan.")
        router.refresh()
      }
    } catch {
      showFeedback("error", "Gagal membersihkan data pengunjung.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportJSON = () => {
    const backupData = {
      materials: initialMaterials,
      schedules: initialSchedules,
      tasks: initialTasks,
      announcements: initialAnnouncements,
      visitorLogs: initialVisitorLogs,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backup-diklat-prakom-batch3-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showFeedback("success", "Berkas backup data (JSON) berhasil diunduh!")
  }

  // --- CRUD: MATERIALS ---
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadModalError(null)

    if (!selectedFile) {
      setUploadModalError("Silakan pilih berkas PDF terlebih dahulu.")
      return
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1)
      setUploadModalError(
        `Ukuran berkas (${sizeMB} MB) melebihi batas 100MB. Silakan kompres PDF terlebih dahulu.`
      )
      return
    }

    const formElement = e.currentTarget
    const formData = new FormData(formElement)
    const title = (formData.get("title") as string)?.trim()
    const subject_name = (formData.get("subject_name") as string)?.trim()
    const week_number = Number(formData.get("week_number")) || 1
    const description = (formData.get("description") as string)?.trim()

    if (!title || !subject_name) {
      setUploadModalError("Judul modul dan tahapan diklat wajib diisi.")
      return
    }

    setIsLoading(true)
    setUploadProgressPercent(0)
    setUploadProgressBytes("")
    setUploadSpeedStr("")
    setUploadProgressStatus("Menghubungkan langsung ke Supabase Storage...")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    // Clean & sanitize file name
    const sanitizedName = selectedFile.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/-+/g, "-")
    const filePath = `materials/${Date.now()}_${sanitizedName}`

    // 1. Direct Browser Upload to Supabase Storage endpoint (bypasses Vercel/Next.js body size limit entirely!)
    const directUploadUrl = `${supabaseUrl}/storage/v1/object/class-materials/${filePath}`
    const publicFileUrl = `${supabaseUrl}/storage/v1/object/public/class-materials/${filePath}`

    const xhr = new XMLHttpRequest()
    xhr.open("POST", directUploadUrl, true)
    xhr.setRequestHeader("apikey", supabaseKey)
    xhr.setRequestHeader("Authorization", `Bearer ${supabaseKey}`)
    xhr.setRequestHeader("x-upsert", "true")
    xhr.setRequestHeader("Content-Type", selectedFile.type || "application/pdf")

    const startTime = Date.now()

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100))
        setUploadProgressPercent(percent)

        const loadedMB = (event.loaded / (1024 * 1024)).toFixed(1)
        const totalMB = (event.total / (1024 * 1024)).toFixed(1)
        setUploadProgressBytes(`${loadedMB} MB / ${totalMB} MB`)

        const elapsedSec = (Date.now() - startTime) / 1000
        if (elapsedSec > 0.3) {
          const speed = (event.loaded / (1024 * 1024) / elapsedSec).toFixed(1)
          setUploadSpeedStr(`${speed} MB/s`)
        }

        if (percent >= 99) {
          setUploadProgressStatus("Menyimpan metadata modul ke database...")
        } else {
          setUploadProgressStatus(`Mengunggah berkas ke Supabase (${percent}%)...`)
        }
      }
    }

    const saveMetadataToDatabase = async (fileUrl: string) => {
      setUploadProgressStatus("Menyimpan informasi modul ke database...")
      try {
        const res = await fetch("/api/materials/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subject_name,
            week_number,
            description,
            file_url: fileUrl,
            file_name: selectedFile.name,
            file_size: selectedFile.size,
            file_type: selectedFile.type || "application/pdf",
          }),
        })

        const data = await res.json()
        if (data.success) {
          setUploadProgressPercent(100)
          showFeedback("success", data.message || "Modul PDF berhasil diunggah!")
          setIsUploadModalOpen(false)
          setSelectedFile(null)
          setUploadModalError(null)
          setUploadProgressStatus(null)
          router.refresh()
        } else {
          setUploadModalError(data.error || "Gagal menyimpan metadata ke database.")
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menyimpan metadata."
        setUploadModalError("Berkas berhasil terunggah, tetapi gagal menyimpan metadata: " + msg)
      } finally {
        setIsLoading(false)
      }
    }

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Uploaded successfully directly to Supabase Storage!
        await saveMetadataToDatabase(publicFileUrl)
      } else {
        // Fallback using Supabase JS SDK
        try {
          setUploadProgressStatus("Mencoba jalur cadangan Supabase SDK...")
          const supabase = createBrowserSupabaseClient()
          const { error: sdkError } = await supabase.storage
            .from("class-materials")
            .upload(filePath, selectedFile, {
              cacheControl: "3600",
              upsert: true,
              contentType: selectedFile.type || "application/pdf",
            })

          if (sdkError) {
            setIsLoading(false)
            setUploadModalError(
              `Gagal mengunggah ke Supabase Storage (${sdkError.message}). Pastikan bucket 'class-materials' tersedia dengan status Public.`
            )
          } else {
            const { data: pubData } = supabase.storage
              .from("class-materials")
              .getPublicUrl(filePath)
            await saveMetadataToDatabase(pubData.publicUrl)
          }
        } catch (err: unknown) {
          setIsLoading(false)
          const msg = err instanceof Error ? err.message : "Error"
          setUploadModalError(`Gagal mengunggah berkas: ${msg}`)
        }
      }
    }

    xhr.onerror = async () => {
      // Fallback via Supabase SDK
      try {
        setUploadProgressStatus("Mencoba jalur cadangan Supabase SDK...")
        const supabase = createBrowserSupabaseClient()
        const { error: sdkError } = await supabase.storage
          .from("class-materials")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: selectedFile.type || "application/pdf",
          })

        if (sdkError) {
          setIsLoading(false)
          setUploadModalError("Koneksi gagal: " + sdkError.message)
        } else {
          const { data: pubData } = supabase.storage
            .from("class-materials")
            .getPublicUrl(filePath)
          await saveMetadataToDatabase(pubData.publicUrl)
        }
      } catch (err: unknown) {
        setIsLoading(false)
        const msg = err instanceof Error ? err.message : "Error"
        setUploadModalError("Gagal mengunggah berkas: " + msg)
      }
    }

    xhr.ontimeout = () => {
      setIsLoading(false)
      setUploadModalError("Waktu unggah habis (timeout). Silakan periksa koneksi internet Anda.")
    }

    xhr.timeout = 300000 // 5 minutes
    xhr.send(selectedFile)
  }

  const handleUpdateMaterialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await updateMaterial(formData)
      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setEditingMaterial(null)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui materi."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMaterial = async (id: string, fileName?: string) => {
    if (!confirm("Yakin ingin menghapus materi ini dari database Supabase?")) return
    setIsLoading(true)
    try {
      const res = await deleteMaterial(id, fileName)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Materi berhasil dihapus dari database.")
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus materi."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // --- CRUD: SCHEDULES ---
  const handleCreateScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await createSchedule(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setIsScheduleModalOpen(false)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan jadwal baru."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await updateSchedule(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setEditingSchedule(null)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui jadwal."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Yakin ingin menghapus sesi jadwal ini?")) return
    setIsLoading(true)
    try {
      const res = await deleteSchedule(id)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Sesi jadwal berhasil dihapus.")
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus jadwal."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // --- CRUD: TASKS ---
  const handleCreateTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await createTask(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setIsTaskModalOpen(false)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan tugas baru."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await updateTask(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setEditingTask(null)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui tugas."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTaskStatus = async (id: string, currentStatus: string) => {
    const nextStatus: "todo" | "completed" = currentStatus === "completed" ? "todo" : "completed"
    setIsLoading(true)
    try {
      const res = await updateTaskStatus(id, nextStatus)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", `Status tugas diubah menjadi ${nextStatus === "completed" ? "Selesai" : "Belum Selesai"}.`)
        router.refresh()
      }
    } catch {
      showFeedback("error", "Gagal memperbarui status tugas.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return
    setIsLoading(true)
    try {
      const res = await deleteTask(id)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Tugas berhasil dihapus.")
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus tugas."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // --- CRUD: ANNOUNCEMENTS ---
  const handleCreateAnnouncementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await createAnnouncement(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setIsAnnouncementModalOpen(false)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan pengumuman."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAnnouncementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await updateAnnouncement(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setEditingAnnouncement(null)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui pengumuman."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pengumuman ini?")) return
    setIsLoading(true)
    try {
      const res = await deleteAnnouncement(id)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Pengumuman berhasil dihapus.")
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus pengumuman."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const formatWibDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return (
        new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }).format(date) + " WIB"
      )
    } catch {
      return dateStr
    }
  }

  const getDeviceBadge = (device: string) => {
    const devLower = (device || "").toLowerCase()
    if (devLower.includes("mobile")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-200/80">
          <Smartphone className="h-3 w-3" />
          <span>Smartphone</span>
        </span>
      )
    }
    if (devLower.includes("tablet")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 border border-purple-200/80">
          <Tablet className="h-3 w-3" />
          <span>Tablet</span>
        </span>
      )
    }
    if (devLower.includes("bot")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200/80">
          <Bot className="h-3 w-3" />
          <span>Bot / Crawler</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
        <Laptop className="h-3 w-3" />
        <span>Desktop / PC</span>
      </span>
    )
  }

  // Navigation Items list
  const navItems = [
    { id: "overview", label: "Ringkasan", icon: BarChart3, count: null, color: "text-blue-600" },
    {
      id: "visitors",
      label: "Statistik Pengunjung & IP",
      icon: Users,
      count: totalVisitors,
      color: "text-emerald-600",
      highlight: true,
    },
    {
      id: "reports",
      label: "Laporan & Saran Peserta",
      icon: MessageCircle,
      count: pendingReportsCount,
      color: "text-orange-600",
      highlight: pendingReportsCount > 0,
    },
    { id: "materials", label: "Pustaka Modul PDF (120 JP)", icon: FileText, count: initialMaterials.length, color: "text-indigo-600" },
    { id: "schedules", label: "Jadwal 35 Hari", icon: Calendar, count: initialSchedules.length, color: "text-sky-600" },
    { id: "tasks", label: "Penugasan & Ujian", icon: BookOpen, count: initialTasks.length, color: "text-amber-600" },
    { id: "announcements", label: "Pengumuman Kelas", icon: Sparkles, count: initialAnnouncements.length, color: "text-rose-600" },
    { id: "discussions", label: "Moderasi Forum Diskusi", icon: MessageSquare, count: adminDiscussions.length, color: "text-purple-600" },
    { id: "templates", label: "Pusat Template BPS & TIK", icon: Layers, count: allAdminTemplates.length, color: "text-teal-600" },
    { id: "exam_prep", label: "Kesiapan Ujian & Seminar", icon: Clock, count: 10, color: "text-amber-600" },
    { id: "paper_gen", label: "AI Makalah Inovasi Satker", icon: GraduationCap, count: null, color: "text-rose-600" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#14181F] text-[#0F172A] dark:text-[#D8E0EC] flex flex-col lg:flex-row antialiased selection:bg-emerald-500/20 selection:text-emerald-900 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      {/* ========================================================================= */}
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#1B2130] border-r border-slate-200/80 dark:border-[#2A3550] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Brand Logo & Institution Info */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#2A3550]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-tr from-[#0F172A] to-[#1E293B] dark:from-[#1E2535] dark:to-[#2D3748] text-white shadow-sm">
                <Shield className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-100 uppercase">
                  DIKLAT PRAKOM
                </div>
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <span>Batch 3 Kejaksaan RI</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-[8px] text-slate-400 hover:bg-slate-100 dark:hover:bg-[#253045] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Database Live Ping Indicator */}
          <div className="rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Database Supabase</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-[6px]">
              ONLINE
            </span>
          </div>

          {/* Sidebar Navigation Items */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
              Menu Utama
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#253045] hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.highlight
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick System Tools */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-[#2A3550]">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
              Pintasan Cepat
            </div>
            <button
              onClick={() => setIsWAModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/40 transition cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Broadcast WhatsApp</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#253045] transition cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-amber-500" />
              <span>Backup Data (JSON)</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3.5 border-t border-slate-100 dark:border-[#2A3550] bg-slate-50/50 dark:bg-[#161B26] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-[8px] bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                AD
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 dark:text-slate-100">Admin Diklat</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">admin@kejaksaan.go.id</div>
              </div>
            </div>
            <form action={adminSignOut}>
              <button
                type="submit"
                title="Keluar dari Dashboard"
                className="p-1.5 rounded-[8px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1B2130]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#2A3550] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-[8px] border border-slate-200 dark:border-[#2A3550] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#253045] cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {activeTab === "overview" && "Ringkasan Operasional"}
                  {activeTab === "visitors" && "Statistik & Riwayat Pengunjung"}
                  {activeTab === "reports" && "Laporan Kendala & Kotak Saran"}
                  {activeTab === "materials" && "Pustaka Modul PDF (120 JP)"}
                  {activeTab === "schedules" && "Jadwal Perkuliahan 35 Hari"}
                  {activeTab === "tasks" && "Penugasan & Uji Praktek"}
                  {activeTab === "announcements" && "Pengumuman Kelas"}
                  {activeTab === "discussions" && "Moderasi Forum Diskusi"}
                  {activeTab === "templates" && "Pusat Template BPS & TIK"}
                  {activeTab === "exam_prep" && "Checklist Kelulusan & Ujian"}
                  {activeTab === "paper_gen" && "AI Makalah Inovasi Satker"}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Portal Manajemen Diklat Prakom Kejaksaan RI Batch 3
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-[8px] bg-slate-100 dark:bg-[#253045] hover:bg-slate-200 dark:hover:bg-[#2D3A52] px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer border border-slate-200/60 dark:border-[#2A3550]"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-500 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sinkron Data</span>
            </button>

            <Link href="/" target="_blank">
              <button className="flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-black text-white transition shadow-2xs cursor-pointer">
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Web Publik</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </button>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Feedback Alert Banner */}
          {feedback && (
            <div
              className={`rounded-[10px] p-3.5 text-xs font-bold border transition-all flex items-center justify-between gap-3 ${
                feedback.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="p-1 rounded-[6px] text-slate-400 hover:bg-slate-100 dark:hover:bg-[#253045] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. OVERVIEW TAB */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 6 KPI Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
                {/* 1. Visitors KPI (Highlight Card) */}
                <div
                  onClick={() => setActiveTab("visitors")}
                  className="group rounded-[12px] bg-gradient-to-br from-emerald-600 to-teal-800 p-4 text-white space-y-2.5 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-100">Pengunjung</span>
                    <Users className="h-4 w-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black">{totalVisitors}</div>
                    <div className="text-[11px] text-emerald-100 font-semibold mt-0.5 truncate">
                      {uniqueIps} IP • {todayVisitors} Hari Ini
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-400/30 flex items-center justify-between text-[11px] font-bold text-emerald-200">
                    <span>Statistik & IP</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Reports & Feedback */}
                <div
                  onClick={() => setActiveTab("reports")}
                  className={`rounded-[12px] border p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group ${
                    pendingReportsCount > 0
                      ? "bg-gradient-to-br from-orange-50 to-amber-50/70 dark:from-[#2A180C] dark:to-[#221308] border-orange-300 dark:border-orange-800/60"
                      : "bg-white dark:bg-[#1B2130] border-slate-200/90 dark:border-[#2A3550]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Laporan & Saran</span>
                    <MessageCircle className={`h-4 w-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform ${pendingReportsCount > 0 ? "animate-pulse" : ""}`} />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{adminReports.length}</div>
                    <div className="text-[11px] text-orange-700 dark:text-orange-400 font-semibold mt-0.5 truncate">
                      {pendingReportsCount} Menunggu • {resolvedReportsCount} Selesai
                    </div>
                  </div>
                  <div className="pt-2 border-t border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between text-[11px] font-bold text-orange-700 dark:text-orange-400">
                    <span>Tindak Lanjut</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 3. Materials */}
                <div
                  onClick={() => setActiveTab("materials")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pustaka Modul</span>
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{initialMaterials.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      {totalMaterialSizeMB.toFixed(1)} MB di Storage
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Kelola Berkas</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 4. Schedules */}
                <div
                  onClick={() => setActiveTab("schedules")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Jadwal Sesi</span>
                    <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{initialSchedules.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      Total 35 Hari Sesi
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-sky-600 dark:text-sky-400">
                    <span>Atur Agenda</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 5. Tasks */}
                <div
                  onClick={() => setActiveTab("tasks")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tugas Mandiri</span>
                    <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{initialTasks.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      {completedTasksCount} Selesai • {initialTasks.length - completedTasksCount} Pending
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <span>Penugasan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 6. Announcements */}
                <div
                  onClick={() => setActiveTab("announcements")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pengumuman</span>
                    <Sparkles className="h-4 w-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{initialAnnouncements.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      {initialAnnouncements.filter((a) => a.is_urgent).length} Mendesak / Urgent
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <span>Kelola Info</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Extended Row for Discussions, Templates, Exam Prep, AI Generator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Forum Diskusi */}
                <div
                  onClick={() => setActiveTab("discussions")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Forum Diskusi</span>
                    <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{adminDiscussions.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      Topik Tanya Jawab Peserta
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    <span>Moderasi Forum</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Templates BPS */}
                <div
                  onClick={() => setActiveTab("templates")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Template Dokumen</span>
                    <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{allAdminTemplates.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      SPT, DUPAK, SPMK & SOP
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                    <span>Lihat Format</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Exam Prep & Checklist */}
                <div
                  onClick={() => setActiveTab("exam_prep")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Milestone Kelulusan</span>
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">10</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      Checklist Standar Kelulusan
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <span>Countdown Ujian</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* AI Paper Generator */}
                <div
                  onClick={() => setActiveTab("paper_gen")}
                  className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-2.5 shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">AI Makalah Seminar</span>
                    <GraduationCap className="h-4 w-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">5 Bab</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      Proposal Inovasi Satker
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <span>Uji Generator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Quick Action Center */}
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                      Pusat Aksi Cepat
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tambah modul PDF, jadwalkan sesi, rilis tugas, atau publikasikan pengumuman kelas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 p-3.5 text-xs font-black text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Modul PDF</span>
                  </button>

                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-[10px] bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-950/70 p-3.5 text-xs font-black text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Sesi Jadwal</span>
                  </button>

                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-[10px] bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/70 p-3.5 text-xs font-black text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Tugas Baru</span>
                  </button>

                  <button
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-[10px] bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 p-3.5 text-xs font-black text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Pengumuman</span>
                  </button>
                </div>
              </div>

              {/* Traffic & Device Distribution Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Media Distribution Bars */}
                <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                        Distribusi Media Akses Pengunjung
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("visitors")}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Rincian IP</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Laptop className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Desktop / Laptop ({deviceStats.desktop})
                        </span>
                        <span>{deviceStats.desktopPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-[#141824] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${deviceStats.desktopPct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Smartphone ({deviceStats.mobile})
                        </span>
                        <span>{deviceStats.mobilePct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-[#141824] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${deviceStats.mobilePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Tablet className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" /> Tablet ({deviceStats.tablet})
                        </span>
                        <span>{deviceStats.tabletPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-[#141824] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${deviceStats.tabletPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Integrasi <strong>@vercel/analytics</strong> & Pelacak IP Supabase aktif.
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                      Ready
                    </span>
                  </div>
                </div>

                {/* Database Metrics Preview */}
                <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">Status Database</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550]">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Total Seluruh Data:</span>
                      <span className="font-black text-slate-900 dark:text-slate-100">
                        {initialMaterials.length +
                          initialSchedules.length +
                          initialTasks.length +
                          initialAnnouncements.length +
                          initialVisitorLogs.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550]">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Pengunjung Unik:</span>
                      <span className="font-black text-emerald-700 dark:text-emerald-400">{uniqueIps} IP</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550]">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Kunjungan Hari Ini:</span>
                      <span className="font-black text-blue-700 dark:text-blue-400">{todayVisitors} Hits</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550]">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Total Modul PDF:</span>
                      <span className="font-black text-indigo-700 dark:text-indigo-400">{initialMaterials.length} Berkas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}          {/* ========================================================================= */}
          {/* 2. VISITOR ANALYTICS TAB (5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "visitors" && (
            <div className="space-y-5">
              {/* 4 Visitor Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Kunjungan</span>
                    <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{totalVisitors}</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Terekam di Supabase</p>
                </div>

                <div className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pengunjung Unik</span>
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{uniqueIps}</div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Alamat IP Berbeda</p>
                </div>

                <div className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kunjungan Hari Ini</span>
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{todayVisitors}</div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Akses Sesi Hari Ini</p>
                </div>

                <div className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Media Terbanyak</span>
                    <Laptop className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {deviceStats.desktop >= deviceStats.mobile ? "Desktop" : "Mobile"}
                  </div>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    {deviceStats.desktopPct}% Desktop • {deviceStats.mobilePct}% Mobile
                  </p>
                </div>
              </div>

              {/* Main Visitor Logs Table & Toolbar Card */}
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                      Riwayat Pengunjung & IP Live
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Menampilkan IP pengunjung, perangkat, browser, OS, dan path yang diakses (5 per halaman)
                    </p>
                  </div>

                  {/* Toolbar Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportVisitorsCSV}
                      className="flex items-center gap-1.5 rounded-[8px] bg-white dark:bg-[#253045] px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-[#2D3A52] transition cursor-pointer shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Ekspor CSV</span>
                    </button>
                    <button
                      onClick={handleExportVisitorsJSON}
                      className="flex items-center gap-1.5 rounded-[8px] bg-white dark:bg-[#253045] px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-[#2D3A52] transition cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Ekspor JSON</span>
                    </button>
                    {initialVisitorLogs.length > 0 && (
                      <button
                        onClick={handleClearAllVisitors}
                        className="flex items-center gap-1.5 rounded-[8px] bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-950/70 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Bersihkan Log</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Search & Device Filter Row */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={visitorSearch}
                      onChange={(e) => setVisitorSearch(e.target.value)}
                      placeholder="Cari IP, Path, Browser, OS, atau Referrer..."
                      className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: "all", label: "Semua Media" },
                      { id: "Desktop", label: "💻 Desktop" },
                      { id: "Mobile", label: "📱 Mobile" },
                      { id: "Tablet", label: "📟 Tablet" },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setVisitorDeviceFilter(filter.id)}
                        className={`whitespace-nowrap rounded-[8px] px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          visitorDeviceFilter === filter.id
                            ? "bg-slate-900 dark:bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2D3A52]"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table or Empty State */}
                {initialVisitorLogs.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#2A3550] p-8 text-center space-y-2">
                    <Users className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Belum Ada Riwayat Kunjungan Terekam</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Riwayat kunjungan akan otomatis terisi saat pengguna membuka halaman publik atau modul.
                    </p>
                  </div>
                ) : filteredVisitorLogs.length === 0 ? (
                  <div className="rounded-[10px] border border-slate-200 dark:border-[#2A3550] p-6 text-center space-y-2">
                    <Search className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tidak ditemukan log kunjungan yang sesuai dengan kata kunci &quot;{visitorSearch}&quot;
                    </p>
                    <button
                      onClick={() => {
                        setVisitorSearch("")
                        setVisitorDeviceFilter("all")
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-[10px] border border-slate-200 dark:border-[#2A3550]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-[#161B26] border-b border-slate-200 dark:border-[#2A3550] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3.5">#</th>
                            <th className="py-2.5 px-3.5">Waktu Akses</th>
                            <th className="py-2.5 px-3.5">Identitas Peserta</th>
                            <th className="py-2.5 px-3.5">ID Perangkat</th>
                            <th className="py-2.5 px-3.5">Alamat IP</th>
                            <th className="py-2.5 px-3.5">Media</th>
                            <th className="py-2.5 px-3.5">OS & Browser</th>
                            <th className="py-2.5 px-3.5">Path</th>
                            <th className="py-2.5 px-3.5">Referrer</th>
                            <th className="py-2.5 px-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#2A3550]">
                          {paginatedVisitorLogs.map((log, idx) => {
                            const globalIndex = (visitorPage - 1) * ITEMS_PER_PAGE + idx + 1
                            return (
                              <tr key={log.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-[#253045]/50 transition-colors">
                                <td className="py-3 px-3.5 font-bold text-slate-400">{globalIndex}</td>
                                <td className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                  {formatWibDate(log.created_at)}
                                </td>
                                <td className="py-3 px-3.5">
                                  {log.visitor_name ? (
                                    <div className="flex flex-col max-w-[170px]">
                                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
                                        <User className="h-3 w-3 text-indigo-500 shrink-0" />
                                        <span className="truncate">{log.visitor_name}</span>
                                      </span>
                                      {log.visitor_nip && (
                                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                          NIP. {log.visitor_nip}
                                        </span>
                                      )}
                                      {log.visitor_satker && (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate" title={log.visitor_satker}>
                                          {log.visitor_satker}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                                      Pengunjung Umum
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3.5">
                                  <div className="flex items-center gap-1">
                                    <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-[4px] text-[11px] border border-indigo-200/60 dark:border-indigo-800/40 whitespace-nowrap">
                                      {log.device_id || "DEV-UMUM"}
                                    </span>
                                    {log.device_id && (
                                      <button
                                        onClick={() => handleCopyDeviceId(log.device_id || "")}
                                        title="Salin ID Perangkat"
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-[#253045] transition cursor-pointer"
                                      >
                                        {copiedDeviceId === log.device_id ? (
                                          <CheckCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-3.5">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#253045] px-2 py-0.5 rounded-[4px] text-[11px] border border-slate-200/80 dark:border-[#2A3550]">
                                        {log.ip || "127.0.0.1"}
                                      </span>
                                      <button
                                        onClick={() => handleCopyIp(log.ip || "127.0.0.1")}
                                        title="Salin Alamat IP Publik"
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-[#253045] transition cursor-pointer"
                                      >
                                        {copiedIp === (log.ip || "127.0.0.1") ? (
                                          <CheckCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </button>
                                    </div>
                                    {log.local_ip && (
                                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40 w-fit" title="IP Lokal Kartu Jaringan">
                                        LAN: {log.local_ip}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 whitespace-nowrap">
                                  {getDeviceBadge(log.device)}
                                </td>
                                <td className="py-3 px-3.5">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{log.browser || "Unknown Browser"}</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{log.os || "Unknown OS"}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5">
                                  <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/40">
                                    {log.path || "/"}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400 max-w-[140px] truncate" title={log.referrer}>
                                  {log.referrer || "Direct"}
                                </td>
                                <td className="py-3 px-3.5 text-center">
                                  {log.id && (
                                    <button
                                      onClick={() => handleDeleteVisitor(log.id)}
                                      title="Hapus baris log ini"
                                      className="p-1 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>


                    {/* Pagination Controls */}
                    <PaginationControls
                      currentPage={visitorPage}
                      totalPages={totalVisitorPages}
                      totalItems={filteredVisitorLogs.length}
                      onPageChange={setVisitorPage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2.1 REPORTS & FEEDBACK TAB (5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "reports" && (
            <div className="space-y-5">
              {/* 4 Reports KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Tiket Masuk</span>
                    <MessageCircle className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{adminReports.length}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Tiket kendala & saran</p>
                </div>

                <div className="rounded-[12px] bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/50 p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">Menunggu Tindak Lanjut</span>
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-800 dark:text-orange-300">{pendingReportsCount}</div>
                  <p className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">Status: Pending</p>
                </div>

                <div className="rounded-[12px] bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Sedang Diproses</span>
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-800 dark:text-blue-300">{inProgressReportsCount}</div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Dalam penanganan</p>
                </div>

                <div className="rounded-[12px] bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Selesai Ditangani</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300">{resolvedReportsCount}</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Status: Selesai</p>
                </div>
              </div>

              {/* Main Reports Management Card */}
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span>Daftar Laporan Kendala & Aspirasi Peserta</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Laporan yang dikirim peserta melalui FAQ tanpa perlu login (5 per halaman)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      onClick={handleExportReportsCSV}
                      className="flex items-center gap-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Ekspor (CSV)</span>
                    </button>
                    <button
                      onClick={fetchReports}
                      className="flex items-center gap-1.5 rounded-[8px] bg-slate-100 dark:bg-[#253045] hover:bg-slate-200 dark:hover:bg-[#2D3A52] px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-[#2A3550] transition cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Muat Ulang</span>
                    </button>
                  </div>
                </div>

                {/* Filter Bar: Search & Status */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={reportSearch}
                        onChange={(e) => {
                          setReportSearch(e.target.value)
                          setReportPage(1)
                        }}
                        placeholder="Cari nama, satker, kategori, WA, atau uraian..."
                        className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition"
                      />
                    </div>

                    {/* Status Pills */}
                    <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                      {[
                        { id: "all", label: "Semua Status" },
                        { id: "pending", label: "⏳ Pending" },
                        { id: "in_progress", label: "🛠️ Diproses" },
                        { id: "resolved", label: "✅ Selesai" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            setReportStatusFilter(st.id as any)
                            setReportPage(1)
                          }}
                          className={`whitespace-nowrap rounded-[8px] px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            reportStatusFilter === st.id
                              ? "bg-slate-900 dark:bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2D3A52]"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                      <Filter className="h-3 w-3" />
                      <span>Kategori:</span>
                    </span>
                    {[
                      "Semua",
                      "Kendala Teknis & Akses",
                      "Jadwal & Zoom",
                      "Tugas & Modul",
                      "Saran & Aspirasi Kelas",
                      "Lainnya"
                    ].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setReportCategoryFilter(cat)
                          setReportPage(1)
                        }}
                        className={`whitespace-nowrap rounded-[6px] px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                          reportCategoryFilter === cat
                            ? "bg-orange-600 text-white shadow-2xs"
                            : "bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#253045]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reports List */}
                {adminReports.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#2A3550] p-8 text-center space-y-2">
                    <MessageCircle className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Belum Ada Laporan Masuk</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Laporan dari peserta diklat yang dikirim via formulir FAQ akan otomatis muncul di sini.
                    </p>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="rounded-[10px] border border-slate-200 dark:border-[#2A3550] p-6 text-center space-y-2">
                    <Search className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tidak ditemukan laporan yang sesuai dengan filter.
                    </p>
                    <button
                      onClick={() => {
                        setReportSearch("")
                        setReportStatusFilter("all")
                        setReportCategoryFilter("Semua")
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {paginatedReports.map((report, idx) => {
                        const globalIndex = (reportPage - 1) * ITEMS_PER_PAGE + idx + 1
                        const st = report.status || "pending"
                        const isUpdating = isUpdatingReportMap[report.id] || false

                        return (
                          <div
                            key={report.id || idx}
                            className={`rounded-[12px] border p-4 sm:p-5 space-y-3 transition-all ${
                              st === "pending"
                                ? "bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50 hover:border-amber-300"
                                : st === "in_progress"
                                ? "bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-800/50 hover:border-blue-300"
                                : "bg-white dark:bg-[#161B26] border-slate-200 dark:border-[#2A3550] hover:border-slate-300"
                            }`}
                          >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-[#2A3550]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="h-5 w-5 rounded-[4px] bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center font-black text-[10px]">
                                  {globalIndex}
                                </span>
                                <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                                  {report.name || "Peserta Anonim"}
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#253045] px-2 py-0.5 rounded-[4px] border border-slate-200/80 dark:border-[#2A3550]">
                                  {report.satker || "Satker Kejaksaan"}
                                </span>
                                {report.contact && (
                                  <a
                                    href={generateWaLink(report)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-[4px] transition shadow-2xs"
                                    title="Kirim balasan via WA"
                                  >
                                    <MessageCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>WA: {report.contact}</span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Status Badge */}
                                <span
                                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                    st === "pending"
                                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse"
                                      : st === "in_progress"
                                      ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                                      : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                  }`}
                                >
                                  {st === "pending" ? "⏳ Menunggu" : st === "in_progress" ? "🛠️ Diproses" : "✅ Selesai"}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                  {report.created_at ? formatWibDate(report.created_at) : "-"}
                                </span>
                              </div>
                            </div>

                            {/* Category & Message */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="inline-block text-[10px] font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/80 dark:border-orange-800/50">
                                  📌 {report.category}
                                </span>
                                <button
                                  onClick={() => setSelectedReportForModal(report)}
                                  className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="h-3 w-3 text-indigo-500" />
                                  <span>Rincian Tiket</span>
                                </button>
                              </div>
                              <div className="p-3 rounded-[8px] bg-white dark:bg-[#141824] border border-slate-200/90 dark:border-[#2A3550] text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                                {report.message}
                              </div>
                            </div>

                            {/* Admin Notes Section */}
                            <div className="pt-1 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
                              <div className="flex-1 flex items-center gap-2">
                                <input
                                  type="text"
                                  defaultValue={report.admin_notes || ""}
                                  placeholder="Catatan tindak lanjut admin / nomor tiket..."
                                  onChange={(e) =>
                                    setAdminNotesTextMap((prev) => ({
                                      ...prev,
                                      [report.id]: e.target.value,
                                    }))
                                  }
                                  className="h-8 flex-1 rounded-[6px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/80 dark:bg-[#141824] px-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none"
                                />
                                <button
                                  onClick={() =>
                                    handleUpdateReportStatus(
                                      report.id,
                                      st,
                                      adminNotesTextMap[report.id] !== undefined
                                        ? adminNotesTextMap[report.id]
                                        : report.admin_notes
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="px-2.5 py-1.5 rounded-[6px] bg-slate-200 dark:bg-[#253045] hover:bg-slate-300 dark:hover:bg-[#2D3A52] font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0"
                                >
                                  Simpan
                                </button>
                              </div>

                              {/* Status Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                                {report.contact && (
                                  <a
                                    href={generateWaLink(report)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1.5 rounded-[6px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/50 text-xs font-bold transition flex items-center gap-1"
                                    title="Buka WA"
                                  >
                                    <Send className="h-3 w-3" />
                                    <span>Balas WA</span>
                                  </a>
                                )}
                                {st !== "pending" && (
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, "pending")}
                                    disabled={isUpdating}
                                    className="px-2 py-1 rounded-[6px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/50 text-[11px] font-bold transition cursor-pointer"
                                  >
                                    Pending
                                  </button>
                                )}
                                {st !== "in_progress" && (
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, "in_progress")}
                                    disabled={isUpdating}
                                    className="px-2 py-1 rounded-[6px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/50 text-[11px] font-bold transition cursor-pointer"
                                  >
                                    Diproses
                                  </button>
                                )}
                                {st !== "resolved" && (
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, "resolved")}
                                    disabled={isUpdating}
                                    className="px-2.5 py-1 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition cursor-pointer shadow-2xs"
                                  >
                                    Selesai
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteReport(report.id)}
                                  disabled={isUpdating}
                                  title="Hapus laporan ini"
                                  className="p-1 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[6px] transition cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Pagination */}
                    <PaginationControls
                      currentPage={reportPage}
                      totalPages={totalReportPages}
                      totalItems={filteredReports.length}
                      onPageChange={setReportPage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MATERIALS TAB (GRID & 5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "materials" && (
            <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Pustaka Berkas Modul (120 JP)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Materi perkuliahan di Supabase Storage (5 modul per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Modul PDF</span>
                </button>
              </div>

              {/* Search & Tahap Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="Cari judul modul atau mata kuliah..."
                    className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: "all", label: "Semua Tahap" },
                    { id: "Tahap 1", label: "Tahap 1 MOOC" },
                    { id: "Tahap 2", label: "Tahap 2 TMO" },
                    { id: "Tahap 3", label: "Tahap 3 Lab" },
                    { id: "Tahap 4", label: "Tahap 4 Seminar" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setMaterialTahapFilter(filter.id)}
                      className={`whitespace-nowrap rounded-[8px] px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        materialTahapFilter === filter.id
                          ? "bg-slate-900 dark:bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2D3A52]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {initialMaterials.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#2A3550] p-8 text-center space-y-2">
                  <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Belum Ada Modul di Database</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Klik tombol di bawah untuk mengunggah berkas PDF materi pertama Anda.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Modul PDF</span>
                  </button>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="rounded-[10px] border border-slate-200 dark:border-[#2A3550] p-6 text-center space-y-2">
                  <Search className="h-6 w-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tidak ditemukan modul yang sesuai dengan pencarian Anda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {paginatedMaterials.map((m) => (
                      <div
                        key={m.id}
                        className="flex flex-col justify-between rounded-[12px] bg-slate-50/80 dark:bg-[#161B26] p-4 border border-slate-200/90 dark:border-[#2A3550] gap-3 hover:bg-white dark:hover:bg-[#1A2234] hover:shadow-xs transition"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800/50 px-2 py-0.5 text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                              {m.subject_name || "Materi Diklat"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              Minggu {m.week_number} • {m.file_size ? `${(m.file_size / 1024 / 1024).toFixed(1)} MB` : "PDF"}
                            </span>
                          </div>
                          <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">{m.title}</h5>
                          {m.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{m.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-[#2A3550]">
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px]">
                            {m.file_name}
                          </div>
                          <div className="flex items-center gap-2">
                            {m.file_url && (
                              <a
                                href={m.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Unduh</span>
                              </a>
                            )}
                            <button
                              onClick={() => setEditingMaterial(m)}
                              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(m.id, m.file_name)}
                              className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <PaginationControls
                    currentPage={materialPage}
                    totalPages={totalMaterialPages}
                    totalItems={filteredMaterials.length}
                    onPageChange={setMaterialPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. SCHEDULES TAB (GRID & 5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "schedules" && (
            <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Jadwal Perkuliahan 35 Hari</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sesi tatap muka online / offline (5 sesi per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Sesi Jadwal</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={scheduleSearch}
                  onChange={(e) => setScheduleSearch(e.target.value)}
                  placeholder="Cari topik jadwal, tahap diklat, pengampu, hari, atau ruang..."
                  className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition"
                />
              </div>

              {initialSchedules.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#2A3550] p-8 text-center space-y-2">
                  <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Belum Ada Sesi Jadwal di Database</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Klik tombol di bawah untuk menambahkan sesi jadwal diklat baru.
                  </p>
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Sesi Jadwal</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {paginatedSchedules.map((s) => {
                      const resolvedDayNum = getScheduleDayNumber(s)
                      const displayDayTag = resolvedDayNum ? `Hari ${resolvedDayNum}` : s.day

                      return (
                        <div
                          key={s.id}
                          className="flex flex-col justify-between rounded-[12px] bg-slate-50/80 dark:bg-[#161B26] p-4 border border-slate-200/90 dark:border-[#2A3550] gap-3 hover:bg-white dark:hover:bg-[#1A2234] hover:shadow-xs transition"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-[4px] bg-slate-900 dark:bg-indigo-600 px-2 py-0.5 text-[10px] font-black text-white">
                                {displayDayTag}
                              </span>
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {s.start_time} - {s.end_time} WIB
                              </span>
                            </div>
                            <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">{s.subject_name}</h5>
                            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                              <div>👨‍🏫 {s.lecturer}</div>
                              <div>🏢 {s.room}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200/60 dark:border-[#2A3550]">
                            <button
                              onClick={() => setEditingSchedule(s)}
                              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(s.id)}
                              className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination Controls */}
                  <PaginationControls
                    currentPage={schedulePage}
                    totalPages={totalSchedulePages}
                    totalItems={filteredSchedules.length}
                    onPageChange={setSchedulePage}
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. TASKS TAB (GRID & 5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "tasks" && (
            <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Penugasan & Uji Praktek</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kelola tugas mandiri dan batas deadline (5 tugas per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Buat Tugas Baru</span>
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "Semua Tugas" },
                  { id: "pending", label: "⏳ Belum Selesai (Pending)" },
                  { id: "completed", label: "✅ Sudah Selesai" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setTaskFilter(filter.id as any)}
                    className={`rounded-[8px] px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      taskFilter === filter.id
                        ? "bg-slate-900 dark:bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2D3A52]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {initialTasks.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#2A3550] p-8 text-center space-y-2">
                  <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Belum Ada Penugasan di Database</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Klik tombol di bawah untuk membuat tugas diklat baru.
                  </p>
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Tugas Baru</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {paginatedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex flex-col justify-between rounded-[12px] bg-slate-50/80 dark:bg-[#161B26] p-4 border border-slate-200/90 dark:border-[#2A3550] gap-3 hover:bg-white dark:hover:bg-[#1A2234] hover:shadow-xs transition"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                t.status === "completed"
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              }`}
                            >
                              {t.status === "completed" ? "Selesai" : "Pending"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              Deadline: {new Date(t.due_date).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">{t.title}</h5>
                          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <span className="text-[10px] font-bold bg-slate-200 dark:bg-[#253045] text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">Tahap</span>
                            <span>{t.subject_name}</span>
                          </div>
                          {t.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{t.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-[#2A3550]">
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, t.status)}
                            className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>{t.status === "completed" ? "Ubah ke Pending" : "Tandai Selesai"}</span>
                          </button>
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => setEditingTask(t)}
                              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTask(t.id)}
                              className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <PaginationControls
                    currentPage={taskPage}
                    totalPages={totalTaskPages}
                    totalItems={filteredTasks.length}
                    onPageChange={setTaskPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. ANNOUNCEMENTS TAB (GRID & 5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "announcements" && (
            <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Pengumuman Kelas</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pengumuman di portal beranda peserta (5 pengumuman per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsAnnouncementModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Buat Pengumuman</span>
                </button>
              </div>

              {initialAnnouncements.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#2A3550] p-8 text-center space-y-2">
                  <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Belum Ada Pengumuman di Database</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Klik tombol di bawah untuk membuat pengumuman kelas pertama Anda.
                  </p>
                  <button
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Pengumuman Baru</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {paginatedAnnouncements.map((a) => (
                      <div
                        key={a.id}
                        className="flex flex-col justify-between rounded-[12px] bg-slate-50/80 dark:bg-[#161B26] p-4 border border-slate-200/90 dark:border-[#2A3550] gap-3 hover:bg-white dark:hover:bg-[#1A2234] hover:shadow-xs transition"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            {a.is_urgent ? (
                              <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 px-2 py-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300">
                                Mendesak / Urgent
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-200/80 dark:bg-[#253045] px-2 py-0.5 text-[10px] font-black text-slate-700 dark:text-slate-300">
                                Info Kelas
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                              {a.author}
                            </span>
                          </div>
                          <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">{a.title}</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{a.content}</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200/60 dark:border-[#2A3550]">
                          <button
                            onClick={() => setEditingAnnouncement(a)}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(a.id)}
                            className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <PaginationControls
                    currentPage={announcementPage}
                    totalPages={totalAnnouncementPages}
                    totalItems={initialAnnouncements.length}
                    onPageChange={setAnnouncementPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. DISCUSSIONS MODERATION TAB */}
          {/* ========================================================================= */}
          {activeTab === "discussions" && (
            <div className="space-y-5">
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>Moderasi Forum Diskusi & Tanya Jawab Peserta</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pantau pertanyaan peserta, kirim balasan resmi atas nama Panitia, dan moderasi diskusi
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-[8px] bg-purple-50 dark:bg-purple-950/40 px-3.5 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-950/70 transition shadow-2xs"
                    >
                      <span>Halaman Publik</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={discussionSearch}
                      onChange={(e) => setDiscussionSearch(e.target.value)}
                      placeholder="Cari pertanyaan / nama / satker..."
                      className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-purple-600 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["all", "#TeknisKodingLab", "#PengolahanData", "#DatabasePostgres", "#JaringanServer", "#AuditTI", "#ITILdanSPBE", "#TugasMandiri", "#SeminarAkhir", "#LMS", "#Umum"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setDiscussionTagFilter(tag)}
                        className={`rounded-[6px] px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                          discussionTagFilter === tag
                            ? "bg-purple-700 text-white"
                            : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2D3A52]"
                        }`}
                      >
                        {tag === "all" ? "Semua Tag" : tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discussions List */}
                <div className="space-y-3 pt-2">
                  {adminDiscussions
                    .filter((t) => {
                      const matchTag = discussionTagFilter === "all" || t.tag === discussionTagFilter
                      const matchSearch =
                        t.title?.toLowerCase().includes(discussionSearch.toLowerCase()) ||
                        t.authorName?.toLowerCase().includes(discussionSearch.toLowerCase()) ||
                        t.authorSatker?.toLowerCase().includes(discussionSearch.toLowerCase())
                      return matchTag && matchSearch
                    })
                    .map((thread) => (
                      <div
                        key={thread.id}
                        className="rounded-[12px] border border-slate-200/90 dark:border-[#2A3550] p-4 sm:p-5 bg-slate-50/50 dark:bg-[#161B26] space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-[6px] bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs">
                              {thread.authorName?.charAt(0) || "P"}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{thread.authorName}</h4>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">{thread.authorSatker}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:text-purple-300">
                              {thread.tag}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              👍 {thread.upvotes}
                            </span>
                            <button
                              onClick={() => handleDeleteDiscussionThread(thread.id)}
                              className="p-1 rounded-[6px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Hapus Thread"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mb-1">{thread.title}</h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                        </div>

                        {/* Existing Replies */}
                        {thread.replies && thread.replies.length > 0 && (
                          <div className="border-t border-slate-200/70 dark:border-[#2A3550] pt-2.5 space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              {thread.replies.length} Tanggapan:
                            </span>
                            {thread.replies.map((reply: any) => (
                              <div
                                key={reply.id}
                                className={`p-2.5 rounded-[8px] border text-xs space-y-1 ${
                                  reply.isOfficial
                                    ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60"
                                    : "bg-white dark:bg-[#141824] border-slate-200 dark:border-[#2A3550]"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    {reply.authorName}
                                    {reply.isOfficial && (
                                      <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                                        Official
                                      </span>
                                    )}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteDiscussionReply(thread.id, reply.id)}
                                    className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Admin Reply Box */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-[#2A3550]">
                          <input
                            type="text"
                            value={adminReplyTextMap[thread.id] || ""}
                            onChange={(e) =>
                              setAdminReplyTextMap((prev) => ({ ...prev, [thread.id]: e.target.value }))
                            }
                            placeholder="Balas resmi sebagai Panitia..."
                            className="h-8 flex-1 rounded-[6px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#141824] px-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-purple-600 focus:outline-none"
                          />
                          <button
                            onClick={() => handleAdminReplySubmit(thread.id)}
                            disabled={isReplyingAdminMap[thread.id]}
                            className="h-8 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-[6px] text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <Send className="h-3 w-3" />
                            <span>Kirim</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. TEMPLATES BPS & TIK MANAGEMENT TAB */}
          {/* ========================================================================= */}
          {activeTab === "templates" && (
            <div className="space-y-5">
              {/* Top Banner & Action */}
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                        <Layers className="h-3.5 w-3.5" />
                        <span>Format Naskah Dinas & SPMK</span>
                      </span>
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {allAdminTemplates.length} Template
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1.5">
                      Pusat Template Dokumen Resmi (BPS & Kejaksaan RI)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                      Kelola formulir DUPAK/SPMK, SPT, SOP Keamanan Server, dan Berita Acara TIK dalam format Word (.doc).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. EXAM PREP & GRADUATION MILESTONES TAB */}
          {/* ========================================================================= */}
          {activeTab === "exam_prep" && (
            <div className="space-y-5">
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>Milestone Ujian Evaluasi & Sidang Seminar Akhir</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Target jadwal hari H, kriteria penilaian widyaiswara, dan 10 checklist kelulusan diklat
                    </p>
                  </div>
                  <a
                    href="/exam-prep"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-[8px] bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-950/70 transition shadow-2xs"
                  >
                    <span>Buka Halaman Ujian</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-[10px] border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Hari Ke-30 (23 Sept 2026)</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Ujian Komprehensif MOOC</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Regulasi SPBE, PermenPAN 32/2020, dan Perka BPS 2/2021.</p>
                  </div>
                  <div className="p-3.5 rounded-[10px] border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">Hari Ke-33 (28 Sept 2026)</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Batas Unggah Makalah Inovasi</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Pengumpulan naskah proposal aksi perubahan satker di LMS.</p>
                  </div>
                  <div className="p-3.5 rounded-[10px] border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-1">
                    <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase">Hari Ke-35 (30 Sept 2026)</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Sidang Seminar & Evaluasi</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Presentasi paparan 10 menit di hadapan Penguji dan Coach.</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-[#2A3550] pt-3 space-y-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Bobot Penilaian Sidang Seminar:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] text-center">
                      <span className="block text-sm font-black text-emerald-700 dark:text-emerald-400">30%</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Relevansi Inovasi</span>
                    </div>
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] text-center">
                      <span className="block text-sm font-black text-blue-700 dark:text-blue-400">25%</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Kepatuhan SPBE</span>
                    </div>
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] text-center">
                      <span className="block text-sm font-black text-amber-700 dark:text-amber-400">25%</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Arsitektur TI</span>
                    </div>
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] text-center">
                      <span className="block text-sm font-black text-purple-700 dark:text-purple-400">20%</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Sistematika Paparan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. AI PAPER GENERATOR OVERVIEW TAB */}
          {/* ========================================================================= */}
          {activeTab === "paper_gen" && (
            <div className="space-y-5">
              {/* Main AI Engine Specification Card */}
              <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Dual-Engine Active
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-[#253045] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        100% Free Tier ($0.000)
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-1.5">
                      <GraduationCap className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <span>AI Engine & Generator Makalah Proyek Akhir Satker</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Mesin penyusun naskah akademik 5 Bab lengkap terintegrasi OpenRouter & Groq High-Speed.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    <a
                      href="/paper-generator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-[8px] bg-rose-600 px-3.5 py-2 text-xs font-black text-white hover:bg-rose-700 transition shadow-xs"
                    >
                      <span>Buka Generator Makalah</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-1">
                  {/* Left Box: AI Specification */}
                  <div className="p-4 rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] space-y-2.5">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <span>Spesifikasi Engine AI:</span>
                    </h4>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0">• Engine AI:</span>
                        <span>Groq & OpenRouter Hybrid</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0">• Fail-Safe:</span>
                        <span>Deterministic 5-Chapter Builder Lokal (100% Uptime)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0">• Token Budget:</span>
                        <span>max_tokens: 2,800 (~10.000 Karakter)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0">• Waktu Eksekusi:</span>
                        <span>Parallel Race Capped 5.0 Detik</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0">• Biaya Token:</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0">• Format Ekspor:</span>
                        <span>Dokumen Microsoft Word (.doc) Standar Naskah Dinas (Margin 4cm Kiri, 3cm Atas/Kanan/Bawah)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right Box: Preset Inovasi */}
                  <div className="p-4 rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] space-y-2.5">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span>Topik Preset Proyek Perubahan:</span>
                    </h4>
                    <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      <div className="p-2 bg-white dark:bg-[#1B2130] rounded-[6px] border border-slate-200 dark:border-[#2A3550]">
                        <span className="font-black text-rose-700 dark:text-rose-400 mr-1.5">1.</span>
                        <strong>Otomasi Backup & Replikasi DB:</strong> CMS PTSP Kejaksaan
                      </div>
                      <div className="p-2 bg-white dark:bg-[#1B2130] rounded-[6px] border border-slate-200 dark:border-[#2A3550]">
                        <span className="font-black text-rose-700 dark:text-rose-400 mr-1.5">2.</span>
                        <strong>Dashboard Monitoring SPBE:</strong> Indeks SPBE Real-Time
                      </div>
                      <div className="p-2 bg-white dark:bg-[#1B2130] rounded-[6px] border border-slate-200 dark:border-[#2A3550]">
                        <span className="font-black text-rose-700 dark:text-rose-400 mr-1.5">3.</span>
                        <strong>Notifikasi Jadwal Sidang:</strong> Integrasi WA Gateway
                      </div>
                      <div className="p-2 bg-white dark:bg-[#1B2130] rounded-[6px] border border-slate-200 dark:border-[#2A3550]">
                        <span className="font-black text-rose-700 dark:text-rose-400 mr-1.5">4.</span>
                        <strong>SOP CSIRT & Keamanan:</strong> Hardening Server
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Diagnostic & Latency Tester Widget */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-[#2A3550] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>Uji Koneksi & Latensi AI Engine (Live Health Check)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      Endpoint: <code className="font-mono text-[10px] bg-slate-100 dark:bg-[#253045] px-1 py-0.5 rounded">/api/ai/chat</code>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={aiTestPrompt}
                      onChange={(e) => setAiTestPrompt(e.target.value)}
                      placeholder="Masukkan prompt uji atau biarkan default..."
                      className="h-9 flex-1 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/70 dark:bg-[#161B26] px-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition"
                    />
                    <button
                      onClick={handleTestAiConnection}
                      disabled={isTestingAi}
                      className="w-full sm:w-auto px-4 py-2 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-black transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                    >
                      {isTestingAi ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                          <span>Menguji...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5 text-amber-400" />
                          <span>Tes Latensi</span>
                        </>
                      )}
                    </button>
                  </div>

                  {aiTestResult && (
                    <div
                      className={`p-3.5 rounded-[10px] border transition-all space-y-2 text-xs ${
                        aiTestResult.success
                          ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200"
                          : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-1.5 border-emerald-200/50 dark:border-emerald-800/40">
                        <div className="flex items-center gap-2 font-bold">
                          {aiTestResult.success ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span>Status: KONEKSI AI AKTIF</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                              <span>Status: GAGAL MERESPON</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="bg-white/80 dark:bg-[#1B2130] px-2 py-0.5 rounded font-mono font-bold border border-slate-200 dark:border-[#2A3550]">
                            ⏱️ {aiTestResult.latencyMs ? (aiTestResult.latencyMs / 1000).toFixed(2) : "0"}s ({aiTestResult.latencyMs} ms)
                          </span>
                          {aiTestResult.model && (
                            <span className="bg-white/80 dark:bg-[#1B2130] px-2 py-0.5 rounded font-mono font-bold border border-slate-200 dark:border-[#2A3550]">
                              🤖 {aiTestResult.model}
                            </span>
                          )}
                        </div>
                      </div>

                      {aiTestResult.text && (
                        <div className="p-2.5 bg-white/90 dark:bg-[#141824] rounded-[8px] border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                          {aiTestResult.text}
                        </div>
                      )}

                      {aiTestResult.error && (
                        <p className="text-rose-700 dark:text-rose-400 font-bold">
                          Error: {aiTestResult.error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODALS SECTION */}
      {/* ========================================================================= */}

      {/* 1. Modal: Upload Material PDF */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          if (!isLoading) {
            setIsUploadModalOpen(false)
            setSelectedFile(null)
            setUploadModalError(null)
            setUploadProgressStatus(null)
          }
        }}
        title="Upload Modul Materi PDF (Supabase Storage)"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
          {uploadModalError && (
            <div className="flex items-start gap-2.5 rounded-[10px] bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{uploadModalError}</p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400">
                  Tips: Jika berkas di atas 20MB, pastikan koneksi internet stabil atau kompres ukuran PDF via ilovepdf.com.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Pilih Berkas PDF *</label>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#253045] px-2 py-0.5 rounded-full">
                Maks. 100MB
              </span>
            </div>
            <input
              type="file"
              name="file"
              accept=".pdf,.zip,.rar"
              required
              disabled={isLoading}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0])
                  setUploadModalError(null)
                }
              }}
              className="w-full text-xs font-medium text-slate-500 file:mr-3 file:rounded-[8px] file:border-0 file:bg-slate-900 dark:file:bg-indigo-600 file:px-3.5 file:py-2 file:text-xs file:font-black file:text-white hover:file:bg-slate-800 dark:hover:file:bg-indigo-500 cursor-pointer disabled:opacity-50"
            />
            {selectedFile && (
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161B26] px-3 py-1.5 rounded-[8px] border border-slate-200 dark:border-[#2A3550]">
                <span className="truncate max-w-[240px]">📄 {selectedFile.name}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Modul / Materi *</label>
            <Input
              name="title"
              required
              disabled={isLoading}
              placeholder="Contoh: Modul 01 - Pengantar Basis Data Kejaksaan RI"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tahapan Diklat *</label>
              <select
                name="subject_name"
                required
                disabled={isLoading}
                className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="Tahap 1 • MOOC">Tahap 1 • MOOC</option>
                <option value="Tahap 2 • TMO">Tahap 2 • TMO</option>
                <option value="Tahap 3 • Lab Prakom">Tahap 3 • Lab Prakom</option>
                <option value="Tahap 4 • Seminar">Tahap 4 • Seminar</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Minggu Pertemuan *</label>
              <Input
                name="week_number"
                type="number"
                min="1"
                max="10"
                defaultValue={1}
                required
                disabled={isLoading}
                className="text-xs rounded-[8px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Deskripsi Singkat (Opsional)</label>
            <Input
              name="description"
              disabled={isLoading}
              placeholder="Penjelasan singkat modul dan panduan belajar..."
              className="text-xs rounded-[8px]"
            />
          </div>

          {/* Live Progress Bar Container */}
          {isLoading && (
            <div className="space-y-2 rounded-[10px] bg-blue-50 dark:bg-indigo-950/30 p-3.5 border border-blue-200 dark:border-indigo-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-indigo-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-indigo-400 shrink-0" />
                  <span>{uploadProgressStatus}</span>
                </div>
                <span className="font-mono text-blue-700 dark:text-indigo-300">{uploadProgressPercent}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200/80 dark:bg-[#253045]">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-blue-700 dark:text-indigo-300">
                <span>{uploadProgressBytes}</span>
                {uploadSpeedStr && <span>⚡ {uploadSpeedStr}</span>}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setIsUploadModalOpen(false)
                setSelectedFile(null)
                setUploadModalError(null)
              }}
              className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isLoading ? "Mengunggah..." : "Upload Sekarang"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal: Create Schedule */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Tambah Sesi Jadwal Perkuliahan 35 Hari"
      >
        <form onSubmit={handleCreateScheduleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Pilih Hari / Sesi *</label>
              <select
                name="day"
                required
                className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i + 1
                  const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
                  const assignedDayName = dayNames[(dayNum - 1) % 5]
                  return (
                    <option key={dayNum} value={`Hari ${dayNum} | ${assignedDayName}`}>
                      Hari {dayNum} ({assignedDayName})
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Ruangan / Platform *</label>
              <Input
                name="room"
                required
                defaultValue="Zoom Diklat & LMS Badiklat"
                className="text-xs rounded-[8px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tahap & Topik Jadwal *</label>
            <Input
              name="subject_name"
              required
              placeholder="Contoh: Tahap 1 • Arsitektur Cloud & Keamanan Siber Kejaksaan"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Nama Dosen / Widyaiswara *</label>
            <Input
              name="lecturer"
              required
              placeholder="Contoh: Dr. Ir. Widyaiswara Utama, M.Kom"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tautan Zoom / LMS (Meeting Link)</label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-[#253045] px-2 py-0.5 rounded-md">
                Khusus Tahap 2, 3, 4 Zoom
              </span>
            </div>
            <Input
              name="meeting_link"
              placeholder="Contoh: https://us02web.zoom.us/j/... (Kosongkan jika default LMS)"
              className="text-xs font-mono rounded-[8px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Jam Mulai (WIB) *</label>
              <Input name="start_time" type="time" defaultValue="08:00" required className="text-xs rounded-[8px]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Jam Selesai (WIB) *</label>
              <Input name="end_time" type="time" defaultValue="11:30" required className="text-xs rounded-[8px]" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Menyimpan..." : "Simpan Sesi Jadwal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal: Create Task */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Buat Tugas Mandiri & Uji Praktek"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Penugasan *</label>
            <Input
              name="title"
              required
              placeholder="Contoh: Tugas Mandiri 03 - Konfigurasi Server Linux & Docker"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tahap Pelatihan *</label>
              <Input
                name="subject_name"
                required
                placeholder="Contoh: Tahap 1 • MOOC / Tahap 2 • TMO"
                className="text-xs rounded-[8px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Batas Pengumpulan (Deadline) *</label>
              <Input
                name="due_date"
                type="date"
                required
                className="text-xs rounded-[8px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Instruksi / Deskripsi Tugas</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Jelaskan format pengumpulan, tautan Google Drive / LMS, dan petunjuk praktis..."
              className="w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Menyimpan..." : "Publikasikan Tugas"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Modal: Create Announcement */}
      <Modal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        title="Buat Pengumuman Kelas"
      >
        <form onSubmit={handleCreateAnnouncementSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Pengumuman *</label>
            <Input
              name="title"
              required
              placeholder="Contoh: [PENTING] Jadwal Gladi Bersih Ujian MOOC 120 JP"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Nama Pembuat / Pengirim</label>
            <Input
              name="author"
              defaultValue="Pengurus Diklat Prakom Batch 3"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Isi Pesan Pengumuman *</label>
            <textarea
              name="content"
              rows={4}
              required
              placeholder="Tuliskan detail pengumuman untuk seluruh rekan peserta diklat..."
              className="w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_urgent"
              name="is_urgent"
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-0"
            />
            <label htmlFor="is_urgent" className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Tandai sebagai Pengumuman Mendesak (Tampil di Banner Atas Beranda)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAnnouncementModalOpen(false)}
              className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Mempublikasikan..." : "Kirim Pengumuman"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal: Schedule */}
      {editingSchedule && (
        <Modal
          isOpen={Boolean(editingSchedule)}
          onClose={() => setEditingSchedule(null)}
          title="Edit Sesi Jadwal Perkuliahan"
        >
          <form onSubmit={handleUpdateScheduleSubmit} className="space-y-4 pt-2">
            <input type="hidden" name="id" value={editingSchedule.id} />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Hari / Sesi *</label>
                <select
                  name="day"
                  required
                  defaultValue={editingSchedule.day}
                  className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dayNum = i + 1
                    const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
                    const assignedDayName = dayNames[(dayNum - 1) % 5]
                    return (
                      <option key={dayNum} value={`Hari ${dayNum} | ${assignedDayName}`}>
                        Hari {dayNum} ({assignedDayName})
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Ruangan / Platform *</label>
                <Input
                  name="room"
                  required
                  defaultValue={editingSchedule.room}
                  className="text-xs rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tahap & Topik Jadwal *</label>
              <Input
                name="subject_name"
                required
                defaultValue={editingSchedule.subject_name}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Pengampu / Widyaiswara *</label>
              <Input
                name="lecturer"
                required
                defaultValue={editingSchedule.lecturer}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tautan Zoom / LMS (Meeting Link)</label>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-[#253045] px-2 py-0.5 rounded-md">
                  Khusus Tahap 2, 3, 4 Zoom
                </span>
              </div>
              <Input
                name="meeting_link"
                defaultValue={editingSchedule.meeting_link || ""}
                placeholder="Contoh: https://us02web.zoom.us/j/... (Kosongkan jika default LMS)"
                className="text-xs font-mono rounded-[8px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Jam Mulai (WIB) *</label>
                <Input
                  name="start_time"
                  type="time"
                  defaultValue={editingSchedule.start_time}
                  required
                  className="text-xs rounded-[8px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Jam Selesai (WIB) *</label>
                <Input
                  name="end_time"
                  type="time"
                  defaultValue={editingSchedule.end_time}
                  required
                  className="text-xs rounded-[8px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal: Tasks */}
      {editingTask && (
        <Modal
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          title="Edit Data Penugasan"
        >
          <form onSubmit={handleUpdateTaskSubmit} className="space-y-4 pt-2">
            <input type="hidden" name="id" value={editingTask.id} />
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Penugasan *</label>
              <Input
                name="title"
                required
                defaultValue={editingTask.title}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tahap Pelatihan *</label>
                <Input
                  name="subject_name"
                  required
                  defaultValue={editingTask.subject_name}
                  className="text-xs rounded-[8px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Batas Pengumpulan (Deadline) *</label>
                <Input
                  name="due_date"
                  type="date"
                  required
                  defaultValue={editingTask.due_date}
                  className="text-xs rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Instruksi Tugas</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editingTask.description || ""}
                className="w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal: Materials */}
      {editingMaterial && (
        <Modal
          isOpen={Boolean(editingMaterial)}
          onClose={() => setEditingMaterial(null)}
          title="Edit Metadata Modul PDF"
        >
          <form onSubmit={handleUpdateMaterialSubmit} className="space-y-4 pt-2">
            <input type="hidden" name="id" value={editingMaterial.id} />
            
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Modul / Materi *</label>
              <Input
                name="title"
                required
                defaultValue={editingMaterial.title}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tahapan Diklat *</label>
                <select
                  name="subject_name"
                  required
                  defaultValue={editingMaterial.subject_name}
                  className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value="Tahap 1 • MOOC">Tahap 1 • MOOC</option>
                  <option value="Tahap 2 • TMO">Tahap 2 • TMO</option>
                  <option value="Tahap 3 • Lab Prakom">Tahap 3 • Lab Prakom</option>
                  <option value="Tahap 4 • Seminar">Tahap 4 • Seminar</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Minggu Pertemuan *</label>
                <Input
                  name="week_number"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={editingMaterial.week_number || 1}
                  required
                  className="text-xs rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Deskripsi Singkat</label>
              <Input
                name="description"
                defaultValue={editingMaterial.description || ""}
                placeholder="Penjelasan singkat modul dan panduan belajar..."
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingMaterial(null)}
                className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal: Announcements */}
      {editingAnnouncement && (
        <Modal
          isOpen={Boolean(editingAnnouncement)}
          onClose={() => setEditingAnnouncement(null)}
          title="Edit Pengumuman Kelas"
        >
          <form onSubmit={handleUpdateAnnouncementSubmit} className="space-y-4 pt-2">
            <input type="hidden" name="id" value={editingAnnouncement.id} />
            
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Pengumuman *</label>
              <Input
                name="title"
                required
                defaultValue={editingAnnouncement.title}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Nama Pengirim / Pembuat</label>
              <Input
                name="author"
                defaultValue={editingAnnouncement.author || "Pengurus Diklat"}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Isi Pengumuman *</label>
              <textarea
                name="content"
                rows={4}
                required
                defaultValue={editingAnnouncement.content}
                className="w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_urgent_edit"
                name="is_urgent"
                defaultChecked={editingAnnouncement.is_urgent}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-0"
              />
              <label htmlFor="is_urgent_edit" className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Tandai sebagai Pengumuman Mendesak (Tampil di Banner Atas Beranda)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAnnouncement(null)}
                className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Modal: Create Template */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false)
          setSelectedTemplateFile(null)
        }}
        title="Tambah Template Dokumen / Naskah Dinas Baru"
      >
        <form onSubmit={handleCreateTemplateSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Template Dokumen *</label>
            <Input
              name="title"
              required
              placeholder="Contoh: Surat Permohonan Akses Server & Database Perkara"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Kategori Dokumen *</label>
              <select
                name="category"
                required
                defaultValue="Administrasi & SPT"
                className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100"
              >
                <option value="Administrasi & SPT">Administrasi & SPT</option>
                <option value="DUPAK & SKP BPS">DUPAK & SKP BPS</option>
                <option value="SOP & Keamanan">SOP & Keamanan</option>
                <option value="Seminar Akhir">Seminar Akhir</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Format Berkas Utama *</label>
              <select
                name="format"
                required
                defaultValue=".docx Word"
                className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100"
              >
                <option value=".docx Word">.docx Word (Microsoft Word)</option>
                <option value=".doc Word">.doc Word (Klasik)</option>
                <option value=".pdf PDF">.pdf PDF (Dokumen Resmi)</option>
                <option value=".xlsx Excel">.xlsx Excel (Spreadsheet)</option>
              </select>
            </div>
          </div>

          {/* Document File Upload Dropzone (Word, PDF, Excel) */}
          <div className="space-y-2 rounded-[10px] border border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                <UploadCloud className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Unggah Berkas Asli (Word .docx/.doc atau PDF .pdf / Excel .xlsx)</span>
              </label>
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                Maks 50MB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Lampirkan berkas dokumen template agar peserta diklat dapat langsung mengunduh file asli.
            </p>

            <input
              type="file"
              accept=".doc,.docx,.pdf,.xlsx,.xls,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setSelectedTemplateFile(file)
              }}
              className="mt-1 block w-full text-xs text-slate-600 file:mr-3 file:rounded-[8px] file:border-0 file:bg-teal-600 file:px-3.5 file:py-1.5 file:text-xs file:font-black file:text-white hover:file:bg-teal-700 cursor-pointer"
            />

            {selectedTemplateFile && (
              <div className="mt-2 flex items-center justify-between rounded-[8px] bg-white dark:bg-[#1B2130] p-2.5 border border-teal-200 dark:border-teal-800/60 text-xs shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  {selectedTemplateFile.name.toLowerCase().endsWith(".pdf") ? (
                    <FileCode className="h-4 w-4 text-rose-600 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 text-teal-600 shrink-0" />
                  )}
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{selectedTemplateFile.name}</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300 shrink-0 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
                  {(selectedTemplateFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}

            {isUploadingTemplate && (
              <div className="space-y-1 pt-1.5">
                <div className="flex justify-between text-[10px] font-bold text-teal-800 dark:text-teal-300">
                  <span>{templateUploadStatus}</span>
                  <span>{templateUploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-teal-100 dark:bg-[#253045] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 transition-all duration-200"
                    style={{ width: `${templateUploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Dasar Hukum / Regulasi *</label>
              <Input
                name="legalReference"
                required
                placeholder="Contoh: Perpres No. 95/2018 SPBE / Perka BPS 2/2021"
                className="text-xs rounded-[8px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Kode BPS / Butir DUPAK (Opsional)</label>
              <Input
                name="bpsCode"
                placeholder="Contoh: Lampiran II Perka BPS 2/2021"
                className="text-xs font-mono rounded-[8px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tag / Label Pencarian</label>
            <Input
              name="tags"
              placeholder="Contoh: Server, Hak Akses, Kejati, Database"
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Deskripsi Singkat Template</label>
            <Input
              name="description"
              placeholder="Penjelasan fungsi dan peruntukan naskah dinas ini..."
              className="text-xs rounded-[8px]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Isi Teks Naskah Dokumen (Opsional)</label>
              <span className="text-[10px] text-slate-400 font-mono">Format Teks Naskah</span>
            </div>
            <textarea
              name="contentDoc"
              rows={6}
              placeholder="KEJAKSAAN REPUBLIK INDONESIA&#10;KEJAKSAAN TINGGI / NEGERI ........................&#10;&#10;SURAT PERMOHONAN HAK AKSES TIK&#10;NOMOR: B - ...... / L. ... / ... / 2026&#10;..."
              className="w-full font-mono rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs leading-relaxed text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isUploadingTemplate}
              onClick={() => {
                setIsTemplateModalOpen(false)
                setSelectedTemplateFile(null)
              }}
              className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploadingTemplate}
              className="rounded-[8px] bg-teal-600 px-4 py-2 text-xs font-black text-white hover:bg-teal-700 cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isUploadingTemplate ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Mengunggah Berkas...</span>
                </>
              ) : (
                <span>Simpan Template</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* 6. Modal: Edit Template */}
      {editingTemplate && (
        <Modal
          isOpen={Boolean(editingTemplate)}
          onClose={() => {
            setEditingTemplate(null)
            setSelectedTemplateFile(null)
          }}
          title="Edit Template Dokumen"
        >
          <form onSubmit={handleUpdateTemplateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Judul Template Dokumen *</label>
              <Input
                name="title"
                required
                defaultValue={editingTemplate.title}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Kategori Dokumen *</label>
                <select
                  name="category"
                  required
                  defaultValue={editingTemplate.category}
                  className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value="Administrasi & SPT">Administrasi & SPT</option>
                  <option value="DUPAK & SKP BPS">DUPAK & SKP BPS</option>
                  <option value="SOP & Keamanan">SOP & Keamanan</option>
                  <option value="Seminar Akhir">Seminar Akhir</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Format Berkas *</label>
                <select
                  name="format"
                  required
                  defaultValue={editingTemplate.format}
                  className="h-9 w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] px-3 text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value=".docx Word">.docx Word (Microsoft Word)</option>
                  <option value=".doc Word">.doc Word (Klasik)</option>
                  <option value=".pdf PDF">.pdf PDF (Dokumen Resmi)</option>
                  <option value=".xlsx Excel">.xlsx Excel (Spreadsheet)</option>
                </select>
              </div>
            </div>

            {/* Document File Attachment / Replace */}
            <div className="space-y-2 rounded-[10px] border border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 p-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Ganti / Unggah Berkas Dokumen (Word / PDF / Excel)</span>
                </label>
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                  Maks 50MB
                </span>
              </div>

              {editingTemplate.file_name && !selectedTemplateFile && (
                <div className="flex items-center justify-between rounded-[8px] bg-white dark:bg-[#1B2130] p-2.5 border border-slate-200 dark:border-[#2A3550] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-teal-600 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{editingTemplate.file_name}</span>
                  </div>
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
                    Berkas Terpasang
                  </span>
                </div>
              )}

              <input
                type="file"
                accept=".doc,.docx,.pdf,.xlsx,.xls,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setSelectedTemplateFile(file)
                }}
                className="mt-1 block w-full text-xs text-slate-600 file:mr-3 file:rounded-[8px] file:border-0 file:bg-teal-600 file:px-3.5 file:py-1.5 file:text-xs file:font-black file:text-white hover:file:bg-teal-700 cursor-pointer"
              />

              {selectedTemplateFile && (
                <div className="mt-2 flex items-center justify-between rounded-[8px] bg-white dark:bg-[#1B2130] p-2.5 border border-teal-200 dark:border-teal-800/60 text-xs shadow-2xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-teal-600 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{selectedTemplateFile.name}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300 shrink-0 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
                    {(selectedTemplateFile.size / (1024 * 1024)).toFixed(2)} MB (Baru)
                  </span>
                </div>
              )}

              {isUploadingTemplate && (
                <div className="space-y-1 pt-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-teal-800 dark:text-teal-300">
                    <span>{templateUploadStatus}</span>
                    <span>{templateUploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-teal-100 dark:bg-[#253045] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 transition-all duration-200"
                      style={{ width: `${templateUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Dasar Hukum / Regulasi *</label>
                <Input
                  name="legalReference"
                  required
                  defaultValue={editingTemplate.legalReference}
                  className="text-xs rounded-[8px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-slate-100">Kode BPS / Butir DUPAK (Opsional)</label>
                <Input
                  name="bpsCode"
                  defaultValue={editingTemplate.bpsCode || ""}
                  className="text-xs font-mono rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Tag / Label (Pisahkan dengan koma)</label>
              <Input
                name="tags"
                defaultValue={editingTemplate.tags ? editingTemplate.tags.join(", ") : ""}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Deskripsi Singkat</label>
              <Input
                name="description"
                defaultValue={editingTemplate.description}
                className="text-xs rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Isi Naskah Dokumen Lengkap</label>
              <textarea
                name="contentDoc"
                rows={6}
                defaultValue={editingTemplate.contentDoc || ""}
                className="w-full font-mono rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs leading-relaxed text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isUploadingTemplate}
                onClick={() => {
                  setEditingTemplate(null)
                  setSelectedTemplateFile(null)
                }}
                className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUploadingTemplate}
                className="rounded-[8px] bg-teal-600 px-4 py-2 text-xs font-black text-white hover:bg-teal-700 cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isUploadingTemplate ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 7. Modal: Preview Template */}
      {previewingTemplate && (
        <Modal
          isOpen={Boolean(previewingTemplate)}
          onClose={() => setPreviewingTemplate(null)}
          title={`Pratinjau: ${previewingTemplate.title}`}
          className="max-w-4xl"
        >
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                  {previewingTemplate.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">⚖️ {previewingTemplate.legalReference}</span>
              </div>
              <div className="flex items-center gap-2">
                {previewingTemplate.contentDoc && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(previewingTemplate.contentDoc || "")
                      setTemplateCopied(true)
                      setTimeout(() => setTemplateCopied(false), 2000)
                    }}
                    className="flex items-center gap-1 rounded-[6px] bg-white dark:bg-[#1B2130] px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-100 dark:hover:bg-[#253045] cursor-pointer"
                  >
                    {templateCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{templateCopied ? "Tersalin!" : "Salin Teks"}</span>
                  </button>
                )}
                <button
                  onClick={() => handleDownloadTemplateDoc(previewingTemplate)}
                  className="flex items-center gap-1 rounded-[6px] bg-teal-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-teal-700 cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh {previewingTemplate.format}</span>
                </button>
              </div>
            </div>

            {previewingTemplate.file_url?.toLowerCase().endsWith(".pdf") ? (
              <div className="rounded-[10px] border border-slate-200 dark:border-[#2A3550] overflow-hidden bg-slate-100 dark:bg-[#161B26] h-[60vh]">
                <iframe
                  src={previewingTemplate.file_url}
                  title={previewingTemplate.title}
                  className="w-full h-full border-0"
                />
              </div>
            ) : previewingTemplate.contentDoc ? (
              <div className="rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#141824] p-5 max-h-[60vh] overflow-y-auto shadow-inner">
                <pre className="font-serif text-xs leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap selection:bg-teal-100">
                  {previewingTemplate.contentDoc}
                </pre>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-[#161B26] rounded-[10px] border border-slate-200 dark:border-[#2A3550] space-y-2">
                <FileText className="h-8 w-8 mx-auto text-teal-600 dark:text-teal-400" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Berkas dokumen ({previewingTemplate.file_name || previewingTemplate.format}) siap diunduh.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* 8. Modal: Detail Laporan & Form Tindak Lanjut Peserta */}
      {selectedReportForModal && (
        <Modal
          isOpen={Boolean(selectedReportForModal)}
          onClose={() => setSelectedReportForModal(null)}
          title={`Detail Laporan: ${selectedReportForModal.name || "Peserta Anonim"}`}
          className="max-w-2xl"
        >
          <div className="space-y-4 pt-2">
            {/* Header Meta Info */}
            <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/90 dark:border-[#2A3550] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/60">
                    📌 {selectedReportForModal.category}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      selectedReportForModal.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                        : selectedReportForModal.status === "in_progress"
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                    }`}
                  >
                    {selectedReportForModal.status === "pending"
                      ? "⏳ Menunggu"
                      : selectedReportForModal.status === "in_progress"
                      ? "🛠️ Diproses"
                      : "✅ Selesai"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  {selectedReportForModal.created_at ? formatWibDate(selectedReportForModal.created_at) : "-"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold block text-[11px]">Nama Pengirim:</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">{selectedReportForModal.name || "Anonim"}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold block text-[11px]">Satuan Kerja:</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">{selectedReportForModal.satker || "Satker Kejaksaan"}</span>
                </div>
                {selectedReportForModal.contact && (
                  <div className="sm:col-span-2 pt-1 border-t border-slate-200/60 dark:border-[#2A3550] flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold block text-[11px]">Kontak WhatsApp:</span>
                      <span className="font-black text-emerald-700 dark:text-emerald-400">{selectedReportForModal.contact}</span>
                    </div>
                    <a
                      href={generateWaLink(selectedReportForModal)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-2xs"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Balas Pesan WA</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Isi Pesan / Laporan */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span>Uraian Lengkap Laporan / Kendala / Aspirasi:</span>
              </label>
              <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#2A3550] text-xs leading-relaxed font-medium text-slate-900 dark:text-slate-100 whitespace-pre-wrap selection:bg-orange-100 max-h-60 overflow-y-auto">
                {selectedReportForModal.message}
              </div>
            </div>

            {/* Form Catatan & Tindak Lanjut Admin */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>Catatan Tindak Lanjut / Jawaban Solusi Admin:</span>
                <span className="text-[10px] text-slate-400 font-normal">Tersimpan di database</span>
              </label>
              <textarea
                rows={3}
                defaultValue={adminNotesTextMap[selectedReportForModal.id] || selectedReportForModal.admin_notes || ""}
                onChange={(e) =>
                  setAdminNotesTextMap((prev) => ({
                    ...prev,
                    [selectedReportForModal.id]: e.target.value,
                  }))
                }
                placeholder="Tuliskan catatan solusi, PIC penanganan, atau tindak lanjut..."
                className="w-full rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#161B26] p-3 text-xs leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Status Update Quick Buttons in Modal */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-black text-slate-900 dark:text-slate-100">Ubah Status Tiket:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateReportStatus(
                      selectedReportForModal.id,
                      "pending",
                      adminNotesTextMap[selectedReportForModal.id] !== undefined
                        ? adminNotesTextMap[selectedReportForModal.id]
                        : selectedReportForModal.admin_notes
                    )
                    setSelectedReportForModal((prev: any) => prev ? { ...prev, status: "pending" } : null)
                  }}
                  className={`py-2 rounded-[8px] text-xs font-black transition border cursor-pointer ${
                    selectedReportForModal.status === "pending"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-400"
                      : "bg-slate-50 dark:bg-[#161B26] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2A3550] hover:bg-slate-100 dark:hover:bg-[#253045]"
                  }`}
                >
                  ⏳ Pending
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateReportStatus(
                      selectedReportForModal.id,
                      "in_progress",
                      adminNotesTextMap[selectedReportForModal.id] !== undefined
                        ? adminNotesTextMap[selectedReportForModal.id]
                        : selectedReportForModal.admin_notes
                    )
                    setSelectedReportForModal((prev: any) => prev ? { ...prev, status: "in_progress" } : null)
                  }}
                  className={`py-2 rounded-[8px] text-xs font-black transition border cursor-pointer ${
                    selectedReportForModal.status === "in_progress"
                      ? "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-400"
                      : "bg-slate-50 dark:bg-[#161B26] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2A3550] hover:bg-slate-100 dark:hover:bg-[#253045]"
                  }`}
                >
                  🛠️ Diproses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateReportStatus(
                      selectedReportForModal.id,
                      "resolved",
                      adminNotesTextMap[selectedReportForModal.id] !== undefined
                        ? adminNotesTextMap[selectedReportForModal.id]
                        : selectedReportForModal.admin_notes
                    )
                    setSelectedReportForModal((prev: any) => prev ? { ...prev, status: "resolved" } : null)
                  }}
                  className={`py-2 rounded-[8px] text-xs font-black transition border cursor-pointer ${
                    selectedReportForModal.status === "resolved"
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-slate-50 dark:bg-[#161B26] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2A3550] hover:bg-slate-100 dark:hover:bg-[#253045]"
                  }`}
                >
                  ✅ Selesai
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#2A3550]">
              <button
                type="button"
                onClick={() => {
                  handleDeleteReport(selectedReportForModal.id)
                }}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 p-2 rounded-[6px] hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Laporan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReportForModal(null)}
                  className="rounded-[8px] bg-slate-100 dark:bg-[#253045] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2D3A52] cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateReportStatus(
                      selectedReportForModal.id,
                      selectedReportForModal.status || "pending",
                      adminNotesTextMap[selectedReportForModal.id] !== undefined
                        ? adminNotesTextMap[selectedReportForModal.id]
                        : selectedReportForModal.admin_notes
                    )
                    setSelectedReportForModal(null)
                  }}
                  className="rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-indigo-500 cursor-pointer shadow-sm"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Broadcast WhatsApp */}
      <WhatsAppShareModal isOpen={isWAModalOpen} onClose={() => setIsWAModalOpen(false)} />
    </div>
  )
}
