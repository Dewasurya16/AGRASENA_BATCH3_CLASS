'use client'

import * as React from "react"
import {
  Video,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit3,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Radio,
  Clock,
  UserCheck,
  Key,
  Hash,
  Sparkles,
  ClipboardPaste,
  ShieldAlert,
  X,
  MessageSquare,
  Layers,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  MapPin,
  KeyRound
} from "lucide-react"
import Link from "next/link"
import { useBatchZoomConfig } from "@/lib/zoom-config-client"
import { RoadmapZoomClass, RoadmapZoomConfig, getDefaultRoadmapConfig } from "@/lib/roadmap-zoom-client"

interface ZoomManagerProps {
  onFeedback: (type: "success" | "error", text: string) => void
  selectedBatchFilter?: "all" | "batch-3" | "batch-4"
}

interface ZoomFormData {
  zoomUrl: string
  meetingId: string
  passcode: string
  sessionScheduleText: string
  hostName: string
}

export function ZoomManager({ onFeedback, selectedBatchFilter = "all" }: ZoomManagerProps) {
  // Mode Tab: 'global' (Link Banner Utama) vs 'roadmap' (Akses Zoom Roadmap Angkatan 1-6)
  const [managerTab, setManagerTab] = React.useState<"global" | "roadmap">("roadmap")
  const [activeBatch, setActiveBatch] = React.useState<"all" | "batch-3" | "batch-4">(selectedBatchFilter)

  // Config Zoom Global
  const { config: b3Zoom, refetch: refetchB3 } = useBatchZoomConfig(3)
  const { config: b4Zoom, refetch: refetchB4 } = useBatchZoomConfig(4)

  // ==========================================
  // STATE: ROADMAP ZOOM (ANGKATAN 1 s.d. 6)
  // ==========================================
  const [roadmapBatch, setRoadmapBatch] = React.useState<3 | 4>(4)
  const [roadmapConfig, setRoadmapConfig] = React.useState<RoadmapZoomConfig>(() => getDefaultRoadmapConfig(4))
  const [isRoadmapLoading, setIsRoadmapLoading] = React.useState(false)
  const [isSavingRoadmap, setIsSavingRoadmap] = React.useState(false)

  // Modal State for Roadmap Class Card
  const [isClassModalOpen, setIsClassModalOpen] = React.useState(false)
  const [classModalMode, setClassModalMode] = React.useState<"add" | "edit">("add")
  const [editingClass, setEditingClass] = React.useState<RoadmapZoomClass>({
    id: "1",
    name: "Angkatan 1",
    badge: "Ahli Pertama",
    meetingId: "",
    passcode: "",
    url: "",
    highlight: false,
  })

  // Global Passcode Edit
  const [editingGlobalPasscode, setEditingGlobalPasscode] = React.useState(false)
  const [tempGlobalPasscode, setTempGlobalPasscode] = React.useState("")

  // Fetch Roadmap Config
  const loadRoadmapConfig = React.useCallback(async (batch: 3 | 4) => {
    setIsRoadmapLoading(true)
    try {
      const res = await fetch(`/api/roadmap-zoom?batch=${batch}`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data.classes && Array.isArray(data.classes)) {
          setRoadmapConfig(data)
          setTempGlobalPasscode(data.globalPasscode || (batch === 4 ? "AGRASENA4" : "Biropeg-24"))
        }
      }
    } catch (e) {
      console.warn("Failed to load roadmap zoom config:", e)
      const fallback = getDefaultRoadmapConfig(batch)
      setRoadmapConfig(fallback)
      setTempGlobalPasscode(fallback.globalPasscode)
    } finally {
      setIsRoadmapLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadRoadmapConfig(roadmapBatch)
  }, [roadmapBatch, loadRoadmapConfig])

  // Save Roadmap Config to Backend
  const saveRoadmapChanges = async (newConfig: RoadmapZoomConfig, successMsg: string) => {
    setIsSavingRoadmap(true)
    try {
      const res = await fetch("/api/roadmap-zoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: roadmapBatch,
          classes: newConfig.classes,
          globalPasscode: newConfig.globalPasscode,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setRoadmapConfig(newConfig)
        try {
          localStorage.setItem(`prakom_roadmap_zoom_batch${roadmapBatch}`, JSON.stringify(newConfig))
        } catch {}

        window.dispatchEvent(
          new CustomEvent("prakom-roadmap-zoom-updated", {
            detail: { batch: roadmapBatch, config: newConfig },
          })
        )
        onFeedback("success", successMsg)
      } else {
        onFeedback("error", result.error || "Gagal menyimpan perubahan ke server.")
      }
    } catch (err: any) {
      onFeedback("error", err.message || "Gagal menyimpan data roadmap Zoom.")
    } finally {
      setIsSavingRoadmap(false)
    }
  }

  // Open Add Class Modal
  const handleOpenAddClass = () => {
    const nextId = String(roadmapConfig.classes.length + 1)
    setEditingClass({
      id: nextId,
      name: `Angkatan ${nextId}`,
      badge: "Ahli Pertama",
      meetingId: "",
      passcode: roadmapConfig.globalPasscode || (roadmapBatch === 4 ? "AGRASENA4" : "Biropeg-24"),
      url: "",
      highlight: false,
    })
    setClassModalMode("add")
    setIsClassModalOpen(true)
  }

  // Open Edit Class Modal
  const handleOpenEditClass = (cls: RoadmapZoomClass) => {
    setEditingClass({ ...cls })
    setClassModalMode("edit")
    setIsClassModalOpen(true)
  }

  // Submit Add or Edit Class
  const handleSaveClassModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClass.name.trim()) {
      onFeedback("error", "Nama angkatan wajib diisi.")
      return
    }

    let updatedClasses: RoadmapZoomClass[] = []
    if (classModalMode === "add") {
      updatedClasses = [...roadmapConfig.classes, editingClass]
    } else {
      updatedClasses = roadmapConfig.classes.map((c) => (c.id === editingClass.id ? editingClass : c))
    }

    const newConfig: RoadmapZoomConfig = {
      ...roadmapConfig,
      classes: updatedClasses,
    }

    await saveRoadmapChanges(
      newConfig,
      classModalMode === "add"
        ? `Kelas ${editingClass.name} berhasil ditambahkan ke Roadmap Batch ${roadmapBatch}!`
        : `Kredensial Zoom ${editingClass.name} berhasil diperbarui!`
    )
    setIsClassModalOpen(false)
  }

  // Delete Class Card
  const handleDeleteClass = async (classId: string, className: string) => {
    if (!confirm(`Hapus kartu ruang Zoom "${className}" dari daftar roadmap?`)) return
    const updatedClasses = roadmapConfig.classes.filter((c) => c.id !== classId)
    const newConfig: RoadmapZoomConfig = {
      ...roadmapConfig,
      classes: updatedClasses,
    }
    await saveRoadmapChanges(newConfig, `Kelas "${className}" berhasil dihapus.`)
  }

  // Save Global Passcode
  const handleSaveGlobalPasscode = async () => {
    if (!tempGlobalPasscode.trim()) {
      onFeedback("error", "Passcode tidak boleh kosong.")
      return
    }
    const newConfig: RoadmapZoomConfig = {
      ...roadmapConfig,
      globalPasscode: tempGlobalPasscode.trim(),
    }
    await saveRoadmapChanges(newConfig, `Passcode global Batch ${roadmapBatch} berhasil diubah!`)
    setEditingGlobalPasscode(false)
  }

  // Reset to Defaults
  const handleResetRoadmapDefaults = async () => {
    if (!confirm(`Reset semua kartu Zoom Roadmap Batch ${roadmapBatch} ke konfigurasi standar Badiklat?`)) return
    const def = getDefaultRoadmapConfig(roadmapBatch)
    await saveRoadmapChanges(def, `Konfigurasi Zoom Roadmap Batch ${roadmapBatch} di-reset ke standar.`)
  }

  // Smart Parser for Roadmap Class
  const handleSmartPasteClass = (rawText: string) => {
    if (!rawText) return
    const urlMatch = rawText.match(/https:\/\/[^\s]+zoom\.us\/[^\s]+/i) || rawText.match(/https?:\/\/[^\s]+/i)
    const meetingMatch = rawText.match(/(?:Meeting ID|ID Rapat|ID):\s*([\d\s]{9,15})/i) || rawText.match(/\b\d{3}\s*\d{4}\s*\d{4}\b/)
    const passcodeMatch = rawText.match(/(?:Passcode|Password|Kata Sandi|Sandi):\s*([^\s\r\n]+)/i)

    setEditingClass((prev) => ({
      ...prev,
      url: urlMatch ? urlMatch[0].trim() : prev.url,
      meetingId: meetingMatch ? meetingMatch[1].trim() : prev.meetingId,
      passcode: passcodeMatch ? passcodeMatch[1].trim() : prev.passcode,
    }))
    onFeedback("success", "Kredensial Zoom berhasil dideteksi otomatis!")
  }

  // ==========================================
  // STATE: ZOOM GLOBAL (BANNER PERKULIAHAN)
  // ==========================================
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [editingBatchNum, setEditingBatchNum] = React.useState<3 | 4>(4)
  const [formMode, setFormMode] = React.useState<"input" | "edit">("input")
  const [formData, setFormData] = React.useState<ZoomFormData>({
    zoomUrl: "",
    meetingId: "",
    passcode: "",
    sessionScheduleText: "",
    hostName: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [deleteTargetBatch, setDeleteTargetBatch] = React.useState<3 | 4>(4)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const [copiedBatch, setCopiedBatch] = React.useState<number | null>(null)
  const [copiedType, setCopiedType] = React.useState<string | null>(null)

  React.useEffect(() => {
    setActiveBatch(selectedBatchFilter)
  }, [selectedBatchFilter])

  const handleOpenInput = (batchNum: 3 | 4) => {
    setEditingBatchNum(batchNum)
    setFormMode("input")
    const target = batchNum === 4 ? b4Zoom : b3Zoom
    setFormData({
      zoomUrl: "",
      meetingId: "",
      passcode: "",
      sessionScheduleText: target.sessionScheduleText || "Senin – Jumat | 08:00 – 15:30 WIB",
      hostName: target.hostName || "Host Pusdiklat Kejaksaan RI & BPS RI",
    })
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (batchNum: 3 | 4) => {
    setEditingBatchNum(batchNum)
    setFormMode("edit")
    const target = batchNum === 4 ? b4Zoom : b3Zoom
    setFormData({
      zoomUrl: target.zoomUrl || "",
      meetingId: target.meetingId || "",
      passcode: target.passcode || "",
      sessionScheduleText: target.sessionScheduleText || "Senin – Jumat | 08:00 – 15:30 WIB",
      hostName: target.hostName || "Host Pusdiklat Kejaksaan RI & BPS RI",
    })
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (batchNum: 3 | 4) => {
    setDeleteTargetBatch(batchNum)
    setIsDeleteModalOpen(true)
  }

  const handleSmartPasteGlobal = (rawText: string) => {
    if (!rawText) return
    const urlMatch = rawText.match(/https:\/\/[^\s]+zoom\.us\/[^\s]+/i) || rawText.match(/https?:\/\/[^\s]+/i)
    const meetingMatch = rawText.match(/(?:Meeting ID|ID Rapat|ID):\s*([\d\s]{9,15})/i) || rawText.match(/\b\d{3}\s*\d{4}\s*\d{4}\b/)
    const passcodeMatch = rawText.match(/(?:Passcode|Password|Kata Sandi|Sandi):\s*([^\s\r\n]+)/i)

    setFormData((prev) => ({
      ...prev,
      zoomUrl: urlMatch ? urlMatch[0].trim() : prev.zoomUrl,
      meetingId: meetingMatch ? meetingMatch[1].trim() : prev.meetingId,
      passcode: passcodeMatch ? passcodeMatch[1].trim() : prev.passcode,
    }))
    onFeedback("success", "Kredensial Zoom berhasil dideteksi otomatis dari teks!")
  }

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/zoom-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: editingBatchNum,
          ...formData,
        }),
      })

      const data = await res.json()
      if (data.success) {
        const cacheKey = editingBatchNum === 3 ? "prakom_zoom_config_b3" : "prakom_zoom_config_b4"
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.config))
        } catch {}

        window.dispatchEvent(
          new CustomEvent("prakom-zoom-updated", {
            detail: { batch: editingBatchNum, config: data.config },
          })
        )

        if (editingBatchNum === 4) refetchB4()
        else refetchB3()

        onFeedback(
          "success",
          formMode === "input"
            ? `Link Zoom untuk Agrasena Batch ${editingBatchNum} berhasil ditambahkan!`
            : `Link Zoom untuk Agrasena Batch ${editingBatchNum} berhasil diperbarui!`
        )
        setIsFormModalOpen(false)
      } else {
        onFeedback("error", data.error || "Gagal menyimpan konfigurasi Zoom.")
      }
    } catch (err: any) {
      onFeedback("error", err.message || "Terjadi kesalahan pada jaringan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/zoom-config?batch=${deleteTargetBatch}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      if (data.success) {
        const cacheKey = deleteTargetBatch === 3 ? "prakom_zoom_config_b3" : "prakom_zoom_config_b4"
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.config))
        } catch {}

        window.dispatchEvent(
          new CustomEvent("prakom-zoom-updated", {
            detail: { batch: deleteTargetBatch, config: data.config },
          })
        )

        if (deleteTargetBatch === 4) refetchB4()
        else refetchB3()

        onFeedback("success", `Tautan Zoom Agrasena Batch ${deleteTargetBatch} berhasil dihapus/dikosongkan.`)
        setIsDeleteModalOpen(false)
      } else {
        onFeedback("error", data.error || "Gagal menghapus tautan Zoom.")
      }
    } catch (err: any) {
      onFeedback("error", err.message || "Terjadi kesalahan saat menghapus tautan Zoom.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyBroadcast = (batchNum: 3 | 4) => {
    const config = batchNum === 4 ? b4Zoom : b3Zoom
    if (!config.zoomUrl && !config.meetingId) {
      onFeedback("error", `Kredensial Zoom Batch ${batchNum} belum diisi oleh Admin.`)
      return
    }

    const text = `📢 *INFORMASI RUANG KULIAH VIRTUAL ZOOM*
*DIKLAT PRAKOM KEJAKSAAN RI — ${config.batchName.toUpperCase()}*
────────────────────────────────────────

Selamat pagi/siang rekan-rekan peserta diklat! Sesi perkuliahan hari ini dapat diakses melalui kredensial resmi berikut:

🎥 *Tautan Zoom:*
${config.zoomUrl || "(Belum Tersedia)"}

🆔 *Meeting ID:* ${config.meetingId || "-"}
🔑 *Passcode:* ${config.passcode || "-"}
⏰ *Jadwal Sesi:* ${config.sessionScheduleText || "08:00 – 15:30 WIB"}
🏛 *Penyelenggara:* ${config.hostName || "Host Pusdiklat Kejaksaan RI & BPS RI"}

_Catatan: Peserta dimohon bergabung 10 menit sebelum sesi dimulai dengan format nama: [No. Absen] - [Nama Lengkap] - [Satuan Kerja]._`

    navigator.clipboard.writeText(text)
    setCopiedBatch(batchNum)
    setCopiedType("broadcast")
    onFeedback("success", `Format broadcast Zoom Batch ${batchNum} disalin ke clipboard!`)
    setTimeout(() => {
      setCopiedBatch(null)
      setCopiedType(null)
    }, 2500)
  }

  // Render Kartu Batch Zoom Global
  const renderBatchZoomCard = (batchNum: 3 | 4) => {
    const config = batchNum === 4 ? b4Zoom : b3Zoom
    const isBatch4 = batchNum === 4
    const hasLink = Boolean(config.zoomUrl && config.zoomUrl.trim().length > 0)
    const hasCredentials = Boolean(config.meetingId || config.passcode || hasLink)

    return (
      <div
        key={batchNum}
        className={`rounded-2xl border transition-all shadow-xs hover:shadow-md p-6 space-y-6 ${
          isBatch4
            ? "border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/30 via-white to-white dark:from-[#091f16] dark:via-[#0c241b] dark:to-[#0c241b]"
            : "border-sky-200 dark:border-sky-900/60 bg-gradient-to-b from-sky-50/30 via-white to-white dark:from-[#121B2B] dark:via-[#141E30] dark:to-[#141E30]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                isBatch4
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-[#007aff] text-white shadow-xs"
              }`}
            >
              <Video className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {config.batchName}
                </h3>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    isBatch4
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800"
                  }`}
                >
                  {isBatch4 ? "Agrasena 4" : "Agrasena 3"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBatch4
                  ? "Diklat Fungsional Pranata Komputer Ahli & Terampil Batch 4"
                  : "Diklat Fungsional Pranata Komputer Ahli & Terampil Batch 3"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {hasLink ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Tautan Aktif</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Belum Dikonfigurasi</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="rounded-xl bg-slate-50/80 dark:bg-[#141b27] border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Meeting ID
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {config.meetingId || <span className="text-slate-400 italic text-xs font-normal">Belum diisi</span>}
              </span>
              {config.meetingId && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(config.meetingId.replace(/\s+/g, ""))
                    setCopiedBatch(batchNum)
                    setCopiedType("id")
                    onFeedback("success", "Meeting ID disalin ke clipboard!")
                    setTimeout(() => setCopiedBatch(null), 2000)
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  title="Salin Meeting ID"
                >
                  {copiedBatch === batchNum && copiedType === "id" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 dark:bg-[#141b27] border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Passcode
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {config.passcode || <span className="text-slate-400 italic text-xs font-normal">Belum diisi</span>}
              </span>
              {config.passcode && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(config.passcode)
                    setCopiedBatch(batchNum)
                    setCopiedType("pass")
                    onFeedback("success", "Passcode disalin ke clipboard!")
                    setTimeout(() => setCopiedBatch(null), 2000)
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  title="Salin Passcode"
                >
                  {copiedBatch === batchNum && copiedType === "pass" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50/80 dark:bg-[#141b27] border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Tautan URL Langsung
          </span>
          {hasLink ? (
            <div className="flex items-center justify-between gap-3">
              <a
                href={config.zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline truncate"
              >
                {config.zoomUrl}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(config.zoomUrl)
                  setCopiedBatch(batchNum)
                  setCopiedType("url")
                  onFeedback("success", "URL Zoom disalin ke clipboard!")
                  setTimeout(() => setCopiedBatch(null), 2000)
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer shrink-0"
                title="Salin Tautan Zoom"
              >
                {copiedBatch === batchNum && copiedType === "url" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Belum ada link yang disetel. Klik tombol <strong>Input Link Baru</strong> di bawah.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {!hasLink ? (
            <button
              type="button"
              onClick={() => handleOpenInput(batchNum)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-4 text-xs font-bold text-white shadow-xs transition cursor-pointer ${
                isBatch4
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#007aff] hover:bg-[#0062cc]"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Input Link Zoom</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenEdit(batchNum)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-4 text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2332] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
            >
              <Edit3 className="h-4 w-4 text-slate-500" />
              <span>Edit Kredensial</span>
            </button>
          )}

          {hasCredentials && (
            <button
              type="button"
              onClick={() => handleOpenDelete(batchNum)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3.5 text-xs font-bold border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"
              title="Hapus / Kosongkan Link Zoom"
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleCopyBroadcast(batchNum)}
            disabled={!hasCredentials}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3.5 text-xs font-bold border transition cursor-pointer ${
              hasCredentials
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50 border-transparent"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <span>Salin Format WA</span>
          </button>

          {hasLink && (
            <a
              href={config.zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer shrink-0"
              title="Buka Zoom di tab baru"
            >
              <ExternalLink className="h-4 w-4 opacity-70" />
              <span>Tes Link</span>
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigasi Manajemen Zoom */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Video className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Manajemen Akses Zoom Perkuliahan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kelola ruang virtual Zoom tiap angkatan di roadmap dan tautan sesi perkuliahan harian.
            </p>
          </div>
        </div>

        {/* Tab Toggle: Roadmap vs Global */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#141b27] rounded-xl border border-slate-200 dark:border-[#2A3550] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setManagerTab("roadmap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              managerTab === "roadmap"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Ruang Zoom Roadmap (Tiap Angkatan)</span>
          </button>
          <button
            type="button"
            onClick={() => setManagerTab("global")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              managerTab === "global"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Link Zoom Banner Sesi</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RUANG ZOOM ROADMAP TIAP ANGKATAN (GAMBAR 3 CRUD)                   */}
      {/* ========================================================================= */}
      {managerTab === "roadmap" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Subheader: Batch Selector & Quick Actions */}
          <div className="rounded-2xl bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Roadmap Kelas Terpusat
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Sinkron otomatis ke halaman Rundown Publik
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pengaturan Kartu Zoom Angkatan 1 s.d. 6 — Batch {roadmapBatch}
                </h3>
              </div>

              {/* Batch Switcher for Roadmap */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#141b27] rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setRoadmapBatch(4)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    roadmapBatch === 4
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-emerald-600"
                  }`}
                >
                  Batch 4 (Agrasena)
                </button>
                <button
                  type="button"
                  onClick={() => setRoadmapBatch(3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    roadmapBatch === 3
                      ? "bg-[#007aff] text-white shadow-xs"
                      : "text-slate-500 hover:text-[#007aff]"
                  }`}
                >
                  Batch 3 (Agrasena)
                </button>
              </div>
            </div>

            {/* Global Passcode & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-50 dark:bg-[#141b27] border border-slate-200 dark:border-slate-800">
                  <KeyRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-500">Passcode Global:</span>
                  {editingGlobalPasscode ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tempGlobalPasscode}
                        onChange={(e) => setTempGlobalPasscode(e.target.value)}
                        className="h-7 w-32 rounded bg-white dark:bg-slate-800 border border-emerald-500 px-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        placeholder="Passcode..."
                      />
                      <button
                        type="button"
                        onClick={handleSaveGlobalPasscode}
                        disabled={isSavingRoadmap}
                        className="p-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                        title="Simpan"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGlobalPasscode(false)}
                        className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs"
                        title="Batal"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {roadmapConfig.globalPasscode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTempGlobalPasscode(roadmapConfig.globalPasscode)
                          setEditingGlobalPasscode(true)
                        }}
                        className="text-[11px] font-semibold text-slate-400 hover:text-emerald-600 transition"
                      >
                        (Ubah)
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  href={roadmapBatch === 4 ? "/batch-4/schedules#zoom-access" : "/schedules#zoom-access"}
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                >
                  <span>Lihat di Halaman Publik</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetRoadmapDefaults}
                  disabled={isSavingRoadmap}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141b27] px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Kembalikan ke data standar angkatan"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Reset Standar</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddClass}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Tambah Angkatan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid 6 Angkatan Cards with Live Edit/Delete/Copy Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmapConfig.classes.map((cls) => {
              const isHighlight = cls.highlight
              const hasUrl = Boolean(cls.url && cls.url.trim().length > 0)

              return (
                <div
                  key={cls.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                    roadmapBatch === 4
                      ? isHighlight
                        ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] hover:border-emerald-500/40"
                      : isHighlight
                      ? "border-[#007aff] bg-[#007aff]/5 dark:bg-[#007aff]/15 ring-1 ring-[#007aff]/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] hover:border-[#007aff]/40"
                  }`}
                >
                  {/* Card Top */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            roadmapBatch === 4 ? "bg-emerald-600 text-white" : "bg-[#007aff] text-white"
                          }`}
                        >
                          {cls.id}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                            {cls.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {cls.badge || "Peserta Diklat"}
                          </span>
                        </div>
                      </div>

                      {isHighlight && (
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          Kelas Utama
                        </span>
                      )}
                    </div>

                    {/* Meeting ID & Passcode Box */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101520] border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Meeting ID:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {cls.meetingId || <span className="text-slate-400 italic text-[11px]">Belum diisi</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Passcode:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {cls.passcode || roadmapConfig.globalPasscode}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] truncate">
                        <span className="text-slate-400 block text-[10px] uppercase">URL Zoom:</span>
                        {hasUrl ? (
                          <a
                            href={cls.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                          >
                            {cls.url}
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Belum disetel</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenEditClass(cls)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const text = `ZOOM DIKLAT PRAKOM BATCH ${roadmapBatch} — ${cls.name.toUpperCase()}\nMeeting ID: ${cls.meetingId}\nPasscode: ${cls.passcode || roadmapConfig.globalPasscode}\nLink: ${cls.url}`
                        navigator.clipboard.writeText(text)
                        onFeedback("success", `Kredensial ${cls.name} disalin ke clipboard!`)
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-500 hover:text-emerald-600 transition cursor-pointer"
                      title="Salin Kredensial"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    {hasUrl && (
                      <a
                        href={cls.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-500 hover:text-emerald-600 transition cursor-pointer"
                        title="Tes Tautan Zoom"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className="p-2 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                      title="Hapus Kartu Angkatan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LINK ZOOM GLOBAL BANNER (EXISTING COMPONENT)                       */}
      {/* ========================================================================= */}
      {managerTab === "global" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                  <Video className="h-4 w-4" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Tautan Zoom Banner Perkuliahan Harian
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tautan sesi kuliah virtual yang muncul pada banner jadwal beranda peserta.
              </p>
            </div>

            {/* Filter Segmented Control */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-[#141b27] p-1 border border-slate-200 dark:border-[#2A3550] self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveBatch("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeBatch === "all"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semua Batch
              </button>
              <button
                type="button"
                onClick={() => setActiveBatch("batch-3")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeBatch === "batch-3"
                    ? "bg-[#007aff] text-white shadow-2xs"
                    : "text-slate-500 hover:text-[#007aff]"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300"></span>
                <span>Batch 3</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveBatch("batch-4")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeBatch === "batch-4"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-500 hover:text-emerald-500"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                <span>Batch 4</span>
              </button>
            </div>
          </div>

          {/* Grid Kartu Batch Zoom Global */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(activeBatch === "all" || activeBatch === "batch-3") && renderBatchZoomCard(3)}
            {(activeBatch === "all" || activeBatch === "batch-4") && renderBatchZoomCard(4)}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL ROADMAP CLASS: ADD & EDIT ANGKATAN CARD                            */}
      {/* ========================================================================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Video className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {classModalMode === "add" ? "Tambah Ruang Zoom Angkatan" : "Edit Ruang Zoom Angkatan"}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Roadmap Batch {roadmapBatch}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Smart Paste Helper */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">Punya teks undangan Zoom lengkap?</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText()
                    if (text) handleSmartPasteClass(text)
                  } catch {
                    onFeedback("error", "Gagal membaca clipboard. Tempel secara manual.")
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                <ClipboardPaste className="h-3 w-3" />
                <span>Tempel Otomatis</span>
              </button>
            </div>

            <form onSubmit={handleSaveClassModal} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">ID / No</label>
                  <input
                    type="text"
                    required
                    value={editingClass.id}
                    onChange={(e) => setEditingClass({ ...editingClass, id: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Nama Angkatan</label>
                  <input
                    type="text"
                    required
                    value={editingClass.name}
                    onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                    placeholder="Contoh: Angkatan 1"
                    className="w-full rounded-lg bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Kategori / Badge</label>
                <input
                  type="text"
                  value={editingClass.badge || ""}
                  onChange={(e) => setEditingClass({ ...editingClass, badge: e.target.value })}
                  placeholder="Ahli Pertama / Terampil"
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Meeting ID</label>
                  <input
                    type="text"
                    value={editingClass.meetingId}
                    onChange={(e) => setEditingClass({ ...editingClass, meetingId: e.target.value })}
                    placeholder="812 3456 7890"
                    className="w-full rounded-lg bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Passcode</label>
                  <input
                    type="text"
                    value={editingClass.passcode}
                    onChange={(e) => setEditingClass({ ...editingClass, passcode: e.target.value })}
                    placeholder={roadmapConfig.globalPasscode || "AGRASENA4"}
                    className="w-full rounded-lg bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">URL Langsung Zoom</label>
                <input
                  type="url"
                  value={editingClass.url}
                  onChange={(e) => setEditingClass({ ...editingClass, url: e.target.value })}
                  placeholder="https://zoom.us/j/81234567890"
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(editingClass.highlight)}
                  onChange={(e) => setEditingClass({ ...editingClass, highlight: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Tandai sebagai <strong>Kelas Utama / Sorotan</strong>
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingRoadmap}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  {isSavingRoadmap ? "Menyimpan..." : "Simpan Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL GLOBAL: FORM INPUT & EDIT LINK ZOOM BANNER                         */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs ${
                    editingBatchNum === 4 ? "bg-emerald-600" : "bg-[#007aff]"
                  }`}
                >
                  <Video className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {formMode === "input" ? "Input Link Zoom Baru" : "Edit Kredensial Link Zoom"} — Agrasena Batch {editingBatchNum}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tautan dan kredensial ini langsung disinkronkan ke ruang kelas peserta.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setEditingBatchNum(3)
                  const target = b3Zoom
                  setFormData({
                    zoomUrl: target.zoomUrl || "",
                    meetingId: target.meetingId || "",
                    passcode: target.passcode || "",
                    sessionScheduleText: target.sessionScheduleText || "Senin – Jumat | 08:00 – 15:30 WIB",
                    hostName: target.hostName || "Host Pusdiklat Kejaksaan RI & BPS RI",
                  })
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  editingBatchNum === 3
                    ? "bg-white dark:bg-slate-800 text-[#007aff] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Batch 3 (Angkatan 05)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingBatchNum(4)
                  const target = b4Zoom
                  setFormData({
                    zoomUrl: target.zoomUrl || "",
                    meetingId: target.meetingId || "",
                    passcode: target.passcode || "",
                    sessionScheduleText: target.sessionScheduleText || "Senin – Jumat | 08:00 – 15:30 WIB",
                    hostName: target.hostName || "Host Pusdiklat Kejaksaan RI & BPS RI",
                  })
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  editingBatchNum === 4
                    ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Batch 4 (Agrasena 4)
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Tautan Langsung Zoom Meeting (URL)</span>
                  <span className="text-[10px] font-normal text-rose-500">*Wajib jika ingin link aktif</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://us04web.zoom.us/j/... atau https://zoom.us/j/..."
                    value={formData.zoomUrl}
                    onChange={(e) => setFormData({ ...formData, zoomUrl: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-[#2A3550] px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Meeting ID Rapat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 914 2017 2539"
                    value={formData.meetingId}
                    onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-[#2A3550] px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Passcode Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Biropeg-24"
                    value={formData.passcode}
                    onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-[#101520] border border-slate-200 dark:border-[#2A3550] px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer ${
                    editingBatchNum === 4
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-[#007aff] hover:bg-[#0062cc]"
                  } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Link Zoom"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL HAPUS KONFIRMASI                                                    */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Hapus Tautan Zoom?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Agrasena Batch {deleteTargetBatch}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus tautan dan kredensial Zoom untuk{" "}
              <strong>Agrasena Batch {deleteTargetBatch}</strong>? Tombol join Zoom di ruang kelas peserta akan dinonaktifkan sementara hingga tautan baru disetel kembali.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Tautan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
