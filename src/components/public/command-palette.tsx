'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  FileText,
  Calendar,
  Sparkles,
  BookOpen,
  Code2,
  GraduationCap,
  Layers,
  Clock,
  MessageSquare,
  HelpCircle,
  Award,
  ArrowRight,
  CornerDownLeft,
  ExternalLink,
  Shield,
  Laptop,
  Building2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'Halaman' | 'Modul 120 JP' | 'Tahap Diklat' | 'Snippet Lab' | 'Alat & Template'
  href: string
  isExternal?: boolean
  icon: React.ComponentType<{ className?: string }>
  keywords: string[]
}

const SEARCH_DATABASE: SearchItem[] = [
  // 1. Pages Navigation
  {
    id: 'nav-home',
    title: 'Overview Beranda',
    subtitle: 'Dashboard utama, live countdown, dan status belajar',
    category: 'Halaman',
    href: '/',
    icon: Sparkles,
    keywords: ['home', 'beranda', 'overview', 'dashboard', 'status'],
  },
  {
    id: 'nav-schedules',
    title: 'Jadwal & Roadmap 35 Hari',
    subtitle: 'Rundown harian, sesi Zoom, dan alur 4 tahapan diklat',
    category: 'Halaman',
    href: '/schedules',
    icon: Calendar,
    keywords: ['jadwal', 'roadmap', 'zoom', 'sesi', 'hari', 'rundown', 'waktu'],
  },
  {
    id: 'nav-materials',
    title: 'Pustaka Modul PDF 120 JP',
    subtitle: '14 modul resmi kurikulum Diklat Fungsional Prakom',
    category: 'Halaman',
    href: '/materials',
    icon: FileText,
    keywords: ['materi', 'modul', 'pdf', '120 jp', 'buku', 'bacaan', 'reader'],
  },
  {
    id: 'nav-tasks',
    title: 'Tugas & Lembar Kerja',
    subtitle: 'Daftar tugas individu, checklist LK, dan instruksi upload LMS',
    category: 'Halaman',
    href: '/tasks',
    icon: BookOpen,
    keywords: ['tugas', 'lembar kerja', 'lk', 'deadline', 'lms', 'unggah'],
  },
  {
    id: 'nav-quiz',
    title: 'Simulasi Kuis MOOC',
    subtitle: 'Latihan soal pilihan ganda SPBE, database, dan angka kredit',
    category: 'Halaman',
    href: '/quiz',
    icon: Sparkles,
    keywords: ['kuis', 'quiz', 'mooc', 'ujian', 'soal', 'latihan', 'skor'],
  },
  {
    id: 'nav-snippets',
    title: 'Code & Query Vault',
    subtitle: 'Koleksi template SQL, skrip backup Linux, dan konfigurasi server',
    category: 'Halaman',
    href: '/snippets',
    icon: Code2,
    keywords: ['snippet', 'kode', 'sql', 'query', 'bash', 'linux', 'backup', 'database'],
  },
  {
    id: 'nav-paper',
    title: 'AI Makalah Inovasi (5 Bab)',
    subtitle: 'Generator otomatis proposal proyek perubahan satker ke Word',
    category: 'Halaman',
    href: '/paper-generator',
    icon: GraduationCap,
    keywords: ['makalah', 'generator', 'ai', 'proposal', 'seminar', 'docx', 'word', 'bab'],
  },
  {
    id: 'nav-templates',
    title: 'Template Dokumen Kedinasan',
    subtitle: 'Format resmi DUPAK, SPT, SOP, dan berita acara Word/Excel',
    category: 'Halaman',
    href: '/templates',
    icon: Layers,
    keywords: ['template', 'dupak', 'spt', 'sop', 'dokumen', 'spmk', 'format'],
  },
  {
    id: 'nav-examprep',
    title: 'Persiapan Ujian & 10 Checklist',
    subtitle: 'Panduan kelulusan seminar dan countdown menuju ujian akhir',
    category: 'Halaman',
    href: '/exam-prep',
    icon: Clock,
    keywords: ['ujian', 'checklist', 'kelulusan', 'persiapan', 'seminar', 'countdown'],
  },
  {
    id: 'nav-discussions',
    title: 'Forum Diskusi Angkatan',
    subtitle: 'Tanya jawab seputar materi, tugas, dan kendala lab satker',
    category: 'Halaman',
    href: '/discussions',
    icon: MessageSquare,
    keywords: ['forum', 'diskusi', 'tanya', 'jawab', 'komunitas', 'angkatan'],
  },
  {
    id: 'nav-faq',
    title: 'Pusat Bantuan & FAQ',
    subtitle: 'Solusi kendala akun, sinkronisasi materi, dan kontak admin',
    category: 'Halaman',
    href: '/faq',
    icon: HelpCircle,
    keywords: ['faq', 'bantuan', 'kendala', 'lapor', 'admin', 'kontak', 'error'],
  },
  {
    id: 'nav-showcase',
    title: 'Galeri Karya Lab Satker',
    subtitle: 'Portofolio hasil implementasi TIK rekan seangkatan',
    category: 'Halaman',
    href: '/showcase',
    icon: Award,
    keywords: ['showcase', 'galeri', 'karya', 'portofolio', 'inovasi', 'satker'],
  },

  // 2. Modul PDF 120 JP
  {
    id: 'mod-spbe',
    title: 'Modul Tata Kelola SPBE Kejaksaan RI',
    subtitle: '6 Domain SPBE, arsitektur enterprise kedinasan, dan interoperabilitas',
    category: 'Modul 120 JP',
    href: '/materials?search=SPBE',
    icon: FileText,
    keywords: ['spbe', 'tata kelola', 'arsitektur', 'domain', 'interoperabilitas', 'perpres'],
  },
  {
    id: 'mod-csirt',
    title: 'Modul Keamanan Informasi & CSIRT Satker',
    subtitle: 'Protokol insiden ransomware, hardening server, dan enkripsi data',
    category: 'Modul 120 JP',
    href: '/materials?search=Keamanan',
    icon: Shield,
    keywords: ['keamanan', 'csirt', 'ransomware', 'cyber', 'firewall', 'hardening'],
  },
  {
    id: 'mod-db',
    title: 'Modul Basis Data Relasional & PostgreSQL/MySQL',
    subtitle: 'Normalisasi schema, indexing, replikasi master-slave, dan backup otomatis',
    category: 'Modul 120 JP',
    href: '/materials?search=Database',
    icon: Code2,
    keywords: ['database', 'basis data', 'postgresql', 'mysql', 'sql', 'replikasi', 'query'],
  },
  {
    id: 'mod-dupak',
    title: 'Modul Petunjuk Teknis Angka Kredit DUPAK',
    subtitle: 'Kategori butir kegiatan, penghitungan AK, dan bukti fisik BPS',
    category: 'Modul 120 JP',
    href: '/materials?search=DUPAK',
    icon: Layers,
    keywords: ['dupak', 'angka kredit', 'ak', 'bps', 'skp', 'butir', 'fungsional'],
  },

  // 3. 4 Tahapan Diklat
  {
    id: 'stage-1',
    title: 'Tahap 1: MOOC (Hari 1 s.d. 5)',
    subtitle: 'Pembelajaran mandiri online 24 – 28 Agustus 2026',
    category: 'Tahap Diklat',
    href: '/schedules?stage=1',
    icon: BookOpen,
    keywords: ['tahap 1', 'mooc', 'mandiri', 'hari 1', 'hari 2', 'hari 3', 'hari 4', 'hari 5'],
  },
  {
    id: 'stage-2',
    title: 'Tahap 2: Tatap Muka Online / TMO (Hari 6 s.d. 15)',
    subtitle: 'Kuliah live Zoom bersama widyaiswara 31 Agustus – 11 September 2026',
    category: 'Tahap Diklat',
    href: '/schedules?stage=2',
    icon: Laptop,
    keywords: ['tahap 2', 'tmo', 'tatap muka', 'zoom', 'live', 'hari 6', 'hari 15', 'widyaiswara'],
  },
  {
    id: 'stage-3',
    title: 'Tahap 3: Lab Prakom di Satker (Hari 16 s.d. 30)',
    subtitle: 'Implementasi proyek perubahan di unit kerja 14 September – 2 Oktober 2026',
    category: 'Tahap Diklat',
    href: '/schedules?stage=3',
    icon: Building2,
    keywords: ['tahap 3', 'lab', 'laboratorium', 'satker', 'proyek', 'hari 16', 'hari 30'],
  },
  {
    id: 'stage-4',
    title: 'Tahap 4: Seminar Klasikal (Hari 31 s.d. 35)',
    subtitle: 'Sidang seminar proyek akhir & kelulusan 5 – 9 Oktober 2026',
    category: 'Tahap Diklat',
    href: '/schedules?stage=4',
    icon: Award,
    keywords: ['tahap 4', 'seminar', 'klasikal', 'sidang', 'kelulusan', 'hari 31', 'hari 35'],
  },

  // 4. Snippets & Tools
  {
    id: 'snip-backup',
    title: 'Script Otomatisasi Backup PostgreSQL & Crontab',
    subtitle: 'Template bash script dump basis data perkara harian dengan rotasi 7 hari',
    category: 'Snippet Lab',
    href: '/snippets',
    icon: Code2,
    keywords: ['backup', 'postgres', 'pg_dump', 'cron', 'crontab', 'bash', 'script'],
  },
  {
    id: 'tool-lms',
    title: 'Portal LMS Pusdiklat Kejaksaan RI',
    subtitle: 'Akses portal resmi pengumpulan tugas dan kuis Badan Diklat',
    category: 'Alat & Template',
    href: 'https://pengembangan.kejaksaan.go.id',
    isExternal: true,
    icon: ExternalLink,
    keywords: ['lms', 'portal', 'kejaksaan', 'pengembangan', 'upload', 'resmi'],
  },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Listen for keyboard shortcut Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleCustomOpen = () => setIsOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [])

  // Focus input on open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Filter items
  const filteredItems = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      return SEARCH_DATABASE.slice(0, 8)
    }
    return SEARCH_DATABASE.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(trimmed)
      const matchSubtitle = item.subtitle.toLowerCase().includes(trimmed)
      const matchCategory = item.category.toLowerCase().includes(trimmed)
      const matchKeywords = item.keywords.some((k) => k.includes(trimmed))
      return matchTitle || matchSubtitle || matchCategory || matchKeywords
    })
  }, [query])

  // Keyboard navigation inside menu
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex])
      }
    }
  }

  const handleSelectItem = (item: SearchItem) => {
    setIsOpen(false)
    if (item.isExternal) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    } else {
      router.push(item.href)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xl z-10 flex flex-col max-h-[85dvh]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#1a2332]">
            <Search className="h-5 w-5 text-[#007aff] dark:text-[#60a5fa] shrink-0" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Cari materi PDF, jadwal, snippet SQL, kuis, atau alat... (Ketik atau pilih)"
              className="w-full bg-transparent text-sm sm:text-base font-medium text-[#000000] dark:text-white placeholder-[#615d59] dark:placeholder-[#94a3b8] focus:outline-hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-[#615d59] hover:text-[#000000] dark:hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white dark:bg-[#141b27] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10">
                ESC
              </kbd>
            )}
          </div>

          {/* Quick Categories Bar when query is empty */}
          {!query && (
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#e6e6e6] dark:border-white/10 bg-white dark:bg-[#141b27] overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-[10px] font-semibold text-[#615d59] dark:text-[#94a3b8] shrink-0">Populer:</span>
              {[
                { label: 'Pustaka Modul', q: 'Modul' },
                { label: 'Jadwal TMO', q: 'TMO' },
                { label: 'AI Makalah', q: 'Makalah' },
                { label: 'Template DUPAK', q: 'DUPAK' },
                { label: 'Snippet SQL', q: 'SQL' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setQuery(chip.q)
                    setSelectedIndex(0)
                  }}
                  className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] hover:text-[#007aff] hover:border-[#007aff]/30 border border-[#e6e6e6] dark:border-white/10 font-semibold text-[11px] transition cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <Search className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-semibold">Tidak ditemukan hasil untuk "{query}"</p>
                <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8]">
                  Coba kata kunci lain seperti "SPBE", "Jadwal", "Makalah", atau "SQL".
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex
                const IconComponent = item.icon

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between gap-3 p-3 rounded-[10px] cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#007aff]/10 dark:bg-[#007aff]/20 text-[#000000] dark:text-white'
                        : 'hover:bg-[#f6f5f4] dark:hover:bg-[#1a2332] text-[#31302e] dark:text-[#cbd5e1]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] transition-colors ${
                          isSelected
                            ? 'bg-[#007aff] text-white'
                            : 'bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa]'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold truncate text-[#000000] dark:text-white">
                            {item.title}
                          </h4>
                          <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 px-2 py-0.2 text-[9px] font-semibold shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#615d59] dark:text-[#94a3b8]">
                      {isSelected && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#007aff] dark:text-[#60a5fa] font-mono">
                          Buka <CornerDownLeft className="h-3 w-3" />
                        </span>
                      )}
                      <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-[#007aff] dark:text-[#60a5fa]' : 'opacity-40'}`} />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Keyboard Hints */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4] dark:bg-[#1a2332] text-[10px] text-[#615d59] dark:text-[#94a3b8]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white dark:bg-[#141b27] px-1.5 py-0.5 font-mono border border-[#e6e6e6] dark:border-white/10">↑</kbd>
                <kbd className="rounded bg-white dark:bg-[#141b27] px-1.5 py-0.5 font-mono border border-[#e6e6e6] dark:border-white/10">↓</kbd>
                Navigasi
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white dark:bg-[#141b27] px-1.5 py-0.5 font-mono border border-[#e6e6e6] dark:border-white/10">↵</kbd>
                Pilih
              </span>
            </div>
            <span className="font-semibold text-[#007aff] dark:text-[#60a5fa]">
              Pencarian Cepat Prakom Batch 3
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
