'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutGrid,
  Calendar,
  FileText,
  BookOpen,
  BellRing,
  Award,
  Shield,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function ModernNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Close mobile menu on path change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Roadmap 35 Hari", href: "/schedules", badge: "35 Hari" },
    { label: "Materi PDF", href: "/materials", badge: "120 JP" },
    { label: "Tugas & Uji Praktek", href: "/tasks" },
    { label: "Pengumuman", href: "/announcements" },
    { label: "Lab Prakom", href: "/showcase" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          
          {/* 1. Left Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/Logo.webp"
                alt="Logo Prakom Kejaksaan"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#131E29]">
                  Prakom <span className="text-[#FF7643]">Batch 3</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#E6F7ED] px-2 py-0.5 text-[10px] font-extrabold text-[#0D824B]">
                  120 JP
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#6B7C93] font-semibold">
                Kejaksaan RI X Agrasena (Prakom 625)
              </span>
            </div>
          </Link>

          {/* 2. Center Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-[#F4F6FA] p-1.5 border border-slate-200/70">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "text-white"
                      : "text-[#52647C] hover:text-[#131E29] hover:bg-white/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillNav"
                      className="absolute inset-0 rounded-full bg-[#0D3830] shadow-md shadow-[#0D3830]/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {link.badge && !isActive && (
                    <span className="relative z-10 rounded-full bg-[#FFEADA] px-2 py-0.5 text-[9px] font-extrabold text-[#EA580C]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* 3. Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="https://pengembangan.kejaksaan.go.id/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full text-xs font-bold"
                trailingIcon={<ExternalLink className="h-3 w-3" />}
              >
                Portal LMS
              </Button>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#131E29] hover:bg-slate-100 transition active:scale-95 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-5 shadow-xl"
          >
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#0D3830] text-white shadow-md"
                        : "text-[#52647C] hover:bg-slate-50 hover:text-[#131E29]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          isActive ? "bg-white/20 text-white" : "bg-[#FFEADA] text-[#EA580C]"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              })}

              <div className="pt-4 mt-2 border-t border-slate-100">
                <a
                  href="https://pengembangan.kejaksaan.go.id/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0D3830] p-3 text-xs font-bold text-white shadow-sm hover:bg-[#082822] transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Buka Portal LMS Kejaksaan</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
