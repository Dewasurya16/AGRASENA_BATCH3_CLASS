import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { UrgentAnnouncement } from "@/components/public/urgent-announcement"
import { LiveSessionBannerB4 } from "@/components/public/batch4/live-session-banner-b4"
import { TwinkleHeroB4 } from "@/components/public/batch4/twinkle-hero-b4"
import { AiCompanionCard } from "@/components/public/ai-companion-card"
import { HomeTaskReminder } from "@/components/public/home-task-reminder"
import { LearningProgressWidget } from "@/components/public/learning-progress-widget"
import { SupabaseStatus } from "@/components/supabase-status"
import { getAutoRoadmapData, getItemBatch } from "@/lib/roadmap-utils"
import { getTaskDeadlineTimestamp } from "@/lib/utils"
import { DEFAULT_BATCH4_MATERIALS } from "@/data/batch4/materials-data"
import { DEFAULT_BATCH4_SCHEDULES } from "@/data/batch4/schedules-data"
import { DEFAULT_BATCH4_TASKS } from "@/data/batch4/tasks-data"
import { DEFAULT_BATCH4_ANNOUNCEMENTS } from "@/data/batch4/announcements-data"
import {
  Calendar,
  FileText,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ChevronRight,
  HelpCircle,
  Code2,
  Laptop,
  Building2,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Agrasena Batch 4 - Pusat Materi & Roadmap Pranata Komputer Kejaksaan RI",
  description:
    "Hub terpadu perkuliahan fungsional keahlian Agrasena Batch 4. 120 JP modul bahan ajar resmi PDF, rundown harian 35 hari, bank kuis MOOC, dan asisten AI generator makalah inovasi.",
}

