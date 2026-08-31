import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { BellRing, Pin, Calendar, User, Search, Sparkles } from "lucide-react"

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
      <div className="space-y-6">
        <div className="rounded-[14px] bg-white dark:bg-[#1B2130] p-6 border border-slate-200 dark:border-[#2A3550] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEAE9] dark:bg-rose-950/80 text-[#E11D48] dark:text-rose-300">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#131E29] dark:text-white">
                Papan Pengumuman Kelas
              </h2>
              <p className="text-xs text-[#6B7C93] dark:text-slate-400">
                Informasi resmi, edaran, dan broadcast mendesak seputar kegiatan kelas
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3.5 py-1 text-xs font-bold text-[#EA580C] dark:text-amber-300 self-start sm:self-auto">
            {displayAnnouncements.length} Pengumuman Live
          </span>
        </div>

        {displayAnnouncements.length === 0 ? (
          <div className="rounded-[14px] bg-white dark:bg-[#1B2130] p-12 text-center border border-dashed border-slate-200 dark:border-[#2A3550] space-y-3">
            <Sparkles className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="font-bold text-base text-[#18181B] dark:text-white">Belum Ada Pengumuman Aktif</h4>
            <p className="text-xs text-[#6B7C93] dark:text-slate-400 max-w-md mx-auto">
              Saat ini belum ada siaran informasi atau edaran dari pengurus diklat.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayAnnouncements.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] bg-white dark:bg-[#161B26] p-6 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {item.is_urgent && (
                      <span className="flex items-center gap-1 rounded-full bg-[#FFEAE9] dark:bg-rose-950/80 px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48] dark:text-rose-300 border border-[#FFCDCA] dark:border-rose-800">
                        <Pin className="h-3 w-3" />
                        Mendesak
                      </span>
                    )}
                    <h4 className="font-bold text-base text-[#131E29] dark:text-white">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8C9BAE] dark:text-slate-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0D3830] dark:text-emerald-400">
                  <User className="h-3.5 w-3.5" />
                  <span>Oleh: {item.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  )
}
