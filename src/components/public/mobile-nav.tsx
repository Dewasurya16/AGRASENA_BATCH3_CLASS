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
      <header className="sticky top-0 z-40 block lg:hidden w-full bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
              <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#131E29] leading-tight">
                Prakom <span className="text-[#FF7643]">Batch 3</span>
              </span>
              <span className="text-[9px] text-[#6B7C93] font-semibold">
                Kejaksaan RI X Agrasena (Prakom 625)
              </span>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#131E29] border border-slate-200 hover:bg-slate-100 transition active:scale-95"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div className="space-y-6">
                {/* Header in Drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0D3830] text-white shadow-md">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#131E29]">Prakom Batch 3</h4>
                      <p className="text-[10px] text-[#0D824B] font-bold">Total 120 JP • 35 Hari</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl p-2 text-[#8C9BAE] hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-[#0D3830] text-white shadow-md"
                            : "text-[#52647C] hover:bg-slate-50 hover:text-[#131E29]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={isActive ? "text-white" : "text-[#8C9BAE]"}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#FFEADA] text-[#EA580C]"
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
              <div className="mt-8 rounded-2xl bg-[#F8FAFC] p-4 border border-slate-200/70 text-center space-y-2">
                <p className="text-xs font-bold text-[#131E29]">Portal LMS Kejaksaan RI</p>
                <a
                  href="https://pengembangan.kejaksaan.go.id/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#0D3830] px-3 py-2 text-xs font-bold text-white shadow-sm"
                >
                  <span>Buka LMS Dashboard</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Floating Bottom Navigation Dock for Mobile (iPhone & Android thumb reach) */}
      <nav className="fixed bottom-3 left-4 right-4 z-40 block lg:hidden">
        <div className="mx-auto max-w-md rounded-full bg-white/90 backdrop-blur-lg px-3 py-2 shadow-xl shadow-slate-900/10 border border-slate-200/80 flex items-center justify-around">
          {bottomDockItems.map((tab, idx) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href)

            return (
              <Link
                key={idx}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
                  isActive ? "text-[#0D3830] font-extrabold" : "text-[#8C9BAE] hover:text-[#131E29]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 rounded-full bg-[#E6F7ED] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{tab.icon}</span>
                <span className="text-[9px] mt-0.5 tracking-tight">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
