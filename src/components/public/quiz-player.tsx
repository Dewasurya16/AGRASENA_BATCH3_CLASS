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
  Trophy
} from "lucide-react"
import { QUIZ_QUESTIONS, QuizQuestion } from "@/data/quiz-questions"

export function QuizPlayer() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [timerSeconds, setTimerSeconds] = React.useState(1560) // 26 minutes default

  const categories = ["Semua", "SPBE & Tata Kelola", "Manajemen Layanan TI", "Basis Data & Sistem", "Keamanan Informasi", "Angka Kredit Prakom"]

  const filteredQuestions = React.useMemo(() => {
    if (selectedCategory === "Semua") return QUIZ_QUESTIONS
    return QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory)
  }, [selectedCategory])

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0]

  // Reset timer on category change or reset
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
    setTimerSeconds(filteredQuestions.length * 60)
  }

  // Calculate score
  const correctCount = filteredQuestions.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length

  const scorePercentage = Math.round((correctCount / filteredQuestions.length) * 100)

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#EA580C] dark:text-amber-300">
              Simulasi Ujian MOOC & Post-Test
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-[#18181B] dark:text-white tracking-tight mt-2">
            Latihan Soal Uji Kompetensi Prakom
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7C93] dark:text-slate-400">
            Uji pemahaman materi 120 JP seputar SPBE, Tata Kelola TI, Database, Keamanan Siber, dan Angka Kredit
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-sm">
            <Timer className="h-4 w-4 text-[#FFD280] animate-pulse" />
            <span>Sisa Waktu: {formatTimer(timerSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Category Selection Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat)
              setCurrentIndex(0)
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#0D3830] dark:bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 text-[#52647C] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Quiz Area */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Question Card (8 Cols) */}
          <div className="lg:col-span-8 rounded-[32px] bg-white dark:bg-[#12161F] p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3 py-1 text-xs font-bold text-[#0D824B] dark:text-emerald-300">
                {currentQ.category}
              </span>
              <span className="font-mono text-xs font-black text-[#6B7C93] dark:text-slate-400">
                Soal {currentIndex + 1} dari {filteredQuestions.length}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center gap-3 w-full text-left rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FFF9F5] dark:bg-amber-950/30 border-[#FF7643] dark:border-amber-500 ring-2 ring-[#FF7643]/20 dark:ring-amber-500/20 text-[#18181B] dark:text-white"
                        : "bg-[#F8FAFC] dark:bg-[#161B26] border-slate-200 dark:border-slate-800 text-[#52647C] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                        isSelected
                          ? "bg-[#FF7643] text-white"
                          : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-[#18181B] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-[#27272A] dark:hover:bg-emerald-700 cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#FFD280]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(true)}
                  className="flex items-center gap-1.5 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-6 py-2.5 text-xs font-black text-white shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Kirim Jawaban Kuis</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Index Grid & Submit (4 Cols) */}
          <div className="lg:col-span-4 rounded-[32px] bg-white dark:bg-[#12161F] p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h4 className="text-sm font-black text-[#18181B] dark:text-white">Navigasi Nomor Soal</h4>
              <p className="text-xs text-[#6B7C93] dark:text-slate-400">Klik nomor untuk langsung melompat</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {filteredQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined
                const isCurrent = currentIndex === idx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#18181B] dark:bg-emerald-600 text-white ring-2 ring-black/20 dark:ring-emerald-500/30"
                        : isAnswered
                        ? "bg-[#E6F7ED] dark:bg-emerald-950/80 border border-[#A7F3D0] dark:border-emerald-700 text-[#0D824B] dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#6B7C93] dark:text-slate-400">
                <span>Terjawab:</span>
                <span className="font-mono text-[#0D824B] dark:text-emerald-400">
                  {Object.keys(userAnswers).length} / {filteredQuestions.length} Soal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitted(true)}
                className="w-full rounded-full bg-[#18181B] dark:bg-emerald-600 py-3 text-xs font-black text-white hover:bg-[#27272A] dark:hover:bg-emerald-700 transition shadow-sm cursor-pointer"
              >
                Selesaikan Kuis Sekarang
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Result Score Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-md text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFEADA] dark:bg-amber-950/80 text-[#EA580C] dark:text-amber-400 shadow-sm">
              <Trophy className="h-8 w-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0D824B] dark:text-emerald-300">
                Hasil Kuis Latihan MOOC Selesai!
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-[#18181B] dark:text-white tracking-tight">
                {scorePercentage} <span className="text-lg font-bold text-[#6B7C93] dark:text-slate-400">/ 100</span>
              </h3>
              <p className="text-sm font-bold text-[#52647C] dark:text-slate-300">
                Anda menjawab benar <span className="text-[#0D824B] dark:text-emerald-400 font-black">{correctCount}</span> dari{" "}
                <span className="text-[#18181B] dark:text-white font-black">{filteredQuestions.length}</span> soal ({scorePercentage >= 75 ? "Lulus Sangat Memuaskan ✨" : "Perlu Tingkatkan Pembelajaran 📚"}).
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-emerald-600 px-6 py-3 text-xs font-black text-white hover:bg-[#27272A] dark:hover:bg-emerald-700 transition shadow-md cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Explanations */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-[#18181B] dark:text-white">Pembahasan Lengkap Soal:</h4>
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id]
                const isCorrect = userAns === q.correctIndex
                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl bg-white dark:bg-[#161B26] p-5 border-2 space-y-3 ${
                      isCorrect
                        ? "border-[#A7F3D0] dark:border-emerald-800/80"
                        : "border-[#FFCDCA] dark:border-rose-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#6B7C93] dark:text-slate-400">Soal #{idx + 1}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          isCorrect
                            ? "bg-[#E6F7ED] dark:bg-emerald-950/80 text-[#0D824B] dark:text-emerald-300"
                            : "bg-[#FFEAE9] dark:bg-rose-950/80 text-[#E11D48] dark:text-rose-300"
                        }`}
                      >
                        {isCorrect ? "Jawaban Benar ✓" : "Jawaban Salah ✗"}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-[#18181B] dark:text-white">{q.question}</h5>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-600 dark:text-slate-300">
                        Jawaban Anda:{" "}
                        <span className="font-bold">
                          {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}` : "Tidak dijawab"}
                        </span>
                      </p>
                      <p className="text-[#0D824B] dark:text-emerald-400 font-bold">
                        Kunci Jawaban: {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-[#12161F] p-3 text-xs text-[#52647C] dark:text-slate-300 border border-slate-200/70 dark:border-slate-800">
                      <span className="font-bold text-[#18181B] dark:text-white">💡 Penjelasan Materi: </span>
                      {q.explanation}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  )
}
