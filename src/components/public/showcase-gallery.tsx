'use client'

import * as React from "react"
import { Trophy, Star, ExternalLink, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ShowcaseItem {
  id: string
  title: string
  subject_name: string
  student_names: string
  description?: string | null
  project_url?: string | null
  file_url?: string | null
  preview_image_url?: string | null
}

const DEFAULT_SHOWCASES: ShowcaseItem[] = [
  {
    id: "show-1",
    title: "AI Medical Diagnostic Assistant",
    subject_name: "Kecerdasan Buatan & ML",
    student_names: "Ahmad Fauzi, Aisyah Putri, Bagus Pratama",
    description: "Sistem pendeteksi dini penyakit berbasis citra medis dengan convolutional neural network dan akurasi 94.2%.",
    project_url: "https://github.com/example/ai-diagnostic",
  },
  {
    id: "show-2",
    title: "Sistem Informasi Geografis Tata Ruang Kota",
    subject_name: "Pemrograman Web Lanjut",
    student_names: "Citra Dewi, Daffa Al-Ghifari",
    description: "Peta interaktif zonasi kawasan lindung dan tata guna lahan berbasis Leaflet.js dan Supabase GeoJSON.",
    project_url: "https://github.com/example/gis-smartcity",
  },
  {
    id: "show-3",
    title: "High-Performance Redis Cache Layer for E-Commerce",
    subject_name: "Basis Data Terdistribusi",
    student_names: "Fajar Hidayat, Gita Safitri",
    description: "Implementasi caching terdistribusi dengan Redis Cluster yang meningkatkan throughput API hingga 400%.",
    project_url: "https://github.com/example/redis-arch",
  },
]

export function ShowcaseGallery({ showcases }: { showcases?: ShowcaseItem[] }) {
  const list = showcases && showcases.length > 0 ? showcases : DEFAULT_SHOWCASES

  return (
    <section id="showcase" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[16px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-3 py-0.5 text-xs font-semibold">
                <Trophy className="h-3.5 w-3.5 text-[#ff9500]" strokeWidth={2} />
                <span>Featured Projects & Inovasi</span>
              </span>
              <span className="rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-2.5 py-0.5 text-xs font-semibold">
                Prakom Batch 3
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
              Galeri Showcase & <br className="hidden sm:block" />
              <span className="text-[#007aff] dark:text-[#60a5fa]">Karya Inovasi Terbaik.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
              Kumpulan hasil tugas besar, prototipe aplikasi, dan karya proyek teknologi informasi terbaik dari peserta Diklat Fungsional Prakom Kejaksaan RI.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {list.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-[14px] bg-white dark:bg-[#141b27] p-5 border border-[#e6e6e6] dark:border-white/10 shadow-2xs hover:border-[#007aff]/60 transition-all space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#d97706] dark:text-[#fbbf24] bg-[#ff9500]/15 px-2.5 py-0.5 rounded-full border border-[#ff9500]/30">
                  <Star className="h-3 w-3 fill-[#ff9500] text-[#ff9500]" strokeWidth={2} />
                  Top #{idx + 1}
                </span>
                <span className="rounded-full bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] px-2.5 py-0.5 text-[10px] font-semibold border border-[#34c759]/30">
                  {item.subject_name}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#000000] dark:text-white line-clamp-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-[#e6e6e6] dark:border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#94a3b8]">
                <Users className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{item.student_names}</span>
              </div>

              {item.project_url && (
                <a
                  href={item.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                >
                  <span>Lihat Proyek</span>
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
