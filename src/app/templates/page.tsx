import { PublicShell } from "@/components/public/public-shell"
import { TemplatesHub } from "@/components/public/templates-hub"

export const metadata = {
  title: "Pusat Download Template Dokumen TIK & DUPAK — Diklat Prakom Batch 3 Kejaksaan RI",
  description: "Download format resmi SPT Pemeliharaan TI, Formulir DUPAK & SPMK, SOP Ruang Server, Berita Acara Kerusakan TIK, dan Format Makalah Seminar.",
}

export default function TemplatesPage() {
  return (
    <PublicShell>
      <TemplatesHub />
    </PublicShell>
  )
}
