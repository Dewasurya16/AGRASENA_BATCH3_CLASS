'use client'

import * as React from "react"
import { ModernNavbar } from "@/components/public/modern-navbar"
import { IntroScreen } from "@/components/public/intro-screen"
import { AIAssistantWidget } from "@/components/public/ai-assistant-widget"
import { CommandPalette } from "@/components/public/command-palette"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { PageTransition } from "@/components/public/page-transition"
import { Shield, BookOpen, ExternalLink, Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ""
  const [userBatch, setUserBatch] = React.useState<"batch-3" | "batch-4">("batch-3")

  React.useEffect(() => {
    const checkBatch = () => {
      if (pathname.startsWith("/batch-4")) {
        setUserBatch("batch-4")
        try {
          localStorage.setItem("prakom_user_batch", "batch-4")
        } catch {}
      } else if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/auth")) {
        setUserBatch("batch-3")
        try {
          localStorage.setItem("prakom_user_batch", "batch-3")
        } catch {}
      }
    }

    checkBatch()
    window.addEventListener("storage", checkBatch)
    window.addEventListener("prakom-batch-changed", checkBatch as any)
    return () => {
      window.removeEventListener("storage", checkBatch)
      window.removeEventListener("prakom-batch-changed", checkBatch as any)
    }
  }, [pathname])

  const isBatch4 = pathname.startsWith("/batch-4")

  return (
    <div
      className={`relative min-h-screen flex flex-col text-[#131E29] dark:text-[#D8E0EC] antialiased ${
        isBatch4
          ? "selection:bg-emerald-700 selection:text-white"
          : "selection:bg-[#0D3830] selection:text-white"
      }`}
    >
      {/* 0. Layar Intro & Identitas Peserta Gate (Wajib Isi Data Diri) */}
      <IntroScreen />

      {/* 1. Dynamic Ambient Background Animation */}
      <AnimatedBackground />

      {/* 2. Top Glassmorphism Sticky Navbar */}
      <ModernNavbar />

      {/* 3. Main Single-Column Fluid Container with Smooth Page Transition */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-6xl px-3 sm:px-5 lg:px-7 py-3.5 sm:py-6 lg:py-7 space-y-4 sm:space-y-6 pb-20 sm:pb-10">
          <PageTransition>
            <div className="space-y-5 sm:space-y-6">
              {children}
            </div>
          </PageTransition>
        </div>
      </main>

      {/* 4. Sleek Modern Minimalist Footer (Desain sama persis, beda teks & warna tema) */}
      <footer
        className={`mt-auto border-t py-6 sm:py-7 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md transition-colors duration-200 ${
          isBatch4
            ? "border-emerald-200/90 dark:border-emerald-900/50 bg-white/85 dark:bg-[#0b1218]/95 shadow-[0_-4px_20px_rgba(16,185,129,0.06)]"
            : "border-slate-200/90 dark:border-[#2A3550] bg-white/80 dark:bg-[#14181F]/90"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-[8px] overflow-hidden shrink-0 ${
                isBatch4 ? "ring-1 ring-emerald-400/40" : ""
              }`}
            >
              <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-xs sm:text-sm text-[#131E29] dark:text-slate-100 leading-snug">
                {isBatch4
                  ? "Diklat Fungsional Pranata Komputer Keahlian • Batch 4 Kejaksaan RI"
                  : "Diklat Fungsional Pranata Komputer Keahlian • Batch 3 Kejaksaan RI"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Dibuat dengan senang hati oleh{" "}
                <span
                  className={`font-bold ${
                    isBatch4
                      ? "text-emerald-900 dark:text-emerald-200"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  Dewa Sinar Surya, S.Kom.
                </span>
                {isBatch4 ? " • Portal Angkatan 4 Agrasena" : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3.5 gap-y-2 font-medium text-[11px] sm:text-xs">
            <a
              href="https://pengembangan.kejaksaan.go.id/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition flex items-center gap-1 ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              <span>Portal LMS</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/schedules" : "/schedules"}
              className={`transition ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              Roadmap 35 Hari
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/materials" : "/materials"}
              className={`transition ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              Modul 120 JP
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/tasks" : "/tasks"}
              className={`transition ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              Tugas Satker
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/paper-generator" : "/paper-generator"}
              className={`transition font-bold ${
                isBatch4
                  ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                  : "text-[#0D824B] dark:text-emerald-400 hover:text-[#0D3830]"
              }`}
            >
              AI Makalah
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/templates" : "/templates"}
              className={`transition ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              Template Dokumen
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/exam-prep" : "/exam-prep"}
              className={`transition ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              Persiapan Ujian
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/discussions" : "/discussions"}
              className={`transition ${
                isBatch4
                  ? "hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:text-[#0D3830] dark:hover:text-emerald-400"
              }`}
            >
              Forum Diskusi
            </Link>
            <span>•</span>
            <Link
              href={isBatch4 ? "/batch-4/faq" : "/faq"}
              className={`transition font-bold ${
                isBatch4
                  ? "text-teal-600 dark:text-teal-400 hover:text-teal-700"
                  : "text-[#FF7643] dark:text-amber-400 hover:text-[#0D3830]"
              }`}
            >
              Bantuan & FAQ
            </Link>
          </div>
        </div>
      </footer>

      {/* 5. Floating AI Assistant Widget */}
      <AIAssistantWidget />

      {/* 6. Universal Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  )
}
