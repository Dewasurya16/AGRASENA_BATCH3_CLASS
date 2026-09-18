"use client"

import React, { useEffect, useRef, useState } from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import { Clock, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react"
import { MaintenanceConfig } from "@/lib/maintenance"

interface MaintenanceViewProps {
  config: MaintenanceConfig
  isPreview?: boolean
  isAdmin?: boolean
}

export function MaintenanceView({ config, isPreview = false, isAdmin = false }: MaintenanceViewProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)

  // ============================================================
  // ANIME.JS — FULL ORCHESTRATED ANIMATIONS
  // ============================================================
  useEffect(() => {
    // 1. Hero section slides up from below
    anime({
      targets: ".maint-enter",
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 900,
      delay: anime.stagger(80, { start: 200 }),
      easing: "easeOutExpo",
    })

    // 2. Characters float upward gently (breathing/idle)
    anime({
      targets: "#char-left",
      translateY: [0, -10],
      duration: 3500,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    anime({
      targets: "#char-right",
      translateY: [-5, 8],
      duration: 4000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // 3. Left doodle: code bubble floats & rotates
    anime({
      targets: "#doodle-code",
      translateY: [-8, 5],
      rotate: [-5, 5],
      duration: 2800,
      direction: "alternate",
      loop: true,
      easing: "easeInOutQuad",
    })

    // 4. Right doodle: checklist floats opposite
    anime({
      targets: "#doodle-checklist",
      translateY: [5, -8],
      rotate: [5, -5],
      duration: 3200,
      direction: "alternate",
      loop: true,
      easing: "easeInOutQuad",
    })

    // 5. Stars twinkling
    anime({
      targets: ".star-dot",
      opacity: () => [anime.random(0.05, 0.2), anime.random(0.8, 1)],
      scale: () => [0.7, anime.random(1.2, 1.8)],
      duration: () => anime.random(1200, 3500),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(180),
      easing: "easeInOutSine",
    })

    // 6. Cross sparkle icons (+ shape) winking in/out
    anime({
      targets: ".sparkle-plus",
      opacity: () => [0, anime.random(0.5, 1), 0],
      scale: [0.5, 1.3, 0.5],
      duration: () => anime.random(1800, 3000),
      loop: true,
      delay: anime.stagger(350),
      easing: "easeInOutQuad",
    })

    // 7. Coffee cup steam — path draw animation
    const steamTimeline = anime.timeline({ loop: true })
    steamTimeline
      .add({
        targets: "#steam-1",
        translateY: [0, -18],
        opacity: [0, 0.9, 0],
        duration: 1600,
        easing: "easeOutCubic",
      })
      .add({
        targets: "#steam-2",
        translateY: [0, -22],
        opacity: [0, 0.8, 0],
        duration: 1800,
        easing: "easeOutCubic",
        offset: 200,
      })
      .add({
        targets: "#steam-3",
        translateY: [0, -16],
        opacity: [0, 0.7, 0],
        duration: 1500,
        easing: "easeOutCubic",
        offset: 450,
      })

    // 8. Progress bar shimmer beam slides right repeatedly
    anime({
      targets: "#shimmer-beam",
      translateX: ["-110%", "220%"],
      duration: 1800,
      loop: true,
      easing: "easeInOutCubic",
      delay: 300,
    })

    // 9. Progress bar fills to ~85% to indicate "loading"
    anime({
      targets: "#progress-fill",
      width: ["0%", "85%"],
      duration: 3000,
      easing: "easeInOutExpo",
    })

    // 10. Info card gentle glow pulse
    anime({
      targets: "#info-card",
      boxShadow: [
        "0 0 0px rgba(129,140,248,0)",
        "0 0 40px rgba(129,140,248,0.25)",
        "0 0 0px rgba(129,140,248,0)",
      ],
      duration: 3500,
      loop: true,
      easing: "easeInOutSine",
    })

    // 11. Simulate progress percentage counter
    let progress = 0
    const progressTimer = setInterval(() => {
      progress += Math.random() * 3
      if (progress >= 85) {
        clearInterval(progressTimer)
        progress = 85
      }
      setProgressWidth(Math.min(progress, 85))
    }, 200)

    return () => clearInterval(progressTimer)
  }, [])

  // ============================================================
  // LIVE COUNTDOWN TIMER
  // ============================================================
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
    const update = () => {
      const now = Date.now()
      const diff = targetTime - now
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
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [config.estimatedEnd])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => window.location.reload(), 700)
  }

  const waNumber = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Halo Tim Panitia Diklat Prakom Kejaksaan RI, saya ingin menanyakan status pemeliharaan Web Kelas Agrasena."
  )}`

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0D0F1A 0%, #101525 40%, #0D0F1A 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ================================================================ */}
      {/* BACKGROUND — STARS, RADIAL AURA, AMBIENT PARTICLES               */}
      {/* ================================================================ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main radial aura matching Gambar 2's center glow */}
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "70vw",
            height: "70vh",
            background:
              "radial-gradient(ellipse at center, rgba(63,70,140,0.35) 0%, rgba(40,50,110,0.18) 45%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />

        {/* Small static star dots scattered across background */}
        {[
          { top: "4%", left: "7%", s: 2 },
          { top: "8%", left: "22%", s: 1.5 },
          { top: "5%", left: "55%", s: 2.5 },
          { top: "3%", left: "72%", s: 1.5 },
          { top: "6%", left: "88%", s: 2 },
          { top: "15%", left: "92%", s: 1.5 },
          { top: "25%", left: "95%", s: 2 },
          { top: "80%", left: "5%", s: 1.5 },
          { top: "88%", left: "15%", s: 2 },
          { top: "92%", left: "88%", s: 1.5 },
          { top: "85%", left: "75%", s: 2 },
          { top: "75%", left: "92%", s: 1.5 },
          { top: "12%", left: "38%", s: 1.5 },
          { top: "70%", left: "50%", s: 1 },
          { top: "30%", left: "4%", s: 1.5 },
          { top: "55%", left: "96%", s: 1.5 },
        ].map((star, i) => (
          <span
            key={i}
            className="star-dot absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.s}px`,
              height: `${star.s}px`,
              opacity: 0.5,
            }}
          />
        ))}

        {/* Sparkle Plus Signs (+ cross shapes — matching Gambar 2) */}
        {[
          { top: "9%", left: "14%", size: 14, color: "#7c86e0" },
          { top: "6%", left: "83%", size: 16, color: "#9fa8da" },
          { top: "45%", left: "2%", size: 12, color: "#7c86e0" },
          { top: "48%", left: "97%", size: 13, color: "#9fa8da" },
          { top: "82%", left: "20%", size: 11, color: "#7c86e0" },
          { top: "78%", left: "80%", size: 12, color: "#9fa8da" },
        ].map((sp, i) => (
          <svg
            key={i}
            className="sparkle-plus absolute"
            style={{ top: sp.top, left: sp.left, opacity: 0 }}
            width={sp.size}
            height={sp.size}
            viewBox="0 0 20 20"
          >
            <rect x="8" y="0" width="4" height="20" rx="2" fill={sp.color} />
            <rect x="0" y="8" width="20" height="4" rx="2" fill={sp.color} />
          </svg>
        ))}
      </div>

      {/* ================================================================ */}
      {/* TOP STRIP — ADMIN BANNER / PREVIEW BADGE                         */}
      {/* ================================================================ */}
      <div className="relative z-30 w-full flex flex-col items-center pt-5 px-4 gap-3">
        {isAdmin && (
          <div
            className="maint-enter w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl border"
            style={{
              background: "rgba(217,119,6,0.12)",
              borderColor: "rgba(217,119,6,0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: "#FCD34D" }} />
              <div>
                <p className="text-xs font-black" style={{ color: "#FCD34D" }}>
                  Sesi Administrator Aktif
                </p>
                <p className="text-[11px] text-slate-300">
                  Pengunjung umum melihat layar ini. Anda bisa bypass atau kembali ke dashboard.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href="/?bypass=1"
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition"
                style={{
                  background: "rgba(217,119,6,0.2)",
                  color: "#FDE68A",
                  border: "1px solid rgba(217,119,6,0.4)",
                }}
              >
                Bypass Portal
              </a>
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-xl text-xs font-black text-white transition"
                style={{ background: "#D97706" }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}

        {isPreview && !isAdmin && (
          <div
            className="maint-enter inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: "rgba(99,102,241,0.2)",
              color: "#A5B4FC",
              border: "1px solid rgba(99,102,241,0.4)",
            }}
          >
            <span>👁️</span> Mode Pratinjau Administrator
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* MAIN HERO — FULL REPLICA OF GAMBAR 2 LAYOUT                      */}
      {/* ================================================================ */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 py-4">
        {/* 
          HERO COMPOSITION: [LEFT CHAR] [CENTER HUD] [RIGHT CHAR]
          This exactly mirrors Gambar 2 — the two chibi prosecutors
          sit on either side with the Loading HUD in the center.
        */}
        <div className="relative w-full max-w-5xl flex items-end justify-center gap-0 sm:gap-4">

          {/* ======== LEFT CHARACTER ======== */}
          <div
            id="char-left"
            className="maint-enter relative shrink-0 z-10 hidden sm:block"
            style={{ width: "clamp(160px, 22vw, 280px)", marginBottom: "-10px" }}
          >
            {/* Floating Code Doodle Badge above-left character */}
            <div
              id="doodle-code"
              className="absolute"
              style={{ top: "-10%", left: "-5%", zIndex: 20 }}
            >
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold"
                style={{
                  background: "rgba(30,35,75,0.85)",
                  border: "1.5px solid rgba(99,102,241,0.6)",
                  color: "#A5B4FC",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 0 18px rgba(99,102,241,0.25)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                &lt;/&gt;
              </div>
            </div>

            {/* Use the combined full image — crop left half via objectPosition */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "1024/567", position: "relative" }}
            >
              <Image
                src="/maintenance-anime.png"
                alt="Jaksa Pranata Komputer Pria"
                fill
                className="object-cover"
                style={{ objectPosition: "0% center" }}
                priority
              />
              {/* Fade right edge to blend into center */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, transparent 0%, transparent 55%, #101525 100%)",
                }}
              />
            </div>
          </div>

          {/* ======== CENTER HUD — Exact Gambar 2 Composition ======== */}
          <div
            className="maint-enter flex flex-col items-center text-center z-20 shrink-0"
            style={{ minWidth: "min(320px, 90vw)", maxWidth: "380px", marginBottom: "40px" }}
          >
            {/* Coffee cup + animated steam */}
            <div className="relative flex items-end justify-center mb-1" style={{ height: "72px", width: "80px" }}>
              {/* Steam particles */}
              <svg
                className="absolute"
                style={{ bottom: "52px", left: "50%", transform: "translateX(-50%)" }}
                width="48"
                height="36"
                viewBox="0 0 48 36"
                overflow="visible"
              >
                <path id="steam-1" d="M12 32 Q10 20 14 10" stroke="#8B9FE8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0" />
                <path id="steam-2" d="M24 34 Q26 18 22 6" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0" />
                <path id="steam-3" d="M36 32 Q38 20 34 12" stroke="#8B9FE8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0" />
              </svg>

              {/* Coffee cup SVG — matching Gambar 2's simple line-art style */}
              <svg width="52" height="48" viewBox="0 0 52 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="18" width="34" height="24" rx="4" stroke="#8B9FE8" strokeWidth="2" fill="rgba(30,40,90,0.4)" />
                <path d="M40 23 Q50 23 50 30 Q50 37 40 37" stroke="#8B9FE8" strokeWidth="2" strokeLinecap="round" fill="none" />
                <rect x="2" y="42" width="42" height="4" rx="2" fill="#8B9FE8" opacity="0.5" />
              </svg>
            </div>

            {/* "Loading..." Title — exact Gambar 2 font weight & glow */}
            <h1
              className="font-black leading-none"
              style={{
                fontSize: "clamp(2rem, 5vw, 2.8rem)",
                color: "#FFFFFF",
                textShadow: "0 0 30px rgba(165,180,252,0.5), 0 0 60px rgba(129,140,248,0.25)",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Loading...
            </h1>

            {/* Progress bar — pill shape, indigo→purple gradient with shimmer */}
            <div
              className="relative w-full overflow-hidden rounded-full"
              style={{
                height: "14px",
                background: "rgba(30,35,80,0.8)",
                border: "1.5px solid rgba(99,102,241,0.35)",
                marginBottom: "14px",
                boxShadow: "0 0 20px rgba(99,102,241,0.2)",
              }}
            >
              {/* Animated fill */}
              <div
                id="progress-fill"
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progressWidth}%`,
                  background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #8B5CF6 100%)",
                  transition: "width 0.3s ease",
                }}
              />
              {/* Shimmer beam */}
              <div
                id="shimmer-beam"
                className="absolute inset-y-0 w-16 -skew-x-12"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                }}
              />
            </div>

            {/* "Please wait a moment..." subtitle */}
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: 500 }}>
              Please wait a moment...
            </p>
            <p style={{ color: "#64748B", fontSize: "0.72rem", marginTop: "4px" }}>
              Sedang pemeliharaan sistem
            </p>
          </div>

          {/* ======== RIGHT CHARACTER ======== */}
          <div
            id="char-right"
            className="maint-enter relative shrink-0 z-10 hidden sm:block"
            style={{ width: "clamp(160px, 22vw, 280px)", marginBottom: "-10px" }}
          >
            {/* Floating Checklist Doodle Badge above-right character */}
            <div
              id="doodle-checklist"
              className="absolute"
              style={{ top: "-10%", right: "-5%", zIndex: 20 }}
            >
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                style={{
                  background: "rgba(30,35,75,0.85)",
                  border: "1.5px solid rgba(99,102,241,0.6)",
                  color: "#A5B4FC",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 0 18px rgba(99,102,241,0.25)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                sync...
              </div>
            </div>

            {/* Right half of the anime image */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "1024/567" }}
            >
              <Image
                src="/maintenance-anime.png"
                alt="Jaksa Pranata Komputer Wanita"
                fill
                className="object-cover"
                style={{ objectPosition: "100% center" }}
                priority
              />
              {/* Fade left edge to blend into center */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to left, transparent 0%, transparent 55%, #101525 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile: show full image centered */}
        <div className="maint-enter sm:hidden w-full max-w-sm -mt-4 relative rounded-2xl overflow-hidden">
          <Image
            src="/maintenance-anime.png"
            alt="Jaksa Pranata Komputer sedang memelihara sistem"
            width={400}
            height={222}
            className="w-full h-auto"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 60%, #0D0F1A 100%)",
            }}
          />
        </div>

        {/* ============================================================ */}
        {/* INFO CARD — Title, Message, Countdown, Actions                 */}
        {/* ============================================================ */}
        <div
          id="info-card"
          className="maint-enter relative w-full max-w-2xl mt-6 rounded-3xl overflow-hidden"
          style={{
            background: "rgba(15,20,45,0.75)",
            border: "1.5px solid rgba(99,102,241,0.2)",
            backdropFilter: "blur(20px)",
            padding: "clamp(20px, 4vw, 36px)",
          }}
        >
          {/* Card top glowing line */}
          <div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.8), transparent)" }}
          />

          {/* Title */}
          <h2
            className="text-center font-black mb-2"
            style={{
              color: "#E2E8F0",
              fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
              lineHeight: 1.3,
            }}
          >
            {config.title || "Portal Sedang Dalam Pemeliharaan Sistem"}
          </h2>

          {/* Message */}
          <p
            className="text-center mb-5"
            style={{ color: "#94A3B8", fontSize: "clamp(0.75rem, 1.8vw, 0.875rem)", lineHeight: 1.6 }}
          >
            {config.message}
          </p>

          {/* COUNTDOWN TIMER */}
          {timeLeft && !timeLeft.isEnded && (
            <div className="mb-5">
              <p className="text-center text-xs font-bold mb-3" style={{ color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <Clock className="inline h-3.5 w-3.5 mr-1.5" style={{ color: "#818CF8" }} />
                Perkiraan Selesai
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { val: timeLeft.days, label: "Hari", color: "#818CF8" },
                  { val: timeLeft.hours, label: "Jam", color: "#A78BFA" },
                  { val: timeLeft.minutes, label: "Menit", color: "#C084FC" },
                  { val: timeLeft.seconds, label: "Detik", color: "#E879F9" },
                ].map(({ val, label, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center py-3 px-2 rounded-2xl"
                    style={{
                      background: "rgba(10,15,40,0.8)",
                      border: "1px solid rgba(99,102,241,0.25)",
                    }}
                  >
                    <span
                      className="font-black leading-none"
                      style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", color, fontVariantNumeric: "tabular-nums" }}
                    >
                      {String(val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: "#475569" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeLeft?.isEnded && (
            <div
              className="mb-5 p-3 rounded-2xl text-center text-xs font-bold"
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.35)",
                color: "#6EE7B7",
              }}
            >
              ✨ Estimasi selesai. Silakan klik <strong>Periksa Status</strong> di bawah.
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2.5 py-3 rounded-2xl font-black text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(34,197,94,0.35)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi PIC Diklat (WhatsApp)
            </a>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="sm:w-auto inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
              style={{
                background: "rgba(30,35,75,0.8)",
                color: "#CBD5E1",
                border: "1.5px solid rgba(99,102,241,0.3)",
              }}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} style={{ color: isRefreshing ? "#818CF8" : undefined }} />
              {isRefreshing ? "Memeriksa..." : "Periksa Status"}
            </button>
          </div>
        </div>
      </main>

      {/* ================================================================ */}
      {/* FOOTER                                                            */}
      {/* ================================================================ */}
      <footer
        className="relative z-10 text-center py-4 px-4"
        style={{ color: "#334155", fontSize: "0.7rem" }}
      >
        Badan Pendidikan dan Pelatihan Kejaksaan Republik Indonesia — Tim Pranata Komputer Agrasena
      </footer>
    </div>
  )
}
