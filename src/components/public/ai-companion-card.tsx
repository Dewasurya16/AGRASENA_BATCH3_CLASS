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

  const currentItem = AI_GREETINGS[currentIndex]

  const handleNextMessage = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % AI_GREETINGS.length)
      setIsRefreshing(false)
    }, 250)
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF9F2] via-[#FFF5EC] to-[#FFF0E6] dark:from-[#181C26] dark:via-[#141822] dark:to-[#10131B] p-6 sm:p-7 border-2 border-[#FFE2D1] dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Decorative Pastel Aura */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#FF7643]/15 dark:bg-amber-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-[#FFE3EB]/40 dark:bg-rose-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left: AI Bot Avatar + Greeting */}
        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#18181B] dark:bg-emerald-700 text-white shadow-md">
            <Bot className="h-7 w-7 text-[#FFD280] dark:text-white" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0D824B] ring-2 ring-white dark:ring-[#18181B]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#18181B] dark:bg-slate-800 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FFD280] dark:text-amber-300">
                🤖 AI Asisten Kelas
              </span>
              <span className="text-[11px] font-semibold text-[#8C9BAE] dark:text-slate-400">
                Update Otomatis Harian
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <h4 className="font-extrabold text-base sm:text-lg text-[#18181B] dark:text-white">
                  {currentItem.greeting}
                </h4>
                <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-300 leading-relaxed max-w-xl">
                  {currentItem.message}
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#EA580C] dark:text-amber-400">
                  <span>{currentItem.tip}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Refresh button */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={handleNextMessage}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-full bg-white dark:bg-[#1E2433] px-4 py-2.5 text-xs font-extrabold text-[#18181B] dark:text-white shadow-xs border border-[#FFE2D1] dark:border-slate-700 hover:bg-[#18181B] dark:hover:bg-slate-700 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sapaan Baru</span>
          </button>
        </div>

      </div>
    </div>
  )
}
