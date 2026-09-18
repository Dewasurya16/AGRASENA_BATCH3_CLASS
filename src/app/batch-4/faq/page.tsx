import { PublicShell } from "@/components/public/public-shell"
import { FaqSection } from "@/components/public/faq-section"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Pusat Bantuan & FAQ Diklat Prakom Batch 4 | Kejaksaan RI",
  description: "Pertanyaan umum seputar jadwal, LMS, modul PDF, kuis MOOC, dan layanan pelaporan kendala/saran ke admin kelas Batch 4.",
}

export default function Batch4FaqPage() {
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
                Pusat Bantuan & FAQ: Agrasena Batch 4.
              </span>{" "}
              <span className="text-indigo-800/80 dark:text-indigo-300/80">
                Panduan kendala teknis dan formulir pelaporan admin kelas Batch 4.
              </span>
            </div>
          </div>
          <Link
            href="/faq?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka FAQ Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <FaqSection />
      </div>
    </PublicShell>
  )
}
