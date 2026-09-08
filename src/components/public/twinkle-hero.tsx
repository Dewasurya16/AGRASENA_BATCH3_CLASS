'use client'

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ArrowRight, FileText, Calendar, BookOpen, Shield, Sparkles, Rocket, Star, Code2, Laptop, Building2, Award } from "lucide-react"
import Link from "next/link"

const CUBIC_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function TwinkleHero() {
  const prefersReduced = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: CUBIC_EASE,
        staggerChildren: prefersReduced ? 0 : 0.08,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: CUBIC_EASE },
    },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[20px] bg-white/95 dark:bg-[#151c28]/95 p-6 sm:p-8 lg:p-10 border border-[#e6e6e6] dark:border-white/10 shadow-xs backdrop-blur-sm transition-all duration-300"
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#007aff]/10 dark:bg-[#007aff]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#af52de]/10 dark:bg-[#af52de]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Apple SF Pill Badges with Micro-interactions */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
              <motion.span
                whileHover={{ y: -2, scale: 1.02 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1c2433] px-3.5 py-1 text-xs font-semibold text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <Shield className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Kejaksaan RI × Agrasena 625</span>
              </motion.span>

              <motion.span
                whileHover={{ y: -2, scale: 1.02 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1c2433] px-3.5 py-1 text-xs font-semibold text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#16a34a] dark:text-[#4ade80]" strokeWidth={2} />
                <span>120 JP Kurikulum</span>
              </motion.span>

              <motion.span
                whileHover={{ y: -2, scale: 1.02 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1c2433] px-3.5 py-1 text-xs font-semibold text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/10 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <Calendar className="h-3.5 w-3.5 text-[#007aff] dark:text-[#60a5fa]" strokeWidth={2} />
                <span>35 Hari Roadmap</span>
              </motion.span>
            </motion.div>

            {/* Display Headline with Tight Tracking */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#000000] dark:text-white leading-[1.14]"
            >
              Pusat Materi & Roadmap <br />
              <span className="text-[#007aff] dark:text-[#60a5fa] drop-shadow-xs">
                Pranata Komputer
              </span>{" "}
              Batch 3.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#615d59] dark:text-[#94a3b8] font-normal leading-relaxed max-w-xl"
            >
              Hub terpadu perkuliahan fungsional keahlian. 120 JP modul bahan ajar resmi PDF, rundown harian, bank kuis MOOC, dan asisten generator AI makalah.
            </motion.p>

            {/* Action Buttons with Spring Touch Feedback */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/schedules">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <Rocket className="h-4 w-4" strokeWidth={2} />
                  <span>Lihat Jadwal 35 Hari</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </motion.button>
              </Link>

              <Link href="/materials">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="group inline-flex items-center gap-2 rounded-full bg-white text-[#31302e] dark:bg-[#1c2433] dark:text-white border border-[#e6e6e6] dark:border-white/10 hover:bg-[#f6f5f4] dark:hover:bg-[#253043] px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-[#007aff] dark:text-[#60a5fa]" strokeWidth={2} />
                  <span>Pustaka Modul PDF</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 5 Cols - Character Illustration & Animated Badges */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative w-full max-w-sm flex items-center justify-center py-3"
            >
              {/* Soft Aura Behind Mascot */}
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#007aff]/15 to-[#af52de]/15 blur-2xl pointer-events-none transform -translate-y-2 scale-90" />

              {/* Character Image with Smooth Hover Scale */}
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                src="/ANIME.webp"
                alt="Ilustrasi Diklat Pranata Komputer Kejaksaan RI"
                className="relative z-10 w-full h-auto max-h-72 sm:max-h-80 object-contain drop-shadow-md cursor-pointer"
              />

              {/* Floating Pill 1: Semangat */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="absolute -top-1 -right-2 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#1c2433]/95 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/25 dark:border-[#007aff]/30 px-3.5 py-1 text-xs font-semibold shadow-xs cursor-default animate-float-1 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Semangat Diklat</span>
              </motion.div>

              {/* Floating Pill 2: Prakom 625 */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="absolute top-4 -left-2 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#1c2433]/95 text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-white/15 px-3.5 py-1 text-xs font-semibold shadow-xs cursor-default animate-float-2 backdrop-blur-md"
              >
                <Code2 className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
                <span>Prakom 625</span>
              </motion.div>

              {/* Floating Pill 3: 120 JP Ready */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="absolute -bottom-2 -right-1 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#1c2433]/95 text-[#16a34a] dark:text-[#4ade80] border border-[#16a34a]/25 dark:border-[#16a34a]/30 px-3.5 py-1 text-xs font-semibold shadow-xs cursor-default animate-float-3 backdrop-blur-md"
              >
                <Star className="h-3.5 w-3.5 text-[#16a34a]" strokeWidth={2} />
                <span>120 JP Siap</span>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Bottom 3 Apple SF Database Cards with Stagger & Hover Elevation */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#e6e6e6] dark:border-white/10"
        >
          {/* Card 1: MOOC & TMO */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#007aff]/60 dark:hover:border-[#007aff]/60 hover:shadow-xs transition-colors"
          >
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
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
          </motion.div>

          {/* Card 2: Lab Satker */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#007aff]/60 dark:hover:border-[#007aff]/60 hover:shadow-xs transition-colors"
          >
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
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
          </motion.div>

          {/* Card 3: Seminar */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#007aff]/60 dark:hover:border-[#007aff]/60 hover:shadow-xs transition-colors"
          >
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
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
          </motion.div>

        </motion.div>

      </div>
    </motion.section>
  )
}
