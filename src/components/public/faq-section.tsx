'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  AlertTriangle,
  Send,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Calendar,
  BookOpen,
  FileText,
  Code2,
  Award,
  ShieldAlert,
  PhoneCall,
  User,
  CheckCircle2,
  LifeBuoy
} from "lucide-react"
import Link from "next/link"

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  highlight?: string
  links?: Array<{ text: string; href: string }>
}

const FAQ_DATABASE: FAQItem[] = [
  // 1. Jadwal & Pelaksanaan
  {
    id: "jadwal-1",
    category: "Jadwal & Sesi Diklat",
    question: "Bagaimana pembagian waktu dan jadwal harian diklat?",
    answer: "Sesi perkuliahan diklat terbagi ke dalam 4 fase waktu setiap hari kerja (Senin – Jumat):\n• 08:00 – 16:00 WIB: Sesi Perkuliahan Tatap Muka Online (TMO) / MOOC via Zoom & Portal LMS.\n• 16:00 – 23:59 WIB: Waktu pengerjaan tugas mandiri, review materi, dan upload tugas ke LMS.\n• 00:00 – 08:00 WIB: Persiapan perkuliahan hari berikutnya (materi dapat diakses 24 jam).\n• Sabtu & Minggu: Waktu belajar mandiri dan pengerjaan proyek lab di unit kerja.",
    highlight: "Sesi perkuliahan aktif berlangsung pukul 08:00 s.d. 16:00 WIB.",
    links: [{ text: "Buka Roadmap 35 Hari", href: "/schedules" }]
  },
  {
    id: "jadwal-2",
    category: "Jadwal & Sesi Diklat",
    question: "Apa saja 4 tahapan alur pelatihan Diklat Fungsional Prakom Batch 3?",
    answer: "Pelatihan 120 JP ini disusun dalam 4 tahapan berurutan:\n1. Tahap 1 (Hari 1–5 | 24–28 Agu): Pembelajaran Mandiri MOOC.\n2. Tahap 2 (Hari 6–15 | 31 Agu–11 Sep): Pembelajaran Tatap Muka Online (TMO) via Zoom.\n3. Tahap 3 (Hari 16–30 | 14 Sep–2 Okt): Praktik Laboratorium Prakom di Satuan Kerja masing-masing.\n4. Tahap 4 (Hari 31–35 | 5–9 Okt): Evaluasi & Seminar Klasikal Hasil Laboratorium.",
    highlight: "Total durasi 35 hari kerja dengan bobot 120 Jam Pelajaran (JP).",
    links: [{ text: "Lihat Rincian Tahapan", href: "/schedules" }]
  },

  // 2. Tugas & LMS
  {
    id: "tugas-1",
    category: "Tugas & Portal LMS",
    question: "Di mana saya harus mengumpulkan tugas harian dan berapa batas waktunya?",
    answer: "Pengumpulan tugas resmi wajib diunggah ke Portal LMS Kejaksaan RI. Batas akhir (deadline) pengumpulan tugas harian adalah pukul 23:59 WIB pada hari yang bersangkutan, kecuali ditentukan lain oleh Widyaiswara.",
    highlight: "Deadline upload tugas harian: 23:59 WIB.",
    links: [
      { text: "Buka Papan Tugas", href: "/tasks" },
      { text: "Portal LMS Kejaksaan", href: "https://pengembangan.kejaksaan.go.id/dashboard" }
    ]
  },
  {
    id: "tugas-2",
    category: "Tugas & Portal LMS",
    question: "Bagaimana jika Portal LMS Kejaksaan mengalami kendala saat upload berkas?",
    answer: "Jika portal LMS lambat atau error menjelang deadline:\n1. Jangan panik, simpan tangkapan layar (screenshot) bukti kendala beserta waktu kejadian.\n2. Laporkan segera ke Admin/Pengurus Kelas melalui tombol Hubungi Admin di halaman ini.\n3. Siapkan file cadangan tugas dalam format PDF/ZIP dengan penamaan standar: [Nama]_[NIP]_[Tugas_Hari_X].",
    highlight: "Selalu backup file tugas dan screenshot bukti error bila LMS down."
  },

  // 3. Materi & Pustaka PDF
  {
    id: "materi-1",
    category: "Materi & Modul PDF",
    question: "Apakah semua modul dan bahan tayang widyaiswara bisa diunduh offline?",
    answer: "Ya! Seluruh modul bahan ajar 120 JP telah diarsipkan di menu Pustaka Modul. Anda dapat membaca langsung di browser via PDF Reader interaktif tanpa perlu download berulang kali, atau mengunduhnya dalam format PDF untuk dibaca offline.",
    links: [{ text: "Buka Pustaka Modul PDF", href: "/materials" }]
  },

  // 4. Kuis MOOC & Evaluasi
  {
    id: "kuis-1",
    category: "Kuis MOOC & Ujian",
    question: "Apakah simulasi kuis di web ini mempengaruhi nilai kelulusan LMS?",
    answer: "Simulasi kuis di web kelas ini bersifat sarana latihan mandiri (tryout) untuk memperkuat pemahaman konsep SPBE, Arsitektur Database, Jaringan, dan Angka Kredit Prakom. Nilai resmi tetap diambil dari portal LMS Kejaksaan RI, namun bank soal tryout disesuaikan dengan kurikulum riil.",
    highlight: "Gunakan menu Kuis MOOC untuk latihan soal sebelum ujian akhir di LMS.",
    links: [{ text: "Mulai Simulasi Kuis", href: "/quiz" }]
  },

  // 5. Snippet & Web IDE
  {
    id: "snippet-1",
    category: "Lab Prakom & Web IDE",
    question: "Bagaimana cara menjalankan skrip SQL atau Python di Web IDE kelas?",
    answer: "Buka menu Snippet Lab (/snippets). Anda bisa memilih tab 'Web IDE' untuk menguji query database SQLite/PostgreSQL interaktif di browser, atau membuka tab 'Pustaka Codingan' untuk menyalin template otomasi backup Linux, query DUPAK, dan mendownload arsip ZIP proyek rekan kelas.",
    links: [{ text: "Buka Snippet Web IDE", href: "/snippets" }]
  },

  // 6. Angka Kredit & SPBE
  {
    id: "ak-1",
    category: "Angka Kredit & DUPAK",
    question: "Berapa target minimal Angka Kredit tahunan untuk Pranata Komputer?",
    answer: "Berdasarkan PermenPAN-RB No. 32/2020:\n• Prakom Ahli Pertama: Minimal 12.5 AK per tahun (Predikat Kinerja Baik).\n• Prakom Ahli Muda: Minimal 25.0 AK per tahun.\n• Prakom Terampil: Minimal 5.0 AK per tahun.\nPastikan setiap kegiatan teknis dilengkapi Surat Perintah Tugas (SPT), dokumentasi log/skrip, dan laporan hasil yang disahkan atasan langsung.",
    highlight: "Ahli Pertama = 12.5 AK/tahun | Ahli Muda = 25.0 AK/tahun."
  },

  // 7. Kendala Teknis & Akun
  {
    id: "teknis-1",
    category: "Kendala Teknis & Bantuan",
    question: "Bagaimana jika link Zoom perkuliahan berubah atau tidak bisa diakses?",
    answer: "Jika tautan Zoom berubah mendadak, panitia diklat akan membagikan update resmi di Papan Pengumuman Kelas (/announcements) serta broadcast grup WhatsApp angkatan. Hubungi Admin Kelas jika link belum terupdate.",
    links: [{ text: "Cek Papan Pengumuman", href: "/announcements" }]
  }
]

