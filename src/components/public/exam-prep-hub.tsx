'use client'

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  Check,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"

const CHECKLIST_ITEMS = [
  {
    id: "attendance",
    category: "Presensi & Kehadiran",
    label: "Presensi Harian Minimal 95% di LMS & Zoom",
    desc: "Memastikan kehadiran setiap sesi pagi dan siang terekam lengkap tanpa alfa.",
    weight: "Syarat Mutlak"
  },
  {
    id: "daily-tasks",
    category: "Tugas Pembelajaran",
    label: "Semua Tugas Mandiri 1 s.d. 34 Diunggah Sebelum Deadline 23:59 WIB",
    desc: "Tidak ada tugas harian yang tertinggal atau berstatus terlambat di portal LMS.",
    weight: "Bobot 30%"
  },
  {
    id: "paper-draft",
    category: "Makalah Seminar",
    label: "Naskah Makalah Rencana Aksi Inovasi Satker 4 Bab Selesai",
    desc: "Tersusun lengkap: Latar Belakang Satker, Regulasi SPBE, Arsitektur Sistem, dan Jadwal 6 Bulan.",
    weight: "Bobot 35%"
  },
  {
    id: "coach-approval",
    category: "Makalah Seminar",
    label: "Lembar Persetujuan Widyaiswara Pembimbing (Coach) Ditandatangani",
    desc: "Naskah telah dikonsultasikan dan disetujui oleh Widyaiswara pembimbing sebelum sidang.",
    weight: "Wajib"
  },
  {
    id: "presentation-slides",
    category: "Sidang Seminar",
    label: "Slide Paparan Presentasi Seminar Siap (Maksimal 10 Slide Ringkas)",
    desc: "Fokus pada urgensi masalah di satker, demo/alur inovasi, dan manfaat layanan publik.",
    weight: "Waktu Paparan 10 Menit"
  },
  {
    id: "spt-letter",
    category: "Berkas Administrasi",
    label: "Surat Perintah Tugas (SPT) Pelatihan dari Kajati / Kajari Terlampir",
    desc: "Dokumen resmi penugasan mengikuti diklat dari satuan kerja asal.",
    weight: "Administrasi"
  },
  {
    id: "logbook-35",
    category: "Berkas Administrasi",
    label: "Logbook Harian 35 Hari Telah Diparaf Pejabat Penilai Satker",
    desc: "Rekapitulasi bukti fisik kegiatan pemeliharaan dan tugas mandiri selama diklat.",
    weight: "Bukti DUPAK"
  },
  {
    id: "mooc-quiz-drill",
    category: "Uji Kompetensi",
    label: "Latihan Ujian Komprehensif MOOC (Skor Tryout Minimal 80)",
    desc: "Telah mencoba simulasi kuis MOOC dan memahami soal-soal regulasi SPBE & Prakom.",
    weight: "Bobot 35%"
  },
  {
    id: "tech-backup",
    category: "Teknis Sidang",
    label: "Kesiapan Laptop, Webcam HD, Mikrofon Jernih & Tethering Cadangan",
    desc: "Mencegah putus koneksi atau suara tidak terdengar saat sesi tanya-jawab penguji.",
    weight: "Kesiapan Fisik"
  },
  {
    id: "pdh-uniform",
    category: "Tata Tertib",
    label: "Seragam Pakaian Dinas Harian (PDH) Kejaksaan RI & Atribut Lengkap",
    desc: "Mengenakan seragam dinas rapi, pin kejaksaan, dan tanda pengenal resmi saat seminar.",
    weight: "Etika & Disiplin"
  }
]

