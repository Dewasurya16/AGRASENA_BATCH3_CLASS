'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, FileText, Calendar, BookOpen, ExternalLink, Shield } from "lucide-react"
import Link from "next/link"

export function TwinkleHero() {
  return (
    <section className="relative overflow-hidden rounded-[16px] bg-[#F8FAFD] dark:bg-[#1B2130] p-5 sm:p-7 lg:p-8 border border-slate-200/90 dark:border-[#2A3550] shadow-sm transition-colors duration-200">
      {/* Decorative Star Doodles & Pastel Glow */}
      <div className="absolute top-6 right-12 text-slate-300 dark:text-slate-600 text-2xl font-black select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute bottom-6 left-8 text-slate-300 dark:text-slate-600 text-lg font-bold select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-gradient-to-tr from-rose-500/10 dark:from-rose-500/5 via-sky-500/10 dark:via-sky-500/5 to-amber-500/10 dark:to-amber-500/5 blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-3.5">
            
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white dark:bg-[#161B26] px-3 py-0.5 text-xs font-black text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#2A3550] shadow-2xs">
                <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Kejaksaan RI X Agrasena (Prakom 625)</span>
              </span>
              <span className="rounded-full bg-rose-50 dark:bg-rose-950/60 px-3 py-0.5 text-xs font-black text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50">
                Diklat Fungsional
              </span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50">
                Total 120 JP • 35 Hari
              </span>
            </div>

            {/* Bold Hero Title */}
            <h1 className="text-2xl sm:text-3.5xl lg:text-[38px] font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.18]">
              Pusat Materi & Roadmap Santai <br />
              <span className="text-orange-600 dark:text-orange-400">Pranata Komputer</span> Batch 3
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Hub lengkap materi dan jadwal diklat. Semua bahan ajar 120 JP, jadwal live tatap muka, dan penugasan tersimpan rapi dan siap diakses kapan pun.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link href="/schedules">
                <button className="flex items-center gap-2 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm cursor-pointer">
                  <span>Lihat Roadmap 35 Hari</span>
                  <ArrowRight className="h-4 w-4 text-amber-300 dark:text-white" />
                </button>
              </Link>

              <Link href="/materials">
                <button className="flex items-center gap-2 rounded-[8px] bg-white dark:bg-[#161B26] px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2A3550] hover:bg-slate-50 dark:hover:bg-[#202738] transition shadow-2xs cursor-pointer">
                  <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Pustaka Modul PDF</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: 5 Cols - Character Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-sm flex items-center justify-center py-2"
            >
              {/* 1. Character Image */}
              <img
                src="/ANIME.webp"
                alt="Ilustrasi Diklat Pranata Komputer Kejaksaan RI"
                className="w-full h-auto max-h-64 sm:max-h-72 object-contain drop-shadow-md"
              />

              {/* 2. Floating Badge: Semangat (Top-Right) */}
              <div className="absolute -top-1 -right-2 sm:right-0 flex items-center gap-1 rounded-full bg-white/95 dark:bg-[#161B26]/95 px-3 py-0.5 text-[11px] font-black text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-[#2A3550] shadow-sm backdrop-blur-sm transform-gpu hover:scale-105 transition-transform cursor-default">
                <span>✨ Semangat!</span>
              </div>

              {/* 3. Floating Badge: Prakom 625 (Top-Left) */}
              <div className="absolute top-4 -left-2 sm:left-0 flex items-center gap-1 rounded-full bg-white/95 dark:bg-[#161B26]/95 px-3 py-0.5 text-[10px] font-black text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#2A3550] shadow-sm backdrop-blur-sm transform-gpu hover:scale-105 transition-transform cursor-default">
                <span>💻 Prakom 625</span>
              </div>

              {/* 4. Floating Badge: 120 JP Ready (Bottom-Right) */}
              <div className="absolute -bottom-1 -right-2 sm:right-2 flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/90 px-3 py-0.5 text-[11px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm backdrop-blur-sm transform-gpu hover:scale-105 transition-transform cursor-default">
                <span>☕ 120 JP Ready</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom 3 Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3 border-t border-slate-200/80 dark:border-[#2A3550]">
          
          {/* Card 1: Cyan Window */}
          <div className="rounded-[12px] bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-[#2A3550] shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 border-b border-slate-200/80 dark:border-[#2A3550]">
              <span className="text-[10px] font-black text-sky-800 dark:text-sky-300">Tahap 1 & 2 • MOOC & TMO</span>
              <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">Pembelajaran Mandiri & Online</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Hari 1 s.d. 15: Modul teori, slide materi perkuliahan, dan sesi Zoom tatap muka.
              </p>
            </div>
          </div>

          {/* Card 2: Pink Window */}
          <div className="rounded-[12px] bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-[#2A3550] shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 border-b border-slate-200/80 dark:border-[#2A3550]">
              <span className="text-[10px] font-black text-rose-800 dark:text-rose-300">Tahap 3 • Lab Prakom</span>
              <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">Laboratorium di Satuan Kerja</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Hari 16 s.d. 30: Implementasi nyata proyek TI di satuan kerja Kejaksaan RI.
              </p>
            </div>
          </div>

          {/* Card 3: Yellow Window */}
          <div className="rounded-[12px] bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-[#2A3550] shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border-b border-slate-200/80 dark:border-[#2A3550]">
              <span className="text-[10px] font-black text-amber-800 dark:text-amber-300">Tahap 4 • Seminar</span>
              <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">Seminar Laboratorium Klasikal</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Hari 31 s.d. 35: Presentasi hasil laporan laboratorium di hadapan tim penguji.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
