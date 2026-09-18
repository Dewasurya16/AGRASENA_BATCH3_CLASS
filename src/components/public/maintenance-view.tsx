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
  AlertTriangle,
  CheckCircle,
  Wrench,
  Info,
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

  // ============================================================
  // ANIME.JS — Orchestrated entrance & ambient animations
  // Vibe: Soft Structuralism (Gambar 1 reference)
  // ============================================================
  useEffect(() => {
    // 1. Logo drops in with springy bounce
    anime({
      targets: "#logo-mark",
      translateY: [-24, 0],
      opacity: [0, 1],
      duration: 700,
      easing: "spring(1, 80, 10, 0)",
    })

    // 2. Hero illustration scales up from 88%
    anime({
      targets: "#hero-illustration",
      scale: [0.88, 1],
      opacity: [0, 1],
      duration: 1100,
      delay: 120,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 3. Staggered content elements slide up
    anime({
      targets: ".maint-enter",
      translateY: [36, 0],
      opacity: [0, 1],
      duration: 820,
      delay: anime.stagger(90, { start: 180 }),
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 4. Gear — continuous slow spin
    anime({
      targets: "#gear-spin",
      rotate: [0, 360],
      duration: 8000,
      loop: true,
      easing: "linear",
    })

    // 5. Tool badge — float up/down
    anime({
      targets: "#badge-tool",
      translateY: [-7, 7],
      duration: 2800,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 6. Note badge — float opposite + slight tilt
    anime({
      targets: "#badge-note",
      translateY: [6, -8],
      rotate: [-2, 2],
      duration: 3400,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 7. Background spark dots — twinkle
    anime({
      targets: ".spark-dot",
      opacity: () => [0.1, anime.random(0.5, 1)],
      scale: () => [0.6, anime.random(1.2, 1.7)],
      duration: () => anime.random(1200, 2800),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(220),
      easing: "easeInOutSine",
    })

    // 8. Separator line draws in from center
    anime({
      targets: "#separator-line",
      scaleX: [0, 1],
      opacity: [0, 1],
      duration: 900,
      delay: 600,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // 9. Progress dots — wave bounce
    anime({
      targets: ".progress-dot",
      translateY: [-7, 0],
      opacity: [0.3, 1],
      duration: 500,
      direction: "alternate",
      loop: true,
      delay: anime.stagger(160),
      easing: "easeInOutQuad",
    })
  }, [])

  // ============================================================
  // COUNTDOWN TIMER
  // ============================================================
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
    anime({
      targets: "#refresh-icon",
      rotate: [0, 360],
      duration: 600,
      easing: "easeInOutQuad",
    })
    setTimeout(() => window.location.reload(), 700)
  }

  const waNumber = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const waUrl =
    `https://wa.me/${waNumber}?text=` +
    encodeURIComponent(
      "Halo Tim Diklat Prakom Kejaksaan RI, saya ingin menanyakan status pemeliharaan Web Kelas Agrasena."
    )

  const lastUpdated = config.updatedAt
    ? new Date(config.updatedAt).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Makassar",
      })
    : null

  const countdownEnd = config.estimatedEnd
    ? new Date(config.estimatedEnd).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Makassar",
      }) + " WITA"
    : "Segera"

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "#FAFAF8",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ============================================================
          BACKGROUND — Subtle construction-site dashes + amber glows
          ============================================================ */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Top-right diagonal dashes */}
        <svg
          style={{ position: "absolute", top: 0, right: 0, opacity: 0.055 }}
          width="320"
          height="240"
          viewBox="0 0 320 240"
        >
          <line x1="320" y1="0" x2="0" y2="240" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="320" y1="40" x2="40" y2="240" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="320" y1="80" x2="80" y2="240" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
        </svg>

        {/* Bottom-left diagonal dashes */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.045 }}
          width="280"
          height="200"
          viewBox="0 0 280 200"
        >
          <line x1="0" y1="200" x2="280" y2="0" stroke="#1A2340" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="0" y1="150" x2="280" y2="0" stroke="#1A2340" strokeWidth="1" strokeDasharray="6 8" />
        </svg>

        {/* Amber radial glow — top-right */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "8%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Orange radial glow — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: "5%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Spark dots */}
        {[
          { top: "5%", left: "10%", s: 6, c: "#F59E0B" },
          { top: "10%", left: "78%", s: 5, c: "#F97316" },
          { top: "22%", left: "92%", s: 4, c: "#F59E0B" },
          { top: "60%", left: "95%", s: 5, c: "#F59E0B" },
          { top: "80%", left: "88%", s: 4, c: "#F97316" },
          { top: "85%", left: "12%", s: 6, c: "#F59E0B" },
          { top: "70%", left: "3%", s: 4, c: "#F97316" },
          { top: "45%", left: "1%", s: 5, c: "#F59E0B" },
        ].map((d, i) => (
          <span
            key={i}
            className="spark-dot"
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              width: d.s,
              height: d.s,
              borderRadius: "50%",
              background: d.c,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* ============================================================
          HEADER — Logo + Admin/Preview Banner
          ============================================================ */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          padding: "20px 24px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Logo wordmark */}
        <div
          id="logo-mark"
          style={{ opacity: 0, display: "flex", alignItems: "center", gap: 10 }}
        >
          <Image
            src="/Logo.png"
            alt="Kejaksaan RI"
            width={36}
            height={36}
            style={{ objectFit: "contain" }}
          />
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#64748B",
                textTransform: "uppercase",
              }}
            >
              Badiklat Kejaksaan RI
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#1A2340",
                lineHeight: 1.1,
              }}
            >
              Portal Web Kelas Agrasena
            </div>
          </div>
        </div>

        {/* Admin bypass banner */}
        {isAdmin && (
          <div
            className="maint-enter"
            style={{
              width: "100%",
              maxWidth: 680,
              background: "rgba(245,158,11,0.10)",
              border: "1.5px solid rgba(245,158,11,0.4)",
              borderRadius: 18,
              padding: "10px 16px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck
                style={{ width: 18, height: 18, color: "#D97706", flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#92400E",
                    margin: 0,
                  }}
                >
                  Sesi Administrator Aktif
                </p>
                <p
                  style={{
                    fontSize: "0.65rem",
                    color: "#64748B",
                    margin: 0,
                  }}
                >
                  Pengunjung umum melihat layar ini. Anda dapat bypass atau kembali ke
                  dashboard.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <a
                href="/?bypass=1"
                style={{
                  padding: "6px 14px",
                  borderRadius: 12,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: "rgba(245,158,11,0.15)",
                  color: "#92400E",
                  border: "1px solid rgba(245,158,11,0.4)",
                  textDecoration: "none",
                }}
              >
                Bypass Portal ↗
              </a>
              <Link
                href="/admin/dashboard"
                style={{
                  padding: "6px 14px",
                  borderRadius: 12,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  background: "#D97706",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Preview mode badge */}
        {isPreview && !isAdmin && (
          <div
            className="maint-enter"
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              fontSize: "0.68rem",
              fontWeight: 700,
              background: "rgba(100,116,139,0.10)",
              color: "#64748B",
              border: "1px solid rgba(30,41,59,0.08)",
            }}
          >
            👁️ Mode Pratinjau Administrator
          </div>
        )}
      </header>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 16px 32px",
        }}
      >
        {/* ── HERO ILLUSTRATION ─────────────────────────────────── */}
        <div
          id="hero-illustration"
          style={{
            opacity: 0,
            width: "100%",
            maxWidth: 640,
            position: "relative",
          }}
        >
          <Image
            src="/Maintenance.webp"
            alt="Tim Pranata Komputer Kejaksaan RI sedang melakukan pemeliharaan sistem Web Kelas Agrasena"
            width={640}
            height={448}
            priority
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 60px rgba(26,35,64,0.12))",
            }}
          />

          {/* Floating badge — "Sedang diperbaiki" */}
          <div
            id="badge-tool"
            style={{
              position: "absolute",
              top: "8%",
              left: "-2%",
              background: "#FFFFFF",
              borderRadius: 14,
              padding: "8px 14px",
              boxShadow: "0 4px 24px rgba(26,35,64,0.12)",
              border: "1px solid rgba(30,41,59,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Wrench style={{ width: 16, height: 16, color: "#F97316" }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#1A2340",
                whiteSpace: "nowrap",
              }}
            >
              Sedang diperbaiki
            </span>
          </div>

          {/* Floating badge — "Mohon bersabar" */}
          <div
            id="badge-note"
            style={{
              position: "absolute",
              top: "5%",
              right: "-2%",
              background: "#FEF3C7",
              borderRadius: 14,
              padding: "8px 14px",
              boxShadow: "0 4px 24px rgba(245,158,11,0.25)",
              border: "1px solid #FCD34D",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Info style={{ width: 14, height: 14, color: "#92400E" }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#92400E",
                whiteSpace: "nowrap",
              }}
            >
              Mohon bersabar 🙏
            </span>
          </div>
        </div>

        {/* ── SEPARATOR WITH BOUNCING DOTS ──────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: -8,
            marginBottom: 8,
          }}
        >
          <div
            id="separator-line"
            style={{
              transformOrigin: "center",
              width: "clamp(40px, 12vw, 80px)",
              height: 2,
              borderRadius: 2,
              background: "linear-gradient(90deg, transparent, #F59E0B)",
            }}
          />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="progress-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === 1 ? "#F59E0B" : "#F97316",
                display: "inline-block",
                opacity: 0.3,
              }}
            />
          ))}
          <div
            style={{
              width: "clamp(40px, 12vw, 80px)",
              height: 2,
              borderRadius: 2,
              background: "linear-gradient(90deg, #F59E0B, transparent)",
            }}
          />
        </div>

        {/* ── MAIN TEXT BLOCK ───────────────────────────────────── */}
        <div
          className="maint-enter"
          style={{ textAlign: "center", maxWidth: 600, padding: "0 8px" }}
        >
          {/* Eyebrow pill tag with spinning gear */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              borderRadius: 999,
              padding: "5px 14px",
              marginBottom: 14,
            }}
          >
            <div
              id="gear-spin"
              style={{ display: "flex", alignItems: "center" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#92400E"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "#92400E",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Maintenance in Progress
            </span>
          </div>

          {/* H1 Title */}
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4.5vw, 2.4rem)",
              fontWeight: 900,
              color: "#1A2340",
              lineHeight: 1.2,
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            {config.title || "Portal Sedang Dalam Pemeliharaan Sistem"}
          </h1>

          {/* Message */}
          <p
            style={{
              fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
              color: "#64748B",
              lineHeight: 1.7,
              margin: "0 auto 6px",
              maxWidth: 540,
            }}
          >
            {config.message}
          </p>
        </div>

        {/* ── COUNTDOWN TIMER ───────────────────────────────────── */}
        {timeLeft && !timeLeft.isEnded && (
          <div
            className="maint-enter"
            style={{ marginTop: 20, width: "100%", maxWidth: 560 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
                justifyContent: "center",
              }}
            >
              <Clock style={{ width: 14, height: 14, color: "#F59E0B" }} />
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Estimasi selesai dalam
              </span>
            </div>

            {/* Double-bezel outer shell */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(30,41,59,0.08)",
                borderRadius: 24,
                padding: 4,
                boxShadow:
                  "0 4px 32px rgba(26,35,64,0.07), 0 1px 4px rgba(26,35,64,0.04)",
              }}
            >
              {/* Inner core */}
              <div
                style={{
                  background: "#FAFAF8",
                  borderRadius: 20,
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                }}
              >
                {[
                  { val: timeLeft.days, label: "Hari", accent: "#1A2340" },
                  { val: timeLeft.hours, label: "Jam", accent: "#F59E0B" },
                  { val: timeLeft.minutes, label: "Menit", accent: "#F97316" },
                  { val: timeLeft.seconds, label: "Detik", accent: "#EF4444" },
                ].map(({ val, label, accent }) => (
                  <div
                    key={label}
                    style={{
                      textAlign: "center",
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "12px 6px 10px",
                      border: "1px solid rgba(30,41,59,0.08)",
                      boxShadow: "0 1px 3px rgba(26,35,64,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                        fontWeight: 900,
                        color: accent,
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {String(val).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: "#94A3B8",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Countdown ended notice */}
        {timeLeft?.isEnded && (
          <div
            className="maint-enter"
            style={{
              marginTop: 16,
              width: "100%",
              maxWidth: 560,
              background: "rgba(16,185,129,0.08)",
              border: "1.5px solid rgba(16,185,129,0.3)",
              borderRadius: 18,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <CheckCircle
              style={{ width: 18, height: 18, color: "#10B981", flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: "0.8rem",
                color: "#065F46",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Estimasi selesai telah tiba! Silakan klik{" "}
              <strong>Periksa Status</strong> di bawah.
            </p>
          </div>
        )}

        {/* Last updated strip */}
        {lastUpdated && (
          <div
            className="maint-enter"
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <AlertTriangle
              style={{ width: 12, height: 12, color: "#94A3B8" }}
            />
            <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>
              Terakhir diperbarui oleh{" "}
              <strong style={{ color: "#64748B" }}>{config.updatedBy}</strong>{" "}
              pada {lastUpdated} WITA
            </span>
          </div>
        )}

        {/* ── ACTION BUTTONS ────────────────────────────────────── */}
        <div
          className="maint-enter"
          style={{
            marginTop: 20,
            width: "100%",
            maxWidth: 560,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Primary — WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 24px",
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              borderRadius: 18,
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.875rem",
              textDecoration: "none",
              boxShadow: "0 6px 24px rgba(34,197,94,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <MessageCircle style={{ width: 18, height: 18 }} />
            Hubungi PIC Diklat via WhatsApp
            <span
              style={{
                marginLeft: 4,
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
              }}
            >
              ↗
            </span>
          </a>

          {/* Secondary — Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "12px 24px",
              background: "#FFFFFF",
              borderRadius: 18,
              color: "#1A2340",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              border: "1.5px solid rgba(30,41,59,0.14)",
              boxShadow: "0 2px 8px rgba(26,35,64,0.06)",
              opacity: isRefreshing ? 0.65 : 1,
              transition: "transform 0.2s, box-shadow 0.2s",
              fontFamily: "inherit",
            }}
          >
            <RefreshCw
              id="refresh-icon"
              style={{
                width: 16,
                height: 16,
                color: isRefreshing ? "#F59E0B" : "#64748B",
              }}
            />
            {isRefreshing ? "Sedang memeriksa..." : "Periksa Status"}
          </button>
        </div>

        {/* ── STATUS INFO CARD (Double-bezel) ───────────────────── */}
        <div
          className="maint-enter"
          style={{
            marginTop: 20,
            width: "100%",
            maxWidth: 560,
            background: "#FFFFFF",
            border: "1px solid rgba(30,41,59,0.08)",
            borderRadius: 24,
            padding: 5,
            boxShadow:
              "0 4px 32px rgba(26,35,64,0.07), 0 1px 4px rgba(26,35,64,0.04)",
          }}
        >
          <div
            style={{
              background: "#FAFAF8",
              borderRadius: 20,
              padding: "16px 20px",
            }}
          >
            {/* Three mini-cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
              }}
            >
              {/* Status card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "12px 14px",
                  border: "1px solid rgba(30,41,59,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#F59E0B",
                      boxShadow: "0 0 0 3px rgba(245,158,11,0.2)",
                      animation: "maint-dot-pulse 1.5s infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Status
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#92400E",
                  }}
                >
                  Dalam Pemeliharaan
                </div>
              </div>

              {/* Pekerjaan card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "12px 14px",
                  border: "1px solid rgba(30,41,59,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <Wrench style={{ width: 12, height: 12, color: "#64748B" }} />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Pekerjaan
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#1A2340",
                  }}
                >
                  Infrastruktur &amp; Kurikulum
                </div>
              </div>

              {/* Selesai card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "12px 14px",
                  border: "1px solid rgba(30,41,59,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <Clock style={{ width: 12, height: 12, color: "#64748B" }} />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Selesai
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#1A2340",
                  }}
                >
                  {countdownEnd}
                </div>
              </div>
            </div>

            {/* Emergency contact strip */}
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "#FFFFFF",
                borderRadius: 12,
                border: "1px solid rgba(30,41,59,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageCircle
                  style={{
                    width: 14,
                    height: 14,
                    color: "#22C55E",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "#64748B",
                    fontWeight: 600,
                  }}
                >
                  Kontak Darurat PIC Diklat
                </span>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#16A34A",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                +{waNumber}
              </a>
            </div>
          </div>
        </div>

        <div
          className="maint-enter"
          style={{ marginTop: 20, textAlign: "center" }}
        >
          <p style={{ fontSize: "0.62rem", color: "#94A3B8", margin: 0 }}>
            🔧 Infrastruktur dikelola oleh Tim Pranata Komputer Kejaksaan RI
          </p>
        </div>
      </main>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "14px 20px",
          borderTop: "1px solid rgba(30,41,59,0.08)",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>
            © 2025 Badan Pendidikan dan Pelatihan Kejaksaan Republik Indonesia
          </span>
          <span
            style={{
              width: 1,
              height: 10,
              background: "rgba(30,41,59,0.08)",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>
            Web Kelas Agrasena — Diklat Fungsional Pranata Komputer
          </span>
        </div>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes maint-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @media (max-width: 480px) {
          #badge-tool, #badge-note { display: none !important; }
        }
      `}</style>
    </div>
  )
}