export function ExamPrepHub() {
  const [checkedIds, setCheckedIds] = React.useState<Record<string, boolean>>({})

  // Target Dates
  const targetMoocExam = new Date("2026-09-23T08:00:00+07:00").getTime()
  const targetPaperSubmit = new Date("2026-09-28T18:00:00+07:00").getTime()
  const targetFinalSeminar = new Date("2026-09-30T08:00:00+07:00").getTime()

  const [now, setNow] = React.useState(Date.now())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load checklist from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("prakom_exam_checklist")
      if (saved) {
        setCheckedIds(JSON.parse(saved))
      }
    } catch {
      // Ignore
    }
  }, [])

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] }
      localStorage.setItem("prakom_exam_checklist", JSON.stringify(updated))
      return updated
    })
  }

  const resetChecklist = () => {
    if (confirm("Reset semua checklist persiapan ujian?")) {
      setCheckedIds({})
      localStorage.removeItem("prakom_exam_checklist")
    }
  }

  // Calculate Progress
  const completedCount = CHECKLIST_ITEMS.filter((item) => checkedIds[item.id]).length
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100)

  // Countdown Helper
  const getCountdown = (target: number) => {
    const diff = target - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds, isPassed: false }
  }

  const moocCountdown = getCountdown(targetMoocExam)
  const paperCountdown = getCountdown(targetPaperSubmit)
  const seminarCountdown = getCountdown(targetFinalSeminar)

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-8 lg:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Pusat Kesiapan Kelulusan Diklat</span>
          </span>
          <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 text-xs font-bold text-[#EA580C] dark:text-amber-300">
            Target Kelulusan 100%
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight leading-tight">
          Countdown & Checklist Persiapan <br className="hidden sm:block" />
          <span className="text-[#0D824B] dark:text-emerald-400">Ujian Evaluasi & Seminar Akhir</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed max-w-3xl">
          Pantau hitung mundur hari H Ujian Komprehensif MOOC, pengumpulan naskah makalah, dan jadwal sidang seminar evaluasi akhir. Lengkapi 10 checklist kelulusan resmi agar persiapan Anda matang 100%.
        </p>
      </motion.div>

      {/* 3 Milestone Countdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Milestone 1: MOOC Exam */}
        <div className="rounded-[28px] bg-gradient-to-br from-white to-[#F0FDF4] dark:from-[#161B26] dark:to-emerald-950/30 p-6 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#0D824B] text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider">
              Hari Ke-30
            </span>
            <Calendar className="h-4 w-4 text-[#0D824B] dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#131E29] dark:text-white">Ujian Komprehensif MOOC</h3>
            <p className="text-xs text-slate-500">23 September 2026 • 08:00 WIB</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center bg-white dark:bg-[#12161F] p-3 rounded-2xl border border-emerald-200 dark:border-slate-700">
            <div>
              <span className="text-lg font-black text-[#0D824B] dark:text-emerald-400">{moocCountdown.days}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Hari</span>
            </div>
            <div>
              <span className="text-lg font-black text-[#0D824B] dark:text-emerald-400">{moocCountdown.hours}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Jam</span>
            </div>
            <div>
              <span className="text-lg font-black text-[#0D824B] dark:text-emerald-400">{moocCountdown.minutes}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Mnt</span>
            </div>
            <div>
              <span className="text-lg font-black text-[#0D824B] dark:text-emerald-400">{moocCountdown.seconds}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Dtk</span>
            </div>
          </div>
          <Link href="/quiz">
            <Button variant="secondary" size="sm" className="w-full justify-center text-xs font-bold mt-2">
              Latihan Tryout MOOC
            </Button>
          </Link>
        </div>

        {/* Milestone 2: Paper Submission */}
        <div className="rounded-[28px] bg-gradient-to-br from-white to-[#FFF9F5] dark:from-[#161B26] dark:to-amber-950/30 p-6 border-2 border-amber-200 dark:border-amber-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#EA580C] text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider">
              Hari Ke-33
            </span>
            <FileText className="h-4 w-4 text-[#EA580C] dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#131E29] dark:text-white">Batas Unggah Makalah Akhir</h3>
            <p className="text-xs text-slate-500">28 September 2026 • 18:00 WIB</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center bg-white dark:bg-[#12161F] p-3 rounded-2xl border border-amber-200 dark:border-slate-700">
            <div>
              <span className="text-lg font-black text-[#EA580C] dark:text-amber-400">{paperCountdown.days}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Hari</span>
            </div>
            <div>
              <span className="text-lg font-black text-[#EA580C] dark:text-amber-400">{paperCountdown.hours}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Jam</span>
            </div>
            <div>
              <span className="text-lg font-black text-[#EA580C] dark:text-amber-400">{paperCountdown.minutes}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Mnt</span>
            </div>
            <div>
              <span className="text-lg font-black text-[#EA580C] dark:text-amber-400">{paperCountdown.seconds}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Dtk</span>
            </div>
          </div>
          <Link href="/paper-generator">
            <Button variant="orange" size="sm" className="w-full justify-center text-xs font-bold mt-2">
              Susun Makalah dengan AI
            </Button>
          </Link>
        </div>

        {/* Milestone 3: Final Seminar */}
        <div className="rounded-[28px] bg-gradient-to-br from-white to-[#F5F3FF] dark:from-[#161B26] dark:to-purple-950/30 p-6 border-2 border-purple-200 dark:border-purple-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-purple-700 text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider">
              Hari Ke-35 (Penutupan)
            </span>
            <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#131E29] dark:text-white">Sidang Seminar & Evaluasi Akhir</h3>
            <p className="text-xs text-slate-500">30 September 2026 • 08:00 WIB</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center bg-white dark:bg-[#12161F] p-3 rounded-2xl border border-purple-200 dark:border-slate-700">
            <div>
              <span className="text-lg font-black text-purple-700 dark:text-purple-400">{seminarCountdown.days}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Hari</span>
            </div>
            <div>
              <span className="text-lg font-black text-purple-700 dark:text-purple-400">{seminarCountdown.hours}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Jam</span>
            </div>
            <div>
              <span className="text-lg font-black text-purple-700 dark:text-purple-400">{seminarCountdown.minutes}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Mnt</span>
            </div>
            <div>
              <span className="text-lg font-black text-purple-700 dark:text-purple-400">{seminarCountdown.seconds}</span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">Dtk</span>
            </div>
          </div>
          <Link href="/templates">
            <Button variant="secondary" size="sm" className="w-full justify-center text-xs font-bold mt-2">
              Unduh Template Seminar
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive 10-Point Checklist */}
      <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-[#131E29] dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#0D824B] dark:text-emerald-400" />
              <span>10 Checklist Kesiapan Kelulusan Diklat</span>
            </h3>
            <p className="text-xs text-slate-500">
              Centang setiap poin yang telah Anda penuhi. Data otomatis tersimpan di browser Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-black text-[#0D824B] dark:text-emerald-400">
                {completedCount} dari {CHECKLIST_ITEMS.length} Selesai
              </span>
              <span className="block text-[11px] font-bold text-slate-400">({progressPercent}%)</span>
            </div>
            <button
              type="button"
              onClick={resetChecklist}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              title="Reset Checklist"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0D824B] via-[#0D824B] to-[#FF7643]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Checklist List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {CHECKLIST_ITEMS.map((item, idx) => {
            const isChecked = Boolean(checkedIds[item.id])
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-[#E6F7ED] dark:bg-emerald-950/40 border-[#0D824B] dark:border-emerald-600 shadow-2xs"
                    : "bg-[#F8FAFC] dark:bg-[#161B26] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? "bg-[#0D824B] border-[#0D824B] text-white"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-[#0D824B] dark:text-emerald-400">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {item.weight}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold leading-snug ${isChecked ? "text-[#0D3830] dark:text-emerald-300 line-through opacity-80" : "text-[#131E29] dark:text-white"}`}>
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-[#6B7C93] dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rubric & Examination Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-[#131E29] dark:text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-600" />
            <span>Rubrik Penilaian Sidang Seminar Akhir</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-[#0D824B] font-bold">•</span>
              <span><strong>Relevansi Inovasi Satker (30%):</strong> Kemampuan menyelesaikan kendala riil di Kejati/Kejari.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0D824B] font-bold">•</span>
              <span><strong>Kepatuhan Regulasi SPBE (25%):</strong> Keselarasan dengan Perpres 95/2018 dan standar keamanan BSSN.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0D824B] font-bold">•</span>
              <span><strong>Kesiapan Arsitektur Teknis (25%):</strong> Desain database, alur proses bisnis, dan mitigasi risiko teknis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0D824B] font-bold">•</span>
              <span><strong>Sistematika Paparan & Tanya-Jawab (20%):</strong> Kejelasan presentasi dalam 10 menit dan ketepatan menjawab penguji.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-[#131E29] dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Pertanyaan yang Sering Diajukan Penguji</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] font-bold">1.</span>
              <span><em>"Bagaimana inovasi ini menjamin data perkara tidak bocor atau hilang?"</em> (Jawab dengan strategi backup & enkripsi).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] font-bold">2.</span>
              <span><em>"Apa butir DUPAK Prakom yang bisa diklaim dari pembuatan inovasi ini?"</em> (Sebutkan unsur perancangan & implementasi sistem).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] font-bold">3.</span>
              <span><em>"Apakah inovasi ini sudah mendapat dukungan izin dari pimpinan satker?"</em> (Tunjukkan Surat Perintah Tugas / Lembar Komitmen).</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
