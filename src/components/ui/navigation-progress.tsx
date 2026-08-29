'use client'

import * as React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  // Reset when path/params change
  React.useEffect(() => {
    setIsNavigating(false)
    setProgress(100)
    const timeout = setTimeout(() => setProgress(0), 400)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  // Listen to internal link clicks
  React.useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      const targetAttr = target.getAttribute('target')

      // Ignore external, hash, or new-tab links
      if (
        !href ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        targetAttr === '_blank'
      ) {
        return
      }

      // Check if navigating to a different path
      const currentUrl = window.location.pathname + window.location.search
      if (href !== currentUrl) {
        setIsNavigating(true)
        setProgress(25)
      }
    }

    document.addEventListener('click', handleAnchorClick, true)
    return () => document.removeEventListener('click', handleAnchorClick, true)
  }, [])

  // Animate progress smoothly when navigating
  React.useEffect(() => {
    if (!isNavigating) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval)
          return 85
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [isNavigating])

  return (
    <>
      {/* 1. Ultra-sleek Top Progress Bar */}
      <AnimatePresence>
        {(isNavigating || progress > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 h-1 pointer-events-none"
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-200 ease-out"
              style={{
                width: `${progress}%`,
                opacity: progress >= 100 ? 0 : 1,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top-Right Corner Floating Micro-Spinner Badge */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 right-4 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-[#161B26]/95 backdrop-blur-md border border-white/10 text-white shadow-xl">
              <Spinner size="xs" variant="amber" />
              <span className="text-[10.5px] font-bold tracking-wide text-slate-200">
                Memuat...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
