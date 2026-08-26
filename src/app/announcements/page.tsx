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

  return (
    <PublicShell>
      <div className="space-y-6">
        <div className="rounded-[32px] bg-white p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEAE9] text-[#E11D48]">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#131E29]">
                Papan Pengumuman Kelas
              </h2>
              <p className="text-xs text-[#6B7C93]">
                Informasi resmi, edaran, dan broadcast mendesak seputar kegiatan kelas
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#FFEADA] px-3.5 py-1 text-xs font-bold text-[#EA580C] self-start sm:self-auto">
            {announcements.length} Pengumuman Live
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="rounded-[32px] bg-white p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
            <Sparkles className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-base text-[#18181B]">Belum Ada Pengumuman Aktif</h4>
            <p className="text-xs text-[#6B7C93] max-w-md mx-auto">
              Saat ini belum ada siaran informasi atau edaran dari pengurus diklat.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] bg-white p-6 border border-slate-200 space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {item.is_urgent && (
                      <span className="flex items-center gap-1 rounded-full bg-[#FFEAE9] px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48] border border-[#FFCDCA]">
                        <Pin className="h-3 w-3" />
                        Mendesak
                      </span>
                    )}
                    <h4 className="font-bold text-base text-[#131E29]">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8C9BAE] font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#52647C] leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0D3830]">
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
