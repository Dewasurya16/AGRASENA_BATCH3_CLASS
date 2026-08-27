import { PublicShell } from "@/components/public/public-shell"
import { DiscussionsHub } from "@/components/public/discussions-hub"

export const metadata = {
  title: "Papan Diskusi & Tanya Jawab Komunitas — Diklat Prakom Batch 3 Kejaksaan RI",
  description: "Forum kolaborasi dan ruang tanya-jawab seputar tugas harian LMS, konfigurasi server, database, dan persiapan seminar akhir peserta diklat.",
}

export default function DiscussionsPage() {
  return (
    <PublicShell>
      <DiscussionsHub />
    </PublicShell>
  )
}
