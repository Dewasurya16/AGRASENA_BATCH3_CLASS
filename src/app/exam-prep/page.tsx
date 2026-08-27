import { PublicShell } from "@/components/public/public-shell"
import { ExamPrepHub } from "@/components/public/exam-prep-hub"

export const metadata = {
  title: "Countdown & Checklist Ujian Evaluasi / Seminar — Diklat Prakom Batch 3 Kejaksaan RI",
  description: "Hitung mundur hari H Ujian Komprehensif MOOC, pengumpulan makalah, dan jadwal sidang seminar evaluasi akhir dengan 10 checklist kelulusan.",
}

export default function ExamPrepPage() {
  return (
    <PublicShell>
      <ExamPrepHub />
    </PublicShell>
  )
}
