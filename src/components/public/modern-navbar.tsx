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
  ExternalLink,
  Menu,
  X,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Code2,
  ChevronDown,
  Sun,
  Moon,
  GraduationCap,
  Clock,
  MessageSquare,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppShareModal } from "@/components/public/whatsapp-share-modal"
import { useTheme } from "@/components/theme-provider"

export function ModernNavbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isWAModalOpen, setIsWAModalOpen] = React.useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu & dropdown on path change
  React.useEffect(() => {
    setMobileMenuOpen(false)
    setMoreDropdownOpen(false)
  }, [pathname])

  const primaryLinks = [
    { label: "Overview", href: "/" },
    { label: "Roadmap", href: "/schedules" },
    { label: "Materi PDF", href: "/materials" },
    { label: "Tugas", href: "/tasks" },
    { label: "Kuis MOOC", href: "/quiz" },
    { label: "Snippet Lab", href: "/snippets" },
  ]

  const moreLinks = [
    { label: "AI Makalah Seminar", href: "/paper-generator", icon: GraduationCap, desc: "Penyusun proposal inovasi satker" },
    { label: "Template Dokumen", href: "/templates", icon: Layers, desc: "Unduh SPT, DUPAK, SOP Word" },
    { label: "Persiapan Ujian & Seminar", href: "/exam-prep", icon: Clock, desc: "Countdown & 10 checklist kelulusan" },
    { label: "Forum Diskusi", href: "/discussions", icon: MessageSquare, desc: "Tanya jawab rekan seangkatan" },
    { label: "Bantuan & FAQ", href: "/faq", icon: HelpCircle, desc: "Tanya jawab & formulir lapor kendala" },
    { label: "Pengumuman", href: "/announcements", icon: BellRing, desc: "Edaran panitia & info Zoom" },
    { label: "Galeri Karya", href: "/showcase", icon: Award, desc: "Portofolio tugas & lab peserta" },
  ]

  const isMoreActive = moreLinks.some((l) => pathname.startsWith(l.href))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-[#2A3550] bg-white/95 dark:bg-[#121620]/95 backdrop-blur-xl shadow-xs transition-colors duration-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
          
          {/* 1. Left Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/Logo.webp"
                alt="Logo Prakom Kejaksaan"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Prakom <span className="text-[#FF7643]">Batch 3</span>
                </span>
                <span className="hidden xl:inline-block rounded-full bg-[#E6F7ED] dark:bg-emerald-950/60 dark:border dark:border-emerald-800 px-2 py-0.5 text-[9px] font-extrabold text-[#0D824B] dark:text-emerald-400">
                  120 JP
                </span>
              </div>
              <span className="text-[10px] text-[#6B7C93] dark:text-slate-400 font-semibold hidden sm:inline-block whitespace-nowrap">
                Kejaksaan RI X Agrasena (Prakom 625)
              </span>
            </div>
          </Link>

          {/* 2. Center Desktop Navigation Tabs (Clean, Single Line, No Clutter) */}
          <nav className="hidden lg:flex items-center gap-0.5 rounded-[10px] bg-slate-100/90 dark:bg-[#161B26] p-1 border border-slate-200/90 dark:border-[#2A3550] shrink-0 shadow-2xs">
            {primaryLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center rounded-[8px] px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#253045]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillNav"
                      className="absolute inset-0 rounded-[8px] bg-slate-900 dark:bg-indigo-600 shadow-xs"
                      transition={{ type: "spring", stiffness: 600, damping: 38, mass: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}

            {/* Dropdown "Lainnya" */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`relative flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isMoreActive
                    ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                    : moreDropdownOpen
                    ? "bg-white dark:bg-[#253045] text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#253045]"
                }`}
              >
                <span>Lainnya</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu Popup */}
              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-[12px] bg-white dark:bg-[#1B2130] p-1.5 shadow-lg border border-slate-200/90 dark:border-[#2A3550] z-50 space-y-0.5"
                  >
                    {moreLinks.map((item) => {
                      const Icon = item.icon
                      const isItemActive = pathname.startsWith(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-start gap-2.5 rounded-[8px] p-2 transition-all ${
                            isItemActive
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                              : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#253045]"
                          }`}
                        >
                          <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isItemActive ? "text-indigo-600 dark:text-indigo-400" : "text-orange-500"}`} />
                          <div>
                            <div className="text-xs font-black">{item.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right Desktop Action Buttons (Only visible on Desktop >= lg) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-[#253045] transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsWAModalOpen(true)}
              className="flex items-center gap-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 px-3 py-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Rekap WA</span>
            </button>
            <a
              href="https://pengembangan.kejaksaan.go.id/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="sm"
                className="rounded-[8px] text-xs font-bold whitespace-nowrap dark:bg-[#161B26] dark:border-[#2A3550] dark:text-slate-200"
                trailingIcon={<ExternalLink className="h-3 w-3" />}
              >
                Portal LMS
              </Button>
            </a>
          </div>

          {/* Mobile Actions: Dark Mode + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-[#253045] transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-[#161B26] border border-slate-200 dark:border-[#2A3550] text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#253045] transition active:scale-95 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden border-t border-slate-200/80 dark:border-[#2A3550] bg-white/98 dark:bg-[#14181F]/98 backdrop-blur-xl px-4 py-4 shadow-xl space-y-3"
          >
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1">
                Modul Pembelajaran
              </div>
              {[...primaryLinks, ...moreLinks].map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-[8px] px-3.5 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1B2130] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsWAModalOpen(true)
                }}
                className="flex items-center justify-center gap-2 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 p-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Salin Rekap Harian ke WhatsApp</span>
              </button>
              <a
                href="https://pengembangan.kejaksaan.go.id/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 p-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Buka Portal LMS Kejaksaan</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal isOpen={isWAModalOpen} onClose={() => setIsWAModalOpen(false)} />
    </header>
  )
}
