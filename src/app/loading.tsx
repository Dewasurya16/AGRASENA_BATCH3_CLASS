import { Spinner } from "@/components/ui/spinner"

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/70 dark:bg-[#161B26]/70 backdrop-blur-xl border border-slate-200/80 dark:border-[#2A3550] shadow-2xl shadow-emerald-950/10 max-w-sm w-full transition-all">
        
        {/* Ambient background aura glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-indigo-500/10 blur-xl pointer-events-none" />

        {/* Center Logo with Orbiting Spinner */}
        <div className="relative flex items-center justify-center h-16 w-16">
          <Spinner size="2xl" variant="emerald" thickness="thin" className="absolute inset-0" />
          <div className="h-10 w-10 rounded-xl overflow-hidden p-0.5 bg-white/90 dark:bg-[#1B2130] shadow-md z-10 flex items-center justify-center">
            <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-1 z-10">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Memuat Halaman Kelas...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Diklat Fungsional Pranata Komputer Batch 3
          </p>
        </div>

        {/* Micro progress line */}
        <div className="w-full h-1 bg-slate-100 dark:bg-[#202738] rounded-full overflow-hidden z-10">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 w-1/2 rounded-full animate-[shimmer_1.5s_infinite_linear]" />
        </div>
      </div>
    </div>
  )
}
