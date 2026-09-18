'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * BatchAutoRedirect
 * Otomatis mengalihkan peserta yang telah memilih Agrasena Batch 4 ke rute /batch-4
 * secara instan agar tidak menampilkan halaman Batch 3 terlebih dahulu.
 * Jika URL memiliki parameter ?batch=batch-3 atau ?b=3, preferensi diperbarui ke Batch 3.
 */
export function BatchAutoRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const requestedBatch = urlParams.get('batch') || urlParams.get('b')

      if (requestedBatch === 'batch-3' || requestedBatch === '3') {
        localStorage.setItem('prakom_user_batch', 'batch-3')
        window.dispatchEvent(new CustomEvent('prakom-batch-changed'))
        return
      }

      if (requestedBatch === 'batch-4' || requestedBatch === '4') {
        localStorage.setItem('prakom_user_batch', 'batch-4')
        window.dispatchEvent(new CustomEvent('prakom-batch-changed'))
        if (!pathname.startsWith('/batch-4') && !pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/auth')) {
          router.replace(pathname === '/' ? '/batch-4' : `/batch-4${pathname}`)
        }
        return
      }

    } catch {
      // Ignore localStorage errors
    }
  }, [pathname, router])

  return null
}
