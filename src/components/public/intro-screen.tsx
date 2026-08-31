'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  User,
  Building2,
  CreditCard,
  Edit3
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"

function getTimeGreeting(): { greeting: string; period: string; icon: string } {
  const hours = new Date().getHours()
  if (hours >= 4 && hours < 11) {
    return { greeting: "Selamat Pagi", period: "pagi ini", icon: "☀️" }
  } else if (hours >= 11 && hours < 15) {
    return { greeting: "Selamat Siang", period: "siang ini", icon: "🌤️" }
  } else if (hours >= 15 && hours < 18) {
    return { greeting: "Selamat Sore", period: "sore ini", icon: "🌅" }
  } else {
    return { greeting: "Selamat Malam", period: "malam ini", icon: "🌙" }
  }
}

export function IntroScreen() {
  const [mounted, setMounted] = React.useState(false)
  const [showIntro, setShowIntro] = React.useState(false)
  const [viewState, setViewState] = React.useState<'welcome' | 'form' | 'recognized'>('welcome')
  const { theme, toggleTheme } = useTheme()

  const [name, setName] = React.useState("")
  const [nip, setNip] = React.useState("")
  const [satker, setSatker] = React.useState("")
  const [timeInfo, setTimeInfo] = React.useState({ greeting: "Selamat Datang", period: "hari ini", icon: "👋" })

  React.useEffect(() => {
    setMounted(true)
    setTimeInfo(getTimeGreeting())

    try {
      const hasEntered = sessionStorage.getItem("has_entered_portal_session")
      const savedName = localStorage.getItem("prakom_user_name")
      const savedNip = localStorage.getItem("prakom_user_nip")
      const savedSatker = localStorage.getItem("prakom_user_satker")

      if (savedName) setName(savedName)
      if (savedNip) setNip(savedNip)
      if (savedSatker) setSatker(savedSatker)

      if (!hasEntered) {
        setShowIntro(true)
        if (savedName && savedName.trim().length > 0) {
          setViewState('recognized')
        } else {
          setViewState('welcome')
        }
      }
    } catch {
      // Safe fallback
    }
  }, [])

  const handleEnterPortal = React.useCallback(() => {
    try {
      sessionStorage.setItem("has_entered_portal_session", "true")
    } catch {
      // Safe fallback
    }
    setShowIntro(false)
  }, [])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    const finalName = name.trim() || "Peserta Diklat"
    const finalNip = nip.trim()
    const finalSatker = satker.trim() || "Satuan Kerja Kejaksaan RI"

    try {
      localStorage.setItem("prakom_user_name", finalName)
      localStorage.setItem("prakom_user_nip", finalNip)
      localStorage.setItem("prakom_user_satker", finalSatker)
      localStorage.setItem("prakom_user_onboarded", "true")

      window.dispatchEvent(new CustomEvent("prakom-profile-updated", {
        detail: { name: finalName, nip: finalNip, satker: finalSatker }
      }))
    } catch {
      // Ignore
    }

    setName(finalName)
    setSatker(finalSatker)
    setViewState('recognized')
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro && viewState === 'recognized' && (e.key === "Enter" || e.key === " ")) {
        handleEnterPortal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showIntro, viewState, handleEnterPortal])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <AnimatePresence mode="wait">
      {showIntro && (
        <motion.div
          key="introScreenModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col justify-between items-center select-none overflow-y-auto bg-[#F8F9FC] dark:bg-[#10141C] text-[#18181B] dark:text-[#E2E8F0] transition-colors duration-300 transform-gpu will-change-transform"
        >
          {/* Ambient glow — adapts per theme */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full blur-[100px] pointer-events-none transform-gpu transition-opacity duration-500 ${
              isDark
                ? "bg-gradient-to-tr from-[#0D3830]/50 via-[#1E293B]/40 to-[#0F172A]/30"
                : "bg-gradient-to-tr from-[#D7F3FE]/60 via-[#FFE3EB]/60 to-[#FFF2D1]/60"
            }`}
          />

          {/* Decorative stars */}
          <div className="absolute top-6 right-10 sm:right-20 text-[#BFDBFE] dark:text-[#334155] text-2xl font-black select-none pointer-events-none animate-pulse">
            ✦
          </div>
          <div className="absolute bottom-8 left-8 sm:left-16 text-[#FED7AA] dark:text-[#374151] text-xl font-black select-none pointer-events-none">
            ✦
          </div>

          {/* ── Top Header Bar ── */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pt-[calc(1rem+env(safe-area-inset-top,0px))]">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] overflow-hidden shadow-xs ring-1 ring-black/5 dark:ring-white/5">
                <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-wider uppercase text-[#18181B] dark:text-[#E2E8F0]">
                  Pranata Komputer Keahlian
                </span>
                <span className="text-[10px] font-semibold text-[#6B7C93] dark:text-[#8FA3BC]">
                  Kejaksaan RI X Agrasena (Prakom 625)
                </span>
              </div>
            </div>

            {/* Right: badge + theme toggle */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white dark:bg-[#1A2235] px-3 py-1 text-[10px] font-black text-[#0D824B] dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shadow-xs">
                Batch 3 • 120 JP
              </span>

              {/* Dark / Light Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Mode Terang' : 'Mode Gelap'}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white dark:bg-[#1A2235] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#222E45] shadow-xs cursor-pointer active:scale-95 transition"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* ── Center Content ── */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-5 my-auto px-4 py-4 w-full max-w-xl">

            {/* Visual: Planet 120 JP + Ring + Smiley */}
            <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center shrink-0">

              {/* Saturn Ring */}
              <motion.div
                animate={{ rotateZ: [-2, 2, -2], y: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-32 w-32 sm:h-40 sm:w-40 rounded-full border-[3px] border-[#334155] dark:border-[#475569] opacity-85 pointer-events-none"
                style={{ transform: "rotateX(72deg) rotateY(-18deg)" }}
              />

              {/* Sphere */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-22 w-22 sm:h-26 sm:w-26 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#818CF8] via-[#F472B6] to-[#FBBF24] shadow-xl shadow-pink-400/30 border-2 border-white/60 cursor-pointer"
              >
                <span className="text-white text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow-md">
                  120 JP
                </span>
                <div className="absolute -top-2 -right-1 text-[#F59E0B] text-lg select-none animate-pulse">✦</div>
              </motion.div>

              {/* Smiley */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 6 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [3, -3, 3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-1 -left-1 sm:left-0 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#FFF2D1] dark:bg-[#2D2010] border-[2.5px] border-[#18181B] dark:border-[#D97706] shadow-lg shadow-black/10 cursor-pointer z-20"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex gap-1 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B] dark:bg-[#FCD34D]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B] dark:bg-[#FCD34D]" />
                  </div>
                  <div className="h-1.5 w-3.5 rounded-b-full border-b-[2px] border-[#18181B] dark:border-[#FCD34D]" />
                </div>
              </motion.div>
            </div>

            {/* Dynamic Interactive Body (Welcome vs Form vs Recognized Greeting) */}
            <AnimatePresence mode="wait">
              {viewState === 'welcome' && (
                /* STATE 1: First Visit Welcome -> Click opens Form */
                <motion.div
                  key="stateWelcome"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-4 max-w-md w-full"
                >
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1A2235] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#EA580C] dark:text-amber-400 border border-slate-200 dark:border-amber-900/50 shadow-xs">
                    <Sparkles className="h-3 w-3 text-[#FF7643]" />
                    <span>Ruang Belajar & Repositori Modul</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#E2E8F0] tracking-tight leading-tight">
                    Pelatihan Fungsional{" "}
                    <span className="text-[#FF7643]">Pranata Komputer</span> Batch 3
                  </h1>

                  <p className="text-xs sm:text-sm text-[#6B7C93] dark:text-[#8FA3BC] font-medium leading-relaxed max-w-sm">
                    Kejaksaan RI X Agrasena (Prakom 625) • 4 Tahap Pembelajaran (MOOC, TMO, Lab Prakom Satker, dan Seminar Klasikal).
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setViewState('form')}
                    className="group relative flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-[#E2E8F0] hover:bg-[#27272A] dark:hover:bg-white px-7 py-3 text-xs sm:text-sm font-black text-white dark:text-[#18181B] shadow-lg shadow-black/20 cursor-pointer transition-colors duration-200 mt-2"
                  >
                    <span>Masuk ke Portal Kelas</span>
                    <ArrowRight className="h-4 w-4 text-[#FFD280] dark:text-[#EA580C] group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </motion.div>
              )}

              {viewState === 'form' && (
                /* STATE 2: Form Input Nama, NIP & Satker right on this page */
                <motion.div
                  key="stateForm"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-md rounded-[18px] bg-white dark:bg-[#141b27] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-xl space-y-4 text-left"
                >
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#007aff]/10 dark:bg-[#007aff]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#007aff] dark:text-[#60a5fa]">
                      <Sparkles className="h-3 w-3" />
                      <span>Kenalan Singkat Dulu 👋</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white">
                      Identitas Peserta Diklat
                    </h3>
                    <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8]">
                      Data disimpan privat di browser untuk personalisasi draf AI Makalah & DUPAK.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[#000000] dark:text-white">
                        Nama Lengkap & Gelar <span className="text-[#007aff]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 h-3.5 w-3.5 text-[#615d59] dark:text-[#94a3b8]" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Dewa Sinar Surya, S.Kom."
                          required
                          autoFocus
                          className="w-full rounded-[9px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 pl-8.5 pr-3 py-2 text-xs text-[#000000] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[#000000] dark:text-white">
                        NIP (Nomor Induk Pegawai)
                      </label>
                      <div className="relative flex items-center">
                        <CreditCard className="absolute left-3 h-3.5 w-3.5 text-[#615d59] dark:text-[#94a3b8]" />
                        <input
                          type="text"
                          value={nip}
                          onChange={(e) => setNip(e.target.value)}
                          placeholder="Contoh: 199801012022031001"
                          maxLength={18}
                          className="w-full rounded-[9px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 pl-8.5 pr-3 py-2 text-xs text-[#000000] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] font-mono transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[#000000] dark:text-white">
                        Satuan Kerja (Satker) <span className="text-[#007aff]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Building2 className="absolute left-3 h-3.5 w-3.5 text-[#615d59] dark:text-[#94a3b8]" />
                        <input
                          type="text"
                          value={satker}
                          onChange={(e) => setSatker(e.target.value)}
                          placeholder="Contoh: Kejaksaan Negeri Soppeng"
                          required
                          className="w-full rounded-[9px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 pl-8.5 pr-3 py-2 text-xs text-[#000000] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] transition"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleEnterPortal}
                        className="text-[11px] font-medium text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white px-2 py-1.5 transition cursor-pointer"
                      >
                        Lewati
                      </button>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-5 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
                      >
                        <span>Simpan & Masuk</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {viewState === 'recognized' && (
                /* STATE 3: Sudah Pernah Isi -> Langsung Tampilkan Sapaan Hangat di Halaman Pembuka Ini! */
                <motion.div
                  key="stateRecognized"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3.5 max-w-md w-full"
                >
                  {/* Badge Sapaan Jam */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1A2235] px-3.5 py-1 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10 shadow-xs">
                    <span>{timeInfo.icon}</span>
                    <span>{timeInfo.greeting}, Sobat Prakom!</span>
                  </div>

                  {/* Big Dynamic Heading */}
                  <h1 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#E2E8F0] tracking-tight leading-tight">
                    {timeInfo.greeting}, Rekan{" "}
                    <span className="text-[#007aff] dark:text-[#60a5fa]">{name || "Peserta Diklat"}</span>!
                  </h1>

                  {/* Sub-sapaan Satker */}
                  <p className="text-xs sm:text-sm text-[#6B7C93] dark:text-[#8FA3BC] font-medium leading-relaxed max-w-sm">
                    Selamat datang dari <strong className="text-[#18181B] dark:text-white">{satker || "Satker Kejaksaan RI"}</strong> di <strong className="text-[#007aff] dark:text-[#60a5fa]">Portal Kelas</strong> Diklat Fungsional Pranata Komputer Keahlian Batch 3.
                  </p>

                  {/* Identity Tag & Edit Option */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] px-3 py-1 text-[11px] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10">
                    <span className="truncate max-w-[220px] font-semibold text-[#000000] dark:text-white">
                      👤 {name} • {satker}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewState('form')}
                      title="Ubah Profil Identitas"
                      className="text-[#007aff] dark:text-[#60a5fa] hover:underline font-bold text-[10px] inline-flex items-center gap-0.5 cursor-pointer ml-1"
                    >
                      <Edit3 className="h-2.5 w-2.5" />
                      <span>Ubah</span>
                    </button>
                  </div>

                  {/* Enter Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEnterPortal}
                    className="group relative flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-[#E2E8F0] hover:bg-[#27272A] dark:hover:bg-white px-7 py-3 text-xs sm:text-sm font-black text-white dark:text-[#18181B] shadow-lg shadow-black/20 cursor-pointer transition-colors duration-200 mt-2"
                  >
                    <span>Masuk ke Portal Kelas</span>
                    <ArrowRight className="h-4 w-4 text-[#FFD280] dark:text-[#EA580C] group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── Bottom Info ── */}
          <div className="relative z-10 text-center text-[10px] text-[#8C9BAE] dark:text-[#5C7089] font-semibold pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            {viewState === 'recognized'
              ? "Tekan Enter atau klik tombol di atas untuk masuk • Sesi tersimpan otomatis"
              : "Klik tombol di atas untuk melanjutkan • Sesi tersimpan otomatis"}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
