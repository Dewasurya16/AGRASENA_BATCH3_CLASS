'use client'

import * as React from "react"
import Link from "next/link"
import {
  Video,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  FileText,
  BookOpen,
  ArrowRight,
  Sparkles,
  Radio,
  Layers,
  ShieldCheck,
  Laptop,
  Users,
  Settings,
  X
} from "lucide-react"
import { BATCH3_ZOOM_CONFIG } from "@/data/batch3/zoom-config"
import { BATCH4_ZOOM_CONFIG } from "@/data/batch4/zoom-config"
import { useBatchZoomConfig } from "@/lib/zoom-config-client"

interface MultiBatchControlHubProps {
  batch3SchedulesCount: number
  batch3MaterialsCount: number
  batch3TasksCount: number
  batch3VisitorsCount?: number
  batch3AnnouncementsCount?: number
  batch4SchedulesCount: number
  batch4MaterialsCount: number
  batch4TasksCount: number
  batch4VisitorsCount?: number
  batch4AnnouncementsCount?: number
  selectedBatch: "all" | "batch-3" | "batch-4"
  onSelectBatch: (batch: "all" | "batch-3" | "batch-4") => void
  onFeedback: (type: "success" | "error", text: string) => void
}

export function MultiBatchControlHub({
  batch3SchedulesCount,
  batch3MaterialsCount,
  batch3TasksCount,
  batch3VisitorsCount = 0,
  batch3AnnouncementsCount = 0,
  batch4SchedulesCount,
  batch4MaterialsCount,
  batch4TasksCount,
  batch4VisitorsCount = 0,
  batch4AnnouncementsCount = 0,
  selectedBatch,
  onSelectBatch,
  onFeedback
}: MultiBatchControlHubProps) {
  const [copiedBatch, setCopiedBatch] = React.useState<number | null>(null)
  const { config: b3Zoom, refetch: refetchB3 } = useBatchZoomConfig(3)
  const { config: b4Zoom, refetch: refetchB4 } = useBatchZoomConfig(4)

  const [isEditingZoomModalOpen, setIsEditingZoomModalOpen] = React.useState(false)
  const [editingBatchNum, setEditingBatchNum] = React.useState<3 | 4>(4)
  const [zoomForm, setZoomForm] = React.useState({
    zoomUrl: "",
    meetingId: "",
    passcode: "",
    sessionScheduleText: "",
    hostName: "",
  })
  const [isSavingZoom, setIsSavingZoom] = React.useState(false)

  const openEditZoomModal = (batchNum: 3 | 4) => {
    const target = batchNum === 4 ? b4Zoom : b3Zoom
    setEditingBatchNum(batchNum)
    setZoomForm({
      zoomUrl: target.zoomUrl || "",
      meetingId: target.meetingId || "",
      passcode: target.passcode || "",
      sessionScheduleText: target.sessionScheduleText || "",
      hostName: target.hostName || "",
    })
    setIsEditingZoomModalOpen(true)
  }

  const handleSaveZoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingZoom(true)
    try {
      const res = await fetch("/api/zoom-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: editingBatchNum,
          ...zoomForm,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const cacheKey = editingBatchNum === 3 ? "prakom_zoom_config_b3" : "prakom_zoom_config_b4"
        localStorage.setItem(cacheKey, JSON.stringify(data.config))
        window.dispatchEvent(
          new CustomEvent("prakom-zoom-updated", {
            detail: { batch: editingBatchNum, config: data.config },
          })
        )
        if (editingBatchNum === 4) refetchB4()
        else refetchB3()
        onFeedback("success", `Kredensial Zoom Batch ${editingBatchNum} berhasil disimpan!`)
        setIsEditingZoomModalOpen(false)
      } else {
        onFeedback("error", data.error || "Gagal menyimpan link Zoom.")
      }
    } catch (err: any) {
      onFeedback("error", err.message || "Terjadi kesalahan saat menyimpan.")
    } finally {
      setIsSavingZoom(false)
    }
  }

  const handleClearZoom = async () => {
    if (!confirm(`Yakin ingin mengosongkan link Zoom Batch ${editingBatchNum}?`)) return
    setIsSavingZoom(true)
    try {
      const emptyData = {
        zoomUrl: "",
        meetingId: "",
        passcode: "",
        sessionScheduleText: zoomForm.sessionScheduleText,
        hostName: zoomForm.hostName,
      }
      const res = await fetch("/api/zoom-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: editingBatchNum,
          ...emptyData,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const cacheKey = editingBatchNum === 3 ? "prakom_zoom_config_b3" : "prakom_zoom_config_b4"
        localStorage.setItem(cacheKey, JSON.stringify(data.config))
        window.dispatchEvent(
          new CustomEvent("prakom-zoom-updated", {
            detail: { batch: editingBatchNum, config: data.config },
          })
        )
        if (editingBatchNum === 4) refetchB4()
        else refetchB3()
        setZoomForm((prev) => ({ ...prev, zoomUrl: "", meetingId: "", passcode: "" }))
        onFeedback("success", `Kredensial Zoom Batch ${editingBatchNum} dikosongkan.`)
        setIsEditingZoomModalOpen(false)
      }
    } catch (err: any) {
      onFeedback("error", err.message || "Gagal mengosongkan kredensial Zoom.")
    } finally {
      setIsSavingZoom(false)
    }
  }

  const handleCopyZoomCredentials = (batchNum: 3 | 4) => {
    const config = batchNum === 4 ? b4Zoom : b3Zoom
    if (!config.meetingId && !config.zoomUrl) {
      onFeedback("error", `Kredensial Zoom ${config.batchName} belum diisi oleh Admin.`)
      return
    }
    const text = `[KREDENSIAL ZOOM RESMI - ${config.batchName.toUpperCase()}]\nMeeting ID: ${config.meetingId || "-"}\nPasscode: ${config.passcode || "-"}\nTautan Ruang Diklat: ${config.zoomUrl || "Belum tersedia"}\nJadwal: ${config.sessionScheduleText}\nHost: ${config.hostName}`

    navigator.clipboard.writeText(text)
    setCopiedBatch(batchNum)
    onFeedback("success", `Kredensial Zoom ${config.batchName} berhasil disalin ke clipboard!`)
    setTimeout(() => setCopiedBatch(null), 2500)
  }

  return (
    <div className="rounded-[16px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 sm:p-7 space-y-6 shadow-sm">
      
      {/* 1. Header Bar with Batch Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#2A3550] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-2xs">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Kontrol Terpadu Multi-Batch (Agrasena 3 & 4)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola ruang perkuliahan virtual Zoom, modul, jadwal, dan tugas secara mandiri per angkatan.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-[#141b27] p-1 border border-slate-200 dark:border-[#2A3550] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onSelectBatch("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedBatch === "all"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Semua Angkatan
          </button>
          <button
            type="button"
            onClick={() => onSelectBatch("batch-3")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedBatch === "batch-3"
                ? "bg-[#007aff] text-white shadow-2xs"
                : "text-slate-500 hover:text-[#007aff]"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300"></span>
            <span>Batch 3</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectBatch("batch-4")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedBatch === "batch-4"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-indigo-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-300"></span>
            <span>Batch 4</span>
          </button>
        </div>
      </div>

      {/* 2. Side-by-Side Batch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CARD 1: AGRASENA BATCH 3 */}
        {(selectedBatch === "all" || selectedBatch === "batch-3") && (
          <div className="rounded-[16px] border border-sky-200 dark:border-sky-900/50 bg-gradient-to-b from-sky-50/40 via-white to-white dark:from-[#131b2c] dark:via-[#161f33] dark:to-[#161f33] p-5 sm:p-6 space-y-5 shadow-xs transition hover:shadow-md">
            
            {/* Batch 3 Card Header */}
            <div className="flex items-start justify-between gap-3 border-b border-sky-100 dark:border-sky-900/40 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    Angkatan 05 • TA 2026
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Sesi Berjalan</span>
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Agrasena Batch 3
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pelatihan Fungsional Pranata Komputer Keahlian
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-[#007aff] dark:text-[#60a5fa] shrink-0">
                <Laptop className="h-5 w-5" />
              </div>
            </div>

            {/* Batch 3 Zoom Credentials Box */}
            <div className="rounded-xl bg-white dark:bg-[#101726] border border-sky-200/80 dark:border-sky-900/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
                  <Radio className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
                  <span>Ruang Zoom Batch 3</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  08:00 – 15:30 WIB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-[#141d30] p-2.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block">Meeting ID</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {BATCH3_ZOOM_CONFIG.meetingId}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-[#141d30] p-2.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block">Passcode</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {BATCH3_ZOOM_CONFIG.passcode}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopyZoomCredentials(3)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 py-2 text-xs font-bold transition cursor-pointer"
                >
                  {copiedBatch === 3 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedBatch === 3 ? "Tersalin!" : "Salin Kredensial Zoom"}</span>
                </button>

                <a
                  href={BATCH3_ZOOM_CONFIG.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#007aff] hover:bg-[#0062cc] text-white px-3.5 py-2 text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Buka Zoom</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Batch 3 Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Jadwal</span>
                <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
                  {batch3SchedulesCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Sesi Kuliah</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Modul</span>
                <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {batch3MaterialsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">120 JP PDF</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Tugas</span>
                <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                  {batch3TasksCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Penugasan</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase block">Pengumuman</span>
                <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400">
                  {batch3AnnouncementsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Info B3</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Pengunjung</span>
                <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {batch3VisitorsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Akses B3</span>
              </div>
            </div>

            {/* Batch 3 Quick Links */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-100 dark:border-sky-900/40">
              <span className="text-[11px] font-bold text-slate-400">Akses Publik:</span>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#007aff]"
              >
                <span>Beranda</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/schedules"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#007aff]"
              >
                <span>Jadwal 35 Hari</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/materials"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#007aff]"
              >
                <span>Modul PDF</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/tasks"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#007aff]"
              >
                <span>Tugas Batch 3</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        )}

        {/* CARD 2: AGRASENA BATCH 4 */}
        {(selectedBatch === "all" || selectedBatch === "batch-4") && (
          <div className="rounded-[16px] border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-b from-indigo-50/40 via-white to-white dark:from-[#181636] dark:via-[#1c193f] dark:to-[#1c193f] p-5 sm:p-6 space-y-5 shadow-xs transition hover:shadow-md">
            
            {/* Batch 4 Card Header */}
            <div className="flex items-start justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/40 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    Angkatan 06 • TA 2026
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping"></span>
                    <span>Angkatan Baru</span>
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Agrasena Batch 4
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pelatihan Fungsional Pranata Komputer Keahlian
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            {/* Batch 4 Zoom Credentials Box */}
            <div className="rounded-xl bg-white dark:bg-[#13112c] border border-indigo-200/80 dark:border-indigo-900/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                  <Radio className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                  <span>Ruang Zoom Batch 4</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  {b4Zoom.sessionScheduleText || "08:00 – 15:30 WIB"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-[#171534] p-2.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block">Meeting ID</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {b4Zoom.meetingId ? b4Zoom.meetingId : <span className="text-amber-500 text-xs font-bold">Belum Diisi Admin</span>}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-[#171534] p-2.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block">Passcode</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {b4Zoom.passcode ? b4Zoom.passcode : <span className="text-amber-500 text-xs font-bold">Belum Diisi Admin</span>}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openEditZoomModal(4)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Atur Link Zoom Batch 4</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyZoomCredentials(4)}
                  disabled={!b4Zoom.meetingId && !b4Zoom.zoomUrl}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold transition ${
                    !b4Zoom.meetingId && !b4Zoom.zoomUrl
                      ? "bg-slate-100 dark:bg-[#1c1a3a] text-slate-400 cursor-not-allowed opacity-50"
                      : "bg-slate-100 dark:bg-[#201d47] hover:bg-slate-200 dark:hover:bg-[#2b275e] text-slate-700 dark:text-slate-200 cursor-pointer"
                  }`}
                  title="Salin Kredensial Zoom"
                >
                  {copiedBatch === 4 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedBatch === 4 ? "Tersalin!" : "Salin"}</span>
                </button>

                {b4Zoom.zoomUrl ? (
                  <a
                    href={b4Zoom.zoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 border border-indigo-400/40 px-3 py-2 text-xs font-bold transition cursor-pointer shrink-0"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Tes Link</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                ) : (
                  <span className="text-[11px] text-amber-500 font-semibold italic">
                    (Link Kosong)
                  </span>
                )}
              </div>
            </div>

            {/* Batch 4 Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Jadwal</span>
                <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
                  {batch4SchedulesCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Sesi Kuliah</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Modul</span>
                <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {batch4MaterialsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">120 JP PDF</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Tugas</span>
                <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                  {batch4TasksCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Penugasan</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase block">Pengumuman</span>
                <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400">
                  {batch4AnnouncementsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Info B4</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase block">Pengunjung</span>
                <span className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400">
                  {batch4VisitorsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Akses B4</span>
              </div>
            </div>

            {/* Batch 4 Quick Links */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[11px] font-bold text-slate-400">Akses Publik:</span>
              <Link
                href="/batch-4"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#13112c] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              >
                <span>Beranda B4</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/batch-4/schedules"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#13112c] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              >
                <span>Jadwal B4</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/batch-4/materials"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#13112c] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              >
                <span>Modul B4</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/batch-4/tasks"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-[#13112c] border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              >
                <span>Tugas B4</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        )}

      </div>

      {/* Zoom Configuration Modal */}
      {isEditingZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Video className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    Pengaturan Zoom {editingBatchNum === 4 ? "Agrasena Batch 4" : "Agrasena Batch 3"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kredensial ini akan langsung tampil di portal ruang virtual diklat peserta.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingZoomModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZoom} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tautan / URL Zoom Meeting
                </label>
                <input
                  type="url"
                  value={zoomForm.zoomUrl}
                  onChange={(e) => setZoomForm({ ...zoomForm, zoomUrl: e.target.value })}
                  placeholder="https://zoom.us/j/84420264444?pwd=..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">
                  Kosongkan jika tautan belum dirilis oleh Widyaiswara/Panitia Diklat.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Meeting ID
                  </label>
                  <input
                    type="text"
                    value={zoomForm.meetingId}
                    onChange={(e) => setZoomForm({ ...zoomForm, meetingId: e.target.value })}
                    placeholder="Contoh: 844 2026 4444"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Passcode Zoom
                  </label>
                  <input
                    type="text"
                    value={zoomForm.passcode}
                    onChange={(e) => setZoomForm({ ...zoomForm, passcode: e.target.value })}
                    placeholder="Contoh: PRAKOM4"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Jadwal & Jam Sesi Perkuliahan
                </label>
                <input
                  type="text"
                  value={zoomForm.sessionScheduleText}
                  onChange={(e) => setZoomForm({ ...zoomForm, sessionScheduleText: e.target.value })}
                  placeholder="Senin – Jumat | 08:00 – 15:30 WIB"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Host / Penyelenggara
                </label>
                <input
                  type="text"
                  value={zoomForm.hostName}
                  onChange={(e) => setZoomForm({ ...zoomForm, hostName: e.target.value })}
                  placeholder="Host Pusdiklat Kejaksaan RI & BPS RI"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClearZoom}
                  disabled={isSavingZoom}
                  className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                >
                  Kosongkan Kredensial
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingZoomModalOpen(false)}
                    disabled={isSavingZoom}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingZoom}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingZoom ? "Menyimpan..." : "Simpan Kredensial"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
