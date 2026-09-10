'use client'

import * as React from "react"
import { AnimatedErrorView } from "@/components/public/error-pages/animated-error-view"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Application Runtime Error:", error)
  }, [error])

  return (
    <AnimatedErrorView
      code="500"
      badgeText="Kendala Server • 500"
      badgeColor="rose"
      title="Terjadi Gangguan Server"
      description="Mohon maaf atas ketidaknyamanan ini. Sistem mengalami kendala tak terduga saat memproses permintaan Anda."
      onReset={reset}
      errorDigest={error.digest}
    />
  )
}
