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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[16px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-3 py-0.5 text-xs font-semibold">
            <Award className="h-3.5 w-3.5 text-[#007aff]" strokeWidth={2} />
            <span>Kesiapan Evaluasi Akhir</span>
          </span>
          <span className="rounded-full bg-[#34c759]/15 text-[#16a34a] dark:text-[#4ade80] border border-[#34c759]/30 px-2.5 py-0.5 text-xs font-semibold">
            10 Syarat Kelulusan Diklat
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight leading-tight">
          Pusat Kesiapan Ujian Akhir, <br className="hidden sm:block" />
          <span className="text-[#007aff] dark:text-[#60a5fa]">Milestone Seminar & Checklist Kelulusan.</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8] leading-relaxed max-w-3xl">
          Pantau countdown batas waktu tugas, ujian komprehensif MOOC, dan sidang seminar rencana aksi. Centang 10 item checklist kesiapan Anda untuk memastikan tidak ada berkas penting yang tertinggal.
        </p>
      </motion.div>

      {/* Countdown Milestones (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Milestone 1: Ujian MOOC */}
        <div className="rounded-[14px] bg-white dark:bg-[#141b27] p-5 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#007aff]/15 text-[#007aff] dark:text-[#60a5fa] border border-[#007aff]/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              Hari Ke-23
            </span>
            <Clock className="h-4 w-4 text-[#007aff]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#000000] dark:text-white">Ujian Komprehensif MOOC</h3>
            <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">23 September 2026 • 08:00 WIB</p>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center bg-[#f6f5f4] dark:bg-[#101520] p-2.5 rounded-[10px] border border-[#e6e6e6] dark:border-white/10">
            <div>
              <span className="text-base font-bold text-[#007aff] dark:text-[#60a5fa]">{moocCountdown.days}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Hari</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#007aff] dark:text-[#60a5fa]">{moocCountdown.hours}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Jam</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#007aff] dark:text-[#60a5fa]">{moocCountdown.minutes}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Mnt</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#007aff] dark:text-[#60a5fa]">{moocCountdown.seconds}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Dtk</span>
            </div>
          </div>
          <Link href="/quiz">
            <Button variant="secondary" size="sm" className="w-full justify-center text-xs font-semibold rounded-full mt-1">
              Latihan Tryout MOOC
            </Button>
          </Link>
        </div>

        {/* Milestone 2: Submit Makalah */}
        <div className="rounded-[14px] bg-white dark:bg-[#141b27] p-5 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#af52de]/15 text-[#8a38b5] dark:text-[#d8b4fe] border border-[#af52de]/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              Hari Ke-32
            </span>
            <FileText className="h-4 w-4 text-[#af52de]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#000000] dark:text-white">Batas Upload Makalah</h3>
            <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">06 Oktober 2026 • 23:59 WIB</p>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center bg-[#f6f5f4] dark:bg-[#101520] p-2.5 rounded-[10px] border border-[#e6e6e6] dark:border-white/10">
            <div>
              <span className="text-base font-bold text-[#8a38b5] dark:text-[#d8b4fe]">{paperCountdown.days}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Hari</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#8a38b5] dark:text-[#d8b4fe]">{paperCountdown.hours}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Jam</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#8a38b5] dark:text-[#d8b4fe]">{paperCountdown.minutes}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Mnt</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#8a38b5] dark:text-[#d8b4fe]">{paperCountdown.seconds}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Dtk</span>
            </div>
          </div>
          <Link href="/paper-generator">
            <Button variant="secondary" size="sm" className="w-full justify-center text-xs font-semibold rounded-full mt-1">
              Buat Draf Proposal
            </Button>
          </Link>
        </div>

        {/* Milestone 3: Sidang Seminar */}
        <div className="rounded-[14px] bg-white dark:bg-[#141b27] p-5 border border-[#e6e6e6] dark:border-white/10 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#ff9500]/15 text-[#d97706] dark:text-[#fbbf24] border border-[#ff9500]/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              Hari Ke-35
            </span>
            <Award className="h-4 w-4 text-[#ff9500]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#000000] dark:text-white">Sidang Seminar Akhir</h3>
            <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">09 Oktober 2026 • 08:30 WIB</p>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center bg-[#f6f5f4] dark:bg-[#101520] p-2.5 rounded-[10px] border border-[#e6e6e6] dark:border-white/10">
            <div>
              <span className="text-base font-bold text-[#d97706] dark:text-[#fbbf24]">{seminarCountdown.days}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Hari</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#d97706] dark:text-[#fbbf24]">{seminarCountdown.hours}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Jam</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#d97706] dark:text-[#fbbf24]">{seminarCountdown.minutes}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Mnt</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#d97706] dark:text-[#fbbf24]">{seminarCountdown.seconds}</span>
              <span className="block text-[9px] uppercase font-medium text-[#615d59] dark:text-[#94a3b8]">Dtk</span>
            </div>
          </div>
          <Link href="/templates">
            <Button variant="secondary" size="sm" className="w-full justify-center text-xs font-semibold rounded-full mt-1">
              Template Slide Paparan
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive 10-Point Checklist */}
      <div className="rounded-[14px] bg-white dark:bg-[#151c28] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e6e6] dark:border-white/10 pb-3.5">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-bold text-[#000000] dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#34c759]" strokeWidth={2} />
              <span>10 Checklist Kesiapan Kelulusan Diklat</span>
            </h3>
            <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
              Centang setiap poin yang telah Anda penuhi. Data otomatis tersimpan di browser Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-[#16a34a] dark:text-[#4ade80]">
                {completedCount} dari {CHECKLIST_ITEMS.length} Selesai
              </span>
              <span className="block text-[10px] font-semibold text-[#615d59] dark:text-[#94a3b8]">({progressPercent}%)</span>
            </div>
            <button
              type="button"
              onClick={resetChecklist}
              className="p-2 rounded-full text-[#615d59] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 transition cursor-pointer"
              title="Reset Checklist"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#f6f5f4] dark:bg-[#101520] overflow-hidden border border-[#e6e6e6] dark:border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#007aff] to-[#34c759] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Checklist List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = Boolean(checkedIds[item.id])
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-[12px] border transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-[#34c759]/10 dark:bg-[#34c759]/20 border-[#34c759] shadow-2xs"
                    : "bg-[#f6f5f4] dark:bg-[#141b27] border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? "bg-[#34c759] border-[#34c759] text-white"
                      : "border-[#e6e6e6] dark:border-white/20 bg-white dark:bg-[#101520]"
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold uppercase text-[#16a34a] dark:text-[#4ade80]">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-medium text-[#615d59] dark:text-[#94a3b8] bg-white dark:bg-[#101520] px-2 py-0.5 rounded-full border border-[#e6e6e6] dark:border-white/10">
                      {item.weight}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold leading-snug ${isChecked ? "text-[#16a34a] dark:text-[#4ade80] line-through opacity-80" : "text-[#000000] dark:text-white"}`}>
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
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
        <div className="rounded-[14px] bg-white dark:bg-[#151c28] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#000000] dark:text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-[#af52de]" strokeWidth={2} />
            <span>Rubrik Penilaian Sidang Seminar Akhir</span>
          </h3>
          <ul className="space-y-2 text-xs text-[#31302e] dark:text-[#cbd5e1]">
            <li className="flex items-start gap-2">
              <span className="text-[#34c759] font-bold">•</span>
              <span><strong className="text-[#000000] dark:text-white">Relevansi Inovasi Satker (30%):</strong> Kemampuan menyelesaikan kendala riil di Kejati/Kejari.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#34c759] font-bold">•</span>
              <span><strong className="text-[#000000] dark:text-white">Kepatuhan Regulasi SPBE (25%):</strong> Keselarasan dengan Perpres 95/2018 dan standar keamanan BSSN.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#34c759] font-bold">•</span>
              <span><strong className="text-[#000000] dark:text-white">Kesiapan Arsitektur Teknis (25%):</strong> Desain database, alur proses bisnis, dan mitigasi risiko teknis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#34c759] font-bold">•</span>
              <span><strong className="text-[#000000] dark:text-white">Sistematika Paparan & Tanya-Jawab (20%):</strong> Kejelasan presentasi dalam 10 menit dan ketepatan menjawab penguji.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-[14px] bg-white dark:bg-[#151c28] p-5 sm:p-6 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#000000] dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#ff9500]" strokeWidth={2} />
            <span>Pertanyaan yang Sering Diajukan Penguji</span>
          </h3>
          <ul className="space-y-2 text-xs text-[#31302e] dark:text-[#cbd5e1]">
            <li className="flex items-start gap-2">
              <span className="text-[#ff9500] font-bold">1.</span>
              <span><em>"Bagaimana inovasi ini menjamin data perkara tidak bocor atau hilang?"</em> (Jawab dengan strategi backup & enkripsi).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff9500] font-bold">2.</span>
              <span><em>"Apa butir DUPAK Prakom yang bisa diklaim dari pembuatan inovasi ini?"</em> (Sebutkan unsur perancangan & implementasi sistem).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff9500] font-bold">3.</span>
              <span><em>"Apakah inovasi ini sudah mendapat dukungan izin dari pimpinan satker?"</em> (Tunjukkan Surat Perintah Tugas / Lembar Komitmen).</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
