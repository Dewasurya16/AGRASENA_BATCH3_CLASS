'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, BookOpen, Laptop, Sparkles, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MinimalistLoaderProps {
  title?: string
  subtitle?: string
  steps?: string[]
  fullscreen?: boolean
  delayMs?: number
  className?: string
}

const DEFAULT_STEPS = [
  'Menghubungkan ke Portal Diklat...',
  'Menyiapkan Modul & Roadmap 35 Hari...',
  'Menyelaraskan Data Perkuliahan...',
]

export function MinimalistLoader({
  title = 'Memuat Portal Kelas',
  subtitle = 'Diklat Fungsional Pranata Komputer • Batch 3',
  steps = DEFAULT_STEPS,
  fullscreen = false,
  delayMs = 200,
  className,
}: MinimalistLoaderProps) {
  const [shouldShow, setShouldShow] = React.useState(delayMs <= 0)
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0)

  // Delay threshold to avoid micro-flashing on ultra-fast actions
  React.useEffect(() => {
    if (delayMs <= 0) {
      setShouldShow(true)
      return
    }

    const timer = setTimeout(() => setShouldShow(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  // Cycle through steps smoothly
  React.useEffect(() => {
    if (!shouldShow || steps.length <= 1) return

    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % steps.length)
    }, 1800)

    return () => clearInterval(interval)
  }, [shouldShow, steps.length])

  if (!shouldShow) return null

  const loaderCard = (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-[22px] bg-white/95 dark:bg-[#161B26]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#2A3550] shadow-2xl shadow-emerald-950/10 dark:shadow-black/60 max-w-sm w-full transition-all select-none',
        className
      )}
    >
      {/* 1. Dribbble Travel-Style Minimalist Animated Track */}
      <div className="relative w-full max-w-[220px] h-14 flex items-center justify-between px-2 mb-2">
        {/* Background Track Line with Dotted Geometry */}
        <div className="absolute left-6 right-6 h-[2px] bg-slate-200 dark:bg-slate-700/80 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full"
            animate={{
              x: ['0%', '100%', '0%'],
              scaleX: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Start Node */}
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1B2232] border-2 border-slate-300 dark:border-[#2A3550] text-slate-500 dark:text-slate-400 shadow-xs">
          <Laptop className="h-3.5 w-3.5" />
        </div>

        {/* Gliding Center Capsule (Dribbble Travel Morph) */}
        <motion.div
          className="relative z-20 flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0D3830] to-emerald-600 dark:from-emerald-600 dark:to-teal-500 text-white shadow-lg shadow-emerald-900/25 dark:shadow-emerald-500/20"
          animate={{
            y: [-3, 3, -3],
            rotate: [0, 6, -6, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <GraduationCap className="h-4 w-4" />
        </motion.div>

        {/* End Destination Node */}
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1B2232] border-2 border-slate-300 dark:border-[#2A3550] text-slate-500 dark:text-slate-400 shadow-xs">
          <BookOpen className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* 2. Micro Dot Orbit Pulse (Dribbble Minimalist Flow) */}
      <div className="flex items-center gap-1.5 mb-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 3. Title & Subtitle */}
      <div className="text-center space-y-0.5">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      </div>

      {/* 4. Sliding Step Message Transition (Smooth Text Swap) */}
      <div className="h-6 mt-3 flex items-center justify-center overflow-hidden w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStepIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[260px] text-center"
          >
            {steps[currentStepIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-200">
        {loaderCard}
      </div>
    )
  }

  return loaderCard
}
