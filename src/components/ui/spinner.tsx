'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'primary' | 'emerald' | 'amber' | 'indigo' | 'white' | 'current'
  type?: 'ios' | 'ring'
  icon?: React.ReactNode
  label?: string
  fullscreen?: boolean
  /** Delay in milliseconds before spinner becomes visible to avoid ugly flickering on fast actions */
  delayMs?: number
}

const sizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-4.5 w-4.5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
  '2xl': 'h-16 w-16',
}

const colorMap = {
  primary: 'text-[#0D3830] dark:text-emerald-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  amber: 'text-amber-500 dark:text-amber-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  white: 'text-white',
  current: 'text-current',
}

export function Spinner({
  size = 'md',
  variant = 'current',
  type = 'ring',
  icon,
  label,
  fullscreen = false,
  delayMs = 200,
  className,
  ...props
}: SpinnerProps) {
  const [shouldShow, setShouldShow] = React.useState(delayMs <= 0)

  React.useEffect(() => {
    if (delayMs <= 0) {
      setShouldShow(true)
      return
    }

    const timer = setTimeout(() => {
      setShouldShow(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  if (!shouldShow) {
    return null
  }

  const spinnerElement = type === 'ios' ? (
    /* Apple iOS-style Smooth Radial Ticks */
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 animate-spin transition-opacity duration-200',
        sizeMap[size],
        colorMap[variant],
        className
      )}
      style={{ animationDuration: '0.85s' }}
      {...props}
    >
      <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line
            key={deg}
            x1="12"
            y1="3"
            x2="12"
            y2="6.5"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 12 12)`}
            style={{ opacity: 0.2 + (i / 8) * 0.8 }}
          />
        ))}
      </svg>
    </div>
  ) : (
    /* Crisp Minimalist Tapered Ring */
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 animate-spin transition-opacity duration-200',
        sizeMap[size],
        colorMap[variant],
        className
      )}
      style={{ animationDuration: '0.75s' }}
      {...props}
    >
      <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-20"
        />
        <path
          d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-white/75 dark:bg-[#0c1017]/80 backdrop-blur-sm animate-in fade-in duration-150 gap-3.5 select-none">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#007aff]/20 via-[#af52de]/15 to-[#34c759]/20 dark:from-[#60a5fa]/25 dark:via-[#c084fc]/20 dark:to-[#4ade80]/25 blur-lg animate-pulse" />
          <svg
            className="absolute inset-0 h-full w-full animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            style={{ animationDuration: '1.4s' }}
          >
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 6" className="text-slate-200/90 dark:text-white/10" />
            <circle cx="32" cy="32" r="28" stroke="#007aff" strokeWidth="3" strokeLinecap="round" strokeDasharray="50 130" className="dark:stroke-[#60a5fa]" />
          </svg>
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
            className="absolute -top-1 -right-1 z-20 text-amber-400 dark:text-amber-300 pointer-events-none"
          >
            <Sparkles className="h-3.5 w-3.5 fill-amber-400 dark:fill-amber-300" />
          </motion.div>
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
        {label && (
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {label}
          </span>
        )}
      </div>
    )
  }

  if (icon) {
    return (
      <div className="relative inline-flex items-center justify-center gap-2">
        <div className="relative flex h-9 w-9 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full animate-spin text-current" viewBox="0 0 56 56" fill="none" style={{ animationDuration: '1.2s' }}>
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="3" className="opacity-20" />
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="42 120" className="opacity-95" />
          </svg>
          <div className="relative z-10 flex items-center justify-center text-current">
            {icon}
          </div>
        </div>
        {label && (
          <span className="text-xs font-semibold text-current">
            {label}
          </span>
        )}
      </div>
    )
  }

  if (label) {
    return (
      <div className="inline-flex items-center justify-center gap-2 animate-in fade-in duration-200">
        {spinnerElement}
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>
    )
  }

  return spinnerElement
}
