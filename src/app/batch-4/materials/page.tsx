import { PublicShell } from "@/components/public/public-shell"
import { ResourceHub } from "@/components/public/resource-hub"
import { DEFAULT_BATCH4_MATERIALS } from "@/data/batch4/materials-data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Pustaka Modul 120 JP Agrasena Batch 4 - Diklat Prakom Kejaksaan RI",
  description: "Pusat unduhan resmi modul PDF kurikulum 120 JP, catatan materi, dan AI ringkasan belajar peserta Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI.",
}

export default function Batch4MaterialsPage() {
  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Switcher notice to Batch 3 */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Katalog Modul: <strong className="text-indigo-600 dark:text-indigo-400">Agrasena Batch 4</strong> • Kurikulum 120 JP
          </span>
          <Link
            href="/materials"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <span>Lihat Modul Batch 3</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Resource Hub with Batch 4 Dataset */}
        <ResourceHub
          defaultDataset={DEFAULT_BATCH4_MATERIALS}
          batchTitle="Agrasena Batch 4"
          batchSlug="batch-4"
        />

      </div>
    </PublicShell>
  )
}
