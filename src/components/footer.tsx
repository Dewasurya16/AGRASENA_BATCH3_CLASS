import Link from 'next/link'
import { GraduationCap, Shield, Terminal } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080e]/90 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white">Web Kelas</span>
            </div>
            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
              Fondasi arsitektur website modern berbasis Next.js 15 App Router dan Supabase SSR.
              Siap dikembangkan untuk kebutuhan platform kelas, absensi, tugas, dan manajemen pembelajaran.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Teknologi</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Next.js 15 (App Router)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Supabase (@supabase/ssr)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                TypeScript
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Navigasi</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">Beranda</Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition">Masuk Akun</Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition">Pendaftaran</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Diklat Fungsional Prakom Batch 3 Kejaksaan RI • Dibuat dengan senang hati oleh <span className="text-slate-300 font-semibold">Dewa Sinar Surya, S.Kom.</span></p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              Auth & RLS Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              Server Actions Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
