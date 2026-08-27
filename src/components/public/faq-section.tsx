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
  LifeBuoy,
  Users,
  Shield,
  Clock,
  Laptop
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
  // 1. Jadwal & Alur 35 Hari
  {
    id: "jadwal-1",
    category: "Jadwal & Sesi Diklat",
    question: "Bagaimana pembagian waktu dan jam perkuliahan harian diklat?",
    answer: "Sesi perkuliahan diklat terbagi ke dalam 4 siklus waktu setiap hari kerja (Senin – Jumat):\n• 08:00 – 16:00 WIB: Sesi Aktif Pembelajaran & Tatap Muka Online (TMO) bersama Widyaiswara via Zoom & Portal LMS.\n• 16:00 – 23:59 WIB: Waktu Pengerjaan Tugas Mandiri, studi literatur, dan upload tugas ke Portal LMS.\n• 00:00 – 08:00 WIB: Persiapan materi perkuliahan hari berikutnya (pustaka modul dapat diakses 24 jam penuh).\n• Sabtu & Minggu: Libur perkuliahan tatap muka, dimanfaatkan untuk belajar mandiri dan pengerjaan proyek lab di unit kerja.",
    highlight: "Sesi perkuliahan aktif berlangsung pukul 08:00 s.d. 16:00 WIB.",
    links: [{ text: "Buka Roadmap 35 Hari", href: "/schedules" }]
  },
  {
    id: "jadwal-2",
    category: "Jadwal & Sesi Diklat",
    question: "Apa saja 4 tahapan dalam alur kurikulum 120 JP Diklat Fungsional Prakom Batch 3?",
    answer: "Kurikulum 120 Jam Pelajaran (JP) ini dirancang bertahap selama 35 hari kerja:\n1. Tahap 1 • MOOC (Hari 1 s.d. 5 | 24 – 28 Agu 2026): Pembelajaran Mandiri materi dasar fungsional & SPBE.\n2. Tahap 2 • TMO (Hari 6 s.d. 15 | 31 Agu – 11 Sep 2026): Tatap Muka Online (TMO) sinkronus via Zoom bersama narasumber/widyaiswara.\n3. Tahap 3 • Lab Prakom (Hari 16 s.d. 30 | 14 Sep – 2 Okt 2026): Praktik implementasi nyata teknologi informasi di Satuan Kerja masing-masing.\n4. Tahap 4 • Seminar Klasikal (Hari 31 s.d. 35 | 5 – 9 Okt 2026): Evaluasi, presentasi seminar laporan laboratorium, dan penutupan diklat.",
    highlight: "Total beban pelatihan adalah 120 JP yang terbagi dalam 35 hari kerja.",
    links: [{ text: "Lihat Alur 4 Tahapan", href: "/schedules" }]
  },
  {
    id: "jadwal-3",
    category: "Jadwal & Sesi Diklat",
    question: "Bagaimana cara kerja progres hari otomatis di web kelas ini?",
    answer: "Sistem web kelas telah dilengkapi perhitungan tanggal real-time otomatis. Ketika hari berpindah (pukul 00:00 WIB) atau masuk jam kerja, status roadmap, banner live session, reminder tugas, dan asisten AI akan otomatis menyesuaikan ke modul dan tugas hari yang sedang aktif tanpa perlu refresh manual.",
    highlight: "Progres hari disinkronkan otomatis secara real-time.",
    links: [{ text: "Pantau Status Hari Ini", href: "/" }]
  },

  // 2. Tugas & Portal LMS
  {
    id: "tugas-1",
    category: "Tugas & Portal LMS",
    question: "Di mana saya harus mengumpulkan tugas harian dan berapa batas waktunya?",
    answer: "Pengumpulan berkas tugas resmi wajib diunggah secara individu ke Portal LMS Kejaksaan RI (pengembangan.kejaksaan.go.id).\n• Batas Akhir (Deadline): Pukul 23:59 WIB pada hari pemberian tugas, kecuali dinyatakan berbeda oleh Widyaiswara pengampu.\n• Format File yang Disarankan: PDF (untuk dokumen/laporan) atau ZIP (jika memuat beberapa file/source code).",
    highlight: "Batas pengumpulan tugas harian: Pukul 23:59 WIB di portal LMS.",
    links: [
      { text: "Daftar Tugas & Deadline", href: "/tasks" },
      { text: "Buka Portal LMS Kejaksaan", href: "https://pengembangan.kejaksaan.go.id/dashboard" }
    ]
  },
  {
    id: "tugas-2",
    category: "Tugas & Portal LMS",
    question: "Bagaimana format penamaan file tugas yang baku?",
    answer: "Agar file tugas mudah diverifikasi dan diarsipkan oleh tim penilai, gunakan format penamaan baku berikut:\n• Dokumen Tugas: [Nama_Peserta]_[NIP]_[Tugas_Hari_X].[pdf/docx]\n• Contoh: Budi_Santoso_199501012022031002_Tugas_Hari_4.pdf\n• Proyek/Arsip Source Code: [Nama_Peserta]_[Satker]_[Proyek_Lab].[zip]",
    highlight: "Format penamaan: [Nama]_[NIP]_[Tugas_Hari_X].pdf"
  },
  {
    id: "tugas-3",
    category: "Tugas & Portal LMS",
    question: "Apa yang harus dilakukan jika Portal LMS Kejaksaan error / lambat saat upload tugas?",
    answer: "Jika portal LMS mengalami kendala teknis menjelang deadline:\n1. Jangan panik, segera ambil tangkapan layar (screenshot) bukti error yang menampilkan jam sistem di komputer Anda.\n2. Simpan file tugas di penyimpanan lokal komputer Anda.\n3. Laporkan kendala ke Pengurus/Admin Kelas melalui tombol Hubungi Admin di bawah ini agar dapat dicatat dan diteruskan ke panitia diklat.",
    highlight: "Simpan screenshot bukti kendala dan lapor ke Admin Kelas bila LMS down."
  },

  // 3. Modul & Pustaka PDF
  {
    id: "materi-1",
    category: "Materi & Modul PDF",
    question: "Bagaimana cara membaca modul PDF langsung di browser tanpa download berulang kali?",
    answer: "Kunjungi menu Pustaka Modul (/materials). Pilih modul mata kuliah yang ingin Anda pelajari, lalu klik tombol 'Baca Modul'. Anda akan masuk ke PDF Reader interaktif yang dilengkapi fitur Catatan Belajar untuk mencatat poin penting materi langsung dari browser.",
    links: [{ text: "Buka Pustaka Modul PDF", href: "/materials" }]
  },
  {
    id: "materi-2",
    category: "Materi & Modul PDF",
    question: "Apakah materi yang ada di web ini selalu sinkron dengan LMS resmi?",
    answer: "Ya! Seluruh modul bahan ajar 120 JP, slide tayang narasumber, dan panduan kurikulum diklat fungsional telah diselaraskan dengan kurikulum Pusdiklat Kejaksaan RI dan disimpan di cloud storage cadangan berkecepatan tinggi.",
    highlight: "Modul tersimpan di cloud storage cadangan dengan akses instan 24 jam."
  },

  // 4. Kuis MOOC & Evaluasi Ujian
  {
    id: "kuis-1",
    category: "Kuis MOOC & Ujian",
    question: "Apakah skor kuis di web ini mempengaruhi penilaian kelulusan resmi di LMS?",
    answer: "Simulasi kuis di web ini bersifat Tryout & Latihan Mandiri Interaktif untuk membantu Anda menguji pemahaman konsep sebelum mengerjakan ujian/kuis sebenarnya di Portal LMS Kejaksaan RI. Bank soal tryout dirancang relevan dengan 4 pilar uji kompetensi Prakom.",
    highlight: "Gunakan Kuis MOOC sebagai simulasi latihan soal sebelum kuis LMS.",
    links: [{ text: "Mulai Latihan Kuis MOOC", href: "/quiz" }]
  },
  {
    id: "kuis-2",
    category: "Kuis MOOC & Ujian",
    question: "Topik apa saja yang diujikan dalam simulasi kuis MOOC?",
    answer: "Bank soal mencakup 4 pilar utama kompetensi Pranata Komputer Keahlian:\n1. Tata Kelola TI & Arsitektur SPBE Nasional (Perpres 95/2018).\n2. Manajemen Basis Data, SQL Query & Replikasi Data Terdistribusi.\n3. Infrastruktur Jaringan, Cloud Computing, dan Keamanan Informasi (Cybersecurity).\n4. Perhitungan Angka Kredit (AK) & Tata Cara Pengajuan DUPAK/PAK (PermenPAN-RB 32/2020).",
    links: [{ text: "Coba Kuis 4 Pilar", href: "/quiz" }]
  },

  // 5. Lab Prakom di Satker & Web IDE
  {
    id: "lab-1",
    category: "Lab Prakom & Web IDE",
    question: "Apa yang harus dikerjakan pada Tahap 3 (Praktik Lab di Satuan Kerja)?",
    answer: "Pada Tahap 3 (Hari 16 s.d. 30), peserta kembali ke unit kerja masing-masing untuk mengimplementasikan proyek teknologi informasi nyata, antara lain:\n• Pembuatan atau pengembangan aplikasi/sistem informasi pelayanan publik & operasional satker.\n• Perancangan/optimasi basis data dan skrip query otomatisasi backup server Linux.\n• Penyusunan Standar Operasional Prosedur (SOP) Pengelolaan TI di Kejaksaan Tinggi/Negeri.\n• Dokumentasi logbook teknis sebagai bahan laporan seminar di Tahap 4.",
    highlight: "Tahap 3 adalah implementasi nyata proyek TI di satuan kerja masing-masing."
  },
  {
    id: "lab-2",
    category: "Lab Prakom & Web IDE",
    question: "Bagaimana cara memanfaatkan fitur Code Snippet & Web IDE di web kelas?",
    answer: "Buka menu Snippet Lab (/snippets). Anda dapat menggunakan:\n• Web IDE Interaktif: Menulis dan menjalankan query SQL (SQLite/PostgreSQL) atau skrip Python/JS langsung di browser.\n• Pustaka Codingan Komunitas: Menyalin template query database, skrip cron backup SPBE, atau mengunduh arsip ZIP proyek rekan sekelas.",
    links: [{ text: "Buka Snippet & Web IDE", href: "/snippets" }]
  },

  // 6. Angka Kredit & DUPAK/PAK
  {
    id: "ak-1",
    category: "Angka Kredit & DUPAK",
    question: "Berapa target minimal Angka Kredit (AK) tahunan Pranata Komputer?",
    answer: "Berdasarkan PermenPAN-RB No. 32/2020 tentang Jabatan Fungsional Pranata Komputer:\n• Prakom Ahli Pertama: Minimal 12.5 AK per tahun (Predikat Kinerja Baik) / 15.625 AK (Sangat Baik).\n• Prakom Ahli Muda: Minimal 25.0 AK per tahun (Predikat Kinerja Baik) / 31.25 AK (Sangat Baik).\n• Prakom Terampil: Minimal 5.0 AK per tahun.\n• Prakom Mahir: Minimal 12.5 AK per tahun.\n• Prakom Penyelia: Minimal 25.0 AK per tahun.",
    highlight: "Target minimal tahunan: Ahli Pertama = 12.5 AK | Ahli Muda = 25.0 AK."
  },
  {
    id: "ak-2",
    category: "Angka Kredit & DUPAK",
    question: "Apa saja bukti fisik sah yang wajib dilampirkan dalam pengajuan DUPAK/PAK?",
    answer: "Setiap butir kegiatan wajib disertai bukti fisik lengkap:\n1. Surat Perintah Tugas (SPT) dari pimpinan satuan kerja.\n2. Lembar Kerja / Laporan Pelaksanaan Teknis (mencakup deskripsi sistem, skrip koding/query, diagram arsitektur).\n3. Bukti Tangkapan Layar (Screenshot) / Tautan Sistem yang beroperasi.\n4. Lembar Pengesahan / Verifikasi yang ditandatangani oleh atasan langsung.",
    highlight: "Bukti fisik wajib memuat SPT, laporan teknis, dan pengesahan atasan."
  },

  // 7. Presensi & Zoom
  {
    id: "zoom-1",
    category: "Presensi & Sesi Zoom",
    question: "Bagaimana jika link Zoom perkuliahan berubah atau belum dibuka?",
    answer: "Tautan resmi ruang virtual selalu terintegrasi dengan LMS Kejaksaan. Namun jika ada perubahan tautan mendesak dari panitia, update link terbaru akan segera dipublikasikan di Papan Pengumuman (/announcements) serta broadcast pengurus kelas.",
    links: [{ text: "Cek Papan Pengumuman", href: "/announcements" }]
  },
  {
    id: "zoom-2",
    category: "Presensi & Sesi Zoom",
    question: "Bagaimana ketentuan presensi dan syarat kelulusan kehadiran?",
    answer: "Peserta wajib mengisi presensi kehadiran pada portal LMS Kejaksaan setiap sesi pagi dan siang. Tingkat kehadiran minimal untuk memenuhi syarat kelulusan pelatihan fungsional adalah 95% dari total jam perkuliahan.",
    highlight: "Minimal kehadiran 95% untuk syarat kelulusan diklat."
  },

  // 8. Kendala & Saran
  {
    id: "admin-1",
    category: "Kendala Teknis & Bantuan",
    question: "Bagaimana cara menyampaikan kendala teknis atau saran perbaikan ke Pengurus Kelas?",
    answer: "Anda dapat menggunakan tombol 'Hubungi WhatsApp Admin' di halaman ini atau menyalin format laporan baku untuk dikirimkan langsung ke Helpdesk Pengurus Kelas. Tim admin siap merespon kendala akses modul, link Zoom, dan saran perbaikan sistem.",
    highlight: "Hubungi Admin Kelas via WhatsApp dengan format laporan terstruktur."
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
    "Presensi & Sesi Zoom",
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
🏢 *Satuan Kerja:* [Contoh: Kejaksaan Negeri / Kejaksaan Tinggi]
📌 *Kategori Kendala/Saran:* [Kendala LMS / Link Zoom / File Modul / Saran Pembangunan Kelas]

💬 *Uraian Detail:*
[Tuliskan kendala yang dialami secara rinci atau saran perbaikan Anda di sini]

━━━━━━━━━━━━━━━━━━━━
_Dikirim via Pusat Bantuan Web Kelas Prakom Batch 3_`

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
              Temukan panduan lengkap seputar perkuliahan 120 JP, pengumpulan tugas harian, portal LMS Kejaksaan, simulasi kuis MOOC, serta sampaikan kendala teknis, masukan, dan saran langsung ke Tim Admin Kelas Diklat Prakom Batch 3.
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
            placeholder="Ketik kata kunci pertanyaan (contoh: jadwal, tugas, zoom, angka kredit, kuis, lms, lab)..."
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
              <Shield className="h-7 w-7 text-[#E6F7ED]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0D824B] dark:text-emerald-300">
                  Pengurus & Admin Kelas
                </span>
                <span className="text-xs text-[#8C9BAE] dark:text-slate-400 font-bold">• Online</span>
              </div>
              <h3 className="text-lg font-black text-[#18181B] dark:text-white">
                Tim Helpdesk & Pengurus Kelas Diklat
              </h3>
              <p className="text-xs text-[#6B7C93] dark:text-slate-400">
                Prakom Kejaksaan RI X Agrasena (Prakom 625) — Siaga membantu kendala LMS, link Zoom, dan materi diklat Anda.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenWhatsAppAdmin}
              className="flex items-center gap-2 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-6 py-3 text-xs sm:text-sm font-black text-white shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi WhatsApp Admin</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