export default async function Batch4Page() {
  let announcements: any[] = DEFAULT_BATCH4_ANNOUNCEMENTS
  let tasks: any[] = DEFAULT_BATCH4_TASKS
  let schedules: any[] = DEFAULT_BATCH4_SCHEDULES
  const totalMaterials = DEFAULT_BATCH4_MATERIALS.length

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

      const allAnnouncements = annRes.data || []
      // Isolasi pengumuman: Hanya tampilkan pengumuman yang memang ditujukan untuk Batch 4
      const b4Announcements = allAnnouncements.filter((a: any) => {
        if (a.batch === 4 || a.batch === "batch-4") return true
        if (a.batch === 3 || a.batch === "batch-3") return false

        const fullText = `${a.title || ""} ${a.content || ""} ${a.author || ""}`.toLowerCase()
        if (fullText.includes("batch 4") || fullText.includes("batch-4") || fullText.includes("angkatan 4")) {
          return true
        }

        // Singkirkan pengumuman khusus Batch 3 / Angkatan 5 / Kelas 6
        if (
          fullText.includes("batch 3") ||
          fullText.includes("batch-3") ||
          fullText.includes("angkatan 5") ||
          fullText.includes("kelas 6") ||
          fullText.includes("sobat prakom 625")
        ) {
          return false
        }

        if (a.batch === "all" || fullText.includes("semua batch") || fullText.includes("seluruh peserta")) {
          return true
        }

        return false
      })

      if (b4Announcements.length > 0) {
        announcements = b4Announcements
      }

      const allTasks = taskRes.data || []
      const b4Tasks = allTasks.filter(
        (t: any) =>
          (t.title && t.title.toLowerCase().includes("batch 4")) ||
          (t.subject_name && t.subject_name.toLowerCase().includes("batch 4")) ||
          t.batch === 4 ||
          t.batch === "batch-4"
      )
      if (b4Tasks.length > 0) tasks = b4Tasks

      const allScheds = schedRes.data || []
      const b4Scheds = allScheds.filter((s: any) => getItemBatch(s) === "batch-4")
      if (b4Scheds.length > 0) schedules = b4Scheds
    } catch {
      // Offline fallback
    }
  }

  const now = new Date().getTime()
  const activeTasks = tasks.filter((t) => t.status !== "completed")
  const futureTasks = activeTasks.filter((t) => getTaskDeadlineTimestamp(t.due_date) > now)
  const closestTask = futureTasks.length > 0 ? futureTasks[0] : null
  const { summary } = getAutoRoadmapData(undefined, schedules, "batch-4")

  return (
    <PublicShell>
      <div className="space-y-8 sm:space-y-12">
        {/* 1. Quick Batch Switcher Notice */}
        <div className="rounded-[16px] bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black shrink-0">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                Anda berada di portal Agrasena Batch 4.
              </span>{" "}
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                Jadwal, tautan Zoom di roadmap, dan modul di halaman ini terisolasi untuk peserta Batch 4.
              </span>
            </div>
          </div>
          <Link
            href="/?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Beralih ke Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 2. Pengumuman Mendesak (Jika Ada) */}
        {announcements.length > 0 && <UrgentAnnouncement announcements={announcements} />}

        {/* 3. Live Session Banner & Quick Schedule Khusus Batch 4 (Gambar 2 Layout) */}
        <LiveSessionBannerB4 todaySchedules={schedules} todayTasks={tasks} />

        {/* 4. Hero Banner Batch 4 (Emerald Theme) */}
        <TwinkleHeroB4 />

        {/* 5. AI Asisten Kelas (Sapaan Santai, Motivasi Harian & Peringatan Tugas) */}
        <AiCompanionCard
          summary={summary}
          todaySchedules={schedules}
          closestTask={closestTask}
        />

        {/* 6. Live Reminder Deadline Terdekat */}
        <HomeTaskReminder targetTask={closestTask} isBatch4={true} />

        {/* 6.5 Status Belajar & Kesiapan Diklat Peserta (Local Storage Private Progress) */}
        <LearningProgressWidget totalMaterialsCount={totalMaterials} isBatch4={true} />

        {/* 7. Roadmap 4 Tahap Story Block Batch 4 */}
        <section className="rounded-[16px] bg-white dark:bg-[#151c28] p-6 sm:p-8 border border-[#e6e6e6] dark:border-white/10 shadow-xs space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-3 py-0.5 text-[11px] font-semibold">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Roadmap 35 Hari Batch 4</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/15 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-500/30 px-2.5 py-0.5 text-[11px] font-semibold">
                  <span>Total 120 JP</span>
                </span>
                {summary.currentDayNumber === 0 ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Masa Persiapan • Hari 0 / {summary.totalDays} (0%)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Hari {summary.currentDayNumber} / {summary.totalDays} ({summary.progressPercentage}%)
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-tight">
                Alur 4 Tahapan Perkuliahan Batch 4
              </h3>
              <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8]">
                Alur perkuliahan dari belajar mandiri MOOC, tatap muka online TMO, lab kerja di satker, hingga seminar!
              </p>
            </div>

            <Link href="/batch-4/schedules">
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98] px-4.5 py-2 text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer shrink-0">
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
                dates: "Oktober 2026",
                status:
                  summary.currentDayNumber > 5
                    ? "Selesai"
                    : summary.isTodayActive && summary.currentDayNumber >= 1
                    ? "Sedang Berjalan"
                    : "Jadwal Mendatang",
                isCurrent:
                  summary.isTodayActive &&
                  summary.currentDayNumber >= 1 &&
                  summary.currentDayNumber <= 5,
                icon: <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />,
              },
              {
                num: 2,
                title: "Tahap 2 • TMO",
                sub: "Tatap Muka Online",
                days: "Hari 6 s.d. 15",
                dates: "Oktober – November 2026",
                status:
                  summary.currentDayNumber > 15
                    ? "Selesai"
                    : summary.isTodayActive && summary.currentDayNumber >= 6
                    ? "Sedang Berjalan"
                    : "Jadwal Mendatang",
                isCurrent:
                  summary.isTodayActive &&
                  summary.currentDayNumber >= 6 &&
                  summary.currentDayNumber <= 15,
                icon: <Laptop className="h-3.5 w-3.5" strokeWidth={2} />,
              },
              {
                num: 3,
                title: "Tahap 3 • Lab Prakom",
                sub: "Laboratorium di Satker",
                days: "Hari 16 s.d. 30",
                dates: "November 2026",
                status:
                  summary.currentDayNumber > 30
                    ? "Selesai"
                    : summary.isTodayActive && summary.currentDayNumber >= 16
                    ? "Sedang Berjalan"
                    : "Jadwal Mendatang",
                isCurrent:
                  summary.isTodayActive &&
                  summary.currentDayNumber >= 16 &&
                  summary.currentDayNumber <= 30,
                icon: <Building2 className="h-3.5 w-3.5" strokeWidth={2} />,
              },
              {
                num: 4,
                title: "Tahap 4 • Seminar",
                sub: "Seminar Klasikal",
                days: "Hari 31 s.d. 35",
                dates: "Desember 2026",
                status:
                  summary.currentDayNumber > 35
                    ? "Selesai"
                    : summary.isTodayActive && summary.currentDayNumber >= 31
                    ? "Sedang Berjalan"
                    : "Jadwal Mendatang",
                isCurrent:
                  summary.isTodayActive &&
                  summary.currentDayNumber >= 31 &&
                  summary.currentDayNumber <= 35,
                icon: <Award className="h-3.5 w-3.5" strokeWidth={2} />,
              },
            ].map((stg) => {
              return (
                <Link href="/batch-4/schedules" key={stg.num} className="group block">
                  <div
                    className={`h-full rounded-[14px] border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
                      stg.isCurrent
                        ? "bg-white dark:bg-[#141b27] border-emerald-600 shadow-xs ring-2 ring-emerald-600/30"
                        : "bg-white dark:bg-[#141b27] border-[#e6e6e6] dark:border-white/10 shadow-2xs hover:border-emerald-500/60 dark:hover:border-emerald-400/60"
                    }`}
                  >
                    {/* Stage Header Tab */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f6f5f4] dark:bg-[#1a2332] border-b border-[#e6e6e6] dark:border-white/10">
                      <span className="text-xs font-semibold text-[#000000] dark:text-white flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                          {stg.icon}
                        </span>
                        {stg.title}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#615d59] dark:text-[#94a3b8]">
                        0{stg.num}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs shrink-0 ${
                            stg.isCurrent
                              ? "bg-emerald-600 text-white border-transparent"
                              : "bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border-[#e6e6e6] dark:border-white/10"
                          }`}
                        >
                          {stg.isCurrent && (
                            <span className="relative flex h-2 w-2 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                          )}
                          {stg.status}
                        </span>
                        <span className="font-mono text-xs font-medium text-[#615d59] dark:text-[#94a3b8] shrink-0">
                          {stg.days}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {stg.sub}
                        </h4>
                        <p className="text-xs text-[#615d59] dark:text-[#94a3b8] mt-0.5">
                          {stg.dates}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#e6e6e6] dark:border-white/10 flex items-center justify-between text-xs font-medium text-[#615d59] dark:text-[#94a3b8] group-hover:text-[#000000] dark:group-hover:text-white transition-colors">
                        <span>Rincian Modul</span>
                        <ChevronRight
                          className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform"
                          strokeWidth={2}
                        />
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
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Eksplorasi Fitur
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-tight mt-0.5">
              Pusat Pembelajaran & Alat Kerja Batch 4
            </h3>
            <p className="text-xs sm:text-sm text-[#615d59] dark:text-[#94a3b8]">
              Akses cepat seluruh materi 120 JP, jadwal live, bank kuis MOOC, snippet praktikum, dan generator AI makalah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Roadmap */}
            <Link href="/batch-4/schedules" className="group block">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <Calendar className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    35 HARI
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Jadwal & Roadmap Sesi
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Cek rundown harian, pembagian jam JP, dan tautan sesi Zoom perkuliahan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Materi */}
            <Link href="/batch-4/materials" className="group block">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <FileText className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    120 JP PDF
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Pustaka Modul PDF
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Unduh modul resmi & baca langsung via reader interaktif dengan catatan belajar.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Tugas */}
            <Link href="/batch-4/tasks" className="group block">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <BookOpen className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    DEADLINE
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Tugas & Lembar Kerja
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Pantau tugas individu, checklist lembar kerja, dan panduan upload portal LMS.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Kuis MOOC */}
            <Link href="/batch-4/quiz" className="group block">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    SIMULASI
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Simulasi Kuis MOOC
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Kuis interaktif pilihan ganda seputar SPBE, Database & Angka Kredit dengan skor instan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 5: Snippets */}
            <Link href="/batch-4/snippets" className="group block">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <Code2 className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    LAB PRAKOM
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Code & Query Vault
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Koleksi template SQL query, backup automation Linux, dan script konfigurasi server.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 6: AI Makalah */}
            <Link href="/batch-4/paper-generator" className="group block">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <GraduationCap className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold transition-colors">
                    AI GENERATOR
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    AI Makalah Inovasi
                  </h4>
                  <p className="text-xs text-[#615d59] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Generator proposal 5 Bab otomatis untuk seminar laboratorium satker.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 7: FAQ Sunset Section */}
            <Link href="/batch-4/faq" className="group block sm:col-span-2 lg:col-span-3">
              <div className="h-full rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row items-center justify-between p-5 gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] text-emerald-600 dark:text-emerald-400">
                    <HelpCircle className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-semibold">
                        Pusat Bantuan
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                        • Respon Cepat Admin Kelas
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[#000000] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      Tanya Jawab (FAQ) & Formulir Aduan Kendala
                    </h4>
                    <p className="text-xs text-[#615d59] dark:text-[#94a3b8]">
                      Panduan lengkap kendala jadwal, sinkronisasi materi LMS, dan kontak langsung ke admin kelas.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4.5 py-2 text-xs font-semibold shrink-0 transition shadow-xs">
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
