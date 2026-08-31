'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Video,
  Copy,
  Check,
  ExternalLink,
  Shield,
  KeyRound,
  Users,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react'

export interface ZoomClassInfo {
  angkatan: number
  name: string
  meetingId: string
  meetingIdDisplay: string
  passcode: string
  joinUrl: string
  description: string
  isHighlight?: boolean
}

export const ZOOM_CLASSES_DATA: ZoomClassInfo[] = [
  {
    angkatan: 1,
    name: "Angkatan 1",
    meetingId: "97017342615",
    meetingIdDisplay: "970 1734 2615",
    passcode: "Biropeg-24",
    joinUrl: "https://zoom.us/j/97017342615",
    description: "Ruang Kelas Tatap Muka Online Angkatan 1"
  },
  {
    angkatan: 2,
    name: "Angkatan 2",
    meetingId: "91556509491",
    meetingIdDisplay: "915 5650 9491",
    passcode: "Biropeg-24",
    joinUrl: "https://zoom.us/j/91556509491",
    description: "Ruang Kelas Tatap Muka Online Angkatan 2"
  },
  {
    angkatan: 3,
    name: "Angkatan 3",
    meetingId: "98011238540",
    meetingIdDisplay: "980 1123 8540",
    passcode: "Biropeg-24",
    joinUrl: "https://zoom.us/j/98011238540",
    description: "Ruang Kelas Tatap Muka Online Angkatan 3"
  },
  {
    angkatan: 4,
    name: "Angkatan 4",
    meetingId: "95385758152",
    meetingIdDisplay: "953 8575 8152",
    passcode: "Biropeg-24",
    joinUrl: "https://zoom.us/j/95385758152",
    description: "Ruang Kelas Tatap Muka Online Angkatan 4"
  },
  {
    angkatan: 5,
    name: "Angkatan 5",
    meetingId: "91420172539",
    meetingIdDisplay: "914 2017 2539",
    passcode: "Biropeg-24",
    joinUrl: "https://zoom.us/j/91420172539",
    description: "Ruang Kelas Tatap Muka Online Angkatan 5 (Agrasena 625)",
    isHighlight: true
  },
  {
    angkatan: 6,
    name: "Angkatan 6",
    meetingId: "96728656691",
    meetingIdDisplay: "967 2865 6691",
    passcode: "Biropeg-24",
    joinUrl: "https://zoom.us/j/96728656691",
    description: "Ruang Kelas Tatap Muka Online Angkatan 6"
  }
]

export function ZoomClassAccess() {
  const [copiedId, setCopiedId] = React.useState<number | null>(null)
  const [myAngkatan, setMyAngkatan] = React.useState<number>(5)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('prakom_user_angkatan')
      if (saved) {
        setMyAngkatan(parseInt(saved, 10))
      }
    } catch {
      // Ignore
    }
  }, [])

  const handleSelectAngkatan = (num: number) => {
    setMyAngkatan(num)
    try {
      localStorage.setItem('prakom_user_angkatan', num.toString())
    } catch {
      // Ignore
    }
  }

  const handleCopyInfo = (cls: ZoomClassInfo) => {
    const text = `ZOOM MEETING DIKLAT PRAKOM BATCH 3 — ${cls.name.toUpperCase()}\n` +
      `Meeting ID: ${cls.meetingIdDisplay}\n` +
      `Passcode: ${cls.passcode}\n` +
      `Link Langsung: ${cls.joinUrl}\n` +
      `Periode: 24 Agustus 2026 s.d. 2 Oktober 2026`

    navigator.clipboard.writeText(text)
    setCopiedId(cls.angkatan)
    setTimeout(() => setCopiedId(null), 2000)
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4444]/15 text-[#dc2626] dark:text-[#f87171] border border-[#ef4444]/30 px-3 py-0.5 text-xs font-semibold">
              <Video className="h-3.5 w-3.5" />
              <span>Akses Resmi Zoom Meeting</span>
            </span>
            <span className="text-[11px] font-semibold text-[#615d59] dark:text-[#94a3b8]">
              Batch 3 (Angkatan 1 s.d. 6) • 24 Agu – 2 Okt 2026
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-white tracking-tight">
            Ruang Tatap Muka Online (TMO) Tiap Angkatan
          </h2>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
            Klik tombol <strong>"Gabung Zoom"</strong> pada angkatan Anda untuk langsung terhubung ke ruang kuliah virtual.
          </p>
        </div>

        {/* Global Passcode Badge */}
        <div className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 shrink-0 self-start md:self-auto">
          <KeyRound className="h-4 w-4 text-[#007aff] dark:text-[#60a5fa]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#615d59] dark:text-[#94a3b8]">
              Passcode Semua Kelas
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-[#000000] dark:text-white">
              Biropeg-24
            </div>
          </div>
        </div>
      </div>

      {/* Grid 6 Angkatan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ZOOM_CLASSES_DATA.map((cls) => {
          const isSelected = myAngkatan === cls.angkatan
          const isCopied = copiedId === cls.angkatan

          return (
            <div
              key={cls.angkatan}
              onClick={() => handleSelectAngkatan(cls.angkatan)}
              className={`rounded-[14px] p-4 transition-all duration-200 border flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? 'bg-[#007aff]/5 dark:bg-[#007aff]/15 border-[#007aff] shadow-sm ring-1 ring-[#007aff]/30'
                  : 'bg-[#f6f5f4] dark:bg-[#1a2332] border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/40'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-[8px] font-bold text-xs ${
                        isSelected
                          ? 'bg-[#007aff] text-white'
                          : 'bg-white dark:bg-[#141b27] text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10'
                      }`}
                    >
                      {cls.angkatan}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#000000] dark:text-white">
                      {cls.name}
                    </h3>
                  </div>

                  {cls.isHighlight && (
                    <span className="rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-2 py-0.2 text-[9px] font-bold">
                      Agrasena 625
                    </span>
                  )}
                  {isSelected && !cls.isHighlight && (
                    <span className="rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-2 py-0.2 text-[9px] font-bold">
                      Kelas Anda
                    </span>
                  )}
                </div>

                {/* Meeting ID & Passcode Box */}
                <div className="p-2.5 rounded-[10px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#615d59] dark:text-[#94a3b8]">Meeting ID:</span>
                    <span className="font-mono font-bold text-[#000000] dark:text-white text-xs">
                      {cls.meetingIdDisplay}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#615d59] dark:text-[#94a3b8]">Passcode:</span>
                    <span className="font-mono font-bold text-[#007aff] dark:text-[#60a5fa]">
                      {cls.passcode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={cls.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white py-1.5 px-3 text-xs font-semibold shadow-2xs transition"
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
                  {isCopied ? <Check className="h-3.5 w-3.5 text-[#16a34a]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rules Notice Footer */}
      <div className="p-3 rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 flex items-start gap-2.5 text-[11px] text-[#615d59] dark:text-[#94a3b8]">
        <Info className="h-4 w-4 text-[#007aff] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#000000] dark:text-white font-semibold">
            Format Nama Akun Zoom Wajib:
          </strong>{" "}
          Gunakan format <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#141b27] font-mono text-[10px] text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10">[Angkatan]_[Nama Lengkap]_[Satker]</code> (Contoh: <code className="font-mono">5_Dewa Surya_Kejari Soppeng</code>) untuk validasi presensi otomatis Pusdiklat.
        </div>
      </div>
    </motion.section>
  )
}
