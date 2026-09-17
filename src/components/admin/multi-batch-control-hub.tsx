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
  Laptop
} from "lucide-react"
import { BATCH3_ZOOM_CONFIG } from "@/data/batch3/zoom-config"
import { BATCH4_ZOOM_CONFIG } from "@/data/batch4/zoom-config"

interface MultiBatchControlHubProps {
  batch3SchedulesCount: number
  batch3MaterialsCount: number
  batch3TasksCount: number
  batch4SchedulesCount: number
  batch4MaterialsCount: number
  batch4TasksCount: number
  selectedBatch: "all" | "batch-3" | "batch-4"
  onSelectBatch: (batch: "all" | "batch-3" | "batch-4") => void
  onFeedback: (type: "success" | "error", text: string) => void
}

export function MultiBatchControlHub({
  batch3SchedulesCount,
  batch3MaterialsCount,
  batch3TasksCount,
  batch4SchedulesCount,
  batch4MaterialsCount,
  batch4TasksCount,
  selectedBatch,
  onSelectBatch,
  onFeedback
}: MultiBatchControlHubProps) {
  const [copiedBatch, setCopiedBatch] = React.useState<number | null>(null)

  const handleCopyZoomCredentials = (batchNum: 3 | 4) => {
    const config = batchNum === 4 ? BATCH4_ZOOM_CONFIG : BATCH3_ZOOM_CONFIG
    const text = `[KREDENSIAL ZOOM RESMI - ${config.batchName.toUpperCase()}]\nMeeting ID: ${config.meetingId}\nPasscode: ${config.passcode}\nTautan Ruang Diklat: ${config.zoomUrl}\nJadwal: ${config.sessionScheduleText}\nHost: ${config.hostName}`
    
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
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Jadwal</span>
                <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
                  {batch3SchedulesCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Sesi Perkuliahan</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Modul</span>
                <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {batch3MaterialsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Berkas 120 JP</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#101726] p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Tugas</span>
                <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                  {batch3TasksCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Tugas Batch 3</span>
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
                  08:00 – 15:30 WIB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-[#171534] p-2.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block">Meeting ID</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {BATCH4_ZOOM_CONFIG.meetingId}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-[#171534] p-2.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block">Passcode</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {BATCH4_ZOOM_CONFIG.passcode}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopyZoomCredentials(4)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#201d47] hover:bg-slate-200 dark:hover:bg-[#2b275e] text-slate-700 dark:text-slate-200 py-2 text-xs font-bold transition cursor-pointer"
                >
                  {copiedBatch === 4 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedBatch === 4 ? "Tersalin!" : "Salin Kredensial Zoom"}</span>
                </button>

                <a
                  href={BATCH4_ZOOM_CONFIG.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Buka Zoom</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Batch 4 Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Jadwal</span>
                <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
                  {batch4SchedulesCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Sesi Roadmap</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Modul</span>
                <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {batch4MaterialsCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Berkas 120 JP</span>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#13112c] p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Tugas</span>
                <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                  {batch4TasksCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Tugas Batch 4</span>
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

    </div>
  )
}
