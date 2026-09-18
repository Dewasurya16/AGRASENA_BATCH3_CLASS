import { PublicShell } from "@/components/public/public-shell"
import { LiveSessionBannerB4 } from "@/components/public/batch4/live-session-banner-b4"
import { SchedulesListB4 } from "@/components/public/batch4/schedules-list-b4"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Jadwal 35 Hari Agrasena Batch 4 - Diklat Prakom Kejaksaan RI",
  description: "Kalender 35 hari roadmap, jadwal kuliah virtual Zoom, rincian JP, dan narasumber Diklat Fungsional Pranata Komputer Keahlian Agrasena Batch 4 Kejaksaan RI 2026.",
}

export default function Batch4SchedulesPage() {
  return (
    <PublicShell>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Switcher Back to Batch 3 Header Pill */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Jadwal Khusus: <strong className="text-emerald-600 dark:text-emerald-400">Agrasena Batch 4</strong>
          </span>
          <Link
            href="/schedules?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <span>Buka Jadwal Batch 3</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Live Zoom Banner Batch 4 */}
        <LiveSessionBannerB4 />

        {/* 35 Days Schedule List Batch 4 */}
        <SchedulesListB4 />

      </div>
    </PublicShell>
  )
}
