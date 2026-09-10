'use client'

import * as React from "react"
import { AnimatedErrorView } from "@/components/public/error-pages/animated-error-view"

export function ForbiddenView() {
  return (
    <AnimatedErrorView
      code="403"
      badgeText="Akses Dibatasi • 403"
      badgeColor="amber"
      title="Akses Ditolak (Forbidden)"
      description="Halaman atau fitur ini memerlukan hak otorisasi khusus administrator atau profil peserta diklat yang sah."
    />
  )
}
