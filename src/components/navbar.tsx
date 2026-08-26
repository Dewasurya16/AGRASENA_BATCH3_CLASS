import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { GraduationCap, LayoutDashboard, LogIn, UserPlus, LogOut, Layers } from 'lucide-react'

export async function Navbar() {
  let user = null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {
      // Ignore if supabase cannot be reached during local offline bootstrap
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080b14]">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Web<span className="text-indigo-400">Kelas</span>
            </span>
            <span className="ml-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
              Next.js + Supabase
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="transition hover:text-white">
            Beranda
          </Link>
          <Link href="#features" className="transition hover:text-white">
            Fitur
          </Link>
          <Link href="#architecture" className="transition hover:text-white">
            Arsitektur
          </Link>
          <Link href="/dashboard" className="transition hover:text-white flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-400" />
            Dashboard
          </Link>
        </nav>

        {/* Right Auth actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
                <span>{user.email?.split('@')[0]}</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:text-white hover:bg-slate-800/60"
              >
                <LogIn className="h-3.5 w-3.5" />
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-500/40"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
