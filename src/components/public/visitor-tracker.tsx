'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)
  const lastTrackedTime = useRef<number>(0)

  useEffect(() => {
    // 1. Never track on localhost / local development environment
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const isLocal =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.endsWith('.local') ||
        window.location.port === '3000' ||
        window.location.port === '3001'

      if (isLocal) {
        return
      }
    }

    // 2. Avoid re-tracking identical path within 5 seconds in same session
    const now = Date.now()
    if (lastTrackedPath.current === pathname && now - lastTrackedTime.current < 5000) {
      return
    }

    lastTrackedPath.current = pathname
    lastTrackedTime.current = now

    const trackVisit = async () => {
      try {
        const payload = {
          path: pathname || window.location.pathname,
          referrer: document.referrer || '',
          screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
          language: typeof navigator !== 'undefined' ? navigator.language : '',
        }

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        })
      } catch {
        // Silently ignore analytics network failures
      }
    }

    // Small delay to ensure browser environment is idle
    const timeout = setTimeout(trackVisit, 300)
    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}
