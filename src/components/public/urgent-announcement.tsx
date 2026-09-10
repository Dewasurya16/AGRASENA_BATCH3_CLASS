'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, ArrowRight, BellRing, ExternalLink } from "lucide-react"
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

export function getPrimaryLink(text?: string): { href: string; label: string } | null {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i
  const match = text.match(urlRegex)
  if (!match) return null

  let url = match[0]
  const matchTrailing = url.match(/[.,;:!?)]+$/)
  if (matchTrailing) {
    url = url.slice(0, -matchTrailing[0].length)
  }
  const href = url.startsWith("www.") ? `https://${url}` : url

  let label = "Buka Tautan Lampiran"
  const lower = url.toLowerCase()
  if (lower.includes("drive.google.com")) {
    label = "Buka Folder Google Drive"
  } else if (lower.includes("docs.google.com/forms") || lower.includes("forms.gle")) {
    label = "Buka Formulir"
  } else if (lower.includes("docs.google.com")) {
    label = "Buka Google Docs / Sheet"
  } else if (lower.includes("zoom.us")) {
    label = "Buka Ruang Zoom"
  } else if (lower.includes("kejaksaan.go.id")) {
    label = "Buka Portal Kejaksaan"
  } else if (lower.includes("github.com")) {
    label = "Buka Repositori GitHub"
  }

  return { href, label }
}

export function renderContentWithLinks(text?: string) {
  if (!text) return null

  const cleanText = text
    .replace(/@[\u200E\u2068\u2069\s]*Unknown\s+user[\u200E\u2068\u2069\s]*/gi, "Widyaiswara / Pengajar BPS")
    .replace(/@Unknown\s+user/gi, "Widyaiswara / Pengajar BPS")
    .replace(/Past\s+Test/gi, "Post Test")

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
  const parts = cleanText.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(/^(https?:\/\/|www\.)/i)) {
      let url = part
      let trailing = ""
      const matchTrailing = url.match(/[.,;:!?)]+$/)
      if (matchTrailing) {
        trailing = matchTrailing[0]
        url = url.slice(0, -matchTrailing[0].length)
      }

      const href = url.startsWith("www.") ? `https://${url}` : url

      return (
        <React.Fragment key={index}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#007aff] dark:text-[#60a5fa] hover:text-[#0051a8] dark:hover:text-[#93c5fd] hover:underline underline-offset-3 break-all transition-colors cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{url}</span>
            <ExternalLink className="inline-block h-3 w-3 shrink-0" strokeWidth={2.2} />
          </a>
          {trailing}
        </React.Fragment>
      )
    }
    return part
  })
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

  const primaryLink = getPrimaryLink(item.content)

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

            {/* Content Body dengan Link Aktif */}
            <div className="text-xs text-[#31302e] dark:text-[#cbd5e1] leading-relaxed whitespace-pre-line font-normal">
              {renderContentWithLinks(item.content)}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {primaryLink && (
                  <a
                    href={primaryLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>{primaryLink.label}</span>
                  </a>
                )}
                <Link href="/announcements">
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer">
                    <BellRing className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Lihat Semua Pengumuman</span>
                    <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </button>
                </Link>
              </div>
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
