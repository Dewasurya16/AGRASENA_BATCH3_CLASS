import { PublicShell } from "@/components/public/public-shell"
import { CheatsheetHub } from "@/components/public/cheatsheet-hub"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quick Cheat Sheet & Ringkasan Materi 120 JP | Diklat Prakom Batch 3",
  description: "Rangkuman konsep kunci SPBE, query SQL, otomasi Linux backup, keamanan siber, dan tabel Angka Kredit Prakom tanpa login.",
}

export default function CheatsheetPage() {
  return (
    <PublicShell>
      <CheatsheetHub />
    </PublicShell>
  )
}
