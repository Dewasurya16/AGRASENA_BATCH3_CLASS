'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileText,
  RotateCcw,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'

export function LearningProgressWidget() {
  const [mounted, setMounted] = React.useState(false)
  const [readMaterialsCount, setReadMaterialsCount] = React.useState(0)
  const [completedQuizCount, setCompletedQuizCount] = React.useState(0)
  const [examChecklistCount, setExamChecklistCount] = React.useState(0)
  const [hasGeneratedPaper, setHasGeneratedPaper] = React.useState(false)

  // Total targets
  const TOTAL_MATERIALS = 14
  const TOTAL_QUIZZES = 5
  const TOTAL_EXAM_CHECKLIST = 10

  const loadProgress = () => {
    try {
      // 1. Materials read
      const savedMaterials = localStorage.getItem('prakom_materials_read')
      if (savedMaterials) {
        const parsed = JSON.parse(savedMaterials)
        setReadMaterialsCount(Array.isArray(parsed) ? parsed.length : 0)
      } else {
        setReadMaterialsCount(0)
      }

      // 2. Quizzes completed
      const savedQuiz = localStorage.getItem('prakom_quiz_history') || localStorage.getItem('prakom_quiz_completed')
      if (savedQuiz) {
        const parsed = JSON.parse(savedQuiz)
        setCompletedQuizCount(Array.isArray(parsed) ? parsed.length : 0)
      } else {
        setCompletedQuizCount(0)
      }

      // 3. Exam checklist
      const savedChecklist = localStorage.getItem('prakom_exam_checklist')
      if (savedChecklist) {
        const parsed = JSON.parse(savedChecklist)
        setExamChecklistCount(Array.isArray(parsed) ? parsed.length : 0)
      } else {
        setExamChecklistCount(0)
      }

      // 4. Paper generated
      const savedPaper = localStorage.getItem('prakom_paper_draft')
      setHasGeneratedPaper(!!savedPaper)
    } catch {
      // Ignore local storage parse errors
    }
  }

  React.useEffect(() => {
    setMounted(true)
    loadProgress()

    // Listen to storage events from other tabs / components
    const handleStorageChange = () => loadProgress()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Calculate percentage: Materials (40%), Quizzes (25%), Exam Checklist (25%), Paper (10%)
  const matRatio = Math.min(1, readMaterialsCount / TOTAL_MATERIALS)
  const quizRatio = Math.min(1, completedQuizCount / TOTAL_QUIZZES)
  const examRatio = Math.min(1, examChecklistCount / TOTAL_EXAM_CHECKLIST)
  const paperRatio = hasGeneratedPaper ? 1 : 0

  const overallPercentage = Math.round(
    matRatio * 40 + quizRatio * 25 + examRatio * 25 + paperRatio * 10
  )

  const handleReset = () => {
    if (confirm('Reset seluruh progres belajar lokal Anda?')) {
      try {
        localStorage.removeItem('prakom_materials_read')
        localStorage.removeItem('prakom_quiz_history')
        localStorage.removeItem('prakom_quiz_completed')
        localStorage.removeItem('prakom_exam_checklist')
        loadProgress()
      } catch {
        // Ignore
      }
    }
  }

  if (!mounted) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-4.5 sm:p-5 shadow-2xs space-y-4"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6e6e6] dark:border-white/10 pb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#007aff]/15 text-[#007aff] dark:bg-[#007aff]/25 dark:text-[#60a5fa]">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white tracking-tight">
              Status Belajar & Kesiapan Diklat
            </h3>
            <span className="hidden md:inline-flex items-center rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 px-2.5 py-0.5 text-[10px] font-semibold">
              Data Privat Lokal
            </span>
          </div>
          <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
            Pantau capaian membaca modul 120 JP, simulasi kuis, dan checklist kelulusan ujian seminar Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#007aff] dark:text-[#60a5fa]">
              {overallPercentage}%
            </span>
            <span className="block text-[10px] font-semibold text-[#615d59] dark:text-[#94a3b8] uppercase tracking-wider">
              Kesiapan Kelulusan
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-full text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] transition cursor-pointer"
            title="Reset riwayat belajar lokal"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] overflow-hidden border border-[#e6e6e6] dark:border-white/10 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(4, overallPercentage)}%` }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="h-full rounded-full bg-[#007aff]"
          />
        </div>
      </div>

      {/* 4 Pillars Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Stat 1: Modul PDF */}
        <Link href="/materials" className="group block">
          <div className="h-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-3 flex flex-col justify-between space-y-2 hover:border-[#007aff]/40 transition shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white dark:bg-[#141b27] text-[#007aff] dark:text-[#60a5fa]">
                <FileText className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="font-mono text-xs font-bold text-[#000000] dark:text-white">
                {readMaterialsCount}/{TOTAL_MATERIALS}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                Pustaka Modul
              </h4>
              <p className="text-[10px] text-[#615d59] dark:text-[#94a3b8] mt-0.5">
                {readMaterialsCount >= TOTAL_MATERIALS ? 'Lengkap Terbaca' : `${TOTAL_MATERIALS - readMaterialsCount} modul tersisa`}
              </p>
            </div>
          </div>
        </Link>

        {/* Stat 2: Kuis MOOC */}
        <Link href="/quiz" className="group block">
          <div className="h-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-3 flex flex-col justify-between space-y-2 hover:border-[#007aff]/40 transition shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white dark:bg-[#141b27] text-[#007aff] dark:text-[#60a5fa]">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="font-mono text-xs font-bold text-[#000000] dark:text-white">
                {completedQuizCount}/{TOTAL_QUIZZES}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                Simulasi Kuis
              </h4>
              <p className="text-[10px] text-[#615d59] dark:text-[#94a3b8] mt-0.5">
                {completedQuizCount >= TOTAL_QUIZZES ? 'Selesai Dicoba' : `${TOTAL_QUIZZES - completedQuizCount} kuis tersisa`}
              </p>
            </div>
          </div>
        </Link>

        {/* Stat 3: Checklist Ujian */}
        <Link href="/exam-prep" className="group block">
          <div className="h-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-3 flex flex-col justify-between space-y-2 hover:border-[#007aff]/40 transition shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white dark:bg-[#141b27] text-[#007aff] dark:text-[#60a5fa]">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="font-mono text-xs font-bold text-[#000000] dark:text-white">
                {examChecklistCount}/{TOTAL_EXAM_CHECKLIST}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                Checklist Ujian
              </h4>
              <p className="text-[10px] text-[#615d59] dark:text-[#94a3b8] mt-0.5">
                {examChecklistCount >= TOTAL_EXAM_CHECKLIST ? 'Semua Siap' : `${TOTAL_EXAM_CHECKLIST - examChecklistCount} item belum`}
              </p>
            </div>
          </div>
        </Link>

        {/* Stat 4: AI Makalah */}
        <Link href="/paper-generator" className="group block">
          <div className="h-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 p-3 flex flex-col justify-between space-y-2 hover:border-[#007aff]/40 transition shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white dark:bg-[#141b27] text-[#007aff] dark:text-[#60a5fa]">
                <GraduationCap className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                hasGeneratedPaper
                  ? 'bg-[#16a34a]/15 text-[#16a34a] dark:text-[#4ade80] border-[#16a34a]/30'
                  : 'bg-white dark:bg-[#141b27] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10'
              }`}>
                {hasGeneratedPaper ? 'Tersedia' : 'Draf Baru'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                Proposal 5 Bab
              </h4>
              <p className="text-[10px] text-[#615d59] dark:text-[#94a3b8] mt-0.5">
                {hasGeneratedPaper ? 'Draf Siap Diekspor' : 'Generator Inovasi'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </motion.section>
  )
}
