"use client"

import React, { useEffect, useState } from "react"
import {
  Wrench,
  Clock,
  MessageCircle,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Layers,
  Radio,
  FileText,
  HelpCircle,
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
      showNotice("error", "Gagal memuat status konfigurasi pemeliharaan dari server.")
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

  // Quick Message Templates
  const applyTemplate = (type: "server" | "curriculum" | "quick") => {
    if (type === "server") {
      setTitle("Pemeliharaan Infrastruktur Server & Basis Data")
      setMessage(
        "Mohon maaf atas ketidaknyamanannya. Tim IT Badiklat Kejaksaan RI sedang melakukan peningkatan kapasitas server dan pembaruan sistem keamanan rutin. Seluruh layanan akan segera kembali normal."
      )
    } else if (type === "curriculum") {
      setTitle("Sinkronisasi Jadwal & Modul Pembelajaran")
      setMessage(
        "Portal sedang dalam pembaruan kurikulum materi 120 JP dan sinkronisasi ruang kelas Zoom terpadu Angkatan 1 s.d. 6. Silakan periksa kembali beberapa saat lagi."
      )
    } else if (type === "quick") {
      setTitle("Pemeliharaan Sistem Singkat")
      setMessage(
        "Kami sedang melakukan pemeliharaan ringan selama kurang lebih 30 menit. Mohon menunggu sejenak sementara sistem kami persiapkan kembali."
      )
      setQuickPreset(1)
    }
  }

  // Handle Save
  const handleSave = async (targetState?: boolean) => {
    setIsSaving(true)
    try {
      const activeState = targetState !== undefined ? targetState : enabled

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
          ? "Mode Maintenance BERHASIL DIAKTIFKAN. Pengunjung publik diarahkan ke layar Anime."
          : "Mode Maintenance BERHASIL DINONAKTIFKAN. Seluruh akses portal kembali dibuka normal."
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      showNotice("error", msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-14 space-y-3 bg-white dark:bg-[#1B2130] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <RefreshCw className="h-7 w-7 text-emerald-500 animate-spin" />
        <span className="text-xs font-bold text-slate-500">Memuat status kendali pemeliharaan...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback Alert */}
      {localFeedback && (
        <div
          className={`rounded-xl p-4 text-xs font-bold border transition-all flex items-center gap-3 shadow-sm ${
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

      {/* ========================================================================= */}
      {/* 1. HERO OPERATIONAL STATUS BANNER (RAPih, BERSIH, TERINTEGRASI)           */}
      {/* ========================================================================= */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 transition-all shadow-sm ${
          enabled
            ? "bg-gradient-to-br from-amber-500/10 via-amber-950/15 to-slate-900 border-amber-500/40"
            : "bg-gradient-to-br from-emerald-500/10 via-emerald-950/15 to-slate-900 border-emerald-500/30"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Status Meta */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  enabled
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                    : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${enabled ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
                />
                <span>{enabled ? "Status: Mode Maintenance Aktif" : "Status: Portal Online Normal"}</span>
              </span>

              <span className="text-[11px] text-slate-400 font-medium">
                Terakhir diperbarui:{" "}
                {config.updatedAt ? new Date(config.updatedAt).toLocaleTimeString("id-ID") : "-"}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {enabled
                ? "Portal Sedang Ditutup Untuk Akses Publik"
                : "Portal Berjalan Penuh & Terbuka Untuk Seluruh Peserta"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {enabled
                ? "Pengunjung publik otomatis dialihkan ke layar pemeliharaan bergaya Anime chibi Kejaksaan RI. Administrator yang sedang login dapat menguji web menggunakan tautan bypass di samping."
                : "Semua halaman beranda, jadwal harian, bahan ajar 120 JP, penugasan mandiri, dan modul kuis dapat diakses umum tanpa hambatan."}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 shrink-0 w-full lg:w-auto">
            <a
              href="/maintenance?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition w-full lg:w-auto"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Pratinjau Layar Anime</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>

            <a
              href="/?bypass=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800/60 shadow-xs transition w-full lg:w-auto"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Buka Portal (Bypass Admin)</span>
              <ExternalLink className="h-3 w-3 text-emerald-500" />
            </a>
          </div>
        </div>

        {/* Informational Sub-Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-emerald-500" />
            <span>
              Perubahan status dieksekusi secara instan di sisi server Edge tanpa perlu restart aplikasi.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PUSAT KONTROL STATUS (SATU SELEKTOR UTAMA TANPA DUPLIKASI SAKLAR)       */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Pilih Status Operasional Portal
              </h4>
              <p className="text-[11px] text-slate-500">
                Pilih salah satu mode di bawah, lalu klik tombol simpan untuk memberlakukan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Mode Normal */}
          <div
            onClick={() => setEnabled(false)}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              !enabled
                ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141b27]/60 hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    !enabled
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  🟢
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-900 dark:text-white">
                    Mode Normal (Portal Terbuka)
                  </h5>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    Akses Penuh Seluruh Peserta
                  </span>
                </div>
              </div>

              {!enabled && (
                <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Layanan beroperasi normal. Peserta dari seluruh angkatan (Batch 3 & 4) dapat membuka jadwal,
              mengunduh materi, mengakses kuis, dan mengumpulkan tugas.
            </p>
          </div>

          {/* Card 2: Mode Maintenance */}
          <div
            onClick={() => setEnabled(true)}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              enabled
                ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141b27]/60 hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    enabled
                      ? "bg-amber-500 text-white shadow-xs animate-pulse"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  🔴
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-900 dark:text-white">
                    Mode Maintenance (Portal Ditutup)
                  </h5>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    Pengalihan Layar Anime Aktif
                  </span>
                </div>
              </div>

              {enabled && (
                <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Portal ditutup sementara untuk publik. Pengunjung dialihkan ke layar Anime chibi interaktif
              yang memuat penjelasan, hitung mundur perkiraan selesai, dan kontak bantuan.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KUSTOMISASI PESAN & ESTIMASI WAKTU                                     */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Informasi & Teks Pengumuman Layar Anime
              </h4>
              <p className="text-[11px] text-slate-500">
                Pesan ini tampil di dalam kartu informasi resmi di bawah ilustrasi anime.
              </p>
            </div>
          </div>

          {/* Quick Template Chips */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Template Cepat:
            </span>
            <button
              type="button"
              onClick={() => applyTemplate("server")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              ⚡ Server Rutin
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("curriculum")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              📚 Sinkronisasi Modul
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("quick")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              ☕ Kilat (30 Mnt)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Judul Pemeliharaan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Judul Utama Pengumuman:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-normal">{title.length} / 150 karakter</span>
            </div>
            <input
              type="text"
              value={title}
              maxLength={150}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Portal Sedang Dalam Pemeliharaan Sistem"
              className="w-full rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          {/* Pesan Penjelasan untuk Peserta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Pesan Penjelasan untuk Peserta:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-normal">{message.length} / 1500 karakter</span>
            </div>
            <textarea
              rows={3}
              value={message}
              maxLength={1500}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mohon maaf atas ketidaknyamanannya. Portal Web Kelas Agrasena Diklat Fungsional Pranata Komputer Kejaksaan RI sedang menjalani pemeliharaan rutin..."
              className="w-full rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] p-3.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition leading-relaxed"
            />
          </div>

          {/* Grid: Estimasi Waktu & Kontak WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Estimasi Waktu Selesai */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Estimasi Selesai (Countdown):</span>
                </label>
                <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
              </div>

              <input
                type="datetime-local"
                value={estimatedEndLocal}
                onChange={(e) => setEstimatedEndLocal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition"
              />

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setQuickPreset(1)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                >
                  +1 Jam
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset(3)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                >
                  +3 Jam
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset(6)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                >
                  +6 Jam
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset(0, 8)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
                >
                  Besok 08:00
                </button>
                {estimatedEndLocal && (
                  <button
                    type="button"
                    onClick={() => setEstimatedEndLocal("")}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                  >
                    Hapus Waktu
                  </button>
                )}
              </div>
            </div>

            {/* Nomor Kontak WhatsApp Panitia */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Nomor WhatsApp Bantuan / PIC Diklat:</span>
              </label>

              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="6281234567890"
                className="w-full rounded-xl border border-slate-200 dark:border-[#2A3550] bg-slate-50 dark:bg-[#141b27] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition"
              />

              <p className="text-[10px] text-slate-400">
                Tombol bantuan WhatsApp pada layar maintenance akan langsung mengarah ke nomor ini.
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Perubahan status dan pesan langsung disinkronkan ke basis data Supabase.</span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-2.5 text-xs font-black shadow-md transition cursor-pointer disabled:opacity-50 ${
                enabled
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20"
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Menyimpan Pengaturan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan & Terapkan Pengaturan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
