'use client'

import { AnimatedErrorView } from "@/components/public/error-pages/animated-error-view"

export default function ErrorPreviewPage() {
  return (
    <AnimatedErrorView
      code="500"
      badgeText="Kendala Server • 500"
      badgeColor="rose"
      title="Terjadi Gangguan Server"
      description="Mohon maaf atas ketidaknyamanan ini. Sistem mengalami kendala tak terduga saat memproses permintaan Anda."
      onReset={() => {
        window.location.reload()
      }}
      errorDigest="AGRA-ERR-625-DEV"
    />
  )
}
