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
  Moon
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
    { label: "Pengumuman", href: "/announcements", icon: BellRing, desc: "Edaran panitia & info Zoom" },
    { label: "Galeri Karya", href: "/showcase", icon: Award, desc: "Portofolio tugas & lab peserta" },
    { label: "Bantuan & FAQ", href: "/faq", icon: HelpCircle, desc: "Tanya jawab & kontak admin kelas" },
  ]

  const isMoreActive = moreLinks.some((l) => pathname.startsWith(l.href))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#12161F]/90 backdrop-blur-xl shadow-xs transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
          
          {/* 1. Left Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/Logo.webp"
                alt="Logo Prakom Kejaksaan"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-[#131E29] dark:text-white whitespace-nowrap">
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
          <nav className="hidden lg:flex items-center gap-0.5 rounded-full bg-[#F4F6FA] dark:bg-[#1A202C] p-1 border border-slate-200/70 dark:border-slate-700/80 shrink-0">
            {primaryLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "text-white"
                      : "text-[#52647C] dark:text-slate-300 hover:text-[#131E29] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillNav"
                      className="absolute inset-0 rounded-full bg-[#0D3830] dark:bg-emerald-700 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
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
                className={`relative flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isMoreActive
                    ? "bg-[#0D3830] dark:bg-emerald-700 text-white shadow-sm"
                    : moreDropdownOpen
                    ? "bg-white dark:bg-slate-800 text-[#18181B] dark:text-white shadow-xs"
                    : "text-[#52647C] dark:text-slate-300 hover:text-[#131E29] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50"
                }`}
              >
                <span>Lainnya</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu Popup */}
              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#1A202C] p-2 shadow-xl border border-slate-200 dark:border-slate-700 z-50 space-y-1"
                  >
                    {moreLinks.map((item) => {
                      const Icon = item.icon
                      const isItemActive = pathname.startsWith(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-start gap-2.5 rounded-xl p-2.5 transition-all ${
                            isItemActive
                              ? "bg-[#E6F7ED] dark:bg-emerald-950 text-[#0D824B] dark:text-emerald-400"
                              : "text-[#18181B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isItemActive ? "text-[#0D824B]" : "text-[#FF7643]"}`} />
                          <div>
                            <div className="text-xs font-black">{item.label}</div>
                            <div className="text-[10px] text-[#6B7C93] dark:text-slate-400 font-medium leading-tight">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right Action Buttons + Dark Mode Switch */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6FA] dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsWAModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#E6F7ED] dark:bg-emerald-950/70 border border-[#A7F3D0] dark:border-emerald-800 px-3.5 py-1.5 text-xs font-black text-[#0D824B] dark:text-emerald-400 hover:bg-[#D1F2DF] transition shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="h-3.5 w-3.5" />
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
                className="rounded-full text-xs font-bold whitespace-nowrap dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-100 transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 text-[#131E29] dark:text-white hover:bg-slate-100 transition active:scale-95 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="lg:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/98 dark:bg-[#12161F]/98 backdrop-blur-xl px-4 py-5 shadow-xl space-y-3"
          >
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#8C9BAE] dark:text-slate-400 px-3 mb-1">
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
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0D3830] dark:bg-emerald-700 text-white shadow-sm"
                        : "text-[#52647C] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#131E29] dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsWAModalOpen(true)
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#E6F7ED] dark:bg-emerald-950/80 border border-[#A7F3D0] dark:border-emerald-800 p-2.5 text-xs font-bold text-[#0D824B] dark:text-emerald-400 hover:bg-[#D1F2DF] transition cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Salin Rekap Harian ke WhatsApp</span>
              </button>
              <a
                href="https://pengembangan.kejaksaan.go.id/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0D3830] dark:bg-emerald-700 p-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#082822] transition"
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
