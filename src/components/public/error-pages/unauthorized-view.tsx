'use client'

import * as React from "react"
import { AnimatedErrorView } from "@/components/public/error-pages/animated-error-view"

export function UnauthorizedView() {
  return (
    <AnimatedErrorView
      code="401"
      badgeText="Perlu Login • 401"
      badgeColor="indigo"
      title="Belum Terautentikasi"
      description="Sesi login Anda telah kedaluwarsa atau Anda belum masuk dengan akun administrator yang terdaftar."
    />
  )
}
