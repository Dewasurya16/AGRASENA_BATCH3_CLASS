'use client'

import * as React from "react"
import anime from "animejs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, RotateCcw } from "lucide-react"

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
  badgeColor = "blue",
  title,
  description,
  onReset,
  errorDigest,
}: AnimatedErrorViewProps) {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const animTimelineRef = React.useRef<anime.AnimeTimelineInstance | null>(null)
  const strokeAnimRef = React.useRef<anime.AnimeInstance | null>(null)

  // Color palettes tailored to Web Kelas theme
  const palette = React.useMemo(() => {
    switch (badgeColor) {
      case "amber":
        return {
          glow: "rgba(245, 158, 11, 0.15)",
          gradientLight: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #dc2626 100%)",
          gradientDark: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f87171 100%)",
          badgeBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300",
          strokeColors: ["#f59e0b", "#d97706", "#dc2626", "#ea580c"],
          dotColor: "bg-amber-500",
        }
      case "rose":
        return {
          glow: "rgba(225, 29, 72, 0.15)",
          gradientLight: "linear-gradient(135deg, #e11d48 0%, #be123c 50%, #7c3aed 100%)",
          gradientDark: "linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #c084fc 100%)",
          badgeBg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300",
          strokeColors: ["#e11d48", "#be123c", "#9333ea", "#03c4a1"],
          dotColor: "bg-rose-500",
        }
      case "indigo":
        return {
          glow: "rgba(79, 70, 229, 0.15)",
          gradientLight: "linear-gradient(135deg, #4f46e5 0%, #2563eb 50%, #0d9488 100%)",
          gradientDark: "linear-gradient(135deg, #818cf8 0%, #60a5fa 50%, #2dd4bf 100%)",
          badgeBg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300",
          strokeColors: ["#4f46e5", "#2563eb", "#0d9488", "#03c4a1"],
          dotColor: "bg-indigo-500",
        }
      case "blue":
      default:
        return {
          glow: "rgba(0, 122, 255, 0.15)",
          gradientLight: "linear-gradient(135deg, #007aff 0%, #0056cc 45%, #03c4a1 100%)",
          gradientDark: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #34d399 100%)",
          badgeBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300",
          strokeColors: ["#007aff", "#0056cc", "#03c4a1", "#7038e8"],
          dotColor: "bg-[#007aff]",
        }
    }
  }, [badgeColor])

  // Setup Anime.js Kinetic Elastic Animation
  React.useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const chars = root.querySelectorAll<HTMLElement>(".error-digit")
    const strokePaths = root.querySelectorAll<SVGPathElement>(".error-kinetic-path")
    const glowEl = root.querySelector<HTMLElement>(".error-ambient-glow")

    // 1. Initial entry kinetic bounce for each digit
    anime.set(chars, {
      transformOrigin: "50% 100% 0px",
      translateY: 40,
      scaleX: 0.6,
      scaleY: 0.5,
      opacity: 0.001,
      rotateZ: (_el: HTMLElement, i: number) => (i % 2 === 0 ? -6 : 6),
    })

    const tl = anime.timeline({
      easing: "easeOutElastic(1.2, 0.5)",
      autoplay: true,
    })

    // Ambient glow pulse
    if (glowEl) {
      tl.add(
        {
          targets: glowEl,
          scale: [0.7, 1],
          opacity: [0, 1],
          duration: 1200,
          easing: "easeOutQuad",
        },
        0
      )
    }

    // Kinetic digit entrance
    tl.add(
      {
        targets: chars,
        translateY: [40, 0],
        scaleX: [0.6, 1],
        scaleY: [0.5, 1],
        rotateZ: [(_el: HTMLElement, i: number) => (i % 2 === 0 ? -6 : 6), 0],
        opacity: [0.001, 1],
        delay: anime.stagger(90, { start: 100 }),
        duration: 900,
        complete: () => {
          // 2. Start perpetual gentle floating loop after entrance
          animTimelineRef.current = anime.timeline({
            direction: "alternate",
            easing: "easeInOutSine",
            autoplay: true,
            loop: true,
          })

          animTimelineRef.current.add({
            targets: chars,
            translateY: (_el: HTMLElement, i: number) => (i % 2 === 0 ? -8 : 8),
            rotateZ: (_el: HTMLElement, i: number) => (i % 2 === 0 ? -1.5 : 1.5),
            duration: 2200,
            delay: anime.stagger(150),
          })
        },
      },
      150
    )

    // 3. Kinetic stroke lines loop
    if (strokePaths.length > 0) {
      strokeAnimRef.current = anime({
        targets: strokePaths,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: 2500,
        delay: anime.stagger(200),
        direction: "alternate",
        loop: true,
        autoplay: true,
      })
    }

    return () => {
      tl.pause()
      if (animTimelineRef.current) animTimelineRef.current.pause()
      if (strokeAnimRef.current) strokeAnimRef.current.pause()
    }
  }, [code])

  // Interactive Julian Garnier Squash-and-Stretch on click
  const handleDigitClick = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    anime({
      targets: el,
      transformOrigin: "50% 100% 0px",
      translateY: [
        { value: -28, duration: 160, easing: "easeOutQuad" },
        { value: 4, duration: 120, easing: "easeInQuad" },
        { value: 0, duration: 160, easing: "easeOutBounce" },
      ],
      scaleX: [
        { value: 0.85, duration: 160 },
        { value: 1.25, duration: 120 },
        { value: 1, duration: 160 },
      ],
      scaleY: [
        { value: 1.28, duration: 160 },
        { value: 0.75, duration: 120 },
        { value: 1, duration: 160 },
      ],
    })
  }

  const digits = code.split("")

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] flex flex-col items-center justify-center p-6 bg-[#F4F6FA] dark:bg-[#10141C] text-[#131E29] dark:text-[#D8E0EC] selection:bg-[#0D3830] selection:text-white overflow-hidden transition-colors duration-200 select-none"
    >
      {/* 1. Ambient Glow Ring */}
      <div
        className="error-ambient-glow pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] sm:h-[480px] sm:w-[480px] rounded-full blur-[90px] opacity-0 transition-opacity"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
        }}
      />

      {/* 2. Kinetic SVG Background Decorative Ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] h-[220px] sm:h-[260px] opacity-25 dark:opacity-35">
        <svg viewBox="0 0 420 260" className="w-full h-full" fill="none">
          <ellipse
            cx="210"
            cy="130"
            rx="180"
            ry="90"
            stroke={palette.strokeColors[0]}
            strokeWidth="1.5"
            strokeDasharray="8 6"
            className="error-kinetic-path"
          />
          <ellipse
            cx="210"
            cy="130"
            rx="130"
            ry="60"
            stroke={palette.strokeColors[1]}
            strokeWidth="1.2"
            strokeDasharray="12 8"
            className="error-kinetic-path"
          />
        </svg>
      </div>

      {/* 3. Main Minimalist Polos Container */}
      <div className="relative z-10 w-full max-w-lg text-center space-y-6 sm:space-y-7">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold shadow-2xs transition-all backdrop-blur-xs">
          <span className={`h-2 w-2 rounded-full ${palette.dotColor} animate-pulse`} />
          <span className="text-slate-700 dark:text-slate-200 tracking-tight">{badgeText}</span>
        </div>

        {/* Big Kinetic Animated Code Number */}
        <div className="relative inline-flex items-center justify-center gap-1 sm:gap-2 select-none py-1">
          {digits.map((char, index) => (
            <span
              key={index}
              onClick={handleDigitClick}
              title="Klik saya! 🎉"
              className="error-digit inline-block font-black text-8xl sm:text-9xl tracking-tight leading-none cursor-pointer transition-all hover:brightness-110 active:scale-95"
              style={{
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                background: palette.gradientLight,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Title & Short Description */}
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {description}
          </p>

          {errorDigest && (
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1">
              Digest ID: <span className="font-semibold text-slate-600 dark:text-slate-300">{errorDigest}</span>
            </p>
          )}
        </div>

        {/* Clean Minimalist Action Buttons ("Polos") */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0D3830] hover:bg-[#07241f] text-white px-5 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          {onReset ? (
            <button
              onClick={() => onReset()}
              className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 px-4 py-2.5 text-xs font-bold transition shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-rose-500" />
              <span>Muat Ulang (Reset)</span>
            </button>
          ) : (
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 px-4 py-2.5 text-xs font-bold transition shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Halaman Sebelumnya</span>
            </button>
          )}
        </div>

        {/* Minimal Footer */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-3">
          Diklat Fungsional Pranata Komputer Keahlian • Batch 3 Kejaksaan RI
        </p>
      </div>
    </div>
  )
}
