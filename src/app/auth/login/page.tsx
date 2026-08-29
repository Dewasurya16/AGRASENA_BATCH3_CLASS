'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/auth/actions'
import { LogIn, Lock, Mail, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const [error, setError] = useState<string | null>(urlError)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await login(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-indigo-950/30">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3 shadow-lg shadow-indigo-500/10">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Selamat Datang Kembali</h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Masuk ke akun Web Kelas Anda untuk mengakses dashboard
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
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
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Masuk ke Akun</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
        Belum memiliki akun?{' '}
        <Link href="/auth/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition">
          Daftar sekarang
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Suspense fallback={
          <div className="glass-panel rounded-3xl p-8 text-center text-slate-400 flex items-center justify-center gap-2">
            <Spinner size="sm" variant="indigo" />
            <span>Memuat formulir masuk...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
