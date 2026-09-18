import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { AnnouncementsList } from "@/components/public/announcements-list"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Pengumuman Resmi Diklat Prakom Batch 4 | Kejaksaan RI",
  description: "Edaran resmi panitia, jadwal perkuliahan, dan informasi penting peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI 2026.",
}

export default async function Batch4AnnouncementsPage() {
  let announcements: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        announcements = data.filter((a: any) =>
          (a.title && a.title.toLowerCase().includes("batch 4")) ||
          (a.content && a.content.toLowerCase().includes("batch 4")) ||
          a.batch === 4 ||
          a.batch === "batch-4"
        )
      }
    } catch {
      // Fallback
    }
  }

  const DEFAULT_BATCH4_ANNOUNCEMENTS = [
    {
      id: "ann-b4-launch",
      title: "🚀 Portal Resmi Agrasena Batch 4 Telah Aktif!",
      content: "Yth. Bapak/Ibu Rekan Peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI,\n\nSelamat datang di portal perkuliahan kelas Agrasena Batch 4. Portal ini telah disiapkan untuk mendukung kelancaran pembelajaran Anda selama 35 hari:\n\n1. 📅 Kalender Roadmap 35 Hari & Jadwal Sesi Pembelajaran.\n2. 📚 Pustaka Modul Resmi Kurikulum 120 JP.\n3. 🎯 Latihan Kuis & Simulasi Ujian Mandiri MOOC.\n4. 🤖 Asisten AI Penyusunan Makalah & Laporan Laboratorium Satker.\n5. 📄 Format Dokumen, SPT, dan Matriks Butir DUPAK / Angka Kredit BPS.\n\nInformasi tautan virtual Zoom resmi akan diperbarui langsung oleh panitia admin kelas. Selamat mengikuti diklat dan sukses selalu!",
      is_urgent: true,
      author: "Panitia & Tim Pengelola Portal Batch 4",
      created_at: new Date().toISOString()
    }
  ]

  const displayAnnouncements = announcements.length > 0 ? announcements : DEFAULT_BATCH4_ANNOUNCEMENTS

  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Switcher notice */}
        <div className="rounded-[16px] bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black shrink-0">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                Papan Pengumuman: Agrasena Batch 4.
              </span>{" "}
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                Informasi edaran resmi, jadwal perkuliahan, dan agenda angkatan Batch 4.
              </span>
            </div>
          </div>
          <Link
            href="/announcements?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Pengumuman Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <AnnouncementsList announcements={displayAnnouncements} />
      </div>
    </PublicShell>
  )
}
