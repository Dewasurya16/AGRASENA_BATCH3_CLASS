"use client"

import React, { useEffect, useRef, useState } from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Code2,
  CheckSquare,
  Coffee,
  ExternalLink,
  Laptop,
} from "lucide-react"
import { MaintenanceConfig } from "@/lib/maintenance"

interface MaintenanceViewProps {
  config: MaintenanceConfig
  isPreview?: boolean
  isAdmin?: boolean
}

export function MaintenanceView({ config, isPreview = false, isAdmin = false }: MaintenanceViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 1. ANIME.JS ANIMATIONS SETUP
  useEffect(() => {
    // A. Initial entrance animation for all cards & typography
    anime({
      targets: ".anime-fade-in",
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100, { start: 100 }),
      easing: "easeOutCubic",
    })

    // B. Floating Code Bubble (Left anime character)
    anime({
      targets: "#anime-doodle-code",
      translateY: [-6, 6],
      rotate: [-3, 3],
      duration: 3200,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // C. Floating Checklist Clipboard (Right anime character)
    anime({
      targets: "#anime-doodle-task",
      translateY: [6, -6],
      rotate: [3, -3],
      duration: 3600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // D. Animated Coffee Steam Wisps
    anime({
      targets: ".coffee-steam-path",
      translateY: [-10, -2],
      opacity: [0.2, 0.9],
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1800,
      direction: "alternate",
      loop: true,
      delay: anime.stagger(250),
      easing: "easeInOutSine",
    })

    // E. Glowing Loading Progress Bar Shimmer
    anime({
      targets: "#anime-progress-shimmer",
      translateX: ["-100%", "200%"],
      duration: 2200,
      loop: true,
      easing: "easeInOutCubic",
    })

    // F. Twinkling Ambient Stars & Dust Particles
    anime({
      targets: ".anime-star-particle",
      opacity: () => [anime.random(0.1, 0.3), anime.random(0.7, 1)],
      scale: () => [anime.random(0.7, 0.9), anime.random(1.2, 1.6)],
      translateY: () => anime.random(-15, 15),
      translateX: () => anime.random(-10, 10),
      duration: () => anime.random(2500, 4500),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(120),
      easing: "easeInOutQuad",
    })

    // G. Soft Ambient Halo Glow Pulse
    anime({
      targets: "#anime-hero-aura",
      scale: [0.95, 1.06],
      opacity: [0.35, 0.65],
      duration: 4000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })
  }, [])

  // 2. REALTIME COUNTDOWN TIMER CALCULATION
  useEffect(() => {
    if (!config.estimatedEnd) {
      setTimeLeft(null)
      return
    }

    const targetTime = new Date(config.estimatedEnd).getTime()
    if (isNaN(targetTime)) {
      setTimeLeft(null)
      return
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
        })
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isEnded: false,
        })
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [config.estimatedEnd])

  // 3. HANDLE LIVE REFRESH
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      window.location.reload()
    }, 700)
  }

  // Format WhatsApp Link
  const waNumber = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Tim Panitia Diklat Prakom Kejaksaan RI, saya ingin menanyakan perihal status pemeliharaan sistem pada Web Kelas Agrasena.`
  )}`

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0B0F19] text-white flex flex-col items-center justify-between px-4 py-6 sm:py-10 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200"
    >
      {/* ========================================================================= */}
      {/* AMBIENT BACKGROUND COSMIC GLOW & FLOATING PARTICLES                       */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep Cosmic Radial Backdrops */}
        <div
          id="anime-hero-aura"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[400px] sm:h-[550px] bg-gradient-to-br from-indigo-900/30 via-purple-900/25 to-cyan-900/20 rounded-full blur-3xl"
        />

        {/* Floating Twinkling Stars (24 Particles) */}
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="anime-star-particle absolute rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              top: `${(i * 37) % 95}%`,
              left: `${(i * 43) % 96}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: BADIKLAT IDENTITY & OPTIONAL ADMIN BAR                       */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-4xl flex flex-col items-center gap-3">
        {/* Admin Session Control Pill */}
        {isAdmin && (
          <div className="anime-fade-in w-full mb-2 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-amber-500/25 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-300">
                  Sesi Administrator Aktif Terdeteksi
                </p>
                <p className="text-[11px] text-slate-300">
                  Pengunjung umum melihat layar Anime ini. Anda dapat menguji portal via bypass atau kembali ke dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/?bypass=1"
                className="px-3 py-1.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 text-xs font-bold border border-amber-500/40 transition cursor-pointer"
              >
                Buka Portal (Bypass)
              </a>
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-xs transition cursor-pointer"
              >
                Dashboard Admin
              </Link>
            </div>
          </div>
        )}

        {/* Preview Mode Badge */}
        {isPreview && !isAdmin && (
          <div className="anime-fade-in inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mode Pratinjau Administrator</span>
          </div>
        )}

        {/* Top Badiklat Badge */}
        <div className="anime-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-slate-900/80 border border-slate-700/70 text-slate-300 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>DIKLAT PRAKOM KEJAKSAAN RI • AGRASENA</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN HERO: ANIME CHIBI ILLUSTRATION & CENTER LOADING HUD (GAMBAR 2)       */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full max-w-4xl my-auto py-4 sm:py-8 flex flex-col items-center text-center">
        {/* Hero Artwork Wrapper */}
        <div className="relative w-full max-w-2xl flex flex-col items-center">
          {/* Floating Anime Doodle: Code Badge (Left side) */}
          <div
            id="anime-doodle-code"
            className="absolute top-6 left-4 sm:left-10 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 text-xs font-mono font-bold shadow-lg shadow-indigo-950/50 backdrop-blur-md"
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>&lt;/&gt; sys_update</span>
          </div>

          {/* Floating Anime Doodle: Task Checklist (Right side) */}
          <div
            id="anime-doodle-task"
            className="absolute top-6 right-4 sm:right-10 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold shadow-lg shadow-purple-950/50 backdrop-blur-md"
          >
            <CheckSquare className="h-3.5 w-3.5 text-purple-400" />
            <span>modul_sync: OK</span>
          </div>

          {/* The High-Resolution Anime Illustration (Gambar 2 Reference) */}
          <div className="relative w-full aspect-[1024/567] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-[#0B0F19]">
            <Image
              src="/maintenance-anime.png"
              alt="Aparat Diklat Pranata Komputer Kejaksaan RI sedang bertugas (Anime Chibi Style)"
              fill
              priority
              className="object-contain sm:object-cover transform hover:scale-[1.01] transition-transform duration-500"
            />

            {/* Subtle Vignette Gradient to blend with page backdrop */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60" />
          </div>

          {/* DYNAMIC CENTER LOADING HUD (MATCHING GAMBAR 2) */}
          <div className="anime-fade-in -mt-6 sm:-mt-8 z-20 flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl max-w-md w-full">
            {/* Steaming Coffee Icon with Anime.js animated steam paths */}
            <div className="flex flex-col items-center">
              <svg
                width="36"
                height="22"
                viewBox="0 0 36 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
              >
                <path
                  d="M10 18 Q12 10 10 4"
                  stroke="#A5B4FC"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="coffee-steam-path"
                />
                <path
                  d="M18 19 Q21 11 18 3"
                  stroke="#C084FC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="coffee-steam-path"
                />
                <path
                  d="M26 18 Q24 10 26 4"
                  stroke="#A5B4FC"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="coffee-steam-path"
                />
              </svg>

              <div className="mt-0.5 h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                <Coffee className="h-4 w-4" />
              </div>
            </div>

            {/* Loading Title */}
            <div className="space-y-0.5 text-center">
              <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-[0_0_12px_rgba(165,180,252,0.6)]">
                Loading...
              </h2>
              <p className="text-[11px] font-semibold text-slate-400">
                Please wait a moment • Sedang Pemeliharaan Sistem
              </p>
            </div>

            {/* Neon Glowing Shimmer Progress Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-800/90 border border-indigo-500/30 overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              {/* Progress Core */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 rounded-full" />
              {/* Animated Light Shimmer Beam */}
              <div
                id="anime-progress-shimmer"
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12"
              />
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INFORMATION CARD & LIVE DIGITAL COUNTDOWN TIMER                       */}
        {/* ===================================================================== */}
        <div className="anime-fade-in mt-8 w-full max-w-2xl rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-left">
          {/* Main Title & Message */}
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {config.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {config.message}
            </p>
          </div>

          {/* COUNTDOWN TIMER HUD (IF ESTIMATED END IS PROVIDED) */}
          {timeLeft && (
            <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Perkiraan Waktu Selesai:</span>
                </span>
                <span className="text-[11px] text-indigo-300 font-mono">
                  {timeLeft.isEnded ? "Waktu telah tiba" : "Menghitung mundur..."}
                </span>
              </div>

              {timeLeft.isEnded ? (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-bold text-center">
                  ✨ Estimasi waktu pemeliharaan telah selesai. Silakan klik tombol periksa status di bawah.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                  {/* Hari */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black text-indigo-300 font-mono">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Hari
                    </span>
                  </div>

                  {/* Jam */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black text-purple-300 font-mono">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Jam
                    </span>
                  </div>

                  {/* Menit */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black text-pink-300 font-mono">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Menit
                    </span>
                  </div>

                  {/* Detik */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black text-amber-300 font-mono">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Detik
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTION BUTTONS: WHATSAPP HELPDESK & REFRESH STATUS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi PIC Diklat (WhatsApp)</span>
              <ExternalLink className="h-3 w-3 text-emerald-200" />
            </a>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span>{isRefreshing ? "Memeriksa..." : "Periksa Status Ulang"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER: BADIKLAT OFFICIAL COPYRIGHT                                      */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full max-w-4xl text-center py-2 text-[11px] text-slate-500">
        <p>
          Badan Pendidikan dan Pelatihan Kejaksaan Republik Indonesia • Tim Pranata Komputer Agrasena
        </p>
      </footer>
    </div>
  )
}
