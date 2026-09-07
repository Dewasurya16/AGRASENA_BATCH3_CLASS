'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
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
        'flex flex-col items-center justify-center text-center space-y-3.5 p-4 select-none',
        className
      )}
    >
      {/* Modern Dual-Orbital Ring with Centered Animated Icon */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Soft Ambient Breathing Halo */}
        <div className="absolute inset-0 rounded-full bg-[#007aff]/10 dark:bg-[#60a5fa]/15 blur-md animate-pulse" />

        {/* Outer Continuous Precision Spinning Track */}
        <svg
          className="absolute inset-0 h-full w-full animate-spin"
          viewBox="0 0 56 56"
          fill="none"
          style={{ animationDuration: '1.2s' }}
        >
          {/* Subtle Background Track Ring */}
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-slate-200/80 dark:text-white/10"
          />
          {/* Active Gradient/Accent Spinning Arc */}
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="42 120"
            className="text-[#007aff] dark:text-[#60a5fa]"
          />
        </svg>

        {/* Center Animated Icon Badge (Gentle Breathing Micro-Motion) */}
        <motion.div
          animate={{
            scale: [0.93, 1.06, 0.93],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#151c28] border border-slate-200/90 dark:border-white/10 shadow-xs text-[#007aff] dark:text-[#60a5fa]"
        >
          {icon || <GraduationCap className="h-4 w-4" strokeWidth={2} />}
        </motion.div>
      </div>

      {/* Clean Text Hierarchy */}
      <div className="space-y-0.5 max-w-xs">
        {title && (
          <p className="text-xs sm:text-sm font-semibold text-[#000000] dark:text-white tracking-tight">
            {title}
          </p>
        )}
        {subtitle && (
          <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8] font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional Step Text (for long operations like AI generation) */}
      {steps && steps.length > 0 && (
        <div className="h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStepIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-[11px] font-medium text-[#007aff] dark:text-[#60a5fa]"
            >
              {steps[currentStepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 dark:bg-[#0c1017]/80 backdrop-blur-sm animate-in fade-in duration-150">
        {content}
      </div>
    )
  }

  return content
}
