'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Video,
  Copy,
  Check,
  ExternalLink,
  KeyRound,
  Info,
  Clock,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { useBatchZoomConfig } from '@/lib/zoom-config-client'
import { useRoadmapZoomConfig, RoadmapZoomClass } from '@/lib/roadmap-zoom-client'

export interface ZoomClassAccessProps {
  batchNum?: 3 | 4
}

/**
 * Komponen Akses Zoom Meeting di Halaman Jadwal/Roadmap
 * - Batch 3: Kartu resmi tunggal Agrasena Batch 3 (LMS / Zoom TMO Diklat Kejaksaan RI)
 * - Batch 4: Grid multi-angkatan (Angkatan 1 s.d. 6)
 */
export function ZoomClassAccess({ batchNum = 3 }: ZoomClassAccessProps) {
  if (batchNum === 3) {
    return <Batch3SingleZoomCard />
  }

  return <Batch4MultiAngkatanZoomCard />
}

/**
 * Kartu Zoom Resmi Khusus Agrasena Batch 3 (Satu Ruang Kelas Virtual Terpadu)
 */
function Batch3SingleZoomCard() {
  const { config: b3Zoom } = useBatchZoomConfig(3)
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleCopyAll = () => {
    const text = `🏛️ *AKSES RESMI ZOOM MEETING — AGRASENA BATCH 3*\n` +
      `*Pelatihan Fungsional Pranata Komputer Kejaksaan RI 2026*\n` +
      `────────────────────────\n` +
      `• Meeting ID : ${b3Zoom.meetingId}\n` +
      `• Passcode   : ${b3Zoom.passcode}\n` +
      `• Penyelenggara: ${b3Zoom.hostName}\n` +
      `• Jadwal Sesi: ${b3Zoom.sessionScheduleText}\n` +
      `• Link Zoom  : ${b3Zoom.zoomUrl}\n` +
      `────────────────────────\n` +
      `*Format Nama Wajib:* [No Absen] - [Nama Lengkap] - [Nama Satker]\n` +
      `*Portal Kelas:* https://agrasena-batch-3-class.vercel.app`

    navigator.clipboard.writeText(text)
    setCopiedField('all')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const LMS_URL =
    'https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat'
  const zoomDirectUrl = b3Zoom.zoomUrl || LMS_URL

  return (
    <motion.section
      id="zoom-access"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-20 rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#e6e6e6] dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30">
              <Video className="h-3.5 w-3.5" />
              <span>Akses Resmi Zoom Meeting</span>
            </span>
            <span className="text-[11px] font-semibold text-[#615d59] dark:text-[#94a3b8]">
              Agrasena Batch 3 • 24 Agu – 2 Okt 2026
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-white tracking-tight">
            Ruang Perkuliahan Virtual Tatap Muka Online (TMO)
          </h2>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
            Akses resmi ruang kuliah virtual Diklat Fungsional Pranata Komputer Keahlian Kejaksaan RI.
          </p>
        </div>

        {/* Host / Schedule Badge */}
        <div className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 shrink-0 self-start md:self-auto">
          <Building2 className="h-4 w-4 text-[#007aff] dark:text-[#60a5fa]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#615d59] dark:text-[#94a3b8]">
              Penyelenggara
            </div>
            <div className="text-xs font-bold text-[#000000] dark:text-white">
              {b3Zoom.hostName || 'Badiklat Kejaksaan RI & BPS RI'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Meeting ID, Passcode, and Direct Join (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Meeting ID & Passcode Card */}
          <div className="rounded-[14px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Meeting ID Box */}
              <div className="rounded-[10px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#615d59] dark:text-[#94a3b8] block">
                    Meeting ID Resmi
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black text-[#000000] dark:text-white tracking-wider">
                    {b3Zoom.meetingId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(b3Zoom.meetingId, 'meetingId')}
                  title="Salin Meeting ID"
                  className="p-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 transition cursor-pointer"
                >
                  {copiedField === 'meetingId' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Passcode Box */}
              <div className="rounded-[10px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#615d59] dark:text-[#94a3b8] block">
                    Passcode Kelas
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black text-[#007aff] dark:text-[#60a5fa] tracking-wider">
                    {b3Zoom.passcode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(b3Zoom.passcode, 'passcode')}
                  title="Salin Passcode"
                  className="p-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 transition cursor-pointer"
                >
                  {copiedField === 'passcode' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center gap-2 text-xs text-[#615d59] dark:text-[#94a3b8]">
              <Clock className="h-3.5 w-3.5 text-[#007aff] dark:text-[#60a5fa] shrink-0" />
              <span>
                Jadwal Perkuliahan:{' '}
                <strong className="text-[#000000] dark:text-white font-semibold">
                  {b3Zoom.sessionScheduleText || 'Senin – Jumat | 08:00 – 15:30 WIB'}
                </strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-[#e6e6e6] dark:border-white/10">
              <a
                href={zoomDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white py-2.5 px-4 text-xs font-bold shadow-xs transition"
              >
                <Video className="h-4 w-4" />
                <span>Masuk Ruang Zoom Kelas</span>
                <ExternalLink className="h-3 w-3 opacity-80" />
              </a>

              <a
                href={LMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white dark:bg-[#141b27] text-[#000000] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-[#e6e6e6] dark:border-white/10 py-2.5 px-4 text-xs font-semibold transition"
              >
                <Building2 className="h-3.5 w-3.5 text-[#007aff]" />
                <span>Portal LMS Ruang Diklat</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white dark:bg-[#141b27] text-[#615d59] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 py-2.5 px-3 text-xs font-medium transition cursor-pointer"
                title="Salin seluruh rincian Zoom ke clipboard"
              >
                {copiedField === 'all' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Info</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Guidelines & Display Name Format (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-[14px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-4 sm:p-5 space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#007aff] shrink-0" />
              <h4 className="text-xs font-bold text-[#000000] dark:text-white uppercase tracking-wider">
                Tata Tertib & Format Akun Zoom Wajib
              </h4>
            </div>

            {/* Display Name Format Box */}
            <div className="p-2.5 rounded-[10px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#615d59] dark:text-[#94a3b8] block">
                Format Display Name:
              </span>
              <code className="block font-mono text-xs font-bold text-[#007aff] dark:text-[#60a5fa] break-all">
                [No Absen] - [Nama Lengkap] - [Nama Satker]
              </code>
              <span className="text-[10px] text-[#615d59] dark:text-[#94a3b8] block">
                Contoh: <span className="font-mono font-semibold text-[#000000] dark:text-white">05 - Dewa Surya - Kejari Soppeng</span>
              </span>
            </div>

            {/* Guidelines List */}
            <ul className="space-y-1.5 text-[11px] text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Wajib menyalakan kamera (on-cam) dengan Virtual Background resmi Batch 3.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Menggunakan seragam dinas harian (PDH) rapi sesuai tata tertib.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Presensi digital dibuka 15 menit sebelum sesi perkuliahan dimulai.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/**
 * Kartu Zoom Multi-Angkatan (Angkatan 1 s.d. 6) untuk Batch 4
 */
function Batch4MultiAngkatanZoomCard() {
  const { config } = useRoadmapZoomConfig(4)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [myAngkatan, setMyAngkatan] = React.useState<string>('1')

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('prakom_user_angkatan_b4')
      if (saved) {
        setMyAngkatan(saved)
      }
    } catch {
      // Ignore
    }
  }, [])

  const handleSelectAngkatan = (id: string) => {
    setMyAngkatan(id)
    try {
      localStorage.setItem('prakom_user_angkatan_b4', id)
    } catch {
      // Ignore
    }
  }

  const handleCopyInfo = (cls: RoadmapZoomClass) => {
    const text =
      `ZOOM MEETING DIKLAT PRAKOM BATCH 4 — ${cls.name.toUpperCase()}\n` +
      `Meeting ID: ${cls.meetingId}\n` +
      `Passcode: ${cls.passcode || config.globalPasscode}\n` +
      `Link Langsung: ${cls.url}\n` +
      `Akses Resmi Angkatan Diklat Kejaksaan RI`

    navigator.clipboard.writeText(text)
    setCopiedId(cls.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const theme = {
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20',
    activeRing: 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30',
    selectedBadge: 'bg-emerald-600 text-white',
    selectedPill: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
    passcodeText: 'text-emerald-600 dark:text-emerald-400',
    accentIcon: 'text-emerald-600 dark:text-emerald-400',
    highlightBadge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
    tagText: 'Batch 4 (Angkatan 1 s.d. 6) • Angkatan 2026',
    hoverBorder: 'hover:border-emerald-500/40',
  }

  return (
    <motion.section
      id="zoom-access"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-20 rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#e6e6e6] dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${theme.badgeBg}`}>
              <Video className="h-3.5 w-3.5" />
              <span>Akses Resmi Zoom Meeting</span>
            </span>
            <span className="text-[11px] font-semibold text-[#615d59] dark:text-[#94a3b8]">
              {theme.tagText}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-white tracking-tight">
            Ruang Tatap Muka Online (TMO) Tiap Angkatan
          </h2>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
            Klik tombol <strong>"Gabung Zoom"</strong> pada angkatan Anda untuk langsung terhubung ke ruang kelas virtual.
          </p>
        </div>

        {/* Global Passcode Badge */}
        <div className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 shrink-0 self-start md:self-auto">
          <KeyRound className={`h-4 w-4 ${theme.accentIcon}`} />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#615d59] dark:text-[#94a3b8]">
              Passcode Semua Kelas
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-[#000000] dark:text-white">
              {config.globalPasscode}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Angkatan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {config.classes.map((cls) => {
          const isSelected = myAngkatan === cls.id
          const isCopied = copiedId === cls.id

          return (
            <div
              key={cls.id}
              onClick={() => handleSelectAngkatan(cls.id)}
              className={`rounded-[14px] p-4 transition-all duration-200 border flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? `${theme.activeRing} shadow-sm`
                  : `bg-[#f6f5f4] dark:bg-[#1a2332] border-[#e6e6e6] dark:border-white/10 ${theme.hoverBorder}`
              }`}
            >
              {/* Card Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-[8px] font-bold text-xs ${
                        isSelected
                          ? theme.selectedBadge
                          : `bg-white dark:bg-[#141b27] ${theme.accentIcon} border border-[#e6e6e6] dark:border-white/10`
                      }`}
                    >
                      {cls.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-[#000000] dark:text-white leading-tight">
                        {cls.name}
                      </h3>
                      {cls.badge && (
                        <span className="text-[10px] text-[#615d59] dark:text-[#94a3b8]">
                          {cls.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {cls.highlight && (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${theme.highlightBadge}`}>
                      Utama
                    </span>
                  )}
                  {isSelected && !cls.highlight && (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${theme.selectedPill}`}>
                      Kelas Anda
                    </span>
                  )}
                </div>

                {/* Meeting ID & Passcode Box */}
                <div className="p-2.5 rounded-[10px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#615d59] dark:text-[#94a3b8]">Meeting ID:</span>
                    <span className="font-mono font-bold text-[#000000] dark:text-white text-xs">
                      {cls.meetingId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#615d59] dark:text-[#94a3b8]">Passcode:</span>
                    <span className={`font-mono font-bold ${theme.passcodeText}`}>
                      {cls.passcode || config.globalPasscode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={cls.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-1.5 px-3 text-xs font-semibold shadow-xs transition active:scale-[0.98] ${theme.primaryBtn}`}
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Gabung Zoom</span>
                  <ExternalLink className="h-3 w-3 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyInfo(cls)
                  }}
                  title="Salin Meeting ID & Passcode"
                  className="p-1.5 rounded-full bg-white dark:bg-[#141b27] text-[#615d59] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 transition cursor-pointer"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rules Notice Footer */}
      <div className="p-3 rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 flex items-start gap-2.5 text-[11px] text-[#615d59] dark:text-[#94a3b8]">
        <Info className={`h-4 w-4 ${theme.accentIcon} shrink-0 mt-0.5`} />
        <div>
          <strong className="text-[#000000] dark:text-white font-semibold">
            Format Nama Akun Zoom Wajib:
          </strong>{' '}
          Gunakan format <code className={`px-1.5 py-0.5 rounded bg-white dark:bg-[#141b27] font-mono text-[10px] ${theme.passcodeText} border border-[#e6e6e6] dark:border-white/10`}>[Angkatan]_[Nama Lengkap]_[Satker]</code> (Contoh: <code className="font-mono">5_Dewa Surya_Kejari Soppeng</code>) untuk validasi presensi otomatis Pusdiklat.
        </div>
      </div>
    </motion.section>
  )
}
