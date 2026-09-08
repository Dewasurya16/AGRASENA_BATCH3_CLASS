'use client'

import * as React from 'react'
import anime from 'animejs'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MinimalistLoaderProps {
  title?: string
  subtitle?: string
  steps?: string[]
  icon?: React.ReactNode
  fullscreen?: boolean
  delayMs?: number
  className?: string
}

export function MinimalistLoader({
  title = 'Memuat...',
  subtitle,
  steps,
  icon,
  fullscreen = false,
  delayMs = 0,
  className,
}: MinimalistLoaderProps) {
  const [shouldShow, setShouldShow] = React.useState(delayMs <= 0)
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0)
  const orbitRingRef = React.useRef<SVGSVGElement>(null)
  const innerGimbalRef = React.useRef<SVGEllipseElement>(null)

  React.useEffect(() => {
    if (delayMs <= 0) {
      setShouldShow(true)
      return
    }
    const timer = setTimeout(() => setShouldShow(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  // Cycle through step messages if provided
  React.useEffect(() => {
    if (!shouldShow || !steps || steps.length <= 1) return
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % steps.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [shouldShow, steps])

  // Anime.js kinetic dual-orbit gyroscopic animation
  React.useEffect(() => {
    if (!shouldShow) return
    const anims: anime.AnimeInstance[] = []

    if (orbitRingRef.current) {
      anims.push(
        anime({
          targets: orbitRingRef.current,
          rotate: 360,
          duration: 1200,
          easing: 'cubicBezier(0.4, 0.1, 0.25, 1)',
          loop: true,
        })
      )
    }

    if (innerGimbalRef.current) {
      anims.push(
        anime({
          targets: innerGimbalRef.current,
          rotate: -360,
          duration: 800,
          easing: 'cubicBezier(0.45, 0.05, 0.2, 0.95)',
          loop: true,
        })
      )
    }

    return () => anims.forEach((a) => a.pause())
  }, [shouldShow])

  if (!shouldShow) return null

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center space-y-4 p-4 select-none',
        className
      )}
    >
      {/* ── Modern & Harmonious Center Mascot Animation ── */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Soft Breathing Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#007aff]/20 via-[#16a34a]/15 to-[#af52de]/15 dark:from-[#60a5fa]/25 dark:via-[#4ade80]/20 dark:to-[#c084fc]/20 blur-md animate-pulse" />

        {/* Outer Orbit Spinner Ring powered by Anime.js */}
        <svg
          ref={orbitRingRef}
          className="absolute inset-0 h-full w-full transform-gpu overflow-visible"
          viewBox="0 0 72 72"
          fill="none"
        >
          {/* Subtle guide track */}
          <circle
            cx="36"
            cy="36"
            r="31"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-200 dark:text-white/10 opacity-70"
          />
          {/* Smooth segmented kinetic accent arc */}
          <circle
            cx="36"
            cy="36"
            r="31"
            stroke="url(#cuteLoaderGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="56 120"
          />
          {/* Inner Counter-Rotating Gyroscopic Orbit */}
          <ellipse
            ref={innerGimbalRef}
            cx="36"
            cy="36"
            rx="23"
            ry="14"
            stroke="url(#cuteLoaderInnerGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="30 16"
            className="opacity-75 origin-center"
          />
          <defs>
            <linearGradient id="cuteLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007aff" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="cuteLoaderInnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#007aff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Prakom Logo Badge with Smooth Float */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-[#151c28] border border-slate-200 dark:border-white/15 shadow-sm p-1.5 overflow-hidden"
        >
          {icon || (
            <img
              src="/Logo.webp"
              alt="Logo Prakom"
              className="h-full w-full object-contain select-none pointer-events-none"
            />
          )}
        </motion.div>
      </div>

      {/* ── Cute Typography & Bouncing Dots ── */}
      <div className="space-y-1 max-w-xs">
        {title && (
          <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#000000] dark:text-white tracking-tight">
            <span>{title.replace(/\.+$/, '')}</span>
            {/* Cute bouncing triple dots */}
            <span className="inline-flex items-center gap-0.5 ml-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1 w-1 rounded-full bg-[#007aff] dark:bg-[#60a5fa]"
                  animate={{ y: [0, -3.5, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8] font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional Step Text (for long operations like AI generation) */}
      {steps && steps.length > 0 && (
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#007aff]/10 dark:bg-[#007aff]/20 text-[11px] font-semibold text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/20"
            >
              <span className="text-[10px]">✨</span>
              <span>{steps[currentStepIdx]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-[100dvh] w-full items-center justify-center p-4 bg-[#F4F6FA]/90 dark:bg-[#14181F]/95 backdrop-blur-xs animate-in fade-in duration-150 select-none">
        {content}
      </div>
    )
  }

  return content
}
