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
  Laptop,
  Loader2,
  Info
} from "lucide-react"
import Link from "next/link"
import { Modal } from "@/components/ui/modal"
import { Spinner } from "@/components/ui/spinner"

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

  // 8. Kurikulum & Standar Kompetensi 9 Modul
  {
    id: "kurikulum-1",
    category: "Kurikulum & Modul Diklat",
    question: "Apa perbedaan mendasar porsi JP dan metode pembelajaran antara Pelatihan Fungsional Terampil dan Ahli?",
    answer: "Berdasarkan Modul Overview Program Pelatihan Prakom Kejaksaan RI:\n• Pelatihan Fungsional Terampil: Berdurasi 106 JP dengan porsi praktik lebih dominan (60% Praktik, 40% Teori) yang berfokus pada penerapan dasar operasional TI.\n• Pelatihan Fungsional Ahli: Berdurasi 120 JP dengan porsi konseptual lebih besar (60% Teori, 40% Praktik) yang menitikberatkan pada tata kelola, analisis kebijakan, dan evaluasi SPBE.",
    highlight: "Terampil: 106 JP (60% praktik) | Ahli: 120 JP (60% teori)."
  },
  {
    id: "kurikulum-2",
    category: "Kurikulum & Modul Diklat",
    question: "Berapa kali periode kenaikan pangkat bagi ASN dalam satu tahun berdasarkan PermenPAN-RB No. 1 Tahun 2023?",
    answer: "Berdasarkan PermenPAN-RB No. 1 Tahun 2023 dan regulasi BKN, periode usulan kenaikan pangkat PNS kini disederhanakan dan diperluas menjadi 6 (enam) periode dalam satu tahun, yaitu per:\n1. 1 Februari\n2. 1 April\n3. 1 Juni\n4. 1 Agustus\n5. 1 Oktober\n6. 1 Desember",
    highlight: "Kenaikan pangkat PNS berlaku 6 periode dalam setahun."
  },
  {
    id: "kurikulum-3",
    category: "Kurikulum & Modul Diklat",
    question: "Apa saja 4 unsur wajib dalam penyusunan Laporan Temuan Audit TI?",
    answer: "Dalam Modul Audit TI, setiap temuan wajib memuat 4 unsur terstruktur:\n1. Temuan / Kondisi (Condition): Fakta aktual kelemahan kontrol sistem di lapangan.\n2. Kriteria (Criteria): Standar pembanding, peraturan perundang-undangan, atau SOP baku.\n3. Risiko (Risk): Dampak negatif aktual atau potensi ancaman kerugian yang ditimbulkan.\n4. Rekomendasi (Recommendation): Solusi perbaikan konkrit bagi pimpinan.",
    highlight: "4 Unsur Audit: Kondisi, Kriteria, Risiko, dan Rekomendasi."
  },
  {
    id: "kurikulum-4",
    category: "Kurikulum & Modul Diklat",
    question: "Sebutkan 6 aktivitas utama dalam Rantai Nilai Layanan (Service Value Chain - SVC) ITIL 4!",
    answer: "Model operasional Service Value Chain (SVC) ITIL 4 terdiri dari 6 aktivitas inti:\n1. Plan (Perencanaan)\n2. Improve (Peningkatan Berkelanjutan)\n3. Engage (Pelibatan Pengguna & Stakeholder)\n4. Design & Transition (Perancangan & Transisi)\n5. Obtain / Build (Pengadaan & Pembangunan Sistem)\n6. Deliver & Support (Penyampaian & Dukungan Operasional)",
    highlight: "6 Aktivitas SVC: Plan, Improve, Engage, Design & Transition, Obtain/Build, Deliver & Support."
  },
  {
    id: "kurikulum-5",
    category: "Kurikulum & Modul Diklat",
    question: "Apa kepanjangan dan 5 dimensi analisis kelayakan sistem metode TELOS?",
    answer: "Metode TELOS digunakan dalam tahap studi kelayakan perancangan sistem informasi inovasi:\n• T - Technical (Kelayakan kesiapan teknologi server, jaringan, dan keahlian SDM)\n• E - Economic (Analisis rasio biaya investasi vs manfaat efisiensi / Cost-Benefit)\n• L - Legal (Kepatuhan hukum, UU ITE, UU PDP, dan regulasi Kejaksaan)\n• O - Operational (Kesiapan alur kerja dan kemudahan adopsi oleh petugas PTSP/masyarakat)\n• S - Schedule (Ketepatan jadwal penyelesaian tahapan proyek 6 bulan)",
    highlight: "TELOS: Technical, Economic, Legal, Operational, Schedule."
  },
  {
    id: "kurikulum-6",
    category: "Kurikulum & Modul Diklat",
    question: "Apa fungsi teknik manipulasi data pivot_wider() di R dan pivot() di Python Pandas?",
    answer: "Dalam Modul Pengolahan Data (DAMA DMBOK), fungsi `pivot_wider()` pada library R (tidyr) dan fungsi `.pivot()` / `.pivot_table()` pada library Python Pandas digunakan untuk melakukan 'Restructuring' atau mengubah struktur data dari format panjang (long format) menjadi format lebar (wide format) untuk mempermudah visualisasi dan pelaporan agregasi perkara.",
    highlight: "Pivoting data: Mengubah struktur dari format panjang (long) ke format lebar (wide)."
  },

  // 9. Kendala & Saran
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
    "Kurikulum & Modul Diklat",
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

  // Online Feedback Form States
  const [formOpen, setFormOpen] = React.useState(false)
  const [formName, setFormName] = React.useState("")
  const [formSatker, setFormSatker] = React.useState("")
  const [formContact, setFormContact] = React.useState("")
  const [formCategory, setFormCategory] = React.useState("Kendala LMS & Pengumpulan Tugas")
  const [formMessage, setFormMessage] = React.useState("")
  const [formCopied, setFormCopied] = React.useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = React.useState(false)
  const [reportFeedback, setReportFeedback] = React.useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // WhatsApp Notice Modal State
  const [isWANoticeOpen, setIsWANoticeOpen] = React.useState(false)

  const buildCustomReportMessage = () => {
    const name = formName.trim() || "[Nama Tidak Diisi]"
    const satker = formSatker.trim() || "[Satuan Kerja Tidak Diisi]"
    const contact = formContact.trim() ? `\n📱 *Kontak/WA:* ${formContact.trim()}` : ""
    const msg = formMessage.trim() || "[Belum ada uraian kendala]"

    return `*🚨 LAPORAN KENDALA / SARAN KELAS PRAKOM BATCH 3*
━━━━━━━━━━━━━━━━━━━━
👤 *Nama Lengkap:* ${name}
🏢 *Satuan Kerja:* ${satker}${contact}
📌 *Kategori:* ${formCategory}

💬 *Uraian Detail:*
${msg}

━━━━━━━━━━━━━━━━━━━━
_Dikirim via Formulir Pusat Bantuan Web Kelas Prakom Batch 3_`
  }

  const handleCopyCustomReport = () => {
    const text = buildCustomReportMessage()
    navigator.clipboard.writeText(text)
    setFormCopied(true)
    setTimeout(() => setFormCopied(false), 2500)
  }

  const handleSubmitReportToAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formSatker.trim() || !formMessage.trim()) {
      setReportFeedback({
        type: "error",
        message: "Nama lengkap, satuan kerja, dan uraian kendala wajib diisi.",
      })
      return
    }

    setIsSubmittingReport(true)
    setReportFeedback(null)

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name: formName.trim(),
          satker: formSatker.trim(),
          category: formCategory,
          contact: formContact.trim(),
          message: formMessage.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setReportFeedback({
          type: "error",
          message: data.error || "Gagal mengirim laporan. Silakan coba kembali.",
        })
      } else {
        setReportFeedback({
          type: "success",
          message:
            "Laporan Anda berhasil dikirim ke Admin Pengurus Kelas! Kendala telah masuk ke dashboard admin dan akan segera ditindaklanjuti.",
        })
        setFormName("")
        setFormSatker("")
        setFormContact("")
        setFormMessage("")
      }
    } catch {
      setReportFeedback({
        type: "error",
        message: "Terjadi gangguan koneksi saat mengirim laporan ke admin. Silakan coba lagi.",
      })
    } finally {
      setIsSubmittingReport(false)
    }
  }

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
    const text = formMessage.trim() ? buildCustomReportMessage() : templateAdminMessage
    navigator.clipboard.writeText(text)
    setCopiedFormat(true)
    setTimeout(() => setCopiedFormat(false), 2500)
  }

  const handleOpenWhatsAppDirect = () => {
    const text = formMessage.trim() ? buildCustomReportMessage() : templateAdminMessage
    const encoded = encodeURIComponent(text)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank")
  }

  const handleTriggerWANotice = () => {
    setIsWANoticeOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* 1. Header Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[14px] bg-white dark:bg-[#1B2130] p-5 sm:p-7 border border-slate-200/90 dark:border-[#2A3550] shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-orange-100 dark:bg-amber-950/80 px-3 py-0.5 text-xs font-black uppercase text-orange-700 dark:text-amber-300 border border-orange-200 dark:border-amber-800">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Pusat Bantuan & Tanya Jawab</span>
              </span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Respon Cepat Pengurus
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Pusat Bantuan, FAQ & <br className="hidden sm:block" />
              <span className="text-orange-600 dark:text-amber-400">Kontak Admin Kelas</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Temukan panduan lengkap seputar perkuliahan 120 JP, pengumpulan tugas harian, portal LMS Kejaksaan, simulasi kuis MOOC, serta sampaikan kendala teknis, masukan, dan saran langsung ke Tim Admin Kelas Diklat Prakom Batch 3.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-4 py-2 text-xs font-black text-white shadow-2xs transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{formOpen ? "Tutup Formulir" : "Tulis Laporan / Saran"}</span>
            </button>
            <button
              onClick={handleTriggerWANotice}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-emerald-700 hover:bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-2xs transition-all cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Hubungi WA</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Peringatan / Notice Banner & Interactive Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="relative overflow-hidden rounded-[12px] bg-amber-50/70 dark:bg-[#1B2130] p-4 sm:p-6 border border-amber-200/80 dark:border-[#2A3550] shadow-2xs space-y-4"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-orange-600 text-white shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-600 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                  Pemberitahuan Penting
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Layanan Bantuan & Aspirasi Peserta Diklat
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-snug">
                Mengalami Kendala Teknis atau Memiliki Masukan & Saran Perbaikan?
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Jika Anda mengalami masalah seperti <strong className="text-slate-900 dark:text-slate-100">link Zoom error</strong>, <strong className="text-slate-900 dark:text-slate-100">modul PDF gagal diunduh</strong>, <strong className="text-slate-900 dark:text-slate-100">tenggat upload tugas LMS bermasalah</strong>, atau ingin menyampaikan kritik dan saran, <span className="font-bold text-orange-600 dark:text-amber-400">segera kirim laporan langsung ke Admin Pengurus Kelas</span> di bawah tanpa perlu login.
              </p>
            </div>
          </div>

          {/* Action Button Box */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 self-stretch sm:self-auto md:w-52">
            <button
              type="button"
              onClick={() => setFormOpen(!formOpen)}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-3.5 py-2 text-xs font-black text-white transition shadow-2xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{formOpen ? "Tutup Formulir" : "Buka Formulir Lapor"}</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerWANotice}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-emerald-700 hover:bg-emerald-600 px-3.5 py-2 text-xs font-black text-white transition shadow-2xs cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Chat WA Admin</span>
              <ExternalLink className="h-3 w-3 text-emerald-200" />
            </button>
          </div>
        </div>

        {/* 2.1 Interactive Online Report / Feedback Form */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-3 border-t border-amber-200/60 dark:border-[#2A3550]"
            >
              <form
                onSubmit={handleSubmitReportToAdmin}
                className="rounded-[10px] bg-white dark:bg-[#161B26] p-4 sm:p-5 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-orange-100 dark:bg-amber-950/80 text-orange-600 dark:text-amber-400">
                      <Send className="h-3 w-3" />
                    </span>
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      Formulir Laporan Kendala & Kotak Saran (Langsung ke Admin)
                    </h4>
                  </div>
                  <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-[4px] border border-emerald-200 dark:border-emerald-800">
                    Masuk ke Dashboard
                  </span>
                </div>

                {reportFeedback && (
                  <div
                    className={`rounded-[8px] p-2.5 text-xs font-bold border flex items-center gap-2 ${
                      reportFeedback.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {reportFeedback.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>{reportFeedback.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Budi Santoso, S.Kom."
                      className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Satuan Kerja <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formSatker}
                      onChange={(e) => setFormSatker(e.target.value)}
                      placeholder="Kejati Sulsel / Kejari Soppeng"
                      className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      No. WA (Opsional):
                    </label>
                    <input
                      type="text"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="081234567890"
                      className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Kategori Kendala / Aspirasi:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] px-3 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Kendala Link Zoom & Ruang Perkuliahan">🔗 Kendala Link Zoom & Ruang Perkuliahan</option>
                    <option value="Kendala LMS & Pengumpulan Tugas">📝 Kendala Portal LMS & Pengumpulan Tugas</option>
                    <option value="Kendala Download / Baca Modul PDF">📄 Kendala Download / Baca Modul PDF</option>
                    <option value="Presensi & Kehadiran Sesi">⏰ Presensi & Kehadiran Sesi</option>
                    <option value="Masukan & Saran Pembangunan Kelas">💡 Masukan & Saran Pembangunan Kelas</option>
                    <option value="Kendala Teknis Web & Lainnya">🛠️ Kendala Teknis Web & Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Uraian Detail Kendala / Masukan <span className="text-rose-500">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tuliskan kendala yang Anda alami secara rinci atau kritik & saran perbaikan..."
                    className="w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#1B2130] p-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <span className="text-[10px] text-slate-400">
                    💡 Laporan langsung diterima dan dapat ditindaklanjuti oleh Pengurus di Dashboard Admin.
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCustomReport}
                      className="flex items-center gap-1.5 rounded-[6px] bg-slate-100 dark:bg-[#1B2130] px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#253045] transition cursor-pointer border border-slate-200/70 dark:border-[#2A3550]"
                    >
                      {formCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          <span>Salin Format</span>
                        </>
                      )}
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingReport}
                      className="flex items-center gap-1.5 rounded-[6px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 disabled:opacity-50 px-3.5 py-1.5 text-xs font-black text-white transition shadow-2xs cursor-pointer"
                    >
                      {isSubmittingReport ? (
                        <>
                          <Spinner size="xs" variant="white" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Kirim Laporan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. Search & Filter Category Pills */}
      <div className="rounded-[12px] bg-white dark:bg-[#1B2130] p-3 sm:p-4 border border-slate-200/90 dark:border-[#2A3550] shadow-2xs space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik kata kunci pertanyaan (contoh: jadwal, tugas, zoom, angka kredit, kuis, lms, lab)..."
            className="h-9 w-full rounded-[8px] border border-slate-200/80 dark:border-[#2A3550] bg-white dark:bg-[#161B26] pl-9 pr-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-slate-400 dark:focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-[6px] px-2.5 py-1 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-[#161B26] border border-slate-200/70 dark:border-[#2A3550] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#253045]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. FAQ Accordion Grid */}
      <div className="space-y-2.5">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-[12px] bg-white dark:bg-[#1B2130] p-10 text-center border border-dashed border-slate-200/90 dark:border-[#2A3550] space-y-2.5">
            <HelpCircle className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">Pertanyaan Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Belum ada jawaban untuk kata kunci "{searchQuery}". Anda bisa langsung mengirimkan kendala ke Admin Kelas atau menanyakannya di Forum Diskusi!
            </p>
            <div className="pt-1 flex justify-center gap-2">
              <button
                onClick={handleTriggerWANotice}
                className="rounded-[6px] bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-2xs cursor-pointer"
              >
                Tanya Admin via WA
              </button>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Semua")
                }}
                className="rounded-[6px] bg-slate-100 dark:bg-[#161B26] text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-bold cursor-pointer border border-slate-200/70 dark:border-[#2A3550]"
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[10px] transition-all overflow-hidden border ${
                  isExpanded
                    ? "bg-white dark:bg-[#1B2130] border-slate-400 dark:border-indigo-500 shadow-2xs"
                    : "bg-white dark:bg-[#1B2130] border-slate-200/90 dark:border-[#2A3550] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-slate-100 dark:bg-[#161B26] text-xs font-black text-slate-900 dark:text-slate-100">
                      Q
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-orange-600 dark:text-amber-400 uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform ${
                    isExpanded
                      ? "bg-slate-900 dark:bg-indigo-600 text-white rotate-180"
                      : "bg-slate-100 dark:bg-[#161B26] text-slate-500 dark:text-slate-400"
                  }`}>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </button>

                {/* Accordion Answer Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-t border-slate-100 dark:border-[#2A3550] px-4 pb-4 pt-2.5 space-y-2.5"
                    >
                      {faq.highlight && (
                        <div className="flex items-center gap-1.5 rounded-[6px] bg-emerald-50 dark:bg-emerald-950/70 p-2 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>

                      {faq.links && faq.links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-100 dark:border-[#2A3550]">
                          <span className="text-[10px] font-bold text-slate-400">Tautan Terkait:</span>
                          {faq.links.map((l, lIdx) => (
                            <Link
                              key={lIdx}
                              href={l.href}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                            >
                              <span>{l.text}</span>
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
              onClick={handleTriggerWANotice}
              className="flex items-center gap-2 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-6 py-3 text-xs sm:text-sm font-black text-white shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi WhatsApp Admin</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. WHATSAPP NOTICE & REDIRECTION MODAL */}
      <Modal
        isOpen={isWANoticeOpen}
        onClose={() => setIsWANoticeOpen(false)}
        title="Pemberitahuan Komunikasi WhatsApp"
        description="Koordinasi resmi Diklat Prakom Batch 3 Kejaksaan RI X Agrasena"
      >
        <div className="space-y-5">
          {/* Informative Alert Banner */}
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
                Admin Kelas & Grup WhatsApp Angkatan
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Untuk koordinasi langsung atau kendala yang mendesak, silakan hubungi langsung <strong>Pengurus / Admin Kelas resmi</strong> (Ketua Kelas, Sekretaris, atau Tim Helpdesk) atau sampaikan melalui <strong>Grup WhatsApp Resmi Angkatan Prakom Batch 3</strong> agar dapat dikoordinasikan secara terpadu bersama Widyaiswara Pusdiklat.
            </p>
          </div>

          {/* Tips Box */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#1E2433] p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Info className="h-4 w-4 text-amber-500" />
              <span>Format Pesan Laporan Cepat:</span>
            </div>
            <pre className="p-3 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">
              {templateAdminMessage}
            </pre>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white transition cursor-pointer"
            >
              {copiedFormat ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-black">Format Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Salin Format Pesan</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsWANoticeOpen(false)
                  setFormOpen(true)
                  // Smooth scroll to form
                  window.scrollTo({ top: 300, behavior: "smooth" })
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-xs font-black hover:bg-slate-800 transition cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Formulir Web</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsAppDirect}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl bg-[#0D824B] hover:bg-[#0A6C3E] text-white px-4 py-2.5 text-xs font-black shadow-sm transition cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Buka WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
