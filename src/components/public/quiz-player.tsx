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
  AlertCircle,
  Zap,
  Play,
  Bookmark,
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Shield,
  Layers
} from "lucide-react"
import { QUIZ_QUESTIONS, QUIZ_PACKAGES, QuizQuestion, QuizPackage } from "@/data/quiz-questions"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

export function QuizPlayer() {
  // Navigation & Mode States
  const [activeTab, setActiveTab] = React.useState<"packages" | "flash" | "category">("packages")
  const [activePackage, setActivePackage] = React.useState<QuizPackage | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [isQuizActive, setIsQuizActive] = React.useState(false)

  // Quiz Player States
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({})
  const [flaggedQuestions, setFlaggedQuestions] = React.useState<Record<number, boolean>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isSubmittingQuiz, setIsSubmittingQuiz] = React.useState(false)
  const [timerSeconds, setTimerSeconds] = React.useState(900)
  const [reviewFilter, setReviewFilter] = React.useState<"all" | "wrong" | "correct">("all")

  // Storage Stats State
  const [completedPacks, setCompletedPacks] = React.useState<string[]>([])
  const [packScores, setPackScores] = React.useState<Record<string, number>>({})
  const [quizHistoryCount, setQuizHistoryCount] = React.useState(0)
  const [mounted, setMounted] = React.useState(false)

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

  const loadSavedData = React.useCallback(() => {
    try {
      const savedPacks = localStorage.getItem("prakom_completed_quiz_packs")
      if (savedPacks) {
        const parsed = JSON.parse(savedPacks)
        if (Array.isArray(parsed)) setCompletedPacks(parsed)
      }

      const savedScores = localStorage.getItem("prakom_quiz_pack_scores")
      if (savedScores) {
        setPackScores(JSON.parse(savedScores))
      }

      const savedHistory = localStorage.getItem("prakom_quiz_history")
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        if (Array.isArray(parsed)) setQuizHistoryCount(parsed.length)
      }
    } catch {
      // Ignore
    }
  }, [])

  React.useEffect(() => {
    setMounted(true)
    loadSavedData()
  }, [loadSavedData])

  // Start Specific Package
  const handleStartPackage = (pkg: QuizPackage) => {
    setActivePackage(pkg)
    let filtered = QUIZ_QUESTIONS.filter((q) => pkg.categories.includes(q.category))
    
    // If pack-5 (Tryout CAT), shuffle and take questionCount
    if (pkg.id === "pack-5") {
      filtered = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, pkg.questionCount)
    } else {
      // Shuffle & take questionCount
      filtered = [...filtered].sort(() => Math.random() - 0.5).slice(0, pkg.questionCount)
    }

    setQuestions(filtered)
    setCurrentIndex(0)
    setUserAnswers({})
    setFlaggedQuestions({})
    setIsSubmitted(false)
    setTimerSeconds(pkg.durationMinutes * 60)
    setIsQuizActive(true)
  }

  // Start Flash Quiz (10 Random Questions in 5 Mins)
  const handleStartFlashQuiz = () => {
    setActivePackage({
      id: "flash-quiz",
      title: "Flash Quiz (Kuis Kilat 5 Menit)",
      subtitle: "10 Soal Acak Seluruh Modul",
      badge: "Kuis Cepat",
      color: "#eab308",
      durationMinutes: 5,
      questionCount: 10,
      passingScore: 75,
      categories: ["Overview & Administrasi Prakom", "Audit TI & IT Enterprise", "Manajemen Layanan ITIL 4", "Manajemen Risiko ISO 31000", "Pengolahan Data & DAMA DMBOK", "Sistem Informasi & SDLC", "LMS & Regulasi ASN"],
      description: "Tantangan kuis cepat 5 menit untuk menguji reflek dan pemahaman spontan materi diklat.",
      iconName: "Zap"
    })
    const randomQuestions = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(randomQuestions)
    setCurrentIndex(0)
    setUserAnswers({})
    setFlaggedQuestions({})
    setIsSubmitted(false)
    setTimerSeconds(300) // 5 minutes
    setIsQuizActive(true)
  }

  // Start Category Quiz
  const handleStartCategoryQuiz = (cat: string) => {
    setSelectedCategory(cat)
    const filtered = cat === "Semua" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.category === cat)
    setActivePackage({
      id: `cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title: `Kuis Modul: ${cat}`,
      subtitle: `${filtered.length} Soal Pendalaman`,
      badge: "Pendalaman Modul",
      color: "#007aff",
      durationMinutes: Math.max(5, Math.ceil(filtered.length * 1.5)),
      questionCount: filtered.length,
      passingScore: 75,
      categories: [cat as any],
      description: `Latihan fokus untuk topik ${cat}.`,
      iconName: "BookOpen"
    })
    setQuestions(filtered)
    setCurrentIndex(0)
    setUserAnswers({})
    setFlaggedQuestions({})
    setIsSubmitted(false)
    setTimerSeconds(filtered.length * 90)
    setIsQuizActive(true)
  }

  // Timer countdown
  React.useEffect(() => {
    if (!isQuizActive || isSubmitted) return
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isQuizActive, isSubmitted])

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return
    const currentQ = questions[currentIndex]
    if (!currentQ) return
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }))
  }

  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex]
    if (!currentQ) return
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }))
  }

  // Calculate Scores
  const correctCount = questions.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length
  const answeredCount = Object.keys(userAnswers).length
  const scorePercentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
  const isPassed = scorePercentage >= (activePackage?.passingScore || 75)

  const handleSubmitQuiz = () => {
    setIsSubmittingQuiz(true)
    setTimeout(() => {
      setIsSubmittingQuiz(false)
      setIsSubmitted(true)

      try {
        // 1. Record in history
        const savedHistory = localStorage.getItem("prakom_quiz_history")
        let history: any[] = []
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory)
          if (Array.isArray(parsed)) history = parsed
        }
        history.push({
          id: `quiz-${Date.now()}`,
          packId: activePackage?.id || "custom",
          title: activePackage?.title || "Simulasi Kuis",
          score: scorePercentage,
          totalQuestions: questions.length,
          correctCount,
          isPassed,
          date: new Date().toISOString(),
        })
        localStorage.setItem("prakom_quiz_history", JSON.stringify(history))
        localStorage.setItem("prakom_quiz_completed", JSON.stringify(history))

        // 2. If it's an official package and passed, record completed pack
        if (activePackage && activePackage.id.startsWith("pack-")) {
          const savedPacks = localStorage.getItem("prakom_completed_quiz_packs")
          let packs: string[] = []
          if (savedPacks) {
            const parsed = JSON.parse(savedPacks)
            if (Array.isArray(parsed)) packs = parsed
          }
          if (!packs.includes(activePackage.id)) {
            packs.push(activePackage.id)
            localStorage.setItem("prakom_completed_quiz_packs", JSON.stringify(packs))
          }

          // Save highest score for package
          const savedScores = localStorage.getItem("prakom_quiz_pack_scores")
          let scores: Record<string, number> = {}
          if (savedScores) {
            try { scores = JSON.parse(savedScores) } catch {}
          }
          scores[activePackage.id] = Math.max(scores[activePackage.id] || 0, scorePercentage)
          localStorage.setItem("prakom_quiz_pack_scores", JSON.stringify(scores))
        }

        // Trigger real-time synchronization across whole app
        window.dispatchEvent(new Event("storage"))
        window.dispatchEvent(new Event("prakom-progress-updated"))
        loadSavedData()
      } catch {
        // Ignore
      }
    }, 500)
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const currentQ = questions[currentIndex] || questions[0]

  if (!mounted) return null

  // =========================================================================
  // VIEW 1: QUIZ SELECTION HUB (Pusat Simulasi & Paket Kuis)
  // =========================================================================
  if (!isQuizActive) {
    return (
      <div className="space-y-6">
        {/* Banner Header */}
        <div className="rounded-[16px] bg-gradient-to-br from-[#007aff]/10 via-[#007aff]/5 to-transparent dark:from-[#007aff]/20 dark:via-[#141b27] dark:to-[#141b27] border border-[#007aff]/20 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] text-white px-3 py-0.5 text-[11px] font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Simulasi Uji Kompetensi CAT</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold">
                  Standar 120 JP & Pusdiklat
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#000000] dark:text-white tracking-tight">
                Pusat Simulasi Kuis & Bank Soal Interaktif
              </h2>
              <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                Pilih paket latihan resmi berjenjang atau mode kuis kilat untuk menguji kesiapan materi SPBE, ITIL 4, Manajemen Risiko, DAMA DMBOK, hingga Uji Kompetensi CAT Prakom Kejaksaan RI.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-3 bg-white dark:bg-[#1a2332] p-3.5 rounded-[12px] border border-[#e6e6e6] dark:border-white/10 shadow-2xs shrink-0">
              <div className="h-10 w-10 rounded-[10px] bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] flex items-center justify-center font-bold">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#615d59] dark:text-[#94a3b8] font-semibold">Paket Selesai</div>
                <div className="text-lg font-black font-mono text-[#000000] dark:text-white">
                  {completedPacks.length} / 5 Paket
                </div>
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#007aff]/15">
            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer border ${
                activeTab === "packages"
                  ? "bg-[#007aff] text-white border-[#007aff] shadow-xs"
                  : "bg-white dark:bg-[#1a2332] text-[#31302e] dark:text-[#cbd5e1] border-[#e6e6e6] dark:border-white/10 hover:bg-[#f6f5f4]"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>5 Paket Kuis Resmi (Standar 120 JP)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("flash")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer border ${
                activeTab === "flash"
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                  : "bg-white dark:bg-[#1a2332] text-[#31302e] dark:text-[#cbd5e1] border-[#e6e6e6] dark:border-white/10 hover:bg-[#f6f5f4]"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Flash Quiz (Kuis Kilat 5 Menit)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("category")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer border ${
                activeTab === "category"
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-white dark:bg-[#1a2332] text-[#31302e] dark:text-[#cbd5e1] border-[#e6e6e6] dark:border-white/10 hover:bg-[#f6f5f4]"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Latihan Per Kategori Modul</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 5 OFFICIAL PACKAGES */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#007aff]" />
                <span>5 Paket Kuis Kurikulum Diklat Fungsional Prakom</span>
              </h3>
              <span className="text-xs text-[#615d59] dark:text-[#94a3b8]">
                Selesaikan 5 paket ini untuk mencapai 100% kesiapan kuis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUIZ_PACKAGES.map((pkg, idx) => {
                const isCompleted = completedPacks.includes(pkg.id)
                const lastScore = packScores[pkg.id]

                return (
                  <div
                    key={pkg.id}
                    className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 shadow-2xs hover:border-[#007aff]/50 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#007aff]/10 dark:bg-[#007aff]/20 text-[#007aff] dark:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-bold border border-[#007aff]/20">
                          {pkg.badge}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                            <Check className="h-3 w-3" />
                            <span>Lulus ({lastScore || 100}%)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#615d59] dark:text-[#94a3b8]">
                            Belum Selesai
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white leading-snug">
                          {pkg.title}
                        </h4>
                        <p className="text-[11px] text-[#007aff] dark:text-[#60a5fa] font-medium mt-0.5">
                          {pkg.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-3 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-[#e6e6e6] dark:border-white/10">
                      <div className="flex items-center justify-between text-[11px] text-[#615d59] dark:text-[#94a3b8]">
                        <span className="flex items-center gap-1 font-mono">
                          <BookOpen className="h-3 w-3" />
                          {pkg.questionCount} Soal
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Timer className="h-3 w-3" />
                          {pkg.durationMinutes} Menit
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Pass: {pkg.passingScore}%
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartPackage(pkg)}
                        className={`w-full flex items-center justify-center gap-2 rounded-full py-2 px-4 text-xs font-bold transition shadow-xs cursor-pointer active:scale-[0.98] ${
                          isCompleted
                            ? "bg-slate-100 dark:bg-[#1a2332] text-slate-800 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-white/10"
                            : "bg-[#007aff] hover:bg-[#0062cc] text-white"
                        }`}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{isCompleted ? "Ulangi Kuis Paket Ini" : "Mulai Mengerjakan"}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FLASH QUIZ */}
        {activeTab === "flash" && (
          <div className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Zap className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#000000] dark:text-white">
                Flash Quiz (Kuis Kilat 5 Menit)
              </h3>
              <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                Tantangan 10 soal acak dari seluruh kurikulum Diklat Fungsional Prakom. Cocok untuk mengasah ingatan cepat saat istirahat kerja!
              </p>
            </div>

            <div className="inline-flex items-center gap-4 bg-[#f6f5f4] dark:bg-[#1a2332] p-3 rounded-[10px] text-xs font-mono font-semibold text-[#31302e] dark:text-[#cbd5e1]">
              <span>⏱️ Waktu: 5 Menit</span>
              <span>📝 Jumlah: 10 Soal Acak</span>
              <span>🎯 Pass: 75%</span>
            </div>

            <div>
              <button
                type="button"
                onClick={handleStartFlashQuiz}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Mulai Flash Quiz Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORY SPECIFIC */}
        {activeTab === "category" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span>Pilih Modul Spesifik untuk Latihan Fokus</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const count = cat === "Semua" ? QUIZ_QUESTIONS.length : QUIZ_QUESTIONS.filter((q) => q.category === cat).length
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleStartCategoryQuiz(cat)}
                    className="flex items-center justify-between p-4 rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-purple-500 transition text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="font-bold text-xs sm:text-sm text-[#000000] dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition truncate">
                        {cat}
                      </div>
                      <div className="text-[11px] text-[#615d59] dark:text-[#94a3b8] font-mono">
                        {count} Bank Soal
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#615d59] dark:text-[#94a3b8] group-hover:text-purple-600 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // =========================================================================
  // VIEW 2: QUIZ RESULT & REVIEW (Setelah Selesai Kuis)
  // =========================================================================
  if (isSubmitted) {
    const wrongCount = questions.length - correctCount
    const filteredReviewQuestions = questions.filter((q) => {
      const isCorrect = userAnswers[q.id] === q.correctIndex
      if (reviewFilter === "wrong") return !isCorrect
      if (reviewFilter === "correct") return isCorrect
      return true
    })

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Score Card Banner */}
        <div className={`rounded-[16px] p-6 sm:p-8 border text-center space-y-4 ${
          isPassed
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
            : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200"
        }`}>
          <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto bg-white dark:bg-[#141b27] shadow-xs">
            {isPassed ? (
              <Trophy className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <div className="space-y-1">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
              isPassed
                ? "bg-emerald-600 text-white"
                : "bg-amber-600 text-white"
            }`}>
              {isPassed ? "LULUS UJI KOMPETENSI 🎉" : "BELUM LULUS (PERLU REVIEW) 📚"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-white">
              Skor Akhir: {scorePercentage}%
            </h2>
            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] max-w-md mx-auto">
              {isPassed
                ? `Selamat! Anda berhasil melampaui passing grade (${activePackage?.passingScore || 75}%) pada ${activePackage?.title}.`
                : `Passing grade minimal adalah ${activePackage?.passingScore || 75}%. Pelajari kembali penjelasan pada soal-soal di bawah ini.`}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 px-3.5 py-1.5 rounded-[10px] text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ✓ {correctCount} Benar
            </span>
            <span className="bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 px-3.5 py-1.5 rounded-[10px] text-xs font-bold text-rose-600 dark:text-rose-400">
              ✗ {wrongCount} Salah
            </span>
            <span className="bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 px-3.5 py-1.5 rounded-[10px] text-xs font-bold text-[#615d59] dark:text-[#94a3b8]">
              Total: {questions.length} Soal
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsQuizActive(false)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1a2332] text-[#31302e] dark:text-[#cbd5e1] border border-[#e6e6e6] dark:border-white/10 px-5 py-2 text-xs font-bold transition hover:bg-[#f6f5f4] cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Pusat Kuis</span>
            </button>

            {activePackage && (
              <button
                type="button"
                onClick={() => handleStartPackage(activePackage)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] text-white px-5 py-2 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Ulangi Kuis Ini</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6e6e6] dark:border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#000000] dark:text-white">
                Pembahasan & Kunci Jawaban Lengkap
              </h3>
              <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
                Pelajari rujukan materi dan alasan jawaban benar untuk tiap butir soal.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                  reviewFilter === "all"
                    ? "bg-[#007aff] text-white border-[#007aff]"
                    : "bg-white dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("wrong")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                  reviewFilter === "wrong"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                }`}
              >
                Salah Saja ({wrongCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("correct")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                  reviewFilter === "correct"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                }`}
              >
                Benar Saja ({correctCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviewQuestions.map((q, idx) => {
              const userAnswer = userAnswers[q.id]
              const isUserCorrect = userAnswer === q.correctIndex

              return (
                <div
                  key={q.id}
                  className={`rounded-[14px] bg-white dark:bg-[#141b27] border p-5 sm:p-6 space-y-3.5 shadow-2xs ${
                    isUserCorrect
                      ? "border-emerald-200 dark:border-emerald-900/50"
                      : "border-rose-200 dark:border-rose-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 dark:bg-[#1a2332] px-2.5 py-0.5 text-[10px] font-bold text-[#615d59] dark:text-[#94a3b8]">
                      Soal #{idx + 1} • {q.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isUserCorrect
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700"
                    }`}>
                      {isUserCorrect ? "✓ Jawaban Anda Benar" : "✗ Jawaban Anda Kurang Tepat"}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white leading-relaxed">
                    {q.question}
                  </h4>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isTargetCorrect = optIdx === q.correctIndex
                      const isChosenByUser = optIdx === userAnswer

                      let style = "bg-[#f6f5f4] dark:bg-[#1a2332] border-[#e6e6e6] dark:border-white/10 text-slate-700 dark:text-slate-300"
                      if (isTargetCorrect) {
                        style = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold"
                      } else if (isChosenByUser && !isTargetCorrect) {
                        style = "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 line-through"
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-start gap-2.5 p-3 rounded-[10px] border text-xs leading-relaxed ${style}`}
                        >
                          <span className="font-mono font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <div className="flex-1">{opt}</div>
                          {isTargetCorrect && <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
                          {isChosenByUser && !isTargetCorrect && <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="rounded-[10px] bg-slate-50 dark:bg-[#101520] p-3.5 border border-slate-200 dark:border-[#253045] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>Penjelasan & Rujukan Modul:</span>
                    </div>
                    <p className="text-xs text-[#31302e] dark:text-[#cbd5e1] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // VIEW 3: ACTIVE QUIZ PLAYER (Sedang Mengerjakan Soal)
  // =========================================================================
  const isFlagged = Boolean(flaggedQuestions[currentQ?.id])
  const selectedOption = userAnswers[currentQ?.id]

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#007aff] dark:text-[#60a5fa] uppercase tracking-wider">
            {activePackage?.title || "Simulasi Kuis Aktif"}
          </span>
          <h3 className="font-bold text-sm sm:text-base text-[#000000] dark:text-white">
            Soal {currentIndex + 1} dari {questions.length}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Timer Pill */}
          <div className="flex items-center gap-1.5 bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#000000] dark:text-white">
            <Timer className="h-3.5 w-3.5 text-[#007aff]" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Flag Question Button */}
          <button
            type="button"
            onClick={handleToggleFlag}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition border cursor-pointer ${
              isFlagged
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                : "bg-white dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10 hover:bg-[#f6f5f4]"
            }`}
            title="Tandai ragu-ragu"
          >
            <Bookmark className={`h-3 w-3 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>{isFlagged ? "Ragu-ragu" : "Tandai"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Question Content & Question Navigator Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Box (8 Cols) */}
        <div className="lg:col-span-8 rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-[#007aff]/10 dark:bg-[#007aff]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/20">
              {currentQ.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-[12px] border text-left transition cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? "bg-[#007aff]/10 border-[#007aff] text-[#007aff] dark:text-[#60a5fa] font-semibold ring-1 ring-[#007aff]"
                      : "bg-[#f6f5f4] dark:bg-[#1a2332] border-[#e6e6e6] dark:border-white/10 text-[#31302e] dark:text-[#cbd5e1] hover:bg-[#e6e6e6] dark:hover:bg-[#202c3f]"
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold border ${
                    isSelected
                      ? "bg-[#007aff] text-white border-[#007aff]"
                      : "bg-white dark:bg-[#141b27] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed mt-0.5">
                    {opt}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-[#e6e6e6] dark:border-white/10 pt-4 mt-6">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#31302e] dark:text-[#cbd5e1] border border-[#e6e6e6] dark:border-white/10 px-4 py-2 text-xs font-bold transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Sebelumnya</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] text-white px-5 py-2 text-xs font-bold transition shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <span>Berikutnya</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmittingQuiz}
                onClick={handleSubmitQuiz}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#34c759] hover:bg-[#2db84d] text-white px-5 py-2 text-xs font-bold transition shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmittingQuiz ? (
                  <>
                    <Spinner size="xs" variant="white" />
                    <span>Memproses Hasil...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Kumpulkan Jawaban</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Number Navigator (4 Cols) */}
        <div className="lg:col-span-4 rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 shadow-xs space-y-4 sticky top-24">
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#000000] dark:text-white">
              Navigasi Nomor Soal
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-[#615d59] dark:text-[#94a3b8]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#007aff]" /> {answeredCount} Dijawab
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> {Object.values(flaggedQuestions).filter(Boolean).length} Ragu
              </span>
            </div>
          </div>

          {/* Grid of Number Buttons */}
          <div className="grid grid-cols-5 gap-2 max-h-[40vh] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined
              const isCurrent = idx === currentIndex
              const isFlag = Boolean(flaggedQuestions[q.id])

              let btnStyle = "bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
              if (isCurrent) {
                btnStyle = "bg-[#007aff] text-white border-[#007aff] font-bold shadow-xs ring-2 ring-[#007aff]/30"
              } else if (isFlag) {
                btnStyle = "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold"
              } else if (isAnswered) {
                btnStyle = "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold"
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-[8px] border text-xs font-mono transition cursor-pointer flex items-center justify-center ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Early Submit button in sidebar */}
          <div className="pt-2 border-t border-[#e6e6e6] dark:border-white/10">
            <button
              type="button"
              disabled={isSubmittingQuiz}
              onClick={handleSubmitQuiz}
              className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#34c759] hover:bg-[#2db84d] text-white py-2 text-xs font-bold transition shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Selesaikan Sekarang ({answeredCount}/{questions.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
