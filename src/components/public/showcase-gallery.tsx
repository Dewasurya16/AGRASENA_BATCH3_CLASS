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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#131E29] dark:text-white">
            Galeri Showcase & Karya Terbaik
          </h3>
          <p className="text-xs text-[#6B7C93] dark:text-slate-400">
            Kumpulan hasil tugas besar, aplikasi, dan karya proyek terbaik dari mahasiswa
          </p>
        </div>

        <span className="text-xs font-bold text-[#FF7643] dark:text-amber-300 bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Trophy className="h-4 w-4" />
          Featured Projects
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {list.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-[28px] bg-white dark:bg-[#161B26] p-5 soft-card-shadow border border-slate-100 dark:border-slate-800"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#B47D00] dark:text-amber-300 bg-[#FFF4D6] dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-[#B47D00] dark:fill-amber-400" />
                  Top #{idx + 1}
                </span>
                <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-bold text-[#0D824B] dark:text-emerald-300">
                  {item.subject_name}
                </span>
              </div>

              <h4 className="font-bold text-base text-[#131E29] dark:text-white line-clamp-1">
                {item.title}
              </h4>

              <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-[#6B7C93] dark:text-slate-400">
                <Users className="h-3.5 w-3.5 text-[#0D3830] dark:text-emerald-400 shrink-0" />
                <span className="truncate">{item.student_names}</span>
              </div>

              {item.project_url && (
                <a
                  href={item.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="secondary" size="sm" className="w-full" trailingIcon={<ExternalLink className="h-3 w-3" />}>
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
