'use client'

import * as React from "react"
import Link from "next/link"
import { KeyRound, LogIn, Home, ArrowLeft, ShieldCheck } from "lucide-react"

export function UnauthorizedView() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F4F6FA] dark:bg-[#10141C] text-[#131E29] dark:text-[#D8E0EC] selection:bg-[#0D3830] selection:text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-violet-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-xl text-center space-y-6 sm:space-y-8 my-8">
        {/* Icon & Code Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative inline-flex items-center justify-center">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-indigo-700 via-blue-600 to-slate-400 dark:from-indigo-400 dark:via-blue-400 dark:to-slate-600 bg-clip-text text-transparent select-none drop-shadow-sm">
              401
            </span>
            <div className="absolute -top-3 -right-6 sm:-right-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 px-3 py-1 text-xs font-black text-indigo-700 dark:text-indigo-300 shadow-xs">
                <KeyRound className="h-3.5 w-3.5" />
                Perlu Login
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Belum Terautentikasi (Unauthorized)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sesi login Anda telah kedaluwarsa atau Anda belum masuk dengan kredensial yang sah untuk mengakses fitur ini.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl bg-white dark:bg-[#161B26] p-5 border border-slate-200 dark:border-slate-800/90 text-left space-y-2.5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                Panduan Autentikasi
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Untuk menjaga keamanan data kelas, silakan masuk kembali menggunakan akun administrator resmi Kejaksaan RI.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk ke Akun Admin</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Autentikasi Terenkripsi Supabase Auth • Diklat Prakom Batch 3 Kejaksaan RI
        </p>
      </div>
    </div>
  )
}
