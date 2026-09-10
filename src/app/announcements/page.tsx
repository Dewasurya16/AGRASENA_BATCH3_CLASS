import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { AnnouncementsList } from "@/components/public/announcements-list"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AnnouncementsPage() {
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

      announcements = data || []
    } catch {
      // Fallback
    }
  }

  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: "ann-update-v24",
      title: "🚀 Pembaruan Sistem: Akses Zoom Angkatan 1–6, PWA Mobile, Ekspor Proposal Word, & Kalkulator DUPAK Telah Aktif!",
      content: "Yth. Bapak/Ibu Rekan Peserta Diklat Fungsional Pranata Komputer Batch 3,\n\nWeb portal kelas telah diperbarui ke versi terbaru dengan fitur-fitur baru:\n\n1. 🎥 Akses Terpadu Zoom Meeting Angkatan 1 s.d. 6 (Passcode: Biropeg-24) pada halaman Jadwal / Roadmap.\n2. 📱 Akses PWA Mobile: Dapat diinstal langsung di layar utama smartphone / laptop (Add to Home Screen).\n3. 📄 Ekspor AI Makalah Seminar ke Microsoft Word (.docx) siap edit dengan format penulisan dinas (5 Bab Lengkap & Margin 4-4-3-3).\n4. 📊 Modul Katalog Butir DUPAK & Estimator Angka Kredit (PermenPAN-RB 32/2020 & Perka BPS 2/2021).\n5. 📈 Pelacak Belajar Mandiri (My Learning Progress) & 10 Checklist Kelulusan Seminar.\n6. ⚡ Universal Command Palette (Ctrl + K) untuk pencarian instan seluruh modul dan jadwal.\n\nSelamat belajar dan sukses selalu untuk rekan-rekan seangkatan!",
      is_urgent: true,
      author: "Pengurus Diklat & Tim Agrasena 625",
      created_at: new Date().toISOString()
    }
  ]

  const displayAnnouncements = announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS

  return (
    <PublicShell>
      <AnnouncementsList announcements={displayAnnouncements} />
    </PublicShell>
  )
}
