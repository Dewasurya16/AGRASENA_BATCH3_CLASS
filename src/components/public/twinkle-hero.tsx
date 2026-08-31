'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Calendar, BookOpen, Shield, Sparkles, Rocket, Star, Code2, Laptop, Building2, Award } from "lucide-react"
import Link from "next/link"

export function TwinkleHero() {
  return (
    <section className="relative overflow-hidden rounded-[16px] bg-white dark:bg-[#151c28] p-6 sm:p-8 lg:p-10 border border-[#e6e6e6] dark:border-white/10 shadow-xs transition-all duration-300">
      <div className="relative z-10 space-y-8">
        
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Apple SF Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1c2433] px-3 py-1 text-xs font-semibold text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10">
                <Shield className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Kejaksaan RI × Agrasena 625</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1c2433] px-3 py-1 text-xs font-semibold text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-[#16a34a] dark:text-[#4ade80]" strokeWidth={2} />
                <span>120 JP Kurikulum</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1c2433] px-3 py-1 text-xs font-semibold text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10">
                <Calendar className="h-3.5 w-3.5 text-[#007aff] dark:text-[#60a5fa]" strokeWidth={2} />
                <span>35 Hari Roadmap</span>
              </span>
            </div>

            {/* Display Headline with Tight Tracking */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#000000] dark:text-white leading-[1.12]">
              Pusat Materi & Roadmap <br />
              <span className="text-[#007aff] dark:text-[#60a5fa]">
                Pranata Komputer
              </span>{" "}
              Batch 3.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#615d59] dark:text-[#94a3b8] font-normal leading-relaxed max-w-xl">
              Hub terpadu perkuliahan fungsional keahlian. 120 JP modul bahan ajar resmi PDF, rundown harian, bank kuis MOOC, dan asisten generator AI makalah.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/schedules">
                <button className="inline-flex items-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer">
                  <Rocket className="h-4 w-4" strokeWidth={2} />
                  <span>Lihat Jadwal 35 Hari</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </Link>

              <Link href="/materials">
                <button className="inline-flex items-center gap-2 rounded-full bg-white text-[#31302e] dark:bg-[#1c2433] dark:text-white border border-[#e6e6e6] dark:border-white/10 hover:bg-[#f6f5f4] dark:hover:bg-[#253043] active:scale-[0.98] px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer">
                  <FileText className="h-4 w-4 text-[#007aff] dark:text-[#60a5fa]" strokeWidth={2} />
                  <span>Pustaka Modul PDF</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: 5 Cols - Character Illustration & Animated Badges */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-sm flex items-center justify-center py-3"
            >
              {/* Character Image */}
              <img
                src="/ANIME.webp"
                alt="Ilustrasi Diklat Pranata Komputer Kejaksaan RI"
                className="relative z-10 w-full h-auto max-h-72 sm:max-h-80 object-contain hover:scale-102 transition-transform duration-300 drop-shadow-md"
              />

              {/* Floating Apple SF Pill 1: Semangat */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1 -right-2 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#1c2433]/95 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/20 dark:border-white/10 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold shadow-xs cursor-default"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Semangat Diklat</span>
              </motion.div>

              {/* Floating Apple SF Pill 2: Prakom 625 */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-4 -left-2 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#1c2433]/95 text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold shadow-xs cursor-default"
              >
                <Code2 className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Prakom 625</span>
              </motion.div>

              {/* Floating Apple SF Pill 3: 120 JP Ready */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-2 -right-1 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#1c2433]/95 text-[#16a34a] dark:text-[#4ade80] border border-[#16a34a]/20 dark:border-white/10 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold shadow-xs cursor-default"
              >
                <Star className="h-3.5 w-3.5 text-[#16a34a]" strokeWidth={2} />
                <span>120 JP Siap</span>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Bottom 3 Apple SF Database Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#e6e6e6] dark:border-white/10">
          
          {/* Card 1: MOOC & TMO */}
          <div className="rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 transition-all">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
              <span className="text-xs font-semibold text-[#000000] dark:text-white flex items-center gap-1.5">
                <Laptop className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                Tahap 1 & 2 • MOOC & TMO
              </span>
              <span className="font-mono text-xs font-bold text-[#615d59] dark:text-[#94a3b8]">01</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-bold text-sm text-[#000000] dark:text-white">Pembelajaran Mandiri & Online</h4>
              <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                Hari 1 s.d. 15: Modul teori, slide perkuliahan resmi, dan sesi Zoom interaktif.
              </p>
            </div>
          </div>

          {/* Card 2: Lab Satker */}
          <div className="rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 transition-all">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
              <span className="text-xs font-semibold text-[#000000] dark:text-white flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                Tahap 3 • Lab Prakom
              </span>
              <span className="font-mono text-xs font-bold text-[#615d59] dark:text-[#94a3b8]">02</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-bold text-sm text-[#000000] dark:text-white">Laboratorium di Satuan Kerja</h4>
              <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                Hari 16 s.d. 30: Praktikum nyata implementasi proyek TI di unit kerja Kejaksaan RI.
              </p>
            </div>
          </div>

          {/* Card 3: Seminar */}
          <div className="rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 transition-all">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
              <span className="text-xs font-semibold text-[#000000] dark:text-white flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                Tahap 4 • Seminar Klasikal
              </span>
              <span className="font-mono text-xs font-bold text-[#615d59] dark:text-[#94a3b8]">03</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-bold text-sm text-[#000000] dark:text-white">Seminar Akhir & Evaluasi</h4>
              <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                Hari 31 s.d. 35: Presentasi proposal makalah inovasi di hadapan penguji dan panitia.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
