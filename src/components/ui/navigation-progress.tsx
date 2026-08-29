'use client'

import * as React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Reset when path/params change
  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isVisible) {
      setProgress(100)
      const timeout = setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 250)
      return () => clearTimeout(timeout)
    }
  }, [pathname, searchParams])

  // Listen to internal link clicks with delay threshold
  React.useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      const targetAttr = target.getAttribute('target')

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

      const currentUrl = window.location.pathname + window.location.search
      if (href !== currentUrl) {
        // Only show progress bar if page takes longer than 180ms
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setIsVisible(true)
          setProgress(30)
        }, 180)
      }
    }

    document.addEventListener('click', handleAnchorClick, true)
    return () => {
      document.removeEventListener('click', handleAnchorClick, true)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Animate progress smoothly when visible
  React.useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval)
          return 85
        }
        return prev + Math.floor(Math.random() * 12) + 6
      })
    }, 180)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              opacity: progress >= 100 ? 0 : 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
