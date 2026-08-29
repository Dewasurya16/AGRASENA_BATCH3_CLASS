'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'primary' | 'emerald' | 'amber' | 'indigo' | 'white' | 'current'
  label?: string
  fullscreen?: boolean
  thickness?: 'thin' | 'normal' | 'thick'
}

const sizeMap = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
  '2xl': 'h-16 w-16',
}

const strokeMap = {
  thin: '2',
  normal: '3',
  thick: '4',
}

const variantGlowMap = {
  primary: 'drop-shadow-[0_0_8px_rgba(13,56,48,0.5)] dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
  emerald: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
  amber: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
  indigo: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]',
  white: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
  current: '',
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  thickness = 'normal',
  label,
  fullscreen = false,
  className,
  ...props
}: SpinnerProps) {
  const strokeWidth = strokeMap[thickness]

  const spinnerSvg = (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', sizeMap[size], className)} {...props}>
      {/* Outer ambient subtle pulse glow */}
      <span
        className={cn(
          'absolute inset-0 rounded-full animate-ping opacity-25',
          variant === 'primary' && 'bg-emerald-500',
          variant === 'emerald' && 'bg-emerald-500',
          variant === 'amber' && 'bg-amber-500',
          variant === 'indigo' && 'bg-indigo-500',
          variant === 'white' && 'bg-white',
          variant === 'current' && 'bg-current'
        )}
      />

      {/* Dual Ring SVG Spinner */}
      <svg
        className={cn('animate-spin', sizeMap[size], variantGlowMap[variant])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Track Ring */}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        {/* Animated Foreground Arc */}
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(
            variant === 'primary' && 'text-[#0D3830] dark:text-emerald-400',
            variant === 'emerald' && 'text-emerald-500 dark:text-emerald-400',
            variant === 'amber' && 'text-amber-500 dark:text-amber-400',
            variant === 'indigo' && 'text-indigo-600 dark:text-indigo-400',
            variant === 'white' && 'text-white',
            variant === 'current' && 'text-current'
          )}
        />
      </svg>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md transition-all">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/90 dark:bg-[#161B26]/90 border border-slate-200/80 dark:border-[#2A3550] shadow-2xl">
          {spinnerSvg}
          {label && (
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 animate-pulse tracking-wide">
              {label}
            </span>
          )}
        </div>
      </div>
    )
  }

  if (label) {
    return (
      <div className="inline-flex items-center gap-2">
        {spinnerSvg}
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
          {label}
        </span>
      </div>
    )
  }

  return spinnerSvg
}

/**
 * Three bouncing dots loading indicator
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" />
    </span>
  )
}
