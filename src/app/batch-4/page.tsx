import { PublicShell } from "@/components/public/public-shell"
import { LiveSessionBannerB4 } from "@/components/public/batch4/live-session-banner-b4"
import { DEFAULT_BATCH4_SCHEDULES } from "@/data/batch4/schedules-data"
import { DEFAULT_BATCH4_MATERIALS } from "@/data/batch4/materials-data"
import {
  Calendar,
  FileText,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  ExternalLink,
  ChevronRight,
  Laptop,
  Building2,
  CheckCircle2,
  Bot
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Agrasena Batch 4 - Portal Diklat Pranata Komputer Kejaksaan RI",
  description: "Pusat jadwal 35 hari, pustaka modul 120 JP, tautan Zoom resmi, dan asisten AI pembelajaran peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI.",
}

export default function Batch4Page() {
  const totalDays = 35
  const totalMaterials = DEFAULT_BATCH4_MATERIALS.length

  return (
    <PublicShell>
      <div className="space-y-8 sm:space-y-12">
        
        {/* 1. Quick Batch Switcher Notice */}
        <div className="rounded-[16px] bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-black shrink-0">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-indigo-950 dark:text-indigo-200">
                Anda berada di halaman khusus Agrasena Batch 4.
              </span>{" "}
              <span className="text-indigo-800/80 dark:text-indigo-300/80">
                Jadwal, tautan Zoom, dan modul di halaman ini terisolasi untuk peserta Batch 4.
              </span>
            </div>
          </div>
          <Link
            href="/?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Beralih ke Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 2. Hero Banner Agrasena Batch 4 */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] text-white p-6 sm:p-10 border border-indigo-500/20 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 text-xs font-bold text-indigo-200 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Portal Angkatan Resmi</span>
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 border border-white/10">
                Agrasena Batch 4 • 120 JP
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                Tahun Anggaran 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Diklat Fungsional <br />
              <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Pranata Komputer Keahlian
              </span>{" "}
              Batch 4
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
              Pusat perkuliahan virtual, kalender 35 hari roadmap, perpustakaan kurikulum 120 JP, simulasi evaluasi MOOC, dan asisten AI penyusunan naskah proposal proyek prakom bagi aparatur Kejaksaan RI.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/batch-4/schedules"
                className="inline-flex items-center gap-2 rounded-full bg-white text-indigo-950 hover:bg-indigo-50 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>Lihat Jadwal 35 Hari</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/batch-4/materials"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 px-5 py-2.5 text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-indigo-300" />
                <span>Katalog Modul PDF</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Live Session Banner Khusus Batch 4 */}
        <LiveSessionBannerB4 />

        {/* 4. AI Companion Card Batch 4 */}
        <section className="rounded-[20px] bg-white dark:bg-[#151c28] p-5 sm:p-7 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#18181B] dark:text-white">
                    Asisten AI Agrasena Batch 4
                  </h3>
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5">
                    Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pendamping cerdas untuk telaah butir angka kredit, resume modul, dan simulasi soal MOOC.
                </p>
              </div>
            </div>
            <Link
              href="/batch-4/paper-generator"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <span>Buka Generator Makalah</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl bg-slate-50 dark:bg-[#101520] p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#18181B] dark:text-white block mb-1">
                📝 Draf Laporan Lab Satker
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Buat outline makalah dan laporan implementasi TI di satuan kerja Anda dalam hitungan detik.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-[#101520] p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#18181B] dark:text-white block mb-1">
                🎯 Bank Soal Kuis MOOC
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Latihan 50+ soal prediksi ujian MOOC Tahap 1 dengan pembahasan dan rujukan modul.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-[#101520] p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#18181B] dark:text-white block mb-1">
                📑 Butir Angka Kredit (AK)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Cek matriks butir kegiatan Prakom Keahlian sesuai PermenPAN-RB No. 32 Tahun 2020.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Roadmap 4 Tahap Diklat Batch 4 */}
        <section className="rounded-[20px] bg-white dark:bg-[#151c28] p-6 sm:p-8 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3 py-0.5 text-[11px] font-semibold">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Roadmap 35 Hari Batch 4</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-semibold">
                  Total 120 JP
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-tight">
                Alur 4 Tahapan Perkuliahan Batch 4
              </h3>
              <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8]">
                Runtutan perkuliahan terstruktur dari pembelajaran mandiri, kuliah virtual Zoom, hingga evaluasi akhir.
              </p>
            </div>

            <Link href="/batch-4/schedules">
              <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] px-4.5 py-2 text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer shrink-0">
                <span>Buka Jadwal Batch 4</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </Link>
          </div>

          {/* 4 Stage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: 1,
                title: "Tahap 1 • MOOC",
                sub: "Pembelajaran Mandiri",
                days: "Hari 1 s.d. 5",
                dates: "Oktober 2026",
                desc: "Mempelajari modul dasar & mengerjakan kuis formatif di portal LMS.",
                icon: <BookOpen className="h-4 w-4 text-indigo-500" />
              },
              {
                num: 2,
                title: "Tahap 2 • TMO",
                sub: "Tatap Muka Online",
                days: "Hari 6 s.d. 15",
                dates: "Oktober – November 2026",
                desc: "Perkuliahan interaktif via Zoom bersama narasumber BPS & Kejaksaan.",
                icon: <Laptop className="h-4 w-4 text-indigo-500" />
              },
              {
                num: 3,
                title: "Tahap 3 • Lab Prakom",
                sub: "Implementasi di Satker",
                days: "Hari 16 s.d. 30",
                dates: "November 2026",
                desc: "Penyusunan proyek sistem/layanan TI pada satuan kerja masing-masing.",
                icon: <Building2 className="h-4 w-4 text-indigo-500" />
              },
              {
                num: 4,
                title: "Tahap 4 • Seminar",
                sub: "Evaluasi & Klasikal",
                days: "Hari 31 s.d. 35",
                dates: "Desember 2026",
                desc: "Ujian komprehensif, pemaparan makalah laboratorium, dan kelulusan.",
                icon: <Award className="h-4 w-4 text-indigo-500" />
              }
            ].map((stg) => (
              <Link href="/batch-4/schedules" key={stg.num} className="group block">
                <div className="h-full rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141b27] p-4 flex flex-col justify-between gap-3 hover:border-indigo-500 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#18181B] dark:text-white">
                      {stg.icon}
                      <span>{stg.title}</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">0{stg.num}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                      {stg.days}
                    </span>
                    <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors mt-1">
                      {stg.sub}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {stg.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-indigo-600">
                    <span>Lihat Rincian Sesi</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Enam Pusat Eksplorasi Fitur Batch 4 */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Akses Cepat Batch 4
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-white tracking-tight mt-0.5">
              Pusat Materi & Perangkat Diklat
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Jadwal */}
            <Link href="/batch-4/schedules" className="group block">
              <div className="h-full rounded-[16px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-5 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    35 HARI
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors">
                    Jadwal 35 Hari Batch 4
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Rundown komprehensif, jam JP, pemateri, dan tautan sesi virtual harian.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Pustaka Modul */}
            <Link href="/batch-4/materials" className="group block">
              <div className="h-full rounded-[16px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-5 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    120 JP
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors">
                    Pustaka Modul PDF Batch 4
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Unduh modul resmi kurikulum Diklat Fungsional Prakom Keahlian.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Tugas */}
            <Link href="/batch-4/tasks" className="group block">
              <div className="h-full rounded-[16px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-5 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    TUGAS & LAB
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors">
                    Tugas & Penugasan Satker
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Daftar tenggat pengumpulan tugas, instruksi penyusunan, dan panduan upload.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Kuis MOOC */}
            <Link href="/batch-4/quiz" className="group block">
              <div className="h-full rounded-[16px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-5 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    SIMULASI
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors">
                    Simulasi Kuis MOOC
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Uji pemahaman modul mandiri dengan bank soal interaktif dan timer ujian.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 5: Generator Makalah */}
            <Link href="/batch-4/paper-generator" className="group block">
              <div className="h-full rounded-[16px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-5 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                    AI POWERED
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors">
                    AI Laporan Lab Prakom
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Generator proposal proyek perubahan dan makalah laboratorium satker.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 6: Template & DUPAK */}
            <Link href="/batch-4/templates" className="group block">
              <div className="h-full rounded-[16px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-5 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    STANDAR
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-indigo-600 transition-colors">
                    Template & Matriks DUPAK
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Format surat penugasan (SPT), butir angka kredit, dan rubrik seminar.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </PublicShell>
  )
}
