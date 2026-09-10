'use client'

import * as React from "react"
import {
  BellRing,
  Pin,
  Calendar,
  User,
  Search,
  Sparkles,
  ExternalLink,
  Share2,
  Check,
  ArrowLeft,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { renderContentWithLinks, getPrimaryLink } from "@/components/public/urgent-announcement"

export interface AnnouncementItem {
  id: string
  title: string
  content: string
  is_urgent: boolean
  author: string
  created_at: string
}

interface AnnouncementsListProps {
  announcements: AnnouncementItem[]
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterType, setFilterType] = React.useState<"all" | "urgent" | "general">("all")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const filteredAnnouncements = React.useMemo(() => {
    return announcements.filter((item) => {
      // Filter by type
      if (filterType === "urgent" && !item.is_urgent) return false
      if (filterType === "general" && item.is_urgent) return false

      // Filter by search query
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const titleMatch = item.title?.toLowerCase().includes(q)
      const contentMatch = item.content?.toLowerCase().includes(q)
      const authorMatch = item.author?.toLowerCase().includes(q)
      return titleMatch || contentMatch || authorMatch
    })
  }, [announcements, searchQuery, filterType])

  const handleShareToWA = (item: AnnouncementItem) => {
    const primaryLink = getPrimaryLink(item.content)
    let text = `📢 *PENGUMUMAN KELAS DIKLAT PRAKOM BATCH 3*\n\n`
    text += `📌 *${item.title}*\n`
    text += `🗓️ ${new Date(item.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}\n`
    text += `👤 Oleh: ${item.author}\n\n`
    text += `${item.content}\n\n`
    if (primaryLink) {
      text += `🔗 *Tautan*: ${primaryLink.href}\n\n`
    }
    text += `Akses web portal resmi: https://agrasena-batch-3-class.vercel.app/announcements`

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
  }

  const handleCopyLink = (id: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#0D3830] dark:hover:text-emerald-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Diklat Prakom Batch 3 Kejaksaan RI
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="rounded-[16px] bg-white dark:bg-[#1B2130] p-6 border border-slate-200 dark:border-[#2A3550] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFEAE9] dark:bg-rose-950/80 text-[#E11D48] dark:text-rose-300 shadow-2xs">
            <BellRing className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#131E29] dark:text-white tracking-tight">
              Papan Informasi & Pengumuman Resmi
            </h1>
            <p className="text-xs text-[#6B7C93] dark:text-slate-400 mt-0.5">
              Broadcast informasi penting, link berkas labkom, edaran widyaiswara, dan jadwal perkuliahan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 px-3.5 py-1 text-xs font-extrabold text-rose-700 dark:text-rose-300">
            {announcements.filter((a) => a.is_urgent).length} Mendesak
          </span>
          <span className="rounded-full bg-slate-100 dark:bg-[#253045] px-3.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            {announcements.length} Total Edaran
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengumuman, materi, atau link..."
            className="w-full h-10 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Reset
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              filterType === "all"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs"
                : "bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
          >
            Semua ({announcements.length})
          </button>
          <button
            onClick={() => setFilterType("urgent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              filterType === "urgent"
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
          >
            🚨 Mendesak ({announcements.filter((a) => a.is_urgent).length})
          </button>
          <button
            onClick={() => setFilterType("general")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              filterType === "general"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
          >
            Info Umum ({announcements.filter((a) => !a.is_urgent).length})
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="rounded-[16px] bg-white dark:bg-[#1B2130] p-12 text-center border border-dashed border-slate-200 dark:border-[#2A3550] space-y-3">
          <Sparkles className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="font-bold text-base text-[#18181B] dark:text-white">
            {searchQuery ? "Tidak ada pengumuman yang cocok" : "Belum Ada Pengumuman Aktif"}
          </h4>
          <p className="text-xs text-[#6B7C93] dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `Tidak ditemukan pengumuman dengan kata kunci "${searchQuery}". Coba kata kunci lain atau reset filter.`
              : "Saat ini belum ada siaran informasi atau edaran dari pengurus diklat."}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterType("all")
              }}
              className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
            >
              Lihat Semua Pengumuman
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => {
            const primaryLink = getPrimaryLink(item.content)
            const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })

            return (
              <article
                key={item.id}
                className="rounded-[20px] sm:rounded-[24px] bg-white dark:bg-[#161B26] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Header: Badge + Title + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.is_urgent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE9] dark:bg-rose-950/80 px-3 py-1 text-[11px] font-extrabold text-[#E11D48] dark:text-rose-300 border border-[#FFCDCA] dark:border-rose-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <Pin className="h-3 w-3" />
                        Mendesak / Urgent
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        Info Perkuliahan
                      </span>
                    )}
                    <h2 className="font-extrabold text-sm sm:text-base text-[#131E29] dark:text-white leading-snug">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8C9BAE] dark:text-slate-400 font-medium shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Content Body dengan Tautan Aktif */}
                <div className="text-xs sm:text-sm text-[#52647C] dark:text-slate-300 leading-relaxed whitespace-pre-line break-words">
                  {renderContentWithLinks(item.content)}
                </div>

                {/* Action Button Pintasan & Bagikan */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0D3830] dark:text-emerald-400">
                    <User className="h-3.5 w-3.5" />
                    <span>Oleh: {item.author}</span>
                  </div>

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

                    <button
                      onClick={() => handleShareToWA(item)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                      title="Bagikan ke WhatsApp Group"
                    >
                      <Share2 className="h-3 w-3" />
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
