'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { GraduationCap, Lock, Mail, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react"
import { adminLogin } from "../actions"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await adminLogin(formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      } else if (res?.success) {
        window.location.href = '/admin/dashboard'
      }
    } catch {
      setError('Terjadi kendala saat masuk. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] dark:bg-[#0F141C] text-slate-900 dark:text-slate-100 select-none">
      {/* Decorative Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full max-w-md rounded-[14px] bg-white dark:bg-[#1B2130] border border-slate-200/90 dark:border-[#2A3550] shadow-xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-[#161B26] border-b border-slate-200/80 dark:border-[#2A3550]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Portal Admin Diklat
            </span>
          </div>
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            Batch 3
          </span>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-tr from-[#0F172A] to-[#1E293B] dark:from-[#1E2535] dark:to-[#2D3748] text-white shadow-md mb-1">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Autentikasi Pengurus
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Masuk untuk mengelola modul 120 JP, jadwal, tugas, dan aspirasi kelas.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-[10px] bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Pengurus
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kejaksaan.go.id"
                  className="h-10 w-full rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/50 dark:bg-[#141824] pl-10 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-[10px] border border-slate-200 dark:border-[#2A3550] bg-slate-50/50 dark:bg-[#141824] pl-10 pr-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-[#1B2130] focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full rounded-[10px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 py-2.5 text-xs font-black text-white transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Info & Back link */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#2A3550] flex items-center justify-between text-xs">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Ke Beranda</span>
            </Link>

            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ● Sistem Siap
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

