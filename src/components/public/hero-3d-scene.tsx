'use client'

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  GraduationCap,
  Layers,
  Sparkles,
  Shield,
  Award,
  Database,
  Cpu,
  Terminal,
  FileCode2
} from "lucide-react"

export function Hero3dScene() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Mouse position tracking for 3D tilt parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for fluid 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    damping: 25,
    stiffness: 200,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), {
    damping: 25,
    stiffness: 200,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top
    mouseX.set(clientX / width - 0.5)
    mouseY.set(clientY / height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-64 sm:h-72 w-full items-center justify-center cursor-pointer select-none"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic 3D Scene Root with Tilt */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center"
      >
        {/* Glowing 3D Ambient Base Aura */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(-40px)" }}
          className="absolute h-44 w-44 rounded-full bg-gradient-to-tr from-[#FF7643]/30 via-[#E6F7ED]/25 to-[#0D824B]/30 blur-2xl pointer-events-none"
        />

        {/* 3D Orbiting Ring 1 (Horizontal) */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d", transform: "rotateX(70deg) translateZ(0px)" }}
          className="absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full border border-dashed border-white/20"
        >
          {/* Orbiting Satellite Dot 1 */}
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#FF7643] shadow-[0_0_12px_#FF7643]" />
        </motion.div>

        {/* 3D Orbiting Ring 2 (Tilted) */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d", transform: "rotateY(65deg) rotateX(25deg)" }}
          className="absolute h-52 w-52 sm:h-60 sm:w-60 rounded-full border border-white/15"
        >
          {/* Orbiting Satellite Dot 2 */}
          <div className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#E6F7ED] shadow-[0_0_10px_#E6F7ED]" />
        </motion.div>

        {/* Floating 3D Central Isometric Core Card */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotateZ: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(30px)",
          }}
          className="relative flex h-32 w-32 sm:h-36 sm:w-36 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 p-4 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/40"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D3830] text-white shadow-lg shadow-[#0D3830]/50 border border-white/20">
            <Cpu className="h-7 w-7 text-[#E6F7ED]" />
          </div>

          <span className="mt-2 text-[10px] font-extrabold tracking-wider uppercase text-white/90">
            PFS Prakom
          </span>
          <span className="text-[9px] font-bold text-[#FF7643]">Batch 3 • 120 JP</span>
        </motion.div>

        {/* Floating Holographic 3D Badge 1 (Top-Left: Kejaksaan RI) */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            x: [-3, 3, -3],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(60px) translate3d(-60px, -60px, 0)",
          }}
          className="absolute -top-4 -left-6 sm:-left-8 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 backdrop-blur-md border border-white/25 shadow-lg shadow-black/20"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#0D824B] text-white">
            <Shield className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-white">Kejaksaan RI</span>
        </motion.div>

        {/* Floating Holographic 3D Badge 2 (Bottom-Right: Pusdiklat BPS) */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            x: [4, -4, 4],
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(75px) translate3d(60px, 50px, 0)",
          }}
          className="absolute -bottom-2 -right-4 sm:-right-8 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 backdrop-blur-md border border-white/25 shadow-lg shadow-black/20"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#FF7643] text-white">
            <Award className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-white">Pusdiklat BPS</span>
        </motion.div>

        {/* Floating Holographic 3D Badge 3 (Top-Right: 4 Tahapan) */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(50px) translate3d(50px, -50px, 0)",
          }}
          className="absolute -top-3 -right-6 hidden sm:flex items-center gap-1.5 rounded-2xl bg-[#E6F7ED]/20 px-2.5 py-1.5 backdrop-blur-md border border-[#E6F7ED]/30 shadow-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#FFF4D6]" />
          <span className="text-[9px] font-black text-[#E6F7ED]">4 Tahap • 35 Hari</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
