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

  const closestTask = tasks.find((t) => t.status !== "completed")
  const { summary } = getAutoRoadmapData(undefined, schedules)

  return (
    <PublicShell>
      {/* 1. Layar Intro Interaktif (Tampil 1x Saat Kunjungan Awal Sesi, Hilang Setelah Masuk) */}
      <IntroScreen />

      <div className="space-y-8">
        
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
        <section className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-8 lg:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#18181B] dark:bg-slate-800 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  Roadmap 35 Hari
                </span>
                <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-0.5 text-[10px] font-black uppercase text-[#EA580C] dark:text-amber-300">
                  Total 120 JP
                </span>
                <span className="text-xs font-black text-[#0D824B] dark:text-emerald-400">
                  Progres: Hari {summary.currentDayNumber} / {summary.totalDays} ({summary.progressPercentage}%)
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-[#18181B] dark:text-white tracking-tight">
                Alur 4 Tahapan Perkuliahan Diklat
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7C93] dark:text-slate-400">
                Alur santai dari belajar mandiri MOOC, tatap muka online TMO, lab kerja, sampai seminar!
              </p>
            </div>

            <Link href="/schedules">
              <button className="flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-emerald-600 hover:bg-[#27272A] dark:hover:bg-emerald-700 px-5 py-2.5 text-xs font-black text-white hover:scale-102 transition-all shadow-sm cursor-pointer shrink-0">
                <span>Buka Jadwal 35 Hari Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#FFD280] dark:text-white" />
              </button>
            </Link>
          </div>

          {/* 4 Stage Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {(() => {
              const currentDay = summary.currentDayNumber
              return [
                {
                  num: 1,
                  title: "Tahap 1 • MOOC",
                  sub: "Pembelajaran Mandiri",
                  days: "Hari 1 s.d. 5",
                  dates: "24 Agu – 28 Agu 2026",
                  status: currentDay > 5 ? "Selesai" : currentDay >= 1 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: currentDay >= 1 && currentDay <= 5,
                  headerColor: currentDay >= 1 && currentDay <= 5
                    ? "bg-[#FFEADA] dark:bg-amber-950/90 text-[#EA580C] dark:text-amber-300"
                    : currentDay > 5
                    ? "bg-[#E6F7ED] dark:bg-emerald-950/90 text-[#0D824B] dark:text-emerald-300"
                    : "bg-[#D7F3FE] dark:bg-sky-950/90 text-[#0369A1] dark:text-sky-300",
                },
                {
                  num: 2,
                  title: "Tahap 2 • TMO",
                  sub: "Tatap Muka Online",
                  days: "Hari 6 s.d. 15",
                  dates: "31 Agu – 11 Sep 2026",
                  status: currentDay > 15 ? "Selesai" : currentDay >= 6 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: currentDay >= 6 && currentDay <= 15,
                  headerColor: currentDay >= 6 && currentDay <= 15
                    ? "bg-[#FFEADA] dark:bg-amber-950/90 text-[#EA580C] dark:text-amber-300"
                    : currentDay > 15
                    ? "bg-[#E6F7ED] dark:bg-emerald-950/90 text-[#0D824B] dark:text-emerald-300"
                    : "bg-[#D7F3FE] dark:bg-sky-950/90 text-[#0369A1] dark:text-sky-300",
                },
                {
                  num: 3,
                  title: "Tahap 3 • Lab Prakom",
                  sub: "Laboratorium di Satker",
                  days: "Hari 16 s.d. 30",
                  dates: "14 Sep – 2 Okt 2026",
                  status: currentDay > 30 ? "Selesai" : currentDay >= 16 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: currentDay >= 16 && currentDay <= 30,
                  headerColor: currentDay >= 16 && currentDay <= 30
                    ? "bg-[#FFEADA] dark:bg-amber-950/90 text-[#EA580C] dark:text-amber-300"
                    : currentDay > 30
                    ? "bg-[#E6F7ED] dark:bg-emerald-950/90 text-[#0D824B] dark:text-emerald-300"
                    : "bg-[#FFE3EB] dark:bg-rose-950/90 text-[#E11D48] dark:text-rose-300",
                },
                {
                  num: 4,
                  title: "Tahap 4 • Seminar",
                  sub: "Seminar Klasikal",
                  days: "Hari 31 s.d. 35",
                  dates: "5 Okt – 9 Okt 2026",
                  status: currentDay > 35 ? "Selesai" : currentDay >= 31 ? "Sedang Berjalan" : "Jadwal Mendatang",
                  isCurrent: currentDay >= 31 && currentDay <= 35,
                  headerColor: currentDay >= 31 && currentDay <= 35
                    ? "bg-[#FFEADA] dark:bg-amber-950/90 text-[#EA580C] dark:text-amber-300"
                    : currentDay > 35
                    ? "bg-[#E6F7ED] dark:bg-emerald-950/90 text-[#0D824B] dark:text-emerald-300"
                    : "bg-[#FFF2D1] dark:bg-amber-950/90 text-[#B47D00] dark:text-amber-300",
                },
              ]
            })().map((stg) => (
              <Link href="/schedules" key={stg.num} className="group block">
                <div
                  className={`h-full rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
                    stg.isCurrent
                      ? "bg-[#FFF9F5] dark:bg-[#1A181C] border-[#FF7643] ring-4 ring-[#FF7643]/20 shadow-md"
                      : "bg-white dark:bg-[#161B26] border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#18181B] dark:hover:border-slate-600 hover:shadow-md"
                  }`}
                >
                  {/* _oX Window Header */}
                  <div className={`flex items-center justify-between px-3.5 py-2 border-b-2 border-slate-200 dark:border-slate-800 ${stg.headerColor}`}>
                    <span className="text-[11px] font-black">{stg.title}</span>
                    <span className="font-mono text-xs font-black opacity-70">_oX</span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        stg.isCurrent
                          ? "bg-[#FFEADA] dark:bg-amber-950 text-[#EA580C] dark:text-amber-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}>
                        {stg.status}
                      </span>
                      <span className="font-mono text-xs font-black text-[#18181B] dark:text-white shrink-0">{stg.days}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-[#18181B] dark:text-white group-hover:text-[#FF7643] dark:group-hover:text-amber-400 transition">
                        {stg.sub}
                      </h4>
                      <p className="text-[11px] text-[#6B7C93] dark:text-slate-400 mt-0.5">
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
            <h3 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-white">
              Eksplor Modul & Bahan Ajar
            </h3>
            <p className="text-xs text-[#6B7C93] dark:text-slate-400">
              Pilih modul di bawah untuk mengakses jadwal, materi, kuis MOOC, snippet praktikum, dan tugas kelas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Roadmap */}
            <Link href="/schedules" className="group block">
              <div className="h-full rounded-2xl bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 group-hover:border-[#18181B] dark:group-hover:border-slate-600 group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#D7F3FE] dark:bg-sky-950/80 border-b-2 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black text-[#0369A1] dark:text-sky-300">Roadmap 35 Hari</span>
                  <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <Calendar className="h-6 w-6 text-[#0369A1] dark:text-sky-400" />
                  <h4 className="font-black text-base text-[#18181B] dark:text-white group-hover:text-[#0369A1] dark:group-hover:text-sky-300 transition">
                    Jadwal & Agenda Sesi
                  </h4>
                  <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2">
                    Cek jadwal per hari, pembagian waktu, dan tautan sesi Zoom perkuliahan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Materi */}
            <Link href="/materials" className="group block">
              <div className="h-full rounded-2xl bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 group-hover:border-[#18181B] dark:group-hover:border-slate-600 group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#E6F7ED] dark:bg-emerald-950/80 border-b-2 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black text-[#0D824B] dark:text-emerald-300">Modul 120 JP</span>
                  <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <FileText className="h-6 w-6 text-[#0D824B] dark:text-emerald-400" />
                  <h4 className="font-black text-base text-[#18181B] dark:text-white group-hover:text-[#0D824B] dark:group-hover:text-emerald-300 transition">
                    Pustaka Modul PDF
                  </h4>
                  <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2">
                    Download modul resmi & baca langsung via reader interaktif dengan catatan belajar.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Tugas */}
            <Link href="/tasks" className="group block">
              <div className="h-full rounded-2xl bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 group-hover:border-[#18181B] dark:group-hover:border-slate-600 group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFE3EB] dark:bg-rose-950/80 border-b-2 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black text-[#E11D48] dark:text-rose-300">Tugas & Praktik</span>
                  <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <BookOpen className="h-6 w-6 text-[#E11D48] dark:text-rose-400" />
                  <h4 className="font-black text-base text-[#18181B] dark:text-white group-hover:text-[#E11D48] dark:group-hover:text-rose-300 transition">
                    Tugas & Deadline
                  </h4>
                  <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2">
                    Pantau batas waktu tugas mandiri dan link kirim ke portal LMS Kejaksaan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Kuis MOOC */}
            <Link href="/quiz" className="group block">
              <div className="h-full rounded-2xl bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 group-hover:border-[#18181B] dark:group-hover:border-slate-600 group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFEADA] dark:bg-amber-950/80 border-b-2 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black text-[#EA580C] dark:text-amber-300">Latihan Ujian</span>
                  <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <HelpCircle className="h-6 w-6 text-[#EA580C] dark:text-amber-400" />
                  <h4 className="font-black text-base text-[#18181B] dark:text-white group-hover:text-[#EA580C] dark:group-hover:text-amber-300 transition">
                    Simulasi Kuis MOOC
                  </h4>
                  <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2">
                    Kuis interaktif pilihan ganda seputar SPBE, Database, Keamanan & Angka Kredit dengan skor instan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 5: Snippets */}
            <Link href="/snippets" className="group block">
              <div className="h-full rounded-2xl bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 group-hover:border-[#18181B] dark:group-hover:border-slate-600 group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#E6F7ED] dark:bg-emerald-950/80 border-b-2 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black text-[#0D824B] dark:text-emerald-300">Lab Prakom</span>
                  <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <Code2 className="h-6 w-6 text-[#0D824B] dark:text-emerald-400" />
                  <h4 className="font-black text-base text-[#18181B] dark:text-white group-hover:text-[#0D824B] dark:group-hover:text-emerald-300 transition">
                    Code & Query Snippets
                  </h4>
                  <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2">
                    Kumpulan template SQL query, backup automation Linux, dan konfigurasi server satker.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 6: Pengumuman */}
            <Link href="/announcements" className="group block">
              <div className="h-full rounded-2xl bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 group-hover:border-[#18181B] dark:group-hover:border-slate-600 group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFF2D1] dark:bg-amber-950/80 border-b-2 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black text-[#B47D00] dark:text-amber-300">Broadcast Info</span>
                  <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-400">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <BellRing className="h-6 w-6 text-[#B47D00] dark:text-yellow-400" />
                  <h4 className="font-black text-base text-[#18181B] dark:text-white group-hover:text-[#B47D00] dark:group-hover:text-yellow-300 transition">
                    Pengumuman Diklat
                  </h4>
                  <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2">
                    Edaran penting panitia diklat, info link Zoom baru, dan berita kelas.
                  </p>
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
