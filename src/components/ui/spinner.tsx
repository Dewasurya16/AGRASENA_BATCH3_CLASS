'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'primary' | 'emerald' | 'amber' | 'indigo' | 'white' | 'current'
  type?: 'ios' | 'ring'
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-200">
        <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-[24px] bg-white/95 dark:bg-[#161B26]/95 border border-slate-200/90 dark:border-[#2A3550] shadow-2xl max-w-xs w-full text-center">
          {spinnerElement}
          {label && (
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">
              {label}
            </span>
          )}
        </div>
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
