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
  Wallet,
  GraduationCap
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
      {/* Welcome Banner with Nested Island CTA */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-r from-indigo-950/60 via-[#0a0f24] to-[#070a14] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute right-[-10%] top-[-20%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge eyebrow variant="purple" dot>
              Tahun Ajaran 2026/2027 • Semester Ganjil
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Selamat Datang di <span className="text-gradient">Web Kelas</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kelola absensi harian siswa, distribusi materi tugas, dan rekap keuangan kelas dalam satu platform terpadu berbasis cloud Supabase SSR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/classes">
              <Button
                variant="primary"
                size="md"
                trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Buka Kelas Saya
              </Button>
            </Link>
            <Link href="/dashboard/attendance">
              <Button variant="secondary" size="md" icon={<CalendarCheck className="h-4 w-4 text-emerald-400" />}>
                Catat Absen Hari Ini
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Kelas"
          value="4 Kelas"
          subtitle="Aktif diajar"
          trend={{ value: "+1 Kelas Baru", isPositive: true }}
          icon={<BookOpen className="h-5 w-5" />}
          variant="forest"
        />
        <StatsCard
          title="Total Siswa"
          value="128 Siswa"
          subtitle="Terdata di sistem"
          trend={{ value: "100% Terverifikasi", isPositive: true }}
          icon={<Users className="h-5 w-5" />}
          variant="cyan"
        />
        <StatsCard
          title="Kehadiran Hari Ini"
          value="96.8%"
          subtitle="124 Hadir • 4 Izin"
          trend={{ value: "Tinggi", isPositive: true }}
          icon={<CalendarCheck className="h-5 w-5" />}
          variant="emerald"
        />
        <StatsCard
          title="Kas Terkumpul"
          value="Rp 1.450.000"
          subtitle="Saldo kas kelas"
          trend={{ value: "Surplus", isPositive: true }}
          icon={<Wallet className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      {/* Main Grid: Class Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Active Classes */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daftar Kelas Aktif</CardTitle>
                <CardDescription>
                  Ruang kelas yang terhubung dengan modul absensi & tugas
                </CardDescription>
              </div>
              <Link href="/dashboard/classes">
                <Button variant="outline" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                  Tambah Kelas
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "X IPA 1 - Matematika Wajib",
                    code: "MTK-X1",
                    students: 32,
                    schedule: "Senin, 08:00 WIB",
                    badge: "Kelas Utama",
                  },
                  {
                    name: "XI IPA 2 - Fisika Dasar",
                    code: "FSK-XI2",
                    students: 30,
                    schedule: "Selasa, 10:00 WIB",
                    badge: "Laboratorium",
                  },
                  {
                    name: "XII IPS 1 - Ekonomi & Akuntansi",
                    code: "EKO-XII1",
                    students: 34,
                    schedule: "Rabu, 07:30 WIB",
                    badge: "Ujian Mendatang",
                  },
                  {
                    name: "X IPS 3 - Bahasa Inggris",
                    code: "ING-X3",
                    students: 32,
                    schedule: "Kamis, 09:30 WIB",
                    badge: "Reguler",
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
                      <p className="text-xs text-slate-400">Jadwal: {item.schedule}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{item.students} Siswa</span>
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
              <CardTitle>Aksi Cepat Guru</CardTitle>
              <CardDescription>Pintas fitur utama kegiatan kelas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href="/dashboard/attendance" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:bg-white/[0.06] transition group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                      <CalendarCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Input Absensi Harian</p>
                      <p className="text-[10px] text-slate-400">Rekap cepat daftar hadir</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>

              <Link href="/dashboard/assignments" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:bg-white/[0.06] transition group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Buat Tugas Baru</p>
                      <p className="text-[10px] text-slate-400">Tentukan tenggat & skor</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>

              <Link href="/dashboard/finances" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:bg-white/[0.06] transition group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Catat Uang Kas</p>
                      <p className="text-[10px] text-slate-400">Pemasukan & pengeluaran</p>
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
                <span className="text-slate-400">Status .env:</span>
                <Badge variant={isConfigured ? "success" : "warning"} dot>
                  {isConfigured ? "Terkoneksi" : "Placeholder"}
                </Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Row Level Security:</span>
                <span className="text-emerald-400 font-medium">Aktif</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Tipe Session:</span>
                <span className="font-mono text-indigo-300">Cookie SSR</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
