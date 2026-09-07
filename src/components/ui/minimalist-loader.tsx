'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MinimalistLoaderProps {
  title?: string
  subtitle?: string
  steps?: string[]
  fullscreen?: boolean
  delayMs?: number
  className?: string
}

export function MinimalistLoader({
  title = 'Memuat...',
  subtitle,
  steps,
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
        'flex flex-col items-center justify-center text-center space-y-3 p-4 select-none',
        className
      )}
    >
      {/* Sleek Minimalist Ring Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Subtle breathing ambient glow ring */}
        <div className="absolute h-9 w-9 rounded-full bg-[#007aff]/15 dark:bg-[#60a5fa]/15 blur-sm animate-pulse" />
        {/* Smooth Track & Accent Spinner */}
        <div
          className="h-8 w-8 rounded-full border-2 border-[#e6e6e6] dark:border-white/10 border-t-[#007aff] dark:border-t-[#60a5fa] animate-spin"
          style={{ animationDuration: '0.75s' }}
        />
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/70 dark:bg-[#0c1017]/75 backdrop-blur-sm animate-in fade-in duration-150">
        {content}
      </div>
    )
  }

  return content
}
