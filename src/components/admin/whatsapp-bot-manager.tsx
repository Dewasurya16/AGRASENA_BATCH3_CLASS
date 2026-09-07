"use client"

import * as React from "react"
import {
  Bot,
  QrCode,
  RefreshCw,
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Settings,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Radio,
  MessageCircle,
} from "lucide-react"

export function WhatsAppBotManager() {
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  // Bot Status State
  const [botStatus, setBotStatus] = React.useState<{
    online: boolean
    botUrl: string
    status: {
      connected: boolean
      phoneNumber?: string | null
      pushName?: string | null
      connectedAt?: string | null
      targetGroupJid?: string | null
      message?: string
    }
    config?: any
  } | null>(null)

  // QR Code State
  const [qrImage, setQrImage] = React.useState<string | null>(null)
  const [qrLoading, setQrLoading] = React.useState(false)

  // Group JID Config
  const [targetJid, setTargetJid] = React.useState("")
  const [groups, setGroups] = React.useState<Array<{ id: string; name: string; participantsCount: number }>>([])
  const [fetchingGroups, setFetchingGroups] = React.useState(false)

  // Broadcast Form
  const [broadcastMessage, setBroadcastMessage] = React.useState("")
  const [broadcastTo, setBroadcastTo] = React.useState("")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Fetch Bot Status
  const fetchStatus = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/wa-bot?action=status")
      const data = await res.json()
      setBotStatus(data)
      if (data.status?.targetGroupJid) {
        setTargetJid(data.status.targetGroupJid)
      } else if (data.config?.target_group_jid) {
        setTargetJid(data.config.target_group_jid)
      }

      // Jika bot online tapi belum connected, ambil QR
      if (data.online && !data.status?.connected) {
        fetchQr()
      }
    } catch {
      setBotStatus({
        online: false,
        botUrl: "http://localhost:5000",
        status: { connected: false, message: "Gagal menghubungkan ke server bot." },
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch QR Code
  const fetchQr = async () => {
    setQrLoading(true)
    try {
      const res = await fetch("/api/wa-bot?action=qr")
      const data = await res.json()
      if (data.qrImage) {
        setQrImage(data.qrImage)
      } else if (data.connected) {
        setQrImage(null)
      }
    } catch {
      // Ignored
    } finally {
      setQrLoading(false)
    }
  };

  // Fetch Available Groups
  const fetchGroups = async () => {
    setFetchingGroups(true)
    try {
      const res = await fetch("/api/wa-bot?action=groups")
      const data = await res.json()
      if (data.groups && Array.isArray(data.groups)) {
        setGroups(data.groups)
        showFeedback("success", `Ditemukan ${data.groups.length} grup WhatsApp yang diikuti bot.`)
      } else {
        showFeedback("error", "Bot belum terhubung ke akun WhatsApp.")
      }
    } catch {
      showFeedback("error", "Gagal mengambil daftar grup WhatsApp.")
    } finally {
      setFetchingGroups(false)
    }
  }

  React.useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 5000)
  }

  // Handle Save Target Group JID
  const handleSaveGroupJid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetJid.trim()) {
      showFeedback("error", "Target Group JID tidak boleh kosong.")
      return
    }
    setActionLoading("save_config")
    try {
      const res = await fetch("/api/wa-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_config", targetGroupJid: targetJid.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        showFeedback("success", "Target Grup WhatsApp berhasil disimpan!")
        fetchStatus()
      } else {
        showFeedback("error", data.error || "Gagal menyimpan target grup.")
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan saat menyimpan pengaturan.")
    } finally {
      setActionLoading(null)
    }
  }

  // Handle Trigger Schedule Notification
  const handleTriggerSchedule = async () => {
    if (!confirm("Kirim rekap jadwal pembelajaran hari ini ke grup WhatsApp sekarang?")) return
    setActionLoading("trigger_schedule")
    try {
      const res = await fetch("/api/wa-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trigger_schedule", target: targetJid || undefined }),
      })
      const data = await res.json()
      if (data.success) {
        showFeedback("success", "Notifikasi jadwal harian berhasil dikirim ke grup WhatsApp!")
      } else {
        showFeedback("error", data.error || "Gagal mengirim notifikasi jadwal.")
      }
    } catch {
      showFeedback("error", "Gagal memicu pengiriman jadwal.")
    } finally {
      setActionLoading(null)
    }
  }

  // Handle Trigger Task Notification
  const handleTriggerTask = async () => {
    if (!confirm("Kirim pengingat deadline penugasan mandiri ke grup WhatsApp sekarang?")) return
    setActionLoading("trigger_task")
    try {
      const res = await fetch("/api/wa-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trigger_task", target: targetJid || undefined }),
      })
      const data = await res.json()
      if (data.success) {
        showFeedback("success", "Notifikasi pengingat tugas berhasil dikirim ke grup WhatsApp!")
      } else {
        showFeedback("error", data.error || "Gagal mengirim pengingat tugas.")
      }
    } catch {
      showFeedback("error", "Gagal memicu pengingat tugas.")
    } finally {
      setActionLoading(null)
    }
  }

  // Handle Send Custom Broadcast
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastMessage.trim()) {
      showFeedback("error", "Teks pesan siaran tidak boleh kosong.")
      return
    }
    setActionLoading("send_broadcast")
    try {
      const res = await fetch("/api/wa-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          message: broadcastMessage.trim(),
          to: broadcastTo.trim() || targetJid || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showFeedback("success", "Pesan siaran berhasil dikirim melalui WhatsApp!")
        setBroadcastMessage("")
      } else {
        showFeedback("error", data.error || "Gagal mengirim pesan broadcast.")
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan saat mengirim pesan.")
    } finally {
      setActionLoading(null)
    }
  }

  // Helper Copy Text
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Quick Templates
  const templates = [
    {
      title: "Sesi Zoom Dimulai",
      text: `📢 *PEMBERITAHUAN SESI PEMBELAJARAN DIMULAI*\n*DIKLAT PRAKOM BATCH 3 — KEJAKSAAN RI*\n\nSesi perkuliahan hari ini akan segera dimulai dalam 10 menit.\nRekan-rekan peserta diharapkan segera memasuki ruang Zoom dengan format nama satker:\n🔗 Link Zoom: https://zoom.us/j/...\n\n_Mohon mengaktifkan kamera dan mengisi daftar hadir._`,
    },
    {
      title: "Presensi Kehadiran",
      text: `📝 *LINK PRESENSI KEHADIRAN TELAH DIBUKA*\n*DIKLAT PRAKOM BATCH 3 KEJAKSAAN RI*\n\nPresensi kehadiran sesi mata diklat hari ini telah dibuka.\nBatas waktu pengisian hingga pukul 08:30 WIB:\n🌐 Link Presensi: https://agrasena-batch3.vercel.app\n\n_Terima kasih atas kedisiplinan rekan-rekan!_`,
    },
    {
      title: "Pengingat Tugas Baru",
      text: `⚠️ *PENUGASAN MANDIRI BARU TELAH TERBIT*\n*DIKLAT PRAKOM BATCH 3 KEJAKSAAN RI*\n\nBahan penugasan mandiri telah diunggah oleh Widyaiswara ke portal kelas.\nSilakan unduh lembar kerja dan perhatikan tenggat pengumpulan:\n📂 Portal Tugas: https://agrasena-batch3.vercel.app/tasks\n\n_Selamat mengerjakan dan tetap semangat! 💪_`,
    },
  ]

  const isConnected = botStatus?.online && botStatus?.status?.connected

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-[12px] text-xs font-bold transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[10px] uppercase font-black hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Header Card & Quick Refresh */}
      <div className="rounded-[16px] bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-emerald-200 backdrop-blur-xs">
              <Bot className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp Web Engine (Baileys v6.7) • 100% Free Tier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Gateway Bot WhatsApp Pengingat & Notifikasi
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Kirim rekap jadwal perkuliahan harian otomatis (07:00 WIB), pengingat deadline tugas mandiri (16:00 WIB),
              dan siarkan pengumuman resmi langsung ke grup WhatsApp kelas Agrasena Batch 3 Kejaksaan RI.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center gap-2 rounded-[10px] bg-white/15 hover:bg-white/25 px-4 py-2 text-xs font-bold text-white transition backdrop-blur-xs cursor-pointer border border-white/20 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Cek Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Status Koneksi */}
        <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status Layanan WhatsApp</span>
            <Radio
              className={`h-4 w-4 ${
                isConnected ? "text-emerald-500 animate-pulse" : "text-slate-400"
              }`}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`h-3 w-3 rounded-full ${
                isConnected
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : botStatus?.online
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
              {isConnected
                ? "Terhubung (Online)"
                : botStatus?.online
                ? "Menunggu Scan QR"
                : "Server Offline"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {isConnected
              ? `Login sebagai ${botStatus?.status?.pushName || "Akun WA"} (+${botStatus?.status?.phoneNumber})`
              : botStatus?.online
              ? "Scan QR Code di bawah dengan aplikasi WA HP Anda"
              : "Server bot belum aktif di Render / localhost:5000"}
          </p>
        </div>

        {/* 2. Target Grup Pengingat */}
        <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Grup WhatsApp</span>
            <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100 truncate">
            {targetJid ? "Grup Ditentukan" : "Belum Disetel"}
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
            {targetJid || "Ketik !id di grup WhatsApp untuk mendapatkan JID"}
          </p>
        </div>

        {/* 3. Jadwal Pengingat Otomatis */}
        <div className="rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cron Pengingat Harian</span>
            <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            07:00 & 16:00 WIB
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Jadwal Kuliah (Pagi) • Deadline Tugas (Sore)
          </p>
        </div>
      </div>

      {/* Main Grid: QR Pairing / Quick Triggers & Broadcast Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Code Pairing & Quick Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* QR Code Card if not yet connected */}
          {!isConnected && (
            <div className="rounded-[16px] bg-white dark:bg-[#1B2130] border border-amber-200/80 dark:border-amber-800/50 p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[8px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      Tautkan Akun WhatsApp (Scan QR Code)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bekerja persis seperti WhatsApp Web, cukup scan satu kali.
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchQr}
                  disabled={qrLoading}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${qrLoading ? "animate-spin" : ""}`} />
                  <span>Segarkan QR</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-[12px] bg-slate-50 dark:bg-[#141824] border border-slate-200/80 dark:border-[#2A3550]">
                {/* QR Display */}
                <div className="flex items-center justify-center h-48 w-48 rounded-[12px] bg-white p-2.5 border border-slate-200 shadow-xs shrink-0">
                  {qrImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrImage}
                      alt="WhatsApp QR Code"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-3 space-y-2">
                      <Bot className="h-8 w-8 text-slate-400 mx-auto animate-bounce" />
                      <p className="text-[11px] font-bold text-slate-600">
                        {botStatus?.online
                          ? "Memuat QR Code..."
                          : "Server Bot Belum Aktif"}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Pastikan server bot berjalan di Render atau lokal
                      </p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Langkah menghubungkan nomor WhatsApp:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] font-medium leading-relaxed">
                    <li>Buka aplikasi **WhatsApp** di smartphone Anda.</li>
                    <li>Ketuk menu **Titik Tiga** (Android) atau **Pengaturan** (iOS).</li>
                    <li>Pilih **Perangkat Tertaut** $\rightarrow$ **Tautkan Perangkat**.</li>
                    <li>Arahkan kamera smartphone ke kode QR di samping.</li>
                  </ol>
                  <div className="pt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Sesi login tersimpan aman tanpa browser Chromium.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Triggers Card */}
          <div className="rounded-[16px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  Pemicu Siaran Pengingat Instan
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                Trigger Manual
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gunakan tombol di bawah untuk segera mengirim notifikasi ke grup WhatsApp tanpa harus menunggu jadwal cron harian otomatis:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Trigger Jadwal */}
              <button
                type="button"
                onClick={handleTriggerSchedule}
                disabled={actionLoading === "trigger_schedule"}
                className="flex items-start gap-3 p-4 rounded-[12px] bg-slate-50 dark:bg-[#161B26] hover:bg-sky-50 dark:hover:bg-sky-950/30 border border-slate-200/80 dark:border-[#2A3550] hover:border-sky-300 dark:hover:border-sky-800 transition text-left cursor-pointer group disabled:opacity-50"
              >
                <div className="p-2.5 rounded-[10px] bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 group-hover:scale-105 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                    Siarkan Jadwal Hari Ini
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Kirim rekap mata diklat, widyaiswara, dan link Zoom hari ini.
                  </div>
                </div>
              </button>

              {/* Trigger Tugas */}
              <button
                type="button"
                onClick={handleTriggerTask}
                disabled={actionLoading === "trigger_task"}
                className="flex items-start gap-3 p-4 rounded-[12px] bg-slate-50 dark:bg-[#161B26] hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200/80 dark:border-[#2A3550] hover:border-amber-300 dark:hover:border-amber-800 transition text-left cursor-pointer group disabled:opacity-50"
              >
                <div className="p-2.5 rounded-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                    Siarkan Peringatan Tugas
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Kirim daftar tugas mandiri yang mendekati batas waktu pengumpulan.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Konfigurasi Target Group JID */}
          <div className="rounded-[16px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  Pengaturan ID Grup WhatsApp Target
                </h3>
              </div>
              <button
                onClick={fetchGroups}
                disabled={fetchingGroups}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${fetchingGroups ? "animate-spin" : ""}`} />
                <span>Pilih dari Daftar Grup</span>
              </button>
            </div>

            {/* Selector jika grup berhasil di-fetch */}
            {groups.length > 0 && (
              <div className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#141824] border border-slate-200 dark:border-[#2A3550] space-y-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Pilih Grup WhatsApp yang Terdeteksi:
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setTargetJid(g.id)}
                      className="w-full flex items-center justify-between p-2 rounded-[8px] bg-white dark:bg-[#1B2130] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-[#2A3550] text-left transition cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {g.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                        {g.participantsCount} Anggota
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveGroupJid} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  WhatsApp Group JID:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetJid}
                    onChange={(e) => setTargetJid(e.target.value)}
                    placeholder="Contoh: 120363294829104829@g.us"
                    className="flex-1 h-10 rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/60 dark:bg-[#141824] px-3.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading === "save_config"}
                    className="h-10 px-4 rounded-[10px] bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white transition cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  💡 Cara termudah mengetahui ID Grup WhatsApp:
                </p>
                <p>
                  1. Masukkan nomor bot ke dalam grup WhatsApp kelas Anda.
                </p>
                <p>
                  2. Ketik perintah <code className="bg-slate-200 dark:bg-[#253045] px-1 py-0.5 rounded font-mono font-bold text-slate-800 dark:text-slate-200">!id</code> di dalam grup tersebut.
                </p>
                <p>
                  3. Bot akan membalas dengan ID grup secara instan. Salin dan tempelkan ke kolom di atas.
                </p>
              </div>
            </form>
          </div>

          {/* Interactive Chat Commands Cheat Sheet */}
          <div className="rounded-[16px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Perintah Interaktif Bot di Grup WhatsApp
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550] flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">!jadwal</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Jadwal hari ini & besok</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("!jadwal", "cmd-jadwal")}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  {copiedId === "cmd-jadwal" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550] flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400">!tugas</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Daftar tugas mandiri aktif</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("!tugas", "cmd-tugas")}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  {copiedId === "cmd-tugas" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550] flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-sky-600 dark:text-sky-400">!link</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Link Zoom, Web, & Modul</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("!link", "cmd-link")}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  {copiedId === "cmd-link" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550] flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-purple-600 dark:text-purple-400">!id</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Cek JID grup otomatis</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("!id", "cmd-id")}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  {copiedId === "cmd-id" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Broadcast Message Composer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[16px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] p-6 space-y-4 shadow-xs sticky top-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  Siaran Pesan Khusus (Custom Broadcast)
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tulis dan kirimkan pengumuman penting langsung ke grup WhatsApp atau nomor tujuan tertentu:
            </p>

            {/* Quick Templates */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Pilihan Template Cepat:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {templates.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBroadcastMessage(t.text)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-[6px] bg-slate-100 dark:bg-[#253045] text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer"
                  >
                    + {t.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Penerima (Opsional, kosongkan untuk grup utama):
                </label>
                <input
                  type="text"
                  value={broadcastTo}
                  onChange={(e) => setBroadcastTo(e.target.value)}
                  placeholder={`Default: ${targetJid || "Grup Utama"}`}
                  className="w-full h-9 rounded-[8px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/60 dark:bg-[#141824] px-3 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Isi Pesan WhatsApp:
                </label>
                <textarea
                  rows={8}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Ketik pesan Anda di sini... Mendukung format WhatsApp seperti *tebal*, _miring_, dan baris baru."
                  className="w-full rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/60 dark:bg-[#141824] p-3 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === "send_broadcast" || !broadcastMessage.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-[10px] bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-black text-white transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {actionLoading === "send_broadcast" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Kirim Siaran ke WhatsApp</span>
              </button>
            </form>

            {/* Hosting Link & Deployment Guide */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-[11px] text-slate-500">
              <span>Hosting 24/7 Gratis di Render:</span>
              <a
                href="https://render.com"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Render.com</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
