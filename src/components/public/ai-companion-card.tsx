'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Bot, RefreshCw, MessageSquareHeart, Zap, Bell, CheckCircle2, Clock } from "lucide-react"

const AI_GREETINGS = [
  {
    greeting: "Selamat Berlibur & Selamat Beristirahat! 🏖️",
    message: "Hari ini tidak ada sesi tatap muka online. Selamat menikmati waktu rehat santai bersama keluarga dan recharge energi untuk sesi perkuliahan berikutnya!",
    tip: "💡 Pengingat Jadwal: Perkuliahan Hari ke-6 (Building Learning Commitment) dimulai Senin pukul 09:30 WIB.",
    urgency: "success",
  },
  {
    greeting: "Semangat Pagi, Sobat Prakom 625! ☀️",
    message: "Tahap 2 Tatap Muka Online (TMO) segera dimulai. Siapkan koneksi stabil dan modul perkuliahan agar sesi Zoom berjalan lancar!",
    tip: "💡 Tips AI: Luangkan 15 menit untuk baca rangkuman slide sebelum masuk ke sesi praktikum ya!",
    urgency: "normal",
  },
  {
    greeting: "Waktunya Gaspol, Rekan-rekan! 🚀",
    message: "Modul materi 120 JP dan bank soal kuis MOOC tersimpan rapi dan bisa diakses kapan saja untuk latihan mandiri.",
    tip: "⚠️ Reminder AI: Cek tab Tugas Mandiri secara berkala untuk memastikan tidak ada tugas yang terlewat.",
    urgency: "warning",
  },
  {
    greeting: "Hai Sobat Kejaksaan & Agrasena! 👋",
    message: "Santai tapi konsisten, itu kuncinya! Progres kelas kita terus bertambah menuju kelulusan 120 JP. Keren banget perjuangannya!",
    tip: "🎯 Fun Fact: Prakom Keahlian memegang peranan krusial dalam transformasi digital SPBE Kejaksaan RI!",
    urgency: "success",
  },
  {
    greeting: "Selamat Siang! Tetap Semangat ✨",
    message: "Kalau ada materi yang agak rumit, tanyakan langsung ke AI Asisten Prakom di pojok kanan bawah atau diskusikan di forum kelas.",
    tip: "📖 Tips Belajar: Gunakan AI Generator Makalah untuk membuat draf awal proposal inovasi satker Anda.",
    urgency: "normal",
  },
]

export function AiCompanionCard() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  const [userSatker, setUserSatker] = React.useState("")

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
    loadProfile()
    const handleProfileUpdate = () => loadProfile()
    window.addEventListener("prakom-profile-updated", handleProfileUpdate)
    window.addEventListener("storage", handleProfileUpdate)
    return () => {
      window.removeEventListener("prakom-profile-updated", handleProfileUpdate)
      window.removeEventListener("storage", handleProfileUpdate)
    }
  }, [])

  const currentItem = AI_GREETINGS[currentIndex]

  const handleNextMessage = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % AI_GREETINGS.length)
      setIsRefreshing(false)
    }, 250)
  }

  return (
    <div className="relative overflow-hidden rounded-[14px] bg-white dark:bg-[#141b27] p-4 sm:p-5 border border-[#e6e6e6] dark:border-white/10 shadow-xs transition-all duration-200">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Apple SF Bot Icon + Greeting */}
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
                {userName ? `Hai, ${userName}${userSatker ? ` • ${userSatker}` : ""}` : "Update Harian"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <h4 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white">
                  {currentItem.greeting}
                </h4>
                <p className="text-xs sm:text-sm text-[#31302e] dark:text-[#cbd5e1] font-normal leading-relaxed max-w-xl">
                  {currentItem.message}
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#f6f5f4] dark:bg-[#101520] border border-[#e6e6e6] dark:border-white/10 px-3 py-1 text-[11px] font-medium text-[#31302e] dark:text-[#cbd5e1]">
                    <span>{currentItem.tip}</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Refresh Tip Action */}
        <button
          type="button"
          onClick={handleNextMessage}
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
