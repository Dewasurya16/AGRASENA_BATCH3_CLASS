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
    <div className="relative min-h-screen flex flex-col text-[#131E29] dark:text-slate-100 antialiased selection:bg-[#0D3830] selection:text-white">
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
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#12161F]/80 backdrop-blur-md py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7C93] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg overflow-hidden">
              <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
            </div>
            <span className="font-semibold text-[#131E29] dark:text-slate-200">
              Diklat Fungsional Pranata Komputer Keahlian • Batch 3 Kejaksaan RI
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-medium">
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
