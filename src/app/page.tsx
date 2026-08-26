import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { UrgentAnnouncement } from "@/components/public/urgent-announcement"
import { IntroScreen } from "@/components/public/intro-screen"
import { TwinkleHero } from "@/components/public/twinkle-hero"
import { AiCompanionCard } from "@/components/public/ai-companion-card"
import { HeroCountdown } from "@/components/public/hero-countdown"
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
  ChevronRight
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let announcements: any[] = []
  let tasks: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const [annRes, taskRes] = await Promise.all([
        supabase.from("announcements").select("*").eq("is_active", true),
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
      ])
      announcements = annRes.data || []
      tasks = taskRes.data || []
    } catch {
      // Offline fallback
    }
  }

  const closestTask = tasks.find((t) => t.status !== "completed")
  const { summary } = getAutoRoadmapData(3)

  return (
    <PublicShell>
      {/* 1. Layar Intro Interaktif (Tampil 1x Saat Kunjungan Awal Sesi, Hilang Setelah Masuk) */}
      <IntroScreen />

      <div className="space-y-8">
        
        {/* 2. Pengumuman Mendesak (Jika Ada) */}
        <UrgentAnnouncement announcements={announcements} />

        {/* 3. Hero Banner Gaya eTwinkle (Playful Neo-Minimalist) */}
        <TwinkleHero />

        {/* 4. AI Asisten Kelas (Sapaan Santai, Motivasi Harian & Peringatan Tugas) */}
        <AiCompanionCard />

        {/* 5. Live Countdown Deadline Terdekat */}
        <HeroCountdown targetTask={closestTask} />

        {/* 6. Roadmap 4 Tahap Summary (Progress Otomatis Berdasarkan Hari) */}
        <section className="rounded-[36px] bg-white p-6 sm:p-8 lg:p-10 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#18181B] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  Roadmap 35 Hari
                </span>
                <span className="rounded-full bg-[#FFEADA] px-3 py-0.5 text-[10px] font-black uppercase text-[#EA580C]">
                  Total 120 JP
                </span>
                <span className="text-xs font-black text-[#0D824B]">
                  Progres: Hari {summary.currentDayNumber} / {summary.totalDays} ({summary.progressPercentage}%)
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Alur 4 Tahapan Perkuliahan Diklat
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7C93]">
                Alur santai dari belajar mandiri MOOC, tatap muka online TMO, lab kerja, sampai seminar!
              </p>
            </div>

            <Link href="/schedules">
              <button className="flex items-center gap-2 rounded-full bg-[#18181B] px-5 py-2.5 text-xs font-black text-white hover:bg-[#27272A] hover:scale-102 transition-all shadow-sm cursor-pointer shrink-0">
                <span>Buka Jadwal 35 Hari Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#FFD280]" />
              </button>
            </Link>
          </div>

          {/* 4 Stage Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              {
                num: 1,
                title: "Tahap 1 • MOOC",
                sub: "Pembelajaran Mandiri",
                days: "Hari 1 s.d. 5",
                dates: "24 Agu – 28 Agu 2026",
                status: "Sedang Berjalan",
                isCurrent: true,
                headerColor: "bg-[#FFEADA] text-[#EA580C]",
              },
              {
                num: 2,
                title: "Tahap 2 • TMO",
                sub: "Tatap Muka Online",
                days: "Hari 6 s.d. 15",
                dates: "31 Agu – 11 Sep 2026",
                status: "Jadwal Mendatang",
                isCurrent: false,
                headerColor: "bg-[#D7F3FE] text-[#0369A1]",
              },
              {
                num: 3,
                title: "Tahap 3 • Lab Prakom",
                sub: "Laboratorium di Satker",
                days: "Hari 16 s.d. 30",
                dates: "14 Sep – 2 Okt 2026",
                status: "Jadwal Mendatang",
                isCurrent: false,
                headerColor: "bg-[#FFE3EB] text-[#E11D48]",
              },
              {
                num: 4,
                title: "Tahap 4 • Seminar",
                sub: "Seminar Klasikal",
                days: "Hari 31 s.d. 35",
                dates: "5 Okt – 9 Okt 2026",
                status: "Jadwal Mendatang",
                isCurrent: false,
                headerColor: "bg-[#FFF2D1] text-[#B47D00]",
              },
            ].map((stg) => (
              <Link href="/schedules" key={stg.num} className="group block">
                <div
                  className={`h-full rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
                    stg.isCurrent
                      ? "bg-[#FFF9F5] border-[#FF7643] ring-4 ring-[#FF7643]/15 shadow-md"
                      : "bg-white border-slate-200 shadow-xs hover:border-[#18181B] hover:shadow-md"
                  }`}
                >
                  {/* _oX Window Header */}
                  <div className={`flex items-center justify-between px-3.5 py-2 border-b-2 border-slate-200 ${stg.headerColor}`}>
                    <span className="text-[11px] font-black">{stg.title}</span>
                    <span className="font-mono text-xs font-black text-slate-700">_oX</span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        stg.isCurrent ? "bg-[#FFEADA] text-[#EA580C]" : "bg-slate-100 text-slate-600"
                      }`}>
                        {stg.status}
                      </span>
                      <span className="font-mono text-xs font-black text-[#18181B]">{stg.days}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-[#18181B] group-hover:text-[#FF7643] transition">
                        {stg.sub}
                      </h4>
                      <p className="text-[11px] text-[#6B7C93] mt-0.5">
                        {stg.dates}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#8C9BAE] group-hover:text-[#18181B] transition">
                      <span>Rincian Modul</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. 4 Modul Navigasi Utama (_oX Browser Window Frames) */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#18181B]">
              Eksplor Modul & Bahan Ajar
            </h3>
            <p className="text-xs text-[#6B7C93]">
              Pilih menu di bawah buat cek materi, kumpulin tugas, atau baca broadcast kelas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Roadmap */}
            <Link href="/schedules" className="group block">
              <div className="h-full rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#18181B] group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#D7F3FE] border-b-2 border-slate-200">
                  <span className="text-[10px] font-black text-[#0369A1]">Roadmap 35 Hari</span>
                  <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <Calendar className="h-6 w-6 text-[#0369A1]" />
                  <h4 className="font-black text-base text-[#18181B] group-hover:text-[#0369A1] transition">
                    Jadwal & Agenda Sesi
                  </h4>
                  <p className="text-xs text-[#6B7C93] line-clamp-2">
                    Cek jadwal per hari, pembagian waktu, dan tautan sesi Zoom perkuliahan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Materi */}
            <Link href="/materials" className="group block">
              <div className="h-full rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#18181B] group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#E6F7ED] border-b-2 border-slate-200">
                  <span className="text-[10px] font-black text-[#0D824B]">Modul 120 JP</span>
                  <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <FileText className="h-6 w-6 text-[#0D824B]" />
                  <h4 className="font-black text-base text-[#18181B] group-hover:text-[#0D824B] transition">
                    Pustaka Modul PDF
                  </h4>
                  <p className="text-xs text-[#6B7C93] line-clamp-2">
                    Download modul resmi Agrasena (Prakom 625) & baca langsung via modal preview.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Tugas */}
            <Link href="/tasks" className="group block">
              <div className="h-full rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#18181B] group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFE3EB] border-b-2 border-slate-200">
                  <span className="text-[10px] font-black text-[#E11D48]">Tugas & Praktik</span>
                  <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <BookOpen className="h-6 w-6 text-[#E11D48]" />
                  <h4 className="font-black text-base text-[#18181B] group-hover:text-[#E11D48] transition">
                    Tugas & Deadline
                  </h4>
                  <p className="text-xs text-[#6B7C93] line-clamp-2">
                    Pantau batas waktu tugas mandiri dan link kirim ke portal LMS Kejaksaan.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Pengumuman */}
            <Link href="/announcements" className="group block">
              <div className="h-full rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#18181B] group-hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFF2D1] border-b-2 border-slate-200">
                  <span className="text-[10px] font-black text-[#B47D00]">Broadcast Info</span>
                  <span className="font-mono text-[10px] font-black text-slate-700">_oX</span>
                </div>
                <div className="p-4 space-y-2">
                  <BellRing className="h-6 w-6 text-[#B47D00]" />
                  <h4 className="font-black text-base text-[#18181B] group-hover:text-[#B47D00] transition">
                    Pengumuman Diklat
                  </h4>
                  <p className="text-xs text-[#6B7C93] line-clamp-2">
                    Edaran penting panitia diklat, info link Zoom baru, dan berita kelas.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 8. Supabase Status Footer */}
        <div className="pt-2">
          <SupabaseStatus />
        </div>

      </div>
    </PublicShell>
  )
}
