import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import {
  DEFAULT_MAINTENANCE_CONFIG,
  MAINTENANCE_CONFIG_DB_KEY,
  MaintenanceConfig,
} from "@/lib/maintenance"
import { MaintenanceView } from "@/components/public/maintenance-view"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Pemeliharaan Sistem | Diklat Prakom Kejaksaan RI",
  description:
    "Portal Web Kelas Agrasena Diklat Fungsional Prakom Kejaksaan RI sedang dalam pemeliharaan sistem berkala.",
  robots: {
    index: false,
    follow: false,
  },
}

interface MaintenancePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const resolvedSearchParams = await searchParams
  const isPreview = resolvedSearchParams.preview === "true" || resolvedSearchParams.preview === "1"

  let config: MaintenanceConfig = { ...DEFAULT_MAINTENANCE_CONFIG }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from("wa_bot_config")
        .select("value")
        .eq("key", MAINTENANCE_CONFIG_DB_KEY)
        .maybeSingle()

      if (data && data.value) {
        const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value
        config = {
          enabled: Boolean(val.enabled),
          title: String(val.title || DEFAULT_MAINTENANCE_CONFIG.title),
          message: String(val.message || DEFAULT_MAINTENANCE_CONFIG.message),
          estimatedEnd: val.estimatedEnd ? String(val.estimatedEnd) : null,
          emergencyContact: String(val.emergencyContact || DEFAULT_MAINTENANCE_CONFIG.emergencyContact),
          updatedAt: String(val.updatedAt || new Date().toISOString()),
          updatedBy: String(val.updatedBy || "Sistem Badiklat Kejaksaan RI"),
        }
      }
    } catch {
      // Fallback to default
    }
  }

  // Jika maintenance TIDAK aktif dan BUKAN dalam mode pratinjau admin, alihkan ke beranda
  if (!config.enabled && !isPreview) {
    redirect("/")
  }

  const { cookies } = await import("next/headers")
  const { verifyAdminSessionToken } = await import("@/lib/security")
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get("prakom_admin_session")?.value
  const isAdmin = Boolean(verifyAdminSessionToken(adminCookie))

  return <MaintenanceView config={config} isPreview={isPreview} isAdmin={isAdmin} />
}
