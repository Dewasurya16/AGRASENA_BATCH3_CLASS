'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Shield, Award } from "lucide-react"

export function IntroScreen() {
  const [mounted, setMounted] = React.useState(false)
  const [showIntro, setShowIntro] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Check session storage so intro only displays once per browser session
    const hasEntered = sessionStorage.getItem("has_entered_portal_session")
    if (!hasEntered) {
      setShowIntro(true)
    }
  }, [])

  const handleEnterPortal = () => {
    sessionStorage.setItem("has_entered_portal_session", "true")
    setShowIntro(false)
  }

  // Keyboard shortcut: Press Enter or Space to enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro && (e.key === "Enter" || e.key === " ")) {
        handleEnterPortal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showIntro])

  if (!mounted || !showIntro) return null

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col justify-between items-center bg-[#F8F9FC] text-[#18181B] p-4 sm:p-6 md:p-8 select-none overflow-hidden"
        >
          {/* Ambient Pastel Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-tr from-[#D7F3FE]/60 via-[#FFE3EB]/60 to-[#FFF2D1]/60 blur-[100px] pointer-events-none transform-gpu" />
          
          {/* Subtle Star Doodles */}
          <div className="absolute top-6 right-10 sm:right-20 text-[#BFDBFE] text-2xl font-black select-none pointer-events-none animate-pulse">
            ✦
          </div>
          <div className="absolute bottom-8 left-8 sm:left-16 text-[#FED7AA] text-xl font-black select-none pointer-events-none">
            ✦
          </div>

          {/* 1. Top Header Bar (Compact) */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-xs">
                <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-wider uppercase text-[#18181B]">
                  Pranata Komputer Keahlian
                </span>
                <span className="text-[10px] font-bold text-[#6B7C93]">
                  Kejaksaan RI X Agrasena (Prakom 625)
                </span>
              </div>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#0D824B] border border-slate-200 shadow-xs">
              Batch 3 • 120 JP
            </span>
          </div>

          {/* 2. Center Content - Compact & 100% Fit in Viewport */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 my-auto">
            
            {/* Visual Container: Planet 120 JP + Ring + Sparkle + Yellow Smiley (Compact) */}
            <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center">
              
              {/* Saturn Ring with smooth 3D tilt */}
              <motion.div
                animate={{
                  rotateZ: [-2, 2, -2],
                  y: [-2, 2, -2],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full border-[3px] border-[#334155] opacity-85 pointer-events-none"
                style={{
                  transform: "rotateX(72deg) rotateY(-18deg)",
                }}
              />

              {/* Floating Pastel Mesh Gradient Sphere (120 JP) */}
              <motion.div
                animate={{
                  y: [-4, 4, -4],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#818CF8] via-[#F472B6] to-[#FBBF24] shadow-xl shadow-pink-400/30 border-2 border-white cursor-pointer"
              >
                <span className="text-white text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow-md">
                  120 JP
                </span>

                {/* Golden Sparkle Star */}
                <div className="absolute -top-2 -right-1 text-[#F59E0B] text-lg select-none animate-pulse">
                  ✦
                </div>
              </motion.div>

              {/* Cute Yellow Smiley Face Sticker */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [3, -3, 3],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-1 -left-1 sm:left-0 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#FFF2D1] border-[2.5px] border-[#18181B] shadow-lg shadow-black/10 cursor-pointer z-20"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex gap-1.5 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B]" />
                  </div>
                  <div className="h-1.5 w-4 rounded-b-full border-b-[2px] border-[#18181B]" />
                </div>
              </motion.div>

            </div>

            {/* Typography & Subtitles (Compact) */}
            <div className="space-y-1.5 max-w-md px-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#EA580C] border border-slate-200 shadow-xs">
                <Sparkles className="h-3 w-3 text-[#FF7643]" />
                <span>Ruang Belajar & Repositori Modul</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight leading-tight">
                Pelatihan Fungsional <br />
                <span className="text-[#FF7643]">Pranata Komputer</span> Batch 3
              </h1>

              <p className="text-[11px] sm:text-xs text-[#6B7C93] font-medium leading-relaxed">
                Kejaksaan RI X Agrasena (Prakom 625) • 4 Tahap Pembelajaran (MOOC, TMO, Lab Prakom Satker, dan Seminar Klasikal).
              </p>
            </div>

            {/* Main Interactive Button: Click to Enter (PERFECTLY VISIBLE & COMPACT) */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleEnterPortal}
                className="group relative flex items-center gap-2 rounded-full bg-[#18181B] hover:bg-[#27272A] px-7 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-black/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Masuk ke Portal Kelas</span>
                <ArrowRight className="h-4 w-4 text-[#FFD280] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

          </div>

          {/* 3. Bottom Info Note */}
          <div className="relative z-10 text-center text-[10px] text-[#8C9BAE] font-semibold">
            Klik tombol di atas untuk masuk ke beranda • Sesi tersimpan otomatis
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