export function FaqSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("Semua")
  const [expandedId, setExpandedId] = React.useState<string | null>("jadwal-1")
  const [copiedFormat, setCopiedFormat] = React.useState(false)

  const categories = [
    "Semua",
    "Jadwal & Sesi Diklat",
    "Tugas & Portal LMS",
    "Materi & Modul PDF",
    "Kuis MOOC & Ujian",
    "Lab Prakom & Web IDE",
    "Angka Kredit & DUPAK",
    "Kendala Teknis & Bantuan"
  ]

  const filteredFaqs = FAQ_DATABASE.filter((item) => {
    const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchQuery =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    return matchCategory && matchQuery
  })

  const templateAdminMessage = `*🚨 LAPORAN KENDALA / SARAN KELAS PRAKOM BATCH 3*
━━━━━━━━━━━━━━━━━━━━
👤 *Nama Lengkap:* [Tulis Nama Anda]
🏢 *Satuan Kerja:* [Contoh: Kejaksaan Negeri Soppeng]
📌 *Kategori:* [Kendala LMS / Link Zoom / File Modul / Masukan & Saran]

💬 *Uraian Kendala / Masukan:*
[Jelaskan kendala yang dialami atau saran perbaikan Anda secara detail]

━━━━━━━━━━━━━━━━━━━━
_Dikirim via Pusat Bantuan Web Kelas Agrasena_`

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(templateAdminMessage)
    setCopiedFormat(true)
    setTimeout(() => setCopiedFormat(false), 2500)
  }

  const handleOpenWhatsAppAdmin = () => {
    const encoded = encodeURIComponent(templateAdminMessage)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank")
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-8 lg:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3.5 py-1 text-xs font-black uppercase text-[#EA580C] dark:text-amber-300 border border-[#FFD280] dark:border-amber-800">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Pusat Bantuan & Tanya Jawab</span>
              </span>
              <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3 py-1 text-xs font-bold text-[#0D824B] dark:text-emerald-300">
                Respon Cepat Pengurus
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight leading-tight">
              Pusat Bantuan, FAQ & <br className="hidden sm:block" />
              <span className="text-[#FF7643] dark:text-[#FFA07A]">Kontak Admin Kelas</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed">
              Temukan jawaban cepat atas pertanyaan seputar perkuliahan 120 JP, pengumpulan tugas, portal LMS, simulasi kuis, serta sampaikan kendala, masukan, dan saran langsung ke Admin Kelas Diklat Prakom Batch 3.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-start sm:self-center">
            <button
              onClick={handleOpenWhatsAppAdmin}
              className="flex items-center justify-center gap-2 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-5 py-3 text-xs sm:text-sm font-black text-white shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi Admin WA</span>
              <ExternalLink className="h-3.5 w-3.5 text-emerald-200" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Peringatan / Notice Banner: Kendala Teknis, Masukan & Saran */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF5EC] via-[#FFF9F5] to-[#FFEADA]/60 dark:from-[#231710] dark:via-[#1A1412] dark:to-[#161B26] p-6 sm:p-7 border-2 border-[#FFD280] dark:border-amber-900/60 shadow-md space-y-4"
      >
        {/* Decorative Aura */}
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#FF7643]/15 dark:bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 h-36 w-36 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EA580C] text-white shadow-md shadow-[#EA580C]/30">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>

            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EA580C] text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  Pemberitahuan Penting
                </span>
                <span className="text-xs font-extrabold text-[#18181B] dark:text-white">
                  Layanan Bantuan & Aspirasi Peserta Diklat
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#18181B] dark:text-white leading-snug">
                Mengalami Kendala Teknis atau Memiliki Masukan & Saran Perbaikan?
              </h3>

              <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-300 leading-relaxed">
                Jika Anda mengalami masalah seperti <strong className="text-[#18181B] dark:text-white">link Zoom error / tidak bisa join</strong>, <strong className="text-[#18181B] dark:text-white">modul PDF gagal diunduh</strong>, <strong className="text-[#18181B] dark:text-white">tenggat upload tugas LMS bermasalah</strong>, atau ingin menyampaikan kritik dan saran untuk kenyamanan belajar bersama, <span className="font-bold text-[#EA580C] dark:text-amber-400">segera hubungi Admin Kelas Diklat</span> agar dapat langsung ditindaklanjuti ke pengurus dan panitia Pusdiklat Kejaksaan RI.
              </p>
            </div>
          </div>

          {/* Action Button Box */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 self-stretch sm:self-auto md:w-56">
            <button
              type="button"
              onClick={handleOpenWhatsAppAdmin}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#0D824B] hover:bg-[#0A6C3E] px-4 py-2.5 text-xs font-black text-white transition shadow-sm cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat WhatsApp Admin</span>
              <ExternalLink className="h-3 w-3 text-emerald-200" />
            </button>

            <button
              type="button"
              onClick={handleCopyTemplate}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#1E2433] px-4 py-2.5 text-xs font-black text-[#18181B] dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer"
            >
              {copiedFormat ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#0D824B] dark:text-emerald-400" />
                  <span className="text-[#0D824B] dark:text-emerald-400">Format Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[#FF7643] dark:text-amber-400" />
                  <span>Salin Format Laporan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 3. Search & Filter Category Pills */}
      <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE] dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik kata kunci pertanyaan (contoh: tugas, zoom, angka kredit, kuis, lms)..."
            className="h-11 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E2433] pl-10 pr-4 text-xs font-medium text-[#18181B] dark:text-white placeholder-[#9AA8BA] dark:placeholder-slate-400 focus:border-[#18181B] dark:focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#18181B] dark:bg-emerald-600 text-white shadow-xs"
                  : "bg-[#F4F6FA] dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700 text-[#52647C] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. FAQ Accordion Grid */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-[32px] bg-white dark:bg-[#12161F] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="font-bold text-base text-[#18181B] dark:text-white">Pertanyaan Tidak Ditemukan</h4>
            <p className="text-xs text-[#6B7C93] dark:text-slate-400 max-w-md mx-auto">
              Belum ada jawaban untuk kata kunci "{searchQuery}". Anda bisa langsung menanyakannya ke Admin Kelas atau AI Copilot!
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={handleOpenWhatsAppAdmin}
                className="rounded-full bg-[#0D824B] text-white px-5 py-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                Tanya Admin via WA
              </button>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Semua")
                }}
                className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 text-xs font-bold cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[24px] transition-all overflow-hidden border-2 ${
                  isExpanded
                    ? "bg-white dark:bg-[#161B26] border-[#18181B] dark:border-emerald-600 shadow-md"
                    : "bg-white dark:bg-[#12161F] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F4F6FA] dark:bg-[#1E2433] text-xs font-black text-[#18181B] dark:text-white">
                      Q
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#FF7643] dark:text-amber-400 uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-[#18181B] dark:text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform ${
                    isExpanded
                      ? "bg-[#18181B] dark:bg-emerald-600 text-white rotate-180"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Accordion Answer Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 dark:border-slate-800 px-5 pb-5 pt-3 space-y-3"
                    >
                      {faq.highlight && (
                        <div className="flex items-center gap-2 rounded-xl bg-[#E6F7ED] dark:bg-emerald-950/70 p-2.5 border border-[#A7F3D0] dark:border-emerald-800 text-xs font-bold text-[#0D824B] dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0D824B] dark:text-emerald-400" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>

                      {faq.links && faq.links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-[#8C9BAE] dark:text-slate-400">Tautan Terkait:</span>
                          {faq.links.map((l, lIdx) => (
                            <Link
                              key={lIdx}
                              href={l.href}
                              className="inline-flex items-center gap-1 text-xs font-black text-[#0D824B] dark:text-emerald-400 hover:underline"
                            >
                              <span>{l.text}</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>

      {/* 5. Contact Admin Profile Box */}
      <div className="rounded-[32px] bg-white dark:bg-[#12161F] p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0D3830] dark:bg-emerald-700 text-white shadow-lg shadow-[#0D3830]/20">
              <User className="h-7 w-7 text-[#E6F7ED]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0D824B] dark:text-emerald-300">
                  Pengurus & Admin Kelas
                </span>
                <span className="text-xs text-[#8C9BAE] dark:text-slate-400 font-bold">• Online</span>
              </div>
              <h3 className="text-lg font-black text-[#18181B] dark:text-white">
                Dewa Sinar Surya, S.Kom. & Tim Agrasena
              </h3>
              <p className="text-xs text-[#6B7C93] dark:text-slate-400">
                Prakom Kejaksaan RI X Agrasena (Prakom 625) — Siap membantu kendala diklat Anda.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenWhatsAppAdmin}
              className="flex items-center gap-2 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-5 py-3 text-xs font-black text-white transition shadow-sm cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Kirim Pesan WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/80" />
            </button>

            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#F4F6FA] dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700 px-4 py-3 text-xs font-black text-[#18181B] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5 text-[#0D824B] dark:text-emerald-400" />
              <span>Grup Angkatan WA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
