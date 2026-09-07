'use client'

import * as React from 'react'
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

  if (!shouldShow) return null

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center space-y-4 p-4 select-none',
        className
      )}
    >
      {/* ── Cute & Playful Center Mascot Animation ── */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Soft Colorful Breathing Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#007aff]/20 via-[#af52de]/15 to-[#34c759]/20 dark:from-[#60a5fa]/25 dark:via-[#c084fc]/20 dark:to-[#4ade80]/25 blur-lg animate-pulse" />

        {/* Playful Outer Orbit Ring with Gradient Dash */}
        <svg
          className="absolute inset-0 h-full w-full animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          style={{ animationDuration: '1.4s' }}
        >
          {/* Subtle dotted guide track */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            className="text-slate-200/90 dark:text-white/10"
          />
          {/* Smooth spinning accent arc */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#cuteLoaderGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="50 130"
          />
          <defs>
            <linearGradient id="cuteLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007aff" />
              <stop offset="60%" stopColor="#af52de" />
              <stop offset="100%" stopColor="#34c759" />
            </linearGradient>
          </defs>
        </svg>

        {/* Cute Sparkle 1 (Top Right Pop) */}
        <motion.div
          animate={{
            scale: [0, 1.2, 0],
            rotate: [0, 90, 180],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.1,
            ease: 'easeInOut',
          }}
          className="absolute -top-1.5 -right-1.5 z-20 text-amber-400 dark:text-amber-300 pointer-events-none"
        >
          <Sparkles className="h-3.5 w-3.5 fill-amber-400 dark:fill-amber-300" />
        </motion.div>

        {/* Cute Star 2 (Bottom Left Tiny Twinkle) */}
        <motion.div
          animate={{
            scale: [0, 1.1, 0],
            rotate: [0, -90, -180],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 1.0,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-1 -left-1 z-20 text-[#af52de] dark:text-[#c084fc] text-xs font-bold pointer-events-none"
        >
          ✦
        </motion.div>

        {/* Center Cute Mascot Badge with Cartoon Squash & Stretch Wiggle */}
        <motion.div
          animate={{
            y: [0, -7, 0, -2, 0],
            rotate: [0, -8, 8, -4, 0],
            scaleX: [1, 0.92, 1.08, 0.98, 1],
            scaleY: [1, 1.1, 0.92, 1.02, 1],
          }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#151c28] border-2 border-sky-100 dark:border-white/15 shadow-md shadow-sky-500/15 text-[#007aff] dark:text-[#60a5fa]"
        >
          {icon || <GraduationCap className="h-5 w-5" strokeWidth={2.2} />}
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
