'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { ModernNavbar } from "@/components/public/modern-navbar"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { Shield, BookOpen, ExternalLink, Heart, Sparkles } from "lucide-react"
import Link from "next/link"

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col text-[#131E29] antialiased selection:bg-[#0D3830] selection:text-white">
      {/* 1. Dynamic Ambient Background Animation */}
      <AnimatedBackground />

      {/* 2. Top Glassmorphism Sticky Navbar */}
      <ModernNavbar />

      {/* 3. Main Single-Column Fluid Container */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-8"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* 4. Sleek Modern Minimalist Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7C93]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg overflow-hidden">
              <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
            </div>
            <span className="font-semibold text-[#131E29]">
              Dibuat dengan senang hati oleh Dewa Sinar Surya,S.Kom
            </span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <a
              href="https://pengembangan.kejaksaan.go.id/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0D3830] transition flex items-center gap-1"
            >
              <span>Portal LMS</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <Link href="/schedules" className="hover:text-[#0D3830] transition">
              Roadmap 35 Hari
            </Link>
            <span>•</span>
            <Link href="/materials" className="hover:text-[#0D3830] transition">
              Modul 120 JP
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
