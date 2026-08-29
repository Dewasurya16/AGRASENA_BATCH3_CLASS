'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function IntroScreen() {
  const [mounted, setMounted] = React.useState(false)
  const [showIntro, setShowIntro] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
    try {
      const hasEntered = sessionStorage.getItem("has_entered_portal_session")
      if (!hasEntered) {
        setShowIntro(true)
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro && (e.key === "Enter" || e.key === " ")) {
        handleEnterPortal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showIntro, handleEnterPortal])

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
          className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col justify-between items-center select-none overflow-hidden bg-[#F8F9FC] dark:bg-[#10141C] text-[#18181B] dark:text-[#E2E8F0] transition-colors duration-300 transform-gpu will-change-transform"
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
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-5 my-auto px-4">

            {/* Visual: Planet 120 JP + Ring + Smiley */}
            <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center">

              {/* Saturn Ring */}
              <motion.div
                animate={{ rotateZ: [-2, 2, -2], y: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full border-[3px] border-[#334155] dark:border-[#475569] opacity-85 pointer-events-none"
                style={{ transform: "rotateX(72deg) rotateY(-18deg)" }}
              />

              {/* Sphere */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#818CF8] via-[#F472B6] to-[#FBBF24] shadow-xl shadow-pink-400/30 border-2 border-white/60 cursor-pointer"
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
                className="absolute -bottom-1 -left-1 sm:left-0 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#FFF2D1] dark:bg-[#2D2010] border-[2.5px] border-[#18181B] dark:border-[#D97706] shadow-lg shadow-black/10 cursor-pointer z-20"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex gap-1.5 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B] dark:bg-[#FCD34D]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B] dark:bg-[#FCD34D]" />
                  </div>
                  <div className="h-1.5 w-4 rounded-b-full border-b-[2px] border-[#18181B] dark:border-[#FCD34D]" />
                </div>
              </motion.div>
            </div>

            {/* Typography */}
            <div className="flex flex-col items-center gap-2.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1A2235] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#EA580C] dark:text-amber-400 border border-slate-200 dark:border-amber-900/50 shadow-xs">
                <Sparkles className="h-3 w-3 text-[#FF7643]" />
                <span>Ruang Belajar & Repositori Modul</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#E2E8F0] tracking-tight leading-tight">
                Pelatihan Fungsional{" "}
                <span className="text-[#FF7643]">Pranata Komputer</span> Batch 3
              </h1>

              <p className="text-[11px] sm:text-xs text-[#6B7C93] dark:text-[#8FA3BC] font-medium leading-relaxed max-w-xs">
                Kejaksaan RI X Agrasena (Prakom 625) • 4 Tahap Pembelajaran (MOOC, TMO, Lab Prakom Satker, dan Seminar Klasikal).
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnterPortal}
              className="group relative flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-[#E2E8F0] hover:bg-[#27272A] dark:hover:bg-white px-7 py-3 text-xs sm:text-sm font-black text-white dark:text-[#18181B] shadow-lg shadow-black/20 cursor-pointer transition-colors duration-200"
            >
              <span>Masuk ke Portal Kelas</span>
              <ArrowRight className="h-4 w-4 text-[#FFD280] dark:text-[#EA580C] group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </div>

          {/* ── Bottom Info ── */}
          <div className="relative z-10 text-center text-[10px] text-[#8C9BAE] dark:text-[#5C7089] font-semibold pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            Klik tombol di atas untuk masuk ke beranda • Sesi tersimpan otomatis
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
