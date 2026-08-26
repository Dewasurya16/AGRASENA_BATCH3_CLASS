import { PublicShell } from "@/components/public/public-shell"
import { QuizPlayer } from "@/components/public/quiz-player"

export const metadata = {
  title: "Simulasi Ujian MOOC & Latihan Kuis — Prakom Batch 3",
  description: "Latihan soal interaktif pilihan ganda seputar kurikulum Diklat Fungsional Pranata Komputer Kejaksaan RI",
}

export default function QuizPage() {
  return (
    <PublicShell>
      <QuizPlayer />
    </PublicShell>
  )
}
