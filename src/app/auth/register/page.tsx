'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { UserPlus, Lock, Mail, User, AlertCircle, CheckCircle2, ArrowLeft, GraduationCap } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await signup(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else if (res?.success) {
      setSuccess(res.success)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0d14] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Register Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-indigo-950/30">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3 shadow-lg shadow-indigo-500/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Buat Akun Baru</h2>
            <p className="mt-1.5 text-xs text-slate-400">
              Daftar untuk mengakses seluruh fitur dan materi kelas
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Pratama"
                  className="glass-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="nama@sekolah.sch.id"
                  className="glass-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  className="glass-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-500/40 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner size="xs" variant="white" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Sekarang</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
