'use client'

import * as React from "react"
import { RotateCcw, AlertOctagon, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Critical Root Layout Error:", error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#10141C] text-white flex flex-col items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/80 text-rose-400 border border-rose-800 shadow-lg">
              <AlertOctagon className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Terjadi Kendala Sistem Kritis
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mohon maaf, sistem mengalami kendala fatal pada inisialisasi aplikasi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#161B26] border border-slate-800 text-left space-y-1 text-xs">
            <p className="font-bold text-slate-200">Pesan Kesalahan:</p>
            <p className="font-mono text-[11px] text-rose-400 break-all">
              {error.message || "Unknown root layout error"}
            </p>
            {error.digest && (
              <p className="text-[10px] text-slate-500 font-mono">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Muat Ulang Aplikasi</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Beranda</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-500">
            Diklat Fungsional Pranata Komputer • Kejaksaan RI
          </p>
        </div>
      </body>
    </html>
  )
}
