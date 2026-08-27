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

export function QuizPlayer() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)
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
      
      {/* Top Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] bg-white dark:bg-[#12161F] p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
                Simulasi Ujian MOOC & Post-Test
              </span>
              <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 text-xs font-bold text-[#EA580C] dark:text-amber-300">
                {QUIZ_QUESTIONS.length} Soal Lengkap 9 Modul
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight">
              Latihan Soal Uji Kompetensi Prakom
            </h1>
            <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed max-w-3xl">
              Simulasi komprehensif 120 JP berbasis modul resmi Pusdiklat Kejaksaan RI: SPBE, ITIL 4, ISO 31000, DAMA DMBOK, dan Studi Kelayakan TELOS.
            </p>
          </div>

          {/* Live Timer Pill */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-2 rounded-2xl px-5 py-3 border-2 shadow-2xs ${
                timerSeconds <= 180
                  ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-700 animate-pulse"
                  : "bg-slate-900 dark:bg-slate-800 border-slate-700 text-white"
              }`}>
                <Timer className="h-5 w-5 text-amber-400" />
                <div className="text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Sisa Waktu</span>
                  <span className="font-mono text-sm sm:text-base font-black text-amber-300">{formatTimer(timerSeconds)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Grid & Wrapping Pills */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
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
                  className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-[#0D824B] text-white shadow-sm ring-2 ring-[#0D824B]/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-emerald-900/40 text-emerald-100" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Question Card (8 Cols) */}
          <div className="lg:col-span-8 rounded-[32px] bg-white dark:bg-[#12161F] p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Top Question Progress & Category */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-bold text-[#0D824B] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {currentQ.category}
                </span>
                <span className="font-mono text-xs font-black text-[#52647C] dark:text-slate-400">
                  Soal <strong className="text-slate-900 dark:text-white">{currentIndex + 1}</strong> dari {filteredQuestions.length}
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-2">
              <h3 className="text-base sm:text-xl font-black text-[#18181B] dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-start gap-3.5 w-full text-left rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-[#0D824B] dark:border-emerald-500 ring-2 ring-[#0D824B]/20 text-[#18181B] dark:text-white shadow-2xs"
                        : "bg-slate-50/70 dark:bg-[#161B26] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black transition-all ${
                        isSelected
                          ? "bg-[#0D824B] text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-emerald-500"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold leading-relaxed pt-1 flex-1">
                      {opt}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-[#0D824B] shrink-0 mt-0.5" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Navigation Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:hover:bg-emerald-700 cursor-pointer shadow-sm transition"
                >
                  <span>Berikutnya</span>
                  <ArrowRight className="h-4 w-4 text-amber-300" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(true)}
                  className="flex items-center gap-2 rounded-2xl bg-[#0D824B] hover:bg-[#0A6C3E] px-7 py-3 text-xs font-black text-white shadow-md cursor-pointer transition transform hover:scale-[1.02]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Kirim & Selesaikan Kuis</span>
                </button>
              )}
            </div>
          </div>

          {/* Sticky Question Number Grid Sidebar (4 Cols) */}
          <div className="lg:col-span-4 rounded-[32px] bg-white dark:bg-[#12161F] p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-24">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#18181B] dark:text-white">Navigasi Nomor Soal</h4>
              <p className="text-xs text-[#52647C] dark:text-slate-400">Klik nomor untuk melompat ke soal pilihan</p>
            </div>

            {/* Answer Progress */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Terjawab:</span>
                <span className="font-mono text-[#0D824B] dark:text-emerald-400 font-black">
                  {answeredCount} / {filteredQuestions.length} Soal ({Math.round((answeredCount / filteredQuestions.length) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Grid of Numbers */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {filteredQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined
                const isCurrent = currentIndex === idx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer relative ${
                      isCurrent
                        ? "bg-slate-900 dark:bg-emerald-600 text-white ring-2 ring-emerald-500 shadow-xs"
                        : isAnswered
                        ? "bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                className="w-full py-2 px-3 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 transition cursor-pointer"
              >
                ⚡ Lompat ke Soal yang Belum Terjawab ({unansweredCount})
              </button>
            )}

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsSubmitted(true)}
                className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 py-3 text-xs font-black text-white transition shadow-sm cursor-pointer"
              >
                Selesaikan Kuis Sekarang
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Result Scorecard & Review View */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Top Score Summary Banner */}
          <div className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-md text-center space-y-6">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-sm ${
              isPassed
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}>
              <Trophy className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider ${
                isPassed
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {isPassed ? "✨ LULUS TRYOUT KOMPREHENSIF" : "📚 PERLU LATIHAN LEBIH LANJUT"}
              </span>
              <h2 className="text-4xl sm:text-6xl font-black text-[#18181B] dark:text-white tracking-tight">
                {scorePercentage} <span className="text-xl font-bold text-slate-400">/ 100</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda menjawab benar <strong className="text-emerald-600 font-bold">{correctCount}</strong> dari{" "}
                <strong className="text-slate-900 dark:text-white font-bold">{filteredQuestions.length}</strong> butir soal pada kategori <em>{selectedCategory}</em>.
              </p>
            </div>

            {/* Scorecard Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-300">{correctCount}</span>
                <span className="text-[11px] font-bold text-emerald-600">Jawaban Benar</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                <span className="block text-2xl font-black text-rose-700 dark:text-rose-300">{wrongCount}</span>
                <span className="text-[11px] font-bold text-rose-600">Jawaban Salah</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-2xl font-black text-slate-700 dark:text-slate-300">{unansweredCount}</span>
                <span className="text-[11px] font-bold text-slate-500">Tidak Dijawab</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                <span className="block text-2xl font-black text-purple-700 dark:text-purple-300">{filteredQuestions.length}</span>
                <span className="text-[11px] font-bold text-purple-600">Total Soal</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-emerald-600 px-6 py-3 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-emerald-700 transition shadow-md cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Ulangi Latihan Kuis Ini</span>
              </button>
            </div>
          </div>

          {/* Question Review Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <span>Pembahasan Lengkap & Kunci Jawaban:</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReviewFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  reviewFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({filteredQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("wrong")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  reviewFilter === "wrong" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                Salah ({wrongCount + unansweredCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("correct")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  reviewFilter === "correct" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Benar ({correctCount})
              </button>
            </div>
          </div>

          {/* Detailed Question Review Cards */}
          <div className="space-y-4">
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
                    className={`rounded-3xl bg-white dark:bg-[#161B26] p-6 border-2 space-y-4 shadow-2xs ${
                      isCorrect
                        ? "border-emerald-300 dark:border-emerald-800"
                        : "border-rose-300 dark:border-rose-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-500">Soal #{idx + 1}</span>
                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {q.category}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {isCorrect ? "✓ Jawaban Benar" : "✗ Jawaban Salah / Kosong"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h4>

                    {/* Answers Comparison */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-500 min-w-[90px]">Jawaban Anda:</span>
                        <span className={`font-bold ${isCorrect ? "text-emerald-600 font-black" : "text-rose-600"}`}>
                          {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}` : "— (Tidak dijawab)"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-500 min-w-[90px]">Kunci Jawaban:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">
                          {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 border border-emerald-200 dark:border-emerald-800/80 leading-relaxed">
                      <div className="font-black text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
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
