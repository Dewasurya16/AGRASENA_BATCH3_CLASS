"use client"

import React, { useEffect, useState } from "react"
import {
  Wrench,
  Power,
  Clock,
  MessageCircle,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Info,
  Sparkles,
  Calendar,
} from "lucide-react"
import { DEFAULT_MAINTENANCE_CONFIG, MaintenanceConfig } from "@/lib/maintenance"

interface MaintenanceManagerProps {
  onFeedback?: (type: "success" | "error", text: string) => void
}

export function MaintenanceManager({ onFeedback }: MaintenanceManagerProps) {
  const [config, setConfig] = useState<MaintenanceConfig>({ ...DEFAULT_MAINTENANCE_CONFIG })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [localFeedback, setLocalFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form local state
  const [enabled, setEnabled] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [estimatedEndLocal, setEstimatedEndLocal] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")

  const showNotice = (type: "success" | "error", text: string) => {
    setLocalFeedback({ type, text })
    if (onFeedback) onFeedback(type, text)
    setTimeout(() => {
      setLocalFeedback(null)
    }, 6000)
  }

  // Load config from API
  const fetchConfig = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/maintenance", {
        headers: { "Cache-Control": "no-cache" },
      })
      const data = await res.json()
      if (data && data.config) {
        const c: MaintenanceConfig = data.config
        setConfig(c)
        setEnabled(c.enabled)
        setTitle(c.title || DEFAULT_MAINTENANCE_CONFIG.title)
        setMessage(c.message || DEFAULT_MAINTENANCE_CONFIG.message)
        setEmergencyContact(c.emergencyContact || DEFAULT_MAINTENANCE_CONFIG.emergencyContact)

        if (c.estimatedEnd) {
          // Convert ISO to datetime-local format: YYYY-MM-DDTHH:mm
          const d = new Date(c.estimatedEnd)
          if (!isNaN(d.getTime())) {
            const offset = d.getTimezoneOffset()
            const localDate = new Date(d.getTime() - offset * 60 * 1000)
            setEstimatedEndLocal(localDate.toISOString().slice(0, 16))
          } else {
            setEstimatedEndLocal("")
          }
        } else {
          setEstimatedEndLocal("")
        }
      }
    } catch (err) {
      console.error("Failed to load maintenance config:", err)
      showNotice("error", "Gagal memuat status konfigurasi maintenance dari server.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  // Quick Preset Helper for Estimated End Time
  const setQuickPreset = (hoursToAdd: number, specificHour?: number) => {
    const now = new Date()
    if (specificHour !== undefined) {
      // Besok Pagi jam specificHour (e.g. 8:00 WIB)
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(specificHour, 0, 0, 0)
      const offset = tomorrow.getTimezoneOffset()
      const local = new Date(tomorrow.getTime() - offset * 60 * 1000)
      setEstimatedEndLocal(local.toISOString().slice(0, 16))
    } else {
      const target = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000)
      const offset = target.getTimezoneOffset()
      const local = new Date(target.getTime() - offset * 60 * 1000)
      setEstimatedEndLocal(local.toISOString().slice(0, 16))
    }
  }

  // Handle Save
  const handleSave = async (overrideEnabled?: boolean) => {
    setIsSaving(true)
    try {
      const activeState = overrideEnabled !== undefined ? overrideEnabled : enabled

      let estimatedEndIso: string | null = null
      if (estimatedEndLocal) {
        const d = new Date(estimatedEndLocal)
        if (!isNaN(d.getTime())) {
          estimatedEndIso = d.toISOString()
        }
      }

      const payload = {
        enabled: activeState,
        title: title.trim() || DEFAULT_MAINTENANCE_CONFIG.title,
        message: message.trim() || DEFAULT_MAINTENANCE_CONFIG.message,
        estimatedEnd: estimatedEndIso,
        emergencyContact: emergencyContact.trim() || DEFAULT_MAINTENANCE_CONFIG.emergencyContact,
      }

      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok || result.error) {
        throw new Error(result.error || "Gagal menyimpan perubahan.")
      }

      setConfig(result.config)
      setEnabled(result.config.enabled)
      showNotice(
        "success",
        result.config.enabled
          ? "Mode Maintenance berhasil DIAKTIFKAN. Pengunjung publik diarahkan ke halaman pemeliharaan."
          : "Mode Maintenance berhasil DINONAKTIFKAN. Portal kembali terbuka untuk umum."
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      showNotice("error", msg)
    } finally {
      setIsSaving(false)
    }
  }

  // Quick One-Click Toggle
  const handleToggleSwitch = async () => {
    const newState = !enabled
    setEnabled(newState)
    await handleSave(newState)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-white dark:bg-[#1B2130] rounded-2xl border border-slate-200 dark:border-slate-800">
        <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin" />
        <span className="text-xs font-bold text-slate-500">Memuat status pemeliharaan sistem...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info & Alert */}
      {localFeedback && (
        <div
          className={`rounded-xl p-4 text-xs font-bold border transition-all flex items-center gap-3 ${
            localFeedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
          }`}
        >
          {localFeedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{localFeedback.text}</span>
        </div>
      )}

      {/* MASTER SWITCH CARD */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 transition-all shadow-sm ${
          enabled
            ? "bg-gradient-to-br from-amber-500/10 via-amber-950/20 to-slate-900 border-amber-500/40"
            : "bg-white dark:bg-[#1B2130] border-slate-200 dark:border-[#2A3550]"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                  enabled
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                    : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${enabled ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                <span>{enabled ? "Mode Maintenance Sedang AKTIF" : "Mode Normal (Portal Terbuka)"}</span>
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {enabled
                ? "Portal Saat Ini Ditutup Untuk Pengunjung Publik"
                : "Portal Dapat Diakses Penuh Oleh Seluruh Peserta"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {enabled
                ? "Pengunjung publik yang mengakses web kelas akan secara otomatis diarahkan ke halaman /maintenance. Administrator yang sedang login tetap memiliki hak akses penuh untuk melakukan pengujian perbaikan."
                : "Seluruh halaman beranda, jadwal 35 hari, modul perkuliahan 120 JP, dan penugasan dapat diakses secara normal."}
            </p>
          </div>

          {/* Master Switch Button */}
          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleSwitch}
              disabled={isSaving}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 cursor-pointer p-1 shadow-inner focus:outline-none disabled:opacity-50 ${
                enabled ? "bg-amber-600 hover:bg-amber-500" : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
                  enabled ? "translate-x-12 text-amber-600" : "translate-x-0 text-slate-400"
                }`}
              >
                <Power className="h-5 w-5" />
              </span>
            </button>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {enabled ? "Klik untuk Matikan" : "Klik untuk Aktifkan"}
            </span>
          </div>
        </div>

        {/* Security & Admin Bypass Notice */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Bypass Administrator:</strong> Sesi admin Anda saat ini aktif, Anda dapat membuka halaman publik secara normal.
            </span>
          </div>

          <a
            href="/maintenance?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition"
          >
            <span>Pratinjau Layar Maintenance</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* FORM PENGATURAN KONTEN MAINTENANCE */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Kustomisasi Pesan & Waktu Pemeliharaan
              </h4>
              <p className="text-[11px] text-slate-500">
                Informasi ini akan ditampilkan secara langsung kepada peserta di halaman /maintenance.
              </p>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Terakhir diupdate: {config.updatedAt ? new Date(config.updatedAt).toLocaleTimeString("id-ID") : "-"}
          </span>
        </div>

        <div className="space-y-4">
          {/* Judul Pengumuman Maintenance */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Judul Pemeliharaan:</span>
              <span className="text-[10px] text-slate-400 font-normal">Maksimal 150 karakter</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Portal Sedang Dalam Pemeliharaan Sistem"
              className="w-full rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Deskripsi / Alasan Pemeliharaan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Pesan Penjelasan untuk Peserta:</span>
              <span className="text-[10px] text-slate-400 font-normal">Maksimal 1500 karakter</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mohon maaf atas ketidaknyamanannya. Tim teknis sedang melakukan sinkronisasi modul..."
              className="w-full rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] p-3 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Estimasi Waktu Selesai */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Perkiraan Waktu Selesai (Opsional):</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Countdown timer akan muncul jika diisi
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="datetime-local"
                value={estimatedEndLocal}
                onChange={(e) => setEstimatedEndLocal(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              />

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickPreset(1)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  +1 Jam
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset(3)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  +3 Jam
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset(6)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  +6 Jam
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset(0, 8)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
                >
                  Besok 08:00
                </button>
                {estimatedEndLocal && (
                  <button
                    type="button"
                    onClick={() => setEstimatedEndLocal("")}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  >
                    Hapus Waktu
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nomor Kontak WhatsApp Panitia */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Nomor WhatsApp Bantuan / Panitia:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Format: 628123456789 atau 0812...</span>
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="6281234567890"
              className="w-full sm:w-80 rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit & Action Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Perubahan tersimpan otomatis ke database Supabase dan aktif seketika.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold shadow-md shadow-emerald-900/20 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Peraturan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
