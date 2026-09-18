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
  const [typedText, setTypedText] = useState("")

  // ============================================================
  // TYPEWRITER EFFECT for subtitle
  // ============================================================
  useEffect(() => {
    const msg = config.message?.slice(0, 80) || "Kami sedang meningkatkan layanan untuk Anda."
    let i = 0
    const interval = setInterval(() => {
      if (i < msg.length) {
        setTypedText(msg.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 22)
    return () => clearInterval(interval)
  }, [config.message])

  // ============================================================
  // ANIME.JS — FULL RICH ANIMATION SUITE
  // ============================================================
  useEffect(() => {
    // 1. Logo spring drop
    anime({
      targets: "#logo-mark",
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 100,
      easing: "spring(1, 80, 10, 0)",
    })

    // 2. Left panel (image side) slides in from left
    anime({
      targets: "#panel-left",
      translateX: [-60, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 200,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 3. Right panel (content side) slides in from right
    anime({
      targets: "#panel-right",
      translateX: [60, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 300,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 4. Eyebrow tag pops in
    anime({
      targets: "#eyebrow-tag",
      scale: [0.5, 1],
      opacity: [0, 1],
      duration: 600,
      delay: 800,
      easing: "spring(1, 80, 10, 0)",
    })

    // 5. Title words cascade in
    anime({
      targets: ".title-word",
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(80, { start: 900 }),
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 6. Action buttons stagger up
    anime({
      targets: ".action-btn",
      translateY: [24, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(120, { start: 1100 }),
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 7. Info cards cascade
    anime({
      targets: ".info-card",
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(100, { start: 1300 }),
      easing: "spring(1, 80, 12, 0)",
    })

    // 8. GEAR — continuous fast spin
    anime({
      targets: "#gear-anim",
      rotate: [0, 360],
      duration: 4000,
      loop: true,
      easing: "linear",
    })

    // 9. WRENCH — swinging like hammering
    anime({
      targets: "#wrench-anim",
      rotate: [-25, 25],
      duration: 600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutQuad",
    })

    // 10. Hero image — idle float up/down
    anime({
      targets: "#hero-img",
      translateY: [-8, 8],
      duration: 3500,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 11. "Sedang diperbaiki" badge — float
    anime({
      targets: "#badge-tool",
      translateY: [-5, 5],
      rotate: [-1, 1],
      duration: 2500,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 12. "Mohon bersabar" badge — float opposite
    anime({
      targets: "#badge-patience",
      translateY: [5, -5],
      rotate: [1, -1],
      duration: 3000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 13. Floating construction icons (decorative)
    anime({
      targets: ".float-icon",
      translateY: () => [anime.random(-12, 0), anime.random(0, 12)],
      translateX: () => [anime.random(-6, 0), anime.random(0, 6)],
      rotate: () => [anime.random(-15, 0), anime.random(0, 15)],
      opacity: [0.15, 0.8],
      duration: () => anime.random(2000, 4000),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(300),
      easing: "easeInOutSine",
    })

    // 14. Spark dots twinkle
    anime({
      targets: ".spark-dot",
      opacity: () => [0.1, anime.random(0.5, 1)],
      scale: () => [0.6, anime.random(1.4, 2)],
      duration: () => anime.random(800, 2000),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(180),
      easing: "easeInOutSine",
    })

    // 15. Progress dots — wave
    anime({
      targets: ".wave-dot",
      translateY: [-8, 0],
      opacity: [0.3, 1],
      duration: 450,
      direction: "alternate",
      loop: true,
      delay: anime.stagger(150),
      easing: "easeInOutQuad",
    })

    // 16. WhatsApp button — gentle pulse glow
    anime({
      targets: "#wa-btn",
      boxShadow: [
        "0 6px 24px rgba(34,197,94,0.30)",
        "0 8px 40px rgba(34,197,94,0.60)",
        "0 6px 24px rgba(34,197,94,0.30)",
      ],
      duration: 1800,
      loop: true,
      easing: "easeInOutSine",
    })

    // 17. Status amber dot — pulse
    anime({
      targets: "#status-dot",
      scale: [1, 1.4, 1],
      opacity: [1, 0.4, 1],
      duration: 1200,
      loop: true,
      easing: "easeInOutSine",
    })

    // 18. Particles drift up from bottom
    anime({
      targets: ".particle",
      translateY: [0, -120],
      translateX: () => [0, anime.random(-30, 30)],
      opacity: [0, 0.6, 0],
      scale: () => [0.5, anime.random(1, 1.5), 0],
      duration: () => anime.random(2000, 4000),
      loop: true,
      delay: anime.stagger(400),
      easing: "easeOutCubic",
    })

    // 19. Separator line draw-in
    anime({
      targets: "#sep-line",
      scaleX: [0, 1],
      opacity: [0, 1],
      duration: 800,
      delay: 1000,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 20. Countdown number reveal
    anime({
      targets: ".countdown-num",
      scale: [1.3, 1],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(80, { start: 1400 }),
      easing: "spring(1, 80, 10, 0)",
    })
  }, [])

  // ============================================================
  // COUNTDOWN TIMER
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
    anime({ targets: "#refresh-icon", rotate: [0, 360], duration: 600, easing: "easeInOutQuad" })
    setTimeout(() => window.location.reload(), 700)
  }

  const waNumber = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const waUrl = `https://wa.me/${waNumber}?text=` +
    encodeURIComponent("Halo Tim Diklat Prakom Kejaksaan RI, saya ingin menanyakan status pemeliharaan Web Kelas Agrasena.")

  const countdownEnd = config.estimatedEnd
    ? new Date(config.estimatedEnd).toLocaleString("id-ID", {
        day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
        timeZone: "Asia/Makassar",
      }) + " WITA"
    : "Segera"

  // Split title into words for cascade animation
  const titleWords = (config.title || "Portal Sedang Dalam Pemeliharaan Sistem").split(" ")

  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        background: "#FAFAF8",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ============================================================
          BACKGROUND LAYER — Animated particles + dashes + glows
          ============================================================ */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Diagonal dashes */}
        <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.05 }} width="300" height="220" viewBox="0 0 300 220">
          <line x1="300" y1="0" x2="0" y2="220" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="300" y1="40" x2="40" y2="220" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="300" y1="80" x2="80" y2="220" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
        </svg>
        <svg style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.04 }} width="260" height="180" viewBox="0 0 260 180">
          <line x1="0" y1="180" x2="260" y2="0" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="0" y1="130" x2="260" y2="0" stroke="#1A2340" strokeWidth="1" strokeDasharray="6 8" />
        </svg>

        {/* Radial glows */}
        <div style={{ position: "absolute", top: "5%", right: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", width: 400, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.03) 0%, transparent 70%)" }} />

        {/* Spark dots */}
        {[
          { top: "6%", left: "8%", s: 5, c: "#F59E0B" },
          { top: "12%", left: "72%", s: 4, c: "#F97316" },
          { top: "25%", left: "90%", s: 5, c: "#F59E0B" },
          { top: "55%", left: "93%", s: 4, c: "#F59E0B" },
          { top: "78%", left: "85%", s: 5, c: "#F97316" },
          { top: "88%", left: "14%", s: 4, c: "#F59E0B" },
          { top: "65%", left: "4%", s: 5, c: "#F97316" },
          { top: "38%", left: "2%", s: 4, c: "#F59E0B" },
        ].map((d, i) => (
          <span key={i} className="spark-dot" style={{ position: "absolute", top: d.top, left: d.left, width: d.s, height: d.s, borderRadius: "50%", background: d.c, opacity: 0.35 }} />
        ))}

        {/* Rising particles (bottom center) */}
        {[
          { left: "47%", c: "#F59E0B", s: 5 },
          { left: "49%", c: "#F97316", s: 4 },
          { left: "51%", c: "#FCD34D", s: 6 },
          { left: "53%", c: "#F59E0B", s: 4 },
          { left: "45%", c: "#F97316", s: 5 },
        ].map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              position: "absolute",
              bottom: "2%",
              left: p.left,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              background: p.c,
              opacity: 0,
            }}
          />
        ))}

        {/* Floating decorative icons */}
        {[
          { icon: "⚙️", top: "8%", left: "30%", size: "1.4rem" },
          { icon: "🔧", top: "7%", left: "65%", size: "1.2rem" },
          { icon: "💻", top: "85%", left: "28%", size: "1.2rem" },
          { icon: "🔩", top: "82%", left: "70%", size: "1rem" },
          { icon: "⚡", top: "45%", left: "96%", size: "1.1rem" },
        ].map((fi, i) => (
          <span
            key={i}
            className="float-icon"
            style={{
              position: "absolute",
              top: fi.top,
              left: fi.left,
              fontSize: fi.size,
              opacity: 0.15,
              userSelect: "none",
            }}
          >
            {fi.icon}
          </span>
        ))}
      </div>

      {/* ============================================================
          HEADER — Logo + Banners (compact)
          ============================================================ */}
      <header style={{ position: "relative", zIndex: 20, padding: "12px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div id="logo-mark" style={{ opacity: 0, display: "flex", alignItems: "center", gap: 9 }}>
          <Image src="/Logo.png" alt="Kejaksaan RI" width={32} height={32} style={{ objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", color: "#64748B", textTransform: "uppercase" }}>Badiklat Kejaksaan RI</div>
            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#1A2340", lineHeight: 1.1 }}>Portal Web Kelas Agrasena</div>
          </div>
        </div>

        {isAdmin && (
          <div style={{ width: "100%", maxWidth: 760, background: "rgba(245,158,11,0.10)", border: "1.5px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "7px 14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck style={{ width: 15, height: 15, color: "#D97706", flexShrink: 0 }} />
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#92400E", margin: 0 }}>
                Sesi Admin Aktif — Pengunjung melihat layar ini.
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <a href="/?bypass=1" style={{ padding: "4px 10px", borderRadius: 8, fontSize: "0.62rem", fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#92400E", border: "1px solid rgba(245,158,11,0.4)", textDecoration: "none" }}>Bypass ↗</a>
              <Link href="/admin/dashboard" style={{ padding: "4px 10px", borderRadius: 8, fontSize: "0.62rem", fontWeight: 800, background: "#D97706", color: "#fff", textDecoration: "none" }}>Dashboard</Link>
            </div>
          </div>
        )}

        {isPreview && !isAdmin && (
          <div style={{ padding: "3px 12px", borderRadius: 999, fontSize: "0.62rem", fontWeight: 700, background: "rgba(100,116,139,0.10)", color: "#64748B", border: "1px solid rgba(30,41,59,0.08)" }}>
            👁️ Mode Pratinjau
          </div>
        )}
      </header>

      {/* ============================================================
          MAIN — 2-COLUMN SPLIT LAYOUT (fits 1 screen)
          LEFT: Illustration  |  RIGHT: Content + Buttons
          ============================================================ */}
      <main style={{ flex: 1, position: "relative", zIndex: 10, display: "flex", alignItems: "center", padding: "8px 24px 8px", gap: "clamp(16px, 3vw, 40px)", overflow: "hidden", minHeight: 0 }}>

        {/* ══════ LEFT PANEL — ILLUSTRATION ══════ */}
        <div
          id="panel-left"
          style={{
            opacity: 0,
            flex: "0 0 auto",
            width: "clamp(240px, 42%, 480px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            position: "relative",
          }}
        >
          {/* Top badge — Sedang diperbaiki */}
          <div
            id="badge-tool"
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "6px 12px",
              boxShadow: "0 4px 20px rgba(26,35,64,0.10)",
              border: "1px solid rgba(30,41,59,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 7,
              alignSelf: "flex-start",
              marginLeft: "8%",
            }}
          >
            <div id="wrench-anim" style={{ display: "flex" }}>
              <Wrench style={{ width: 14, height: 14, color: "#F97316" }} />
            </div>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1A2340", whiteSpace: "nowrap" }}>Sedang diperbaiki</span>
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="wave-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#F97316", display: "inline-block", opacity: 0.3 }} />
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div
            id="hero-img"
            style={{ width: "100%", position: "relative" }}
          >
            <Image
              src="/Maintenance.webp"
              alt="Tim Pranata Komputer Kejaksaan RI sedang melakukan pemeliharaan sistem"
              width={520}
              height={364}
              priority
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 16px 40px rgba(26,35,64,0.13))",
                maxHeight: "clamp(200px, 40vh, 340px)",
              }}
            />
          </div>

          {/* Bottom badge — Mohon bersabar (MOVED TO BOTTOM) */}
          <div
            id="badge-patience"
            style={{
              background: "#FEF3C7",
              borderRadius: 12,
              padding: "6px 14px",
              boxShadow: "0 4px 20px rgba(245,158,11,0.22)",
              border: "1px solid #FCD34D",
              display: "flex",
              alignItems: "center",
              gap: 7,
              alignSelf: "center",
            }}
          >
            <span style={{ fontSize: "1rem" }}>🙏</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#92400E", whiteSpace: "nowrap" }}>
              Mohon bersabar, kami segera kembali!
            </span>
            <span style={{ fontSize: "0.9rem" }}>✨</span>
          </div>
        </div>

        {/* ══════ DIVIDER ══════ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, alignSelf: "stretch", justifyContent: "center" }}>
          <div id="sep-line" style={{ width: 1.5, flex: 1, maxHeight: "60%", background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.35), transparent)", transformOrigin: "center" }} />
          {/* Spinning gear divider accent */}
          <div id="gear-anim" style={{ padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div style={{ width: 1.5, flex: 1, maxHeight: "60%", background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.35), transparent)" }} />
        </div>

        {/* ══════ RIGHT PANEL — CONTENT ══════ */}
        <div
          id="panel-right"
          style={{
            opacity: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(8px, 1.5vh, 16px)",
            minWidth: 0,
          }}
        >
          {/* Eyebrow tag */}
          <div
            id="eyebrow-tag"
            style={{
              opacity: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              borderRadius: 999,
              padding: "5px 14px",
              alignSelf: "flex-start",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>🚧</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#92400E", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Maintenance in Progress
            </span>
          </div>

          {/* Title — word-by-word cascade */}
          <h1
            style={{
              fontSize: "clamp(1.2rem, 2.8vw, 2rem)",
              fontWeight: 900,
              color: "#1A2340",
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {titleWords.map((word, i) => (
              <span
                key={i}
                className="title-word"
                style={{ display: "inline-block", marginRight: "0.25em", opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Typewriter message */}
          <p style={{
            fontSize: "clamp(0.72rem, 1.5vw, 0.82rem)",
            color: "#64748B",
            lineHeight: 1.6,
            margin: 0,
            minHeight: "2.8em",
          }}>
            {typedText}
            <span style={{ display: "inline-block", width: 2, height: "1em", background: "#F59E0B", marginLeft: 2, animation: "cursor-blink 0.8s step-end infinite", verticalAlign: "text-bottom" }} />
          </p>

          {/* ── COUNTDOWN ───────────────── */}
          {timeLeft && !timeLeft.isEnded && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <Clock style={{ width: 12, height: 12, color: "#F59E0B" }} />
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Estimasi selesai dalam</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[
                  { val: timeLeft.days, label: "Hari", accent: "#1A2340" },
                  { val: timeLeft.hours, label: "Jam", accent: "#F59E0B" },
                  { val: timeLeft.minutes, label: "Menit", accent: "#F97316" },
                  { val: timeLeft.seconds, label: "Detik", accent: "#EF4444" },
                ].map(({ val, label, accent }) => (
                  <div
                    key={label}
                    className="countdown-num"
                    style={{
                      textAlign: "center",
                      background: "#FFFFFF",
                      borderRadius: 12,
                      padding: "8px 4px 6px",
                      border: "1px solid rgba(30,41,59,0.08)",
                      boxShadow: "0 1px 3px rgba(26,35,64,0.05)",
                      opacity: 0,
                    }}
                  >
                    <div style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.7rem)", fontWeight: 900, color: accent, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                      {String(val).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: "0.55rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeLeft?.isEnded && (
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle style={{ width: 16, height: 16, color: "#10B981", flexShrink: 0 }} />
              <p style={{ fontSize: "0.78rem", color: "#065F46", fontWeight: 600, margin: 0 }}>
                Estimasi selesai! Silakan <strong>Periksa Status</strong>.
              </p>
            </div>
          )}

          {/* ── INFO MINI-CARDS ───────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {/* Status */}
            <div className="info-card" style={{ background: "#FFFFFF", borderRadius: 12, padding: "8px 10px", border: "1px solid rgba(30,41,59,0.08)", opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <div id="status-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Status</span>
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#92400E" }}>Pemeliharaan</div>
            </div>
            {/* Scope */}
            <div className="info-card" style={{ background: "#FFFFFF", borderRadius: 12, padding: "8px 10px", border: "1px solid rgba(30,41,59,0.08)", opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <Wrench style={{ width: 9, height: 9, color: "#94A3B8" }} />
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Pekerjaan</span>
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1A2340" }}>Infrastruktur</div>
            </div>
            {/* ETA */}
            <div className="info-card" style={{ background: "#FFFFFF", borderRadius: 12, padding: "8px 10px", border: "1px solid rgba(30,41,59,0.08)", opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <Clock style={{ width: 9, height: 9, color: "#94A3B8" }} />
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Selesai</span>
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1A2340" }}>{countdownEnd}</div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ─────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <a
              id="wa-btn"
              className="action-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                padding: "11px 20px",
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                borderRadius: 14, color: "#fff", fontWeight: 800,
                fontSize: "0.82rem", textDecoration: "none",
                boxShadow: "0 6px 24px rgba(34,197,94,0.30)",
                opacity: 0,
              }}
            >
              <MessageCircle style={{ width: 16, height: 16 }} />
              Hubungi PIC Diklat via WhatsApp
              <span style={{ marginLeft: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>↗</span>
            </a>

            <button
              type="button"
              className="action-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                padding: "9px 20px",
                background: "#FFFFFF", borderRadius: 14, color: "#1A2340",
                fontWeight: 700, fontSize: "0.82rem",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                border: "1.5px solid rgba(30,41,59,0.14)",
                boxShadow: "0 2px 8px rgba(26,35,64,0.06)",
                opacity: 0, fontFamily: "inherit",
              }}
            >
              <RefreshCw id="refresh-icon" style={{ width: 14, height: 14, color: isRefreshing ? "#F59E0B" : "#64748B" }} />
              {isRefreshing ? "Sedang memeriksa..." : "Periksa Status"}
            </button>
          </div>

          {/* ── EMERGENCY CONTACT ─────────── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(30,41,59,0.08)", flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MessageCircle style={{ width: 12, height: 12, color: "#22C55E", flexShrink: 0 }} />
              <span style={{ fontSize: "0.65rem", color: "#64748B", fontWeight: 600 }}>Kontak Darurat PIC Diklat</span>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.65rem", fontWeight: 800, color: "#16A34A", textDecoration: "none" }}>+{waNumber}</a>
          </div>
        </div>
      </main>

      {/* ============================================================
          FOOTER — compact
          ============================================================ */}
      <footer style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "8px 20px", borderTop: "1px solid rgba(30,41,59,0.07)", background: "#FFFFFF", flexShrink: 0 }}>
        <span style={{ fontSize: "0.58rem", color: "#CBD5E1" }}>
          © 2025 Badiklat Kejaksaan RI — Web Kelas Agrasena · Diklat Fungsional Pranata Komputer
        </span>
      </footer>

      {/* ── MOBILE FALLBACK ─────────────────────────────────────── */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes maint-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @media (max-width: 640px) {
          main {
            flex-direction: column !important;
            overflow-y: auto !important;
            height: auto !important;
          }
          #panel-left {
            width: 100% !important;
          }
          #panel-right {
            width: 100% !important;
          }
          /* Divider hidden on mobile */
          main > div:nth-child(2) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
