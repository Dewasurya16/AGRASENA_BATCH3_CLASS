'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Bot, RefreshCw, MessageSquareHeart, Zap, Bell, CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react"
import { RoadmapProgressSummary } from "@/lib/roadmap-utils"

interface AiCompanionCardProps {
  summary?: RoadmapProgressSummary
  todaySchedules?: any[]
  closestTask?: any
}

export function AiCompanionCard({ summary, todaySchedules = [], closestTask }: AiCompanionCardProps) {
  const [tipIndex, setTipIndex] = React.useState(0)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  const [userSatker, setUserSatker] = React.useState("")
  const [mounted, setMounted] = React.useState(false)

  const loadProfile = () => {
    try {
      const savedName = localStorage.getItem("prakom_user_name")
      const savedSatker = localStorage.getItem("prakom_user_satker")
      if (savedName) setUserName(savedName)
      if (savedSatker) setUserSatker(savedSatker)
    } catch {
      // Ignore
    }
  }

  React.useEffect(() => {
    setMounted(true)
    loadProfile()
    const handleProfileUpdate = () => loadProfile()
    window.addEventListener("prakom-profile-updated", handleProfileUpdate)
    window.addEventListener("storage", handleProfileUpdate)
    return () => {
      window.removeEventListener("prakom-profile-updated", handleProfileUpdate)
      window.removeEventListener("storage", handleProfileUpdate)
    }
  }, [])

  // Dynamic context calculation in WIB (Asia/Jakarta)
  const dynamicContext = React.useMemo(() => {
    const now = new Date()
    let wibHour = 9
    let wibDayName = "Senin"

    try {
      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        hour: "numeric",
        hour12: false,
      })
      wibHour = parseInt(hourFormatter.format(now), 10)

      const dayFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
      })
      wibDayName = dayFormatter.format(now) // "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
    } catch {
      wibHour = now.getHours()
    }

    const isWeekend = wibDayName.toLowerCase() === "sabtu" || wibDayName.toLowerCase() === "minggu"

    // Time-based greeting prefix
    let timeGreeting = "Semangat Pagi"
    let timeIcon = "☀️"
    if (wibHour >= 11 && wibHour < 15) {
      timeGreeting = "Selamat Siang"
      timeIcon = "✨"
    } else if (wibHour >= 15 && wibHour < 18) {
      timeGreeting = "Selamat Sore"
      timeIcon = "🌇"
    } else if (wibHour >= 18 || wibHour < 4) {
      timeGreeting = "Selamat Malam"
      timeIcon = "🌙"
    }

    const dayNum = summary?.currentDayNumber || 6
    const stageName = summary?.currentStageName || "Tahap 2 • Tatap Muka Online (TMO)"

    if (isWeekend) {
      return {
        isWeekend: true,
        greeting: `Selamat Menikmati Libur Akhir Pekan! 🏖️`,
        mainMessage: `Hari ini tidak ada sesi tatap muka online. Selamat menikmati waktu rehat santai bersama keluarga, membaca modul santai, atau recharge energi untuk perkuliahan berikutnya!`,
        tipsList: [
          `💡 Pengingat: Perkuliahan Tatap Muka Online (TMO) berlanjut hari Senin pukul 09:30 WIB.`,
          `📖 Tips Weekend: Sempatkan baca sekilas slide modul pekan depan agar diskusi kelas lebih aktif!`,
          `📝 Tips Inovasi: Eksplor ide rancangan aksi perubahan digital untuk satker di Generator Makalah AI.`,
          `✨ Motivasi: Istirahat yang cukup adalah kunci fokus optimal dalam menyelesaikan 120 JP Diklat!`,
        ]
      }
    }

    // Weekday Active Diklat Day
    let mainMsg = `Hari ini adalah Hari ke-${dayNum} (${stageName}). Pastikan koneksi internet stabil dan siapkan modul materi untuk mengikuti sesi perkuliahan aktif!`
    if (todaySchedules && todaySchedules.length > 0) {
      mainMsg = `Hari ini kita aktif di Hari ke-${dayNum} (${stageName}) dengan ${todaySchedules.length} sesi perkuliahan. Pastikan hadir tepat waktu dan aktif berdiskusi bersama Widyaiswara!`
    }

    const weekdayTips: string[] = []

    // Priority Tip: Task Deadline
    if (closestTask) {
      weekdayTips.push(`⏰ Pengingat Tugas: "${closestTask.title}" (${closestTask.subject_name}) deadline pukul 23:59 WIB.`)
    }

    weekdayTips.push(`💡 Tips Kelas: Jangan lupa isi presensi kehadiran di portal LMS Pusdiklat & unduh slide modul materi hari ini.`)
    weekdayTips.push(`🎯 Tips Ujian: Coba simulasi soal di Bank Soal Kuis MOOC untuk memperdalam pemahaman materi SPBE & ITIL.`)
    weekdayTips.push(`📜 Tips DUPAK: Kumpulkan bukti fisik laporan pemeliharaan TIK untuk penyusunan PAK Integrasi Pranata Komputer.`)
    weekdayTips.push(`🤖 Tanya AI: Butuh ringkasan materi atau konsultasi teknis? Klik widget Asisten AI di pojok kanan bawah!`)
    weekdayTips.push(`🚀 Semangat: Transformasi digital Kejaksaan RI dimulai dari dedikasi dan profesionalisme Pranata Komputer!`)

    return {
      isWeekend: false,
      greeting: `${timeGreeting}, Sobat Prakom 625! ${timeIcon}`,
      mainMessage: mainMsg,
      tipsList: weekdayTips,
    }
  }, [summary, todaySchedules, closestTask])

  const activeTip = dynamicContext.tipsList[tipIndex % dynamicContext.tipsList.length]

  const handleNextTip = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % dynamicContext.tipsList.length)
      setIsRefreshing(false)
    }, 200)
  }

  if (!mounted) {
    return (
      <div className="rounded-[14px] bg-white dark:bg-[#141b27] p-4 sm:p-5 border border-[#e6e6e6] dark:border-white/10 shadow-xs h-28 animate-pulse" />
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[14px] bg-white dark:bg-[#141b27] p-4 sm:p-5 border border-[#e6e6e6] dark:border-white/10 shadow-xs transition-all duration-200">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Bot Icon + Dynamic Greeting */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#007aff]/10 dark:bg-[#007aff]/20 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/20 shadow-2xs mt-0.5">
            <Bot className="h-5 w-5" strokeWidth={2} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#34c759] ring-2 ring-white dark:ring-[#141b27]">
              <span className="h-1 w-1 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#007aff]/10 dark:bg-[#007aff]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/20">
                <Sparkles className="h-3 w-3 text-[#007aff] dark:text-[#60a5fa]" strokeWidth={2} />
                <span>AI Asisten Kelas</span>
              </span>
              <span className="text-[11px] font-normal text-[#615d59] dark:text-[#94a3b8]">
                {userName ? `Hai, ${userName}${userSatker ? ` • ${userSatker}` : ""}` : "Update Harian Aktif"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${dynamicContext.greeting}-${tipIndex}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <h4 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white">
                  {dynamicContext.greeting}
                </h4>
                <p className="text-xs sm:text-sm text-[#31302e] dark:text-[#cbd5e1] font-normal leading-relaxed max-w-xl">
                  {dynamicContext.mainMessage}
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#f6f5f4] dark:bg-[#101520] border border-[#e6e6e6] dark:border-white/10 px-3 py-1 text-[11px] font-medium text-[#31302e] dark:text-[#cbd5e1]">
                    <span>{activeTip}</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Refresh Tip Action */}
        <button
          type="button"
          onClick={handleNextTip}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10 hover:bg-[#e6e6e6] dark:hover:bg-[#253043] active:scale-[0.98] px-3.5 py-1.5 text-xs font-semibold transition-all shadow-2xs cursor-pointer shrink-0 self-start md:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} strokeWidth={2} />
          <span>Ganti Tips</span>
        </button>

      </div>
    </div>
  )
}
