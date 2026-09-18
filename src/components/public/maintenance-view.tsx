"use client"

import React, { useEffect, useRef, useState } from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import {
  Wrench,
  Clock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Lock,
  Sparkles,
  AlertTriangle,
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
    // A. Initial entrance animation for text and content cards
    anime({
      targets: ".anime-enter",
      translateY: [35, 0],
      opacity: [0, 1],
      duration: 900,
      delay: anime.stagger(80, { start: 150 }),
      easing: "easeOutCubic",
    })

    // B. Continuous rotation for the Primary Mechanical Gear
    const gearMainAnim = anime({
      targets: "#gear-primary",
      rotate: 360,
      duration: 16000,
      loop: true,
      easing: "linear",
    })

    // C. Continuous counter-rotation for the Secondary Interlocking Gear
    const gearSubAnim = anime({
      targets: "#gear-secondary",
      rotate: -360,
      duration: 10000,
      loop: true,
      easing: "linear",
    })

    // D. Pulsing core glow in the gear center
    const corePulse = anime({
      targets: "#gear-core-glow",
      scale: [0.92, 1.12],
      opacity: [0.6, 1],
      duration: 2000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // E. Floating ambient particles in background
    const particlesAnim = anime({
      targets: ".dust-particle",
      translateY: () => anime.random(-25, 25),
      translateX: () => anime.random(-20, 20),
      opacity: [0.15, 0.85],
      scale: [0.8, 1.3],
      duration: () => anime.random(2500, 4500),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(150),
      easing: "easeInOutQuad",
    })

    // F. Energy circuit beam scan animation
    const beamAnim = anime({
      targets: "#circuit-beam",
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 2400,
      loop: true,
      easing: "easeInOutSine",
    })

    return () => {
      gearMainAnim.pause()
      gearSubAnim.pause()
      corePulse.pause()
      particlesAnim.pause()
      beamAnim.pause()
    }
  }, [])

  // 2. REALTIME COUNTDOWN TIMER
  useEffect(() => {
    if (!config.estimatedEnd) {
      setTimeLeft(null)
      return
    }

    const targetTime = new Date(config.estimatedEnd).getTime()

    const calculateTime = () => {
      const now = Date.now()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [config.estimatedEnd])

  const handleRefresh = () => {
    setIsRefreshing(true)
    anime({
      targets: "#refresh-icon",
      rotate: "+=720",
      duration: 900,
      easing: "easeInOutCubic",
      complete: () => {
        window.location.reload()
      },
    })
  }

  // Generate 18 background particle coordinates
  const particles = React.useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${(i * 19) % 95}%`,
      left: `${(i * 23 + 7) % 95}%`,
      size: `${(i % 3) * 2 + 3}px`,
      color: i % 2 === 0 ? "bg-emerald-400" : "bg-teal-300",
    }))
  }, [])

  // Clean WhatsApp phone number for wa.me link
  const rawContact = config.emergencyContact || "6281234567890"
  const cleanPhone = rawContact.replace(/\D/g, "").replace(/^0/, "62")
  const waText = encodeURIComponent(
    `Halo Admin Diklat Prakom Kejaksaan RI, saya peserta diklat ingin menanyakan perihal pemeliharaan portal Web Kelas.`
  )
  const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#070B12] text-slate-100 select-none"
    >
      {/* Dynamic Background Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-700/10 blur-[120px]" />

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Anime.js Interactive Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className={`dust-particle absolute rounded-full ${p.color} blur-[0.5px] pointer-events-none`}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      {/* Top Header Bar: Logo Kejaksaan RI & Status Badge */}
      <header className="anime-enter relative z-10 w-full max-w-5xl flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full p-1 bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Image
              src="/icon.png"
              alt="Logo Kejaksaan RI"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white">
                Kejaksaan Republik Indonesia
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider">
                Agrasena
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Badan Pendidikan dan Pelatihan • Diklat Fungsional Prakom
            </p>
          </div>
        </div>

        {/* Status Mode Badge */}
        <div className="flex items-center gap-2">
          {isPreview && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span>Mode Pratinjau Admin</span>
            </span>
          )}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/70 border border-emerald-500/30 px-3.5 py-1.5 shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-[11px] font-bold text-amber-300">
              Pemeliharaan Aktif
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero Card Container */}
      <main className="relative z-10 w-full max-w-2xl my-auto py-8 sm:py-12 flex flex-col items-center text-center">
        {/* Admin Session Control Alert */}
        {isAdmin && (
          <div className="anime-enter w-full max-w-xl mb-6 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-300">
                  Sesi Administrator Terdeteksi Aktif
                </p>
                <p className="text-[11px] text-slate-300">
                  Pengunjung umum melihat layar ini. Anda dapat menguji portal via bypass atau kembali ke dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/?bypass=1"
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-500/40 transition cursor-pointer"
              >
                Buka Portal (Bypass)
              </a>
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-sm transition cursor-pointer"
              >
                Dashboard Admin
              </Link>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* Anime.js Mechanical Gears & Circuit SVG Illustration                  */}
        {/* ===================================================================== */}
        <div className="anime-enter relative w-48 h-48 sm:w-56 sm:h-56 mb-6 flex items-center justify-center">
          {/* Background Ambient Radial Glow */}
          <div
            id="gear-core-glow"
            className="absolute w-36 h-36 rounded-full bg-emerald-500/25 blur-2xl pointer-events-none"
          />

          {/* SVG Canvas for Double Gear & Tech Circuit */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]"
          >
            <defs>
              <linearGradient id="gearGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="gearGradSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Orbit Circle Track */}
            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="#064e3b"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.6"
            />

            {/* Animated Circuit Path */}
            <path
              id="circuit-beam"
              d="M 20,100 A 80,80 0 1,1 180,100 A 80,80 0 1,1 20,100"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="30 180"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Primary Main Gear (Clockwise Anime.js) */}
            <g id="gear-primary" transform-origin="100 100">
              {/* 12 Gear Teeth */}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x="93"
                  y="28"
                  width="14"
                  height="16"
                  rx="3"
                  fill="url(#gearGradPrimary)"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
              {/* Outer Gear Ring */}
              <circle
                cx="100"
                cy="100"
                r="64"
                fill="url(#gearGradPrimary)"
                stroke="#064e3b"
                strokeWidth="2"
              />
              {/* Hollow Inner Cutout */}
              <circle cx="100" cy="100" r="44" fill="#070B12" />
              {/* Inner Rim */}
              <circle
                cx="100"
                cy="100"
                r="44"
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                opacity="0.7"
              />
            </g>

            {/* Secondary Inner Interlocking Gear (Counter-Clockwise Anime.js) */}
            <g id="gear-secondary" transform-origin="100 100">
              {/* 8 Inner Teeth */}
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={i}
                  x="94"
                  y="62"
                  width="12"
                  height="12"
                  rx="2"
                  fill="url(#gearGradSecondary)"
                  transform={`rotate(${i * 45} 100 100)`}
                />
              ))}
              {/* Secondary Center Ring */}
              <circle
                cx="100"
                cy="100"
                r="30"
                fill="#0e1726"
                stroke="#2dd4bf"
                strokeWidth="2"
              />
            </g>

            {/* Center Wrench / Tech Core */}
            <circle cx="100" cy="100" r="20" fill="url(#hubGlow)" />
            <circle cx="100" cy="100" r="14" fill="#10b981" />
            <circle cx="100" cy="100" r="7" fill="#ffffff" />
          </svg>

          {/* Floating Tool Badge Overlay */}
          <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-3 p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-300/40">
            <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Heading & Notification Title */}
        <div className="anime-enter space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Optimalisasi & Sinkronisasi Sistem Berjalan</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {config.title || "Portal Sedang Dalam Pemeliharaan"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            {config.message ||
              "Mohon maaf atas ketidaknyamanannya. Portal Web Kelas Agrasena Diklat Fungsional Prakom Kejaksaan RI sedang menjalani pemeliharaan infrastruktur rutin. Layanan akan segera kembali aktif."}
          </p>
        </div>

        {/* ===================================================================== */}
        {/* Realtime Countdown Timer Card                                         */}
        {/* ===================================================================== */}
        {timeLeft && !timeLeft.isEnded ? (
          <div className="anime-enter mt-8 w-full max-w-lg p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-xl shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Perkiraan Selesai Pemeliharaan:</span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold text-[11px]">
                {new Date(config.estimatedEnd!).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Hari
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Jam
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Menit
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Detik
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="anime-enter mt-8 w-full max-w-lg p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/25 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Tahap Akhir Pengujian Sistem
                </p>
                <p className="text-[11px] text-slate-400">
                  Verifikasi integritas database dan kesiapan modul diklat sedang berlangsung.
                </p>
              </div>
            </div>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>
        )}

        {/* Action Buttons: WhatsApp Helpdesk & Refresh Status */}
        <div className="anime-enter mt-7 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {/* WhatsApp Admin Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Kontak Panitia Diklat</span>
          </a>

          {/* Refresh Page Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:scale-[0.98] text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              id="refresh-icon"
              className={`h-4 w-4 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>{isRefreshing ? "Memeriksa..." : "Periksa Status"}</span>
          </button>
        </div>

        {/* Safe Security Badge */}
        <div className="anime-enter mt-6 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Seluruh berkas tugas, nilai, dan data peserta tersimpan aman di database Kejaksaan RI.</span>
        </div>
      </main>

      {/* Footer & Discreet Administrator Access */}
      <footer className="anime-enter relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Tim Pengembang Diklat Prakom Kejaksaan RI. Seluruh hak cipta dilindungi.
        </div>

        {/* Discreet Admin Login Link for technicians and instructors */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600">v1.4.0 • Enterprise Edition</span>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 font-medium transition cursor-pointer"
            title="Pintu Masuk Khusus Administrator"
          >
            <Lock className="h-3 w-3" />
            <span>Akses Admin</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
