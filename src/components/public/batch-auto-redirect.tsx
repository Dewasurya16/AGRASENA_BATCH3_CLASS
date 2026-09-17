'use client'

import * as React from 'react'

/**
 * BatchAutoRedirect
 * Otomatis mengalihkan peserta yang telah memilih Agrasena Batch 4 ke rute /batch-4
 * secara instan agar tidak menampilkan halaman Batch 3 terlebih dahulu.
 */
export function BatchAutoRedirect() {
  React.useEffect(() => {
    try {
      const savedBatch = localStorage.getItem('prakom_user_batch')
      if (savedBatch === 'batch-4' && window.location.pathname === '/') {
        window.location.replace('/batch-4')
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  return null
}
