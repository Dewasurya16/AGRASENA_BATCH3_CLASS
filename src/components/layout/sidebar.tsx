'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/auth/actions"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  Calendar,
  Bell,
  Wallet,
  LogOut,
  ChevronRight,
  Shield
} from "lucide-react"

export interface SidebarProps {
  userEmail?: string
  userRole?: string
  fullName?: string
}

export function Sidebar({ userEmail, userRole = "teacher", fullName }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Ringkasan",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Manajemen Kelas",
      href: "/dashboard/classes",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Absensi Siswa",
      href: "/dashboard/attendance",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      title: "Tugas & Ujian",
      href: "/dashboard/assignments",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Jadwal Pelajaran",
      href: "/dashboard/schedule",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Pengumuman",
      href: "/dashboard/announcements",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      title: "Kas & Keuangan",
      href: "/dashboard/finances",
      icon: <Wallet className="h-4 w-4" />,
    },
  ]

  return (
    <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-white/[0.06] bg-[#070a14]/90 p-5 backdrop-blur-2xl">
      {/* Top section */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080b14]">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">
              Web<span className="text-indigo-400">Kelas</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">Digital Learning Hub</span>
          </div>
        </Link>

        {/* Role Badge */}
        <div className="mx-2 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200 capitalize">
                {fullName || userEmail?.split("@")[0] || "Guru / Pengajar"}
              </p>
              <p className="text-[10px] text-indigo-300 font-mono capitalize">
                Role: {userRole}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_-3px_rgba(99,102,241,0.25)]"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "transition-colors",
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom User info & Signout */}
      <div className="border-t border-white/[0.06] pt-4">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Akun</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
