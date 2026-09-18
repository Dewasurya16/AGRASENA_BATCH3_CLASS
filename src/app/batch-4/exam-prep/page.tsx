import { PublicShell } from "@/components/public/public-shell"
import { ExamPrepHub } from "@/components/public/exam-prep-hub"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Countdown & Checklist Ujian Evaluasi / Seminar — Diklat Prakom Batch 4 Kejaksaan RI",
  description: "Hitung mundur hari H Ujian Komprehensif MOOC, pengumpulan makalah, dan jadwal sidang seminar evaluasi akhir peserta Diklat Fungsional Prakom Batch 4.",
}

export default function Batch4ExamPrepPage() {
  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Switcher notice */}
        <div className="rounded-[16px] bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-black shrink-0">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-indigo-950 dark:text-indigo-200">
                Persiapan Ujian & Seminar: Agrasena Batch 4.
              </span>{" "}
              <span className="text-indigo-800/80 dark:text-indigo-300/80">
                Hitung mundur evaluasi akhir dan 10 checklist kelulusan peserta.
              </span>
            </div>
          </div>
          <Link
            href="/exam-prep?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Ujian Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ExamPrepHub />
      </div>
    </PublicShell>
  )
}
