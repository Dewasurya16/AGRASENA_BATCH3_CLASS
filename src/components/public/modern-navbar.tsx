'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  FileText,
  BookOpen,
  BellRing,
  Award,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Code2,
  ChevronDown,
  Sun,
  Moon,
  GraduationCap,
  Clock,
  MessageSquare,
  Layers,
  Search
} from "lucide-react"
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

  const [userBatch, setUserBatch] = React.useState<"batch-3" | "batch-4">("batch-3")

  React.useEffect(() => {
    const updateBatch = () => {
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
    updateBatch()
    window.addEventListener("storage", updateBatch)
    window.addEventListener("prakom-batch-changed", updateBatch as any)
    return () => {
      window.removeEventListener("storage", updateBatch)
      window.removeEventListener("prakom-batch-changed", updateBatch as any)
    }
  }, [pathname])

  const isBatch4 = pathname.startsWith("/batch-4")

  const primaryLinks = isBatch4
    ? [
        { label: "Overview", href: "/batch-4" },
        { label: "Roadmap", href: "/batch-4/schedules" },
        { label: "Materi PDF", href: "/batch-4/materials" },
        { label: "Tugas", href: "/batch-4/tasks" },
        { label: "Kuis MOOC", href: "/batch-4/quiz" },
        { label: "Snippet Lab", href: "/batch-4/snippets" },
      ]
    : [
        { label: "Overview", href: "/" },
        { label: "Roadmap", href: "/schedules" },
        { label: "Materi PDF", href: "/materials" },
        { label: "Tugas", href: "/tasks" },
        { label: "Kuis MOOC", href: "/quiz" },
        { label: "Snippet Lab", href: "/snippets" },
      ]

  const moreLinks = isBatch4
    ? [
        { label: "AI Laporan Lab Prakom", href: "/batch-4/paper-generator", icon: GraduationCap, desc: "Penyusun laporan laboratorium satker" },
        { label: "Template & DUPAK", href: "/batch-4/templates", icon: Layers, desc: "Katalog Butir AK & Template SPT" },
        { label: "Persiapan Ujian & Seminar", href: "/batch-4/exam-prep", icon: Clock, desc: "Countdown & 10 checklist kelulusan" },
        { label: "Forum Diskusi", href: "/batch-4/discussions", icon: MessageSquare, desc: "Tanya jawab rekan seangkatan" },
        { label: "Bantuan & FAQ", href: "/batch-4/faq", icon: HelpCircle, desc: "Tanya jawab & formulir lapor kendala" },
        { label: "Pengumuman", href: "/batch-4/announcements", icon: BellRing, desc: "Edaran panitia & info Zoom" },
        { label: "Galeri Karya", href: "/batch-4/showcase", icon: Award, desc: "Portofolio tugas & lab peserta" },
      ]
    : [
        { label: "AI Laporan Lab Prakom", href: "/paper-generator", icon: GraduationCap, desc: "Penyusun laporan laboratorium satker" },
        { label: "Template & DUPAK", href: "/templates", icon: Layers, desc: "Katalog Butir AK & Template SPT" },
        { label: "Persiapan Ujian & Seminar", href: "/exam-prep", icon: Clock, desc: "Countdown & 10 checklist kelulusan" },
        { label: "Forum Diskusi", href: "/discussions", icon: MessageSquare, desc: "Tanya jawab rekan seangkatan" },
        { label: "Bantuan & FAQ", href: "/faq", icon: HelpCircle, desc: "Tanya jawab & formulir lapor kendala" },
        { label: "Pengumuman", href: "/announcements", icon: BellRing, desc: "Edaran panitia & info Zoom" },
        { label: "Galeri Karya", href: "/showcase", icon: Award, desc: "Portofolio tugas & lab peserta" },
      ]

  const isMoreActive = moreLinks.some((l) => pathname === l.href || (l.href !== "/" && l.href !== "/batch-4" && pathname.startsWith(l.href)))

  const activeAccentColor = isBatch4 ? "bg-indigo-600" : "bg-[#007aff]"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e6e6e6] dark:border-white/10 bg-white/90 dark:bg-[#101520]/90 backdrop-blur-md transition-colors duration-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between gap-3">
          
          {/* 1. Left Brand Logo */}
          <Link href={isBatch4 ? "/batch-4" : "/"} className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/Logo.webp"
                alt="Logo Prakom Kejaksaan"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-[#000000] dark:text-white whitespace-nowrap">
                  Prakom <span className={isBatch4 ? "text-indigo-600 dark:text-indigo-400" : "text-[#007aff] dark:text-[#60a5fa]"}>
                    {isBatch4 ? "Batch 4" : "Batch 3"}
                  </span>
                </span>
                <span className={`hidden xl:inline-flex items-center rounded-full px-2 py-0.2 text-[9px] font-bold border ${
                  isBatch4
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    : "bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                }`}>
                  {isBatch4 ? "Agrasena 4 • 120 JP" : "Agrasena 3 • 120 JP"}
                </span>
              </div>
              <span className="text-[10px] text-[#615d59] dark:text-[#94a3b8] font-normal hidden sm:inline-block whitespace-nowrap">
                Kejaksaan RI × Agrasena 625
              </span>
            </div>
          </Link>

          {/* 2. Center Desktop Navigation Tabs (Notion Styled Pill Bar) */}
          <nav className="hidden lg:flex items-center gap-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] p-1 border border-[#e6e6e6] dark:border-white/10 shrink-0">
            {primaryLinks.map((link) => {
              const isActive =
                link.href === "/" || link.href === "/batch-4"
                  ? pathname === link.href
                  : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#141b27]/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillNav"
                      className={`absolute inset-0 rounded-full shadow-xs ${activeAccentColor}`}
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
                className={`relative flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  isMoreActive
                    ? `${activeAccentColor} text-white font-semibold shadow-xs`
                    : moreDropdownOpen
                    ? "bg-white dark:bg-[#141b27] text-[#000000] dark:text-white shadow-2xs"
                    : "text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#141b27]/80"
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
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-[14px] bg-white dark:bg-[#141b27] p-1.5 border border-[#e6e6e6] dark:border-white/10 shadow-xl z-50 space-y-0.5"
                  >
                    {moreLinks.map((item) => {
                      const Icon = item.icon
                      const isItemActive = pathname.startsWith(item.href)

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`group flex items-start gap-2.5 rounded-[10px] p-2 transition-colors duration-150 ${
                            isItemActive
                              ? "bg-[#007aff]/10 text-[#007aff] font-semibold dark:bg-[#007aff]/20"
                              : "text-[#31302e] dark:text-[#cbd5e1] hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] hover:text-[#000000] dark:hover:text-white"
                          }`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-colors border border-[#e6e6e6] dark:border-white/10">
                            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#000000] dark:text-white">{item.label}</div>
                            <div className="text-[10px] text-[#615d59] dark:text-[#94a3b8] font-normal leading-tight">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Quick Search Button (Command Palette Ctrl+K) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              title="Pencarian Cepat (Ctrl + K)"
              className="inline-flex items-center gap-2 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 px-2.5 py-1 text-xs text-[#615d59] dark:text-[#94a3b8] hover:border-[#007aff]/40 hover:text-[#000000] dark:hover:text-white transition cursor-pointer shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-[#007aff] dark:text-[#60a5fa]" strokeWidth={2} />
              <span className="hidden xl:inline text-[11px] font-medium">Cari...</span>
              <kbd className="hidden sm:inline-flex items-center rounded bg-white dark:bg-[#141b27] px-1.5 py-0.2 text-[9px] font-mono font-semibold text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10">
                Ctrl K
              </kbd>
            </button>

            {/* Batch Switcher Badge Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('prakom-open-intro'))}
              title={`Sedang di Agrasena ${isBatch4 ? "Batch 4" : "Batch 3"}. Klik untuk ganti angkatan atau data peserta.`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition cursor-pointer active:scale-95 shadow-2xs ${
                isBatch4
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <span className={`h-2 w-2 rounded-full animate-pulse ${isBatch4 ? "bg-indigo-500" : "bg-emerald-500"}`} />
              <span>{isBatch4 ? "Batch 4" : "Batch 3"}</span>
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 text-[#31302e] dark:text-amber-300 hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] transition cursor-pointer shadow-2xs"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-300" strokeWidth={2} /> : <Moon className="h-3.5 w-3.5 text-[#31302e]" strokeWidth={2} />}
            </button>

            {/* Bagikan Kelas Button */}
            <button
              type="button"
              onClick={() => setIsWAModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 px-3 py-1 text-xs font-medium text-[#31302e] dark:text-[#e0e0e0] hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] active:scale-[0.98] transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="h-3 w-3 text-[#007aff]" strokeWidth={2} />
              <span>Bagikan</span>
            </button>

            {/* LMS Diklat Notion Blue / Indigo Button */}
            <a
              href={
                isBatch4
                  ? "https://pengembangan.kejaksaan.go.id/"
                  : "https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full text-white active:scale-[0.98] px-3.5 py-1 text-xs font-semibold transition cursor-pointer shadow-2xs ${
                isBatch4 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#007aff] hover:bg-[#0062cc]"
              }`}
            >
              <span>LMS Diklat</span>
              <ExternalLink className="h-3 w-3 opacity-90" />
            </a>
          </div>

          {/* Mobile Actions: Search + Dark Mode + Profile/Batch + Hamburger */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('prakom-open-intro'))}
              title="Ganti Angkatan"
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-black border transition cursor-pointer ${
                isBatch4
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isBatch4 ? "bg-indigo-500" : "bg-emerald-500"}`} />
              <span>{isBatch4 ? "B4" : "B3"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              aria-label="Buka Pencarian Cepat"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 text-[#007aff] dark:text-[#60a5fa] hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] transition cursor-pointer shadow-2xs"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 text-[#31302e] dark:text-amber-300 hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] transition cursor-pointer shadow-2xs"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 text-[#000000] dark:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] transition active:scale-95 cursor-pointer shadow-2xs"
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
            className="lg:hidden border-t border-[#e6e6e6] dark:border-white/10 bg-white/95 dark:bg-[#101520]/95 backdrop-blur-xl px-4 py-3.5 shadow-xl space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#615d59] dark:text-[#94a3b8] px-3 mb-1">
                <span>Menu {isBatch4 ? "Agrasena Batch 4" : "Agrasena Batch 3"}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                  isBatch4 ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300" : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                }`}>
                  {isBatch4 ? "Batch 4 Aktif" : "Batch 3 Aktif"}
                </span>
              </div>
              {[...primaryLinks, ...moreLinks].map((link) => {
                const isActive =
                  link.href === "/" || link.href === "/batch-4"
                    ? pathname === link.href
                    : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? `${activeAccentColor} text-white shadow-xs`
                        : "text-[#31302e] dark:text-[#cbd5e1] hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] hover:text-[#000000] dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2 border-t border-[#e6e6e6] dark:border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  window.dispatchEvent(new CustomEvent('prakom-open-intro'))
                }}
                className="flex items-center justify-center gap-2 rounded-[8px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-2.5 text-xs font-semibold text-[#000000] dark:text-white hover:bg-[#e6e6e6] transition cursor-pointer"
              >
                <span>Ganti Angkatan / Edit Profil</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsWAModalOpen(true)
                }}
                className="flex items-center justify-center gap-2 rounded-[8px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-2.5 text-xs font-semibold text-[#000000] dark:text-white hover:bg-[#e6e6e6] transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#007aff]" />
                <span>Salin Rekap Harian ke WhatsApp</span>
              </button>
              <a
                href={
                  isBatch4
                    ? "https://pengembangan.kejaksaan.go.id/"
                    : "https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3"
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 rounded-[8px] p-2.5 text-xs font-semibold text-white shadow-xs transition ${
                  isBatch4 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#007aff] hover:bg-[#0062cc]"
                }`}
              >
                <span>Buka Portal LMS Kejaksaan</span>
                <ExternalLink className="h-3.5 w-3.5" />
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
