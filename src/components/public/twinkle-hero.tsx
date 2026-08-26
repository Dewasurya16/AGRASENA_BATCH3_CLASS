'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, FileText, Calendar, BookOpen, ExternalLink, Shield } from "lucide-react"
import Link from "next/link"

export function TwinkleHero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] bg-[#F9FAFC] p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm">
      {/* Decorative Star Doodles & Pastel Glow */}
      <div className="absolute top-6 right-12 text-slate-300 text-2xl font-black select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute bottom-6 left-8 text-slate-300 text-lg font-bold select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-gradient-to-tr from-[#FFE3EB]/60 via-[#D7F3FE]/50 to-[#FFF2D1]/60 blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 space-y-8">
        
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-black text-[#18181B] border border-slate-200 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-[#0D824B]" />
                <span>Kejaksaan RI X Agrasena (Prakom 625)</span>
              </span>
              <span className="rounded-full bg-[#FFE3EB] px-3.5 py-1 text-xs font-black text-[#E11D48]">
                Diklat Fungsional
              </span>
              <span className="rounded-full bg-[#E6F7ED] px-3.5 py-1 text-xs font-black text-[#0D824B]">
                Total 120 JP • 35 Hari
              </span>
            </div>

            {/* Bold eTwinkle Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#18181B] leading-[1.15]">
              Pusat Materi & Roadmap Santai <br />
              <span className="text-[#FF7643]">Pranata Komputer</span> Batch 3
            </h1>

            {/* Relaxed Friendly Subtitle */}
            <p className="text-xs sm:text-sm text-[#52647C] leading-relaxed max-w-xl">
              Selamat datang di hub backup materi dan jadwal diklat kita! Gak perlu khawatir ketinggalan modul atau lupa deadline, semua bahan ajar 120 JP tersimpan rapi dan siap unduh kapan pun.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link href="/schedules">
                <button className="flex items-center gap-2 rounded-full bg-[#18181B] hover:bg-[#27272A] px-5 py-3 text-xs sm:text-sm font-black text-white hover:scale-102 active:scale-98 transition-all shadow-md shadow-black/10 cursor-pointer">
                  <span>Lihat Roadmap 35 Hari</span>
                  <ArrowRight className="h-4 w-4 text-[#FFD280]" />
                </button>
              </Link>

              <Link href="/materials">
                <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#18181B] border border-slate-200 hover:bg-slate-50 transition shadow-xs cursor-pointer">
                  <FileText className="h-4 w-4 text-[#0D824B]" />
                  <span>Pustaka Modul PDF</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: 5 Cols - Seamless Character Illustration (NO BORDER) with Cute Floating Emojis */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-sm flex items-center justify-center py-2"
            >
              {/* 1. Free-standing Character Image without any outer box border */}
              <img
                src="/ANIME.webp"
                alt="Ilustrasi Diklat Pranata Komputer Kejaksaan RI"
                className="w-full h-auto max-h-72 sm:max-h-80 object-contain drop-shadow-xl"
              />

              {/* 2. Cute Floating Emoji: Sparkle Semangat (Top-Right) */}
              <motion.div
                animate={{
                  y: [-4, 4, -4],
                  rotate: [0, 4, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1 -right-2 sm:right-0 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-[#FF7643] border border-slate-200 shadow-md backdrop-blur-sm"
              >
                <span>✨ Semangat!</span>
              </motion.div>

              {/* 3. Cute Floating Emoji: Laptop Coding (Top-Left) */}
              <motion.div
                animate={{
                  y: [4, -4, 4],
                  rotate: [-2, 2, -2],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 -left-2 sm:left-0 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-[#18181B] border border-slate-200 shadow-md backdrop-blur-sm"
              >
                <span>💻 Prakom 625</span>
              </motion.div>

              {/* 4. Cute Interactive Yellow Smiley Sticker (Bottom-Left) */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [5, -5, 5],
                  rotate: [-3, 3, -3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -left-3 sm:left-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF2D1] border-[2.5px] border-[#18181B] shadow-lg cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex gap-1.5 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18181B]" />
                  </div>
                  <div className="h-1.5 w-4 rounded-b-full border-b-[2px] border-[#18181B]" />
                </div>
              </motion.div>

              {/* 5. Cute Floating Badge: 120 JP Ready (Bottom-Right) */}
              <motion.div
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-1 -right-2 sm:right-2 flex items-center gap-1 rounded-full bg-[#E6F7ED] px-3.5 py-1 text-[11px] font-black text-[#0D824B] border border-[#A7F3D0] shadow-md backdrop-blur-sm"
              >
                <span>☕ 120 JP Ready</span>
              </motion.div>

              {/* 6. Floating Ambient Mini Emoji Stars */}
              <div className="absolute top-1/3 -right-3 text-lg animate-bounce pointer-events-none">
                🚀
              </div>
              <div className="absolute bottom-1/3 -left-3 text-base animate-pulse pointer-events-none">
                🌟
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom 3 Bento Cards with _oX Browser Window Frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t border-slate-200">
          
          {/* Card 1: Cyan _oX Window */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#D7F3FE] border-b border-slate-200">
              <span className="text-[10px] font-black text-[#0369A1]">Tahap 1 & 2 • MOOC & TMO</span>
              <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-[#18181B]">Pembelajaran Mandiri & Online</h4>
              <p className="text-[11px] text-[#6B7C93] leading-relaxed">
                Hari 1 s.d. 15: Modul teori, slide materi perkuliahan, dan sesi Zoom tatap muka.
              </p>
            </div>
          </div>

          {/* Card 2: Pink _oX Window */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFE3EB] border-b border-slate-200">
              <span className="text-[10px] font-black text-[#E11D48]">Tahap 3 • Lab Prakom</span>
              <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-[#18181B]">Laboratorium di Satuan Kerja</h4>
              <p className="text-[11px] text-[#6B7C93] leading-relaxed">
                Hari 16 s.d. 30: Implementasi nyata proyek TI di satuan kerja Kejaksaan RI.
              </p>
            </div>
          </div>

          {/* Card 3: Yellow _oX Window */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFF2D1] border-b border-slate-200">
              <span className="text-[10px] font-black text-[#B47D00]">Tahap 4 • Seminar</span>
              <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-[#18181B]">Seminar Laboratorium Klasikal</h4>
              <p className="text-[11px] text-[#6B7C93] leading-relaxed">
                Hari 31 s.d. 35: Presentasi hasil laporan laboratorium di hadapan tim penguji.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
