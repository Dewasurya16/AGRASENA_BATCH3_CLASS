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
  MessageSquare
} from "lucide-react"
import { useBatchZoomConfig } from "@/lib/zoom-config-client"

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
  const [activeBatch, setActiveBatch] = React.useState<"all" | "batch-3" | "batch-4">(selectedBatchFilter)
  const { config: b3Zoom, refetch: refetchB3 } = useBatchZoomConfig(3)
  const { config: b4Zoom, refetch: refetchB4 } = useBatchZoomConfig(4)

  // State modal Edit / Input
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

  // State modal konfirmasi Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [deleteTargetBatch, setDeleteTargetBatch] = React.useState<3 | 4>(4)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // State copied feedback
  const [copiedBatch, setCopiedBatch] = React.useState<number | null>(null)
  const [copiedType, setCopiedType] = React.useState<string | null>(null)

  // Sinkronkan filter jika prop berubah
  React.useEffect(() => {
    setActiveBatch(selectedBatchFilter)
  }, [selectedBatchFilter])

  // Buka modal untuk Input Baru
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

  // Buka modal untuk Edit
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

  // Buka konfirmasi Hapus
  const handleOpenDelete = (batchNum: 3 | 4) => {
    setDeleteTargetBatch(batchNum)
    setIsDeleteModalOpen(true)
  }

  // Smart Parser: jika admin menempel teks undangan Zoom lengkap dari email/WA
  const handleSmartPaste = (rawText: string) => {
    if (!rawText) return

    // Regex cari URL Zoom
    const urlMatch = rawText.match(/https:\/\/[^\s]+zoom\.us\/[^\s]+/i) || rawText.match(/https?:\/\/[^\s]+/i)
    // Regex cari Meeting ID
    const meetingMatch = rawText.match(/(?:Meeting ID|ID Rapat|ID):\s*([\d\s]{9,15})/i) || rawText.match(/\b\d{3}\s*\d{4}\s*\d{4}\b/)
    // Regex cari Passcode
    const passcodeMatch = rawText.match(/(?:Passcode|Password|Kata Sandi|Sandi):\s*([^\s\r\n]+)/i)

    const detectedUrl = urlMatch ? urlMatch[0].trim() : ""
    const detectedMeetingId = meetingMatch ? meetingMatch[1].trim() : ""
    const detectedPasscode = passcodeMatch ? passcodeMatch[1].trim() : ""

    if (detectedUrl || detectedMeetingId || detectedPasscode) {
      setFormData((prev) => ({
        ...prev,
        zoomUrl: detectedUrl || prev.zoomUrl,
        meetingId: detectedMeetingId || prev.meetingId,
        passcode: detectedPasscode || prev.passcode,
      }))
      onFeedback("success", "Kredensial Zoom berhasil dideteksi otomatis dari teks!")
    } else {
      setFormData((prev) => ({ ...prev, zoomUrl: rawText.trim() }))
    }
  }

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) handleSmartPaste(text)
    } catch {
      onFeedback("error", "Gagal membaca clipboard browser. Silakan tempel secara manual.")
    }
  }

  // Eksekusi Simpan (Input / Edit)
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

  // Eksekusi Hapus Link Zoom
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

  // Salin teks broadcast WhatsApp
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

  // Helper render kartu per batch
  const renderBatchZoomCard = (batchNum: 3 | 4) => {
    const config = batchNum === 4 ? b4Zoom : b3Zoom
    const isBatch4 = batchNum === 4
    const hasLink = Boolean(config.zoomUrl && config.zoomUrl.trim().length > 0)
    const hasCredentials = Boolean(config.meetingId || config.passcode || hasLink)

    return (
      <div
        key={batchNum}
        className={`rounded-2xl border transition-all shadow-sm hover:shadow-md p-6 space-y-6 ${
          isBatch4
            ? "border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/30 via-white to-white dark:from-[#181636] dark:via-[#1A1838] dark:to-[#1A1838]"
            : "border-sky-200 dark:border-sky-900/60 bg-gradient-to-b from-sky-50/30 via-white to-white dark:from-[#121B2B] dark:via-[#141E30] dark:to-[#141E30]"
        }`}
      >
        {/* Header Kartu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                isBatch4
                  ? "bg-indigo-600 text-white shadow-xs"
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
                      ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      : "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                  }`}
                >
                  {isBatch4 ? "Angkatan 06 • 2026" : "Angkatan 05 • 2026"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ruang Virtual Kuliah Diklat Fungsional Pranata Komputer Keahlian
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="self-start sm:self-auto">
            {hasLink ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Link Zoom Aktif</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Link Zoom Kosong</span>
              </span>
            )}
          </div>
        </div>

        {/* Kotak Kredensial Zoom Saat Ini */}
        <div className="rounded-xl bg-white dark:bg-[#121622] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-red-500 animate-pulse" />
              <span>Detail Ruang Virtual Saat Ini</span>
            </span>
            <span className="font-mono text-[11px]">{config.sessionScheduleText || "08:00 – 15:30 WIB"}</span>
          </div>

          {/* URL Zoom Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tautan / URL Zoom
              </label>
              {hasLink && (
                <a
                  href={config.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>Buka Langsung</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {hasLink ? (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 truncate">
                <span className="truncate">{config.zoomUrl}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(config.zoomUrl)
                    onFeedback("success", "URL Zoom disalin ke clipboard!")
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0"
                  title="Salin URL"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Belum ada tautan Zoom yang aktif. Silakan tekan tombol <strong>Input Link Zoom</strong> di bawah.</span>
              </div>
            )}
          </div>

          {/* Grid Meeting ID & Passcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span>Meeting ID</span>
                </span>
                {config.meetingId && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(config.meetingId)
                      onFeedback("success", "Meeting ID disalin!")
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                {config.meetingId || <span className="text-slate-400 font-normal italic text-xs">Belum diisi</span>}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Key className="h-3 w-3" />
                  <span>Passcode</span>
                </span>
                {config.passcode && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(config.passcode)
                      onFeedback("success", "Passcode disalin!")
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                {config.passcode || <span className="text-slate-400 font-normal italic text-xs">Belum diisi</span>}
              </div>
            </div>
          </div>

          {/* Schedule & Host Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{config.sessionScheduleText || "Senin – Jumat | 08:00 – 15:30 WIB"}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{config.hostName || "Host Pusdiklat Kejaksaan RI & BPS RI"}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar: INPUT, EDIT, HAPUS, & BROADCAST */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Tombol Input (Jika Belum Ada) atau Edit (Jika Sudah Ada) */}
          {!hasLink ? (
            <button
              type="button"
              onClick={() => handleOpenInput(batchNum)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl text-white px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                isBatch4
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-[#007aff] hover:bg-[#0062cc]"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Input Link Zoom {isBatch4 ? "B4" : "B3"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenEdit(batchNum)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl text-white px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                isBatch4
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-[#007aff] hover:bg-[#0062cc]"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Link Zoom</span>
            </button>
          )}

          {/* Tombol Hapus Link Zoom (Aktif jika ada data) */}
          <button
            type="button"
            onClick={() => handleOpenDelete(batchNum)}
            disabled={!hasCredentials}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
              hasCredentials
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 cursor-pointer"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50 border border-transparent"
            }`}
            title={hasCredentials ? "Hapus dan kosongkan tautan Zoom" : "Kredensial sudah kosong"}
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Link</span>
          </button>

          {/* Tombol Format Broadcast WA */}
          <button
            type="button"
            onClick={() => handleCopyBroadcast(batchNum)}
            disabled={!hasCredentials}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition border cursor-pointer ${
              hasCredentials
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50 border-transparent"
            }`}
            title="Salin pengumuman format WhatsApp"
          >
            {copiedBatch === batchNum && copiedType === "broadcast" ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <MessageSquare className="h-4 w-4 text-emerald-600" />
            )}
            <span>{copiedBatch === batchNum && copiedType === "broadcast" ? "Tersalin!" : "Salin Format WA"}</span>
          </button>

          {/* Tombol Tes Buka Link */}
          {hasLink && (
            <a
              href={config.zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer shrink-0"
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
      {/* Top Banner Guide */}
      <div className="rounded-2xl bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#007aff] to-indigo-600 text-white shadow-2xs">
              <Video className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Manajemen Ruang Virtual Zoom Perkuliahan
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sediakan, perbarui, dan hapus tautan Zoom resmi untuk peserta diklat Agrasena Batch 3 dan Agrasena Batch 4.
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
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-indigo-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-300"></span>
            <span>Batch 4</span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Batch Zoom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeBatch === "all" || activeBatch === "batch-3") && renderBatchZoomCard(3)}
        {(activeBatch === "all" || activeBatch === "batch-4") && renderBatchZoomCard(4)}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FORM INPUT & EDIT LINK ZOOM                                     */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs ${
                    editingBatchNum === 4 ? "bg-indigo-600" : "bg-[#007aff]"
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

            {/* Batch Selector Tab dalam Modal */}
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
                    ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Batch 4 (Angkatan 06)
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* URL Zoom */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>Tautan / URL Lengkap Zoom</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    title="Tempel tautan atau teks undangan dari clipboard"
                  >
                    <ClipboardPaste className="h-3 w-3" />
                    <span>Tempel Clipboard (Auto Deteksi)</span>
                  </button>
                </div>
                <input
                  type="url"
                  value={formData.zoomUrl}
                  onChange={(e) => setFormData({ ...formData, zoomUrl: e.target.value })}
                  placeholder="https://us02web.zoom.us/j/84420264444?pwd=..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">
                  Pastikan tautan diawali dengan protokol <code>https://</code>.
                </span>
              </div>

              {/* Grid Meeting ID & Passcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Meeting ID
                  </label>
                  <input
                    type="text"
                    value={formData.meetingId}
                    onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })}
                    placeholder="Contoh: 844 2026 4444"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Passcode Zoom
                  </label>
                  <input
                    type="text"
                    value={formData.passcode}
                    onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                    placeholder="Contoh: PRAKOM4"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Jadwal Sesi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Jadwal & Jam Perkuliahan
                </label>
                <input
                  type="text"
                  value={formData.sessionScheduleText}
                  onChange={(e) => setFormData({ ...formData, sessionScheduleText: e.target.value })}
                  placeholder="Senin – Jumat | 08:00 – 15:30 WIB"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Penyelenggara / Host */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Host / Penyelenggara Ruang
                </label>
                <input
                  type="text"
                  value={formData.hostName}
                  onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                  placeholder="Host Pusdiklat Kejaksaan RI & BPS RI"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer ${
                      editingBatchNum === 4
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-[#007aff] hover:bg-[#0062cc]"
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Menyimpan...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Simpan Kredensial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: KONFIRMASI HAPUS LINK ZOOM                                      */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#161B26] border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Hapus Tautan Zoom Batch {deleteTargetBatch}?
                </h4>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Tindakan ini akan mengosongkan link ruang kuliah virtual.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Setelah dihapus, peserta <strong>Agrasena Batch {deleteTargetBatch}</strong> tidak akan dapat bergabung melalui tombol ruang kuliah virtual di web publik sampai Anda menginput tautan yang baru.
            </p>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-[11px] font-mono text-slate-500 space-y-1">
              <div>• Batch: Agrasena Batch {deleteTargetBatch}</div>
              <div>• Target: Zoom URL, Meeting ID, Passcode</div>
              <div>• Status: Akan dikosongkan secara aman di database</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Ya, Hapus Tautan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
