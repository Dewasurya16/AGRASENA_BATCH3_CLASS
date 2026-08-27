import { PublicShell } from "@/components/public/public-shell"
import { PaperGeneratorHub } from "@/components/public/paper-generator-hub"

export const metadata = {
  title: "AI Generator Makalah Seminar Akhir — Diklat Prakom Batch 3 Kejaksaan RI",
  description: "Asisten penyusunan proposal makalah proyek akhir dan rencana aksi inovasi teknologi informasi satker Kejaksaan RI berstandar Pusdiklat.",
}

export default function PaperGeneratorPage() {
  return (
    <PublicShell>
      <PaperGeneratorHub />
    </PublicShell>
  )
}
