export interface MaintenanceConfig {
  enabled: boolean
  title: string
  message: string
  estimatedEnd: string | null // ISO 8601 string e.g. "2026-09-19T06:00:00.000Z"
  emergencyContact: string
  updatedAt: string
  updatedBy: string
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: false,
  title: "Portal Sedang Dalam Pemeliharaan Sistem",
  message:
    "Mohon maaf atas ketidaknyamanannya. Portal Web Kelas Agrasena Diklat Fungsional Pranata Komputer Kejaksaan RI sedang menjalani pemeliharaan infrastruktur rutin dan pembaruan materi kurikulum. Layanan akan segera kembali aktif.",
  estimatedEnd: null,
  emergencyContact: "6281234567890",
  updatedAt: new Date().toISOString(),
  updatedBy: "Sistem Badiklat Kejaksaan RI",
}

export const MAINTENANCE_CONFIG_DB_KEY = "maintenance_config"
export const MAINTENANCE_COOKIE_NAME = "prakom_maint_active"
