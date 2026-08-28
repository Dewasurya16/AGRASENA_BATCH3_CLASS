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
    <section id="showcase" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Galeri Showcase & Karya Terbaik
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kumpulan hasil tugas besar, aplikasi, dan karya proyek terbaik dari peserta
          </p>
        </div>

        <span className="text-xs font-bold text-orange-600 dark:text-amber-300 bg-orange-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto border border-orange-200 dark:border-amber-800">
          <Trophy className="h-3.5 w-3.5" />
          Featured Projects
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {list.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-[12px] bg-white dark:bg-[#1B2130] p-4 sm:p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-[4px] border border-amber-200 dark:border-amber-800">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  Top #{idx + 1}
                </span>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {item.subject_name}
                </span>
              </div>

              <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                {item.title}
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-2.5 border-t border-slate-100 dark:border-[#2A3550] pt-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{item.student_names}</span>
              </div>

              {item.project_url && (
                <a
                  href={item.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="secondary" size="sm" className="w-full justify-center rounded-[8px] text-xs font-bold" trailingIcon={<ExternalLink className="h-3 w-3" />}>
                    Lihat Proyek
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
