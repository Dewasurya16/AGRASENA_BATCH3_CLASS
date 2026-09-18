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
  Sparkles,
  Cat,
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
  // CUTE CONSOLE / TERMINAL LOGS
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    const logs = [
      "🐾 [SYSTEM] Inisialisasi maintenance Agrasena 625...",
      "🔌 [DEV] Menghubungkan ke server batch 3...",
      "🐱 [CAT] Kucing teknisi periksa kabel LAN... Aman!",
      "☕ [COFFEE] Admin menyeduh kopi kedua...",
      "⚡ [SYNC] Merapikan database & modul kelas...",
      "🛡️ [SECURITY] Mengunci akses & audit keamanan...",
      "✨ [POLISH] Menambah bumbu kelucuan & performa...",
      "📊 [STATUS] Progres sistem: [█████████░░] 85%",
      "🚀 [READY] Sedikit lagi selesai, stay tune ya!",
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
    }, 1100)
    return () => clearInterval(interval)
  }, [])

  // ══════════════════════════════════════════════════════════
  // ANIME.JS PLAYFUL ANIMATIONS
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    // 1. Hero Image Bounce-in
    anime({
      targets: "#cute-hero",
      scale: [0.75, 1],
      opacity: [0, 1],
      duration: 1000,
      easing: "spring(1, 70, 7, 0)",
    })

    // 2. Continuous gentle float of anime illustration
    anime({
      targets: "#cute-hero-inner",
      translateY: [-5, 5],
      duration: 3200,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 3. Speech Bubble Pop
    anime({
      targets: "#speech-bubble",
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800,
      delay: 450,
      easing: "spring(1, 80, 9, 0)",
    })

    // 4. Badges Wiggle
    anime({
      targets: ".cute-badge-float",
      translateY: [-4, 4],
      rotate: [-3, 3],
      duration: 2200,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      delay: anime.stagger(250),
    })

    // 5. Right Deck Content Fade-in
    anime({
      targets: ".deck-fade-item",
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(90, { start: 250 }),
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 6. Countdown numbers pop
    anime({
      targets: ".cd-box",
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(80, { start: 500 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // 7. Background Floating Sparkles
    anime({
      targets: ".bg-floating-sparkle",
      translateY: [-12, 12],
      translateX: [-8, 8],
      rotate: () => anime.random(-45, 45),
      scale: [0.8, 1.2],
      opacity: () => [anime.random(0.3, 0.6), anime.random(0.7, 1)],
      duration: () => anime.random(2500, 4500),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(150),
      easing: "easeInOutQuad",
    })

    // 8. Background Emoticon Drift
    anime({
      targets: ".bg-drift-emoji",
      translateY: [0, -30],
      opacity: [0, 0.22, 0],
      scale: [0.8, 1.2],
      duration: 4000,
      loop: true,
      delay: anime.stagger(400),
      easing: "easeOutSine",
    })

    // 9. Pulsing glow on WhatsApp button
    anime({
      targets: "#btn-whatsapp-cute",
      boxShadow: [
        "0 4px 14px rgba(34, 197, 94, 0.3)",
        "0 8px 24px rgba(34, 197, 94, 0.55)",
        "0 4px 14px rgba(34, 197, 94, 0.3)",
      ],
      duration: 2000,
      loop: true,
      easing: "easeInOutSine",
    })
  }, [])

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
      targets: "#cute-refresh-icon",
      rotate: [0, 720],
      duration: 800,
      easing: "easeInOutCubic",
    })
    setTimeout(() => {
      window.location.reload()
    }, 850)
  }

  const rawPhone = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    "Halo Admin Agrasena 625, saya ingin menanyakan informasi terkait status maintenance Web Kelas saat ini. Terima kasih! 🙏"
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
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #FFFDF7 0%, #FFF5E6 45%, #FEF3C7 100%)",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#1E293B",
      }}
    >
      {/* ═══ PLAYFUL BACKGROUND DECORATION ═══ */}
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
        {/* Soft anime polka dot grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.12,
          }}
        />

        {/* Ambient colored glowing orbs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "35vw",
            height: "35vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(253, 164, 175, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Floating Sparkles */}
        {[
          { top: "12%", left: "10%", size: 16, color: "#F59E0B" },
          { top: "25%", left: "48%", size: 14, color: "#EC4899" },
          { top: "68%", left: "8%", size: 20, color: "#8B5CF6" },
          { top: "82%", left: "42%", size: 18, color: "#F59E0B" },
          { top: "18%", left: "85%", size: 15, color: "#10B981" },
          { top: "75%", left: "88%", size: 22, color: "#F97316" },
        ].map((s, idx) => (
          <div
            key={idx}
            className="bg-floating-sparkle"
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              color: s.color,
              opacity: 0.7,
            }}
          >
            <Sparkles size={s.size} />
          </div>
        ))}

        {/* Floating Emojis Drift */}
        {["🔧", "🐾", "☕", "🐱", "✨", "🔌", "💻", "🎉"].map((emoji, idx) => (
          <div
            key={idx}
            className="bg-drift-emoji"
            style={{
              position: "absolute",
              top: `${20 + ((idx * 11) % 70)}%`,
              left: `${5 + ((idx * 13) % 90)}%`,
              fontSize: "1.3rem",
              userSelect: "none",
            }}
          >
            {emoji}
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
              boxShadow: "0 3px 10px rgba(245, 158, 11, 0.2)",
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
                  borderRadius: 20,
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
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                padding: "3px 9px",
                borderRadius: 12,
                border: "1px solid #FCD34D",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.15)",
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

      {/* ═══ MAIN STAGE (1 Screen Fixed Layout) ═══ */}
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
          id="main-card-container"
          style={{
            width: "100%",
            maxWidth: 1080,
            maxHeight: "calc(100dvh - 82px)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(12px, 2vw, 32px)",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.78)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: 26,
            padding: "clamp(12px, 2vh, 24px) clamp(14px, 2.5vw, 30px)",
            boxShadow: "0 20px 50px -10px rgba(245, 158, 11, 0.15), 0 0 0 2px rgba(253, 230, 138, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            overflow: "hidden",
          }}
        >
          {/* ───────────────────────────────────────────────────────────
              LEFT COLUMN: HERO ANIME ILLUSTRATION + SPEECH BUBBLES
             ─────────────────────────────────────────────────────────── */}
          <div
            id="cute-hero"
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
            {/* Cute Speech Bubble above anime characters */}
            <div
              id="speech-bubble"
              style={{
                position: "relative",
                background: "#FFFBEB",
                border: "2px solid #FCD34D",
                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)",
                borderRadius: "16px",
                padding: "6px 12px",
                maxWidth: 320,
                textAlign: "center",
                marginBottom: 4,
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: "0.95rem" }}>🐱💬</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#92400E", lineHeight: 1.25 }}>
                  "Lagi dirapikan dulu ya! Jangan panik, data kelas aman kok!"
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

            {/* Glowing Backdrop Circle behind image */}
            <div
              id="cute-glow-orb"
              style={{
                position: "absolute",
                width: "clamp(200px, 25vw, 340px)",
                height: "clamp(200px, 25vw, 340px)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(254, 243, 199, 0.85) 0%, rgba(254, 215, 170, 0.35) 60%, transparent 80%)",
                zIndex: 1,
              }}
            />

            {/* Anime Illustration with floating animation */}
            <div
              id="cute-hero-inner"
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: 420,
                display: "flex",
                justifyContent: "center",
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
                  maxHeight: "clamp(160px, 34vh, 300px)",
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 22px rgba(245, 158, 11, 0.2))",
                }}
              />
            </div>

            {/* Floating Decorative Badges on left/right of hero */}
            <div
              className="cute-badge-float"
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
                boxShadow: "0 4px 12px rgba(26, 35, 64, 0.08)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.8rem" }}>🐾</span>
              <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "#92400E" }}>
                Mandor Kucing On Duty
              </span>
            </div>

            <div
              className="cute-badge-float"
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
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
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
              RIGHT COLUMN: STATUS DECK, COUNTDOWN, TERMINAL & CTAs
             ─────────────────────────────────────────────────────────── */}
          <div
            id="cute-deck"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(6px, 1.2vh, 12px)",
              width: "100%",
              minHeight: 0,
            }}
          >
            {/* 1. Cute Status Tag & Title */}
            <div className="deck-fade-item">
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
                  "Tim Agrasena 625 sedang merapikan modul dan database agar makin ngebut & seru. Sebentar ya!"}
              </p>
            </div>

            {/* 2. Gamified Countdown Bubble Timer */}
            <div
              className="deck-fade-item"
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "clamp(6px, 1.2vh, 10px) 14px",
                border: "2px solid #FDE68A",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.08)",
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
                      className="cd-box"
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
              className="deck-fade-item"
              id="cute-terminal-widget"
              style={{
                background: "#0F172A",
                borderRadius: 16,
                border: "2px solid #334155",
                overflow: "hidden",
                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.2)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "clamp(80px, 13vh, 115px)",
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
                      color: line.includes("CAT")
                        ? "#FCD34D"
                        : line.includes("DEV")
                        ? "#38BDF8"
                        : line.includes("STATUS")
                        ? "#A78BFA"
                        : line.includes("READY")
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
              className="deck-fade-item"
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
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
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
                  id="cute-refresh-icon"
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
            background: "rgba(255, 255, 255, 0.7)",
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

      {/* ═══ RESPONSIVE CSS INLINE ═══ */}
      <style>{`
        @keyframes cuteBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 768px) {
          #main-card-container {
            grid-template-columns: 1fr !important;
            max-height: calc(100dvh - 65px) !important;
            padding: 8px 12px !important;
            gap: 6px !important;
            overflow: hidden !important;
          }
          #cute-hero {
            height: auto !important;
            max-height: 120px !important;
          }
          #cute-hero-inner img {
            max-height: 100px !important;
          }
          #speech-bubble {
            display: none !important;
          }
          #cute-glow-orb {
            display: none !important;
          }
          #badge-cat-mandor, #badge-system-opt {
            display: none !important;
          }
          #cute-terminal-widget {
            max-height: 60px !important;
          }
        }
        @media (min-width: 769px) and (max-height: 620px) {
          #main-card-container {
            padding: 8px 16px !important;
            gap: 12px !important;
          }
          #speech-bubble {
            display: none !important;
          }
          .cute-badge-float {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
