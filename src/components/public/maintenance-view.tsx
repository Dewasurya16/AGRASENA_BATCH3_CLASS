"use client"

import React, { useEffect, useState } from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  Wrench,
  Heart,
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
  const [consoleLines, setConsoleLines] = useState<string[]>([])

  // ============================================================
  // FAKE TERMINAL — cute "loading tasks" effect
  // ============================================================
  useEffect(() => {
    const lines = [
      "$ ssh agrasena-server-625...",
      "✓ Terhubung ke infrastruktur",
      "$ systemctl check --all",
      "⟳ Memperbarui kurikulum batch 4...",
      "⟳ Optimasi database...",
      "⟳ Memberi makan kucing server... 🐱",
      "✓ Kucing senang! Lanjut kerja...",
      "⟳ Upgrade keamanan portal...",
      "✓ 85% selesai — hampir siap!",
      "⏳ Mohon bersabar ya... 🙏",
    ]
    let lineIdx = 0
    const timer = setInterval(() => {
      if (lineIdx < lines.length) {
        setConsoleLines((prev) => [...prev, lines[lineIdx]])
        lineIdx++
      } else {
        clearInterval(timer)
      }
    }, 800)
    return () => clearInterval(timer)
  }, [])

  // ============================================================
  // ANIME.JS — 20+ rich animations
  // ============================================================
  useEffect(() => {
    // 1. Background emoji scatter — fade in with playful physics
    anime({
      targets: ".bg-emoji",
      opacity: () => [0, anime.random(0.08, 0.25)],
      scale: () => [0, anime.random(0.8, 1.5)],
      rotate: () => [anime.random(-45, 45), anime.random(-10, 10)],
      duration: () => anime.random(600, 1200),
      delay: anime.stagger(60, { start: 0 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // 2. Hero image pops in with bounce
    anime({
      targets: "#hero-img",
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1200,
      delay: 200,
      easing: "spring(1, 60, 8, 0)",
    })

    // 3. Hero idle bobbing
    anime({
      targets: "#hero-img",
      translateY: [-6, 6],
      duration: 3000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      delay: 1500,
    })

    // 4. Title drops in
    anime({
      targets: "#main-title",
      translateY: [-40, 0],
      opacity: [0, 1],
      duration: 900,
      delay: 500,
      easing: "spring(1, 80, 10, 0)",
    })

    // 5. Subtitle slides up
    anime({
      targets: "#sub-title",
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 700,
      delay: 700,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 6. Cards fan out
    anime({
      targets: ".maint-card",
      translateY: [30, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 600,
      delay: anime.stagger(100, { start: 900 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // 7. Terminal fades in
    anime({
      targets: "#terminal-box",
      translateX: [40, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 1200,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 8. Badge wobble on left
    anime({
      targets: "#badge-fixing",
      rotate: [-3, 3],
      translateY: [-4, 4],
      duration: 2000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 9. Badge wobble on right
    anime({
      targets: "#badge-patience",
      rotate: [2, -2],
      translateY: [3, -5],
      duration: 2400,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 10. Traffic cone bounce
    anime({
      targets: ".cone-bounce",
      translateY: [0, -8],
      duration: 600,
      direction: "alternate",
      loop: true,
      delay: anime.stagger(200),
      easing: "easeInOutQuad",
    })

    // 11. Heart float up
    anime({
      targets: ".float-heart",
      translateY: [0, -30],
      opacity: [0.8, 0],
      scale: [0.8, 1.2],
      duration: 2000,
      loop: true,
      delay: anime.stagger(600),
      easing: "easeOutCubic",
    })

    // 12. Countdown number pop
    anime({
      targets: ".cd-num",
      scale: [1.4, 1],
      opacity: [0, 1],
      duration: 400,
      delay: anime.stagger(80, { start: 1000 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // 13. WhatsApp button glow pulse
    anime({
      targets: "#wa-btn",
      boxShadow: [
        "0 4px 20px rgba(34,197,94,0.3)",
        "0 6px 36px rgba(34,197,94,0.6)",
        "0 4px 20px rgba(34,197,94,0.3)",
      ],
      duration: 2000,
      loop: true,
      easing: "easeInOutSine",
    })

    // 14. Refresh button subtle bounce
    anime({
      targets: "#refresh-btn",
      translateY: [0, -2, 0],
      duration: 2500,
      loop: true,
      easing: "easeInOutSine",
    })

    // 15. Status dot pulse
    anime({
      targets: "#status-dot",
      scale: [1, 1.5, 1],
      opacity: [1, 0.4, 1],
      duration: 1200,
      loop: true,
      easing: "easeInOutSine",
    })

    // 16. Footer wave
    anime({
      targets: "#footer-wave path",
      d: [
        "M0,8 Q120,0 240,8 T480,8 T720,8 T960,8 V40 H0 Z",
        "M0,4 Q120,12 240,4 T480,4 T720,4 T960,4 V40 H0 Z",
      ],
      duration: 3000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 17. Sparkle stars twinkle
    anime({
      targets: ".sparkle-star",
      opacity: () => [0, anime.random(0.5, 1)],
      scale: () => [0.5, anime.random(1, 2)],
      duration: () => anime.random(800, 2000),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(200),
      easing: "easeInOutSine",
    })
  }, [])

  // ============================================================
  // COUNTDOWN
  // ============================================================
  useEffect(() => {
    if (!config.estimatedEnd) { setTimeLeft(null); return }
    const target = new Date(config.estimatedEnd).getTime()
    if (isNaN(target)) { setTimeLeft(null); return }
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isEnded: false,
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [config.estimatedEnd])

  const handleRefresh = () => {
    setIsRefreshing(true)
    anime({ targets: "#refresh-icon", rotate: [0, 720], duration: 800, easing: "easeInOutQuad" })
    setTimeout(() => window.location.reload(), 800)
  }

  const waNumber = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const waUrl = `https://wa.me/${waNumber}?text=` +
    encodeURIComponent("Halo Admin Agrasena, saya ingin menanyakan status pemeliharaan Web Kelas Agrasena 625.")

  const countdownEnd = config.estimatedEnd
    ? new Date(config.estimatedEnd).toLocaleString("id-ID", {
        day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
        timeZone: "Asia/Makassar",
      }) + " WITA"
    : "Segera"

  // Background emojis — scattered playfully
  const bgEmojis = [
    { e: "🔧", t: "3%", l: "5%" }, { e: "⚙️", t: "8%", l: "88%" },
    { e: "🐱", t: "14%", l: "15%" }, { e: "💻", t: "12%", l: "75%" },
    { e: "🚧", t: "25%", l: "3%" }, { e: "⚡", t: "30%", l: "92%" },
    { e: "☕", t: "45%", l: "5%" }, { e: "🎯", t: "50%", l: "95%" },
    { e: "🔩", t: "65%", l: "8%" }, { e: "📡", t: "60%", l: "90%" },
    { e: "🛠️", t: "78%", l: "12%" }, { e: "✨", t: "75%", l: "88%" },
    { e: "🧰", t: "88%", l: "6%" }, { e: "🖥️", t: "85%", l: "92%" },
    { e: "💾", t: "35%", l: "10%" }, { e: "🔌", t: "40%", l: "85%" },
    { e: "🏗️", t: "55%", l: "2%" }, { e: "🎉", t: "20%", l: "50%" },
  ]

  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        background: "linear-gradient(170deg, #FFF9ED 0%, #FFFDF6 30%, #FFF4D9 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ════════════════════════════════════════════════════════
          BACKGROUND — Scattered emoji + sparkle stars + dots
          ════════════════════════════════════════════════════════ */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Emoji scatter */}
        {bgEmojis.map((em, i) => (
          <span
            key={i}
            className="bg-emoji"
            style={{ position: "absolute", top: em.t, left: em.l, fontSize: "clamp(1rem, 2vw, 1.6rem)", opacity: 0, userSelect: "none" }}
          >
            {em.e}
          </span>
        ))}

        {/* Sparkle stars */}
        {[
          { t: "6%", l: "30%" }, { t: "10%", l: "65%" }, { t: "20%", l: "40%" },
          { t: "35%", l: "70%" }, { t: "50%", l: "20%" }, { t: "70%", l: "60%" },
          { t: "80%", l: "35%" }, { t: "90%", l: "80%" },
        ].map((s, i) => (
          <svg key={i} className="sparkle-star" style={{ position: "absolute", top: s.t, left: s.l, opacity: 0 }} width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill="#FCD34D" />
          </svg>
        ))}

        {/* Traffic cone bouncing decorations */}
        <span className="cone-bounce" style={{ position: "absolute", bottom: "8%", left: "6%", fontSize: "1.5rem", opacity: 0.2 }}>🚦</span>
        <span className="cone-bounce" style={{ position: "absolute", bottom: "8%", right: "6%", fontSize: "1.3rem", opacity: 0.2 }}>🚧</span>

        {/* Floating hearts from hero area */}
        {[0, 1, 2].map((i) => (
          <Heart
            key={i}
            className="float-heart"
            style={{
              position: "absolute",
              top: "35%",
              left: `${47 + i * 3}%`,
              width: 14,
              height: 14,
              color: i === 1 ? "#FB923C" : "#F59E0B",
              fill: i === 1 ? "#FB923C" : "#F59E0B",
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          HEADER — compact
          ════════════════════════════════════════════════════════ */}
      <header style={{ position: "relative", zIndex: 20, padding: "10px 20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Image src="/Logo.png" alt="Agrasena 625" width={28} height={28} style={{ objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "#1A2340", lineHeight: 1.1 }}>Agrasena 625</div>
            <div style={{ fontSize: "0.55rem", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.1em" }}>Portal Web Kelas</div>
          </div>
        </div>

        {isAdmin && (
          <div style={{ width: "100%", maxWidth: 680, background: "rgba(245,158,11,0.12)", border: "1.5px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "6px 12px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck style={{ width: 14, height: 14, color: "#D97706" }} />
              <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#92400E", margin: 0 }}>Admin Session — Pengunjung melihat layar ini.</p>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <a href="/?bypass=1" style={{ padding: "3px 10px", borderRadius: 8, fontSize: "0.58rem", fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#92400E", border: "1px solid rgba(245,158,11,0.4)", textDecoration: "none" }}>Bypass ↗</a>
              <Link href="/admin/dashboard" style={{ padding: "3px 10px", borderRadius: 8, fontSize: "0.58rem", fontWeight: 800, background: "#D97706", color: "#fff", textDecoration: "none" }}>Dashboard</Link>
            </div>
          </div>
        )}

        {isPreview && !isAdmin && (
          <div style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.58rem", fontWeight: 700, background: "rgba(100,116,139,0.10)", color: "#64748B" }}>
            👁️ Mode Pratinjau
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN — CENTER HERO + BENTO GRID BELOW
          Fun, playful, single-screen layout
          ════════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px", overflow: "hidden", minHeight: 0 }}>

        {/* ─── HERO SECTION — Image centered with badges ─── */}
        <div style={{ position: "relative", width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Hero image */}
          <div
            id="hero-img"
            style={{
              width: "clamp(280px, 55vw, 480px)",
              position: "relative",
              opacity: 0,
              transform: "scale(0)",
            }}
          >
            <Image
              src="/Maintenance.webp"
              alt="Tim Agrasena 625 sedang melakukan pemeliharaan sistem"
              width={480}
              height={336}
              priority
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 12px 32px rgba(26,35,64,0.14))",
                maxHeight: "clamp(160px, 28vh, 280px)",
              }}
            />
          </div>

          {/* Badge left — "Sedang diperbaiki" */}
          <div
            id="badge-fixing"
            style={{
              position: "absolute",
              top: "10%",
              left: "clamp(0px, 5%, 60px)",
              background: "#FFFFFF",
              borderRadius: 14,
              padding: "6px 12px",
              boxShadow: "0 4px 20px rgba(26,35,64,0.12)",
              border: "2px solid #FCD34D",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: "1rem" }}>🔧</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#92400E" }}>Lagi di-fix nih!</span>
          </div>

          {/* Badge right — patience */}
          <div
            id="badge-patience"
            style={{
              position: "absolute",
              bottom: "5%",
              right: "clamp(0px, 5%, 60px)",
              background: "#FEF3C7",
              borderRadius: 14,
              padding: "6px 14px",
              boxShadow: "0 4px 20px rgba(245,158,11,0.25)",
              border: "2px solid #FBBF24",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: "1rem" }}>😺</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#92400E" }}>Sabar ya, bentar lagi!</span>
            <span style={{ fontSize: "0.9rem" }}>✨</span>
          </div>
        </div>

        {/* ─── TITLE ─── */}
        <h1
          id="main-title"
          style={{
            textAlign: "center",
            fontSize: "clamp(1.2rem, 3.5vw, 2rem)",
            fontWeight: 900,
            color: "#1A2340",
            lineHeight: 1.15,
            margin: "4px 0 2px",
            opacity: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {config.title || "Oops! Kami Sedang Upgrade 🛠️"}
        </h1>
        <p
          id="sub-title"
          style={{
            textAlign: "center",
            fontSize: "clamp(0.68rem, 1.5vw, 0.82rem)",
            color: "#64748B",
            lineHeight: 1.5,
            margin: "0 auto 6px",
            maxWidth: 440,
            opacity: 0,
          }}
        >
          {config.message || "Kami sedang meningkatkan sistem untuk pengalaman belajar yang lebih baik. Silakan kembali sebentar lagi!"}
        </p>

        {/* ─── BENTO GRID — countdown, terminal, buttons ─── */}
        <div
          style={{
            width: "100%",
            maxWidth: 720,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 8,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* ═══ CARD 1 — COUNTDOWN (spans left) ═══ */}
          <div
            className="maint-card"
            style={{
              background: "#FFFFFF",
              borderRadius: 18,
              padding: "clamp(10px, 1.5vh, 16px) clamp(12px, 2vw, 18px)",
              border: "2px solid rgba(252,211,77,0.5)",
              boxShadow: "0 4px 20px rgba(245,158,11,0.10)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "1rem" }}>⏱️</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#92400E", letterSpacing: "0.1em", textTransform: "uppercase" }}>Estimasi Selesai</span>
            </div>

            {timeLeft && !timeLeft.isEnded ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
                {[
                  { val: timeLeft.days, label: "Hari", accent: "#1A2340", bg: "#F1F5F9" },
                  { val: timeLeft.hours, label: "Jam", accent: "#F59E0B", bg: "#FFFBEB" },
                  { val: timeLeft.minutes, label: "Mnt", accent: "#F97316", bg: "#FFF7ED" },
                  { val: timeLeft.seconds, label: "Dtk", accent: "#EF4444", bg: "#FEF2F2" },
                ].map(({ val, label, accent, bg }) => (
                  <div key={label} className="cd-num" style={{ textAlign: "center", background: bg, borderRadius: 12, padding: "6px 2px 4px", opacity: 0 }}>
                    <div style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)", fontWeight: 900, color: accent, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                      {String(val).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            ) : timeLeft?.isEnded ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(16,185,129,0.08)", borderRadius: 12 }}>
                <CheckCircle style={{ width: 14, height: 14, color: "#10B981" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#065F46" }}>Seharusnya sudah selesai!</span>
              </div>
            ) : (
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1A2340" }}>Segera kembali! 🎉</div>
            )}

            {/* Mini info row */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "#FEF3C7", borderRadius: 8, border: "1px solid #FDE68A" }}>
                <div id="status-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#92400E" }}>Maintenance</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "#F1F5F9", borderRadius: 8 }}>
                <Clock style={{ width: 10, height: 10, color: "#94A3B8" }} />
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#64748B" }}>{countdownEnd}</span>
              </div>
            </div>
          </div>

          {/* ═══ CARD 2 — FAKE TERMINAL (right) ═══ */}
          <div
            id="terminal-box"
            className="maint-card"
            style={{
              background: "#1A2340",
              borderRadius: 18,
              padding: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              opacity: 0,
              border: "2px solid rgba(30,41,59,0.3)",
            }}
          >
            {/* Terminal title bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "rgba(255,255,255,0.06)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: "0.55rem", color: "#64748B", marginLeft: 6, fontWeight: 600 }}>agrasena-625@server</span>
            </div>
            {/* Terminal content */}
            <div style={{ flex: 1, padding: "6px 10px", overflowY: "auto", fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: "clamp(0.52rem, 0.9vw, 0.62rem)", lineHeight: 1.6, color: "#94A3B8", minHeight: 0 }}>
              {consoleLines.map((line, i) => (
                <div key={i} style={{ color: line.startsWith("✓") ? "#22C55E" : line.startsWith("⟳") ? "#F59E0B" : line.startsWith("⏳") ? "#A78BFA" : "#94A3B8" }}>
                  {line}
                </div>
              ))}
              <span style={{ display: "inline-block", width: 7, height: 12, background: "#F59E0B", animation: "cursor-blink 0.8s step-end infinite" }} />
            </div>
          </div>

          {/* ═══ CARD 3 — CTA BUTTONS (bottom-left) ═══ */}
          <div
            className="maint-card"
            style={{
              background: "#FFFFFF",
              borderRadius: 18,
              padding: "clamp(8px, 1.2vh, 14px) clamp(10px, 1.5vw, 16px)",
              border: "2px solid rgba(34,197,94,0.3)",
              boxShadow: "0 4px 20px rgba(34,197,94,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              justifyContent: "center",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: "0.9rem" }}>📞</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#1A2340", letterSpacing: "0.08em", textTransform: "uppercase" }}>Butuh Bantuan?</span>
            </div>

            <a
              id="wa-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "9px 14px",
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                borderRadius: 12, color: "#fff", fontWeight: 800,
                fontSize: "0.75rem", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
              }}
            >
              <MessageCircle style={{ width: 14, height: 14 }} />
              Chat Admin Agrasena
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>↗</span>
            </a>

            <button
              type="button"
              id="refresh-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "7px 14px",
                background: "#F8FAFC", borderRadius: 12, color: "#1A2340",
                fontWeight: 700, fontSize: "0.72rem",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                border: "1.5px solid rgba(30,41,59,0.12)",
                opacity: isRefreshing ? 0.6 : 1, fontFamily: "inherit",
              }}
            >
              <RefreshCw id="refresh-icon" style={{ width: 12, height: 12, color: isRefreshing ? "#F59E0B" : "#64748B" }} />
              {isRefreshing ? "Checking..." : "Periksa Status"}
            </button>
          </div>

          {/* ═══ CARD 4 — FUN FACTS (bottom-right) ═══ */}
          <div
            className="maint-card"
            style={{
              background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
              borderRadius: 18,
              padding: "clamp(8px, 1.2vh, 14px) clamp(10px, 1.5vw, 16px)",
              border: "2px solid #FBBF24",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              justifyContent: "center",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: "0.9rem" }}>🐱</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#92400E", letterSpacing: "0.08em", textTransform: "uppercase" }}>Fun Facts</span>
            </div>

            {[
              { emoji: "🧑‍💻", text: "Tim Agrasena 625 sedang kerja keras!" },
              { emoji: "🐈", text: "Kucing server sudah diberi makan ✓" },
              { emoji: "☕", text: "Kopi ke-3 sudah disiapkan" },
              { emoji: "🚀", text: "Sistemnya bakal lebih kenceng!" },
            ].map(({ emoji, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", background: "rgba(255,255,255,0.7)", borderRadius: 10 }}>
                <span style={{ fontSize: "0.8rem" }}>{emoji}</span>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, color: "#78350F" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════════════════════════
          FOOTER — wavy + compact
          ════════════════════════════════════════════════════════ */}
      <footer style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
        <svg id="footer-wave" style={{ display: "block", width: "100%", height: 12 }} viewBox="0 0 960 40" preserveAspectRatio="none">
          <path d="M0,8 Q120,0 240,8 T480,8 T720,8 T960,8 V40 H0 Z" fill="#FFFFFF" />
        </svg>
        <div style={{ background: "#FFFFFF", textAlign: "center", padding: "0 20px 8px" }}>
          <span style={{ fontSize: "0.55rem", color: "#CBD5E1" }}>
            © 2025 Agrasena 625 — Web Kelas Diklat Fungsional Pranata Komputer Kejaksaan RI
          </span>
        </div>
      </footer>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 580px) {
          main > div:last-child {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
          }
          #badge-fixing, #badge-patience { display: none !important; }
        }
      `}</style>
    </div>
  )
}
