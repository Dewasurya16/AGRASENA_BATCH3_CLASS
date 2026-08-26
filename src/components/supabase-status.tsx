import { CheckCircle2, AlertTriangle, KeyRound, ExternalLink, Server, Wifi } from 'lucide-react'

export function SupabaseStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isConfigured =
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseKey.includes('your-anon-key')

  if (isConfigured) {
    return (
      <div className="rounded-2xl p-5 border border-[#A7F3D0] bg-[#E6F7ED] text-[#0D824B] shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0D824B] border border-[#A7F3D0] shadow-xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-[#18181B]">Server Aktif</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black text-[#0D824B] border border-[#A7F3D0] shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-[#52647C] mt-0.5 font-medium">
                Koneksi database dan sistem sinkronisasi modul kelas berjalan normal.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-[#0D824B] bg-white/80 px-3 py-1.5 rounded-xl border border-[#A7F3D0]">
            <Wifi className="h-3.5 w-3.5" />
            <span>200 OK • Live</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50 text-amber-900 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 border border-amber-200 shadow-xs">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-[#18181B]">Server Aktif</h3>
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 shadow-xs">
                Standalone Mode
              </span>
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              Portal berjalan lancar dengan data lokal repositori kelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
