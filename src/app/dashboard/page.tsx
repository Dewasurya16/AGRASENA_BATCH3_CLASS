import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  CalendarCheck,
  BookOpen,
  Bell,
  Plus,
  ArrowRight,
  Sparkles,
  Database,
  Calendar,
  Layers,
  GraduationCap,
  Building2,
  FileSpreadsheet
} from "lucide-react"

export default async function DashboardPage() {
  let user = null
  let isConfigured = false

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    isConfigured = true
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {
      // Offline fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-r from-indigo-950/60 via-[#0a0f24] to-[#070a14] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute right-[-10%] top-[-20%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge eyebrow variant="purple" dot>
              Diklat Fungsional Pranata Komputer Kejaksaan RI • Batch 3 (Agrasena)
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Portal Operasional <span className="text-gradient">Web Kelas</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pusat monitoring presensi perkuliahan daring Zoom, koordinasi 4 kelompok belajar regional, dan evaluasi capaian kurikulum 120 JP terpadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/attendance">
              <Button variant="primary" size="md" icon={<CalendarCheck className="h-4 w-4" />}>
                Presensi Sesi Zoom
              </Button>
            </Link>
            <Link href="/dashboard/classes">
              <Button variant="secondary" size="md" trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Kelompok Regional
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Kelompok Belajar"
          value="4 Regional"
          subtitle="Satker se-Indonesia"
          trend={{ value: "Tahap 2 • TMO", isPositive: true }}
          icon={<Building2 className="h-5 w-5" />}
          variant="forest"
        />
        <StatsCard
          title="Rekan Prakom"
          value="151 Peserta"
          subtitle="Terverifikasi Diklat"
          trend={{ value: "100% Aktif", isPositive: true }}
          icon={<Users className="h-5 w-5" />}
          variant="cyan"
        />
        <StatsCard
          title="Kehadiran Sesi"
          value="98.2%"
          subtitle="Rata-rata Presensi Zoom"
          trend={{ value: "Disiplin Tinggi", isPositive: true }}
          icon={<CalendarCheck className="h-5 w-5" />}
          variant="emerald"
        />
        <StatsCard
          title="Pustaka Bahan Ajar"
          value="24 Modul"
          subtitle="Kurikulum 120 JP"
          trend={{ value: "Lengkap & Update", isPositive: true }}
          icon={<BookOpen className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      {/* Main Grid: Cohort Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Active Groups */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kelompok Belajar & Satker Regional</CardTitle>
                <CardDescription>
                  Distribusi peserta diklat untuk koordinasi praktikum dan sesi diskusi
                </CardDescription>
              </div>
              <Link href="/dashboard/classes">
                <Button variant="outline" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                  Tambah Kelompok
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Kelompok 1 — Kejaksaan Agung & Badan Diklat",
                    code: "AGR-P01",
                    members: 35,
                    focus: "SPBE Pusat & CSIRT Siber",
                    stage: "Tahap 2 • TMO",
                  },
                  {
                    name: "Kelompok 2 — Wilayah Kejati Jawa, Bali & NTB/NTT",
                    code: "AGR-P02",
                    members: 42,
                    focus: "Infrastruktur Server Linux & Database",
                    stage: "Tahap 2 • TMO",
                  },
                  {
                    name: "Kelompok 3 — Wilayah Kejati se-Sumatera",
                    code: "AGR-P03",
                    members: 36,
                    focus: "Jaringan Intra-Pemerintah & DUPAK BPS",
                    stage: "Tahap 2 • TMO",
                  },
                  {
                    name: "Kelompok 4 — Kalimantan, Sulawesi, Maluku & Papua",
                    code: "AGR-P04",
                    members: 38,
                    focus: "Bandwidth Daerah & Cloud Backup Satker",
                    stage: "Tahap 2 • TMO",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/[0.05] bg-[#0c101d]/60 p-4 transition hover:border-indigo-500/30 hover:bg-[#0c101d]/90 gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-semibold text-sm text-slate-100">{item.name}</h4>
                        <Badge variant="purple" dot>
                          {item.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">Fokus: {item.focus}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-300">{item.members} Peserta</span>
                      <Link href={`/dashboard/classes`}>
                        <Button variant="secondary" size="sm">
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Quick Modules & Database Status */}
        <div className="space-y-6">
          {/* Quick Action Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat Pengurus</CardTitle>
              <CardDescription>Pintas administrasi dan operasional diklat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href="/dashboard/attendance" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:bg-white/[0.06] transition group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                      <CalendarCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Presensi Sesi Zoom</p>
                      <p className="text-[10px] text-slate-400">Input & Export CSV hadir</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>

              <Link href="/dashboard/schedule" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:bg-white/[0.06] transition group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Rundown Sesi Perkuliahan</p>
                      <p className="text-[10px] text-slate-400">Jadwal harian & link Zoom</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>

              <Link href="/schedules" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:bg-white/[0.06] transition group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Roadmap 35 Hari Lengkap</p>
                      <p className="text-[10px] text-slate-400">Alur 4 tahapan diklat</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Database Integration Box */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2.5 pb-2">
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm">Status Supabase SSR</CardTitle>
                <CardDescription>Koneksi database & Auth RLS</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Status Database:</span>
                <Badge variant={isConfigured ? "success" : "warning"} dot>
                  {isConfigured ? "Terkoneksi" : "Siap Terhubung"}
                </Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Row Level Security:</span>
                <span className="text-emerald-400 font-medium">Aktif</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Tipe Autentikasi:</span>
                <span className="font-mono text-indigo-300">Cookie SSR / HMAC</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
