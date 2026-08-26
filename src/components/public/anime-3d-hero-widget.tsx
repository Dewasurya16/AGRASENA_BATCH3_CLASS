'use client'

import * as React from "react"
import { animate } from "animejs"
import { Cpu, Shield, Award, Sparkles } from "lucide-react"

export function Anime3dHeroWidget() {
  const cubeRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!cubeRef.current) return

    try {
      // Anime.js v4 continuous smooth 3D rotation and floating levitation
      const levitation = animate(".anime-hero-floating-card", {
        translateY: [-8, 8],
        rotateZ: [-2, 2],
        duration: 3500,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      })

      const ringRotation = animate(".anime-hero-ring", {
        rotateZ: 360,
        duration: 20000,
        loop: true,
        ease: "linear",
      })

      return () => {
        try {
          levitation.pause()
          ringRotation.pause()
        } catch {}
      }
    } catch {}
  }, [])

  return (
    <div
      className="relative flex h-64 sm:h-72 w-full items-center justify-center select-none"
      style={{ perspective: 1000 }}
    >
      {/* 3D Scene Root */}
      <div
        ref={cubeRef}
        className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glowing Aura */}
        <div className="absolute h-48 w-48 rounded-full bg-gradient-to-tr from-[#FF7643]/30 via-[#E6F7ED]/20 to-[#0D824B]/30 blur-2xl pointer-events-none" />

        {/* 3D Orbiting Ring */}
        <div
          className="anime-hero-ring absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full border border-dashed border-white/20"
          style={{ transform: "rotateX(65deg)" }}
        >
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#FF7643] shadow-[0_0_12px_#FF7643]" />
        </div>

        {/* Central Floating Isometric 3D Card */}
        <div
          className="anime-hero-floating-card relative flex h-36 w-36 sm:h-40 sm:w-40 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 p-4 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/40"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D3830] text-white shadow-lg shadow-[#0D3830]/50 border border-white/20">
            <Cpu className="h-7 w-7 text-[#E6F7ED]" />
          </div>

          <span className="mt-2 text-[10px] font-extrabold tracking-wider uppercase text-white/90">
            PFS Prakom
          </span>
          <span className="text-[9px] font-bold text-[#FF7643]">Batch 3 • 120 JP</span>
        </div>

        {/* Floating 3D Badge 1 (Kejaksaan RI) */}
        <div
          className="absolute -top-3 -left-4 sm:-left-6 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-1.5 backdrop-blur-md border border-white/25 shadow-lg shadow-black/20"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#0D824B] text-white">
            <Shield className="h-3 w-3" />
          </div>
          <span className="text-[10px] font-extrabold text-white">Kejaksaan RI</span>
        </div>

        {/* Floating 3D Badge 2 (Pusdiklat BPS) */}
        <div
          className="absolute -bottom-2 -right-4 sm:-right-6 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-1.5 backdrop-blur-md border border-white/25 shadow-lg shadow-black/20"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#FF7643] text-white">
            <Award className="h-3 w-3" />
          </div>
          <span className="text-[10px] font-extrabold text-white">Pusdiklat BPS</span>
        </div>

        {/* Floating 3D Badge 3 (35 Hari) */}
        <div
          className="absolute -top-2 -right-4 hidden sm:flex items-center gap-1.5 rounded-2xl bg-[#E6F7ED]/20 px-2.5 py-1 backdrop-blur-md border border-[#E6F7ED]/30 shadow-md"
          style={{ transform: "translateZ(30px)" }}
        >
          <Sparkles className="h-3 w-3 text-[#FFF4D6]" />
          <span className="text-[9px] font-black text-[#E6F7ED]">4 Tahap • 35 Hari</span>
        </div>
      </div>
    </div>
  )
}
