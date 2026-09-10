'use client'

import * as React from "react"
import Link from "next/link"
import {
  RotateCcw,
  Home,
  AlertTriangle,
  ServerCrash,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react"

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    // Log error details to console
    console.error("Application Runtime Error:", error)
  }, [error])

  const handleCopyError = () => {
    const errorText = `Error: ${error.message || "Unknown error"}\nDigest: ${error.digest || "N/A"}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F4F6FA] dark:bg-[#10141C] text-[#131E29] dark:text-[#D8E0EC] selection:bg-[#0D3830] selection:text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-gradient-to-tr from-rose-500/10 via-red-500/10 to-amber-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-xl text-center space-y-6 sm:space-y-8 my-8">
        {/* Icon & Code Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative inline-flex items-center justify-center">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-rose-700 via-red-600 to-slate-400 dark:from-rose-400 dark:via-red-400 dark:to-slate-600 bg-clip-text text-transparent select-none drop-shadow-sm">
              500
            </span>
            <div className="absolute -top-3 -right-6 sm:-right-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-3 py-1 text-xs font-black text-rose-700 dark:text-rose-300 shadow-xs">
                <ServerCrash className="h-3.5 w-3.5" />
                Server Error
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Terjadi Gangguan Server
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mohon maaf atas ketidaknyamanan ini. Sistem mengalami kendala tak terduga saat memproses data pada server.
            </p>
          </div>
        </div>

        {/* Error Details Pod */}
        <div className="rounded-2xl bg-white dark:bg-[#161B26] p-5 border border-slate-200 dark:border-slate-800/90 text-left space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                  Informasi Teknis Kendala
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {error.message || "An unexpected error occurred during execution."}
                </p>
                {error.digest && (
                  <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                    Digest ID: <span className="text-slate-600 dark:text-slate-300 font-semibold">{error.digest}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCopyError}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 shrink-0 bg-slate-100 dark:bg-[#253045] px-2.5 py-1 rounded-md transition cursor-pointer"
              title="Salin rincian error"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Tersalin" : "Salin"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 text-xs font-bold transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Coba Muat Ulang (Reload)</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D3830] hover:bg-[#082620] text-white px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <a
            href="https://wa.me/?text=Halo%20Admin%20Diklat%20Prakom,%20saya%20mengalami%20kendala%20di%20Web%20Kelas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>Laporkan ke Admin</span>
          </a>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Pusat Pemulihan Kesalahan • Diklat Fungsional Pranata Komputer Kejaksaan RI
        </p>
      </div>
    </div>
  )
}
