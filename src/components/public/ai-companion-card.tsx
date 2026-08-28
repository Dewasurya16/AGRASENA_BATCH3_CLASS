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
    <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white dark:from-[#1B2130] dark:via-[#181E2C] dark:to-[#141824] p-4 sm:p-5 border border-amber-200/70 dark:border-[#2A3550] shadow-xs transition-colors duration-200">
      {/* Decorative Subtle Ambient Glow */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/10 dark:bg-amber-500/5 blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-amber-500/10 dark:bg-indigo-500/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: AI Bot Avatar + Greeting */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-slate-900 dark:bg-indigo-600 text-white shadow-sm mt-0.5">
            <Bot className="h-5 w-5 text-amber-300 dark:text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1B2130]">
              <span className="h-1 w-1 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                🤖 AI Asisten Kelas
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400">
                Update Otomatis Harian
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {currentItem.greeting}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {currentItem.message}
                </p>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-orange-700 dark:text-amber-400">
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
            className="flex items-center gap-1.5 rounded-[8px] bg-white dark:bg-[#161B26] px-3.5 py-2 text-xs font-black text-slate-800 dark:text-slate-200 shadow-2xs border border-amber-200/80 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-[#202738] transition cursor-pointer active:scale-95"
          >
            <RefreshCw className={`h-3 w-3 text-slate-500 dark:text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sapaan Baru</span>
          </button>
        </div>

      </div>
    </div>
  )
}
