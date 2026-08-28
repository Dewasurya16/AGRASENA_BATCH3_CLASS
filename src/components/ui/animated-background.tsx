'use client'

import * as React from "react"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Soft Base Mesh Gradient */}
      <div className="absolute inset-0 bg-[#F4F6FA] dark:bg-[#0B0D11] transition-colors duration-300" />

      {/* Static GPU-Accelerated Soft Ambient Orbs (Zero CPU/GPU render loop overhead) */}
      <div
        className="absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-[#0D824B]/10 dark:bg-emerald-500/10 blur-[80px] transform-gpu"
      />
      <div
        className="absolute top-1/3 -right-28 h-[450px] w-[450px] rounded-full bg-[#FF7643]/10 dark:bg-amber-500/10 blur-[90px] transform-gpu"
      />
      <div
        className="absolute -bottom-32 left-1/4 h-[450px] w-[450px] rounded-full bg-[#2563EB]/8 dark:bg-sky-500/10 blur-[90px] transform-gpu"
      />

      {/* Subtle Micro-Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0D3830 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  )
}
