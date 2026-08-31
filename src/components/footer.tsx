import Link from 'next/link'
import { GraduationCap, Shield, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 bg-[#f6f5f4] dark:bg-[#191919] text-[#31302e] dark:text-[#e0e0e0] border-t border-[#e6e6e6] dark:border-[#333333] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          
          {/* Brand Col: 2 Cols */}
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#333333] text-[#0075de]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#000000] dark:text-white">
                Prakom Batch 3
              </span>
            </div>
            <p className="max-w-sm text-xs sm:text-sm text-[#615d59] dark:text-[#9e9e9e] font-normal leading-relaxed">
              Pusat pembelajaran terpadu & repositori materi 120 JP Diklat Fungsional Pranata Komputer Keahlian. Pusdiklat Manajemen & Kepemimpinan Badan Diklat Kejaksaan RI.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center rounded-full bg-[#0075de] px-2.5 py-0.5 text-xs font-semibold text-white">
                120 JP Kurikulum
              </span>
              <span className="inline-flex items-center rounded-full bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#333333] px-2.5 py-0.5 text-xs font-semibold text-[#615d59] dark:text-[#a39e98]">
                35 Hari Roadmap
              </span>
            </div>
          </div>

          {/* Col 1: Kurikulum */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#000000] dark:text-white">
              Kurikulum
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#615d59] dark:text-[#9e9e9e]">
              <li>
                <Link href="/schedules" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Roadmap 35 Hari</Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Pustaka Modul PDF</Link>
              </li>
              <li>
                <Link href="/tasks" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Lembar Tugas Harian</Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Simulasi Kuis MOOC</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Alat & Lab */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#000000] dark:text-white">
              Alat & Generator
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#615d59] dark:text-[#9e9e9e]">
              <li>
                <Link href="/paper-generator" className="hover:text-[#000000] dark:hover:text-white transition font-normal">AI Makalah Inovasi</Link>
              </li>
              <li>
                <Link href="/snippets" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Gudang Kode Prakom</Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Template DUPAK & SPT</Link>
              </li>
              <li>
                <Link href="/exam-prep" className="hover:text-[#000000] dark:hover:text-white transition font-normal">10 Checklist Ujian</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Komunitas */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#000000] dark:text-white">
              Komunitas
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#615d59] dark:text-[#9e9e9e]">
              <li>
                <Link href="/discussions" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Forum Diskusi Angkatan</Link>
              </li>
              <li>
                <Link href="/showcase" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Laboratorium Satker</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#000000] dark:hover:text-white transition font-normal">Pusat Bantuan FAQ</Link>
              </li>
              <li>
                <a href="https://pengembangan.kejaksaan.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#000000] dark:hover:text-white transition font-normal">
                  Portal LMS Kejaksaan ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  )
}
