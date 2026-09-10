'use client'

import * as React from "react"
import anime from "animejs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, RotateCcw } from "lucide-react"

export interface KineticSvgErrorProps {
  code?: string
  mainText?: string
  title?: string
  badgeText?: string
  description?: string
  onReset?: () => void
  accentColor?: string // e.g. "#ff0d98" (neon magenta) or "#007aff"
}

export function KineticSvgError({
  code = "404",
  mainText,
  title,
  badgeText = "Halaman Tidak Ditemukan",
  description = "Maaf, halaman atau rute yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL yang Anda masukkan kurang tepat.",
  onReset,
  accentColor = "#ff0d98",
}: KineticSvgErrorProps) {
  const displayText = (mainText || title || "TIDAK DITEMUKAN").toUpperCase()
  const router = useRouter()
  const svgRef = React.useRef<SVGSVGElement>(null)
  const animRef = React.useRef<anime.AnimeInstance | null>(null)

  React.useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const lines = svgEl.querySelectorAll("line")
    if (!lines || lines.length === 0) return

    animRef.current = anime({
      targets: lines,
      translateX: [
        { value: 270, duration: 1000, easing: "easeOutSine" },
        { value: 0, duration: 1000, easing: "easeOutSine" },
      ],
      delay: anime.stagger(200, { grid: [16, 10], from: 7 }),
      loop: true,
      autoplay: true,
    })

    return () => {
      if (animRef.current) {
        animRef.current.pause()
      }
    }
  }, [code, displayText])

  const patternId = `kinetic-lines-${code}`
  const clipLeftId = `clip-split-left-${code}`
  const clipRightId = `clip-split-right-${code}`

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F4F6FA] dark:bg-[#10141C] text-[#131E29] dark:text-[#D8E0EC] selection:bg-[#0D3830] selection:text-white overflow-hidden transition-colors duration-200 select-none">
      {/* Subtle Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[560px] rounded-full blur-[110px] opacity-25 dark:opacity-35"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(0, 122, 255, 0.2) 50%, transparent 75%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-6 sm:space-y-8 my-6">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#161B26]/80 backdrop-blur-md px-4 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span>
            {code} • {badgeText}
          </span>
        </div>

        {/* Kinetic Halftone SVG Text Display: "404" & "TIDAK DITEMUKAN" */}
        <div className="w-full flex items-center justify-center px-2 py-1 select-none">
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 330"
            className="w-full max-w-2xl sm:max-w-3xl h-auto drop-shadow-sm transition-all"
          >
            <defs>
              <style>{`
                .cls-pat-bg { fill: none; }
                .cls-pat-line { stroke: ${accentColor}; stroke-width: 4.8px; stroke-linecap: round; }
                .text-solid-layer { fill: currentColor; font-family: var(--font-outfit), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 900; }
                .text-lines-layer { fill: url(#${patternId}); font-family: var(--font-outfit), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 900; }
              `}</style>

              {/* Halftone Slanted Parallel Lines Pattern */}
              <pattern
                id={patternId}
                x="-66"
                y="-94"
                width="72"
                height="72"
                patternUnits="userSpaceOnUse"
                viewBox="0 0 72 72"
              >
                <rect className="cls-pat-bg" width="72" height="72" />
                <line className="cls-pat-line" x1="71.75" y1="68.4" x2="144.25" y2="68.4" />
                <line className="cls-pat-line" x1="71.75" y1="54" x2="144.25" y2="54" />
                <line className="cls-pat-line" x1="71.75" y1="39.6" x2="144.25" y2="39.6" />
                <line className="cls-pat-line" x1="71.75" y1="25.2" x2="144.25" y2="25.2" />
                <line className="cls-pat-line" x1="71.75" y1="10.8" x2="144.25" y2="10.8" />
                <line className="cls-pat-line" x1="71.75" y1="61.2" x2="144.25" y2="61.2" />
                <line className="cls-pat-line" x1="71.75" y1="46.8" x2="144.25" y2="46.8" />
                <line className="cls-pat-line" x1="71.75" y1="32.4" x2="144.25" y2="32.4" />
                <line className="cls-pat-line" x1="71.75" y1="18" x2="144.25" y2="18" />
                <line className="cls-pat-line" x1="71.75" y1="3.6" x2="144.25" y2="3.6" />
                <line className="cls-pat-line" x1="-0.25" y1="68.4" x2="72.25" y2="68.4" />
                <line className="cls-pat-line" x1="-0.25" y1="54" x2="72.25" y2="54" />
                <line className="cls-pat-line" x1="-0.25" y1="39.6" x2="72.25" y2="39.6" />
                <line className="cls-pat-line" x1="-0.25" y1="25.2" x2="72.25" y2="25.2" />
                <line className="cls-pat-line" x1="-0.25" y1="10.8" x2="72.25" y2="10.8" />
                <line className="cls-pat-line" x1="-0.25" y1="61.2" x2="72.25" y2="61.2" />
                <line className="cls-pat-line" x1="-0.25" y1="46.8" x2="72.25" y2="46.8" />
                <line className="cls-pat-line" x1="-0.25" y1="32.4" x2="72.25" y2="32.4" />
                <line className="cls-pat-line" x1="-0.25" y1="18" x2="72.25" y2="18" />
                <line className="cls-pat-line" x1="-0.25" y1="3.6" x2="72.25" y2="3.6" />
                <line className="cls-pat-line" x1="-72.25" y1="68.4" x2="0.25" y2="68.4" />
                <line className="cls-pat-line" x1="-72.25" y1="54" x2="0.25" y2="54" />
                <line className="cls-pat-line" x1="-72.25" y1="39.6" x2="0.25" y2="39.6" />
                <line className="cls-pat-line" x1="-72.25" y1="25.2" x2="0.25" y2="25.2" />
                <line className="cls-pat-line" x1="-72.25" y1="10.8" x2="0.25" y2="10.8" />
                <line className="cls-pat-line" x1="-72.25" y1="61.2" x2="0.25" y2="61.2" />
                <line className="cls-pat-line" x1="-72.25" y1="46.8" x2="0.25" y2="46.8" />
                <line className="cls-pat-line" x1="-72.25" y1="32.4" x2="0.25" y2="32.4" />
                <line className="cls-pat-line" x1="-72.25" y1="18" x2="0.25" y2="18" />
                <line className="cls-pat-line" x1="-72.25" y1="3.6" x2="0.25" y2="3.6" />
              </pattern>

              {/* Diagonal Split ClipPaths for Optical 3D Dual-Tone Effect */}
              <clipPath id={clipLeftId}>
                <polygon points="0,0 520,0 380,330 0,330" />
              </clipPath>
              <clipPath id={clipRightId}>
                <polygon points="520,0 1000,0 1000,330 380,330" />
              </clipPath>
            </defs>

            {/* Left-Half Layer: Solid Text */}
            <g clipPath={`url(#${clipLeftId})`} className="text-slate-900 dark:text-white transition-colors">
              <text x="500" y="175" textAnchor="middle" fontSize="195" letterSpacing="-0.04em" className="text-solid-layer">
                {code}
              </text>
              <text x="500" y="280" textAnchor="middle" fontSize="62" letterSpacing="0.14em" className="text-solid-layer">
                {displayText}
              </text>
            </g>

            {/* Right-Half Layer: Kinetic Halftone Sliding Lines */}
            <g clipPath={`url(#${clipRightId})`}>
              <text x="500" y="175" textAnchor="middle" fontSize="195" letterSpacing="-0.04em" className="text-lines-layer">
                {code}
              </text>
              <text x="500" y="280" textAnchor="middle" fontSize="62" letterSpacing="0.14em" className="text-lines-layer">
                {displayText}
              </text>
            </g>

            {/* Crisp Outline Layer */}
            <text
              x="500"
              y="175"
              textAnchor="middle"
              fontSize="195"
              letterSpacing="-0.04em"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-900 dark:text-white opacity-20 dark:opacity-30"
            >
              {code}
            </text>
            <text
              x="500"
              y="280"
              textAnchor="middle"
              fontSize="62"
              letterSpacing="0.14em"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-900 dark:text-white opacity-20 dark:opacity-30"
            >
              {displayText}
            </text>
          </svg>
        </div>

        {/* Minimalist Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto font-normal">
          {description}
        </p>

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
              <RotateCcw className="h-4 w-4 text-[#ff0d98]" />
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
        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          Diklat Fungsional Pranata Komputer Keahlian • Batch 3 Kejaksaan RI
        </p>
      </div>
    </div>
  )
}
