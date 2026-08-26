'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Search, Bell, Menu, X, PlusCircle, Sparkles, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface DashboardHeaderProps {
  userEmail?: string
  userRole?: string
  fullName?: string
}

export function DashboardHeader({ userEmail, userRole, fullName }: DashboardHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Ringkasan Dashboard"
    if (path.startsWith("/dashboard/classes")) return "Manajemen Kelas"
    if (path.startsWith("/dashboard/attendance")) return "Absensi Digital"
    if (path.startsWith("/dashboard/assignments")) return "Tugas & Ujian"
    if (path.startsWith("/dashboard/schedule")) return "Jadwal Pelajaran"
    if (path.startsWith("/dashboard/announcements")) return "Papan Pengumuman"
    if (path.startsWith("/dashboard/finances")) return "Kas & Keuangan Kelas"
    return "Dashboard"
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-[#070a14]/80 px-4 sm:px-8 backdrop-blur-2xl">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {getPageTitle(pathname)}
            </h1>
            <p className="hidden sm:block text-[11px] text-slate-400">
              Platform Kolaborasi & Pengelolaan Kelas
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari siswa, tugas, atau kelas..."
              className="h-9 w-64 rounded-full border border-white/[0.08] bg-white/[0.03] pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 backdrop-blur-xl focus:border-indigo-500/60 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>

          {/* Notification Mockup Button */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] transition">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#080b14] text-xs font-bold text-indigo-300 uppercase">
                {fullName?.[0] || userEmail?.[0] || "U"}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                {fullName || userEmail?.split("@")[0] || "Pengguna"}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {userRole || "Member"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl"
          />
          <div className="fixed bottom-0 left-0 top-0 w-72 bg-[#090d18] p-6 border-r border-white/[0.1] shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-white">Web Kelas</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { title: "Ringkasan", href: "/dashboard" },
                  { title: "Manajemen Kelas", href: "/dashboard/classes" },
                  { title: "Absensi Siswa", href: "/dashboard/attendance" },
                  { title: "Tugas & Ujian", href: "/dashboard/assignments" },
                  { title: "Jadwal Pelajaran", href: "/dashboard/schedule" },
                  { title: "Pengumuman", href: "/dashboard/announcements" },
                  { title: "Kas & Keuangan", href: "/dashboard/finances" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block rounded-xl px-3.5 py-2 text-xs font-medium transition",
                      pathname === item.href
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
