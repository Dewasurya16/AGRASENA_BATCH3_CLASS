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
  'Menghubungkan ke Portal Diklat Kejaksaan...',
  'Menyiapkan Modul 120 JP & Roadmap 35 Hari...',
  'Menyelaraskan Data Perkuliahan & Penugasan...',
]

export function MinimalistLoader({
  title = 'Memuat Portal Kelas',
  subtitle = 'Diklat Fungsional Pranata Komputer • Batch 3',
  steps = DEFAULT_STEPS,
  fullscreen = false,
  delayMs = 0,
  className,
}: MinimalistLoaderProps) {
  const [shouldShow, setShouldShow] = React.useState(delayMs <= 0)
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0)

  // Delay threshold
  React.useEffect(() => {
    if (delayMs <= 0) {
      setShouldShow(true)
      return
    }

    const timer = setTimeout(() => setShouldShow(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  // Cycle through step messages smoothly
  React.useEffect(() => {
    if (!shouldShow || steps.length <= 1) return

    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [shouldShow, steps.length])

  if (!shouldShow) return null

  const loaderCard = (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-8 sm:p-10 rounded-[28px] bg-white/95 dark:bg-[#161B26]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-[#2A3550] shadow-2xl shadow-emerald-950/15 dark:shadow-black/70 max-w-md w-full transition-all select-none mx-auto',
        className
      )}
    >
      {/* Ambient background soft glow */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-emerald-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      {/* 1. Dribbble Travel-Style Minimalist Animated Track (Enlarged & Centered) */}
      <div className="relative w-full max-w-[280px] sm:max-w-[300px] h-20 flex items-center justify-between px-3 mb-4">
        {/* Background Track Line with Dotted Geometry */}
        <div className="absolute left-8 right-8 h-[3px] bg-slate-200/90 dark:bg-slate-700/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: '60%' }}
          />
        </div>

        {/* Start Origin Node (Laptop) */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#1C2333] border-2 border-slate-200 dark:border-[#2A3550] text-slate-600 dark:text-slate-300 shadow-md">
          <Laptop className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Center Hero Capsule (Dribbble Travel Morph Glider) */}
        <div className="relative z-20 flex items-center justify-center">
          {/* Subtle Outer Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-emerald-500/20 dark:bg-emerald-400/20 blur-sm"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0D3830] via-[#104a40] to-emerald-600 dark:from-emerald-600 dark:to-teal-500 text-white shadow-xl shadow-emerald-950/30 dark:shadow-emerald-500/25 border border-white/20"
            animate={{
              y: [-4, 4, -4],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <GraduationCap className="h-6 w-6 text-white" />
          </motion.div>
        </div>

        {/* End Destination Node (Book) */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#1C2333] border-2 border-slate-200 dark:border-[#2A3550] text-slate-600 dark:text-slate-300 shadow-md">
          <BookOpen className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </div>
      </div>

      {/* 2. Micro Dynamic Flow Dots */}
      <div className="flex items-center gap-2 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
            animate={{
              scale: [0.75, 1.35, 0.75],
              opacity: [0.25, 1, 0.25],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 3. Title & Subtitle Hierarchy */}
      <div className="text-center space-y-1 z-10">
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      </div>

      {/* 4. Sliding Step Message Transition */}
      <div className="h-7 mt-4 flex items-center justify-center overflow-hidden w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold truncate max-w-full text-center shadow-xs"
          >
            <Sparkles className="h-3 w-3 text-amber-500 shrink-0 animate-pulse" />
            <span className="truncate">{steps[currentStepIdx]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. Clean Micro Progress Track */}
      <div className="w-full max-w-[200px] h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          animate={{
            width: ['20%', '85%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md transition-all animate-in fade-in duration-200">
        {loaderCard}
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center p-4">
      {loaderCard}
    </div>
  )
}
