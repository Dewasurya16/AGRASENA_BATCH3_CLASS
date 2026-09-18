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
  Sparkles
} from 'lucide-react'
import { useRoadmapZoomConfig, RoadmapZoomClass } from '@/lib/roadmap-zoom-client'

export interface ZoomClassAccessProps {
  batchNum?: 3 | 4
}

export function ZoomClassAccess({ batchNum = 3 }: ZoomClassAccessProps) {
  const { config, loading } = useRoadmapZoomConfig(batchNum)
  const isB4 = batchNum === 4

  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [myAngkatan, setMyAngkatan] = React.useState<string>(isB4 ? '1' : '5')

  React.useEffect(() => {
    try {
      const storageKey = isB4 ? 'prakom_user_angkatan_b4' : 'prakom_user_angkatan'
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setMyAngkatan(saved)
      }
    } catch {
      // Ignore
    }
  }, [isB4])

  const handleSelectAngkatan = (id: string) => {
    setMyAngkatan(id)
    try {
      const storageKey = isB4 ? 'prakom_user_angkatan_b4' : 'prakom_user_angkatan'
      localStorage.setItem(storageKey, id)
    } catch {
      // Ignore
    }
  }

  const handleCopyInfo = (cls: RoadmapZoomClass) => {
    const text = `ZOOM MEETING DIKLAT PRAKOM BATCH ${batchNum} — ${cls.name.toUpperCase()}\n` +
      `Meeting ID: ${cls.meetingId}\n` +
      `Passcode: ${cls.passcode || config.globalPasscode}\n` +
      `Link Langsung: ${cls.url}\n` +
      (isB4 ? `Akses Resmi Angkatan Diklat Kejaksaan RI` : `Periode: 24 Agustus 2026 s.d. 2 Oktober 2026`)

    navigator.clipboard.writeText(text)
    setCopiedId(cls.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Visual Theme Tokens
  const theme = isB4
    ? {
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
    : {
        primaryBtn: 'bg-[#007aff] hover:bg-[#0062cc] text-white shadow-blue-900/20',
        activeRing: 'border-[#007aff] bg-[#007aff]/5 dark:bg-[#007aff]/15 ring-1 ring-[#007aff]/30',
        selectedBadge: 'bg-[#007aff] text-white',
        selectedPill: 'bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30',
        passcodeText: 'text-[#007aff] dark:text-[#60a5fa]',
        accentIcon: 'text-[#007aff] dark:text-[#60a5fa]',
        highlightBadge: 'bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30',
        badgeBg: 'bg-[#ef4444]/15 text-[#dc2626] dark:text-[#f87171] border border-[#ef4444]/30',
        tagText: 'Batch 3 (Angkatan 1 s.d. 6) • 24 Agu – 2 Okt 2026',
        hoverBorder: 'hover:border-[#007aff]/40',
      }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4"
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
