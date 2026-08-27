import { PublicShell } from "@/components/public/public-shell"
import { FaqSection } from "@/components/public/faq-section"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pusat Bantuan & FAQ Diklat Prakom Batch 3 | Kejaksaan RI",
  description: "Pertanyaan umum seputar jadwal, LMS, modul PDF, kuis MOOC, dan layanan pelaporan kendala/saran ke admin kelas.",
}

export default function FaqPage() {
  return (
    <PublicShell>
      <FaqSection />
    </PublicShell>
  )
}
