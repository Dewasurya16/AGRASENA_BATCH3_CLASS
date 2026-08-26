'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  FileText,
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  Shield,
  BellRing,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function EleniaSidebar() {
  const pathname = usePathname()

  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutGrid className="h-4 w-4" />, href: "/" },
    { id: "schedules", label: "Roadmap & Jadwal", icon: <Calendar className="h-4 w-4" />, badge: "35 Hari", badgeColor: "orange", href: "/schedules" },
    { id: "materials", label: "Materi & Modul PDF", icon: <FileText className="h-4 w-4" />, badge: "120 JP", badgeColor: "orange", href: "/materials" },
    { id: "tasks", label: "Tugas & Uji Praktek", icon: <BookOpen className="h-4 w-4" />, badge: "Aktif", badgeColor: "coral", href: "/tasks" },
    { id: "announcements", label: "Pengumuman", icon: <BellRing className="h-4 w-4" />, href: "/announcements" },
    { id: "showcase", label: "Laboratorium Prakom", icon: <Award className="h-4 w-4" />, href: "/showcase" },
  ]

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col justify-between rounded-[32px] bg-white p-5 soft-card-shadow border border-slate-100/90 h-full">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D3830] text-white shadow-md shadow-[#0D3830]/20">
            <div className="relative flex items-center justify-center">
              <span className="font-extrabold text-base tracking-tighter">PFS</span>
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#FF7643]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[#131E29] leading-tight">
              Prakom<span className="text-[#FF7643]"> Batch 3</span>
            </span>
            <span className="text-[10px] text-[#6B7C93] font-semibold">
              Kejaksaan RI X Agrasena (Prakom 625)
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0D3830] text-white shadow-md shadow-[#0D3830]/20"
                    : "text-[#6B7C93] hover:bg-slate-50 hover:text-[#131E29]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? "text-white" : "text-[#8C9BAE] group-hover:text-[#0D3830]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeColor === "orange"
                        ? "bg-[#FFEADA] text-[#EA580C]"
                        : "bg-[#FFEAE9] text-[#E11D48]"
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
    </aside>
  )
}
