'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Timer,
  BookOpen,
  Check,
  Flame,
  Trophy,
  Filter,
  Lightbulb,
  AlertCircle
} from "lucide-react"
import { QUIZ_QUESTIONS, QuizQuestion } from "@/data/quiz-questions"
import { Spinner } from "@/components/ui/spinner"

export function QuizPlayer() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isSubmittingQuiz, setIsSubmittingQuiz] = React.useState(false)
  const [timerSeconds, setTimerSeconds] = React.useState(2520) // default 42 minutes for 42 questions
  const [reviewFilter, setReviewFilter] = React.useState<"all" | "wrong" | "correct">("all")

  const categories = [
    "Semua",
    "Overview & Administrasi Prakom",
    "Audit TI & IT Enterprise",
    "Manajemen Layanan ITIL 4",
    "Manajemen Risiko ISO 31000",
    "Pengolahan Data & DAMA DMBOK",
    "Sistem Informasi & SDLC",
    "LMS & Regulasi ASN"
  ]

  const filteredQuestions = React.useMemo(() => {
    if (selectedCategory === "Semua") return QUIZ_QUESTIONS
    return QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory)
  }, [selectedCategory])

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0]

  // Reset timer on category change
  React.useEffect(() => {
    setTimerSeconds(filteredQuestions.length * 60)
  }, [selectedCategory, filteredQuestions.length])

  // Timer countdown
  React.useEffect(() => {
    if (isSubmitted) return
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsSubmitted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isSubmitted])

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }))
  }

  const handleResetQuiz = () => {
    setUserAnswers({})
    setCurrentIndex(0)
    setIsSubmitted(false)
    setReviewFilter("all")
    setTimerSeconds(filteredQuestions.length * 60)
  }

  // Calculate score
  const correctCount = filteredQuestions.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length

  const answeredCount = Object.keys(userAnswers).length
  const wrongCount = answeredCount - correctCount
  const unansweredCount = filteredQuestions.length - answeredCount
  const scorePercentage = Math.round((correctCount / filteredQuestions.length) * 100)
  const isPassed = scorePercentage >= 75

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  // Jump to first unanswered question
  const handleJumpToUnanswered = () => {
    const nextIdx = filteredQuestions.findIndex((q) => userAnswers[q.id] === undefined)
    if (nextIdx !== -1) {
      setCurrentIndex(nextIdx)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[16px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-3 py-0.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-[#ff9500]" strokeWidth={2} />
                <span>Simulasi MOOC & Bank Soal</span>
              </span>
              <span className="rounded-full bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] border border-[#34c759]/30 px-2.5 py-0.5 text-xs font-semibold">
                {QUIZ_QUESTIONS.length} Soal Lengkap 9 Modul
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
              Latihan Soal Uji Kompetensi <br className="hidden sm:block" />
              <span className="text-[#007aff] dark:text-[#60a5fa]">Pranata Komputer Keahlian.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed max-w-3xl">
              Simulasi komprehensif 120 JP berbasis modul resmi Pusdiklat Kejaksaan RI: SPBE, ITIL 4, ISO 31000, DAMA DMBOK, dan Studi Kelayakan TELOS.
            </p>
          </div>

          {/* Live Timer Pill */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 border shadow-2xs ${
                timerSeconds <= 180
                  ? "bg-[#ff3b30]/10 border-[#ff3b30]/40 text-[#ff3b30] dark:text-[#f87171] animate-pulse"
                  : "bg-[#f6f5f4] dark:bg-[#141b27] border-[#e6e6e6] dark:border-white/10 text-[#000000] dark:text-white"
              }`}>
                <Timer className="h-4 w-4 text-[#ff9500]" strokeWidth={2} />
                <div className="text-left">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#615d59] dark:text-[#94a3b8]">Sisa Waktu</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#007aff] dark:text-[#60a5fa]">{formatTimer(timerSeconds)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Grid & Wrapping Pills */}
        <div className="pt-3.5 border-t border-[#e6e6e6] dark:border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const count = cat === "Semua" ? QUIZ_QUESTIONS.length : QUIZ_QUESTIONS.filter((q) => q.category === cat).length
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setCurrentIndex(0)
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#007aff] text-white shadow-2xs"
                      : "bg-[#f6f5f4] dark:bg-[#141b27] text-[#615d59] dark:text-[#94a3b8] hover:bg-[#e6e6e6] dark:hover:bg-[#1f283a] hover:text-[#000000] dark:hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-[#e6e6e6] dark:border-white/10 dark:bg-[#101520] text-[#615d59] dark:text-[#94a3b8]"
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Quiz Area */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Question Card (8 Cols) */}
          <div className="lg:col-span-8 rounded-[14px] bg-white dark:bg-[#141b27] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-4">
            
            {/* Top Question Progress & Category */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-2.5 py-0.5 text-[10px] font-semibold">
                  {currentQ.category}
                </span>
                <span className="font-mono text-xs font-medium text-[#615d59] dark:text-[#94a3b8]">
                  Soal <strong className="text-[#000000] dark:text-white font-bold">{currentIndex + 1}</strong> dari {filteredQuestions.length}
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="h-1.5 w-full bg-[#f6f5f4] dark:bg-[#101520] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#007aff] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-1">
              <h3 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2 pt-1">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-start gap-3 w-full text-left rounded-[10px] p-3 sm:p-3.5 border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#007aff]/10 dark:bg-[#007aff]/20 border-[#007aff] text-[#000000] dark:text-white shadow-2xs"
                        : "bg-[#f6f5f4] dark:bg-[#101520] border-[#e6e6e6] dark:border-white/10 text-[#31302e] dark:text-[#cbd5e1] hover:bg-[#eae9e7] dark:hover:bg-[#182030]"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#007aff] text-white shadow-2xs"
                          : "bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 text-[#615d59] dark:text-[#94a3b8] group-hover:border-[#007aff]"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-xs font-medium leading-relaxed pt-0.5 flex-1">
                      {opt}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-[#007aff] dark:text-[#60a5fa] shrink-0 mt-0.5" strokeWidth={2} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Navigation Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#e6e6e6] dark:border-white/10">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#141b27] px-4 py-2 text-xs font-semibold text-[#000000] dark:text-white hover:bg-[#e6e6e6] dark:hover:bg-[#1f283a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition border border-[#e6e6e6] dark:border-white/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] px-4.5 py-2 text-xs font-semibold text-white cursor-pointer shadow-xs active:scale-[0.98] transition"
                >
                  <span>Berikutnya</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmittingQuiz}
                  onClick={() => {
                    setIsSubmittingQuiz(true)
                    setTimeout(() => {
                      setIsSubmittingQuiz(false)
                      setIsSubmitted(true)
                    }, 500)
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-[#34c759] hover:bg-[#2db84d] px-5 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer active:scale-[0.98] transition disabled:opacity-60"
                >
                  {isSubmittingQuiz ? (
                    <>
                      <Spinner size="xs" variant="white" />
                      <span>Memproses Skor...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                      <span>Selesaikan & Kumpulkan Kuis</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sticky Question Number Grid Sidebar (4 Cols) */}
          <div className="lg:col-span-4 rounded-[12px] bg-white dark:bg-[#1B2130] p-4 sm:p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs space-y-4 sticky top-24">
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">Navigasi Nomor Soal</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Klik nomor untuk melompat ke soal</p>
            </div>

            {/* Answer Progress */}
            <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Terjawab:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-black">
                  {answeredCount} / {filteredQuestions.length} ({Math.round((answeredCount / filteredQuestions.length) * 100)}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Grid of Numbers */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-1.5 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
              {filteredQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined
                const isCurrent = currentIndex === idx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-[6px] font-mono text-xs font-bold transition-all cursor-pointer relative ${
                      isCurrent
                        ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs"
                        : isAnswered
                        ? "bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"
                        : "bg-slate-100 dark:bg-[#161B26] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#253045]"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Quick Unanswered Jump */}
            {unansweredCount > 0 && (
              <button
                type="button"
                onClick={handleJumpToUnanswered}
                className="w-full py-1.5 px-2.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-[6px] hover:bg-amber-100 transition cursor-pointer"
              >
                ⚡ Lompat ke Soal Belum Terjawab ({unansweredCount})
              </button>
            )}

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#2A3550]">
              <button
                type="button"
                onClick={() => setIsSubmitted(true)}
                className="w-full rounded-[8px] bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 py-2.5 text-xs font-black text-white transition shadow-2xs cursor-pointer"
              >
                Selesaikan Kuis Sekarang
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Result Scorecard & Review View */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Top Score Summary Banner */}
          <div className="rounded-[14px] bg-white dark:bg-[#1B2130] p-5 sm:p-8 border border-slate-200/90 dark:border-[#2A3550] shadow-xs text-center space-y-5">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[12px] shadow-2xs ${
              isPassed
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            }`}>
              <Trophy className="h-8 w-8" />
            </div>

            <div className="space-y-1.5 max-w-xl mx-auto">
              <span className={`rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider ${
                isPassed
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200"
              }`}>
                {isPassed ? "✨ LULUS TRYOUT KOMPREHENSIF" : "📚 PERLU LATIHAN LEBIH LANJUT"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {scorePercentage} <span className="text-lg font-bold text-slate-400">/ 100</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda menjawab benar <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{correctCount}</strong> dari{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-bold">{filteredQuestions.length}</strong> butir soal pada kategori <em>{selectedCategory}</em>.
              </p>
            </div>

            {/* Scorecard Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto pt-1">
              <div className="p-3 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <span className="block text-xl font-black text-emerald-700 dark:text-emerald-300">{correctCount}</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Jawaban Benar</span>
              </div>
              <div className="p-3 rounded-[8px] bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                <span className="block text-xl font-black text-rose-700 dark:text-rose-300">{wrongCount}</span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Jawaban Salah</span>
              </div>
              <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#161B26] border border-slate-200/80 dark:border-[#2A3550]">
                <span className="block text-xl font-black text-slate-700 dark:text-slate-300">{unansweredCount}</span>
                <span className="text-[10px] font-bold text-slate-400">Tidak Dijawab</span>
              </div>
              <div className="p-3 rounded-[8px] bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                <span className="block text-xl font-black text-purple-700 dark:text-purple-300">{filteredQuestions.length}</span>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Total Soal</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition shadow-2xs cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Ulangi Latihan Kuis Ini</span>
              </button>
            </div>
          </div>

          {/* Question Review Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pembahasan Lengkap & Kunci Jawaban:</span>
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${
                  reviewFilter === "all" ? "bg-slate-900 dark:bg-indigo-600 text-white" : "bg-slate-100 dark:bg-[#1B2130] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                Semua ({filteredQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("wrong")}
                className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${
                  reviewFilter === "wrong" ? "bg-rose-600 text-white" : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                }`}
              >
                Salah ({wrongCount + unansweredCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("correct")}
                className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${
                  reviewFilter === "correct" ? "bg-emerald-600 text-white" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                }`}
              >
                Benar ({correctCount})
              </button>
            </div>
          </div>

          {/* Detailed Question Review Cards */}
          <div className="space-y-3.5">
            {filteredQuestions
              .filter((q) => {
                const userAns = userAnswers[q.id]
                const isCorrect = userAns === q.correctIndex
                if (reviewFilter === "correct") return isCorrect
                if (reviewFilter === "wrong") return !isCorrect
                return true
              })
              .map((q, idx) => {
                const userAns = userAnswers[q.id]
                const isCorrect = userAns === q.correctIndex
                return (
                  <div
                    key={q.id}
                    className={`rounded-[12px] bg-white dark:bg-[#1B2130] p-4 sm:p-5 border space-y-3 shadow-2xs ${
                      isCorrect
                        ? "border-emerald-200 dark:border-emerald-800"
                        : "border-rose-200 dark:border-rose-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-400">Soal #{idx + 1}</span>
                        <span className="rounded-full bg-slate-100 dark:bg-[#161B26] px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                          {q.category}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          isCorrect
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {isCorrect ? "✓ Jawaban Benar" : "✗ Jawaban Salah / Kosong"}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                      {q.question}
                    </h4>

                    {/* Answers Comparison */}
                    <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#161B26] space-y-1.5 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-400 min-w-[80px]">Jawaban Anda:</span>
                        <span className={`font-bold ${isCorrect ? "text-emerald-600 dark:text-emerald-400 font-black" : "text-rose-600 dark:text-rose-400"}`}>
                          {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}` : "— (Tidak dijawab)"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-400 min-w-[80px]">Kunci Jawaban:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">
                          {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="rounded-[8px] bg-emerald-50/70 dark:bg-emerald-950/30 p-3 text-xs text-slate-700 dark:text-slate-300 border border-emerald-200/80 dark:border-emerald-800/60 leading-relaxed">
                      <div className="font-black text-emerald-900 dark:text-emerald-200 mb-0.5 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        <span>Penjelasan Materi & Dasar Regulasi:</span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </motion.div>
      )}

    </div>
  )
}
