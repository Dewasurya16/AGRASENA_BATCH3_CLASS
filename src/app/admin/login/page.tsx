'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, ArrowLeft, KeyRound, Check, Loader2 } from "lucide-react"
import { adminLogin } from "../actions"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("admin@kejaksaan.go.id")
  const [password, setPassword] = React.useState("adminprakom625")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleQuickFill = () => {
    setEmail("admin@kejaksaan.go.id")
    setPassword("adminprakom625")
  }

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
    } catch (err: any) {
      // In case of error
      setError('Terjadi kendala saat masuk. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#FBFBFD] select-none">
      {/* Decorative Pastel Glows */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-[#FFE3EB]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#D7F3FE]/60 blur-3xl pointer-events-none" />

      {/* Main _oX Login Window Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-[32px] bg-white border-2 border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
      >
        {/* Top _oX Window Titlebar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#FFF2D1] border-b-2 border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#B47D00]">Portal Pengurus Diklat</span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-black text-[#855D00]">
              Prakom Batch 3
            </span>
          </div>
          <span className="font-mono text-xs font-black text-slate-700">_oX</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#18181B] text-white shadow-md mb-2">
              <GraduationCap className="h-7 w-7 text-[#FFD280]" />
            </div>
            <h2 className="text-2xl font-black text-[#18181B] tracking-tight">
              Masuk Akun Pengurus
            </h2>
            <p className="text-xs text-[#6B7C93]">
              Kelola materi PDF, jadwal 35 hari, tugas, dan pengumuman kelas.
            </p>
          </div>

          {/* Quick Preset Admin Card */}
          <div className="rounded-2xl bg-[#E6F7ED] p-3.5 border border-[#A7F3D0] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0D824B] flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5" />
                Akun Admin Resmi:
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] font-black text-[#0D824B] hover:underline cursor-pointer bg-white px-2.5 py-0.5 rounded-full border border-[#A7F3D0] shadow-2xs"
              >
                Gunakan Akun Ini
              </button>
            </div>
            <div className="text-xs font-mono text-[#18181B] space-y-0.5">
              <div>Email: <span className="font-bold text-[#0D824B]">admin@kejaksaan.go.id</span></div>
              <div>Password: <span className="font-bold text-[#0D824B]">adminprakom625</span></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-2xl bg-[#FFEAE9] p-3.5 text-xs font-bold text-[#E11D48] border border-[#FFCDCA]">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-[#18181B]">
                Email Pengurus / Admin
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE]" />
                <input
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kejaksaan.go.id"
                  className="h-11 w-full rounded-2xl border-2 border-slate-200 bg-white pl-10 pr-4 text-xs font-medium text-[#18181B] placeholder-[#9AA8BA] focus:border-[#18181B] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-[#18181B]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE]" />
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-2xl border-2 border-slate-200 bg-white pl-10 pr-4 text-xs font-medium text-[#18181B] placeholder-[#9AA8BA] focus:border-[#18181B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-[#18181B] py-3.5 text-xs sm:text-sm font-black text-white hover:bg-[#27272A] hover:scale-101 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#FFD280]" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Admin</span>
                  <ArrowRight className="h-4 w-4 text-[#FFD280]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Info & Back link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#6B7C93]">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-bold text-[#18181B] hover:text-[#FF7643] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            <span className="font-mono text-[11px] text-[#0D824B] font-bold">
              Status: Siap Digunakan
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
