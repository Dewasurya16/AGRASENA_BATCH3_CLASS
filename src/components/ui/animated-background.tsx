'use client'

import * as React from "react"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Soft Base Mesh Gradient */}
      <div className="absolute inset-0 bg-[#f6f5f4] dark:bg-[#0c1017] transition-colors duration-300" />

      {/* Pre-blended Zero-GPU-Overhead Ambient Radial Orbs */}
      <div
        className="absolute -top-24 -left-24 h-[450px] w-[450px] rounded-full pointer-events-none opacity-80 dark:opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, rgba(0, 122, 255, 0) 70%)',
        }}
      />
      <div
        className="absolute top-1/4 -right-28 h-[500px] w-[500px] rounded-full pointer-events-none opacity-80 dark:opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(175, 82, 222, 0.08) 0%, rgba(175, 82, 222, 0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full pointer-events-none opacity-80 dark:opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(52, 199, 89, 0.07) 0%, rgba(52, 199, 89, 0) 70%)',
        }}
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
