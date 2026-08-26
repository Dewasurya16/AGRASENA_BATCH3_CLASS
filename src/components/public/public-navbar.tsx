'use client'

import * as React from "react"
import Link from "next/link"
import { GraduationCap, Shield, Layers, BookOpen, Clock, Trophy, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#070a14]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080b14]">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">
              Web<span className="text-indigo-400">Kelas</span>
            </span>
            <span className="ml-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
              Resource Hub
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#schedule" className="hover:text-white transition">
            Jadwal Hari Ini
          </a>
          <a href="#resources" className="hover:text-white transition">
            Materi PDF
          </a>
          <a href="#tasks" className="hover:text-white transition">
            Tugas & Deadline
          </a>
          <a href="#showcase" className="hover:text-white transition">
            Galeri Karya
          </a>
        </nav>

        {/* Right CTA to LMS */}
        <div className="flex items-center gap-3">
          <a
            href="https://pengembangan.kejaksaan.go.id/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="glass"
              size="sm"
            >
              Portal LMS
            </Button>
          </a>
        </div>
      </div>
    </header>
  )
}
