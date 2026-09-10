'use client'

import * as React from "react"
import Link from "next/link"
import { ShieldAlert, Lock, Home, ArrowLeft, LogIn, UserCheck, HelpCircle } from "lucide-react"

export function ForbiddenView() {
  const handleOpenProfile = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("prakom-open-intro"))
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F4F6FA] dark:bg-[#10141C] text-[#131E29] dark:text-[#D8E0EC] selection:bg-[#0D3830] selection:text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-orange-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-xl text-center space-y-6 sm:space-y-8 my-8">
        {/* Icon & Code Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative inline-flex items-center justify-center">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-amber-700 via-rose-600 to-slate-400 dark:from-amber-400 dark:via-rose-400 dark:to-slate-600 bg-clip-text text-transparent select-none drop-shadow-sm">
              403
            </span>
            <div className="absolute -top-3 -right-6 sm:-right-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-3 py-1 text-xs font-black text-amber-700 dark:text-amber-300 shadow-xs">
                <Lock className="h-3.5 w-3.5" />
                Akses Dibatasi
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Akses Ditolak (Forbidden)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Halaman atau tindakan ini memerlukan hak akses khusus administrator atau verifikasi identitas resmi peserta Diklat Prakom.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl bg-white dark:bg-[#161B26] p-5 border border-slate-200 dark:border-slate-800/90 text-left space-y-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                Mengapa Anda Melihat Halaman Ini?
              </h2>
              <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>Sesi login administrator Anda telah berakhir atau belum aktif.</li>
                <li>Halaman dashboard ini hanya diperuntukkan bagi pengurus diklat.</li>
                <li>Data diri peserta belum tersimpan atau belum terverifikasi.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D3830] hover:bg-[#082620] text-white px-5 py-2.5 text-xs font-bold transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Login Administrator</span>
          </Link>

          <button
            onClick={handleOpenProfile}
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold transition shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <UserCheck className="h-4 w-4 text-emerald-500" />
            <span>Cek Data Diri</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Sistem Keamanan & Otorisasi Portal Diklat Fungsional Pranata Komputer Kejaksaan RI
        </p>
      </div>
    </div>
  )
}
