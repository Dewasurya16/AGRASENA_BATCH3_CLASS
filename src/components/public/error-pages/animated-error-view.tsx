'use client'

import * as React from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Home,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  MessageCircle,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  Cat,
  Coffee,
} from "lucide-react"

export interface AnimatedErrorViewProps {
  code: string // "404" | "403" | "401" | "500"
  badgeText: string
  badgeColor?: "blue" | "amber" | "rose" | "indigo"
  title: string
  description: string
  onReset?: () => void
  errorDigest?: string
}

export function AnimatedErrorView({
  code,
  badgeText,
  badgeColor = "rose",
  title,
  description,
  onReset,
  errorDigest,
}: AnimatedErrorViewProps) {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isResetting, setIsResetting] = React.useState(false)

  // Configure theme & cute illustration according to error code
  const is500 = code === "500"
  const is404 = code === "404"
  const is403 = code === "403"
  const is401 = code === "401"

  const heroImageSrc = is500 ? "/Maintenance.webp" : "/ANIME.webp"

  // Playful speech bubble message for each error code
  const speechBubbleMessage = React.useMemo(() => {
    if (is500) {
      return "Aduh gawat! Server Agrasena lagi korslet dikit, kucing teknisi lagi buru-buru benerin! (｡>﹏<｡) 🐾"
    }
    if (is404) {
      return "Wah nyasar ya kak? Halaman ini gak ketemu di peta kelas Agrasena! (•̀ᴗ•́)و 🗺️"
    }
    if (is403) {
      return "Stop dulu kak! Area rahasia ini khusus Admin Agrasena aja yaa (・ω・)ノ 🛡️"
    }
    if (is401) {
      return "Kunci akses belum dipasang nih, yuk login akun diklat dulu! (ﾉ◕ヮ◕)ﾉ* 🔑"
    }
    return "Ups! Ada kendala kecil di sistem, tenang tim Agrasena 625 lagi siap siaga! ✨"
  }, [is500, is404, is403, is401])

  // Color scheme
  const theme = React.useMemo(() => {
    switch (badgeColor) {
      case "amber":
        return {
          primary: "#D97706",
          badgeBg: "#FEF3C7",
          badgeBorder: "#FCD34D",
          badgeText: "#92400E",
          digitColor: "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #DC2626 100%)",
          accentRing: "rgba(245, 158, 11, 0.2)",
        }
      case "indigo":
        return {
          primary: "#4F46E5",
          badgeBg: "#EEF2FF",
          badgeBorder: "#C7D2FE",
          badgeText: "#3730A3",
          digitColor: "linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #2563EB 100%)",
          accentRing: "rgba(99, 102, 241, 0.2)",
        }
      case "blue":
        return {
          primary: "#0284C7",
          badgeBg: "#E0F2FE",
          badgeBorder: "#BAE6FD",
          badgeText: "#0369A1",
          digitColor: "linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #0D9488 100%)",
          accentRing: "rgba(2, 132, 199, 0.2)",
        }
      case "rose":
      default:
        return {
          primary: "#E11D48",
          badgeBg: "#FFE4E6",
          badgeBorder: "#FECDD3",
          badgeText: "#9F1239",
          digitColor: "linear-gradient(135deg, #F43F5E 0%, #E11D48 50%, #9333EA 100%)",
          accentRing: "rgba(244, 63, 94, 0.2)",
        }
    }
  }, [badgeColor])

  // ══════════════════════════════════════════════════════════
  // ANIME.JS PLAYFUL ANIMATIONS
  // ══════════════════════════════════════════════════════════
  React.useEffect(() => {
    // 1. Chibi Hero bounce entrance
    anime({
      targets: "#chibi-hero-stage",
      scale: [0.75, 1],
      opacity: [0, 1],
      duration: 900,
      easing: "spring(1, 75, 8, 0)",
    })

    // 2. Chibi Hero perpetual breathing float
    anime({
      targets: "#chibi-hero-img-wrap",
      translateY: [-6, 6],
      duration: 3000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 3. Speech bubble pop-in
    anime({
      targets: "#chibi-speech-bubble",
      scale: [0, 1],
      opacity: [0, 1],
      duration: 750,
      delay: 350,
      easing: "spring(1, 80, 8, 0)",
    })

    // 4. Badge wiggles
    anime({
      targets: ".chibi-float-badge",
      translateY: [-4, 4],
      rotate: [-3, 3],
      duration: 2400,
      direction: "alternate",
      loop: true,
      delay: anime.stagger(250),
      easing: "easeInOutSine",
    })

    // 5. Kinetic Digits entry
    anime({
      targets: ".chibi-digit",
      translateY: [40, 0],
      scale: [0.6, 1],
      opacity: [0, 1],
      duration: 750,
      delay: anime.stagger(90, { start: 200 }),
      easing: "spring(1, 80, 9, 0)",
    })

    // 6. Action buttons pop
    anime({
      targets: ".chibi-action-btn",
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(80, { start: 500 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // 7. Sparkle & sweat particles drift
    anime({
      targets: ".chibi-bg-sparkle",
      translateY: [-12, 12],
      translateX: [-8, 8],
      rotate: () => anime.random(-30, 30),
      opacity: () => [anime.random(0.3, 0.5), anime.random(0.7, 1)],
      duration: () => anime.random(2500, 4200),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(150),
      easing: "easeInOutSine",
    })
  }, [code])

  // Interactive Squash and Stretch on Digits or Hero click
  const handleInteractiveBounce = (e: React.MouseEvent<HTMLElement>) => {
    anime({
      targets: e.currentTarget,
      translateY: [
        { value: -20, duration: 150, easing: "easeOutQuad" },
        { value: 4, duration: 120, easing: "easeInQuad" },
        { value: 0, duration: 180, easing: "easeOutBounce" },
      ],
      scaleX: [
        { value: 0.9, duration: 150 },
        { value: 1.15, duration: 120 },
        { value: 1, duration: 180 },
      ],
      scaleY: [
        { value: 1.15, duration: 150 },
        { value: 0.88, duration: 120 },
        { value: 1, duration: 180 },
      ],
    })
  }

  const handleResetClick = () => {
    setIsResetting(true)
    anime({
      targets: "#reset-spin-icon",
      rotate: [0, 720],
      duration: 750,
      easing: "easeInOutQuad",
    })
    setTimeout(() => {
      if (onReset) {
        onReset()
      } else {
        window.location.reload()
      }
    }, 700)
  }

  const digits = code.split("")

  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo Admin Agrasena 625, saya menemui kendala di Web Kelas (${code} - ${title}). Mohon bantuannya ya! 🙏`
  )}`

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100dvh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(145deg, #FFFDF7 0%, #FFF5E8 40%, #FEF3C7 100%)",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "clamp(12px, 2vh, 24px) clamp(16px, 2vw, 32px)",
        color: "#0F172A",
        boxSizing: "border-box",
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
        {/* Soft anime polka dot grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: 0.14,
          }}
        />

        {/* Ambient colored glowing orbs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: "35vw",
            height: "35vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accentRing} 0%, transparent 70%)`,
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(253, 164, 175, 0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Floating Sparkles & Emojis */}
        {[
          { top: "10%", left: "8%", icon: "✨", size: "1.2rem" },
          { top: "22%", left: "45%", icon: "💧", size: "1.1rem" },
          { top: "70%", left: "10%", icon: "🔧", size: "1.3rem" },
          { top: "80%", left: "45%", icon: "🐾", size: "1.2rem" },
          { top: "15%", left: "88%", icon: "⚡", size: "1.3rem" },
          { top: "68%", left: "88%", icon: "☕", size: "1.2rem" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="chibi-bg-sparkle"
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              fontSize: item.size,
              userSelect: "none",
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* ═══ TOP NAVBAR: BRAND IDENTITY ═══ */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          width: "100%",
          maxWidth: 960,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          padding: "4px 0",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
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
              width={26}
              height={26}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.86rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.01em" }}>
                Agrasena 625
              </span>
              <span
                style={{
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  color: "#B45309",
                  background: "#FEF3C7",
                  padding: "1px 7px",
                  borderRadius: 14,
                  border: "1px solid #FCD34D",
                }}
              >
                Batch 3
              </span>
            </div>
            <span style={{ fontSize: "0.56rem", color: "#64748B", fontWeight: 600 }}>
              Web Kelas Diklat Fungsional Pranata Komputer
            </span>
          </div>
        </Link>

        {/* Live Status Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: theme.badgeBg,
            border: `1.5px solid ${theme.badgeBorder}`,
            padding: "4px 12px",
            borderRadius: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: theme.primary,
              boxShadow: `0 0 8px ${theme.primary}`,
              animation: "chibiPulse 1.2s infinite ease-in-out",
            }}
          />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 800,
              color: theme.badgeText,
              letterSpacing: "0.02em",
            }}
          >
            {badgeText}
          </span>
        </div>
      </header>

      {/* ═══ MAIN CHIBI STAGE (1 Screen Centered Bento) ═══ */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          width: "100%",
          maxWidth: 960,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          margin: "clamp(6px, 1.5vh, 16px) 0",
        }}
      >
        <div
          id="chibi-main-card"
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 28,
            padding: "clamp(16px, 2.8vh, 32px) clamp(16px, 3vw, 36px)",
            border: "1.5px solid rgba(255, 255, 255, 0.95)",
            boxShadow: "0 20px 50px -10px rgba(245, 158, 11, 0.16), 0 0 0 2px rgba(253, 230, 138, 0.5)",
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: "clamp(16px, 2.5vw, 36px)",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* ───────────────────────────────────────────────────────────
              LEFT COLUMN: ANIME CHIBI ILLUSTRATION + SPEECH BUBBLE
             ─────────────────────────────────────────────────────────── */}
          <div
            id="chibi-hero-stage"
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
                boxShadow: "0 6px 18px rgba(245, 158, 11, 0.15)",
                borderRadius: 18,
                padding: "8px 14px",
                maxWidth: 320,
                textAlign: "center",
                marginBottom: 6,
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: "1.1rem" }}>{is500 ? "🐱💥" : "✨🐾"}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#92400E",
                    lineHeight: 1.35,
                  }}
                >
                  {speechBubbleMessage}
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
              style={{
                position: "absolute",
                width: "clamp(220px, 28vw, 340px)",
                height: "clamp(220px, 28vw, 340px)",
                borderRadius: "50%",
                background: is500
                  ? "radial-gradient(circle, rgba(254, 243, 199, 0.9) 0%, rgba(254, 205, 211, 0.4) 60%, transparent 80%)"
                  : "radial-gradient(circle, rgba(224, 242, 254, 0.9) 0%, rgba(254, 243, 199, 0.4) 60%, transparent 80%)",
                zIndex: 1,
              }}
            />

            {/* Chibi Anime Hero Image with click bounce */}
            <div
              id="chibi-hero-img-wrap"
              onClick={handleInteractiveBounce}
              title="Klik karakter untuk animasi lucu! 🐾"
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: 380,
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src={heroImageSrc}
                alt="Ilustrasi Anime Chibi Agrasena"
                width={420}
                height={294}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "clamp(160px, 32vh, 290px)",
                  objectFit: "contain",
                  filter: "drop-shadow(0 12px 24px rgba(245, 158, 11, 0.22))",
                }}
              />
            </div>

            {/* Floating Cute Badges */}
            <div
              className="chibi-float-badge"
              style={{
                position: "absolute",
                bottom: "8%",
                left: "4%",
                background: "#fff",
                border: "2px solid #FBBF24",
                borderRadius: 14,
                padding: "4px 9px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                boxShadow: "0 4px 12px rgba(26, 35, 64, 0.08)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>🐾</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#92400E" }}>
                {is500 ? "Mandor Kucing Siap Fix" : "Prakom Agrasena"}
              </span>
            </div>

            <div
              className="chibi-float-badge"
              style={{
                position: "absolute",
                top: "16%",
                right: "4%",
                background: "#FEF2F2",
                border: "2px solid #FCA5A5",
                borderRadius: 14,
                padding: "4px 9px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>⚡</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#991B1B" }}>
                {is500 ? "Auto-Recovery Mode" : "Sistem Terproteksi"}
              </span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              RIGHT COLUMN: KINETIC DIGITS, TITLE, INFO & ACTIONS
             ─────────────────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(10px, 1.6vh, 16px)",
              width: "100%",
              minHeight: 0,
            }}
          >
            {/* 1. Big Kinetic Chibi Digits */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  userSelect: "none",
                }}
              >
                {digits.map((digit, idx) => (
                  <span
                    key={idx}
                    className="chibi-digit"
                    onClick={handleInteractiveBounce}
                    title="Klik angka buat goyang! 🎉"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "clamp(3.2rem, 6.5vw, 4.8rem)",
                      fontWeight: 900,
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      background: theme.digitColor,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      cursor: "pointer",
                      display: "inline-block",
                      filter: "drop-shadow(0 4px 12px rgba(244, 63, 94, 0.25))",
                    }}
                  >
                    {digit}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: 6,
                }}
              >
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: theme.primary,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {is500 ? "Server Error" : is404 ? "Not Found" : is403 ? "Forbidden" : "Unauthorized"}
                </span>
                <span style={{ fontSize: "0.58rem", color: "#64748B", fontWeight: 600 }}>
                  Agrasena System Alert
                </span>
              </div>
            </div>

            {/* 2. Main Title & Description */}
            <div>
              <h1
                style={{
                  fontSize: "clamp(1.2rem, 2.2vw, 1.85rem)",
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: "-0.025em",
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  fontSize: "clamp(0.72rem, 1.1vw, 0.84rem)",
                  color: "#475569",
                  lineHeight: 1.5,
                  margin: "6px 0 0",
                  fontWeight: 500,
                }}
              >
                {description}
              </p>
            </div>

            {/* 3. Cute Diagnostics / Solution Card */}
            <div
              style={{
                background: "#FFFBEB",
                border: "1.5px solid #FDE68A",
                borderRadius: 16,
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Coffee size={14} color="#D97706" />
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#92400E" }}>
                  Status: Server Butuh Istirahat Sejenak ☕
                </span>
              </div>
              <span style={{ fontSize: "0.62rem", color: "#78350F", lineHeight: 1.35 }}>
                Silakan klik tombol <b>Muat Ulang</b> di bawah untuk mencoba kembali. Jika kendala masih berlanjut, hubungi Admin Agrasena.
              </span>
              {errorDigest && (
                <div
                  style={{
                    fontSize: "0.56rem",
                    fontFamily: "monospace",
                    color: "#92400E",
                    background: "rgba(245, 158, 11, 0.12)",
                    padding: "2px 6px",
                    borderRadius: 6,
                    marginTop: 2,
                    display: "inline-block",
                  }}
                >
                  Digest ID: {errorDigest}
                </div>
              )}
            </div>

            {/* 4. Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Primary: Reset / Refresh */}
              {onReset ? (
                <button
                  type="button"
                  onClick={handleResetClick}
                  disabled={isResetting}
                  className="chibi-action-btn"
                  style={{
                    flex: 1,
                    minWidth: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "clamp(9px, 1.3vh, 12px) 16px",
                    background: "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)",
                    color: "#fff",
                    borderRadius: 14,
                    fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                    fontWeight: 800,
                    border: "none",
                    cursor: isResetting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px rgba(225, 29, 72, 0.35)",
                    fontFamily: "inherit",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <RotateCcw
                    id="reset-spin-icon"
                    size={16}
                    color="#fff"
                  />
                  <span>{isResetting ? "Memuat Ulang..." : "Muat Ulang (Reset)"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="chibi-action-btn"
                  style={{
                    flex: 1,
                    minWidth: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "clamp(9px, 1.3vh, 12px) 16px",
                    background: "#ffffff",
                    border: "2px solid #E2E8F0",
                    color: "#0F172A",
                    borderRadius: 14,
                    fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    fontFamily: "inherit",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <ArrowLeft size={16} />
                  <span>Halaman Sebelumnya</span>
                </button>
              )}

              {/* Secondary: Beranda */}
              <Link
                href="/"
                className="chibi-action-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "clamp(9px, 1.3vh, 12px) 16px",
                  background: "#0D3830",
                  color: "#ffffff",
                  borderRadius: 14,
                  fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(13, 56, 48, 0.25)",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Home size={16} />
                <span>Ke Beranda</span>
              </Link>

              {/* Tertiary: WhatsApp Admin */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chibi-action-btn"
                title="Hubungi Admin Agrasena via WhatsApp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "clamp(9px, 1.3vh, 12px) 14px",
                  background: "#F0FDF4",
                  border: "1.5px solid #86EFAC",
                  color: "#166534",
                  borderRadius: 14,
                  fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                  fontWeight: 800,
                  textDecoration: "none",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <MessageCircle size={16} color="#16A34A" />
                <span>Chat Admin</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ FOOTER: AGRASENA 625 BRANDING ═══ */}
      <footer
        style={{
          position: "relative",
          zIndex: 20,
          textAlign: "center",
          flexShrink: 0,
          padding: "4px 0 0",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(6px)",
            padding: "3px 14px",
            borderRadius: 14,
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <span style={{ fontSize: "0.56rem", fontWeight: 700, color: "#64748B" }}>
            © 2025 Agrasena 625 • Diklat Fungsional Pranata Komputer Kejaksaan RI
          </span>
          <span style={{ fontSize: "0.6rem" }}>💛</span>
        </div>
      </footer>

      {/* ═══ RESPONSIVE CSS INLINE ═══ */}
      <style>{`
        @keyframes chibiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        @media (max-width: 768px) {
          #chibi-main-card {
            grid-template-columns: 1fr !important;
            padding: 14px 16px !important;
            gap: 12px !important;
            overflow-y: auto !important;
            max-height: calc(100dvh - 80px) !important;
          }
          #chibi-hero-stage {
            height: auto !important;
            max-height: 140px !important;
          }
          #chibi-speech-bubble {
            display: none !important;
          }
          .chibi-float-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
