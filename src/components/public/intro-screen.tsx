'use client'

import * as React from "react"
import { animate, createTimeline } from "animejs"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  User,
  Building2,
  CreditCard,
  Edit3,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Calendar,
  Shield,
  Rocket
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

function isProfileValid(pName: string, pSatker: string, pNip?: string): boolean {
  const trimmedName = (pName || "").trim()
  const trimmedSatker = (pSatker || "").trim()
  const trimmedNip = (pNip || "").trim()
  return (
    trimmedName.length >= 3 &&
    trimmedName.toLowerCase() !== "peserta diklat" &&
    trimmedSatker.length >= 3 &&
    trimmedNip.length >= 6
  )
}

export function IntroScreen() {
  const [mounted, setMounted] = React.useState(false)
  const [showIntro, setShowIntro] = React.useState(false)
  const [viewState, setViewState] = React.useState<'welcome' | 'form' | 'recognized'>('welcome')
  const [hasExistingProfile, setHasExistingProfile] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isExiting, setIsExiting] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  const [name, setName] = React.useState("")
  const [nip, setNip] = React.useState("")
  const [satker, setSatker] = React.useState("")
  const [timeInfo, setTimeInfo] = React.useState({ greeting: "Selamat Datang", period: "hari ini", icon: "👋" })

  // Anime.js Animation Element Refs
  const modalRef = React.useRef<HTMLDivElement>(null)
  const sphereRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLDivElement>(null)
  const smileyRef = React.useRef<HTMLDivElement>(null)
  const contentCardRef = React.useRef<HTMLDivElement>(null)
  const star1Ref = React.useRef<HTMLDivElement>(null)
  const star2Ref = React.useRef<HTMLDivElement>(null)
  const activeAnimationsRef = React.useRef<any[]>([])

  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem("prakom_user_name") || ""
      const savedNip = localStorage.getItem("prakom_user_nip") || ""
      const savedSatker = localStorage.getItem("prakom_user_satker") || ""

      const valid = isProfileValid(savedName, savedSatker, savedNip)
      const hasEntered = sessionStorage.getItem("has_entered_portal_session")

      if (savedName) setName(savedName)
      if (savedNip) setNip(savedNip)
      if (savedSatker) setSatker(savedSatker)
      setHasExistingProfile(valid)

      // Jika data diri lengkap dan sesi sudah dibuka, jangan tampilkan intro lagi
      if (valid && hasEntered) {
        setMounted(true)
        setShowIntro(false)
        return
      }

      // Jika data diri belum lengkap tapi sesi tersimpan dari sesi sebelumnya, batalkan bypass sesi
      if (!valid && hasEntered) {
        try {
          sessionStorage.removeItem("has_entered_portal_session")
        } catch {
          // Ignore
        }
      }

      setTimeInfo(getTimeGreeting())
      setMounted(true)
      setShowIntro(true)

      if (valid) {
        setViewState('recognized')
      } else {
        // Untuk pengunjung pertama kali, jangan langsung tampilkan form data diri: tampilkan welcome dulu
        setViewState('welcome')
      }
    } catch {
      setMounted(true)
      setShowIntro(true)
      setViewState('welcome')
    }
  }, [])

  // Cegah scrolling background ketika intro modal aktif
  React.useEffect(() => {
    if (showIntro) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [showIntro])

  // =========================================================================
  // ANIME.JS: ENTRANCE TIMELINE & CONTINUOUS ORGANIC FLOATING LOOPS
  // =========================================================================
  React.useEffect(() => {
    if (!showIntro) return

    // Hentikan animasi sebelumnya jika ada
    activeAnimationsRef.current.forEach(anim => {
      try { anim?.pause?.() } catch {}
    })
    activeAnimationsRef.current = []

    // 1. Entrance Timeline dengan Anime.js
    const tl = createTimeline({
      defaults: { ease: 'outCubic' }
    })

    if (modalRef.current) {
      tl.add(modalRef.current, {
        opacity: [0, 1],
        duration: 350,
        ease: 'outSine',
      }, 0)
    }

    if (sphereRef.current) {
      tl.add(sphereRef.current, {
        scale: [0.65, 1],
        opacity: [0, 1],
        duration: 650,
        ease: 'outBack(1.4)',
      }, 60)
    }

    if (ringRef.current) {
      tl.add(ringRef.current, {
        scale: [0.75, 1],
        opacity: [0, 0.85],
        duration: 700,
        ease: 'outCubic',
      }, 140)
    }

    if (smileyRef.current) {
      tl.add(smileyRef.current, {
        scale: [0, 1],
        rotate: [-20, 0],
        duration: 500,
        ease: 'outBack(1.8)',
      }, 240)
    }

    if (contentCardRef.current) {
      tl.add(contentCardRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 400,
        ease: 'outCubic',
      }, 180)
    }

    // 2. Loop Organik Floating Planet 120 JP
    const sphereFloat = sphereRef.current ? animate(sphereRef.current, {
      translateY: [-6, 6],
      duration: 2600,
      ease: 'inOutSine',
      alternate: true,
      loop: true,
    }) : null

    // 3. Loop Oscillating Cincin Saturnus
    const ringFloat = ringRef.current ? animate(ringRef.current, {
      translateY: [-3, 3],
      rotateZ: [-3, 3],
      duration: 3800,
      ease: 'inOutSine',
      alternate: true,
      loop: true,
    }) : null

    // 4. Loop Animasi Maskot Senyum
    const smileyFloat = smileyRef.current ? animate(smileyRef.current, {
      translateY: [3, -3],
      rotate: [-2, 2],
      duration: 3000,
      ease: 'inOutSine',
      alternate: true,
      loop: true,
    }) : null

    // 5. Bintang & Efek Twinkle
    const star1Anim = star1Ref.current ? animate(star1Ref.current, {
      scale: [0.85, 1.25],
      opacity: [0.4, 0.95],
      rotate: [0, 360],
      duration: 4500,
      ease: 'inOutSine',
      alternate: true,
      loop: true,
    }) : null

    const star2Anim = star2Ref.current ? animate(star2Ref.current, {
      scale: [1.15, 0.8],
      opacity: [0.35, 0.85],
      duration: 3400,
      ease: 'inOutSine',
      alternate: true,
      loop: true,
    }) : null

    activeAnimationsRef.current = [sphereFloat, ringFloat, smileyFloat, star1Anim, star2Anim].filter(Boolean)

    return () => {
      activeAnimationsRef.current.forEach(anim => {
        try { anim?.pause?.() } catch {}
      })
    }
  }, [showIntro])

  // Animasikan transisi pergantian viewState (welcome <-> form <-> recognized)
  const handleSwitchViewState = (targetState: 'welcome' | 'form' | 'recognized') => {
    if (contentCardRef.current) {
      animate(contentCardRef.current, {
        opacity: [1, 0],
        translateY: [0, -12],
        scale: [1, 0.97],
        duration: 180,
        ease: 'inQuad',
        onComplete: () => {
          setErrorMessage(null)
          setViewState(targetState)
          setTimeout(() => {
            if (contentCardRef.current) {
              animate(contentCardRef.current, {
                opacity: [0, 1],
                translateY: [16, 0],
                scale: [0.97, 1],
                duration: 260,
                ease: 'outCubic',
              })
            }
          }, 20)
        }
      })
    } else {
      setErrorMessage(null)
      setViewState(targetState)
    }
  }

  // =========================================================================
  // ANIME.JS: EXIT ANIMATION (BURST TRANSITION INTO PORTAL)
  // =========================================================================
  const handleEnterPortal = React.useCallback(() => {
    if (isExiting) return

    const currentName = (name || localStorage.getItem("prakom_user_name") || "").trim()
    const currentSatker = (satker || localStorage.getItem("prakom_user_satker") || "").trim()
    const currentNip = (nip || localStorage.getItem("prakom_user_nip") || "").trim()

    // Validasi ketat: Data diri harus lengkap untuk dapat masuk
    if (!isProfileValid(currentName, currentSatker, currentNip)) {
      setErrorMessage("Silakan lengkapi data diri Anda (Nama, NIP, Satuan Kerja) terlebih dahulu untuk membuka akses.")
      handleSwitchViewState('form')
      return
    }

    try {
      sessionStorage.setItem("has_entered_portal_session", "true")
    } catch {
      // Safe fallback
    }

    setIsExiting(true)

    // Hentikan loop animasi mengambang
    activeAnimationsRef.current.forEach(anim => {
      try { anim?.pause?.() } catch {}
    })

    // Timeline keluar yang dinamis menggunakan Anime.js
    const exitTl = createTimeline({
      defaults: { ease: 'inCubic' }
    })

    if (contentCardRef.current) {
      exitTl.add(contentCardRef.current, {
        translateY: [0, 16],
        opacity: [1, 0],
        duration: 180,
      }, 0)
    }

    if (sphereRef.current) {
      exitTl.add(sphereRef.current, {
        scale: [1, 1.2],
        translateY: [0, -40],
        opacity: [1, 0],
        duration: 280,
        ease: 'inBack(1.4)',
      }, 40)
    }

    if (modalRef.current) {
      exitTl.add(modalRef.current, {
        opacity: [1, 0],
        duration: 280,
        onComplete: () => {
          setShowIntro(false)
          setIsExiting(false)
          try {
            window.dispatchEvent(new CustomEvent("prakom-portal-entered"))
          } catch {}
        }
      }, 80)
    } else {
      setShowIntro(false)
      setIsExiting(false)
      try {
        window.dispatchEvent(new CustomEvent("prakom-portal-entered"))
      } catch {}
    }
  }, [name, satker, nip, isExiting])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    const finalName = name.trim()
    const finalNip = nip.trim()
    const finalSatker = satker.trim()

    if (!finalName) {
      setErrorMessage("Nama lengkap dan gelar wajib diisi.")
      return
    }
    if (finalName.toLowerCase() === "peserta diklat" || finalName.length < 3) {
      setErrorMessage("Mohon masukkan nama lengkap asli Anda (minimal 3 karakter).")
      return
    }
    if (!finalNip || finalNip.length < 6) {
      setErrorMessage("NIP wajib diisi dengan benar (minimal 6 karakter/digit).")
      return
    }
    if (!finalSatker || finalSatker.length < 3) {
      setErrorMessage("Satuan kerja wajib diisi (minimal 3 karakter).")
      return
    }

    setErrorMessage(null)

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
    setNip(finalNip)
    setSatker(finalSatker)
    setHasExistingProfile(true)
    handleSwitchViewState('recognized')
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

  if (!mounted || !showIntro) return null

  const isDark = theme === 'dark'

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] flex-col justify-between items-center select-none overflow-y-auto bg-[#F8F9FC] dark:bg-[#10141C] text-[#18181B] dark:text-[#E2E8F0] transition-colors duration-200 transform-gpu opacity-0"
    >
      {/* Zero-overhead ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full pointer-events-none opacity-50 dark:opacity-30"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(0, 122, 255, 0.25) 0%, rgba(175, 82, 222, 0.15) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, rgba(244, 114, 182, 0.1) 45%, transparent 70%)",
        }}
      />

      {/* Decorative stars dianimasikan dengan Anime.js */}
      <div
        ref={star1Ref}
        className="absolute top-6 right-10 sm:right-20 text-[#007aff]/40 dark:text-[#60a5fa]/40 text-2xl font-black select-none pointer-events-none"
      >
        ✦
      </div>
      <div
        ref={star2Ref}
        className="absolute bottom-8 left-8 sm:left-16 text-amber-400/50 dark:text-amber-300/40 text-xl font-black select-none pointer-events-none"
      >
        ✦
      </div>

      {/* ── Top Header Bar ── */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pt-[calc(1rem+env(safe-area-inset-top,0px))]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] overflow-hidden shadow-xs ring-1 ring-black/5 dark:ring-white/10">
            <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#18181B] dark:text-[#E2E8F0]">
              Pranata Komputer Keahlian
            </span>
            <span className="text-[10px] font-semibold text-[#6B7C93] dark:text-[#8FA3BC]">
              Kejaksaan RI × Agrasena (Prakom 625)
            </span>
          </div>
        </div>

        {/* Right: badge + theme toggle */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white dark:bg-[#1A2235] px-3 py-1 text-[10px] font-black text-[#007aff] dark:text-[#60a5fa] border border-slate-200 dark:border-slate-700 shadow-xs">
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
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4 sm:gap-5 my-auto px-4 py-4 w-full max-w-xl">

        {/* Visual: Planet 120 JP + Ring + Smiley (Dianimasikan oleh Anime.js) */}
        <div className={`relative flex items-center justify-center shrink-0 transition-all duration-300 ${viewState === 'form' ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-28 w-28 sm:h-36 sm:w-36'}`}>

          {/* Saturn Ring */}
          <div
            ref={ringRef}
            className={`absolute rounded-full border-[2.5px] border-[#007aff]/60 dark:border-[#60a5fa]/60 pointer-events-none transition-all duration-300 ${viewState === 'form' ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-28 w-28 sm:h-36 sm:w-36'}`}
            style={{ transform: "rotateX(72deg) rotateY(-18deg)" }}
          />

          {/* Sphere */}
          <div
            ref={sphereRef}
            onMouseEnter={() => {
              if (sphereRef.current) {
                animate(sphereRef.current, { scale: 1.08, duration: 250, ease: 'outBack(2)' })
              }
            }}
            onMouseLeave={() => {
              if (sphereRef.current) {
                animate(sphereRef.current, { scale: 1, duration: 250, ease: 'outBack' })
              }
            }}
            className={`relative flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#007aff] via-[#af52de] to-[#f59e0b] shadow-lg shadow-blue-500/25 border-2 border-white/80 dark:border-white/20 cursor-pointer transition-all duration-300 ${viewState === 'form' ? 'h-16 w-16 sm:h-18 sm:w-18' : 'h-20 w-20 sm:h-24 sm:w-24'}`}
          >
            <span className="text-white text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow-md">
              120 JP
            </span>
            <div className="absolute -top-2 -right-1 text-amber-300 text-base select-none">✦</div>
          </div>

          {/* Smiley Mascot with Interactive Anime.js Hover */}
          <div
            ref={smileyRef}
            onMouseEnter={() => {
              if (smileyRef.current) {
                animate(smileyRef.current, { scale: 1.2, rotate: 12, duration: 200, ease: 'outBack(2.5)' })
              }
            }}
            onMouseLeave={() => {
              if (smileyRef.current) {
                animate(smileyRef.current, { scale: 1, rotate: 0, duration: 250, ease: 'outBack' })
              }
            }}
            className={`absolute -bottom-1 -left-1 sm:left-0 flex items-center justify-center rounded-full bg-[#FFF2D1] dark:bg-[#2D2010] border-[2px] border-[#18181B] dark:border-[#D97706] shadow-md shadow-black/10 cursor-pointer z-20 transition-all duration-300 ${viewState === 'form' ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-10 w-10 sm:h-12 sm:w-12'}`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex gap-1 mb-0.5">
                <span className="h-1 w-1 rounded-full bg-[#18181B] dark:bg-[#FCD34D]" />
                <span className="h-1 w-1 rounded-full bg-[#18181B] dark:bg-[#FCD34D]" />
              </div>
              <div className="h-1 w-3 rounded-b-full border-b-[1.5px] border-[#18181B] dark:border-[#FCD34D]" />
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Body (Welcome vs Form vs Recognized Greeting) */}
        <div ref={contentCardRef} className="w-full max-w-md flex flex-col items-center">

          {/* 1. STATE WELCOME: Sambutan Awal Desain Cantik dengan Tombol Masuk Isi Data Diri */}
          {viewState === 'welcome' && (
            <div className="flex flex-col items-center gap-4 max-w-md w-full">
              {/* Badge Sapaan Jam */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1A2235] px-3.5 py-1 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10 shadow-xs">
                <span>{timeInfo.icon}</span>
                <span>{timeInfo.greeting}, Calon Prakom Andal!</span>
              </div>

              {/* Welcome Title */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#E2E8F0] tracking-tight leading-tight">
                  Selamat Datang di <br />
                  <span className="text-[#007aff] dark:text-[#60a5fa]">Portal Kelas Agrasena</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] font-normal leading-relaxed max-w-sm mx-auto">
                  Hub materi modul 120 JP resmi, rundown 35 hari, dan asisten generator AI makalah Diklat Fungsional Keahlian Kejaksaan RI.
                </p>
              </div>

              {/* 3 Mini Feature Highlight Tiles */}
              <div className="grid grid-cols-3 gap-2 w-full pt-1">
                <div className="rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:border-[#007aff]/50 transition-colors">
                  <BookOpen className="h-4 w-4 text-[#007aff] mb-1" />
                  <span className="font-bold text-[11px] text-[#18181B] dark:text-white">120 JP</span>
                  <span className="text-[9px] text-[#615d59] dark:text-[#94a3b8]">Modul Resmi</span>
                </div>
                <div className="rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:border-[#16a34a]/50 transition-colors">
                  <Calendar className="h-4 w-4 text-[#16a34a] dark:text-[#4ade80] mb-1" />
                  <span className="font-bold text-[11px] text-[#18181B] dark:text-white">35 Hari</span>
                  <span className="text-[9px] text-[#615d59] dark:text-[#94a3b8]">Roadmap Sesi</span>
                </div>
                <div className="rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:border-[#af52de]/50 transition-colors">
                  <Sparkles className="h-4 w-4 text-[#af52de] dark:text-[#c084fc] mb-1" />
                  <span className="font-bold text-[11px] text-[#18181B] dark:text-white">AI Makalah</span>
                  <span className="text-[9px] text-[#615d59] dark:text-[#94a3b8]">Generator Proposal</span>
                </div>
              </div>

              {/* Primary Action Button: Masuk & Isi Data Diri */}
              <div className="pt-2 w-full flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSwitchViewState('form')}
                  className="group relative flex items-center justify-center gap-2.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white w-full py-3.5 px-6 text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Masuk & Isi Data Diri</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  *) Wajib mengisi Nama Lengkap, NIP, & Satuan Kerja untuk membuka akses
                </span>
              </div>
            </div>
          )}

          {/* 2. STATE FORM: Pengisian Identitas Peserta Diklat */}
          {viewState === 'form' && (
            <div
              className="w-full rounded-[20px] bg-white dark:bg-[#141b27] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-2xl space-y-4 text-left"
            >
              {/* Header with Back Button */}
              <div className="flex items-center justify-between border-b border-[#e6e6e6] dark:border-white/10 pb-2.5">
                <button
                  type="button"
                  onClick={() => handleSwitchViewState(hasExistingProfile ? 'recognized' : 'welcome')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{hasExistingProfile ? "Batal" : "Kembali"}</span>
                </button>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007aff] dark:text-[#60a5fa] bg-[#007aff]/10 dark:bg-[#007aff]/20 px-2.5 py-0.5 rounded-full">
                  Form Identitas Peserta
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#18181B] dark:text-white">
                  {hasExistingProfile ? "Perbarui Identitas Peserta" : "Lengkapi Data Diri Peserta"}
                </h3>
                <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                  Data Anda disimpan lokal di browser ini untuk sertifikasi DUPAK, kuis, dan draf AI Makalah.
                </p>
              </div>

              {errorMessage && (
                <div
                  className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-2.5 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#18181B] dark:text-slate-200">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Contoh: Dewa Sinar Surya, S.Kom."
                      required
                      autoFocus
                      className="w-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 pl-9 pr-3 py-2 text-xs text-[#18181B] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#18181B] dark:text-slate-200">
                    NIP (Nomor Induk Pegawai) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <CreditCard className="absolute left-3 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => {
                        setNip(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Contoh: 199801012022031001"
                      required
                      maxLength={25}
                      className="w-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 pl-9 pr-3 py-2 text-xs text-[#18181B] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] font-mono transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#18181B] dark:text-slate-200">
                    Satuan Kerja (Satker) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-3 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
                    <input
                      type="text"
                      value={satker}
                      onChange={(e) => {
                        setSatker(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Contoh: Kejaksaan Agung / Kejaksaan Negeri Soppeng"
                      required
                      className="w-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 pl-9 pr-3 py-2 text-xs text-[#18181B] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white py-2.5 px-6 text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer w-full"
                  >
                    <span>{hasExistingProfile ? "Simpan Perubahan & Masuk" : "Simpan Data & Buka Akses Portal"}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. STATE RECOGNIZED: Pengguna yang Sudah Terdaftar (Sapaan Personal) */}
          {viewState === 'recognized' && (
            <div className="flex flex-col items-center gap-3.5 max-w-md w-full">
              {/* Badge Sapaan Jam */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1A2235] px-3.5 py-1 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10 shadow-xs">
                <span>{timeInfo.icon}</span>
                <span>{timeInfo.greeting}, Sobat Prakom!</span>
              </div>

              {/* Big Dynamic Heading */}
              <h1 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#E2E8F0] tracking-tight leading-tight">
                {timeInfo.greeting}, Rekan{" "}
                <span className="text-[#007aff] dark:text-[#60a5fa]">{name}</span>!
              </h1>

              {/* Sub-sapaan Satker */}
              <p className="text-xs sm:text-sm text-[#6B7C93] dark:text-[#8FA3BC] font-medium leading-relaxed max-w-sm">
                Selamat datang dari <strong className="text-[#18181B] dark:text-white">{satker}</strong> di <strong className="text-[#007aff] dark:text-[#60a5fa]">Portal Kelas</strong> Diklat Fungsional Pranata Komputer Keahlian Batch 3.
              </p>

              {/* Identity Tag & Edit Option */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] px-3.5 py-1.5 text-[11px] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10">
                <span className="truncate max-w-[220px] font-semibold text-[#000000] dark:text-white">
                  👤 {name} • {satker}
                </span>
                <button
                  type="button"
                  onClick={() => handleSwitchViewState('form')}
                  title="Ubah Profil Identitas"
                  className="text-[#007aff] dark:text-[#60a5fa] hover:underline font-bold text-[10px] inline-flex items-center gap-0.5 cursor-pointer ml-1"
                >
                  <Edit3 className="h-2.5 w-2.5" />
                  <span>Ubah</span>
                </button>
              </div>

              {/* Enter Button with Anime.js Powered Burst Transition */}
              <button
                type="button"
                onClick={handleEnterPortal}
                disabled={isExiting}
                className="group relative flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-[#E2E8F0] hover:bg-[#27272A] dark:hover:bg-white px-7 py-3 text-xs sm:text-sm font-black text-white dark:text-[#18181B] shadow-lg shadow-black/20 cursor-pointer transition-all duration-200 mt-2 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
              >
                <span>{isExiting ? "Membuka Portal..." : "Masuk ke Portal Kelas"}</span>
                <ArrowRight className="h-4 w-4 text-[#FFD280] dark:text-[#EA580C] group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ── Bottom Info ── */}
      <div className="relative z-10 text-center text-[10px] text-[#8C9BAE] dark:text-[#5C7089] font-semibold pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        {viewState === 'recognized'
          ? "Tekan Enter atau klik tombol di atas untuk masuk • Sesi tersimpan otomatis"
          : viewState === 'welcome'
          ? "Portal Resmi Diklat Fungsional Prakom Keahlian Batch 3 Kejaksaan RI Tahun 2026"
          : "Lengkapi data diri Anda untuk membuka akses penuh • Tidak dapat dilewati"}
      </div>

    </div>
  )
}
