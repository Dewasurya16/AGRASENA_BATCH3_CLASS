'use client'

import * as React from 'react'
import anime from 'animejs'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'primary' | 'emerald' | 'amber' | 'indigo' | 'white' | 'current'
  type?: 'quantum' | 'gyro' | 'dots' | 'ring' | 'ios' | 'trinity'
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
  type = 'quantum',
  icon,
  label,
  fullscreen = false,
  delayMs = 200,
  className,
  ...props
}: SpinnerProps) {
  const [shouldShow, setShouldShow] = React.useState(delayMs <= 0)

  // Anime.js Animation Refs
  const ringContainerRef = React.useRef<HTMLDivElement>(null)
  const quantumOuterRef = React.useRef<SVGCircleElement>(null)
  const quantumInnerRef = React.useRef<SVGEllipseElement>(null)
  const quantumCoreRef = React.useRef<SVGRectElement>(null)

  const ringArcRef = React.useRef<SVGCircleElement>(null)
  const ringCoreRef = React.useRef<SVGCircleElement>(null)
  const dotsContainerRef = React.useRef<HTMLDivElement>(null)
  const gyroOuterRef = React.useRef<SVGCircleElement>(null)
  const gyroInnerRef = React.useRef<SVGCircleElement>(null)
  const trinityContainerRef = React.useRef<HTMLDivElement>(null)

  const fullRingRef = React.useRef<SVGSVGElement>(null)
  const fullArcRef = React.useRef<SVGCircleElement>(null)
  const fullInnerRingRef = React.useRef<SVGCircleElement>(null)
  const fullBadgeRef = React.useRef<HTMLDivElement>(null)
  const fullSparkleRef = React.useRef<HTMLDivElement>(null)
  const iconRingRef = React.useRef<SVGSVGElement>(null)

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

  // =========================================================================
  // SIGNATURE KINETIC SPINNER MODELS (Powered by Anime.js)
  // =========================================================================
  React.useEffect(() => {
    if (!shouldShow || fullscreen || icon) return

    const animations: anime.AnimeInstance[] = []

    // 1. SIGNATURE MODEL: KINETIC QUANTUM GYROSCOPE REACTOR (Default)
    if (type === 'quantum') {
      // Outer Segmented Quantum Track: Clockwise Non-Linear Acceleration & Snap
      if (quantumOuterRef.current) {
        animations.push(
          anime({
            targets: quantumOuterRef.current,
            rotate: 360,
            duration: 1100,
            easing: 'cubicBezier(0.4, 0.1, 0.25, 1)',
            loop: true,
          })
        )
      }

      // Middle Gimbal Ellipse: High-velocity Counter-Orbit (Harmonic 3D Gimbal)
      if (quantumInnerRef.current) {
        animations.push(
          anime({
            targets: quantumInnerRef.current,
            rotate: -360,
            duration: 780,
            easing: 'cubicBezier(0.45, 0.05, 0.2, 0.95)',
            loop: true,
          })
        )
      }

      // Center Pulsing Energy Diamond Core: Breathing scale + 90deg tilt rotation
      if (quantumCoreRef.current) {
        animations.push(
          anime({
            targets: quantumCoreRef.current,
            scale: [0.65, 1.3],
            rotate: [45, 135],
            opacity: [0.45, 1],
            duration: 550,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true,
          })
        )
      }
    }

    // 2. MODEL TRINITY: 3-PARTICLE MAGNETIC VORTEX CHASER
    if (type === 'trinity' && trinityContainerRef.current) {
      animations.push(
        anime({
          targets: trinityContainerRef.current,
          rotate: 360,
          duration: 950,
          easing: 'cubicBezier(0.38, 0.05, 0.25, 0.98)',
          loop: true,
        })
      )

      const nodes = trinityContainerRef.current.querySelectorAll('.trinity-node')
      if (nodes.length > 0) {
        animations.push(
          anime({
            targets: nodes,
            scale: [0.7, 1.3],
            opacity: [0.4, 1],
            duration: 480,
            delay: anime.stagger(130),
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true,
          })
        )
      }
    }

    // 3. MODEL RING: FLUID ELASTIC MORPHING ARC
    if (type === 'ring' && ringContainerRef.current && ringArcRef.current) {
      animations.push(
        anime({
          targets: ringContainerRef.current,
          rotate: 360,
          duration: 1100,
          easing: 'cubicBezier(0.4, 0.15, 0.2, 0.95)',
          loop: true,
        })
      )

      animations.push(
        anime({
          targets: ringArcRef.current,
          strokeDasharray: [
            { value: '4 60', duration: 0 },
            { value: '44 60', duration: 550, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
            { value: '4 60', duration: 550, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
          ],
          strokeDashoffset: [
            { value: 0, duration: 0 },
            { value: -14, duration: 550, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
            { value: -60, duration: 550, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
          ],
          loop: true,
        })
      )

      if (ringCoreRef.current) {
        animations.push(
          anime({
            targets: ringCoreRef.current,
            scale: [0.65, 1.35],
            opacity: [0.35, 1],
            duration: 550,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true,
          })
        )
      }
    }

    // 4. MODEL GYRO: DUAL CONCENTRIC COUNTER-ORBITS
    if (type === 'gyro' && ringContainerRef.current) {
      if (gyroOuterRef.current) {
        animations.push(
          anime({
            targets: gyroOuterRef.current,
            rotate: 360,
            duration: 1200,
            easing: 'linear',
            loop: true,
          })
        )
      }
      if (gyroInnerRef.current) {
        animations.push(
          anime({
            targets: gyroInnerRef.current,
            rotate: -360,
            duration: 800,
            easing: 'linear',
            loop: true,
          })
        )
      }
    }

    // 5. MODEL DOTS: KINETIC 3-DOT STAGGERED WAVE
    if (type === 'dots' && dotsContainerRef.current) {
      const dots = dotsContainerRef.current.querySelectorAll('.kinetic-dot')
      if (dots.length > 0) {
        animations.push(
          anime({
            targets: dots,
            translateY: [-3.5, 3.5],
            scale: [0.75, 1.25],
            opacity: [0.35, 1],
            duration: 450,
            delay: anime.stagger(110),
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true,
          })
        )
      }
    }

    // 6. MODEL IOS: STEPPED RADIAL TICKS
    if (type === 'ios' && ringContainerRef.current) {
      animations.push(
        anime({
          targets: ringContainerRef.current,
          rotate: 360,
          duration: 900,
          easing: 'linear',
          loop: true,
        })
      )
    }

    return () => {
      animations.forEach((a) => a.pause())
    }
  }, [shouldShow, fullscreen, icon, type])

  // Anime.js Animation for Fullscreen Spinner
  React.useEffect(() => {
    if (!shouldShow || !fullscreen) return

    const animations: anime.AnimeInstance[] = []

    if (fullRingRef.current) {
      animations.push(
        anime({
          targets: fullRingRef.current,
          rotate: 360,
          duration: 1400,
          easing: 'cubicBezier(0.4, 0.1, 0.2, 0.95)',
          loop: true,
        })
      )
    }

    if (fullArcRef.current) {
      animations.push(
        anime({
          targets: fullArcRef.current,
          strokeDasharray: [
            { value: '10 195', duration: 0 },
            { value: '135 195', duration: 700, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
            { value: '10 195', duration: 700, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
          ],
          strokeDashoffset: [
            { value: 0, duration: 0 },
            { value: -40, duration: 700, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
            { value: -195, duration: 700, easing: 'cubicBezier(0.4, 0, 0.2, 1)' },
          ],
          loop: true,
        })
      )
    }

    if (fullInnerRingRef.current) {
      animations.push(
        anime({
          targets: fullInnerRingRef.current,
          rotate: -360,
          duration: 1000,
          easing: 'linear',
          loop: true,
        })
      )
    }

    if (fullBadgeRef.current) {
      animations.push(
        anime({
          targets: fullBadgeRef.current,
          translateY: [-4, 4],
          scale: [0.96, 1.04],
          duration: 1500,
          direction: 'alternate',
          easing: 'easeInOutSine',
          loop: true,
        })
      )
    }

    if (fullSparkleRef.current) {
      animations.push(
        anime({
          targets: fullSparkleRef.current,
          scale: [0, 1.3, 0],
          rotate: [0, 120, 240],
          opacity: [0, 1, 0],
          duration: 1600,
          delay: 150,
          easing: 'easeInOutQuad',
          loop: true,
        })
      )
    }

    return () => {
      animations.forEach((a) => a.pause())
    }
  }, [shouldShow, fullscreen])

  // Anime.js Animation for Icon-wrapped Spinner
  React.useEffect(() => {
    if (!shouldShow || !icon || !iconRingRef.current) return

    const iconAnim = anime({
      targets: iconRingRef.current,
      rotate: 360,
      duration: 1000,
      easing: 'cubicBezier(0.4, 0.15, 0.2, 0.95)',
      loop: true,
    })

    return () => {
      iconAnim.pause()
    }
  }, [shouldShow, icon])

  if (!shouldShow) {
    return null
  }

  let spinnerElement: React.ReactNode

  if (type === 'dots') {
    spinnerElement = (
      /* Kinetic 3-Dot Staggered Wave powered by Anime.js */
      <div
        ref={dotsContainerRef}
        className={cn(
          'relative inline-flex items-center justify-center gap-1 shrink-0 py-0.5 transform-gpu',
          colorMap[variant],
          className
        )}
        {...props}
      >
        <span className="kinetic-dot h-1.5 w-1.5 rounded-full bg-current transform-gpu" />
        <span className="kinetic-dot h-1.5 w-1.5 rounded-full bg-current transform-gpu" />
        <span className="kinetic-dot h-1.5 w-1.5 rounded-full bg-current transform-gpu" />
      </div>
    )
  } else if (type === 'trinity') {
    spinnerElement = (
      /* Kinetic Trinity 3-Particle Vortex powered by Anime.js */
      <div
        ref={trinityContainerRef}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 transform-gpu',
          sizeMap[size],
          colorMap[variant],
          className
        )}
        {...props}
      >
        <div className="relative h-full w-full">
          <span className="trinity-node absolute top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-current transform-gpu shadow-xs" />
          <span className="trinity-node absolute bottom-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-current transform-gpu shadow-xs" />
          <span className="trinity-node absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-current transform-gpu shadow-xs" />
        </div>
      </div>
    )
  } else if (type === 'gyro') {
    spinnerElement = (
      /* Kinetic Gyroscope Dual Counter-Spin powered by Anime.js */
      <div
        ref={ringContainerRef}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 transform-gpu',
          sizeMap[size],
          colorMap[variant],
          className
        )}
        {...props}
      >
        <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
          <circle
            ref={gyroOuterRef}
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="28 32"
            className="opacity-90 origin-center"
          />
          <circle
            ref={gyroInnerRef}
            cx="12"
            cy="12"
            r="5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="16 18"
            className="opacity-70 origin-center"
          />
        </svg>
      </div>
    )
  } else if (type === 'ios') {
    spinnerElement = (
      /* Apple iOS-style Smooth Radial Ticks powered by Anime.js */
      <div
        ref={ringContainerRef}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 transform-gpu',
          sizeMap[size],
          colorMap[variant],
          className
        )}
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
    )
  } else if (type === 'ring') {
    spinnerElement = (
      /* Fluid Elastic Morphing Arc & Pulsing Core powered by Anime.js */
      <div
        ref={ringContainerRef}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 transform-gpu',
          sizeMap[size],
          colorMap[variant],
          className
        )}
        {...props}
      >
        <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.4"
            className="opacity-15"
          />
          <circle
            ref={ringArcRef}
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
            className="opacity-95"
            style={{ transformOrigin: 'center' }}
          />
          <circle
            ref={ringCoreRef}
            cx="12"
            cy="12"
            r="1.8"
            fill="currentColor"
            className="opacity-90"
            style={{ transformOrigin: 'center' }}
          />
        </svg>
      </div>
    )
  } else {
    /* DEFAULT SIGNATURE: KINETIC QUANTUM GYROSCOPE REACTOR */
    spinnerElement = (
      <div
        ref={ringContainerRef}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 transform-gpu overflow-visible',
          sizeMap[size],
          colorMap[variant],
          className
        )}
        {...props}
      >
        <svg className="h-full w-full overflow-visible" viewBox="0 0 24 24" fill="none">
          {/* Subtle Ambient Track */}
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="1.8"
            className="opacity-15"
          />

          {/* Outer Segmented Quantum Halo (Clockwise Non-linear Kinetic Spin) */}
          <circle
            ref={quantumOuterRef}
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="22 10"
            className="opacity-90 origin-center"
          />

          {/* Middle Gimbal Ellipse (Counter-Rotating Gyroscope Plane) */}
          <ellipse
            ref={quantumInnerRef}
            cx="12"
            cy="12"
            rx="6.2"
            ry="3.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="14 8"
            className="opacity-75 origin-center"
          />

          {/* Central Pulsing Energy Core: Luminous Diamond Gem */}
          <rect
            ref={quantumCoreRef}
            x="10.4"
            y="10.4"
            width="3.2"
            height="3.2"
            rx="0.6"
            fill="currentColor"
            className="opacity-95 origin-center"
          />
        </svg>
      </div>
    )
  }

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-[#F4F6FA]/90 dark:bg-[#14181F]/95 backdrop-blur-xs animate-in fade-in duration-150 gap-3.5 select-none">
        <div className="relative flex h-18 w-18 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0D824B]/20 via-[#007aff]/15 to-[#f59e0b]/20 dark:from-[#34d399]/25 dark:via-[#60a5fa]/20 dark:to-[#fbbf24]/20 blur-lg animate-pulse" />
          <svg
            ref={fullRingRef}
            className="absolute inset-0 h-full w-full transform-gpu"
            viewBox="0 0 72 72"
            fill="none"
          >
            <circle cx="36" cy="36" r="32" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 6" className="text-slate-200/90 dark:text-white/10" />
            <circle cx="36" cy="36" r="32" stroke="url(#spinnerLogoGradient)" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="56 140" />
            <defs>
              <linearGradient id="spinnerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D824B" />
                <stop offset="50%" stopColor="#007aff" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <div
            ref={fullSparkleRef}
            className="absolute -top-1 -right-1 z-20 text-amber-400 dark:text-amber-300 pointer-events-none transform-gpu"
          >
            <Sparkles className="h-3.5 w-3.5 fill-amber-400 dark:fill-amber-300" />
          </div>
          <div
            ref={fullBadgeRef}
            className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#151c28] border-2 border-emerald-100/80 dark:border-white/15 shadow-md shadow-emerald-600/10 p-1.5 overflow-hidden transform-gpu"
          >
            {icon || (
              <img
                src="/Logo.webp"
                alt="Logo Prakom"
                className="h-full w-full object-contain drop-shadow-xs select-none pointer-events-none"
              />
            )}
          </div>
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
          <svg
            ref={iconRingRef}
            className="absolute inset-0 h-full w-full text-current transform-gpu"
            viewBox="0 0 56 56"
            fill="none"
          >
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
