'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { ModernNavbar } from "@/components/public/modern-navbar"
import { AIAssistantWidget } from "@/components/public/ai-assistant-widget"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { Shield, BookOpen, ExternalLink, Heart, Sparkles } from "lucide-react"
import Link from "next/link"

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col text-[#131E29] dark:text-[#D8E0EC] antialiased selection:bg-[#0D3830] selection:text-white">
      {/* 1. Dynamic Ambient Background Animation */}
      <AnimatedBackground />

      {/* 2. Top Glassmorphism Sticky Navbar */}
      <ModernNavbar />

      {/* 3. Main Single-Column Fluid Container */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-6 sm:space-y-8 pb-24 sm:pb-12">
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
      <footer className="mt-auto border-t border-slate-200/90 dark:border-[#2A3550] bg-white/80 dark:bg-[#14181F]/90 backdrop-blur-md py-6 sm:py-7">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] overflow-hidden shrink-0">
              <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-xs sm:text-sm text-[#131E29] dark:text-slate-100 leading-snug">
                Diklat Fungsional Pranata Komputer Keahlian • Batch 3 Kejaksaan RI
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Dibuat dengan senang hati oleh <span className="font-bold text-slate-800 dark:text-slate-200">Dewa Sinar Surya, S.Kom.</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3.5 gap-y-2 font-medium text-[11px] sm:text-xs">
            <a
              href="https://pengembangan.kejaksaan.go.id/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>Portal LMS</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <Link href="/schedules" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition">
              Roadmap 35 Hari
            </Link>
            <span>•</span>
            <Link href="/materials" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition">
              Modul 120 JP
            </Link>
            <span>•</span>
            <Link href="/paper-generator" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition font-bold text-[#0D824B] dark:text-emerald-400">
              AI Makalah
            </Link>
            <span>•</span>
            <Link href="/templates" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition">
              Template Dokumen
            </Link>
            <span>•</span>
            <Link href="/exam-prep" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition">
              Persiapan Ujian
            </Link>
            <span>•</span>
            <Link href="/discussions" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition">
              Forum Diskusi
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#0D3830] dark:hover:text-emerald-400 transition font-bold text-[#FF7643] dark:text-amber-400">
              Bantuan & FAQ
            </Link>
          </div>
        </div>
      </footer>

      {/* 5. Floating AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  )
}
