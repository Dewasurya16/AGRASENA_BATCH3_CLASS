'use client'

import * as React from "react"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Soft Base Mesh Gradient */}
      <div className="absolute inset-0 bg-[#f6f5f4] dark:bg-[#0c1017] transition-colors duration-300" />

      {/* Static GPU-Accelerated Soft Ambient Orbs (Zero CPU/GPU render loop overhead) */}
      <div
        className="absolute -top-24 -left-24 h-[450px] w-[450px] rounded-full bg-[#0075de]/8 dark:bg-[#0075de]/12 blur-[100px] transform-gpu"
      />
      <div
        className="absolute top-1/4 -right-28 h-[500px] w-[500px] rounded-full bg-[#d6b6f6]/10 dark:bg-[#a855f7]/10 blur-[110px] transform-gpu"
      />
      <div
        className="absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-[#1aae39]/8 dark:bg-[#10b981]/8 blur-[100px] transform-gpu"
      />

      {/* Subtle Micro-Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  )
}
