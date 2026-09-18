import { createClient } from "@/lib/supabase/server"
import { PublicShell } from "@/components/public/public-shell"
import { ShowcaseGallery } from "@/components/public/showcase-gallery"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Galeri Karya & Proyek Inovasi TI — Diklat Prakom Batch 4",
  description: "Portofolio dan showcase karya teknologi informasi, implementasi lab satker, dan prototipe aplikasi peserta Diklat Fungsional Prakom Batch 4.",
}

export default async function Batch4ShowcasePage() {
  let showcases: any[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("showcases")
        .select("*")
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        showcases = data.filter((s: any) =>
          (s.title && s.title.toLowerCase().includes("batch 4")) ||
          s.batch === 4 ||
          s.batch === "batch-4"
        )
      }
    } catch {
      // Fallback
    }
  }

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
                Galeri Karya & Inovasi: Agrasena Batch 4.
              </span>{" "}
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                Karya proyek perubahan dan laporan laboratorium satuan kerja angkatan Batch 4.
              </span>
            </div>
          </div>
          <Link
            href="/showcase?batch=batch-3"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
          >
            <span>Buka Karya Batch 3</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ShowcaseGallery showcases={showcases} />
      </div>
    </PublicShell>
  )
}
