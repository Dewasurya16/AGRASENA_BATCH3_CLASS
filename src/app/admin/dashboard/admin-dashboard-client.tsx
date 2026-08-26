'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  adminSignOut,
  createSchedule,
  deleteSchedule,
  uploadMaterial,
  deleteMaterial,
  createTask,
  updateTaskStatus,
  deleteTask,
  createAnnouncement,
  deleteAnnouncement,
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
  FileSpreadsheet
} from "lucide-react"
import { WhatsAppShareModal } from "@/components/public/whatsapp-share-modal"

interface AdminDashboardClientProps {
  initialMaterials: any[]
  initialSchedules: any[]
  initialTasks: any[]
  initialAnnouncements: any[]
}

export function AdminDashboardClient({
  initialMaterials,
  initialSchedules,
  initialTasks,
  initialAnnouncements,
}: AdminDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<"overview" | "materials" | "schedules" | "tasks" | "announcements">("overview")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  // Upload State
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [uploadProgressStatus, setUploadProgressStatus] = React.useState<string | null>(null)

  // Active Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false)
  const [isWAModalOpen, setIsWAModalOpen] = React.useState(false)

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleExportJSON = () => {
    const backupData = {
      materials: initialMaterials,
      schedules: initialSchedules,
      tasks: initialTasks,
      announcements: initialAnnouncements,
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

  // CRUD Handlers
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedFile && selectedFile.size > 50 * 1024 * 1024) {
      showFeedback("error", `Ukuran file melebihi batas 50MB (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Silakan kompres PDF terlebih dahulu.`)
      return
    }

    setIsLoading(true)
    const sizeInMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : "0"
    setUploadProgressStatus(`Mengunggah berkas PDF (${sizeInMB} MB) ke Supabase Storage...`)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await uploadMaterial(formData)

      if (res?.error) {
        showFeedback("error", res.error)
      } else if (res?.success) {
        showFeedback("success", res.success)
        setIsUploadModalOpen(false)
        setSelectedFile(null)
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan saat mengunggah berkas."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
      setUploadProgressStatus(null)
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
        showFeedback("success", "Materi berhasil dihapus.")
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus materi."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan jadwal."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return
    setIsLoading(true)
    try {
      const res = await deleteSchedule(id)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        showFeedback("success", "Jadwal berhasil dihapus.")
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus jadwal."
      showFeedback("error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan tugas."
      showFeedback("error", errorMsg)
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

  const handleUpdateTaskStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "completed" ? "todo" : "completed"
      const res = await updateTaskStatus(id, nextStatus as any)
      if (res?.error) {
        showFeedback("error", res.error)
      } else {
        router.refresh()
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui status tugas."
      showFeedback("error", errorMsg)
    }
  }

  const handleAnnouncementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header Navbar */}
      <div className="mx-auto max-w-6xl rounded-3xl bg-white border-2 border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#18181B] text-white shadow-md">
            <Shield className="h-6 w-6 text-[#FFD280]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-[#18181B] tracking-tight">
                Dashboard Pengurus Diklat
              </h1>
              <span className="rounded-full bg-[#E6F7ED] px-2.5 py-0.5 text-[10px] font-black text-[#0D824B] border border-[#A7F3D0]">
                Live Supabase CRUD
              </span>
            </div>
            <p className="text-xs text-[#6B7C93]">
              Kelola modul PDF, jadwal 35 hari, tugas mandiri, dan pengumuman kelas secara langsung
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsWAModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-3.5 py-2 text-xs font-black text-[#0D824B] border border-[#A7F3D0] hover:bg-[#D1F2DF] transition cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Broadcast WA</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#18181B] border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#FF7643]" />
            <span>Backup Data (JSON)</span>
          </button>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#18181B] border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sinkron Data</span>
          </button>
          <Link href="/">
            <button className="flex items-center gap-1.5 rounded-full bg-[#F4F6FA] px-4 py-2 text-xs font-bold text-[#18181B] hover:bg-slate-200 transition cursor-pointer">
              <Home className="h-3.5 w-3.5" />
              <span>Lihat Web Utama</span>
            </button>
          </Link>
          <form action={adminSignOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-[#FFEAE9] px-4 py-2 text-xs font-bold text-[#E11D48] hover:bg-[#FFD2D0] transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="mx-auto max-w-6xl">
          <div
            className={`rounded-2xl p-4 text-xs font-bold border transition-all ${
              feedback.type === "success"
                ? "bg-[#E6F7ED] text-[#0D824B] border-[#A7F3D0]"
                : "bg-[#FFEAE9] text-[#E11D48] border-[#FFCDCA]"
            }`}
          >
            {feedback.text}
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: "overview", label: "Ringkasan", count: null },
            { id: "materials", label: "Upload Materi PDF (120 JP)", count: initialMaterials.length },
            { id: "schedules", label: "Jadwal 35 Hari", count: initialSchedules.length },
            { id: "tasks", label: "Tugas & Uji Praktek", count: initialTasks.length },
            { id: "announcements", label: "Pengumuman Kelas", count: initialAnnouncements.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#18181B] text-white shadow-sm"
                  : "bg-white text-[#52647C] hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-black ${
                    activeTab === tab.id ? "bg-white text-[#18181B]" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container Content */}
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl bg-white border-2 border-slate-200 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7C93]">Total Modul Terunggah</span>
                  <FileText className="h-5 w-5 text-[#0D824B]" />
                </div>
                <div className="text-3xl font-black text-[#18181B]">{initialMaterials.length}</div>
                <p className="text-[11px] text-[#0D824B] font-semibold">Tersimpan di Supabase</p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-slate-200 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7C93]">Sesi Jadwal Aktif</span>
                  <Calendar className="h-5 w-5 text-[#0369A1]" />
                </div>
                <div className="text-3xl font-black text-[#18181B]">{initialSchedules.length}</div>
                <p className="text-[11px] text-[#0369A1] font-semibold">Perkuliahan 35 Hari</p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-slate-200 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7C93]">Penugasan Mandiri</span>
                  <BookOpen className="h-5 w-5 text-[#EA580C]" />
                </div>
                <div className="text-3xl font-black text-[#18181B]">{initialTasks.length}</div>
                <p className="text-[11px] text-[#EA580C] font-semibold">Uji Praktek & LMS</p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-slate-200 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7C93]">Pengumuman Kelas</span>
                  <Sparkles className="h-5 w-5 text-[#E11D48]" />
                </div>
                <div className="text-3xl font-black text-[#18181B]">{initialAnnouncements.length}</div>
                <p className="text-[11px] text-[#E11D48] font-semibold">Broadcast Peserta</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-[#18181B]">Aksi Cepat Pengelolaan Data Live</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#E6F7ED] hover:bg-[#D1FAE5] p-4 text-xs font-black text-[#0D824B] border border-[#A7F3D0] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload Modul PDF</span>
                </button>

                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#D7F3FE] hover:bg-[#BAE6FD] p-4 text-xs font-black text-[#0369A1] border border-[#7DD3FC] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Sesi Jadwal</span>
                </button>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFEADA] hover:bg-[#FED7AA] p-4 text-xs font-black text-[#EA580C] border border-[#FDBA74] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Buat Tugas Baru</span>
                </button>

                <button
                  onClick={() => setIsAnnouncementModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFE3EB] hover:bg-[#FBCFE8] p-4 text-xs font-black text-[#E11D48] border border-[#F9A8D4] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Buat Pengumuman</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Materials */}
        {activeTab === "materials" && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#18181B]">Pustaka Berkas Modul (Supabase Storage)</h3>
                <p className="text-xs text-[#6B7C93]">Kelola materi live yang langsung tampil di halaman /materials</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[#18181B] px-4 py-2 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Upload Modul PDF</span>
              </button>
            </div>

            {initialMaterials.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <FileText className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-[#18181B]">Belum Ada Modul di Database</h4>
                <p className="text-xs text-[#6B7C93] max-w-sm mx-auto">
                  Semua dummy telah dibersihkan. Klik tombol di bawah untuk mengunggah berkas PDF materi pertama Anda.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] px-5 py-2.5 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Berkas PDF Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {initialMaterials.map((m) => (
                  <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 border border-slate-200 gap-3">
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-[#18181B]">{m.title}</h5>
                      <p className="text-xs text-[#6B7C93]">
                        {m.subject_name} • Minggu {m.week_number} • {m.file_size ? `${(m.file_size / 1024 / 1024).toFixed(2)} MB` : "PDF"} • {m.file_name}
                      </p>
                      {m.description && (
                        <p className="text-xs text-[#52647C] italic">{m.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {m.file_url && (
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-[#0D824B] hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteMaterial(m.id, m.file_name)}
                        className="flex items-center gap-1 text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Schedules */}
        {activeTab === "schedules" && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#18181B]">Jadwal Perkuliahan (Supabase Database)</h3>
                <p className="text-xs text-[#6B7C93]">Kelola jam sesi dan pemateri live</p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[#18181B] px-4 py-2 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Sesi Jadwal</span>
              </button>
            </div>

            {initialSchedules.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-[#18181B]">Belum Ada Sesi Jadwal di Database</h4>
                <p className="text-xs text-[#6B7C93] max-w-sm mx-auto">
                  Semua dummy telah dibersihkan. Klik tombol di bawah untuk menambahkan sesi jadwal diklat baru.
                </p>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] px-5 py-2.5 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Sesi Jadwal Baru</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {initialSchedules.map((s) => (
                  <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 border border-slate-200 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#18181B] px-2.5 py-0.5 text-[10px] font-black text-white">{s.day}</span>
                        <span className="text-xs font-semibold text-[#6B7C93]">{s.start_time} - {s.end_time}</span>
                      </div>
                      <h5 className="font-bold text-sm text-[#18181B]">{s.subject_name}</h5>
                      <p className="text-xs text-[#6B7C93]">Pengampu: {s.lecturer} • Ruang: {s.room}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(s.id)}
                      className="flex items-center gap-1 text-xs font-bold text-[#E11D48] hover:underline self-end sm:self-auto cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tasks */}
        {activeTab === "tasks" && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#18181B]">Daftar Tugas & Uji Praktik</h3>
                <p className="text-xs text-[#6B7C93]">Kelola batas waktu dan link pengumpulan LMS</p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[#18181B] px-4 py-2 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Buat Tugas Baru</span>
              </button>
            </div>

            {initialTasks.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-[#18181B]">Belum Ada Tugas di Database</h4>
                <p className="text-xs text-[#6B7C93] max-w-sm mx-auto">
                  Semua dummy telah dibersihkan. Klik tombol di bawah untuk membuat penugasan mandiri pertama.
                </p>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] px-5 py-2.5 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Buat Tugas Baru Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {initialTasks.map((t) => (
                  <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 border border-slate-200 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                          t.status === "completed" ? "bg-[#E6F7ED] text-[#0D824B]" : "bg-[#FFEADA] text-[#EA580C]"
                        }`}>
                          {t.status === "completed" ? "Selesai" : "Aktif"}
                        </span>
                        <span className="text-xs font-bold text-[#EA580C]">Tenggat: {new Date(t.due_date).toLocaleDateString("id-ID")}</span>
                      </div>
                      <h5 className="font-bold text-sm text-[#18181B]">{t.title}</h5>
                      <p className="text-xs text-[#6B7C93]">{t.subject_name}</p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <button
                        onClick={() => handleUpdateTaskStatus(t.id, t.status)}
                        className="text-xs font-bold text-[#0D824B] hover:underline cursor-pointer"
                      >
                        {t.status === "completed" ? "Tandai Belum Selesai" : "Tandai Selesai"}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="flex items-center gap-1 text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Announcements */}
        {activeTab === "announcements" && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#18181B]">Papan Pengumuman & Broadcast</h3>
                <p className="text-xs text-[#6B7C93]">Kirim pengumuman live kepada seluruh peserta</p>
              </div>
              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[#18181B] px-4 py-2 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Buat Pengumuman</span>
              </button>
            </div>

            {initialAnnouncements.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <Sparkles className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-[#18181B]">Belum Ada Pengumuman di Database</h4>
                <p className="text-xs text-[#6B7C93] max-w-sm mx-auto">
                  Semua dummy telah dibersihkan. Klik tombol di bawah untuk membuat pengumuman atau broadcast kelas baru.
                </p>
                <button
                  onClick={() => setIsAnnouncementModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] px-5 py-2.5 text-xs font-black text-white hover:bg-[#27272A] transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Buat Pengumuman Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {initialAnnouncements.map((a) => (
                  <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 border border-slate-200 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {a.is_urgent && (
                          <span className="rounded-full bg-[#FFEAE9] px-2.5 py-0.5 text-[10px] font-black text-[#E11D48] border border-[#FFCDCA]">
                            Mendesak / Urgent
                          </span>
                        )}
                        <span className="text-xs font-semibold text-[#6B7C93]">Oleh: {a.author}</span>
                      </div>
                      <h5 className="font-bold text-sm text-[#18181B]">{a.title}</h5>
                      <p className="text-xs text-[#52647C] line-clamp-2">{a.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(a.id)}
                      className="flex items-center gap-1 text-xs font-bold text-[#E11D48] hover:underline self-end sm:self-auto cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 1. Modal Upload Modul PDF */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          if (!isLoading) {
            setIsUploadModalOpen(false)
            setSelectedFile(null)
          }
        }}
        title="Upload Modul PDF (Supabase Storage)"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Judul Modul / Materi *</label>
            <Input name="title" required placeholder="Contoh: Modul 01 — Tata Kelola TI & Arsitektur SPBE" className="text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Tahapan Diklat *</label>
              <select name="subject_name" required className="h-10 w-full rounded-xl border-2 border-slate-200 bg-white px-3 text-xs font-medium text-[#18181B]">
                <option value="Tahap 1 • MOOC">Tahap 1 • MOOC</option>
                <option value="Tahap 2 • TMO">Tahap 2 • TMO</option>
                <option value="Tahap 3 • Lab Prakom">Tahap 3 • Lab Prakom</option>
                <option value="Tahap 4 • Seminar">Tahap 4 • Seminar</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Minggu Pertemuan *</label>
              <Input name="week_number" type="number" min="1" max="10" defaultValue="1" required className="text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Deskripsi Singkat</label>
            <Input name="description" placeholder="Penjelasan singkat modul dan panduan belajar..." className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#18181B]">Pilih Berkas PDF (Maks. 50MB) *</label>
              {selectedFile && (
                <span className={`text-[11px] font-bold ${selectedFile.size > 50 * 1024 * 1024 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
            <input
              name="file"
              type="file"
              accept=".pdf,application/pdf"
              required
              disabled={isLoading}
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setSelectedFile(f)
              }}
              className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-[#18181B] file:px-4 file:py-2 file:text-xs file:font-black file:text-white hover:file:bg-[#27272A] file:cursor-pointer disabled:opacity-50"
            />
            {selectedFile && selectedFile.size > 50 * 1024 * 1024 && (
              <p className="text-[11px] font-bold text-rose-500">
                Peringatan: Ukuran file ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 50MB.
              </p>
            )}
            {selectedFile && selectedFile.size <= 50 * 1024 * 1024 && (
              <p className="text-[11px] font-semibold text-[#0D824B]">
                ✓ Berkas PDF siap diunggah ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          {isLoading && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-bold text-amber-900">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600 shrink-0" />
                <span>{uploadProgressStatus || "Sedang mengunggah berkas PDF..."}</span>
              </div>
              <div className="w-full bg-amber-200/70 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-600 h-2 rounded-full animate-pulse w-full" />
              </div>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Mengirim berkas ke Supabase Storage. File besar (20MB+) memerlukan waktu beberapa detik. Mohon jangan menutup browser hingga selesai.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsUploadModalOpen(false)
                setSelectedFile(null)
              }}
              disabled={isLoading}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-[#18181B] hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || (selectedFile !== null && selectedFile.size > 50 * 1024 * 1024)}
              className="flex items-center gap-1.5 rounded-full bg-[#18181B] px-5 py-2 text-xs font-black text-white hover:bg-[#27272A] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Mengunggah Berkas...</span>
                </>
              ) : (
                "Simpan ke Supabase"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal Tambah Jadwal */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Tambah Sesi Jadwal Diklat">
        <form onSubmit={handleScheduleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Mata Kuliah / Topik Sesi *</label>
            <Input name="subject_name" required placeholder="Contoh: Arsitektur Sistem Informasi & Data Terdistribusi" className="text-xs" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5 col-span-3 sm:col-span-1">
              <label className="text-xs font-black text-[#18181B]">Pilih Hari Diklat (1 - 35) *</label>
              <select name="day_selection" required className="h-10 w-full rounded-xl border-2 border-slate-200 bg-white px-2 text-xs font-medium text-[#18181B]">
                {Array.from({ length: 35 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={`Hari ${d}`}>
                    Hari {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Mulai *</label>
              <Input name="start_time" type="time" defaultValue="08:00" required className="text-xs" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Selesai *</label>
              <Input name="end_time" type="time" defaultValue="15:30" required className="text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Dosen / Pengampu *</label>
              <Input name="lecturer" required placeholder="Nama Pemateri" className="text-xs" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Ruang / Media *</label>
              <Input name="room" required defaultValue="Ruang Diklat LMS" className="text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Link Pertemuan (LMS Ruang Diklat / Zoom)</label>
            <Input
              name="meeting_link"
              defaultValue="https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat"
              className="text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-[#18181B]">Batal</button>
            <button type="submit" disabled={isLoading} className="rounded-full bg-[#18181B] px-5 py-2 text-xs font-black text-white hover:bg-[#27272A] disabled:opacity-50">
              {isLoading ? "Menyimpan..." : "Simpan Jadwal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal Tambah Tugas */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Buat Penugasan Baru">
        <form onSubmit={handleTaskSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Judul Tugas *</label>
            <Input name="title" required placeholder="Contoh: Tugas Mandiri Tata Kelola TI SPBE" className="text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Tahapan Diklat *</label>
              <select name="subject_name" required className="h-10 w-full rounded-xl border-2 border-slate-200 bg-white px-3 text-xs font-medium text-[#18181B]">
                <option value="Tahap 1 • MOOC">Tahap 1 • MOOC</option>
                <option value="Tahap 2 • TMO">Tahap 2 • TMO</option>
                <option value="Tahap 3 • Lab Prakom">Tahap 3 • Lab Prakom</option>
                <option value="Tahap 4 • Seminar">Tahap 4 • Seminar</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#18181B]">Tenggat Waktu *</label>
              <Input name="due_date" type="datetime-local" required className="text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Link Pengumpulan (Portal LMS Kejaksaan)</label>
            <Input name="submission_link" defaultValue="https://pengembangan.kejaksaan.go.id/dashboard" className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Deskripsi Tugas</label>
            <Input name="description" placeholder="Instruksi dan format penulisan laporan tugas..." className="text-xs" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-[#18181B]">Batal</button>
            <button type="submit" disabled={isLoading} className="rounded-full bg-[#18181B] px-5 py-2 text-xs font-black text-white hover:bg-[#27272A] disabled:opacity-50">
              {isLoading ? "Menyimpan..." : "Simpan Tugas"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Modal Buat Pengumuman */}
      <Modal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} title="Buat Pengumuman Kelas">
        <form onSubmit={handleAnnouncementSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Judul Pengumuman *</label>
            <Input name="title" required placeholder="Contoh: Perubahan Jadwal Sesi Zoom Hari Ini" className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Nama Pengirim / Pembuat</label>
            <Input name="author" defaultValue="Pengurus Diklat" className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#18181B]">Isi Pengumuman *</label>
            <textarea name="content" rows={4} required placeholder="Tuliskan isi pengumuman atau instruksi penting di sini..." className="w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_urgent" name="is_urgent" className="h-4 w-4 rounded border-slate-300 text-[#E11D48] focus:ring-0" />
            <label htmlFor="is_urgent" className="text-xs font-bold text-[#E11D48]">
              Tandai sebagai Pengumuman Mendesak (Tampil di Banner Atas Beranda)
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAnnouncementModalOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-[#18181B]">Batal</button>
            <button type="submit" disabled={isLoading} className="rounded-full bg-[#18181B] px-5 py-2 text-xs font-black text-white hover:bg-[#27272A] disabled:opacity-50">
              {isLoading ? "Mempublikasikan..." : "Publikasikan Pengumuman"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 5. Modal Broadcast WhatsApp */}
      <WhatsAppShareModal isOpen={isWAModalOpen} onClose={() => setIsWAModalOpen(false)} />

    </div>
  )
}
