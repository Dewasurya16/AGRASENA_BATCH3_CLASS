'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, ArrowRight, BellRing } from "lucide-react"
import Link from "next/link"

export interface UrgentAnnouncementProps {
  announcements?: Array<{
    id: string
    title: string
    content: string
    is_urgent: boolean
    author: string
    created_at: string
  }>
}

const DEFAULT_URGENT_ANNOUNCEMENT = {
  id: "ann-update-v24",
  title: "🚀 Pembaruan Sistem: Akses Zoom Angkatan 1–6, PWA Mobile, Ekspor Proposal Word, & Kalkulator DUPAK Telah Aktif!",
  content: "Rekan-rekan peserta Diklat Prakom Batch 3, web portal kelas telah diperbarui ke versi terbaru:\n• 🎥 Akses Zoom Meeting Angkatan 1 s.d. 6 (Passcode: Biropeg-24) tersedia di menu Jadwal / Roadmap.\n• 📱 Bisa Diinstal di HP/Laptop (PWA) via opsi 'Tambahkan ke Layar Utama' browser.\n• 📄 Ekspor AI Makalah kini langsung terunduh dalam format Word (.docx) 5 Bab standar dinas.\n• 📊 Modul Katalog Butir DUPAK & Estimator Angka Kredit (PermenPAN-RB 32/2020 & Perka BPS 2/2021).\n• ⚡ Tekan Ctrl + K untuk Command Palette pencarian instan seluruh materi & jadwal.",
  is_urgent: true,
  author: "Pengurus Diklat & Tim Agrasena 625",
  created_at: new Date().toISOString()
}

export function UrgentAnnouncement({ announcements }: UrgentAnnouncementProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

  const item = announcements?.find((a) => a.is_urgent) ?? DEFAULT_URGENT_ANNOUNCEMENT

  if (isDismissed || !item) return null

  const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Pengumuman penting"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className="relative overflow-hidden rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-4 sm:p-5 shadow-2xs transition-all"
      >
        <div className="flex items-start gap-3.5">
          {/* Icon Pod */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] mt-0.5">
            <Bell className="h-5 w-5" strokeWidth={2} />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            {/* Top Bar: Badge + Date */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#000000] dark:text-white border border-[#e6e6e6] dark:border-white/10 px-2.5 py-0.5 text-[10px] font-semibold shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#007aff] animate-pulse" />
                  Pengumuman Mendesak
                </span>
                <span className="text-[11px] font-normal text-[#615d59] dark:text-[#94a3b8]">
                  {item.author} · {formattedDate}
                </span>
              </div>
            </div>

            {/* Title */}
            <h4 className="text-sm font-bold text-[#000000] dark:text-white tracking-tight leading-snug">
              {item.title}
            </h4>

            {/* Content Body */}
            <div className="text-xs text-[#31302e] dark:text-[#cbd5e1] leading-relaxed whitespace-pre-line font-normal">
              {item.content}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2">
              <Link href="/announcements">
                <button className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer">
                  <BellRing className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Lihat Semua Pengumuman</span>
                  <ArrowRight className="h-3 w-3" strokeWidth={2} />
                </button>
              </Link>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="absolute top-3 right-3 text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            aria-label="Tutup pengumuman"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
