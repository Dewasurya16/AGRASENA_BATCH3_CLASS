"use client"

import React, { useEffect, useState, useRef } from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Cat,
  Sparkles,
} from "lucide-react"
import { MaintenanceConfig } from "@/lib/maintenance"

interface MaintenanceViewProps {
  config: MaintenanceConfig
  isPreview?: boolean
  isAdmin?: boolean
}

export function MaintenanceView({
  config,
  isPreview = false,
  isAdmin = false,
}: MaintenanceViewProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [termLines, setTermLines] = useState<string[]>([])
  const termScrollRef = useRef<HTMLDivElement>(null)

  // ══════════════════════════════════════════════════════════
  // CUTE CONSOLE / TERMINAL LOGS (Lightweight Interval)
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    const logs = [
      "🐾 [AGRASENA] Memulai pemeliharaan sistem kelas...",
      "🔌 [SISTEM] Sinkronisasi server batch 3 & modul...",
      "🐱 [MANDOR] Kucing teknisi periksa kabel... Aman!",
      "☕ [ADMIN] Menyeduh kopi agar coding makin fokus...",
      "⚡ [DATABASE] Mengoptimalkan kueri dan tabel...",
      "🛡️ [SECURITY] Verifikasi integritas data peserta...",
      "✨ [POLISH] Menambahkan fitur baru yang seru...",
      "📊 [STATUS] Progres perbaikan: [█████████░] 90%",
      "🚀 [SELESAI] Sebentar lagi selesai, terima kasih!",
    ]
    let current = 0
    const interval = setInterval(() => {
      if (current < logs.length) {
        setTermLines((prev) => [...prev, logs[current]])
        current++
        if (termScrollRef.current) {
          termScrollRef.current.scrollTop = termScrollRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
      }
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  // ══════════════════════════════════════════════════════════
  // ANIME.JS — Snappy One-Shot Entrance Animations (GPU-Optimized)
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    // 1. Hero illustration elastic bounce entry
    anime({
      targets: "#chibi-hero-box",
      scale: [0.75, 1],
      opacity: [0, 1],
      duration: 850,
      easing: "spring(1, 80, 8, 0)",
    })

    // 2. Speech bubble pop-in
    anime({
      targets: "#chibi-speech-bubble",
      scale: [0, 1],
      opacity: [0, 1],
      duration: 700,
      delay: 350,
      easing: "spring(1, 80, 8, 0)",
    })

    // 3. Right control deck entry
    anime({
      targets: ".deck-pop-item",
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(80, { start: 250 }),
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 4. Countdown boxes spring
    anime({
      targets: ".cd-pill",
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(60, { start: 450 }),
      easing: "spring(1, 80, 9, 0)",
    })
  }, [])

  // Interactive Squash and Stretch on Click
  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    anime({
      targets: e.currentTarget,
      translateY: [
        { value: -16, duration: 140, easing: "easeOutQuad" },
        { value: 3, duration: 110, easing: "easeInQuad" },
        { value: 0, duration: 160, easing: "easeOutBounce" },
      ],
      scaleX: [
        { value: 0.92, duration: 140 },
        { value: 1.1, duration: 110 },
        { value: 1, duration: 160 },
      ],
      scaleY: [
        { value: 1.12, duration: 140 },
        { value: 0.92, duration: 110 },
        { value: 1, duration: 160 },
      ],
    })
  }

  // ══════════════════════════════════════════════════════════
  // COUNTDOWN CALCULATOR
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!config.estimatedEnd) {
      setTimeLeft(null)
      return
    }
    const target = new Date(config.estimatedEnd).getTime()
    if (isNaN(target)) {
      setTimeLeft(null)
      return
    }

    const calculateTime = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isEnded: false,
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [config.estimatedEnd])

  const handleRefreshClick = () => {
    setIsRefreshing(true)
    anime({
      targets: "#cute-refresh-spin",
      rotate: [0, 720],
      duration: 750,
      easing: "easeInOutQuad",
    })
    setTimeout(() => {
      window.location.reload()
    }, 700)
  }

  const rawPhone = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    "Halo Admin Agrasena 625, saya ingin tanya status maintenance Web Kelas saat ini. Terima kasih! 🙏"
  )}`

  const formattedEta = config.estimatedEnd
    ? new Date(config.estimatedEnd).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Makassar",
      }) + " WITA"
    : "Segera Selesai"

  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #FFFDF8 0%, #FFF6EA 45%, #FEF3C7 100%)",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#0F172A",
        boxSizing: "border-box",
      }}
    >
      {/* ═══ LIGHTWEIGHT ACCELERATED BACKGROUND ═══ */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Soft dot pattern (Pure CSS, 0% CPU) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.12,
          }}
        />

        {/* Ambient subtle glow (Optimized) */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "5%",
            width: "30vw",
            height: "30vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-5%",
            right: "5%",
            width: "35vw",
            height: "35vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(253, 164, 175, 0.18) 0%, transparent 70%)",
          }}
        />

        {/* Floating Emoticons with Hardware CSS Keyframes */}
        {[
          { top: "12%", left: "7%", icon: "✨", delay: "0s" },
          { top: "25%", left: "46%", icon: "🐾", delay: "1.2s" },
          { top: "72%", left: "8%", icon: "🔧", delay: "0.6s" },
          { top: "82%", left: "44%", icon: "🐱", delay: "1.8s" },
          { top: "16%", left: "90%", icon: "⚡", delay: "0.3s" },
          { top: "75%", left: "89%", icon: "☕", delay: "1.5s" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="chibi-css-float"
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              fontSize: "1.2rem",
              animationDelay: item.delay,
              userSelect: "none",
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* ═══ TOP NAVBAR (Slim & Fixed) ═══ */}
      <header
        style={{
          position: "relative",
          zIndex: 30,
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Brand identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.2)",
              border: "2px solid #FDE68A",
              overflow: "hidden",
            }}
          >
            <Image
              src="/Logo.png"
              alt="Logo Agrasena"
              width={24}
              height={24}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.84rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.01em" }}>
                Agrasena 625
              </span>
              <span
                style={{
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  color: "#B45309",
                  background: "#FEF3C7",
                  padding: "1px 6px",
                  borderRadius: 12,
                  border: "1px solid #FCD34D",
                }}
              >
                Batch 3
              </span>
            </div>
            <span style={{ fontSize: "0.55rem", color: "#64748B", fontWeight: 600 }}>
              Diklat Fungsional Pranata Komputer
            </span>
          </div>
        </div>

        {/* Badges / Admin Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {isAdmin && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255, 255, 255, 0.92)",
                padding: "3px 9px",
                borderRadius: 12,
                border: "1px solid #FCD34D",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ShieldCheck size={13} color="#D97706" />
                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#92400E" }}>
                  Admin
                </span>
              </div>
              <span style={{ color: "#CBD5E1", fontSize: "0.7rem" }}>|</span>
              <a
                href="/?bypass=1"
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "#B45309",
                  textDecoration: "none",
                  padding: "2px 5px",
                  borderRadius: 6,
                  background: "#FEF3C7",
                }}
              >
                Bypass ↗
              </a>
              <Link
                href="/admin/dashboard"
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  color: "#fff",
                  textDecoration: "none",
                  padding: "2px 7px",
                  borderRadius: 6,
                  background: "#D97706",
                }}
              >
                Dashboard
              </Link>
            </div>
          )}

          {isPreview && !isAdmin && (
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 800,
                color: "#64748B",
                background: "#fff",
                padding: "3px 9px",
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>👁️</span> Pratinjau
            </div>
          )}
        </div>
      </header>

      {/* ═══ MAIN STAGE (1 Screen Fixed Layout, Zero Scroll) ═══ */}
      <main
        style={{
          position: "relative",
          zIndex: 20,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(10px, 2vw, 24px)",
          minHeight: 0,
        }}
      >
        <div
          id="main-stage-card"
          style={{
            width: "100%",
            maxWidth: 1060,
            maxHeight: "calc(100dvh - 84px)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(12px, 2vw, 28px)",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 26,
            padding: "clamp(12px, 2vh, 22px) clamp(14px, 2.5vw, 28px)",
            boxShadow: "0 18px 45px -10px rgba(245, 158, 11, 0.16), 0 0 0 2px rgba(253, 230, 138, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            overflow: "hidden",
          }}
        >
          {/* ───────────────────────────────────────────────────────────
              LEFT COLUMN: ANIME CHIBI ILLUSTRATION + SPEECH BUBBLE
             ─────────────────────────────────────────────────────────── */}
          <div
            id="chibi-hero-box"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Cute Speech Bubble above characters */}
            <div
              id="chibi-speech-bubble"
              style={{
                position: "relative",
                background: "#FFFBEB",
                border: "2px solid #FCD34D",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.14)",
                borderRadius: "16px",
                padding: "6px 12px",
                maxWidth: 310,
                textAlign: "center",
                marginBottom: 4,
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: "0.95rem" }}>🐱💬</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#92400E", lineHeight: 1.3 }}>
                  "Lagi diservis dulu ya! Jangan panik, data kelas aman kok!"
                </span>
              </div>
              {/* Bubble Triangle Tail */}
              <div
                style={{
                  position: "absolute",
                  bottom: -7,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid #FCD34D",
                }}
              />
            </div>

            {/* Glowing Backdrop Aura */}
            <div
              id="chibi-glow-aura"
              style={{
                position: "absolute",
                width: "clamp(200px, 25vw, 320px)",
                height: "clamp(200px, 25vw, 320px)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(254, 243, 199, 0.85) 0%, rgba(254, 215, 170, 0.35) 60%, transparent 80%)",
                zIndex: 1,
              }}
            />

            {/* Chibi Anime Hero Image with click bounce & CSS float */}
            <div
              id="chibi-hero-img-wrap"
              className="chibi-hero-gentle-float"
              onClick={handleHeroClick}
              title="Klik karakter untuk animasi pantul! 🐾"
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: 400,
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src="/Maintenance.webp"
                alt="Tim Agrasena 625 sedang perbaikan sistem"
                width={440}
                height={308}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "clamp(160px, 33vh, 290px)",
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 20px rgba(245, 158, 11, 0.18))",
                }}
              />
            </div>

            {/* Floating Decorative Badges */}
            <div
              className="chibi-badge-wobble"
              id="badge-cat-mandor"
              style={{
                position: "absolute",
                bottom: "6%",
                left: "2%",
                background: "#fff",
                border: "2px solid #FBBF24",
                borderRadius: 12,
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                boxShadow: "0 3px 10px rgba(26, 35, 64, 0.08)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.8rem" }}>🐾</span>
              <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "#92400E" }}>
                Mandor Kucing Aktif
              </span>
            </div>

            <div
              className="chibi-badge-wobble"
              id="badge-system-opt"
              style={{
                position: "absolute",
                top: "14%",
                right: "4%",
                background: "#FEF2F2",
                border: "2px solid #FCA5A5",
                borderRadius: 12,
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                boxShadow: "0 3px 10px rgba(239, 68, 68, 0.1)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.8rem" }}>⚡</span>
              <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "#991B1B" }}>
                Optimasi Sistem 100%
              </span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              RIGHT COLUMN: STATUS, COUNTDOWN, CAT TERMINAL & CTAs
             ─────────────────────────────────────────────────────────── */}
          <div
            id="chibi-controls-deck"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(6px, 1.2vh, 12px)",
              width: "100%",
              minHeight: 0,
            }}
          >
            {/* 1. Header & Title */}
            <div className="deck-pop-item">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#FEF3C7",
                  border: "1.5px solid #FCD34D",
                  padding: "3px 9px",
                  borderRadius: 20,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#D97706",
                    boxShadow: "0 0 8px #F59E0B",
                    animation: "chibiPulse 1.2s infinite ease-in-out",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    color: "#92400E",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Sedang Pemeliharaan Sistem
                </span>
                <span style={{ fontSize: "0.62rem" }}>🛠️</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.1rem, 2.1vw, 1.75rem)",
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: "-0.025em",
                }}
              >
                {config.title || "Ups! Sedang Di-upgrade Nih ☕"}
              </h1>

              <p
                style={{
                  fontSize: "clamp(0.65rem, 1vw, 0.78rem)",
                  color: "#475569",
                  lineHeight: 1.4,
                  margin: "3px 0 0",
                  fontWeight: 500,
                }}
              >
                {config.message ||
                  "Tim Agrasena 625 sedang merapikan modul dan database agar makin lancar & seru. Sebentar ya!"}
              </p>
            </div>

            {/* 2. Gamified Countdown Bubble Timer */}
            <div
              className="deck-pop-item"
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "clamp(6px, 1.2vh, 10px) 14px",
                border: "2px solid #FDE68A",
                boxShadow: "0 3px 12px rgba(245, 158, 11, 0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} color="#D97706" />
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      color: "#92400E",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Hitung Mundur Selesai
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.54rem",
                    fontWeight: 700,
                    color: "#64748B",
                    background: "#F1F5F9",
                    padding: "2px 7px",
                    borderRadius: 8,
                  }}
                >
                  ETA: {formattedEta}
                </span>
              </div>

              {timeLeft && !timeLeft.isEnded ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 6,
                  }}
                >
                  {[
                    { label: "Hari", val: timeLeft.days, bg: "#FFFBEB", border: "#FDE68A", text: "#B45309" },
                    { label: "Jam", val: timeLeft.hours, bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C" },
                    { label: "Menit", val: timeLeft.minutes, bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D" },
                    { label: "Detik", val: timeLeft.seconds, bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C" },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="cd-pill"
                      style={{
                        background: unit.bg,
                        border: `1.5px solid ${unit.border}`,
                        borderRadius: 12,
                        padding: "5px 2px 3px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "clamp(1rem, 2vw, 1.45rem)",
                          fontWeight: 900,
                          color: unit.text,
                          lineHeight: 1,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {String(unit.val).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          fontSize: "0.48rem",
                          fontWeight: 800,
                          color: "#64748B",
                          textTransform: "uppercase",
                          marginTop: 2,
                        }}
                      >
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : timeLeft?.isEnded ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    background: "#ECFDF5",
                    border: "1.5px solid #A7F3D0",
                    borderRadius: 10,
                  }}
                >
                  <CheckCircle2 size={16} color="#10B981" />
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#065F46" }}>
                    Maintenance dijadwalkan sudah selesai! Silakan klik Segarkan di bawah. 🎉
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#92400E",
                  }}
                >
                  ✨ Segera selesai dalam beberapa saat!
                </div>
              )}
            </div>

            {/* 3. Cute Live Terminal Log Widget */}
            <div
              className="deck-pop-item"
              id="cute-terminal-widget"
              style={{
                background: "#0F172A",
                borderRadius: 16,
                border: "2px solid #334155",
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(15, 23, 42, 0.2)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "clamp(75px, 12vh, 105px)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  background: "#1E293B",
                  padding: "3px 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #334155",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
                  <span
                    style={{
                      fontSize: "0.52rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginLeft: 4,
                      fontFamily: "monospace",
                    }}
                  >
                    cat-prompt@agrasena-625:~
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Cat size={11} color="#FCD34D" />
                  <span style={{ fontSize: "0.5rem", color: "#FCD34D", fontWeight: 700 }}>
                    Live Log
                  </span>
                </div>
              </div>

              {/* Terminal Content Auto-scroll */}
              <div
                ref={termScrollRef}
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  overflowY: "auto",
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  fontSize: "clamp(0.5rem, 0.8vw, 0.58rem)",
                  lineHeight: 1.4,
                  color: "#E2E8F0",
                }}
              >
                {termLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      color: line.includes("MANDOR")
                        ? "#FCD34D"
                        : line.includes("SISTEM")
                        ? "#38BDF8"
                        : line.includes("STATUS")
                        ? "#A78BFA"
                        : line.includes("SELESAI")
                        ? "#4ADE80"
                        : "#CBD5E1",
                    }}
                  >
                    {line}
                  </div>
                ))}
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 10,
                    background: "#F59E0B",
                    verticalAlign: "middle",
                    marginLeft: 2,
                    animation: "cuteBlink 0.8s step-end infinite",
                  }}
                />
              </div>
            </div>

            {/* 4. Action Buttons (WhatsApp + Refresh) */}
            <div
              className="deck-pop-item"
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: 8,
                alignItems: "center",
              }}
            >
              {/* WhatsApp Button */}
              <a
                id="btn-whatsapp-cute"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "clamp(8px, 1.2vh, 11px) 12px",
                  background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: "clamp(0.68rem, 0.95vw, 0.78rem)",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 3px 12px rgba(34, 197, 94, 0.3)",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <MessageCircle size={15} />
                <span>Chat Admin Agrasena</span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    borderRadius: "50%",
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.58rem",
                  }}
                >
                  ↗
                </span>
              </a>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "clamp(8px, 1.2vh, 11px) 12px",
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1.5px solid #E2E8F0",
                  color: "#0F172A",
                  fontSize: "clamp(0.68rem, 0.95vw, 0.78rem)",
                  fontWeight: 800,
                  cursor: isRefreshing ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <RefreshCw
                  id="cute-refresh-spin"
                  size={14}
                  color={isRefreshing ? "#D97706" : "#64748B"}
                />
                <span>{isRefreshing ? "Memeriksa..." : "Segarkan"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ COMPACT CUTE FOOTER (Fixed) ═══ */}
      <footer
        style={{
          position: "relative",
          zIndex: 30,
          textAlign: "center",
          padding: "4px 16px 6px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(6px)",
            padding: "2px 10px",
            borderRadius: 10,
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <span style={{ fontSize: "0.52rem", fontWeight: 700, color: "#64748B" }}>
            © 2025 Agrasena 625 • Diklat Fungsional Pranata Komputer Kejaksaan RI
          </span>
          <span style={{ fontSize: "0.58rem" }}>💛</span>
        </div>
      </footer>

      {/* ═══ HARDWARE ACCELERATED CSS ANIMATIONS (0% CPU Idle) ═══ */}
      <style>{`
        @keyframes cuteBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes chibiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.25); }
        }
        @keyframes chibiFloatSlow {
          0% { transform: translate3d(0, 0px, 0); }
          50% { transform: translate3d(0, -6px, 0); }
          100% { transform: translate3d(0, 0px, 0); }
        }
        @keyframes chibiWobble {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -3px, 0) rotate(2.5deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
        @keyframes chibiDrift {
          0% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0.3; }
          50% { transform: translate3d(0, -10px, 0) scale(1.1); opacity: 0.8; }
          100% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0.3; }
        }

        .chibi-hero-gentle-float {
          animation: chibiFloatSlow 3.2s ease-in-out infinite;
          will-change: transform;
        }
        .chibi-badge-wobble {
          animation: chibiWobble 2.6s ease-in-out infinite;
          will-change: transform;
        }
        .chibi-css-float {
          animation: chibiDrift 3.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @media (max-width: 768px) {
          #main-stage-card {
            grid-template-columns: 1fr !important;
            max-height: calc(100dvh - 65px) !important;
            padding: 8px 12px !important;
            gap: 6px !important;
            overflow: hidden !important;
          }
          #chibi-hero-box {
            height: auto !important;
            max-height: 120px !important;
          }
          #chibi-hero-img-wrap img {
            max-height: 95px !important;
          }
          #chibi-speech-bubble {
            display: none !important;
          }
          #chibi-glow-aura {
            display: none !important;
          }
          #badge-cat-mandor, #badge-system-opt {
            display: none !important;
          }
          #cute-terminal-widget {
            max-height: 55px !important;
          }
        }
        @media (min-width: 769px) and (max-height: 620px) {
          #main-stage-card {
            padding: 8px 16px !important;
            gap: 10px !important;
          }
          #chibi-speech-bubble {
            display: none !important;
          }
          .chibi-badge-wobble {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
