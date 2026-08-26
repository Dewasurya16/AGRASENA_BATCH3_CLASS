'use client'

import * as React from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Soft Base Mesh Gradient */}
      <div className="absolute inset-0 bg-[#F4F6FA] dark:bg-[#0B0D11] transition-colors duration-300" />

      {/* Floating Ambient Orb 1 (Forest Mint) */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-24 -left-24 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#0D3830]/10 dark:from-emerald-500/15 via-[#0D824B]/8 dark:via-emerald-400/10 to-transparent blur-[100px]"
      />

      {/* Floating Ambient Orb 2 (Apricot Sunset) */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-28 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[#FF7643]/12 dark:from-amber-500/15 via-[#FFA07A]/8 dark:via-orange-400/10 to-transparent blur-[120px]"
      />

      {/* Floating Ambient Orb 3 (Ice Blue / Cyan) */}
      <motion.div
        animate={{
          x: [0, 60, -50, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 left-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-[#2563EB]/8 dark:from-sky-500/15 via-[#38BDF8]/6 dark:via-indigo-500/10 to-transparent blur-[130px]"
      />

      {/* Subtle Micro-Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0D3830 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  )
}
