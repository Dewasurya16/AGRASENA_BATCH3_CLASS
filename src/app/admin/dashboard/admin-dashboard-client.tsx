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
  Award
} from "lucide-react"
import { WhatsAppShareModal } from "@/components/public/whatsapp-share-modal"
import { getScheduleDayNumber } from "@/lib/roadmap-utils"

interface VisitorLog {
  id: string
  ip: string
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
  if (totalItems <= pageSize) return null

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
}: AdminDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "visitors" | "materials" | "schedules" | "tasks" | "announcements" | "discussions" | "templates" | "exam_prep" | "paper_gen"
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

  React.useEffect(() => {
    fetchDiscussions()
  }, [])

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
      const matchesSearch =
        visitorSearch === "" ||
        (log.ip || "").toLowerCase().includes(visitorSearch.toLowerCase()) ||
        (log.path || "").toLowerCase().includes(visitorSearch.toLowerCase()) ||
        (log.browser || "").toLowerCase().includes(visitorSearch.toLowerCase()) ||
        (log.os || "").toLowerCase().includes(visitorSearch.toLowerCase()) ||
        (log.referrer || "").toLowerCase().includes(visitorSearch.toLowerCase())

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

  // --- ACTIONS ---
  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip)
    setCopiedIp(ip)
    setTimeout(() => setCopiedIp(null), 2000)
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
    const headers = ["Waktu (UTC)", "IP Address", "Media Akses", "OS", "Browser", "Halaman (Path)", "Referrer"]
    const rows = initialVisitorLogs.map((v) => [
      `"${v.created_at}"`,
      `"${v.ip}"`,
      `"${v.device}"`,
      `"${v.os}"`,
      `"${v.browser}"`,
      `"${v.path}"`,
      `"${v.referrer}"`,
    ])
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
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

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  // --- CRUD: MATERIALS ---
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadModalError(null)

    if (selectedFile && selectedFile.size > 100 * 1024 * 1024) {
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1)
      setUploadModalError(
        `Ukuran berkas (${sizeMB} MB) melebihi batas 100MB. Silakan kompres PDF terlebih dahulu.`
      )
      return
    }

    setIsLoading(true)
    setUploadProgressPercent(0)
    setUploadProgressBytes("")
    setUploadSpeedStr("")
    setUploadProgressStatus("Mempersiapkan unggahan berkas...")

    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/materials/upload", true)

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
          setUploadProgressStatus("Menyimpan metadata modul ke database Supabase...")
        } else {
          setUploadProgressStatus(`Mengunggah berkas (${percent}%)...`)
        }
      }
    }

    xhr.onload = () => {
      setIsLoading(false)
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText)
          if (res.success) {
            setUploadProgressPercent(100)
            showFeedback("success", res.message || "Modul PDF berhasil diunggah!")
            setIsUploadModalOpen(false)
            setSelectedFile(null)
            setUploadModalError(null)
            setUploadProgressStatus(null)
            router.refresh()
          } else {
            setUploadModalError(res.error || "Gagal mengunggah berkas.")
          }
        } catch {
          setUploadModalError("Respon server tidak valid.")
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText)
          setUploadModalError(res.error || `Gagal mengunggah (${xhr.status})`)
        } catch {
          setUploadModalError(`Gagal menghubungi server (${xhr.status}: ${xhr.statusText || "Error / Payload Too Large"})`)
        }
      }
    }

    xhr.onerror = () => {
      setIsLoading(false)
      setUploadModalError("Koneksi jaringan terputus saat mengunggah berkas. Periksa internet Anda dan coba lagi.")
    }

    xhr.ontimeout = () => {
      setIsLoading(false)
      setUploadModalError("Waktu unggah habis (timeout). Silakan periksa ukuran berkas dan koneksi internet.")
    }

    xhr.timeout = 300000 // 5 minutes
    xhr.send(formData)
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
    { id: "materials", label: "Pustaka Modul PDF (120 JP)", icon: FileText, count: initialMaterials.length, color: "text-indigo-600" },
    { id: "schedules", label: "Jadwal 35 Hari", icon: Calendar, count: initialSchedules.length, color: "text-sky-600" },
    { id: "tasks", label: "Penugasan & Ujian", icon: BookOpen, count: initialTasks.length, color: "text-amber-600" },
    { id: "announcements", label: "Pengumuman Kelas", icon: Sparkles, count: initialAnnouncements.length, color: "text-rose-600" },
    { id: "discussions", label: "Moderasi Forum Diskusi", icon: MessageSquare, count: adminDiscussions.length, color: "text-purple-600" },
    { id: "templates", label: "Pusat Template BPS & TIK", icon: Layers, count: 6, color: "text-teal-600" },
    { id: "exam_prep", label: "Kesiapan Ujian & Seminar", icon: Clock, count: 10, color: "text-amber-600" },
    { id: "paper_gen", label: "AI Makalah Inovasi Satker", icon: GraduationCap, count: null, color: "text-rose-600" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      {/* ========================================================================= */}
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-5 space-y-6">
          {/* Brand Logo & Institution Info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white shadow-md">
                <Shield className="h-6 w-6 text-[#FBBF24]" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-slate-900 uppercase">
                  DIKLAT PRAKOM
                </div>
                <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Batch 3 Kejaksaan RI</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Database Live Ping Indicator */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-700">Supabase & Analytics</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              LIVE
            </span>
          </div>

          {/* Sidebar Navigation Items */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-1">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0F172A] text-white shadow-sm shadow-slate-900/10 font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.highlight
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
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
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-1">
              Pintasan Cepat
            </div>
            <button
              onClick={() => setIsWAModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 transition cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>Broadcast WhatsApp</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-amber-500" />
              <span>Backup Database (JSON)</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                AD
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">Admin Diklat</div>
                <div className="text-[10px] text-slate-500 font-medium">admin@kejaksaan.go.id</div>
              </div>
            </div>
            <form action={adminSignOut}>
              <button
                type="submit"
                title="Keluar dari Dashboard"
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
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
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {activeTab === "overview" && "Ringkasan Operasional"}
                  {activeTab === "visitors" && "Statistik & Riwayat Pengunjung"}
                  {activeTab === "materials" && "Pustaka Berkas Modul PDF (120 JP)"}
                  {activeTab === "schedules" && "Jadwal Perkuliahan 35 Hari"}
                  {activeTab === "tasks" && "Penugasan & Uji Praktek"}
                  {activeTab === "announcements" && "Pengumuman Kelas"}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Portal Manajemen Diklat Prakom Kejaksaan RI Batch 3
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sinkron Data</span>
            </button>

            <Link href="/" target="_blank">
              <button className="flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 text-xs font-black text-white transition shadow-2xs cursor-pointer">
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Web Publik</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </button>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Feedback Alert Banner */}
          {feedback && (
            <div
              className={`rounded-2xl p-4 text-xs font-bold border transition-all flex items-center justify-between gap-3 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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
              {/* 5 KPI Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Visitors KPI (Highlight Card) */}
                <div
                  onClick={() => setActiveTab("visitors")}
                  className="group rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white space-y-3 shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-100">Total Pengunjung</span>
                    <Users className="h-5 w-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black">{totalVisitors}</div>
                    <div className="text-[11px] text-emerald-100 font-semibold mt-0.5">
                      {uniqueIps} IP Unik • {todayVisitors} Hari Ini
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-400/30 flex items-center justify-between text-[11px] font-bold text-emerald-200">
                    <span>Lihat Statistik & IP</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Materials */}
                <div
                  onClick={() => setActiveTab("materials")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Pustaka Modul</span>
                    <FileText className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">{initialMaterials.length}</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {totalMaterialSizeMB.toFixed(1)} MB di Storage
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                    <span>Kelola Berkas PDF</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 3. Schedules */}
                <div
                  onClick={() => setActiveTab("schedules")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Jadwal Perkuliahan</span>
                    <Calendar className="h-5 w-5 text-sky-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">{initialSchedules.length}</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Total 35 Hari Sesi
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600">
                    <span>Atur Agenda Diklat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 4. Tasks */}
                <div
                  onClick={() => setActiveTab("tasks")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Tugas Mandiri</span>
                    <BookOpen className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">{initialTasks.length}</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {completedTasksCount} Selesai • {initialTasks.length - completedTasksCount} Pending
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-600">
                    <span>Lihat Penugasan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 5. Announcements */}
                <div
                  onClick={() => setActiveTab("announcements")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Pengumuman Kelas</span>
                    <Sparkles className="h-5 w-5 text-rose-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">{initialAnnouncements.length}</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {initialAnnouncements.filter((a) => a.is_urgent).length} Mendesak / Urgent
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-rose-600">
                    <span>Publikasikan Info</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                {/* 6. Forum Diskusi */}
                <div
                  onClick={() => setActiveTab("discussions")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Forum Diskusi</span>
                    <MessageSquare className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">{adminDiscussions.length}</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Topik Tanya Jawab Peserta
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-600">
                    <span>Kelola & Balas Resmi</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 7. Templates BPS */}
                <div
                  onClick={() => setActiveTab("templates")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Template Dokumen BPS</span>
                    <Layers className="h-5 w-5 text-teal-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">8</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      SPT, DUPAK, SPMK, Audit & SOP
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-600">
                    <span>Lihat & Unduh Format</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 8. Exam Prep & Checklist */}
                <div
                  onClick={() => setActiveTab("exam_prep")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Milestone Kelulusan</span>
                    <Clock className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">10</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Checklist Standar Kelulusan
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-600">
                    <span>Pantau Countdown Ujian</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* 9. AI Paper Generator */}
                <div
                  onClick={() => setActiveTab("paper_gen")}
                  className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">AI Makalah Seminar</span>
                    <GraduationCap className="h-5 w-5 text-rose-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">5 Bab</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Proposal Inovasi Satker
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-rose-600">
                    <span>Uji Generator Makalah</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Quick Action Center */}
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Pusat Aksi Cepat
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tambah materi, buat sesi jadwal baru, publikasikan tugas, atau kirim pengumuman
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 p-4 text-xs font-black text-emerald-800 border border-emerald-200 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Modul PDF</span>
                  </button>

                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-sky-50 hover:bg-sky-100 p-4 text-xs font-black text-sky-800 border border-sky-200 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Sesi Jadwal</span>
                  </button>

                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50 hover:bg-amber-100 p-4 text-xs font-black text-amber-800 border border-amber-200 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Tugas Baru</span>
                  </button>

                  <button
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-rose-50 hover:bg-rose-100 p-4 text-xs font-black text-rose-800 border border-rose-200 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Pengumuman</span>
                  </button>
                </div>
              </div>

              {/* Traffic & Device Distribution Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Media Distribution Bars */}
                <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        Distribusi Media Akses Pengunjung
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("visitors")}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Rincian IP</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Laptop className="h-3.5 w-3.5 text-emerald-600" /> Desktop / Laptop ({deviceStats.desktop})
                        </span>
                        <span>{deviceStats.desktopPct}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${deviceStats.desktopPct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-blue-600" /> Smartphone ({deviceStats.mobile})
                        </span>
                        <span>{deviceStats.mobilePct}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${deviceStats.mobilePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Tablet className="h-3.5 w-3.5 text-purple-600" /> Tablet ({deviceStats.tablet})
                        </span>
                        <span>{deviceStats.tabletPct}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${deviceStats.tabletPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 font-medium">
                        Integrasi <strong>@vercel/analytics</strong> & Pelacak IP Supabase aktif.
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      Ready
                    </span>
                  </div>
                </div>

                {/* Database Metrics Preview */}
                <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm sm:text-base font-black text-slate-900">Status Database</h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-slate-600 font-medium">Total Seluruh Data:</span>
                      <span className="font-black text-slate-900">
                        {initialMaterials.length +
                          initialSchedules.length +
                          initialTasks.length +
                          initialAnnouncements.length +
                          initialVisitorLogs.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-slate-600 font-medium">Pengunjung Unik:</span>
                      <span className="font-black text-emerald-700">{uniqueIps} IP</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-slate-600 font-medium">Kunjungan Hari Ini:</span>
                      <span className="font-black text-blue-700">{todayVisitors} Hits</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-slate-600 font-medium">Total Modul Storage:</span>
                      <span className="font-black text-indigo-700">{initialMaterials.length} PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. VISITOR ANALYTICS TAB (5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "visitors" && (
            <div className="space-y-6">
              {/* 4 Visitor Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Total Kunjungan (Hits)</span>
                    <Eye className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{totalVisitors}</div>
                  <p className="text-[11px] text-emerald-600 font-semibold">Terekam di Supabase</p>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Pengunjung Unik (IP)</span>
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{uniqueIps}</div>
                  <p className="text-[11px] text-blue-600 font-semibold">Alamat IP Berbeda</p>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Kunjungan Hari Ini</span>
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{todayVisitors}</div>
                  <p className="text-[11px] text-amber-600 font-semibold">Akses Sesi Hari Ini</p>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Media Akses Terbanyak</span>
                    <Laptop className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {deviceStats.desktop >= deviceStats.mobile ? "Desktop" : "Mobile"}
                  </div>
                  <p className="text-[11px] text-purple-600 font-semibold">
                    {deviceStats.desktopPct}% Desktop • {deviceStats.mobilePct}% Mobile
                  </p>
                </div>
              </div>

              {/* Main Visitor Logs Table & Toolbar Card */}
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Riwayat Pengunjung & IP Live
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Menampilkan IP pengunjung, media akses (perangkat), browser, sistem operasi, dan halaman yang diakses (5 per halaman)
                    </p>
                  </div>

                  {/* Toolbar Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportVisitorsCSV}
                      className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Ekspor CSV</span>
                    </button>
                    <button
                      onClick={handleExportVisitorsJSON}
                      className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />
                      <span>Ekspor JSON</span>
                    </button>
                    {initialVisitorLogs.length > 0 && (
                      <button
                        onClick={handleClearAllVisitors}
                        className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
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
                      placeholder="Cari berdasarkan IP, Halaman (Path), Browser, OS, atau Referrer..."
                      className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition"
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
                        className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                          visitorDeviceFilter === filter.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table or Empty State */}
                {initialVisitorLogs.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center space-y-3">
                    <Users className="h-10 w-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-900">Belum Ada Riwayat Kunjungan Terekam</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Riwayat kunjungan akan otomatis terisi saat pengguna membuka halaman publik atau modul.
                    </p>
                  </div>
                ) : filteredVisitorLogs.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                    <Search className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Tidak ditemukan log kunjungan yang sesuai dengan kata kunci &quot;{visitorSearch}&quot;
                    </p>
                    <button
                      onClick={() => {
                        setVisitorSearch("")
                        setVisitorDeviceFilter("all")
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Waktu Akses (WIB)</th>
                            <th className="py-3 px-4">Alamat IP</th>
                            <th className="py-3 px-4">Media Akses</th>
                            <th className="py-3 px-4">Sistem Operasi & Browser</th>
                            <th className="py-3 px-4">Halaman (Path)</th>
                            <th className="py-3 px-4">Referrer</th>
                            <th className="py-3 px-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedVisitorLogs.map((log, idx) => {
                            const globalIndex = (visitorPage - 1) * ITEMS_PER_PAGE + idx + 1
                            return (
                              <tr key={log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4 font-bold text-slate-400">{globalIndex}</td>
                                <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                  {formatWibDate(log.created_at)}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                                      {log.ip || "127.0.0.1"}
                                    </span>
                                    <button
                                      onClick={() => handleCopyIp(log.ip || "127.0.0.1")}
                                      title="Salin Alamat IP"
                                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition cursor-pointer"
                                    >
                                      {copiedIp === (log.ip || "127.0.0.1") ? (
                                        <CheckCheck className="h-3 w-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  {getDeviceBadge(log.device)}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-800">{log.browser || "Unknown Browser"}</span>
                                    <span className="text-[11px] text-slate-500">{log.os || "Unknown OS"}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    {log.path || "/"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 max-w-[150px] truncate" title={log.referrer}>
                                  {log.referrer || "Direct"}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {log.id && (
                                    <button
                                      onClick={() => handleDeleteVisitor(log.id)}
                                      title="Hapus baris log ini"
                                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
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
          {/* 3. MATERIALS TAB (GRID & 5 PER HALAMAN) */}
          {/* ========================================================================= */}
          {activeTab === "materials" && (
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Pustaka Berkas Modul (120 JP)</h3>
                  <p className="text-xs text-slate-500">
                    Materi perkuliahan di Supabase Storage (Menampilkan 5 modul per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-2xs self-start sm:self-auto"
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
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition"
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
                      className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                        materialTahapFilter === filter.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {initialMaterials.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                  <FileText className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Belum Ada Modul di Database</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Klik tombol di bawah untuk mengunggah berkas PDF materi pertama Anda.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Berkas PDF Sekarang</span>
                  </button>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                  <Search className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    Tidak ditemukan modul yang sesuai dengan pencarian Anda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedMaterials.map((m) => (
                      <div
                        key={m.id}
                        className="flex flex-col justify-between rounded-2xl bg-slate-50/80 p-4 border border-slate-200/90 gap-3 hover:bg-white hover:shadow-xs transition"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-indigo-50 border border-indigo-200/70 px-2.5 py-0.5 text-[10px] font-black text-indigo-700">
                              {m.subject_name || "Materi Diklat"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              Minggu {m.week_number} • {m.file_size ? `${(m.file_size / 1024 / 1024).toFixed(1)} MB` : "PDF"}
                            </span>
                          </div>
                          <h5 className="font-black text-sm text-slate-900 leading-snug">{m.title}</h5>
                          {m.description && (
                            <p className="text-xs text-slate-600 line-clamp-2">{m.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                            {m.file_name}
                          </div>
                          <div className="flex items-center gap-2">
                            {m.file_url && (
                              <a
                                href={m.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Unduh</span>
                              </a>
                            )}
                            <button
                              onClick={() => setEditingMaterial(m)}
                              className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(m.id, m.file_name)}
                              className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
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
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Jadwal Perkuliahan 35 Hari</h3>
                  <p className="text-xs text-slate-500">
                    Sesi tatap muka online / offline (Menampilkan 5 sesi per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-2xs self-start sm:self-auto"
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
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition"
                />
              </div>

              {initialSchedules.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Belum Ada Sesi Jadwal di Database</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Klik tombol di bawah untuk menambahkan sesi jadwal diklat baru.
                  </p>
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Sesi Jadwal Baru</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedSchedules.map((s) => {
                      const resolvedDayNum = getScheduleDayNumber(s)
                      const displayDayTag = resolvedDayNum ? `Hari ${resolvedDayNum}` : s.day

                      return (
                        <div
                          key={s.id}
                          className="flex flex-col justify-between rounded-2xl bg-slate-50/80 p-4 border border-slate-200/90 gap-3 hover:bg-white hover:shadow-xs transition"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-black text-white">
                                {displayDayTag}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                {s.start_time} - {s.end_time} WIB
                              </span>
                            </div>
                            <h5 className="font-black text-sm text-slate-900 leading-snug">{s.subject_name}</h5>
                            <div className="text-xs text-slate-500 space-y-0.5">
                              <div>👨‍🏫 {s.lecturer}</div>
                              <div>🏢 {s.room}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200/60">
                            <button
                              onClick={() => setEditingSchedule(s)}
                              className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(s.id)}
                              className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
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
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Penugasan & Uji Praktek</h3>
                  <p className="text-xs text-slate-500">
                    Kelola tugas mandiri dan batas deadline (Menampilkan 5 tugas per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Buat Tugas Baru</span>
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: "Semua Tugas" },
                  { id: "pending", label: "⏳ Belum Selesai (Pending)" },
                  { id: "completed", label: "✅ Sudah Selesai" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setTaskFilter(filter.id as any)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      taskFilter === filter.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {initialTasks.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                  <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Belum Ada Penugasan di Database</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Klik tombol di bawah untuk membuat tugas diklat baru.
                  </p>
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Tugas Baru Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex flex-col justify-between rounded-2xl bg-slate-50/80 p-4 border border-slate-200/90 gap-3 hover:bg-white hover:shadow-xs transition"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                                t.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {t.status === "completed" ? "Selesai" : "Pending"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              Deadline: {new Date(t.due_date).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" })} • 23:59 WIB
                            </span>
                          </div>
                          <h5 className="font-black text-sm text-slate-900 leading-snug">{t.title}</h5>
                          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Tahap</span>
                            <span>{t.subject_name}</span>
                          </div>
                          {t.description && (
                            <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, t.status)}
                            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>{t.status === "completed" ? "Ubah ke Pending" : "Tandai Selesai"}</span>
                          </button>
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => setEditingTask(t)}
                              className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTask(t.id)}
                              className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
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
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Pengumuman Kelas</h3>
                  <p className="text-xs text-slate-500">
                    Pengumuman di portal beranda peserta (Menampilkan 5 pengumuman per halaman)
                  </p>
                </div>
                <button
                  onClick={() => setIsAnnouncementModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Buat Pengumuman</span>
                </button>
              </div>

              {initialAnnouncements.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                  <Sparkles className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Belum Ada Pengumuman di Database</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Klik tombol di bawah untuk membuat pengumuman kelas pertama Anda.
                  </p>
                  <button
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Pengumuman Baru</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Responsive Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedAnnouncements.map((a) => (
                      <div
                        key={a.id}
                        className="flex flex-col justify-between rounded-2xl bg-slate-50/80 p-4 border border-slate-200/90 gap-3 hover:bg-white hover:shadow-xs transition"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            {a.is_urgent ? (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">
                                Mendesak / Urgent
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-black text-slate-700">
                                Info Kelas
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-slate-500 truncate max-w-[120px]">
                              {a.author}
                            </span>
                          </div>
                          <h5 className="font-black text-sm text-slate-900 leading-snug">{a.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{a.content}</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => setEditingAnnouncement(a)}
                            className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(a.id)}
                            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
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
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <span>Moderasi Forum Diskusi & Tanya Jawab Peserta</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pantau pertanyaan peserta, kirimkan balasan resmi atas nama Panitia/Widyaiswara, dan moderasi konten diskusi
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 border border-purple-200 hover:bg-purple-100 transition shadow-2xs"
                    >
                      <span>Lihat Halaman Publik</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={discussionSearch}
                      onChange={(e) => setDiscussionSearch(e.target.value)}
                      placeholder="Cari pertanyaan / nama / satker..."
                      className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["all", "#TeknisKodingLab", "#PengolahanData", "#DatabasePostgres", "#JaringanServer", "#AuditTI", "#ITILdanSPBE", "#TugasMandiri", "#SeminarAkhir", "#LMS", "#Umum"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setDiscussionTagFilter(tag)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          discussionTagFilter === tag
                            ? "bg-purple-700 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {tag === "all" ? "Semua Tag" : tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discussions List */}
                <div className="space-y-4 pt-2">
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
                        className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                              {thread.authorName?.charAt(0) || "P"}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900">{thread.authorName}</h4>
                              <span className="text-[11px] text-slate-500">{thread.authorSatker}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                              {thread.tag}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              👍 {thread.upvotes} Dukungan
                            </span>
                            <button
                              onClick={() => handleDeleteDiscussionThread(thread.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                              title="Hapus Thread"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-900 mb-1">{thread.title}</h4>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                        </div>

                        {/* Existing Replies */}
                        {thread.replies && thread.replies.length > 0 && (
                          <div className="border-t border-slate-200/70 pt-3 space-y-2">
                            <span className="text-[11px] font-bold text-slate-500">
                              {thread.replies.length} Tanggapan Diskusi:
                            </span>
                            {thread.replies.map((reply: any) => (
                              <div
                                key={reply.id}
                                className={`p-3 rounded-xl border text-xs space-y-1 ${
                                  reply.isOfficial
                                    ? "bg-emerald-50/80 border-emerald-200"
                                    : "bg-white border-slate-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    {reply.authorName}
                                    {reply.isOfficial && (
                                      <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                                        Official Admin
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
                                <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Admin Reply Box */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
                          <input
                            type="text"
                            value={adminReplyTextMap[thread.id] || ""}
                            onChange={(e) =>
                              setAdminReplyTextMap((prev) => ({ ...prev, [thread.id]: e.target.value }))
                            }
                            placeholder="Balas resmi sebagai Panitia / Widyaiswara Badiklat..."
                            className="h-9 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:outline-none"
                          />
                          <button
                            onClick={() => handleAdminReplySubmit(thread.id)}
                            disabled={isReplyingAdminMap[thread.id]}
                            className="h-9 px-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <Send className="h-3 w-3" />
                            <span>Kirim Tanggapan</span>
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
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-teal-600" />
                      <span>Koleksi Template Dokumen Resmi (BPS & Kejaksaan RI)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      8 Berkas standar resmi Perka BPS No. 2/2021, ISO 31000, ITIL AXELOS, dan Tata Naskah Dinas Kejaksaan RI
                    </p>
                  </div>
                  <a
                    href="/templates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 border border-teal-200 hover:bg-teal-100 transition shadow-2xs"
                  >
                    <span>Buka Pusat Template</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {[
                    { title: "Surat Perintah Tugas (SPT) TI", category: "Administrasi & SPT", ref: "Pedoman Tata Naskah Kejaksaan", desc: "Format penomoran PRINT resmi penugasan pemeliharaan server, jaringan & database." },
                    { title: "Formulir DUPAK & SPMK Prakom", category: "DUPAK & SKP BPS", ref: "Perka BPS No. 2/2021", desc: "Surat Pernyataan Melakukan Kegiatan 5 Sub-Unsur & butir angka kredit resmi." },
                    { title: "Konversi SKP ke PAK Integrasi", category: "DUPAK & SKP BPS", ref: "PermenPAN-RB No. 1/2023", desc: "Konversi predikat kinerja tahunan PNS ke Angka Kredit Integrasi." },
                    { title: "SOP Ruang Server & Keamanan", category: "SOP & Keamanan", ref: "Perpres 95/2018 SPBE", desc: "Tata tertib server, jadwal backup otomatis harian, dan tanggap darurat CSIRT." },
                    { title: "Laporan Temuan Audit TI", category: "SOP & Keamanan", ref: "Standar ITIL AXELOS", desc: "Matriks temuan audit memuat Kondisi, Kriteria, Risiko, dan Rekomendasi." },
                    { title: "Risk Register TI ISO 31000", category: "SOP & Keamanan", ref: "ISO 31000:2018", desc: "Matriks identifikasi ancaman, Likelihood x Impact, dan mitigasi risiko." },
                    { title: "Berita Acara Kerusakan TIK", category: "Administrasi & SPT", ref: "Tata Kelola BMN Kejaksaan", desc: "BAP pemeriksaan fisik dan diagnosa kerusakan perangkat PC/server dinas." },
                    { title: "Format Makalah Seminar Akhir", category: "Seminar Akhir", ref: "Pusdiklat Badiklat Kejaksaan", desc: "Format naskah proposal inovasi 5 Bab dengan Lembar Pengesahan Coach & Penguji." }
                  ].map((tpl, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                          {tpl.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">.doc Word</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">{tpl.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{tpl.desc}</p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1">⚖️ Dasar: {tpl.ref}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. EXAM PREP & GRADUATION MILESTONES TAB */}
          {/* ========================================================================= */}
          {activeTab === "exam_prep" && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span>Milestone Ujian Evaluasi & Sidang Seminar Akhir</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target jadwal hari H, kriteria penilaian widyaiswara, dan 10 checklist kelulusan diklat
                    </p>
                  </div>
                  <a
                    href="/exam-prep"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 border border-amber-200 hover:bg-amber-100 transition shadow-2xs"
                  >
                    <span>Buka Halaman Ujian</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Hari Ke-30 (23 Sept 2026)</span>
                    <h4 className="text-xs font-black text-slate-900">Ujian Komprehensif MOOC</h4>
                    <p className="text-[11px] text-slate-600">Materi regulasi SPBE, PermenPAN 32/2020, dan Perka BPS 2/2021.</p>
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/50 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Hari Ke-33 (28 Sept 2026)</span>
                    <h4 className="text-xs font-black text-slate-900">Batas Unggah Makalah Inovasi</h4>
                    <p className="text-[11px] text-slate-600">Pengumpulan naskah proposal proyek aksi perubahan satker di LMS.</p>
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/50 space-y-1.5">
                    <span className="text-[10px] font-bold text-purple-800 uppercase">Hari Ke-35 (30 Sept 2026)</span>
                    <h4 className="text-xs font-black text-slate-900">Sidang Seminar & Evaluasi Akhir</h4>
                    <p className="text-[11px] text-slate-600">Presentasi paparan 10 menit di hadapan Penguji dan Coach Widyaiswara.</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-black text-slate-900">Bobot Penilaian Sidang Seminar:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="block text-base font-black text-emerald-700">30%</span>
                      <span className="text-[10px] text-slate-500 font-bold">Relevansi Inovasi Satker</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="block text-base font-black text-blue-700">25%</span>
                      <span className="text-[10px] text-slate-500 font-bold">Kepatuhan SPBE & BPS</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="block text-base font-black text-amber-700">25%</span>
                      <span className="text-[10px] text-slate-500 font-bold">Arsitektur & Keamanan TI</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="block text-base font-black text-purple-700">20%</span>
                      <span className="text-[10px] text-slate-500 font-bold">Sistematika Presentasi</span>
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
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-rose-600" />
                      <span>AI Generator Makalah Proyek Akhir & Inovasi Satker</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mesin penyusun naskah akademik 5 Bab lengkap terintegrasi Groq AI berstandar Pusdiklat Kejaksaan RI
                    </p>
                  </div>
                  <a
                    href="/paper-generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-2xs"
                  >
                    <span>Uji Generator Publik</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-rose-600" />
                      <span>Spesifikasi Engine AI:</span>
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• <strong>Model AI:</strong> Groq <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[11px] border">groq/compound-mini</code></li>
                      <li>• <strong>Suhu (Temperature):</strong> 0.25 (Akademik Konsisten & Terstruktur)</li>
                      <li>• <strong>Struktur Output:</strong> 5 Bab Lengkap (Pendahuluan, Regulasi, Arsitektur, Aksi, Rekomendasi)</li>
                      <li>• <strong>Format Ekspor:</strong> Dokumen Microsoft Word (.doc) A4 Margin 3cm x 2.5cm</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span>Topik Preset Inovasi Satker:</span>
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>1. Otomasi Backup & Replikasi DB Perkara Tilang & CMS PTSP</li>
                      <li>2. Dashboard Monitoring Indeks SPBE Satker</li>
                      <li>3. Notifikasi Digital Jadwal Sidang Berbasis WhatsApp API</li>
                      <li>4. Penguatan Keamanan Server & SOP CSIRT Kejaksaan</li>
                      <li>5. Single Sign-On (SSO) Hak Akses Pegawai</li>
                    </ul>
                  </div>
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
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 p-3.5 text-xs text-rose-800 border-2 border-rose-200">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{uploadModalError}</p>
                <p className="text-[11px] text-rose-600">
                  Tips: Jika berkas di atas 20MB, pastikan koneksi internet stabil atau kompres ukuran PDF via ilovepdf.com jika diperlukan.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900">Pilih Berkas PDF *</label>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
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
              className="w-full text-xs font-medium text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-xs file:font-black file:text-white hover:file:bg-slate-800 cursor-pointer disabled:opacity-50"
            />
            {selectedFile && (
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="truncate max-w-[240px]">📄 {selectedFile.name}</span>
                <span className="font-bold text-slate-900 shrink-0">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Judul Modul / Materi *</label>
            <Input
              name="title"
              required
              disabled={isLoading}
              placeholder="Contoh: Modul 01 - Pengantar Basis Data Kejaksaan RI"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Tahapan Diklat *</label>
              <select
                name="subject_name"
                required
                disabled={isLoading}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800 disabled:opacity-50"
              >
                <option value="Tahap 1 • MOOC">Tahap 1 • MOOC</option>
                <option value="Tahap 2 • TMO">Tahap 2 • TMO</option>
                <option value="Tahap 3 • Lab Prakom">Tahap 3 • Lab Prakom</option>
                <option value="Tahap 4 • Seminar">Tahap 4 • Seminar</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Minggu Pertemuan *</label>
              <Input
                name="week_number"
                type="number"
                min="1"
                max="10"
                defaultValue={1}
                required
                disabled={isLoading}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Deskripsi Singkat (Opsional)</label>
            <Input
              name="description"
              disabled={isLoading}
              placeholder="Penjelasan singkat modul dan panduan belajar..."
              className="text-xs"
            />
          </div>

          {/* Live Progress Bar Container */}
          {isLoading && (
            <div className="space-y-2 rounded-2xl bg-blue-50 p-4 border border-blue-200">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
                  <span>{uploadProgressStatus}</span>
                </div>
                <span className="font-mono text-blue-700">{uploadProgressPercent}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-blue-200/80">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-blue-700">
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
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isLoading ? "Sedang Mengunggah..." : "Upload Sekarang"}</span>
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
              <label className="text-xs font-black text-slate-900">Pilih Hari / Sesi *</label>
              <select
                name="day"
                required
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
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
              <label className="text-xs font-black text-slate-900">Ruangan / Platform *</label>
              <Input
                name="room"
                required
                defaultValue="Zoom Diklat & LMS Badiklat"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Tahap & Topik Jadwal *</label>
            <Input
              name="subject_name"
              required
              placeholder="Contoh: Tahap 1 • Arsitektur Cloud & Keamanan Siber Kejaksaan"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Nama Dosen / Widyaiswara *</label>
            <Input
              name="lecturer"
              required
              placeholder="Contoh: Dr. Ir. Widyaiswara Utama, M.Kom"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900">Tautan Zoom / LMS (Meeting Link)</label>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                Khusus Tahap 2, 3, 4 Zoom
              </span>
            </div>
            <Input
              name="meeting_link"
              placeholder="Contoh: https://us02web.zoom.us/j/... (Kosongkan jika default LMS)"
              className="text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Jam Mulai (WIB) *</label>
              <Input name="start_time" type="time" defaultValue="08:00" required className="text-xs" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Jam Selesai (WIB) *</label>
              <Input name="end_time" type="time" defaultValue="11:30" required className="text-xs" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
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
            <label className="text-xs font-black text-slate-900">Judul Penugasan *</label>
            <Input
              name="title"
              required
              placeholder="Contoh: Tugas Mandiri 03 - Konfigurasi Server Linux & Docker"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Tahap Pelatihan *</label>
              <Input
                name="subject_name"
                required
                placeholder="Contoh: Tahap 1 • MOOC / Tahap 2 • TMO"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Batas Pengumpulan (Deadline) *</label>
              <Input
                name="due_date"
                type="date"
                required
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Instruksi / Deskripsi Tugas</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Jelaskan format pengumpulan, tautan Google Drive / LMS, dan petunjuk praktis..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
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
            <label className="text-xs font-black text-slate-900">Judul Pengumuman *</label>
            <Input
              name="title"
              required
              placeholder="Contoh: [PENTING] Jadwal Gladi Bersih Ujian MOOC 120 JP"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Nama Pembuat / Pengirim</label>
            <Input
              name="author"
              defaultValue="Pengurus Diklat Prakom Batch 3"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900">Isi Pesan Pengumuman *</label>
            <textarea
              name="content"
              rows={4}
              required
              placeholder="Tuliskan detail pengumuman untuk seluruh rekan peserta diklat..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_urgent"
              name="is_urgent"
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-0"
            />
            <label htmlFor="is_urgent" className="text-xs font-bold text-rose-600">
              Tandai sebagai Pengumuman Mendesak (Tampil di Banner Atas Beranda)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAnnouncementModalOpen(false)}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
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
                <label className="text-xs font-black text-slate-900">Hari / Sesi *</label>
                <select
                  name="day"
                  required
                  defaultValue={editingSchedule.day}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900"
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
                <label className="text-xs font-black text-slate-900">Ruangan / Platform *</label>
                <Input
                  name="room"
                  required
                  defaultValue={editingSchedule.room}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Tahap & Topik Jadwal *</label>
              <Input
                name="subject_name"
                required
                defaultValue={editingSchedule.subject_name}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Pengampu / Widyaiswara *</label>
              <Input
                name="lecturer"
                required
                defaultValue={editingSchedule.lecturer}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900">Tautan Zoom / LMS (Meeting Link)</label>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                  Khusus Tahap 2, 3, 4 Zoom
                </span>
              </div>
              <Input
                name="meeting_link"
                defaultValue={editingSchedule.meeting_link || ""}
                placeholder="Contoh: https://us02web.zoom.us/j/... (Kosongkan jika default LMS)"
                className="text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900">Jam Mulai (WIB) *</label>
                <Input
                  name="start_time"
                  type="time"
                  defaultValue={editingSchedule.start_time}
                  required
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900">Jam Selesai (WIB) *</label>
                <Input
                  name="end_time"
                  type="time"
                  defaultValue={editingSchedule.end_time}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
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
              <label className="text-xs font-black text-slate-900">Judul Penugasan *</label>
              <Input
                name="title"
                required
                defaultValue={editingTask.title}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900">Tahap Pelatihan *</label>
                <Input
                  name="subject_name"
                  required
                  defaultValue={editingTask.subject_name}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900">Batas Pengumpulan (Deadline) *</label>
                <Input
                  name="due_date"
                  type="date"
                  required
                  defaultValue={editingTask.due_date}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Instruksi Tugas</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editingTask.description || ""}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
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
              <label className="text-xs font-black text-slate-900">Judul Modul / Materi *</label>
              <Input
                name="title"
                required
                defaultValue={editingMaterial.title}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900">Tahapan Diklat *</label>
                <select
                  name="subject_name"
                  required
                  defaultValue={editingMaterial.subject_name}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900"
                >
                  <option value="Tahap 1 • MOOC">Tahap 1 • MOOC</option>
                  <option value="Tahap 2 • TMO">Tahap 2 • TMO</option>
                  <option value="Tahap 3 • Lab Prakom">Tahap 3 • Lab Prakom</option>
                  <option value="Tahap 4 • Seminar">Tahap 4 • Seminar</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900">Minggu Pertemuan *</label>
                <Input
                  name="week_number"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={editingMaterial.week_number || 1}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Deskripsi Singkat</label>
              <Input
                name="description"
                defaultValue={editingMaterial.description || ""}
                placeholder="Penjelasan singkat modul dan panduan belajar..."
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingMaterial(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
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
              <label className="text-xs font-black text-slate-900">Judul Pengumuman *</label>
              <Input
                name="title"
                required
                defaultValue={editingAnnouncement.title}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Nama Pengirim / Pembuat</label>
              <Input
                name="author"
                defaultValue={editingAnnouncement.author || "Pengurus Diklat"}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">Isi Pengumuman *</label>
              <textarea
                name="content"
                rows={4}
                required
                defaultValue={editingAnnouncement.content}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:border-slate-800 focus:outline-none"
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
              <label htmlFor="is_urgent_edit" className="text-xs font-bold text-rose-600">
                Tandai sebagai Pengumuman Mendesak (Tampil di Banner Atas Beranda)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAnnouncement(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Broadcast WhatsApp */}
      <WhatsAppShareModal isOpen={isWAModalOpen} onClose={() => setIsWAModalOpen(false)} />
    </div>
  )
}
