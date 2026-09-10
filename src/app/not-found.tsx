import Link from "next/link"
import Image from "next/image"
import {
  Home,
  ArrowLeft,
  Calendar,
  BellRing,
  FileText,
  Sparkles,
  Bot,
  Compass,
} from "lucide-react"

export const metadata = {
  title: "404 • Halaman Tidak Ditemukan | Diklat Prakom Batch 3",
  description: "Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.",
}

export default function NotFound() {
  const quickLinks = [
    {
      title: "Jadwal Perkuliahan 35 Hari",
      desc: "Lihat jadwal sesi harian, materi widyaiswara & link Zoom",
      href: "/schedules",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60",
    },
    {
      title: "Papan Pengumuman Resmi",
      desc: "Informasi mendesak, edaran berkas labkom & broadcast diklat",
      href: "/announcements",
      icon: BellRing,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60",
    },
    {
      title: "Penugasan & Ujian MOOC",
      desc: "Daftar deadline tugas mandiri, kelompok, dan bank soal",
      href: "/tasks",
      icon: FileText,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60",
    },
    {
      title: "Template DUPAK & Dokumen",
      desc: "Unduh format SPMK, bukti fisik, dan draf seminar dinas",
      href: "/templates",
      icon: Sparkles,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60",
    },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F4F6FA] dark:bg-[#10141C] text-[#131E29] dark:text-[#D8E0EC] selection:bg-[#0D3830] selection:text-white overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-indigo-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-2xl text-center space-y-6 sm:space-y-8 my-8">
        {/* Animated Badge & Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative inline-flex items-center justify-center">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-slate-800 via-slate-700 to-slate-400 dark:from-white dark:via-slate-200 dark:to-slate-600 bg-clip-text text-transparent select-none drop-shadow-sm">
              404
            </span>
            <div className="absolute -top-3 -right-6 sm:-right-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-3 py-1 text-xs font-black text-rose-700 dark:text-rose-300 shadow-xs">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                Lost in Space
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Maaf, tautan atau rute yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL yang Anda masukkan kurang tepat.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D3830] hover:bg-[#082620] text-white px-5 py-2.5 text-xs font-bold transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/schedules"
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>Jadwal Kelas</span>
          </Link>
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <BellRing className="h-4 w-4 text-rose-500" />
            <span>Pengumuman</span>
          </Link>
        </div>

        {/* Quick Navigation Cards Grid */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center mb-3">
            Atau Jelajahi Halaman Utama Portal
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-2xl bg-white dark:bg-[#161B26] p-4 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.color} group-hover:scale-105 transition`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0D3830] dark:group-hover:text-emerald-400 transition truncate">
                      {item.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Diklat Fungsional Pranata Komputer Keahlian • Batch 3 Kejaksaan RI Tahun 2026
        </p>
      </div>
    </div>
  )
}
