'use client'

import * as React from "react"
import { motion } from "framer-motion"
import {
  Video,
  Clock,
  ExternalLink,
  Sparkles,
  Radio,
  Calendar,
  User,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  Laptop
} from "lucide-react"
import { BATCH4_ZOOM_CONFIG } from "@/data/batch4/zoom-config"
import { DEFAULT_BATCH4_SCHEDULES } from "@/data/batch4/schedules-data"
import { useTimezone } from "@/components/timezone-provider"

export function LiveSessionBannerB4() {
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'zoom' | 'guidelines'>('zoom')
  const { timezone, setTimezone, formatCurrentTime } = useTimezone()
  const [timeStr, setTimeStr] = React.useState("")

  React.useEffect(() => {
    const updateTime = () => {
      setTimeStr(formatCurrentTime())
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [formatCurrentTime])

  const handleCopyCredentials = () => {
    const text = `Meeting ID: ${BATCH4_ZOOM_CONFIG.meetingId}\nPasscode: ${BATCH4_ZOOM_CONFIG.passcode}\nLink: ${BATCH4_ZOOM_CONFIG.zoomUrl}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Hari aktif perdana Batch 4 (jika sudah diinput oleh admin)
  const firstSchedule = DEFAULT_BATCH4_SCHEDULES[0] || null

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#0f172a] text-white p-5 sm:p-7 border border-indigo-500/30 shadow-xl shadow-indigo-950/40 transition-all">
      {/* Decorative Ambient Aura */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300">
              <Radio className="h-4 w-4 animate-pulse text-indigo-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Live Virtual Zoom Room
                </span>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-bold text-indigo-200">
                  Agrasena Batch 4
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                Ruang Tatap Muka Online & Kuliah Virtual
              </h2>
            </div>
          </div>

          {/* Time & Timezone Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium border border-white/10">
              <Clock className="h-3.5 w-3.5 text-indigo-300" />
              <span className="font-mono">{timeStr || "08:00:00"}</span>
              <span className="text-[10px] text-indigo-200 font-bold uppercase">{timezone}</span>
            </div>
            <div className="flex rounded-full bg-white/10 p-0.5 border border-white/10 text-[10px] font-bold">
              {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
                <button
                  key={tz}
                  type="button"
                  onClick={() => setTimezone(tz)}
                  className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                    timezone === tz ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Grid: Zoom Credentials & Live Schedule Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1 & 2: Zoom Direct Launcher */}
          <div className="lg:col-span-2 rounded-[16px] bg-white/5 border border-white/10 p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-indigo-400" />
                  <span>Sesi Tatap Muka Virtual Agrasena Batch 4</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  {BATCH4_ZOOM_CONFIG.sessionScheduleText}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {firstSchedule ? firstSchedule.subject_name : "Jadwal Sesi Perkuliahan Virtual Sedang Disiapkan"}
                </h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{firstSchedule ? `Narasumber: ${firstSchedule.lecturer}` : "Narasumber: Tim Widyaiswara Badiklat Kejaksaan RI"}</span>
                </p>
              </div>

              {/* Credential Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <div className="rounded-xl bg-black/30 border border-white/10 p-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Meeting ID</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-indigo-200">
                    {BATCH4_ZOOM_CONFIG.meetingId}
                  </span>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Passcode</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300">
                    {BATCH4_ZOOM_CONFIG.passcode}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl bg-black/30 border border-white/10 p-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Penyelenggara</span>
                  <span className="text-xs font-semibold text-slate-200 truncate block">
                    Pusdiklat BPS & Kejaksaan
                  </span>
                </div>
              </div>
            </div>

            {/* Launcher Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/10">
              <a
                href={BATCH4_ZOOM_CONFIG.zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white py-2.5 px-5 text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Video className="h-4 w-4" />
                <span>Masuk ke Zoom Batch 4</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleCopyCredentials}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white py-2.5 px-4 text-xs font-bold border border-white/15 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-indigo-300" />
                    <span>Salin ID & Passcode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: SOP & Etika Zoom Batch 4 */}
          <div className="rounded-[16px] bg-white/5 border border-white/10 p-4 sm:p-5 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>Tata Tertib & SOP Sesi</span>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                {BATCH4_ZOOM_CONFIG.guidelines.map((guide, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-4 w-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] text-indigo-200/80 font-medium block">
                💡 Presensi digital dibuka 15 menit sebelum perkuliahan dimulai.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
