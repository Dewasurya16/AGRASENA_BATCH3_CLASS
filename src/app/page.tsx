import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { UrgentAnnouncement } from "@/components/public/urgent-announcement"
import { IntroScreen } from "@/components/public/intro-screen"
import { TwinkleHero } from "@/components/public/twinkle-hero"
import { AiCompanionCard } from "@/components/public/ai-companion-card"
import { HomeTaskReminder } from "@/components/public/home-task-reminder"
import { LiveSessionBanner } from "@/components/public/live-session-banner"
import { LearningProgressWidget } from "@/components/public/learning-progress-widget"
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
  Code2,
  Laptop,
  Building2
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let announcements: any[] = []
  let tasks: any[] = []
  let schedules: any[] = []
  let materials: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const [annRes, taskRes, schedRes, matRes] = await Promise.all([
        supabase.from("announcements").select("*").eq("is_active", true),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
        supabase.from("schedules").select("*").order("start_time", { ascending: true }),
        supabase.from("materials").select("id"),
      ])
      announcements = annRes.data || []
      tasks = taskRes.data || []
      schedules = schedRes.data || []
      materials = matRes.data || []
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

      <div className="space-y-8 sm:space-y-12">
        
        {/* 2. Pengumuman Mendesak (Jika Ada) */}
        <UrgentAnnouncement announcements={announcements} />

        {/* 3. Live Session Banner & Quick Zoom Launcher */}
        <LiveSessionBanner
          currentDayName={`Hari ${summary.currentDayNumber} • ${summary.currentStageName}`}
          currentDayNumber={summary.currentDayNumber}
          todaySchedules={schedules}
          todayTasks={tasks}
        />

        {/* 4. Hero Banner */}
        <TwinkleHero />

        {/* 5. AI Asisten Kelas (Sapaan Santai, Motivasi Harian & Peringatan Tugas) */}
        <AiCompanionCard
          summary={summary}
          todaySchedules={schedules}
          closestTask={closestTask}
        />

        {/* 6. Live Reminder Deadline Terdekat (Simpel & Ringkas) */}
        <HomeTaskReminder targetTask={closestTask} />

        {/* 6.5 Status Belajar & Kesiapan Diklat Peserta (Local Storage Private Progress) */}
        <LearningProgressWidget totalMaterialsCount={materials.length || 14} />

        {/* 7. Roadmap 4 Tahap Story Block */}
        <section className="rounded-[16px] bg-white dark:bg-[#151c28] p-6 sm:p-8 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] text-white px-3 py-0.5 text-[11px] font-semibold">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Roadmap 35 Hari</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ff9500]/15 text-[#d97706] dark:bg-[#ff9500]/25 dark:text-[#fbbf24] border border-[#ff9500]/30 px-2.5 py-0.5 text-[11px] font-semibold">
                  <span>Total 120 JP</span>
                </span>
                <span className="text-xs font-semibold text-[#16a34a] dark:text-[#4ade80] flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#34c759] animate-pulse" />
                  Hari {summary.currentDayNumber} / {summary.totalDays} ({summary.progressPercentage}%)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-tight">
                Alur 4 Tahapan Perkuliahan Diklat
              </h3>
              <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8]">
                Alur perkuliahan dari belajar mandiri MOOC, tatap muka online TMO, lab kerja di satker, hingga seminar!
              </p>
            </div>

            <Link href="/schedules">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] text-white active:scale-[0.98] px-4.5 py-2 text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer shrink-0">
                <span>Buka Jadwal 35 Hari</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </Link>
          </div>

          {/* 4 Stage Cards Grid with Apple SF Symbol Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {[
              {
                num: 1,
                title: "Tahap 1 • MOOC",
                sub: "Pembelajaran Mandiri",
                days: "Hari 1 s.d. 5",
                dates: "24 Agu – 28 Agu 2026",
                status: summary.currentDayNumber > 5 ? "Selesai" : summary.isTodayActive && summary.currentDayNumber >= 1 ? "Sedang Berjalan" : "Jadwal Mendatang",
                isCurrent: summary.isTodayActive && summary.currentDayNumber >= 1 && summary.currentDayNumber <= 5,
                icon: <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />,
              },
              {
                num: 2,
                title: "Tahap 2 • TMO",
                sub: "Tatap Muka Online",
                days: "Hari 6 s.d. 15",
                dates: "31 Agu – 11 Sep 2026",
                status: summary.currentDayNumber > 15 ? "Selesai" : summary.isTodayActive && summary.currentDayNumber >= 6 ? "Sedang Berjalan" : summary.currentDayNumber >= 6 ? "Mulai 31 Agu" : "Jadwal Mendatang",
                isCurrent: summary.isTodayActive && summary.currentDayNumber >= 6 && summary.currentDayNumber <= 15,
                icon: <Laptop className="h-3.5 w-3.5" strokeWidth={2} />,
              },
              {
                num: 3,
                title: "Tahap 3 • Lab Prakom",
                sub: "Laboratorium di Satker",
                days: "Hari 16 s.d. 30",
                dates: "14 Sep – 2 Okt 2026",
                status: summary.currentDayNumber > 30 ? "Selesai" : summary.isTodayActive && summary.currentDayNumber >= 16 ? "Sedang Berjalan" : "Jadwal Mendatang",
                isCurrent: summary.isTodayActive && summary.currentDayNumber >= 16 && summary.currentDayNumber <= 30,
                icon: <Building2 className="h-3.5 w-3.5" strokeWidth={2} />,
              },
              {
                num: 4,
                title: "Tahap 4 • Seminar",
                sub: "Seminar Klasikal",
                days: "Hari 31 s.d. 35",
                dates: "5 Okt – 9 Okt 2026",
                status: summary.currentDayNumber > 35 ? "Selesai" : summary.isTodayActive && summary.currentDayNumber >= 31 ? "Sedang Berjalan" : "Jadwal Mendatang",
                isCurrent: summary.isTodayActive && summary.currentDayNumber >= 31 && summary.currentDayNumber <= 35,
                icon: <Award className="h-3.5 w-3.5" strokeWidth={2} />,
              },
            ].map((stg) => {
              return (
                <Link href="/schedules" key={stg.num} className="group block">
                  <div
                    className={`h-full rounded-[12px] border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                      stg.isCurrent
                        ? "bg-white dark:bg-[#141b27] border-[#007aff] shadow-xs ring-1 ring-[#007aff]/30 -translate-y-0.5"
                        : "bg-white dark:bg-[#141b27] border-[#e6e6e6] dark:border-white/10 shadow-2xs hover:border-[#007aff]/50 hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Stage Header Tab */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
                      <span className="text-xs font-semibold text-[#000000] dark:text-white flex items-center gap-1.5">
                        <span className="text-[#007aff] dark:text-[#60a5fa]">{stg.icon}</span>
                        {stg.title}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#615d59] dark:text-[#94a3b8]">0{stg.num}</span>
                    </div>

                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs shrink-0 ${
                          stg.isCurrent
                            ? "bg-[#007aff] text-white border-transparent"
                            : "bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                        }`}>
                          {stg.status}
                        </span>
                        <span className="font-mono text-xs font-medium text-[#615d59] dark:text-[#94a3b8] shrink-0">{stg.days}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                          {stg.sub}
                        </h4>
                        <p className="text-xs text-[#615d59] dark:text-[#94a3b8] mt-0.5">
                          {stg.dates}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#e6e6e6] dark:border-white/10 flex items-center justify-between text-xs font-medium text-[#615d59] dark:text-[#94a3b8] group-hover:text-[#000000] dark:group-hover:text-white transition">
                        <span>Rincian Modul</span>
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 8. 6 Modul Navigasi Utama (Apple SF Database Tiles) */}
        <section className="space-y-5">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#007aff] dark:text-[#60a5fa]">
              Eksplorasi Fitur
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-tight mt-0.5">
              Pusat Pembelajaran & Alat Kerja
            </h3>
            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8]">
              Akses cepat seluruh materi 120 JP, jadwal live, bank kuis MOOC, snippet praktikum, dan generator AI makalah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Roadmap */}
            <Link href="/schedules" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-all">
                    <Calendar className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-[#007aff]/30 group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    35 HARI
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                    Jadwal & Roadmap Sesi
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Cek rundown harian, pembagian jam JP, dan tautan sesi Zoom perkuliahan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Materi */}
            <Link href="/materials" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-all">
                    <FileText className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-[#007aff]/30 group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    120 JP PDF
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                    Pustaka Modul PDF
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Unduh modul resmi & baca langsung via reader interaktif dengan catatan belajar.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Tugas */}
            <Link href="/tasks" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-all">
                    <BookOpen className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-[#007aff]/30 group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    DEADLINE
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                    Tugas & Lembar Kerja
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Pantau tugas individu, checklist lembar kerja, dan panduan upload portal LMS.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Kuis MOOC */}
            <Link href="/quiz" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-all">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-[#007aff]/30 group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    SIMULASI
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                    Simulasi Kuis MOOC
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Kuis interaktif pilihan ganda seputar SPBE, Database & Angka Kredit dengan skor instan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 5: Snippets */}
            <Link href="/snippets" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-all">
                    <Code2 className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-[#007aff]/30 group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    LAB PRAKOM
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                    Code & Query Vault
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Koleksi template SQL query, backup automation Linux, dan script konfigurasi server.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 6: AI Makalah */}
            <Link href="/paper-generator" className="group block">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] group-hover:bg-[#007aff] group-hover:text-white transition-all">
                    <GraduationCap className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-[#007aff]/30 group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    AI GENERATOR
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                    AI Makalah Inovasi
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Generator proposal 5 Bab otomatis untuk seminar laboratorium satker.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 7: FAQ Sunset Section */}
            <Link href="/faq" className="group block sm:col-span-2 lg:col-span-3">
              <div className="h-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col sm:flex-row items-center justify-between p-5 gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa]">
                    <HelpCircle className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#007aff] text-white px-2.5 py-0.5 text-[10px] font-semibold">
                        Pusat Bantuan
                      </span>
                      <span className="text-xs font-semibold text-[#16a34a] dark:text-[#4ade80] hidden sm:inline">
                        • Respon Cepat Admin Kelas
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#60a5fa] transition">
                      Tanya Jawab (FAQ) & Formulir Aduan Kendala
                    </h4>
                    <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
                      Panduan lengkap kendala jadwal, sinkronisasi materi LMS, dan kontak langsung ke admin kelas.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] text-white px-4.5 py-2 text-xs font-semibold shrink-0 transition shadow-xs">
                  <span>Buka Pusat Bantuan</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 9. Supabase Status Indicator */}
        <div className="pt-2">
          <SupabaseStatus />
        </div>

      </div>
    </PublicShell>
  )
}
