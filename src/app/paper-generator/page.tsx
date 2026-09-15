import { PublicShell } from "@/components/public/public-shell"
import { PaperGeneratorHub } from "@/components/public/paper-generator-hub"

export const metadata = {
  title: "AI Generator Laporan Laboratorium Prakom — Pelatihan Fungsional Kejaksaan RI & BPS",
  description: "Asisten penyusunan Laporan Laboratorium Pranata Komputer Kategori Keahlian (Cover Luar/Dalam, Lembar Pengesahan, Bab I s.d. IV, Pemetaan Butir BPS No. 2/2021, Gantt Chart, dan Formulir Bukti Dukung).",
}

export default function PaperGeneratorPage() {
  return (
    <PublicShell>
      <PaperGeneratorHub />
    </PublicShell>
  )
}
