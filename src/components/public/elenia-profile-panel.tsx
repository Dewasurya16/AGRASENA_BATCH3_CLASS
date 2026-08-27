'use client'

import * as React from "react"
import {
  GraduationCap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Award,
  Layers
} from "lucide-react"
import Link from "next/link"
import { getCurrentDiklatDay, RAW_DAYS_DATA } from "@/lib/roadmap-utils"

export function ClassInfoPanel() {
  const currentDay = getCurrentDiklatDay()
  const currentCurriculum = RAW_DAYS_DATA.find((d) => d.day === currentDay) || RAW_DAYS_DATA[0]
  const progressPct = Math.round((currentDay / 35) * 100)

  const stages = [
    {
      title: "Tahap 1 • MOOC (Mandiri)",
      duration: "Hari 1 - 5 (24 - 28 Agu)",
      status: currentDay > 5 ? "Selesai" : currentDay >= 1 ? "Sedang Berjalan" : "Mendatang",
      color: currentDay > 5
        ? "bg-[#E6F7ED] text-[#0D824B] border-[#A7F3D0]"
        : currentDay >= 1
        ? "bg-[#FFEADA] text-[#EA580C] border-[#FFD2B8]"
        : "bg-slate-100 text-slate-600 border-slate-200",
    },
    {
      title: "Tahap 2 • TMO (Tatap Muka Online)",
      duration: "Hari 6 - 15 (31 Agu - 11 Sep)",
      status: currentDay > 15 ? "Selesai" : currentDay >= 6 ? "Sedang Berjalan" : "Mendatang",
      color: currentDay > 15
        ? "bg-[#E6F7ED] text-[#0D824B] border-[#A7F3D0]"
        : currentDay >= 6
        ? "bg-[#FFEADA] text-[#EA580C] border-[#FFD2B8]"
        : "bg-[#E8F2FE] text-[#2563EB] border-[#BFDBFE]",
    },
    {
      title: "Tahap 3 • Lab Prakom di Unit Kerja",
      duration: "Hari 16 - 30 (14 Sep - 2 Okt)",
      status: currentDay > 30 ? "Selesai" : currentDay >= 16 ? "Sedang Berjalan" : "Mendatang",
      color: currentDay > 30
        ? "bg-[#E6F7ED] text-[#0D824B] border-[#A7F3D0]"
        : currentDay >= 16
        ? "bg-[#FFEADA] text-[#EA580C] border-[#FFD2B8]"
        : "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]",
    },
    {
      title: "Tahap 4 • Seminar Klasikal",
      duration: "Hari 31 - 35 (5 - 9 Okt)",
      status: currentDay > 35 ? "Selesai" : currentDay >= 31 ? "Sedang Berjalan" : "Mendatang",
      color: currentDay > 35
        ? "bg-[#E6F7ED] text-[#0D824B] border-[#A7F3D0]"
        : currentDay >= 31
        ? "bg-[#FFEADA] text-[#EA580C] border-[#FFD2B8]"
        : "bg-[#FFF2D1] text-[#B47D00] border-[#FFE7A3]",
    },
  ]

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      <div className="rounded-[32px] bg-white p-6 soft-card-shadow border border-slate-100/90 space-y-6">
        
        {/* Diklat Badge & Identity matching Gambar 1 */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3830] text-white shadow-lg shadow-[#0D3830]/20 mb-3">
            <GraduationCap className="h-8 w-8 text-[#E6F7ED]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1.5">
            <span className="rounded-full bg-[#FFEADA] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#EA580C]">
              Diklat Fungsional
            </span>
            <span className="rounded-full bg-[#E6F7ED] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#0D824B]">
              Total 120 JP
            </span>
          </div>

          <h4 className="font-extrabold text-sm sm:text-base text-[#131E29] leading-snug">
            Pranata Komputer Keahlian — Batch 3
          </h4>
          <p className="text-[11px] text-[#6B7C93] mt-1">
            Kerja sama Kejaksaan RI X Agrasena (Prakom 625)
          </p>
        </div>

        {/* Progress Tracker Widget matching Gambar 2 */}
        <div className="rounded-[24px] bg-[#F8FAFC] p-4 border border-slate-200/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#131E29]">
            <span>Roadmap Progres</span>
            <span className="text-[#EA580C] font-mono font-bold">{progressPct}% Selesai</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#FF7643]" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B7C93] pt-1">
            <span>Hari ke-{currentDay} dari 35 Hari</span>
            <span className="font-bold text-[#0D824B]">{currentCurriculum.stageName}</span>
          </div>
        </div>

        {/* 4 Stages Breakdown matching Gambar 2, 3, 4 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-xs sm:text-sm text-[#131E29]">4 Tahapan Pelatihan</h5>
            <Link href="/schedules" className="text-[11px] font-bold text-[#FF7643] hover:underline">
              Buka Jadwal
            </Link>
          </div>

          <div className="space-y-2">
            {stages.map((stg, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl bg-[#F8FAFC] p-3 border border-slate-100 hover:bg-white hover:shadow-xs transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h6 className="font-bold text-xs text-[#131E29]">{stg.title}</h6>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${stg.color}`}>
                    {stg.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7C93]">{stg.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links: Portal LMS & Grup WA */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-[11px] font-bold text-[#8C9BAE] uppercase tracking-wider">
            Tautan Cepat
          </p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2.5 text-xs font-bold text-[#131E29] hover:bg-[#E6F7ED] hover:text-[#0D824B] border border-slate-100 transition"
            >
              <MessageCircle className="h-4 w-4 text-[#0D824B]" />
              <span>Grup WA</span>
            </a>

            <a
              href="https://pengembangan.kejaksaan.go.id/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2.5 text-xs font-bold text-[#131E29] hover:bg-[#FFEADA] hover:text-[#EA580C] border border-slate-100 transition"
            >
              <BookOpen className="h-4 w-4 text-[#EA580C]" />
              <span>Portal LMS</span>
            </a>
          </div>
        </div>

        {/* Storage & Backup Status */}
        <div className="flex items-center justify-between rounded-2xl bg-[#E6F7ED]/60 p-3.5 border border-[#A7F3D0]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#0D824B]" />
            <div>
              <p className="text-xs font-bold text-[#0D824B]">Cloud Backup Aktif</p>
              <p className="text-[10px] text-[#065F46]">Modul PDF Supabase Ready</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}
