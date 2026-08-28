import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { UrgentAnnouncement } from "@/components/public/urgent-announcement"
import { IntroScreen } from "@/components/public/intro-screen"
import { TwinkleHero } from "@/components/public/twinkle-hero"
import { AiCompanionCard } from "@/components/public/ai-companion-card"
import { HomeTaskReminder } from "@/components/public/home-task-reminder"
import { LiveSessionBanner } from "@/components/public/live-session-banner"
import { SupabaseStatus } from "@/components/supabase-status"
import { getAutoRoadmapData } from "@/lib/roadmap-utils"
import { getTaskDeadlineTimestamp } from "@/lib/utils"
import {
  Calendar,
  FileText,
  BookOpen,
  BellRing,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  CheckCircle2,
  ExternalLink,
  Shield,
  Smile,
  ChevronRight,
  HelpCircle,
  Code2
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let announcements: any[] = []
  let tasks: any[] = []
  let schedules: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const [annRes, taskRes, schedRes] = await Promise.all([
        supabase.from("announcements").select("*").eq("is_active", true),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
        supabase.from("schedules").select("*").order("start_time", { ascending: true }),
      ])
      announcements = annRes.data || []
      tasks = taskRes.data || []
      schedules = schedRes.data || []
    } catch {
      // Offline fallback
    }
  }

  const now = new Date().getTime()
  const activeTasks = tasks.filter((t) => t.status !== "completed")
  const futureTasks = activeTasks.filter((t) => getTaskDeadlineTimestamp(t.due_date) > now)
  const closestTask = futureTasks.length > 0 ? futureTasks[0] : null
  const { summary } = getAutoRoadmapData(undefined, schedules)

  return (
    <PublicShell>
      {/* 1. Layar Intro Interaktif (Tampil 1x Saat Kunjungan Awal Sesi, Hilang Setelah Masuk) */}
      <IntroScreen />

      <div className="space-y-4 sm:space-y-5">
        
        {/* 2. Pengumuman Mendesak (Jika Ada) */}
        <UrgentAnnouncement announcements={announcements} />

        {/* 3. Live Session Banner & Quick Zoom Launcher */}
        <LiveSessionBanner
          currentDayName={`Hari ${summary.currentDayNumber} • ${summary.currentStageName}`}
          currentDayNumber={summary.currentDayNumber}
          todaySchedules={schedules}
          todayTasks={tasks}
        />

        {/* 4. Hero Banner Gaya eTwinkle (Playful Neo-Minimalist) */}
        <TwinkleHero />

        {/* 5. AI Asisten Kelas (Sapaan Santai, Motivasi Harian & Peringatan Tugas) */}
        <AiCompanionCard />

        {/* 6. Live Reminder Deadline Terdekat (Simpel & Ringkas) */}
        <HomeTaskReminder targetTask={closestTask} />

        {/* 7. Roadmap 4 Tahap Summary (Progress Otomatis Berdasarkan Hari) */}
        <section className="rounded-[14px] bg-white dark:bg-[#1B2130] p-5 sm:p-6 lg:p-7 border border-slate-200/90 dark:border-[#2A3550] shadow-xs space-y-5 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 dark:bg-slate-800 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  Roadmap 35 Hari
                </span>
                <span className="rounded-full bg-orange-100 dark:bg-amber-950/80 px-3 py-0.5 text-[10px] font-black uppercase text-orange-700 dark:text-amber-300">
                  Total 120 JP
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  Progres: Hari {summary.currentDayNumber} / {summary.totalDays} ({summary.progressPercentage}%)
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Alur 4 Tahapan Perkuliahan Diklat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alur perkuliahan dari belajar mandiri MOOC, tatap muka online TMO, lab kerja di satker, hingga seminar!
              </p>
            </div>

            <Link href="/schedules">
              <button className="flex items-center gap-2 rounded-[8px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-4 py-2 text-xs font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xs cursor-pointer shrink-0">
                <span>Buka Jadwal 35 Hari</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-300 dark:text-white" />
              </button>
            </Link>
          </div>

          {/* 4 Stage Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            {(() => {
              const currentDay = summary.currentDayNumber
              const isTodayActive = summary.isTodayActive
              return [
                {
                  num: 1,
                  title: "Tahap 1 • MOOC",
                  sub: "Pembelajaran Mandiri",
                  days: "Hari 1 s.d. 5",
                  dates: "24 Agu – 28 Agu 2026",
                  status: currentDay > 5 ? "Selesai" : isTodayActive && currentDay >= 1 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: isTodayActive && currentDay >= 1 && currentDay <= 5,
                  headerColor: isTodayActive && currentDay >= 1 && currentDay <= 5
                    ? "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                    : currentDay > 5
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                    : "bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300",
                },
                {
                  num: 2,
                  title: "Tahap 2 • TMO",
                  sub: "Tatap Muka Online",
                  days: "Hari 6 s.d. 15",
                  dates: "31 Agu – 11 Sep 2026",
                  status: currentDay > 15 ? "Selesai" : isTodayActive && currentDay >= 6 ? "Sedang Berjalan" : currentDay >= 6 ? "Mulai 31 Agu" : "Jadwal Mendatang",
                  isCurrent: isTodayActive && currentDay >= 6 && currentDay <= 15,
                  headerColor: isTodayActive && currentDay >= 6 && currentDay <= 15
                    ? "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                    : currentDay > 15
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                    : "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300",
                },
                {
                  num: 3,
                  title: "Tahap 3 • Lab Prakom",
                  sub: "Laboratorium di Satker",
                  days: "Hari 16 s.d. 30",
                  dates: "14 Sep – 2 Okt 2026",
                  status: currentDay > 30 ? "Selesai" : isTodayActive && currentDay >= 16 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: isTodayActive && currentDay >= 16 && currentDay <= 30,
                  headerColor: isTodayActive && currentDay >= 16 && currentDay <= 30
                    ? "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                    : currentDay > 30
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300",
                },
                {
                  num: 4,
                  title: "Tahap 4 • Seminar",
                  sub: "Seminar Klasikal",
                  days: "Hari 31 s.d. 35",
                  dates: "5 Okt – 9 Okt 2026",
                  status: currentDay > 35 ? "Selesai" : isTodayActive && currentDay >= 31 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: isTodayActive && currentDay >= 31 && currentDay <= 35,
                  headerColor: isTodayActive && currentDay >= 31 && currentDay <= 35
                    ? "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                    : currentDay > 35
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                    : "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300",
                },
              ]
            })().map((stg) => (
              <Link href="/schedules" key={stg.num} className="group block">
                <div
                  className={`h-full rounded-[12px] border overflow-hidden flex flex-col justify-between transition-all ${
                    stg.isCurrent
                      ? "bg-amber-50/40 dark:bg-[#161B26] border-orange-500/80 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-white dark:bg-[#161B26] border-slate-200/90 dark:border-[#2A3550] shadow-2xs hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xs"
                  }`}
                >
                  {/* _oX Window Header */}
                  <div className={`flex items-center justify-between px-3 py-1.5 border-b border-slate-200/80 dark:border-[#2A3550] ${stg.headerColor}`}>
                    <span className="text-[10px] font-black">{stg.title}</span>
                    <span className="font-mono text-[10px] font-black opacity-70">_oX</span>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        stg.isCurrent
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          : "bg-slate-100 dark:bg-[#253045] text-slate-600 dark:text-slate-300"
                      }`}>
                        {stg.status}
                      </span>
                      <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200 shrink-0">{stg.days}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-amber-400 transition">
                        {stg.sub}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {stg.dates}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#8C9BAE] dark:text-slate-400 group-hover:text-[#18181B] dark:group-hover:text-white transition">
                      <span>Rincian Modul</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 8. 6 Modul Navigasi Utama (_oX Browser Window Frames) */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              Eksplor Modul & Bahan Ajar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih modul di bawah untuk mengakses jadwal, materi, kuis MOOC, snippet praktikum, dan tugas kelas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Card 1: Roadmap */}
            <Link href="/schedules" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] group-hover:border-slate-400 dark:group-hover:border-slate-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-sky-50 dark:bg-sky-950/80 border-b border-slate-200/80 dark:border-[#2A3550]">
                  <span className="text-[10px] font-black text-sky-800 dark:text-sky-300">Roadmap 35 Hari</span>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition">
                    Jadwal & Agenda Sesi
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Cek jadwal per hari, pembagian waktu, dan tautan sesi Zoom perkuliahan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Materi */}
            <Link href="/materials" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] group-hover:border-slate-400 dark:group-hover:border-slate-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 border-b border-slate-200/80 dark:border-[#2A3550]">
                  <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300">Modul 120 JP</span>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                    Pustaka Modul PDF
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Download modul resmi & baca langsung via reader interaktif dengan catatan belajar.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Tugas */}
            <Link href="/tasks" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] group-hover:border-slate-400 dark:group-hover:border-slate-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-rose-50 dark:bg-rose-950/80 border-b border-slate-200/80 dark:border-[#2A3550]">
                  <span className="text-[10px] font-black text-rose-800 dark:text-rose-300">Tugas & Praktik</span>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <BookOpen className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition">
                    Tugas & Deadline
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Pantau batas waktu tugas mandiri dan link kirim ke portal LMS Kejaksaan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Kuis MOOC */}
            <Link href="/quiz" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] group-hover:border-slate-400 dark:group-hover:border-slate-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 dark:bg-amber-950/80 border-b border-slate-200/80 dark:border-[#2A3550]">
                  <span className="text-[10px] font-black text-amber-800 dark:text-amber-300">Latihan Ujian</span>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                    Simulasi Kuis MOOC
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Kuis interaktif pilihan ganda seputar SPBE, Database, Keamanan & Angka Kredit dengan skor instan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 5: Snippets */}
            <Link href="/snippets" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] group-hover:border-slate-400 dark:group-hover:border-slate-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 border-b border-slate-200/80 dark:border-[#2A3550]">
                  <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300">Lab Prakom</span>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <Code2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                    Code & Query Snippets
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Kumpulan template SQL query, backup automation Linux, dan konfigurasi server satker.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 6: Pengumuman */}
            <Link href="/announcements" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] group-hover:border-slate-400 dark:group-hover:border-slate-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 dark:bg-amber-950/80 border-b border-slate-200/80 dark:border-[#2A3550]">
                  <span className="text-[10px] font-black text-amber-800 dark:text-amber-300">Broadcast Info</span>
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <BellRing className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                    Pengumuman Diklat
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Edaran penting panitia diklat, info link Zoom baru, dan berita kelas.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 7: Pusat Bantuan & FAQ Admin */}
            <Link href="/faq" className="group block sm:col-span-2 lg:col-span-3">
              <div className="h-full rounded-[12px] bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/50 dark:from-[#1E1712] dark:via-[#161B26] dark:to-[#1B2130] border border-amber-300/80 dark:border-amber-900/50 group-hover:border-orange-500 dark:group-hover:border-emerald-500 group-hover:shadow-xs transition-all overflow-hidden flex flex-col sm:flex-row items-center justify-between p-4 sm:p-4.5 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-orange-600 text-white shadow-sm shadow-orange-600/20">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-orange-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-[9px] font-black uppercase text-orange-700 dark:text-amber-300">
                        Pusat Bantuan & Pengaduan
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                        • Respon Cepat Admin
                      </span>
                    </div>
                    <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-amber-400 transition">
                      Tanya Jawab (FAQ) & Kontak Admin Kelas
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      Panduan lengkap jadwal, LMS, dan formulir aduan kendala teknis atau saran perbaikan kelas.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-amber-400 self-end sm:self-center shrink-0">
                  <span>Buka Pusat Bantuan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 9. Supabase Status Footer */}
        <div className="pt-2">
          <SupabaseStatus />
        </div>

      </div>
    </PublicShell>
  )
}
