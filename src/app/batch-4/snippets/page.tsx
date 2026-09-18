import { PublicShell } from "@/components/public/public-shell"
import { CodeVault } from "@/components/public/code-vault"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Code & Query Snippet Vault — Lab Prakom Batch 4",
  description: "Kumpulan template SQL query, script automasi server Linux, konfigurasi Docker, dan API SPBE untuk penugasan satker peserta Batch 4",
}

export default function Batch4SnippetsPage() {
  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Switcher notice */}
        <div className="rounded-[16px] bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black shrink-0">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                Code & Query Snippet Vault: Agrasena Batch 4.
              </span>{" "}
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                Koleksi skrip SQL, automasi Linux, dan utilitas penugasan praktikum laboratorium.
              </span>
            </div>
          </div>
          <Link
            href="/snippets?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Snippet Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <CodeVault />
      </div>
    </PublicShell>
  )
}
