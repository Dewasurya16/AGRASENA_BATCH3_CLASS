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
  // CUTE CONSOLE / TERMINAL LOGS — INFINITE LOOPING ANIMATION
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    const logs = [
      "🐾 [AGRASENA] Memulai pemeliharaan server kelas...",
      "🔌 [DCXXV] Menghubungkan ke node cluster Agrasena...",
      "🐱 [MANDOR] Kucing teknisi periksa kabel LAN... Aman!",
      "🐟 [SNACK] Menyuapkan snack ikan tuna ke kucing lab... Nyam! 🐱",
      "☕ [ADMIN] Menuang secangkir kopi hitam manis... Sluuurp!",
      "⚡ [DATABASE] Mengusir bug nakal dari baris kode... Hush! 🧹",
      "🛡️ [KEAMANAN] Mengaktifkan perisai super DCXXV... 100%!",
      "📊 [STATUS] Mengoptimalkan modul: [██████████░] 94%",
      "🚀 [SIAP] Sedikit lagi selesai! Siap meluncur...",
      "✨ [SIKLUS] Semua tugas beres! Mengulang pemantauan... 🔄",
    ]

    let active = true
    let idx = 0

    const step = () => {
      if (!active) return
      if (idx < logs.length) {
        const nextLine = logs[idx]
        setTermLines((prev) => [...prev, nextLine])
        idx++
        if (termScrollRef.current) {
          termScrollRef.current.scrollTop = termScrollRef.current.scrollHeight
        }
        setTimeout(step, 1100)
      } else {
        // Jeda 2.2 detik setelah baris terakhir selesai, lalu ulangi siklus (LOOPING)
        setTimeout(() => {
          if (!active) return
          setTermLines([])
          idx = 0
          setTimeout(step, 500)
        }, 2200)
      }
    }

    const timer = setTimeout(step, 300)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [])

  // ══════════════════════════════════════════════════════════
  // ANIME.JS — Snappy One-Shot Entrance Animations
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    // 1. Hero illustration elastic bounce entry
    anime({
      targets: "#chibi-hero-box",
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 900,
      easing: "spring(1, 75, 8, 0)",
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
        { value: -20, duration: 140, easing: "easeOutQuad" },
        { value: 4, duration: 110, easing: "easeInQuad" },
        { value: 0, duration: 160, easing: "easeOutBounce" },
      ],
      scaleX: [
        { value: 0.9, duration: 140 },
        { value: 1.12, duration: 110 },
        { value: 1, duration: 160 },
      ],
      scaleY: [
        { value: 1.12, duration: 140 },
        { value: 0.9, duration: 110 },
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
    "Halo Admin Agrasena, saya ingin tanya status maintenance Web Kelas saat ini. Terima kasih! 🙏"
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
        background: "linear-gradient(135deg, #FFFDF8 0%, #FFF7EC 40%, #FEF3C7 100%)",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#0F172A",
        boxSizing: "border-box",
      }}
    >
      {/* ═══ LIGHTWEIGHT HARDWARE-ACCELERATED BACKGROUND ═══ */}
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
            backgroundSize: "32px 32px",
            opacity: 0.14,
          }}
        />

        {/* Ambient subtle glow */}
        <div
          style={{
            position: "absolute",
            top: "-8%",
            left: "10%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.24) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-8%",
            right: "5%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(253, 164, 175, 0.22) 0%, transparent 70%)",
          }}
        />

        {/* Floating Emoticons with Hardware CSS Keyframes */}
        {[
          { top: "10%", left: "6%", icon: "✨", delay: "0s" },
          { top: "24%", left: "48%", icon: "🐾", delay: "1.2s" },
          { top: "72%", left: "6%", icon: "🔧", delay: "0.6s" },
          { top: "84%", left: "46%", icon: "🐱", delay: "1.8s" },
          { top: "14%", left: "92%", icon: "⚡", delay: "0.3s" },
          { top: "78%", left: "91%", icon: "☕", delay: "1.5s" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="chibi-css-float"
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              fontSize: "1.25rem",
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
          padding: "12px clamp(16px, 3vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Brand identity: Agrasena & DCXXV */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.22)",
              border: "2px solid #FDE68A",
              overflow: "hidden",
            }}
          >
            <Image
              src="/Logo.png"
              alt="Logo Agrasena"
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.01em" }}>
                Agrasena
              </span>
              <span
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 900,
                  color: "#B45309",
                  background: "#FEF3C7",
                  padding: "2px 7px",
                  borderRadius: 12,
                  border: "1px solid #FCD34D",
                  letterSpacing: "0.04em",
                }}
              >
                DCXXV
              </span>
            </div>
            <span style={{ fontSize: "0.58rem", color: "#64748B", fontWeight: 600 }}>
              Diklat Fungsional Pranata Komputer
            </span>
          </div>
        </div>

        {/* Badges / Admin Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isAdmin && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255, 255, 255, 0.92)",
                padding: "4px 10px",
                borderRadius: 12,
                border: "1px solid #FCD34D",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ShieldCheck size={14} color="#D97706" />
                <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#92400E" }}>
                  Admin
                </span>
              </div>
              <span style={{ color: "#CBD5E1", fontSize: "0.7rem" }}>|</span>
              <a
                href="/?bypass=1"
                style={{
                  fontSize: "0.62rem",
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
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  color: "#fff",
                  textDecoration: "none",
                  padding: "3px 8px",
                  borderRadius: 7,
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
                fontSize: "0.62rem",
                fontWeight: 800,
                color: "#64748B",
                background: "#fff",
                padding: "4px 10px",
                borderRadius: 12,
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

      {/* ═══ MAIN STAGE (OPEN UNIFIED STAGE — NO ENCLOSING BORDER / BOX) ═══ */}
      <main
        style={{
          position: "relative",
          zIndex: 20,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(16px, 3vw, 48px)",
          minHeight: 0,
        }}
      >
        <div
          id="unified-stage-grid"
          style={{
            width: "100%",
            maxWidth: 1380,
            height: "100%",
            maxHeight: "calc(100dvh - 80px)",
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: "clamp(20px, 3.5vw, 56px)",
            alignItems: "center",
          }}
        >
          {/* ───────────────────────────────────────────────────────────
              LEFT COLUMN: HERO ANIME JAUH LEBIH BESAR & MENYATU PENUH
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
            {/* Cute Speech Bubble */}
            <div
              id="chibi-speech-bubble"
              style={{
                position: "relative",
                background: "#FFFBEB",
                border: "2px solid #FCD34D",
                boxShadow: "0 6px 20px rgba(245, 158, 11, 0.16)",
                borderRadius: "20px",
                padding: "8px 16px",
                maxWidth: 380,
                textAlign: "center",
                marginBottom: 8,
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: "1.15rem" }}>🐱💬</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#92400E", lineHeight: 1.35 }}>
                  "Sabar ya kak! Mandor kucing lagi ngawasin kabel & server Agrasena! ✨"
                </span>
              </div>
              {/* Bubble Triangle Tail */}
              <div
                style={{
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "8px solid #FCD34D",
                }}
              />
            </div>

            {/* Glowing Backdrop Aura */}
            <div
              id="chibi-glow-aura"
              style={{
                position: "absolute",
                width: "clamp(280px, 36vw, 480px)",
                height: "clamp(280px, 36vw, 480px)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(254, 243, 199, 0.95) 0%, rgba(254, 215, 170, 0.4) 60%, transparent 80%)",
                zIndex: 1,
              }}
            />

            {/* Gambar Anime Chibi Jauh Lebih Besar */}
            <div
              id="chibi-hero-img-wrap"
              className="chibi-hero-gentle-float"
              onClick={handleHeroClick}
              title="Klik karakter untuk animasi pantul lucu! 🐾"
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: "clamp(420px, 46vw, 620px)",
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src="/Maintenance.webp"
                alt="Tim Agrasena sedang perbaikan sistem"
                width={620}
                height={434}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "clamp(240px, 54vh, 460px)",
                  objectFit: "contain",
                  filter: "drop-shadow(0 16px 32px rgba(245, 158, 11, 0.24))",
                }}
              />
            </div>

            {/* Floating Decorative Badges */}
            <div
              className="chibi-badge-wobble"
              id="badge-cat-mandor"
              style={{
                position: "absolute",
                bottom: "3%",
                left: "4%",
                background: "#fff",
                border: "2px solid #FBBF24",
                borderRadius: 14,
                padding: "5px 11px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 4px 14px rgba(26, 35, 64, 0.08)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>🐾</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#92400E" }}>
                Mandor Kucing DCXXV
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
                borderRadius: 14,
                padding: "5px 11px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.1)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>⚡</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#991B1B" }}>
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
              gap: "clamp(8px, 1.5vh, 16px)",
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
                  gap: 6,
                  background: "#FEF3C7",
                  border: "1.5px solid #FCD34D",
                  padding: "4px 11px",
                  borderRadius: 20,
                  marginBottom: 6,
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
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    color: "#92400E",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Sedang Pemeliharaan Sistem
                </span>
                <span style={{ fontSize: "0.68rem" }}>🛠️</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.25rem, 2.4vw, 2.1rem)",
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: "-0.025em",
                }}
              >
                {config.title || "Portal Sedang Dalam Pemeliharaan Sistem ☕"}
              </h1>

              <p
                style={{
                  fontSize: "clamp(0.72rem, 1.1vw, 0.86rem)",
                  color: "#475569",
                  lineHeight: 1.45,
                  margin: "4px 0 0",
                  fontWeight: 500,
                }}
              >
                {config.message ||
                  "Tim Agrasena sedang merapikan modul dan database agar makin lancar & seru. Sebentar ya!"}
              </p>
            </div>

            {/* 2. Gamified Countdown Bubble Timer */}
            <div
              className="deck-pop-item"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: 20,
                padding: "clamp(8px, 1.4vh, 12px) 16px",
                border: "2px solid #FDE68A",
                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={15} color="#D97706" />
                  <span
                    style={{
                      fontSize: "0.64rem",
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
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: "#64748B",
                    background: "#F1F5F9",
                    padding: "2px 8px",
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
                    gap: 8,
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
                        borderRadius: 14,
                        padding: "6px 2px 4px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
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
                          fontSize: "0.5rem",
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
                    padding: "8px 12px",
                    background: "#ECFDF5",
                    border: "1.5px solid #A7F3D0",
                    borderRadius: 12,
                  }}
                >
                  <CheckCircle2 size={18} color="#10B981" />
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#065F46" }}>
                    Maintenance dijadwalkan sudah selesai! Silakan klik Segarkan di bawah. 🎉
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "#92400E",
                  }}
                >
                  ✨ Segera selesai dalam beberapa saat!
                </div>
              )}
            </div>

            {/* 3. Cute Live Terminal Log Widget — INFINITE LOOPING (Enlarged) */}
            <div
              className="deck-pop-item"
              id="cute-terminal-widget"
              style={{
                background: "#0F172A",
                borderRadius: 18,
                border: "2px solid #334155",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
                display: "flex",
                flexDirection: "column",
                height: "clamp(120px, 19vh, 160px)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  background: "#1E293B",
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #334155",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#EF4444" }} />
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#F59E0B" }} />
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#10B981" }} />
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginLeft: 4,
                      fontFamily: "monospace",
                    }}
                  >
                    cat-prompt@agrasena:~
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Cat size={13} color="#FCD34D" />
                  <span style={{ fontSize: "0.58rem", color: "#FCD34D", fontWeight: 800 }}>
                    Live Loop 🐾
                  </span>
                </div>
              </div>

              {/* Terminal Content Auto-scroll & Continuous Loop */}
              <div
                ref={termScrollRef}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  overflowY: "auto",
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  fontSize: "clamp(0.62rem, 0.95vw, 0.74rem)",
                  lineHeight: 1.55,
                  color: "#E2E8F0",
                }}
              >
                {termLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      color: line.includes("MANDOR")
                        ? "#FCD34D"
                        : line.includes("SNACK")
                        ? "#FB7185"
                        : line.includes("DCXXV")
                        ? "#38BDF8"
                        : line.includes("ADMIN")
                        ? "#FBBF24"
                        : line.includes("STATUS")
                        ? "#A78BFA"
                        : line.includes("SIAP")
                        ? "#4ADE80"
                        : line.includes("SIKLUS")
                        ? "#34D399"
                        : "#CBD5E1",
                    }}
                  >
                    {line}
                  </div>
                ))}
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 13,
                    background: "#F59E0B",
                    verticalAlign: "middle",
                    marginLeft: 3,
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
                gap: 10,
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
                  gap: 8,
                  padding: "clamp(9px, 1.3vh, 12px) 16px",
                  background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                  borderRadius: 14,
                  color: "#ffffff",
                  fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.3)",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <MessageCircle size={16} />
                <span>Chat Admin Agrasena</span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    borderRadius: "50%",
                    width: 17,
                    height: 17,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
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
                  gap: 7,
                  padding: "clamp(9px, 1.3vh, 12px) 16px",
                  background: "#ffffff",
                  borderRadius: 14,
                  border: "1.5px solid #E2E8F0",
                  color: "#0F172A",
                  fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                  fontWeight: 800,
                  cursor: isRefreshing ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <RefreshCw
                  id="cute-refresh-spin"
                  size={15}
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
          padding: "4px 16px 8px",
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
            padding: "3px 12px",
            borderRadius: 12,
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#64748B" }}>
            © 2025 Agrasena • Diklat Fungsional Pranata Komputer Kejaksaan RI
          </span>
          <span style={{ fontSize: "0.6rem" }}>💛</span>
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
          50% { transform: translate3d(0, -7px, 0); }
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

        @media (max-width: 820px) {
          #unified-stage-grid {
            grid-template-columns: 1fr !important;
            max-height: calc(100dvh - 65px) !important;
            padding: 4px 10px !important;
            gap: 8px !important;
            overflow: hidden !important;
          }
          #chibi-hero-box {
            height: auto !important;
            max-height: 145px !important;
          }
          #chibi-hero-img-wrap img {
            max-height: 125px !important;
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
            height: 75px !important;
          }
        }
        @media (min-width: 821px) and (max-height: 640px) {
          #unified-stage-grid {
            gap: 16px !important;
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
