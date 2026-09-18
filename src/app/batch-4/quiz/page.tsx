import { PublicShell } from "@/components/public/public-shell"
import { QuizPlayer } from "@/components/public/quiz-player"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Simulasi Ujian MOOC & Latihan Kuis — Prakom Batch 4",
  description: "Latihan soal interaktif pilihan ganda seputar kurikulum Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI",
}

export default function Batch4QuizPage() {
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
                Simulasi Ujian MOOC & Kuis: Agrasena Batch 4.
              </span>{" "}
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                Latihan soal pilihan ganda SPBE, database, dan materi fungsional Prakom Keahlian.
              </span>
            </div>
          </div>
          <Link
            href="/quiz?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Kuis Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <QuizPlayer />
      </div>
    </PublicShell>
  )
}
