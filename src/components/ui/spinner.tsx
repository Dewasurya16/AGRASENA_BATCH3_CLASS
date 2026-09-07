'use client'

import * as React from 'react'
import { GraduationCap } from 'lucide-react'
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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-white/75 dark:bg-[#0c1017]/80 backdrop-blur-sm animate-in fade-in duration-150 gap-3 select-none">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#007aff]/10 dark:bg-[#60a5fa]/15 blur-md animate-pulse" />
          <svg
            className="absolute inset-0 h-full w-full animate-spin"
            viewBox="0 0 56 56"
            fill="none"
            style={{ animationDuration: '1.2s' }}
          >
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="2.5" className="text-slate-200/80 dark:text-white/10" />
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 120" className="text-[#007aff] dark:text-[#60a5fa]" />
          </svg>
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#151c28] border border-slate-200/90 dark:border-white/10 shadow-xs text-[#007aff] dark:text-[#60a5fa]">
            {icon || <GraduationCap className="h-4 w-4" strokeWidth={2} />}
          </div>
        </div>
        {label && (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
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
