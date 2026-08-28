'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  LayoutGrid,
  Calendar,
  FileText,
  BookOpen,
  BellRing,
  Award,
  Shield,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from "lucide-react"

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  // Close drawer on route change
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutGrid className="h-5 w-5" />, href: "/" },
    { id: "schedules", label: "Roadmap 35 Hari", icon: <Calendar className="h-5 w-5" />, badge: "35 Hari", href: "/schedules" },
    { id: "materials", label: "Pustaka Materi PDF", icon: <FileText className="h-5 w-5" />, badge: "120 JP", href: "/materials" },
    { id: "tasks", label: "Tugas & Uji Praktek", icon: <BookOpen className="h-5 w-5" />, badge: "Aktif", href: "/tasks" },
    { id: "announcements", label: "Pengumuman Diklat", icon: <BellRing className="h-5 w-5" />, href: "/announcements" },
    { id: "showcase", label: "Laboratorium Prakom", icon: <Award className="h-5 w-5" />, href: "/showcase" },
  ]

  const bottomDockItems = [
    { label: "Overview", icon: <LayoutGrid className="h-4 w-4" />, href: "/" },
    { label: "Roadmap", icon: <Calendar className="h-4 w-4" />, href: "/schedules" },
    { label: "Materi", icon: <FileText className="h-4 w-4" />, href: "/materials" },
    { label: "Tugas", icon: <BookOpen className="h-4 w-4" />, href: "/tasks" },
    { label: "Info", icon: <BellRing className="h-4 w-4" />, href: "/announcements" },
  ]

  return (
    <>
      {/* 1. Top Mobile Bar */}
      <header className="sticky top-0 z-40 block lg:hidden w-full bg-white/90 dark:bg-[#14181F]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#2A3550] px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] overflow-hidden">
              <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Prakom <span className="text-orange-600 dark:text-orange-400">Batch 3</span>
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                Kejaksaan RI X Agrasena (Prakom 625)
              </span>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-[#161B26] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-200 dark:hover:bg-[#253045] transition active:scale-95"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* 2. Slide-in Drawer with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white dark:bg-[#1B2130] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden border-r border-slate-200 dark:border-[#2A3550]"
            >
              <div className="space-y-5">
                {/* Header in Drawer */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A3550]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-900 dark:bg-indigo-600 text-white shadow-xs">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Prakom Batch 3</h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Total 120 JP • 35 Hari</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-[6px] p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#253045]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-xs font-bold transition-all ${
                          isActive
                            ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161B26] hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? "text-white" : "text-slate-400"}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-orange-100 dark:bg-amber-950/80 text-orange-700 dark:text-amber-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Drawer Bottom CTA */}
              <div className="mt-6 rounded-[10px] bg-slate-50 dark:bg-[#161B26] p-3.5 border border-slate-200/80 dark:border-[#2A3550] text-center space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Portal LMS Kejaksaan RI</p>
                <a
                  href="https://pengembangan.kejaksaan.go.id/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-3 py-2 text-xs font-black text-white shadow-xs hover:bg-slate-800"
                >
                  <span>Buka LMS Dashboard</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Floating Bottom Navigation Dock for Mobile */}
      <nav className="fixed bottom-3 left-4 right-4 z-40 block lg:hidden">
        <div className="mx-auto max-w-md rounded-[14px] bg-white/95 dark:bg-[#1B2130]/95 backdrop-blur-lg px-2.5 py-1.5 shadow-lg border border-slate-200/90 dark:border-[#2A3550] flex items-center justify-around">
          {bottomDockItems.map((tab, idx) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href)

            return (
              <Link
                key={idx}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-[8px] transition-all ${
                  isActive ? "text-slate-900 dark:text-indigo-300 font-black" : "text-slate-400 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 rounded-[8px] bg-slate-100 dark:bg-[#253045] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{tab.icon}</span>
                <span className="text-[9px] mt-0.5 tracking-tight font-bold">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
