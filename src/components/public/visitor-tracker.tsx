'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Helper to generate or retrieve a persistent unique Device ID for this browser/hardware
 */
function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem('prakom_device_id')
    if (!id) {
      // Determine device prefix based on navigator platform / userAgent
      const ua = navigator.userAgent || ''
      let prefix = 'PC'
      if (/android/i.test(ua)) prefix = 'AND'
      else if (/iphone|ipad|ipod/i.test(ua)) prefix = 'IOS'
      else if (/macintosh|mac os x/i.test(ua)) prefix = 'MAC'
      else if (/windows/i.test(ua)) prefix = 'WIN'
      else if (/linux/i.test(ua)) prefix = 'LNX'

      const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase()
      const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase()
      id = `DEV-${prefix}-${rand1}${rand2}`
      localStorage.setItem('prakom_device_id', id)
    }
    return id
  } catch {
    return ''
  }
}

/**
 * Scan for local network IP candidate using WebRTC RTCPeerConnection
 */
function detectLocalIp(): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('')
      return
    }

    try {
      const RTCPeer =
        window.RTCPeerConnection ||
        (window as any).webkitRTCPeerConnection ||
        (window as any).mozRTCPeerConnection

      if (!RTCPeer) {
        resolve('')
        return
      }

      const pc = new RTCPeer({ iceServers: [] })
      let resolved = false

      pc.createDataChannel('')
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => {})

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true
          try {
            pc.close()
          } catch {}
          resolve('')
        }
      }, 700)

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            try {
              pc.close()
            } catch {}
            resolve('')
          }
          return
        }

        const candidate = ice.candidate.candidate
        // Match IPv4 addresses (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
        const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/)
        if (match && match[1] && !match[1].startsWith('0.')) {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            try {
              pc.close()
            } catch {}
            resolve(match[1])
          }
        }
      }
    } catch {
      resolve('')
    }
  })
}

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
        const deviceId = getOrCreateDeviceId()
        const localIp = await detectLocalIp()
        
        let visitorName = ''
        let visitorNip = ''
        let visitorSatker = ''

        try {
          visitorName = localStorage.getItem('prakom_user_name') || ''
          visitorNip = localStorage.getItem('prakom_user_nip') || ''
          visitorSatker = localStorage.getItem('prakom_user_satker') || ''
        } catch {
          // Ignore localStorage read errors
        }

        const payload = {
          path: pathname || window.location.pathname,
          referrer: document.referrer || '',
          screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
          language: typeof navigator !== 'undefined' ? navigator.language : '',
          deviceId,
          localIp,
          visitorName,
          visitorNip,
          visitorSatker,
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

