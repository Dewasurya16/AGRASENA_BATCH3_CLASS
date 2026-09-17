import { PublicShell } from "@/components/public/public-shell"
import { SuratPerintahViewer } from "@/components/public/surat-perintah-viewer"

export const metadata = {
  title: "Surat Perintah Penunjukan Admin Agrasena - Kejaksaan RI",
  description: "Surat Perintah Tugas resmi penunjukan Administrator Portal Kelas Diklat Fungsional Pranata Komputer Keahlian Agrasena Kejaksaan RI: Risky Andini, S.Kom., Feggy Ripani, S.Kom., dan Kurnia Ramadani, S.Kom.",
}

export default function SuratPerintahAdminPage() {
  return (
    <PublicShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <SuratPerintahViewer />
      </div>
    </PublicShell>
  )
}
